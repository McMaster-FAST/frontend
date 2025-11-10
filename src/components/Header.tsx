"use client";

import {useState} from "react";
import {ChevronDown} from "lucide-react";

type Course = {
  code: string;
  name: string;
  progress: number;
  total: number;
};

const courses: Course[] = [
  {
    code: "CHEM 1A03",
    name: "Introductory Chemistry I",
    progress: 95,
    total: 100,
  },
  {
    code: "CHEM 1AA3",
    name: "Introductory Chemistry II",
    progress: 95,
    total: 100,
  },
  {
    code: "KINESIOL 1AA3",
    name: "Human Anatomy and Physiology II",
    progress: 95,
    total: 100,
  },
  {
    code: "HISTORY 3XX3",
    name: "Human Rights in History",
    progress: 95,
    total: 100,
  },
  {code: "COMPSCI 2DB3", name: "Databases", progress: 95, total: 100},
  {
    code: "ECON 1BB3",
    name: "Introducotry Macroeconomics",
    progress: 95,
    total: 100,
  },
];

export function Header() {
  const [userId] = useState("userid");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
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
            <ChevronDown
              className={`w-5 h-5 ml-1 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

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
  );
}
