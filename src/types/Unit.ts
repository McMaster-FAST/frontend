interface Unit {
  public_id: string;
  name: string;
  number: number | string;
  course?: number | string;
  tag?: string;
  description?: string;
  correct_questions?: number;
  total_questions?: number;
  completion_percentage?: number;
  unitAbilityScore?: number;
  subtopics?: Subtopic[];
}
