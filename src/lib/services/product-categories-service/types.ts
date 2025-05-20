export interface ProductCategory {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user_id?: string | null;
}

export interface ProductCategoriesRequest {
  select?: Partial<Record<keyof ProductCategory, boolean>>;
}

export interface ProductTypesByCategoryRequest {
  categoryId: number;
  select?: Partial<Record<keyof ProductType, boolean>>;
}

export interface ProductType {
  id: number;
  product: string;
  description: string | null;
  category_id: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user_id?: string | null;
}

export interface ProductTypesRequest {
  select?: Partial<Record<keyof ProductType, boolean>>;
}

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
