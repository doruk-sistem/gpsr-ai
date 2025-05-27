import { cn } from "@/lib/utils/cn";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";

interface DataTablePaginationProps {
  totalItems: number;
  pageSize?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function DataTablePagination({
  totalItems,
  pageSize = 10,
  onPageChange,
  className,
}: DataTablePaginationProps) {
  const {
    currentPage,
    setCurrentPage,
    paginationRange,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
  } = usePagination({
    totalItems,
    pageSize,
    initialPage: 1,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handleNextPage = () => {
    nextPage();
    onPageChange(currentPage + 1);
  };

  const handlePreviousPage = () => {
    previousPage();
    onPageChange(currentPage - 1);
  };

  return (
    <div className={cn("mt-4", className)}>
      <Pagination className="justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePreviousPage}
              className={cn(
                "cursor-pointer",
                !hasPreviousPage && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>

          {paginationRange.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                  size="sm"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={handleNextPage}
              className={cn(
                "cursor-pointer",
                !hasNextPage && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
