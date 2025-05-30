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
import { CustomersTable } from "@/components/admin/customers/customers-table";
import { Download } from "lucide-react";

export default function CustomersPage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Customers", href: "/admin/customers" },
  ];

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={breadcrumbItems} />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>
                View and manage all customer accounts
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
          <CustomersTable />
        </CardContent>
      </Card>
    </div>
  );
}
