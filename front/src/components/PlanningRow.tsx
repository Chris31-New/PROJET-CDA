import { format } from "date-fns";
import type { PlanningItem } from "../interfaces/planning-item"
import { clamp, getOffset } from "../utils/planning";
import { StatusColors } from "../utils/status.color";

type PlanningRowProps = {
    item: PlanningItem;
    rangeStart: Date;
    daysCount: number;
    businessDaysOnly: boolean;
}

export default function PlanningRow({ item, rangeStart, daysCount, businessDaysOnly }: PlanningRowProps) {

    const start = item.start_date;
    const end = item.end_date;

    const startOffset = getOffset(start, rangeStart, businessDaysOnly);
    const endOffset = getOffset(end, rangeStart, businessDaysOnly);

    const clampedStart = clamp(startOffset, 0, daysCount - 1);
    const clampedEnd = clamp(endOffset, 0, daysCount - 1);
    const span = Math.max(1, clampedEnd - clampedStart + 1);

    const statusColor = StatusColors

    return (
        <>
            {/* Nom */}
            <div
                className="px-3 flex flex-col border-b border-gray-200 bg-white"
                style={{ height: 100 }}
            >
                <span>{item.companyName ? `${item.companyName} / ${item.name}` : item.name}</span>
                <span className="text-xs text-gray-500">
                    {format(item.start_date, "dd/MM/yyyy")} / {format(item.end_date, "dd/MM/yyyy")}
                </span>
            </div>

            {/* Planning */}
            <div
                className="relative border-b border-gray-200 bg-white"
                style={{ gridColumn: `2 / span ${daysCount}`, height: 100 }}
            >
                {/* Barre */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 h-8 rounded-full shadow-md p-1 text-white"
                    style={{
                        backgroundColor: statusColor[item.status],
                        left: `calc(${(clampedStart / daysCount) * 100}% )`,
                        width: `calc(${(span / daysCount) * 100}% )`,
                    }}
                    title={`${item.name} (${format(item.start_date, "dd/MM/yyyy")} → ${format(
                        item.end_date,
                        "dd/MM/yyyy"
                    )})`}
                >
                    {item.status !== "UNAVAIBLE" ? item.status : ""}
                </div>
            </div>
        </>
    )
}
