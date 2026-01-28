interface QuestionComment {
    public_id: string;
    fromUser: string;
    question: string;
    commentText: string;
    replyTo: string | null;
    timestamp: Date;
}