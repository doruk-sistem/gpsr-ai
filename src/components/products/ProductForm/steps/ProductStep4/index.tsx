import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  FileText,
  UserCheck,
  Package,
  Building,
  SquareArrowOutUpRight,
  Star,
} from "lucide-react";
import { useProductForm } from "../../hooks/useProductForm";

export default function ProductStep4() {
  const { initialData } = useProductForm();

  if (!initialData) return null;

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="text-primary w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-primary mb-2">
              Product Submitted
            </h2>
            <p className="text-muted-foreground text-base">
              All required information about your product has been received. Our
              team will review your submission and contact you if further
              details are needed.
            </p>
          </div>
        </div>
      </div>

      {/* Product Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Product Information</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-primary/5 rounded-lg p-4">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Product Name
                  </Label>
                  <div className="text-lg font-semibold text-gray-900">
                    {initialData.name}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Model
                    </Label>
                    <div className="font-medium">{initialData.model_name}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Batch
                    </Label>
                    <div className="font-medium">
                      {initialData.batch_number}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <Label className="text-xs font-medium text-muted-foreground">
                    CE/UKCA Marking Required
                  </Label>
                  <Badge
                    variant={
                      initialData.require_ce_ukca_marking
                        ? "default"
                        : "secondary"
                    }
                    className="mt-1"
                  >
                    {initialData.require_ce_ukca_marking ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manufacturer & Categories */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Classification</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-primary/5 rounded-lg p-4">
                <Label className="text-sm font-medium text-muted-foreground">
                  Manufacturer
                </Label>
                <div className="text-lg font-semibold text-gray-900">
                  {initialData?.manufacturers?.name || "N/A"}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Category
                  </Label>
                  <p className="text-sm font-semibold">
                    {initialData?.product_categories?.name || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Product Type
                  </Label>
                  <p className="text-sm font-semibold">
                    {initialData?.product_types?.product || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Files */}
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Technical Documentation</h3>
            <Badge variant="secondary" className="ml-auto">
              {initialData.selectedTechnicalFiles?.length || 0} files
            </Badge>
          </div>

          {initialData.selectedTechnicalFiles &&
          initialData.selectedTechnicalFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initialData.selectedTechnicalFiles.map((file) => (
                <div
                  key={file.file_type}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {file.file_type.replace(/_/g, " ").toUpperCase()}
                      </div>
                      {file.not_required ? (
                        <Badge variant="secondary" className="text-xs">
                          Not Required
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-xs">
                          Uploaded
                        </Badge>
                      )}
                    </div>
                  </div>
                  {file.file_url && (
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 p-2 rounded-md hover:bg-primary/5 transition-colors"
                    >
                      <SquareArrowOutUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No technical files uploaded</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notified Body */}
      {initialData.selectedNotifiedBody && (
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <UserCheck className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Notified Body Information</h3>
              <Badge variant="default" className="ml-auto">
                Configured
              </Badge>
            </div>
            <div className="bg-primary/5 rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Organization Name
                </Label>
                <div className="text-base font-semibold">
                  {initialData.selectedNotifiedBody.notified_body_name}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    Notified Body Number
                  </Label>
                  <div className="font-medium">
                    {initialData.selectedNotifiedBody.notified_body_number}
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    Reference Number
                  </Label>
                  <div className="font-medium">
                    {initialData.selectedNotifiedBody.notified_body_ref_number}
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  Address
                </Label>
                <div className="text-sm text-gray-700 mt-1">
                  {initialData.selectedNotifiedBody.notified_body_address}
                </div>
              </div>
              {initialData.selectedNotifiedBody.additional_info && (
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    Additional Information
                  </Label>
                  <div className="text-sm text-gray-700 mt-1">
                    {initialData.selectedNotifiedBody.additional_info}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card className="border border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-blue-900">
              What happens next?
            </h3>
          </div>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <p>
                Our compliance team will review your product information and
                documentation.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <p>You will receive an email confirmation within 24 hours.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <p>
                If additional information is needed, we will contact you
                directly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
