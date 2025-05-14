"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import manufacturersService, {
  Manufacturer,
} from "@/lib/services/manufacturers-service";

export const useManufacturers = () => {
  return useQuery({
    queryKey: ["manufacturers"],
    queryFn: () => manufacturersService.getManufacturers(),
  });
};

export const useManufacturer = (id: string) => {
  return useQuery({
    queryKey: ["manufacturer", id],
    queryFn: () => manufacturersService.getManufacturerById(id),
    enabled: !!id,
  });
};

export const useCreateManufacturer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<Manufacturer, "id" | "created_at" | "updated_at" | "user_id">
    ) => manufacturersService.createManufacturer(data),
    onSuccess: (newManufacturer) => {
      queryClient.invalidateQueries({
        queryKey: ["manufacturers"],
        refetchType: "all",
      });

      if (newManufacturer && newManufacturer.id) {
        queryClient.invalidateQueries({
          queryKey: ["manufacturer", newManufacturer.id],
          refetchType: "all",
        });
      }
    },
  });
};

export const useUpdateManufacturer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      manufacturer,
    }: {
      id: string;
      manufacturer: Partial<Manufacturer>;
    }) => manufacturersService.updateManufacturer(id, manufacturer),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["manufacturers"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["manufacturer", variables.id],
        refetchType: "all",
      });
    },
  });
};

export const useDeleteManufacturer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => manufacturersService.deleteManufacturer(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["manufacturers"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["manufacturer", id],
        refetchType: "all",
      });
    },
  });
};
