import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import productRegulationsService from "@/lib/services/product-regulations-service";

export const useProductRegulations = (productId: string) => {
  return useQuery({
    queryKey: ["product-regulations", productId],
    queryFn: () => productRegulationsService.getProductRegulations(productId),
    enabled: !!productId,
  });
};

export const useAddProductRegulation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      regulationId,
    }: {
      productId: string;
      regulationId: number;
    }) =>
      productRegulationsService.addProductRegulation(productId, regulationId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-regulations", variables.productId],
      });
    },
  });
};

export const useRemoveProductRegulation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      regulationId,
    }: {
      productId: string;
      regulationId: number;
    }) =>
      productRegulationsService.removeProductRegulation(
        productId,
        regulationId
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-regulations", variables.productId],
      });
    },
  });
};
