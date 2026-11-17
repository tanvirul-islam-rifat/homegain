"use client";

import { useId } from "react";
import { youtubeSearchUrl } from "@/data/media";
import type { DayExercise, Exercise } from "@/data/plan";
import { IconChevron, IconExternal } from "../Icons";
import { PoseFigure } from "../PoseFigure";
import { ExerciseVisual } from "./ExerciseVisual";

export function ExerciseCard({
  index,
  exercise,
  entry,
  open,
  onToggle,
}: {
  index: number;
  exercise: Exercise;
  entry: DayExercise;
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  return (
    <article className={`card exercise${open ? " is-open" : ""}`}>
      <button type="button" className="exercise-head" aria-expanded={open} aria-controls={id} onClick={onToggle}>
        <span className="exercise-thumb" aria-hidden>
          <PoseFigure pose={exercise.poses[0]} label="" time={0} />
        </span>
        <span className="exercise-titles">
          <span className="exercise-index">{String(index + 1).padStart(2, "0")}</span>
          <span className="exercise-name">{exercise.name}</span>
          <span className="exercise-sets">{entry.sets}</span>
        </span>
        <IconChevron className="chev" width={20} height={20} />
      </button>

      <div id={id} className="exercise-body" hidden={!open}>
        {open ? (
          <div className="exercise-visual-inline">
            <ExerciseVisual exercise={exercise} />
          </div>
        ) : null}

        <ul className="chips" aria-label="Muscles worked">
          {exercise.muscles.map((m) => (
            <li key={m} className="chip">
              {m}
            </li>
          ))}
        </ul>

        {entry.note ? <p className="exercise-note">{entry.note}</p> : null}

        <ol className="steps">
          {exercise.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>

        <a className="link-btn" href={youtubeSearchUrl(exercise.demoQuery)} target="_blank" rel="noopener noreferrer">
          <IconExternal width={16} height={16} />
          Watch a demo on YouTube
        </a>
      </div>
    </article>
  );
}
