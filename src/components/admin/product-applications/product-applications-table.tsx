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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/hooks/use-product-categories";
import { useDebounce } from "@/hooks/use-debounce";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useProducts } from "@/hooks/use-products";

export function ProductApplicationsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<Product["status"] | "all">(
    "all"
  );
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
  } = useProducts({
    search: debouncedSearchQuery,
    categoryId: categoryFilter !== "all" ? categoryFilter : undefined,
    page: currentPage,
    pageSize,
    status: statusFilter !== "all" ? statusFilter : undefined,
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

  const { data: productCategories, isLoading: isLoadingProductCategories } =
    useCategories({
      select: {
        id: true,
        name: true,
      },
    });

  const products = productsData?.data;
  const totalItems = productsData?.count || 0;

  const renderStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejected
          </Badge>
        );
      case "incomplete":
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-700 border-gray-200"
          >
            Incomplete
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewProduct = (id: string) => {
    setSelectedProductId(id);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name, model or batch number..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
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

        <div className="flex flex-wrap gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as Product["status"])
            }
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
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
                        {renderStatusBadge(product?.status || "pending")}
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
