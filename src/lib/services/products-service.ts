import { supabase } from "@/lib/supabase/client";
import storageService from "./storage-service";
import {
  ProductCategory,
  ProductType,
} from "./product-categories-service/types";

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

export interface ProductQuestionAnswer {
  id: string;
  product_id: string;
  question_id: string;
  answer: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user_id?: string | null;
}

class ProductsService {
  // ===============================
  // Products
  // ===============================
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
    await this.deleteProductQuestionAnswers(id);

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

  // ===============================
  // Product Question Answers
  // ===============================
  public async getProductQuestionAnswers(productId: string) {
    const { data, error } = await supabase
      .from("product_question_answers")
      .select("*, product_questions(*)")
      .eq("product_id", productId)
      .is("deleted_at", null);

    if (error) throw error;
    return data as ProductQuestionAnswer[];
  }

  public async createProductQuestionAnswers(
    productId: string,
    questionAnswers: Array<{ question_id: string; answer: boolean }>
  ) {
    const userId = (await supabase.auth.getUser()).data.user?.id;

    const answers = questionAnswers.map((qa) => ({
      product_id: productId,
      question_id: qa.question_id,
      answer: qa.answer,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: userId,
    }));

    const { data, error } = await supabase
      .from("product_question_answers")
      .insert(answers)
      .select();

    if (error) throw error;
    return data as ProductQuestionAnswer[];
  }

  public async updateProductQuestionAnswers(
    productId: string,
    questionAnswers: Array<{
      id?: string;
      question_id: string;
      answer: boolean;
    }>
  ) {
    // First delete all existing answers for this product
    await this.deleteProductQuestionAnswers(productId);

    // Then create new answers
    return this.createProductQuestionAnswers(productId, questionAnswers);
  }

  public async deleteProductQuestionAnswers(productId: string) {
    const { error } = await supabase
      .from("product_question_answers")
      .delete()
      .eq("product_id", productId);

    if (error) throw error;
  }
}

const productsService = new ProductsService();

export default productsService;
