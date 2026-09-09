import { ProjectType, StatusProject } from 'prisma/generated/prisma/enums';

export class Project {}
export interface ProjectData {
  number_Project: string;

  name: string;

  description: string;

  start_date: Date;

  end_Date: Date;

  status: StatusProject;

  budget: number;

  image: string;

  individual_id: number;

  site_manager_id: number;

  project_type: ProjectType;

  address_id: number;
}
