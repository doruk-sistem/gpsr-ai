"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Manufacturer } from "@/lib/services/manufacturers-service";

export const useAdminManufacturer = (manufacturerId: string | null) => {
  return useQuery({
    queryKey: ["admin", "manufacturer", manufacturerId],
    queryFn: async () => {
      if (!manufacturerId) return null;

      try {
        const { data, error } = await supabase
          .from("manufacturers")
          .select("*")
          .eq("id", manufacturerId)
          .single();

        if (error) throw error;

        // Reshape the data to match our interface
        return data as Manufacturer;
      } catch (error) {
        console.error("Error fetching admin manufacturer:", error);
        throw error;
      }
    },
    enabled: !!manufacturerId,
  });
};
