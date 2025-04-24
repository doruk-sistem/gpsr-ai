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
      data: Omit<Manufacturer, "id" | "created_at" | "updated_at">
    ) => manufacturersService.createManufacturer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["manufacturers"],
        refetchType: "all",
      });
      queryClient.refetchQueries({
        queryKey: ["manufacturers"],
        type: "active",
      });
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["manufacturers"],
        refetchType: "all",
      });
      queryClient.refetchQueries({
        queryKey: ["manufacturers"],
        type: "active",
      });
    },
  });
};

export const useDeleteManufacturer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => manufacturersService.deleteManufacturer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
    },
  });
};
