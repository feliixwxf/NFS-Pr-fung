"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("NotSan-Seitenfehler", error); }, [error]);
  return <main className="app-error-screen" role="alert">
    <section>
      <span className="error-mark" aria-hidden="true">!</span>
      <small>Technischer Fehler</small>
      <h1>Diese Seite konnte gerade nicht vollständig geladen werden.</h1>
      <p>Dein gespeicherter Lernstand bleibt erhalten. Versuche zuerst, den Bereich erneut zu laden.</p>
      <div>
        <button type="button" onClick={reset}>Erneut versuchen</button>
        <button type="button" className="secondary" onClick={() => window.location.assign("/")}>Zur Startseite</button>
      </div>
      {error.digest && <code>Fehlerkennung: {error.digest}</code>}
    </section>
  </main>;
}
