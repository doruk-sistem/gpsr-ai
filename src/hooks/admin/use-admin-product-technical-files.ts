"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase/client";

export interface TechnicalFile {
  id: string;
  product_id: string;
  file_type: string;
  file_url?: string;
  not_required: boolean;
  not_required_reason?: string;
  created_at: string;
  updated_at: string;
}

export const useAdminProductTechnicalFiles = (productId: string | null) => {
  return useQuery({
    queryKey: ['admin', 'product-technical-files', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      try {
        const { data, error } = await supabase
          .from('product_technical_files')
          .select('*')
          .eq('product_id', productId)
          .is('deleted_at', null);

        if (error) throw error;
        
        return data as TechnicalFile[];
      } catch (error) {
        console.error("Error fetching admin product technical files:", error);
        throw error;
      }
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};