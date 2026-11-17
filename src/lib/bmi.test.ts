import { describe, expect, it } from "vitest";
import {
  bmiCategory,
  bmiImperial,
  bmiMetric,
  cmToFtIn,
  ftInToCm,
  healthyRangeKg,
  kgToLb,
  lbToKg,
} from "./bmi";

describe("bmi", () => {
  it("65 kg, 170.18 cm gives 22.4 (Normal on both scales)", () => {
    const b = bmiMetric(65, 170.18);
    expect(b).toBe(22.4);
    expect(bmiCategory(b, "who")).toBe("Normal");
    expect(bmiCategory(b, "asia")).toBe("Normal");
  });

  it("65 kg, 170 cm gives 22.5", () => {
    expect(bmiMetric(65, 170)).toBe(22.5);
  });

  it("imperial 143.3 lb, 5 ft 7 in gives 22.4, matching metric", () => {
    expect(bmiImperial(143.3, 67)).toBe(22.4);
    expect(bmiImperial(143.3, 67)).toBe(bmiMetric(lbToKg(143.3), ftInToCm(5, 7)));
  });

  it("healthy range for 170.18 cm", () => {
    const who = healthyRangeKg(170.18, "who");
    const asia = healthyRangeKg(170.18, "asia");
    expect(who.min).toBeCloseTo(53.6, 1);
    expect(who.max).toBeCloseTo(72.1, 1);
    expect(asia.min).toBeCloseTo(53.6, 1);
    expect(asia.max).toBeCloseTo(66.3, 1);
  });

  it("WHO boundaries", () => {
    expect(bmiCategory(18.4, "who")).toBe("Underweight");
    expect(bmiCategory(18.5, "who")).toBe("Normal");
    expect(bmiCategory(22.9, "who")).toBe("Normal");
    expect(bmiCategory(23.0, "who")).toBe("Normal");
    expect(bmiCategory(24.9, "who")).toBe("Normal");
    expect(bmiCategory(25.0, "who")).toBe("Overweight");
    expect(bmiCategory(29.9, "who")).toBe("Overweight");
    expect(bmiCategory(30.0, "who")).toBe("Obese");
  });

  it("Asian boundaries", () => {
    expect(bmiCategory(18.4, "asia")).toBe("Underweight");
    expect(bmiCategory(18.5, "asia")).toBe("Normal");
    expect(bmiCategory(22.9, "asia")).toBe("Normal");
    expect(bmiCategory(23.0, "asia")).toBe("Overweight");
    expect(bmiCategory(24.9, "asia")).toBe("Overweight");
    expect(bmiCategory(25.0, "asia")).toBe("Obese");
    expect(bmiCategory(29.9, "asia")).toBe("Obese");
    expect(bmiCategory(30.0, "asia")).toBe("Obese");
  });

  it("unit conversions round-trip", () => {
    expect(kgToLb(lbToKg(150))).toBeCloseTo(150, 6);
    expect(ftInToCm(5, 7)).toBeCloseTo(170.18, 2);
    expect(cmToFtIn(170.18)).toEqual({ ft: 5, inches: 7 });
  });
});
