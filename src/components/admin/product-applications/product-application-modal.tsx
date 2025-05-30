"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Package,
  Building2,
  AlertTriangle,
  ExternalLink,
  File,
  Check,
  X,
  Clock,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";
import { toast } from "sonner";
import { useProductById, useUpdateProduct } from "@/hooks/use-products";
import { useGetProductTechnicalFilesByProductId } from "@/hooks/use-product-technical-files";
import { useUserProductUserDirectives } from "@/hooks/use-user-product-user-directives";
import { useUserProductUserRegulations } from "@/hooks/use-user-product-user-regulations";
import { useUserProductUserStandards } from "@/hooks/use-user-product-user-standards";
import { useProductNotifiedBody } from "@/hooks/use-product-notified-bodies";

import Spinner from "@/components/ui/spinner";

interface ProductApplicationModalProps {
  productId: string | null;
  open: boolean;
  onClose: () => void;
}

export function ProductApplicationModal({
  productId,
  open,
  onClose,
}: ProductApplicationModalProps) {
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { data: product, isLoading } = useProductById(productId || "", {
    select: {
      "*": true,
      product_categories: {
        name: true,
      },
      manufacturers: {
        name: true,
        country: true,
      },
      product_types: {
        product: true,
      },
    },
  });
  const { data: technicalFiles, isLoading: isLoadingFiles } =
    useGetProductTechnicalFilesByProductId(productId || "");
  const {
    data: userProductUserDirectives,
    isLoading: isLoadingUserProductUserDirectives,
  } = useUserProductUserDirectives(productId || "");
  const {
    data: userProductUserRegulations,
    isLoading: isLoadingUserProductUserRegulations,
  } = useUserProductUserRegulations(productId || "");
  const {
    data: userProductUserStandards,
    isLoading: isLoadingUserProductUserStandards,
  } = useUserProductUserStandards(productId || "");
  const { data: productNotifiedBody, isLoading: isLoadingNotifiedBody } =
    useProductNotifiedBody(productId || "");

  const updateProduct = useUpdateProduct();

  const handleStatusChange = async (
    newStatus: "pending" | "rejected" | "completed" | "incomplete"
  ) => {
    if (!productId || !product) return;

    setUpdatingStatus(true);
    try {
      await updateProduct.mutateAsync({
        id: productId,
        product: {
          status: newStatus,
        },
      });

      toast.success(
        `Product status successfully changed to ${
          newStatus === "completed"
            ? "completed"
            : newStatus === "rejected"
            ? "rejected"
            : "updated"
        }`
      );
    } catch (error) {
      toast.error("An error occurred while updating product status");
      console.error("Status update error:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <Check className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "incomplete":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <Info className="w-3 h-3 mr-1" />
            Incomplete
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <DialogTitle>Product Application Details</DialogTitle>
              <DialogDescription>
                View detailed information about this product
              </DialogDescription>
            </div>
            {product && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  {getStatusBadge(product.status || "incomplete")}
                </div>
              </div>
            )}
          </div>
        </DialogHeader>

        <Tabs
          defaultValue="details"
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="mx-6 justify-start">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="documents">Technical Files</TabsTrigger>
            <TabsTrigger value="notified-body">Notified Body</TabsTrigger>
            <TabsTrigger value="images">Product Images</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto px-6">
            <TabsContent value="details" className="mt-6 space-y-6">
              {isLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <>
                  <div className="bg-muted/50 rounded-lg p-4 border space-y-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 rounded-md">
                        {product?.image_urls &&
                        product.image_urls.length > 0 ? (
                          <AvatarImage
                            src={product.image_urls[0]}
                            alt={product?.name}
                            className="object-cover"
                          />
                        ) : (
                          <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                            <Package className="h-8 w-8" />
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{product?.name}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700"
                          >
                            {product?.product_categories?.name}
                          </Badge>
                          <Badge variant="outline">
                            {product?.product_types?.product}
                          </Badge>
                          {product?.require_ce_ukca_marking ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              CE/UKCA Required
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              CE/UKCA Not Required
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Model Name
                        </p>
                        <p className="font-medium">{product?.model_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Batch Number
                        </p>
                        <p className="font-medium">{product?.batch_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Created Date
                        </p>
                        <p className="font-medium">
                          {product &&
                            format(
                              new Date(product?.created_at || ""),
                              "MMMM d, yyyy"
                            )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Last Updated
                        </p>
                        <p className="font-medium">
                          {product &&
                            format(
                              new Date(product?.updated_at || ""),
                              "MMMM d, yyyy"
                            )}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Specifications
                      </p>
                      <p className="whitespace-pre-wrap">
                        {product?.specification}
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 border space-y-4">
                    <h3 className="font-medium flex items-center">
                      <Building2 className="h-5 w-5 mr-2 text-primary" />
                      Manufacturer Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Company Name
                        </p>
                        <p className="font-medium">
                          {product?.manufacturers?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Country</p>
                        <p className="font-medium">
                          {product?.manufacturers?.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isLoadingUserProductUserDirectives ||
                  isLoadingUserProductUserRegulations ||
                  isLoadingUserProductUserStandards ? (
                    <Spinner />
                  ) : (
                    <Accordion type="single" collapsible>
                      <AccordionItem value="directives">
                        <AccordionTrigger>Directives</AccordionTrigger>
                        <AccordionContent>
                          {userProductUserDirectives &&
                          userProductUserDirectives.length > 0 ? (
                            <div className="space-y-2">
                              {userProductUserDirectives.map(
                                (directive, index: number) => (
                                  <div
                                    key={index}
                                    className="bg-background p-2 rounded border"
                                  >
                                    {directive?.directive_name} (
                                    {directive?.directive_number})
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">
                              No directives specified
                            </p>
                          )}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="regulations">
                        <AccordionTrigger>Regulations</AccordionTrigger>
                        <AccordionContent>
                          {userProductUserRegulations &&
                          userProductUserRegulations.length > 0 ? (
                            <div className="space-y-2">
                              {userProductUserRegulations.map(
                                (regulation, index: number) => (
                                  <div
                                    key={index}
                                    className="bg-background p-2 rounded border"
                                  >
                                    {regulation.regulation_name} (
                                    {regulation.regulation_number})
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">
                              No regulations specified
                            </p>
                          )}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="standards">
                        <AccordionTrigger>Standards</AccordionTrigger>
                        <AccordionContent>
                          {userProductUserStandards &&
                          userProductUserStandards.length > 0 ? (
                            <div className="space-y-2">
                              {userProductUserStandards.map(
                                (standard, index: number) => (
                                  <div
                                    key={index}
                                    className="bg-background p-2 rounded border"
                                  >
                                    {standard.ref_no} - {standard.title} -{" "}
                                    {standard.edition_date}
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">
                              No standards specified
                            </p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              {isLoadingFiles ? (
                <div className="space-y-6">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : technicalFiles && technicalFiles.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                  <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <h3 className="font-medium text-amber-800">
                    No Technical Files Uploaded
                  </h3>
                  <p className="text-amber-700 mt-2">
                    The customer has not uploaded any technical files for this
                    product yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {technicalFiles?.map((file) => (
                    <div
                      key={file.id}
                      className={cn(
                        "border rounded-lg p-4",
                        file.not_required ? "bg-muted/30" : "bg-white"
                      )}
                    >
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">
                          {formatFileType(file.file_type)}
                        </h4>
                        {file.not_required ? (
                          <Badge variant="outline">Not Required</Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Available
                          </Badge>
                        )}
                      </div>

                      {file.not_required ? (
                        <p className="text-sm text-muted-foreground">
                          Reason:{" "}
                          {file.not_required_reason || "No reason provided"}
                        </p>
                      ) : file.file_url ? (
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-primary" />
                          <a
                            href={file.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View Document
                            <ExternalLink className="ml-1 h-3 w-3 inline" />
                          </a>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          File URL not available
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground mt-2">
                        Last updated:{" "}
                        {format(
                          new Date(file.updated_at || ""),
                          "MMMM d, yyyy"
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="notified-body" className="mt-6">
              {isLoadingNotifiedBody ? (
                <Spinner />
              ) : productNotifiedBody ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-900 mb-1">
                          {productNotifiedBody.notified_body_name}
                        </h3>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          Notified Body Required
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-blue-700 mb-1">
                            Notified Body Name
                          </p>
                          <p className="text-gray-900 bg-white/60 p-2 rounded border">
                            {productNotifiedBody.notified_body_name || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-blue-700 mb-1">
                            4-Digit Notified Body Number
                          </p>
                          <p className="text-gray-900 bg-white/60 p-2 rounded border font-mono">
                            {productNotifiedBody.notified_body_number || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-blue-700 mb-1">
                            Reference Number
                          </p>
                          <p className="text-gray-900 bg-white/60 p-2 rounded border font-mono">
                            {productNotifiedBody.notified_body_ref_number ||
                              "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-blue-700 mb-1">
                            Address
                          </p>
                          <p className="text-gray-900 bg-white/60 p-3 rounded border whitespace-pre-wrap">
                            {productNotifiedBody.notified_body_address || "N/A"}
                          </p>
                        </div>

                        {productNotifiedBody.additional_info && (
                          <div>
                            <p className="text-sm font-medium text-blue-700 mb-1">
                              Additional Information
                            </p>
                            <p className="text-gray-900 bg-white/60 p-3 rounded border whitespace-pre-wrap">
                              {productNotifiedBody.additional_info}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between text-xs text-blue-600">
                      <span>
                        Created:{" "}
                        {format(
                          new Date(productNotifiedBody.created_at || ""),
                          "MMMM d, yyyy"
                        )}
                      </span>
                      <span>
                        Updated:{" "}
                        {format(
                          new Date(productNotifiedBody.updated_at || ""),
                          "MMMM d, yyyy"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Notified Body Required
                  </h3>
                  <p className="text-gray-600">
                    This product does not require a notified body assessment
                    according to the customer&apos;s specification.
                  </p>
                  <Badge variant="outline" className="mt-3">
                    Self-Assessment Product
                  </Badge>
                </div>
              )}
            </TabsContent>

            <TabsContent value="images" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array(3)
                    .fill(null)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-48 w-full" />
                    ))}
                </div>
              ) : product?.image_urls && product.image_urls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.image_urls.map((url: string, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="relative h-48">
                        <Image
                          src={url}
                          alt={`${product.name} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-2 bg-muted">
                        <p className="text-xs text-muted-foreground">
                          Image {index + 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/50 border rounded-lg p-6 text-center">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium">No Product Images</h3>
                  <p className="text-muted-foreground mt-2">
                    This product does not have any images uploaded.
                  </p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="flex-none px-6 pt-4">
          {product?.status === "pending" ? (
            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onClose()}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleStatusChange("rejected")}
                disabled={updatingStatus}
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={() => handleStatusChange("completed")}
                disabled={updatingStatus}
              >
                <Check className="h-4 w-4 mr-2" />
                Complete
              </Button>
            </div>
          ) : (
            <Button onClick={() => onClose()}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatFileType(fileType: string): string {
  return fileType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
