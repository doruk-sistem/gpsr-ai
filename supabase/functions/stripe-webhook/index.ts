// supabase/functions/stripe-webhook/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY")!;
const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: "Bolt Integration",
    version: "1.0.0",
  },
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  try {
    // Handle OPTIONS request for CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }

    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // get the signature from the header
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("No stripe-signature found", { status: 401 });
    }

    // get the raw body
    const body = await req.text();

    // verify the webhook signature
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        stripeWebhookSecret
      );
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(
        `Webhook signature verification failed: ${error.message}`,
        { status: 400 }
      );
    }

    EdgeRuntime.waitUntil(handleEvent(event));

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function handleEvent(event: Stripe.Event) {
  const stripeData = event?.data?.object ?? {};

  if (!stripeData) {
    return;
  }

  if (!("customer" in stripeData)) {
    return;
  }

  // for one time payments, we only listen for the checkout.session.completed event
  if (
    event.type === "payment_intent.succeeded" &&
    event.data.object.invoice === null
  ) {
    return;
  }

  const { customer: customerId } = stripeData;

  if (!customerId || typeof customerId !== "string") {
    console.error(`No customer received on event: ${JSON.stringify(event)}`);
  } else {
    let isSubscription = true;

    if (event.type === "checkout.session.completed") {
      const { mode } = stripeData as Stripe.Checkout.Session;

      isSubscription = mode === "subscription";

      console.info(
        `Processing ${
          isSubscription ? "subscription" : "one-time payment"
        } checkout session`
      );
    }

    const { mode, payment_status } = stripeData as Stripe.Checkout.Session;

    // Event indicating that the trial period is about to end
    if (event.type === "customer.subscription.trial_will_end") {
      const subscription = stripeData as Stripe.Subscription;

      console.info(`Trial ending soon for subscription: ${subscription.id}`);

      // Get user information
      const { data: customerData } = await supabase
        .from("stripe_customers")
        .select("user_id")
        .eq("customer_id", customerId)
        .single();

      if (customerData?.user_id) {
        // Check if user has a payment method
        const paymentMethods = await stripe.paymentMethods.list({
          customer: customerId,
          type: "card",
        });

        // Send final reminder email
        await sendTrialEmail(
          customerData.user_id,
          "trial_reminder_48hours",
          subscription
        );

        // Send special warning if no payment method exists
        if (paymentMethods.data.length === 0) {
          // Send payment method reminder email
          try {
            // In a real application, you would send an actual email here
            console.log(
              `Payment method reminder email for user ${customerData.user_id}`
            );

            // Add email record to database
            await supabase.from("trial_emails").insert({
              user_id: customerData.user_id,
              email_type: "payment_method_needed",
              metadata: { subscription_id: subscription.id },
            });
          } catch (error) {
            console.error(
              "Failed to send payment method reminder email:",
              error
            );
          }
        }
      }
    }

    // Trial-related event handling
    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      const subscription = stripeData as Stripe.Subscription;

      // Check if this is a trial subscription
      if (subscription.status === "trialing") {
        console.info(
          `Processing trial subscription for customer: ${customerId}`
        );

        // Get user ID from customer data
        const { data: customerData } = await supabase
          .from("stripe_customers")
          .select("user_id")
          .eq("customer_id", customerId)
          .single();

        if (customerData?.user_id) {
          // Update trial_start and trial_end in our database
          await supabase
            .from("stripe_subscriptions")
            .update({
              trial_start: subscription.trial_start,
              trial_end: subscription.trial_end,
              is_trial_used: true,
            })
            .eq("customer_id", customerId);

          // Send trial start notification email
          await sendTrialEmail(
            customerData.user_id,
            "trial_started",
            subscription
          );

          // Calculate trial end date for reminders
          const trialEnd = new Date(subscription.trial_end! * 1000);
          const now = new Date();
          const daysToTrialEnd = Math.ceil(
            (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );

          // Schedule reminders based on days remaining
          if (daysToTrialEnd <= 7) {
            // Send 7-day reminder
            await sendTrialEmail(
              customerData.user_id,
              "trial_reminder_7days",
              subscription
            );
          }

          if (daysToTrialEnd <= 2) {
            // Send 48-hour reminder
            await sendTrialEmail(
              customerData.user_id,
              "trial_reminder_48hours",
              subscription
            );
          }
        }
      } else if (subscription.status === "active") {
        await supabase
          .from("stripe_subscriptions")
          .update({
            is_trial_used: true,
          })
          .eq("customer_id", customerId);
      }

      // Handle subscription status changes
      if (event.type === "customer.subscription.updated") {
        const prevAttr = (event.data.previous_attributes as any)?.status;

        // If subscription was previously trialing and is now active, send conversion email
        if (prevAttr === "trialing" && subscription.status === "active") {
          const { data: customerData } = await supabase
            .from("stripe_customers")
            .select("user_id")
            .eq("customer_id", customerId)
            .single();

          if (customerData?.user_id) {
            await sendTrialEmail(
              customerData.user_id,
              "trial_converted",
              subscription
            );

            // Record successful automatic payment
            console.log(
              `Trial successfully converted to paid subscription for user ${customerData.user_id}`
            );
          }
        }

        // If subscription canceled, send cancellation email
        if (
          prevAttr &&
          prevAttr !== "canceled" &&
          subscription.status === "canceled"
        ) {
          const { data: customerData } = await supabase
            .from("stripe_customers")
            .select("user_id")
            .eq("customer_id", customerId)
            .single();

          if (customerData?.user_id) {
            await sendTrialEmail(
              customerData.user_id,
              "trial_canceled",
              subscription
            );
          }
        }
      }
    }

    if (isSubscription) {
      console.info(`Starting subscription sync for customer: ${customerId}`);
      await syncCustomerFromStripe(customerId);
    } else if (mode === "payment" && payment_status === "paid") {
      try {
        // Extract the necessary information from the session
        const {
          id: checkout_session_id,
          payment_intent,
          amount_subtotal,
          amount_total,
          currency,
        } = stripeData as Stripe.Checkout.Session;

        // Insert the order into the stripe_orders table
        const { error: orderError } = await supabase
          .from("stripe_orders")
          .insert({
            checkout_session_id,
            payment_intent_id: payment_intent,
            customer_id: customerId,
            amount_subtotal,
            amount_total,
            currency,
            payment_status,
            status: "completed", // assuming we want to mark it as completed since payment is successful
          });

        if (orderError) {
          console.error("Error inserting order:", orderError);
          return;
        }
        console.info(
          `Successfully processed one-time payment for session: ${checkout_session_id}`
        );
      } catch (error) {
        console.error("Error processing one-time payment:", error);
      }
    }
  }
}

