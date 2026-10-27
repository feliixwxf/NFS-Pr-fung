export default function Loading() {
  return <main className="loading-screen" role="status" aria-live="polite" aria-label="Lernbereich wird geladen">
    <div className="loading-mark" aria-hidden="true">N</div>
    <div className="loading-copy">
      <b>NotSan Prüfung wird vorbereitet</b>
      <span>Lernstand und Inhalte werden geladen …</span>
    </div>
    <div className="loading-progress" aria-hidden="true"><i /></div>
  </main>;
}
