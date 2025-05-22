import { supabase } from "@/lib/supabase/client";

export interface ProductNotifiedBody {
  id: string;
  product_id: string;
  notified_body_name: string;
  notified_body_address?: string;
  notified_body_number?: string;
  notified_body_ref_number?: string;
  additional_info?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user_id?: string | null;
}

class ProductNotifiedBodiesService {
  async getProductNotifiedBodies(productId: string) {
    const { data, error } = await supabase
      .from("product_notified_bodies")
      .select("*")
      .eq("product_id", productId)
      .is("deleted_at", null);
    if (error) throw error;
    return data as ProductNotifiedBody[];
  }

  async createProductNotifiedBody(
    productId: string,
    notifiedBody: Omit<
      ProductNotifiedBody,
      "id" | "product_id" | "created_at" | "updated_at"
    >,
    userId?: string
  ) {
    const { data, error } = await supabase
      .from("product_notified_bodies")
      .insert({
        ...notifiedBody,
        product_id: productId,
        user_id: userId,
      })
      .select()
      .single();
    if (error) throw error;
    return data as ProductNotifiedBody;
  }

  async updateProductNotifiedBody(
    id: string,
    notifiedBody: Partial<ProductNotifiedBody>
  ) {
    const { data, error } = await supabase
      .from("product_notified_bodies")
      .update(notifiedBody)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as ProductNotifiedBody;
  }

  async deleteProductNotifiedBody(id: string) {
    const { error } = await supabase
      .from("product_notified_bodies")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  }
}

const productNotifiedBodiesService = new ProductNotifiedBodiesService();
export default productNotifiedBodiesService;
