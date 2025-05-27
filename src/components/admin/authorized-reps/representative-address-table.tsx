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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MoreHorizontal, 
  Eye, 
  Building2,
  ArrowUpDown,
  Flag
} from "lucide-react";
import { useAdminRepresentativeAddresses } from "@/hooks/admin/use-admin-representative-addresses";
import { cn } from "@/lib/utils/cn";
import { format } from "date-fns";

export function RepresentativeAddressTable() {
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const { 
    data: addresses, 
    isLoading
  } = useAdminRepresentativeAddresses({
    sort: sortBy,
    order: sortOrder,
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Region</TableHead>
            <TableHead>
              <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("company_name")}>
                Company
                <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
              </div>
            </TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Country</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[120px]">
              <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("created_at")}>
                Created On
                <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
              </div>
            </TableHead>
            <TableHead className="w-[60px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addresses?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No representative addresses found
              </TableCell>
            </TableRow>
          ) : (
            addresses?.map((address) => (
              <TableRow key={address.id}>
                <TableCell>
                  <Badge variant={address.region === "eu" ? "default" : "secondary"}>
                    {address.region.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {address.company_logo_url ? (
                        <AvatarImage src={address.company_logo_url} alt={address.company_name} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <Building2 className="h-4 w-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="font-medium">{address.company_name}</div>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate" title={address.company_address}>
                  {address.company_address}
                </TableCell>
                <TableCell className="flex items-center gap-1.5">
                  <Flag className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{address.country}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={address.is_active ? "outline" : "secondary"} className={cn(
                    address.is_active && "bg-green-50 text-green-700 border-green-200"
                  )}>
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
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Flag className="mr-2 h-4 w-4" />
                        {address.is_active ? "Mark as Inactive" : "Mark as Active"}
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
  );
}