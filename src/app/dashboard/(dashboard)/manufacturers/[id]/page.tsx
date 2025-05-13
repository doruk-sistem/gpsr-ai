"use client";

import React from "react";
import ManufacturerForm from "@/components/manufacturers/ManufacturerForm";
import { useParams, useRouter } from "next/navigation";
import {
  useManufacturer,
  useUpdateManufacturer,
} from "@/hooks/use-manufacturers";
import { toast } from "sonner";
import storageService from "@/lib/services/storage-service";
import { useCurrentUser } from "@/hooks/use-auth";
import Spinner from "@/components/ui/spinner";

export default function EditManufacturerPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: manufacturer, isLoading } = useManufacturer(id as string);
  const updateManufacturer = useUpdateManufacturer();
  const { data: user } = useCurrentUser();

  const handleSubmit = async (formData: FormData) => {
    try {
      let logoUrl = manufacturer?.logo_image_url;
      let signatureUrl = manufacturer?.signature_image_url;

      const logoFile = formData.get("logo") as File;
      const signatureFile = formData.get("signature") as File;

      if (logoFile && logoFile.name !== "") {
        const { publicUrl } = await storageService.uploadManufacturerFile(
          logoFile,
          user?.id as string
        );
        logoUrl = publicUrl;
      }

      if (signatureFile && signatureFile.name !== "") {
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

      await updateManufacturer.mutateAsync({
        id: id as string,
        manufacturer: data,
      });

      toast.success("Manufacturer updated successfully");
      router.push("/dashboard/manufacturers");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update manufacturer");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!manufacturer) {
    return <div>Manufacturer not found</div>;
  }

  return (
    <ManufacturerForm initialData={manufacturer} onSubmit={handleSubmit} />
  );
}
