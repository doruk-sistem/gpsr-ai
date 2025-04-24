export type BillingInterval = "monthly" | "annually";

export interface PricingFeature {
  id: string;
  title: string;
  description?: string;
  included: boolean;
}

export interface PricingPackage {
  id: number;
  name: string;
  productLimit: number;
  pricing: {
    monthly: number;
    annually: number;
  };
  isPopular?: boolean;
  isEnterprise?: boolean;
}

export interface PricingData {
  packages: PricingPackage[];
}
