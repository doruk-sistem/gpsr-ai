"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { euCountries } from "@/lib/data/eu-countries";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Briefcase,
  Globe,
  Package,
  FileCheck,
  ShieldCheck,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCreateRepresentativeRequest,
  useRepresentativeRequests,
} from "@/hooks/use-representative-requests";
import { RepresentativeRegion } from "@/lib/services/representative-address-service";
import { useCurrentUser } from "@/hooks/use-auth";
import storageService from "@/lib/services/storage-service";
import Spinner from "@/components/ui/spinner";

export default function RequestPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: user } = useCurrentUser();
  const createRequest = useCreateRepresentativeRequest();
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

  const regionParam = searchParams.get("region") as RepresentativeRegion | null;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    companyNumber: "",
    vatNumber: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    country: "",
    fullName: "",
    email: "",
    phone: "",
    position: "",
    websiteUrl: "",
    businessRole: "",
    productCategory: "",
    productInformation: "",
    ceMarking: "",
    technicalFile: "",
    requiredTests: "",
    testReports: "",
    testReportsFile: null as File | null,
    confirmAccuracy: false,
    confirmResponsibility: false,
    confirmTerms: false,
    region: regionParam || ("eu" as RepresentativeRegion),
  });

  useEffect(() => {
    // Pre-fill email and name if user is logged in
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        fullName: user.user_metadata?.full_name || "",
      }));
    }
  }, [user]);

  const euRepresentativeRequest = representativeRequests.find(
    (request) => request.region === "eu"
  );
  const ukRepresentativeRequest = representativeRequests.find(
    (request) => request.region === "uk"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.confirmAccuracy ||
      !formData.confirmResponsibility ||
      !formData.confirmTerms
    ) {
      toast.error("You must agree to all terms", {
        description: "Please confirm all checkboxes before submitting.",
      });
      return;
    }

    setLoading(true);

    try {
      let testReportsFileUrl = null;

      // Upload test report file if exists
      if (formData.testReportsFile && user?.id) {
        const result = await storageService.uploadRepresentativeAddressFile(
          formData.testReportsFile,
          user.id,
          `test-report-${formData.companyName
            .toLowerCase()
            .replace(/\s+/g, "-")}-${Date.now()}`
        );
        testReportsFileUrl = result.publicUrl;
      }

      // Create request
      await createRequest.mutateAsync({
        region: formData.region,
        // Company details
        company_name: formData.companyName,
        company_number: formData.companyNumber,
        vat_number: formData.vatNumber || undefined,
        street_address: formData.streetAddress,
        city: formData.city,
        postal_code: formData.postalCode,
        country: formData.country,
        // Contact info
        contact_name: formData.fullName,
        contact_email: formData.email,
        contact_phone: formData.phone,
        contact_position: formData.position,
        // Additional info
        website_url: formData.websiteUrl || undefined,
        business_role: formData.businessRole as any,
        // Product details
        product_category: formData.productCategory,
        product_information: formData.productInformation,
        // Compliance details
        ce_ukca_marking: formData.ceMarking,
        technical_file_ready: formData.technicalFile,
        required_tests_conducted: formData.requiredTests,
        test_reports_available: formData.testReports,
        test_reports_file_url: testReportsFileUrl || undefined,
        // Confirmations
        confirm_accuracy: formData.confirmAccuracy,
        confirm_responsibility: formData.confirmResponsibility,
        confirm_terms: formData.confirmTerms,
      });

      toast.success("Request submitted", {
        description:
          "Your authorised representative request has been submitted successfully.",
      });

      // Redirect to dashboard after successful submission
      router.push("/dashboard/representative/request/success");
    } catch (error) {
      console.error("Failed to submit request:", error);
      toast.error("Submission failed", {
        description:
          "There was a problem submitting your request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingRepresentativeRequests) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isErrorRepresentativeRequests) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Error loading representative requests</p>
      </div>
    );
  }

  if (euRepresentativeRequest?.status === "pending" && regionParam === "eu") {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="max-w-6xl mx-auto p-8 space-y-8">
          <h1 className="text-2xl font-bold">Representative Request</h1>
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-amber-600" />
                </div>
                <h2 className="text-xl font-semibold">
                  Your Request is Being Processed
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Your EU Authorized Representative request is currently under
                  review. You can check this page for updates on the status of
                  your request.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/representative")}
                >
                  Return to Representative Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (ukRepresentativeRequest?.status === "pending" && regionParam === "uk") {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="max-w-6xl mx-auto p-8 space-y-8">
          <h1 className="text-2xl font-bold">Representative Request</h1>
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-amber-600" />
                </div>
                <h2 className="text-xl font-semibold">
                  Your Request is Being Processed
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Your UK Authorized Representative request is currently under
                  review. You can check this page for updates on the status of
                  your request.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/representative")}
                >
                  Return to Representative Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Representative Request</h1>
              <p className="text-muted-foreground">
                Submit your request to become an authorised representative
              </p>
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Region</div>
            <div className="mt-1 flex items-center gap-2">
              <select
                className="border rounded-md px-3 py-2"
                value={formData.region}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    region: e.target.value as RepresentativeRegion,
                  });
                  router.push(`?region=${e.target.value}`);
                }}
              >
                <option value="eu">European Union (EU)</option>
                <option value="uk">United Kingdom (UK)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Company Details Section */}
        <Card>
          <CardContent className="p-8">
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    Your Company Details
                  </h2>
                  <p className="text-muted-foreground">
                    Provide your company information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                      className="pl-12 bg-white h-12 text-lg"
                      placeholder="e.g. ABC Technology Ltd."
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      value={formData.companyNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyNumber: e.target.value,
                        })
                      }
                      className="pl-12 bg-white h-12 text-lg"
                      placeholder="e.g. 1234567890"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VAT Number (If Applicable)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      value={formData.vatNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, vatNumber: e.target.value })
                      }
                      className="pl-12 bg-white h-12 text-lg"
                      placeholder="e.g. GB123456789"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-semibold">Company Address</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        value={formData.streetAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            streetAddress: e.target.value,
                          })
                        }
                        className="pl-12 bg-white h-12 text-lg"
                        placeholder="e.g. 123 Business Street"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="pl-12 bg-white h-12 text-lg"
                        placeholder="e.g. London"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        value={formData.postalCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            postalCode: e.target.value,
                          })
                        }
                        className="pl-12 bg-white h-12 text-lg"
                        placeholder="e.g. SW1A 1AA"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        className="w-full pl-12 bg-white h-12 text-lg border rounded-md"
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                        required
                      >
                        <option value="">Select Country</option>
                        {euCountries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-semibold">Contact Info</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="pl-12 bg-white h-12 text-lg"
                        placeholder="e.g. John Smith"
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
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="pl-12 bg-white h-12 text-lg"
                        placeholder="e.g. john@company.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="pl-12 bg-white h-12 text-lg"
                        placeholder="e.g. +44 20 7123 4567"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position/Role
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        value={formData.position}
                        onChange={(e) =>
                          setFormData({ ...formData, position: e.target.value })
                        }
                        className="pl-12 bg-white h-12 text-lg"
                        placeholder="e.g. Managing Director"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, websiteUrl: e.target.value })
                      }
                      className="pl-12 bg-white h-12 text-lg"
                      placeholder="e.g. https://www.company.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Business Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      className="w-full pl-12 bg-white h-12 text-lg border rounded-md"
                      value={formData.businessRole}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessRole: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="manufacturer">Manufacturer</option>
                      <option value="importer">Importer</option>
                      <option value="distributor">Distributor</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Details Section */}
        <Card>
          <CardContent className="p-8">
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Product Details</h2>
                  <p className="text-muted-foreground">
                    Provide information about your products
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Category
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      value={formData.productCategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productCategory: e.target.value,
                        })
                      }
                      className="pl-12 bg-white h-12 text-lg"
                      placeholder="e.g. Electronic Devices"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Information
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      className="w-full pl-12 bg-white border rounded-md px-3 py-2 min-h-[120px] text-lg resize-none"
                      value={formData.productInformation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productInformation: e.target.value,
                        })
                      }
                      placeholder="Provide detailed information about your product. e.g. Product features, technical specifications, usage areas, etc."
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Details Section */}
        <Card>
          <CardContent className="p-8">
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Compliance Details</h2>
                  <p className="text-muted-foreground">
                    Provide compliance-related information
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Do you have CE/UKCA marking for your products?
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FileCheck className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      className="w-full pl-12 bg-white h-12 text-lg border rounded-md"
                      value={formData.ceMarking}
                      onChange={(e) =>
                        setFormData({ ...formData, ceMarking: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Option</option>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                      <option value="planned">Planned</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Do you have your technical file ready for submission?
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      className="w-full pl-12 bg-white h-12 text-lg border rounded-md"
                      value={formData.technicalFile}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          technicalFile: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Have the required tests been conducted?
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <ShieldCheck className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      className="w-full pl-12 bg-white h-12 text-lg border rounded-md"
                      value={formData.requiredTests}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requiredTests: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="in-progress">In Progress</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Do you have test reports or notified body certifications?
                  </label>
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FileCheck className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        className="w-full pl-12 bg-white h-12 text-lg border rounded-md"
                        value={formData.testReports}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            testReports: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select Option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        <option value="not-applicable">Not Applicable</option>
                      </select>
                    </div>
                    <div className="relative flex items-center text-lg bg-white gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center pointer-events-none">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium whitespace-nowrap">
                          Upload Document (Optional):
                        </p>
                      </div>
                      <Input
                        type="file"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            testReportsFile: e.target.files?.[0] || null,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agreement Terms Section */}
        <Card>
          <CardContent className="p-8">
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Agreement Terms</h2>
                  <p className="text-muted-foreground">
                    Please review and accept the terms
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="confirmAccuracy"
                    checked={formData.confirmAccuracy}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        confirmAccuracy: checked as boolean,
                      })
                    }
                    required
                    className="mt-1"
                  />
                  <label
                    htmlFor="confirmAccuracy"
                    className="text-sm text-gray-700"
                  >
                    I confirm that all information provided is accurate and
                    complete.
                  </label>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="confirmResponsibility"
                    checked={formData.confirmResponsibility}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        confirmResponsibility: checked as boolean,
                      })
                    }
                    required
                    className="mt-1"
                  />
                  <label
                    htmlFor="confirmResponsibility"
                    className="text-sm text-gray-700"
                  >
                    I understand that Dorukwell does not verify technical files,
                    and compliance remains my responsibility as the
                    manufacturer.
                  </label>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="confirmTerms"
                    checked={formData.confirmTerms}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        confirmTerms: checked as boolean,
                      })
                    }
                    required
                    className="mt-1"
                  />
                  <label
                    htmlFor="confirmTerms"
                    className="text-sm text-gray-700"
                  >
                    I agree to Euverify&apos;s Authorised Representative service
                    terms.
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            className="flex items-center gap-2"
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </div>
  );
}
