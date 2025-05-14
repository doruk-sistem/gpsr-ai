"use client";

import React from "react";
import ProductForm from "@/components/products/ProductForm";
import { useParams, useRouter } from "next/navigation";
import { useProduct, useUpdateProduct } from "@/hooks/use-products";
import { toast } from "sonner";
import storageService from "@/lib/services/storage-service";
import { useCurrentUser } from "@/hooks/use-auth";
import { useManufacturers } from "@/hooks/use-manufacturers";
import Spinner from "@/components/ui/spinner";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id as string);
  const updateProduct = useUpdateProduct();
  const { data: user } = useCurrentUser();
  const { data: manufacturers } = useManufacturers();

  const handleSubmit = async (formData: FormData) => {
    try {
      let imageUrls = product?.image_urls || [];

      const imageFiles = formData.getAll("images") as File[];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (file && file.name !== "") {
          const { publicUrl } = await storageService.uploadProductFile(
            file,
            user?.id as string
          );
          imageUrls[i] = publicUrl;
        }
      }

      // Get standards from the form
      const standards = formData.getAll("standards") as string[];

      const data = {
        name: formData.get("name") as string,
        category: formData.get("category") as string,
        sub_category: formData.get("sub_category") as string,
        require_ce_ukca_marking:
          formData.get("require_ce_ukca_marking") === "true",
        batch_number: formData.get("batch_number") as string,
        model_name: formData.get("model_name") as string,
        image_urls: imageUrls,
        specification: (formData.get("specification") as string)
          ?.split("\n")
          .filter(Boolean),
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

      await updateProduct.mutateAsync({
        id: id as string,
        product: data,
      });

      toast.success("Product updated successfully");
      router.push("/dashboard/products");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating product");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <ProductForm
      initialData={product}
      manufacturers={manufacturers || []}
      onSubmit={handleSubmit}
    />
  );
}
