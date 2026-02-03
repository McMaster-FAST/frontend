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
          (question.options ?? []).map((o) => ({ content: o.content, public_id: o.public_id })),
          OPTION_COUNT
        );
        setOptionList(padded);
        const correct = question.options?.find((o) => o.is_answer);
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
      <div className="flex flex-col w-full min-h-screen bg-white">
        <MacFastHeader />
        <div className="flex flex-col items-start p-[25px] gap-4 flex-1">
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="flex flex-row gap-0 w-full max-w-[1390px]">
            <div className="flex flex-col gap-3 flex-1">
              <Skeleton className="h-[124px] w-full rounded-lg" />
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-[100px] w-full rounded-lg" />
              ))}
            </div>
            <div className="flex flex-col gap-3 flex-1 border-l border-[rgba(73,89,101,0.5)] pl-4">
              <Skeleton className="h-10 w-[75%] rounded-lg" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-white">
        <MacFastHeader />
        <div className="flex flex-col items-start p-[25px] gap-4 flex-1">
          <p className="font-poppins text-red-600">{fetchError}</p>
          <Button variant="outline" onClick={() => router.back()}>
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Header */}
      <MacFastHeader />

      {/* Body */}
      <div className="flex flex-col items-start p-[25px] gap-[10px] flex-1">
        {/* Course Information */}
        <div className="flex flex-row justify-center items-center gap-2">
          <h1 className="font-inter font-semibold text-2xl leading-8 text-[#495965]">
            {courseInfo.courseCode}
          </h1>
          <ChevronsRight className="w-5 h-5 text-[#495965]" />
          <h1 className="font-inter font-semibold text-2xl leading-8 text-[#495965]">
            {courseInfo.unit}
          </h1>
        </div>

        {/* Content - Two Column Layout (50/50 split, same height so Save aligns with last option) */}
        <div className="flex flex-row items-stretch gap-0 w-full max-w-[1390px]">
          {/* Left Panel - Question Area */}
          <div className="flex flex-col items-start p-2 gap-2 flex-1 min-w-0">
            {/* Question Text Input */}
            <div className="w-full">
              <Textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="This is question text that you can edit when you highlight this field"
                className="w-full h-[124px] p-[10px_16px] bg-white border border-[#DBDBDD] rounded-lg font-poppins font-semibold text-base leading-5 text-[#1E1E1E] placeholder:text-[rgba(73,89,101,0.5)] resize-none"
              />
            </div>

            {/* Question Options */}
            <div className="flex flex-col items-start gap-3 w-full flex-1">
              {optionList.map((option, index) => (
                <div
                  key={option.public_id || index}
                  className="flex flex-row items-center p-5 gap-[10px] w-full bg-white border-2 border-[#DBDBDD] rounded-lg min-h-[100px]"
                >
                  {/* Radio Button - Visual Only */}
                  <div className="w-5 h-5 flex-shrink-0 rounded-full bg-[#DBDBDD] border border-[#495965]"></div>
                  {/* Option Input */}
                  <Input
                    value={option.content}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder="Placeholder"
                    className="flex-1 h-12 min-h-12 p-[12px_16px] bg-white border border-[#DBDBDD] rounded-lg font-poppins font-semibold text-base leading-5 text-[#1E1E1E] placeholder:text-[rgba(73,89,101,0.5)]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Correct Answer and Explanation (equal width) */}
          <div className="flex flex-col flex-1 min-w-0 min-h-[537px] bg-white border-l border-[rgba(73,89,101,0.5)]">
            <div className="flex flex-col items-start gap-[10px] w-full flex-1 min-h-0">
              {/* Title Section */}
              <div className="flex flex-row items-center gap-[10px] w-full flex-shrink-0">
                {/* Correct Answer Dropdown - full width of panel */}
                <div className="flex flex-col items-start p-[10px] gap-[10px] w-full">
                  <div className="flex flex-col items-start gap-2 w-full">
                    <Label className="font-poppins font-semibold text-base leading-5 text-black">
                      Correct Answer
                    </Label>
                    {/* Dropdown Field - 75% width */}
                    <div className="flex flex-row items-start w-[75%] min-w-0 bg-white border border-[#DBDBDD] rounded-lg overflow-hidden">
                      <select
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        className="flex-1 h-10 px-4 py-[10px] bg-white rounded-l-lg font-poppins font-semibold text-base leading-5 text-[#1E1E1E] placeholder:text-[rgba(73,89,101,0.5)] outline-none border-0 appearance-none cursor-pointer"
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
                      <div className="w-11 h-10 bg-[#7A003C] rounded-r-lg flex items-center justify-center pointer-events-none">
                        <ChevronDown className="w-5 h-5 text-[#F5F5F5]" strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Answer Explanation - label only inside box as placeholder, same font size */}
              <div className="flex flex-col items-stretch p-[10px] gap-[10px] w-full flex-1 min-h-0 overflow-hidden">
                <div className="w-full min-w-0 flex-1 min-h-0 [&>*]:w-full [&>*>*]:w-full">
                  <Textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Answer explanation"
                    className="w-full min-w-0 min-h-[180px] max-h-[280px] p-[10px_16px] bg-white border border-[#DBDBDD] rounded-lg font-poppins font-semibold text-base leading-5 text-[#1E1E1E] placeholder:font-semibold placeholder:text-base placeholder:leading-5 placeholder:text-[#757575] resize-y overflow-auto box-border"
                  />
                </div>
              </div>
            </div>

            {/* Save button - at bottom right, bottom aligned with last option on left */}
            <div className="flex flex-row justify-end items-center p-[10px] pt-4 flex-shrink-0 mt-auto">
              <Button
                onClick={handleSave}
                variant="primary"
                className="px-6 py-3 h-11 bg-[#7A003C] rounded-lg font-poppins font-semibold text-base leading-5 text-[#F5F5F5]"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
