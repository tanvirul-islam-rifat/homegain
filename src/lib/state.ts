import { isValidDateKey } from "./dates";
import { isDayNumber, type Weekday } from "./schedule";
import type { AppState, Settings, WeekState } from "./types";
import { DAYS_IN_WEEK, emptyTicks } from "./week";

export const STORAGE_KEY = "homegain";
export const STATE_VERSION = 1;

export const DEFAULT_SETTINGS: Settings = {
  weekStartsOn: 6,
  units: "metric",
  bmiScale: "asia",
  theme: "dark",
  heightCm: 170.18,
};

export const DEFAULT_WEIGHT_KG = 65;

/** A fixed epoch keeps the server render and first client render identical. */
export const EPOCH_ISO = "2026-01-01T00:00:00.000Z";

export function defaultState(): AppState {
  return {
    settings: { ...DEFAULT_SETTINGS },
    week: { ticks: emptyTicks(), startedAt: EPOCH_ISO, phase: "active", lastTicked: null },
    weeksCompleted: 0,
    completedWeeks: [],
    weightLog: [],
    mealChecks: {},
    setChecks: {},
    waterByDate: {},
  };
}

export interface PersistedEnvelope {
  version: number;
  state: unknown;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const oneOf = <T extends string>(v: unknown, opts: readonly T[], fallback: T): T =>
  typeof v === "string" && (opts as readonly string[]).includes(v) ? (v as T) : fallback;
const num = (v: unknown, fallback: number, min: number, max: number): number =>
  typeof v === "number" && Number.isFinite(v) && v >= min && v <= max ? v : fallback;
const boolMap = (v: unknown): Record<string, boolean> =>
  isObj(v) ? Object.fromEntries(Object.entries(v).filter(([, x]) => typeof x === "boolean")) as Record<string, boolean> : {};
const numMap = (v: unknown): Record<string, number> =>
  isObj(v)
    ? (Object.fromEntries(Object.entries(v).filter(([, x]) => typeof x === "number" && Number.isFinite(x))) as Record<string, number>)
    : {};

/**
 * Turn anything (old version, hand-edited backup, partial object) into a
 * valid AppState. Unknown or broken fields fall back to defaults.
 */
export function sanitizeState(raw: unknown): AppState {
  const d = defaultState();
  if (!isObj(raw)) return d;

  const s = isObj(raw.settings) ? raw.settings : {};
  const wsRaw = s.weekStartsOn;
  const settings: Settings = {
    weekStartsOn:
      typeof wsRaw === "number" && Number.isInteger(wsRaw) && wsRaw >= 0 && wsRaw <= 6
        ? (wsRaw as Weekday)
        : d.settings.weekStartsOn,
    units: oneOf(s.units, ["metric", "imperial"] as const, d.settings.units),
    bmiScale: oneOf(s.bmiScale, ["who", "asia"] as const, d.settings.bmiScale),
    theme: oneOf(s.theme, ["system", "dark", "light"] as const, d.settings.theme),
    heightCm: num(s.heightCm, d.settings.heightCm, 100, 250),
  };

  const w = isObj(raw.week) ? raw.week : {};
  const ticksRaw = Array.isArray(w.ticks) ? w.ticks : [];
  const ticks = Array.from({ length: DAYS_IN_WEEK }, (_, i) => ticksRaw[i] === true);
  const week: WeekState = {
    ticks,
    startedAt: typeof w.startedAt === "string" ? w.startedAt : d.week.startedAt,
    phase: w.phase === "celebrating" ? "celebrating" : "active",
    lastTicked:
      typeof w.lastTicked === "number" && isDayNumber(w.lastTicked + 1) ? w.lastTicked : null,
  };

  const completedWeeks = Array.isArray(raw.completedWeeks)
    ? raw.completedWeeks
        .filter((c): c is { completedAt: string } => isObj(c) && typeof c.completedAt === "string")
        .map((c) => ({ completedAt: c.completedAt }))
    : [];

  const weightLog = Array.isArray(raw.weightLog)
    ? raw.weightLog
        .filter(
          (e): e is { date: string; kg: number } =>
            isObj(e) && isValidDateKey(e.date) && typeof e.kg === "number" && e.kg >= 25 && e.kg <= 300,
        )
        .map((e) => ({ date: e.date, kg: e.kg }))
        .sort((a, b) => a.date.localeCompare(b.date))
    : [];

  const weeksCompleted = num(raw.weeksCompleted, completedWeeks.length, 0, 100_000);

  return {
    settings,
    week,
    weeksCompleted: Math.floor(weeksCompleted),
    completedWeeks,
    weightLog,
    mealChecks: boolMap(raw.mealChecks),
    setChecks: boolMap(raw.setChecks),
    waterByDate: numMap(raw.waterByDate),
  };
}

/** Versioned migration. Add a case per future version bump. */
export function migrate(envelope: unknown): AppState {
  if (!isObj(envelope)) return defaultState();
  const version = typeof envelope.version === "number" ? envelope.version : 0;
  let state: unknown = envelope.state;
  if (version < 1) {
    // v0 had no envelope fields beyond the state itself.
    state = isObj(envelope.state) ? envelope.state : envelope;
  }
  return sanitizeState(state);
}

export function serialize(state: AppState): string {
  const envelope: PersistedEnvelope = { version: STATE_VERSION, state };
  return JSON.stringify(envelope);
}
