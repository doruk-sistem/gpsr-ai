import { type FormatSelectQuerySelectObject } from "@/lib/utils/from-select-query";

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  features: string[];
  metadata: {
    product_limit: string;
  };
  product_limit: number;
  prices: {
    monthly: number;
    annual: number;
    monthlyWithAnnualDiscount: number; // Calculated monthly equivalent of annual price
  };
  priceIds: {
    monthly: string;
    annual: string;
  };
  images: string[];
  created: number;
  updated: number;
}

export type StripeProductsResponse = StripeProduct[];

export type StripeCheckoutSessionResponse = {
  sessionId: string;
  url: string;
};

export type CustomerPortalResponse = {
  url: string;
};

export type StripeCheckoutSessionRequest = {
  priceId: string;
  mode: "payment" | "subscription";
  cancel_immediately?: boolean; // For subscription cancellation
  feedback?: string; // For cancellation feedback
  promotion_code?: string; // For applying promotion codes
  trial_period_days?: number; // For customizing trial period length
};

export interface TrialStatus {
  isTrialing: boolean;
  trialStart: number;
  trialStartDate: Date;
  trialEnd: number;
  trialEndDate: Date;
  daysRemaining: number;
  daysUsed: number;
  totalDays: number;
  percentComplete: number;
  hasPaymentMethod: boolean; // Flag to show if a payment method is attached
}

export interface SubscriptionCancelResponse {
  success: boolean;
  message: string;
  is_immediate: boolean;
}

export interface Subscription {
  customer_id: string;
  subscription_id: string;
  subscription_status:
    | "not_started"
    | "incomplete"
    | "incomplete_expired"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "paused";
  price_id: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  payment_method_brand: string;
  payment_method_last4: string;
  trial_start: number;
  trial_end: number;
  is_trial_used: boolean;
  is_in_trial: boolean;
  has_active_subscription: boolean;
}

export interface SubscriptionRequest {
  select?: FormatSelectQuerySelectObject<keyof Subscription>;
}
