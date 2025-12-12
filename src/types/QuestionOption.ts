interface QuestionOption {
  public_id: string;
  content: string;
  is_answer: boolean;
  selection_frequency: number;
};

interface TestQuestionOption {
  public_id: string;
  content: string;
}