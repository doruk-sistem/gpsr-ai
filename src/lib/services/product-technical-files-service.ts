import { supabase } from "@/lib/supabase/client";
import storageService from "./storage-service";

export interface ProductTechnicalFile {
  id: string;
  product_id: string;
  file_type: string;
  file_url?: string;
  not_required?: boolean;
  not_required_reason?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user_id?: string | null;
}

class ProductTechnicalFilesService {
  async getProductTechnicalFiles(productId: string) {
    const { data, error } = await supabase
      .from("product_technical_files")
      .select("*")
      .eq("product_id", productId)
      .is("deleted_at", null);
    if (error) throw error;
    return data as ProductTechnicalFile[];
  }

  async uploadProductTechnicalFile(
    productId: string,
    fileType: string,
    file: File,
    userId: string,
    fileName?: string
  ) {
    const { publicUrl } = await storageService.uploadProductTechnicalFile(
      file,
      userId,
      fileName
    );
    const { data, error } = await supabase
      .from("product_technical_files")
      .insert({
        product_id: productId,
        file_type: fileType,
        file_url: publicUrl,
        user_id: userId,
      })
      .select()
      .single();
    if (error) throw error;
    return data as ProductTechnicalFile;
  }

  async setProductTechnicalFileNotRequired(
    productId: string,
    fileType: string,
    reason?: string,
    userId?: string
  ) {
    const { data, error } = await supabase
      .from("product_technical_files")
      .upsert(
        [
          {
            product_id: productId,
            file_type: fileType,
            not_required: true,
            not_required_reason: reason,
            user_id: userId,
          },
        ],
        { onConflict: "product_id,file_type" }
      )
      .select()
      .single();
    if (error) throw error;
    return data as ProductTechnicalFile;
  }

  async deleteProductTechnicalFile(id: string) {
    const { error } = await supabase
      .from("product_technical_files")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  }
}

const productTechnicalFilesService = new ProductTechnicalFilesService();
export default productTechnicalFilesService;
