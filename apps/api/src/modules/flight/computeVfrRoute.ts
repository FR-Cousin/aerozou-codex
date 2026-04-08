export type Waypoint = {
  code: string;
  lat: number;
  lon: number;
};

export type AircraftProfile = {
  trueAirspeedKt: number;
  fuelBurnLh: number;
};

export type Wind = {
  directionDeg: number;
  speedKt: number;
};

export type LegComputation = {
  from: string;
  to: string;
  distanceNm: number;
  trueCourseDeg: number;
  headingDeg: number;
  groundSpeedKt: number;
  timeMin: number;
  fuelL: number;
};

const EARTH_RADIUS_NM = 3440.065;

const toRad = (deg: number): number => (deg * Math.PI) / 180;
const toDeg = (rad: number): number => (rad * 180) / Math.PI;

const normalize360 = (deg: number): number => {
  const n = deg % 360;
  return n < 0 ? n + 360 : n;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

function greatCircleDistanceNm(a: Waypoint, b: Waypoint): number {
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const dLat = lat2 - lat1;
  const dLon = toRad(b.lon - a.lon);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_NM * Math.asin(Math.sqrt(h));
}

function initialCourseDeg(a: Waypoint, b: Waypoint): number {
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const dLon = toRad(b.lon - a.lon);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  return normalize360(toDeg(Math.atan2(y, x)));
}

function windCorrection(
  courseDeg: number,
  tasKt: number,
  wind: Wind,
): { headingDeg: number; groundSpeedKt: number } {
  const windFromRad = toRad(wind.directionDeg);
  const courseRad = toRad(courseDeg);

  const windToRad = normalize360(toDeg(windFromRad) + 180) * (Math.PI / 180);
  const rel = windToRad - courseRad;

  const crosswind = wind.speedKt * Math.sin(rel);
  const headwind = wind.speedKt * Math.cos(rel);

  const wcaRad = Math.asin(clamp(crosswind / tasKt, -1, 1));
  const heading = normalize360(courseDeg + toDeg(wcaRad));
  const gs = Math.max(40, tasKt * Math.cos(wcaRad) + headwind);

  return { headingDeg: heading, groundSpeedKt: gs };
}

export function computeVfrRoute(
  waypoints: Waypoint[],
  aircraft: AircraftProfile,
  wind: Wind,
): { legs: LegComputation[]; totalDistanceNm: number; totalFuelL: number; totalTimeMin: number } {
  if (waypoints.length < 2) {
    throw new Error("At least two waypoints are required");
  }

  const legs: LegComputation[] = [];

  for (let i = 0; i < waypoints.length - 1; i += 1) {
    const from = waypoints[i];
    const to = waypoints[i + 1];
    const distanceNm = Number(greatCircleDistanceNm(from, to).toFixed(1));
    const trueCourseDeg = Number(initialCourseDeg(from, to).toFixed(0));
    const { headingDeg, groundSpeedKt } = windCorrection(
      trueCourseDeg,
      aircraft.trueAirspeedKt,
      wind,
    );

    const timeMin = Number(((distanceNm / groundSpeedKt) * 60).toFixed(1));
    const fuelL = Number(((timeMin / 60) * aircraft.fuelBurnLh).toFixed(1));

    legs.push({
      from: from.code,
      to: to.code,
      distanceNm,
      trueCourseDeg,
      headingDeg: Number(headingDeg.toFixed(0)),
      groundSpeedKt: Number(groundSpeedKt.toFixed(1)),
      timeMin,
      fuelL,
    });
  }

  const totalDistanceNm = Number(
    legs.reduce((sum, leg) => sum + leg.distanceNm, 0).toFixed(1),
  );
  const totalFuelL = Number(legs.reduce((sum, leg) => sum + leg.fuelL, 0).toFixed(1));
  const totalTimeMin = Number(legs.reduce((sum, leg) => sum + leg.timeMin, 0).toFixed(1));

  return { legs, totalDistanceNm, totalFuelL, totalTimeMin };
}
