const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Set to true to use mock data for testing without backend
const USE_MOCK = true;

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

