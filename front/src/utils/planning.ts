import { addBusinessDays, addDays, differenceInBusinessDays, differenceInDays, endOfDay } from "date-fns";

export function getWeekEnd(weekStart: Date, daysCount: number, business = false): Date {
    const end = business
        ? addBusinessDays(weekStart, daysCount - 1)
        : addDays(weekStart, daysCount - 1);
    
        return endOfDay(end);
}

export function overlaps(firstStart: Date, firstEnd: Date, secondStart: Date, secondEnd: Date): boolean {
    return firstStart <= secondEnd && firstEnd >= secondStart;
}

export function getOffset(
    date: Date,
    start: Date,
    business = false
): number {
    return business ?
        differenceInBusinessDays(date, start)
        : differenceInDays(date, start);
}

export function clamp(n: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, n));
}