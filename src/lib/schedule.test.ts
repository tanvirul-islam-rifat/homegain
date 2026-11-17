import { describe, expect, it } from "vitest";
import { DAY_NUMBERS, dayForDate, dayForWeekday, parseDayParam, weekdayOfDay, type Weekday } from "./schedule";

describe("schedule", () => {
  it("default Saturday start maps Day 1..7 to Sat..Fri", () => {
    expect(DAY_NUMBERS.map((d) => weekdayOfDay(d, 6))).toEqual([6, 0, 1, 2, 3, 4, 5]);
  });

  it("every weekStartsOn value round-trips", () => {
    for (let start = 0; start <= 6; start++) {
      const ws = start as Weekday;
      expect(weekdayOfDay(1, ws)).toBe(ws);
      for (const d of DAY_NUMBERS) {
        const wd = weekdayOfDay(d, ws);
        expect(wd).toBe((ws + d - 1) % 7);
        expect(dayForWeekday(wd, ws)).toBe(d);
      }
    }
  });

  it("today maps to the right plan day", () => {
    // 18 Nov 2026 is a Wednesday -> Day 5 with a Saturday start
    expect(dayForDate(new Date(2026, 10, 18, 12), 6)).toBe(5);
    expect(dayForDate(new Date(2026, 10, 21, 12), 6)).toBe(1);
  });

  it("parses ?day=", () => {
    expect(parseDayParam("3")).toBe(3);
    expect(parseDayParam("0")).toBe(null);
    expect(parseDayParam("8")).toBe(null);
    expect(parseDayParam("abc")).toBe(null);
    expect(parseDayParam(null)).toBe(null);
  });
});
