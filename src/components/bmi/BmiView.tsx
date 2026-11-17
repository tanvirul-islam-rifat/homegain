"use client";

import { useState, type CSSProperties } from "react";
import {
  bmiCategory,
  bmiMetric,
  cmToFtIn,
  ftInToCm,
  gaugePosition,
  GAUGE_MAX,
  GAUGE_MIN,
  healthyRangeKg,
  isHeightValid,
  isWeightValid,
  kgToLb,
  lbToKg,
  round1,
  scaleSegments,
  type BmiScale,
} from "@/lib/bmi";
import { toDateKey } from "@/lib/dates";
import { DEFAULT_WEIGHT_KG } from "@/lib/state";
import { actions, useAppState } from "@/lib/store";
import type { Units } from "@/lib/types";
import { IconCheck } from "../Icons";
import { PageHeader, Segmented } from "../ui";

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function BmiView() {
  const settings = useAppState((s) => s.settings);
  const weightLog = useAppState((s) => s.weightLog);
  const latestKg = weightLog.length ? weightLog[weightLog.length - 1].kg : DEFAULT_WEIGHT_KG;

  // Inputs are strings so the user can type freely. null = use the stored value.
  const [kgText, setKgText] = useState<string | null>(null);
  const [lbText, setLbText] = useState<string | null>(null);
  const [cmText, setCmText] = useState<string | null>(null);
  const [ftText, setFtText] = useState<string | null>(null);
  const [inText, setInText] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const units = settings.units;
  const scale = settings.bmiScale;
  const storedFtIn = cmToFtIn(settings.heightCm);

  const kg =
    units === "metric"
      ? kgText !== null ? num(kgText) : latestKg
      : lbText !== null ? lbToKg(num(lbText)) : latestKg;
  const cm =
    units === "metric"
      ? cmText !== null ? num(cmText) : settings.heightCm
      : ftText !== null || inText !== null
        ? ftInToCm(num(ftText ?? String(storedFtIn.ft)), num(inText ?? String(storedFtIn.inches)) || 0)
        : settings.heightCm;

  const heightOk = isHeightValid(cm);
  const weightOk = isWeightValid(kg);
  const valid = heightOk && weightOk;
  const bmi = valid ? bmiMetric(kg, cm) : null;
  const category = bmi !== null ? bmiCategory(bmi, scale) : null;
  const range = heightOk ? healthyRangeKg(cm, scale) : null;
  const segments = scaleSegments(scale);
  const span = GAUGE_MAX - GAUGE_MIN;

  const show = (k: number) => (units === "metric" ? `${round1(k)} kg` : `${round1(kgToLb(k))} lb`);
  let diffText = "";
  if (range && weightOk) {
    if (kg < range.min) diffText = `${show(range.min - kg)} below the healthy range`;
    else if (kg > range.max) diffText = `${show(kg - range.max)} above the healthy range`;
    else diffText = `Inside the range: ${show(kg - range.min)} above the low end, ${show(range.max - kg)} below the top`;
  }

  const persistHeight = (next: number) => {
    if (isHeightValid(next)) actions.updateSettings({ heightCm: Math.round(next * 100) / 100 });
  };

  const switchUnits = (u: Units) => {
    setKgText(null);
    setLbText(null);
    setCmText(null);
    setFtText(null);
    setInText(null);
    actions.updateSettings({ units: u });
  };

  return (
    <div className="stack">
      <PageHeader eyebrow="Body check" title="BMI calculator" />

      <section className="card bmi-form" aria-label="Your measurements">
        <div className="bmi-toggles">
          <Segmented
            label="Units"
            value={units}
            onChange={switchUnits}
            options={[
              { value: "metric", label: "kg / cm" },
              { value: "imperial", label: "lb / ft-in" },
            ]}
          />
          <Segmented
            label="BMI scale"
            value={scale}
            onChange={(v: BmiScale) => actions.updateSettings({ bmiScale: v })}
            options={[
              { value: "asia", label: "Asian" },
              { value: "who", label: "WHO" },
            ]}
          />
        </div>

        <div className="field-row">
          {units === "metric" ? (
            <label className="field">
              <span>Weight</span>
              <span className="input-wrap">
                <input
                  inputMode="decimal"
                  value={kgText ?? String(round1(latestKg))}
                  onChange={(e) => {
                    setKgText(e.target.value);
                    setSaved(false);
                  }}
                  aria-invalid={!weightOk}
                />
                <span className="unit">kg</span>
              </span>
            </label>
          ) : (
            <label className="field">
              <span>Weight</span>
              <span className="input-wrap">
                <input
                  inputMode="decimal"
                  value={lbText ?? String(round1(kgToLb(latestKg)))}
                  onChange={(e) => {
                    setLbText(e.target.value);
                    setSaved(false);
                  }}
                  aria-invalid={!weightOk}
                />
                <span className="unit">lb</span>
              </span>
            </label>
          )}

          {units === "metric" ? (
            <label className="field">
              <span>Height</span>
              <span className="input-wrap">
                <input
                  inputMode="decimal"
                  value={cmText ?? String(settings.heightCm)}
                  onChange={(e) => {
                    setCmText(e.target.value);
                    persistHeight(num(e.target.value));
                  }}
                  aria-invalid={!heightOk}
                />
                <span className="unit">cm</span>
              </span>
            </label>
          ) : (
            <div className="field">
              <span id="height-label">Height</span>
              <span className="input-pair" role="group" aria-labelledby="height-label">
                <span className="input-wrap">
                  <input
                    inputMode="numeric"
                    aria-label="Feet"
                    value={ftText ?? String(storedFtIn.ft)}
                    onChange={(e) => {
                      setFtText(e.target.value);
                      persistHeight(ftInToCm(num(e.target.value), num(inText ?? String(storedFtIn.inches)) || 0));
                    }}
                    aria-invalid={!heightOk}
                  />
                  <span className="unit">ft</span>
                </span>
                <span className="input-wrap">
                  <input
                    inputMode="decimal"
                    aria-label="Inches"
                    value={inText ?? String(storedFtIn.inches)}
                    onChange={(e) => {
                      setInText(e.target.value);
                      persistHeight(ftInToCm(num(ftText ?? String(storedFtIn.ft)), num(e.target.value) || 0));
                    }}
                    aria-invalid={!heightOk}
                  />
                  <span className="unit">in</span>
                </span>
              </span>
            </div>
          )}
        </div>

        {!heightOk ? <p className="inline-msg">Height should be between 100 and 250 cm (3 ft 4 in to 8 ft 2 in).</p> : null}
        {!weightOk ? <p className="inline-msg">Weight should be between 25 and 300 kg (55 to 661 lb).</p> : null}
      </section>

      <section className="card bmi-result" aria-live="polite" aria-label="Result">
        <div className="bmi-number-row">
          <p className="bmi-number">{bmi !== null ? bmi.toFixed(1) : "–"}</p>
          {category ? <span className={`bmi-cat cat-${category.toLowerCase()}`}>{category}</span> : null}
          <span className="muted small bmi-scale-name">{scale === "asia" ? "Asian scale" : "WHO scale"}</span>
        </div>

        <div className="gauge" aria-hidden>
          <div className="gauge-track">
            {segments.map((s) => (
              <span
                key={s.label}
                className={`gauge-seg seg-${s.label.toLowerCase()}`}
                style={{ flexGrow: s.to - s.from }}
              />
            ))}
          </div>
          {bmi !== null ? (
            <span className="gauge-marker" style={{ "--pos": gaugePosition(bmi) } as CSSProperties} />
          ) : null}
          <div className="gauge-labels">
            {segments.slice(1).map((s) => (
              <span key={s.label} style={{ left: `${((s.from - GAUGE_MIN) / span) * 100}%` }}>
                {s.from}
              </span>
            ))}
          </div>
        </div>

        {range ? (
          <div className="bmi-range">
            <p>
              Healthy weight for your height: <strong>{show(range.min)}</strong> to <strong>{show(range.max)}</strong>
            </p>
            {diffText ? <p className="muted small">{diffText}</p> : null}
          </div>
        ) : null}

        <button
          type="button"
          className="btn btn-primary"
          disabled={!weightOk}
          onClick={() => {
            actions.logWeight(kg, toDateKey(new Date()));
            setSaved(true);
          }}
        >
          {saved ? (
            <>
              <IconCheck width={18} height={18} /> Saved to weight log
            </>
          ) : (
            "Save to weight log"
          )}
        </button>

        <p className="small muted">
          BMI does not separate muscle from fat, so it may creep up as you build muscle. Use it as one signal, not the
          whole picture.
        </p>
      </section>
    </div>
  );
}
