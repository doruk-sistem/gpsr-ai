"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase/client";

export interface RepresentativeRequest {
  id: string;
  region: 'eu' | 'uk';
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  business_role: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
}

interface RequestParams {
  search?: string;
  status?: string;
  region?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export const useAdminRepresentativeRequests = (params: RequestParams = {}) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['admin', 'representative-requests', params],
    queryFn: async () => {
      try {
        let query = supabase
          .from('authorised_representative_requests')
          .select('*');

        // Apply search filter
        if (params.search) {
          query = query.or(
            `company_name.ilike.%${params.search}%,contact_name.ilike.%${params.search}%,contact_email.ilike.%${params.search}%`
          );
        }

        // Apply status filter
        if (params.status) {
          query = query.eq('status', params.status);
        }

        // Apply region filter
        if (params.region) {
          query = query.eq('region', params.region);
        }

        // Apply sorting
        if (params.sort) {
          const order = params.order || 'asc';
          query = query.order(params.sort, { ascending: order === 'asc' });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;

        if (error) throw error;
        
        return data as RepresentativeRequest[];
      } catch (error) {
        console.error("Error fetching admin representative requests:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateRequestStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('authorised_representative_requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'representative-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    }
  });

  return {
    ...query,
    updateRequestStatus
  };
};