"use client";

import Image from "next/image";
import { MacFastHeader } from "@/components/ui/custom/macfast-header";
import CourseCard from "@/components/ui/custom/course-card";

const courses: Course[] = [
  {
    code: "CHEM 1A03",
    name: "Introductory Chemistry I",
    year: 2025,
    semester: "Fall",
    description:
      "A discussion of organic chemistry, chemical kinetics and acid-base equilibrium, with emphasis on relevant experimental techniques and solving real problems ranging from drug discovery to environmental chemistry.",
    units: [],
  },

  {
    code: "CHEM 1AA3",
    name: "Introductory Chemistry II",
    year: 2025,
    semester: "Winter",
    description:
      "A discussion of organic chemistry, chemical kinetics and acid-base equilibrium, with emphasis on relevant experimental techniques and solving real problems ranging from drug discovery to environmental chemistry.",
    units: [],
  },

  {
    code: "KINESIOL 1AA3",
    name: "Human Anatomy and Physiology II",
    year: 2025,
    semester: "Winter",
    description:
      "A discussion of organic chemistry, chemical kinetics and acid-base equilibrium, with emphasis on relevant experimental techniques and solving real problems ranging from drug discovery to environmental chemistry.",
    units: [],
  },

  {
    code: "HISTORY 3XX3",
    name: "Human Rights in History",
    year: 2025,
    semester: "Fall",
    description:
      "A discussion of organic chemistry, chemical kinetics and acid-base equilibrium, with emphasis on relevant experimental techniques and solving real problems ranging from drug discovery to environmental chemistry.",
    units: [],
  },

  {
    code: "COMPSCI 2DB3",
    name: "Databases",
    year: 2025,
    semester: "Fall",
    description:
      "A discussion of organic chemistry, chemical kinetics and acid-base equilibrium, with emphasis on relevant experimental techniques and solving real problems ranging from drug discovery to environmental chemistry.",
    units: [],
  },

  {
    code: "ECON 1BB3",
    name: "Introducotry Macroeconomics",
    year: 2025,
    semester: "Fall",
    description:
      "A discussion of organic chemistry, chemical kinetics and acid-base equilibrium, with emphasis on relevant experimental techniques and solving real problems ranging from drug discovery to environmental chemistry.",
    units: [],
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <MacFastHeader />

      {/* Main Content */}
      <main className="flex-1 px-6 py-10 md:px-12">
        <div className="mx-auto max-w-9xl">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-poppins text-2xl font-bold text-slate-800">
              Your Courses
            </h2>
            <span className="text-md text-primary font-semibold">
              {courses.length} Active
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 pb-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {courses.map((course, index) => (
              <CourseCard key={index} course={course} progress={50} />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto flex flex-col items-center border-t border-slate-100 bg-white py-12">
        <h3 className="mb-6 font-['Inter'] text-sm font-semibold uppercase tracking-widest text-slate-400">
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
