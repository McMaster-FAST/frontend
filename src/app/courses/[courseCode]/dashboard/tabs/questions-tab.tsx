"use client";

import { getAllQuestions, uploadQuestions } from "@/lib/api";
import { useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { QuestionItem } from "@/components/ui/custom/questions-item";
import { Button } from "@/components/ui/button";
import { ArrowRight, FilterIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

const mockQuestions: Question[] = [
  {
    content: "What is your favourite flavour of ice cream",
    difficulty: 95,
    unit: "Unit 1",
    subtopic: "Chapter 1",
    options:[],
    course: "",
    serial_number: "1",
    is_active: true,
    is_flagged: false,
    is_verified: true,
  },
  {
    content:
      "This is a super long question that has a lot of text in it and will get truncated with ellipses if it is long enough",
    difficulty: 95,
    unit: "Unit 1",
    subtopic: "Chapter 1",
    options:[],
    course: "",
    serial_number: "2",
    is_active: true,
    is_flagged: true,
    is_verified: true,

  },
  {
    content: "Another one",
    difficulty: 95,
    unit: "Unit 1",
    subtopic: "Chapter 2",
    options:[],
    course: "",
    serial_number: "3",
    is_active: true,
    is_flagged: true,
    is_verified: false,
  },
  {
    content: "Question #",
    difficulty: 95,
    unit: "Unit 1",
    subtopic: "Chapter 2",
    options:[],
    course: "",
    serial_number: "4",
    is_active: true,
    is_flagged: false,
    is_verified: false,
  },
  {
    content: "More",
    difficulty: 95,
    unit: "Unit 1",
    subtopic: "Chapter 2",
    options:[],
    course: "",
    serial_number: "5",
    is_active: true,
    is_flagged: false,
    is_verified: true,
  },
  {
    content: "Not real",
    difficulty: 95,
    unit: "Unit 1",
    subtopic: "Chapter 2",
    options:[],
    course: "",
    serial_number: "6",
    is_active: true,
    is_flagged: false,
    is_verified: true,
  },
];

export function Questions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedQuestions, setUploadedQuestions] = useState<Question[]>([]);
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
      setUploadProgress(100);
      clearInterval(progressInterval);

      // After upload, fetch all questions
      const questions = await getAllQuestions();
      setUploadedQuestions(questions);
    } catch (error) {
      console.error("Upload failed:", error);
      setError(
        error instanceof Error ? error.message : "Failed to upload questions"
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

      <div className="flex-1">
        <ScrollArea className="h-full">
            <div className="flex flex-col gap-4">
              {mockQuestions.map((question) => (
                <QuestionItem
                  key={question.serial_number}
                  question={question}
                  onPreview={() => console.log("Preview:", question.serial_number)}
                  onEdit={() => console.log("Edit:", question.serial_number)}
                  onViewComments={() =>
                    console.log("View Comments:", question.serial_number)
                  }
                  onDelete={() => console.log("Delete:", question.serial_number)}
                />
              ))}
            </div>
        </ScrollArea>
      </div>
    </div>
  );
}
