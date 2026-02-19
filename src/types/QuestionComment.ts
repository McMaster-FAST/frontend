interface QuestionComment {
    public_id: string;
    fromUserName: string;
    question: string;
    commentText: string;
    replyTo: string | null;
    timestamp: Date;
}