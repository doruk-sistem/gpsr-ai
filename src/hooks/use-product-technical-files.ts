import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import productTechnicalFilesService from "@/lib/services/product-technical-files-service";

export const useProductTechnicalFiles = (productId: string) => {
  return useQuery({
    queryKey: ["product-technical-files", productId],
    queryFn: () =>
      productTechnicalFilesService.getProductTechnicalFiles(productId),
    enabled: !!productId,
  });
};

export const useUploadProductTechnicalFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      fileType,
      file,
      fileName,
    }: {
      productId: string;
      fileType: string;
      file: File;
      fileName?: string;
    }) =>
      productTechnicalFilesService.uploadProductTechnicalFile(
        productId,
        fileType,
        file,
        fileName
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-technical-files", variables.productId],
      });
    },
  });
};

export const useSetProductTechnicalFileNotRequired = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      fileType,
      reason,
    }: {
      productId: string;
      fileType: string;
      reason?: string;
    }) =>
      productTechnicalFilesService.setProductTechnicalFileNotRequired(
        productId,
        fileType,
        reason
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-technical-files", variables.productId],
      });
    },
  });
};

export const useDeleteProductTechnicalFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      productTechnicalFilesService.deleteProductTechnicalFile(id),
    onSuccess: (_, id, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-technical-files"] });
    },
  });
};
