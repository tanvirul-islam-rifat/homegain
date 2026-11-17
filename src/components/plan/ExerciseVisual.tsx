"use client";

import Image from "next/image";
import { useState } from "react";
import { photosFor, videoFor } from "@/data/media";
import type { Exercise } from "@/data/plan";
import { getPose } from "@/data/poses";
import { peakTime } from "@/lib/pose";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { IconPlay } from "../Icons";
import { PoseFigure } from "../PoseFigure";
import { Segmented } from "../ui";

type Mode = "anim" | "photo" | "video";

function Animation({ exercise }: { exercise: Exercise }) {
  const reduced = useReducedMotion();
  const poses = exercise.poses;

  if (reduced) {
    // Static start / end pair instead of motion.
    return (
      <div className="visual-grid">
        {poses.flatMap((p, i) => {
          const def = getPose(p);
          const prefix = exercise.poseLabels?.[i] ? `${exercise.poseLabels[i]}: ` : "";
          if (def.frames.length < 2) {
            return [
              <figure key={p} className="visual-frame">
                <PoseFigure pose={p} label={`${exercise.name}, hold position`} time={0} />
                <figcaption>{prefix}Hold</figcaption>
              </figure>,
            ];
          }
          return [
            <figure key={`${p}-a`} className="visual-frame">
              <PoseFigure pose={p} label={`${exercise.name}, start position`} time={0} />
              <figcaption>{prefix}Start</figcaption>
            </figure>,
            <figure key={`${p}-b`} className="visual-frame">
              <PoseFigure pose={p} label={`${exercise.name}, end position`} time={peakTime(def)} />
              <figcaption>{prefix}End</figcaption>
            </figure>,
          ];
        })}
      </div>
    );
  }

  return (
    <div className={poses.length > 1 ? "visual-grid" : undefined}>
      {poses.map((p, i) => (
        <figure key={p} className="visual-frame">
          <PoseFigure pose={p} label={`${exercise.poseLabels?.[i] ?? exercise.name} animation`} />
          {exercise.poseLabels?.[i] ? <figcaption>{exercise.poseLabels[i]}</figcaption> : null}
        </figure>
      ))}
    </div>
  );
}

function Photos({ exerciseId, name }: { exerciseId: string; name: string }) {
  const media = photosFor(exerciseId);
  if (!media) return null;
  return (
    <div className="photo-fade" style={{ aspectRatio: `${media.width} / ${media.height}` }}>
      {media.frames.slice(0, 2).map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${name}, ${i === 0 ? "start" : "end"} position`}
          width={media.width}
          height={media.height}
          sizes="(min-width: 768px) 420px, 100vw"
          className={`photo-frame photo-frame-${i}`}
        />
      ))}
    </div>
  );
}

function Video({ exerciseId, name }: { exerciseId: string; name: string }) {
  const video = videoFor(exerciseId);
  const [playing, setPlaying] = useState(false);
  if (!video) return null;
  if (!playing) {
    return (
      <button type="button" className="video-poster" onClick={() => setPlaying(true)}>
        <span className="video-play">
          <IconPlay width={26} height={26} />
        </span>
        <span className="video-title">{video.title}</span>
        <span className="video-hint">Tap to load the video from YouTube</span>
      </button>
    );
  }
  return (
    <div className="video-frame">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1`}
        title={`${name} demo video`}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

export function ExerciseVisual({ exercise }: { exercise: Exercise }) {
  const hasPhoto = !!photosFor(exercise.id);
  const hasVideo = !!videoFor(exercise.id);
  const [mode, setMode] = useState<Mode>("anim");
  const options: { value: Mode; label: string }[] = [{ value: "anim", label: "Animation" }];
  if (hasPhoto) options.push({ value: "photo", label: "Photo" });
  if (hasVideo) options.push({ value: "video", label: "Video" });

  return (
    <div className="exercise-visual">
      {options.length > 1 ? (
        <Segmented size="sm" label={`${exercise.name} visual`} value={mode} options={options} onChange={setMode} />
      ) : null}
      <div className="visual-stage">
        {mode === "anim" ? <Animation exercise={exercise} /> : null}
        {mode === "photo" ? <Photos exerciseId={exercise.id} name={exercise.name} /> : null}
        {mode === "video" ? <Video exerciseId={exercise.id} name={exercise.name} /> : null}
      </div>
    </div>
  );
}
