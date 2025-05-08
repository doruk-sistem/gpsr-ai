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
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "*",
  };

  if (status === 204) {
    return new Response(null, {
      status,
      headers,
    });
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

    if (req.method !== "GET") {
      return corsResponse(
        {
          error: "Method not allowed",
        },
        405
      );
    }

    // Get user from authentication
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser(token);

    if (getUserError) {
      return corsResponse(
        {
          error: "Failed to authenticate user",
        },
        401
      );
    }

    if (!user) {
      return corsResponse(
        {
          error: "User not found",
        },
        404
      );
    }

    // Fetch all active products from Stripe
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    // Get all prices for each product to properly handle monthly/annual options
    const transformedProducts = await Promise.all(
      products.data.map(async (product) => {
        // Fetch all prices for this product
        const prices = await stripe.prices.list({
          product: product.id,
          active: true,
        });

        // Separate monthly and annual prices
        const monthlyPrice = prices.data.find(
          (price) => price.recurring?.interval === "month"
        );

        const annualPrice = prices.data.find(
          (price) => price.recurring?.interval === "year"
        );

        // Calculate monthly equivalent for annual price
        const annualMonthlyEquivalent = annualPrice?.unit_amount
          ? Math.round(annualPrice.unit_amount / 12) / 100
          : null;

        // Format features properly
        const features = product.features?.map((feature) => feature.name) || [];

        // Add benefits from metadata if available
        if (product.metadata?.benefits) {
          try {
            const benefits = JSON.parse(product.metadata.benefits);
            if (Array.isArray(benefits)) {
              features.push(...benefits);
            }
          } catch (e) {
            console.warn(`Failed to parse benefits for product ${product.id}`);
          }
        }

        // Add additional features from metadata
        const additionalFeatures = Object.entries(product.metadata || {})
          .filter(([key]) => key.startsWith("feature_"))
          .map(([_, value]) => value as string);

        if (additionalFeatures.length > 0) {
          features.push(...additionalFeatures);
        }

        return {
          id: product.id,
          name: product.name,
          description: product.description || "",
          features: features,
          metadata: product.metadata || {},
          prices: {
            monthly: monthlyPrice?.unit_amount
              ? monthlyPrice.unit_amount / 100
              : null,
            annual: annualPrice?.unit_amount
              ? annualPrice.unit_amount / 100
              : null,
            monthlyWithAnnualDiscount: annualMonthlyEquivalent,
          },
          priceIds: {
            monthly: monthlyPrice?.id || null,
            annual: annualPrice?.id || null,
          },
          images: product.images,
          created: product.created,
          updated: product.updated,
        };
      })
    );

    // Sort products by price (ascending)
    transformedProducts.sort((a, b) => {
      const aPrice = a.prices.monthly || 0;
      const bPrice = b.prices.monthly || 0;
      return aPrice - bPrice;
    });

    return corsResponse(transformedProducts);
  } catch (error: any) {
    console.error(`Products fetch error: ${error.message}`);
    return corsResponse(
      {
        error: error.message,
      },
      500
    );
  }
});
