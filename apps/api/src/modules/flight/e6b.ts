export type E6BInput = {
  trueAirspeedKt: number;
  courseDeg: number;
  windFromDeg: number;
  windKt: number;
  variationDeg?: number;
};

export type E6BOutput = {
  headingTrueDeg: number;
  headingMagneticDeg: number;
  groundSpeedKt: number;
  windCorrectionAngleDeg: number;
};

const toRad = (deg: number): number => (deg * Math.PI) / 180;
const toDeg = (rad: number): number => (rad * 180) / Math.PI;

const normalize360 = (deg: number): number => {
  const n = deg % 360;
  return n < 0 ? n + 360 : n;
};

const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

export function computeE6B(input: E6BInput): E6BOutput {
  const windTo = normalize360(input.windFromDeg + 180);
  const rel = toRad(windTo - input.courseDeg);

  const crosswind = input.windKt * Math.sin(rel);
  const headwind = input.windKt * Math.cos(rel);

  const wcaRad = Math.asin(clamp(crosswind / input.trueAirspeedKt, -1, 1));
  const wcaDeg = toDeg(wcaRad);

  const headingTrueDeg = normalize360(input.courseDeg + wcaDeg);
  const groundSpeedKt = Math.max(35, input.trueAirspeedKt * Math.cos(wcaRad) + headwind);
  const headingMagneticDeg = normalize360(headingTrueDeg - (input.variationDeg ?? 0));

  return {
    headingTrueDeg: Number(headingTrueDeg.toFixed(0)),
    headingMagneticDeg: Number(headingMagneticDeg.toFixed(0)),
    groundSpeedKt: Number(groundSpeedKt.toFixed(1)),
    windCorrectionAngleDeg: Number(wcaDeg.toFixed(1)),
  };
}
