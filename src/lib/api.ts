const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getAllQuestions() {
  const response = await fetch(`${API_BASE_URL}/api/core/questions/`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Submit answer to adaptive test
export async function submitAnswer(
  userToken: string,
  questionSerialNumber: string,
  selectedAnswer: number
): Promise<{ correct: boolean }> {
  const response = await fetch(`${API_BASE_URL}/api/core/adaptive-test/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_token: userToken,
      question_serial_number: questionSerialNumber,
      selected_answer: selectedAnswer,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Get next question from adaptive test
export async function getNextQuestion(
  userToken: string,
  groupName: string
): Promise<{
  question: {
    serial_number: string;
    content: string;
    images: string[];
    options: {
      id: number;
      content: string;
      images: string[];
    }[];
  };
}> {
  const response = await fetch(`${API_BASE_URL}/api/core/adaptive-test/next-question`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_token: userToken,
      group_name: groupName
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
