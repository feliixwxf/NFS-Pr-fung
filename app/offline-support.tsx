"use client";

import { useEffect, useState } from "react";

const APP_VERSION_KEY = "notsan-app-version-v1";

export function OfflineBootstrap() {
  const [updateReady, setUpdateReady] = useState(false);
  const [latestVersion, setLatestVersion] = useState("");
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const isLocalhost = ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
    if (isLocalhost) {
      // Dev bundles change frequently. A cached bundle can leave localhost on the loading screen.
      void navigator.serviceWorker.getRegistrations().then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())));
      if ("caches" in window) void caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("notsan-offline-")).map((key) => caches.delete(key))));
      return;
    }
    const hadController = Boolean(navigator.serviceWorker.controller);
    const showUpdate = () => { if (hadController) setUpdateReady(true); };
    const checkForUpdate = async () => {
      if (document.visibilityState !== "visible" || !navigator.onLine) return;
      try {
        const [registration, response] = await Promise.all([
          navigator.serviceWorker.getRegistration(),
          fetch(`/api/app-version?t=${Date.now()}`, { cache: "no-store" }),
        ]);
        await registration?.update();
        if (!response.ok) return;
        const payload = await response.json() as { version?: unknown };
        const remoteVersion = typeof payload.version === "string" ? payload.version : "";
        if (!remoteVersion || remoteVersion === "local") return;
        setLatestVersion(remoteVersion);
        const installedVersion = localStorage.getItem(APP_VERSION_KEY);
        if (hadController && installedVersion !== remoteVersion) setUpdateReady(true);
        else if (!hadController && !installedVersion) localStorage.setItem(APP_VERSION_KEY, remoteVersion);
      } catch {
        // A transient network error must never block the learning app.
      }
    };
    navigator.serviceWorker.addEventListener("controllerchange", showUpdate);
    document.addEventListener("visibilitychange", checkForUpdate);
    window.addEventListener("online", checkForUpdate);
    const interval = window.setInterval(() => { void checkForUpdate(); }, 5 * 60 * 1000);
    void navigator.serviceWorker.register("/sw.js").then(() => checkForUpdate()).catch(() => undefined);
    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", showUpdate);
      document.removeEventListener("visibilitychange", checkForUpdate);
      window.removeEventListener("online", checkForUpdate);
      window.clearInterval(interval);
    };
  }, []);
  const installUpdate = async () => {
    if (latestVersion) localStorage.setItem(APP_VERSION_KEY, latestVersion);
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      await registration?.update();
    } finally {
      const url = new URL(window.location.href);
      url.searchParams.set("app-version", latestVersion.slice(0, 8) || Date.now().toString());
      window.location.replace(url.toString());
    }
  };
  if (!updateReady) return null;
  return <aside className="app-update-notice" role="status" aria-live="polite">
    <div><strong>Neue Version verfügbar</strong><span>Aktualisiere die App, damit du alle neuen Inhalte und Korrekturen siehst.</span></div>
    <div className="app-update-actions">
      <button type="button" onClick={() => void installUpdate()}>Jetzt aktualisieren</button>
      <button type="button" className="secondary" onClick={() => setUpdateReady(false)}>Später</button>
    </div>
  </aside>;
}

export default function OfflineStatusCard() {
  const [online, setOnline] = useState(() => typeof navigator === "undefined" || navigator.onLine);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    if ("serviceWorker" in navigator) navigator.serviceWorker.ready.then(() => setReady(true)).catch(() => setReady(false));
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);
  const refresh = async () => {
    setMessage("Offline-Paket wird aktualisiert …");
    try {
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({ type: "CACHE_APP_SHELL" });
      await registration.update();
      setMessage("Offline-Paket ist aktuell.");
    } catch { setMessage("Aktualisierung war gerade nicht möglich."); }
  };
  return <section className="offline-status-card"><span className={online ? "online" : "offline"} aria-hidden="true">{online ? "✓" : "⌁"}</span><div><small>Offline lernen</small><h2>{online ? ready ? "Offline-Start ist vorbereitet" : "Offline-Paket wird vorbereitet" : "Du bist gerade offline"}</h2><p>Die App-Oberfläche und bereits geladene Inhalte bleiben ohne Verbindung erreichbar. Lernstand und Antworten werden weiterhin lokal auf diesem Gerät gespeichert und beim nächsten Online-Start wieder synchronisiert.</p>{message && <b role="status">{message}</b>}</div><button type="button" onClick={() => void refresh()} disabled={!online || !("serviceWorker" in navigator)}>Offline-Paket aktualisieren</button></section>;
}
