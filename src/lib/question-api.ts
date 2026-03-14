import { QuestionReportReason } from "@/types/QuestionReportReason";
import { API_BASE_URL, fetchWithAuth, getJson } from "./api";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";

export async function reportQuestion(
  questionId: string,
  reasons: QuestionReportReason[],
  additionalDetails: string,
  contactConsent: boolean,
  authFetch: typeof fetchWithAuth,
) {
  await authFetch(
    `/api/questions/c6b5cc55-3a44-41a2-935a-d76598a704c9/reports/`,
    {
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
    },
  );
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

export async function uploadQuestions(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("group_name", "");

  const response = await fetch(`${API_BASE_URL}/api/core/upload/`, {
    method: "PUT",
    body: formData,
  });

  return getJson(response);
}

export async function getAllQuestions() {
  const response = await fetch(`${API_BASE_URL}/api/core/questions/`);

  return getJson(response);
}
