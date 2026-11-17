/*
 * Line-art pose engine: forward + inverse kinematics for a simple figure,
 * and interpolation between keyframes (angles rotate, targets slide).
 * Coordinates are SVG units; angles are degrees, 0 = right, 90 = down.
 */

export type Vec = [number, number];

export const SEG = {
  torso: 44,
  neck: 5,
  headR: 8,
  upperArm: 27,
  forearm: 25,
  thigh: 34,
  shin: 34,
  hand: 9,
  foot: 11,
  shoulderHalf: 14,
  hipHalf: 8,
} as const;

/** A limb is either two absolute segment angles, or an IK target. */
export type LimbSpec =
  | { a: [number, number]; s?: [number, number]; end?: number }
  | { to: Vec; bend: 1 | -1; end?: number };

export interface PoseFrame {
  hip: Vec;
  /** angle hip -> neck */
  torso: number;
  /** angle neck -> head; defaults to torso */
  head?: number;
  armN: LimbSpec;
  armF: LimbSpec;
  legN: LimbSpec;
  legF: LimbSpec;
  /** seconds to hold this frame (default 0.35) */
  hold?: number;
  /** seconds to move into the next frame (default 1) */
  move?: number;
}

export type View = "side" | "front" | "top";
export type Part = "armN" | "armF" | "legN" | "legF" | "torso";

export type WeightMode =
  | { kind: "none" }
  | { kind: "both" | "near" | "one" | "goblet"; style: "end" | "bar"; rot?: number | "fore" | "fore+90" }
  | { kind: "hip"; style: "end" };

export type Prop =
  | { type: "bench"; x: number; w: number; top: number; view: "side" | "end" | "top"; h?: number }
  | { type: "floor"; y: number; x1?: number; x2?: number };

export interface PoseDef {
  id: string;
  view: View;
  frames: PoseFrame[];
  weights: WeightMode;
  active: Part[];
  props: Prop[];
  badge?: string;
  /** isometric hold: draws a hold timer instead of moving */
  hold?: boolean;
  viewBox?: [number, number, number, number];
}

export const DEFAULT_VIEWBOX: [number, number, number, number] = [0, 0, 240, 160];
export const FLOOR_Y = 150;

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const add = (p: Vec, a: number, len: number): Vec => [p[0] + Math.cos(rad(a)) * len, p[1] + Math.sin(rad(a)) * len];
const angleOf = (from: Vec, to: Vec) => deg(Math.atan2(to[1] - from[1], to[0] - from[0]));
const dist = (a: Vec, b: Vec) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/** Two-bone IK. Returns segment angles. bend flips the joint side. */
export function solveIK(root: Vec, target: Vec, l1: number, l2: number, bend: 1 | -1): [number, number] {
  const d = Math.min(Math.max(dist(root, target), Math.abs(l1 - l2) + 0.01), l1 + l2 - 0.001);
  const base = angleOf(root, target);
  const cos = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
  const a = deg(Math.acos(Math.min(1, Math.max(-1, cos))));
  const upper = base + bend * a;
  const joint = add(root, upper, l1);
  // Aim the second bone at the target (or along the clamped direction).
  const lower = angleOf(joint, dist(root, target) > l1 + l2 ? add(root, base, l1 + l2) : target);
  return [upper, lower];
}

export interface LimbOut {
  pts: Vec[]; // root, joint, end (, hand/foot tip)
  upper: number;
  lower: number;
}

export interface Figure {
  head: Vec;
  neck: Vec;
  hip: Vec;
  shoulders: [Vec, Vec]; // [N, F]
  hips: [Vec, Vec];
  armN: LimbOut;
  armF: LimbOut;
  legN: LimbOut;
  legF: LimbOut;
}

function limb(root: Vec, spec: LimbSpec, l1: number, l2: number, tip: number, defaultTip: (lower: number) => number | null): LimbOut {
  let upper: number;
  let lower: number;
  let s1 = 1;
  let s2 = 1;
  if ("to" in spec) {
    [upper, lower] = solveIK(root, spec.to, l1, l2, spec.bend);
  } else {
    [upper, lower] = spec.a;
    if (spec.s) [s1, s2] = spec.s;
  }
  const joint = add(root, upper, l1 * s1);
  const end = add(joint, lower, l2 * s2);
  const pts: Vec[] = [root, joint, end];
  const tipAngle = spec.end ?? defaultTip(lower);
  if (tipAngle !== null && tipAngle !== undefined) pts.push(add(end, tipAngle, tip));
  return { pts, upper, lower };
}

