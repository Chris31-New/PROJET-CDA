import type { userHasNotif } from "../../interfaces/notification";
import { api } from "../../utils/axios.client";

export class NotificationsApi {
  static async getAll(): Promise<userHasNotif[]> {
    const { data } = await api.get<userHasNotif[]>(`/notifications/own`);
    return data;
  }

  static async maskAsRead(notif: userHasNotif): Promise<userHasNotif> {
    const { data } = await api.patch<userHasNotif>(
      `/notifications/${notif.notification.id}`,
    );
    return data;
  }
}
