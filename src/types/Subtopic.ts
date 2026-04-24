interface Subtopic {
  name: string;
  description?: string[];
  study_aids?: StudyAid[];
  user_ability: UserAbility | null;
  public_id: string;
  question_count: number;
}
