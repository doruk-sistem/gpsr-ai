"use client";

import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useCreateProduct } from "@/hooks/use-products";
import { useCurrentUser } from "@/hooks/use-auth";
import { useCreateProductQuestionAnswers } from "@/hooks/use-product-question-answers";

import storageService from "@/lib/services/storage-service";
import ProductForm from "@/components/products/ProductForm";

export default function AddProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const createProductQuestionAnswers = useCreateProductQuestionAnswers();
  const { data: user } = useCurrentUser();

  const handleSubmit = async (formData: FormData) => {
    try {
      const imageFiles = formData.getAll("images") as File[];
      let imageUrls: string[] = [];

      // Upload all product images
      for (const imageFile of imageFiles) {
        if (imageFile.size > 0) {
          const { publicUrl } = await storageService.uploadProductFile(
            imageFile,
            user?.id as string
          );
          imageUrls.push(publicUrl);
        }
      }

      // Get standards from the form
      const standards = formData.getAll("standards") as string[];

      // Get selected question IDs
      const selectedQuestionIds = formData.getAll("question_id") as string[];

      // Create product data object
      const data = {
        name: formData.get("name") as string,
        require_ce_ukca_marking:
          formData.get("require_ce_ukca_marking") === "true",
        batch_number: formData.get("batch_number") as string,
        model_name: formData.get("model_name") as string,
        image_urls: imageUrls,
        specification: formData.getAll("specification") as string[],
        directives: formData.getAll("directives") as string[],
        regulations: formData.getAll("regulations") as string[],
        standards,
        manufacturer_id: formData.get("manufacturer_id") as string,
        authorised_representative_eu_id: formData.get(
          "authorised_representative_eu_id"
        ) as string,
        authorised_representative_uk_id: formData.get(
          "authorised_representative_uk_id"
        ) as string,
        // Category and product type fields
        category_id: parseInt(formData.get("category_id") as string),
        product_type_id: parseInt(formData.get("product_type_id") as string),
      };

      // Create the product
      const newProduct = await createProduct.mutateAsync(data);

      // Save product question answers if there are any selected
      if (newProduct && selectedQuestionIds.length > 0) {
        const questionAnswers = selectedQuestionIds.map((questionId) => ({
          question_id: questionId,
          answer: true,
        }));

        await createProductQuestionAnswers.mutateAsync({
          productId: newProduct.id,
          questionAnswers,
        });
      }

      toast.success("Product added successfully");
      router.push("/dashboard/products");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add product");
    }
  };

  return (
    <ProductForm
      onSubmit={handleSubmit}
      isSubmitting={
        createProduct.isPending || createProductQuestionAnswers.isPending
      }
    />
  );
}
