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
import { Button } from "@/components/ui/button";
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
import { 
  MoreHorizontal, 
  Eye, 
  Building2,
  Mail,
  Phone,
  Package,
  AlertCircle,
  FileText,
  ArrowUpDown
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { format } from "date-fns";
import { ManufacturerModal } from "@/components/admin/manufacturers/manufacturer-modal";

interface Manufacturer {
  id: string;
  name: string;
  email: string;
  logo_image_url: string | null;
  phone: string;
  address: string;
  authorised_signatory_name: string;
  country: string;
  position: string;
  signature_image_url: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  product_count?: number;
  user?: {
    email: string;
  };
}

interface ManufacturersTableProps {
  manufacturers: Manufacturer[];
  isLoading: boolean;
}

export function ManufacturersTable({
  manufacturers,
  isLoading
}: ManufacturersTableProps) {
  const [selectedManufacturerId, setSelectedManufacturerId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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
              <TableHead className="w-[80px]">Logo</TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("name")}>
                  Company
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>Contact Information</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("product_count")}>
                  Products
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("created_at")}>
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
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
                    <div className="text-xs text-muted-foreground">
                      Customer: {manufacturer.user?.email || "Unknown"}
                    </div>
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
                  <TableCell>
                    {manufacturer.country}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{manufacturer.product_count || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(manufacturer.created_at), "MMM d, yyyy")}
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
                        <DropdownMenuItem onClick={() => handleViewManufacturer(manufacturer.id)}>
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
      
      <ManufacturerModal
        manufacturerId={selectedManufacturerId}
        open={!!selectedManufacturerId}
        onClose={() => setSelectedManufacturerId(null)}
      />
    </>
  );
}