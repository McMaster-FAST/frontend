"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronsRight } from "lucide-react";
import React, { useState } from "react";
import {
  getNextQuestion,
  skipQuestion,
  submitAnswer,
  useSkippedQuestions,
} from "@/lib/adaptive-test-api";
import { useEffect } from "react";
import { useAuthFetch } from "@/hooks/fetch_with_auth";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionFlagDialog } from "@/components/ui/custom/question-flag-dialog";
import DOMPurify from "dompurify";
import ErrorMessage from "@/components/ui/custom/error-message";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import {
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { updateTestSession } from "@/lib/api";
import Link from "next/link";

interface QuestionPageProps {
  params: Promise<{
    courseCode: string;
    unitName: string;
    subtopicName: string;
  }>;
}

function QuestionPage({ params: paramsPromise }: QuestionPageProps) {
  const params = React.use(paramsPromise);
  const course = decodeURI(params.courseCode);
  const unit = decodeURI(params.unitName);
  const subtopic = decodeURI(params.subtopicName);

  const [question, setQuestion]: [
    TestQuestion,
    React.Dispatch<React.SetStateAction<TestQuestion>>,
  ] = useState({} as TestQuestion);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [correctOptionId, setCorrectOptionId] = useState<string>("");
  const [solution, setSolution] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isQuestionLoading = !question && !error;
  const authFetch = useAuthFetch();

  const resetState = () => {
    setSelectedOption("");
    setSubmitSuccess(false);
    setSubmitted(false);
    setCorrectOptionId("");
    setSolution("");
  };

  const handleNextQuestion = async () => {
    getNextQuestion(course, unit, subtopic, authFetch)
      .then((nextQuestion) => {
        setQuestion(nextQuestion);
        resetState();
      })
      .catch((err) => setError(err.message));
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    submitAnswer(selectedOption, question.public_id, authFetch)
      .then((data) => {
        setSubmitSuccess(true);
        setCorrectOptionId(data.correct_option_id);
        setSolution(data.explanation);
      })
      .catch((err) => setError(err.message));
  };

  const handleSkip = async () => {
    setQuestion({} as TestQuestion);
    skipQuestion(question.public_id, course, authFetch)
      .then((nextQuestion) => {
        setQuestion(nextQuestion);
        resetState();
      })
      .catch((err) => setError(err.message));
  };

  const handleSaveForLater = async () => {
    // Implement save for later functionality here
  };
  const handleQuestionFlag = async () => {
    // Implement question flagging functionality here
  };

  useEffect(() => {
    handleNextQuestion();
  }, [course, unit, subtopic]);

  return (
    <div className="flex flex-col h-screen">
      <MacFastHeader />
      <div id="content" className="flex flex-col gap-4 p-8 flex-1">
        <div
          id="header"
          className="flex flex-row font-poppins font-semibold text-xl items-center gap-2 text-dark-gray"
        >
          <h1>{course}</h1>
          <ChevronsRight />
          <h1>
            {unit} - {subtopic}
          </h1>
        </div>
        <div id="content" className="flex flex-row gap-4 flex-1">
          <div id="question-content" className="flex-2 flex flex-col gap-6">
            {/* TODO Provide actions for errors */}
            {error && <ErrorMessage message={error} />}
            {error && (
              <AlertDialog open={!!error}>
                <AlertDialogContent className="w-min">
                  <AlertDialogTitle>Ran out of questions!</AlertDialogTitle>

                  <AlertDialogDescription>{error}</AlertDialogDescription>
                  <AlertDialogDescription className="mb-4">
                    How would you like to proceed?
                  </AlertDialogDescription>
                  <div className="flex flex-col w-fit gap-2 justify-center">
                    <AlertDialogAction asChild>
                      <Button
                        onClick={() =>
                          updateTestSession(
                            course,
                            {
                              use_hard_questions: true,
                            },
                            authFetch,
                          ).then(() => {
                            setError(null);
                            handleNextQuestion();
                          })
                        }
                      >
                        Use hard questions
                      </Button>
                    </AlertDialogAction>
                    <AlertDialogAction asChild>
                      <Button
                        onClick={() =>
                          useSkippedQuestions(course, authFetch).then(() => {
                            setError(null);
                            handleNextQuestion();
                          })
                        }
                      >
                        Use skipped questions
                      </Button>
                    </AlertDialogAction>
                    <AlertDialogCancel asChild>
                      <Button variant="secondary">
                        <Link href={`/courses/${course}/coursePage`}>
                          Return to Course Page
                        </Link>
                      </Button>
                    </AlertDialogCancel>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {isQuestionLoading && <Skeleton className="w-full h-40" />}
            {question.content && (
              <div
                id="question-card"
                className="border p-4 rounded-lg shadow-md"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(question.content),
                }}
              ></div>
            )}
            <div id="options-list" className="flex flex-col gap-2">
              {isQuestionLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="w-full h-10" />
                ))}
              <RadioGroup
                value={selectedOption}
                onValueChange={setSelectedOption}
              >
                {question?.options &&
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
                        className={
                          "border-2 p-6 rounded-md items-center flex gap-2 w-full" +
                          (correctOptionId === option.public_id
                            ? " border-primary"
                            : "")
                        }
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(option.content),
                        }}
                      ></Label>
                    </div>
                  ))}
              </RadioGroup>
            </div>
          </div>
          <div
            id="answer-content"
            className="border-l-2 border-gray-300 pl-4 flex-1 flex flex-col gap-4"
          >
            {submitSuccess && solution && (
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="font-poppins font-bold text-2xl">
                    The correct answer is:
                  </h1>
                  <p className="font-poppins text-2xl">
                    {
                      question?.options.find(
                        (option) => option.public_id === correctOptionId,
                      )?.content
                    }
                  </p>
                </div>

                <div>
                  <h2 className="font-poppins font-semibold text-lg">Why?</h2>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(solution),
                    }}
                  ></p>
                </div>
              </div>
            )}
            {question?.content && !submitSuccess && (
              <h2 className="font-poppins font-semibold text-md mt-6 mb-2">
                Submit an answer to see the solution.
              </h2>
            )}
            {(isQuestionLoading || (!submitSuccess && submitted)) && (
              <Skeleton className="w-full h-full" />
            )}
          </div>
        </div>
      </div>
      <footer className="flex flex-row gap-4 sticky bottom-0 left-0 w-full p-4 border-t-2 bg-white">
        <div
          id="question-section"
          className="w-full flex flex-row flex-2 justify-between items-center"
        >
          <div>
            <QuestionFlagDialog onSubmit={handleQuestionFlag} />
          </div>
          <div className="inline-flex items-center gap-4">
            <div className="inline-flex gap-2">
              <Checkbox
                id="save-for-later"
                onCheckedChange={handleSaveForLater}
              />
              <Label htmlFor="save-for-later">Save for Later</Label>
            </div>
            <Button
              variant="secondary"
              disabled={submitted}
              onClick={handleSkip}
            >
              Skip
            </Button>
            <Button
              variant="primary"
              disabled={!selectedOption || submitted}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
        <div id="answer-section" className="flex-1 flex justify-end">
          {submitSuccess && submitted && (
            <Button variant="primary" onClick={handleNextQuestion}>
              Next Question
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default QuestionPage;
