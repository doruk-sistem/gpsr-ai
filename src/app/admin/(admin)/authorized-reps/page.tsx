"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAdminRepresentativeRequests } from "@/hooks/admin/use-admin-representative-requests";
import { AdminBreadcrumbs } from "@/components/admin/layout/breadcrumbs";
import { RepresentativeRequestTable } from "@/components/admin/authorized-reps/representative-request-table";
import { RepresentativeAddressTable } from "@/components/admin/authorized-reps/representative-address-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, Download } from "lucide-react";

export default function AuthorizedRepsPage() {
  const [tabValue, setTabValue] = useState("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  
  const { data: requests, isLoading } = useAdminRepresentativeRequests({
    search: searchQuery,
    status: statusFilter !== "all" ? statusFilter : undefined,
    region: regionFilter !== "all" ? regionFilter : undefined,
  });

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Authorized Representatives", href: "/admin/authorized-reps" }
  ];

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={breadcrumbItems} />
      
      <Tabs defaultValue="requests" value={tabValue} onValueChange={setTabValue}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <TabsList className="mb-0">
            <TabsTrigger value="requests">Dorukwell Assignment Requests</TabsTrigger>
            <TabsTrigger value="addresses">Customer Address Entries</TabsTrigger>
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
              {tabValue === "requests" ? "Representative Assignment Requests" : "Customer Address Entries"}
            </CardTitle>
            <CardDescription>
              {tabValue === "requests" 
                ? "View and manage requests for Dorukwell to act as an authorized representative"
                : "View and manage customers' self-entered authorized representative addresses"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by company name, contact, or email..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="eu">EU</SelectItem>
                    <SelectItem value="uk">UK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
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