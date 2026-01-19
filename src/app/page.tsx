"use client";

import Image from "next/image";
import {MacFastHeader} from "@/components/ui/custom/macfast-header";
import CourseCard from "@/components/ui/custom/course-card";
import { redirect } from 'next/navigation';

const courses: Course[] = [
  { code: "CHEM 1A03", name: "Introductory Chemistry I", year: 2025, semester: 1},
  { code: "CHEM 1AA3", name: "Introductory Chemistry II", year: 2025, semester: 2},
  { code: "KINESIOL 1AA3", name: "Human Anatomy and Physiology II", year: 2025, semester: 2},
  { code: "HISTORY 3XX3", name: "Human Rights in History", year: 2025, semester: 1},
  { code: "COMPSCI 2DB3", name: "Databases", year: 2025, semester: 1},
  { code: "ECON 1BB3", name: "Introducotry Macroeconomics", year: 2025, semester: 1},
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MacFastHeader />

      {/* Main Content */}
      <main className="flex-1 p-[25px]">
        <h2 className="text-[#495965] text-2xl font-semibold leading-8 mb-6 font-poppins">
          Choose a course to study:
        </h2>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-3 gap-3 w-fit">
          {courses.map((course, index) => (
            // TODO: Link this to actual course progress
            <CourseCard key={index} course={course} progress={75}/>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col items-center py-8 bg-white">
        <h3 className="text-[#495965] text-base font-semibold leading-8 mb-2.5 font-['Inter']">
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
