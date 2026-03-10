"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MacFastHeader } from "@/components/macfast/macfast-header";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowLeft,
  Eye,
  List,
  MessageSquare,
  NotebookPen,
  Pencil,
} from "lucide-react";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { QuestionPage } from "@/components/macfast/question-page";
import { isEqual } from "lodash";
import ErrorMessage from "@/components/macfast/error-message";
import { getQuestionByPublicId, uploadQuestionImage } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourseData } from "@/hooks/useCourseData";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import CommentsSheet from "@/components/macfast/comments/comments-sheet";
import OptionsTab from "./tabs/options-tab";
import QuestionTab from "./tabs/question-tab";
import QuestionPreviewPage from "../preview/page";
import { updateQuestion } from "@/lib/api";
import { CourseBanner } from "@/components/macfast/course-banner/course-banner";

function dataUrlToFile(dataUrl: string, baseName: string): File | null {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;

  const mimeType = match[1];
  const extension = mimeType.split("/")[1] || "png";
  const binary = atob(match[2]);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new File([bytes], `${baseName}.${extension}`, { type: mimeType });
}

async function uploadEmbeddedImagesInHtml(
  html: string,
  authFetch: ReturnType<typeof useAuthFetch>,
  filePrefix: string,
): Promise<string> {
  if (!html.includes("data:image/")) return html;

  const documentFragment = new DOMParser().parseFromString(html, "text/html");
  const embeddedImages = Array.from(
    documentFragment.querySelectorAll('img[src^="data:image/"]'),
  );

  for (const [index, image] of embeddedImages.entries()) {
    const src = image.getAttribute("src");
    if (!src) continue;

    const file = dataUrlToFile(src, `${filePrefix}-${index + 1}`);
    if (!file) continue;

    const uploadedUrl = await uploadQuestionImage(file, authFetch);
    if (uploadedUrl) {
      image.setAttribute("src", uploadedUrl);
    }
  }

  return documentFragment.body.innerHTML;
}

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
  const [isPreview, setIsPreview] = useState(false);

  const hasChanges = () => {
    return !isEqual(question, questionCopy);
  };

  const handleCancel = () => {
    setQuestion(questionCopy);
    router.back();
  };

  const handleSave = async () => {
    if (!question) {
      setError("Question data is missing");
      return;
    }

    const questionWithUploadedImages = structuredClone(question);
    // We upload the images to the backend to get their URLs and embed that in the question HTML
    // This could be done on the backend, potentially but that can be saved for when we hook the rest
    // of this up to the backend
    questionWithUploadedImages.content = await uploadEmbeddedImagesInHtml(
      questionWithUploadedImages.content,
      authFetch,
      `${questionWithUploadedImages.public_id}-question`,
    );
    questionWithUploadedImages.options = await Promise.all(
      questionWithUploadedImages.options.map(async (option, index) => ({
        ...option,
        content: await uploadEmbeddedImagesInHtml(
          option.content,
          authFetch,
          `${questionWithUploadedImages.public_id}-option-${index + 1}`,
        ),
      })),
    );

    // TODO: patch individual options via PATCH /api/questions/<id>/options/<option_id>/
    
    try {
      const saved = await updateQuestion(
        questionWithUploadedImages.public_id,
        {
          content: questionWithUploadedImages.content,
          answer_explanation: questionWithUploadedImages.answer_explanation,
          is_flagged: questionWithUploadedImages.is_flagged,
          is_active: questionWithUploadedImages.is_active,
          is_verified: questionWithUploadedImages.is_verified,
        },
        authFetch,
      );
      setQuestion(saved);
      setQuestionCopy(structuredClone(saved));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save question");
    }
  };

  useEffect(() => {
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

  if (isPreview) {
    return (
      <QuestionPreviewPage
        useQuestion={question}
        onReturn={() => setIsPreview(false)}
      />
    );
  }

  if (!isQuestionLoading && (!question || !question.options)) {
    return (
      <QuestionPage>
        <QuestionPage.Header>
          <MacFastHeader />
        </QuestionPage.Header>
        <QuestionPage.Title>
          <h1>Question data is malformed</h1>
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
    <div className="flex flex-col h-screen bg-background font-poppins">
      <MacFastHeader />

      <CourseBanner
        course={course}
        isLoading={isLoading}
        error={error}
        variant="question-edit"
      />

      <main className="mx-auto w-full max-w-7xl px-6 pt-8 flex-1 flex flex-col min-h-0 overflow-hidden">
        <Button
          className="mr-auto px-0"
          variant="tertiary"
          onClick={() => router.replace("../../dashboard")}
        >
          <ArrowLeft />
          Back to Dashboard
        </Button>
        {error && <ErrorMessage message={error} />}
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
          <QuestionTab question={question} setQuestion={setQuestion} />
          <OptionsTab question={question} setQuestion={setQuestion} />
        </Tabs>
        <CommentsSheet
          open={areCommentsOpen}
          onOpenChange={setAreCommentsOpen}
          questionId={question?.public_id || ""}
        />
      </main>
      <footer className="border-t-2 border-light-gray">
        <div className="flex justify-between px-6 py-4">
          <div className="inline-flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setAreCommentsOpen(true)}
            >
              View Comments
              <MessageSquare />
            </Button>
            <Button variant="secondary" onClick={() => setIsPreview(true)}>
              Preview
              <Eye />
            </Button>
          </div>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              disabled={!hasChanges()}
              onClick={handleCancel}
            >
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
