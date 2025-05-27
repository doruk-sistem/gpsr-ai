"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase/client";

export interface AdminStats {
  totalUsers: number;
  usersTrend: number;
  usersTrendPercentage: number;
  
  totalProducts: number;
  productsTrend: number;
  productsTrendPercentage: number;
  
  totalManufacturers: number;
  manufacturersTrend: number;
  manufacturersTrendPercentage: number;
  
  pendingRequests: number;
  requestsTrend: number;
  requestsTrendPercentage: number;
}

export const useAdminStats = () => {
  // This would normally fetch real data from the API
  // For demo purposes, we'll use mock data
  
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      try {
        // Count total users
        const { count: userCount, error: userError } = await supabase
          .from('auth.users')
          .select('*', { count: 'exact', head: true });

        if (userError) throw userError;

        // Count products
        const { count: productCount, error: productError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        if (productError) throw productError;

        // Count manufacturers
        const { count: manufacturerCount, error: manufacturerError } = await supabase
          .from('manufacturers')
          .select('*', { count: 'exact', head: true });

        if (manufacturerError) throw manufacturerError;

        // Count pending representative requests
        const { count: pendingRequestsCount, error: pendingRequestsError } = await supabase
          .from('authorised_representative_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (pendingRequestsError) throw pendingRequestsError;

        // Mock trend data
        const stats: AdminStats = {
          totalUsers: userCount || 0,
          usersTrend: 5,
          usersTrendPercentage: 12,
          
          totalProducts: productCount || 0,
          productsTrend: 8,
          productsTrendPercentage: 15,
          
          totalManufacturers: manufacturerCount || 0,
          manufacturersTrend: 3,
          manufacturersTrendPercentage: 9,
          
          pendingRequests: pendingRequestsCount || 0,
          requestsTrend: -1,
          requestsTrendPercentage: -5,
        };

        return stats;
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};