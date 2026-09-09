import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { Task } from "../interfaces/task";
import { TasksApi } from "../services/api/tasks.api";
import { useToastStore } from "../store/toast.store";

export function useGetTasks(projectId: number): UseQueryResult<Task[], Error> {
  return useQuery<Task[], Error>({
    queryKey: ["tasks", "project", projectId],
    queryFn: () => TasksApi.getByProject(projectId),
    enabled: Number.isFinite(projectId) && projectId > 0,
  });
}

export function useGetAllTasks(): UseQueryResult<Task[], Error> {
  return useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: () => TasksApi.getAll(),
  });
}

export function useGetTaskById(id: number): UseQueryResult<Task, Error> {
  return useQuery<Task, Error>({
    queryKey: ["tasks", "detail", id],
    queryFn: () => TasksApi.getById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useCreateTask(): UseMutationResult<
  Task,
  Error,
  Omit<Task, "id">
> {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (payload: Omit<Task, "id">) => TasksApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      addToast("new task created", "success");
    },
    onError: () => {
      addToast("Failed to create", "error");
    },
  });
}

export function useUpdateTask(): UseMutationResult<Task, Error, Task> {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (task: Task) => TasksApi.updateTask(task),
    onSuccess: (updateTask) => {
      queryClient.setQueryData<Task[]>(["tasks"], (old) =>
        old?.map((task) => (task.id === updateTask.id ? updateTask : task)),
      );
      addToast("task updated", "success");
    },
    onError: () => {
      addToast("Failed to update", "error");
    },
  });
}

export function useDeleteTask(): UseMutationResult<Task, Error, number> {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: number) => TasksApi.deleteTask(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Task[]>(["tasks"], (old) =>
        old?.filter((t) => t.id !== id)
      );
      addToast("task deleted", "success");
    },
    onError: () => {
      addToast("Failed to delete", "error");
    },
  });
}
