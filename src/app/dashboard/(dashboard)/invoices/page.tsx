"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useInvoices,
  useInvoicePdf,
  useInvoiceDetails,
  useExportInvoices,
  type Invoice,
} from "@/hooks/use-invoices";
import { InvoiceTable } from "@/components/invoices/invoice-table";
import { InvoiceFilters } from "@/components/invoices/invoice-filters";
import { InvoiceDetailModal } from "@/components/invoices/invoice-detail-modal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  RefreshCw,
  AlertTriangle,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";

export default function InvoicesPage() {
  const router = useRouter();

  // State for filters and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // State for selected invoice (for details modal)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, startDate, endDate]);

  // Fetch invoices with current filters
  const {
    data,
    isLoading: isLoadingInvoices,
    isError: isInvoicesError,
    error: invoicesError,
    refetch: refetchInvoices,
  } = useInvoices({
    search: searchQuery,
    status: selectedStatus,
    startDate,
    endDate,
    page: currentPage,
    pageSize: 10,
    sortBy,
    sortDirection,
  });

  // Fetch invoice PDF when needed
  const { refetch: fetchPdf, isLoading: isDownloadingPdf } = useInvoicePdf(
    selectedInvoice?.id || ""
  );

  // Fetch invoice details when a specific invoice is selected
  const { data: invoiceDetails, isLoading: isLoadingDetails } =
    useInvoiceDetails(selectedInvoice?.id || "");

  // Export functionality
  const exportInvoicesMutation = useExportInvoices("pdf");

  // Sorting handler
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Default to descending for new column
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  // View invoice details handler
  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  // Download PDF handler
  const handleDownloadPdf = async (invoice: Invoice) => {
    try {
      const result = await fetchPdf();

      if (result.data) {
        // In a real app, this would trigger an actual download
        // For now, we'll just show a success toast
        toast.success("Invoice PDF ready", {
          description: `Invoice #${invoice.invoice_number} downloaded successfully`,
        });
      }
    } catch (error) {
      toast.error("Download failed", {
        description: "Could not download the PDF. Please try again later.",
      });
    }
  };

  // Export handler
  const handleExport = async (format: "csv" | "pdf") => {
    try {
      await exportInvoicesMutation.mutateAsync({
        search: searchQuery,
        status: selectedStatus,
        startDate,
        endDate,
      });

      toast.success(`${format.toUpperCase()} export ready`, {
        description: `Your invoices have been exported successfully`,
      });
    } catch (error) {
      toast.error("Export failed", {
        description: "Could not generate the export. Please try again later.",
      });
    }
  };

  // Check if this is a "no invoices yet" scenario rather than a technical error
  const isNoInvoicesYet =
    (isInvoicesError &&
      (invoicesError as any)?.message?.includes(
        "No active subscription found"
      )) ||
    (invoicesError as any)?.message?.includes("No Stripe customer found");

  return (
    <div className="container mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle>Invoices</CardTitle>
            <CardDescription>
              View and manage your billing history
            </CardDescription>
          </div>
          {isInvoicesError && !isNoInvoicesYet && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchInvoices()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isInvoicesError ? (
            isNoInvoicesYet ? (
              <div className="text-center py-12 px-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-muted">
                    <Receipt className="h-10 w-10 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-medium">No Invoices Yet</h3>
                <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                  You don't have any invoices yet. Once you make a purchase or
                  subscribe to a plan, your invoices will appear here.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/billing")}
                  className="mt-4"
                >
                  View Subscription Plans
                </Button>
              </div>
            ) : (
              <div className="rounded-md bg-destructive/10 p-6 flex items-center space-x-4 my-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <div>
                  <h3 className="font-medium text-destructive">
                    Error loading invoices
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    There was an error loading your invoice data. Please try
                    again.
                  </p>
                </div>
              </div>
            )
          ) : (
            <>
              <InvoiceFilters
                onSearch={setSearchQuery}
                onStatusChange={setSelectedStatus}
                onDateRangeChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
                onExport={handleExport}
                isExporting={exportInvoicesMutation.isPending}
              />

              <div className="mt-6">
                <InvoiceTable
                  invoices={data?.invoices || []}
                  onViewDetails={handleViewDetails}
                  onDownloadPdf={handleDownloadPdf}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  isLoading={isLoadingInvoices}
                />
              </div>

              {data && data.totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1 || isLoadingInvoices}
                        />
                      </PaginationItem>

                      {Array.from(
                        { length: Math.min(data.totalPages, 5) },
                        (_, i) => {
                          let pageNum = currentPage;

                          // Adjust page numbers based on current page and total pages
                          if (data.totalPages <= 5) {
                            pageNum = i + 1;
                          } else {
                            if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= data.totalPages - 2) {
                              pageNum = data.totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                          }

                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                onClick={() => setCurrentPage(pageNum)}
                                isActive={currentPage === pageNum}
                                disabled={isLoadingInvoices}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage(
                              Math.min(data.totalPages, currentPage + 1)
                            )
                          }
                          disabled={
                            currentPage === data.totalPages || isLoadingInvoices
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}

          {/* Empty state if no invoices are found and not loading */}
          {!isLoadingInvoices &&
            !isInvoicesError &&
            data?.invoices.length === 0 && (
              <div className="mt-6 text-center py-12 px-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-muted">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-medium">No invoices found</h3>
                <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                  You don't have any invoices that match your current filters.
                  Try adjusting your search or filters.
                </p>
                {(searchQuery ||
                  selectedStatus !== "all" ||
                  startDate ||
                  endDate) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedStatus("all");
                      setStartDate(undefined);
                      setEndDate(undefined);
                    }}
                    className="mt-4"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            )}
        </CardContent>
      </Card>

      {/* Invoice detail modal */}
      {selectedInvoice && (
        <InvoiceDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          invoice={invoiceDetails}
          isLoading={isLoadingDetails}
          onDownload={() => handleDownloadPdf(selectedInvoice)}
          isDownloading={isDownloadingPdf}
        />
      )}
    </div>
  );
}
