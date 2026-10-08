import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const accountAccess = readFileSync(new URL("../app/account-access.tsx", import.meta.url), "utf8");
const supabaseClient = readFileSync(new URL("../app/lib/supabaseClient.ts", import.meta.url), "utf8");

test("login offers a persistent-session checkbox", () => {
  assert.match(accountAccess, /Eingeloggt bleiben/);
  assert.match(accountAccess, /setRememberSession\(rememberSession\)/);
  assert.match(supabaseClient, /window\.localStorage\.setItem\(key, value\)/);
  assert.match(supabaseClient, /window\.sessionStorage\.setItem\(key, value\)/);
});

test("a successful login revokes other device sessions", () => {
  assert.match(accountAccess, /signOut\(\{ scope: "others" \}\)/);
});
