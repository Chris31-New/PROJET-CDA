import type { Company } from "./company";
import type { Speciality } from "./speciality";

export interface Task {
  id: number;
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  status: TaskStatus;
  status_note: string;
  project_id: number;
  company_id?: number;
  company?: Company;
  speciality_id?: number;
  speciality?: Speciality;
  depends_on?: number[];
}

export type TaskStatus = "TO_DO" | "DONE" | "IN_PROGRESS" | "BLOCKED";
export type TaskDepencancies = { first: Task; second: Task };
