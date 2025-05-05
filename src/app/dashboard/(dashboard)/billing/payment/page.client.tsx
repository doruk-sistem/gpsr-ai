// src/app/dashboard/(dashboard)/billing/payment/page.client.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Sparkles, Clock, CreditCard } from "lucide-react";

import { useSearchParams } from "next/navigation";
import { useUpdateCurrentUser } from "@/hooks/use-auth";
import { usePackages } from "@/hooks/use-packages";

export default function PaymentPageClient() {
  const searchParams = useSearchParams();
  const { mutate: updateCurrentUser } = useUpdateCurrentUser();
  const { data: packages } = usePackages();

  const selectedPlanId = searchParams.get("plan");
  const billingType = searchParams.get("billing") || "annual";

  const selectedPlan =
    packages?.find((p) => p.id === selectedPlanId) || packages?.[0];
  const price =
    billingType === "annual"
      ? selectedPlan?.annually_price
      : selectedPlan?.monthly_price;

  const handlePayment = () => {
    if (selectedPlanId) {
      updateCurrentUser({ package_id: selectedPlanId });
    }
  };

  // Calculate trial end date (14 days from now)
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 14);
  const formattedTrialEndDate = trialEndDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-primary">
        How Your 14 Days Free Trial Works
      </h1>

      <div className="bg-card p-6 rounded-lg mb-8">
        <div className="flex items-center justify-between relative">
          <div className="flex-1 flex items-center">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="flex-grow mx-4 h-1 bg-primary"></div>
          </div>
          <div className="flex-1 flex items-center">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
              <Clock className="h-6 w-6" />
            </div>
            <div className="flex-grow mx-4 h-1 bg-primary"></div>
          </div>
          <div className="flex-1 flex items-center">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
              <CreditCard className="h-6 w-6" />
            </div>
            <div className="flex-grow mx-4 h-1 bg-muted"></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <h3 className="font-semibold mb-2">Day 1</h3>
            <p className="text-sm text-muted-foreground">
              Get access to the platform, starting today.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Day 7</h3>
            <p className="text-sm text-muted-foreground">
              We will email you a reminder 7 days before your trial ends.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Day 14</h3>
            <p className="text-sm text-muted-foreground">
              You will be charged as per your plan. Cancel anytime before this
              date.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">{selectedPlan?.name} Plan</h2>
            <p className="text-muted-foreground">
              Up to {selectedPlan?.product_limit} Products
            </p>
            <p className="text-sm text-muted-foreground">
              14 days free trial. Cancel anytime.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">£{price}</span>
            <span className="text-muted-foreground">
              /{billingType === "annual" ? "year" : "month"}
            </span>
          </div>
        </div>

        <p className="text-muted-foreground mb-6">
          Your first payment is due after the free trial ends on {formattedTrialEndDate}.
        </p>

        <div className="flex justify-between items-center mb-6">
          <p className="font-semibold">Payment due today</p>
          <p className="text-2xl font-bold text-primary">£0</p>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <span className="text-base mr-2">Powered by:</span>
            <Image
              src="/images/stripe-logo.svg"
              alt="Stripe"
              width={80}
              height={35}
              className="mr-2"
            />
            <Image
              src="/images/pci-dss-logo.svg"
              alt="PCI DSS"
              width={80}
              height={35}
            />
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
            onClick={handlePayment}
          >
            Add Payment Details
          </Button>
        </div>
      </div>
    </div>
  );
}
