import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import directivesService, {
  Directive,
} from "@/lib/services/directives-service";

export const useDirectives = () => {
  return useQuery({
    queryKey: ["directives"],
    queryFn: () => directivesService.getDirectives(),
  });
};

export const useCreateDirective = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      directive: Omit<Directive, "id" | "created_at" | "updated_at">
    ) => directivesService.createDirective(directive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directives"] });
    },
  });
};

export const useUpdateDirective = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      directive,
    }: {
      id: number;
      directive: Partial<Directive>;
    }) => directivesService.updateDirective(id, directive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directives"] });
    },
  });
};

export const useDeleteDirective = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => directivesService.deleteDirective(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directives"] });
    },
  });
};
