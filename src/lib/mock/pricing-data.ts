import { PricingData } from "@/types/pricing";

export const MOCK_PRICING_DATA: PricingData = {
  packages: [
    {
      id: 1,
      name: "Starter",
      productLimit: 5,
      pricing: {
        monthly: 39,
        annually: 390,
      },
    },
    {
      id: 2,
      name: "Growth",
      productLimit: 20,
      pricing: {
        monthly: 49,
        annually: 490,
      },
      isPopular: true,
    },
    {
      id: 3,
      name: "Scale",
      productLimit: 50,
      pricing: {
        monthly: 59,
        annually: 590,
      },
    },
    {
      id: 4,
      name: "Professional",
      productLimit: 100,
      pricing: {
        monthly: 69,
        annually: 690,
      },
    },
    {
      id: 5,
      name: "Business",
      productLimit: 200,
      pricing: {
        monthly: 79,
        annually: 790,
      },
    },
    {
      id: 6,
      name: "Enterprise",
      productLimit: 500,
      pricing: {
        monthly: 89,
        annually: 890,
      },
      isEnterprise: true,
    },
  ],
};
