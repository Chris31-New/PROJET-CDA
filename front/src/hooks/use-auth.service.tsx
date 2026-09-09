import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthResponse, SigninData, SignupData } from "../types/auth.type";
import { useAuthStore } from "../store/auth.store";
import { AuthApi } from "../services/api/auth.api";
import { useToastStore } from "../store/toast.store";

export function useSignIn() {
  const { setUser, setAccessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation<AuthResponse, Error, SigninData>({
    mutationFn: (payload) => AuthApi.login(payload),
    onSuccess: (res) => {
      setUser(res.user);
      setAccessToken(res.accessToken);
      queryClient.invalidateQueries({ queryKey: ["session"] });
      addToast("Login successful", "success");
    },
    onError: () => {
      addToast("Login failed", "error");
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation<AuthResponse, Error, SignupData>({
    mutationFn: (payload) => AuthApi.register(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      addToast("Registration successful", "success");
    },
    onError: () => {
      addToast("Registration failed", "error");
    },
  });
}

export function useRefreshToken() {
  const { setUser, setAccessToken, accessToken } = useAuthStore();

  return useQuery({
    queryKey: ["refresh"],
    queryFn: async () => {
      const res = await AuthApi.refresh();
      setUser(res.user);
      setAccessToken(res.accessToken);
      return res;
    },
    enabled: !accessToken,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
