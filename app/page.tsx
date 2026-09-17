"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type View = "start" | "oral" | "quiz" | "progress";
type Topic = {
  id: number;
  title: string;
  area: string;
  icon: string;
  duration: string;
  level: "Basis" | "Fortgeschritten";
  description: string;
  questions: string[];
};

const topics: Topic[] = [
  { id: 1, title: "Akutes Koronarsyndrom", area: "Herz & Kreislauf", icon: "♥", duration: "12 Min.", level: "Basis", description: "Strukturierte Versorgung bei Thoraxschmerz – von der Ersteinschätzung bis zur Übergabe.", questions: ["Welche Differenzialdiagnosen sind bei akutem Thoraxschmerz zeitkritisch?", "Beschreibe dein Vorgehen nach dem ABCDE-Schema.", "Welche Informationen gehören in eine strukturierte Klinikvoranmeldung?"] },
  { id: 2, title: "Atemwegsmanagement", area: "Atmung", icon: "◎", duration: "15 Min.", level: "Fortgeschritten", description: "Atemweg beurteilen, Eskalationsstufen erklären und Komplikationen sicher erkennen.", questions: ["Woran erkennst du eine akute Atemwegsgefährdung?", "Welche Eskalationsstufen des Atemwegsmanagements kennst du?", "Wie kontrollierst du die Wirksamkeit einer Beatmung?"] },
  { id: 3, title: "Reanimation Erwachsene", area: "Reanimation", icon: "↯", duration: "18 Min.", level: "Basis", description: "Algorithmen, reversible Ursachen und Teamkommunikation in der Reanimation.", questions: ["Erläutere den initialen Ablauf einer Reanimation.", "Welche reversiblen Ursachen müssen bedacht werden?", "Wie organisierst du Rollen und Closed-Loop-Kommunikation?"] },
  { id: 4, title: "Pädiatrischer Notfall", area: "Pädiatrie", icon: "✦", duration: "14 Min.", level: "Fortgeschritten", description: "Altersgerechte Beurteilung, kritische Befunde und Kommunikation mit Bezugspersonen.", questions: ["Wie unterscheidet sich die Ersteinschätzung bei Kindern?", "Welche Zeichen sprechen für eine drohende Dekompensation?", "Wie bindest du Bezugspersonen sinnvoll ein?"] },
  { id: 5, title: "Polytrauma", area: "Trauma", icon: "+", duration: "16 Min.", level: "Fortgeschritten", description: "Prioritäten am Einsatzort, Blutungskontrolle und zielgerichtete Transportentscheidung.", questions: ["Welche lebensbedrohlichen Probleme behandelst du sofort?", "Wann ist ein schneller Transport besonders wichtig?", "Welche Maßnahmen dienen dem Wärmeerhalt?"] },
  { id: 6, title: "Schlaganfall", area: "Neurologie", icon: "⌁", duration: "10 Min.", level: "Basis", description: "Neurologisches Defizit erkennen, Zeitfenster erheben und Versorgungskette aktivieren.", questions: ["Welche Schlaganfallzeichen prüfst du präklinisch?", "Welche Zeitangaben sind für die Klinik entscheidend?", "Welche Differenzialdiagnosen musst du erwägen?"] },
  { id: 7, title: "Anaphylaxie", area: "Allergologie", icon: "!", duration: "11 Min.", level: "Basis", description: "Schweregrad erkennen, Prioritäten setzen und Verlauf engmaschig beurteilen.", questions: ["Welche Organsysteme können betroffen sein?", "Woran erkennst du einen schweren Verlauf?", "Welche Informationen sind für Anamnese und Übergabe wichtig?"] },
  { id: 8, title: "Einsatzrecht & Aufklärung", area: "Recht", icon: "§", duration: "13 Min.", level: "Fortgeschritten", description: "Einwilligung, Dokumentation, Schweigepflicht und rechtssicheres Handeln im Einsatz.", questions: ["Welche Voraussetzungen hat eine wirksame Einwilligung?", "Wie gehst du mit einer Behandlungsverweigerung um?", "Was muss nachvollziehbar dokumentiert werden?"] },
];

