"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionFlagDialog } from "@/components/ui/custom/question-flag-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import DOMPurify from "dompurify";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import { useEffect, useState } from "react";
import { getQuestionById } from "@/lib/api";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import React from "react";
import { SafeHtml } from "@/components/ui/custom/safe-html";

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
  const [courseCodeForLink, setCourseCodeForLink] = useState<string>("");
  const authFetch = useAuthFetch();

  useEffect(() => {
    if (!courseCode || !questionId) return;
    getQuestionById(courseCode, questionId, authFetch).then(setQuestion);
  }, [courseCode, questionId]);

  return (
    <div className="flex flex-col h-screen">
      <MacFastHeader />
      <div id="content" className="flex flex-col gap-4 p-8 flex-1">
        <div
          id="header"
          className="flex flex-row font-poppins font-semibold text-xl items-center gap-2 text-dark-gray"
        >
          <h1>{courseCode} - Saved Question</h1>
        </div>
        <div id="content" className="flex flex-row gap-4 flex-1">
          <div id="question-content" className="flex-2 flex flex-col gap-6">
            {!question.content && <Skeleton className="w-full h-40" />}
            {question.content && (
              <div className="border p-4 rounded-lg shadow-md">
                <SafeHtml html={question.content} />
              </div>
            )}
            <div id="options-list" className="flex flex-col gap-2">
              {!question?.options &&
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
                    <SafeHtml
                      html={
                        question?.options.find(
                          (option) => option.public_id === correctOptionId,
                        )?.content || ""
                      }
                    />
                  </p>
                </div>

                <div>
                  <h2 className="font-poppins font-semibold text-lg">Why?</h2>
                  <SafeHtml html={solution || ""} />
                </div>
              </div>
            )}
            {question?.content && !submitSuccess && (
              <h2 className="font-poppins font-semibold text-md mt-6 mb-2">
                Submit an answer to see the solution.
              </h2>
            )}
            {(!question?.content || (!submitSuccess && submitted)) && (
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
          <QuestionFlagDialog onSubmit={() => {}} />
          <div className="inline-flex items-center gap-4">
            <div className="inline-flex gap-2">
              <Checkbox id="save-for-later" onCheckedChange={() => {}} />
              <Label htmlFor="save-for-later">Save for Later</Label>
            </div>
            <Button variant="secondary" size="lg" disabled={submitted}>
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
        <div id="answer-section" className="flex-1 flex justify-end">
          <Button variant="primary" asChild>
            <Link href={`../coursepage#savedQuestions`}>
              Back to saved questions
            </Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}

export default SingleQuestionPage;
