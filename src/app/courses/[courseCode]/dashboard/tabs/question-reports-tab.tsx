import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReportsSheet from "@/components/ui/custom/reports/reports-sheet";
import { SafeHtmlInline } from "@/components/ui/custom/safe-html";
import { SearchBar } from "@/components/ui/custom/search-bar";
import { ScrollArea } from "@/components/ui/scroll-area";

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
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { getAggregateReports } from "@/lib/question-api";
import QuestionReportAggregation from "@/types/QuestionReportAggregation";

import { FileQuestion } from "lucide-react";
import { useEffect, useState } from "react";

export default function QuestionReportsTab() {
  const [reports, setReports] = useState<QuestionReportAggregation[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const { course, isLoading, error, refetch: _, courseCode } = useCourseData();
  const authFetch = useAuthFetch();
  const [reportSheetOpen, setReportSheetOpen] = useState(false);

  useEffect(() => {
    if (!courseCode) return;
    getAggregateReports(courseCode, authFetch).then((data) => {
      const reports = data as QuestionReportAggregation[];
      reports.map((report) => {
        report.total_reports = Object.values(report.reason_counts).reduce(
          (total, count) => total + count,
          0,
        );
      });
      setReports(reports.sort((a, b) => b.total_reports - a.total_reports));
    });
  }, []);

  return (
    <div className="w-full h-full font-poppins">
      <Card className="w-full h-full border-light-gray shadow-sm flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg font-bold text-slate-800">
              Question Reports
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              View aggregated user reports for questions in this course
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0 border-t border-slate-100 flex-1 flex flex-col overflow-hidden">
          <Table className="h-full w-full table-fixed">
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-1/2">Question</TableHead>
                <TableHead className="min-w-fit">Section</TableHead>
                <TableHead className="max-w-fit">Total reports</TableHead>
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
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileQuestion className="h-8 w-8 text-slate-300" />
                      <p>There are no questions.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow
                    key={report.question.public_id}
                    onClick={() => {
                      setSelectedQuestion(report.question.public_id);
                      setReportSheetOpen(true);
                    }}
                  >
                    <TableCell className="whitespace-normal break-words align-top truncate">
                      <SafeHtmlInline html={report.question.content} />
                    </TableCell>
                    <TableCell className="whitespace-normal break-words align-top">
                      <p className="text-sm text-slate-700">
                        {report.subtopic.name}
                      </p>
                    </TableCell>
                    <TableCell className="align-top">
                      {report?.reason_counts &&
                        Object.entries(report.reason_counts).length}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ReportsSheet
        questionId={selectedQuestion}
        open={reportSheetOpen}
        onOpenChange={setReportSheetOpen}
      />
    </div>
  );
}
