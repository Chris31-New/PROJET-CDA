export interface PlanningItem {
    id: number;
    name: string;
    start_date: Date;
    end_date: Date;
    status:
    | "TO_DO"
    | "IN_PROGRESS"
    | "DONE"
    | "BLOCKED"
    | "UNAVAIBLE"
    | "PLANNED"
    | "COMPLETED"
    | "CANCELLED";
    companyName?: string,
}