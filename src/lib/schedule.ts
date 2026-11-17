export type DayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

export const DAY_NUMBERS: DayNumber[] = [1, 2, 3, 4, 5, 6, 7];

export const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export const WEEKDAY_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/** Weekday (0 = Sunday) that plan Day N falls on, given the weekday of Day 1. */
export function weekdayOfDay(day: DayNumber, weekStartsOn: Weekday): Weekday {
  return ((weekStartsOn + day - 1) % 7) as Weekday;
}

/** Plan day that falls on a given weekday. */
export function dayForWeekday(weekday: Weekday, weekStartsOn: Weekday): DayNumber {
  return ((((weekday - weekStartsOn) % 7) + 7) % 7 + 1) as DayNumber;
}

/** Plan day for a date in the device time zone. */
export function dayForDate(date: Date, weekStartsOn: Weekday): DayNumber {
  return dayForWeekday(date.getDay() as Weekday, weekStartsOn);
}

export function isDayNumber(n: unknown): n is DayNumber {
  return typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= 7;
}

export function parseDayParam(value: string | null | undefined): DayNumber | null {
  if (!value) return null;
  const n = Number(value);
  return isDayNumber(n) ? n : null;
}
