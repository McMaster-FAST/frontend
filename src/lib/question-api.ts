import { QuestionReportReason } from "@/types/QuestionReportReason";
import { API_BASE_URL, fetchWithAuth, getJson } from "./api";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { UploadCompletedStatus, UploadProgress } from "@/types/UploadResult";

export async function reportQuestion(
  questionId: string,
  reasons: QuestionReportReason[],
  additionalDetails: string,
  contactConsent: boolean,
  authFetch: typeof fetchWithAuth,
) {
  await authFetch(`/api/questions/${questionId}/reports/`, {
    method: "POST",
    body: JSON.stringify({
      report_reasons: reasons.map(
        (reason: QuestionReportReason) =>
          QuestionReportReason[
            reason.toString() as keyof typeof QuestionReportReason
          ],
      ),
      additional_details: additionalDetails,
      contact_consent: contactConsent,
    }),
  });
}

export async function getAggregateReports(
  courseCode: string,
  authFetch: typeof fetchWithAuth,
) {
  const response = await authFetch(
    `/api/courses/${courseCode}/aggregate-reports/`,
    {
      method: "GET",
    },
  );
  return getJson(response);
}

export async function getQuestionReports(
  questionId: string,
  authFetch: typeof fetchWithAuth,
) {
  const response = await authFetch(`/api/questions/${questionId}/reports/`, {
    method: "GET",
  });
  return getJson(response);
}

/**
 * Fetch a single question by public_id for the edit page.
 * GET /api/core/questions/<public_id>/
 */
export async function getQuestionByPublicId(
  publicId: string,
  authFetch: ReturnType<typeof useAuthFetch>,
): Promise<Question> {
  const response = await authFetch(
    `/api/questions/${encodeURIComponent(publicId)}/`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch question: ${response.status}`);
  }

  const data = await response.json();
  return data as Question;
}

export async function deleteQuestion(
  publicId: string,
  authFetch: ReturnType<typeof useAuthFetch>,
): Promise<void> {
  const response = await authFetch(
    `/api/questions/${encodeURIComponent(publicId)}/`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to delete question: ${response.status}`);
  }
}

export async function createQuestion(
  payload: {
    serial_number: string;
    content: string;
    is_flagged: boolean;
    is_active: boolean;
    is_verified: boolean;
    difficulty?: number;
    subtopic?: string;
  },
  authFetch: ReturnType<typeof useAuthFetch>,
): Promise<Question> {
  const response = await authFetch("/api/questions/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create question: ${response.status}`);
  }

  const data = await response.json();
  return data as Question;
}

export async function createQuestionOption(
  questionPublicId: string,
  payload: {
    content: string;
    explanation?: string;
    is_answer: boolean;
  },
  authFetch: ReturnType<typeof useAuthFetch>,
): Promise<QuestionOption> {
  const response = await authFetch(
    `/api/questions/${encodeURIComponent(questionPublicId)}/options/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to create question option: ${response.status}`);
  }

  const data = await response.json();
  return data as QuestionOption;
}

export async function updateQuestionOption(
  questionPublicId: string,
  optionPublicId: string,
  payload: {
    content?: string;
    explanation?: string;
    is_answer?: boolean;
  },
  authFetch: ReturnType<typeof useAuthFetch>,
): Promise<QuestionOption> {
  const response = await authFetch(
    `/api/questions/${encodeURIComponent(
      questionPublicId,
    )}/options/${encodeURIComponent(optionPublicId)}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return getJson(response) as Promise<QuestionOption>;
}

export async function deleteQuestionOption(
  questionPublicId: string,
  optionPublicId: string,
  authFetch: ReturnType<typeof useAuthFetch>,
): Promise<void> {
  const response = await authFetch(
    `/api/questions/${encodeURIComponent(
      questionPublicId,
    )}/options/${encodeURIComponent(optionPublicId)}/`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to delete question option: ${response.status}`);
  }
}

export async function getCourseUnits(
  courseCode: string,
  authFetch: ReturnType<typeof useAuthFetch>,
): Promise<Unit[]> {
  const response = await authFetch(
    `/api/courses/${encodeURIComponent(courseCode)}/units/`,
  );

  return getJson(response) as Promise<Unit[]>;
}

