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
import { ManufacturersTable } from "@/components/admin/manufacturers/manufacturers-table";
import { Download } from "lucide-react";

export default function ManufacturersPage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Manufacturers", href: "/admin/manufacturers" },
  ];

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={breadcrumbItems} />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <CardTitle>Manufacturer Directory</CardTitle>
              <CardDescription>
                View all manufacturers added by customers
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ManufacturersTable />
        </CardContent>
      </Card>
    </div>
  );
}
