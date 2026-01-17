"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useAuthFetch } from "@/hooks/fetch_with_auth";
import { getUserCourses } from "@/lib/api";

// Simple in-memory cache shared across all hook consumers
let coursesCache: Course[] | null = null;
let inFlight: Promise<Course[]> | null = null;
let lastError: Error | null = null;

export type UseUserCoursesResult = {
	courses: Course[] | null;
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
};

export function useUserCourses(): UseUserCoursesResult {
	const authFetch = useAuthFetch();
	const { data: session } = useSession();

	// Seed local state from the shared cache or session so initial renders are fast
	const sessionCourses = session?.user?.courses ?? null;
	const initialCourses = coursesCache ?? sessionCourses;
	const [courses, setCourses] = useState<Course[] | null>(initialCourses);
	const [isLoading, setIsLoading] = useState<boolean>(!initialCourses && !lastError);
	const [error, setError] = useState<Error | null>(lastError);

	const load = useCallback(async () => {
		if (coursesCache) {
			setCourses(coursesCache);
			setIsLoading(false);
			setError(null);
			return;
		}

		setIsLoading(true);

		// Dedupe concurrent requests across components
		if (!inFlight) {
			inFlight = getUserCourses(authFetch);
		}

		try {
			const data = await inFlight;
			coursesCache = data;
			lastError = null;
			setCourses(data);
			setError(null);
		} catch (e) {
			const err = e instanceof Error ? e : new Error("Failed to load courses");
			lastError = err;
			setError(err);
		} finally {
			setIsLoading(false);
			inFlight = null;
		}
	}, [authFetch]);

	const refetch = useCallback(async () => {
		// Force refresh: clear cache and fetch again
		coursesCache = null;
		lastError = null;
		await load();
	}, [load]);

	// Load on mount or when the auth token changes (authFetch changes with token)
	useEffect(() => {
		// If session already contains courses, use them and populate the shared cache
		if (sessionCourses && !coursesCache) {
			coursesCache = sessionCourses;
			setCourses(sessionCourses);
			setIsLoading(false);
			setError(null);
			return;
		}

		// If auth changes, the cache may be stale for new user/session
		// We conservatively keep cache unless no data present.
		if (!coursesCache || lastError) {
			load();
		} else {
			// Ensure local state reflects the shared cache when auth changes
			setCourses(coursesCache);
			setIsLoading(false);
			setError(null);
		}
	}, [load, sessionCourses]);

	return useMemo(
		() => ({ courses, isLoading, error, refetch }),
		[courses, isLoading, error, refetch]
	);
}