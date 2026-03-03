"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import { Button } from "@/components/ui/button";
import { ChevronsRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { QuestionPage } from "@/components/ui/custom/question-page";
import { Textarea } from "@/components/ui/textarea";
import { isEqual } from "lodash";
import ErrorMessage from "@/components/ui/custom/error-message";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function QuestionEditPage() {
  const params = useParams();
  const router = useRouter();
  const authFetch = useAuthFetch();
  const courseCode = decodeURIComponent(params.courseCode as string);
  const questionId = decodeURIComponent(params.questionId as string);
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionCopy, setQuestionCopy] = useState<Question | null>(null);
  const [isQuestionLoading, setIsQuestionLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answerOption, setAnswerOption] = useState<string | null>(null);

  const hasChanges = () => {
    return !isEqual(question, questionCopy);
  };

  const getQuestionByPublicId = (
    questionId: string,
    authFetch: any,
  ): Promise<Question> => {
    return new Promise((resolve, reject) => {
      resolve({
        public_id: "123",
        content: "What is the capital of France?",
        unit: "Geography",
        subtopic: "European Capitals",
        course: courseCode,
        options: [
          { public_id: "opt1", content: "Paris", is_answer: true },
          { public_id: "opt2", content: "London", is_answer: false },
          { public_id: "opt3", content: "Berlin", is_answer: false },
          { public_id: "opt4", content: "Madrid", is_answer: false },
        ],
        answer_explanation:
          "Paris is the capital city of France and is known for its art, culture, and history.",
      } as Question);
    });
  };

  useEffect(() => {
    setIsQuestionLoading(true);
    getQuestionByPublicId(questionId, authFetch)
      .then((data) => {
        setQuestion(data);
        setQuestionCopy(structuredClone(data));
        if (!data.options) {
          setError("Question options are missing");
          return;
        }
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

  if (!isQuestionLoading && question && !question.options) {
    return (
      <QuestionPage>
        <QuestionPage.Header>
          <MacFastHeader />
        </QuestionPage.Header>
        <QuestionPage.Title>
          <h1>{question.course}</h1>#<h1>{questionId}</h1>
        </QuestionPage.Title>
        <QuestionPage.Content>
          <div>
            <ErrorMessage message="Question data is malformed." />
          </div>
        </QuestionPage.Content>
      </QuestionPage>
    );
  }

  return (
    <QuestionPage>
      <QuestionPage.Header>
        <MacFastHeader />
      </QuestionPage.Header>
      <QuestionPage.Title>
        <h1>{courseCode}</h1>
        <ChevronsRight />
        <h1>
          {question?.unit} - {question?.subtopic}
        </h1>
      </QuestionPage.Title>

      <QuestionPage.Content>
        <QuestionPage.QuestionBody
          error={error || ""}
          isLoading={isQuestionLoading}
        >
          <Textarea
            placeholder="Question content..."
            className="border p-4 rounded-lg shadow-md bg-background h-40"
            label={"Question Content"}
            value={question?.content || ""}
            onChange={(e) =>
              setQuestion((prev) =>
                prev != null ? { ...prev, content: e.target.value } : null,
              )
            }
          />
          <QuestionPage.Options isLoading={isQuestionLoading}>
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
                    <Textarea
                      placeholder="Option content..."
                      className={
                        answerOption === option.public_id
                          ? " border-primary"
                          : ""
                      }
                      value={option.content}
                      onChange={(e) => {
                        const updatedOptions = question.options.map((opt) =>
                          opt.public_id === option.public_id
                            ? { ...opt, content: e.target.value }
                            : opt,
                        );
                        setQuestion((prev) =>
                          prev != null
                            ? {
                                ...prev,
                                options: updatedOptions,
                              }
                            : null,
                        );
                      }}
                    />
                  </div>
                </div>
              ))}
            </RadioGroup>
          </QuestionPage.Options>
        </QuestionPage.QuestionBody>
        <QuestionPage.Answer isLoading={isQuestionLoading}>
          <QuestionPage.AnswerTitle>
            {
              question?.options?.find(
                (option) => option.public_id === answerOption,
              )?.content
            }
          </QuestionPage.AnswerTitle>
          <QuestionPage.AnswerBody>
            <Textarea
              placeholder="Answer explanation..."
              className="border p-4 rounded-lg shadow-md bg-background h-40"
              value={question?.answer_explanation || ""}
              onChange={(e) => {
                setQuestion((prev) =>
                  prev != null
                    ? { ...prev, answer_explanation: e.target.value }
                    : null,
                );
              }}
            />
          </QuestionPage.AnswerBody>
        </QuestionPage.Answer>
      </QuestionPage.Content>

      <QuestionPage.Actions>
        <div className="ml-auto flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" disabled={!hasChanges()}>
                Cancel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Discard changes?</DialogTitle>
              <DialogDescription>
                You have unsaved changes. Are you sure you want to discard them?
                This cannot be undone.
              </DialogDescription>
              <DialogClose>Keep Editing</DialogClose>
              <DialogClose>Discard Changes</DialogClose>
            </DialogContent>
          </Dialog>

          <Button
            disabled={!hasChanges()}
            onClick={() => alert("Save functionality not implemented yet")}
          >
            Save
          </Button>
        </div>
      </QuestionPage.Actions>
    </QuestionPage>
  );
}
