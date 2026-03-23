import type { useAuthFetch } from "@/hooks/useFetchWithAuth";

/**
 * Response shape from GET /api/core/resume/?course_code=...
 * (backend: CourseResumeState → ResumeTargetSerializer)
 */
export type ResumeTarget = {
  course_code: string;
  unit_name: string;
  subtopic_name: string;
};

/**
 * Thrown when the backend returns 404 (no resume state for this course yet).
 */
export class NoResumeStateError extends Error {
  constructor(message = "No progress to resume for this course.") {
    super(message);
    this.name = "NoResumeStateError";
  }
}

/**
 * Fetches the last studied subtopic for the current user and course.
 * Backend: GET /api/core/resume/?course_code=...
 *
 * @see https://github.com/McMaster-FAST/backend/issues/66
 */
export async function getResumeTarget(
  courseCode: string,
  authFetch: ReturnType<typeof useAuthFetch>,
): Promise<ResumeTarget> {
  const response = await authFetch(
    `/api/core/resume/?course_code=${encodeURIComponent(courseCode)}`,
  );

  if (response.ok) {
    const data = (await response.json()) as ResumeTarget;
    return {
      course_code: data.course_code?.trim() ?? "",
      unit_name: data.unit_name?.trim() ?? "",
      subtopic_name: data.subtopic_name?.trim() ?? "",
    };
  }

  if (response.status === 404) {
    let detail = "No resume state found for this course.";
    try {
      const body = (await response.json()) as { detail?: string };
      if (body?.detail) detail = body.detail;
    } catch {
      /* ignore parse errors */
    }
    throw new NoResumeStateError(detail);
  }

  let message = "Failed to get resume target";
  try {
    const body = (await response.json()) as { detail?: string; message?: string };
    if (body?.detail) message = body.detail;
    else if (body?.message) message = body.message;
  } catch {
    /* ignore */
  }
  throw new Error(message);
}
