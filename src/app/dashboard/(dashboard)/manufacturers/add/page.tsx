"use client";

import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import ManufacturerForm from "@/components/manufacturers/ManufacturerForm";

import { useCreateManufacturer } from "@/hooks/use-manufacturers";
import { useCurrentUser } from "@/hooks/use-auth";

import storageService from "@/lib/services/storage-service";

export default function AddManufacturerPage() {
  const router = useRouter();
  const createManufacturer = useCreateManufacturer();
  const { data: user } = useCurrentUser();

  const handleSubmit = async (formData: FormData) => {
    try {
      let logoUrl = "";
      let signatureUrl = "";

      const logoFile = formData.get("logo") as File;
      const signatureFile = formData.get("signature") as File;

      if (logoFile) {
        const { publicUrl } = await storageService.uploadManufacturerFile(
          logoFile,
          user?.id as string
        );
        logoUrl = publicUrl;
      }

      if (signatureFile) {
        const { publicUrl } = await storageService.uploadManufacturerFile(
          signatureFile,
          user?.id as string
        );
        signatureUrl = publicUrl;
      }

      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
        authorised_signatory_name: formData.get(
          "authorised_signatory_name"
        ) as string,
        country: formData.get("country") as string,
        position: formData.get("position") as string,
        logo_image_url: logoUrl,
        signature_image_url: signatureUrl,
      };

      await createManufacturer.mutateAsync(data);

      toast.success("Manufacturer added successfully");
      router.push("/dashboard/manufacturers");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add manufacturer");
    }
  };

  return <ManufacturerForm onSubmit={handleSubmit} />;
}
