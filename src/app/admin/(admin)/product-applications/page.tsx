"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminProducts } from "@/hooks/admin/use-admin-products";
import { AdminBreadcrumbs } from "@/components/admin/layout/breadcrumbs";
import { ProductApplicationsTable } from "@/components/admin/product-applications/product-applications-table";
import { Filter, Search, Download, UploadCloud, RefreshCw, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProductApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [ceMarking, setCeMarking] = useState("all");
  
  const { data: products, isLoading, refetch } = useAdminProducts({
    search: searchQuery,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    requireCeMarking: ceMarking !== "all" ? ceMarking === "required" : undefined,
  });

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Product Applications", href: "/admin/product-applications" }
  ];

  const handleExport = (format: "csv" | "excel") => {
    // In a real application, this would trigger an export
    console.log(`Exporting as ${format}`);
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={breadcrumbItems} />
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <CardTitle>Product Applications</CardTitle>
              <CardDescription>
                Manage all product applications submitted by customers
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("csv")}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("excel")}>
                    Export as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    Batch Update Status
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Generate Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
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
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="toys">Toys</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={ceMarking} onValueChange={setCeMarking}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="CE/UKCA Marking" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="required">CE/UKCA Required</SelectItem>
                  <SelectItem value="not-required">CE/UKCA Not Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <ProductApplicationsTable isLoading={isLoading} products={products || []} />
        </CardContent>
      </Card>
    </div>
  );
}