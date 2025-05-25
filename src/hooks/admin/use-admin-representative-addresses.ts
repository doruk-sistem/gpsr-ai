"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export interface RepresentativeAddress {
  id: string;
  user_id: string;
  region: "eu" | "uk";
  company_name: string;
  company_address: string;
  company_logo_url: string | null;
  country: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    user_metadata: {
      first_name?: string;
      last_name?: string;
      company?: string;
    };
  };
}

interface AddressParams {
  search?: string;
  region?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export const useAdminRepresentativeAddresses = (params: AddressParams = {}) => {
  return useQuery({
    queryKey: ["admin", "representative-addresses", params],
    queryFn: async () => {
      try {
        let query = supabase.from("authorised_representative_addresses")
          .select(`
            *,
            auth_users:user_id (
              email,
              user_metadata
            )
          `);

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
        if (params.sort) {
          const order = params.order || "asc";
          query = query.order(params.sort, { ascending: order === "asc" });
        } else {
          query = query.order("created_at", { ascending: false });
        }

        const { data, error } = await query;

        if (error) throw error;

        // Reshape the data to match our interface
        const formattedData: RepresentativeAddress[] = data.map((item) => {
          const formattedItem: RepresentativeAddress = {
            ...item,
            user: item.auth_users
              ? {
                  email: item.auth_users.email,
                  user_metadata: item.auth_users.user_metadata,
                }
              : undefined,
          };

          return formattedItem;
        });

        return formattedData;
      } catch (error) {
        console.error("Error fetching admin representative addresses:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
