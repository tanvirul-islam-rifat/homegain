"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const CONFETTI = Array.from({ length: 18 }, (_, i) => i);

export function Celebration({
  weekNumber,
  onDone,
  onUndo,
}: {
  weekNumber: number;
  onDone: () => void;
  onUndo: () => void;
}) {
  const reduced = useReducedMotion();
  const undoRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    undoRef.current?.focus();
    const t = window.setTimeout(() => doneRef.current(), 3000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") doneRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="celebrate" role="dialog" aria-modal="true" aria-labelledby="celebrate-title" onClick={onDone}>
      <div className="celebrate-card" onClick={(e) => e.stopPropagation()}>
        {!reduced ? (
          <div className="confetti" aria-hidden>
            {CONFETTI.map((i) => (
              <span
                key={i}
                style={
                  {
                    "--x": `${(i * 37 + 7) % 96}%`,
                    "--d": `${((i * 7) % 6) * 0.07}s`,
                    "--r": `${(i % 2 ? 1 : -1) * (120 + i * 25)}deg`,
                    "--y": `${180 + ((i * 53) % 140)}px`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        ) : null}
        <div className="celebrate-ring" aria-hidden>
          <svg viewBox="0 0 24 24">
            <path d="M6.5 12.5l3.6 3.6 7.4-7.6" />
          </svg>
        </div>
        <h2 id="celebrate-title" className="celebrate-title">
          Week complete! <span aria-hidden>🎉</span>
        </h2>
        <p className="celebrate-sub">Week #{weekNumber} done. Your tracker resets for a fresh week.</p>
        <div className="celebrate-actions">
          <button ref={undoRef} type="button" className="btn btn-ghost" onClick={onUndo}>
            Undo
          </button>
          <button type="button" className="btn btn-primary" onClick={onDone}>
            Start next week
          </button>
        </div>
      </div>
    </div>
  );
}
