"use client";

import React from "react";
import {
  useProducts,
  useDeleteProduct,
  useProductsCount,
} from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Package,
  PlusCircle,
  AlertCircle,
  Lock,
} from "lucide-react";
import Image from "next/image";
import Spinner from "@/components/ui/spinner";
import { useActivePlan } from "@/hooks/use-stripe";
import { Progress } from "@/components/ui/progress";
import { Product } from "@/lib/services/products-service";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage() {
  const router = useRouter();
  const deleteProduct = useDeleteProduct();
  const { data: productsData, isLoading: isProductsLoading } = useProducts({
    select: {
      "*": true,
      product_categories: "*",
      product_types: "*",
    },
  });
  const { data: activePlan, isLoading: isActivePlanLoading } = useActivePlan();
  const { data: productsCount, isLoading: isProductsCountLoading } =
    useProductsCount();

  const products = productsData?.data || [];
  const productLimit = activePlan?.product_limit || 0;
  const currentProductCount = productsCount || 0;
  const isLimitReached = currentProductCount >= productLimit;

  const statusColors: Record<NonNullable<Product["status"]>, string> = {
    pending: "bg-yellow-500 hover:bg-yellow-600",
    completed: "bg-green-500 hover:bg-green-600",
    incomplete: "bg-blue-500 hover:bg-blue-600",
    rejected: "bg-red-500 hover:bg-red-600",
  };

  const handleAddProduct = () => {
    if (isLimitReached) {
      toast.error(
        "You have reached your product limit. Please upgrade your plan to add more products."
      );
      router.push("/dashboard/billing");
      return;
    }
    router.push("/dashboard/products/add");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete product");
    }
  };

  if (isProductsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground">
              Manage your GPSR compliant products
            </p>
          </div>
        </div>
        <Button
          onClick={handleAddProduct}
          className="flex items-center gap-2"
          disabled={isLimitReached}
        >
          {isLimitReached ? (
            <>
              <Lock className="h-4 w-4" />
              Upgrade Plan
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              Add New Product
            </>
          )}
        </Button>
      </div>

      {/* Product Limit Progress Bar */}
      {isProductsCountLoading || isActivePlanLoading ? (
        <div className="flex items-center justify-center h-24">
          <Spinner />
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Product Limit: {currentProductCount} / {productLimit}
                </span>
                {isLimitReached && (
                  <Button
                    variant="link"
                    className="text-primary p-0 h-auto"
                    onClick={() => router.push("/dashboard/billing")}
                  >
                    Upgrade Plan
                  </Button>
                )}
              </div>
              <Progress
                value={(currentProductCount / productLimit) * 100}
                className={isLimitReached ? "bg-red-100" : ""}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          {products?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-1">
                No products found
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by adding your first product
              </p>
              <Button
                onClick={handleAddProduct}
                variant="outline"
                className="flex items-center gap-2"
                disabled={isLimitReached}
              >
                {isLimitReached ? (
                  <>
                    <Lock className="h-4 w-4" />
                    Upgrade Plan
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4" />
                    Add Your First Product
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Product Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((product) => (
                    <TableRow key={product.id} className="hover:bg-muted/50">
                      <TableCell>
                        {product.image_urls && product.image_urls[0] ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border">
                            <Image
                              src={product.image_urls[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center border">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.product_categories.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.product_types.product}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="default"
                          className={`${statusColors[product?.status!]}`}
                        >
                          {product?.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              router.push(`/dashboard/products/${product.id}`)
                            }
                            className="hover:bg-muted"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                            disabled={deleteProduct.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
