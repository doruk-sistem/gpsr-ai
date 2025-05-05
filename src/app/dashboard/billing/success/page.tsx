// src/app/dashboard/billing/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Show success toast
    toast.success("Trial started successfully", {
      description: "Your 14-day free trial has begun!",
    });

    // Auto-redirect after 5 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card className="p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Your Trial Has Started!</h1>
        
        <p className="text-muted-foreground mb-6">
          You now have full access to all features for the next 14 days. 
          Explore everything our platform has to offer with no commitments.
        </p>
        
        <div className="bg-muted p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">What's Included in Your Trial:</h3>
          <ul className="text-left space-y-2 text-sm">
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
              <span>Full access to all premium features</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
              <span>EU Authorized Representative services</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
              <span>GPSR compliance tools and documentation</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
              <span>Priority customer support</span>
            </li>
          </ul>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          Remember, you won't be charged during your trial period.
          You can cancel anytime before your trial ends.
        </p>
        
        <Button 
          className="w-full mb-4 flex items-center justify-center"
          onClick={() => router.push("/dashboard")}
        >
          Go to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Redirecting to dashboard in {countdown} seconds...
        </p>
      </Card>
    </div>
  );
}
