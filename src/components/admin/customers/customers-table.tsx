"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MoreHorizontal,
  Eye,
  Calendar,
  Building2,
  ArrowUpDown,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { format } from "date-fns";
import { CustomerModal } from "@/components/admin/customers/customer-modal";
import { useGetUsersWithStripeData } from "@/hooks/use-users";
import {
  StripeSubscriptionStatus,
  UserProfileWithStripe,
} from "@/lib/services/user-service";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useDebounce } from "@/hooks/use-debounce";

export function CustomersTable() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const pageSize = 10;

  const {
    data: customersData,
    isLoading,
    refetch,
  } = useGetUsersWithStripeData({
    search: debouncedSearchQuery,
    subscription_status:
      subscriptionFilter !== "all"
        ? (subscriptionFilter as StripeSubscriptionStatus)
        : undefined,
    role: "user",
    pageSize,
    page: currentPage,
  });

  const customers = customersData?.data || [];

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleViewCustomer = (id: string) => {
    setSelectedCustomerId(id);
  };

  return (
    <>
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
          <Select
            value={subscriptionFilter}
            onValueChange={(value) =>
              setSubscriptionFilter(value as StripeSubscriptionStatus)
            }
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
              <SelectItem value="incomplete_expired">
                Incomplete Expired
              </SelectItem>
              <SelectItem value="trialing">In Trial</SelectItem>
              <SelectItem value="past_due">Past Due</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="none">No Subscription</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">
                  <span className="sr-only">Avatar</span>
                </TableHead>
                <TableHead>
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    Customer
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead>
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSort("subscription.status")}
                  >
                    Subscription
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead>
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSort("created_at")}
                  >
                    Registered
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                customers?.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(customer)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {customer.first_name} {customer.last_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {customer.email}
                      </div>
                      {customer.company && (
                        <div className="text-xs text-muted-foreground flex items-center mt-0.5">
                          <Building2 className="h-3 w-3 mr-1" />
                          {customer.company}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {customer.stripe_subscription ? (
                        <div>
                          <Badge
                            variant="outline"
                            className={cn(
                              getBadgeClass(customer.stripe_subscription.status)
                            )}
                          >
                            {getSubscriptionStatusDisplay(
                              customer.stripe_subscription.status
                            )}
                          </Badge>

                          <div className="text-xs text-muted-foreground mt-1">
                            {customer.stripe_subscription.price_id ||
                              "Basic Plan"}
                          </div>

                          {customer.stripe_subscription.status === "trialing" &&
                            customer.stripe_subscription.trial_end && (
                              <div className="text-xs text-muted-foreground flex items-center mt-0.5">
                                <Calendar className="h-3 w-3 mr-1" />
                                Trial ends:{" "}
                                {format(
                                  new Date(
                                    customer.stripe_subscription.trial_end
                                  ),
                                  "MMM d, yyyy"
                                )}
                              </div>
                            )}
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-700 border-gray-200"
                        >
                          No Subscription
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(customer.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleViewCustomer(customer.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <DataTablePagination
        currentPage={currentPage}
        totalItems={customersData?.count || 0}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <CustomerModal
        userId={selectedCustomerId}
        open={!!selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
      />
    </>
  );
}

function getInitials(customer: UserProfileWithStripe): string {
  const firstName = customer.first_name || "";
  const lastName = customer.last_name || "";

  if (firstName || lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  return customer.email.charAt(0).toUpperCase();
}

function getSubscriptionStatusDisplay(status: string): string {
  switch (status) {
    case "trialing":
      return "Trial";
    case "active":
      return "Active";
    case "past_due":
      return "Past Due";
    case "canceled":
      return "Canceled";
    case "incomplete":
      return "Incomplete";
    case "incomplete_expired":
      return "Expired";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function getBadgeClass(status: string): string {
  switch (status) {
    case "trialing":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "active":
      return "bg-green-50 text-green-700 border-green-200";
    case "past_due":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "canceled":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "incomplete":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "incomplete_expired":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "";
  }
}
