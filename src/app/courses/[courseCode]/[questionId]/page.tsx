"use client";

import {useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {ChevronRight, Flag} from "lucide-react";
import {Header} from "@/components/Header";
import {
  getQuestionByCourseAndId,
  getNextQuestionId,
  getUnit,
  getCourse,
  parseQuestionContent,
  type Question,
} from "@/lib/temp/questionData";

export default function QuestionPage() {
  const params = useParams();
  const router = useRouter();
  const courseCode = params.courseCode as string;
  const questionId = params.questionId as string;

  const question = getQuestionByCourseAndId(courseCode, questionId);
  const unit = getUnit(courseCode);
  const course = getCourse(courseCode);

  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveForLater, setSaveForLater] = useState(false);

  // Debug logging (can be removed in production)
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log("Course Code:", courseCode);
    console.log("Question ID:", questionId);
    console.log("Found Question:", question);
    console.log("Found Unit:", unit);
    console.log("Found Course:", course);
  }

  if (!question || !unit || !course) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1 p-[25px]">
          <p className="text-[#495965]">
            Question not found
            {process.env.NODE_ENV === "development" && (
              <span className="block text-sm mt-2">
                Course: {courseCode}, Question ID: {questionId || "none"}
              </span>
            )}
          </p>
        </main>
      </div>
    );
  }

  const {text: questionText, molecularFormulae} = parseQuestionContent(
    question.content
  );

  const handleSubmit = () => {
    if (selectedOptionId !== null) {
      setIsSubmitted(true);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestionId = getNextQuestionId(courseCode, questionId);
    if (nextQuestionId) {
      // Normalize course code for URL (remove spaces)
      const normalizedCourseCode = courseCode.replace(/\s+/g, "");
      router.push(`/courses/${normalizedCourseCode}/${nextQuestionId}`);
      // Reset state for new question
      setSelectedOptionId(null);
      setIsSubmitted(false);
      setSaveForLater(false);
    }
  };

  const correctAnswerOption = question.options.find((opt) => opt.is_answer);

  return (
    <div className="flex min-h-screen flex-col bg-white pb-24">
      <Header />

      <main className="flex-1 p-[25px]">
        {/* Course Information */}
        <div className="flex items-center gap-2 mb-[10px]">
          <h2 className="text-[#495965] text-2xl font-semibold leading-8 font-['Inter']">
            {course.code}
          </h2>
          <ChevronRight className="w-5 h-5 text-[#495965]" />
          <h2 className="text-[#495965] text-2xl font-semibold leading-8 font-['Inter']">
            {unit.name}
          </h2>
        </div>

        {/* Content Area */}
        <div className="flex gap-[10px]">
          {/* Question Area */}
          <div className="flex flex-col gap-2 w-[893px]">
            {/* Question Box */}
            <div className="flex flex-col items-center p-2 gap-3 bg-white border border-[#DBDBDD] rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[2.5px]">
              <p className="text-black text-base font-normal leading-[16px] font-['Poppins'] w-[861px]">
                {questionText}
              </p>
              <div className="flex flex-col items-center gap-2">
                {molecularFormulae.map((formula, index) => (
                  <span
                    key={index}
                    className="text-black text-base font-normal leading-[16px]"
                    style={{fontFamily: "'STIX Two Math', serif"}}
                  >
                    {formula}
                  </span>
                ))}
              </div>
            </div>

            {/* Question Options */}
            <div className="flex flex-col gap-3">
              {question.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const isCorrect = option.is_answer;
                const showCorrectBorder = isSubmitted && isCorrect;

                return (
                  <button
                    key={option.id}
                    onClick={() =>
                      !isSubmitted && setSelectedOptionId(option.id)
                    }
                    className={`flex items-center p-2 gap-[10px] rounded-lg transition-colors ${
                      showCorrectBorder
                        ? "border-2 border-[#7A003C]"
                        : "border-0"
                    } ${
                      !isSubmitted
                        ? "hover:bg-[#F5F5F5] cursor-pointer"
                        : "cursor-default"
                    }`}
                  >
                    {/* Radio Button */}
                    <div className="flex items-center w-5 h-5">
                      <div
                        className={`w-5 h-5 rounded-full border ${
                          isSelected
                            ? "border-[#7A003C] bg-white"
                            : "border-[#495965] bg-white"
                        }`}
                        style={{
                          borderWidth: isSelected ? "6px" : "1px",
                        }}
                      />
                    </div>
                    {/* Option Text */}
                    <span
                      className="text-black text-base font-normal leading-[16px]"
                      style={{fontFamily: "'STIX Two Math', serif"}}
                    >
                      {option.content}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Answer Area (shown after submission) */}
          {isSubmitted && (
            <>
              {/* Vertical Divider */}
              <div className="w-0 h-[537px] border border-[#DBDBDD]"></div>

              {/* Post-submission Area */}
              <div className="flex flex-col gap-2 p-2 w-[477px] bg-white">
                {/* Title and Answer */}
                <div className="flex items-center gap-[10px] p-[10px]">
                  <span className="text-black text-base font-semibold leading-5 font-['Poppins']">
                    The correct answer was
                  </span>
                  <span
                    className="text-black text-base font-normal leading-[16px]"
                    style={{fontFamily: "'STIX Two Math', serif"}}
                  >
                    {correctAnswerOption?.content}
                  </span>
                </div>

                {/* Explanation */}
                <div className="flex flex-col gap-[10px] p-[10px] flex-1">
                  <div className="flex flex-col gap-[10px]">
                    <p className="text-black text-base font-normal leading-5 font-['Poppins']">
                      This is an explanation why the answer is what it is if we
                      have it.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#DBDBDD] px-[25px] py-4 shadow-[0px_-2px_5px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center max-w-[1440px] mx-auto">
          {/* Left Side - Flag Button */}
          <div className="w-11 h-11">
            <button className="flex items-center justify-center w-11 h-11 p-3 bg-[#7A003C] rounded-lg hover:bg-[#8a004c]">
              <Flag className="w-5 h-5 text-[#F5F5F5]" />
            </button>
          </div>

          {/* Right Side - Save, Skip, Submit / Next Question */}
          <div className="flex items-center gap-2">
            {!isSubmitted ? (
              <>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveForLater}
                    onChange={(e) => setSaveForLater(e.target.checked)}
                    className="w-5 h-5 rounded border border-[#495965] bg-white"
                    style={{borderRadius: "6px"}}
                  />
                  <span className="text-black text-base font-semibold leading-5 font-['Poppins']">
                    Save for Later
                  </span>
                </label>
                <button
                  disabled={isSubmitted}
                  className={`flex items-center justify-center px-6 py-3 h-11 rounded-lg text-base font-semibold leading-5 font-['Poppins'] ${
                    isSubmitted
                      ? "bg-[#DBDBDD] border-2 border-[rgba(79,89,95,0.5)] text-[rgba(79,89,95,0.5)] cursor-not-allowed"
                      : "bg-white border-2 border-[#7A003C] text-[#7A003C] hover:bg-[#F5F5F5]"
                  }`}
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={selectedOptionId === null || isSubmitted}
                  className={`flex items-center justify-center px-6 py-3 h-11 rounded-lg text-base font-semibold leading-5 font-['Poppins'] ${
                    selectedOptionId === null || isSubmitted
                      ? "bg-[#DBDBDD] text-[rgba(79,89,95,0.5)] cursor-not-allowed"
                      : "bg-[#7A003C] text-white hover:bg-[#8a004c]"
                  }`}
                >
                  Submit
                </button>
              </>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center justify-center px-6 py-3 h-11 bg-[#7A003C] rounded-lg text-white text-base font-semibold leading-5 font-['Poppins'] hover:bg-[#8a004c]"
              >
                Next Question
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
