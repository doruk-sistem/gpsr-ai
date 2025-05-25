"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminCustomers } from "@/hooks/admin/use-admin-customers";
import { AdminBreadcrumbs } from "@/components/admin/layout/breadcrumbs";
import { CustomersTable } from "@/components/admin/customers/customers-table";
import { Filter, Search, Download, Calendar, RefreshCw } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");

  const {
    data: customers,
    isLoading,
    refetch,
  } = useAdminCustomers({
    search: searchQuery,
    dateFrom: dateRange?.from,
    dateTo: dateRange?.to,
    subscriptionStatus:
      subscriptionFilter !== "all" ? subscriptionFilter : undefined,
  });

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Customers", href: "/admin/customers" },
  ];

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={breadcrumbItems} />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>
                View and manage all customer accounts
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or company..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <DatePickerWithRange
                date={dateRange}
                onDateChange={setDateRange}
              />

              <Select
                value={subscriptionFilter}
                onValueChange={setSubscriptionFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Subscription" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="active">Active Subscription</SelectItem>
                  <SelectItem value="trialing">In Trial</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                  <SelectItem value="none">No Subscription</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <CustomersTable isLoading={isLoading} customers={customers || []} />
        </CardContent>
      </Card>
    </div>
  );
}
