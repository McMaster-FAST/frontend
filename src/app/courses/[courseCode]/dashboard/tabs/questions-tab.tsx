"use client";

import { getAllQuestions, uploadQuestions } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { QuestionItem } from "@/components/ui/custom/questions-item/questions-item";
import { Button } from "@/components/ui/button";
import { ArrowRight, FilterIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useCourseQuestions } from "@/hooks/useCourseQuestions";
import { QuestionItemSkeleton } from "@/components/ui/custom/questions-item/questions-item-skeleton";

export function Questions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    questions,
    isLoading,
    error: questionsError,
    refetch,
  } = useCourseQuestions();

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
        <Input
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="primary" iconOnly leftIcon={ArrowRight} />
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
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Questions"}
          </Button>
          <Button variant="secondary" iconOnly leftIcon={FilterIcon} />
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-4 mb-4">
            {isLoading
              ? [...Array(15)].map((_, i) => <QuestionItemSkeleton key={i} />)
              : questions.map((question) => (
                  <QuestionItem
                    key={question.serial_number}
                    question={question}
                    onPreview={() =>
                      console.log("Preview:", question.serial_number)
                    }
                    onEdit={() => console.log("Edit:", question.serial_number)}
                    onViewComments={() =>
                      console.log("View Comments:", question.serial_number)
                    }
                    onDelete={() =>
                      console.log("Delete:", question.serial_number)
                    }
                  />
                ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
