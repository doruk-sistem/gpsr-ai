import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import productDirectivesService from "@/lib/services/product-directives-service";

export const useProductDirectives = (productId: string) => {
  return useQuery({
    queryKey: ["product-directives", productId],
    queryFn: () => productDirectivesService.getProductDirectives(productId),
    enabled: !!productId,
  });
};

export const useAddProductDirective = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      directiveId,
    }: {
      productId: string;
      directiveId: number;
    }) => productDirectivesService.addProductDirective(productId, directiveId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-directives", variables.productId],
      });
    },
  });
};

export const useRemoveProductDirective = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      directiveId,
    }: {
      productId: string;
      directiveId: number;
    }) =>
      productDirectivesService.removeProductDirective(productId, directiveId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-directives", variables.productId],
      });
    },
  });
};
