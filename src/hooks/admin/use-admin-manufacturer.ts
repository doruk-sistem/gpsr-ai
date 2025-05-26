"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase/client";

export const useAdminManufacturer = (manufacturerId: string | null) => {
  return useQuery({
    queryKey: ['admin', 'manufacturer', manufacturerId],
    queryFn: async () => {
      if (!manufacturerId) return null;
      
      try {
        const { data, error } = await supabase
          .from('manufacturers')
          .select(`
            *,
            auth_users:user_id (
              email,
              user_metadata
            )
          `)
          .eq('id', manufacturerId)
          .single();

        if (error) throw error;
        
        // Reshape the data to match our interface
        return {
          ...data,
          user: data.auth_users ? {
            email: data.auth_users.email,
            user_metadata: data.auth_users.user_metadata
          } : undefined
        };
      } catch (error) {
        console.error("Error fetching admin manufacturer:", error);
        throw error;
      }
    },
    enabled: !!manufacturerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};