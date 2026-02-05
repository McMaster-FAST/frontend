"use client";

import useSWR from "swr";
import { useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";

interface UseCourseQuestionsOptions {
  manualCode?: string;
  searchQuery?: string;
  filters?: QuestionFilters;
}

export function useCourseQuestions({
  manualCode,
  searchQuery = "",
  filters = {},
}: UseCourseQuestionsOptions = {}) {
  const authFetch = useAuthFetch();
  const params = useParams();

  const rawCode = manualCode || (params?.courseCode as string);
  const courseCode = rawCode ? decodeURIComponent(rawCode) : null;

  const fetcher = useCallback(
    async (url: string): Promise<Question[]> => {
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

  let endpoint = null;

  if (courseCode) {
    const baseUrl = `/api/courses/${encodeURIComponent(courseCode)}/questions/`;
    const queryParams = new URLSearchParams();

    if (searchQuery) {
      queryParams.append("search", searchQuery);
    }

    if (filters.is_verified !== undefined && filters.is_verified !== null) {
      queryParams.append("is_verified", filters.is_verified.toString());
    }

    if (filters.is_flagged !== undefined && filters.is_flagged !== null) {
      queryParams.append("is_flagged", filters.is_flagged.toString());
    }

    if (filters.min_difficulty !== undefined) {
      queryParams.append("difficulty__gte", filters.min_difficulty.toString());
    }

    if (filters.max_difficulty !== undefined) {
      queryParams.append("difficulty__lte", filters.max_difficulty.toString());
    }

    if (filters.subtopic_name) {
      queryParams.append("subtopic__name__icontains", filters.subtopic_name);
    }

    const queryString = queryParams.toString();
    endpoint = queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }

  const { data, error, isLoading, mutate } = useSWR<Question[]>(
    endpoint,
    fetcher,
    {
      keepPreviousData: true, // Keep showing old list while filtering/searching
      dedupingInterval: 10000,
      revalidateOnFocus: false,
    },
  );

  return {
    questions: data || [],
    isLoading,
    error,
    refetch: mutate,
  };
}
