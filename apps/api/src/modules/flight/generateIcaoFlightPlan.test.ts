import { describe, expect, it } from "vitest";
import { generateIcaoFlightPlan } from "./generateIcaoFlightPlan.js";

describe("generateIcaoFlightPlan", () => {
  it("compose les principaux items ICAO", () => {
    const plan = generateIcaoFlightPlan({
      callsign: "FJABC",
      departure: "LFBO",
      destination: "LFBD",
      cruisingLevel: "F055",
      routeText: "DCT LFDH DCT",
      etdUtc: "0830",
      endurance: "0400",
      personsOnBoard: 3,
      aircraft: { trueAirspeedKt: 112, fuelBurnLh: 32 },
      wind: { directionDeg: 290, speedKt: 12 },
      waypoints: [
        { code: "LFBO", lat: 43.6293, lon: 1.3633 },
        { code: "LFDH", lat: 43.6878, lon: 0.6017 },
        { code: "LFBD", lat: 44.8283, lon: -0.7156 },
      ],
    });

    expect(plan.item7_aircraftId).toBe("FJABC");
    expect(plan.item13_departureAndTime).toContain("LFBO");
    expect(plan.item16_destinationEtEetAndAlt).toContain("LFBD");
  });
});
