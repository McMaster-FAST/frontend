"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronsRight } from "lucide-react";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { getQuestionByPublicId } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import DOMPurify from "dompurify";
import type { Question } from "@/types/Question";

export default function QuestionPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const courseCode = decodeURIComponent(params.courseCode as string);
  const questionId = decodeURIComponent(params.questionId as string);
  const authFetch = useAuthFetch();

  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getQuestionByPublicId(questionId, authFetch)
      .then((data) => {
        if (cancelled) return;
        setQuestion(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setFetchError(err instanceof Error ? err.message : "Failed to load question");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [questionId, authFetch]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <MacFastHeader />
        <div className="flex flex-col gap-4 p-8 flex-1">
          <div className="flex flex-row font-poppins font-semibold text-xl items-center gap-2 text-dark-gray">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-7 w-48" />
          </div>
          <div className="flex flex-col gap-6">
            <Skeleton className="w-full h-40 rounded-lg" />
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-full h-20 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col h-screen">
        <MacFastHeader />
        <div className="flex flex-col gap-4 p-8 flex-1">
          <p className="font-poppins text-red-600">{fetchError}</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex flex-col h-screen">
        <MacFastHeader />
        <div className="flex flex-col gap-4 p-8 flex-1">
          <p className="font-poppins">Question not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <MacFastHeader />
      <div id="content" className="flex flex-col gap-4 p-8 flex-1">
        {/* Breadcrumb Navigation */}
        <div
          id="header"
          className="flex flex-row font-poppins font-semibold text-xl items-center gap-2 text-dark-gray"
        >
          <h1>{question.course || courseCode}</h1>
          <ChevronsRight />
          <h1>
            {question.unit && question.subtopic
              ? `${question.unit} - ${question.subtopic}`
              : question.unit || question.subtopic || ""}
          </h1>
        </div>

        {/* Question Content */}
        <div id="content" className="flex flex-col gap-6">
          {/* Question Card */}
          {question.content && (
            <div
              id="question-card"
              className="border p-4 rounded-lg shadow-md bg-white"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(question.content),
              }}
            ></div>
          )}

          {/* Options List */}
          <div id="options-list" className="flex flex-col gap-2">
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
            >
              {question.options &&
                question.options.map((option) => (
                  <div
                    key={option.public_id}
                    className="flex items-center gap-2 w-full"
                  >
                    <RadioGroupItem
                      value={option.public_id}
                      className="cursor-pointer"
                    />
                    <Label
                      className="border-2 p-6 rounded-md items-center flex gap-2 w-full bg-white cursor-pointer"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(option.content),
                      }}
                    ></Label>
                  </div>
                ))}
            </RadioGroup>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex flex-row justify-end items-center mt-auto pt-4">
          <Button
            onClick={() => router.push(`/courses/${courseCode}/dashboard`)}
            variant="primary"
            className="px-6 py-3 h-11 bg-[#7A003C] rounded-lg font-poppins font-semibold text-base leading-5 text-[#F5F5F5]"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
