export type DecodedMetar = {
  station: string;
  observationTime: string;
  wind?: string;
  visibility?: string;
  temperatureDewpoint?: string;
  qnh?: string;
};

export function decodeMetar(raw: string): DecodedMetar {
  const tokens = raw.trim().split(/\s+/);

  if (tokens.length < 3) {
    throw new Error("METAR invalide");
  }

  const station = tokens[0];
  const observationTime = tokens[1];
  const wind = tokens.find((t) => /KT$/.test(t));
  const visibility = tokens.find((t) => /^\d{4}$/.test(t) || t === "CAVOK");
  const temperatureDewpoint = tokens.find((t) => /^M?\d{2}\/M?\d{2}$/.test(t));
  const qnh = tokens.find((t) => /^Q\d{4}$/.test(t));

  return {
    station,
    observationTime,
    wind,
    visibility,
    temperatureDewpoint,
    qnh,
  };
}
