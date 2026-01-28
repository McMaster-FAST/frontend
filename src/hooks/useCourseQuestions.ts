"use client";

import useSWR from "swr";
import { useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";

export function useCourseQuestions(manualCode?: string) {
  const authFetch = useAuthFetch();
  const params = useParams();

  const rawCode = manualCode || (params?.courseCode as string);
  const courseCode = rawCode ? decodeURIComponent(rawCode) : null;

  const fetcher = useCallback(
    async (url: string): Promise<Question[]> => {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const res = await authFetch(url);
      if (!res.ok) {
        const error = new Error("Failed to fetch questions");
        (error as any).status = res.status;
        throw error;
      }
      return res.json();
    },
    [authFetch],
  );

  const endpoint = courseCode
    ? `/api/courses/${encodeURIComponent(courseCode)}/questions/`
    : null;

  const { data, error, isLoading, mutate } = useSWR<Question[]>(
    endpoint,
    fetcher,
  );

  return {
    questions: data || [], // Return empty array while loading/error to prevent .map crashes
    isLoading,
    error,
    refetch: mutate,
  };
}
