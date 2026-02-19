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
  subtopic_name: string;
}

interface TestQuestion {
  public_id: string;
  content: string;
  options: TestQuestionOption[];
  saved_for_later: boolean;
}

interface SavedForLaterQuestion {
  public_id: string;
  content: string;
  subtopic_name: string;
  unit_name: string;
  course_code: string;
}
interface SavedForLater {
  public_id: string;
  question: SavedForLaterQuestion;
  timestamp: string;
}
