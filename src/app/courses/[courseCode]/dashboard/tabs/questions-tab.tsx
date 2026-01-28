"use client";

import { getAllQuestions, uploadQuestions } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { QuestionItem } from "@/components/ui/custom/questions-item";
import { Button } from "@/components/ui/button";
import { ArrowRight, FilterIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import CommentsSheet from "@/components/ui/custom/comments/comments-sheet";

export function Questions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [commentsSheetOpen, setCommentsSheetOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setTimeout(async () => {
        await fetchQuestions();
      }, 2000);

      setUploadProgress(100);
      clearInterval(progressInterval);

      console.log(questions);
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

  async function fetchQuestions() {
    getAllQuestions()
      .then((data) => {
        setQuestions(data.questions);
      })
      .catch((error) => {
        console.error("Failed to fetch questions:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch questions",
        );
      });
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="flex flex-col max-h-full">
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
        <Button variant="primary">
          <ArrowRight />
        </Button>
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
          <Button variant="secondary">
            <FilterIcon />
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-4">
            {questions.map((question) => (
              <QuestionItem
                key={question.serial_number}
                question={question}
                onPreview={() => {}}
                onEdit={() => {}}
                onViewComments={() => {
                  setCommentsSheetOpen(true);
                }}
                onDelete={() => {}}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
      <CommentsSheet open={commentsSheetOpen} onOpenChange={setCommentsSheetOpen} />
    </div>
  );
}
