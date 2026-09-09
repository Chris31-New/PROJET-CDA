import type { PlanningItem } from "../interfaces/planning-item";

export const StatusColors: Record<PlanningItem["status"], string> = {
    "TO_DO": "#51A2FF",
    "IN_PROGRESS": "#C27AFF",
    DONE: "#9AE600",
    BLOCKED: "#FB2C36",
    UNAVAIBLE: "#FB2C36",
    PLANNED: "#51A2FF",
    COMPLETED: "#9AE600",
    CANCELLED: "#868686",
};