"use client";

import { useState, type FormEvent } from "react";
import { kgToLb, lbToKg, round1, WEIGHT_KG_RANGE } from "@/lib/bmi";
import { formatKey, toDateKey } from "@/lib/dates";
import { actions, useAppState, useHydrated } from "@/lib/store";
import type { Units, WeightEntry } from "@/lib/types";
import { tickCount } from "@/lib/week";
import { weeklyCheckIn } from "@/lib/weight";
import { IconPencil, IconSpark, IconTrash } from "../Icons";
import { PageHeader } from "../ui";
import { WeightChart } from "./WeightChart";

const toDisplay = (kg: number, u: Units) => round1(u === "metric" ? kg : kgToLb(kg));
const toKg = (v: number, u: Units) => (u === "metric" ? v : lbToKg(v));

function WeightForm({
  units,
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  units: Units;
  initial: WeightEntry | null;
  onSubmit: (e: WeightEntry) => void;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const hydrated = useHydrated();
  const [date, setDate] = useState(initial?.date ?? "");
  const [value, setValue] = useState(initial ? String(toDisplay(initial.kg, units)) : "");
  const [error, setError] = useState("");
  const unit = units === "metric" ? "kg" : "lb";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const kg = toKg(Number(value), units);
    if (!Number.isFinite(kg) || kg < WEIGHT_KG_RANGE.min || kg > WEIGHT_KG_RANGE.max) {
      setError(`Enter a weight between ${units === "metric" ? "25 and 300 kg" : "55 and 661 lb"}.`);
      return;
    }
    onSubmit({ date: date || toDateKey(new Date()), kg });
    setError("");
    if (!initial) setValue("");
  };

  return (
    <form className="weight-form" onSubmit={submit}>
      <label className="field">
        <span>Date</span>
        <input
          type="date"
          value={date || (hydrated ? toDateKey(new Date()) : "")}
          max={hydrated ? toDateKey(new Date()) : undefined}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <label className="field">
        <span>Weight</span>
        <span className="input-wrap">
          <input inputMode="decimal" value={value} placeholder={units === "metric" ? "65.0" : "143.3"} onChange={(e) => setValue(e.target.value)} />
          <span className="unit">{unit}</span>
        </span>
      </label>
      <div className="weight-form-actions">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
        {onCancel ? (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
      {error ? <p className="inline-msg">{error}</p> : null}
    </form>
  );
}

export function ProgressView() {
  const units = useAppState((s) => s.settings.units);
  const log = useAppState((s) => s.weightLog);
  const weeksCompleted = useAppState((s) => s.weeksCompleted);
  const completedWeeks = useAppState((s) => s.completedWeeks);
  const ticks = useAppState((s) => s.week.ticks);
  const [editing, setEditing] = useState<string | null>(null);
  const unit = units === "metric" ? "kg" : "lb";

  const checkIn = weeklyCheckIn(log);
  const latest = log[log.length - 1];
  const gained = latest && log.length > 1 ? latest.kg - log[0].kg : null;

  return (
    <div className="stack">
      <PageHeader eyebrow="Keep score" title="Progress" />

      <section className="stats" aria-label="Summary">
        <div className="card stat">
          <span className="stat-num">{weeksCompleted}</span>
          <span className="stat-label">Weeks completed</span>
        </div>
        <div className="card stat">
          <span className="stat-num">{tickCount(ticks)}/7</span>
          <span className="stat-label">This week</span>
        </div>
        <div className="card stat">
          <span className="stat-num">{latest ? toDisplay(latest.kg, units) : "–"}</span>
          <span className="stat-label">Latest ({unit})</span>
        </div>
        <div className="card stat">
          <span className="stat-num">
            {gained === null ? "–" : `${gained >= 0 ? "+" : "−"}${Math.abs(toDisplay(gained, units))}`}
          </span>
          <span className="stat-label">Since start ({unit})</span>
        </div>
      </section>

      <section className={`card checkin checkin-${checkIn.status}`} aria-label="Weekly check-in">
        <span className="checkin-icon" aria-hidden>
          <IconSpark width={20} height={20} />
        </span>
        <div>
          <p className="eyebrow">Weekly check-in</p>
          <p className="checkin-msg">{checkIn.message}</p>
          {checkIn.ratePerWeek !== null ? (
            <p className="small muted">
              Latest change: {checkIn.ratePerWeek >= 0 ? "+" : "−"}
              {Math.abs(toDisplay(checkIn.ratePerWeek, units))} {unit} per week · target +0.25 to +0.5 kg
            </p>
          ) : null}
        </div>
      </section>

      <section className="card" aria-label="Weight log">
        <h2 className="section-title">Weight log</h2>
        {log.length ? (
          <WeightChart log={log} units={units} />
        ) : (
          <p className="empty">
            No weights yet. Weigh yourself once a week, same day and time, and add it here or from the BMI tab.
          </p>
        )}
        <WeightForm units={units} initial={null} onSubmit={(e) => actions.logWeight(e.kg, e.date)} submitLabel="Add weight" />
        {log.length ? (
          <ul className="log-list">
            {log
              .slice()
              .reverse()
              .map((e) =>
                editing === e.date ? (
                  <li key={e.date} className="log-edit">
                    <WeightForm
                      units={units}
                      initial={e}
                      submitLabel="Save"
                      onCancel={() => setEditing(null)}
                      onSubmit={(next) => {
                        actions.editWeight(e.date, next);
                        setEditing(null);
                      }}
                    />
                  </li>
                ) : (
                  <li key={e.date}>
                    <span>{formatKey(e.date)}</span>
                    <strong>
                      {toDisplay(e.kg, units)} {unit}
                    </strong>
                    <span className="log-actions">
                      <button type="button" className="icon-btn" aria-label={`Edit ${formatKey(e.date)}`} onClick={() => setEditing(e.date)}>
                        <IconPencil width={18} height={18} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label={`Delete ${formatKey(e.date)}`}
                        onClick={() => actions.deleteWeight(e.date)}
                      >
                        <IconTrash width={18} height={18} />
                      </button>
                    </span>
                  </li>
                ),
              )}
          </ul>
        ) : null}
      </section>

      <section className="card" aria-label="Completed weeks">
        <h2 className="section-title">Completed weeks</h2>
        {completedWeeks.length ? (
          <ol className="weeks-list">
            {completedWeeks
              .map((w, i) => ({ n: i + 1, at: w.completedAt }))
              .reverse()
              .map((w) => (
                <li key={w.n}>
                  <span className="week-badge">#{w.n}</span>
                  <span>Completed {formatKey(toDateKey(new Date(w.at)))}</span>
                </li>
              ))}
          </ol>
        ) : (
          <p className="empty">Tick all 7 days on the Plan tab to complete your first week.</p>
        )}
      </section>
    </div>
  );
}
