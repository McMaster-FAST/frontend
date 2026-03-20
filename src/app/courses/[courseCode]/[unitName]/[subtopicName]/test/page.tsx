"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronsRight } from "lucide-react";
import React, { useState } from "react";
import { JSX } from "react/jsx-runtime";
import {
  getNextQuestion,
  resetSkippedQuestions,
  skipQuestion,
  submitAnswer,
} from "@/lib/adaptive-test-api";
import { useEffect } from "react";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionFlagDialog } from "@/components/macfast/question-flag-dialog";
import { resolveImages } from "@/lib/utils";
import TestContinueDialog from "@/components/macfast/test-continue-dialog";

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
import Link from "next/link";
import { QuestionPage } from "@/components/macfast/question-page";
import { MacFastHeader } from "@/components/macfast/macfast-header";
import { SafeHtml } from "@/components/macfast/safe-html";

interface QuestionTestPageProps {
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

function QuestionTestPage({ params: paramsPromise }: QuestionTestPageProps) {
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

  const showTestContinueDialog =
    !isQuestionLoading &&
    !error &&
    (!question.content || actions.length > 0 || notes.length > 0);

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
              handleNextQuestion();
            },
          };
        case ContinueAction.DECREMENT_WINDOW_LOWERBOUND:
          return {
            caption: <span>See easier questions</span>,
            action: async () => {
              await updateSelWindowLowerBound(subtopic_id, authFetch);
              handleNextQuestion();
            },
          };
        case ContinueAction.USE_SKIPPED_QUESTIONS:
          return {
            caption: <span>Use recently skipped questions</span>,
            action: async () => {
              await resetSkippedQuestions(subtopic_id, authFetch);
              resetState();
              handleNextQuestion();
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
        console.log(suggested_actions);
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
    <QuestionPage>
      <QuestionPage.Header>
        <MacFastHeader />
      </QuestionPage.Header>
      <QuestionPage.Title>
        <h1>{courseCode}</h1>
        <ChevronsRight />
        <h1>{unit_name}</h1>
        <ChevronsRight />
        <h1>{subtopic_name}</h1>
      </QuestionPage.Title>
      <QuestionPage.Content>
        <TestContinueDialog
          open={showTestContinueDialog}
          actions={actions}
          notes={notes}
        />
        <QuestionPage.QuestionBody
          error={error}
          isLoading={isQuestionLoading || showTestContinueDialog}
        >
          {question.content && (
            <div className="border p-4 rounded-lg shadow-md">
              <SafeHtml
                html={resolveImages(question.content, question.public_id)}
              />
            </div>
          )}

          <QuestionPage.Options
            isLoading={isQuestionLoading || showTestContinueDialog}
          >
            {question?.options && (
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
                      className="cursor-pointer dark:data-[state=checked]:bg-primary-hover data-[state=checked]:bg-primary peer"
                    />
                    <div
                      className={
                        "border-2 p-6 rounded-md items-center flex gap-2 w-full" +
                        (correctOptionId === option.public_id
                          ? " border-primary dark:border-primary-hover"
                          : "")
                      }
                    >
                      <SafeHtml
                        html={resolveImages(option.content, question.public_id)}
                      />
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}
          </QuestionPage.Options>
        </QuestionPage.QuestionBody>
        <QuestionPage.Answer
          isLoading={
            isQuestionLoading ||
            (submitted && !submitSuccess) ||
            showTestContinueDialog
          }
          isAnswered={submitted || showTestContinueDialog}
        >
          <QuestionPage.AnswerTitle>
            <p className="font-poppins text-2xl">
              <SafeHtml
                html={
                  question?.options?.find(
                    (option) => option.public_id === correctOptionId,
                  )?.content || ""
                }
              />
            </p>
          </QuestionPage.AnswerTitle>
          <QuestionPage.AnswerBody>
            {solution && <SafeHtml html={solution} />}
            {!solution && (
              <p className="italic text-muted-foreground">
                No explanation provided for this question.
              </p>
            )}
          </QuestionPage.AnswerBody>
          <QuestionPage.AnswerPlaceholder>
            {question?.content && !submitSuccess && (
              <h2 className="font-poppins font-semibold text-md mt-6 mb-2">
                Submit an answer to see the solution.
              </h2>
            )}
          </QuestionPage.AnswerPlaceholder>
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
