"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User,
  Mail,
  Building2,
  CreditCard,
  Clock,
  Package,
  FileText,
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useAdminCustomer } from "@/hooks/admin/use-admin-customer";
import { format } from "date-fns";

interface CustomerModalProps {
  customerId: string | null;
  open: boolean;
  onClose: () => void;
}

export function CustomerModal({
  customerId,
  open,
  onClose,
}: CustomerModalProps) {
  const { data: customer, isLoading } = useAdminCustomer(customerId);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>
            View detailed information about this customer
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 px-6">
            <TabsContent value="profile" className="mt-6 space-y-6">
              {isLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-2xl">
                        {getInitials(customer)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2 flex-1">
                      <h3 className="text-2xl font-medium">
                        {customer?.user_metadata?.first_name} {customer?.user_metadata?.last_name}
                      </h3>
                      
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`mailto:${customer?.email}`}
                          className="text-primary hover:underline"
                        >
                          {customer?.email}
                        </a>
                      </div>
                      
                      {customer?.user_metadata?.company && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>{customer.user_metadata.company}</span>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        {customer?.email_confirmed_at ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Email Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-200 text-amber-800">
                            Email Unverified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Account Created</h4>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {customer && format(new Date(customer.created_at), "MMMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Sign In</h4>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {customer?.last_sign_in_at 
                            ? format(new Date(customer.last_sign_in_at), "MMMM d, yyyy h:mm a")
                            : "Never"
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Products</h4>
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{customer?.product_count || 0} products registered</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="subscription" className="mt-6 space-y-6">
              {isLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : !customer?.subscription ? (
                <div className="bg-muted/50 rounded-lg p-6 border text-center">
                  <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium">No Active Subscription</h3>
                  <p className="text-muted-foreground mt-1">
                    This customer doesn't have an active subscription.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-muted/50 rounded-lg p-6 border">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-lg">{customer.subscription.product_name || "Subscription"}</h3>
                        <Badge 
                          variant="outline" 
                          className={getSubscriptionBadgeClass(customer.subscription.status)}
                        >
                          {getSubscriptionStatusDisplay(customer.subscription.status)}
                        </Badge>
                        
                        {customer.subscription.is_trial && customer.subscription.trial_end && (
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Trial ends on </span>
                            <span className="font-medium">
                              {format(new Date(customer.subscription.trial_end), "MMMM d, yyyy")}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4 border">
                      <h4 className="font-medium mb-3">Payment Information</h4>
                      
                      {customer.subscription.payment_method ? (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Payment Method</span>
                            <span className="capitalize">{customer.subscription.payment_method.brand || "Card"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Last 4 Digits</span>
                            <span>•••• {customer.subscription.payment_method.last4 || "0000"}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No payment method on file.
                        </p>
                      )}
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4 border">
                      <h4 className="font-medium mb-3">Billing Cycle</h4>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Current Period Started</span>
                          <span>
                            {customer.subscription.current_period_start 
                              ? format(new Date(customer.subscription.current_period_start), "MMM d, yyyy")
                              : "N/A"
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Current Period Ends</span>
                          <span>
                            {customer.subscription.current_period_end 
                              ? format(new Date(customer.subscription.current_period_end), "MMM d, yyyy")
                              : "N/A"
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Cancels at Period End</span>
                          {customer.subscription.cancel_at_period_end ? (
                            <CheckCircle className="h-5 w-5 text-amber-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="activity" className="mt-6 space-y-6">
              {isLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {customer?.activities && customer.activities.length > 0 ? (
                    customer.activities.map((activity) => (
                      <div key={activity.id} className="bg-muted/30 rounded-lg p-4 border">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-medium">{activity.type}</h4>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(activity.timestamp), "MMM d, yyyy h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm">{activity.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="bg-muted/50 rounded-lg p-6 border text-center">
                      <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <h3 className="font-medium">No Activity Records</h3>
                      <p className="text-muted-foreground mt-1">
                        There are no activity records for this customer.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="px-6 pt-4">
          <Button onClick={() => onClose()}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getInitials(customer: any): string {
  const firstName = customer?.user_metadata?.first_name || '';
  const lastName = customer?.user_metadata?.last_name || '';
  
  if (firstName || lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  
  return customer?.email?.charAt(0)?.toUpperCase() || 'U';
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

function getSubscriptionBadgeClass(status: string): string {
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