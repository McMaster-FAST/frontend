interface Course {
  code: string;
  name: string;
  description: string;
  is_archived: boolean;
  year: number;
  semester: string;
  units: Unit[];
  resume_target?: ResumeTarget;
}
