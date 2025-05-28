"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export const useAdminProduct = (productId: string | null) => {
  return useQuery({
    queryKey: ["admin", "product", productId],
    queryFn: async () => {
      if (!productId) return null;

      try {
        const { data, error } = await supabase
          .from("user_products")
          .select(
            `
            *,
            product_categories (*),
            product_types (*),
            manufacturers (*)
          `
          )
          .eq("id", productId)
          .single();

        if (error) throw error;

        return data;
      } catch (error) {
        console.error("Error fetching admin product:", error);
        throw error;
      }
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
