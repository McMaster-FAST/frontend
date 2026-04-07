interface QuestionFilters {
  is_verified?: boolean | null;
  is_flagged?: boolean | null;
  min_selection_frequency?: number;
  max_selection_frequency?: number;
  subtopic_name?: string | null;
}
