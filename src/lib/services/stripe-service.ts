// src/lib/services/stripe-service.ts
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
        trial_period_days: 14, // Add 14-day trial period
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
  
  // New method to get trial status details
  public async getTrialStatus() {
    const subscription = await this.getSubscription();
    
    if (!subscription || subscription.status !== 'trialing') {
      return null;
    }
    
    const now = new Date();
    const trialEnd = new Date(subscription.current_period_end * 1000);
    const totalTrialDays = 14;
    const daysRemaining = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const daysUsed = totalTrialDays - daysRemaining;
    
    return {
      isTrialing: true,
      trialEnd: subscription.current_period_end,
      trialEndDate: trialEnd,
      daysRemaining,
      daysUsed,
      totalDays: totalTrialDays,
      percentComplete: Math.min(100, Math.round((daysUsed / totalTrialDays) * 100))
    };
  }
  
  // New method to cancel subscription
  public async cancelSubscription() {
    const { data, error } = await supabase.functions.invoke('stripe-cancel-subscription', {
      body: {},
    });
    
    if (error) throw error;
    
    return data;
  }
}

const stripeService = new StripeService();

export default stripeService;
