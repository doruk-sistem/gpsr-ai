// src/lib/services/stripe-service.ts
import { supabase } from "@/lib/supabase/client";
import { STRIPE_PRODUCTS } from "@/lib/stripe-config";

class StripeService {
  public async createCheckoutSession(priceId: string, mode: 'payment' | 'subscription') {
    try {
      console.log("Creating checkout session for:", priceId, "mode:", mode);
      const { data: { session_url }, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: priceId,
          mode,
          trial_period_days: 14, // Add 14-day trial period
          success_url: `${window.location.origin}/dashboard/billing/success`,
          cancel_url: `${window.location.origin}/dashboard/billing`,
        },
      });

      if (error) {
        console.error("Checkout session creation error:", error);
        throw error;
      }

      return session_url;
    } catch (error) {
      console.error("Checkout session exception:", error);
      throw error;
    }
  }

  public async getSubscription() {
    try {
      console.log("Fetching subscription data");
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error("Subscription fetch error:", error);
        throw error;
      }

      console.log("Subscription data:", data ? "Found" : "Not found");
      return data;
    } catch (error) {
      console.error("Subscription fetch exception:", error);
      throw error;
    }
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
  
  // Get trial status details
  public async getTrialStatus() {
    try {
      const subscription = await this.getSubscription();
      
      if (!subscription || subscription.subscription_status !== 'trialing') {
        return null;
      }
      
      const now = new Date();
      const trialEnd = new Date(subscription.trial_end * 1000);
      const trialStart = new Date(subscription.trial_start * 1000);
      const totalTrialDays = Math.round((trialEnd.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      const daysUsed = totalTrialDays - daysRemaining;
      
      return {
        isTrialing: true,
        trialStart: subscription.trial_start,
        trialStartDate: trialStart,
        trialEnd: subscription.trial_end,
        trialEndDate: trialEnd,
        daysRemaining,
        daysUsed,
        totalDays: totalTrialDays,
        percentComplete: Math.min(100, Math.round((daysUsed / totalTrialDays) * 100))
      };
    } catch (error) {
      console.error("Error fetching trial status:", error);
      return null;
    }
  }
  
  // Cancel subscription
  public async cancelSubscription() {
    try {
      console.log("Cancelling subscription");
      const { data, error } = await supabase.functions.invoke('stripe-cancel-subscription', {
        body: {},
      });
      
      if (error) {
        console.error("Subscription cancellation error:", error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Subscription cancellation exception:", error);
      throw error;
    }
  }
}

const stripeService = new StripeService();

export default stripeService;