"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import representativeRequestService, {
  type Representative,
  type CreateRepresentativeRequestInput,
  type RepresentativeRequest,
} from "@/lib/services/representative-request-service";
import { RepresentativeRegion } from "@/lib/services/representative-address-service";

export const useRepresentativeRequests = (params?: RepresentativeRequest) => {
  return useQuery({
    queryKey: ["representative-requests", params],
    queryFn: () => representativeRequestService.getRequestsByUser(params),
  });
};

export const useRepresentativeRequest = (id: string) => {
  return useQuery({
    queryKey: ["representative-request", id],
    queryFn: () => representativeRequestService.getRequestById(id),
    enabled: !!id,
  });
};

export const useCreateRepresentativeRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRepresentativeRequestInput) =>
      representativeRequestService.createRequest(data),
    onSuccess: (newRequest) => {
      queryClient.invalidateQueries({
        queryKey: ["representative-requests"],
        refetchType: "all",
      });

      if (newRequest && newRequest.id) {
        queryClient.invalidateQueries({
          queryKey: ["representative-request", newRequest.id],
          refetchType: "all",
        });
      }
    },
  });
};

export const useUpdateRepresentativeRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: Partial<Representative>;
    }) => representativeRequestService.updateRequest(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["representative-requests"],
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["representative-request", variables.id],
        refetchType: "all",
      });
    },
  });
};

export const useCancelRepresentativeRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => representativeRequestService.cancelRequest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["representative-requests"],
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["representative-request", id],
        refetchType: "all",
      });
    },
  });
};
