/** VFA 34: calculated ceiling, never an automatic target rate. */
export function calculateBurnInfusionMaximum(weightKg: number, minutes: number) {
  if (!Number.isFinite(weightKg) || weightKg <= 0 || weightKg > 350 || !Number.isFinite(minutes) || minutes < 1 || minutes > 1440) return null;
  const mlPerHour = weightKg * 10;
  return { mlPerHour, volumeMl: mlPerHour * minutes / 60 };
}
