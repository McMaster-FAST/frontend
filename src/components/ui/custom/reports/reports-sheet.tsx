import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../sheet";
import { getQuestionReports } from "@/lib/question-api";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import ReportCard from "./report-card";
import { ScrollArea } from "../../scroll-area";

interface ReportsSheetProps {
  questionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReportsSheet({ questionId, open, onOpenChange }: ReportsSheetProps) {
  const authFetch = useAuthFetch();
  const [questionReports, setQuestionReports] = useState<QuestionReport[]>([]);

  useEffect(() => {
    if (questionId) {
      getQuestionReports(questionId, authFetch).then((data) => {
        setQuestionReports(data);
      });
    }
  }, [questionId]);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Reports for question: {questionId}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 overflow-hidden border-t-2">
          <div className="flex flex-col gap-4 p-4 pr-4">
            {questionReports.map((report) => (
              <ReportCard report={report} key={report.public_id} />
            ))}
            {questionReports.length === 0 && (
              <p className="text-sm text-muted-foreground mx-auto">
                This question has not been reported. Hurray!
              </p>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
