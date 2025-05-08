// src/components/dashboard/trial-status.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useTrialStatus } from "@/hooks/use-stripe";

export function TrialStatus() {
  const router = useRouter();
  const { data: trialStatus, isLoading } = useTrialStatus();

  // If loading, not active, or not applicable, don't show
  if (isLoading || !trialStatus || !trialStatus.isTrialing) {
    return null;
  }

  // Format trial end date
  const formattedEndDate = trialStatus.trialEndDate.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  // Determine the status and styling based on days remaining
  let statusText = "";
  let statusColor = "text-primary";

  if (trialStatus.daysRemaining <= 2) {
    statusText = "Expires Soon";
    statusColor = "text-destructive";
  } else if (trialStatus.daysRemaining <= 7) {
    statusText = "In Progress";
    statusColor = "text-amber-500";
  } else {
    statusText = "Active";
    statusColor = "text-emerald-500";
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            <h3 className="font-bold">Free Trial</h3>
            <span
              className={`ml-2 text-sm px-2 py-0.5 rounded-full ${statusColor} bg-opacity-10`}
            >
              {statusText}
            </span>
          </div>
          {trialStatus.daysRemaining <= 7 && (
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push("/dashboard/billing")}
            >
              Upgrade Now
            </Button>
          )}
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>
              Day {trialStatus.daysUsed} of {trialStatus.totalDays}
            </span>
            <span
              className={
                trialStatus.daysRemaining <= 2
                  ? "text-destructive font-medium"
                  : ""
              }
            >
              {trialStatus.daysRemaining} days remaining
            </span>
          </div>
          <Progress value={trialStatus.percentComplete} className="h-2" />
        </div>

        {trialStatus.daysRemaining <= 2 && (
          <div className="flex items-start mt-3 p-2 bg-destructive/10 rounded text-sm">
            <AlertTriangle className="h-4 w-4 text-destructive mr-2 mt-0.5 shrink-0" />
            <p>
              Your trial is ending on {formattedEndDate}. Upgrade now to
              maintain access to all features.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
