import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import standardsService, { Standard } from "@/lib/services/standards-service";

export const useStandards = () => {
  return useQuery({
    queryKey: ["standards"],
    queryFn: () => standardsService.getStandards(),
  });
};

export const useCreateStandard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      standard: Omit<Standard, "id" | "created_at" | "updated_at">
    ) => standardsService.createStandard(standard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["standards"] });
    },
  });
};

export const useUpdateStandard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      standard,
    }: {
      id: string;
      standard: Partial<Standard>;
    }) => standardsService.updateStandard(id, standard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["standards"] });
    },
  });
};

export const useDeleteStandard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => standardsService.deleteStandard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["standards"] });
    },
  });
};
