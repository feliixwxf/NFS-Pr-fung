export type Unit = "µg" | "mg" | "g" | "I.E." | "ml" | "ml/h" | "mg/ml" | "l";

const mass: Record<string, number> = { "µg": .001, mg: 1, g: 1000 };
const volume: Record<string, number> = { ml: 1, l: 1000 };

export function convert(value: number, from: Unit, to: Unit) {
  if (from === to) return value;
  if (from in mass && to in mass) return value * mass[from] / mass[to];
  if (from in volume && to in volume) return value * volume[from] / volume[to];
  throw new Error(`Nicht kompatible Einheiten: ${from}/${to}`);
}
export const doseByWeight = (kg: number, factor: number, singleMaximum = Infinity) => Math.min(kg * factor, singleMaximum);
export const volumeForDose = (dose: number, concentration: number) => dose / concentration;
export const concentration = (amount: number, finalVolume: number) => amount / finalVolume;
export const diluentVolume = (finalVolume: number, medicationVolume: number) => finalVolume - medicationVolume;
export const cumulativeDose = (doses: number[]) => doses.reduce((sum, value) => sum + value, 0);
export const remainingToMaximum = (maximum: number, given: number) => Math.max(0, maximum - given);
export const volumeAtRate = (rateMlHour: number, minutes: number) => rateMlHour * minutes / 60;

export function parseGermanNumber(input: string) {
  const normalized = input.trim().replace(",", ".");
  if (!/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export function isCorrect(input: string, expected: number, decimals: number) {
  const value = parseGermanNumber(input);
  return value !== null && Math.abs(value - expected) <= Math.max(1e-9, 0.5 * 10 ** -(decimals + 2));
}
