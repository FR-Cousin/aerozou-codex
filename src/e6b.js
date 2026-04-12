const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

const normalize360 = (deg) => {
  const n = deg % 360;
  return n < 0 ? n + 360 : n;
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function computeE6B({
  trueAirspeedKt,
  courseDeg,
  windFromDeg,
  windKt,
  variationDeg = 0,
}) {
  const windToDeg = normalize360(windFromDeg + 180);
  const relativeRad = toRad(windToDeg - courseDeg);

  const crosswind = windKt * Math.sin(relativeRad);
  const headwind = windKt * Math.cos(relativeRad);

  const wcaRad = Math.asin(clamp(crosswind / trueAirspeedKt, -1, 1));
  const headingTrueDeg = normalize360(courseDeg + toDeg(wcaRad));
  const headingMagneticDeg = normalize360(headingTrueDeg - variationDeg);
  const groundSpeedKt = Math.max(35, trueAirspeedKt * Math.cos(wcaRad) + headwind);

  return {
    headingTrueDeg: Number(headingTrueDeg.toFixed(0)),
    headingMagneticDeg: Number(headingMagneticDeg.toFixed(0)),
    windCorrectionAngleDeg: Number(toDeg(wcaRad).toFixed(1)),
    groundSpeedKt: Number(groundSpeedKt.toFixed(1)),
  };
}
