import type { Task } from "../../interfaces/task";
import { api } from "../../utils/axios.client";

export class Project_Tasks {
    static async getTasksOnProject(projectId: number): Promise<Task[]> {
        const { data } = await api.get<Task[]>(`/planning/projects/${projectId}/tasks`);
        return data;
    }
}