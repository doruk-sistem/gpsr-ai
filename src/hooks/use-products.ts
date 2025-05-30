"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import productsService, {
  GetProductByIdParams,
  type CreateProductRequest,
  type GetProductsParams,
  type SaveDefaultDirectivesRegulationsStandardsRequest,
  type UpdateProductRequest,
} from "@/lib/services/products-service";

export const useProducts = (params: GetProductsParams = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsService.getProducts(params),
  });
};

export const useProductsCount = () => {
  return useQuery({
    queryKey: ["products-count"],
    queryFn: () => productsService.getProductsCount(),
  });
};

export const useProductById = (
  id: string,
  params: GetProductByIdParams = {}
) => {
  return useQuery({
    queryKey: ["product", id, params],
    queryFn: () => productsService.getProductById(id, params),
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
        queryKey: ["product-question-answers", id],
        refetchType: "all",
      });
    },
  });
};

export const useSaveDefaultDirectivesRegulationsStandards = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveDefaultDirectivesRegulationsStandardsRequest) =>
      productsService.saveDefaultDirectivesRegulationsStandards(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product", variables.userProductId],
        refetchType: "active",
      });
    },
  });
};
