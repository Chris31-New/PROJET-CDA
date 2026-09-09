import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { NotificationsApi } from "../services/api/notifications.api";
import type { userHasNotif } from "../interfaces/notification";

export function useGetNotifications(): UseQueryResult<userHasNotif[], Error> {
  return useQuery<userHasNotif[], Error>({
    queryKey: ["notifications"],
    queryFn: NotificationsApi.getAll,
  });
}
