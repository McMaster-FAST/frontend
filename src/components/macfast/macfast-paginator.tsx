import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MacFastPaginatorProps {
  pageNumber: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  refetch: () => void;
}
export default function MacFastPaginator({
  pageNumber,
  totalPages,
  onPageChange,
  refetch,
}: MacFastPaginatorProps) {
  const nextEnabled = pageNumber < totalPages;
  const previousEnabled = pageNumber > 1;
  return (
    <Pagination>
      <PaginationPrevious
        className={!previousEnabled ? "pointer-events-none opacity-50" : ""}
        onClick={() => {
          if (!previousEnabled) return;
          onPageChange(pageNumber - 1);
          refetch();
        }}
      />

      <PaginationContent>
        <Badge>
          Page {pageNumber} of {totalPages}
        </Badge>
      </PaginationContent>

      <PaginationNext
        className={!nextEnabled ? "pointer-events-none opacity-50" : ""}
        onClick={() => {
          if (!nextEnabled) return;
          onPageChange(pageNumber + 1);
          refetch();
        }}
      />
    </Pagination>
  );
}
