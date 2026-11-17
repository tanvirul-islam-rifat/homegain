"use client";

import { daysBetween, formatKey } from "@/lib/dates";
import { kgToLb } from "@/lib/bmi";
import type { Units, WeightEntry } from "@/lib/types";
import { targetBand } from "@/lib/weight";

/** Lightweight SVG line chart with the 0.25-0.5 kg/week target band. */
export function WeightChart({ log, units }: { log: WeightEntry[]; units: Units }) {
  const W = 640;
  const H = 240;
  const pad = { l: 44, r: 16, t: 16, b: 30 };
  const conv = (kg: number) => (units === "metric" ? kg : kgToLb(kg));
  const unit = units === "metric" ? "kg" : "lb";

  if (log.length === 0) return null;

  const first = log[0];
  const last = log[log.length - 1];
  const spanDays = Math.max(14, daysBetween(first.date, last.date));
  const endBand = targetBand(first, last.date);
  const values = log.map((e) => e.kg).concat([first.kg, endBand.high]);
  const lo = Math.min(...values) - 0.6;
  const hi = Math.max(...values) + 0.6;

  const x = (date: string) => pad.l + (daysBetween(first.date, date) / spanDays) * (W - pad.l - pad.r);
  const y = (kg: number) => pad.t + (1 - (kg - lo) / (hi - lo)) * (H - pad.t - pad.b);

  // Band from first day to the chart's right edge.
  const endDate = new Date(new Date(`${first.date}T12:00:00`).getTime() + spanDays * 86_400_000);
  const endKey = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
  const bandEnd = targetBand(first, endKey);
  const band = [
    [x(first.date), y(first.kg)],
    [x(endKey), y(bandEnd.high)],
    [x(endKey), y(bandEnd.low)],
  ]
    .map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`)
    .join(" ");

  const line = log.map((e) => `${x(e.date).toFixed(1)},${y(e.kg).toFixed(1)}`).join(" ");

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => lo + ((hi - lo) * i) / ticks);

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Weight chart, ${log.length} entries, latest ${conv(last.kg).toFixed(1)} ${unit}`}>
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} className="chart-grid" />
            <text x={pad.l - 8} y={y(v) + 4} className="chart-label" textAnchor="end">
              {conv(v).toFixed(1)}
            </text>
          </g>
        ))}
        <polygon points={band} className="chart-band" />
        <polyline points={line} className="chart-line" />
        {log.map((e) => (
          <circle key={e.date} cx={x(e.date)} cy={y(e.kg)} r={4.5} className="chart-dot">
            <title>
              {formatKey(e.date)}: {conv(e.kg).toFixed(1)} {unit}
            </title>
          </circle>
        ))}
        <text x={pad.l} y={H - 8} className="chart-label">
          {formatKey(first.date)}
        </text>
        <text x={W - pad.r} y={H - 8} className="chart-label" textAnchor="end">
          {formatKey(endKey)}
        </text>
      </svg>
      <figcaption className="chart-legend small muted">
        <span>
          <i className="legend-line" aria-hidden /> Your weight ({unit})
        </span>
        <span>
          <i className="legend-band" aria-hidden /> Target: +0.25 to +0.5 kg per week
        </span>
      </figcaption>
    </figure>
  );
}
