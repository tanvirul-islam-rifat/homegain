import type { BmiScale } from "./bmi";
import type { Weekday } from "./schedule";

export type Units = "metric" | "imperial";
export type Theme = "system" | "dark" | "light";

export interface Settings {
  /** Weekday of plan Day 1. 0 = Sunday. Default 6 (Saturday). */
  weekStartsOn: Weekday;
  units: Units;
  bmiScale: BmiScale;
  theme: Theme;
  heightCm: number;
}

export interface WeekState {
  /** length 7, index 0 = Day 1 */
  ticks: boolean[];
  /** ISO timestamp */
  startedAt: string;
  phase: "active" | "celebrating";
  /** index of the most recent tick, used by Undo during the celebration */
  lastTicked: number | null;
}

export interface WeightEntry {
  /** yyyy-mm-dd */
  date: string;
  kg: number;
}

export interface AppState {
  settings: Settings;
  week: WeekState;
  weeksCompleted: number;
  completedWeeks: { completedAt: string }[];
  weightLog: WeightEntry[];
  /** Phase 2 (reserved) */
  mealChecks: Record<string, boolean>;
  setChecks: Record<string, boolean>;
  waterByDate: Record<string, number>;
}
