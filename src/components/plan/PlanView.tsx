"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { PLAN, PLAN_OVERVIEW } from "@/data/plan";
import { formatShort } from "@/lib/dates";
import { dayForDate, parseDayParam, weekdayOfDay, type DayNumber } from "@/lib/schedule";
import { actions, useAppState, useHydrated } from "@/lib/store";
import { tickCount } from "@/lib/week";
import { IconInfo } from "../Icons";
import { Disclosure, Ring } from "../ui";
import { Celebration } from "./Celebration";
import { DayView } from "./DayView";
import { WeekStrip } from "./WeekStrip";

export function PlanView() {
  const params = useSearchParams();
  const hydrated = useHydrated();
  const weekStartsOn = useAppState((s) => s.settings.weekStartsOn);
  const ticks = useAppState((s) => s.week.ticks);
  const phase = useAppState((s) => s.week.phase);
  const weeksCompleted = useAppState((s) => s.weeksCompleted);

  // Local copy so a click shows instantly even before the URL updates.
  const [picked, setPicked] = useState<DayNumber | null>(null);

  const now = hydrated ? new Date() : null;
  const today = now ? dayForDate(now, weekStartsOn) : null;
  const selected: DayNumber = picked ?? parseDayParam(params.get("day")) ?? today ?? 1;
  const plan = PLAN[selected];
  const done = tickCount(ticks);
  const celebrating = phase === "celebrating";

  const select = useCallback((d: DayNumber) => {
    setPicked(d);
    window.history.replaceState(null, "", `?day=${d}`);
  }, []);

  return (
    <div className="plan">
      <section className="card hero" aria-label="This week">
        <div className="hero-top">
          <div>
            <p className="eyebrow">{now ? formatShort(now) : "This week"}</p>
            <h1 className="hero-title">
              {done === 7 ? "All 7 done" : `${done} / 7 days done`}
            </h1>
            <p className="muted small">
              Week #{weeksCompleted + 1}
              {weeksCompleted > 0 ? ` · ${weeksCompleted} completed so far` : " · tick each day as you finish it"}
            </p>
          </div>
          <Ring value={done / 7} size={64} stroke={6} label={`${done} of 7 days done`}>
            <span className="ring-num">{done}</span>
          </Ring>
        </div>
        <WeekStrip
          ticks={ticks}
          selected={selected}
          today={today}
          weekStartsOn={weekStartsOn}
          locked={celebrating}
          onSelect={select}
          onToggle={(d) => actions.toggleTick(d - 1)}
        />
      </section>

      <DayView
        key={selected}
        plan={plan}
        weekday={weekdayOfDay(selected, weekStartsOn)}
        done={ticks[selected - 1]}
        locked={celebrating}
        onToggle={() => actions.toggleTick(selected - 1)}
      />

      <Disclosure
        title="About this plan"
        leading={
          <span className="lead-icon">
            <IconInfo width={20} height={20} />
          </span>
        }
      >
        <dl className="overview">
          {PLAN_OVERVIEW.map((o) => (
            <div key={o.label}>
              <dt>{o.label}</dt>
              <dd>{o.value}</dd>
            </div>
          ))}
        </dl>
      </Disclosure>

      {celebrating ? (
        <Celebration
          weekNumber={weeksCompleted + 1}
          onDone={actions.completeWeek}
          onUndo={actions.undoCelebration}
        />
      ) : null}
    </div>
  );
}

export function PlanSkeleton() {
  return (
    <div className="plan" aria-busy="true">
      <div className="card hero skeleton" style={{ height: 196 }} />
      <div className="card skeleton" style={{ height: 120 }} />
      <div className="card skeleton" style={{ height: 88 }} />
      <div className="card skeleton" style={{ height: 88 }} />
    </div>
  );
}
