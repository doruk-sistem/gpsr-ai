import productQuestionsService, {
  ProductQuestion,
  ProductQuestionsByCategoryAndProductTypeRequest,
} from "@/lib/services/product-questions-service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useQuestions = () => {
  return useQuery({
    queryKey: ["product-questions"],
    queryFn: () => productQuestionsService.getQuestions(),
  });
};

export const useQuestionsByCategoryAndProductType = (
  params: ProductQuestionsByCategoryAndProductTypeRequest
) => {
  return useQuery({
    queryKey: ["product-questions-by-product-type", params],
    queryFn: () =>
      productQuestionsService.getQuestionsByCategoryAndProductType(params),
    enabled: !!params.categoryId && !!params.productTypeId,
  });
};

export const useQuestionsByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ["product-questions-by-category", categoryId],
    queryFn: () => productQuestionsService.getQuestionsByCategory(categoryId),
    enabled: !!categoryId,
  });
};

export const useQuestionsByProductType = (productTypeId: number) => {
  return useQuery({
    queryKey: ["product-questions-by-product-type", productTypeId],
    queryFn: () =>
      productQuestionsService.getQuestionsByProductType(productTypeId),
    enabled: !!productTypeId,
  });
};

export const useQuestion = (id: string) => {
  return useQuery({
    queryKey: ["product-question", id],
    queryFn: () => productQuestionsService.getQuestionById(id),
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
    ) => productQuestionsService.createQuestion(data),
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
    }) => productQuestionsService.updateQuestion(id, question),
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
    mutationFn: (id: string) => productQuestionsService.deleteQuestion(id),
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
