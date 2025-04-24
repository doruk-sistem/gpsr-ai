export type BillingInterval = "monthly" | "annually";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    annually: number;
  };
  features: string[];
  productLimit: number;
}
