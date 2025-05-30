"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUploadField } from "@/components/ui/image-upload-field";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Briefcase,
  Save,
  Factory,
} from "lucide-react";

import { Country, CountryDropdown } from "../ui/country-dropdown";
import { base64ToFile } from "@/lib/utils/base64ToFile";

interface ManufacturerFormProps {
  initialData?: {
    id?: string;
    name?: string;
    email?: string;
    logo_image_url?: string;
    phone?: string;
    address?: string;
    authorised_signatory_name?: string;
    country?: string;
    position?: string;
    signature_image_url?: string;
  };
  onSubmit: (data: FormData) => void;
}

export default function ManufacturerForm({
  initialData,
  onSubmit,
}: ManufacturerFormProps) {
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [signaturePreview, setSignaturePreview] = useState<string>("");
  const [country, setCountry] = useState<string>(initialData?.country || "");

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageDataUrl: string
  ) => {
    setLogoPreview(imageDataUrl);
  };

  const handleSignatureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageDataUrl: string
  ) => {
    setSignaturePreview(imageDataUrl);
  };

  const handleCountryChange = (country: Country | null) => {
    setCountry(country?.name || "");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    if (logoPreview) {
      formData.set("logo", base64ToFile(logoPreview, "logo.png", "image/png"));
    }

    if (signaturePreview) {
      formData.set(
        "signature",
        base64ToFile(signaturePreview, "signature.png", "image/png")
      );
    }

    formData.append("country", country);

    onSubmit(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Card className="border shadow-sm">
          <CardContent className="p-8">
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Factory className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {initialData ? "Edit Manufacturer" : "Add Manufacturer"}
                    </h1>
                    <p className="text-muted-foreground">
                      Register your manufacturer details for GPSR compliance
                    </p>
                  </div>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  {initialData ? "Update" : "Save"}
                </Button>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Logo
                  </label>
                  <ImageUploadField
                    imagePreview={logoPreview || initialData?.logo_image_url}
                    onImageChange={handleLogoChange}
                    altText="Company logo"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Basic Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Building2 className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            name="name"
                            placeholder="Enter company name"
                            defaultValue={initialData?.name}
                            className="pl-12 bg-white h-12 text-lg"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            type="email"
                            name="email"
                            placeholder="Enter email address"
                            defaultValue={initialData?.email}
                            className="pl-12 bg-white h-12 text-lg"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            type="tel"
                            name="phone"
                            placeholder="Enter phone number"
                            defaultValue={initialData?.phone}
                            className="pl-12 bg-white h-12 text-lg"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <div className="relative h-full">
                        <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <Textarea
                          name="address"
                          placeholder="Enter company address"
                          defaultValue={initialData?.address}
                          className="pl-12 bg-white h-full min-h-[200px] text-lg resize-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Representative Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Authorised Signatory Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            name="authorised_signatory_name"
                            placeholder="Enter signatory name"
                            defaultValue={
                              initialData?.authorised_signatory_name
                            }
                            className="pl-12 bg-white h-12 text-lg"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <div className="relative">
                          <div className="w-full">
                            <CountryDropdown
                              className="w-full h-12 bg-white text-lg"
                              defaultValue={initialData?.country}
                              onChange={handleCountryChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Position
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            name="position"
                            placeholder="Enter position"
                            defaultValue={initialData?.position}
                            className="pl-12 bg-white h-12 text-lg"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Signature
                        <span className="text-xs text-gray-500 ml-2">
                          (Will appear on Declaration of Conformity)
                        </span>
                      </label>
                      <ImageUploadField
                        imagePreview={
                          signaturePreview || initialData?.signature_image_url
                        }
                        onImageChange={handleSignatureChange}
                        altText="Signature image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
