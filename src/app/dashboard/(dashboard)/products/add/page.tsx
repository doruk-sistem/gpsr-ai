"use client";

import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useCreateProduct } from "@/hooks/use-products";
import { useCurrentUser } from "@/hooks/use-auth";
import { useManufacturers } from "@/hooks/use-manufacturers";

import storageService from "@/lib/services/storage-service";
import ProductForm from "@/components/products/ProductForm";

export default function AddProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const { data: user } = useCurrentUser();
  const { data: manufacturers } = useManufacturers();

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

      // Create product data object
      const data = {
        category: formData.get("category") as string,
        sub_category: formData.get("sub_category") as string,
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
        authorised_representative_in_eu: formData.get(
          "authorised_representative_in_eu"
        ) as string,
        authorised_representative_in_uk: formData.get(
          "authorised_representative_in_uk"
        ) as string,
      };

      await createProduct.mutateAsync(data);

      toast.success("Product added successfully");
      router.push("/dashboard/products");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add product");
    }
  };

  return (
    <ProductForm onSubmit={handleSubmit} manufacturers={manufacturers || []} />
  );
}
