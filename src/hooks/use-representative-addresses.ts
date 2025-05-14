"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import representativeAddressService, {
  RepresentativeAddress,
  RepresentativeRegion,
} from "@/lib/services/representative-address-service";

export const useRepresentativeAddresses = () => {
  return useQuery({
    queryKey: ["representative-addresses"],
    queryFn: () => representativeAddressService.getAddressesByUser(),
  });
};

export const useRepresentativeAddressByRegion = (
  region: RepresentativeRegion
) => {
  return useQuery({
    queryKey: ["representative-address", region],
    queryFn: () => representativeAddressService.getAddressByRegion(region),
  });
};

export const useRepresentativeAddress = (id: string) => {
  return useQuery({
    queryKey: ["representative-address-detail", id],
    queryFn: () => representativeAddressService.getAddressById(id),
    enabled: !!id,
  });
};

export const useCreateRepresentativeAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<
        RepresentativeAddress,
        "id" | "user_id" | "created_at" | "updated_at" | "is_active"
      >
    ) => representativeAddressService.createAddress(data),
    onSuccess: (newAddress) => {
      queryClient.invalidateQueries({
        queryKey: ["representative-addresses"],
        refetchType: "all",
      });

      if (newAddress && newAddress.id) {
        queryClient.invalidateQueries({
          queryKey: ["representative-address-detail", newAddress.id],
          refetchType: "all",
        });

        if (newAddress.region) {
          queryClient.invalidateQueries({
            queryKey: ["representative-address", newAddress.region],
            refetchType: "all",
          });
        }
      }
    },
  });
};

export const useUpdateRepresentativeAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      address,
    }: {
      id: string;
      address: Partial<RepresentativeAddress>;
    }) => representativeAddressService.updateAddress(id, address),
    onSuccess: (updatedAddress, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["representative-addresses"],
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["representative-address-detail", variables.id],
        refetchType: "all",
      });

      if (updatedAddress && updatedAddress.region) {
        queryClient.invalidateQueries({
          queryKey: ["representative-address", updatedAddress.region],
          refetchType: "all",
        });
      }
    },
  });
};

export const useDeleteRepresentativeAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => representativeAddressService.deleteAddress(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["representative-addresses"],
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["representative-address-detail", id],
        refetchType: "all",
      });

      // Invalidate region-specific queries
      // Since we don't know the region of the deleted address here, we invalidate both
      queryClient.invalidateQueries({
        queryKey: ["representative-address", "eu"],
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["representative-address", "uk"],
        refetchType: "all",
      });
    },
  });
};
