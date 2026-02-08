"use client";

import useSWR from "swr";
import { useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";

export function useEnrolments(manualCode?: string) {
  const authFetch = useAuthFetch();
  const params = useParams();

  const rawCode = manualCode || (params?.courseCode as string);
  const courseCode = rawCode ? decodeURIComponent(rawCode) : null;

  const fetcher = useCallback(
    async (url: string): Promise<Enrolment[]> => {
      const res = await authFetch(url);
      if (!res.ok) {
        const error = new Error("Failed to fetch enrolments");
        (error as any).status = res.status;
        throw error;
      }
      return res.json();
    },
    [authFetch],
  );

  const endpoint = courseCode
    ? `/api/courses/${encodeURIComponent(courseCode)}/enrolments/`
    : null;

  const { data, error, isLoading, mutate } = useSWR<Enrolment[]>(
    endpoint,
    fetcher,
  );

  return {
    enrolments: data, // Just the array directly
    isLoading,
    error,
    mutate,
  };
}
