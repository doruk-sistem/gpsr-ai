import { supabase } from "@/lib/supabase/client";
import { STRIPE_PRODUCTS } from "@/lib/stripe-config";

class StripeService {
  public async createCheckoutSession(priceId: string, mode: 'payment' | 'subscription') {
    const { data: { session_url }, error } = await supabase.functions.invoke('stripe-checkout', {
      body: {
        price_id: priceId,
        mode,
        success_url: `${window.location.origin}/dashboard/billing/success`,
        cancel_url: `${window.location.origin}/dashboard/billing`,
      },
    });

    if (error) throw error;

    return session_url;
  }

  public async getSubscription() {
    const { data, error } = await supabase
      .from('stripe_user_subscriptions')
      .select('*')
      .maybeSingle();

    if (error) throw error;

    return data;
  }

  public async getOrders() {
    const { data, error } = await supabase
      .from('stripe_user_orders')
      .select('*')
      .order('order_date', { ascending: false });

    if (error) throw error;

    return data;
  }

  public async getActivePlan() {
    const subscription = await this.getSubscription();

    if (!subscription?.price_id) return null;

    const plan = Object.entries(STRIPE_PRODUCTS).find(
      ([_, product]) => product.priceId === subscription.price_id
    );

    return plan ? plan[0] : null;
  }
}

const stripeService = new StripeService();

export default stripeService;