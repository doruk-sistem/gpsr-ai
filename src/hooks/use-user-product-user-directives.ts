import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userProductUserDirectivesService, {
  CreateUserProductUserDirectiveRequest,
  UpdateUserProductUserDirectiveRequest,
} from "@/lib/services/user-product-user-directives-service";

export function useUserProductUserDirectives(productId: string) {
  return useQuery({
    queryKey: ["user-product-user-directives", productId],
    queryFn: () =>
      userProductUserDirectivesService.getAllByProductId(productId),
  });
}

export function useAddUserProductUserDirective() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserProductUserDirectiveRequest) =>
      userProductUserDirectivesService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-product-user-directives"],
      });
    },
  });
}
export function useUpdateUserProductUserDirective() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateUserProductUserDirectiveRequest;
    }) => userProductUserDirectivesService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-product-user-directives"],
      });
    },
  });
}

export function useDeleteUserProductUserDirective() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userProductUserDirectivesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-product-user-directives"],
      });
    },
  });
}
