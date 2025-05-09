"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Invoice } from "@/hooks/use-invoices";
import { format } from "date-fns";

interface InvoiceTableProps {
  invoices: Invoice[];
  onViewDetails: (invoice: Invoice) => void;
  onDownloadPdf: (invoice: Invoice) => void;
  sortBy: string;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
  isLoading?: boolean;
}

const formatCurrency = (amount: number, currency: string) => {
  if (!currency) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
};

export function InvoiceTable({
  invoices,
  onViewDetails,
  onDownloadPdf,
  sortBy,
  sortDirection,
  onSort,
  isLoading = false,
}: InvoiceTableProps) {
  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ChevronDown className="ml-2 h-4 w-4 rotate-180" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => onSort("invoice_number")}
            >
              <div className="flex items-center">
                Invoice Number {getSortIcon("invoice_number")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => onSort("created_at")}
            >
              <div className="flex items-center">
                Date {getSortIcon("created_at")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => onSort("amount")}
            >
              <div className="flex items-center">
                Amount {getSortIcon("amount")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => onSort("status")}
            >
              <div className="flex items-center">
                Status {getSortIcon("status")}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`loading-${index}`}>
                <TableCell colSpan={5} className="h-16">
                  <div className="flex items-center space-x-4 animate-pulse">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                    <div className="h-4 bg-muted rounded w-24 ml-auto"></div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No invoices found.
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">
                  #{invoice.invoice_number}
                </TableCell>
                <TableCell>
                  {format(new Date(invoice.created_at), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  {formatCurrency(invoice.amount, invoice.currency)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={invoice.status} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(invoice)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownloadPdf(invoice)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
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

interface StatusBadgeProps {
  status: "paid" | "pending" | "failed";
}

function StatusBadge({ status }: StatusBadgeProps) {
  let variant: "default" | "secondary" | "destructive" = "default";
  let label = status.charAt(0).toUpperCase() + status.slice(1);

  switch (status) {
    case "paid":
      variant = "default";
      break;
    case "pending":
      variant = "secondary";
      break;
    case "failed":
      variant = "destructive";
      break;
  }

  return (
    <Badge variant={variant} className="capitalize">
      {label}
    </Badge>
  );
}
