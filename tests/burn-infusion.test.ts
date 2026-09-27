import assert from "node:assert/strict";
import test from "node:test";
import { calculateBurnInfusionMaximum } from "../app/lib/burnInfusion.ts";

test("VFA 34 ceiling: 60 kg for 30 minutes", () => {
  assert.deepEqual(calculateBurnInfusionMaximum(60, 30), { mlPerHour: 600, volumeMl: 300 });
});

test("VFA 34 ceiling: 80 kg for 45 minutes", () => {
  assert.deepEqual(calculateBurnInfusionMaximum(80, 45), { mlPerHour: 800, volumeMl: 600 });
});

test("invalid weight and duration never produce a rate", () => {
  for (const weight of [0, -2, 351, Number.NaN, Number.POSITIVE_INFINITY]) assert.equal(calculateBurnInfusionMaximum(weight, 60), null);
  for (const minutes of [0, .5, 1441, Number.NaN]) assert.equal(calculateBurnInfusionMaximum(60, minutes), null);
});
