"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Building2,
  Mail,
  Phone,
  FileText,
  ArrowUpDown,
  Search,
  RefreshCw,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ManufacturerModal } from "@/components/admin/manufacturers/manufacturer-modal";

import { useAdminManufacturers } from "@/hooks/admin/use-admin-manufacturers";
import { useDebounce } from "@/hooks/use-debounce";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { CountryDropdown } from "@/components/ui/country-dropdown";

export function ManufacturersTable() {
  const [selectedManufacturerId, setSelectedManufacturerId] = useState<
    string | null
  >(null);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const pageSize = 10;

  const {
    data: manufacturersData,
    isLoading,
    refetch,
  } = useAdminManufacturers({
    search: debouncedSearchQuery,
    country: countryFilter === null ? undefined : countryFilter,
    sort: sortBy,
    order: sortOrder,
    page: currentPage,
    pageSize,
  });

  const manufacturers = manufacturersData?.data;
  const totalItems = manufacturersData?.totalPages || 0;

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleViewManufacturer = (id: string) => {
    setSelectedManufacturerId(id);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by manufacturer name, email, or phone..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <CountryDropdown
            onChange={(country) => setCountryFilter(country?.name || null)}
            placeholder="All Countries"
            className="min-w-[180px] h-9"
          />
        </div>

        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

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
                  <TableHead className="w-[80px]">Logo</TableHead>
                  <TableHead>
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Company
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead>Contact Information</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSort("created_at")}
                    >
                      Registered
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[60px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manufacturers?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No manufacturers found
                    </TableCell>
                  </TableRow>
                ) : (
                  manufacturers?.map((manufacturer) => (
                    <TableRow key={manufacturer.id}>
                      <TableCell>
                        <Avatar className="h-10 w-10 rounded-md">
                          {manufacturer.logo_image_url ? (
                            <AvatarImage
                              src={manufacturer.logo_image_url}
                              alt={manufacturer.name}
                              className="object-cover"
                            />
                          ) : (
                            <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                              <Building2 className="h-5 w-5" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{manufacturer.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <a
                            href={`mailto:${manufacturer.email}`}
                            className="text-primary hover:underline"
                          >
                            {manufacturer.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1 text-sm mt-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{manufacturer.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>{manufacturer.country}</TableCell>
                      <TableCell>
                        {format(
                          new Date(manufacturer.created_at),
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
                              onClick={() =>
                                handleViewManufacturer(manufacturer.id)
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              View Products
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

      <ManufacturerModal
        manufacturerId={selectedManufacturerId}
        open={!!selectedManufacturerId}
        onClose={() => setSelectedManufacturerId(null)}
      />
    </>
  );
}
