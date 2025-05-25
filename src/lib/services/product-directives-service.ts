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
  async getProductDirectives(userProductId: string) {
    const { data, error } = await supabase
      .from("user_product_directives")
      .select("*, directives(*)")
      .eq("user_product_id", userProductId)
      .is("deleted_at", null);
    if (error) throw error;
    return data as ProductDirective[];
  }

  async addProductDirective(userProductId: string, directiveId: number) {
    const { data, error } = await supabase
      .from("user_product_directives")
      .insert({
        user_product_id: userProductId,
        directive_id: directiveId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();
    if (error) throw error;
    return data as ProductDirective;
  }

  async removeProductDirective(productId: string, directiveId: number) {
    const { error } = await supabase
      .from("user_product_directives")
      .delete()
      .eq("user_product_id", productId)
      .eq("directive_id", directiveId);
    if (error) throw error;
  }
}

const productDirectivesService = new ProductDirectivesService();
export default productDirectivesService;
