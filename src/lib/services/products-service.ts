import { supabase } from "@/lib/supabase/client";

import storageService from "./storage-service";
import { ProductCategory } from "./product-categories-service";
import productQuestionAnswersService from "./product-question-answers-service";
import { ProductType } from "./product-types-services";

export interface Product {
  id: string;
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
  authorised_representative_eu_id: string;
  authorised_representative_uk_id: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  // Fields for relations
  category_id?: number;
  product_type_id?: number;
}

class ProductsService {
  public async getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*, product_categories(*), product_types(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as (Product & {
      product_categories: ProductCategory;
      product_types: ProductType;
    })[];
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
      .select("*, product_categories(*), product_types(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Product & {
      product_categories: ProductCategory;
      product_types: ProductType;
    };
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
    product: Omit<Product, "id" | "created_at" | "updated_at" | "user_id">
  ) {
    const { data, error } = await supabase
      .from("products")
      .insert({
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  }

  public async deleteProduct(id: string) {
    const product = await this.getProductById(id);

    // delete product question answers first
    await productQuestionAnswersService.deleteProductQuestionAnswers(id);

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
