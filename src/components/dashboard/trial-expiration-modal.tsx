// src/components/dashboard/trial-expiration-modal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CalendarClock,
  CreditCard,
  HelpCircle,
  Clock,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTrialStatus } from "@/hooks/use-stripe";

export default function TrialExpirationModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: trialStatus } = useTrialStatus();

  useEffect(() => {
    // Show the modal if trial is ending soon (2 days or less)
    if (
      trialStatus &&
      trialStatus.isTrialing &&
      trialStatus.daysRemaining <= 2
    ) {
      // Only show once per session
      const hasShownWarning = sessionStorage.getItem(
        "trial_expiration_warning_shown"
      );
      if (!hasShownWarning) {
        setOpen(true);
        sessionStorage.setItem("trial_expiration_warning_shown", "true");
      }
    }
  }, [trialStatus]);

  if (!trialStatus || !trialStatus.isTrialing) {
    return null;
  }

  const trialEndDate = trialStatus.trialEndDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-300" />
            </div>
          </div>
          <DialogTitle className="text-xl text-center">
            Your Free Trial Is Ending Soon
          </DialogTitle>
          <DialogDescription className="text-center">
            {trialStatus.daysRemaining === 0
              ? "Your trial ends today."
              : `You have ${trialStatus.daysRemaining} day${
                  trialStatus.daysRemaining > 1 ? "s" : ""
                } left in your trial.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          <div className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
            <CalendarClock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Trial End Date</p>
              <p className="text-sm text-muted-foreground">{trialEndDate}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
            <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">After Your Trial</p>
              <p className="text-sm text-muted-foreground">
                You&apos;ll be automatically upgraded to your selected plan. You
                won&apos;t be charged until your trial ends.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2 sm:space-y-0">
          <Button
            onClick={() => {
              setOpen(false);
              router.push("/dashboard/billing");
            }}
            className="w-full"
          >
            Upgrade Now
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full"
          >
            Remind Me Later
          </Button>
          <div className="flex justify-center pt-2">
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                setOpen(false);
                router.push("/faq#trial");
              }}
              className="flex items-center text-xs"
            >
              <HelpCircle className="h-3 w-3 mr-1" />
              Learn more about our trial
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
