import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import productStandardsService from "@/lib/services/product-standards-service";

export const useProductStandards = (productId: string) => {
  return useQuery({
    queryKey: ["product-standards", productId],
    queryFn: () => productStandardsService.getProductStandards(productId),
    enabled: !!productId,
  });
};

export const useAddProductStandard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      standardId,
    }: {
      productId: string;
      standardId: string;
    }) => productStandardsService.addProductStandard(productId, standardId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-standards", variables.productId],
      });
    },
  });
};

export const useRemoveProductStandard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      standardId,
    }: {
      productId: string;
      standardId: string;
    }) => productStandardsService.removeProductStandard(productId, standardId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-standards", variables.productId],
      });
    },
  });
};
