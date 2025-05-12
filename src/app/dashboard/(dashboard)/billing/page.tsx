// src/app/dashboard/(dashboard)/billing/page.client.tsx
"use client";

import { useSubscription } from "@/hooks/use-stripe";

import BillingManageSubscription from "@/components/dashboard/billing-manage-subscription";
import BillingPlans from "@/components/dashboard/billing-plans";

export default function BillingPage() {
  const { data: subscription, isLoading: isLoadingSubscription } =
    useSubscription();

  if (isLoadingSubscription) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-2 items-center">
          <div className="h-3 w-3 bg-primary rounded-full"></div>
          <div className="h-3 w-3 bg-primary rounded-full"></div>
          <div className="h-3 w-3 bg-primary rounded-full"></div>
          <span className="text-muted-foreground text-sm ml-2">
            Loading data...
          </span>
        </div>
      </div>
    );
  }

  return subscription?.hasActiveSubscription ? (
    <BillingManageSubscription />
  ) : (
    <BillingPlans />
  );
}
