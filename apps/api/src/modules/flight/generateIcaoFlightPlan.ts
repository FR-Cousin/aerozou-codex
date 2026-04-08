import type { AircraftProfile, Waypoint } from "./computeVfrRoute.js";
import { computeVfrRoute } from "./computeVfrRoute.js";

export type IcaoFlightPlanInput = {
  callsign: string;
  departure: string;
  destination: string;
  alternate?: string;
  cruisingLevel: string;
  routeText: string;
  etdUtc: string;
  endurance: string;
  personsOnBoard: number;
  aircraft: AircraftProfile;
  waypoints: Waypoint[];
  wind: { directionDeg: number; speedKt: number };
};

export type IcaoFlightPlan = {
  item7_aircraftId: string;
  item8_flightRulesAndType: string;
  item9_aircraftAndWake: string;
  item10_equipment: string;
  item13_departureAndTime: string;
  item15_route: string;
  item16_destinationEtEetAndAlt: string;
  item18_otherInfo: string;
  item19_supplementary: string;
};

export function generateIcaoFlightPlan(input: IcaoFlightPlanInput): IcaoFlightPlan {
  const nav = computeVfrRoute(input.waypoints, input.aircraft, input.wind);
  const eetMin = Math.max(1, Math.round(nav.totalTimeMin));
  const eetHour = Math.floor(eetMin / 60)
    .toString()
    .padStart(2, "0");
  const eetMinute = (eetMin % 60).toString().padStart(2, "0");

  return {
    item7_aircraftId: input.callsign.toUpperCase(),
    item8_flightRulesAndType: "VG",
    item9_aircraftAndWake: "1/L",
    item10_equipment: "S/C",
    item13_departureAndTime: `${input.departure.toUpperCase()}${input.etdUtc}`,
    item15_route: `N0${Math.round(input.aircraft.trueAirspeedKt)} ${input.cruisingLevel.toUpperCase()} ${input.routeText}`,
    item16_destinationEtEetAndAlt: `${input.destination.toUpperCase()} ${eetHour}${eetMinute} ${
      input.alternate?.toUpperCase() ?? "ZZZZ"
    }`,
    item18_otherInfo: `EET/${input.destination.toUpperCase()}${eetHour}${eetMinute}`,
    item19_supplementary: `E/${input.endurance} P/${input.personsOnBoard}`,
  };
}
