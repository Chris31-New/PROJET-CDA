export interface userHasNotif {
  user_id: number;
  notification: Notification;
  reading_date: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface Notification {
  id: number;
  genericNotification: GenericNotif;
  send_date: Date;
  task_id?: number;
  project_id?: number;
  is_archived: boolean;
}
export interface GenericNotif {
  id: number;
  title: string;
  type: TypeNotifEnum;
  message: string;
}
export type TypeNotifEnum = "INFO" | "WARNING" | "ALERT";
export const badgeColor = {
  INFO: "bg-blue-100 text-blue-700 border-blue-400",
  WARNING: "bg-yellow-100 text-yellow-700 border-yellow-400",
  ALERT: "bg-red-100 text-red-700 border-red-400",
};
export const notifColors = {
  INFO: "border-blue-500",
  WARNING: "border-yellow-500",
  ALERT: "border-red-500",
};
