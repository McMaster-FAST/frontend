"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";

interface CourseRoleResponse {
  course_code: string;
  is_instructor: boolean;
  is_ta: boolean;
  is_instructor_or_ta: boolean;
}

export function useCourseRole(manualCode?: string) {
  const authFetch = useAuthFetch();
  const params = useParams();

  const rawCode = manualCode || (params?.courseCode as string);
  const courseCode = rawCode ? decodeURIComponent(rawCode) : null;

  const fetcher = useCallback(
    async (url: string): Promise<CourseRoleResponse> => {
      const res = await authFetch(url);
      if (!res.ok) {
        const error = new Error("Failed to fetch course role");
        (error as any).status = res.status;
        throw error;
      }
      return res.json();
    },
    [authFetch],
  );

  const endpoint = courseCode
    ? `/api/core/course-role/${encodeURIComponent(courseCode)}/`
    : null;

  const { data, error, isLoading, mutate } = useSWR<CourseRoleResponse>(
    endpoint,
    fetcher,
  );

  return {
    role: data,
    isLoading,
    error,
    refetch: mutate,
    canAccessInstructorDashboard: !!data?.is_instructor_or_ta,
  };
}
