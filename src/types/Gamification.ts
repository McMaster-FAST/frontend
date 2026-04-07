export type DifficultyLabel =
  | "MUCH_EASIER"
  | "EASIER"
  | "ON_TARGET"
  | "HARDER"
  | "MUCH_HARDER";

export interface Gamification {
  user_ability: number; // -3.0 to 3.0
  ability_variance: number; // 0 to 10 (high = uncertain, low = confident)
  questions_answered: number;
  current_streak: number;
  question_difficulty?: number; // -3.0 to 3.0, absent when no question available
  difficulty_delta?: number;
  difficulty_label?: DifficultyLabel;
}
