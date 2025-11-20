"use client";

import {useState, useEffect} from "react";
import {useParams, useRouter} from "next/navigation";
import {ChevronRight, Flag, FlagIcon} from "lucide-react";
import {MacFastHeader} from "@/components/ui/custom/macfast-header";
import {
  getQuestionByCourseAndId,
  getUnit,
  parseQuestionContent,
} from "@/lib/temp/questionData";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@radix-ui/react-label";
import {Button} from "@/components/ui/button";
import {courses} from "@/app/page";
import {submitAnswer, getNextQuestion} from "@/lib/api";
import {Question as QuestionType} from "@/types";

// TEMP: Dummy user token for demo
const DUMMY_USER_TOKEN = "abc123xyz";

// TEMP: Helper to increment question ID (e.g., "3.01-Q1" -> "3.01-Q2")
function incrementQuestionId(questionId: string): string {
  const match = questionId.match(/^(.+)-Q(\d+)$/);
  if (match) {
    const prefix = match[1];
    const number = parseInt(match[2], 10);
    return `${prefix}-Q${number + 1}`;
  }
  return questionId;
}

// Helper to get course from courses list
function getCourse(courseCode: string) {
  const normalized = courseCode.replace(/\s+/g, "");
  return courses.find((c) => c.code.replace(/\s+/g, "") === normalized);
}

// Map API question response to Question type
function mapApiQuestionToQuestion(
  apiQuestion: {
    serial_number: string;
    content: string;
    images: string[];
    options: {id: number; content: string; images: string[]}[];
  },
  courseCode: string
): QuestionType {
  return {
    serial_number: apiQuestion.serial_number,
    content: apiQuestion.content,
    difficulty: 0, // TEMP: Not provided by API
    is_flagged: false, // TEMP: Not provided by API
    is_active: true, // TEMP: Not provided by API
    is_verified: true, // TEMP: Not provided by API
    options: apiQuestion.options.map((opt) => ({
      id: opt.id,
      content: opt.content,
    })),
    course: courseCode, // TEMP: Use course code from URL
    unit: "", // TEMP: Not provided by API
    subtopic: "", // TEMP: Not provided by API
  };
}

