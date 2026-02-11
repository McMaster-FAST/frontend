import type { QuestionOption, TestQuestionOption } from "./QuestionOption";

export interface Question {
  public_id: string;
  serial_number: string;
  content: string;
  difficulty: number;
  is_flagged: boolean;
  is_active: boolean;
  is_verified: boolean;
  options: QuestionOption[];
  course?: string;
  unit?: string;
  subtopic?: string;
  answer_explanation?: string;
}

export interface TestQuestion {
  public_id: string;
  content: string;
  options: TestQuestionOption[];
}