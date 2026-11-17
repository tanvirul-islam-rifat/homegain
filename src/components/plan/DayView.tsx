"use client";

import { useState } from "react";
import { FOCUS_LABEL, getExercise, REST_DAY_TEXT, type PlanDay } from "@/data/plan";
import { WEEKDAY_LONG, type Weekday } from "@/lib/schedule";
import { IconWalk } from "../Icons";
import { PoseFigure } from "../PoseFigure";
import { ExerciseCard } from "./ExerciseCard";
import { ExerciseVisual } from "./ExerciseVisual";

function CompleteButton({ day, done, onToggle, locked }: { day: number; done: boolean; onToggle: () => void; locked: boolean }) {
  return (
    <button
      type="button"
      className={`complete-bar${done ? " is-done" : ""}`}
      aria-pressed={done}
      aria-label={`Mark Day ${day} complete`}
      onClick={onToggle}
      disabled={locked}
    >
      <span className={`tick tick-lg${done ? " is-on" : ""}`} aria-hidden>
        <svg viewBox="0 0 24 24">
          <path className="tick-check" d="M6.5 12.5l3.6 3.6 7.4-7.6" pathLength={1} />
        </svg>
      </span>
      <span className="complete-label">{done ? `Day ${day} done` : `Mark Day ${day} complete`}</span>
    </button>
  );
}

export function DayView({
  plan,
  weekday,
  done,
  locked,
  onToggle,
}: {
  plan: PlanDay;
  weekday: Weekday;
  done: boolean;
  locked: boolean;
  onToggle: () => void;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const header = (
    <header className="day-header">
      <p className="eyebrow">
        Day {plan.day} · {WEEKDAY_LONG[weekday]}
      </p>
      <div className="day-title-row">
        <h2 className="day-title">{plan.title}</h2>
        {plan.kind === "workout" ? <span className={`focus-tag focus-${plan.focus}`}>{FOCUS_LABEL[plan.focus]}</span> : null}
      </div>
      <p className="muted">{plan.muscles}</p>
      {plan.kind === "workout" ? (
        <p className="day-meta">
          <span>~{plan.duration}</span>
          <span aria-hidden>·</span>
          <span>{plan.exercises.length} exercises</span>
        </p>
      ) : null}
    </header>
  );

  if (plan.kind === "rest") {
    return (
      <section className="day-view" aria-label={`Day ${plan.day} plan`}>
        {header}
        <div className="card rest-card">
          <div className="rest-visual">
            <PoseFigure pose="walk" label="Walking animation" />
          </div>
          <div className="rest-text">
            <p className="rest-title">
              <IconWalk width={20} height={20} /> {REST_DAY_TEXT}
            </p>
            <p className="muted">
              Easy pace, nose breathing. Rest is when muscle rebuilds, so keep today light and don&apos;t skip it.
            </p>
          </div>
        </div>
        <CompleteButton day={plan.day} done={done} onToggle={onToggle} locked={locked} />
      </section>
    );
  }

  const openEntry = openIdx !== null ? plan.exercises[openIdx] : plan.exercises[0];
  const openExercise = getExercise(openEntry.exerciseId);

  return (
    <section className="day-view" aria-label={`Day ${plan.day} plan`}>
      {header}
      <p className="warmup">
        <span className="warmup-label">Warm-up · 5 min</span>
        {plan.warmup}
      </p>
      <div className="day-columns">
        <div className="exercise-list">
          {plan.exercises.map((entry, i) => (
            <ExerciseCard
              key={`${plan.day}-${entry.exerciseId}`}
              index={i}
              entry={entry}
              exercise={getExercise(entry.exerciseId)}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
        <aside className="sticky-visual" aria-label="Selected exercise">
          <div className="card sticky-card">
            <p className="eyebrow">{openExercise.name}</p>
            <ExerciseVisual key={openExercise.id} exercise={openExercise} />
            <p className="muted small">{openEntry.sets}</p>
          </div>
        </aside>
      </div>
      <CompleteButton day={plan.day} done={done} onToggle={onToggle} locked={locked} />
    </section>
  );
}