// Helper function to send trial-related emails
async function sendTrialEmail(
  userId: string,
  emailType: string,
  subscription: Stripe.Subscription
) {
  try {
    // Get user email
    const { data: userData } = await supabase.auth.admin.getUserById(userId);

    if (!userData?.user?.email) {
      console.error(`Could not find email for user ${userId}`);
      return;
    }

    const email = userData.user.email;
    const trialEndDate = new Date(
      subscription.trial_end! * 1000
    ).toLocaleDateString("en-GB");

    let emailSubject = "";
    let emailContent = "";

    switch (emailType) {
      case "trial_started":
        emailSubject = "Welcome to Your 14-Day Free Trial!";
        emailContent = `Your trial has started and will end on ${trialEndDate}. Enjoy full access to all features!`;
        break;
      case "trial_reminder_7days":
        emailSubject = "7 Days Left in Your Free Trial";
        emailContent = `Your trial will end on ${trialEndDate}. Your payment method will be automatically charged after the trial ends. Upgrade now to continue enjoying our services.`;
        break;
      case "trial_reminder_48hours":
        emailSubject = "Your Trial Ends in 48 Hours";
        emailContent = `Your trial will end on ${trialEndDate}. Please ensure your payment method is up to date to avoid any service interruptions.`;
        break;
      case "trial_ended":
        emailSubject = "Your Free Trial Has Ended";
        emailContent =
          "Your free trial period has ended. Your subscription is now active and your payment method has been charged according to your plan.";
        break;
      case "trial_converted":
        emailSubject = "Thank You for Subscribing!";
        emailContent =
          "Your subscription is now active. Thank you for choosing our service!";
        break;
      case "trial_canceled":
        emailSubject = "Your Subscription Has Been Canceled";
        emailContent =
          "Your subscription has been canceled. We're sorry to see you go. You can resubscribe anytime.";
        break;
      case "payment_method_needed":
        emailSubject = "Action Required: Add Payment Method Before Trial Ends";
        emailContent = `Your trial ends on ${trialEndDate} and we currently don't have a valid payment method on file. Please add a payment method to continue using our service after your trial ends.`;
        break;
    }

    // In a real implementation, you would send an actual email here
    // For now, we'll just log it
    console.log(
      `Would send email to ${email}: ${emailSubject} - ${emailContent}`
    );

    // Record email in database for tracking
    await supabase.from("trial_emails").insert({
      user_id: userId,
      email_type: emailType,
      sent_at: new Date().toISOString(),
      metadata: {
        subscription_id: subscription.id,
        email_subject: emailSubject,
      },
    });
  } catch (error) {
    console.error("Error sending trial email:", error);
  }
}

