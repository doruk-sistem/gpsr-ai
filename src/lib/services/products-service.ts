import { supabase } from "@/lib/supabase/client";
import storageService from "./storage-service";

export interface Product {
  id: string;
  category: string;
  sub_category: string;
  name: string;
  require_ce_ukca_marking: boolean;
  batch_number: string;
  model_name: string;
  image_urls: string[];
  specification: string[];
  directives: string[];
  regulations: string[];
  standards: any;
  manufacturer_id: string;
  authorised_representative_in_eu: string;
  authorised_representative_in_uk: string;
  created_at?: string;
  updated_at?: string;
}

class ProductsService {
  public async getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Product[];
  }

  public async getProductsCount() {
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count;
  }

  public async getProductById(id: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Product;
  }

  public async updateProduct(id: string, product: Partial<Product>) {
    const { data, error } = await supabase
      .from("products")
      .update({
        ...product,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  }

  public async createProduct(
    product: Omit<Product, "id" | "created_at" | "updated_at">
  ) {
    const { data, error } = await supabase
      .from("products")
      .insert({
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  }

  public async deleteProduct(id: string) {
    const product = await this.getProductById(id);

    // delete product
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;

    // delete product images if any
    if (product.image_urls && product.image_urls.length > 0) {
      for (const imageUrl of product.image_urls) {
        await storageService.deleteProductFile(imageUrl);
      }
    }
  }
}

const productsService = new ProductsService();

export default productsService;
