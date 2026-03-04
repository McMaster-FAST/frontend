"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowLeft,
  List,
  MessageSquare,
  NotebookPen,
  Pencil,
} from "lucide-react";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { QuestionPage } from "@/components/ui/custom/question-page";
import { isEqual } from "lodash";
import ErrorMessage from "@/components/ui/custom/error-message";
import { getQuestionByPublicId } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourseData } from "@/hooks/useCourseData";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import CommentsSheet from "@/components/ui/custom/comments/comments-sheet";
import OptionsTab from "./tabs/options-tab";

export default function QuestionEditPage() {
  const params = useParams();
  const router = useRouter();
  const authFetch = useAuthFetch();
  const { course, isLoading, error: courseError } = useCourseData();

  const questionId = decodeURIComponent(params.questionId as string);
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionCopy, setQuestionCopy] = useState<Question | null>(null);
  const [isQuestionLoading, setIsQuestionLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [areCommentsOpen, setAreCommentsOpen] = useState(false);

  const hasChanges = () => {
    return !isEqual(question, questionCopy);
  };

  const handleCancel = () => {
    setQuestion(questionCopy);
    router.back();
  };

  const handleSave = () => {
    console.log(question);
    // do validation
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
    <div className="flex flex-col h-screen bg-slate-50/50 font-poppins">
      <MacFastHeader />
      <div className="border-b border-light-gray bg-white px-6 py-8 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4">
            <div className="h-full">
              <Button
                variant="tertiary"
                className="px-0"
                onClick={() => router.replace("../../dashboard")}
              >
                <ArrowLeft className="mr-1 inline-block h-4 w-4 text-dark-gray" />
                Back to Dashboard
              </Button>
              <div className="mb-2 flex w-full items-center gap-2">
                <Badge variant="secondary" className="font-bold text-dark-gray">
                  {isLoading || !course ? (
                    <Skeleton className="h-4 w-20" />
                  ) : courseError ? (
                    <span>Unavailable</span>
                  ) : (
                    course.code
                  )}
                </Badge>

                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {isLoading || !course ? (
                    <Skeleton className="h-4 w-20" />
                  ) : courseError ? null : (
                    course.semester
                  )}
                </span>
                <Badge
                  variant="secondary"
                  className="ml-auto font-bold text-dark-gray"
                >
                  <Pencil className="mr-1 inline-block h-4 w-4 text-dark-gray" />
                  Question Editor
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                {isLoading || !course ? (
                  <Skeleton className="h-16 w-120" />
                ) : courseError ? (
                  <span className="text-red-900">
                    <AlertTriangle className="mr-2 inline-block" />
                    Error loading course
                  </span>
                ) : (
                  course.name
                )}
              </h1>
              <h2 className="text-lg font-semibold text-muted-foreground">
                Question:{" "}
                <span className="font-normal">{question?.public_id}</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
      <main className="mx-auto w-full max-w-7xl px-6 pt-8 flex-1 flex flex-col min-h-0 overflow-hidden">
        <Tabs
          className="w-full flex flex-col h-full overflow-hidden"
          defaultValue="question"
        >
          <TabsList>
            <TabsTrigger value="question">
              <NotebookPen />
              Question
            </TabsTrigger>
            <TabsTrigger value="options">
              <List />
              Options
            </TabsTrigger>
          </TabsList>

          <OptionsTab question={question} setQuestion={setQuestion} />
        </Tabs>
        <CommentsSheet
          open={areCommentsOpen}
          onOpenChange={setAreCommentsOpen}
        />
      </main>
      <footer className="border-t-2 border-light-gray">
        <div className="flex justify-between px-6 py-4">
          <div>
            <Button
              variant="secondary"
              onClick={() => setAreCommentsOpen(true)}
            >
              View Comments
              <MessageSquare />
            </Button>
          </div>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button disabled={!hasChanges()} onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
