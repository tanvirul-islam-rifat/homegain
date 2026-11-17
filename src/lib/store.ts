"use client";

import { useSyncExternalStore } from "react";
import { toDateKey } from "./dates";
import { defaultState, migrate, serialize, STORAGE_KEY } from "./state";
import type { AppState, Settings, WeightEntry } from "./types";
import { upsertEntry } from "./weight";
import { completeWeek, normalizeOnLoad, toggleTick, undoCelebration } from "./week";

/*
 * Tiny persisted store (localStorage, versioned, with migrate), built on
 * useSyncExternalStore. The server and the first client render both use
 * SERVER_STATE, so hydration never mismatches; persisted data appears
 * right after hydration.
 */

const SERVER_STATE: AppState = defaultState();
let state: AppState = SERVER_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): AppState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return migrate(JSON.parse(raw));
  } catch {
    return defaultState();
  }
}

function writeStorage(next: AppState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, serialize(next));
  } catch {
    /* storage full or blocked: keep working in memory */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = normalizeOnLoad(readStorage(), new Date().toISOString());
  writeStorage(state);
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    state = readStorage();
    emit();
  });
}

function subscribe(listener: () => void) {
  ensureLoaded();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getState(): AppState {
  ensureLoaded();
  return state;
}

export function setState(updater: (s: AppState) => AppState) {
  ensureLoaded();
  const next = updater(state);
  if (next === state) return;
  state = next;
  writeStorage(state);
  emit();
}

/**
 * Select a slice. Selectors must return a value that is stable between
 * updates (a slice of state or a primitive), not a freshly built object.
 */
export function useAppState<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getState()),
    () => selector(SERVER_STATE),
  );
}

const noopSubscribe = () => () => {};
/** false during SSR and hydration, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

const nowIso = () => new Date().toISOString();

export const actions = {
  toggleTick: (index: number) => setState((s) => toggleTick(s, index)),
  undoCelebration: () => setState(undoCelebration),
  completeWeek: () => setState((s) => completeWeek(s, nowIso())),
  updateSettings: (patch: Partial<Settings>) =>
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
  logWeight: (kg: number, date: string = toDateKey(new Date())) =>
    setState((s) => ({ ...s, weightLog: upsertEntry(s.weightLog, { date, kg: Math.round(kg * 10) / 10 }) })),
  editWeight: (oldDate: string, entry: WeightEntry) =>
    setState((s) => ({
      ...s,
      weightLog: upsertEntry(
        s.weightLog.filter((e) => e.date !== oldDate),
        { ...entry, kg: Math.round(entry.kg * 10) / 10 },
      ),
    })),
  deleteWeight: (date: string) =>
    setState((s) => ({ ...s, weightLog: s.weightLog.filter((e) => e.date !== date) })),
  importBackup: (raw: unknown) => setState(() => normalizeOnLoad(migrate(raw), nowIso())),
  resetAll: () => setState(() => ({ ...defaultState(), week: { ...defaultState().week, startedAt: nowIso() } })),
};

export function exportBackup(): string {
  return serialize(getState());
}
