interface QuestionFilters {
  is_verified?: boolean | null;
  is_flagged?: boolean | null;
  min_difficulty?: number;
  max_difficulty?: number;
  subtopic_name?: string | null;
}
