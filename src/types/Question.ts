interface Question {
  public_id: string;
  serial_number: string;
  content: string;
  difficulty: number;
  is_flagged: boolean;
  is_active: boolean;
  is_verified: boolean;
  options: QuestionOption[];
  course: string;
  unit: string;
  subtopic: string;
  // TODO: Get this from the backend
  answer_explanation: string;
}

interface TestQuestion {
  public_id: string;
  content: string;
  options: TestQuestionOption[];
}
