import { daysBetween } from "./dates";
import type { WeightEntry } from "./types";

export const TARGET_MIN_PER_WEEK = 0.25;
export const TARGET_MAX_PER_WEEK = 0.5;

export function sortLog(log: WeightEntry[]): WeightEntry[] {
  return log.slice().sort((a, b) => a.date.localeCompare(b.date));
}

/** Add or replace the entry for a date. */
export function upsertEntry(log: WeightEntry[], entry: WeightEntry): WeightEntry[] {
  return sortLog([...log.filter((e) => e.date !== entry.date), entry]);
}

export type CheckInStatus = "need-data" | "slow" | "fast" | "on-track";

export interface CheckIn {
  status: CheckInStatus;
  /** kg per week, rounded to 2 decimals */
  ratePerWeek: number | null;
  message: string;
}

export const CHECKIN_MESSAGES: Record<CheckInStatus, string> = {
  "need-data": "Log your weight once a week (same day and time) to get a check-in.",
  slow: "Add 1 more potato or a glass of milk.",
  fast: "Cut the bedtime snack or a few potatoes.",
  "on-track": "Right on track. Keep going.",
};

/**
 * Latest weekly change: compares the newest entry with the most recent
 * earlier entry that is at least 5 days older, scaled to a 7-day rate.
 */
export function weeklyCheckIn(log: WeightEntry[]): CheckIn {
  const sorted = sortLog(log);
  const latest = sorted[sorted.length - 1];
  if (!latest) return { status: "need-data", ratePerWeek: null, message: CHECKIN_MESSAGES["need-data"] };
  for (let i = sorted.length - 2; i >= 0; i--) {
    const prev = sorted[i];
    const days = daysBetween(prev.date, latest.date);
    if (days >= 5) {
      const rate = Math.round(((latest.kg - prev.kg) / days) * 7 * 100) / 100;
      const status: CheckInStatus =
        rate < TARGET_MIN_PER_WEEK ? "slow" : rate > TARGET_MAX_PER_WEEK ? "fast" : "on-track";
      return { status, ratePerWeek: rate, message: CHECKIN_MESSAGES[status] };
    }
  }
  return { status: "need-data", ratePerWeek: null, message: CHECKIN_MESSAGES["need-data"] };
}

/** Target band (kg) for a date, measured from the first logged weight. */
export function targetBand(first: WeightEntry, date: string): { low: number; high: number } {
  const weeks = Math.max(0, daysBetween(first.date, date)) / 7;
  return {
    low: first.kg + TARGET_MIN_PER_WEEK * weeks,
    high: first.kg + TARGET_MAX_PER_WEEK * weeks,
  };
}
