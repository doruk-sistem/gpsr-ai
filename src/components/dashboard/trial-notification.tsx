// src/components/dashboard/trial-notification.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { differenceInDays } from "date-fns";
import { AlarmClock } from "lucide-react";
import { useSubscription } from "@/hooks/use-stripe";
import { Button } from "@/components/ui/button";

export function TrialNotification() {
  const router = useRouter();
  const { data: subscription } = useSubscription();

  // If no subscription exists or it's not in trial mode, return null
  if (!subscription || subscription.subscription_status !== "trialing") {
    return null;
  }

  // Calculate days remaining in trial
  const trialEndDate = new Date(subscription.current_period_end * 1000);
  const today = new Date();
  const daysRemaining = Math.max(0, differenceInDays(trialEndDate, today));

  return (
    <div className="px-3 py-2 mb-4">
      <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
        <div className="flex items-center mb-2">
          <AlarmClock className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium text-sm">Trial Status</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {daysRemaining === 0
            ? "Your trial ends today"
            : `${daysRemaining} days left in your trial`}
        </p>
        {daysRemaining <= 7 && (
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={() => router.push("/dashboard/billing")}
          >
            Upgrade Now
          </Button>
        )}
      </div>
    </div>
  );
}
