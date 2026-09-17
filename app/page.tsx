"use client";

import { FormEvent, useEffect, useState } from "react";

type View = "start" | "oral" | "quiz" | "progress";

const nav = [
  { id: "start" as View, label: "Start", icon: "⌂" },
  { id: "oral" as View, label: "Mündlich", icon: "◫" },
  { id: "quiz" as View, label: "MC-Training", icon: "✓" },
  { id: "progress" as View, label: "Fortschritt", icon: "↗" },
];

export default function Home() {
  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [view, setView] = useState<View>("start");

  useEffect(() => {
    setSignedIn(localStorage.getItem("notsan-access") === "granted");
    localStorage.removeItem("notsan-learned");
    localStorage.removeItem("notsan-last-score");
    setReady(true);
  }, []);

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    if (code.trim() === "Salami") {
      localStorage.setItem("notsan-access", "granted");
      setSignedIn(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!ready) return <main className="loading-screen" aria-label="Wird geladen" />;

  if (!signedIn) {
    return (
      <main className="login-page">
        <section className="login-brand">
          <div className="brand brand-light"><span className="brand-mark">N</span><span>NotSan <b>Prüfung</b></span></div>
          <div className="login-copy">
            <span className="eyebrow light">Dein digitaler Prüfungspartner</span>
            <h1>Bereit, wenn es<br />darauf ankommt.</h1>
            <p>Deine persönliche Lernplattform für das Staatsexamen – übersichtlich, verständlich und auf deine Unterlagen abgestimmt.</p>
            <div className="trust-row"><span>✓ Lesekapitel</span><span>✓ Eigene Unterlagen</span><span>✓ KI-Lernfragen</span></div>
          </div>
          <div className="ecg" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        </section>
        <section className="login-panel">
          <form className="login-card" onSubmit={handleLogin}>
            <div className="mobile-brand brand"><span className="brand-mark">N</span><span>NotSan <b>Prüfung</b></span></div>
            <div className="lock-icon">⌁</div>
            <span className="eyebrow">Willkommen zurück</span>
            <h2>Zugang zum Lernbereich</h2>
            <p>Gib deinen persönlichen Einladungscode ein, um mit deiner Vorbereitung zu starten.</p>
            <label htmlFor="invite">Einladungscode</label>
            <div className={`input-wrap ${error ? "has-error" : ""}`}>
              <span>◇</span>
              <input id="invite" type="password" value={code} onChange={(event) => { setCode(event.target.value); setError(false); }} placeholder="Code eingeben" autoComplete="current-password" aria-describedby={error ? "code-error" : undefined} />
            </div>
            {error && <p className="error-message" id="code-error">Der Einladungscode ist nicht korrekt.</p>}
            <button className="primary-button" type="submit">Lernbereich öffnen <span>→</span></button>
            <small>Mit dem Zugang bestätigst du, dass du die Inhalte nur zur persönlichen Prüfungsvorbereitung nutzt.</small>
          </form>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">N</span><span>NotSan <b>Prüfung</b></span></div>
        <nav aria-label="Hauptnavigation">
          {nav.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => setView(item.id)}><span>{item.icon}</span>{item.label}</button>)}
        </nav>
        <div className="sidebar-tip"><span>☼</span><b>In Vorbereitung</b><p>Die Inhalte werden anhand deiner Dateien und der Vorgaben für Thüringen 2026/2027 aufgebaut.</p></div>
        <button className="logout" onClick={() => { localStorage.removeItem("notsan-access"); setSignedIn(false); }}>↪ Abmelden</button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand brand"><span className="brand-mark">N</span><span>NotSan <b>Prüfung</b></span></div>
          <div className="status-pill preparing"><span /> Inhalte werden vorbereitet</div>
          <div className="avatar">FS</div>
        </header>

        {view === "start" && <Dashboard setView={setView} />}
        {view === "oral" && <OralPlaceholder />}
        {view === "quiz" && <QuizPlaceholder />}
        {view === "progress" && <ProgressPlaceholder />}

        <footer><span>NotSan Prüfung · Dein Lernbegleiter</span><span>Spätere Lerninhalte werden an den Prüfungsrahmen Thüringen 2026/2027 angepasst.</span></footer>
      </main>

      <nav className="mobile-nav" aria-label="Mobile Navigation">
        {nav.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => setView(item.id)}><span>{item.icon}</span>{item.label}</button>)}
      </nav>
    </div>
  );
}

