import assert from "node:assert/strict";
import test from "node:test";
import { auditContent } from "../scripts/audit-content.mjs";

test("content audit finds no missing assets, stale VFA years or contradictory preparation volumes", async () => {
  const result = await auditContent();
  assert.ok(result.files > 100, "the complete app source should be audited");
  assert.ok(result.assets > 100, "lesson assets should be checked on disk");
  assert.equal(result.errors.length, 0, result.errors.join("\n"));
});
