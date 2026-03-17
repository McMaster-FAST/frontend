import { auth } from "@/auth";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getJson(response: Response) {
  let json;

  try {
    json = await response.json();
  } catch {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  if (!response.ok) {
    throw new Error(json?.error || "Error fetching data");
  }

  return json;
}

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
) {
  const session = await auth();
  const token = session?.id_token;

  console.log(token);

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
    throw new Error(`Failed to update selection window upper bound: ${response.statusText}`);
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
    throw new Error(`Failed to update selection window lower bound: ${response.statusText}`);
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