function Dashboard({ setView }: { setView: (view: View) => void }) {
  return (
    <section className="dashboard">
      <div className="welcome">
        <div>
          <span className="eyebrow light">Deine persönliche Lernplattform</span>
          <h1>Die Grundlage steht.</h1>
          <p>Als Nächstes füllen wir deine Lernbereiche mit den Unterlagen, die du bereitstellst – fachlich abgestimmt auf Thüringen 2026/2027.</p>
          <div className="hero-actions"><button className="light-button" onClick={() => setView("oral")}>Aufbau ansehen <span>→</span></button></div>
        </div>
        <div className="hero-stat"><div><b>0%</b><span>Inhalte</span></div></div>
      </div>

      <div className="stats-grid">
        <article><span className="stat-icon orange">◫</span><div><small>Lesekapitel</small><b>0 <em>eingepflegt</em></b></div></article>
        <article><span className="stat-icon blue">✓</span><div><small>MC-Fragen</small><b>0 <em>eingepflegt</em></b></div></article>
        <article><span className="stat-icon green">↗</span><div><small>Lernfortschritt</small><b>0<em>%</em></b></div></article>
      </div>

      <div className="dashboard-grid">
        <section>
          <div className="block-title"><div><span className="eyebrow">Geplanter Aufbau</span><h2>Deine Prüfungsvorbereitung</h2></div></div>
          <div className="action-cards">
            <button onClick={() => setView("oral")}><span className="action-icon">◫</span><div><small>Lesen & verstehen</small><h3>Mündliche Themen</h3><p>Übersichtliche Lernabschnitte mit passenden kleinen Bildern und Merkhilfen.</p><b>Aufbau ansehen →</b></div></button>
            <button onClick={() => setView("quiz")}><span className="action-icon dark">✓</span><div><small>Wissen prüfen</small><h3>Multiple Choice</h3><p>Das Training wird aus deinen später bereitgestellten Inhalten aufgebaut.</p><b>Status ansehen →</b></div></button>
          </div>
        </section>
        <aside className="daily-card empty-daily"><span className="eyebrow">Nächster Schritt</span><div className="daily-number">01</div><span className="topic-area">Unterlagen</span><h3>Dateien bereitstellen</h3><p>Sobald du deine Dateien schickst, werden daraus strukturierte Lernkapitel und passende Fragen.</p><button className="text-button" onClick={() => setView("oral")}>Geplanten Ablauf ansehen <span>→</span></button></aside>
      </div>
    </section>
  );
}

