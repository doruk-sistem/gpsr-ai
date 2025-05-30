import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import productTechnicalFilesService, {
  SetProductTechnicalFileNotRequiredRequest,
  UploadProductTechnicalFileRequest,
} from "@/lib/services/product-technical-files-service";

export const useGetProductTechnicalFilesByProductId = (productId: string) => {
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
      userId,
    }: UploadProductTechnicalFileRequest) =>
      productTechnicalFilesService.uploadProductTechnicalFile({
        productId,
        fileType,
        file,
        fileName,
        userId,
      }),
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
      userId,
    }: SetProductTechnicalFileNotRequiredRequest) =>
      productTechnicalFilesService.setProductTechnicalFileNotRequired({
        productId,
        fileType,
        reason,
        userId,
      }),
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
