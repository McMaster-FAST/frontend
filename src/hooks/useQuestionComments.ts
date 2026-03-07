"use client";

import useSWR from "swr";
import { useCallback } from "react";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";

export function useQuestionComments(questionId: string | null) {
  const authFetch = useAuthFetch();

  const fetcher = useCallback(
    async (url: string): Promise<QuestionComment[]> => {
      const res = await authFetch(url);
      if (!res.ok) throw new Error("Failed to fetch comments");
      return res.json();
    },
    [authFetch],
  );

  const { data, error, isLoading, mutate } = useSWR<QuestionComment[]>(
    questionId ? `/api/questions/${questionId}/comments/` : null,
    fetcher,
  );

  const addComment = async (text: string) => {
    if (!questionId) return;
    const res = await authFetch(`/api/questions/${questionId}/comments/`, {
      method: "POST",
      body: JSON.stringify({ comment_text: text }),
    });
    if (res.ok) mutate();
  };

  const replyToComment = async (parentPublicId: string, text: string) => {
    const res = await authFetch(`/api/comments/${parentPublicId}/reply/`, {
      method: "POST",
      body: JSON.stringify({ comment_text: text }),
    });
    if (res.ok) mutate();
  };

  return {
    comments: data || [],
    isLoading,
    error,
    addComment,
    replyToComment,
    refetch: mutate,
  };
}
