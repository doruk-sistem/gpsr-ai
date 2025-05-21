"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import productCategoriesService from "@/lib/services/product-categories-service";
import type { ProductCategoriesRequest } from "@/lib/services/product-categories-service";

export const useCategories = (params?: ProductCategoriesRequest) => {
  return useQuery({
    queryKey: ["product-categories", params],
    queryFn: () => productCategoriesService.getCategories(params),
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ["product-category", id],
    queryFn: () => productCategoriesService.getCategoryById(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => productCategoriesService.createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-categories"],
        refetchType: "all",
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      productCategoriesService.updateCategory(id, name),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-categories"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["product-category", variables.id],
        refetchType: "all",
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productCategoriesService.deleteCategory(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["product-categories"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["product-category", id],
        refetchType: "all",
      });
    },
  });
};
