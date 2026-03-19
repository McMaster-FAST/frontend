import { QuestionReportReason } from "./QuestionReportReason";

export default interface QuestionReportAggregation {
    question: Question;
    unit: Unit;
    subtopic: Subtopic;
    reason_counts: Map<QuestionReportReason, number>;
    total_reports: number;
}