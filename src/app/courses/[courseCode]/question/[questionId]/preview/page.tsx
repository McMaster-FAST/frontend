"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MacFastHeader } from "@/components/macfast/macfast-header";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ChevronsRight, Pencil } from "lucide-react";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { getQuestionByPublicId, reportQuestion } from "@/lib/question-api";
import { QuestionPage } from "@/components/macfast/question-page";
import { SafeHtml } from "@/components/macfast/safe-html";
import { ReportQuestionDialog } from "@/components/macfast/report-question-dialog";
import SaveForLater from "@/components/macfast/save-for-later";
import { resolveImages } from "@/lib/utils";
import { QuestionReportReason } from "@/types/QuestionReportReason";

interface QuestionPreviewPageProps {
  // If provided, will use this question data instead of fetching it. Useful for previewing unsaved changes.
  useQuestion?: Question | null;
  // Optional callback when user wants to return from preview
  onReturn?: () => void;
}
export default function QuestionPreviewPage({
  useQuestion = null,
  onReturn,
}: QuestionPreviewPageProps) {
  const params = useParams();
  const courseCode = decodeURIComponent(params.courseCode as string);
  const questionId = decodeURIComponent(params.questionId as string);
  const authFetch = useAuthFetch();
  const router = useRouter();

  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const displayedQuestion = useQuestion ?? question;
  const isQuestionLoading = useQuestion ? false : isLoading;
  const actionError =
    fetchError || !displayedQuestion?.public_id
      ? "Question is not ready for actions."
      : "";
  const previewQuestionForSave: TestQuestion | null = displayedQuestion
    ? {
        public_id: displayedQuestion.public_id,
        content: displayedQuestion.content,
        options: displayedQuestion.options,
        saved_for_later:
          "saved_for_later" in displayedQuestion
            ? Boolean(displayedQuestion.saved_for_later)
            : false,
      }
    : null;

  const handleReportQuestion = async (reportAnswers: {
    reasons: QuestionReportReason[];
    additionalDetails: string;
    contact_consent: boolean;
  }) => {
    if (!displayedQuestion?.public_id) return;
    await reportQuestion(
      displayedQuestion.public_id,
      reportAnswers.reasons,
      reportAnswers.additionalDetails,
      reportAnswers.contact_consent,
      authFetch,
    );
  };

  useEffect(() => {
    if (useQuestion) return;

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
  }, [authFetch, questionId, useQuestion]);

  return (
    <QuestionPage onReturn={onReturn}>
      <QuestionPage.Header>
        <MacFastHeader />
      </QuestionPage.Header>
      <QuestionPage.Title>
        <div className="flex w-full flex-col gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
            <h1 className="max-w-full truncate">{courseCode}</h1>
            <ChevronsRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            <h1 className="max-w-full truncate">
              {displayedQuestion?.unit_name}
            </h1>
            <ChevronsRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            <h1 className="min-w-0 wrap-break-word text-base leading-snug sm:text-lg md:text-xl">
              {displayedQuestion?.subtopic_name}
            </h1>
          </div>
        </div>
      </QuestionPage.Title>

      <QuestionPage.Content>
        <QuestionPage.QuestionBody
          error={fetchError || ""}
          isLoading={isQuestionLoading}
        >
          {displayedQuestion?.content && (
            <div className="solution-html border p-4 rounded-lg shadow-md">
              <SafeHtml
                html={resolveImages(
                  displayedQuestion.content,
                  displayedQuestion.public_id,
                )}
              />
            </div>
          )}

          <QuestionPage.Options isLoading={isQuestionLoading}>
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
            >
              {displayedQuestion?.options &&
                displayedQuestion.options.map(
                  (option: QuestionOption, index: number) => (
                    <div key={index} className="flex items-center gap-2 w-full">
                      <RadioGroupItem
                        value={option.public_id || `option-${index}`}
                        className="cursor-pointer"
                      />
                      <div className="solution-html border-2 p-6 rounded-md items-center flex gap-2 w-full">
                        <SafeHtml html={option.content || ""} />
                      </div>
                    </div>
                  ),
                )}
            </RadioGroup>
          </QuestionPage.Options>
        </QuestionPage.QuestionBody>
        <QuestionPage.Answer isLoading={isQuestionLoading} isAnswered={true}>
          <QuestionPage.AnswerTitle>
            <p className="font-poppins text-2xl">
              <SafeHtml
                html={
                  displayedQuestion?.options.find((option) => option.is_answer)
                    ?.content || ""
                }
              />
            </p>
          </QuestionPage.AnswerTitle>

          <QuestionPage.AnswerBody>
            {displayedQuestion?.answer_explanation && (
              <SafeHtml html={displayedQuestion?.answer_explanation || ""} />
            )}
            {!displayedQuestion?.answer_explanation && (
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
          className="w-full flex justify-center items-center gap-4"
        >
          <ReportQuestionDialog
            disabled={!!actionError}
            onSubmit={handleReportQuestion}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (onReturn) {
                onReturn();
                return;
              }
              router.push(
                `/courses/${encodeURIComponent(
                  courseCode,
                )}/question/${encodeURIComponent(questionId)}/edit`,
              );
            }}
          >
            Edit
            <Pencil />
          </Button>
          <SaveForLater
            courseCode={courseCode}
            question={previewQuestionForSave}
            error={actionError}
          />
        </div>
      </QuestionPage.Actions>
    </QuestionPage>
  );
}
