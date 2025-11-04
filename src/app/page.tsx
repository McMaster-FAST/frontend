"use client";

import { useState } from "react";
import Image from "next/image";

type Course = {
  code: string;
  name: string;
  progress: number;
  total: number;
};

const courses: Course[] = [
  { code: "CHEM 1A03", name: "Introductory Chemistry I", progress: 95, total: 100 },
  { code: "CHEM 1AA3", name: "Introductory Chemistry II", progress: 95, total: 100 },
  { code: "KINESIOL 1AA3", name: "Human Anatomy and Physiology II", progress: 95, total: 100 },
  { code: "HISTORY 3XX3", name: "Human Rights in History", progress: 95, total: 100 },
  { code: "COMPSCI 2DB3", name: "Databases", progress: 95, total: 100 },
  { code: "ECON 1BB3", name: "Introducotry Macroeconomics", progress: 95, total: 100 },
];

export default function Home() {
  const [userId] = useState("userid");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex h-20 items-center justify-between bg-[#7A003C] px-8 border-b-[3px] border-[#FDBF57]">
        <div className="flex items-center gap-6">
          <h1 className="text-white text-base font-semibold leading-[22px] font-['Inter']">
            MacFAST
          </h1>
        </div>
        
        <nav className="flex items-center gap-2 flex-1 justify-end">
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center px-2 h-20 text-[#F5F5F5] text-sm font-semibold leading-[18px] font-['Poppins'] hover:bg-[#8a004c]"
            >
              My Courses
              <svg className={`w-5 h-5 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-[#DBDBDD] rounded-lg shadow-lg z-50">
                <div className="py-2">
                  {courses.map((course, index) => (
                    <button
                      key={index}
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-sm text-[#495965] hover:bg-[#F5F5F5] font-['Poppins']"
                    >
                      <div className="font-semibold">{course.code}</div>
                      <div className="text-xs text-[#495965]">{course.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className="flex items-center justify-center px-2 h-20 text-[#F5F5F5] text-sm font-semibold leading-[18px] font-['Poppins'] hover:bg-[#8a004c]">
            Saved Questions
          </button>
          <button className="flex items-center justify-center px-2 h-20 text-[#F5F5F5] text-sm font-semibold leading-[18px] font-['Poppins'] hover:bg-[#8a004c]">
            My Stats
          </button>
          <button className="flex items-center justify-center px-2 h-20 text-[#F5F5F5] text-sm font-semibold leading-[18px] font-['Poppins'] hover:bg-[#8a004c]">
            Logged in As: {userId}
          </button>
          <button className="flex items-center justify-center px-6 py-3 h-11 bg-white border-2 border-[#7A003C] rounded-lg text-[#7A003C] text-base font-semibold leading-5 font-['Poppins'] hover:bg-[#F5F5F5]">
            Logout
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-[25px]">
        <h2 className="text-[#495965] text-2xl font-semibold leading-8 mb-6 font-['Inter']">
          Choose a course to study:
        </h2>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-3 gap-[10px] w-[1280px]">
          {courses.map((course, index) => (
            <CourseCard key={index} course={course} />
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

function CourseCard({ course }: { course: Course }) {
  const progressPercentage = (course.progress / course.total) * 100;

  return (
    <div className="flex flex-col items-start p-6 gap-4 w-[420px] h-[230px] bg-white border border-[#DBDBDD] rounded-[10px] shadow-[0px_2px_5px_rgba(0,0,0,0.25)]">
      {/* Course Code */}
      <h3 className="text-black text-xl font-medium leading-[27px] font-['Poppins']">
        {course.code}
      </h3>

      {/* Course Name */}
      <div className="flex flex-col gap-1">
        <p className="text-[#495965] text-lg font-medium leading-6 font-['Poppins']">
          {course.name}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-0.5 w-[300px]">
        <div className="relative w-full h-1.5 bg-[#495965] rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-[#FDBF57] rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-[#495965] text-xs font-normal leading-[18px] font-['Poppins']">
          {course.progress}/{course.total}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-end justify-center gap-2.5 w-full">
        <button className="flex items-center justify-center px-6 py-3 h-11 bg-white border-2 border-[#7A003C] rounded-lg text-[#7A003C] text-base font-semibold leading-5 font-['Poppins'] hover:bg-[#F5F5F5]">
          Course Page
        </button>
        <button className="flex items-center justify-center px-6 py-3 h-11 bg-[#7A003C] rounded-lg text-white text-base font-semibold leading-5 font-['Poppins'] hover:bg-[#8a004c]">
          Resume
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
