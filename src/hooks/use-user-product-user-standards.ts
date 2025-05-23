import { useMutation, useQuery } from "@tanstack/react-query";
import userProductUserStandardsService, {
  CreateUserProductUserStandardRequest,
  UpdateUserProductUserStandardRequest,
} from "@/lib/services/user-product-user-standards-service";

export function useUserProductUserStandards(productId: string) {
  return useQuery({
    queryKey: ["user-product-user-standards", productId],
    queryFn: () => userProductUserStandardsService.getAllByProductId(productId),
  });
}

export function useAddUserProductUserStandard() {
  return useMutation({
    mutationFn: (input: CreateUserProductUserStandardRequest) =>
      userProductUserStandardsService.create(input),
  });
}

export function useUpdateUserProductUserStandard() {
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateUserProductUserStandardRequest;
    }) => userProductUserStandardsService.update(id, input),
  });
}

export function useDeleteUserProductUserStandard() {
  return useMutation({
    mutationFn: (id: string) => userProductUserStandardsService.delete(id),
  });
}
