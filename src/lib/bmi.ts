export type BmiScale = "who" | "asia";
export type BmiCategory = "Underweight" | "Normal" | "Overweight" | "Obese";

export const HEIGHT_CM_RANGE = { min: 100, max: 250 } as const;
export const WEIGHT_KG_RANGE = { min: 25, max: 300 } as const;

export const KG_PER_LB = 0.45359237;
export const CM_PER_IN = 2.54;

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}

export function ftInToCm(ft: number, inches: number): number {
  return (ft * 12 + inches) * CM_PER_IN;
}

export function cmToFtIn(cm: number): { ft: number; inches: number } {
  const totalIn = cm / CM_PER_IN;
  let ft = Math.floor(totalIn / 12);
  let inches = round1(totalIn - ft * 12);
  if (inches >= 12) {
    ft += 1;
    inches = round1(inches - 12);
  }
  return { ft, inches };
}

/** BMI = kg / m², rounded to 1 decimal. */
export function bmiMetric(kg: number, cm: number): number {
  const m = cm / 100;
  return round1(kg / (m * m));
}

/** BMI = 703 × lb / in², rounded to 1 decimal. */
export function bmiImperial(lb: number, inches: number): number {
  return round1((703 * lb) / (inches * inches));
}

/** Upper bound (inclusive, 1-decimal) of each category below Obese. */
export const SCALE_LIMITS: Record<BmiScale, { normalMax: number; overweightMax: number }> = {
  who: { normalMax: 24.9, overweightMax: 29.9 },
  asia: { normalMax: 22.9, overweightMax: 24.9 },
};

export const UNDERWEIGHT_BELOW = 18.5;

export function bmiCategory(bmi: number, scale: BmiScale): BmiCategory {
  const b = round1(bmi);
  const { normalMax, overweightMax } = SCALE_LIMITS[scale];
  if (b < UNDERWEIGHT_BELOW) return "Underweight";
  if (b <= normalMax) return "Normal";
  if (b <= overweightMax) return "Overweight";
  return "Obese";
}

/** Healthy (Normal) weight range in kg for a height. */
export function healthyRangeKg(cm: number, scale: BmiScale): { min: number; max: number } {
  const m2 = (cm / 100) ** 2;
  return {
    min: round1(UNDERWEIGHT_BELOW * m2),
    max: round1(SCALE_LIMITS[scale].normalMax * m2),
  };
}

export interface ScaleSegment {
  label: BmiCategory;
  from: number;
  to: number;
}

/** Segments for the gauge, spanning 15 to 35. */
export function scaleSegments(scale: BmiScale): ScaleSegment[] {
  const { normalMax, overweightMax } = SCALE_LIMITS[scale];
  return [
    { label: "Underweight", from: 15, to: UNDERWEIGHT_BELOW },
    { label: "Normal", from: UNDERWEIGHT_BELOW, to: round1(normalMax + 0.1) },
    { label: "Overweight", from: round1(normalMax + 0.1), to: round1(overweightMax + 0.1) },
    { label: "Obese", from: round1(overweightMax + 0.1), to: 35 },
  ];
}

export const GAUGE_MIN = 15;
export const GAUGE_MAX = 35;

/** 0..1 position of a BMI on the gauge. */
export function gaugePosition(bmi: number): number {
  const p = (bmi - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN);
  return Math.min(1, Math.max(0, p));
}

export function isHeightValid(cm: number): boolean {
  return Number.isFinite(cm) && cm >= HEIGHT_CM_RANGE.min && cm <= HEIGHT_CM_RANGE.max;
}

export function isWeightValid(kg: number): boolean {
  return Number.isFinite(kg) && kg >= WEIGHT_KG_RANGE.min && kg <= WEIGHT_KG_RANGE.max;
}