export function solveFrame(f: PoseFrame, view: View): Figure {
  const neck = add(f.hip, f.torso, SEG.torso);
  const head = add(neck, f.head ?? f.torso, SEG.neck + SEG.headR);
  let shoulders: [Vec, Vec] = [neck, neck];
  let hips: [Vec, Vec] = [f.hip, f.hip];
  if (view !== "side") {
    const perp = f.torso + 90;
    shoulders = [add(neck, perp, SEG.shoulderHalf), add(neck, perp, -SEG.shoulderHalf)];
    hips = [add(f.hip, perp, SEG.hipHalf), add(f.hip, perp, -SEG.hipHalf)];
  }
  const noTip = () => null;
  const footTip = (side: "N" | "F") => (lower: number) =>
    view === "side" ? lower - 90 : side === "N" ? lower - 90 : lower + 90;
  return {
    head,
    neck,
    hip: f.hip,
    shoulders,
    hips,
    armN: limb(shoulders[0], f.armN, SEG.upperArm, SEG.forearm, SEG.hand, noTip),
    armF: limb(shoulders[1], f.armF, SEG.upperArm, SEG.forearm, SEG.hand, noTip),
    legN: limb(hips[0], f.legN, SEG.thigh, SEG.shin, SEG.foot, footTip("N")),
    legF: limb(hips[1], f.legF, SEG.thigh, SEG.shin, SEG.foot, footTip("F")),
  };
}

/* ---------- interpolation ---------- */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpAngle = (a: number, b: number, t: number) => {
  let d = ((b - a) % 360 + 540) % 360 - 180;
  return a + d * t;
};
const lerpVec = (a: Vec, b: Vec, t: number): Vec => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

function lerpLimb(a: LimbSpec, b: LimbSpec, t: number, ra: LimbOut, rb: LimbOut): LimbSpec {
  const endA = a.end;
  const endB = b.end;
  const end =
    endA !== undefined && endB !== undefined ? lerpAngle(endA, endB, t) : t < 0.5 ? endA : endB;
  if ("to" in a && "to" in b && a.bend === b.bend) {
    return { to: lerpVec(a.to, b.to, t), bend: a.bend, end };
  }
  const sa = "a" in a && a.s ? a.s : [1, 1];
  const sb = "a" in b && b.s ? b.s : [1, 1];
  return {
    a: [lerpAngle(ra.upper, rb.upper, t), lerpAngle(ra.lower, rb.lower, t)],
    s: [lerp(sa[0], sb[0], t), lerp(sa[1], sb[1], t)],
    end,
  };
}

export function lerpFrame(a: PoseFrame, b: PoseFrame, t: number, view: View): PoseFrame {
  const fa = solveFrame(a, view);
  const fb = solveFrame(b, view);
  return {
    hip: lerpVec(a.hip, b.hip, t),
    torso: lerpAngle(a.torso, b.torso, t),
    head: lerpAngle(a.head ?? a.torso, b.head ?? b.torso, t),
    armN: lerpLimb(a.armN, b.armN, t, fa.armN, fb.armN),
    armF: lerpLimb(a.armF, b.armF, t, fa.armF, fb.armF),
    legN: lerpLimb(a.legN, b.legN, t, fa.legN, fb.legN),
    legF: lerpLimb(a.legF, b.legF, t, fa.legF, fb.legF),
  };
}

const ease = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;

export function cycleLength(def: PoseDef): number {
  if (def.frames.length < 2) return 2;
  return def.frames.reduce((s, f) => s + (f.hold ?? 0.35) + (f.move ?? 1), 0);
}

/** Pose at time (seconds) in the loop. */
export function frameAt(def: PoseDef, time: number): PoseFrame {
  const frames = def.frames;
  if (frames.length < 2) return frames[0];
  let t = ((time % cycleLength(def)) + cycleLength(def)) % cycleLength(def);
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    const hold = f.hold ?? 0.35;
    const move = f.move ?? 1;
    if (t < hold) return f;
    t -= hold;
    if (t < move) return lerpFrame(f, frames[(i + 1) % frames.length], ease(t / move), def.view);
    t -= move;
  }
  return frames[0];
}

/** Time of the "end" position (used for the static reduced-motion pair). */
export function peakTime(def: PoseDef): number {
  if (def.frames.length < 2) return 0;
  const idx = Math.floor(def.frames.length / 2);
  let t = 0;
  for (let i = 0; i < idx; i++) t += (def.frames[i].hold ?? 0.35) + (def.frames[i].move ?? 1);
  return t + 0.01;
}

/* ---------- weights ---------- */

export interface WeightOut {
  key: string;
  c: Vec;
  rot: number;
}

export function weightsFor(def: PoseDef, fig: Figure): WeightOut[] {
  const w = def.weights;
  if (w.kind === "none") return [];
  if (w.kind === "hip") return [{ key: "w0", c: [fig.hip[0], fig.hip[1] - 8], rot: 0 }];
  const rotFor = (l: LimbOut) =>
    w.rot === "fore" ? l.lower : w.rot === "fore+90" ? l.lower + 90 : (w.rot ?? 0);
  const at = (l: LimbOut): Vec => l.pts[l.pts.length - 1];
  if (w.kind === "both") {
    return [
      { key: "wF", c: at(fig.armF), rot: rotFor(fig.armF) },
      { key: "wN", c: at(fig.armN), rot: rotFor(fig.armN) },
    ];
  }
  if (w.kind === "near" || w.kind === "one") return [{ key: "wN", c: at(fig.armN), rot: rotFor(fig.armN) }];
  const a = at(fig.armN);
  const b = at(fig.armF);
  return [{ key: "wN", c: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], rot: rotFor(fig.armN) }];
}
