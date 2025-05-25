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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MoreHorizontal, 
  Eye, 
  FileText, 
  Package,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { format } from "date-fns";
import { ProductApplicationModal } from "@/components/admin/product-applications/product-application-modal";

interface Product {
  id: string;
  name: string;
  category_id: number;
  product_type_id: number;
  require_ce_ukca_marking: boolean;
  batch_number: string;
  model_name: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
  manufacturer_id: string;
  product_categories: {
    name: string;
  };
  product_types: {
    product: string;
  };
  manufacturers: {
    name: string;
    country: string;
  };
}

interface ProductApplicationsTableProps {
  products: Product[];
  isLoading: boolean;
}

export function ProductApplicationsTable({
  products,
  isLoading
}: ProductApplicationsTableProps) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleViewProduct = (id: string) => {
    setSelectedProductId(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead className="w-[120px]">CE/UKCA</TableHead>
              <TableHead className="w-[120px]">Created</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Avatar className="h-10 w-10 rounded-md">
                      {product.image_urls && product.image_urls.length > 0 ? (
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
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Model: {product.model_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{product.product_categories.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.product_types.product}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{product.manufacturers?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.manufacturers?.country}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.require_ce_ukca_marking ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex gap-1.5 items-center">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Required
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex gap-1.5 items-center">
                        <XCircle className="h-3.5 w-3.5" />
                        Not Required
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(product.created_at), "MMM d, yyyy")}
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
                        <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          View Documents
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
      
      <ProductApplicationModal
        productId={selectedProductId}
        open={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </>
  );
}