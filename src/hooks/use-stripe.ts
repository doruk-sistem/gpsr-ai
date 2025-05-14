// src/hooks/use-stripe.ts
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import stripeService from "@/lib/services/stripe-service";
import {
  StripeCheckoutSessionRequest,
  SubscriptionRequest,
} from "@/lib/services/stripe-service/types";

export const useSubscription = (params?: SubscriptionRequest) => {
  return useQuery({
    queryKey: ["subscription", params],
    queryFn: () => stripeService.getSubscription(params),
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => stripeService.getOrders(),
  });
};

export const useActivePlan = () => {
  return useQuery({
    queryKey: ["active-plan"],
    queryFn: () => stripeService.getActivePlan(),
  });
};

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: ({
      priceId,
      mode,
      promotion_code,
      trial_period_days,
    }: StripeCheckoutSessionRequest) =>
      stripeService.createCheckoutSession(priceId, mode, {
        promotion_code,
        trial_period_days,
      }),
  });
};

export const useTrialStatus = () => {
  return useQuery({
    queryKey: ["trial-status"],
    queryFn: () => stripeService.getTrialStatus(),
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

export const useCancelSubscription = () => {
  return useMutation({
    mutationFn: stripeService.cancelSubscription,
  });
};

export const useStripeProducts = () => {
  return useQuery({
    queryKey: ["stripe-products"],
    queryFn: () => stripeService.getStripeProducts(),
  });
};

export const useCreateCustomerPortalSession = () => {
  return useMutation({
    mutationFn: (options?: { return_url?: string }) =>
      stripeService.createCustomerPortalSession(options),
  });
};
