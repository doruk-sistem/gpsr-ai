"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

interface ManufacturersParams {
  search?: string;
  country?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export const useAdminManufacturers = (params: ManufacturersParams = {}) => {
  return useQuery({
    queryKey: ["admin", "manufacturers", params],
    queryFn: async () => {
      try {
        let query = supabase.from("manufacturers").select(`
            *,
            auth_users:user_id (
              email,
              user_metadata
            )
          `);

        // Apply search filter
        if (params.search) {
          query = query.or(
            `name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone.ilike.%${params.search}%`
          );
        }

        // Apply country filter
        if (params.country) {
          query = query.eq("country", params.country);
        }

        // Apply sorting
        if (params.sort) {
          const order = params.order || "asc";
          query = query.order(params.sort, { ascending: order === "asc" });
        } else {
          query = query.order("created_at", { ascending: false });
        }

        const { data, error } = await query;

        if (error) throw error;

        // Add product count to each manufacturer
        const manufacturerIds = data.map((m) => m.id);

        if (manufacturerIds.length > 0) {
          const { data: productCounts, error: productsError } = await supabase
            .from("products")
            .select("manufacturer_id, count:count(*)")
            .in("manufacturer_id", manufacturerIds);

          if (!productsError && productCounts) {
            // Create a map of manufacturer_id to count
            const countsMap = Object.fromEntries(
              (
                productCounts as unknown as {
                  manufacturer_id: string;
                  count: number;
                }[]
              ).map((p) => [p.manufacturer_id, p.count])
            );

            // Add the count to each manufacturer
            return data.map((manufacturer) => ({
              ...manufacturer,
              user: manufacturer.auth_users
                ? {
                    email: manufacturer.auth_users.email,
                    user_metadata: manufacturer.auth_users.user_metadata,
                  }
                : undefined,
              product_count: countsMap[manufacturer.id] || 0,
            }));
          }
        }

        // If we couldn't get product counts, return manufacturers with count = 0
        return data.map((manufacturer) => ({
          ...manufacturer,
          user: manufacturer.auth_users
            ? {
                email: manufacturer.auth_users.email,
                user_metadata: manufacturer.auth_users.user_metadata,
              }
            : undefined,
          product_count: 0,
        }));
      } catch (error) {
        console.error("Error fetching admin manufacturers:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
