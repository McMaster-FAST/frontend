"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import CourseCard from "@/components/ui/custom/course-card";
import { useUserCourses } from "@/hooks/useUserCourses";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { getResumeTarget, NoResumeStateError } from "@/lib/resume-api";
import ErrorMessage from "@/components/ui/custom/error-message";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const authFetch = useAuthFetch();
  const { courses: userCourses, error } = useUserCourses();
  const [resumeNotice, setResumeNotice] = useState<string | null>(null);

  const handleResume = async (courseCode: string) => {
    setResumeNotice(null);
    try {
      const target = await getResumeTarget(courseCode, authFetch);
      if (
        !target.course_code?.trim() ||
        !target.unit_name?.trim() ||
        !target.subtopic_name?.trim()
      ) {
        setResumeNotice(
          "Resume data from the server was incomplete. Please open the course and pick a subtopic.",
        );
        return;
      }
      const url = `/courses/${encodeURIComponent(target.course_code.trim())}/${encodeURIComponent(target.unit_name.trim())}/${encodeURIComponent(target.subtopic_name.trim())}/test`;
      router.push(url);
    } catch (err) {
      if (err instanceof NoResumeStateError) {
        setResumeNotice(err.message);
        return;
      }
      const message =
        err instanceof Error ? err.message : "Could not resume. Please try again.";
      setResumeNotice(message);
    }
  };

  const coursesErrorStatus =
    error && typeof error === "object" && error !== null && "status" in error
      ? (error as { status: number }).status
      : undefined;

  if (error && coursesErrorStatus === 403) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50/50">
        <MacFastHeader />
        <main className="flex-1 px-6 py-10 md:px-12">
          <div className="mx-auto max-w-7xl">
            <ErrorMessage title="Access Denied" message="You do not have permission to access your courses."/>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MacFastHeader />

      {/* Main Content */}
      <main className="flex-1 px-6 py-10 md:px-8 lg:px-28">
        <div className="mx-auto">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-poppins text-2xl font-bold text-dark-gray">
              Your Courses
            </h2>
            <span className="text-md text-primary font-semibold">
              {userCourses.length} Active
            </span>
          </div>

          {resumeNotice && (
            <div className="mb-6">
              <Alert variant="warning" className="max-w-2xl">
                <Info className="h-4 w-4" />
                <AlertTitle>Resume</AlertTitle>
                <AlertDescription>{resumeNotice}</AlertDescription>
              </Alert>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 pb-10 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-5">
            {userCourses.map((course, index) => (
              <CourseCard
                key={index}
                course={course}
                progress={50}
                onResume={handleResume}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto flex flex-col items-center border-t border-light-gray bg-white py-12">
        <h3 className="mb-6 font-['Inter'] text-sm font-semibold uppercase tracking-widest text-dark-gray">
          Supported By
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-8 px-4 opacity-80 md:gap-12">
          {/* McMaster University Logo */}
          <a
            href="https://chemistry.mcmaster.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-300 hover:scale-105 hover:opacity-100 grayscale hover:grayscale-0"
          >
            <Image
              src="/sponsors/mcmaster-logo.png"
              alt="McMaster University"
              width={360}
              height={100}
              className="h-24 w-auto object-contain"
              unoptimized
            />
          </a>

          {/* Paul R. MacPherson Institute Logo */}
          <a
            href="https://mi.mcmaster.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-300 hover:scale-105 hover:opacity-100 grayscale hover:grayscale-0"
          >
            <Image
              src="/sponsors/macpherson-institute-logo.png"
              alt="MacPherson Institute"
              width={480}
              height={100}
              className="h-24 w-auto object-contain"
              unoptimized
            />
          </a>

          {/* McCall MacBain Foundation Logo */}
          <div className="transition-all duration-300 hover:scale-105 hover:opacity-100 grayscale hover:grayscale-0">
            <Image
              src="/sponsors/mccall-macbain-logo.png"
              alt="McCall MacBain Foundation"
              width={200}
              height={100}
              className="h-24 w-auto object-contain"
              unoptimized
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
