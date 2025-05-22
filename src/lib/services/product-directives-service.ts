import { supabase } from "@/lib/supabase/client";

export interface ProductDirective {
  id: string;
  product_id: string;
  directive_id: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user_id?: string | null;
}

class ProductDirectivesService {
  async getProductDirectives(productId: string) {
    const { data, error } = await supabase
      .from("product_directives")
      .select("*, directives(*)")
      .eq("product_id", productId)
      .is("deleted_at", null);
    if (error) throw error;
    return data as ProductDirective[];
  }

  async addProductDirective(productId: string, directiveId: number) {
    const { data, error } = await supabase
      .from("product_directives")
      .insert({ product_id: productId, directive_id: directiveId })
      .select()
      .single();
    if (error) throw error;
    return data as ProductDirective;
  }

  async removeProductDirective(productId: string, directiveId: number) {
    const { error } = await supabase
      .from("product_directives")
      .delete()
      .eq("product_id", productId)
      .eq("directive_id", directiveId);
    if (error) throw error;
  }
}

const productDirectivesService = new ProductDirectivesService();
export default productDirectivesService;
