import { supabase } from "@/lib/supabase/client";

export interface ProductRegulation {
  id: string;
  product_id: string;
  regulation_id: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user_id?: string | null;
}

class ProductRegulationsService {
  async getProductRegulations(productId: string) {
    const { data, error } = await supabase
      .from("product_regulations")
      .select("*, regulations(*)")
      .eq("product_id", productId)
      .is("deleted_at", null);
    if (error) throw error;
    return data as ProductRegulation[];
  }

  async addProductRegulation(productId: string, regulationId: number) {
    const { data, error } = await supabase
      .from("product_regulations")
      .insert({ product_id: productId, regulation_id: regulationId })
      .select()
      .single();
    if (error) throw error;
    return data as ProductRegulation;
  }

  async removeProductRegulation(productId: string, regulationId: number) {
    const { error } = await supabase
      .from("product_regulations")
      .delete()
      .eq("product_id", productId)
      .eq("regulation_id", regulationId);
    if (error) throw error;
  }
}

const productRegulationsService = new ProductRegulationsService();
export default productRegulationsService;
