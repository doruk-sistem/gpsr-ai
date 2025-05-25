import { supabase } from "@/lib/supabase/client";

import storageService from "./storage-service";
import productQuestionAnswersService from "./product-question-answers-service";
import productTechnicalFilesService from "./product-technical-files-service";
import productNotifiedBodiesService from "./product-notified-bodies-service";
import userProductUserStandardsService from "./user-product-user-standards-service";
import productDirectivesService from "./product-directives-service";
import productRegulationsService from "./product-regulations-service";
import productStandardsService from "./product-standards-service";

import { type ProductCategory } from "./product-categories-service";
import { type ProductType } from "./product-types-services";
import { type Manufacturer } from "./manufacturers-service";

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
  status?: "pending" | "reject" | "completed" | "incomplete";
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
  status?: "pending" | "reject" | "completed" | "incomplete";
}

export type UpdateProductRequest = Partial<CreateProductRequest>;

class ProductsService {
  public async getProducts() {
    const { data, error } = await supabase
      .from("user_products")
      .select("*, product_categories(*), product_types(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as (Product & {
      product_categories: ProductCategory;
      product_types: ProductType;
      manufacturers: Manufacturer;
    })[];
  }

  public async getProductsCount() {
    const { count, error } = await supabase
      .from("user_products")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count;
  }

  public async getProductById(id: string) {
    const { data, error } = await supabase
      .from("user_products")
      .select("*, product_categories(*), product_types(*), manufacturers(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Product & {
      product_categories: ProductCategory;
      product_types: ProductType;
      manufacturers: Manufacturer;
    };
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
        user_id: (await supabase.auth.getUser()).data.user?.id,
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
    const product = await this.getProductById(id);

    // Delete product question answers first
    await productQuestionAnswersService.deleteProductQuestionAnswers(id);

    // Delete product technical files and their storage files
    const technicalFiles =
      await productTechnicalFilesService.getProductTechnicalFiles(id);
    for (const file of technicalFiles) {
      await productTechnicalFilesService.deleteProductTechnicalFile(file.id);
    }

    // Delete product notified bodies
    try {
      const notifiedBody =
        await productNotifiedBodiesService.getProductNotifiedBodies(id);
      if (notifiedBody) {
        await productNotifiedBodiesService.deleteProductNotifiedBody(
          notifiedBody.id
        );
      }
    } catch (error) {
      // Notified body might not exist, continue
    }

    // Delete user product user standards
    const userStandards =
      await userProductUserStandardsService.getAllByProductId(id);
    for (const standard of userStandards) {
      await userProductUserStandardsService.delete(standard.id);
    }

    // Delete product directives
    const directives = await productDirectivesService.getProductDirectives(id);
    for (const directive of directives) {
      await productDirectivesService.removeProductDirective(
        id,
        directive.directive_id
      );
    }

    // Delete product regulations
    const regulations = await productRegulationsService.getProductRegulations(
      id
    );
    for (const regulation of regulations) {
      await productRegulationsService.removeProductRegulation(
        id,
        regulation.regulation_id
      );
    }

    // Delete product standards
    const standards = await productStandardsService.getProductStandards(id);
    for (const standard of standards) {
      await productStandardsService.removeProductStandard(
        id,
        standard.standard_id
      );
    }

    // 8. Delete product itself
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
}

const productsService = new ProductsService();

export default productsService;
