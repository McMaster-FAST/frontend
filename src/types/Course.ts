import { Unit } from "./Unit";

export interface Course {
  code: string;
  name: string;
  year: number;
  semester: number;
  units?: Unit[];
}