const quizQuestions = [
  { q: "Welcher Schritt steht bei der strukturierten Ersteinschätzung eines kritisch erkrankten Patienten am Anfang?", options: ["Vollständige Anamnese", "Beurteilung der Einsatzstelle und des Gesamteindrucks", "Transportziel festlegen", "Medikamentenplan erfassen"], answer: 1, explanation: "Eigenschutz, Einsatzstellenbeurteilung und ein erster Gesamteindruck gehen der systematischen Patientenuntersuchung voraus." },
  { q: "Wofür steht das D im ABCDE-Schema?", options: ["Defibrillation", "Disability – neurologischer Status", "Dokumentation", "Diagnose"], answer: 1, explanation: "D steht für Disability und umfasst die orientierende neurologische Beurteilung, etwa Bewusstsein, Pupillen und Glukose." },
  { q: "Welche Kommunikationsform reduziert Missverständnisse im Team besonders wirksam?", options: ["Stille Aufgabenverteilung", "Closed-Loop-Kommunikation", "Nur schriftliche Anweisungen", "Parallele Einzelgespräche"], answer: 1, explanation: "Bei Closed-Loop-Kommunikation wird ein Auftrag adressiert, bestätigt und die Durchführung rückgemeldet." },
  { q: "Was gehört zwingend zu einer strukturierten Übergabe?", options: ["Nur die Verdachtsdiagnose", "Nur Vitalwerte", "Situation, relevante Befunde, Maßnahmen und Verlauf", "Ausschließlich Patientendaten"], answer: 2, explanation: "Eine gute Übergabe stellt die Situation knapp dar und verbindet Befunde, Maßnahmen, Wirkung und relevante Risiken." },
  { q: "Welche Maßnahme hilft bei Traumapatienten, eine Hypothermie zu vermeiden?", options: ["Unnötiges Entkleiden", "Aktiver Wärmeerhalt und kurze Expositionszeit", "Kalte Infusionen", "Lange Untersuchung im Freien"], answer: 1, explanation: "Konsequenter Wärmeerhalt und eine auf das Nötige begrenzte Exposition reduzieren Wärmeverlust." },
  { q: "Welche Angabe ist bei einem möglichen Schlaganfall besonders zeitkritisch?", options: ["Letzte Mahlzeit", "Zeitpunkt zuletzt sicher symptomfrei", "Körpergröße", "Hausarztpraxis"], answer: 1, explanation: "Der Zeitpunkt, zu dem die Person zuletzt sicher symptomfrei war, ist für die weitere Therapieentscheidung zentral." },
  { q: "Was beschreibt eine Verlaufsbeurteilung am besten?", options: ["Einmalige Messung", "Wiederholte Befunde und Reaktion auf Maßnahmen", "Nur das Abschlussgespräch", "Die Einsatzdauer"], answer: 1, explanation: "Verlauf bedeutet, Befunde wiederholt zu erheben und Veränderungen nach Maßnahmen zu bewerten." },
  { q: "Was ist bei einer Behandlungsverweigerung besonders wichtig?", options: ["Sofortiger Einsatzabbruch", "Einwilligungsfähigkeit prüfen, aufklären und dokumentieren", "Nur eine Unterschrift", "Keine Rückfragen stellen"], answer: 1, explanation: "Entscheidend sind die Beurteilung der Einwilligungsfähigkeit, verständliche Risikoaufklärung und lückenlose Dokumentation." },
];

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
  const [filter, setFilter] = useState("Alle");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [learned, setLearned] = useState<number[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    setSignedIn(localStorage.getItem("notsan-access") === "granted");
    const saved = localStorage.getItem("notsan-learned");
    if (saved) setLearned(JSON.parse(saved));
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

  const toggleLearned = (id: number) => {
    const next = learned.includes(id) ? learned.filter((item) => item !== id) : [...learned, id];
    setLearned(next);
    localStorage.setItem("notsan-learned", JSON.stringify(next));
  };

  const filteredTopics = useMemo(() => filter === "Alle" ? topics : topics.filter((topic) => topic.level === filter), [filter]);
  const progress = Math.round((learned.length / topics.length) * 100);
  const currentQuestion = quizQuestions[questionIndex];

  const submitAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    if (answer === currentQuestion.answer) setScore((value) => value + 1);
  };

  const nextQuestion = () => {
    if (questionIndex === quizQuestions.length - 1) {
      setQuizDone(true);
      localStorage.setItem("notsan-last-score", String(score));
    } else {
      setQuestionIndex((value) => value + 1);
      setSelectedAnswer(null);
    }
  };

  const restartQuiz = () => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizDone(false);
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
            <p>Trainiere strukturiert für dein Staatsexamen – fokussiert, verständlich und nah an der Praxis.</p>
            <div className="trust-row"><span>✓ Mündliche Themen</span><span>✓ MC-Training</span><span>✓ Lernfortschritt</span></div>
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
          {nav.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => { setView(item.id); setSelectedTopic(null); }}><span>{item.icon}</span>{item.label}</button>)}
        </nav>
        <div className="sidebar-tip"><span>☼</span><b>Tipp des Tages</b><p>Lautes Erklären festigt Wissen und bereitet dich auf die mündliche Prüfung vor.</p></div>
        <button className="logout" onClick={() => { localStorage.removeItem("notsan-access"); setSignedIn(false); }}>↪ Abmelden</button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand brand"><span className="brand-mark">N</span><span>NotSan <b>Prüfung</b></span></div>
          <div className="status-pill"><span /> Lernmodus</div>
          <div className="avatar">FS</div>
        </header>

        {view === "start" && <Dashboard setView={setView} progress={progress} learned={learned.length} />}
        {view === "oral" && (
          <section className="page-section">
            <div className="section-heading"><div><span className="eyebrow">Mündliche Prüfung</span><h1>Thema wählen & frei sprechen</h1><p>Strukturiere deine Antwort, begründe dein Vorgehen und prüfe dich mit Leitfragen.</p></div><div className="filter-group" aria-label="Themen filtern">{["Alle", "Basis", "Fortgeschritten"].map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? "active" : ""}>{item}</button>)}</div></div>
            <div className="topic-grid">
              {filteredTopics.map((topic) => <article className="topic-card" key={topic.id}>
                <div className="topic-top"><span className="topic-icon">{topic.icon}</span><button className={`check-button ${learned.includes(topic.id) ? "done" : ""}`} onClick={() => toggleLearned(topic.id)} aria-label={learned.includes(topic.id) ? "Als ungelernt markieren" : "Als gelernt markieren"}>{learned.includes(topic.id) ? "✓" : "○"}</button></div>
                <span className="topic-area">{topic.area}</span><h3>{topic.title}</h3><p>{topic.description}</p>
                <div className="topic-meta"><span>◷ {topic.duration}</span><span>{topic.level}</span></div>
                <button className="text-button" onClick={() => setSelectedTopic(topic)}>Thema öffnen <span>→</span></button>
              </article>)}
            </div>
          </section>
        )}
        {view === "quiz" && (
          <section className="quiz-page">
            {!quizDone ? <div className="quiz-card">
              <div className="quiz-header"><div><span className="eyebrow">MC-Training</span><h1>Prüfungsmodus</h1></div><div className="quiz-count">{questionIndex + 1} <small>/ {quizQuestions.length}</small></div></div>
              <div className="progress-track"><span style={{ width: `${((questionIndex + 1) / quizQuestions.length) * 100}%` }} /></div>
              <h2>{currentQuestion.q}</h2>
              <div className="answer-list">
                {currentQuestion.options.map((option, index) => {
                  const revealed = selectedAnswer !== null;
                  const state = revealed && index === currentQuestion.answer ? "correct" : revealed && index === selectedAnswer ? "wrong" : "";
                  return <button key={option} className={state} onClick={() => submitAnswer(index)} disabled={revealed}><span>{String.fromCharCode(65 + index)}</span>{option}<i>{state === "correct" ? "✓" : state === "wrong" ? "×" : ""}</i></button>;
                })}
              </div>
              {selectedAnswer !== null && <div className={`explanation ${selectedAnswer === currentQuestion.answer ? "correct" : "wrong"}`}><b>{selectedAnswer === currentQuestion.answer ? "Richtig beantwortet" : "Noch nicht ganz"}</b><p>{currentQuestion.explanation}</p></div>}
              <div className="quiz-footer"><span>Aktueller Stand: <b>{score} richtig</b></span><button className="primary-button" disabled={selectedAnswer === null} onClick={nextQuestion}>{questionIndex === quizQuestions.length - 1 ? "Auswertung" : "Nächste Frage"} →</button></div>
            </div> : <div className="result-card"><span className="result-icon">✓</span><span className="eyebrow">Training abgeschlossen</span><h1>{score} von {quizQuestions.length} richtig</h1><p>{score >= 6 ? "Starke Runde! Festige jetzt noch die unsicheren Themen." : "Guter Anfang. Wiederhole die Erklärungen und starte eine neue Runde."}</p><div className="result-score"><b>{Math.round((score / quizQuestions.length) * 100)}%</b><span>Trefferquote</span></div><button className="primary-button" onClick={restartQuiz}>Neue Runde starten ↻</button></div>}
          </section>
        )}
        {view === "progress" && <ProgressView progress={progress} learned={learned} />}

        <footer><span>NotSan Prüfung · Dein Lernbegleiter</span><span>Lerninhalte ersetzen keine aktuellen Leitlinien, lokalen SOPs oder ärztliche Rücksprache.</span></footer>
      </main>

      <nav className="mobile-nav" aria-label="Mobile Navigation">{nav.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => { setView(item.id); setSelectedTopic(null); }}><span>{item.icon}</span>{item.label}</button>)}</nav>

      {selectedTopic && <div className="modal-backdrop" onMouseDown={() => setSelectedTopic(null)}><section className="topic-modal" role="dialog" aria-modal="true" aria-labelledby="topic-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedTopic(null)} aria-label="Schließen">×</button><span className="topic-icon large">{selectedTopic.icon}</span><span className="eyebrow">{selectedTopic.area}</span><h2 id="topic-title">{selectedTopic.title}</h2><p>{selectedTopic.description}</p><div className="oral-prompt"><span>Deine Prüfungsfragen</span>{selectedTopic.questions.map((question, index) => <div key={question}><b>0{index + 1}</b><p>{question}</p></div>)}</div><button className={`primary-button ${learned.includes(selectedTopic.id) ? "completed" : ""}`} onClick={() => toggleLearned(selectedTopic.id)}>{learned.includes(selectedTopic.id) ? "✓ Als gelernt markiert" : "Thema als gelernt markieren"}</button></section></div>}
    </div>
  );
}

