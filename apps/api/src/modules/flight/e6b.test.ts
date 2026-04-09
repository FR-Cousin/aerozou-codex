import { describe, expect, it } from "vitest";
import { computeE6B } from "./e6b.js";

describe("computeE6B", () => {
  it("retourne un cap et une GS plausibles", () => {
    const out = computeE6B({
      trueAirspeedKt: 110,
      courseDeg: 250,
      windFromDeg: 300,
      windKt: 20,
      variationDeg: 2,
    });

    expect(out.groundSpeedKt).toBeGreaterThan(70);
    expect(out.headingTrueDeg).toBeGreaterThanOrEqual(0);
    expect(out.headingTrueDeg).toBeLessThan(360);
  });
});
