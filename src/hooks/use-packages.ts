"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import packagesService from "@/lib/services/packages-service";
import { Package } from "@/lib/services/packages-service";

export const usePackages = () => {
  return useQuery({
    queryKey: ["packages"],
    queryFn: () => packagesService.getPackages(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const usePackage = (id: string) => {
  return useQuery({
    queryKey: ["package", id],
    queryFn: () => packagesService.getPackageById(id),
    enabled: !!id,
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, pkg }: { id: string; pkg: Partial<Package> }) =>
      packagesService.updatePackage(id, pkg),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => packagesService.deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
};
