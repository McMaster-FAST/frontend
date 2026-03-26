"use client";

import useSWR from "swr";
import { useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";

export function useCourseXP(manualCode?: string) {
  const authFetch = useAuthFetch();
  const params = useParams();

  const rawCode = manualCode || (params?.courseCode as string);
  const courseCode = rawCode ? decodeURIComponent(rawCode) : null;

  const fetcher = useCallback(
    async (url: string): Promise<CourseXP> => {
      const res = await authFetch(url);
      if (!res.ok) {
        const error = new Error("Failed to fetch course XP");
        (error as any).status = res.status;
        throw error;
      }
      return res.json();
    },
    [authFetch],
  );

  const endpoint = courseCode
    ? `/api/courses/${encodeURIComponent(courseCode)}/xp/`
    : null;

  const { data, error, isLoading, mutate } = useSWR<CourseXP>(
    endpoint,
    fetcher,
  );

  return {
    courseXP: data,
    isLoading,
    error,
    refetch: mutate,
    courseCode,
  };
}
