import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReportsSheet from "@/components/macfast/reports/reports-sheet";
import { SafeHtmlInline } from "@/components/macfast/safe-html";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCourseData } from "@/hooks/useCourseData";
import { FileQuestion, InfoIcon } from "lucide-react";
import { useState } from "react";
import { useCourseQuestionAggregateReports } from "@/hooks/useCourseQuestionReports";
import MacFastPaginator from "@/components/macfast/macfast-paginator";
import { SearchBar } from "@/components/macfast/search-bar";

export default function QuestionReportsTab() {
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [pageNumber, setPageNumber] = useState(1);
  const [filters, setFilters] = useState<QuestionReportAggregateFilters>({
    searchQuery: "",
  });

  const { course, isLoading, error, refetch: _, courseCode } = useCourseData();
  const {
    questions,
    totalQuestions,
    totalPages,
    nextPage,
    previousPage,
    refetch,
  } = useCourseQuestionAggregateReports({ pageNumber, filters });
  const [reportSheetOpen, setReportSheetOpen] = useState(false);

  return (
    <div className="w-full h-full font-poppins">
      <Card className="w-full h-full border-light-gray shadow-sm flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg font-bold text-foreground">
              Question Reports
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              View aggregated user reports for questions in this course
            </p>
          </div>
          <SearchBar
            placeholder="Search by question..."
            onSearch={(query) => {
              setFilters({ ...filters, searchQuery: query });
              setPageNumber(1);
            }}
          />
        </CardHeader>

        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
           <p className="min-w-fit text-xs text-muted-foreground inline-flex gap-1 mb-2">
            <InfoIcon className="inline size-4" />
            Click a row to see individual reports for that question.
          </p>
          <Table className="h-full w-full table-fixed">
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-1/2 text-white">Question</TableHead>
                <TableHead className="min-w-fit text-white">Section</TableHead>
                <TableHead className="max-w-fit text-white">
                  Total reports
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6">
                      <Skeleton className="h-4 w-1/2" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-1/4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-1/4" />
                    </TableCell>
                  </TableRow>
                ))
              ) : !questions || questions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileQuestion className="h-8 w-8 text-muted-foreground" />
                      <p>
                        {filters.searchQuery?.length !== 0
                          ? "No reported questions found. Try changing your search query."
                          : "There are no reported questions. Well done!"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((question) => (
                  <TableRow
                    className={`${reportSheetOpen && selectedQuestion === question.public_id && "bg-gold/25"} cursor-pointer`}
                    key={question.public_id}
                    onClick={() => {
                      setSelectedQuestion(question.public_id);
                      setReportSheetOpen(true);
                    }}
                  >
                    <TableCell className="whitespace-normal break-words align-top truncate text-foreground">
                      <SafeHtmlInline html={question.content} />
                    </TableCell>
                    <TableCell className="whitespace-normal break-words align-top text-foreground text-sm">
                      {question.subtopic_name}
                    </TableCell>
                    <TableCell className="align-top text-foreground">
                      {question.total_reports}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          {((questions && questions.length > 0) ||
            filters.searchQuery?.length !== 0) && (
            <MacFastPaginator
              pageNumber={nextPage ? nextPage - 1 : totalPages}
              totalPages={totalPages}
              showingCount={questions.length}
              totalCount={totalQuestions}
              refetch={refetch}
              onPageChange={setPageNumber}
            />
          )}
        </CardFooter>
      </Card>
      <ReportsSheet
        questionId={selectedQuestion}
        open={reportSheetOpen}
        onOpenChange={setReportSheetOpen}
      />
    </div>
  );
}
