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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Eye, User, Package, Calendar, Building2, ArrowUpDown, CreditCard, Lock, DivideIcon as LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { format } from "date-fns";
import { CustomerModal } from "@/components/admin/customers/customer-modal";

interface Customer {
  id: string;
  email: string;
  user_metadata: {
    first_name?: string;
    last_name?: string;
    company?: string;
  };
  created_at: string;
  last_sign_in_at?: string;
  subscription?: {
    status: string;
    is_trial: boolean;
    trial_end?: string;
    product_name?: string;
  };
  product_count: number;
  manufacturer_count: number;
  representative_request_count: number;
}

interface CustomersTableProps {
  customers: Customer[];
  isLoading: boolean;
}

export function CustomersTable({
  customers,
  isLoading
}: CustomersTableProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">
                <span className="sr-only">Avatar</span>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("email")}>
                  Customer
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("subscription.status")}>
                  Subscription
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead className="text-center">Products</TableHead>
              <TableHead className="text-center">Manufacturers</TableHead>
              <TableHead className="text-center">Rep Requests</TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("created_at")}>
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
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                      {customer.user_metadata?.first_name} {customer.user_metadata?.last_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {customer.email}
                    </div>
                    {customer.user_metadata?.company && (
                      <div className="text-xs text-muted-foreground flex items-center mt-0.5">
                        <Building2 className="h-3 w-3 mr-1" />
                        {customer.user_metadata.company}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {customer.subscription ? (
                      <div>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            getBadgeClass(customer.subscription.status)
                          )}
                        >
                          {getSubscriptionStatusDisplay(customer.subscription.status)}
                        </Badge>
                        
                        <div className="text-xs text-muted-foreground mt-1">
                          {customer.subscription.product_name || "Basic Plan"}
                        </div>
                        
                        {customer.subscription.is_trial && customer.subscription.trial_end && (
                          <div className="text-xs text-muted-foreground flex items-center mt-0.5">
                            <Calendar className="h-3 w-3 mr-1" />
                            Trial ends: {format(new Date(customer.subscription.trial_end), "MMM d, yyyy")}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                        No Subscription
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{customer.product_count}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{customer.manufacturer_count}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{customer.representative_request_count}</span>
                    </div>
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
                        <DropdownMenuItem onClick={() => handleViewCustomer(customer.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <CreditCard className="mr-2 h-4 w-4" />
                          View Subscription
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Lock className="mr-2 h-4 w-4" />
                          Reset Password
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
      
      <CustomerModal
        customerId={selectedCustomerId}
        open={!!selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
      />
    </>
  );
}

function getInitials(customer: Customer): string {
  const firstName = customer.user_metadata?.first_name || '';
  const lastName = customer.user_metadata?.last_name || '';
  
  if (firstName || lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  
  return customer.email.charAt(0).toUpperCase();
}

function getSubscriptionStatusDisplay(status: string): string {
  switch (status) {
    case 'trialing':
      return 'Trial';
    case 'active':
      return 'Active';
    case 'past_due':
      return 'Past Due';
    case 'canceled':
      return 'Canceled';
    case 'incomplete':
      return 'Incomplete';
    case 'incomplete_expired':
      return 'Expired';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function getBadgeClass(status: string): string {
  switch (status) {
    case 'trialing':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'active':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'past_due':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'canceled':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'incomplete':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'incomplete_expired':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return '';
  }
}