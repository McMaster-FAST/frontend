interface QuestionComment {
  public_id: string;
  comment_text: string;
  user_name: string;
  timestamp: Date;
  replies: QuestionComment[];
}
