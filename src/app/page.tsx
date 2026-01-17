"use client";

import Image from "next/image";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import CourseCard from "@/components/ui/custom/course-card";
import { getLastStudiedSubtopicForCourse } from "@/lib/api";
import { useAuthFetch } from "@/hooks/fetch_with_auth";

export default function Home() {
  const courses: Course[] = [];
  
  const authFetch = useAuthFetch();

  const resumeTest = (courseCode: string) => {
    getLastStudiedSubtopicForCourse(courseCode, authFetch).then((data) => {
      // Redirect to test page
      window.location.href = `/courses/${data.course_code}/${data.unit_name}/${data.subtopic_name}/test`;
    });
  };

  const gotoCoursePage = (courseCode: string) => {
    // Redirect to course page
    window.location.href = `/courses/${courseCode}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MacFastHeader />

      <main className="flex-1 p-8">
        <h1 className="text-dark-gray text-2xl font-semibold mb-6 font-poppins">
          Choose a course to study:
        </h1>

        <div className="flex flex-row flex-wrap gap-3 w-fit">
          {courses &&
            courses.map((course, index) => (
              // TODO: Link this to actual course progress
              <CourseCard
                key={index}
                course={course}
                progress={75}
                onResume={() => resumeTest(course.code)}
                // onCoursePage={() => {gotoCoursePage(course.code)}}
              />
            ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col items-center py-8 bg-white">
        <h3 className="text-dark-gray font-semibold leading-8 mb-2.5 font-poppins">
          Thanks to our sponsors
        </h3>
        <div className="flex items-start gap-[10px] pt-2.5">
          {/* McMaster University Logo */}
          <a
            href="https://chemistry.mcmaster.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-[297px] h-[69px] flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <Image
              src="/sponsors/mcmaster-logo.png"
              alt="McMaster University"
              width={297}
              height={69}
              className="object-contain"
            />
          </a>
          {/* Paul R. MacPherson Institute Logo */}
          <a
            href="https://mi.mcmaster.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-[388px] h-[69px] flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <Image
              src="/sponsors/macpherson-institute-logo.png"
              alt="PAUL R. MACPHERSON INSTITUTE FOR LEADERSHIP, INNOVATION AND EXCELLENCE IN TEACHING"
              width={388}
              height={69}
              className="object-contain"
            />
          </a>
          {/* McCall MacBain Foundation Logo */}
          <div className="relative w-[123px] h-[69px] flex items-center justify-center">
            <Image
              src="/sponsors/mccall-macbain-logo.png"
              alt="mccall macbain Foundation"
              width={123}
              height={69}
              className="object-contain"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
