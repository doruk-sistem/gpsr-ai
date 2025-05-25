"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase/client";

export interface RepresentativeRequestDetail {
  id: string;
  user_id: string;
  region: 'eu' | 'uk';
  // Company details
  company_name: string;
  company_number: string;
  vat_number?: string;
  street_address: string;
  city: string;
  postal_code: string;
  country: string;
  // Contact info
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  contact_position: string;
  // Additional info
  website_url?: string;
  business_role: string;
  // Product details
  product_category: string;
  product_information: string;
  // Compliance details
  ce_ukca_marking: string;
  technical_file_ready: string;
  required_tests_conducted: string;
  test_reports_available: string;
  test_reports_file_url?: string;
  // Confirmations
  confirm_accuracy: boolean;
  confirm_responsibility: boolean;
  confirm_terms: boolean;
  // Status
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  // User info
  user?: {
    email: string;
    user_metadata: {
      first_name?: string;
      last_name?: string;
      company?: string;
    }
  }
}

export const useAdminRepresentativeRequest = (requestId: string | null) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['admin', 'representative-request', requestId],
    queryFn: async () => {
      if (!requestId) return null;
      
      try {
        const { data, error } = await supabase
          .from('authorised_representative_requests')
          .select(`
            *,
            auth_users:user_id (
              email,
              user_metadata
            )
          `)
          .eq('id', requestId)
          .single();

        if (error) throw error;
        
        // Reshape the data to match our interface
        const formattedData: RepresentativeRequestDetail = {
          ...data,
          user: data.auth_users ? {
            email: data.auth_users.email,
            user_metadata: data.auth_users.user_metadata
          } : undefined
        };
        
        delete formattedData.auth_users;
        
        return formattedData;
      } catch (error) {
        console.error("Error fetching admin representative request:", error);
        throw error;
      }
    },
    enabled: !!requestId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateNotes = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { data, error } = await supabase
        .from('authorised_representative_requests')
        .update({ admin_notes: notes, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'representative-request', variables.id] });
    }
  });

  return {
    ...query,
    updateNotes
  };
};