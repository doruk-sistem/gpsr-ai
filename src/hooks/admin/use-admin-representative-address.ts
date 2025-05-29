import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { RepresentativeAddress } from "@/lib/services/representative-address-service";

export const useAdminRepresentativeAddress = (addressId: string | null) => {
  return useQuery({
    queryKey: ["admin", "representative-address", addressId],
    queryFn: async () => {
      if (!addressId) return null;

      try {
        const { data, error } = await supabase
          .from("authorised_representative_addresses")
          .select(`*`)
          .eq("id", addressId)
          .single();

        if (error) throw error;

        return data as RepresentativeAddress;
      } catch (error) {
        console.error("Error fetching representative address:", error);
        throw error;
      }
    },
    enabled: !!addressId,
  });
};
