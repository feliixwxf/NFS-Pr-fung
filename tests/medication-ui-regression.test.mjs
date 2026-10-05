import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { filterAndSortMedications } from "../app/lib/medicationFilters.ts";
import { toggleSelectedIndex } from "../app/lib/selectionState.ts";

const source = await readFile(new URL("../app/medication-effects-library.tsx", import.meta.url), "utf8");

test("medication filtering combines full-text search and therapeutic area", () => {
  const rows = [
    { id: "z", name: "Zeta", aliases: ["Helfer"], group: "Gruppe", effect: "Effekt", areas: ["heart"] },
    { id: "a", name: "Äther", group: "Bronchien", effect: "Weit", areas: ["airways"] },
    { id: "b", name: "Alpha", group: "Gruppe", effect: "Effekt", areas: ["heart", "airways"] },
  ];

  assert.deepEqual(filterAndSortMedications(rows, "", "all").map(item => item.id), ["b", "a", "z"]);
  assert.deepEqual(filterAndSortMedications(rows, "helfer", "heart").map(item => item.id), ["z"]);
  assert.deepEqual(filterAndSortMedications(rows, "bronchien", "heart"), []);
  assert.equal(new Set(filterAndSortMedications(rows, "", "airways").map(item => item.id)).size, 2);
});

test("every medication record has a stable id and explicit area assignment", () => {
  const ids = [...source.matchAll(/\{ id: "([^"]+)", name:/g)].map(match => match[1]);
  const assignmentBlock = source.match(/const medicationAreaAssignments:[\s\S]+?= \{([\s\S]+?)\n\};/)?.[1] ?? "";
  const assignmentIds = [...assignmentBlock.matchAll(/^\s*(?:"([^"]+)"|([a-z][\w-]*)):\s*\[[^\]]+\]/gm)].map(match => match[1] || match[2]);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(new Set(assignmentIds), new Set(ids));
});

test("MC toggling adds and fully removes an option without mutating prior state", () => {
  const initial = [1, 3];
  const selected = toggleSelectedIndex(initial, 2);
  const deselected = toggleSelectedIndex(selected, 2);
  assert.deepEqual(initial, [1, 3]);
  assert.deepEqual(selected, [1, 3, 2]);
  assert.deepEqual(deselected, [1, 3]);
  assert.notEqual(deselected, selected);
});
