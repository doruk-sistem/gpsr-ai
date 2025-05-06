// src/app/dashboard/(dashboard)/page.client.tsx
"use client";

import { useEffect, useState } from "react";
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
  Bell,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { TrialStatus } from "@/components/dashboard/trial-status";

export default function DashboardPageClient() {
  const router = useRouter();

  useEffect(() => {
    // Welcome toast when dashboard first loads
    toast.success("Welcome to DorukWell", {
      description: "Your account has been created successfully",
    });
  }, []);

  const handleAddProduct = () => {
    router.push("/add-product");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome to DorukWell</h1>
          <p className="text-muted-foreground mt-1">Your GPSR compliance hub</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </Button>
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

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted-foreground/20 text-muted-foreground">
                  2
                </div>
                <div>
                  <p className="font-medium">Add Products</p>
                  <p className="text-sm text-muted-foreground">
                    Register your products for GPSR compliance
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push("/add-product")}
              >
                Start Now
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted-foreground/20 text-muted-foreground">
                  3
                </div>
                <div>
                  <p className="font-medium">Upload Documentation</p>
                  <p className="text-sm text-muted-foreground">
                    Upload technical files and safety documents
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" disabled>
                Pending
              </Button>
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
              <Button size="sm" variant="outline" disabled>
                Pending
              </Button>
            </div>
          </div>
        </CardContent>
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
            <CardTitle className="text-lg font-medium">Products</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-muted-foreground mt-1 text-sm">
              Products registered for compliance
            </p>
            <div className="mt-4">
              <Button
                variant="link"
                className="pl-0"
                onClick={() => router.push("/add-product")}
              >
                Add your first product
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Documents</CardTitle>
            <FileCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-muted-foreground mt-1 text-sm">
              Documents uploaded to your account
            </p>
            <div className="mt-4">
              <Button
                variant="link"
                className="pl-0"
                onClick={() => router.push("/upload-documents")}
              >
                Document manager
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Card and Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>GPSR Compliance Plans</CardTitle>
            <CardDescription>
              Choose the best plan for your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-bold mb-1">Basic Plan</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Up to 5 product types
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xl font-bold">
                    €49
                    <span className="text-sm font-normal text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    €499 billed annually
                  </span>
                </div>
                <div className="flex items-start mb-3">
                  <Shield className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                  <span className="text-sm">Full GPSR compliance coverage</span>
                </div>
                <Link href="/pricing" className="block w-full">
                  <Button variant="outline" className="w-full mt-2">
                    View All Plans
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground">
                We offer multiple plans to suit businesses of all sizes. Visit
                our pricing page to find the perfect fit for your compliance
                needs.
              </p>

              <div className="flex justify-end">
                <Link href="/pricing">
                  <Button className="flex items-center">
                    See All Plans
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

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
    </div>
  );
}
