"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import productsService, {
  CreateProductRequest,
  UpdateProductRequest,
} from "@/lib/services/products-service";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => productsService.getProducts(),
  });
};

export const useProductsCount = () => {
  return useQuery({
    queryKey: ["products-count"],
    queryFn: () => productsService.getProductsCount(),
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
    mutationFn: (data: CreateProductRequest) =>
      productsService.createProduct(data),
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["products-count"],
        refetchType: "all",
      });

      if (newProduct && newProduct.id) {
        queryClient.invalidateQueries({
          queryKey: ["product", newProduct.id],
          refetchType: "all",
        });
      }
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      product,
    }: {
      id: string;
      product: UpdateProductRequest;
    }) => productsService.updateProduct(id, product),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["products-count"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.id],
        refetchType: "all",
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsService.deleteProduct(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["products-count"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["product", id],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["product-question-answers", id],
        refetchType: "all",
      });
    },
  });
};
