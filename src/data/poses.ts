import type { LimbSpec, PoseDef, PoseFrame, Prop, Vec } from "@/lib/pose";

/*
 * Keyframes for every exercise. Side views face right; "N" limbs are the
 * near side (drawn solid), "F" the far side (drawn faded). In front and
 * top views, N is the figure's screen-right side.
 */

const F = 150; // floor line
const floor: Prop = { type: "floor", y: F };
const A = (u: number, f: number, s?: [number, number], end?: number): LimbSpec => ({ a: [u, f], s, end });
const T = (to: Vec, bend: 1 | -1, end?: number): LimbSpec => ({ to, bend, end });
const both = (l: LimbSpec) => ({ armN: l, armF: l });
const legs = (l: LimbSpec) => ({ legN: l, legF: l });

/* ----- shared bodies ----- */

/** Lying on a flat bench, head to the left. */
function lying(dx = 0) {
  const hip: Vec = [100 + dx, 107];
  return {
    base: { hip, torso: 180, ...legs(A(10, 90)) },
    bench: { type: "bench", x: 34 + dx, w: 96, top: 113, view: "side" } as Prop,
  };
}

/** Seated on the bench, side view, facing right. */
const SEAT_SIDE = {
  hip: [96, 112] as Vec,
  torso: -90,
  ...legs(A(3, 90)),
};
const benchSeatSide: Prop = { type: "bench", x: 40, w: 84, top: 117, view: "side" };

/** Seated on the end of the bench, front view. */
const SEAT_FRONT = {
  hip: [120, 108] as Vec,
  torso: -90,
  legN: A(60, 90, [0.32, 1]),
  legF: A(120, 90, [0.32, 1]),
};
const benchEnd: Prop = { type: "bench", x: 102, w: 36, top: 113, view: "end" };

const hang = A(92, 90);