function Dashboard({ setView, progress, learned }: { setView: (view: View) => void; progress: number; learned: number }) {
  return <section className="dashboard">
    <div className="welcome"><div><span className="eyebrow light">Donnerstag · Lernsession</span><h1>Guten Morgen, Felix.</h1><p>Heute ist ein guter Tag, um Sicherheit zu gewinnen. Womit möchtest du starten?</p><div className="hero-actions"><button className="light-button" onClick={() => setView("quiz")}>MC-Training starten <span>→</span></button><button className="ghost-button" onClick={() => setView("oral")}>Thema auswählen</button></div></div><div className="hero-stat"><div><b>{progress}%</b><span>Wochenziel</span></div></div></div>
    <div className="stats-grid"><article><span className="stat-icon orange">◫</span><div><small>Themen bearbeitet</small><b>{learned} <em>/ {topics.length}</em></b></div></article><article><span className="stat-icon blue">✓</span><div><small>Letzte MC-Runde</small><b>{typeof window !== "undefined" ? localStorage.getItem("notsan-last-score") || "–" : "–"} <em>/ {quizQuestions.length}</em></b></div></article><article><span className="stat-icon green">↗</span><div><small>Lernfortschritt</small><b>{progress}<em>%</em></b></div></article></div>
    <div className="dashboard-grid"><section><div className="block-title"><div><span className="eyebrow">Direkt loslegen</span><h2>Deine Prüfungsvorbereitung</h2></div></div><div className="action-cards"><button onClick={() => setView("oral")}><span className="action-icon">◫</span><div><small>Freies Sprechen</small><h3>Mündliche Themen</h3><p>8 prüfungsnahe Themen mit strukturierten Leitfragen.</p><b>Themen ansehen →</b></div></button><button onClick={() => setView("quiz")}><span className="action-icon dark">✓</span><div><small>Wissen testen</small><h3>Multiple Choice</h3><p>Direktes Feedback und verständliche Erklärungen.</p><b>Training starten →</b></div></button></div></section>
    <aside className="daily-card"><span className="eyebrow">Fokus des Tages</span><div className="daily-number">01</div><span className="topic-area">Herz & Kreislauf</span><h3>Akutes Koronarsyndrom</h3><p>Erkläre dein Vorgehen vom ersten Eindruck bis zur strukturierten Übergabe.</p><button className="text-button" onClick={() => setView("oral")}>Zum Thema <span>→</span></button></aside></div>
  </section>;
}

function ProgressView({ progress, learned }: { progress: number; learned: number[] }) {
  return <section className="page-section progress-page"><div className="section-heading"><div><span className="eyebrow">Dein Lernstand</span><h1>Fortschritt sichtbar machen</h1><p>Jede abgeschlossene Einheit bringt dich deinem Ziel ein Stück näher.</p></div></div><div className="progress-overview"><div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><div><b>{progress}%</b><span>Gesamt</span></div></div><div><span className="eyebrow">Aktueller Stand</span><h2>{learned.length === topics.length ? "Alle Themen geschafft!" : "Bleib in deinem Rhythmus."}</h2><p>Du hast {learned.length} von {topics.length} mündlichen Themen als gelernt markiert.</p><div className="progress-track large"><span style={{ width: `${progress}%` }} /></div></div></div><div className="checklist"><h2>Themenübersicht</h2>{topics.map((topic) => <div key={topic.id}><span className="topic-icon small">{topic.icon}</span><div><b>{topic.title}</b><small>{topic.area}</small></div><strong>{learned.includes(topic.id) ? "Gelernt" : "Offen"}</strong></div>)}</div></section>;
}
