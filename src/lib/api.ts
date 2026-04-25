import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import debounce from "lodash/debounce";
import { auth } from "@/auth";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getJson(response: Response) {
  let json;

  try {
    json = await response.json();
  } catch {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  if (!response.ok) {
    const detail = json?.detail;
    const detailStr = Array.isArray(detail)
      ? detail.map(String).join(" ")
      : typeof detail === "string"
        ? detail
        : undefined;
    throw new Error(
      detailStr || json?.error || json?.message || "Error fetching data",
    );
  }

  return json;
}

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
) {
  const session = await auth();
  const token = session?.id_token;

  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Inject Authorization if we have a token
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
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

export async function getAllQuestions() {
  const response = await fetch(`${API_BASE_URL}/api/core/questions/`);

  return getJson(response);
}

export async function updateSelWindowUpperBound(
  subtopic_id: string,
  authFetch: typeof fetchWithAuth,
) {
  const response = await authFetch(
    `/api/test-sessions/${subtopic_id}/update-sel-window/upper-bound/`,
    {
      method: "POST",
      body: "",
    },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to update selection window upper bound: ${response.statusText}`,
    );
  }
}

export async function updateSelWindowLowerBound(
  subtopic_id: string,
  authFetch: typeof fetchWithAuth,
) {
  const response = await authFetch(
    `/api/test-sessions/${subtopic_id}/update-sel-window/lower-bound/`,
    {
      method: "POST",
      body: "",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to update selection window lower bound: ${response.statusText}`,
    );
  }
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

  return getJson(response) as Promise<Question>;
}

export async function updateQuestion(
  publicId: string,
  fields: Partial<Pick<Question, "content" | "answer_explanation" | "is_flagged" | "is_active" | "is_verified">>,
  authFetch: ReturnType<typeof useAuthFetch>,
): Promise<Question> {
  const response = await authFetch(
    `/api/questions/${encodeURIComponent(publicId)}/`,
    {
      method: "PATCH",
      body: JSON.stringify(fields),
    },
  );

  return getJson(response) as Promise<Question>;
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
