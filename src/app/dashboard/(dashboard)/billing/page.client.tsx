// src/app/dashboard/(dashboard)/billing/page.client.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { useSubscription } from "@/hooks/use-stripe";
import { Package } from "@/lib/services/packages-service";

export default function BillingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Package | null>(null);
  const { data: packages } = usePackages();
  const { data: subscription, isLoading: isLoadingSubscription, error: subscriptionError } = useSubscription();
  const router = useRouter();

  useEffect(() => {
    if (packages) {
      setSelectedPlan(packages[0]);
    }
  }, [packages]);

  // Handle loading state
  if (isLoadingSubscription) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading subscription information...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (subscriptionError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/20 max-w-md text-center">
          <h3 className="font-semibold text-destructive mb-2">Error Loading Subscription</h3>
          <p className="text-muted-foreground mb-4">
            We encountered an error while loading your subscription details. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // If user has an active subscription or is in trial, redirect to manage page
  if (subscription && (subscription.subscription_status === 'active' || subscription.subscription_status === 'trialing')) {
    return (
      <div className="container mx-auto px-4 pb-8 max-w-6xl">
        <div className="bg-primary/5 p-6 rounded-lg mb-8 border border-primary/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Manage Your Subscription</h2>
              <p className="text-muted-foreground">
                You have an {subscription.subscription_status === 'trialing' ? 'active trial' : 'active subscription'}.
              </p>
            </div>
            <Button 
              onClick={() => router.push('/dashboard/billing/manage')}
              className="whitespace-nowrap"
            >
              Manage Subscription
            </Button>
          </div>
        </div>

        {/* Additional information section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                Your active subscription details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    subscription.subscription_status === 'trialing' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100'
                  }`}>
                    {subscription.subscription_status === 'trialing' ? 'Trial' : 'Active'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Billing Period:</span>
                  <span>
                    {new Date(subscription.current_period_start * 1000).toLocaleDateString()} - {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                  </span>
                </div>
                
                {subscription.cancel_at_period_end && (
                  <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 rounded-md text-sm text-amber-800 dark:text-amber-200">
                    Your subscription is set to cancel at the end of the current billing period.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                Support options for your subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you have any questions about your subscription or need assistance, our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={() => router.push('/dashboard/support')}>
                  Contact Support
                </Button>
                <Button variant="outline" onClick={() => router.push('/faq#billing')}>
                  Billing FAQ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Default view - Show pricing options for users without an active subscription
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