"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Users,
  Package2,
  Building2,
  Clipboard,
  ShieldCheck,
  ArrowUp,
  ArrowDown,
  Clock,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminStats } from "@/hooks/admin/use-admin-stats";
import { DashboardStat } from "@/components/admin/dashboard/dashboard-stat";
import { RecentActivityList } from "@/components/admin/dashboard/recent-activity-list";
import { PendingRequestsCard } from "@/components/admin/dashboard/pending-requests-card";
import { DashboardChart } from "@/components/admin/dashboard/dashboard-chart";
import { AdminBreadcrumbs } from "@/components/admin/layout/breadcrumbs";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: stats, isLoading } = useAdminStats();

  const breadcrumbItems = [{ label: "Dashboard", href: "/admin/dashboard" }];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AdminBreadcrumbs items={breadcrumbItems} />

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="flex items-center gap-1.5"
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          title="Total Users"
          value={stats?.totalUsers || 0}
          description="Registered users"
          icon={<Users className="h-5 w-5 text-blue-600" />}
          trend={{
            value: stats?.usersTrend || 0,
            label: `${stats?.usersTrendPercentage || 0}% this month`,
            direction: (stats?.usersTrend || 0) >= 0 ? "up" : "down",
          }}
          isLoading={isLoading}
          onClick={() => router.push("/admin/customers")}
        />

        <DashboardStat
          title="Total Products"
          value={stats?.totalProducts || 0}
          description="Registered products"
          icon={<Package2 className="h-5 w-5 text-indigo-600" />}
          trend={{
            value: stats?.productsTrend || 0,
            label: `${stats?.productsTrendPercentage || 0}% this month`,
            direction: (stats?.productsTrend || 0) >= 0 ? "up" : "down",
          }}
          isLoading={isLoading}
          onClick={() => router.push("/admin/product-applications")}
        />

        <DashboardStat
          title="Manufacturers"
          value={stats?.totalManufacturers || 0}
          description="Registered manufacturers"
          icon={<Building2 className="h-5 w-5 text-green-600" />}
          trend={{
            value: stats?.manufacturersTrend || 0,
            label: `${stats?.manufacturersTrendPercentage || 0}% this month`,
            direction: (stats?.manufacturersTrend || 0) >= 0 ? "up" : "down",
          }}
          isLoading={isLoading}
          onClick={() => router.push("/admin/manufacturers")}
        />

        <DashboardStat
          title="Rep Requests"
          value={stats?.pendingRequests || 0}
          description="Pending approvals"
          icon={<Clipboard className="h-5 w-5 text-amber-600" />}
          trend={{
            value: stats?.requestsTrend || 0,
            label: `${stats?.requestsTrendPercentage || 0}% this month`,
            direction: (stats?.requestsTrend || 0) >= 0 ? "up" : "down",
          }}
          isLoading={isLoading}
          onClick={() => router.push("/admin/authorized-reps")}
          highlight={!!stats?.pendingRequests && stats.pendingRequests > 0}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>
              System activity for the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardChart />
          </CardContent>
        </Card>

        <PendingRequestsCard />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => router.push("/admin/activity-log")}
            >
              <span>View all</span>
              <ArrowUp className="h-3.5 w-3.5 -rotate-45" />
            </Button>
          </CardHeader>
          <CardContent>
            <RecentActivityList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>Important updates and alerts</CardDescription>
            </div>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg border bg-background">
                <div className="h-8 w-8 flex-shrink-0 rounded-full bg-blue-50 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">System update completed</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    The system has been updated to version 2.3.0
                  </p>
                  <p className="text-xs text-muted-foreground/80 mt-1">
                    2 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg border bg-background">
                <div className="h-8 w-8 flex-shrink-0 rounded-full bg-amber-50 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">10 new customer registrations</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    There has been an increase in new account creations
                  </p>
                  <p className="text-xs text-muted-foreground/80 mt-1">
                    Yesterday
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg border bg-background">
                <div className="h-8 w-8 flex-shrink-0 rounded-full bg-green-50 flex items-center justify-center">
                  <ArrowUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Storage usage within limits</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Current usage is at 68% of allocated resources
                  </p>
                  <p className="text-xs text-muted-foreground/80 mt-1">
                    3 days ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
