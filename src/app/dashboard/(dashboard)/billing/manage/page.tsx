// src/app/dashboard/(dashboard)/billing/manage/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  CreditCard,
  CalendarDays,
  Clock,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  useSubscription,
  useActivePlan,
  useCancelSubscription,
} from "@/hooks/use-stripe";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { usePackages } from "@/hooks/use-packages";

export default function ManageSubscriptionPage() {
  const router = useRouter();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  const { data: subscription, isLoading: isLoadingSubscription } = useSubscription();
  const { data: activePlan } = useActivePlan();
  const { data: packages } = usePackages();
  const cancelSubscription = useCancelSubscription();
  
  if (isLoadingSubscription) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-2 items-center">
          <div className="h-3 w-3 bg-primary rounded-full"></div>
          <div className="h-3 w-3 bg-primary rounded-full"></div>
          <div className="h-3 w-3 bg-primary rounded-full"></div>
          <span className="text-muted-foreground text-sm ml-2">Loading subscription data...</span>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              You don't have an active subscription plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No subscription found</h3>
                <p className="text-muted-foreground mb-6">
                  You currently don't have any active subscription or trial.
                </p>
                <Button 
                  onClick={() => router.push('/dashboard/billing')}
                  className="mt-2"
                >
                  View Available Plans
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format dates for display
  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp * 1000), 'dd MMM yyyy');
  };

  const isTrialing = subscription.subscription_status === 'trialing';
  const isCanceled = subscription.cancel_at_period_end;
  
  // Calculate trial progress if applicable
  let trialProgress = 0;
  let daysRemaining = 0;
  
  if (isTrialing && subscription.trial_end) {
    const trialStartDate = new Date(subscription.trial_start! * 1000);
    const trialEndDate = new Date(subscription.trial_end * 1000);
    const today = new Date();
    
    const totalDays = Math.round((trialEndDate.getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24));
    daysRemaining = Math.max(0, Math.round((trialEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const daysUsed = totalDays - daysRemaining;
    
    trialProgress = Math.round((daysUsed / totalDays) * 100);
  }

  // Get the plan details
  const currentPackage = packages?.find(
    (pkg) => pkg.id === subscription.price_id
  );

  const handleCancelSubscription = async () => {
    try {
      setIsCancelling(true);
      await cancelSubscription.mutateAsync();
      
      toast.success('Subscription cancelled', {
        description: 'Your subscription will end at the current billing period.'
      });
      
      setCancelDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error('Failed to cancel subscription', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>
            View and manage your current subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Information */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-primary mr-3" />
                <h3 className="font-semibold">{currentPackage?.name || activePlan || 'Current Plan'}</h3>
              </div>
              <div>
                {isTrialing ? (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs rounded-full font-medium">
                    Trial
                  </span>
                ) : isCanceled ? (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 text-xs rounded-full font-medium">
                    Cancelled
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 text-xs rounded-full font-medium">
                    Active
                  </span>
                )}
              </div>
            </div>
            
            {currentPackage && (
              <div className="text-sm text-muted-foreground mb-4">
                Up to {currentPackage.product_limit} products
              </div>
            )}
            
            {/* Trial info if applicable */}
            {isTrialing && (
              <>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Trial Progress</span>
                    <span className={daysRemaining <= 2 ? "text-destructive font-medium" : ""}>
                      {daysRemaining} days remaining
                    </span>
                  </div>
                  <Progress value={trialProgress} className="h-2" />
                </div>
                
                {daysRemaining <= 2 && (
                  <div className="flex items-start mt-3 p-2 bg-destructive/10 rounded text-sm">
                    <AlertTriangle className="h-4 w-4 text-destructive mr-2 mt-0.5 shrink-0" />
                    <p>Your trial is ending soon. Add your payment details to continue your subscription.</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Payment details */}
          {subscription.payment_method_last4 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Payment Method</h3>
              <div className="flex items-center">
                <div className="bg-muted p-3 rounded-lg">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="ml-3">
                  <p className="font-medium capitalize">
                    {subscription.payment_method_brand || 'Card'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ending in {subscription.payment_method_last4}
                  </p>
                </div>
                <Button className="ml-auto" variant="outline" size="sm">
                  Update
                </Button>
              </div>
            </div>
          )}

          {/* Subscription details */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Subscription Details</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-muted p-2 rounded-lg mr-3">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">
                    {isTrialing ? 'Trial Period' : 'Billing Period'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-muted p-2 rounded-lg mr-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-sm text-muted-foreground">
                    {isCanceled 
                      ? 'Cancelled (access until end of current period)' 
                      : isTrialing
                        ? 'On trial (automatic renewal unless cancelled)'
                        : 'Active (automatic renewal)'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Warning section for cancellation */}
          {!isCanceled && (
            <div className="border-t pt-4">
              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-3" />
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-300">Want to cancel?</h4>
                    <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                      {isTrialing
                        ? "You can cancel your trial at any time. You'll continue to have access until the trial ends."
                        : "You can cancel your subscription at any time. You'll continue to have access until the end of your current billing period."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-3 border-t p-6">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/billing')}
          >
            Change Plan
          </Button>
          
          {!isCanceled && (
            <Button 
              variant="destructive" 
              onClick={() => setCancelDialogOpen(true)}
            >
              {isTrialing ? 'Cancel Trial' : 'Cancel Subscription'}
            </Button>
          )}
          
          {isCanceled && (
            <Button>
              Reactivate Subscription
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Cancellation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isTrialing ? 'Cancel Your Trial?' : 'Cancel Your Subscription?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isTrialing
                ? "If you cancel, you'll still have access until your trial ends on " + formatDate(subscription.current_period_end) + ". You won't be charged."
                : "If you cancel, you'll still have access until the end of your current billing period on " + formatDate(subscription.current_period_end) + ". After that, your subscription will end."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelSubscription}
              className="bg-destructive text-destructive-foreground"
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}