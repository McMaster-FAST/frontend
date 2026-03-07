import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import debounce from "lodash/debounce";
import { auth } from "@/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getJson(response: Response) {
  if (!response.ok) throw new Error(`ERROR: ${response.status}`);

  return response.json()
    .then((json) => {
      if (!response.ok) {
        throw new Error(json.detail || "Error fetching data");
      }
      return json;
    });
}

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
) {
  const session = await auth();
  const token = session?.id_token;

  console.log(token);

  // Merge default headers with custom headers
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  } as Record<string, string>;

  // Inject Authorization if we have a token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Ensure endpoint starts with a slash if user forgot it
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
    ...options,
    headers,
  });

  return response;
}

export async function ping() {
  const response = await fetch(`${API_BASE_URL}/api/core/ping/`);

  return getJson(response);
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

export async function getSavedQuestions(
  courseCode: string,
  authFetch: ReturnType<typeof useAuthFetch>,
) {
  const response = await authFetch(`/api/core/saved-for-later/${courseCode}/`, {
    method: "GET",
  });

  return getJson(response);
}

export const setSavedForLaterDebounced = debounce(
  (
    courseCode: string,
    questionId: string,
    saveForLater: boolean,
    authFetch: ReturnType<typeof useAuthFetch>,
  ) => setSavedForLater(courseCode, questionId, saveForLater, authFetch),
  500,
);

export async function setSavedForLater(
  courseCode: string,
  questionId: string,
  saveForLater: boolean,
  authFetch: ReturnType<typeof useAuthFetch>,
) {
  await authFetch(`/api/core/saved-for-later/${courseCode}/`, {
    method: saveForLater ? "POST" : "DELETE",
    body: JSON.stringify({
      question_public_id: questionId,
    }),
  });
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
