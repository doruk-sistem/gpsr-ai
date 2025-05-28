"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminBreadcrumbs } from "@/components/admin/layout/breadcrumbs";
import { ProductApplicationsTable } from "@/components/admin/product-applications/product-applications-table";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProductApplicationsPage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Product Applications", href: "/admin/product-applications" },
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
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ProductApplicationsTable />
        </CardContent>
      </Card>
    </div>
  );
}
