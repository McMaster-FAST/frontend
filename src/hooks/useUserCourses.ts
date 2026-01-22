"use client";

import useSWR from "swr";
import { useCallback } from "react";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";

export function useUserCourses() {
  const authFetch = useAuthFetch();

  const fetcher = useCallback(
    async (url: string): Promise<Course[]> => {
      const res = await authFetch(url);

      if (!res.ok) {
        const error = new Error("An error occurred while fetching the data.");

        (error as any).status = res.status;

        try {
          (error as any).info = await res.json();
        } catch {
          (error as any).info = null;
        }

        throw error;
      }

      return res.json();
    },
    [authFetch],
  );

  const { data, error, isLoading, mutate } = useSWR<Course[]>(
    "/api/courses/",
    fetcher,
  );

  return {
    courses: data || [],
    isLoading,
    error,
    refetch: mutate,
  };
}
