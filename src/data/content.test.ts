import { describe, expect, it } from "vitest";
import { GUIDE } from "./guide";
import { MEAL_NOTE, MEALS, totalsFor } from "./meals";
import { EXERCISES, PLAN } from "./plan";
import { POSES } from "./poses";
import { VIDEOS } from "./videos";

const BANNED = /air.?fr|cook|marinat|\bpain|\bdisc\b|injur|rehab|temperature|doneness/i;

describe("plan content", () => {
  it("every day exercise exists and has a pose", () => {
    for (const day of Object.values(PLAN)) {
      if (day.kind !== "workout") continue;
      for (const e of day.exercises) {
        const ex = EXERCISES[e.exerciseId];
        expect(Boolean(ex)).toBe(true);
        for (const p of ex.poses) expect(p in POSES).toBe(true);
      }
    }
  });

  it("each exercise has 3-5 short steps, muscles and a demo query", () => {
    for (const ex of Object.values(EXERCISES)) {
      expect(ex.steps.length >= 3 && ex.steps.length <= 5).toBe(true);
      for (const s of ex.steps) expect(s.length).toBeLessThanOrEqual(90);
      expect(ex.muscles.length).toBeGreaterThan(0);
      expect(ex.demoQuery.length).toBeGreaterThan(3);
    }
  });

  it("video ids look like YouTube ids and point at real exercises", () => {
    for (const [id, v] of Object.entries(VIDEOS)) {
      expect(id in EXERCISES).toBe(true);
      expect(v.id).toMatch(/^[A-Za-z0-9_-]{11}$/);
    }
  });

  it("meal totals match the plan", () => {
    expect(totalsFor("training")).toEqual({ kcal: 2805, protein: 194 });
    expect(totalsFor("rest")).toEqual({ kcal: 2605, protein: 190 });
    expect(MEALS).toHaveLength(7);
  });

  it("no excluded content (cooking, injury) in any text", () => {
    const text = JSON.stringify([EXERCISES, PLAN, MEALS, MEAL_NOTE, GUIDE]);
    expect(text).not.toMatch(BANNED);
  });
});
