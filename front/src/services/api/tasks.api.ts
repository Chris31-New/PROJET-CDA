import type { Task } from "../../interfaces/task";
import { api } from "../../utils/axios.client";

export class TasksApi {
  static async getAll(): Promise<Task[]> {
    const { data } = await api.get<Task[]>("/tasks");
    return data;
  }

  static async getByProject(projectId: number): Promise<Task[]> {
  const { data } = await api.get<Task[]>(`/tasks?projectId=${projectId}`);
  return data;
}

  static async getById(id: number): Promise<Task> {
    const { data } = await api.get<Task>(`/tasks/${id}`);
    return data;
  }

  static async create(task: Omit<Task, "id">): Promise<Task> {
    const { data } = await api.post<Task>("/tasks", task);
    return data;
  }

  static async updateTask(task: Task): Promise<Task> {
    const { data } = await api.post<Task>(`/tasks/${task.id}/update`, task);
    return data;
  }

  static async deleteTask(id: number): Promise<Task> {
    const { data } = await api.delete<Task>(`/tasks/${id}`);
    return data;
  }
}