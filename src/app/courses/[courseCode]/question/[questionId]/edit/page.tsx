"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronsRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ErrorMessage from "@/components/ui/custom/error-message";
import DOMPurify from "dompurify";
import { getQuestionByPublicId } from "@/lib/api";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { QuestionPage } from "@/components/ui/custom/question-page";
import { FormattingToolbar } from "@/components/editor/formatting-toolbar";
import { RichTextarea } from "@/components/editor/rich-textarea";

export default function QuestionEditPage() {
  const params = useParams();
  const router = useRouter();
  const authFetch = useAuthFetch();
  const courseCode = decodeURIComponent(params.courseCode as string);
  const questionId = decodeURIComponent(params.questionId as string);
  const [question, setQuestion] = useState<Question | null>(null);
  const [isQuestionLoading, setIsQuestionLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answerOption, setAnswerOption] = useState<string | null>(null);

  useEffect(() => {
    setIsQuestionLoading(true);
    getQuestionByPublicId(questionId, authFetch)
      .then((data) => {
        setQuestion(data);
        const correctOption = data.options.find((option) => option.is_answer);
        setAnswerOption(correctOption ? correctOption.public_id : null);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsQuestionLoading(false);
      });
  }, [questionId]);

  return (
    <QuestionPage>
      <QuestionPage.Header>
        <MacFastHeader />
        <FormattingToolbar />
      </QuestionPage.Header>
      <QuestionPage.Title>
        <h1>{courseCode}</h1>
        <ChevronsRight />
        <h1>TODO - TODO</h1>
      </QuestionPage.Title>

      <QuestionPage.Content>
        <QuestionPage.QuestionBody error={error || ""}>
          {isQuestionLoading && <Skeleton className="w-full h-40" />}
          {!isQuestionLoading && question?.content && (
            <RichTextarea
              placeholder="Question content..."
              className="border p-4 rounded-lg shadow-md bg-background h-40"
              label={"Question Content"}
              value={question.content}
              onChange={(html) => setQuestion({ ...question, content: html })}
            />
          )}
          <QuestionPage.Options>
            {!isQuestionLoading && question?.options && (
              <RadioGroup value={answerOption} onValueChange={setAnswerOption}>
                {question?.options.map((option) => (
                  <div
                    key={option.public_id}
                    className="flex items-center gap-2 w-full"
                  >
                    <RadioGroupItem
                      value={option.public_id}
                      className="cursor-pointer"
                      checked={answerOption === option.public_id}
                    />
                    <div className="w-full">
                      <RichTextarea
                        placeholder="Option content..."
                        className={
                          answerOption === option.public_id
                            ? " border-primary"
                            : ""
                        }
                        value={option.content}
                        onChange={(html) => {
                          const updatedOptions = question.options.map((opt) =>
                            opt.public_id === option.public_id
                              ? { ...opt, content: html }
                              : opt,
                          );
                          setQuestion({
                            ...question,
                            options: updatedOptions,
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}
          </QuestionPage.Options>
        </QuestionPage.QuestionBody>
        <QuestionPage.Answer>
          <QuestionPage.AnswerTitle>
            {
              question?.options.find(
                (option) => option.public_id === answerOption,
              )?.content
            }
          </QuestionPage.AnswerTitle>
          <QuestionPage.AnswerBody>
            <RichTextarea
              placeholder="Answer explanation..."
              value={question?.answer_explanation || ""}
              onChange={(html) => {
                // setQuestion({ ...question, answer_explanation: html });
              }}
            />
          </QuestionPage.AnswerBody>
        </QuestionPage.Answer>
      </QuestionPage.Content>

      <QuestionPage.Actions>
        <div className="ml-auto flex gap-2">
          <Button variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            onClick={() => alert("Save functionality not implemented yet")}
          >
            Save
          </Button>
        </div>
      </QuestionPage.Actions>
    </QuestionPage>
  );
}
