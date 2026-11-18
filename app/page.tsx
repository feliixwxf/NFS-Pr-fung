"use client";

import { lazy, Suspense } from "react";

const MainApp = lazy(() => import("./main-app"));

function InitialAppLoadingScreen() {
  return <main className="loading-screen" role="status" aria-live="polite" aria-label="Lernbereich wird geladen">
    <div className="loading-mark" aria-hidden="true">N</div>
    <div className="loading-copy">
      <b>NotSan Prüfung wird vorbereitet</b>
      <span>Lernstand und Inhalte werden geladen …</span>
    </div>
    <div className="loading-progress" aria-hidden="true"><i /></div>
  </main>;
}

export default function Page() {
  return <Suspense fallback={<InitialAppLoadingScreen />}><MainApp /></Suspense>;
}
