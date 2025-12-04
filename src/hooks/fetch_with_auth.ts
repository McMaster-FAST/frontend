"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function useAuthFetch() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const authFetch = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      } as Record<string, string>;

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const cleanEndpoint = endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;

      return fetch(`${API_BASE_URL}${cleanEndpoint}`, {
        ...options,
        headers,
      });
    },
    [token]
  );

  return authFetch;
}
