"use client";

import { pollForParsingUpdates, uploadQuestions } from "@/lib/question-api";
import { useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { QuestionItem } from "@/components/macfast/questions-item/questions-item";
import { Button } from "@/components/ui/button";
import { AlertCircle, XIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CommentsSheet from "@/components/macfast/comments/comments-sheet";
import { useCourseQuestions } from "@/hooks/useCourseQuestions";
import { QuestionItemSkeleton } from "@/components/macfast/questions-item/questions-item-skeleton";
import { SearchBar } from "@/components/macfast/search-bar";
import { QuestionsFilter } from "@/components/macfast/questions-filter";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { useRouter } from "next/navigation";
import MacFastPaginator from "@/components/macfast/macfast-paginator";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import {
  UploadCompletedStatus,
  UploadInProgressStatus,
  UploadProgress,
} from "@/types/UploadResult";
import { Card } from "@/components/ui/card";
import ErrorMessage from "@/components/macfast/error-message";

interface QuestionsProps {
  course?: Course | null;
}

export function Questions({ course }: QuestionsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<QuestionFilters>({});
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  );
  const [commentsSheetOpen, setCommentsSheetOpen] = useState(false);
  // Pagination is 1-indexed
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [parsingResult, setParsingResult] = useState<UploadProgress | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authFetch = useAuthFetch();
  const router = useRouter();

  const allSubtopics =
    course?.units.flatMap((unit) => unit.subtopics ?? []) || [];

  const {
    questions,
    totalQuestions,
    totalPages,
    nextPage,
    previousPage,
    isLoading,
    error: questionsError,
    refetch,
  } = useCourseQuestions({ searchQuery, filters, pageNumber });

  const determineEndMessage = () => {
    if (questions.length === 0 && !isLoading) {
      if (filters) return "No questions found. Try changing the filters.";
      return "No questions! Click the button above to upload some.";
    } else if (pageNumber === totalPages) {
      return "End of questions";
    }
    return "End of page";
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      if (!course) {
        throw new Error("Course information is missing. Please try again.");
      }
      const repsonse = await uploadQuestions(file, course, authFetch);
      setParsingResult({
        result: UploadInProgressStatus.RUNNING,
        progress: 0,
        success_count: 0,
        failure_count: 0,
      } as UploadProgress);
      setTimeout(() => {
        pollForParsingUpdates(
          course.code,
          repsonse.upload_result_id,
          authFetch,
          setParsingResult,
        );
      }, 2000);
      await refetch();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to upload questions",
      );
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getFetchErrorDetails = () => {
    if (!questionsError) return null;
    const err = questionsError as any;
    const status = err.status || "Unknown";
    const message = err.message || "Failed to load questions";
    return { status, message };
  };

  const fetchError = getFetchErrorDetails();

  const navigateToPreview = (questionId: string) => {
    router.push(`/courses/${course?.code}/question/${questionId}/preview`);
  };

  const navigateToEdit = (questionId: string) => {
    router.push(`/courses/${course?.code}/question/${questionId}/edit`);
  };

  const pasingResultMessage = () => {
    let spinner = false;
    let message = "";
    switch (parsingResult?.result) {
      case UploadCompletedStatus.SUCCESS:
        message = "Parsing complete";
        break;
      case UploadCompletedStatus.FAILED:
        message = "Parsing failed";
        break;
      case UploadInProgressStatus.RUNNING:
        spinner = true;
        if (parsingResult.failure_count + parsingResult.success_count === 0) {
          message = "Waiting for parser";
        } else {
          message = "Parsing questions";
        }
        break;
    }
    return (
      <>
        <span>{message}</span>
        {spinner && <Spinner className="mr-2" />}
      </>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {error && <ErrorMessage className="mb-6" title="Error" message={error} />}
      {parsingResult && (
        <Card className="w-full mb-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex justify-between w-full">
              <div className="inline-flex gap-2 items-center">
                {pasingResultMessage()}
              </div>
              <div>
                <XIcon
                  className="h-4 w-4 cursor-pointer top-0 ml-auto"
                  onClick={() => setParsingResult(null)}
                />
                <div className="text-sm text-muted-foreground">
                  <span>{parsingResult.success_count} questions parsed </span>
                  <span>({parsingResult.failure_count} failed)</span>
                </div>
              </div>
            </div>
            <Progress
              className="h-2 w-full mb-2"
              value={parsingResult.progress * 100}
            />
          </div>
        </Card>
      )}

      <div className="flex flex-row flex-0 gap-4 mb-6 items-center justify-between">
        <SearchBar
          className=""
          placeholder="Search questions..."
          onSearch={(query) => {
            setPageNumber(1);
            setSearchQuery(query);
          }}
        />
        <div className="flex flex-1 gap-3 justify-end ">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".docx"
            className="hidden"
          />
          <Button
            variant="secondary"
            size="default"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Questions"}
          </Button>
          <QuestionsFilter
            subtopics={allSubtopics}
            filters={filters}
            onFilterChange={(filters) => {
              setPageNumber(1);
              setFilters(filters);
            }}
          />
        </div>
      </div>

      {fetchError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            Error {fetchError.status}: Unable to load questions
          </AlertTitle>
          <AlertDescription>
            {fetchError.message}. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-4 mb-4">
            {isLoading
              ? [...Array(3)].map((_, i) => <QuestionItemSkeleton key={i} />)
              : (Array.isArray(questions) ? questions : []).map((question) => (
                  <QuestionItem
                    key={question.public_id}
                    question={question}
                    onPreview={() => navigateToPreview(question.public_id)}
                    onEdit={() => navigateToEdit(question.public_id)}
                    onViewComments={() => {
                      setSelectedQuestionId(question.public_id);
                      setCommentsSheetOpen(true);
                    }}
                    onDelete={() => console.log("Delete:", question.public_id)}
                  />
                ))}

            <span className="text-sm mx-auto text-muted-foreground">
              {determineEndMessage()}
            </span>
          </div>
        </ScrollArea>
      </div>
      <div className="border-t pt-2 bg-background">
        <MacFastPaginator
          pageNumber={pageNumber}
          totalPages={totalPages}
          showingCount={questions.length}
          totalCount={totalQuestions}
          onPageChange={setPageNumber}
          refetch={refetch}
        />
      </div>

      <CommentsSheet
        open={commentsSheetOpen}
        onOpenChange={setCommentsSheetOpen}
        questionId={selectedQuestionId}
      />
    </div>
  );
}
