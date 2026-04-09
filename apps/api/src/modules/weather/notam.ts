export type Notam = {
  id: string;
  aerodrome: string;
  validFromUtc: string;
  validToUtc: string;
  text: string;
  source: "mock" | "ead-basic";
};

const notamMockDb: Notam[] = [
  {
    id: "A1234/26",
    aerodrome: "LFBO",
    validFromUtc: "2026-04-08T06:00:00Z",
    validToUtc: "2026-04-09T20:00:00Z",
    text: "TWY B CLSD DUE WIP",
    source: "mock",
  },
  {
    id: "B5678/26",
    aerodrome: "LFBD",
    validFromUtc: "2026-04-08T00:00:00Z",
    validToUtc: "2026-04-15T23:59:00Z",
    text: "CRANE 230FT AGL 2NM E AD",
    source: "mock",
  },
];

export function listNotamByAerodrome(aerodrome: string): Notam[] {
  const icao = aerodrome.toUpperCase();
  return notamMockDb.filter((n) => n.aerodrome === icao);
}
