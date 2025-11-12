interface Question {
  serial_number: string;
  content: string;
  difficulty: number;
  is_flagged: boolean;
  is_active: boolean;
  is_verified: boolean;
  options: QuestionOption[];
};