export interface QuestionOption {
  public_id: string;
  content: string;
  is_answer: boolean;
  selection_frequency: number;
}

export interface TestQuestionOption {
  public_id: string;
  content: string;
}