// Sync customer data from Stripe
// based on the excellent https://github.com/t3dotgg/stripe-recommendations
async function syncCustomerFromStripe(customerId: string) {
  try {
    // fetch latest subscription data from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: "all",
      expand: ["data.default_payment_method", "data.items.data.price.product"],
    });

    if (subscriptions.data.length === 0) {
      console.info(`No active subscriptions found for customer: ${customerId}`);
      const { error: noSubError } = await supabase
        .from("stripe_subscriptions")
        .upsert(
          {
            customer_id: customerId,
            status: "not_started",
            product_limit: 0, // Set default limit to 0 for no subscription
          },
          {
            onConflict: "customer_id",
          }
        );

      if (noSubError) {
        console.error("Error updating subscription status:", noSubError);
        throw new Error("Failed to update subscription status in database");
      }

      return;
    }

    // assumes that a customer can only have a single subscription
    const subscription = subscriptions.data[0];
    const price = subscription.items.data[0].price;
    const product = price.product as Stripe.Product;

    // Get product limit from metadata
    const productLimit = product.metadata?.product_limit
      ? parseInt(product.metadata.product_limit, 10)
      : 0;

    // store subscription state
    const { error: subError } = await supabase
      .from("stripe_subscriptions")
      .upsert(
        {
          customer_id: customerId,
          subscription_id: subscription.id,
          price_id: price.id,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
          cancel_at_period_end: subscription.cancel_at_period_end,
          trial_start: subscription.trial_start,
          trial_end: subscription.trial_end,
          product_limit: productLimit,
          ...(subscription.default_payment_method &&
          typeof subscription.default_payment_method !== "string"
            ? {
                payment_method_brand:
                  subscription.default_payment_method.card?.brand ?? null,
                payment_method_last4:
                  subscription.default_payment_method.card?.last4 ?? null,
              }
            : {}),
          status: subscription.status,
        },
        {
          onConflict: "customer_id",
        }
      );

    if (subError) {
      console.error("Error syncing subscription:", subError);
      throw new Error("Failed to sync subscription in database");
    }
    console.info(
      `Successfully synced subscription for customer: ${customerId} with product limit: ${productLimit}`
    );
  } catch (error) {
    console.error(
      `Failed to sync subscription for customer ${customerId}:`,
      error
    );
    throw error;
  }
}
