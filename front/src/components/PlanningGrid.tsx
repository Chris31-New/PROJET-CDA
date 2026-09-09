import { useMemo, useState } from "react";
import type { PlanningItem } from "../interfaces/planning-item"
import { getWeekEnd, overlaps } from "../utils/planning";
import { addBusinessDays, addDays, endOfDay, format, startOfDay } from "date-fns";
import * as local from "date-fns/locale";
import PlanningRow from "./PlanningRow";
import { StatusColors } from "../utils/status.color";

type Props = {
    items: PlanningItem[];
    weekStart: Date;
    businessDaysOnly: boolean;
}

export const PlanningGrid = ({ items, weekStart, businessDaysOnly }: Props) => {
    const daysCount = businessDaysOnly ? 5 : 7;
    const [mobileDayIndex, setMobileDayIndex] = useState<number>(0)

    const weekEnd = useMemo(
        () => getWeekEnd(weekStart, daysCount, businessDaysOnly),
        [weekStart, daysCount, businessDaysOnly]
    );

    const days = useMemo(() => {
        const add = businessDaysOnly ? addBusinessDays : addDays;
        return Array.from({ length: daysCount }, (_, i) => add(weekStart, i));
    }, [weekStart, daysCount, businessDaysOnly]);

    const itemsInWeek = useMemo(() => {
        return items.filter((item) => {
            return overlaps(item.start_date, item.end_date, weekStart, weekEnd);
        })
    }, [items, weekStart, weekEnd]);

    const selectedDay = days[mobileDayIndex];

    const itemsForSelectedDay = useMemo(() => {
        if (!selectedDay) return [];

        const currentDayStart = startOfDay(selectedDay);
        const currentDayEnd = endOfDay(selectedDay);

        return itemsInWeek.filter((item) => {
            const itemStart = startOfDay(new Date(item.start_date));
            const itemEnd = endOfDay(new Date(item.end_date));

            return itemStart <= currentDayEnd && itemEnd >= currentDayStart
        });
    }, [itemsInWeek, selectedDay]);

    const statusColor = StatusColors;

    return (
        <>
            {/* MOBILE */}
            <div className="md:hidden">
                <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <button
                            onClick={() =>
                                setMobileDayIndex((prev) => Math.max(0, prev - 1))
                            }
                            disabled={mobileDayIndex === 0}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-50"
                        >
                            ←
                        </button>

                        <div className="text-center">
                            <p className="font-semibold">
                                {selectedDay
                                    ? format(selectedDay, "EEEE dd MMM", { locale: local.enGB })
                                    : ""}
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                setMobileDayIndex((prev) =>
                                    Math.min(daysCount - 1, prev + 1)
                                )
                            }
                            disabled={mobileDayIndex === daysCount - 1}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-50"
                        >
                            →
                        </button>
                    </div>

                    <div className="p-4 space-y-3">
                        {itemsForSelectedDay.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                No tasks for today.
                            </p>
                        ) : (
                            itemsForSelectedDay.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-xl border border-gray-200 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-semibold">
                                                {item.companyName
                                                    ? `${item.companyName} / ${item.name}`
                                                    : item.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {format(item.start_date, "dd/MM/yyyy")} - {format(item.end_date, "dd/MM/yyyy")}
                                            </p>
                                        </div>

                                        <span className="text-xs px-2 py-1 rounded-full w-full" style={{ background: statusColor[item.status] }}>
                                            {item.status !== "UNAVAIBLE" ? item.status : ""}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* DESKTOP */}
            <div
                className="hidden md:grid rounded-xl border border-gray-200 overflow-hidden"
                style={{ gridTemplateColumns: `220px repeat(${daysCount}, 1fr)` }}
            >
                <div className="p-3 font-semibold border-b border-gray-200 bg-white">
                    Tâches
                </div>

                {days.map((day) => (
                    <div
                        key={day.toISOString()}
                        className="p-3 text-center font-semibold text-sm border-b border-gray-200 bg-white"
                    >
                        {format(day, "EEE dd", { locale: local.enGB })}
                    </div>
                ))}

                {itemsInWeek.map((item) => (
                    <PlanningRow
                        key={item.id}
                        item={item}
                        rangeStart={weekStart}
                        daysCount={daysCount}
                        businessDaysOnly={businessDaysOnly}
                    />
                ))}
            </div>
        </>
    )
}