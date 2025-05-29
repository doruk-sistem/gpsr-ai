"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AdminBreadcrumbs } from "@/components/admin/layout/breadcrumbs";
import { RepresentativeRequestTable } from "@/components/admin/authorized-reps/representative-request-table";
import { RepresentativeAddressTable } from "@/components/admin/authorized-reps/representative-address-table";
import { Download } from "lucide-react";

export default function AuthorizedRepsPage() {
  const [tabValue, setTabValue] = useState("requests");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Authorized Representatives", href: "/admin/authorized-reps" },
  ];

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={breadcrumbItems} />

      <Tabs
        defaultValue="requests"
        value={tabValue}
        onValueChange={setTabValue}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <TabsList className="mb-0">
            <TabsTrigger value="requests">
              Dorukwell Assignment Requests
            </TabsTrigger>
            <TabsTrigger value="addresses">
              Customer Address Entries
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>
              {tabValue === "requests"
                ? "Representative Assignment Requests"
                : "Customer Address Entries"}
            </CardTitle>
            <CardDescription>
              {tabValue === "requests"
                ? "View and manage requests for Dorukwell to act as an authorized representative"
                : "View and manage customers' self-entered authorized representative addresses"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <TabsContent value="requests" className="m-0">
              <RepresentativeRequestTable />
            </TabsContent>

            <TabsContent value="addresses" className="m-0">
              <RepresentativeAddressTable />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
