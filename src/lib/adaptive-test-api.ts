import { getJson } from "@/lib/api";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";

const API_BASE_URL = "/api/core/adaptive-test";

export function convertToTestQuestion(data: any): TestQuestion {
  const question_data = data.question;
  if (!question_data) {
    return {} as TestQuestion;
  }
  const options = question_data.options.map(
    (option: any) =>
      ({
        public_id: option.public_id,
        content: option.content,
      }) as TestQuestionOption,
  );

  return {
    public_id: question_data.public_id,
    content: question_data.content,
    options: options,
  } as TestQuestion;
}

export async function getNextQuestion(
  courseCode: string,
  unitName: string,
  subtopicName: string,
  authFetch: ReturnType<typeof useAuthFetch>,
) {
  return authFetch(`${API_BASE_URL}/next-question/`, {
    method: "POST",
    body: JSON.stringify({
      course_code: courseCode,
      unit_name: unitName,
      subtopic_name: subtopicName,
    }),
  })
    .then(getJson)
    .then(convertToTestQuestion);
}

export async function submitAnswer(
  selected_option_id: string,
  question_id: string,
  authFetch: ReturnType<typeof useAuthFetch>,
) {
  return authFetch(`${API_BASE_URL}/submit-answer/`, {
    method: "POST",
    body: JSON.stringify({
      question_id: question_id,
      selected_option_id: selected_option_id,
    }),
  }).then(getJson);
}

/**
 * Skips a question and returns the next question.
 * Based on the current subtopic stored in the user's adaptive test session.
 * @param question_id
 * @param authFetch
 * @returns
 */
export async function skipQuestion(
  question_id: string,
  authFetch: ReturnType<typeof useAuthFetch>,
) {
  return authFetch(`${API_BASE_URL}/skip-question/`, {
    method: "POST",
    body: JSON.stringify({
      question_id: question_id,
    }),
  })
    .then(getJson)
    .then(convertToTestQuestion);
}

export async function resetSkippedQuestions(
  authFetch: ReturnType<typeof useAuthFetch>,
) {
  return authFetch("/api/core/test-sessions/active/", {
    method: "PATCH",
    body: JSON.stringify({ skipped_questions: [] }),
  }).then(getJson);
}

export async function getActiveTestSession(
  authFetch: ReturnType<typeof useAuthFetch>,
) {
  return authFetch(`/api/core/test-sessions/active/`, {
    method: "GET",
  }).then(getJson);
}
