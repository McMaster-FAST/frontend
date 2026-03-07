"use client";

import useSWR from "swr";
import { useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";

export function useSavedForLaters(manualCode?: string) {
  const authFetch = useAuthFetch();
  const params = useParams();

  const rawCode = manualCode || (params?.courseCode as string);
  const courseCode = rawCode ? decodeURIComponent(rawCode) : null;

  const fetcher = useCallback(
    async (url: string): Promise<SavedForLater[]> => {
      const res = await authFetch(url);
      if (!res.ok) {
        const error = new Error("Failed to fetch saved for laters");
        (error as any).status = res.status;
        throw error;
      }
      return res.json();
    },
    [authFetch],
  );

  const endpoint = courseCode
    ? `/api/core/saved-for-later/${encodeURIComponent(courseCode)}/`
    : null;

  const { data, error, isLoading, mutate } = useSWR<SavedForLater[]>(
    endpoint,
    fetcher,
  );

  return {
    savedForLaters: data,
    isLoading,
    error,
    setSavedForLaters: mutate,
  };
}
