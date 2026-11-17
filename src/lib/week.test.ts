import { describe, expect, it } from "vitest";
import { defaultState, migrate, serialize } from "./state";
import type { AppState } from "./types";
import { completeWeek, normalizeOnLoad, tickCount, toggleTick, undoCelebration } from "./week";

const NOW = "2026-11-18T10:00:00.000Z";

function tickAll(s: AppState): AppState {
  let state = s;
  for (let i = 0; i < 7; i++) state = toggleTick(state, i);
  return state;
}

describe("week tracker", () => {
  it("ticks and unticks a day", () => {
    let s = toggleTick(defaultState(), 2);
    expect(s.week.ticks[2]).toBe(true);
    expect(tickCount(s.week.ticks)).toBe(1);
    s = toggleTick(s, 2);
    expect(s.week.ticks[2]).toBe(false);
    expect(s.week.phase).toBe("active");
  });

  it("ticking all 7 starts the celebration, then completes and resets", () => {
    const s = tickAll(defaultState());
    expect(s.week.phase).toBe("celebrating");
    const done = completeWeek(s, NOW);
    expect(done.week.ticks).toEqual([false, false, false, false, false, false, false]);
    expect(done.week.phase).toBe("active");
    expect(done.weeksCompleted).toBe(1);
    expect(done.completedWeeks).toEqual([{ completedAt: NOW }]);
    expect(done.week.startedAt).toBe(NOW);
  });

  it("weeksCompleted increments exactly once", () => {
    const s = tickAll(defaultState());
    const once = completeWeek(s, NOW);
    const twice = completeWeek(once, NOW);
    expect(twice.weeksCompleted).toBe(1);
    expect(twice.completedWeeks).toHaveLength(1);
  });

  it("undo cancels the 7th tick", () => {
    let s = defaultState();
    for (const i of [0, 1, 2, 3, 4, 6]) s = toggleTick(s, i);
    s = toggleTick(s, 5);
    expect(s.week.phase).toBe("celebrating");
    const undone = undoCelebration(s);
    expect(undone.week.phase).toBe("active");
    expect(undone.week.ticks[5]).toBe(false);
    expect(tickCount(undone.week.ticks)).toBe(6);
    expect(undone.weeksCompleted).toBe(0);
  });

  it("the week is locked while celebrating", () => {
    const s = tickAll(defaultState());
    expect(toggleTick(s, 0)).toBe(s);
  });

  it("reload during the celebration still resets", () => {
    const s = tickAll(defaultState());
    const reloaded = normalizeOnLoad(migrate(JSON.parse(serialize(s))), NOW);
    expect(reloaded.weeksCompleted).toBe(1);
    expect(tickCount(reloaded.week.ticks)).toBe(0);
    expect(reloaded.week.phase).toBe("active");
  });

  it("normal load leaves a partial week alone", () => {
    const s = toggleTick(defaultState(), 0);
    expect(normalizeOnLoad(s, NOW)).toBe(s);
  });
});
