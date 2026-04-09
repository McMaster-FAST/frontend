"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MacFastHeader } from "@/components/macfast/macfast-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, List, NotebookPen } from "lucide-react";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { QuestionPage } from "@/components/macfast/question-page";
import { isEqual } from "lodash";
import ErrorMessage from "@/components/macfast/error-message";
import {
  createQuestion,
  createQuestionOption,
  uploadQuestionImage,
} from "@/lib/question-api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourseData } from "@/hooks/useCourseData";
import OptionsTab from "../[questionId]/edit/tabs/options-tab";
import QuestionTab from "../[questionId]/edit/tabs/question-tab";
import QuestionPreviewPage from "../[questionId]/preview/page";
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

export default function NewQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const authFetch = useAuthFetch();
  const { course, isLoading, error: courseError } = useCourseData();
  const courseCode = decodeURIComponent((params.courseCode as string) ?? "");

  const initialQuestion = useMemo<Question>(
    () => ({
      public_id: "",
      serial_number: "",
      content: "",
      difficulty: 0,
      selection_frequency: 0,
      is_flagged: false,
      is_active: true,
      is_verified: false,
      options: [
        { public_id: "", content: "", is_answer: true, selection_frequency: 0 },
        { public_id: "", content: "", is_answer: false, selection_frequency: 0 },
      ],
      course: course?.code || courseCode,
      unit: "",
      subtopic_name: "",
      answer_explanation: "",
    }),
    [course?.code, courseCode],
  );

  const [question, setQuestion] = useState<Question | null>(initialQuestion);
  const [questionCopy, setQuestionCopy] = useState<Question | null>(initialQuestion);
  const [error, setError] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedUnitPublicId, setSelectedUnitPublicId] = useState("");
  const [selectedSubtopicPublicId, setSelectedSubtopicPublicId] = useState("");

  const hasChanges = () => {
    return !isEqual(question, questionCopy);
  };

  const handleCancel = () => {
    setQuestion(structuredClone(questionCopy));
    router.replace(`../../dashboard`);
  };

  const handleSave = async () => {
    setError(null);
    if (!question) {
      setError("Question data is missing.");
      return;
    }

    const content = question.content?.trim();
    if (!content) {
      setError("Question content is required.");
      return;
    }
    if (!question.options || question.options.length < 2) {
      setError("Please provide at least 2 options.");
      return;
    }
    if (!question.options.some((option) => option.is_answer)) {
      setError("Please mark one option as the correct answer.");
      return;
    }
    if (question.options.some((option) => !option.content?.trim())) {
      setError("All options must have content.");
      return;
    }
    if (!selectedSubtopicPublicId) {
      setError("Please select a unit and subtopic.");
      return;
    }
    setIsSaving(true);
    try {
      const now = Date.now();
      const tempQuestion = structuredClone(question);
      tempQuestion.content = await uploadEmbeddedImagesInHtml(
        tempQuestion.content,
        authFetch,
        `new-question-${now}`,
      );
      tempQuestion.options = await Promise.all(
        tempQuestion.options.map(async (option, index) => ({
          ...option,
          content: await uploadEmbeddedImagesInHtml(
            option.content,
            authFetch,
            `new-question-${now}-option-${index + 1}`,
          ),
        })),
      );

      const createdQuestion = await createQuestion(
        {
          serial_number: `manual-${courseCode}-${now}`,
          content: tempQuestion.content,
          is_flagged: tempQuestion.is_flagged,
          is_active: tempQuestion.is_active,
          is_verified: tempQuestion.is_verified,
          difficulty: tempQuestion.difficulty,
          subtopic: selectedSubtopicPublicId,
        },
        authFetch,
      );

      const createdOptions = await Promise.all(
        tempQuestion.options.map((option) =>
          createQuestionOption(
            createdQuestion.public_id,
            {
              content: option.content,
              is_answer: option.is_answer,
            },
            authFetch,
          ),
        ),
      );

      const fullQuestion: Question = {
        ...createdQuestion,
        options: createdOptions,
        course: course?.code || courseCode,
        answer_explanation: question.answer_explanation,
      };

      setQuestion(fullQuestion);
      setQuestionCopy(structuredClone(fullQuestion));
      router.replace(`/courses/${encodeURIComponent(courseCode)}/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create question");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPreview) {
    return (
      <QuestionPreviewPage
        useQuestion={question}
        onReturn={() => setIsPreview(false)}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background font-poppins">
      <MacFastHeader />

      <CourseBanner
        course={course}
        isLoading={isLoading}
        error={courseError || error}
        variant="question-edit"
      />

      <main className="mx-auto w-full max-w-7xl px-6 pt-8 flex-1 flex flex-col min-h-0 overflow-hidden">
        <Button
          type="button"
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
          <QuestionTab
            question={question}
            setQuestion={setQuestion}
            units={course?.units ?? []}
            selectedUnitPublicId={selectedUnitPublicId}
            selectedSubtopicPublicId={selectedSubtopicPublicId}
            onUnitChange={(unitPublicId) => {
              setSelectedUnitPublicId(unitPublicId);
              setSelectedSubtopicPublicId("");
            }}
            onSubtopicChange={(subtopicPublicId) =>
              setSelectedSubtopicPublicId(subtopicPublicId)
            }
            allowDifficultySelection
          />
          <OptionsTab question={question} setQuestion={setQuestion} />
        </Tabs>
      </main>
      <footer className="border-t-2 border-light-gray">
        <div className="flex justify-between px-6 py-4">
          <div className="inline-flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsPreview(true)}
            >
              Preview
              <Eye />
            </Button>
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="secondary"
              disabled={isSaving || !hasChanges()}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSaving || !hasChanges()}
              onClick={handleSave}
            >
              {isSaving ? "Creating..." : "Create Question"}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
