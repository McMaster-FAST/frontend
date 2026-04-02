"use client";

import useSwr from "swr";
import { useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";

interface UseCourseQuestionsOptions {
  manualCode?: string;
  searchQuery?: string;
  filters?: QuestionFilters;
  pageNumber?: number;
}

export function useCourseQuestions({
  manualCode,
  searchQuery = "",
  filters = {},
  pageNumber,
}: UseCourseQuestionsOptions = {}) {
  const authFetch = useAuthFetch();
  const params = useParams();

  const rawCode = manualCode || (params?.courseCode as string);
  const courseCode = rawCode ? decodeURIComponent(rawCode) : null;

  const fetcher = useCallback(
    async (url: string): Promise<Paginated<Question>> => {
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

    if (filters.min_selection_frequency !== undefined) {
      queryParams.append("selection_frequency__gte", filters.min_selection_frequency.toString());
    }

    if (filters.max_selection_frequency !== undefined) {
      queryParams.append("selection_frequency__lte", filters.max_selection_frequency.toString());
    }

    if (filters.subtopic_name) {
      queryParams.append("subtopic__name__icontains", filters.subtopic_name);
    }

    if (pageNumber) {
      queryParams.append("page", pageNumber.toString());
    }
    const queryString = queryParams.toString();
    endpoint = queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }
  
  const { data, error, isLoading, mutate } = useSwr<Paginated<Question>>(
    endpoint,
    fetcher,
    {
      keepPreviousData: true, // Keep showing old list while filtering/searching
      dedupingInterval: 10000,
      revalidateOnFocus: false,
    },
  );

  const invariants = {error, isLoading, refetch: mutate};
  if (data) {
    return {
      questions: data.results,
      totalQuestions: data.count,
      totalPages: data.totalPages,
      nextPage: data.next,
      previousPage: data.previous,
      ...invariants
    };
  }
  return {
    questions: [],
    totalQuestions: 0,
    totalPages: 0,
    nextPage: -1,
    previousPage: -1,
    ...invariants
  };
}
