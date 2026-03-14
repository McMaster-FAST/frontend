import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar } from "@/components/ui/custom/search-bar";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileQuestion } from "lucide-react";
import { useState } from "react";

const filteredReports = [
  {
    question_id: "abc123",
    report_reasons: [
      { reason: "Formatting of text", count: 3 },
      { reason: "Images were incorrect", count: 1 },
    ],
  },
  {
    question_id: "def456",
    report_reasons: [{ reason: "Formatting of images", count: 2 }],
  },
];
export default function QuestionReportsTab() {
  const [search, setSearch] = useState("");
  //   const [filteredReports, setFilteredReports] = useState<
  //     QuestionReportAggregation[]
  //   >([]);
  // Report aggregations on a per-question basis
  const [reportAggregations, setReportAggregations] = useState<
    QuestionReportAggregation[]
  >([]);
  const isLoading = false;
  return (
    <div className="w-full">
      <Card className="w-full border-light-gray shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg font-bold text-slate-800">
              Question Reports
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              View aggregated user reports for questions in this course
            </p>
          </div>

          <SearchBar
            className="w-64"
            placeholder="Search by question..."
            onSearch={setSearch}
          />
        </CardHeader>

        <CardContent className="p-0 border-t border-slate-100">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="">Question ID</TableHead>
                <TableHead className="max-w-fit">Total reports</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileQuestion className="h-8 w-8 text-slate-300" />
                      <p>
                        {search
                          ? "No questions matching your search"
                          : "There are no questions."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow
                    key={report.question_id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="pl-6">
                      <p className="text-sm font-semibold text-slate-900">
                        {report.question_id}
                      </p>
                    </TableCell>
                    <TableCell>
                      {report.report_reasons.reduce(
                        (total, reason) => total + reason.count,
                        0,
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
