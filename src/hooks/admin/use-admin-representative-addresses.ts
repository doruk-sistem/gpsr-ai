"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

import { type RepresentativeAddress } from "@/lib/services/representative-address-service";
import sh from "@/lib/utils/supabase-helper";

interface AddressParams {
  search?: string;
  region?: string;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export const useAdminRepresentativeAddresses = (params: AddressParams = {}) => {
  return useQuery({
    queryKey: ["admin", "representative-addresses", params],
    queryFn: async () => {
      try {
        let query = supabase
          .from("authorised_representative_addresses")
          .select(`*`, { count: "exact" });

        // Apply search filter
        if (params.search) {
          query = query.or(
            `company_name.ilike.%${params.search}%,country.ilike.%${params.search}%`
          );
        }

        // Apply region filter
        if (params.region) {
          query = query.eq("region", params.region);
        }

        // Apply sorting
        query = sh.applySort(query, {
          sort: params.sort,
          order: params.order,
          defaultSort: "created_at",
          defaultOrder: "desc",
        });

        return sh.getPaginationResult<RepresentativeAddress>(query, {
          page: params.page,
          pageSize: params.pageSize,
        });
      } catch (error) {
        console.error("Error fetching admin representative addresses:", error);
        throw error;
      }
    },
  });
};
