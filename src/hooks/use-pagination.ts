import { useState, useMemo } from "react";

interface UsePaginationProps {
  totalItems: number;
  initialPage?: number;
  pageSize?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  totalPages: number;
  paginationRange: (number | "ellipsis")[];
  nextPage: () => void;
  previousPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function usePagination({
  totalItems,
  initialPage = 1,
  pageSize = 10,
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginationRange = useMemo(() => {
    const range: (number | "ellipsis")[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // First page
      range.push(1);

      // Left ellipsis
      if (currentPage > 3) {
        range.push("ellipsis");
      }

      // Pages around the active page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        range.push(i);
      }

      // Right ellipsis
      if (currentPage < totalPages - 2) {
        range.push("ellipsis");
      }

      // Last page
      if (totalPages > 1) {
        range.push(totalPages);
      }
    }

    return range;
  }, [currentPage, totalPages]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    paginationRange,
    nextPage,
    previousPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}
