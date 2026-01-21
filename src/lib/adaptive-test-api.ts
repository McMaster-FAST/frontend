import { getJson } from "@/lib/api";
import { useAuthFetch } from "@/hooks/fetch_with_auth";

const API_BASE_URL = "/api/core/adaptive-test";

export function convertToTestQuestion(data: any): TestQuestion {
  const question_data = data.question;
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
 * @param course_code
 * @param authFetch
 * @returns
 */
export async function skipQuestion(
  question_id: string,
  course_code: string,
  authFetch: ReturnType<typeof useAuthFetch>,
) {
  return authFetch(`${API_BASE_URL}/skip-question/`, {
    method: "POST",
    body: JSON.stringify({
      question_id: question_id,
      course_code: course_code,
    }),
  })
    .then(getJson)
    .then(convertToTestQuestion);
}