export async function getUnitSubtopics(
  unitPublicId: string,
  authFetch: ReturnType<typeof useAuthFetch>,
): Promise<Subtopic[]> {
  const response = await authFetch(
    `/api/units/${encodeURIComponent(unitPublicId)}/subtopics/`,
  );

  return getJson(response) as Promise<Subtopic[]>;
}

export async function uploadQuestionImage(
  file: File,
  authFetch: ReturnType<typeof useAuthFetch>,
): Promise<string> {
  void file;
  void authFetch;
  // TODO: Implement once backend image upload endpoint is available.
  return "";
}

interface CourseIdentifier extends Course {
  code: string;
  year: number;
  semester: string;
}

export async function uploadQuestions(
  file: File,
  course: CourseIdentifier,
  authFetch: typeof fetchWithAuth,
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("create_required", "true");
  formData.append("course_code", course.code);
  formData.append("course_year", course.year.toString());
  formData.append("course_semester", course.semester.toString());

  const response = await authFetch(`/api/core/upload/`, {
    method: "PUT",
    body: formData,
  });
  return getJson(response);
}

export async function getAllQuestions() {
  const response = await fetch(`${API_BASE_URL}/api/core/questions/`);

  return getJson(response);
}

export async function getSavedQuestions(
  courseCode: string,
  authFetch: ReturnType<typeof useAuthFetch>,
) {
  const response = await authFetch(`/api/core/saved-for-later/${courseCode}/`, {
    method: "GET",
  });

  return getJson(response);
}

export async function setSavedForLater(
  courseCode: string,
  questionId: string,
  saveForLater: boolean,
  authFetch: ReturnType<typeof useAuthFetch>,
) {
  const response = await authFetch(`/api/core/saved-for-later/${courseCode}/`, {
    method: saveForLater ? "POST" : "DELETE",
    body: JSON.stringify({
      question_public_id: questionId,
    }),
  });
  if (!response.ok) {
    throw new Error(
      `Failed to ${saveForLater ? "save" : "unsave"} question for later: ${
        response.statusText
      }`,
    );
  }
}

export async function getQuestionById(
  courseCode: string,
  questionId: string,
  authFetch: ReturnType<typeof useAuthFetch>,
) {
  const response = await authFetch(
    `/api/courses/${courseCode}/questions/${questionId}/`,
    {
      method: "GET",
    },
  );

  return getJson(response);
}

/**
 *
 * @param courseCode The course the questions were uploaded to
 * @param authFetch
 * @param uploadResultId The id returned on question upload
 * @param interval How often to poll for updates
 */
export function pollForParsingUpdates(
  courseCode: string,
  uploadResultId: string,
  authFetch: ReturnType<typeof useAuthFetch>,
  callback: (uploadResult: UploadProgress) => void,
  interval: number = 5000,
  maxFailures: number = 3,
  maxChecks: number = 20,
) {
  // If we fail `maxFailures` times in a row, stop polling.
  // If we still only get RUNNING after `maxChecks`, stop polling anyway.
  let failedFetchCount = 0;
  let checks = 0;

  const timerId = setInterval(() => {
    checks++;
    fetchUploadProgress(courseCode, authFetch, uploadResultId)
      .then((uploadResult) => {
        if (
          Object.values(UploadCompletedStatus).includes(
            uploadResult.result as UploadCompletedStatus,
          )
        ) {
          clearInterval(timerId);
        }
        callback(uploadResult);
        failedFetchCount = 0;
      })
      .catch((err) => {
        console.log(err);
        failedFetchCount++;
      })
      .finally(() => {
        if (failedFetchCount >= maxFailures || checks >= maxChecks) {
          clearInterval(timerId);
        }
      });
  }, interval);

  return () => clearInterval(timerId);
}

async function fetchUploadProgress(
  courseCode: string,
  authFetch: ReturnType<typeof useAuthFetch>,
  uploadResultId: string,
) {
  const response = await authFetch(
    `/api/courses/${courseCode}/upload-result/${uploadResultId}/`,
    {
      method: "GET",
    },
  );
  return getJson(response) as Promise<UploadProgress>;
}
