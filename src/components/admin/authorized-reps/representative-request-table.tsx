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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MoreHorizontal,
  Check,
  X,
  Eye,
  ArrowUpDown,
  Building2,
} from "lucide-react";
import { useAdminRepresentativeRequests } from "@/hooks/admin/use-admin-representative-requests";
import { RepresentativeRequestModal } from "@/components/admin/authorized-reps/representative-request-modal";
import { cn } from "@/lib/utils/cn";
import { formatDistanceToNow } from "date-fns";

export function RepresentativeRequestTable() {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const {
    data: requests,
    isLoading,
    updateRequestStatus,
  } = useAdminRepresentativeRequests({
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

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejected
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-700 border-gray-200"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewRequest = (id: string) => {
    setSelectedRequestId(id);
  };

  const handleApproveRequest = async (id: string) => {
    await updateRequestStatus.mutateAsync({ id, status: "approved" });
  };

  const handleRejectRequest = async (id: string) => {
    await updateRequestStatus.mutateAsync({ id, status: "rejected" });
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
              <TableHead>Contact</TableHead>
              <TableHead>Business Role</TableHead>
              <TableHead className="w-[100px]">
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead className="w-[120px]">
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("created_at")}
                >
                  Date
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead className="w-[60px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No representative requests found
                </TableCell>
              </TableRow>
            ) : (
              requests?.map((request) => (
                <TableRow
                  key={request.id}
                  className={cn(
                    request.status === "pending" && "bg-amber-50/20"
                  )}
                >
                  <TableCell>
                    <Badge
                      variant={
                        request.region === "eu" ? "default" : "secondary"
                      }
                    >
                      {request.region.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <Building2 className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{request.company_name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{request.contact_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {request.contact_email}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">
                    {request.business_role}
                  </TableCell>
                  <TableCell>{renderStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(request.created_at), {
                      addSuffix: true,
                    })}
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
                          onClick={() => handleViewRequest(request.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {request.status === "pending" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleApproveRequest(request.id)}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Approve Request
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRejectRequest(request.id)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Reject Request
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <RepresentativeRequestModal
        requestId={selectedRequestId}
        open={!!selectedRequestId}
        onClose={() => setSelectedRequestId(null)}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />
    </>
  );
}
