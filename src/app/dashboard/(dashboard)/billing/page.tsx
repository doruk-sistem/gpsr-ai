// src/app/dashboard/(dashboard)/billing/page.client.tsx
"use client";

import { useSubscription } from "@/hooks/use-stripe";

import BillingManageSubscription from "@/components/dashboard/billing-manage-subscription";
import BillingPlans from "@/components/dashboard/billing-plans";
import Spinner from "@/components/ui/spinner";

export default function BillingPage() {
  const { data: subscription, isLoading: isLoadingSubscription } =
    useSubscription({
      select: {
        has_active_subscription: true,
      },
    });

  if (isLoadingSubscription) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return subscription?.has_active_subscription ? (
    <BillingManageSubscription />
  ) : (
    <BillingPlans />
  );
}
