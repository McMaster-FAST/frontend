interface QuestionReportAggregation {
    question_id: string;
    report_reasons: ReportReasonAggregation[];
}

interface ReportReasonAggregation {
    reason: string;
    count: number;
}