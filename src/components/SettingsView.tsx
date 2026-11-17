"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { toDateKey } from "@/lib/dates";
import { WEEKDAY_LONG, type Weekday } from "@/lib/schedule";
import { actions, exportBackup, useAppState } from "@/lib/store";
import type { Theme } from "@/lib/types";
import { IconDownload, IconTrash, IconUpload } from "./Icons";
import { PageHeader, Segmented } from "./ui";

export function SettingsView() {
  const settings = useAppState((s) => s.settings);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  const download = () => {
    const blob = new Blob([exportBackup()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `homegain-backup-${toDateKey(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Backup downloaded.");
  };

  const importFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const raw: unknown = JSON.parse(await file.text());
      actions.importBackup(raw);
      setMessage("Backup restored.");
    } catch {
      setMessage("That file isn't a HomeGain backup (couldn't read the JSON).");
    }
  };

  return (
    <div className="stack">
      <PageHeader eyebrow="Make it yours" title="Settings" />

      <section className="card settings" aria-label="Preferences">
        <div className="setting">
          <div>
            <p className="setting-name">Week starts on</p>
            <p className="small muted">The weekday of Day 1 (Push).</p>
          </div>
          <select
            className="select"
            value={settings.weekStartsOn}
            onChange={(e) => actions.updateSettings({ weekStartsOn: Number(e.target.value) as Weekday })}
            aria-label="Week starts on"
          >
            {WEEKDAY_LONG.map((d, i) => (
              <option key={d} value={i}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="setting">
          <div>
            <p className="setting-name">Units</p>
            <p className="small muted">For weight and height.</p>
          </div>
          <Segmented
            label="Units"
            value={settings.units}
            onChange={(v) => actions.updateSettings({ units: v })}
            options={[
              { value: "metric", label: "Metric" },
              { value: "imperial", label: "Imperial" },
            ]}
          />
        </div>

        <div className="setting">
          <div>
            <p className="setting-name">BMI scale</p>
            <p className="small muted">Asian cut-offs are lower than WHO.</p>
          </div>
          <Segmented
            label="BMI scale"
            value={settings.bmiScale}
            onChange={(v) => actions.updateSettings({ bmiScale: v })}
            options={[
              { value: "asia", label: "Asian" },
              { value: "who", label: "WHO" },
            ]}
          />
        </div>

        <div className="setting">
          <div>
            <p className="setting-name">Theme</p>
            <p className="small muted">Dark chocolate or light latte.</p>
          </div>
          <Segmented<Theme>
            label="Theme"
            value={settings.theme}
            onChange={(v) => actions.updateSettings({ theme: v })}
            options={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
              { value: "system", label: "Auto" },
            ]}
          />
        </div>
      </section>

      <section className="card settings" aria-label="Your data">
        <div className="setting">
          <div>
            <p className="setting-name">Backup</p>
            <p className="small muted">Everything lives in this browser. Export it to keep it safe or move devices.</p>
          </div>
          <div className="setting-actions">
            <button type="button" className="btn btn-ghost" onClick={download}>
              <IconDownload width={18} height={18} /> Export
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
              <IconUpload width={18} height={18} /> Import
            </button>
            <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importFile} />
          </div>
        </div>
        <div className="setting">
          <div>
            <p className="setting-name">Reset all data</p>
            <p className="small muted">Clears ticks, weeks, weight log and settings.</p>
          </div>
          <button type="button" className="btn btn-danger" onClick={() => dialogRef.current?.showModal()}>
            <IconTrash width={18} height={18} /> Reset
          </button>
        </div>
        {message ? (
          <p className="small muted" role="status">
            {message}
          </p>
        ) : null}
      </section>

      <dialog ref={dialogRef} className="dialog" aria-labelledby="reset-title">
        <h2 id="reset-title" className="section-title">
          Reset everything?
        </h2>
        <p className="muted">This deletes all your ticks, completed weeks and weight entries. It can&apos;t be undone.</p>
        <form method="dialog" className="dialog-actions">
          <button className="btn btn-ghost" value="cancel" autoFocus>
            Cancel
          </button>
          <button
            className="btn btn-danger"
            value="reset"
            onClick={() => {
              actions.resetAll();
              setMessage("All data was reset.");
            }}
          >
            Reset all data
          </button>
        </form>
      </dialog>
    </div>
  );
}
