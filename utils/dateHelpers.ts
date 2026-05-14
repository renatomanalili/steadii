import {
  startOfWeek,
  endOfWeek,
  format,
  differenceInDays,
  parseISO,
  isToday,
  isYesterday,
  eachDayOfInterval,
} from "date-fns";
import { BPReading, DayCompliance } from "../types";

export function getWeekRange(date: Date): {
  monday: Date;
  sunday: Date;
  mondayIso: string;
  sundayIso: string;
} {
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  const sunday = endOfWeek(date, { weekStartsOn: 1 });

  return {
    monday,
    sunday,
    mondayIso: monday.toISOString(),
    sundayIso: sunday.toISOString(),
  };
}

export function formatReadingDate(isoString: string): string {
  const date = parseISO(isoString);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEE, MMM d");
}

export function formatReadingTime(isoString: string): string {
  return format(parseISO(isoString), "h:mm a");
}

export function groupReadingsByWeek(
  readings: BPReading[],
): Record<string, BPReading[]> {
  const groups: Record<string, BPReading[]> = {};

  readings.forEach((reading) => {
    const date = parseISO(reading.loggedAt);
    const monday = startOfWeek(date, { weekStartsOn: 1 });
    const key = format(monday, "MMM d, yyyy");

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(reading);
  });

  return groups;
}

export function calculateStreak(readings: BPReading[]): number {
  if (readings.length === 0) return 0;

  const uniqueDays = [
    ...new Set(
      readings.map((r) => format(parseISO(r.loggedAt), "yyyy-MM-dd")),
    ),
  ]
    .sort()
    .reverse();

  if (uniqueDays.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();

  for (const day of uniqueDays) {
    const dayDate = parseISO(day);
    const diff = differenceInDays(currentDate, dayDate);

    if (diff <= 1) {
      streak++;
      currentDate = dayDate;
    } else {
      break;
    }
  }

  return streak;
}

export function getComplianceForPeriod(
  readings: BPReading[],
  startDate: Date,
  endDate: Date,
): DayCompliance[] {
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return days.map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");

    const dayReadings = readings.filter((r) =>
      r.loggedAt.startsWith(dayStr),
    );

    const hasAM = dayReadings.some((r) => r.period === "AM");
    const hasPM = dayReadings.some((r) => r.period === "PM");

    let status: DayCompliance["status"] = "none";
    if (hasAM && hasPM) status = "both";
    else if (hasAM || hasPM) status = "one";

    return { date: dayStr, status };
  });
}

export function calculateGoalProgress(
  startDate: string,
  endDate: string,
): {
  totalDays: number;
  daysPassed: number;
  daysLeft: number;
  percentComplete: number;
} {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const today = new Date();

  const totalDays = differenceInDays(end, start);
  const daysPassed = Math.min(
    Math.max(differenceInDays(today, start), 0),
    totalDays,
  );
  const daysLeft = Math.max(totalDays - daysPassed, 0);
  const percentComplete = Math.round((daysPassed / totalDays) * 100);

  return { totalDays, daysPassed, daysLeft, percentComplete };
}

export function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = differenceInDays(date, start);
  return Math.ceil((diff + start.getDay() + 1) / 7);
}
