import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import regulationsService, {
  Regulation,
} from "@/lib/services/regulations-service";

export const useRegulations = () => {
  return useQuery({
    queryKey: ["regulations"],
    queryFn: () => regulationsService.getRegulations(),
  });
};

export const useCreateRegulation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      regulation: Omit<Regulation, "id" | "created_at" | "updated_at">
    ) => regulationsService.createRegulation(regulation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regulations"] });
    },
  });
};

export const useUpdateRegulation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      regulation,
    }: {
      id: number;
      regulation: Partial<Regulation>;
    }) => regulationsService.updateRegulation(id, regulation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regulations"] });
    },
  });
};

export const useDeleteRegulation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => regulationsService.deleteRegulation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regulations"] });
    },
  });
};
