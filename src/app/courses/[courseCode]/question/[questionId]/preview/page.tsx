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
import { QuestionPage } from "@/components/ui/custom/question-page";

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

  // Idk what this is
  useEffect(() => {
    let cancelled = false;
    getQuestionByPublicId(questionId, authFetch)
      .then((data) => {
        if (cancelled) return;
        setQuestion(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setFetchError(
            err instanceof Error ? err.message : "Failed to load question",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [questionId, authFetch]);

  return (
    <QuestionPage>
      <QuestionPage.Header>
        <MacFastHeader />
      </QuestionPage.Header>
      <QuestionPage.Title>
        <h1>{question?.course || courseCode}</h1>
        <ChevronsRight />
        <h1>
          {question?.unit && question?.subtopic
            ? `${question.unit} - ${question.subtopic}`
            : question?.unit || question?.subtopic || ""}
        </h1>
      </QuestionPage.Title>

      <QuestionPage.Content>
        <QuestionPage.QuestionBody error={fetchError || ""} isLoading={isLoading}>
          {question?.content && (
            <div
              id="question-card"
              className="border p-4 rounded-lg shadow-md bg-background"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(question.content),
              }}
            ></div>
          )}

          <QuestionPage.Options isLoading={isLoading}>
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
            >
              {question?.options &&
                question.options.map((option: QuestionOption) => (
                  <div
                    key={option.public_id}
                    className="flex items-center gap-2 w-full"
                  >
                    <RadioGroupItem
                      value={option.public_id}
                      className="cursor-pointer"
                    />
                    <Label
                      className="border-2 p-6 rounded-md items-center flex gap-2 w-full bg-background cursor-pointer"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(option.content),
                      }}
                    ></Label>
                  </div>
                ))}
            </RadioGroup>
          </QuestionPage.Options>
        </QuestionPage.QuestionBody>
        <QuestionPage.Answer isLoading={isLoading}>
          <QuestionPage.AnswerTitle>
            <p
              className="font-poppins text-2xl"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  question?.options.find((option) => option.is_answer)
                    ?.content || "",
                ),
              }}
            />
          </QuestionPage.AnswerTitle>

          <QuestionPage.AnswerBody>
            <p
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(question?.answer_explanation || ""),
              }}
            />
          </QuestionPage.AnswerBody>
        </QuestionPage.Answer>
      </QuestionPage.Content>

      <QuestionPage.Actions>
        <Button
          onClick={() => router.push(`/courses/${courseCode}/dashboard`)}
          variant="primary"
        >
          Back
        </Button>
      </QuestionPage.Actions>
    </QuestionPage>
  );
}
