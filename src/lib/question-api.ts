import { QuestionReportReason } from "@/types/QuestionReportReason";
import { API_BASE_URL, fetchWithAuth, getJson } from "./api";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { debounce, get } from "lodash";
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
export async function pollForParsingUpdates(
  courseCode: string,
  uploadResultId: string,
  authFetch: ReturnType<typeof useAuthFetch>,
  callback: (uploadResult: UploadProgress) => void,
  interval: number = 1000,
  maxFailures: number = 3,
  maxChecks: number = 10
) {
  // If we fail `maxFailures` times in a row stop polling
  // We reset the failure count if a call succeeds
  // If we haven't heard success after `maxChecks` stop polling anyway
  let failedFetchCount = 0;
  let sucessfullChecks = 0;

  const timerId = setInterval(() => {
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
        if (failedFetchCount >= maxFailures || sucessfullChecks >= maxChecks) {
          clearInterval(timerId);
        }
      });
  }, interval);
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
