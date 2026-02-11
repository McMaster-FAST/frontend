"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronsRight, ChevronDown } from "lucide-react";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { getQuestionByPublicId } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const OPTION_COUNT = 4;

function padOptions(
  optionList: { content: string; public_id: string }[],
  count: number
): { content: string; public_id: string }[] {
  const result = [...optionList];
  while (result.length < count) {
    result.push({ content: "", public_id: "" });
  }
  return result.slice(0, count);
}

export default function QuestionEditPage() {
  const params = useParams();
  const router = useRouter();
  const courseCode = decodeURIComponent(params.courseCode as string);
  const questionId = decodeURIComponent(params.questionId as string);
  const authFetch = useAuthFetch();

  // State for question content
  const [questionText, setQuestionText] = useState("");
  const [optionList, setOptionList] = useState<{ content: string; public_id: string }[]>(
    Array(OPTION_COUNT).fill({ content: "", public_id: "" })
  );
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [courseInfo, setCourseInfo] = useState<{ courseCode: string; unit: string }>({
    courseCode,
    unit: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getQuestionByPublicId(questionId, authFetch)
      .then((question) => {
        if (cancelled) return;
        setQuestionText(question.content ?? "");
        const padded = padOptions(
          (question.options ?? []).map((o: { content: string; public_id: string }) => ({ content: o.content, public_id: o.public_id })),
          OPTION_COUNT
        );
        setOptionList(padded);
        const correct = question.options?.find((o: { is_answer?: boolean }) => o.is_answer);
        setCorrectAnswer(correct?.public_id ?? "");
        setExplanation(question.answer_explanation ?? "");
        setCourseInfo({
          courseCode: question.course ?? courseCode,
          unit: question.unit && question.subtopic ? `${question.unit} - ${question.subtopic}` : question.unit ?? question.subtopic ?? "",
        });
      })
      .catch((err) => {
        if (!cancelled) setFetchError(err instanceof Error ? err.message : "Failed to load question");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [questionId, authFetch, courseCode]);

  const handleOptionChange = (index: number, value: string) => {
    const newList = [...optionList];
    newList[index] = { ...newList[index], content: value };
    setOptionList(newList);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving question:", {
      questionText,
      optionList,
      correctAnswer,
      explanation,
    });
    // Navigate back or show success message
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-background">
        <MacFastHeader />
        <div className="flex flex-col items-start p-6 gap-4 flex-1">
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="flex flex-row gap-0 w-full max-w-7xl">
            <div className="flex flex-col gap-3 flex-1">
              <Skeleton className="h-32 w-full rounded-lg" />
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="min-h-24 w-full rounded-lg" />
              ))}
            </div>
            <div className="flex flex-col gap-3 flex-1 border-l border-dark-gray/50 pl-4">
              <Skeleton className="h-10 w-3/4 rounded-lg" />
              <Skeleton className="min-h-48 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-background">
        <MacFastHeader />
        <div className="flex flex-col items-start p-6 gap-4 flex-1">
          <p className="font-poppins text-destructive">{fetchError}</p>
          <Button variant="secondary" onClick={() => router.back()}>
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* Header */}
      <MacFastHeader />

      {/* Body */}
      <div className="flex flex-col items-start p-6 gap-2.5 flex-1">
        {/* Course Information */}
        <div className="flex flex-row justify-center items-center gap-2">
          <h1 className="font-inter font-semibold text-2xl leading-8 text-dark-gray">
            {courseInfo.courseCode}
          </h1>
          <ChevronsRight className="w-5 h-5 text-dark-gray" />
          <h1 className="font-inter font-semibold text-2xl leading-8 text-dark-gray">
            {courseInfo.unit}
          </h1>
        </div>

        {/* Content - Two Column Layout (50/50 split, same height so Save aligns with last option) */}
        <div className="flex flex-row items-stretch gap-0 w-full max-w-7xl">
          {/* Left Panel - Question Area */}
          <div className="flex flex-col items-start p-2 gap-2 flex-1 min-w-0">
            {/* Question Text Input */}
            <div className="w-full">
              <Textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="This is question text that you can edit when you highlight this field"
                className="w-full min-h-32 p-4 bg-background border border-input rounded-lg font-poppins font-semibold text-base text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>

            {/* Question Options */}
            <div className="flex flex-col items-start gap-3 w-full flex-1">
              {optionList.map((option, index) => (
                <div
                  key={option.public_id || index}
                  className="flex flex-row items-center p-5 gap-2.5 w-full bg-background border-2 border-input rounded-lg min-h-24"
                >
                  {/* Radio Button - Visual Only */}
                  <div className="w-5 h-5 flex-shrink-0 rounded-full bg-muted border border-dark-gray" />
                  {/* Option Input */}
                  <Input
                    value={option.content}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder="Placeholder"
                    className="flex-1 min-h-12 p-3 bg-background border border-input rounded-lg font-poppins font-semibold text-base text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Correct Answer and Explanation (equal width) */}
          <div className="flex flex-col flex-1 min-w-0 min-h-0 bg-background border-l border-dark-gray/50">
            <div className="flex flex-col items-start gap-2.5 w-full flex-1 min-h-0">
              {/* Title Section */}
              <div className="flex flex-row items-center gap-2.5 w-full flex-shrink-0">
                <div className="flex flex-col items-start p-2.5 gap-2.5 w-full">
                  <div className="flex flex-col items-start gap-2 w-full">
                    <Label className="font-poppins font-semibold text-base text-foreground">
                      Correct Answer
                    </Label>
                    {/* Dropdown Field - 75% width */}
                    <div className="flex flex-row items-start w-3/4 min-w-0 bg-background border border-input rounded-lg overflow-hidden">
                      <select
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        className="flex-1 h-10 px-4 py-2 bg-background rounded-l-lg font-poppins font-semibold text-base text-foreground placeholder:text-muted-foreground outline-none border-0 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          Placeholder
                        </option>
                        {optionList.map((option, index) => (
                          <option key={option.public_id || index} value={option.public_id}>
                            Option {index + 1}
                          </option>
                        ))}
                      </select>
                      <div className="w-11 h-10 bg-primary rounded-r-lg flex items-center justify-center pointer-events-none">
                        <ChevronDown className="w-5 h-5 text-primary-foreground" strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Answer Explanation - label only inside box as placeholder, same font size */}
              <div className="flex flex-col items-stretch p-2.5 gap-2.5 w-full flex-1 min-h-0 overflow-hidden">
                <div className="w-full min-w-0 flex-1 min-h-0 [&>*]:w-full [&>*>*]:w-full">
                  <Textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Answer explanation"
                    className="w-full min-w-0 min-h-44 max-h-72 p-4 bg-background border border-input rounded-lg font-poppins font-semibold text-base text-foreground placeholder:text-muted-foreground resize-y overflow-auto box-border"
                  />
                </div>
              </div>
            </div>

            {/* Save button - at bottom right, bottom aligned with last option on left */}
            <div className="flex flex-row justify-end items-center p-2.5 pt-4 flex-shrink-0 mt-auto">
              <Button onClick={handleSave} variant="primary">
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
