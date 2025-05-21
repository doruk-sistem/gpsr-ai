"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import productsService, { Product } from "@/lib/services/products-service";

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
    mutationFn: (
      data: Omit<Product, "id" | "created_at" | "updated_at" | "user_id">
    ) => productsService.createProduct(data),
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
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      productsService.updateProduct(id, product),
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

// Product Question Answers hooks
export const useProductQuestionAnswers = (productId: string) => {
  return useQuery({
    queryKey: ["product-question-answers", productId],
    queryFn: () => productsService.getProductQuestionAnswers(productId),
    enabled: !!productId,
  });
};

export const useCreateProductQuestionAnswers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      questionAnswers,
    }: {
      productId: string;
      questionAnswers: Array<{ question_id: string; answer: boolean }>;
    }) =>
      productsService.createProductQuestionAnswers(productId, questionAnswers),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-question-answers", variables.productId],
        refetchType: "all",
      });
    },
  });
};

export function useDeleteProductQuestionAnswersByIds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      questionIds,
    }: {
      productId: string;
      questionIds: string[];
    }) => {
      await productsService.deleteProductQuestionAnswersByIds(
        productId,
        questionIds
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-question-answers", variables.productId],
        refetchType: "all",
      });
    },
  });
}
