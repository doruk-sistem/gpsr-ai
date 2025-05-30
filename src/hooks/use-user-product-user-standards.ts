import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userProductUserStandardsService, {
  CreateUserProductUserStandardRequest,
  UpdateUserProductUserStandardRequest,
} from "@/lib/services/user-product-user-standards-service";

export function useUserProductUserStandards(productId: string) {
  return useQuery({
    queryKey: ["user-product-user-standards", productId],
    queryFn: () => userProductUserStandardsService.getAllByProductId(productId),
    enabled: !!productId,
  });
}

export function useAddUserProductUserStandard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserProductUserStandardRequest) =>
      userProductUserStandardsService.create(input),
    onSuccess: (newStandard) => {
      queryClient.invalidateQueries({
        queryKey: ["user-product-user-standards", newStandard.user_product_id],
      });
    },
  });
}

export function useUpdateUserProductUserStandard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateUserProductUserStandardRequest;
    }) => userProductUserStandardsService.update(id, input),
    onSuccess: (updatedStandard) => {
      queryClient.invalidateQueries({
        queryKey: [
          "user-product-user-standards",
          updatedStandard.user_product_id,
        ],
      });
    },
  });
}

export function useDeleteUserProductUserStandard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userProductUserStandardsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-product-user-standards"],
      });
    },
  });
}
