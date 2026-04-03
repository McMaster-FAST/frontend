interface CourseXP {
  /**
   * The course ID/code (e.g., "CHEM 1AA3")
   */
  course: string;

  /**
   * The total amount of XP the user has earned in this course
   */
  total_xp: number;

  /**
   * The user's current calculated level
   */
  level: number;

  /**
   * How much XP the user has progressed into their current level
   */
  xp_in_current_level: number;

  /**
   * The total amount of XP required to complete the current level
   */
  xp_for_next_level: number;

  /**
   * A pre-calculated percentage (0-100) perfect for plugging straight into a progress bar width
   */
  progress_percentage: number;
}
