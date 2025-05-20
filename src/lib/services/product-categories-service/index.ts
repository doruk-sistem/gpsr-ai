import { supabase } from "@/lib/supabase/client";
import { formatSelectQuery } from "@/lib/utils/from-select-query";
import type {
  ProductCategoriesRequest,
  ProductCategory,
  ProductQuestion,
  ProductQuestionsByCategoryAndProductTypeRequest,
  ProductType,
  ProductTypesByCategoryRequest,
  ProductTypesRequest,
} from "./types";

class ProductCategoriesService {
  // ===============================
  // Product Categories
  // ===============================
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

  // ===============================
  // Product Types
  // ===============================
  public async getProductTypes({ select }: ProductTypesRequest = {}) {
    const selectQuery = formatSelectQuery<keyof ProductType>(select);

    const { data, error } = await supabase
      .from("product_types")
      .select(selectQuery)
      .is("deleted_at", null)
      .order("product", { ascending: true });

    if (error) throw error;
    return data as unknown as ProductType[];
  }

  public async getProductTypesByCategory({
    categoryId,
    select,
  }: ProductTypesByCategoryRequest) {
    const selectQuery = formatSelectQuery<keyof ProductType>(select);

    const { data, error } = await supabase
      .from("product_types")
      .select(selectQuery)
      .eq("category_id", categoryId)
      .is("deleted_at", null)
      .order("product", { ascending: true });

    if (error) throw error;
    return data as unknown as ProductType[];
  }

  public async getProductTypeById(id: number) {
    const { data, error } = await supabase
      .from("product_types")
      .select("*, product_categories(*)")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) throw error;
    return data as ProductType & { product_categories: ProductCategory };
  }

  public async createProductType(
    productType: Omit<
      ProductType,
      "id" | "created_at" | "updated_at" | "deleted_at" | "user_id"
    >
  ) {
    const { data, error } = await supabase
      .from("product_types")
      .insert({
        ...productType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as ProductType;
  }

  public async updateProductType(
    id: number,
    productType: Partial<
      Omit<
        ProductType,
        "id" | "created_at" | "updated_at" | "deleted_at" | "user_id"
      >
    >
  ) {
    const { data, error } = await supabase
      .from("product_types")
      .update({
        ...productType,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as ProductType;
  }

  public async deleteProductType(id: number) {
    const { error } = await supabase
      .from("product_types")
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
  }

  // ===============================
  // Product Questions
  // ===============================
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

const productCategoriesService = new ProductCategoriesService();

export default productCategoriesService;
