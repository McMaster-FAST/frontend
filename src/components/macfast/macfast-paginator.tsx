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
  showingCount: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  refetch: () => void;
}
export default function MacFastPaginator({
  pageNumber,
  totalPages,
  showingCount,
  totalCount,
  onPageChange,
  refetch,
}: MacFastPaginatorProps) {
  const nextEnabled = pageNumber < totalPages;
  const previousEnabled = pageNumber > 1;
  return (
    <div className="inline-flex items-center w-full">
       <span className="absolute text-sm text-muted-foreground min-w-fit">
        Showing {showingCount} of {totalCount} results
      </span>
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
    </div>
  );
}