export default function QuestionPage() {
  const params = useParams();
  const router = useRouter();
  const courseCode = params.courseCode as string;
  const questionId = params.questionId as string;

  const unit = getUnit(courseCode);
  const course = getCourse(courseCode);

  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveForLater, setSaveForLater] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [correctAnswerId, setCorrectAnswerId] = useState<number | null>(null);

  // Load question on mount or when route changes
  useEffect(() => {
    const loadQuestion = async () => {
      // TEMP: Try hardcoded question first (only for 3.01-Q1)
      const hardcodedQuestion = getQuestionByCourseAndId(
        courseCode,
        questionId
      );
      if (hardcodedQuestion) {
        setQuestion(hardcodedQuestion);
        // Don't set correctAnswerId - we'll only know after submission (like API questions)
        setCorrectAnswerId(null);
        return;
      }

      // If not hardcoded, load from API
      setIsLoading(true);
      try {
        const normalizedCourseCode = courseCode.replace(/\s+/g, "");
        const response = await getNextQuestion(
          DUMMY_USER_TOKEN,
          "chem101" // TEMP
        );
        const mappedQuestion = mapApiQuestionToQuestion(
          response.question,
          normalizedCourseCode
        );
        setQuestion(mappedQuestion);
        // Don't set correctAnswerId - we'll only know after submission
        setCorrectAnswerId(null);
      } catch (error) {
        console.error("Error loading question:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestion();
  }, [courseCode, questionId]);

  const handleSubmit = async () => {
    if (selectedOptionId === null || !question) return;

    setIsLoading(true);
    try {
      const response = await submitAnswer(
        DUMMY_USER_TOKEN,
        question.serial_number,
        selectedOptionId
      );
      setIsCorrect(response.correct);
      setIsSubmitted(true);
      // If answer is correct, the selected answer is the correct one
      if (response.correct) {
        setCorrectAnswerId(selectedOptionId);
      } else {
        // TEMP: Randomly select a correct answer (different from chosen one) for demo
        // In production, API should return correct_answer_id
        const incorrectOptions = question.options.filter(
          (opt) => opt.id !== selectedOptionId
        );
        if (incorrectOptions.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * incorrectOptions.length
          );
          setCorrectAnswerId(incorrectOptions[randomIndex].id);
        }
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      // TEMP: On error, still show submission UI
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    await loadNextQuestion();
  };

  const handleNextQuestion = async () => {
    await loadNextQuestion();
  };

  const loadNextQuestion = async () => {
    setIsLoading(true);
    try {
      // TEMP: Use course code as group_name (normalized)
      const normalizedCourseCode = courseCode.replace(/\s+/g, "");
      const response = await getNextQuestion(
        DUMMY_USER_TOKEN,
        "chem101" // TEMP
      );

      const mappedQuestion = mapApiQuestionToQuestion(
        response.question,
        normalizedCourseCode
      );

      // Increment question ID in URL
      const nextQuestionId = incrementQuestionId(questionId);
      const normalizedCourseCodeForUrl = courseCode.replace(/\s+/g, "");
      router.push(`/courses/${normalizedCourseCodeForUrl}/${nextQuestionId}`);

      // Reset state for new question (will be loaded by useEffect)
      setSelectedOptionId(null);
      setIsSubmitted(false);
      setSaveForLater(false);
      setIsCorrect(null);
      setCorrectAnswerId(null);
    } catch (error) {
      console.error("Error loading next question:", error);
      // TEMP: On error, still increment URL
      const normalizedCourseCode = courseCode.replace(/\s+/g, "");
      const nextQuestionId = incrementQuestionId(questionId);
      router.push(`/courses/${normalizedCourseCode}/${nextQuestionId}`);
      setSelectedOptionId(null);
      setIsSubmitted(false);
      setSaveForLater(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!question || !unit || !course) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <MacFastHeader userId="exampleUser" userCourses={courses} />
        <main className="flex-1 p-[25px]">
          <p className="text-[#495965]">
            {isLoading ? "Loading..." : "Question not found"}
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

  // Get correct answer option (only available after submission if answer was correct or from hardcoded data)
  const correctAnswerOption = correctAnswerId
    ? question.options.find((opt) => opt.id === correctAnswerId)
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-white pb-24">
      <MacFastHeader userId="exampleUser" userCourses={courses} />
      <main className="flex-1 p-[25px]">
        {/* Course Information */}
        <div className="flex items-center gap-2 mb-[10px]">
          <h2 className="text-dark-gray text-2xl font-semibold leading-8 font-['Inter']">
            {course.code}
          </h2>
          <ChevronRight className="w-5 h-5 text-dark-gray" />
          <h2 className="text-dark-gray text-2xl font-semibold leading-8 font-['Inter']">
            {unit.name}
          </h2>
        </div>

        {/* Content Area */}
        <div className="flex gap-[10px]">
          {/* Question Area */}
          <div className="flex flex-col gap-2 w-[893px]">
            {/* Question Box */}
            <div className="flex flex-col items-center p-2 gap-3 bg-white border border-light-gray rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[2.5px]">
              <p className="text-black text-base font-normal leading-[16px] font-['Poppins'] w-[861px]">
                {questionText}
              </p>
              <div className="flex flex-col items-center gap-2">
                {molecularFormulae.map((formula, index) => (
                  <span
                    key={index}
                    className="text-black text-base font-normal leading-[16px] font-['Poppins']"
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
                const isCorrectAnswer = correctAnswerId === option.id;

                // Determine styling based on submission state
                let borderColor = "";
                let backgroundColor = "";

                if (isSubmitted) {
                  if (isSelected) {
                    // User's selected answer: green if correct, red if wrong
                    if (isCorrect === true) {
                      borderColor = "border-2 border-green-500";
                      backgroundColor = "bg-green-50";
                    } else {
                      borderColor = "border-2 border-red-500";
                      backgroundColor = "bg-red-50";
                    }
                  } else if (isCorrectAnswer && isCorrect === false) {
                    // Correct answer shown when user got it wrong (only if we know it)
                    borderColor = "border-2 border-green-500";
                    backgroundColor = "bg-green-50";
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() =>
                      !isSubmitted &&
                      !isLoading &&
                      setSelectedOptionId(option.id)
                    }
                    disabled={isSubmitted || isLoading}
                    className={`flex items-center p-2 gap-[10px] rounded-lg transition-colors ${
                      borderColor || "border-0"
                    } ${backgroundColor || ""} ${
                      !isSubmitted && !isLoading
                        ? "hover:bg-off-white cursor-pointer"
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
                    <span className="text-black text-base font-normal leading-[16px] font-['Poppins']">
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
                    {isCorrect !== null && isCorrect
                      ? "Correct!"
                      : correctAnswerOption
                      ? "The correct answer was"
                      : "Your answer was incorrect"}
                  </span>
                  {correctAnswerOption && (
                    <span className="text-black text-base font-normal leading-[16px] font-['Poppins']">
                      {correctAnswerOption.content}
                    </span>
                  )}
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
          <Button variant="primary" iconOnly leftIcon={FlagIcon} />

          {/* Right Side - Save, Skip, Submit / Next Question */}
          <div className="flex items-center gap-2">
            {!isSubmitted ? (
              <>
                <Checkbox
                  checked={saveForLater}
                  onCheckedChange={(checked) => setSaveForLater(!!checked)}
                  id="saveForLater"
                />
                <Label htmlFor="saveForLater">Save for later</Label>
                <Button
                  variant="secondary"
                  onClick={handleSkip}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Skip"}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={
                    selectedOptionId === null || isSubmitted || isLoading
                  }
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={handleNextQuestion}
                rightIcon={ChevronRight}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Next Question"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
