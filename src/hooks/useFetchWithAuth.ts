"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function useAuthFetch() {
  const { data: session } = useSession();
  const token = session?.id_token;

  const authFetch = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers);

      if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const cleanEndpoint = endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;

      return fetch(`${API_BASE_URL}${cleanEndpoint}`, {
        ...options,
        headers,
      });
    },
    [token],
  );

  return authFetch;
}
