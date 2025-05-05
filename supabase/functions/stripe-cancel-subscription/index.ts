// supabase/functions/stripe-cancel-subscription/index.ts
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.4';

const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'Bolt Integration',
    version: '1.0.0',
  },
});

// Helper function to create responses with CORS headers
function corsResponse(body: string | object | null, status = 200) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  if (status === 204) {
    return new Response(null, { status, headers });
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return corsResponse({}, 204);
    }

    if (req.method !== 'POST') {
      return corsResponse({ error: 'Method not allowed' }, 405);
    }

    // Get user from authentication
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser(token);

    if (getUserError) {
      return corsResponse({ error: 'Failed to authenticate user' }, 401);
    }

    if (!user) {
      return corsResponse({ error: 'User not found' }, 404);
    }

    // Get the customer ID for the user
    const { data: customer, error: getCustomerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .maybeSingle();

    if (getCustomerError) {
      return corsResponse({ error: 'Failed to fetch customer information' }, 500);
    }

    if (!customer || !customer.customer_id) {
      return corsResponse({ error: 'No Stripe customer found for this user' }, 404);
    }

    // Get the subscription for this customer
    const { data: subscription, error: getSubscriptionError } = await supabase
      .from('stripe_subscriptions')
      .select('subscription_id')
      .eq('customer_id', customer.customer_id)
      .maybeSingle();

    if (getSubscriptionError) {
      return corsResponse({ error: 'Failed to fetch subscription information' }, 500);
    }

    if (!subscription || !subscription.subscription_id) {
      return corsResponse({ error: 'No active subscription found' }, 404);
    }

    // Cancel the subscription at period end
    const cancelledSubscription = await stripe.subscriptions.update(
      subscription.subscription_id,
      { cancel_at_period_end: true }
    );

    // Update the subscription in the database
    await supabase.from('stripe_subscriptions').upsert(
      {
        customer_id: customer.customer_id,
        subscription_id: subscription.subscription_id,
        cancel_at_period_end: true,
      },
      { onConflict: 'customer_id' }
    );

    // Send a notification email
    try {
      // In a real implementation, you would send an actual email here
      console.log(`Would send trial cancellation email to user ${user.id}`);
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
      // Continue processing even if email fails
    }

    return corsResponse({ 
      success: true, 
      message: 'Subscription has been scheduled for cancellation at the end of the billing period'
    });
  } catch (error: any) {
    console.error(`Cancel subscription error: ${error.message}`);
    return corsResponse({ error: error.message }, 500);
  }
});
