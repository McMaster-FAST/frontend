"use client";

import useSwr from "swr";
import { useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";

interface UseCourseQuestionAggregateReportOptions {
  manualCode?: string;
  pageNumber?: number;
  filters?: QuestionReportAggregateFilters;
}

export function useCourseQuestionAggregateReports({
  manualCode,
  pageNumber,
  filters
}: UseCourseQuestionAggregateReportOptions = {}) {
  const authFetch = useAuthFetch();
  const params = useParams();

  const rawCode = manualCode || (params?.courseCode as string);
  const courseCode = rawCode ? decodeURIComponent(rawCode) : null;

  const fetcher = useCallback(
    async (url: string): Promise<Paginated<QuestionReportAggregate>> => {
      const res = await authFetch(url);
      if (!res.ok) {
        const error = new Error("Failed to fetch aggregated question reports");
        (error as any).status = res.status;
        throw error;
      }
      return res.json();
    },
    [authFetch],
  );

  let endpoint = null;

  if (courseCode) {
    const baseUrl = `/api/courses/${encodeURIComponent(courseCode)}/aggregate-reports/`;
    const queryParams = new URLSearchParams();

    if (filters?.searchQuery) {
      queryParams.append("search", filters.searchQuery);
    }
    if (pageNumber) {
      queryParams.append("page", pageNumber.toString());
    }
    const queryString = queryParams.toString();
    endpoint = queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }

  const { data, error, isLoading, mutate } = useSwr<
    Paginated<QuestionReportAggregate>
  >(endpoint, fetcher, {
    keepPreviousData: true, // Keep showing old list while filtering/searching
    dedupingInterval: 10000,
    revalidateOnFocus: false,
  });

  const invariants = { error, isLoading, refetch: mutate };
  if (data) {
    return {
      questions: data.results,
      totalQuestions: data.count,
      totalPages: data.totalPages,
      nextPage: data.next,
      previousPage: data.previous,
      ...invariants,
    };
  }
  return {
    questions: [],
    totalQuestions: 0,
    totalPages: 0,
    nextPage: -1,
    previousPage: -1,
    ...invariants,
  };
}
