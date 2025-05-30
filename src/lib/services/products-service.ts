import axios from "axios";

import { supabase } from "@/lib/supabase/client";

import storageService from "./storage-service";

import { type UserProductUserStandard } from "./user-product-user-standards-service";
import { type ProductCategory } from "./product-categories-service";
import { type ProductType } from "./product-types-services";
import { type Manufacturer } from "./manufacturers-service";
import { type UserProductUserDirective } from "./user-product-user-directives-service";
import { type UserProductUserRegulation } from "./user-product-user-regulations-service";
import supabaseHelper, { SelectQuery } from "../utils/supabase-helper";

export interface Product {
  id: string;
  name: string;
  require_ce_ukca_marking: boolean;
  batch_number: string;
  model_name: string;
  image_urls: string[];
  specification: string;
  manufacturer_id: string;
  authorised_representative_eu_id: string;
  authorised_representative_uk_id: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  // Fields for relations
  category_id?: number;
  product_type_id?: number;
  status?: "pending" | "rejected" | "completed" | "incomplete";
}

// Extended type for all tables related to Product
export interface ProductWithRelations extends Product {
  product_categories?: ProductCategory;
  product_types?: ProductType;
  manufacturers?: Manufacturer;
}

export interface CreateProductRequest {
  name: string;
  require_ce_ukca_marking: boolean;
  batch_number: string;
  model_name: string;
  image_urls: string[];
  specification: string;
  manufacturer_id: string;
  authorised_representative_eu_id?: string;
  authorised_representative_uk_id?: string;
  category_id?: number;
  product_type_id?: number;
  status?: Product["status"];
  user_id?: string;
}

export type UpdateProductRequest = Partial<CreateProductRequest>;

export interface SaveDefaultDirectivesRegulationsStandardsRequest {
  userProductId: string;
  categoryName: string;
  productName: string;
  regions: ("uk" | "eu")[];
}

export interface GetProductsParams {
  search?: string;
  categoryId?: string;
  sort?: string;
  order?: "asc" | "desc";
  select?: SelectQuery<ProductWithRelations>;
  page?: number;
  pageSize?: number;
  status?: Product["status"];
}

export interface GetProductByIdParams {
  select?: SelectQuery<ProductWithRelations>;
}

export interface SaveDefaultDirectivesRegulationsStandardsResponse {
  directives: UserProductUserDirective[];
  regulations: UserProductUserRegulation[];
  standards: UserProductUserStandard[];
}

class ProductsService {
  private table = "user_products";

  public async getProducts(params: GetProductsParams = {}) {
    let query = supabase
      .from(this.table)
      .select(supabaseHelper.formatSelectQuery(params.select), {
        count: "exact",
      });

    // Apply search filter
    if (params.search) {
      query = query.or(
        `name.ilike.%${params.search}%,model_name.ilike.%${params.search}%,batch_number.ilike.%${params.search}%`
      );
    }

    // Apply category filter
    if (params.categoryId) {
      query = query.eq("category_id", params.categoryId);
    }

    // Apply status filter
    if (params.status) {
      query = query.eq("status", params.status);
    }

    // Apply sorting
    supabaseHelper.applySort(query, {
      sort: params.sort,
      order: params.order,
      defaultSort: "created_at",
      defaultOrder: "desc",
    });

    return supabaseHelper.getPaginationResult<
      Product & {
        product_categories: ProductCategory;
        product_types: ProductType;
        manufacturers: Manufacturer;
      }
    >(query, {
      page: params.page,
      pageSize: params.pageSize,
    });
  }

  public async getProductsCount() {
    const { count, error } = await supabase
      .from("user_products")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count;
  }

  public async getProductById(id: string, params: GetProductByIdParams = {}) {
    const { data, error } = await supabase
      .from("user_products")
      .select(supabaseHelper.formatSelectQuery(params.select))
      .eq("id", id)
      .single();

    if (error) throw error;

    return data as unknown as ProductWithRelations;
  }

  public async updateProduct(id: string, product: Partial<Product>) {
    const { data, error } = await supabase
      .from("user_products")
      .update({
        ...product,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*, product_categories(*), product_types(*), manufacturers(*)")
      .single();

    if (error) throw error;
    return data as Product & {
      product_categories: ProductCategory;
      product_types: ProductType;
      manufacturers: Manufacturer;
    };
  }

  public async createProduct(product: CreateProductRequest) {
    const { data, error } = await supabase
      .from("user_products")
      .insert({
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("*, product_categories(*), product_types(*), manufacturers(*)")
      .single();

    if (error) throw error;
    return data as Product & {
      product_categories: ProductCategory;
      product_types: ProductType;
      manufacturers: Manufacturer;
    };
  }

  public async deleteProduct(id: string) {
    const product = await this.getProductById(id, {
      select: {
        image_urls: true,
      },
    });

    // Delete product
    const { error } = await supabase
      .from("user_products")
      .delete()
      .eq("id", id);

    if (error) throw error;

    // Delete product images if any
    if (product.image_urls && product.image_urls.length > 0) {
      for (const imageUrl of product.image_urls) {
        await storageService.deleteProductFile(imageUrl);
      }
    }
  }

  // ===============================
  // Save default directives, regulations and standards
  // ===============================
  /**
   * Saves GPSR compliance requirements for the specified product and category.
   * Uses OpenAI API to determine the directives, regulations, and standards that the product must comply with.
   * This data is saved to user_product_user_directives, user_product_user_regulations, and user_product_user_standards tables.
   * @param userProductId - Unique identifier of the product
   * @param categoryName - Product category name
   * @param productName - Product name
   * @returns Saved directives, regulations, and standards
   */
  public async saveDefaultDirectivesRegulationsStandards({
    userProductId,
    categoryName,
    productName,
    regions,
  }: SaveDefaultDirectivesRegulationsStandardsRequest) {
    const response = await axios.post(
      `/api/user-products/${userProductId}/save-default-directives-regulations-standards`,
      {
        categoryName,
        productName,
        regions,
      }
    );

    return response.data as SaveDefaultDirectivesRegulationsStandardsResponse;
  }
}

const productsService = new ProductsService();

export default productsService;
