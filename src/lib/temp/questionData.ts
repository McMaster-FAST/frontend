// Types matching database schema
export type QuestionOption = {
  id: number;
  content: string;
  is_answer: boolean;
  selection_frequency: number;
};

export type Question = {
  serial_number: string;
  content: string;
  difficulty: number;
  is_flagged: boolean;
  is_active: boolean;
  is_verified: boolean;
  options: QuestionOption[];
};

export type Unit = {
  course_code: string;
  name: string;
  number: number;
};

export type Course = {
  code: string;
  name: string;
  year: number;
  semester: number;
};

// Dummy data matching database structure
export const dummyQuestions: Question[] = [
  {
    serial_number: "CHEM1AA3-3.01-Q1",
    content: "How many constitutional (structural) + geometric (E, Z) isomers exist for the two molecular formulae below?\n\nC₃H₈O\nC₄H₈",
    difficulty: 0.65,
    is_flagged: false,
    is_active: true,
    is_verified: true,
    options: [
      { id: 1, content: "C₃H₈O = 4 C₄H₈ = 6", is_answer: true, selection_frequency: 0.45 },
      { id: 2, content: "C₃H₈O = 2 C₄H₈ = 4", is_answer: false, selection_frequency: 0.15 },
      { id: 3, content: "C₃H₈O = 3 C₄H₈ = 4", is_answer: false, selection_frequency: 0.25 },
      { id: 4, content: "C₃H₈O = 3 C₄H₈ = 6", is_answer: false, selection_frequency: 0.15 },
    ],
  },
  {
    serial_number: "CHEM1AA3-3.01-Q2",
    content: "What is the IUPAC name for the following compound?\n\nC₆H₁₂",
    difficulty: 0.55,
    is_flagged: false,
    is_active: true,
    is_verified: true,
    options: [
      { id: 5, content: "2-methylpentane", is_answer: false, selection_frequency: 0.20 },
      { id: 6, content: "3-methylpentane", is_answer: true, selection_frequency: 0.60 },
      { id: 7, content: "2,3-dimethylbutane", is_answer: false, selection_frequency: 0.15 },
      { id: 8, content: "hexane", is_answer: false, selection_frequency: 0.05 },
    ],
  },
];

export const dummyUnits: Unit[] = [
  {
    course_code: "CHEM1AA3",
    name: "3.01 Orgo - Bonding",
    number: 301,
  },
];

export const dummyCourses: Course[] = [
  {
    code: "CHEM1AA3",
    name: "Introductory Chemistry II",
    year: 2024,
    semester: 1,
  },
];

// Helper function to normalize course codes (remove spaces)
function normalizeCourseCode(code: string): string {
  return code.replace(/\s+/g, "");
}

// Helper functions
export function getQuestionBySerial(serialNumber: string): Question | undefined {
  return dummyQuestions.find((q) => q.serial_number === serialNumber);
}

// Extract question ID from serial number (e.g., "3.01-Q1" from "CHEM1AA3-3.01-Q1")
export function getQuestionIdFromSerial(serialNumber: string): string {
  const parts = serialNumber.split("-");
  if (parts.length >= 3) {
    return `${parts[1]}-${parts[2]}`;
  }
  return serialNumber;
}

// Get question by course code and question ID (e.g., "CHEM1AA3" and "3.01-Q1")
export function getQuestionByCourseAndId(
  courseCode: string,
  questionId: string
): Question | undefined {
  const normalized = normalizeCourseCode(courseCode);
  const serialNumber = `${normalized}-${questionId}`;
  return dummyQuestions.find((q) => q.serial_number === serialNumber);
}

export function getUnit(courseCode: string, unitName?: string): Unit | undefined {
  const normalized = normalizeCourseCode(courseCode);
  return dummyUnits.find((u) => normalizeCourseCode(u.course_code) === normalized);
}

export function getCourse(courseCode: string): Course | undefined {
  const normalized = normalizeCourseCode(courseCode);
  return dummyCourses.find((c) => normalizeCourseCode(c.code) === normalized);
}

export function getNextQuestionId(
  courseCode: string,
  currentQuestionId: string
): string | undefined {
  const normalized = normalizeCourseCode(courseCode);
  const questions = dummyQuestions.filter((q) =>
    q.serial_number.startsWith(normalized)
  );
  const currentSerial = `${normalized}-${currentQuestionId}`;
  const currentIndex = questions.findIndex((q) => q.serial_number === currentSerial);
  if (currentIndex >= 0 && currentIndex < questions.length - 1) {
    const nextSerial = questions[currentIndex + 1].serial_number;
    return getQuestionIdFromSerial(nextSerial);
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

