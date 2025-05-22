import { supabase } from "@/lib/supabase/client";
import { formatSelectQuery } from "@/lib/utils/from-select-query";

export interface ProductCategory {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user_id?: string | null;
}

export interface ProductCategoriesRequest {
  select?: Partial<Record<keyof ProductCategory, boolean>>;
}

class ProductCategoriesService {
  public async getCategories({ select }: ProductCategoriesRequest = {}) {
    const selectQuery = formatSelectQuery<keyof ProductCategory>(select);

    const { data, error } = await supabase
      .from("product_categories")
      .select(selectQuery)
      .is("deleted_at", null)
      .order("name", { ascending: true });

    if (error) throw error;
    return data as unknown as ProductCategory[];
  }

  public async getCategoryById(id: number) {
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) throw error;
    return data as ProductCategory;
  }

  public async createCategory(name: string) {
    const { data, error } = await supabase
      .from("product_categories")
      .insert({
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as ProductCategory;
  }

  public async updateCategory(id: number, name: string) {
    const { data, error } = await supabase
      .from("product_categories")
      .update({
        name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as ProductCategory;
  }

  public async deleteCategory(id: number) {
    const { error } = await supabase
      .from("product_categories")
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
  }
}

const productCategoriesService = new ProductCategoriesService();

export default productCategoriesService;
