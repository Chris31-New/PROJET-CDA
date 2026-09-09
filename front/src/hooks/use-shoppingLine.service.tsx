import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { ShoppingLinesApi } from "../services/api/shoppingLines.api";
import type { ShoppingLine } from "../interfaces/shopping_line";
import type { Article } from "../interfaces/article";
import type { Category } from "../interfaces/category";
import { useToastStore } from "../store/toast.store";

export function useGetShoppingLineByTask(
  idTask: number,
): UseQueryResult<ShoppingLine[], Error> {
  return useQuery<ShoppingLine[], Error>({
    queryKey: ["shoppingLines", "task", idTask], // ✅ queryKey corrigée
    queryFn: () => ShoppingLinesApi.getAllByTask(idTask),
    enabled: Number.isFinite(idTask) && idTask > 0,
  });
}

export function useGetArticlesByCategory(
  idCategory: number,
): UseQueryResult<Article[], Error> {
  return useQuery<Article[], Error>({
    queryKey: ["articles", idCategory], // ✅ queryKey corrigée
    queryFn: () => ShoppingLinesApi.getAllArticles(idCategory),
    enabled: Number.isFinite(idCategory) && idCategory > 0,
  });
}

export function useGetCategories(): UseQueryResult<Category[], Error> {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: ShoppingLinesApi.getAllCategories,
  });
}

export function useCreateShoppingLine(): UseMutationResult<
  ShoppingLine,
  Error,
  Omit<ShoppingLine, "id">
> {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (payload: Omit<ShoppingLine, "id">) =>
      ShoppingLinesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingLines"] });
      addToast("Shopping line created", "success");
    },
    onError: () => {
      addToast("Failed to create", "error");
    },
  });
}

export function useUpdateShoppingLine(): UseMutationResult<
  ShoppingLine,
  Error,
  ShoppingLine
> {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (shop: ShoppingLine) =>
      ShoppingLinesApi.updateShoppingLine(shop),
    onSuccess: (updatedShoppingLine) => {
      queryClient.setQueryData<ShoppingLine[]>(["shoppingLines"], (old) =>
        old?.map((shop) =>
          shop.id === updatedShoppingLine.id ? updatedShoppingLine : shop,
        ),
      );
      addToast("Shopping line updated", "success");
    },
    onError: () => {
      addToast("Failed to update", "error");
    },
  });
}

export function useDeleteShoppingLine(): UseMutationResult<
  ShoppingLine, // ✅ retourne ShoppingLine et non ShoppingLine[]
  Error,
  number
> {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: number) => ShoppingLinesApi.deleteShoppingLine(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<ShoppingLine[]>(["shoppingLines"], (old) =>
        old?.filter((s) => s.id !== id)
      );
      addToast("Shopping line deleted", "success");
    },
    onError: () => {
      addToast("Failed to delete", "error");
    },
  });
}