// src/app/dashboard/(dashboard)/billing/payment/page.client.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Sparkles, Clock, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { notFound, useSearchParams } from "next/navigation";
import { useUpdateCurrentUser } from "@/hooks/use-auth";
import {
  useCreateCheckoutSession,
  useProducts,
  useSubscription,
} from "@/hooks/use-stripe";

export default function PaymentPageClient() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: updateCurrentUser } = useUpdateCurrentUser();
  const createCheckoutSession = useCreateCheckoutSession();
  const { data: products } = useProducts();
  const { data: subscription } = useSubscription();

  const selectedPlanId = searchParams.get("productId");
  const billingType = searchParams.get("billing") || "annual";

  if (subscription?.is_subscription_active) {
    notFound();
  }

  const selectedPlan =
    products?.find((p) => p.id === selectedPlanId) || products?.[0];
  const price =
    billingType === "annual"
      ? selectedPlan?.prices.annual
      : selectedPlan?.prices.monthly;

  // Calculate trial end date (14 days from now)
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 14);
  const formattedTrialEndDate = trialEndDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handlePayment = async () => {
    if (!selectedPlan) {
      toast.error("No plan selected", {
        description: "Please select a plan to continue",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First, update the user's package_id in user metadata
      await updateCurrentUser({ package_id: selectedPlanId });

      // Get stripe price ID based on billing interval
      const priceId =
        billingType === "annual"
          ? selectedPlan.priceIds.annual
          : selectedPlan.priceIds.monthly;

      // Create a Stripe checkout session
      const response = await createCheckoutSession.mutateAsync({
        priceId: priceId || "",
        mode: "subscription",
      });

      if (response?.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error("Payment setup failed", {
        description: error.message || "Please try again later",
      });
      setIsLoading(false);
    }
  };

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
            <p className="text-muted-foreground">{selectedPlan?.description}</p>
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
          Your first payment is due after the free trial ends on{" "}
          {formattedTrialEndDate}.
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
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Add Payment Details"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
