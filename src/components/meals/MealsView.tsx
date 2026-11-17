"use client";

import { useState } from "react";
import { MEAL_NOTE, mealsFor, PLATE, TARGETS, totalsFor, type DayType, type Meal } from "@/data/meals";
import { PLAN } from "@/data/plan";
import { dayForDate } from "@/lib/schedule";
import { useAppState, useHydrated } from "@/lib/store";
import { FoodIcon } from "../FoodIcon";
import { IconChevron, IconFlame, IconProtein } from "../Icons";
import { PageHeader, Segmented } from "../ui";

const fmt = (n: number) => n.toLocaleString("en-US");

/** Donut split by meal, so you can see where the day's numbers come from. */
function Donut({ meals, metric, total, unit, label }: { meals: Meal[]; metric: "kcal" | "protein"; total: number; unit: string; label: string }) {
  const size = 132;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const gap = 2.5;
  let offset = 0;
  return (
    <figure className="donut">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label}: ${fmt(total)} ${unit}`}>
        <circle cx={size / 2} cy={size / 2} r={r} className="ring-track" strokeWidth={stroke} />
        {meals.map((m, i) => {
          const len = (m[metric] / total) * c;
          const seg = (
            <circle
              key={m.id}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              strokeWidth={stroke}
              className="donut-seg"
              style={{ opacity: 1 - i * 0.11 }}
              strokeDasharray={`${Math.max(0, len - gap)} ${c}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
          offset += len;
          return seg;
        })}
      </svg>
      <figcaption className="donut-center">
        <span className="donut-num">{fmt(total)}</span>
        <span className="donut-unit">{unit}</span>
      </figcaption>
    </figure>
  );
}

function Plate() {
  const size = 200;
  const cx = size / 2;
  const r = 70;
  let start = -90;
  const arc = (a0: number, a1: number) => {
    const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cx + r * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    return `M${cx},${cx} L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z`;
  };
  return (
    <div className="plate">
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Plate: chicken 250 g raw, potatoes 400 g, vegetables a big portion">
        <circle cx={cx} cy={cx} r={92} className="plate-rim" />
        <circle cx={cx} cy={cx} r={80} className="plate-inner" />
        {PLATE.map((seg, i) => {
          const a0 = start;
          const a1 = start + seg.share * 360;
          start = a1;
          const mid = ((a0 + a1) / 2) * (Math.PI / 180);
          return (
            <g key={seg.label}>
              <path d={arc(a0, a1)} className={`plate-seg plate-seg-${i}`} />
              <g transform={`translate(${(cx + 42 * Math.cos(mid) - 15).toFixed(1)} ${(cx + 42 * Math.sin(mid) - 15).toFixed(1)})`}>
                <circle cx={15} cy={15} r={15} className="plate-icon-bg" />
                <g transform="translate(4 4)">
                  <FoodIcon id={seg.icon} size={22} />
                </g>
              </g>
            </g>
          );
        })}
      </svg>
      <ul className="plate-legend">
        {PLATE.map((seg, i) => (
          <li key={seg.label}>
            <span className={`swatch plate-seg-${i}`} aria-hidden />
            <span className="plate-legend-name">{seg.label}</span>
            <span className="muted">{seg.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MealRow({ meal, open, onToggle }: { meal: Meal; open: boolean; onToggle: () => void }) {
  const icons = Array.from(new Set(meal.items.map((i) => i.icon)));
  return (
    <li className={`timeline-item${open ? " is-open" : ""}`}>
      <span className="timeline-dot" aria-hidden />
      <div className="card meal">
        <button type="button" className="meal-head" aria-expanded={open} onClick={onToggle}>
          <span className="meal-time">{meal.time}</span>
          <span className="meal-name">{meal.name}</span>
          <span className="meal-icons" aria-hidden>
            {icons.map((ic) => (
              <span key={ic} className="food-chip">
                <FoodIcon id={ic} size={20} />
              </span>
            ))}
          </span>
          <span className="meal-macros">
            <span className="macro">
              <IconFlame width={14} height={14} />
              {meal.kcal} kcal
            </span>
            <span className="macro">
              <IconProtein width={14} height={14} />
              {meal.protein} g
            </span>
          </span>
          <IconChevron className="chev" width={20} height={20} />
        </button>
        <div className="meal-body" hidden={!open}>
          <ul className="meal-items">
            {meal.items.map((it, i) => (
              <li key={i}>
                <span className="food-chip">
                  <FoodIcon id={it.icon} size={22} />
                </span>
                {it.text}
              </li>
            ))}
          </ul>
          {meal.plate ? <Plate /> : null}
        </div>
      </div>
    </li>
  );
}

export function MealsView() {
  const hydrated = useHydrated();
  const weekStartsOn = useAppState((s) => s.settings.weekStartsOn);
  const todayIsTraining = hydrated ? PLAN[dayForDate(new Date(), weekStartsOn)].kind === "workout" : true;
  const [picked, setPicked] = useState<DayType | null>(null);
  const type: DayType = picked ?? (todayIsTraining ? "training" : "rest");
  const meals = mealsFor(type);
  const totals = totalsFor(type);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="stack">
      <PageHeader eyebrow="Eat to grow" title="Meals">
        <Segmented
          label="Day type"
          value={type}
          onChange={setPicked}
          options={[
            { value: "training", label: "Training day" },
            { value: "rest", label: "Rest day" },
          ]}
        />
      </PageHeader>

      <section className="card totals" aria-label="Daily totals">
        <div className="totals-item">
          <Donut meals={meals} metric="kcal" total={totals.kcal} unit="kcal" label="Calories" />
          <p className="small muted">Target about {fmt(TARGETS[type].kcal)} kcal</p>
        </div>
        <div className="totals-item">
          <Donut meals={meals} metric="protein" total={totals.protein} unit="g protein" label="Protein" />
          <p className="small muted">Target about {TARGETS[type].protein} g</p>
        </div>
        <p className="totals-note small muted">
          {type === "training"
            ? "A modest surplus for lean gain. Each ring segment is one meal."
            : "Rest days skip the pre-workout snack."}
        </p>
      </section>

      <ol className="timeline" aria-label="Meals through the day">
        {meals.map((m) => (
          <MealRow key={m.id} meal={m} open={openId === m.id} onToggle={() => setOpenId(openId === m.id ? null : m.id)} />
        ))}
      </ol>

      <p className="small muted center">{MEAL_NOTE}</p>
    </div>
  );
}
