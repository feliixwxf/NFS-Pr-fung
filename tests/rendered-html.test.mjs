import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the NotSan application shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="de"/i);
  assert.match(html, /<title>NotSan Prüfung – Sicher ins Staatsexamen<\/title>/i);
  assert.match(html, /class="loading-screen"/i);
  assert.match(html, /aria-label="Lernbereich wird geladen"/i);
  assert.match(html, /NotSan Prüfung wird vorbereitet/i);
  assert.match(html, /rel="manifest"[^>]*href="\/manifest\.webmanifest"/i);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/i);
});

test("keeps PWA metadata and the current loading state wired", async () => {
  const [page, layout, manifest] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/manifest.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /"content-loading-screen"\s*:\s*"loading-screen"/);
  assert.match(page, /aria-label="Lernbereich wird geladen"/);
  assert.match(layout, /title:\s*"NotSan Prüfung – Sicher ins Staatsexamen"/);
  assert.match(layout, /manifest:\s*"\/manifest\.webmanifest"/);
  assert.match(layout, /appleWebApp:\s*\{/);
  assert.match(manifest, /display:\s*"standalone"/);
  assert.match(manifest, /start_url:\s*"\/"/);
  assert.match(manifest, /app-icon-maskable-512\.png/);
  assert.doesNotMatch(page + layout, /SkeletonPreview|codex-preview|Starter Project/);
});
