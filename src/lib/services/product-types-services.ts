import { supabase } from "@/lib/supabase/client";
import { formatSelectQuery } from "../utils/from-select-query";
import { ProductCategory } from "./product-categories-service";

export interface ProductTypesByCategoryRequest {
  categoryId: number;
  select?: Partial<Record<keyof ProductType, boolean>>;
}

export interface ProductType {
  id: number;
  product: string;
  description: string | null;
  category_id: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user_id?: string | null;
}

export interface ProductTypesRequest {
  select?: Partial<Record<keyof ProductType, boolean>>;
}

class ProductTypesService {
  public async getProductTypes({ select }: ProductTypesRequest = {}) {
    const selectQuery = formatSelectQuery<keyof ProductType>(select);

    const { data, error } = await supabase
      .from("product_types")
      .select(selectQuery)
      .is("deleted_at", null)
      .order("product", { ascending: true });

    if (error) throw error;
    return data as unknown as ProductType[];
  }

  public async getProductTypesByCategory({
    categoryId,
    select,
  }: ProductTypesByCategoryRequest) {
    const selectQuery = formatSelectQuery<keyof ProductType>(select);

    const { data, error } = await supabase
      .from("product_types")
      .select(selectQuery)
      .eq("category_id", categoryId)
      .is("deleted_at", null)
      .order("product", { ascending: true });

    if (error) throw error;
    return data as unknown as ProductType[];
  }

  public async getProductTypeById(id: number) {
    const { data, error } = await supabase
      .from("product_types")
      .select("*, product_categories(*)")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) throw error;
    return data as ProductType & { product_categories: ProductCategory };
  }

  public async createProductType(
    productType: Omit<
      ProductType,
      "id" | "created_at" | "updated_at" | "deleted_at" | "user_id"
    >
  ) {
    const { data, error } = await supabase
      .from("product_types")
      .insert({
        ...productType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as ProductType;
  }

  public async updateProductType(
    id: number,
    productType: Partial<
      Omit<
        ProductType,
        "id" | "created_at" | "updated_at" | "deleted_at" | "user_id"
      >
    >
  ) {
    const { data, error } = await supabase
      .from("product_types")
      .update({
        ...productType,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as ProductType;
  }

  public async deleteProductType(id: number) {
    const { error } = await supabase
      .from("product_types")
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
  }
}

const productTypesService = new ProductTypesService();

export default productTypesService;
