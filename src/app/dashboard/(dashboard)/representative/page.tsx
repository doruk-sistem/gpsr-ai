"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { euCountries } from "@/lib/data/eu-countries";
import { PlusCircle, Trash2, Check } from "lucide-react";
import {
  useRepresentativeAddresses,
  useCreateRepresentativeAddress,
  useDeleteRepresentativeAddress,
} from "@/hooks/use-representative-addresses";
import { RepresentativeRegion } from "@/lib/services/representative-address-service";
import { toast } from "sonner";
import storageService from "@/lib/services/storage-service";
import { useCurrentUser } from "@/hooks/use-auth";
import { useRepresentativeRequests } from "@/hooks/use-representative-requests";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner";

export default function RepresentativePage() {
  const { data: addresses = [], isLoading: isLoadingAddresses } =
    useRepresentativeAddresses();
  const {
    data: representativeRequests = [],
    isLoading: isLoadingRepresentativeRequests,
    isError: isErrorRepresentativeRequests,
  } = useRepresentativeRequests({
    select: {
      status: true,
      region: true,
    },
  });
  const { data: user, isLoading: isLoadingUser } = useCurrentUser();
  const createAddress = useCreateRepresentativeAddress();
  const deleteAddress = useDeleteRepresentativeAddress();
  const router = useRouter();

  const [showEUForm, setShowEUForm] = useState(false);
  const [showUKForm, setShowUKForm] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [country, setCountry] = useState("");
  const [currentRegion, setCurrentRegion] =
    useState<RepresentativeRegion | null>(null);

  // Get filtered addresses by region
  const euAddresses = addresses.filter((address) => address.region === "eu");
  const ukAddresses = addresses.filter((address) => address.region === "uk");

  const euRepresentativeRequest = representativeRequests.find(
    (request) => request.region === "eu"
  );
  const ukRepresentativeRequest = representativeRequests.find(
    (request) => request.region === "uk"
  );

  const resetForm = () => {
    setShowEUForm(false);
    setShowUKForm(false);
    setLogo(null);
    setCompanyName("");
    setCompanyAddress("");
    setCountry("");
    setCurrentRegion(null);
  };

  const handleAddressFormOpen = (region: RepresentativeRegion) => {
    resetForm();
    setCurrentRegion(region);
    if (region === "eu") {
      setShowEUForm(true);
      setShowUKForm(false);
    } else {
      setShowUKForm(true);
      setShowEUForm(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress.mutateAsync(id);
      toast.success("Address deleted", {
        description:
          "Your representative address has been deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error("Failed to delete address", {
        description:
          "Failed to delete representative address. Please try again.",
      });
    }
  };

  const handleSubmitAddress = async (region: RepresentativeRegion) => {
    if (region !== "uk" && !country) {
      toast.error("Validation Error", {
        description: "Please fill country field.",
      });
      return;
    }

    if (!companyName || !companyAddress || !logo) {
      toast.error("Validation Error", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      let logoUrl = null;

      // Handle logo upload if file is selected
      if (logo) {
        if (user?.id) {
          const result = await storageService.uploadRepresentativeAddressFile(
            logo,
            user?.id,
            `${region}-logo-${companyName.toLowerCase().replace(/\s+/g, "-")}`
          );
          logoUrl = result.publicUrl;
        }
      }

      await createAddress.mutateAsync({
        region,
        company_name: companyName,
        company_address: companyAddress,
        company_logo_url: logoUrl,
        country: region === "uk" ? "United Kingdom" : country,
      });

      toast.success("Address saved", {
        description: `Your ${region.toUpperCase()} representative address has been saved successfully.`,
      });
      resetForm();
    } catch (error) {
      console.error("Failed to create address:", error);
      toast.error("Failed to save address", {
        description: "Please try again.",
      });
    }
  };

  if (isLoadingUser || isLoadingAddresses || isLoadingRepresentativeRequests) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-primary mb-2">
            Authorised Representative
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-base mb-6">
            If you have an existing Authorised Representative, you can enter
            their details here. Alternatively, you can choose to appoint
            Dorukwell as your Authorised Representative.
          </div>
          {/* EU & UK Representative Selection */}
          <div className="grid grid-cols-1 gap-6">
            {/* EU Representatives */}
            <Card className="h-full px-6 py-4 bg-transparent shadow-none">
              <div className="flex flex-wrap justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="relative">
                    <Image
                      src="/images/flags/eu-flag.svg"
                      alt="EU flag"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </span>
                  <h4 className="text-lg font-semibold">
                    Authorised Rep in EU
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={showEUForm ? "default" : "outline"}
                    onClick={() => handleAddressFormOpen("eu")}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add your EU address
                  </Button>
                </div>
              </div>

              {/* EU Addresses List */}
              {euAddresses.length > 0 && (
                <div className="mt-4 space-y-3">
                  {euAddresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-3 border rounded-lg flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          {address.company_logo_url && (
                            <Image
                              src={address.company_logo_url}
                              alt={address.company_name}
                              width={50}
                              height={50}
                              className="object-contain rounded-md"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {address.company_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {address.company_address}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {address.country}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {address.is_active && (
                          <span className="bg-green-50 text-green-800 rounded-md text-xs px-3 py-1 flex items-center">
                            <Check className="h-3 w-3 mr-1" /> Active
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAddress(address.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* EU Form */}
              {showEUForm && (
                <div className="mt-4 p-4 border rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Company Logo
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogo(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Company Name
                    </label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Company Address
                    </label>
                    <Input
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder="Enter company address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Country
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      <option value="">Select country</option>
                      {euCountries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={resetForm} type="button">
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleSubmitAddress("eu")}
                      disabled={createAddress.isPending}
                    >
                      {createAddress.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* UK Representatives */}
            <Card className="h-full px-6 py-4 bg-transparent shadow-none">
              <div className="flex flex-wrap justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="relative">
                    <Image
                      src="/images/flags/uk-flag.svg"
                      alt="UK flag"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </span>
                  <h4 className="text-lg font-semibold">
                    Authorised Rep in UK
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={showUKForm ? "default" : "outline"}
                    onClick={() => handleAddressFormOpen("uk")}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add your UK address
                  </Button>
                </div>
              </div>

              {/* UK Addresses List */}
              {ukAddresses.length > 0 && (
                <div className="mt-4 space-y-3">
                  {ukAddresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-3 border rounded-lg flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          {address.company_logo_url && (
                            <Image
                              src={address.company_logo_url}
                              alt={address.company_name}
                              width={50}
                              height={50}
                              className="object-contain rounded-md"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {address.company_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {address.company_address}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {address.country}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {address.is_active && (
                          <span className="bg-green-50 text-green-800 rounded-md text-xs px-3 py-1 flex items-center">
                            <Check className="h-3 w-3 mr-1" /> Active
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAddress(address.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* UK Form */}
              {showUKForm && (
                <div className="mt-4 p-4 border rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Company Logo
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogo(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Company Name
                    </label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Company Address
                    </label>
                    <Input
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder="Enter company address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Country
                    </label>
                    <Input
                      value="United Kingdom"
                      disabled
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={resetForm} type="button">
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleSubmitAddress("uk")}
                      disabled={createAddress.isPending}
                    >
                      {createAddress.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Information and Action Cards */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary mb-2">
            Appoint Dorukwell as Your Authorised Representative
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Designate Dorukwell as your Authorised Representative to seamlessly
            represent your company in the EU, UK, or both markets. We provide
            dedicated representatives through our Ireland-based entity for EU
            compliance and our England-based entity for UKCA compliance.
            <br />
            <br />
            Acting on your behalf, we liaise with market surveillance
            authorities and enable you to use our address on your product
            labels, ensuring smooth market access and regulatory compliance.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* EU Card */}
            <Card className="bg-muted/50 border-primary/10">
              <CardHeader className="items-start">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Image
                    src="/images/flags/eu-flag.svg"
                    alt="EU flag"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                  EU Authorised Representative
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-1">
                <div className="w-full flex gap-5">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Location
                    </div>
                    <div className="font-semibold mb-1">Ireland</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Price</div>
                    <div className="font-semibold mb-3">Included</div>
                  </div>
                  <Button
                    className="w-full"
                    variant="default"
                    disabled={euRepresentativeRequest?.status === "pending"}
                    onClick={() => {
                      router.push(
                        "/dashboard/representative/request?region=eu"
                      );
                    }}
                  >
                    {euRepresentativeRequest?.status === "pending"
                      ? "Under Review"
                      : "Enable"}
                  </Button>
                </div>
              </CardContent>
            </Card>
            {/* UK Card */}
            <Card className="bg-muted/50 border-primary/10">
              <CardHeader className="items-start">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Image
                    src="/images/flags/uk-flag.svg"
                    alt="UK flag"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                  UK Authorised Representative
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-1">
                <div className="w-full flex gap-5">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Location
                    </div>
                    <div className="font-semibold mb-1">England</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Price</div>
                    <div className="font-semibold mb-3">£200</div>
                  </div>
                  <Button
                    className="w-full"
                    variant="default"
                    disabled={ukRepresentativeRequest?.status === "pending"}
                    onClick={() => {
                      router.push(
                        "/dashboard/representative/request?region=uk"
                      );
                    }}
                  >
                    {ukRepresentativeRequest?.status === "pending"
                      ? "Under Review"
                      : "Select Service"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
