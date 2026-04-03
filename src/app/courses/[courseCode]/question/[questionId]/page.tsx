"use client";

import { Button } from "@/components/ui/button";
import { ReportQuestionDialog } from "@/components/macfast/report-question-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MacFastHeader } from "@/components/macfast/macfast-header";
import { useEffect, useState } from "react";
import { getQuestionById, setSavedForLaterDebounced } from "@/lib/api";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import React from "react";
import { SafeHtml } from "@/components/macfast/safe-html";
import { QuestionPage } from "@/components/macfast/question-page";
import { ChevronsRight } from "lucide-react";
import SaveForLater from "@/components/macfast/save-for-later";
import QuestionOption from "@/components/macfast/question-option/question-option";

interface QuestionPageProps {
  params: Promise<{
    courseCode: string;
    questionId: string;
  }>;
}

function SingleQuestionPage({ params: paramsPromise }: QuestionPageProps) {
  const params = React.use(paramsPromise);
  const courseCode = decodeURI(params.courseCode);
  const questionId = decodeURI(params.questionId);

  const [question, setQuestion] = useState<TestQuestion>({} as TestQuestion);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [correctOptionId, setCorrectOptionId] = useState<string | null>(null);
  const authFetch = useAuthFetch();

  useEffect(() => {
    if (!courseCode || !questionId) return;
    getQuestionById(courseCode, questionId, authFetch).then(setQuestion);
  }, [courseCode, questionId]);

  return (
    <QuestionPage>
      <QuestionPage.Header>
        <MacFastHeader />
      </QuestionPage.Header>
      <QuestionPage.Title>
        <h1>{courseCode}</h1>
        <ChevronsRight />
        <h1>Saved Question</h1>
      </QuestionPage.Title>
      <QuestionPage.Content>
        <QuestionPage.QuestionBody error={""} isLoading={!question.content}>
          {question.content && (
            <div className="border p-4 rounded-lg shadow-md">
              <SafeHtml html={question.content} />
            </div>
          )}
          <QuestionPage.Options isLoading={!question.options}>
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
            >
              {question?.options &&
                question.options.map((option) => (
                  <QuestionOption
                    key={option.public_id}
                    option={option}
                    selectedOption={selectedOption}
                    correctOptionId={correctOptionId}
                    submitted={submitted}
                    isSubmitSuccess={submitSuccess}
                    question={question}
                  />
                ))}
            </RadioGroup>
          </QuestionPage.Options>
        </QuestionPage.QuestionBody>
        <QuestionPage.Answer
          isLoading={!question.options}
          isAnswered={submitted}
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
            <p className="font-poppins text-2xl">
              <SafeHtml html={solution || ""} />
            </p>
          </QuestionPage.AnswerBody>
          <QuestionPage.AnswerPlaceholder>
            <h2 className="font-poppins font-semibold text-md mt-6 mb-2">
              Submit an answer to see the solution.
            </h2>
          </QuestionPage.AnswerPlaceholder>
        </QuestionPage.Answer>
      </QuestionPage.Content>
      <QuestionPage.Actions>
        <div
          id="question-section"
          className="w-full flex flex-row flex-2 justify-between items-center"
        >
          <ReportQuestionDialog onSubmit={() => {}} />
          <div className="inline-flex items-center gap-4">
            <div className="inline-flex gap-2">
              <SaveForLater
                courseCode={courseCode}
                question={question}
                error={""}
              />
            </div>
            <Button variant="secondary" disabled={submitted}>
              Skip
            </Button>
            <Button
              variant="primary"
              disabled={!selectedOption || submitted}
              onClick={() => {}}
            >
              Submit
            </Button>
          </div>
        </div>
        <div id="answer-section" className="flex-1 flex justify-end"></div>
      </QuestionPage.Actions>
    </QuestionPage>
  );
}

export default SingleQuestionPage;
