// src/lib/services/stripe-service.ts
import { supabase } from "@/lib/supabase/client";
import { differenceInDays } from "date-fns";
import {
  StripeCheckoutSessionResponse,
  StripeProductsResponse,
  SubscriptionCancelResponse,
  Subscription,
  TrialStatus,
} from "./types";

class StripeService {
  public async createCheckoutSession(
    priceId: string,
    mode: "payment" | "subscription",
    options: {
      promotion_code?: string;
      trial_period_days?: number;
    } = {}
  ): Promise<StripeCheckoutSessionResponse> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "stripe-checkout",
        {
          body: {
            price_id: priceId,
            mode,
            trial_period_days: options.trial_period_days ?? 14, // Default 14-day trial period
            promotion_code: options.promotion_code,
            success_url: `${window.location.origin}/dashboard/billing/success`,
            cancel_url: `${window.location.origin}/dashboard/billing`,
          },
        }
      );

      if (error) {
        console.error("Checkout session creation error:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Checkout session exception:", error);
      throw error;
    }
  }

  public async getSubscription(): Promise<Subscription | null> {
    try {
      console.log("Fetching subscription data");
      const { data, error } = await supabase
        .from("stripe_user_subscriptions")
        .select("*")
        .maybeSingle();

      if (error) {
        console.error("Subscription fetch error:", error);
        throw error;
      }

      const isSubscriptionActive =
        data?.subscription_status === "active" ||
        data?.subscription_status === "trialing";

      console.log("Subscription data:", data ? "Found" : "Not found");
      return {
        ...data,
        is_subscription_active: isSubscriptionActive,
      };
    } catch (error) {
      console.error("Subscription fetch exception:", error);
      throw error;
    }
  }

  public async getOrders() {
    const { data, error } = await supabase
      .from("stripe_user_orders")
      .select("*")
      .order("order_date", { ascending: false });

    if (error) throw error;

    return data;
  }

  public async getActivePlan() {
    const subscription = await this.getSubscription();
    const products = await this.getProducts();

    if (!subscription?.price_id) return null;

    // Check both monthly and annual price IDs
    const plan = products.find(
      (product) =>
        product.priceIds.monthly === subscription.price_id ||
        product.priceIds.annual === subscription.price_id
    );

    return plan;
  }

  // Get trial status details with enhanced information
  public async getTrialStatus(): Promise<TrialStatus | null> {
    try {
      const subscription = await this.getSubscription();

      if (!subscription) {
        return null;
      }

      // Check if user is in trial period
      const isTrialing = subscription.subscription_status === "trialing";

      if (!isTrialing || !subscription.trial_end) {
        return null;
      }

      const now = new Date();
      const trialEndDate = new Date(subscription.trial_end * 1000);
      const trialStartDate = new Date(
        (subscription.trial_start || Date.now() / 1000) * 1000
      );

      const totalTrialDays = differenceInDays(trialEndDate, trialStartDate);
      const daysRemaining = Math.max(0, differenceInDays(trialEndDate, now));
      const daysUsed = totalTrialDays - daysRemaining;

      // Check if payment method exists based on last4 presence
      const hasPaymentMethod = !!subscription.payment_method_last4;

      return {
        isTrialing,
        trialStart: subscription.trial_start,
        trialStartDate,
        trialEnd: subscription.trial_end,
        trialEndDate,
        daysRemaining,
        daysUsed,
        totalDays: totalTrialDays,
        percentComplete: Math.min(
          100,
          Math.round((daysUsed / totalTrialDays) * 100)
        ),
        hasPaymentMethod,
      };
    } catch (error) {
      console.error("Error fetching trial status:", error);
      return null;
    }
  }

  // Enhanced cancel subscription with immediate option
  public async cancelSubscription(
    options: {
      cancel_immediately?: boolean;
    } = {}
  ): Promise<SubscriptionCancelResponse> {
    try {
      console.log("Cancelling subscription");
      const { data, error } = await supabase.functions.invoke(
        "stripe-cancel-subscription",
        {
          body: {
            cancel_immediately: options.cancel_immediately || false,
          },
        }
      );

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

  public async getProducts(): Promise<StripeProductsResponse> {
    try {
      console.log("Fetching Stripe products");
      const { data, error } = await supabase.functions.invoke(
        "stripe-products",
        {
          method: "GET",
        }
      );

      if (error) {
        console.error("Products fetch error:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Products fetch exception:", error);
      throw error;
    }
  }

  // Check if a user has a payment method attached
  public async hasPaymentMethod(): Promise<boolean> {
    const subscription = await this.getSubscription();
    return !!subscription?.payment_method_last4;
  }
}

const stripeService = new StripeService();

export default stripeService;
