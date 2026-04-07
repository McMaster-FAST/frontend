interface QuestionReport {
    public_id: string;
    user: SimpleUser;
    question: Question;
    report_reasons: string[];
    additional_details: string;
    timestamp: string;
}