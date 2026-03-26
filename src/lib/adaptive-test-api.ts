import { getJson } from "@/lib/api";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import {
  ContinueAction,
  SuggestedAction,
} from "@/types/actions/ContinueAction";

const API_BASE_URL = "/api/core/adaptive-test";

function convertToContinueAction(action: string): ContinueAction | undefined {
  if (Object.keys(ContinueAction).includes(action)) {
    return ContinueAction[action as keyof typeof ContinueAction];
  }
  return undefined;
}

function convertToContinueActions(actions: string[]): ContinueAction[] {
  if (!actions) return [];
  return actions
    .map((action) => convertToContinueAction(action))
    .filter((action): action is ContinueAction => action !== undefined);
}

function convertToSuggestedAction(action: string): SuggestedAction | undefined {
  if (Object.keys(SuggestedAction).includes(action)) {
    return SuggestedAction[action as keyof typeof SuggestedAction];
  }
  return undefined;
}

function convertToSuggestedActions(actions: string[]): SuggestedAction[] {
  if (!actions) return [];
  return actions
    .map((action) => convertToSuggestedAction(action))
    .filter((action): action is SuggestedAction => action !== undefined);
}

function convertToTestQuestion(data: any): {
  question: TestQuestion;
  continue_actions: ContinueAction[];
  suggested_actions: SuggestedAction[];
} {
  const question_data = data.question;
  if (!question_data) {
    return {
      question: {} as TestQuestion,
      continue_actions: convertToContinueActions(data.continue_actions),
      suggested_actions: convertToSuggestedActions(data.suggested_actions),
    };
  }
  const options = question_data.options.map(
    (option: any) =>
      ({
        public_id: option.public_id,
        content: option.content,
      }) as TestQuestionOption,
  );

  return {
    question: {
      ...question_data,
      options: options,
    } as TestQuestion,
    continue_actions: convertToContinueActions(data.continue_actions),
    suggested_actions: convertToSuggestedActions(data.suggested_actions),
  };
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
  subtopic_id: string,
  authFetch: ReturnType<typeof useAuthFetch>,
) {
  const response = await authFetch(
    `/api/adaptive-test/question-metrics/${subtopic_id}/reset/`,
    {
      method: "POST",
    },
  );
}
