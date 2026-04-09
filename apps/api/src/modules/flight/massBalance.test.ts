import { describe, expect, it } from "vitest";
import { computeMassBalance } from "./massBalance.js";

describe("computeMassBalance", () => {
  it("calcule masse totale et centrage", () => {
    const result = computeMassBalance({
      emptyMassKg: 680,
      emptyMomentKgm: 210,
      maxTakeoffMassKg: 1100,
      cgEnvelopeMm: { min: 320, max: 420 },
      items: [
        { name: "Pilote", armMm: 350, massKg: 78 },
        { name: "Passager", armMm: 350, massKg: 70 },
        { name: "Carburant", armMm: 480, massKg: 120 },
      ],
    });

    expect(result.totalMassKg).toBeGreaterThan(900);
    expect(result.withinMassLimit).toBe(true);
  });
});
