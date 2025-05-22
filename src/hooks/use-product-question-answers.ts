"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import productQuestionAnswersService from "@/lib/services/product-question-answers-service";

export const useProductQuestionAnswers = (productId: string) => {
  return useQuery({
    queryKey: ["product-question-answers", productId],
    queryFn: () =>
      productQuestionAnswersService.getProductQuestionAnswers(productId),
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
      productQuestionAnswersService.createProductQuestionAnswers(
        productId,
        questionAnswers
      ),
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
      await productQuestionAnswersService.deleteProductQuestionAnswersByIds(
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
