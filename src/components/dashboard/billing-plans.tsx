// src/app/dashboard/(dashboard)/billing/page.client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useStripeProducts } from "@/hooks/use-stripe";
import { StripeProduct } from "@/lib/services/stripe-service/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function BillingPlans() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<StripeProduct | null>(null);

  const { data: productsRaw, isLoading } = useStripeProducts();
  const router = useRouter();

  // Sort products by monthly price and remove any with missing prices
  const products = useMemo(() => {
    if (!productsRaw) return [];

    return [...productsRaw]
      .filter(
        (product) =>
          (isAnnual && product.prices.annual !== null) ||
          (!isAnnual && product.prices.monthly !== null)
      )
      .sort((a, b) => {
        const priceA = isAnnual ? a.prices.annual || 0 : a.prices.monthly || 0;
        const priceB = isAnnual ? b.prices.annual || 0 : b.prices.monthly || 0;
        return priceA - priceB;
      });
  }, [productsRaw, isAnnual]);

  const handlePayment = () => {
    if (selectedPlan) {
      router.push(
        `/dashboard/billing/payment?productId=${selectedPlan.id}&billing=${
          isAnnual ? "annual" : "monthly"
        }`
      );
    } else {
      toast.error("Please select a plan first");
    }
  };

  // Set the first available product as the default selected plan
  useEffect(() => {
    if (
      products.length > 0 &&
      (!selectedPlan || !products.some((p) => p.id === selectedPlan.id))
    ) {
      setSelectedPlan(products[0]);
    }
  }, [products, selectedPlan]);

  // Calculate monthly savings when paying annually
  const calculateSavings = (product: StripeProduct) => {
    if (!product.prices.annual || !product.prices.monthly) return null;

    const annualMonthly = product.prices.annual / 12;
    const monthlyCost = product.prices.monthly;

    return Math.round((1 - annualMonthly / monthlyCost) * 100);
  };

  const savingsValue = Math.max(
    ...products.map((p) => calculateSavings(p) || 0)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-2 items-center">
          <div className="h-3 w-3 bg-primary rounded-full"></div>
          <div className="h-3 w-3 bg-primary rounded-full"></div>
          <div className="h-3 w-3 bg-primary rounded-full"></div>
          <span className="text-muted-foreground text-sm ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  // If no products are available, show an error message
  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No pricing plans available</h1>
        <p className="text-muted-foreground">
          Please check back later or contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-8 max-w-6xl">
      {/* Top Banner */}
      <div className="bg-primary/5 p-4 rounded-lg mb-8 border border-primary/10">
        <p className="text-sm text-primary font-medium">
          ✨ Subscribe now for full access and explore more!
        </p>
      </div>

      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary">
          Start Using Our Service For Free!
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Get an Authorized Representative for Your Products in the EU and UK
          Markets. Ensure compliance and enjoy peace of mind.
        </p>
      </div>

      {/* Pricing Options */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <span className={isAnnual ? "opacity-50" : "font-semibold"}>
          Monthly
        </span>
        <Switch
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
          className="data-[state=checked]:bg-primary"
        />
        <span className={isAnnual ? "font-semibold" : "opacity-50"}>
          Annually
          {savingsValue ? (
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium ml-2">
              Save up to {savingsValue}%
            </span>
          ) : null}
        </span>
      </div>

      {/* Free Trial Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-xl mb-8 border border-primary/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-lg font-semibold text-primary">
                14 Days Free Trial
              </h3>
              <p className="text-sm text-gray-600">
                Try any package free for 14 days, cancel anytime with no
                charges.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {products.map((product) => {
          const price = isAnnual
            ? product.prices.annual
            : product.prices.monthly;

          const savings = isAnnual ? calculateSavings(product) : null;

          return (
            <Card
              key={product.id}
              className={`ring relative cursor-pointer transition-all duration-200 hover:border-primary/50 ${
                selectedPlan?.id === product.id
                  ? "ring-primary shadow-lg"
                  : "ring-transparent"
              }`}
              onClick={() => setSelectedPlan(product)}
            >
              {savings && savings > 0 && isAnnual ? (
                <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Save {savings}%
                </div>
              ) : null}
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-4">
                  £{price}
                  <span className="text-base font-normal text-gray-600">
                    /{isAnnual ? "year" : "month"}
                  </span>
                </div>
                <div className="space-y-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="max-w-2xl mx-auto">
        <Button
          onClick={handlePayment}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
        >
          Start With 14 Days Free Trial Now
        </Button>

        {/* Trust Message */}
        <p className="text-center text-sm text-gray-500 mt-4">
          You can cancel anytime during the 14-day trial period with no charges
        </p>
      </div>
    </div>
  );
}
