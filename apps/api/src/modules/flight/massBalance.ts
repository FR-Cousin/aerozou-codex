export type MassItem = {
  name: string;
  armMm: number;
  massKg: number;
};

export type MassBalanceInput = {
  emptyMassKg: number;
  emptyMomentKgm: number;
  items: MassItem[];
  maxTakeoffMassKg: number;
  cgEnvelopeMm: { min: number; max: number };
};

export type MassBalanceOutput = {
  totalMassKg: number;
  totalMomentKgm: number;
  cgMm: number;
  withinMassLimit: boolean;
  withinCgEnvelope: boolean;
};

export function computeMassBalance(input: MassBalanceInput): MassBalanceOutput {
  const payloadMass = input.items.reduce((sum, i) => sum + i.massKg, 0);
  const payloadMomentKgm = input.items.reduce(
    (sum, i) => sum + (i.massKg * i.armMm) / 1000,
    0,
  );

  const totalMassKg = input.emptyMassKg + payloadMass;
  const totalMomentKgm = input.emptyMomentKgm + payloadMomentKgm;
  const cgMm = (totalMomentKgm / totalMassKg) * 1000;

  return {
    totalMassKg: Number(totalMassKg.toFixed(1)),
    totalMomentKgm: Number(totalMomentKgm.toFixed(2)),
    cgMm: Number(cgMm.toFixed(1)),
    withinMassLimit: totalMassKg <= input.maxTakeoffMassKg,
    withinCgEnvelope:
      cgMm >= input.cgEnvelopeMm.min && cgMm <= input.cgEnvelopeMm.max,
  };
}
