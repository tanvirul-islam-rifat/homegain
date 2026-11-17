import type { AppState, WeekState } from "./types";

export const DAYS_IN_WEEK = 7;

export function emptyTicks(): boolean[] {
  return Array.from({ length: DAYS_IN_WEEK }, () => false);
}

export function freshWeek(nowIso: string): WeekState {
  return { ticks: emptyTicks(), startedAt: nowIso, phase: "active", lastTicked: null };
}

export function allTicked(ticks: boolean[]): boolean {
  return ticks.length === DAYS_IN_WEEK && ticks.every(Boolean);
}

export function tickCount(ticks: boolean[]): number {
  return ticks.filter(Boolean).length;
}

/** Toggle Day (index 0..6). Ticking the 7th day starts the celebration. */
export function toggleTick(state: AppState, index: number): AppState {
  if (index < 0 || index >= DAYS_IN_WEEK) return state;
  // While celebrating, the week is locked: only Undo or completion change it.
  if (state.week.phase === "celebrating") return state;
  const ticks = state.week.ticks.slice();
  ticks[index] = !ticks[index];
  const phase = allTicked(ticks) ? "celebrating" : "active";
  return {
    ...state,
    week: {
      ...state.week,
      ticks,
      phase,
      lastTicked: ticks[index] ? index : state.week.lastTicked,
    },
  };
}

/** Cancel the 7th tick during the celebration. */
export function undoCelebration(state: AppState): AppState {
  if (state.week.phase !== "celebrating") return state;
  const ticks = state.week.ticks.slice();
  const idx = state.week.lastTicked ?? DAYS_IN_WEEK - 1;
  ticks[idx] = false;
  return { ...state, week: { ...state.week, ticks, phase: "active", lastTicked: null } };
}

/** Count the week and reset the tracker to its initial state. */
export function completeWeek(state: AppState, nowIso: string): AppState {
  if (state.week.phase !== "celebrating" && !allTicked(state.week.ticks)) return state;
  return {
    ...state,
    weeksCompleted: state.weeksCompleted + 1,
    completedWeeks: [...state.completedWeeks, { completedAt: nowIso }],
    week: freshWeek(nowIso),
  };
}

/** On app load: a week left mid-celebration (tab closed) still resets. */
export function normalizeOnLoad(state: AppState, nowIso: string): AppState {
  if (state.week.phase === "celebrating" || allTicked(state.week.ticks)) {
    return completeWeek({ ...state, week: { ...state.week, phase: "celebrating" } }, nowIso);
  }
  return state;
}
