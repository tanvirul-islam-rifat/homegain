"use client";

import { PLAN } from "@/data/plan";
import { DAY_NUMBERS, WEEKDAY_SHORT, weekdayOfDay, type DayNumber, type Weekday } from "@/lib/schedule";
import { TickButton } from "./TickButton";

export function WeekStrip({
  ticks,
  selected,
  today,
  weekStartsOn,
  locked,
  onSelect,
  onToggle,
}: {
  ticks: boolean[];
  selected: DayNumber;
  today: DayNumber | null;
  weekStartsOn: Weekday;
  locked: boolean;
  onSelect: (d: DayNumber) => void;
  onToggle: (d: DayNumber) => void;
}) {
  return (
    <div className="week-strip" role="group" aria-label="This week">
      {DAY_NUMBERS.map((d) => {
        const plan = PLAN[d];
        const wd = WEEKDAY_SHORT[weekdayOfDay(d, weekStartsOn)];
        return (
          <div key={d} className={`week-day${d === selected ? " is-selected" : ""}${d === today ? " is-today" : ""}`}>
            <TickButton day={d} on={ticks[d - 1]} onToggle={() => onToggle(d)} disabled={locked} />
            <button
              type="button"
              className="day-chip"
              aria-current={d === selected ? "true" : undefined}
              aria-label={`Open Day ${d}, ${wd}, ${plan.title}${d === today ? " (today)" : ""}`}
              onClick={() => onSelect(d)}
            >
              <span className="day-chip-wd">{wd}</span>
              <span className={`day-chip-focus focus-${plan.focus}`} aria-hidden>
                {plan.kind === "rest" ? "Rest" : `D${d}`}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
