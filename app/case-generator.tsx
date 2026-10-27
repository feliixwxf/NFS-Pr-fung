"use client";

import { useMemo, useState } from "react";

export type CaseTopic = { topic: string; title: string; category: string };
type TrainingMode = "simulation" | "vfa";

export default function CaseGenerator({ topics }: { topics: CaseTopic[] }) {
  const categories = useMemo(() => [...new Set(topics.map((topic) => topic.category))], [topics]);
  const [category, setCategory] = useState("Alle");
  const [topic, setTopic] = useState("zufall");
  const [difficulty, setDifficulty] = useState("anspruchsvoll");
  const [trainingMode, setTrainingMode] = useState<TrainingMode>("simulation");
  const visible = category === "Alle" ? topics : topics.filter((item) => item.category === category);

  const launch = (random = false) => {
    const chosen = random || topic === "zufall" ? visible[Math.floor(Math.random() * visible.length)] : topics.find((item) => item.topic === topic);
    if (!chosen) return;
    window.dispatchEvent(new CustomEvent("notsan-open-tutor", { detail: { mode: trainingMode, focus: chosen.title, difficulty } }));
  };

  return <section className="page-section case-generator-page">
    <div className="section-heading"><div><span className="eyebrow">Dynamisches Falltraining</span><h1>Vom Einsatzbild zur Entscheidung.</h1><p>Wähle ein Krankheitsbild oder lass dich überraschen. Der Lernprüfer stellt dir aufeinander aufbauende Fragen und bewertet die fachlichen Kernpunkte deiner freien Antwort.</p></div><div className="source-badge"><b>F</b><span>Fallmodus</span></div></div>
    <div className="exam-mode-grid" role="radiogroup" aria-label="Trainingsmodus wählen">
      <button type="button" role="radio" aria-checked={trainingMode === "simulation"} className={trainingMode === "simulation" ? "active" : ""} onClick={() => setTrainingMode("simulation")}><span>20′</span><div><b>Komplette Prüfungssimulation</b><small>Vorbereitung, Fallvorstellung, automatische Nachfragen und Gesamtbewertung</small></div></button>
      <button type="button" role="radio" aria-checked={trainingMode === "vfa"} className={trainingMode === "vfa" ? "active" : ""} onClick={() => setTrainingMode("vfa")}><span>VFA</span><div><b>VFA-Prüfung</b><small>VFA-Ablauf mit passenden Nachfragen zu Begründung, Sicherheit und Reevaluation</small></div></button>
    </div>
    <section className="case-generator-card">
      <div className="case-generator-controls"><label><span>Fachbereich</span><select value={category} onChange={(event) => { setCategory(event.target.value); setTopic("zufall"); }}><option>Alle</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Thema</span><select value={topic} onChange={(event) => setTopic(event.target.value)}><option value="zufall">Überraschungsfall</option>{visible.map((item) => <option key={item.topic} value={item.topic}>{item.title}</option>)}</select></label><label><span>Niveau</span><select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option value="grundlegend">Grundlegend</option><option value="anspruchsvoll">Prüfungsnah</option><option value="sehr anspruchsvoll">Sehr anspruchsvoll</option></select></label></div>
      <div className="case-generator-preview"><span aria-hidden="true">{trainingMode === "simulation" ? "20 min" : "VFA"}</span><div><small>So funktioniert es</small><h2>{trainingMode === "simulation" ? "Eine vollständige mündliche Prüfung" : "VFA sicher erklären"}</h2><p>{trainingMode === "simulation" ? "Du erhältst nur die Einsatzlage und 20 Minuten Vorbereitungszeit. Danach präsentierst du dein Vorgehen und beantwortest aufeinander aufbauende Prüferfragen." : "Du erklärst den gewählten VFA-Pfad frei. Danach folgen passende Prüfer-Nachfragen zu Indikation, Kontraindikationen, Maßnahmen, Dosierungen, Abbruchkriterien und Reevaluation."} Lösungen werden erst nach deiner Antwort gezeigt.</p><ul><li>Freie Antworten statt Auswahlmöglichkeiten</li><li>Schlagwörter, Synonyme und sinngleiche Formulierungen zählen</li><li>Nachfragen sind automatisch in jedem Prüfungsmodus enthalten</li><li>Therapie und Dosierungen werden gegen die hinterlegten VFA-Inhalte geprüft</li><li>{trainingMode === "simulation" ? "Bewertung nach Fachlichkeit, Struktur, Prioritäten und VFA-Treue" : "Unsichere Inhalte landen automatisch in deiner Wiederholung"}</li></ul></div></div>
      <div className="case-generator-actions"><button type="button" className="secondary" onClick={() => launch(true)}>Zufälliges Thema wählen</button><button type="button" onClick={() => launch(false)}>{trainingMode === "simulation" ? "Prüfungssimulation starten" : "VFA-Prüfung starten"} <span>→</span></button></div>
    </section>
  </section>;
}
