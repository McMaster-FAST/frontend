"use client";

import Image from "next/image";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import CourseCard from "@/components/ui/custom/course-card";
import { useUserCourses } from "@/hooks/useUserCourses";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ErrorMessage from "@/components/ui/custom/error-message";

export default function Home() {
  const { courses: userCourses, isLoading, error } = useUserCourses();

  console.log("Error:", error);

  if (error && (error as any).status === 403) {
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

          <div className="grid grid-cols-1 gap-6 pb-10 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-5">
            {userCourses.map((course, index) => (
              <CourseCard key={index} course={course} progress={50} />
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
