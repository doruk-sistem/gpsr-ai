// supabase/functions/stripe-checkout/index.ts
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

  // For 204 No Content, don't include Content-Type or body
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

    const {
      price_id,
      success_url,
      cancel_url,
      mode,
      trial_period_days: initialTrialDays = 14,
      billing_cycle_anchor, // Optional for subscriptions that should start at a specific time
      promotion_code, // Optional promotion code
    } = await req.json();

    // Use let so we can modify trial period days based on eligibility
    let trial_period_days = initialTrialDays;

    const error = validateParameters(
      { price_id, success_url, cancel_url, mode },
      {
        cancel_url: "string",
        price_id: "string",
        success_url: "string",
        mode: { values: ["payment", "subscription"] },
      }
    );

    if (error) {
      return corsResponse({ error }, 400);
    }

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

    // Check if user is eligible for trial
    if (mode === "subscription" && trial_period_days > 0) {
      const { data: isEligible } = await supabase.rpc("is_trial_eligible", {
        _user_id: user.id,
      });

      if (isEligible === false) {
        console.log(
          `User ${user.id} is not eligible for a trial anymore, creating subscription without trial`
        );
        // Set trial days to 0 if user is not eligible
        // This prevents users from getting multiple trials
        trial_period_days = 0;
      }
    }

    const { data: customer, error: getCustomerError } = await supabase
      .from("stripe_customers")
      .select("customer_id")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .maybeSingle();

    if (getCustomerError) {
      console.error(
        "Failed to fetch customer information from the database",
        getCustomerError
      );

      return corsResponse(
        { error: "Failed to fetch customer information" },
        500
      );
    }

    let customerId;

    /**
     * In case we don't have a mapping yet, the customer does not exist and we need to create one.
     */
    if (!customer || !customer.customer_id) {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });

      console.log(
        `Created new Stripe customer ${newCustomer.id} for user ${user.id}`
      );

      const { error: createCustomerError } = await supabase
        .from("stripe_customers")
        .insert({
          user_id: user.id,
          customer_id: newCustomer.id,
        });

      if (createCustomerError) {
        console.error(
          "Failed to save customer information in the database",
          createCustomerError
        );

        // Try to clean up both the Stripe customer and subscription record
        try {
          await stripe.customers.del(newCustomer.id);
          await supabase
            .from("stripe_subscriptions")
            .delete()
            .eq("customer_id", newCustomer.id);
        } catch (deleteError) {
          console.error(
            "Failed to clean up after customer mapping error:",
            deleteError
          );
        }

        return corsResponse(
          { error: "Failed to create customer mapping" },
          500
        );
      }

      if (mode === "subscription") {
        const { error: createSubscriptionError } = await supabase
          .from("stripe_subscriptions")
          .insert({
            customer_id: newCustomer.id,
            status: "not_started",
            is_trial_used: false, // Initially set to false, will be updated in the subscription webhook
          });

        if (createSubscriptionError) {
          console.error(
            "Failed to save subscription in the database",
            createSubscriptionError
          );

          // Try to clean up the Stripe customer since we couldn't create the subscription
          try {
            await stripe.customers.del(newCustomer.id);
          } catch (deleteError) {
            console.error(
              "Failed to delete Stripe customer after subscription creation error:",
              deleteError
            );
          }

          return corsResponse(
            { error: "Unable to save the subscription in the database" },
            500
          );
        }
      }

      customerId = newCustomer.id;

      console.log(
        `Successfully set up new customer ${customerId} with subscription record`
      );
    } else {
      customerId = customer.customer_id;

      if (mode === "subscription") {
        // Verify subscription exists for existing customer
        const { data: subscription, error: getSubscriptionError } =
          await supabase
            .from("stripe_subscriptions")
            .select("status, is_trial_used")
            .eq("customer_id", customerId)
            .maybeSingle();

        if (getSubscriptionError) {
          console.error(
            "Failed to fetch subscription information from the database",
            getSubscriptionError
          );

          return corsResponse(
            { error: "Failed to fetch subscription information" },
            500
          );
        }

        if (!subscription) {
          // Create subscription record for existing customer if missing
          const { error: createSubscriptionError } = await supabase
            .from("stripe_subscriptions")
            .insert({
              customer_id: customerId,
              status: "not_started",
              is_trial_used: false,
            });

          if (createSubscriptionError) {
            console.error(
              "Failed to create subscription record for existing customer",
              createSubscriptionError
            );

            return corsResponse(
              {
                error:
                  "Failed to create subscription record for existing customer",
              },
              500
            );
          }
        }
        // Update is_trial_used if we're starting a new trial subscription
        else if (trial_period_days > 0 && !subscription.is_trial_used) {
          // Bu noktada is_trial_used'ı güncelleme, webhook'ta güncellenecek
          console.log(
            `Keeping is_trial_used as false for ${customerId} until subscription confirmation`
          );
        }
      }
    }

    // Create additional parameters for subscription mode
    const additionalParams =
      mode === "subscription"
        ? {
            subscription_data: {
              ...(trial_period_days > 0 ? { trial_period_days } : {}),
              metadata: {
                user_id: user.id,
              },
              ...(billing_cycle_anchor ? { billing_cycle_anchor } : {}),
            },
            payment_method_collection: "always", // Always collect payment method even during trial
            payment_method_types: ["card"],
          }
        : {
            payment_method_types: ["card"],
          };

    // Add promotion code support if provided
    const promotionParams = promotion_code
      ? { allow_promotion_codes: true }
      : {};

    // create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode,
      success_url,
      cancel_url,
      // If trial_period_days is 0, require immediate payment
      payment_intent_data:
        mode === "payment" ? { setup_future_usage: "off_session" } : undefined,
      ...additionalParams,
      ...promotionParams,
    });

    console.log(
      `Created checkout session ${session.id} for customer ${customerId}`
    );

    // Record trial start attempt in database for tracking
    if (mode === "subscription" && trial_period_days > 0) {
      try {
        // Record that we started a trial
        await supabase.from("trial_emails").insert({
          user_id: user.id,
          email_type: "trial_started",
          metadata: { session_id: session.id },
        });
      } catch (recordError) {
        // Don't fail the request if we can't record trial start
        console.error("Failed to record trial start:", recordError);
      }
    }

    return corsResponse({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error(`Checkout error: ${error.message}`);
    return corsResponse({ error: error.message }, 500);
  }
});

type ExpectedType = "string" | { values: string[] };
type Expectations<T> = { [K in keyof T]: ExpectedType };

function validateParameters<T extends Record<string, any>>(
  values: T,
  expected: Expectations<T>
): string | undefined {
  for (const parameter in values) {
    const expectation = expected[parameter];
    const value = values[parameter];

    if (expectation === "string") {
      if (value == null) {
        return `Missing required parameter ${parameter}`;
      }
      if (typeof value !== "string") {
        return `Expected parameter ${parameter} to be a string got ${JSON.stringify(
          value
        )}`;
      }
    } else {
      if (!expectation.values.includes(value)) {
        return `Expected parameter ${parameter} to be one of ${expectation.values.join(
          ", "
        )}`;
      }
    }
  }

  return undefined;
}
