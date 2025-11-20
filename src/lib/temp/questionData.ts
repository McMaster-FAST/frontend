import { Question, QuestionOption } from "@/types";

// TEMP: Hardcoded question data for initial demo
// This matches the structure expected for the first question
const hardcodedQuestionData = {
  serial_number: "CHEM1AA3-3.01-Q1",
  content: "Which of the following rankings is FALSE ordered with respect to the relative atomic/ionic size?",
  difficulty: 0.65,
  is_flagged: false,
  is_active: true,
  is_verified: true,
  options: [
    { id: 1, content: "Na+ > F−" },
    { id: 2, content: "Cl− > Li" },
    { id: 3, content: "P > S" },
    { id: 4, content: "Li+ > Be2+" },
  ]
};

// TEMP: Hardcoded unit data
const hardcodedUnitData = {
  course_code: "CHEM1AA3",
  name: "3.01 Orgo - Bonding",
  number: 301,
};

// Helper function to normalize course codes (remove spaces)
function normalizeCourseCode(code: string): string {
  return code.replace(/\s+/g, "");
}

// TEMP: Get hardcoded question by course code and question ID (only for 3.01-Q1)
export function getQuestionByCourseAndId(
  courseCode: string,
  questionId: string
): Question | undefined {
  const normalized = normalizeCourseCode(courseCode);
  if (normalized === "CHEM1AA3" && questionId === "3.01-Q1") {
    return {
      ...hardcodedQuestionData,
      course: normalized,
      unit: hardcodedUnitData.name,
      subtopic: "",
    };
  }
  return undefined;
}

// TEMP: Get hardcoded unit data
export function getUnit(courseCode: string): { course_code: string; name: string; number: number } | undefined {
  const normalized = normalizeCourseCode(courseCode);
  if (normalized === "CHEM1AA3") {
    return hardcodedUnitData;
  }
  return undefined;
}

// Parse question content to extract text and molecular formulae
export function parseQuestionContent(content: string): {
  text: string;
  molecularFormulae: string[];
} {
  const lines = content.split("\n").filter((line) => line.trim());
  const text = lines[0];
  const molecularFormulae = lines.slice(1).filter((line) => line.trim());
  return { text, molecularFormulae };
}

