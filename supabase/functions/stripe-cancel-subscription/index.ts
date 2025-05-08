// supabase/functions/stripe-cancel-subscription/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);
const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY")!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: "Bolt Integration",
    version: "1.0.0",
  },
});

// Helper function to create responses with CORS headers
function corsResponse(body: string | object | null, status = 200) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "*",
  };

  if (status === 204) {
    return new Response(null, { status, headers });
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return corsResponse({}, 204);
    }

    if (req.method !== "POST") {
      return corsResponse({ error: "Method not allowed" }, 405);
    }

    // Parse request body
    const { cancel_immediately = false } = await req.json();

    // Get user from authentication
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser(token);

    if (getUserError) {
      return corsResponse({ error: "Failed to authenticate user" }, 401);
    }

    if (!user) {
      return corsResponse({ error: "User not found" }, 404);
    }

    // Get the customer ID for the user
    const { data: customer, error: getCustomerError } = await supabase
      .from("stripe_customers")
      .select("customer_id")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .maybeSingle();

    if (getCustomerError) {
      return corsResponse(
        { error: "Failed to fetch customer information" },
        500
      );
    }

    if (!customer || !customer.customer_id) {
      return corsResponse(
        { error: "No Stripe customer found for this user" },
        404
      );
    }

    // Get the subscription for this customer
    const { data: subscriptionData, error: getSubscriptionError } =
      await supabase
        .from("stripe_subscriptions")
        .select("subscription_id, status, trial_end")
        .eq("customer_id", customer.customer_id)
        .maybeSingle();

    if (getSubscriptionError) {
      return corsResponse(
        { error: "Failed to fetch subscription information" },
        500
      );
    }

    if (!subscriptionData || !subscriptionData.subscription_id) {
      return corsResponse({ error: "No active subscription found" }, 404);
    }

    let cancelledSubscription;
    const isInTrialPeriod = subscriptionData.status === "trialing";

    // Handle cancellation based on whether it's a trial or not
    if (cancel_immediately || isInTrialPeriod) {
      // If in trial period or requested immediate cancellation, cancel immediately
      cancelledSubscription = await stripe.subscriptions.cancel(
        subscriptionData.subscription_id
      );

      console.log(
        `Subscription ${subscriptionData.subscription_id} cancelled immediately for customer ${customer.customer_id}`
      );
    } else {
      // Otherwise, cancel at period end
      cancelledSubscription = await stripe.subscriptions.update(
        subscriptionData.subscription_id,
        { cancel_at_period_end: true }
      );

      console.log(
        `Subscription ${subscriptionData.subscription_id} scheduled for cancellation at period end for customer ${customer.customer_id}`
      );
    }

    // Update the subscription in the database
    const updateData =
      isInTrialPeriod || cancel_immediately
        ? { status: "canceled" }
        : { cancel_at_period_end: true };

    await supabase
      .from("stripe_subscriptions")
      .update(updateData)
      .eq("customer_id", customer.customer_id);

    // Send a notification email
    try {
      // Get user email
      const userData = await supabase.auth.admin.getUserById(user.id);
      const userEmail = userData.data.user?.email;

      if (userEmail) {
        // In a real implementation, you would send an actual email here
        console.log(`Would send cancellation email to ${userEmail}`);

        // Email status depends on cancellation type
        const emailType = isInTrialPeriod
          ? "trial_canceled"
          : "subscription_canceled";

        // Record email in database
        await supabase.from("trial_emails").insert({
          user_id: user.id,
          email_type: emailType,
          metadata: {
            subscription_id: subscriptionData.subscription_id,
            immediate_cancellation: cancel_immediately || isInTrialPeriod,
          },
        });
      }
    } catch (emailError) {
      console.error("Failed to send cancellation email:", emailError);
      // Continue processing even if email fails
    }

    const responseMessage =
      isInTrialPeriod || cancel_immediately
        ? "Your subscription has been cancelled"
        : "Your subscription has been scheduled for cancellation at the end of the billing period";

    return corsResponse({
      success: true,
      message: responseMessage,
      is_immediate: isInTrialPeriod || cancel_immediately,
    });
  } catch (error: any) {
    console.error(`Cancel subscription error: ${error.message}`);
    return corsResponse({ error: error.message }, 500);
  }
});
