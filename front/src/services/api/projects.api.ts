import type { Project, ProjectStatus } from "../../interfaces/project";

import { api } from "../../utils/axios.client";

export class ProjectsApi {
  static counterId = 4;

  static async getAll(): Promise<Project[]> {
    const { data } = await api.get<Project[]>(`/projects`);

    return data;
  }

  static async addCompaniesToProject(projectId: number, companyIds: number[]): Promise<void> {
  await api.post(`/projects/${projectId}/companies`, { company_ids: companyIds });
}

  static async removeCompanyFromProject(projectId: number, companyId: number): Promise<void> {
    await api.delete(`/projects/${projectId}/companies/${companyId}`);
  }

  static async getOwn(status?: ProjectStatus): Promise<Project[]> {
    const url = status ? `/projects/own?status=${status}` : "/projects/own";
    const { data } = await api.get<Project[]>(url);
    return data;
  }

  static async getById(id: number): Promise<Project> {
    const { data } = await api.get<Project>(`/projects/${id}`);
    if (!data) {
      throw new Error("Project not found");
    }
    return data;
  }
  static async create(project: Omit<Project, "id">): Promise<Project> {
    const { data } = await api.post<Project>(`/projects`, project);
    return data;
  }
  static async updateProject(project: Project): Promise<Project> {
    const { id, ...projectData } = project;
    const { data } = await api.patch<Project>(`/projects/${id}`, projectData);
    return data;
  }

  static async deleteProject(id: number): Promise<void> {
    const { data } = await api.delete<Project>(`/projects/${id}`);
    console.log("🚀 ~ ProjectsApi ~ deleteProject ~ data:", data);

    return;
  }
}
