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

// TODO: Update endpoint URL when backend is ready
export async function uploadQuestions(file: File) {
  // TODO: Remove this block when backend is ready
  if (USE_MOCK) {
    console.log("Mock upload:", file.name);
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: "Mock upload successful" };
  }

  // TODO Uncomment when backend is ready
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/questions/upload/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// TODO: Update endpoint URL when backend is ready
export async function getAllQuestions() {
  // TODO: Remove this block when backend is ready
  if (USE_MOCK) {
    console.log("Mock getAllQuestions");
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Return mock questions similar to test-questions.json
    return [
      {
        id: "q1",
        title: "What is the time complexity of binary search?",
        difficulty: 50,
        content: "Explain the time complexity of binary search algorithm and why it is efficient.",
      },
      {
        id: "q2",
        title: "Explain the difference between stack and queue",
        difficulty: 30,
        content: "What are the main differences between stack and queue data structures?",
      },
      {
        id: "q3",
        title: "What is recursion?",
        difficulty: 40,
        content: "Define recursion and provide an example of a recursive function.",
      },
      {
        id: "q4",
        title: "Explain object-oriented programming",
        difficulty: 60,
        content: "What are the four pillars of object-oriented programming?",
      },
      {
        id: "q5",
        title: "What is a database index?",
        difficulty: 70,
        content: "Explain what a database index is and when to use it.",
      }
    ];
  }

  // TODO: Uncomment when backend is ready
  const response = await fetch(`${API_BASE_URL}/api/questions/all/`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

