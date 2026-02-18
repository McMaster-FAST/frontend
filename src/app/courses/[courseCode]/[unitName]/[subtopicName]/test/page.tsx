"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronsRight } from "lucide-react";
import React, { useState } from "react";
import {
  getNextQuestion,
  skipQuestion,
  submitAnswer,
  resetSkippedQuestions,
  getActiveTestSession,
} from "@/lib/adaptive-test-api";
import { useEffect } from "react";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionFlagDialog } from "@/components/ui/custom/question-flag-dialog";
import DOMPurify from "dompurify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import {
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import Link from "next/link";
import { QuestionPage } from "@/components/ui/custom/question-page";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";

interface QuestionTestPageProps {
  params: Promise<{
    courseCode: string;
    unitName: string;
    subtopicName: string;
  }>;
}

interface ContinueActions {
  use_skipped_questions: boolean;
}

function QuestionTestPage({ params: paramsPromise }: QuestionTestPageProps) {
  // Get course info from URI
  const params = React.use(paramsPromise);
  const course = decodeURI(params.courseCode);
  const unit = decodeURI(params.unitName);
  const subtopic = decodeURI(params.subtopicName);

  const authFetch = useAuthFetch();

  // Setup state
  const [question, setQuestion]: [
    TestQuestion,
    React.Dispatch<React.SetStateAction<TestQuestion>>,
  ] = useState({} as TestQuestion);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [correctOptionId, setCorrectOptionId] = useState<string>("");
  const [solution, setSolution] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isQuestionLoading, setIsQuestionLoading] = useState<boolean>(true);
  const [continueActions, setContinueActions] = useState<ContinueActions>({
    use_skipped_questions: false,
  });

  const showNoQuestionsDialog =
    !question?.public_id && !isQuestionLoading && !error;

  const resetState = () => {
    setIsQuestionLoading(true);
    setSelectedOption("");
    setSubmitSuccess(false);
    setSubmitted(false);
    setCorrectOptionId("");
    setSolution("");
    setError("");
  };

  const handleNextQuestion = async () => {
    resetState();

    getNextQuestion(course, unit, subtopic, authFetch)
      .then((nextQuestion) => {
        setQuestion(nextQuestion);
        updateContinueActions();
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsQuestionLoading(false));
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
    resetState();
    skipQuestion(question.public_id, authFetch)
      .then((nextQuestion) => {
        setQuestion(nextQuestion);
        updateContinueActions();
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsQuestionLoading(false));
  };

  const handleSaveForLater = async () => {
    // Implement save for later functionality here
  };
  const handleQuestionFlag = async () => {
    // Implement question flagging functionality here
  };

  const useSkippedQuestions = () => {
    resetSkippedQuestions(authFetch).then(() => {
      handleNextQuestion();
    });
  };

  const updateContinueActions = () => {
    getActiveTestSession(authFetch).then((session) => {
      setContinueActions({
        use_skipped_questions: session.skipped_questions.length > 0,
      });
    });
  };

  useEffect(() => {
    (async () => {
      await handleNextQuestion();
      updateContinueActions();
    })();
  }, [course, unit, subtopic]);

  return (
    <QuestionPage>
      <QuestionPage.Header>
        <MacFastHeader />
      </QuestionPage.Header>
      <QuestionPage.Title>
        <h1>{course}</h1>
        <ChevronsRight />
        <h1>{unit}</h1>
        <ChevronsRight />
        <h1>{subtopic}</h1>
      </QuestionPage.Title>
      <QuestionPage.Content>
        <QuestionPage.QuestionBody error={error}>
          <AlertDialog open={!!showNoQuestionsDialog}>
            <AlertDialogContent className="w-min">
              <AlertDialogTitle>No available questions</AlertDialogTitle>
              <AlertDialogDescription>
                All questions have been skipped.
              </AlertDialogDescription>
              <AlertDialogDescription className="mb-4">
                How would you like to proceed?
              </AlertDialogDescription>
              <div className="flex flex-col w-fit gap-2 justify-center">
                {continueActions.use_skipped_questions && (
                  <AlertDialogAction asChild>
                    <Button onClick={useSkippedQuestions}>
                      Use skipped questions
                    </Button>
                  </AlertDialogAction>
                )}
                <AlertDialogCancel asChild>
                  <Button variant="secondary">
                    <Link href={`/courses/${course}/coursepage`}>
                      Return to Course Page
                    </Link>
                  </Button>
                </AlertDialogCancel>
              </div>
            </AlertDialogContent>
          </AlertDialog>
          {isQuestionLoading && <Skeleton className="w-full h-40" />}
          {!isQuestionLoading && question.content && (
            <div
              id="question-card"
              className="border p-4 rounded-lg shadow-md"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(question.content),
              }}
            ></div>
          )}
          <QuestionPage.Options>
            {isQuestionLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="w-full h-10" />
              ))}
            {!isQuestionLoading && question?.options && (
              <RadioGroup
                value={selectedOption}
                onValueChange={setSelectedOption}
              >
                {question?.options.map((option) => (
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
            )}
          </QuestionPage.Options>
        </QuestionPage.QuestionBody>
        <QuestionPage.Answer>
          <div className="flex flex-col gap-4">
            {submitSuccess && correctOptionId && (
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
            )}
            {submitSuccess && solution && (
              <div>
                <h2 className="font-poppins font-semibold text-lg">Why?</h2>
                <p
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(solution),
                  }}
                ></p>
              </div>
            )}
          </div>
          {question?.content && !submitSuccess && (
            <h2 className="font-poppins font-semibold text-md mt-6 mb-2">
              Submit an answer to see the solution.
            </h2>
          )}
          {(isQuestionLoading || (!submitSuccess && submitted)) && (
            <Skeleton className="w-full h-full" />
          )}
        </QuestionPage.Answer>
      </QuestionPage.Content>
      <QuestionPage.Actions>
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
      </QuestionPage.Actions>
    </QuestionPage>
  );
}

export default QuestionTestPage;
