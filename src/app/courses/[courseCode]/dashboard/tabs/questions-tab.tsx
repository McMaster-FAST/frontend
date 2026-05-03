"use client";

import {
  deleteQuestion,
  pollForParsingUpdates,
  uploadQuestions,
} from "@/lib/question-api";
import { Fragment, useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { QuestionItem } from "@/components/macfast/questions-item/questions-item";
import { Button } from "@/components/ui/button";
import { AlertCircle, CirclePlus, Upload, XIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CommentsSheet from "@/components/macfast/comments/comments-sheet";
import { useCourseQuestions } from "@/hooks/useCourseQuestions";
import { QuestionItemSkeleton } from "@/components/macfast/questions-item/questions-item-skeleton";
import { SearchBar } from "@/components/macfast/search-bar";
import { QuestionsFilter } from "@/components/macfast/questions-filter";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MacFastPaginator from "@/components/macfast/macfast-paginator";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import {
  UploadCompletedStatus,
  UploadFailure,
  UploadInProgressStatus,
  UploadProgress,
} from "@/types/UploadResult";
import { Card } from "@/components/ui/card";
import ErrorMessage from "@/components/macfast/error-message";

interface QuestionsProps {
  course?: Course | null;
}

export function Questions({ course }: QuestionsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [filters, setFilters] = useState<QuestionFilters>({});
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  );
  const [commentsSheetOpen, setCommentsSheetOpen] = useState(false);
  // Pagination is 1-indexed
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [parsingResult, setParsingResult] = useState<UploadProgress | null>(
    null,
  );
  const [showFailures, setShowFailures] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stopPollingRef = useRef<(() => void) | null>(null);
  const authFetch = useAuthFetch();
  const router = useRouter();

  useEffect(() => {
    return () => {
      stopPollingRef.current?.();
      stopPollingRef.current = null;
    };
  }, []);

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
      stopPollingRef.current?.();
      stopPollingRef.current = null;
      setParsingResult({
        result: UploadInProgressStatus.RUNNING,
        progress: 0,
        success_count: 0,
        failure_count: 0,
      } as UploadProgress);
      setTimeout(() => {
        stopPollingRef.current = pollForParsingUpdates(
          course.code,
          repsonse.upload_result_id,
          authFetch,
          handleParsingUpdate,
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
    const err = questionsError as {
      status?: number | string;
      message?: string;
    };
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

  const navigateToCreateQuestion = () => {
    if (!course?.code) {
      setError("Course information is missing. Please refresh and try again.");
      return;
    }
    router.push(`/courses/${course.code}/question/new`);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      setError(null);
      await deleteQuestion(questionId, authFetch);
      await refetch();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete question.",
      );
    }
  };

  const updateSearchQuery = (query: string) => {
    setPageNumber(1);
    setSearchQuery(query);

    const nextParams = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      nextParams.set("q", query);
    } else {
      nextParams.delete("q");
    }
    const nextQueryString = nextParams.toString();
    const nextUrl = nextQueryString
      ? `${pathname}?${nextQueryString}`
      : pathname;
    router.replace(nextUrl, { scroll: false });
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

  const handleParsingUpdate = (uploadResult: UploadProgress) => {
    setParsingResult(uploadResult);
    void refetch();
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
              <div className="flex flex-col items-end gap-1">
                <XIcon
                  className="h-4 w-4 cursor-pointer ml-auto"
                  onClick={() => {
                    stopPollingRef.current?.();
                    stopPollingRef.current = null;
                    setParsingResult(null);
                    setShowFailures(false);
                  }}
                />
                <div className="text-sm text-muted-foreground">
                  <span>{parsingResult.success_count} questions parsed </span>
                  {parsingResult.failure_count > 0 ? (
                    <button
                      className="underline underline-offset-2 text-destructive hover:opacity-70 transition-opacity"
                      onClick={() => setShowFailures((v) => !v)}
                    >
                      ({parsingResult.failure_count} failed)
                    </button>
                  ) : (
                    <span>(0 failed)</span>
                  )}
                </div>
              </div>
            </div>
            <Progress
              className="h-2 w-full"
              value={parsingResult.progress * 100}
            />
            {showFailures &&
              parsingResult.failures &&
              parsingResult.failures.length > 0 && (
                <ScrollArea className="max-h-48 rounded-md border mt-1">
                  <div className="p-2 flex flex-col gap-1">
                    {parsingResult.failures.map((f: UploadFailure, index) => (
                      <div
                        key={`${index}-${f.question_identifier}`}
                        className="flex flex-col gap-0.5 px-2 py-1.5 rounded-sm bg-destructive/10 text-xs"
                      >
                        <span className="font-medium text-destructive">
                          {f.question_identifier}
                        </span>
                        <span className="text-muted-foreground">
                          {f.error_message.split("\n").map((line, index) => (
                            <Fragment key={index}>
                              {line}
                              {index <
                                f.error_message.split("\n").length - 1 && (
                                <br />
                              )}
                            </Fragment>
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
          </div>
        </Card>
      )}

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <SearchBar
          className="w-full lg:flex-1 lg:min-w-0"
          placeholder="Search questions..."
          value={searchQuery}
          onSearch={updateSearchQuery}
        />
        <div className="flex w-full flex-wrap items-center justify-end gap-2 lg:w-auto lg:flex-nowrap lg:gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".docx, .csv"
            className="hidden"
          />
          <Button
            variant="secondary"
            size="default"
            className="gap-2"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            <Upload className="h-5 w-5" />
            {isUploading ? "Uploading..." : "Upload Questions"}
          </Button>
          <Button
            variant="secondary"
            size="default"
            className="gap-2"
            onClick={navigateToCreateQuestion}
            disabled={!course?.code}
          >
            <CirclePlus className="h-5 w-5" />
            Create New Question
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
                    onDelete={() =>
                      void handleDeleteQuestion(question.public_id)
                    }
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
