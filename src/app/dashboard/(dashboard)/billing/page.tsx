"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

import { usePackages } from "@/hooks/use-packages";
import { Package } from "@/lib/services/packages-service";

export default function BillingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Package | null>(null);

  const { data: packages } = usePackages();

  useEffect(() => {
    if (packages) {
      setSelectedPlan(packages[0]);
    }
  }, [packages]);

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
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium ml-2">
            Get 2 months free
          </span>
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
                Try any package free for 14 days, no cancellation fees.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {packages?.map((plan) => (
          <Card
            key={plan.id}
            className={`ring relative cursor-pointer transition-all duration-200 hover:border-primary/50 ${
              selectedPlan?.id === plan.id
                ? "ring-primary shadow-lg"
                : "ring-transparent"
            }`}
            onClick={() => setSelectedPlan(plan)}
          >
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">{plan?.name}</CardTitle>
              <CardDescription>
                Up to {plan?.product_limit} Products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-4">
                £{isAnnual ? plan?.annually_price : plan?.monthly_price}
                <span className="text-base font-normal text-gray-600">
                  /{isAnnual ? "year" : "month"}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-gray-600">EU REP compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-gray-600">GPSR compliance</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Button */}
      <div className="max-w-2xl mx-auto">
        <Link
          href={{
            pathname: "/dashboard/billing/payment",
            query: {
              plan: selectedPlan?.id,
              billing: isAnnual ? "annual" : "monthly",
            },
          }}
          className="block"
        >
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold">
            Start With 14 Days Free Trial Now
          </Button>
        </Link>

        {/* Trust Message */}
        <p className="text-center text-sm text-gray-500 mt-4">
          You can cancel anytime during the 14-day trial period
        </p>
      </div>
    </div>
  );
}
