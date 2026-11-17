"use client";

import { useEffect, useRef, useState } from "react";
import { getPose, type PoseId } from "@/data/poses";
import {
  DEFAULT_VIEWBOX,
  frameAt,
  solveFrame,
  weightsFor,
  type Figure,
  type LimbOut,
  type Part,
  type PoseDef,
  type Prop,
  type Vec,
  type WeightOut,
} from "@/lib/pose";
import { useReducedMotion } from "@/lib/useReducedMotion";

const pts = (p: Vec[]) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

function PropShape({ prop }: { prop: Prop }) {
  if (prop.type === "floor") {
    return <line x1={prop.x1 ?? 6} x2={prop.x2 ?? 254} y1={prop.y} y2={prop.y} className="pf-floor" />;
  }
  const { x, w, top } = prop;
  if (prop.view === "top") {
    return <rect x={x} y={top} width={w} height={prop.h ?? 16} rx={5} className="pf-bench-top" />;
  }
  const legInset = prop.view === "end" ? 5 : 10;
  return (
    <g className="pf-bench">
      <line x1={x + legInset} x2={x + legInset} y1={top + 5} y2={150} />
      <line x1={x + w - legInset} x2={x + w - legInset} y1={top + 5} y2={150} />
      <rect x={x} y={top} width={w} height={6} rx={3} className="pf-bench-slab" />
    </g>
  );
}

function Weight({ w, style }: { w: WeightOut; style: "end" | "bar" }) {
  const [cx, cy] = w.c;
  if (style === "end") {
    return (
      <g className="pf-weight">
        <circle cx={cx} cy={cy} r={6} />
        <circle cx={cx} cy={cy} r={2.4} className="pf-weight-hub" />
      </g>
    );
  }
  return (
    <g className="pf-weight" transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${w.rot.toFixed(1)})`}>
      <rect x={-8} y={-1.6} width={16} height={3.2} rx={1.6} />
      <rect x={-11} y={-5.5} width={5} height={11} rx={1.8} />
      <rect x={6} y={-5.5} width={5} height={11} rx={1.8} />
    </g>
  );
}

function Limb({ limb, active, far }: { limb: LimbOut; active: boolean; far: boolean }) {
  return (
    <polyline
      points={pts(limb.pts)}
      className={`pf-limb${active ? " is-active" : ""}${far ? " is-far" : ""}`}
    />
  );
}

export function FigureSvg({ def, fig, label }: { def: PoseDef; fig: Figure; label: string }) {
  const vb = def.viewBox ?? DEFAULT_VIEWBOX;
  const on = (p: Part) => def.active.includes(p);
  const side = def.view === "side";
  const weights = weightsFor(def, fig);
  const style = def.weights.kind === "none" ? "end" : def.weights.style;
  const farW = weights.filter((w) => w.key === "wF");
  const nearW = weights.filter((w) => w.key !== "wF");

  const torso =
    side ? (
      <line
        x1={fig.hip[0]}
        y1={fig.hip[1]}
        x2={fig.neck[0]}
        y2={fig.neck[1]}
        className={`pf-torso${on("torso") ? " is-active" : ""}`}
      />
    ) : (
      <polygon
        points={pts([fig.shoulders[0], fig.shoulders[1], fig.hips[1], fig.hips[0]])}
        className={`pf-torso-front${on("torso") ? " is-active" : ""}`}
      />
    );

  return (
    <svg viewBox={vb.join(" ")} role="img" aria-label={label} className="pf-svg">
      {def.props.map((p, i) => (
        <PropShape key={i} prop={p} />
      ))}
      {side ? (
        <>
          <Limb limb={fig.legF} active={on("legF")} far />
          <Limb limb={fig.armF} active={on("armF")} far />
          {farW.map((w) => (
            <g key={w.key} className="is-far-weight">
              <Weight w={w} style={style} />
            </g>
          ))}
          {torso}
          <line x1={fig.neck[0]} y1={fig.neck[1]} x2={fig.head[0]} y2={fig.head[1]} className="pf-neck" />
          <circle cx={fig.head[0]} cy={fig.head[1]} r={8} className="pf-head" />
          <Limb limb={fig.legN} active={on("legN")} far={false} />
          {nearW.map((w) => (
            <Weight key={w.key} w={w} style={style} />
          ))}
          <Limb limb={fig.armN} active={on("armN")} far={false} />
        </>
      ) : (
        <>
          <Limb limb={fig.legF} active={on("legF")} far={false} />
          <Limb limb={fig.legN} active={on("legN")} far={false} />
          {torso}
          <line x1={fig.neck[0]} y1={fig.neck[1]} x2={fig.head[0]} y2={fig.head[1]} className="pf-neck" />
          <circle cx={fig.head[0]} cy={fig.head[1]} r={8} className="pf-head" />
          <Limb limb={fig.armF} active={on("armF")} far={false} />
          <Limb limb={fig.armN} active={on("armN")} far={false} />
          {weights.map((w) => (
            <Weight key={w.key} w={w} style={style} />
          ))}
        </>
      )}
      {def.badge ? (
        <g className="pf-badge">
          <rect x={vb[0] + 6} y={vb[1] + 6} width={def.badge.length * 5.6 + 14} height={16} rx={8} />
          <text x={vb[0] + 13} y={vb[1] + 17.5}>
            {def.badge.toUpperCase()}
          </text>
        </g>
      ) : null}
      {def.hold ? (
        <g className="pf-hold" transform={`translate(${vb[0] + vb[2] - 22} ${vb[1] + 22})`}>
          <circle r={12} className="pf-hold-track" />
          <circle r={12} className="pf-hold-ring" pathLength={100} transform="rotate(-90)" />
          <text y={3}>HOLD</text>
        </g>
      ) : null}
    </svg>
  );
}

interface PoseFigureProps {
  pose: PoseId;
  label: string;
  /** Fixed time (seconds). When set, the figure does not animate. */
  time?: number;
}

/** Animated line-art figure. Pauses when off-screen or with reduced motion. */
export function PoseFigure({ pose, label, time }: PoseFigureProps) {
  const def = getPose(pose);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(time ?? 0);
  const animate = time === undefined && !reduced && def.frames.length > 1;

  useEffect(() => {
    if (!animate) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let last = 0;
    let acc = 0;
    let running = false;
    const loop = (now: number) => {
      if (last) acc += Math.min(0.1, (now - last) / 1000);
      last = now;
      setT(acc);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [animate]);

  const fig = solveFrame(frameAt(def, time ?? t), def.view);
  return (
    <div ref={ref} className="pf">
      <FigureSvg def={def} fig={fig} label={label} />
    </div>
  );
}
