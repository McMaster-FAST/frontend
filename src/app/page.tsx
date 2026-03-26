"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthFetch } from "@/hooks/useFetchWithAuth";
import { MacFastHeader } from "@/components/macfast/macfast-header";
import CourseCard from "@/components/macfast/course-card/course-card";
import { useUserCourses } from "@/hooks/useUserCourses";
import ErrorMessage from "@/components/macfast/error-message";
import { CourseCardSkeleton } from "@/components/macfast/course-card/course-card-skeleton";

export default function Home() {
  const router = useRouter();
  const authFetch = useAuthFetch();
  const { courses: userCourses, isLoading, error } = useUserCourses();

  const coursesErrorStatus =
    error && typeof error === "object" && error !== null && "status" in error
      ? (error as { status: number }).status
      : undefined;

  if (error && coursesErrorStatus === 403) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <MacFastHeader />
        <main className="flex-1 px-6 py-10 md:px-12">
          <div className="mx-auto max-w-7xl">
            <ErrorMessage
              title="Access Denied"
              message="You do not have permission to access your courses."
            />
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
            <h2 className="font-poppins text-2xl font-bold text-foreground">
              Your Courses
            </h2>
            <span className="text-md text-primary dark:text-primary-hover font-semibold">
              {userCourses.length} Active
            </span>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 pb-10">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <CourseCardSkeleton key={`skeleton-${index}`} />
                ))
              : userCourses.map((course, index) => (
                  <CourseCard
                    key={course.code || index}
                    course={course}
                    progress={50}
                  />
                ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto flex flex-col items-center bg-background py-12">
        <h3 className="mb-6 font-['Inter'] text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Supported By
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-8 px-4 opacity-80 md:gap-12">
          {/* McMaster University Logo */}
          <a
            href="https://chemistry.mcmaster.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-300 hover:scale-105 hover:opacity-100"
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
            className="transition-all duration-300 hover:scale-105 hover:opacity-100"
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
          <div className="transition-all duration-300 hover:scale-105 hover:opacity-100">
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
