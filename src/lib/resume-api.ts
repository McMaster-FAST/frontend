import type { useAuthFetch } from "@/hooks/useFetchWithAuth";


export type ResumeTarget = {
  course_code: string;
  unit_name: string;
  subtopic_name: string;
};



/**
 * 
 * For now returns dummy data; to be replaced with real API call.
 *
 * @param courseCode 
 * @param authFetch 
 * @returns 
 */
export async function getResumeTarget(
  courseCode: string,
  authFetch: ReturnType<typeof useAuthFetch>,
): Promise<ResumeTarget> {
  // TODO(ticket #66): Replace with real API call when backend resume endpoint is ready.
  // Example (uncomment and use getJson from @/lib/api when ready):
  // const response = await authFetch(`/api/core/resume/?course_code=${encodeURIComponent(courseCode)}`);
  // if (!response.ok) throw new Error("Failed to get resume target");
  // return getJson(response) as Promise<ResumeTarget>;

  // Dummy data
  const dummy: ResumeTarget = {
    course_code: courseCode,
    unit_name: "Unit 1",
    subtopic_name: "Introduction",
  };
  return Promise.resolve(dummy);
}
