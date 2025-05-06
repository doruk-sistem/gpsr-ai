// src/hooks/use-stripe.ts
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import stripeService from "@/lib/services/stripe-service";

export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: () => stripeService.getSubscription(),
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
    }: {
      priceId: string;
      mode: "payment" | "subscription";
    }) => stripeService.createCheckoutSession(priceId, mode),
  });
};

export const useTrialStatus = () => {
  return useQuery({
    queryKey: ["trial-status"],
    queryFn: () => stripeService.getTrialStatus(),
  });
};

export const useCancelSubscription = () => {
  return useMutation({
    mutationFn: () => stripeService.cancelSubscription(),
  });
};