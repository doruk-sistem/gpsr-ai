"use client";

import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Eye,
  Building2,
  ArrowUpDown,
  Flag,
} from "lucide-react";
import { format } from "date-fns";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

import { useAdminRepresentativeAddresses } from "@/hooks/admin/use-admin-representative-addresses";
import { useDebounce } from "@/hooks/use-debounce";

import { cn } from "@/lib/utils/cn";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { RepresentativeAddressModal } from "@/components/admin/authorized-reps/representative-address-modal";

export function RepresentativeAddressTable() {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: addressesData, isLoading } = useAdminRepresentativeAddresses({
    sort: sortBy,
    order: sortOrder,
    search: debouncedSearchQuery,
    region: regionFilter !== "all" ? (regionFilter as any) : undefined,
    page: currentPage,
    pageSize,
  });

  const addresses = addressesData?.data || [];
  const totalItems = addressesData?.count || 0;

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleViewAddress = (id: string) => {
    setSelectedAddressId(id);
  };

  return (
    <>
      {/* Search and Filter */}
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

      {/* Data Table */}
      {isLoading ? (
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
                  <TableHead className="w-[100px]">Region</TableHead>
                  <TableHead>
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSort("company_name")}
                    >
                      Company
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[120px]">
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSort("created_at")}
                    >
                      Created
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[60px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {addresses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No representative addresses found
                    </TableCell>
                  </TableRow>
                ) : (
                  addresses.map((address) => (
                    <TableRow key={address.id}>
                      <TableCell>
                        <Badge
                          variant={
                            address.region === "eu" ? "default" : "secondary"
                          }
                        >
                          {address.region.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            {address.company_logo_url ? (
                              <AvatarImage
                                src={address.company_logo_url}
                                alt={address.company_name}
                              />
                            ) : (
                              <AvatarFallback className="bg-primary/10 text-primary">
                                <Building2 className="h-4 w-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="font-medium">
                            {address.company_name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={address.company_address}
                      >
                        {address.company_address}
                      </TableCell>
                      <TableCell className="flex items-center gap-1.5">
                        <Flag className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{address.country}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={address.is_active ? "outline" : "secondary"}
                          className={cn(
                            address.is_active &&
                              "bg-green-50 text-green-700 border-green-200"
                          )}
                        >
                          {address.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(address.created_at), "MMM d, yyyy")}
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
                              onClick={() => handleViewAddress(address.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Flag className="mr-2 h-4 w-4" />
                              {address.is_active
                                ? "Mark as Inactive"
                                : "Mark as Active"}
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

      <RepresentativeAddressModal
        addressId={selectedAddressId}
        open={!!selectedAddressId}
        onClose={() => setSelectedAddressId(null)}
      />
    </>
  );
}
