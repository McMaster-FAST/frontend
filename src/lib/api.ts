import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { useAuthFetch } from "@/hooks/fetch_with_auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getJson(response: Response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getLastStudiedSubtopicForCourse(
  course_code: string,
  authFetch: ReturnType<typeof useAuthFetch>
) {
  const response = await authFetch(
    `/api/test-sessions/${course_code}`
  );
  return getJson(response);
}

export async function getUserCourses(
  authFetch: ReturnType<typeof useAuthFetch>
): Promise<Course[]> {
  return authFetch(`/api/courses/`)
    .then(getJson)
    .then((data) => {
      return data as Course[];
    });
}

export async function getNextQuestion(
  courseCode: string,
  unitName: string,
  subtopicName: string,
  authFetch: ReturnType<typeof useAuthFetch>
) {
  return authFetch(`/api/core/adaptive-test/next-question`, {
    method: "POST",
    body: JSON.stringify({
      course_code: courseCode,
      unit_name: unitName,
      subtopic_name: subtopicName,
    }),
  })
    .then(getJson)
    .then((response) => {
      const question_data = response.question;
      const options = question_data.options.map((option: any) => {
        return {
          public_id: option.public_id,
          content: option.content,
        } as TestQuestionOption;
      });

      return {
        public_id: question_data.public_id,
        content: question_data.content,
        options: options,
      } as TestQuestion;
    });
}

export async function submitAnswer(
  selected_option_id: string,
  question_id: string,
  authFetch: ReturnType<typeof useAuthFetch>
) {
  const response = await authFetch(`/api/core/adaptive-test/submit`, {
    method: "POST",
    body: JSON.stringify({
      question_id: question_id,
      selected_option_id: selected_option_id,
    }),
  });

  return response;
}

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

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

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
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
