"use client";

import useSWR from "swr";
import { useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";

export function useCourseData(manualCode?: string) {
  const authFetch = useAuthFetch();
  const params = useParams();

  const rawCode = manualCode || (params?.courseCode as string);

  // "EARTHSC%202GG3" -> "EARTHSC 2GG3"
  const courseCode = rawCode ? decodeURIComponent(rawCode) : null;

  const fetcher = useCallback(
    async (url: string): Promise<Course> => {
      const res = await authFetch(url);
      if (!res.ok) {
        const error = new Error("Failed to fetch course");
        (error as any).status = res.status;
        throw error;
      }
      return res.json();
    },
    [authFetch],
  );

  const endpoint = courseCode
    ? `/api/courses/${encodeURIComponent(courseCode)}/`
    : null;

  const { data, error, isLoading, mutate } = useSWR<Course>(endpoint, fetcher);

  return {
    course: data,
    isLoading,
    error,
    refetch: mutate,
    courseCode,
  };
}
