"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

import { Representative } from "@/lib/services/representative-request-service";

export const useAdminRepresentativeRequest = (requestId: string | null) => {
  const query = useQuery({
    queryKey: ["admin", "representative-request", requestId],
    queryFn: async () => {
      if (!requestId) return null;

      try {
        const { data, error } = await supabase
          .from("authorised_representative_requests")
          .select(`*`)
          .eq("id", requestId)
          .single();

        if (error) throw error;

        return data as Representative;
      } catch (error) {
        console.error("Error fetching admin representative request:", error);
        throw error;
      }
    },
    enabled: !!requestId,
  });

  return query;
};
