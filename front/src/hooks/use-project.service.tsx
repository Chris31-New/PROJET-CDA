import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { Project, ProjectStatus } from "../interfaces/project";
import { ProjectsApi } from "../services/api/projects.api";
import { useToastStore } from "../store/toast.store";

export function useGetProjects(): UseQueryResult<Project[], Error> {
  return useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: ProjectsApi.getAll,
  });
}

export function useGetOwnProjects(
  status?: ProjectStatus,
): UseQueryResult<Project[], Error> {
  return useQuery<Project[], Error>({
    queryKey: ["projects", "own", status],
    queryFn: () => ProjectsApi.getOwn(status),
  });
}

export function useAddCompanyToProject(): UseMutationResult<void,Error,{ projectId: number; companyIds: number[] }> {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ projectId, companyIds }) =>
      ProjectsApi.addCompaniesToProject(projectId, companyIds),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      addToast("Companies added to project", "success");
    },
    onError: () => {
      addToast("Failed to add companies", "error");
    },
  });
}

export function useRemoveCompanyFromProject(): UseMutationResult < void, Error, { projectId: number; companyId: number }> {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ projectId, companyId }) =>
      ProjectsApi.removeCompanyFromProject(projectId, companyId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      addToast("Company removed from project", "success");
    },
    onError: () => {
      addToast("Failed to remove company", "error");
    },
  });
}


export function useGetProjectById(id: number): UseQueryResult<Project, Error> {
  return useQuery<Project, Error>({
    queryKey: ["project", id],
    queryFn: () => ProjectsApi.getById(id),
    enabled: !!id,
  });
}
export function useCreateProject(): UseMutationResult<
  Project,
  Error,
  Omit<Project, "id">
> {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (payload: Omit<Project, "id">) => ProjectsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      addToast("new project created", "success");
    },
    onError: () => {
      addToast("Failed to create", "error");
    },
  });
}
export function useUpdateProject(): UseMutationResult<Project, Error, Project> {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (project: Project) => ProjectsApi.updateProject(project),
    onSuccess: (data) => {
      queryClient.setQueryData<Project[]>(["projects"], (old) => {
        if (!old) return [];
        return old.map((project) => (project.id === data.id ? data : project));
      });

      queryClient.setQueryData<Project>(["project", data.id], data);
      addToast("project updated", "success");
    },
    onError: () => {
      addToast("Failed to update", "error");
    },
  });
}


export function useDeleteProject(): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: number) => ProjectsApi.deleteProject(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Project[]>(["projects"], (oldProjects) => {
        if (!oldProjects) return [];
        return oldProjects.filter((p) => p.id !== id);
      });

      addToast("Project deleted", "success");
    },
    onError: () => {
      addToast("Failed to delete", "error");
    },
  });
}
