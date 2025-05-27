"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase/client";

export interface PendingRequest {
  id: string;
  company_name: string;
  region: 'eu' | 'uk';
  created_at: string;
  contact_name: string;
  contact_email: string;
  country: string;
}

export const useAdminPendingRequests = (limit: number = 5) => {
  return useQuery({
    queryKey: ['admin', 'pending-requests', limit],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('authorised_representative_requests')
          .select('id, company_name, region, created_at, contact_name, contact_email, country')
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        
        return data as PendingRequest[];
      } catch (error) {
        console.error("Error fetching admin pending requests:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};