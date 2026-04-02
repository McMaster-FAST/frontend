"use client";

import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { ChevronsRight } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { JSX } from "react/jsx-runtime";
import {
  getNextQuestion,
  resetSkippedQuestions,
  skipQuestion,
  submitAnswer,
} from "@/lib/adaptive-test-api";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { QuestionFlagDialog } from "@/components/macfast/report-question-dialog";
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
import SaveForLater from "@/components/macfast/save-for-later";
import { QuestionPage } from "@/components/macfast/question-page";
import { MacFastHeader } from "@/components/macfast/macfast-header";
import { SafeHtml } from "@/components/macfast/safe-html";
import QuestionOption from "@/components/macfast/question-option/question-option";

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
    courseCode,
    isLoading: courseLoading,
    error: courseLoadError,
  } = useCourseData();
  const authFetch = useAuthFetch();
  const subtopicIdRef = useRef("");

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
  const [devAnswerId, setDevAnswerId] = useState<string>("");

  const courseErrorMessage = useMemo(() => {
    if (courseLoading || !courseLoadError) return null;
    return courseLoadError instanceof Error
      ? courseLoadError.message
      : "Failed to load course.";
  }, [courseLoading, courseLoadError]);

  const unitSubtopicResolution = useMemo(() => {
    if (!course || courseLoading) return { status: "pending" as const };
    const un = unit_name.trim();
    const sn = subtopic_name.trim();
    const unit = course.units?.find((u) => u.name.trim() === un);
    if (!unit?.subtopics) {
      return {
        status: "error" as const,
        message: unit
          ? "This unit has no subtopics."
          : `Unit "${unit_name}" was not found in this course.`,
      };
    }
    const subtopic = unit.subtopics.find((s) => s.name.trim() === sn);
    if (!subtopic) {
      return {
        status: "error" as const,
        message: `Subtopic "${subtopic_name}" was not found. If you used Resume, ensure the backend returns names that match this course (unit and subtopic names).`,
      };
    }
    return {
      status: "ok" as const,
      subtopicPublicId: subtopic.public_id,
    };
  }, [course, courseLoading, unit_name, subtopic_name]);

  const resolvedSubtopicId =
    unitSubtopicResolution.status === "ok"
      ? unitSubtopicResolution.subtopicPublicId
      : "";

  const resolutionError =
    unitSubtopicResolution.status === "error"
      ? unitSubtopicResolution.message
      : null;

  const displayError = error || courseErrorMessage || resolutionError;

  const showTestContinueDialog =
    !isQuestionLoading &&
    !displayError &&
    (!question.content || actions.length > 0 || notes.length > 0);

  const resetState = () => {
    setIsQuestionLoading(true);
    setSelectedOption("");
    setSubmitSuccess(false);
    setSubmitted(false);
    setCorrectOptionId("");
    setSolution("");
    setError("");
    setDevAnswerId("");
  };

  const generateActionsForContinueActions = (
    continue_actions: ContinueAction[],
    subtopic_id: string,
  ): ActionInfo[] => {
    return continue_actions.flatMap((action) => {
      switch (action) {
        case ContinueAction.INCREMENT_WINDOW_UPPERBOUND:
          return [
            {
              caption: <span>See harder questions</span>,
              action: async () => {
                await updateSelWindowUpperBound(subtopic_id, authFetch);
                handleNextQuestion();
              },
            },
          ];
        case ContinueAction.DECREMENT_WINDOW_LOWERBOUND:
          return [
            {
              caption: <span>See easier questions</span>,
              action: async () => {
                await updateSelWindowLowerBound(subtopic_id, authFetch);
                handleNextQuestion();
              },
            },
          ];
        case ContinueAction.USE_SKIPPED_QUESTIONS:
          return [
            {
              caption: <span>Use recently skipped questions</span>,
              action: async () => {
                await resetSkippedQuestions(subtopic_id, authFetch);
                resetState();
                handleNextQuestion();
              },
            },
          ];
        default:
          return [];
      }
    });
  };
  const updateWithNewQuestion = (
    questionPromise: Promise<{
      question: TestQuestion;
      continue_actions: ContinueAction[];
      suggested_actions: SuggestedAction[];
    }>,
    resolvedSubtopicId: string,
  ) => {
    questionPromise
      .then(({ question, continue_actions, suggested_actions }) => {
        setQuestion(question);
        setActions(
          generateActionsForContinueActions(
            continue_actions,
            resolvedSubtopicId,
          ),
        );
        setNotes(generateNoteFromSuggestedActions(suggested_actions));
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => setIsQuestionLoading(false));
  };

  const handleNextQuestion = async () => {
    resetState();
    const sid = resolvedSubtopicId || subtopicIdRef.current;
    if (!sid) {
      setError(
        "Subtopic is not ready yet. Please wait or return to the course page.",
      );
      setIsQuestionLoading(false);
      return;
    }
    subtopicIdRef.current = sid;
    updateWithNewQuestion(
      getNextQuestion(courseCode || "", unit_name, subtopic_name, authFetch),
      sid,
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
    const sid = resolvedSubtopicId || subtopicIdRef.current;
    if (!sid) {
      setError("Subtopic is not ready yet.");
      setIsQuestionLoading(false);
      return;
    }
    updateWithNewQuestion(skipQuestion(question.public_id, authFetch), sid);
  };

  const handleQuestionFlag = async () => {
    // Implement question flagging functionality here
  };

  useEffect(() => {
    subtopicIdRef.current = resolvedSubtopicId;
  }, [resolvedSubtopicId]);

  const didInitialFetch = useRef(false);
  useEffect(() => {
    if (!resolvedSubtopicId || didInitialFetch.current) return;
    didInitialFetch.current = true;
    void handleNextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when URL subtopic id becomes available
  }, [resolvedSubtopicId]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !question.public_id) return;
    authFetch(`/api/core/questions/${question.public_id}/answer/`)
      .then((res) => res.json())
      .then((data) => setDevAnswerId(data.correct_option_id ?? ""))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.public_id]);

  return (
    <QuestionPage courseCode={courseCode || ""}>
      <QuestionPage.Header>
        <MacFastHeader />
      </QuestionPage.Header>
      <QuestionPage.Title>
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center gap-2 min-w-0">
            <h1>{courseCode}</h1>
            <ChevronsRight />
            <h1>{unit_name}</h1>
            <ChevronsRight />
            <h1>{subtopic_name}</h1>
          </div>
        </div>
      </QuestionPage.Title>
      <QuestionPage.Content>
        <TestContinueDialog
          open={showTestContinueDialog}
          actions={actions}
          notes={notes}
        />
        <QuestionPage.QuestionBody
          error={displayError || ""}
          isLoading={
            (isQuestionLoading || showTestContinueDialog) && !displayError
          }
        >
          {question.content && (
            <div className="border p-4 rounded-lg shadow-md">
              <SafeHtml
                html={resolveImages(question.content, question.public_id)}
              />
            </div>
          )}

          <QuestionPage.Options
            isLoading={
              (isQuestionLoading || showTestContinueDialog) && !displayError
            }
          >
            {question?.options && (
              <RadioGroup
                value={selectedOption}
                onValueChange={setSelectedOption}
                className="flex flex-col gap-3"
                disabled={submitted}
              >
                {question?.options.map((option) => (
                  <QuestionOption
                    key={option.public_id}
                    option={option}
                    correctOptionId={correctOptionId}
                    submitted={submitted}
                    isSubmitSuccess={submitSuccess}
                    selectedOption={selectedOption}
                    question={question}
                  />
                ))}
              </RadioGroup>
            )}
            {process.env.NODE_ENV !== "production" && devAnswerId && (
              <p className="text-xs text-muted-foreground/40 italic mt-1">
                debug log:{" "}
                <SafeHtml
                  html={
                    question.options?.find((o) => o.public_id === devAnswerId)
                      ?.content ?? devAnswerId
                  }
                />
              </p>
            )}
          </QuestionPage.Options>
        </QuestionPage.QuestionBody>
        <QuestionPage.Answer
          isLoading={
            !displayError &&
            (isQuestionLoading ||
              (submitted && !submitSuccess) ||
              showTestContinueDialog)
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
              <h2 className="font-poppins text-center font-semibold text-lg mt-6 mb-2">
                Submit an answer to see the solution!
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
            <SaveForLater
              courseCode={courseCode}
              question={question}
              error={error}
            />
            <Button
              variant="secondary"
              disabled={submitted || !!error}
              onClick={handleSkip}
            >
              Skip
            </Button>
            <Button
              variant="primary"
              disabled={!selectedOption || submitted || !!error}
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
