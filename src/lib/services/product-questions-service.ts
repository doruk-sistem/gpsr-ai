import { supabase } from "@/lib/supabase/client";
import { formatSelectQuery } from "@/lib/utils/from-select-query";
import { ProductType } from "./product-types-services";
import { ProductCategory } from "./product-categories-service";

export interface ProductQuestion {
  id: string;
  question: string;
  question_description: string | null;
  question_id: string | null;
  category_id: number;
  product_id: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user_id?: string | null;
}

export interface ProductQuestionsByCategoryAndProductTypeRequest {
  categoryId: number;
  productTypeId: number;
  select?: Partial<Record<keyof ProductQuestion, boolean>>;
}

class ProductQuestionsService {
  public async getQuestions() {
    const { data, error } = await supabase
      .from("product_questions")
      .select("*, product_categories(*), product_types(*)")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as (ProductQuestion & {
      product_categories: ProductCategory;
      product_types: ProductType;
    })[];
  }

  public async getQuestionsByCategoryAndProductType({
    categoryId,
    productTypeId,
    select,
  }: ProductQuestionsByCategoryAndProductTypeRequest) {
    const selectQuery = formatSelectQuery<keyof ProductQuestion>(select);

    const { data, error } = await supabase
      .from("product_questions")
      .select(selectQuery)
      .eq("product_id", productTypeId)
      .eq("category_id", categoryId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as unknown as ProductQuestion[];
  }

  public async getQuestionsByCategory(categoryId: number) {
    const { data, error } = await supabase
      .from("product_questions")
      .select("*, product_categories(*), product_types(*)")
      .eq("category_id", categoryId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as (ProductQuestion & {
      product_categories: ProductCategory;
      product_types: ProductType;
    })[];
  }

  public async getQuestionsByProductType(productTypeId: number) {
    const { data, error } = await supabase
      .from("product_questions")
      .select("*")
      .eq("product_id", productTypeId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as (ProductQuestion & {
      product_categories: ProductCategory;
      product_types: ProductType;
    })[];
  }

  public async getQuestionById(id: string) {
    const { data, error } = await supabase
      .from("product_questions")
      .select("*, product_categories(*), product_types(*)")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) throw error;
    return data as ProductQuestion & {
      product_categories: ProductCategory;
      product_types: ProductType;
    };
  }

  public async createQuestion(
    question: Omit<
      ProductQuestion,
      "id" | "created_at" | "updated_at" | "deleted_at" | "user_id"
    >
  ) {
    const { data, error } = await supabase
      .from("product_questions")
      .insert({
        ...question,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as ProductQuestion;
  }

  public async updateQuestion(
    id: string,
    question: Partial<
      Omit<
        ProductQuestion,
        "id" | "created_at" | "updated_at" | "deleted_at" | "user_id"
      >
    >
  ) {
    const { data, error } = await supabase
      .from("product_questions")
      .update({
        ...question,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as ProductQuestion;
  }

  public async deleteQuestion(id: string) {
    const { error } = await supabase
      .from("product_questions")
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
  }
}

const productQuestionsService = new ProductQuestionsService();

export default productQuestionsService;
