"use client";

import { useEffect, useState } from "react";

export function OfflineBootstrap() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const isLocalhost = ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
    if (isLocalhost) {
      // Dev bundles change frequently. A cached bundle can leave localhost on the loading screen.
      void navigator.serviceWorker.getRegistrations().then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())));
      if ("caches" in window) void caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("notsan-offline-")).map((key) => caches.delete(key))));
      return;
    }
    void navigator.serviceWorker.register("/sw.js").then((registration) => registration.update()).catch(() => undefined);
  }, []);
  return null;
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
