"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/lib/services/products-service";
import { ProductCategory } from "@/lib/services/product-categories-service";
import { Manufacturer } from "@/lib/services/manufacturers-service";
import { ProductType } from "@/lib/services/product-types-services";
import supabaseHelper from "@/lib/utils/supabase-helper";

interface ProductsParams {
  search?: string;
  categoryId?: string;
  requireCeMarking?: boolean;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export const useAdminProducts = (params: ProductsParams = {}) => {
  return useQuery({
    queryKey: ["admin", "products", params],
    queryFn: async () => {
      try {
        let query = supabase.from("user_products").select(
          `
            *,
            product_categories (*),
            manufacturers (*),
            product_types (*)
          `,
          { count: "exact" }
        );

        // Apply search filter
        if (params.search) {
          query = query.or(
            `name.ilike.%${params.search}%,model_name.ilike.%${params.search}%,batch_number.ilike.%${params.search}%`
          );
        }

        // Apply category filter
        if (params.categoryId) {
          query = query.eq("category_id", params.categoryId);
        }

        // Apply CE/UKCA marking filter
        if (params.requireCeMarking !== undefined) {
          query = query.eq("require_ce_ukca_marking", params.requireCeMarking);
        }

        // Apply sorting
        supabaseHelper.applySort(query, {
          sort: params.sort,
          order: params.order,
          defaultSort: "created_at",
          defaultOrder: "desc",
        });

        return supabaseHelper.getPaginationResult<
          Product & {
            product_categories: ProductCategory;
            product_types: ProductType;
            manufacturers: Manufacturer;
          }
        >(query, {
          page: params.page,
          pageSize: params.pageSize,
        });
      } catch (error) {
        console.error("Error fetching admin products:", error);
        throw error;
      }
    },
  });
};
