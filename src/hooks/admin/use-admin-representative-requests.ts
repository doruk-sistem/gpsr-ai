"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { type Representative } from "@/lib/services/representative-request-service";
import sh from "@/lib/utils/supabase-helper";

interface RequestParams {
  search?: string;
  status?: Representative["status"];
  region?: Representative["region"];
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export const useAdminRepresentativeRequests = (params: RequestParams = {}) => {
  const queryClient = useQueryClient();
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;

  const query = useQuery({
    queryKey: ["admin", "representative-requests", params],
    queryFn: async () => {
      try {
        let query = supabase
          .from("authorised_representative_requests")
          .select("*", { count: "exact" });

        // Apply search filter
        if (params.search) {
          query = query.or(
            `company_name.ilike.%${params.search}%,contact_name.ilike.%${params.search}%,contact_email.ilike.%${params.search}%`
          );
        }

        // Apply status filter
        if (params.status) {
          query = query.eq("status", params.status);
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

        // Get paginated result
        return sh.getPaginationResult<Representative>(query, {
          page,
          pageSize,
        });
      } catch (error) {
        console.error("Error fetching admin representative requests:", error);
        throw error;
      }
    },
  });

  const updateRequestStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("authorised_representative_requests")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "representative-requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "representative-request", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "pending-requests"],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });

  return {
    ...query,
    updateRequestStatus,
  };
};
