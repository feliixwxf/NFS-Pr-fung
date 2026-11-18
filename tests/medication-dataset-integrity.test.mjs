import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const dataUrl = new URL("../app/lib/medicationData.ts", import.meta.url);

test("medication trainer contains 80 sequential cases with round learning weights", async () => {
  const source = await readFile(dataUrl, "utf8");
  const ids = [...source.matchAll(/\["(?:esk|morph|hep|mid|glu|ana|adr|cpr|fluid)-(\d{2})"/g)];
  const rows = [...source.matchAll(/^\["[^"]+","[^"]+",\d+,(\d+),/gm)];

  assert.deepEqual(ids.map((match) => Number(match[1])), Array.from({ length: 80 }, (_, index) => index + 1));
  assert.equal(new Set(ids.map((match) => match[0])).size, 80);
  assert.equal(rows.length, 80);
  for (const row of rows) assert.match(row[1], /[05]$/);
});

