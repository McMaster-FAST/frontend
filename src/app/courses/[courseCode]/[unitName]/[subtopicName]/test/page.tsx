"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronsRight } from "lucide-react";
import React, { useState } from "react";
import { JSX } from "react/jsx-runtime";
import {
  getNextQuestion,
  skipQuestion,
  submitAnswer,
} from "@/lib/adaptive-test-api";
import { useEffect } from "react";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionFlagDialog } from "@/components/ui/custom/question-flag-dialog";
import DOMPurify from "dompurify";
import ErrorMessage from "@/components/ui/custom/error-message";
import { resolveImages } from "@/lib/utils";
import TestContinueDialog from "@/components/ui/custom/test-continue-dialog";
import Link from "next/link";
import {
  ContinueAction,
  SuggestedAction,
} from "@/types/actions/ContinueAction";
import ActionInfo from "@/types/actions/ContinueActionInfo";
import {
  updateSelWindowLowerBound,
  updateSelWindowUpperBound,
} from "@/lib/api";
import { useCourseData } from "@/hooks/useCourseData";

interface QuestionPageProps {
  params: Promise<{
    courseCode: string;
    unitName: string;
    subtopicName: string;
  }>;
}

function generateNoteFromSuggestedActions(
  suggested_actions: SuggestedAction[],
): JSX.Element[] {
  return suggested_actions.map((action) => {
    switch (action) {
      case SuggestedAction.STOP_STUDYING:
        return (
          <span>
            <span className="block">
              The algorithm has determined your ability with some level of
              confidence, which you can view from the{" "}
              <Link className="clickable-text" href="../../coursepage">
                course page
              </Link>
              .
            </span>
            <span className="block">
              This should give you an idea of your understanding of this
              subtopic. If you are satisfied with your performance we suggest
              you move on to other subtopics.
            </span>
          </span>
        );
    }
  });
}

function QuestionPage({ params: paramsPromise }: QuestionPageProps) {
  // Get course info from URI
  const params = React.use(paramsPromise);
  const unit_name = decodeURIComponent(params.unitName);
  const subtopic_name = decodeURIComponent(params.subtopicName);
  const {
    course,
    isLoading,
    error: courseError,
    refetch,
    courseCode,
  } = useCourseData();
  const authFetch = useAuthFetch();

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
  const [actions, setActions] = useState<ActionInfo[]>([]);
  const [notes, setNotes] = useState<JSX.Element[]>([]);
  const [subtopicId, setSubtopicId] = useState("");

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

  const generateActionsForContinueActions = (
    continue_actions: ContinueAction[],
    subtopic_id: string,
  ): ActionInfo[] => {
    return continue_actions.map((action) => {
      switch (action) {
        case ContinueAction.INCREMENT_WINDOW_UPPERBOUND:
          return {
            caption: <span>See harder questions</span>,
            action: async () => {
              await updateSelWindowUpperBound(subtopic_id, authFetch);
              resetState();
              await handleNextQuestion();
            },
          };
        case ContinueAction.DECREMENT_WINDOW_LOWERBOUND:
          return {
            caption: <span>See easier questions</span>,
            action: async () => {
              await updateSelWindowLowerBound(subtopic_id, authFetch);
              await handleNextQuestion();
            },
          };
      }
    });
  };
  const updateWithNewQuestion = (
    questionPromise: Promise<{
      question: TestQuestion;
      continue_actions: ContinueAction[];
      suggested_actions: SuggestedAction[];
    }>,
  ) => {
    questionPromise
      .then(({ question, continue_actions, suggested_actions }) => {
        setQuestion(question);
        setActions(
          generateActionsForContinueActions(continue_actions, subtopicId),
        );
        setNotes(generateNoteFromSuggestedActions(suggested_actions));
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsQuestionLoading(false));
  };

  const handleNextQuestion = async () => {
    resetState();
    updateWithNewQuestion(
      getNextQuestion(courseCode || "", unit_name, subtopic_name, authFetch),
    );
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
    updateWithNewQuestion(skipQuestion(question.public_id, authFetch));
  };

  const handleSaveForLater = async () => {
    // Implement save for later functionality here
  };
  const handleQuestionFlag = async () => {
    // Implement question flagging functionality here
  };

  useEffect(() => {
    if (!course) return;
    const unit = course.units.find((unit) => unit.name === unit_name);
    if (!unit || !unit.subtopics) return;
    const subtopic = unit.subtopics.find(
      (subtopic) => subtopic.name === subtopic_name,
    );
    if (!subtopic) return;
    setSubtopicId(subtopic.public_id);
  }, [course]);

  useEffect(() => {
    if (!subtopicId) return;
    handleNextQuestion();
  }, [subtopicId]);

  return (
    <div className="flex flex-col h-screen">
      <MacFastHeader />
      <div id="content" className="flex flex-col gap-4 p-8 flex-1">
        <div
          id="header"
          className="flex flex-row font-poppins font-semibold text-xl items-center gap-2 text-dark-gray"
        >
          <h1>{courseCode}</h1>
          <ChevronsRight />
          <h1>
            {unit_name} - {subtopic_name}
          </h1>
        </div>
        <div id="content" className="flex flex-row gap-4 flex-1">
          <div id="question-content" className="flex-2 flex flex-col gap-6">
            {error && <ErrorMessage message={error} />}
            <TestContinueDialog
              open={showNoQuestionsDialog}
              actions={actions}
              notes={notes}
            />
            {isQuestionLoading && <Skeleton className="w-full h-40" />}
            {!isQuestionLoading && question.content && (
              <div
                id="question-card"
                className="border p-4 rounded-lg shadow-md"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    resolveImages(question.content, question.public_id),
                  ),
                }}
              ></div>
            )}
            <div id="options-list" className="flex flex-col gap-2">
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
                      <div
                        className={
                          "border-2 p-6 rounded-md w-full" +
                          (correctOptionId === option.public_id
                            ? " border-primary"
                            : "")
                        }
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            resolveImages(option.content, question.public_id),
                          ),
                        }}
                      />
                    </div>
                  ))}
                </RadioGroup>
              )}
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
