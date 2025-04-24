"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Briefcase,
  Image as ImageIcon,
  PenTool,
} from "lucide-react";

import { Country, CountryDropdown } from "../ui/country-dropdown";

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
  const [logoPreview, setLogoPreview] = useState<string>(
    initialData?.logo_image_url || ""
  );
  const [signaturePreview, setSignaturePreview] = useState<string>(
    initialData?.signature_image_url || ""
  );
  const [country, setCountry] = useState<string>(initialData?.country || "");

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCountryChange = (country: Country) => {
    setCountry(country.alpha2);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    formData.append("country", country);

    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardContent className="p-8">
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {initialData ? "Edit Manufacturer" : "Add Manufacturer"}
                </h1>
                <Button type="submit">{initialData ? "Update" : "Save"}</Button>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Logo
                  </label>
                  <div className="flex flex-col items-center justify-center h-[260px] px-6 py-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                    {logoPreview ? (
                      <div className="relative w-full h-full group">
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          fill
                          className="object-contain rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <label className="cursor-pointer rounded-md px-4 py-2 font-medium text-white">
                            <span>Change Logo</span>
                            <Input
                              type="file"
                              name="logo"
                              className="sr-only"
                              accept="image/jpeg,image/png,image/jpg"
                              onChange={handleLogoChange}
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-center">
                        <ImageIcon className="mx-auto h-16 w-16 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/90">
                            <span>Upload a file</span>
                            <Input
                              type="file"
                              name="logo"
                              className="sr-only"
                              accept="image/jpeg,image/png,image/jpg"
                              onChange={handleLogoChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG - up to 2MB
                        </p>
                      </div>
                    )}
                  </div>
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
                      <div className="flex flex-col items-center justify-center h-[260px] px-6 py-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                        {signaturePreview ? (
                          <div className="relative w-full h-full group">
                            <Image
                              src={signaturePreview}
                              alt="Signature preview"
                              fill
                              className="object-contain rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <label className="cursor-pointer rounded-md px-4 py-2 font-medium text-white">
                                <span>Change Signature</span>
                                <Input
                                  type="file"
                                  name="signature"
                                  className="sr-only"
                                  accept="image/jpeg,image/png,image/jpg"
                                  onChange={handleSignatureChange}
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 text-center">
                            <PenTool className="mx-auto h-16 w-16 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/90">
                                <span>Upload a file</span>
                                <Input
                                  type="file"
                                  name="signature"
                                  className="sr-only"
                                  accept="image/jpeg,image/png,image/jpg"
                                  onChange={handleSignatureChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG - up to 2MB
                            </p>
                          </div>
                        )}
                      </div>
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