export const POSES = {
  "bench-press": ((): PoseDef => {
    const { base, bench } = lying();
    return {
      id: "bench-press",
      view: "side",
      props: [floor, bench],
      weights: { kind: "both", style: "end" },
      active: ["armN", "armF"],
      frames: [
        { ...base, ...both(A(-90, -90)) },
        { ...base, ...both(A(40, -90, [0.55, 1])), move: 1.4 },
      ],
    };
  })(),

  "push-up": {
    id: "push-up",
    view: "side",
    props: [floor],
    weights: { kind: "none" },
    active: ["armN", "armF"],
    frames: [
      { hip: [100.2, 116.4], torso: -27.7, ...both(T([139, 147], 1)), ...legs(T([38, 146], -1)) },
      { hip: [106.7, 132.7], torso: -12.5, ...both(T([139, 147], 1)), ...legs(T([38, 146], -1)), move: 1.2 },
    ],
  },

  "close-grip-push-up": {
    id: "close-grip-push-up",
    view: "side",
    props: [floor],
    weights: { kind: "none" },
    active: ["armN", "armF"],
    badge: "Hands close",
    frames: [
      { hip: [98, 116.4], torso: -27.7, ...both(T([135, 147], 1)), ...legs(T([36, 146], -1)) },
      { hip: [104.5, 132.7], torso: -12.5, ...both(T([135, 147], 1)), ...legs(T([36, 146], -1)), move: 1.2 },
    ],
  },

  flyes: {
    id: "flyes",
    view: "top",
    badge: "Top view",
    viewBox: [0, -8, 240, 168],
    props: [{ type: "bench", x: 34, w: 104, top: 72, view: "top", h: 16 }],
    weights: { kind: "both", style: "bar", rot: 0 },
    active: ["armN", "armF"],
    frames: [
      {
        hip: [106, 80],
        torso: 180,
        armN: A(40, 150, [0.36, 0.36]),
        armF: A(-40, -150, [0.36, 0.36]),
        legN: A(-6, 4, [0.95, 0.75]),
        legF: A(6, -4, [0.95, 0.75]),
      },
      {
        hip: [106, 80],
        torso: 180,
        armN: A(-98, -108, [0.9, 0.9]),
        armF: A(98, 108, [0.9, 0.9]),
        legN: A(-6, 4, [0.95, 0.75]),
        legF: A(6, -4, [0.95, 0.75]),
        move: 1.4,
      },
    ],
  },

  "shoulder-press": {
    id: "shoulder-press",
    view: "front",
    props: [floor, benchEnd],
    weights: { kind: "both", style: "bar", rot: 0 },
    active: ["armN", "armF"],
    frames: [
      { ...SEAT_FRONT, armN: A(5, -90), armF: A(175, -90) },
      { ...SEAT_FRONT, armN: A(-72, -84), armF: A(-108, -96) },
    ],
  },

  "lateral-raise": {
    id: "lateral-raise",
    view: "front",
    props: [floor, benchEnd],
    weights: { kind: "both", style: "end" },
    active: ["armN", "armF"],
    frames: [
      { ...SEAT_FRONT, armN: A(84, 92), armF: A(96, 88) },
      { ...SEAT_FRONT, armN: A(-3, 6), armF: A(183, 174), move: 1.1 },
    ],
  },

  "front-raise": {
    id: "front-raise",
    view: "side",
    props: [floor, benchSeatSide],
    weights: { kind: "both", style: "end" },
    active: ["armN", "armF"],
    frames: [
      { ...SEAT_SIDE, ...both(A(84, 86)) },
      { ...SEAT_SIDE, ...both(A(0, -4)), move: 1.1 },
    ],
  },

  "triceps-extension": ((): PoseDef => {
    const { base, bench } = lying(8);
    return {
      id: "triceps-extension",
      view: "side",
      props: [floor, bench],
      weights: { kind: "both", style: "end" },
      active: ["armN", "armF"],
      frames: [
        { ...base, ...both(A(-100, -95)) },
        { ...base, ...both(A(-100, 150)), move: 1.3 },
      ],
    };
  })(),

  "bench-dips": {
    id: "bench-dips",
    view: "side",
    props: [floor, { type: "bench", x: 20, w: 92, top: 113, view: "side" }],
    weights: { kind: "none" },
    active: ["armN", "armF"],
    frames: [
      { hip: [122, 104], torso: -90, ...both(T([109, 112], 1)), ...legs(T([164, 146], -1)) },
      { hip: [124, 132], torso: -86, ...both(T([109, 112], 1)), ...legs(T([164, 146], -1)), move: 1.2 },
    ],
  },

  "front-plank": {
    id: "front-plank",
    view: "side",
    hold: true,
    props: [floor],
    weights: { kind: "none" },
    active: ["torso"],
    frames: [{ hip: [101.7, 129.3], torso: -15.1, ...both(A(90, 0)), ...legs(T([36, 146], -1)) }],
  },

  "side-plank": {
    id: "side-plank",
    view: "side",
    hold: true,
    badge: "Each side",
    props: [floor],
    weights: { kind: "none" },
    active: ["torso"],
    frames: [
      {
        hip: [100, 128],
        torso: -15,
        armN: A(-90, -90),
        armF: A(90, 0, [1, 0.45]),
        ...legs(T([38, 146], -1)),
      },
    ],
  },

  "single-arm-row": {
    id: "single-arm-row",
    view: "side",
    props: [floor, { type: "bench", x: 30, w: 96, top: 113, view: "side" }],
    weights: { kind: "near", style: "end" },
    active: ["armN"],
    frames: [
      {
        hip: [72, 79],
        torso: -20,
        head: -5,
        armN: A(90, 90),
        armF: T([117, 112], -1),
        legN: T([60, 146], -1),
        legF: A(90, 180),
      },
      {
        hip: [72, 79],
        torso: -20,
        head: -5,
        armN: A(160, 90),
        armF: T([117, 112], -1),
        legN: T([60, 146], -1),
        legF: A(90, 180),
        move: 1.2,
      },
    ],
  },

  pullover: ((): PoseDef => {
    const { base, bench } = lying(26);
    return {
      id: "pullover",
      view: "side",
      props: [floor, bench],
      weights: { kind: "one", style: "bar", rot: "fore" },
      active: ["armN", "armF"],
      frames: [
        { ...base, ...both(A(-92, -88)) },
        { ...base, ...both(A(162, 168)), move: 1.6 },
      ],
    };
  })(),

  "bird-dog": {
    id: "bird-dog",
    view: "side",
    props: [floor],
    weights: { kind: "none" },
    active: ["armN", "legF"],
    frames: [
      { hip: [96, 112], torso: -21, ...both(A(90, 90)), ...legs(A(90, 180)) },
      {
        hip: [96, 112],
        torso: -21,
        armN: A(-12, -12),
        armF: A(90, 90),
        legN: A(90, 180),
        legF: A(176, 178),
        hold: 1.1,
      },
    ],
  },

  "seated-curl": {
    id: "seated-curl",
    view: "side",
    badge: "Palms up",
    props: [floor, benchSeatSide],
    weights: { kind: "both", style: "end" },
    active: ["armN", "armF"],
    frames: [
      { ...SEAT_SIDE, ...both(A(90, 88)) },
      { ...SEAT_SIDE, ...both(A(88, -75)) },
    ],
  },

  "hammer-curl": {
    id: "hammer-curl",
    view: "side",
    badge: "Thumbs up",
    props: [floor, benchSeatSide],
    weights: { kind: "both", style: "bar", rot: "fore+90" },
    active: ["armN", "armF"],
    frames: [
      { ...SEAT_SIDE, ...both(A(90, 88)) },
      { ...SEAT_SIDE, ...both(A(88, -75)) },
    ],
  },

  "reverse-curl": {
    id: "reverse-curl",
    view: "side",
    badge: "Palms down",
    props: [floor, benchSeatSide],
    weights: { kind: "both", style: "end" },
    active: ["armN", "armF"],
    frames: [
      { ...SEAT_SIDE, ...both(A(90, 88)) },
      { ...SEAT_SIDE, ...both(A(88, -70)) },
    ],
  },

  "wrist-curl": {
    id: "wrist-curl",
    view: "side",
    badge: "Palms up, then palms down",
    props: [floor, benchSeatSide],
    weights: { kind: "both", style: "end" },
    active: ["armN", "armF"],
    frames: [
      { ...SEAT_SIDE, torso: -30, ...both(A(138.2, 3, undefined, 70)), move: 0.8 },
      { ...SEAT_SIDE, torso: -30, ...both(A(138.2, 3, undefined, -45)), move: 0.8 },
    ],
  },

  "farmers-carry": {
    id: "farmers-carry",
    view: "side",
    props: [floor],
    weights: { kind: "both", style: "bar", rot: "fore+90" },
    active: ["armN", "armF"],
    frames: [
      { hip: [116, 80], torso: -88, ...both(hang), legN: A(72, 98), legF: A(108, 100), hold: 0, move: 0.55 },
      { hip: [116, 79], torso: -88, ...both(hang), legN: A(90, 99), legF: A(90, 99), hold: 0, move: 0.55 },
      { hip: [116, 80], torso: -88, ...both(hang), legN: A(108, 100), legF: A(72, 98), hold: 0, move: 0.55 },
      { hip: [116, 79], torso: -88, ...both(hang), legN: A(90, 99), legF: A(90, 99), hold: 0, move: 0.55 },
    ],
  },

  "goblet-squat": {
    id: "goblet-squat",
    view: "side",
    props: [floor, { type: "bench", x: 18, w: 72, top: 113, view: "side" }],
    weights: { kind: "goblet", style: "bar", rot: 90 },
    active: ["legN", "legF"],
    frames: [
      { hip: [112, 79], torso: -88, ...both(A(80, -55)), ...legs(T([116, 146], -1)) },
      { hip: [88, 107], torso: -58, ...both(A(80, -55)), ...legs(T([116, 146], -1)), move: 1.4 },
    ],
  },

  "split-squat": {
    id: "split-squat",
    view: "side",
    props: [floor, { type: "bench", x: 8, w: 60, top: 113, view: "side" }],
    weights: { kind: "none" },
    active: ["legN"],
    frames: [
      { hip: [118, 82], torso: -88, ...both(hang), legN: T([142, 146], -1), legF: T([62, 110], -1, 182) },
      { hip: [114, 109], torso: -86, ...both(hang), legN: T([142, 146], -1), legF: T([62, 110], -1, 182), move: 1.3 },
    ],
  },

  "hip-thrust": {
    id: "hip-thrust",
    view: "side",
    props: [floor, { type: "bench", x: 8, w: 62, top: 113, view: "side" }],
    weights: { kind: "hip", style: "end" },
    active: ["legN", "legF"],
    frames: [
      {
        hip: [102, 136],
        torso: -147.7,
        head: -165,
        ...both(T([108.8, 140.3], -1)),
        ...legs(T([144, 146], -1)),
      },
      {
        hip: [106, 107],
        torso: 182,
        head: 200,
        ...both(T([114, 107.3], -1)),
        ...legs(T([144, 146], -1)),
        hold: 0.8,
      },
    ],
  },

  "step-ups": {
    id: "step-ups",
    view: "side",
    viewBox: [0, -44, 260, 204],
    props: [floor, { type: "bench", x: 128, w: 100, top: 113, view: "side" }],
    weights: { kind: "both", style: "bar", rot: "fore+90" },
    active: ["legN"],
    frames: [
      { hip: [100, 82], torso: -88, ...both(hang), legN: T([140, 111], -1), legF: T([98, 146], -1) },
      { hip: [138, 46], torso: -88, ...both(hang), legN: T([140, 111], -1), legF: T([132, 111], -1), move: 1.3 },
    ],
  },

  "calf-raise": {
    id: "calf-raise",
    view: "side",
    props: [floor],
    weights: { kind: "both", style: "bar", rot: "fore+90" },
    active: ["legN", "legF"],
    frames: [
      { hip: [114, 77], torso: -90, ...both(hang), ...legs(A(90, 90, undefined, 6)) },
      { hip: [114, 69], torso: -90, ...both(hang), ...legs(A(90, 90, undefined, 52)), move: 0.8, hold: 0.7 },
    ],
  },

  "dead-bug": {
    id: "dead-bug",
    view: "side",
    props: [floor],
    weights: { kind: "none" },
    active: ["armN", "legF"],
    frames: [
      { hip: [118, 141], torso: 180, ...both(A(-90, -90)), ...legs(A(-90, 0)) },
      {
        hip: [118, 141],
        torso: 180,
        armN: A(194, 188),
        armF: A(-90, -90),
        legN: A(-90, 0),
        legF: A(-8, -4),
        move: 1.4,
        hold: 0.6,
      },
    ],
  },

  "curl-to-press": ((): PoseDef => {
    const hangF = { ...SEAT_SIDE, ...both(A(90, 88)) };
    const curl = { ...SEAT_SIDE, ...both(A(88, -75)), move: 0.7 };
    const rack = { ...SEAT_SIDE, ...both(A(45, -90)), hold: 0.1, move: 0.8 };
    const press = { ...SEAT_SIDE, ...both(A(-85, -90)), move: 0.8 };
    return {
      id: "curl-to-press",
      view: "side",
      props: [floor, benchSeatSide],
      weights: { kind: "both", style: "end" },
      active: ["armN", "armF"],
      viewBox: [0, -12, 240, 172],
      frames: [{ ...hangF, move: 0.8 }, curl, rack, press, { ...rack, move: 0.7 }, { ...curl, hold: 0.1, move: 0.8 }],
    };
  })(),

  "arnold-press": {
    id: "arnold-press",
    view: "front",
    badge: "Rotate palms",
    props: [floor, benchEnd],
    weights: { kind: "both", style: "bar", rot: 0 },
    active: ["armN", "armF"],
    frames: [
      { ...SEAT_FRONT, armN: A(100, -72, [0.55, 1]), armF: A(80, -108, [0.55, 1]), move: 0.7 },
      { ...SEAT_FRONT, armN: A(5, -90), armF: A(175, -90), hold: 0, move: 0.8 },
      { ...SEAT_FRONT, armN: A(-72, -84), armF: A(-108, -96), move: 0.8 },
      { ...SEAT_FRONT, armN: A(5, -90), armF: A(175, -90), hold: 0, move: 0.7 },
    ],
  },

  walk: {
    id: "walk",
    view: "side",
    props: [floor],
    weights: { kind: "none" },
    active: ["legN", "legF"],
    frames: [
      { hip: [116, 80], torso: -86, armN: A(108, 98), armF: A(74, 62), legN: A(72, 98), legF: A(108, 100), hold: 0, move: 0.5 },
      { hip: [116, 78], torso: -86, armN: A(91, 88), armF: A(89, 88), legN: A(90, 99), legF: A(90, 99), hold: 0, move: 0.5 },
      { hip: [116, 80], torso: -86, armN: A(74, 62), armF: A(108, 98), legN: A(108, 100), legF: A(72, 98), hold: 0, move: 0.5 },
      { hip: [116, 78], torso: -86, armN: A(89, 88), armF: A(91, 88), legN: A(90, 99), legF: A(90, 99), hold: 0, move: 0.5 },
    ],
  },
} satisfies Record<string, PoseDef>;

export type PoseId = keyof typeof POSES;

export function getPose(id: PoseId): PoseDef {
  return POSES[id] as PoseDef;
}

export type { PoseFrame };
