"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase/client";

interface ProductsParams {
  search?: string;
  category?: string;
  requireCeMarking?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
}

export const useAdminProducts = (params: ProductsParams = {}) => {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: async () => {
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            product_categories (*),
            product_types (*),
            manufacturers (*)
          `);

        // Apply search filter
        if (params.search) {
          query = query.or(
            `name.ilike.%${params.search}%,model_name.ilike.%${params.search}%,batch_number.ilike.%${params.search}%`
          );
        }

        // Apply category filter
        if (params.category) {
          query = query.eq('product_categories.name', params.category);
        }

        // Apply CE/UKCA marking filter
        if (params.requireCeMarking !== undefined) {
          query = query.eq('require_ce_ukca_marking', params.requireCeMarking);
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
        
        return data;
      } catch (error) {
        console.error("Error fetching admin products:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};