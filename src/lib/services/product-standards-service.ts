import { supabase } from "@/lib/supabase/client";

export interface ProductStandard {
  id: string;
  product_id: string;
  standard_id: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user_id?: string | null;
}

class ProductStandardsService {
  async getProductStandards(productId: string) {
    const { data, error } = await supabase
      .from("product_standards")
      .select("*, standards(*)")
      .eq("product_id", productId)
      .is("deleted_at", null);
    if (error) throw error;
    return data as ProductStandard[];
  }

  async addProductStandard(productId: string, standardId: string) {
    const { data, error } = await supabase
      .from("product_standards")
      .insert({ product_id: productId, standard_id: standardId })
      .select()
      .single();
    if (error) throw error;
    return data as ProductStandard;
  }

  async removeProductStandard(productId: string, standardId: string) {
    const { error } = await supabase
      .from("product_standards")
      .delete()
      .eq("product_id", productId)
      .eq("standard_id", standardId);
    if (error) throw error;
  }
}

const productStandardsService = new ProductStandardsService();
export default productStandardsService;
