"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import productsService, { Product } from "@/lib/services/products-service";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => productsService.getProducts(),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsService.getProductById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Product, "id" | "created_at" | "updated_at">) =>
      productsService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
        refetchType: "all",
      });
      queryClient.refetchQueries({
        queryKey: ["products"],
        type: "active",
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      productsService.updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
        refetchType: "all",
      });
      queryClient.refetchQueries({
        queryKey: ["products"],
        type: "active",
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
