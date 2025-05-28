"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Eye,
  Package,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { ProductApplicationModal } from "@/components/admin/product-applications/product-application-modal";
import { type Product } from "@/lib/services/products-service";
import { useAdminProducts } from "@/hooks/admin/use-admin-products";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/hooks/use-product-categories";
import { useDebounce } from "@/hooks/use-debounce";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export function ProductApplicationsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    refetch,
  } = useAdminProducts({
    search: debouncedSearchQuery,
    categoryId: categoryFilter !== "all" ? categoryFilter : undefined,
    page: currentPage,
    pageSize,
  });

  const { data: productCategories, isLoading: isLoadingProductCategories } =
    useCategories({
      select: {
        id: true,
        name: true,
      },
    });

  const products = productsData?.data;
  const totalItems = productsData?.count || 0;

  const statusColors: Record<NonNullable<Product["status"]>, string> = {
    pending: "bg-yellow-500",
    completed: "bg-green-500",
    incomplete: "bg-blue-500",
    reject: "bg-red-500",
  };

  const handleViewProduct = (id: string) => {
    setSelectedProductId(id);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name, model or batch number..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {productCategories?.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {isLoadingProducts || isLoadingProductCategories ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[120px]">Created</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  products?.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Avatar className="h-10 w-10 rounded-md">
                          {product.image_urls &&
                          product.image_urls.length > 0 ? (
                            <AvatarImage
                              src={product.image_urls[0]}
                              alt={product.name}
                              className="object-cover"
                            />
                          ) : (
                            <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                              <Package className="h-5 w-5" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{product?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Model: {product?.model_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{product?.product_categories?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {product?.product_types?.product}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{product?.manufacturers?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {product?.manufacturers?.country}
                        </div>
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
                        {format(
                          new Date(product?.created_at || ""),
                          "MMM d, yyyy"
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleViewProduct(product.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <DataTablePagination
            totalItems={totalItems}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <ProductApplicationModal
        productId={selectedProductId}
        open={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </>
  );
}
