import productTypesService, {
  ProductType,
  ProductTypesByCategoryRequest,
  ProductTypesRequest,
} from "@/lib/services/product-types-services";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useProductTypes = (params: ProductTypesRequest) => {
  return useQuery({
    queryKey: ["product-types", params],
    queryFn: () => productTypesService.getProductTypes(params),
  });
};

export const useProductTypesByCategory = (
  params: ProductTypesByCategoryRequest
) => {
  return useQuery({
    queryKey: ["product-types-by-category", params],
    queryFn: () => productTypesService.getProductTypesByCategory(params),
    enabled: !!params.categoryId,
  });
};

export const useProductType = (id: number) => {
  return useQuery({
    queryKey: ["product-type", id],
    queryFn: () => productTypesService.getProductTypeById(id),
    enabled: !!id,
  });
};

export const useCreateProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<
        ProductType,
        "id" | "created_at" | "updated_at" | "deleted_at" | "user_id"
      >
    ) => productTypesService.createProductType(data),
    onSuccess: (newProductType) => {
      queryClient.invalidateQueries({
        queryKey: ["product-types"],
        refetchType: "all",
      });

      if (newProductType && newProductType.id) {
        queryClient.invalidateQueries({
          queryKey: ["product-type", newProductType.id],
          refetchType: "all",
        });
      }

      if (newProductType && newProductType.category_id) {
        queryClient.invalidateQueries({
          queryKey: ["product-types-by-category", newProductType.category_id],
          refetchType: "all",
        });
      }
    },
  });
};

export const useUpdateProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      productType,
    }: {
      id: number;
      productType: Partial<
        Omit<
          ProductType,
          "id" | "created_at" | "updated_at" | "deleted_at" | "user_id"
        >
      >;
    }) => productTypesService.updateProductType(id, productType),
    onSuccess: (updatedProductType, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-types"],
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["product-type", variables.id],
        refetchType: "all",
      });

      if (updatedProductType && updatedProductType.category_id) {
        queryClient.invalidateQueries({
          queryKey: [
            "product-types-by-category",
            updatedProductType.category_id,
          ],
          refetchType: "all",
        });
      }
    },
  });
};

export const useDeleteProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productTypesService.deleteProductType(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["product-types"],
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["product-type", id],
        refetchType: "all",
      });

      // Since we can't know the category_id here, invalidate all by-category queries
      queryClient.invalidateQueries({
        queryKey: ["product-types-by-category"],
        refetchType: "all",
      });
    },
  });
};
