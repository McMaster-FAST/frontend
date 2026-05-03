"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MacFastHeader } from "@/components/macfast/macfast-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, List, MessageSquare, NotebookPen } from "lucide-react";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { QuestionPage } from "@/components/macfast/question-page";
import { isEqual } from "lodash";
import ErrorMessage from "@/components/macfast/error-message";
import {
  createQuestionOption,
  deleteQuestionOption as deleteQuestionOptionApi,
  getCourseUnits,
  getQuestionByPublicId,
  getUnitSubtopics,
  updateQuestionOption,
  uploadQuestionImage,
} from "@/lib/question-api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourseData } from "@/hooks/useCourseData";
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

  const courseCode = decodeURIComponent(params.courseCode as string);
  const questionId = decodeURIComponent(params.questionId as string);
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionCopy, setQuestionCopy] = useState<Question | null>(null);
  const [isQuestionLoading, setIsQuestionLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [areCommentsOpen, setAreCommentsOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnitPublicId, setSelectedUnitPublicId] = useState("");
  const [selectedSubtopicPublicId, setSelectedSubtopicPublicId] = useState("");
  const [originalSubtopicPublicId, setOriginalSubtopicPublicId] = useState("");
  const [subtopicsByUnit, setSubtopicsByUnit] = useState<
    Record<string, Subtopic[]>
  >({});

  const hasChanges = () => {
    return (
      !isEqual(question, questionCopy) ||
      selectedSubtopicPublicId !== originalSubtopicPublicId
    );
  };

  const handleCancel = () => {
    setQuestion(questionCopy);
    router.back();
  };

  const handleSave = async () => {
    setError(null);
    if (!question) {
      setError("Question data is missing");
      return;
    }
    if (!question.content?.trim()) {
      setError("Question content is required.");
      return;
    }
    if (!question.options || question.options.length < 2) {
      setError("Please provide at least 2 options.");
      return;
    }
    if (question.options.some((option) => !option.content?.trim())) {
      setError("All options must have content.");
      return;
    }
    if (!question.options.some((option) => option.is_answer)) {
      setError("Please mark one option as the correct answer.");
      return;
    }
    const difficultyNumber = Number(question.difficulty);
    if (!Number.isFinite(difficultyNumber)) {
      setError("Difficulty must be a valid number.");
      return;
    }
    if (difficultyNumber < -3 || difficultyNumber > 3) {
      setError("Difficulty must be between -3 and 3.");
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
        explanation: await uploadEmbeddedImagesInHtml(
          option.explanation ?? "",
          authFetch,
          `${questionWithUploadedImages.public_id}-option-${index + 1}-explanation`,
        ),
      })),
    );
    questionWithUploadedImages.answer_explanation =
      await uploadEmbeddedImagesInHtml(
        questionWithUploadedImages.answer_explanation ?? "",
        authFetch,
        `${questionWithUploadedImages.public_id}-answer-explanation`,
      );

    setIsSaving(true);
    try {
      await updateQuestion(
        questionWithUploadedImages.public_id,
        {
          content: questionWithUploadedImages.content,
          answer_explanation: questionWithUploadedImages.answer_explanation,
          is_flagged: questionWithUploadedImages.is_flagged,
          is_active: questionWithUploadedImages.is_active,
          is_verified: questionWithUploadedImages.is_verified,
          difficulty: difficultyNumber,
          ...(selectedSubtopicPublicId
            ? { subtopic: selectedSubtopicPublicId }
            : {}),
        },
        authFetch,
      );

      const currentOptionIds = new Set(
        questionWithUploadedImages.options
          .map((option) => option.public_id)
          .filter(Boolean),
      );
      const deletedOptions =
        questionCopy?.options.filter(
          (option) =>
            option.public_id && !currentOptionIds.has(option.public_id),
        ) ?? [];

      await Promise.all(
        deletedOptions.map((option) =>
          deleteQuestionOptionApi(
            questionWithUploadedImages.public_id,
            option.public_id,
            authFetch,
          ),
        ),
      );

      const savedOptions = await Promise.all(
        questionWithUploadedImages.options.map((option) => {
          const payload = {
            content: option.content,
            explanation: option.explanation ?? "",
            is_answer: option.is_answer,
          };

          if (option.public_id) {
            return updateQuestionOption(
              questionWithUploadedImages.public_id,
              option.public_id,
              payload,
              authFetch,
            );
          }

          return createQuestionOption(
            questionWithUploadedImages.public_id,
            payload,
            authFetch,
          );
        }),
      );

      const refreshedQuestion = await getQuestionByPublicId(
        questionWithUploadedImages.public_id,
        authFetch,
      );
      const explanationByOptionId = new Map(
        savedOptions.map((savedOption, index) => [
          savedOption.public_id,
          questionWithUploadedImages.options[index]?.explanation,
        ]),
      );
      const saved = {
        ...refreshedQuestion,
        options: (refreshedQuestion.options?.length
          ? refreshedQuestion.options
          : savedOptions
        ).map((option) => ({
          ...option,
          explanation: explanationByOptionId.get(option.public_id),
        })),
      };

      setQuestion(saved);
      setQuestionCopy(structuredClone(saved));
      setOriginalSubtopicPublicId(selectedSubtopicPublicId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save question");
    } finally {
      setIsSaving(false);
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
  }, [authFetch, questionId]);

  useEffect(() => {
    getCourseUnits(courseCode, authFetch)
      .then(setUnits)
      .catch((error) => {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load course units",
        );
      });
  }, [authFetch, courseCode]);

  useEffect(() => {
    if (!question || selectedUnitPublicId || units.length === 0) return;

    if (question.unit_public_id) {
      setSelectedUnitPublicId(question.unit_public_id);
      return;
    }

    const matchedUnit = units.find((unit) => {
      const unitNumber = String(unit.number);
      const questionUnit = String(question.unit ?? question.unit_name ?? "");
      return (
        unit.public_id === questionUnit ||
        unit.name === questionUnit ||
        unitNumber === questionUnit ||
        `Unit ${unitNumber}` === questionUnit
      );
    });

    if (matchedUnit) {
      setSelectedUnitPublicId(matchedUnit.public_id);
    }
  }, [question, selectedUnitPublicId, units]);

  useEffect(() => {
    if (!selectedUnitPublicId || subtopicsByUnit[selectedUnitPublicId]) return;

    getUnitSubtopics(selectedUnitPublicId, authFetch)
      .then((subtopics) => {
        setSubtopicsByUnit((prev) => ({
          ...prev,
          [selectedUnitPublicId]: subtopics,
        }));
      })
      .catch((error) => {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load unit subtopics",
        );
      });
  }, [authFetch, selectedUnitPublicId, subtopicsByUnit]);

  useEffect(() => {
    if (
      !question ||
      !selectedUnitPublicId ||
      selectedSubtopicPublicId ||
      !subtopicsByUnit[selectedUnitPublicId]
    ) {
      return;
    }

    const currentQuestionSubtopic =
      question.subtopic_public_id ?? question.subtopic_name;
    const matchedSubtopic = subtopicsByUnit[selectedUnitPublicId].find(
      (subtopic) => subtopic.name === question.subtopic_name,
    );
    const matchedSubtopicById =
      question.subtopic_public_id &&
      subtopicsByUnit[selectedUnitPublicId].find(
        (subtopic) => subtopic.public_id === question.subtopic_public_id,
      );

    const resolvedSubtopic =
      matchedSubtopicById ??
      matchedSubtopic ??
      subtopicsByUnit[selectedUnitPublicId].find(
        (subtopic) => subtopic.public_id === currentQuestionSubtopic,
      );

    if (resolvedSubtopic) {
      setSelectedSubtopicPublicId(resolvedSubtopic.public_id);
      setOriginalSubtopicPublicId(resolvedSubtopic.public_id);
    }
  }, [
    question,
    selectedSubtopicPublicId,
    selectedUnitPublicId,
    subtopicsByUnit,
  ]);

  const unitsWithLoadedSubtopics = units.map((unit) => ({
    ...unit,
    subtopics: subtopicsByUnit[unit.public_id] ?? unit.subtopics ?? [],
  }));

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
        error={courseError || error}
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
          <QuestionTab
            question={question}
            setQuestion={setQuestion}
            units={unitsWithLoadedSubtopics}
            selectedUnitPublicId={selectedUnitPublicId}
            selectedSubtopicPublicId={selectedSubtopicPublicId}
            onUnitChange={(unitPublicId) => {
              const selectedUnit = units.find(
                (unit) => unit.public_id === unitPublicId,
              );
              setSelectedUnitPublicId(unitPublicId);
              setSelectedSubtopicPublicId("");
              setQuestion((prev) =>
                prev
                  ? {
                      ...prev,
                      unit: selectedUnit?.name ?? "",
                      subtopic_name: "",
                    }
                  : prev,
              );
            }}
            onSubtopicChange={(subtopicPublicId) => {
              const selectedSubtopic = subtopicsByUnit[
                selectedUnitPublicId
              ]?.find((subtopic) => subtopic.public_id === subtopicPublicId);
              setSelectedSubtopicPublicId(subtopicPublicId);
              setQuestion((prev) =>
                prev
                  ? {
                      ...prev,
                      subtopic_name: selectedSubtopic?.name ?? "",
                    }
                  : prev,
              );
            }}
            allowDifficultySelection
          />
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
              disabled={isSaving || !hasChanges()}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button disabled={isSaving || !hasChanges()} onClick={handleSave}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
