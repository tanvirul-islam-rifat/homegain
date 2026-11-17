import { describe, expect, it } from "vitest";
import { sanitizeState } from "./state";
import { targetBand, upsertEntry, weeklyCheckIn } from "./weight";

describe("weekly check-in", () => {
  it("needs two entries at least 5 days apart", () => {
    expect(weeklyCheckIn([]).status).toBe("need-data");
    expect(weeklyCheckIn([{ date: "2026-11-01", kg: 65 }, { date: "2026-11-03", kg: 65.2 }]).status).toBe("need-data");
  });

  it("slow, on track and fast", () => {
    const base = { date: "2026-11-01", kg: 65 };
    expect(weeklyCheckIn([base, { date: "2026-11-08", kg: 65.1 }]).status).toBe("slow");
    expect(weeklyCheckIn([base, { date: "2026-11-08", kg: 65.4 }]).status).toBe("on-track");
    expect(weeklyCheckIn([base, { date: "2026-11-08", kg: 65.8 }]).status).toBe("fast");
    expect(weeklyCheckIn([base, { date: "2026-11-08", kg: 65.4 }]).message).toBe("Right on track. Keep going.");
  });

  it("upsert replaces the same date and sorts", () => {
    const log = upsertEntry([{ date: "2026-11-08", kg: 66 }], { date: "2026-11-01", kg: 65 });
    expect(log.map((e) => e.date)).toEqual(["2026-11-01", "2026-11-08"]);
    expect(upsertEntry(log, { date: "2026-11-08", kg: 66.5 })).toHaveLength(2);
  });

  it("target band grows 0.25-0.5 kg per week", () => {
    const band = targetBand({ date: "2026-11-01", kg: 65 }, "2026-11-15");
    expect(band.low).toBeCloseTo(65.5, 5);
    expect(band.high).toBeCloseTo(66, 5);
  });
});

describe("backup sanitising", () => {
  it("drops broken fields and keeps good ones", () => {
    const s = sanitizeState({
      settings: { units: "imperial", weekStartsOn: 9, theme: "neon" },
      week: { ticks: [true, "yes", true] },
      weightLog: [{ date: "2026-11-01", kg: 65 }, { date: "bad", kg: 1 }],
      weeksCompleted: 3,
    });
    expect(s.settings.units).toBe("imperial");
    expect(s.settings.weekStartsOn).toBe(6);
    expect(s.settings.theme).toBe("dark");
    expect(s.week.ticks).toEqual([true, false, true, false, false, false, false]);
    expect(s.weightLog).toHaveLength(1);
    expect(s.weeksCompleted).toBe(3);
  });
});
