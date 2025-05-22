import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import productNotifiedBodiesService, {
  ProductNotifiedBody,
} from "@/lib/services/product-notified-bodies-service";

export const useProductNotifiedBodies = (productId: string) => {
  return useQuery({
    queryKey: ["product-notified-bodies", productId],
    queryFn: () =>
      productNotifiedBodiesService.getProductNotifiedBodies(productId),
    enabled: !!productId,
  });
};

export const useCreateProductNotifiedBody = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      notifiedBody,
      userId,
    }: {
      productId: string;
      notifiedBody: Omit<
        ProductNotifiedBody,
        "id" | "product_id" | "created_at" | "updated_at"
      >;
      userId?: string;
    }) =>
      productNotifiedBodiesService.createProductNotifiedBody(
        productId,
        notifiedBody,
        userId
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-notified-bodies", variables.productId],
      });
    },
  });
};

export const useUpdateProductNotifiedBody = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      notifiedBody,
    }: {
      id: string;
      notifiedBody: Partial<ProductNotifiedBody>;
    }) =>
      productNotifiedBodiesService.updateProductNotifiedBody(id, notifiedBody),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-notified-bodies"] });
    },
  });
};

export const useDeleteProductNotifiedBody = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      productNotifiedBodiesService.deleteProductNotifiedBody(id),
    onSuccess: (_, id, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-notified-bodies"] });
    },
  });
};
