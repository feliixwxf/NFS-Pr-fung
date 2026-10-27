const CACHE_NAME = "notsan-offline-v1";
const APP_SHELL = ["/manifest.webmanifest", "/favicon.svg", "/app-icon-192.png", "/app-icon-512.png", "/fonts/atkinson-hyperlegible/atkinson-hyperlegible-400.woff2", "/fonts/atkinson-hyperlegible/atkinson-hyperlegible-700.woff2"];

async function cacheShell() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.allSettled(APP_SHELL.map((url) => cache.add(new Request(url, { cache: "reload" }))));
  const page = await fetch(new Request("/", { cache: "reload" }));
  if (!page.ok) return;
  await cache.put("/", page.clone());
  const html = await page.text();
  const assets = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
    .map((match) => match[1])
    .filter((url) => url.startsWith("/") && !url.startsWith("/api/"));
  await Promise.allSettled([...new Set(assets)].map((url) => cache.add(new Request(url, { cache: "reload" }))));
}

self.addEventListener("install", (event) => { event.waitUntil(cacheShell().then(() => self.skipWaiting())); });
self.addEventListener("activate", (event) => { event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener("message", (event) => { if (event.data?.type === "CACHE_APP_SHELL") event.waitUntil(cacheShell()); });
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/") || url.pathname.includes("supabase")) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)); return response; }).catch(async () => (await caches.match(request)) || (await caches.match("/"))));
    return;
  }
  if (["script", "style", "font", "image"].includes(request.destination)) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => { if (response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)); } return response; })));
  }
});
