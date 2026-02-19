"use client";

import { uploadQuestions } from "@/lib/api";
import { useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { QuestionItem } from "@/components/ui/custom/questions-item/questions-item";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCourseQuestions } from "@/hooks/useCourseQuestions";
import { QuestionItemSkeleton } from "@/components/ui/custom/questions-item/questions-item-skeleton";
import { SearchBar } from "@/components/ui/custom/saerch-bar";
import { QuestionsFilter } from "@/components/ui/custom/questions-filter";
import { useRouter } from "next/navigation";

interface QuestionsProps {
  course?: Course | null;
}

export function Questions({ course }: QuestionsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<QuestionFilters>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const allSubtopics =
    course?.units.flatMap((unit) => unit.subtopics ?? []) || [];

  const {
    questions,
    isLoading,
    error: questionsError,
    refetch,
  } = useCourseQuestions({ searchQuery, filters });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // Simulate progress for mock upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      await uploadQuestions(file);

      await refetch();

      setUploadProgress(100);
      clearInterval(progressInterval);
    } catch (error) {
      console.error("Upload failed:", error);
      setError(
        error instanceof Error ? error.message : "Failed to upload questions",
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
    router.push(
      `/courses/${course?.code}/question/${questionId}/preview`,
    );
  };

  const navigateToEdit = (questionId: string) => {
    router.push(
      `/courses/${course?.code}/question/${questionId}/edit`,
    );
  };
  return (
    <div className="flex flex-col h-full">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isUploading && (
        <div className="mb-6">
          <Progress
            value={uploadProgress}
            caption={`Uploading... ${uploadProgress}%`}
          />
        </div>
      )}

      <div className="flex flex-row flex-0 gap-4 mb-6 items-center">
        <SearchBar
          className=""
          placeholder="Search questions..."
          onSearch={setSearchQuery}
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
            onFilterChange={setFilters}
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
              : questions.map((question) => (
                  <QuestionItem
                    key={question.serial_number}
                    question={question}
                    onPreview={() => navigateToPreview(question.public_id)}
                    onEdit={() => navigateToEdit(question.public_id)}
                    onViewComments={() =>
                      console.log("View Comments:", question.serial_number)
                    }
                    onDelete={() =>
                      console.log("Delete:", question.serial_number)
                    }
                  />
                ))}
            <span className="text-sm mx-auto text-muted-foreground">
              End of questions
            </span>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
