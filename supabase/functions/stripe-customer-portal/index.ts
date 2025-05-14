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

const getCustomerId = async (authToken: string) => {
  try {
    // Validate the user's token
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(authToken);

    if (userError) throw userError;
    if (!user) throw new Error("User not found");

    // Get the customer_id from the stripe_customers table
    const { data: customerData, error: customerError } = await supabase
      .from("stripe_customers")
      .select("customer_id")
      .eq("user_id", user.id)
      .single();

    if (customerError) throw customerError;
    if (!customerData?.customer_id)
      throw new Error("Stripe customer not found");

    return customerData.customer_id;
  } catch (error) {
    console.error("Error getting customer ID:", error);
    throw error;
  }
};

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return corsResponse(null, 204);
    }

    if (req.method !== "POST") {
      return corsResponse({ error: "Method not allowed" }, 405);
    }

    // Get the request body
    const body = await req.json();
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return corsResponse({ error: "No authorization header provided" }, 401);
    }

    const token = authHeader.replace("Bearer ", "");

    // Get the customer ID
    const customerId = await getCustomerId(token);

    // Create a billing portal session
    const { url } = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url:
        body.return_url || `${req.headers.get("origin")}/dashboard/billing`,
    });

    // Return the URL
    return corsResponse({ url });
  } catch (error: any) {
    console.error(`Customer portal error: ${error.message}`);
    return corsResponse({ error: error.message }, 400);
  }
});
