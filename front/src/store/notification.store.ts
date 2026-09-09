import { create } from "zustand";
import type { userHasNotif } from "../interfaces/notification";
import { NotificationsApi } from "../services/api/notifications.api";

interface NotificationState {
  notifications: userHasNotif[];
  isLoading: boolean;
  error: string | null;

  fetchNotifications: () => Promise<void>;
  markAsRead: (notif: userHasNotif) => Promise<void>;
  markAllAsRead: () => Promise<void>;

  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true, error: null });

      const data = await NotificationsApi.getAll();

      set({
        notifications: data,
        isLoading: false,
      });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        isLoading: false,
      });
    }
  },

  markAsRead: async (notif) => {
    try {
      const updatedNotif = await NotificationsApi.maskAsRead(notif);

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.notification.id === updatedNotif.notification.id ? updatedNotif : n,
        ),
      }));
    } catch (err) {
      console.error("Error marking as read", err);
    }
  },

  markAllAsRead: async () => {
    const currentNotifs = get().notifications;

    const updated = await Promise.all(
      currentNotifs.map((notif) =>
        notif.reading_date ? notif : NotificationsApi.maskAsRead(notif),
      ),
    );

    set({ notifications: updated });
  },

  unreadCount: () => get().notifications.filter((n) => !n.reading_date).length,
}));
