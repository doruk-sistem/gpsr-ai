// src/app/dashboard/(dashboard)/page.client.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  FileCheck,
  Clock,
  Package,
  Settings,
  PlusCircle,
  ChevronRight,
  Factory,
  CreditCard,
  CheckCircle,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { TrialStatus } from "@/components/dashboard/trial-status";
import { useActivePlan, useSubscription } from "@/hooks/use-stripe";
import { useProducts } from "@/hooks/use-products";
import { useManufacturers } from "@/hooks/use-manufacturers";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Spinner from "@/components/ui/spinner";

export default function DashboardPageClient() {
  const router = useRouter();
  const { data: subscription, isLoading: isLoadingSubscription } =
    useSubscription({
      select: {
        has_active_subscription: true,
        is_in_trial: true,
        current_period_end: true,
      },
    });
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { data: manufacturers, isLoading: isLoadingManufacturers } =
    useManufacturers();
  const { data: activePlan, isLoading: isLoadingActivePlan } = useActivePlan();

  // Check user subscription
  const hasActiveSubscription = subscription?.has_active_subscription;
  const productsCount = products?.length || 0;
  const manufacturersCount = manufacturers?.length || 0;

  const handleAddProduct = () => {
    router.push("/dashboard/products/add");
  };

  if (isLoadingSubscription) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  // if user has no active subscription, show the trial card
  if (!hasActiveSubscription) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome to DorukWell</h1>
            <p className="text-muted-foreground mt-1">
              Your GPSR compliance hub
            </p>
          </div>
        </div>

        <Card className="mb-8 border border-primary/40 bg-gradient-to-br from-white to-primary/5">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              {/* Left Column - Trial Info */}
              <div className="w-full md:w-2/5 space-y-6">
                <div className="inline-block p-3 rounded-xl bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>

                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    Start Your 14-Day Free Trial
                  </h2>
                  <p className="mt-3 text-muted-foreground">
                    Explore all GPSR compliance features with no commitment. No
                    credit card required to start.
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={() => router.push("/dashboard/billing")}
                  className="mt-6 w-full md:w-auto"
                >
                  Get Started Now
                </Button>
              </div>

              {/* Right Column - Features */}
              <div className="w-full md:w-3/5 mt-8 md:mt-0">
                <h3 className="text-lg font-medium mb-6">
                  Everything you need for GPSR compliance:
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span>Full GPSR Compliance Assessment</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span>Technical Documentation Management</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span>Product Registration and Tracking</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span>EU Authorized Representatives</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span>Compliance Certificate Generation</span>
                  </div>
                </div>

                <div className="mt-6 text-sm text-right">
                  <Link
                    href="/dashboard/billing"
                    className="text-primary hover:underline"
                  >
                    View all subscription plans →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                GPSR Countdown
              </CardTitle>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">285</div>
              <p className="text-muted-foreground mt-1 text-sm">
                Days until GPSR enforcement
              </p>
              <div className="mt-4">
                <Link href="/about-gpsr">
                  <Button variant="link" className="pl-0">
                    Learn more about GPSR
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Resources</CardTitle>
              <FileCheck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-3">
                Access helpful guides and documentation
              </div>
              <Link href="/about-gpsr" className="block">
                <Button variant="outline" className="w-full justify-start mb-2">
                  <Shield className="h-4 w-4 mr-2" />
                  GPSR Guide
                </Button>
              </Link>
              <Link href="/faq" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  FAQs
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Get Started</CardTitle>
              <PlusCircle className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-3">
                Begin your compliance journey today
              </div>
              <Button
                className="w-full mb-2"
                onClick={() => router.push("/dashboard/billing")}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dashboard/billing")}
              >
                View Pricing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome to DorukWell</h1>
          <p className="text-muted-foreground mt-1">Your GPSR compliance hub</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button
            className="flex items-center gap-2"
            onClick={handleAddProduct}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      {/* Trial Status Component */}
      <TrialStatus />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Products Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Products</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingProducts ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="text-3xl font-bold">{productsCount}</div>
            )}
            <p className="text-muted-foreground mt-1 text-sm">
              Products registered for compliance
            </p>
            <div className="mt-4">
              <Button
                variant="link"
                className="pl-0"
                onClick={() => router.push("/dashboard/products")}
              >
                {productsCount > 0
                  ? "Manage products"
                  : "Add your first product"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Manufacturers Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Manufacturers</CardTitle>
            <Factory className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingManufacturers ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="text-3xl font-bold">{manufacturersCount}</div>
            )}
            <p className="text-muted-foreground mt-1 text-sm">
              Registered manufacturers
            </p>
            <div className="mt-4">
              <Button
                variant="link"
                className="pl-0"
                onClick={() => router.push("/dashboard/manufacturers")}
              >
                {manufacturersCount > 0
                  ? "Manage manufacturers"
                  : "Add your first manufacturer"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Subscription</CardTitle>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingSubscription ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  {isLoadingActivePlan ? (
                    <Spinner size="sm" />
                  ) : (
                    <span className="text-lg font-bold">
                      {activePlan?.name}
                    </span>
                  )}
                  <Badge
                    variant={subscription?.is_in_trial ? "outline" : "default"}
                    className={
                      subscription?.is_in_trial
                        ? "border-primary text-primary"
                        : ""
                    }
                  >
                    {subscription?.is_in_trial ? "Trial" : "Active"}
                  </Badge>
                </div>
                {subscription?.current_period_end && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {subscription.is_in_trial ? "Trial ends" : "Renews"}:{" "}
                      {format(
                        new Date(subscription.current_period_end * 1000),
                        "PP"
                      )}
                    </span>
                  </div>
                )}
                <div className="mt-4">
                  <Button
                    variant="link"
                    className="pl-0"
                    onClick={() => router.push("/dashboard/billing")}
                  >
                    Manage subscription
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Compliance Progress</CardTitle>
          <CardDescription>
            Complete the following steps to fully comply with GPSR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-primary">
                  1
                </div>
                <div>
                  <p className="font-medium">Account Created</p>
                  <p className="text-sm text-muted-foreground">
                    Your account has been set up successfully
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-primary">
                ✓
              </div>
            </div>

            <div
              className={`flex items-center justify-between p-3 ${
                manufacturersCount > 0
                  ? "bg-primary/5 border-primary/10"
                  : "bg-muted"
              } rounded-lg border`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full ${
                    manufacturersCount > 0
                      ? "bg-primary/20 text-primary"
                      : "bg-muted-foreground/20 text-muted-foreground"
                  }`}
                >
                  2
                </div>
                <div>
                  <p className="font-medium">Add Manufacturers</p>
                  <p className="text-sm text-muted-foreground">
                    Register your product manufacturers
                  </p>
                </div>
              </div>
              {manufacturersCount > 0 ? (
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-primary">
                  ✓
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push("/dashboard/manufacturers")}
                >
                  Start Now
                </Button>
              )}
            </div>

            <div
              className={`flex items-center justify-between p-3 ${
                productsCount > 0
                  ? "bg-primary/5 border-primary/10"
                  : "bg-muted"
              } rounded-lg border`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full ${
                    productsCount > 0
                      ? "bg-primary/20 text-primary"
                      : "bg-muted-foreground/20 text-muted-foreground"
                  }`}
                >
                  3
                </div>
                <div>
                  <p className="font-medium">Add Products</p>
                  <p className="text-sm text-muted-foreground">
                    Register your products for GPSR compliance
                  </p>
                </div>
              </div>
              {productsCount > 0 ? (
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-primary">
                  ✓
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push("/dashboard/products")}
                >
                  Start Now
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted-foreground/20 text-muted-foreground">
                  4
                </div>
                <div>
                  <p className="font-medium">Sign Authorization</p>
                  <p className="text-sm text-muted-foreground">
                    Digitally sign the Authorized Representative mandate
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push("/dashboard/representative")}
              >
                Start Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>
            Helpful information to guide your compliance journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Link href="/about-gpsr" className="block">
              <div className="flex items-center justify-between hover:bg-muted/50 p-3 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">GPSR Guide</p>
                    <p className="text-sm text-muted-foreground">
                      Overview of the regulation
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/services" className="block">
              <div className="flex items-center justify-between hover:bg-muted/50 p-3 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Documentation Guide</p>
                    <p className="text-sm text-muted-foreground">
                      Required documents for compliance
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/faq" className="block">
              <div className="flex items-center justify-between hover:bg-muted/50 p-3 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">FAQs</p>
                    <p className="text-sm text-muted-foreground">
                      Common questions about compliance
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
