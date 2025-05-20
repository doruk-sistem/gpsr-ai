"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import productCategoriesService from "@/lib/services/product-categories-service";
import type {
  ProductCategoriesRequest,
  ProductQuestionsByCategoryAndProductTypeRequest,
  ProductType,
  ProductTypesRequest,
  ProductQuestion,
  ProductTypesByCategoryRequest,
} from "@/lib/services/product-categories-service/types";

// ===============================
// Product Categories Hooks
// ===============================
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

// ===============================
// Product Types Hooks
// ===============================
export const useProductTypes = (params: ProductTypesRequest) => {
  return useQuery({
    queryKey: ["product-types", params],
    queryFn: () => productCategoriesService.getProductTypes(params),
  });
};

export const useProductTypesByCategory = (
  params: ProductTypesByCategoryRequest
) => {
  return useQuery({
    queryKey: ["product-types-by-category", params],
    queryFn: () => productCategoriesService.getProductTypesByCategory(params),
    enabled: !!params.categoryId,
  });
};

export const useProductType = (id: number) => {
  return useQuery({
    queryKey: ["product-type", id],
    queryFn: () => productCategoriesService.getProductTypeById(id),
    enabled: !!id,
  });
};

export const useCreateProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<
        ProductType,
        "id" | "created_at" | "updated_at" | "deleted_at" | "user_id"
      >
    ) => productCategoriesService.createProductType(data),
    onSuccess: (newProductType) => {
      queryClient.invalidateQueries({
        queryKey: ["product-types"],
        refetchType: "all",
      });

      if (newProductType && newProductType.id) {
        queryClient.invalidateQueries({
          queryKey: ["product-type", newProductType.id],
          refetchType: "all",
        });
      }

      if (newProductType && newProductType.category_id) {
        queryClient.invalidateQueries({
          queryKey: ["product-types-by-category", newProductType.category_id],
          refetchType: "all",
        });
      }
    },
  });
};

export const useUpdateProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      productType,
    }: {
      id: number;
      productType: Partial<
        Omit<
          ProductType,
          "id" | "created_at" | "updated_at" | "deleted_at" | "user_id"
        >
      >;
    }) => productCategoriesService.updateProductType(id, productType),
    onSuccess: (updatedProductType, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-types"],
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["product-type", variables.id],
        refetchType: "all",
      });

      if (updatedProductType && updatedProductType.category_id) {
        queryClient.invalidateQueries({
          queryKey: [
            "product-types-by-category",
            updatedProductType.category_id,
          ],
          refetchType: "all",
        });
      }
    },
  });
};

export const useDeleteProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productCategoriesService.deleteProductType(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["product-types"],
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["product-type", id],
        refetchType: "all",
      });

      // Since we can't know the category_id here, invalidate all by-category queries
      queryClient.invalidateQueries({
        queryKey: ["product-types-by-category"],
        refetchType: "all",
      });
    },
  });
};

// ===============================
// Product Questions Hooks
// ===============================
export const useQuestions = () => {
  return useQuery({
    queryKey: ["product-questions"],
    queryFn: () => productCategoriesService.getQuestions(),
  });
};

export const useQuestionsByCategoryAndProductType = (
  params: ProductQuestionsByCategoryAndProductTypeRequest
) => {
  return useQuery({
    queryKey: ["product-questions-by-product-type", params],
    queryFn: () =>
      productCategoriesService.getQuestionsByCategoryAndProductType(params),
    enabled: !!params.categoryId && !!params.productTypeId,
  });
};

export const useQuestionsByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ["product-questions-by-category", categoryId],
    queryFn: () => productCategoriesService.getQuestionsByCategory(categoryId),
    enabled: !!categoryId,
  });
};

export const useQuestionsByProductType = (productTypeId: number) => {
  return useQuery({
    queryKey: ["product-questions-by-product-type", productTypeId],
    queryFn: () =>
      productCategoriesService.getQuestionsByProductType(productTypeId),
    enabled: !!productTypeId,
  });
};

export const useQuestion = (id: string) => {
  return useQuery({
    queryKey: ["product-question", id],
    queryFn: () => productCategoriesService.getQuestionById(id),
    enabled: !!id,
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<
        ProductQuestion,
        "id" | "created_at" | "updated_at" | "deleted_at" | "user_id"
      >
    ) => productCategoriesService.createQuestion(data),
    onSuccess: (newQuestion) => {
      queryClient.invalidateQueries({
        queryKey: ["product-questions"],
        refetchType: "all",
      });

      if (newQuestion && newQuestion.id) {
        queryClient.invalidateQueries({
          queryKey: ["product-question", newQuestion.id],
          refetchType: "all",
        });
      }

      if (newQuestion && newQuestion.category_id) {
        queryClient.invalidateQueries({
          queryKey: ["product-questions-by-category", newQuestion.category_id],
          refetchType: "all",
        });
      }

      if (newQuestion && newQuestion.product_id) {
        queryClient.invalidateQueries({
          queryKey: [
            "product-questions-by-product-type",
            newQuestion.product_id,
          ],
          refetchType: "all",
        });
      }
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      question,
    }: {
      id: string;
      question: Partial<
        Omit<
          ProductQuestion,
          "id" | "created_at" | "updated_at" | "deleted_at" | "user_id"
        >
      >;
    }) => productCategoriesService.updateQuestion(id, question),
    onSuccess: (updatedQuestion, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-questions"],
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["product-question", variables.id],
        refetchType: "all",
      });

      if (updatedQuestion && updatedQuestion.category_id) {
        queryClient.invalidateQueries({
          queryKey: [
            "product-questions-by-category",
            updatedQuestion.category_id,
          ],
          refetchType: "all",
        });
      }

      if (updatedQuestion && updatedQuestion.product_id) {
        queryClient.invalidateQueries({
          queryKey: [
            "product-questions-by-product-type",
            updatedQuestion.product_id,
          ],
          refetchType: "all",
        });
      }
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productCategoriesService.deleteQuestion(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["product-questions"],
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["product-question", id],
        refetchType: "all",
      });

      // Since we can't know the category_id and product_id here, invalidate all related queries
      queryClient.invalidateQueries({
        queryKey: ["product-questions-by-category"],
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["product-questions-by-product-type"],
        refetchType: "all",
      });
    },
  });
};
