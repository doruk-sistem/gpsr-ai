import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userProductUserRegulationsService, {
  CreateUserProductUserRegulationRequest,
  UpdateUserProductUserRegulationRequest,
} from "@/lib/services/user-product-user-regulations-service";

export function useUserProductUserRegulations(productId: string) {
  return useQuery({
    queryKey: ["user-product-user-regulations", productId],
    queryFn: () =>
      userProductUserRegulationsService.getAllByProductId(productId),
    enabled: !!productId,
  });
}

export function useAddUserProductUserRegulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserProductUserRegulationRequest) =>
      userProductUserRegulationsService.create(input),
    onSuccess: (newRegulation) => {
      queryClient.invalidateQueries({
        queryKey: [
          "user-product-user-regulations",
          newRegulation.user_product_id,
        ],
      });
    },
  });
}

export function useUpdateUserProductUserRegulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateUserProductUserRegulationRequest;
    }) => userProductUserRegulationsService.update(id, input),
    onSuccess: (updatedRegulation) => {
      queryClient.invalidateQueries({
        queryKey: [
          "user-product-user-regulations",
          updatedRegulation.user_product_id,
        ],
      });
    },
  });
}

export function useDeleteUserProductUserRegulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userProductUserRegulationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-product-user-regulations"],
      });
    },
  });
}
