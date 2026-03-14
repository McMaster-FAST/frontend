import { auth } from "@/auth";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getJson(response: Response) {
  return response
    .json()
    .catch(() => {
      throw new Error(response.status + " " + response.statusText);
    })
    .then((json) => {
      if (!response.ok) {
        throw new Error(json.message || "Error fetching data");
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

