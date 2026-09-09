import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";
import type { Profile, User } from "../interfaces/user";
import { UsersApi } from "../services/api/users.api";
import { useToastStore } from "../store/toast.store";

export function useGetClients(): UseQueryResult<User[], Error> {
  return useQuery<User[], Error>({
    queryKey: ["clients"],
    queryFn: () => UsersApi.getAllIndividual(),
  });
}

export function useGetUserProfile(userId: number | undefined): UseQueryResult<Profile | null, Error> {
  return useQuery<Profile | null, Error>({
    queryKey: ["user-profile", userId],
    queryFn: () => UsersApi.getUserProfile(userId),
  })
}

export function useCreateProfile(): UseMutationResult<Profile, Error, Profile> {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (payload: Profile) => UsersApi.createProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      addToast("Profile Created", "success");
    },
    onError: () => {
      addToast("Failed to create", "error");
    },
  })
}

export function useUpdateProfile(): UseMutationResult<Profile, Error, Profile> {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (profile: Profile) => UsersApi.updateProfile(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      addToast("Profile Updated", "success");
    },
    onError: () => {
      addToast("Failed to Update", "error");
    }
  })
}