function OralPlaceholder() {
  return (
    <section className="page-section content-prep-page">
      <div className="section-heading"><div><span className="eyebrow">Mündliche Prüfung</span><h1>Hier entstehen deine Lesekapitel.</h1><p>Alle bisherigen Beispielthemen wurden entfernt. Neue Inhalte werden ausschließlich aus deinen Unterlagen und den maßgeblichen Vorgaben aufgebaut.</p></div></div>

      <div className="reading-blueprint">
        <div className="blueprint-visual" aria-hidden="true"><span>◫</span><i /><i /><i /><div>Bild</div><i /><i /></div>
        <div className="blueprint-copy"><span className="eyebrow">So wird ein Kapitel aufgebaut</span><h2>Lesen, verstehen, abfragen</h2><p>Jeder mündliche Abschnitt wird wie ein kompaktes digitales Lernkapitel gestaltet – mit gut lesbaren Textblöcken, hervorgehobenen Merksätzen und kleinen unterstützenden Bildern.</p><ol><li><b>01</b><span><strong>Übersichtlicher Lerntext</strong>Aus deinen bereitgestellten Dateien, nach einer festen Prüfungsstruktur gegliedert.</span></li><li><b>02</b><span><strong>Kleine Bilder & Merkhilfen</strong>Nur dort, wo sie das Verständnis wirklich verbessern.</span></li><li><b>03</b><span><strong>Passende VFA-Seite</strong>Das von dir benannte Bild aus der Thüringer VFA steht am Kapitelende.</span></li><li><b>04</b><span><strong>Fragen aus dem Abschnitt</strong>Danach kann die KI passende mündliche Fragen direkt aus dem gelesenen Kapitel erstellen.</span></li></ol></div>
      </div>

      <div className="chapter-structure">
        <div className="chapter-structure-head"><div><span className="eyebrow">Verbindliche Vorlage</span><h2>Aufbau jedes mündlichen Themas</h2></div><span className="vfa-badge">VFA Thüringen · 2026/2027</span></div>
        <div className="chapter-steps">
          {["Definition", "Anatomie & Physiologie", "Pathophysiologie / Ursachen", "Symptome, die die Arbeitsdiagnose stützen", "Komplikationen & Gefahren des Notfallbildes", "Benötigte Einsatzmaterialien", "Erstmaßnahmen", "Differenzialdiagnosen & Entscheidungsfindung", "Weitere Maßnahmen", "Passendes VFA-Bild am Kapitelende"].map((step, index) => <div key={step}><b>{String(index + 1).padStart(2, "0")}</b><span>{step}</span>{index === 9 && <i>PDF</i>}</div>)}
        </div>
      </div>

      <div className="empty-library"><span className="empty-icon">＋</span><div><span className="eyebrow">Noch keine Themen</span><h2>Die VFA-Grundlage ist hinterlegt</h2><p>Nenne beim jeweiligen Thema einfach die zugehörige VFA-Nummer. Die passende Seite wird dann als Bild am Kapitelende eingebunden.</p></div><button className="primary-button" disabled>KI-Fragen nach dem Lesen erstellen</button></div>
    </section>
  );
}

function QuizPlaceholder() {
  return (
    <section className="quiz-page placeholder-page">
      <div className="empty-state-card"><span className="empty-icon">✓</span><span className="eyebrow">MC-Training</span><h1>Noch keine Fragen hinterlegt.</h1><p>Alle bisherigen Beispielfragen wurden entfernt. Das neue Multiple-Choice-Training wird später ausschließlich anhand deiner Dateien erstellt.</p><div className="source-note"><span>i</span><p><b>Geplante Grundlage</b>Deine Unterlagen und die relevanten Prüfungsvorgaben der VFA Thüringen 2026/2027.</p></div><button className="primary-button" disabled>Training noch nicht verfügbar</button></div>
    </section>
  );
}

function ProgressPlaceholder() {
  return (
    <section className="page-section progress-page">
      <div className="section-heading"><div><span className="eyebrow">Dein Lernstand</span><h1>Fortschritt startet mit deinen Inhalten.</h1><p>Sobald die ersten Kapitel und Trainingsfragen vorhanden sind, wird dein Lernstand hier automatisch sichtbar.</p></div></div>
      <div className="progress-overview empty-progress"><div className="progress-ring" style={{ "--progress": "0deg" } as React.CSSProperties}><div><b>0%</b><span>Gesamt</span></div></div><div><span className="eyebrow">Noch leer</span><h2>Bereit für den nächsten Schritt.</h2><p>Aktuell sind keine Themen oder Prüfungsfragen hinterlegt.</p><div className="progress-track large"><span style={{ width: "0%" }} /></div></div></div>
    </section>
  );
}
