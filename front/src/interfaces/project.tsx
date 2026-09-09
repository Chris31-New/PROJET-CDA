import type { Task } from "./task";
import type { Company } from "./company";
import type { Address } from "./address";

export interface ProjectHasCompanies {
  company_id: number;
  company?: Company;
  project_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  number_Project: string;
  name: string;
  image: string;
  start_date: Date | string;
  end_Date: Date | string;
  status: ProjectStatus;
  budget: number;
  individual_id: string;
  site_manager_id: string;
  project_type: ProjectType;
  address_id?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  description: string;
  tasks?: Task[];
  addressRef?: Address;
  companies?: ProjectHasCompanies[];
}
export type ProjectStatus =
  | "PLANNED"
  | "COMPLETED"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "CANCELLED";

export type ProjectType = "RENOVATION" | "CONSTRUCTION";
