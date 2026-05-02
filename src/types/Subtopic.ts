interface Subtopic {
  name: string;
  description?: string[] | string;
  tag?: string;
  unit?: number | string;
  study_aids?: StudyAid[];
  user_ability: UserAbility | null;
  public_id: string;
  question_count: number;
}
