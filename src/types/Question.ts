interface Question {
  public_id: string;
  serial_number: string;
  content: string;
  difficulty: number | string;
  selection_frequency: number | string;
  is_flagged: boolean;
  is_active: boolean;
  is_verified: boolean;
  images?: string[];
  options: QuestionOption[];
  course: string;
  unit?: string;
  unit_name?: string;
  unit_public_id?: string;
  subtopic_name: string;
  subtopic_public_id?: string;
  saved_for_later?: boolean;
  answer_explanation: string;
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

interface QuestionReportAggregate {
  public_id: string;
  content: string;
  subtopic_name: string;
  unit_name: string;
  total_reports: number;
}
