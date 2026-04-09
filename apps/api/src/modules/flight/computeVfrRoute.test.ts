import { describe, expect, it } from "vitest";
import { computeVfrRoute } from "./computeVfrRoute.js";

describe("computeVfrRoute", () => {
  it("calcule une route VFR multi-segments", () => {
    const result = computeVfrRoute(
      [
        { code: "LFBO", lat: 43.6293, lon: 1.3633 },
        { code: "LFDH", lat: 43.6878, lon: 0.6017 },
        { code: "LFBD", lat: 44.8283, lon: -0.7156 },
      ],
      { trueAirspeedKt: 115, fuelBurnLh: 33 },
      { directionDeg: 300, speedKt: 15 },
    );

    expect(result.legs).toHaveLength(2);
    expect(result.totalDistanceNm).toBeGreaterThan(90);
    expect(result.totalFuelL).toBeGreaterThan(20);
    expect(result.totalTimeMin).toBeGreaterThan(40);
  });
});
