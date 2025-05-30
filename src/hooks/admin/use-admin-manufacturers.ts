"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import supabaseHelper from "@/lib/utils/supabase-helper";
import { Manufacturer } from "@/lib/services/manufacturers-service";

interface ManufacturersParams {
  search?: string;
  country?: string;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export const useAdminManufacturers = (params: ManufacturersParams = {}) => {
  return useQuery({
    queryKey: ["admin", "manufacturers", params],
    queryFn: async () => {
      try {
        let query = supabase
          .from("manufacturers")
          .select("*", { count: "exact" });

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
        await supabaseHelper.applySort(query, {
          sort: params.sort,
          order: params.order,
          defaultSort: "created_at",
          defaultOrder: "desc",
        });

        return supabaseHelper.getPaginationResult<Manufacturer>(query, {
          page: params.page,
          pageSize: params.pageSize,
        });
      } catch (error) {
        console.error("Error fetching admin manufacturers:", error);
        throw error;
      }
    },
  });
};
