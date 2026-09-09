import { useMemo } from "react";
import type { PlanningItem } from "../../interfaces/planning-item";
import { useGetTasks } from "../use-task.service";

export function usePlanningItems(
    selectedProjectId: number,
): PlanningItem[] {
    const { data: tasks = [] } = useGetTasks(selectedProjectId);

    const items = useMemo<PlanningItem[]>(() => {
        return tasks.map((task) => ({
            id: task.id,
            name: task.name,
            start_date: new Date(task.start_date),
            end_date: new Date(task.end_date),
            status: task.status
        }));
    }, [tasks, selectedProjectId]);

    return items
}