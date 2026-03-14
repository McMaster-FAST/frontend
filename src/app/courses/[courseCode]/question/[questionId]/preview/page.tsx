"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronsRight } from "lucide-react";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { getQuestionByPublicId } from "@/lib/question-api";
import { QuestionPage } from "@/components/ui/custom/question-page";
import { QuestionFlagDialog } from "@/components/ui/custom/question-flag-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { SafeHtml } from "@/components/ui/custom/safe-html";

interface QuestionPreviewPageProps {
  // If provided, will use this question data instead of fetching it. Useful for previewing unsaved changes.
  useQuestion: Question | null; 
  // Optional callback when user wants to return from preview
  onReturn?: () => void; 
}
export default function QuestionPreviewPage({ useQuestion, onReturn }: QuestionPreviewPageProps) {
  const params = useParams();
  const courseCode = decodeURIComponent(params.courseCode as string);
  const questionId = decodeURIComponent(params.questionId as string);
  const authFetch = useAuthFetch();

  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (useQuestion) {
      setQuestion(useQuestion);
      setIsLoading(false);
      return;
    }
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
  }, [questionId]);

  return (
    <QuestionPage onReturn={onReturn}>
      <QuestionPage.Header>
        <MacFastHeader />
      </QuestionPage.Header>
      <QuestionPage.Title>
        <h1>{question?.course || courseCode}</h1>
        <ChevronsRight />
        <h1>
          {question?.unit && question?.subtopic_name
            ? `${question.unit} - ${question.subtopic_name}`
            : question?.unit || question?.subtopic_name || ""}
        </h1>
      </QuestionPage.Title>

      <QuestionPage.Content>
        <QuestionPage.QuestionBody
          error={fetchError || ""}
          isLoading={isLoading}
        >
          <div className="border p-4 rounded-lg shadow-md">
            <SafeHtml html={question?.content || ""} />
          </div>
          <QuestionPage.Options isLoading={isLoading}>
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
            >
              {question?.options &&
                question.options.map((option: QuestionOption, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 w-full"
                  >
                    <RadioGroupItem
                      value={option.public_id || `option-${index}`}
                      className="cursor-pointer"
                    />
                    <div className="border-2 p-6 rounded-md items-center flex gap-2 w-full">
                      <SafeHtml html={option.content || ""} />
                    </div>
                  </div>
                ))}
            </RadioGroup>
          </QuestionPage.Options>
        </QuestionPage.QuestionBody>
        <QuestionPage.Answer isLoading={isLoading}>
          <QuestionPage.AnswerTitle>
            <p className="font-poppins text-2xl">
              <SafeHtml
                html={
                  question?.options.find((option) => option.is_answer)
                    ?.content || ""
                }
              />
            </p>
          </QuestionPage.AnswerTitle>

          <QuestionPage.AnswerBody>
            {question?.answer_explanation && (
              <p>
                <SafeHtml html={question?.answer_explanation || ""} />
              </p>
            )}
            {!question?.answer_explanation && (
              <p className="italic text-muted-foreground">
                No explanation provided for this question.
              </p>
            )}
          </QuestionPage.AnswerBody>
        </QuestionPage.Answer>
      </QuestionPage.Content>

      <QuestionPage.Actions>
        <div
          id="question-section"
          className="w-full flex flex-row flex-2 justify-between items-center"
        >
          <div>
            <QuestionFlagDialog disabled={true} />
          </div>
          <div className="inline-flex items-center gap-4">
            <div className="inline-flex gap-2">
              <Checkbox id="save-for-later" disabled={true} />
              <Label htmlFor="save-for-later">Save for Later</Label>
            </div>
            <Button variant="secondary" disabled={true}>
              Skip
            </Button>
            <Button variant="primary" disabled={true}>
              Submit
            </Button>
          </div>
        </div>
        <div id="answer-section" className="flex-1 flex justify-end">
          <Button variant="primary" disabled={true}>
            Next Question
          </Button>
        </div>
      </QuestionPage.Actions>
    </QuestionPage>
  );
}
