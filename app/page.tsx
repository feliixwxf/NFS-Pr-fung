"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { QuestionProgress, readQuestionProgress, recordQuestionAnswer, summarizeQuestionProgress } from "./lib/questionProgress";

type View = "start" | "oral" | "quiz" | "progress";

const topics = [
  "Myokardinfarkt", "Angina Pectoris", "Akutes Koronarsyndrom", "Apoplex", "Schädelhirntrauma",
  "Pneumonie", "Venenthrombose", "Lungenembolie", "Ulkusblutung", "Chronisch obstruktive Lungenerkrankung (COPD)",
  "Hyperventilationstetanie", "Geburt", "Asthmaanfall", "Hypertensive Krise", "Akutes Abdomen",
  "Wirbelsäulentrauma", "Instabile Bradykardie", "Thoraxtrauma", "Abdominaltrauma", "Amputationsverletzung",
  "Beckentrauma", "Lungenödem (kardial)", "Extremitätentrauma", "Vorhofflimmern", "Krampfanfall",
  "Schussverletzungen", "Hypoglykämie", "Elektrounfall", "Allergische Reaktionen", "Kindlicher Fieberkrampf",
  "Polytrauma", "Stichverletzungen", "Schock", "Rippenfraktur", "Barotrauma", "Verbrennung / Verbrühung",
  "Alkoholintoxikation", "Opiatintoxikation", "Gallensteinkolik", "Nierensteinkolik", "Periphere arterielle Verschlusskrankheit",
  "Extrauteringravidität (EUG)", "Hodentorsion", "Explosionsverletzungen", "Akute Pankreatitis", "Herzrhythmusstörungen",
  "Unterkühlung / Erfrierung", "Herzbeuteltamponade", "Pseudokrupp", "Epiglottis",
] as const;

const topicGroups = [
  { name: "Herz & Kreislauf", icon: "♥", topicNumbers: [1, 2, 3, 7, 8, 14, 17, 22, 24, 33, 41, 46, 48] },
  { name: "Trauma & Verletzungen", icon: "+", topicNumbers: [5, 16, 18, 19, 20, 21, 23, 26, 28, 31, 32, 34, 35, 36, 44] },
  { name: "Gynäkologie & Geburt", icon: "♀", topicNumbers: [12, 42] },
  { name: "Urologie & männliches Geschlecht", icon: "♂", topicNumbers: [40, 43] },
  { name: "Atmung & Atemwege", icon: "◎", topicNumbers: [6, 10, 11, 13, 50] },
  { name: "Neurologie", icon: "⌁", topicNumbers: [4, 25] },
  { name: "Abdomen & Verdauung", icon: "◇", topicNumbers: [9, 15, 39, 45] },
  { name: "Pädiatrie", icon: "✦", topicNumbers: [30, 49] },
  { name: "Stoffwechsel & Allergie", icon: "△", topicNumbers: [27, 29] },
  { name: "Intoxikationen", icon: "!", topicNumbers: [37, 38] },
  { name: "Umwelt & Temperatur", icon: "❄", topicNumbers: [47] },
] as const;

const chapterSections = [
  { title: "Definition oder Erklärung", hint: "Wichtiger, eng verbundener physiologischer Zusammenhang" },
  { title: "Anatomie und Physiologie", hint: "Betroffenes Organ, Körperteil oder Organsystem" },
  { title: "Ursachen, Entstehung und Pathophysiologie", hint: "Ursachen und weiterführende pathophysiologische Zusammenhänge" },
  { title: "Symptome der Arbeitsdiagnose", hint: "Stützende Symptome und Begründung" },
  { title: "Komplikationen und Gefahren", hint: "Auf das Notfallbild bezogene Risiken mit Begründung" },
  { title: "Einsatzmaterialien", hint: "Benötigte Materialien und begründete Auswahl" },
  { title: "Erstmaßnahmen und Diagnostik", hint: "Basismaßnahmen, ABCDE, SAMPLER(S), OPQRST, FAST und weitere Diagnostik" },
  { title: "Differenzialdiagnosen und Entscheidungsfindung", hint: "Verifizierung und Entscheidung für oder gegen weitere Maßnahmen" },
  { title: "Weitere Maßnahmen", hint: "Therapie, geltende VFA, rechtliche Aspekte, Vorbereitung und Durchführung" },
] as const;

const nav = [
  { id: "start" as View, label: "Start", icon: "⌂" },
  { id: "oral" as View, label: "Mündlich", icon: "◫" },
  { id: "quiz" as View, label: "MC-Training", icon: "✓" },
  { id: "progress" as View, label: "Fortschritt", icon: "↗" },
];

const COMPLETED_TOPICS_KEY = "notsan-completed-topics-v1";

export default function Home() {
  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [view, setView] = useState<View>("start");
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [questionProgress, setQuestionProgress] = useState<QuestionProgress>({});
  const [completedTopics, setCompletedTopics] = useState<number[]>([]);

  useEffect(() => {
    setSignedIn(localStorage.getItem("notsan-access") === "granted");
    setQuestionProgress(readQuestionProgress());
    try { setCompletedTopics(JSON.parse(localStorage.getItem(COMPLETED_TOPICS_KEY) || "[]") as number[]); } catch { setCompletedTopics([]); }
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
    } else setError(true);
  };

  const changeView = (nextView: View) => { setView(nextView); setSelectedTopic(null); };
  const toggleTopicComplete = (topicNumber: number) => {
    setCompletedTopics((current) => {
      const next = current.includes(topicNumber) ? current.filter((number) => number !== topicNumber) : [...current, topicNumber];
      localStorage.setItem(COMPLETED_TOPICS_KEY, JSON.stringify(next));
      return next;
    });
  };
  if (!ready) return <main className="loading-screen" aria-label="Wird geladen" />;

  if (!signedIn) return (
    <main className="login-page">
      <section className="login-brand"><div className="brand brand-light"><span className="brand-mark">N</span><span>NotSan <b>Prüfung</b></span></div><div className="login-copy"><span className="eyebrow light">Dein digitaler Prüfungspartner</span><h1>Bereit, wenn es<br />darauf ankommt.</h1><p>Deine persönliche Lernplattform für das Staatsexamen – übersichtlich, verständlich und auf deine Unterlagen abgestimmt.</p><div className="trust-row"><span>✓ 50 Themen</span><span>✓ Feste Prüfungsstruktur</span><span>✓ Lernfortschritt</span></div></div><div className="ecg" aria-hidden="true"><i /><i /><i /><i /><i /></div></section>
      <section className="login-panel"><form className="login-card" onSubmit={handleLogin}><div className="mobile-brand brand"><span className="brand-mark">N</span><span>NotSan <b>Prüfung</b></span></div><div className="lock-icon">⌁</div><span className="eyebrow">Willkommen zurück</span><h2>Zugang zum Lernbereich</h2><p>Gib deinen persönlichen Einladungscode ein, um mit deiner Vorbereitung zu starten.</p><label htmlFor="invite">Einladungscode</label><div className={`input-wrap ${error ? "has-error" : ""}`}><span>◇</span><input id="invite" type="password" value={code} onChange={(event) => { setCode(event.target.value); setError(false); }} placeholder="Code eingeben" autoComplete="current-password" aria-describedby={error ? "code-error" : undefined} /></div>{error && <p className="error-message" id="code-error">Der Einladungscode ist nicht korrekt.</p>}<button className="primary-button" type="submit">Lernbereich öffnen <span>→</span></button><small>Mit dem Zugang bestätigst du, dass du die Inhalte nur zur persönlichen Prüfungsvorbereitung nutzt.</small></form></section>
    </main>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar"><div className="brand"><span className="brand-mark">N</span><span>NotSan <b>Prüfung</b></span></div><nav aria-label="Hauptnavigation">{nav.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => changeView(item.id)}><span>{item.icon}</span>{item.label}</button>)}</nav><div className="sidebar-tip"><span>☼</span><b>50 Themen angelegt</b><p>Die Fachinhalte folgen ausschließlich aus deinen bereitgestellten Materialien.</p></div><button className="logout" onClick={() => { localStorage.removeItem("notsan-access"); setSignedIn(false); }}>↪ Abmelden</button></aside>
      <main className="main-content">
        <header className="topbar"><div className="mobile-brand brand"><span className="brand-mark">N</span><span>NotSan <b>Prüfung</b></span></div><div className="status-pill preparing"><span /> Struktur angelegt</div><div className="avatar">FS</div></header>
        {view === "start" && <Dashboard setView={changeView} progress={summarizeQuestionProgress(questionProgress).average} />}
        {view === "oral" && <OralLibrary selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} onProgressChange={setQuestionProgress} completedTopics={completedTopics} onToggleComplete={toggleTopicComplete} />}
        {view === "quiz" && <QuizTraining onProgressChange={setQuestionProgress} />}
        {view === "progress" && <ProgressView progress={questionProgress} />}
        <footer><span>NotSan Prüfung · Dein Lernbegleiter</span><span>Themenliste nach DRK-Bildungswerk Thüringen · Inhalte folgen aus deinen Materialien.</span></footer>
      </main>
      <nav className="mobile-nav" aria-label="Mobile Navigation">{nav.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => changeView(item.id)}><span>{item.icon}</span>{item.label}</button>)}</nav>
    </div>
  );
}

function Dashboard({ setView, progress }: { setView: (view: View) => void; progress: number }) {
  return <section className="dashboard"><div className="welcome"><div><span className="eyebrow light">Mündliche Abschlussprüfung</span><h1>50 Themen. Eine klare Struktur.</h1><p>Alle vorgegebenen Notfallbilder sind angelegt. Die Fachinhalte ergänzen wir später ausschließlich aus deinen Materialien.</p><div className="hero-actions"><button className="light-button" onClick={() => setView("oral")}>Themen ansehen <span>→</span></button></div></div><div className="hero-stat"><div><b>{progress}%</b><span>Fragensicherheit</span></div></div></div>
    <div className="stats-grid"><article><span className="stat-icon orange">◫</span><div><small>Prüfungsthemen</small><b>50 <em>angelegt</em></b></div></article><article><span className="stat-icon blue">✓</span><div><small>Skriptfragen</small><b>18 <em>Schlaganfall</em></b></div></article><article><span className="stat-icon green">↗</span><div><small>Fragensicherheit</small><b>{progress}<em>%</em></b></div></article></div>
    <div className="dashboard-grid"><section><div className="block-title"><div><span className="eyebrow">Deine Bereiche</span><h2>Prüfungsvorbereitung</h2></div></div><div className="action-cards"><button onClick={() => setView("oral")}><span className="action-icon">◫</span><div><small>50 Kapitelvorlagen</small><h3>Mündliche Themen</h3><p>Jedes Thema enthält bereits die neun vorgegebenen Prüfungsabschnitte.</p><b>Themen öffnen →</b></div></button><button onClick={() => setView("progress")}><span className="action-icon dark">↗</span><div><small>Dreistufig lernen</small><h3>Fortschritt</h3><p>Dreimal richtig bedeutet sicher. Eine falsche Antwort setzt die Frage zurück.</p><b>System ansehen →</b></div></button></div></section><aside className="daily-card empty-daily"><span className="eyebrow">Quelle</span><div className="daily-number">50</div><span className="topic-area">DRK Thüringen</span><h3>Orientierungsliste</h3><p>Die Themenübersicht dient laut Quelldokument zur Orientierung und erhebt keinen Anspruch auf Vollständigkeit.</p><button className="text-button" onClick={() => setView("oral")}>Alle Themen ansehen <span>→</span></button></aside></div>
  </section>;
}

function OralLibrary({ selectedTopic, setSelectedTopic, onProgressChange, completedTopics, onToggleComplete }: { selectedTopic: number | null; setSelectedTopic: (topic: number | null) => void; onProgressChange: (progress: QuestionProgress) => void; completedTopics: number[]; onToggleComplete: (topicNumber: number) => void }) {
  const [search, setSearch] = useState("");
  const filteredGroups = useMemo(() => topicGroups.map((group) => ({
    ...group,
    entries: group.topicNumbers.map((number) => ({ title: topics[number - 1], number })).filter((topic) => topic.title.toLowerCase().includes(search.toLowerCase())),
  })).filter((group) => group.entries.length > 0), [search]);
  const resultCount = filteredGroups.reduce((sum, group) => sum + group.entries.length, 0);
  if (selectedTopic !== null) return <TopicReader topicNumber={selectedTopic} onBack={() => setSelectedTopic(null)} onProgressChange={onProgressChange} completed={completedTopics.includes(selectedTopic + 1)} onToggleComplete={() => onToggleComplete(selectedTopic + 1)} />;

  return <section className="page-section topic-library-page"><div className="section-heading"><div><span className="eyebrow">Mündliche Prüfung · Themenbereich 7</span><h1>Nach Fachbereichen sortiert</h1><p>Herz und Kreislauf zuerst, danach Trauma, geschlechtsspezifische Themen und weitere medizinische Bereiche.</p></div><div className="source-badge"><b>50</b><span>Themen</span></div></div><div className="topic-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Thema suchen …" aria-label="Prüfungsthemen durchsuchen" /><small>{resultCount} Ergebnisse</small></div><div className="grouped-topics">{filteredGroups.map((group) => <section className="topic-group" key={group.name}><div className="topic-group-heading"><span>{group.icon}</span><div><h2>{group.name}</h2><p>{group.entries.length} {group.entries.length === 1 ? "Thema" : "Themen"}</p></div></div><div className="topic-name-grid">{group.entries.map((topic) => { const completed = completedTopics.includes(topic.number); return <button className={`${topic.number === 4 ? "topic-ready" : ""} ${completed ? "topic-completed" : ""}`} key={topic.number} onClick={() => setSelectedTopic(topic.number - 1)}><span>{completed ? "✓" : String(topic.number).padStart(2, "0")}</span><div><b>{topic.number === 4 ? "Apoplex (Schlaganfall)" : topic.title}</b><small>{completed ? "Kapitel absolviert" : topic.number === 4 ? "Offen · Lesekapitel verfügbar · VFA 44" : "Offen · Kapitelstruktur angelegt"}</small></div><i>→</i></button>; })}</div></section>)}</div><p className="orientation-note">Hinweis der Quelle: Die Themenübersicht dient zur Orientierung und erhebt keinen Anspruch auf Vollständigkeit.</p></section>;
}

function TopicReader({ topicNumber, onBack, onProgressChange, completed, onToggleComplete }: { topicNumber: number; onBack: () => void; onProgressChange: (progress: QuestionProgress) => void; completed: boolean; onToggleComplete: () => void }) {
  const title = topics[topicNumber];
  const [openSections, setOpenSections] = useState<number[]>(chapterSections.map((_, index) => index));
  const toggleSection = (index: number) => setOpenSections((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  const groupName = topicGroups.find((group) => (group.topicNumbers as readonly number[]).includes(topicNumber + 1))?.name;
  const hasContent = topicNumber === 3;
  return <section className="page-section topic-reader"><button className="back-button" onClick={onBack}>← Alle Themen</button><div className={`reader-hero ${hasContent ? "reader-hero-ready" : ""}`}><div><span className="eyebrow light">{groupName} · Thema {String(topicNumber + 1).padStart(2, "0")}</span><h1>{hasContent ? "Apoplex (Schlaganfall)" : title}</h1><p>Zeitfenster laut Themenvorgabe: circa 20 Minuten.</p></div><span className={`reader-status ${completed ? "completed" : ""}`}>{completed ? "Kapitel absolviert" : hasContent ? "Kapitel offen" : "Leere Vorlage"}</span></div>{hasContent ? <ApoplexLesson onProgressChange={onProgressChange} completed={completed} onToggleComplete={onToggleComplete} /> : <div className="reader-layout"><div className="reader-sections reading-flow">{chapterSections.map((section, index) => { const isOpen = openSections.includes(index); return <section className={`reader-accordion ${isOpen ? "open" : ""}`} key={section.title}><button className="reader-section-toggle" onClick={() => toggleSection(index)} aria-expanded={isOpen}><div className="reader-section-head"><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{section.title}</h2><p>{section.hint}</p></div></div><i>{isOpen ? "−" : "+"}</i></button>{isOpen && <div className="accordion-content"><div className="material-placeholder"><i>＋</i><span>Noch kein Material hinterlegt</span></div></div>}</section>; })}<section className="vfa-placeholder"><div className="reader-section-head"><span>10</span><div><h2>Verfahrensanweisung Thüringen</h2><p>Passende VFA-Seite am Ende des Kapitels</p></div></div><div className="vfa-drop"><b>VFA 2026/2027</b><span>Die passende Nummer und Seite wird später von dir vorgegeben.</span></div></section><QuestionPanel /></div></div>}</section>;
}

function ChapterHeading({ number, title, kicker }: { number: string; title: string; kicker: string }) {
  return <header className="chapter-heading"><span>{number}</span><div><small>{kicker}</small><h2>{title}</h2></div></header>;
}

function SourceFigure({ src, alt, caption, wide = false }: { src: string; alt: string; caption: string; wide?: boolean }) {
  return <figure className={`source-figure ${wide ? "wide" : ""}`}><img src={src} alt={alt} /><figcaption>{caption}<span>Abbildung aus deiner Vorlage</span></figcaption></figure>;
}

function ApoplexLesson({ onProgressChange, completed, onToggleComplete }: { onProgressChange: (progress: QuestionProgress) => void; completed: boolean; onToggleComplete: () => void }) {
  return <article className="lesson-article">
    <div className="lesson-intro"><p className="lead">Ein Schlaganfall ist ein akut einsetzender neurologischer Ausfall durch eine Minderversorgung von Hirnzellen mit Sauerstoff und Glukose oder durch eine direkte Schädigung des Hirngewebes, zum Beispiel durch eine Blutung.</p><p>Dieses Lesekapitel überträgt den Inhalt deiner bereitgestellten Unterlage in die vorgegebene Prüfungsstruktur. Alle Bereiche sind beim Öffnen vollständig sichtbar.</p></div>

    <section className="lesson-section"><ChapterHeading number="01" kicker="Grundverständnis" title="Definition oder Erklärung" /><div className="lesson-prose"><p>Der Schlaganfall wird in zwei Hauptformen unterschieden:</p><div className="stroke-types"><article><b>80–85 %</b><h3>Ischämischer Schlaganfall</h3><p>Ein Gefäßverschluss führt zur Minderversorgung des betroffenen Hirngewebes. Als Zusammenhänge nennt die Vorlage Atherosklerose, Diabetes mellitus und Embolien.</p></article><article><b>10–15 %</b><h3>Hämorrhagischer Schlaganfall</h3><p>Eine Blutung schädigt oder verdrängt Hirngewebe. Genannt werden Hypertonie, Subarachnoidalblutung, subdurale und epidurale Hämatome sowie spontane Blutungen unter neuen oralen Antikoagulanzien.</p></article></div></div><FlashcardDeck section="definition" /></section>

    <section className="lesson-section"><ChapterHeading number="02" kicker="Anatomie / Physiologie" title="Anatomie und Physiologie" /><div className="lesson-prose script-copy">
      <p>Unterteilung in Zentral (Gehirn und Rückenmark) und Peripheres Nervensystem (Hirnnerven und Spinalnerven) (12 Hirnnerven und 31 Spinalnerven).</p><p>Unterteilung in somatisches (willkürlich) oder autonomes (unbewusstes Nervensystem).</p>
      <h3>Hirnstamm (wird in 3 Teile untergliedert)</h3><ul className="script-list"><li><b>Verlängertes Mark (Medulla oblongata):</b> Atem-Reflex & Kreislaufzentrum, Willkürmotorik (Weiße Substanz), Übergang zu Rückenmark.</li><li><b>Brücke (Pons):</b> Verbindung zw. Groß & Kleinhirn, hat Hirnnervkerne, Informationsweiterleitung.</li><li><b>Mittelhirn:</b> Steuerung von reflexartigen Bewegungen und steuert Augenmuskeln.</li></ul>
      <h3>Zwischenhirn (Diencephalon)</h3><ul className="script-list"><li><b>Hypothalamus:</b> steuert vegetative und endokrine Vorgänge und Sexualverhalten sowie Hypophyse.</li><li><b>Hypophyse:</b> Hormondrüsen und Funktionssteuerung vieler endokriner Drüsen.</li><li><b>Thalamus:</b> Tor zum Bewusstsein, graue Substanz, Infosammlung – Verschaltung – Verarbeitung.</li></ul>
      <h3>Kleinhirn (Cerebellum)</h3><ul className="script-list"><li>Graue Substanz, Aufgabe Gleichgewichtskontrolle / Abstimmung von Bewegungsabläufen.</li><li>Blut-Hirn-Schranke hier niedriger (Alkohol diffundiert durch → daher Koordinationsstörungen).</li></ul>
      <h3>Großhirn (Telencephalon)</h3><ul className="script-list"><li>Ca. 80 % des Gehirns, Mischung aus grauer und weißer Substanz.</li><li>Funktion: Sitz des Bewusstseins / Handeln / Wille / Gedächtnis.</li></ul><SourceFigure src="/lessons/apoplexie/source-p1-1.png" alt="Gehirn mit beschrifteten anatomischen Strukturen" caption="Gehirn" wide /><SourceFigure src="/lessons/apoplexie/source-p2-3.png" alt="Darstellung der Hirnlappen" caption="Hirnlappen" wide />
      <h3>Blutversorgung des Gehirns</h3><p>Das Gehirn hat einen hohen Energie- und Sauerstoffbedarf und reagiert äußerst empfindlich auf Unterbrechungen der Blutversorgung. Innerhalb von Sekunden können reversible Funktionsausfälle auftreten, während irreversible Schäden bereits nach wenigen Minuten auftreten können.</p><p>Das Gehirn wird von zwei Hauptarterien pro Gehirnhälfte versorgt:</p><ul className="script-list"><li>Innere Halsschlagader (A. carotis interna)</li><li>Wirbelarterie (A. vertebralis)</li></ul><SourceFigure src="/lessons/apoplexie/gehirn-sagittal-beschriftet.png" alt="Beschriftetes Gehirn sagittal mit Arterien" caption="Gehirn, sagittal mit Arterien" wide />
      <h3>A. cerebri posterior (Hintere Großhirnarterien)</h3><p>Im Bereich des Mittelhirns teilt sich die A. basilaris in zwei große Aa. cerebri posteriores auf. Jede dieser Arterien sendet einen Ast zur A. carotis interna derselben Seite. Die A. cerebri posterior versorgt den Hinterhauptlappen des Gehirns.</p>
      <h3>A. cerebri anterior (Vordere Großhirnarterie)</h3><p>Die A. carotis interna gibt eine kleinere A. cerebri anterior ab. Diese Arterie verzweigt sich in der Tiefe zwischen den beiden Hemisphären. Die A. cerebri anterior versorgt die Innenseite des Gehirns.</p><p>Diese Arterien sind untereinander verbunden und bilden den geschlossenen Arterienkreis namens Circulus arteriosus cerebri (Willisii).</p><SourceFigure src="/lessons/apoplexie/source-p2-5.png" alt="Arteria carotis und ihre Äste" caption="A. carotis und ihre Äste" wide />
      <h3>Circulus arteriosus cerebri</h3><p>Der Circulus arteriosus cerebri, auch bekannt als Willis-Kreislauf, ist ein arterieller Gefäßring an der Basis des Gehirns, der dazu dient, die Blutzufuhr zum Gehirn sicherzustellen, insbesondere in Fällen, in denen eine der Hauptarterien blockiert oder eingeschränkt ist.</p><p>Der Circulus arteriosus cerebri bildet einen wichtigen Schutzmechanismus, um das Gehirn vor einer möglichen Unterversorgung mit Blut und Sauerstoff zu bewahren.</p><SourceFigure src="/lessons/apoplexie/willis-kreis-beschriftet.png" alt="Beschrifteter Circulus arteriosus cerebri" caption="Circulus arteriosus cerebri" wide />
      <h3>Venöser Blutabfluss</h3><p>Das sauerstoffarme Blut wird über die innere Drosselvene (V. jugularis interna) in die obere Hohlvene geleitet.</p><div className="vein-pair"><span><b>1</b>Innere Drosselvene<small>V. jugularis interna</small></span><i>→</i><span><b>2</b>Obere Hohlvene</span></div>
    </div><FlashcardDeck section="anatomy" /></section>

    <section className="lesson-section"><ChapterHeading number="03" kicker="Pathophysiologie" title="Ursachen, Entstehung und Pathophysiologie" /><div className="lesson-prose script-copy"><h3>Ischämischer Schlaganfall (häufig)</h3><p>Meist Thrombus / Embolus → Gefäßverschluss → verminderte Perfusion → Infarktgebiet.</p><p>Glukosemangel → Funktionsstörung der ATP-abhängigen Ionenpumpe.</p><ul className="script-list"><li>Kalziumeinstrom in Hirnzellen → intrazelluläre Stoffwechselstörung (Bildung von freien Sauerstoffradikalen) → Schädigung der Zellstruktur.</li><li>Natrium-Wassereinstrom in Hirnzellen → Hirnödem.</li></ul><p>Ursache oft: Atherosklerose, Vorhofflimmern, Gefäßstenosen.</p><h3>Hämorrhagischer Schlaganfall</h3><p>Gefäßruptur, z. B. bei Hypertonus, Aneurysma, SHT, Drogenkonsum → Blutung verdrängt Hirngewebe, Hirndruckanstieg → Einklemmungsgefahr → Cushing-Triade beachten.</p><p>ICB: ins Hirngewebe, SAB zwischen Pia Mater und Arachnoidea, subdural → Dura mater und Arachnoidea, epidural zwischen Schädelknochen und Dura mater.</p><aside className="knowledge-note"><b>TIA (transitorische ischämische Attacke)</b><p>Vorübergehende Durchblutungsstörung, Symptome bilden sich komplett zurück, meist innerhalb Minuten – aber Notfall! → Stroke Unit notwendig.</p></aside></div><FlashcardDeck section="pathophysiology" /></section>

    <section className="lesson-section red-flag-section"><ChapterHeading number="04" kicker="Welche Symptome stützen Ihre Arbeitsdiagnose?" title="Symptome" /><div className="lesson-prose script-copy"><ul className="symptom-grid"><li>Hemiparese / Hemiplegie (Gesicht, Arm, Bein)</li><li>Fazialisparese (hängender Mundwinkel)</li><li>Sprachstörungen: Aphasie, Sensibilitätsstörungen</li><li>Sehstörungen: Gesichtsfelddefekte, Doppelbilder</li><li>Gangunsicherheit, Schwindel</li><li>Bewusstseinsstörung möglich</li></ul><aside className="red-flags"><span>!</span><div><small>Red Flags aus dem Skript</small><h3>BEFAST mind. 1 positiv</h3><p>TIA: Symptome bilden sich komplett zurück, meist innerhalb Minuten – aber Notfall!</p><b>Hirndruckanstieg → Einklemmungsgefahr → Cushing-Triade beachten.</b></div></aside></div><FlashcardDeck section="symptoms" /></section>

    <section className="lesson-section"><ChapterHeading number="05" kicker="Welche Gefahren und Komplikationen gibt es bezogen auf das Notfallbild?" title="Komplikationen und Gefahren" /><div className="lesson-prose script-copy"><ul className="script-list"><li>Hirnödem, Hirndrucksteigerung, Hirneinklemmung → Atem- und Kreislaufversagen.</li><li>Aspiration bei Bewusstseinsstörungen.</li><li>Krampfanfälle (v. a. bei Blutung).</li><li>Langfristig: bleibende Lähmungen, Sprachstörungen, vaskuläre Demenz.</li></ul></div><FlashcardDeck section="complications" /></section>

    <section className="lesson-section"><ChapterHeading number="06" kicker="Welche Einsatzmaterialien nehmen Sie mit?" title="Einsatzmaterialien" /><div className="lesson-prose"><div className="material-chips"><span>EKG</span><span>Rucksack</span><span>Sauerstoff / Medumat</span><span>Medikamente</span><span>Absaugung</span><span>BZ</span><span>Zugang mind. Größe 18 G</span></div></div><FlashcardDeck section="materials" /></section>

    <section className="lesson-section"><ChapterHeading number="07" kicker="Welche Erstmaßnahmen treffen Sie?" title="Erstmaßnahmen und Diagnostik" /><div className="lesson-prose"><div className="material-chips"><span>Kritisch / nicht kritisch</span><span>Meist hämodynamisch stabil</span><span>BEFAST</span><span>Lagerung</span><span>SAMPERS</span><span>NEF-Nachforderung</span><span>BZ</span><span>Neurologische Tests durchführen</span></div></div><FlashcardDeck section="initial" /></section>

    <section className="lesson-section"><ChapterHeading number="08" kicker="Differenzialdiagnosen und Entscheidungsfindung" title="Differenzialdiagnosen" /><div className="lesson-prose"><div className="differential-grid"><span>Hypoglykämie</span><span>Epileptischer Anfall / postiktaler Zustand</span><span>Intrakranielle Blutung anderer Ursache, SHT</span><span>Meningitis / Enzephalitis (oft mit Fieber, Kopfschmerz, Meningismus)</span><span>Migräne mit Aura</span><span>Intoxikationen, metabolische Entgleisungen</span></div></div><FlashcardDeck section="differentials" /></section>

    <section className="lesson-section"><ChapterHeading number="09" kicker="Weitere Maßnahmen" title="Weitere Maßnahmen" /><div className="lesson-prose script-copy"><ul className="script-list"><li>Blutabnahme, RTH? Blutdrucksenkung nach VFA-Schlaganfall (15 % bei &gt; 220 / &gt; 120), Blutzucker reevaluieren.</li><li>Lagerung 30 Grad OKH, Versorgungszeit &lt; 20 min, Prähospitalzeit &lt; 60 min.</li><li>Monitoring während Fahrt, telefonische Anmeldung.</li></ul></div><FlashcardDeck section="further" /></section>

    <section className="lesson-section vfa-chapter"><ChapterHeading number="10" kicker="Originalalgorithmus" title="VFA Thüringen 2026/2027" /><div className="lesson-prose"><p>Verfahrensanweisung 44 „Schlaganfall Erwachsene“. Die Abbildung stammt direkt aus der von dir bereitgestellten Thüringer VFA.</p><figure className="vfa-page"><img src="/lessons/apoplexie/vfa-schlaganfall-thueringen-2026-2027.png" alt="Verfahrensanweisung 44 Schlaganfall Erwachsene aus Thüringen 2026/2027" /><figcaption>VFA 44 · Schlaganfall Erwachsene · Version 2026/27</figcaption></figure></div></section>

    <StudyFinale onProgressChange={onProgressChange} />
    <section className={`chapter-completion ${completed ? "completed" : ""}`}><div><span>{completed ? "✓" : "○"}</span><div><b>{completed ? "Kapitel absolviert" : "Kapitel noch offen"}</b><p>Markiere das mündliche Thema nach deiner Bearbeitung. Der Status erscheint anschließend direkt in der Themenübersicht.</p></div></div><button onClick={onToggleComplete}>{completed ? "Als offen markieren" : "Als absolviert markieren"}</button></section>
    <p className="lesson-source">Lerninhalt: „Apoplexie (Schlaganfall) 2.pdf“ · VFA-Abbildung: Thüringer Verfahrensanweisungen 2026/2027. Die Darstellung dient der Prüfungsvorbereitung und ersetzt keine lokalen Vorgaben oder medizinische Rücksprache.</p>
  </article>;
}

type FlashcardSection = "definition" | "anatomy" | "pathophysiology" | "symptoms" | "complications" | "materials" | "initial" | "differentials" | "further";
type Flashcard = { question: string; answer: string };

const flashcardSets: Record<FlashcardSection, Flashcard[]> = {
  definition: [{ question: "Grenzen Sie den ischämischen vom hämorrhagischen Insult anhand des Skripts ab.", answer: "Ischämisch: Gefäßverschluss, ca. 80–85 %. Hämorrhagisch: Blutung, ca. 10–15 %." }],
  anatomy: [{ question: "Leiten Sie die arterielle Versorgung bis zum Circulus arteriosus cerebri her.", answer: "Versorgung über A. carotis interna und A. vertebralis. A. basilaris teilt sich in die Aa. cerebri posteriores; die Gefäße bilden den Circulus arteriosus cerebri (Willisii)." }, { question: "Welche zwei großen Venen bilden den hier relevanten venösen Abflussweg?", answer: "Innere Drosselvene (V. jugularis interna) → obere Hohlvene." }],
  pathophysiology: [{ question: "Stellen Sie die ischämische Schädigungskaskade vollständig dar.", answer: "Thrombus / Embolus → Gefäßverschluss → verminderte Perfusion → Infarktgebiet; Glukosemangel → Funktionsstörung der ATP-abhängigen Ionenpumpe; Kalziumeinstrom → freie Sauerstoffradikale → Zellschädigung; Natrium-Wassereinstrom → Hirnödem." }, { question: "Welche Folgen der Blutung führen beim hämorrhagischen Schlaganfall zur vitalen Gefahr?", answer: "Blutung verdrängt Hirngewebe → Hirndruckanstieg → Einklemmungsgefahr; Cushing-Triade beachten." }],
  symptoms: [{ question: "Mit welchen Befunden stützen Sie die Arbeitsdiagnose Schlaganfall?", answer: "Hemiparese / Hemiplegie, Fazialisparese, Aphasie, Sensibilitätsstörungen, Gesichtsfelddefekte, Doppelbilder, Gangunsicherheit, Schwindel, mögliche Bewusstseinsstörung und BEFAST mind. 1 positiv." }],
  complications: [{ question: "Entwickeln Sie die Gefahrenkette vom Hirnödem bis zum vitalen Versagen.", answer: "Hirnödem → Hirndrucksteigerung → Hirneinklemmung → Atem- und Kreislaufversagen." }],
  materials: [{ question: "Welche Einsatzmaterialien nehmen Sie zum vermuteten Schlaganfall mit?", answer: "EKG, Rucksack, Sauerstoff / Medumat, Medikamente, Absaugung, BZ und Zugang mind. Größe 18 G." }],
  initial: [{ question: "Nennen Sie die Erstmaßnahmen in der Reihenfolge des Skripts.", answer: "Kritisch / nicht kritisch, meist hämodynamisch stabil, BEFAST, Lagerung, SAMPERS, NEF-Nachforderung, BZ und neurologische Tests durchführen." }],
  differentials: [{ question: "Welche Differenzialdiagnosen müssen laut Skript gegeneinander abgegrenzt werden?", answer: "Hypoglykämie; epileptischer Anfall / postiktaler Zustand; intrakranielle Blutung anderer Ursache, SHT; Meningitis / Enzephalitis; Migräne mit Aura; Intoxikationen und metabolische Entgleisungen." }],
  further: [{ question: "Welche Zeit-, Lagerungs- und Transportziele nennt das Skript?", answer: "30 Grad OKH, Versorgungszeit < 20 min, Prähospitalzeit < 60 min, Monitoring während Fahrt und telefonische Anmeldung." }, { question: "Wann und mit welchem Ziel nennt das Skript eine Blutdrucksenkung?", answer: "Nach VFA-Schlaganfall: 15 % bei > 220 / > 120." }],
};

function FlashcardDeck({ section }: { section: FlashcardSection }) {
  void section;
  return null;
}

type TrainingFlashcard = Flashcard & { id: string; area: string };

const collectedFlashcards: TrainingFlashcard[] = Object.entries(flashcardSets).flatMap(([area, cards]) => cards.map((card, index) => ({ ...card, id: `apoplex-card-${area}-${index + 1}`, area })));

function shuffledFlashcards(previous: TrainingFlashcard[] = []) {
  const next = [...collectedFlashcards];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  if (previous.length === next.length && previous.every((card, index) => card.id === next[index].id)) next.push(next.shift()!);
  return next;
}

function StudyFinale({ onProgressChange }: { onProgressChange: (progress: QuestionProgress) => void }) {
  const [mode, setMode] = useState<"quiz" | "flashcards" | null>(null);
  return <section className="study-finale"><div className="study-finale-heading"><span className="eyebrow">Kapitel abgeschlossen</span><h2>Wie möchtest du dich prüfen?</h2><p>Beide Trainingsformen verwenden ausschließlich dein Schlaganfall-Skript und speichern die Ergebnisse in derselben Lernstatistik.</p></div>{mode === null ? <div className="study-mode-grid"><button onClick={() => setMode("quiz")}><span>R/F</span><div><small>18 Aussagen</small><h3>Richtig/Falsch-Training</h3><p>Vom Grundlagenwissen bis zu anspruchsvollen Verknüpfungsfragen auf Staatsexamensniveau.</p><b>Training auswählen →</b></div></button><button onClick={() => setMode("flashcards")}><span>12</span><div><small>Gesammelte Gebiete</small><h3>Karteikarten-Prüfung</h3><p>Freie Antworten zu Anatomie, Pathophysiologie, Diagnostik, Maßnahmen und Gefahren.</p><b>Karteikarten auswählen →</b></div></button></div> : <><button className="change-study-mode" onClick={() => setMode(null)}>← Andere Trainingsform wählen</button>{mode === "quiz" ? <TrueFalseQuiz onProgressChange={onProgressChange} /> : <FlashcardTraining onProgressChange={onProgressChange} />}</>}</section>;
}

function FlashcardTraining({ onProgressChange }: { onProgressChange: (progress: QuestionProgress) => void }) {
  const [cards, setCards] = useState<TrainingFlashcard[]>(() => shuffledFlashcards());
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState(0);
  const [finished, setFinished] = useState(false);
  const card = cards[index];

  const assess = (isKnown: boolean) => {
    onProgressChange(recordQuestionAnswer(card.id, isKnown));
    if (isKnown) setKnown((current) => current + 1);
    if (index === cards.length - 1) setFinished(true);
    else { setIndex((current) => current + 1); setRevealed(false); }
  };

  const restart = () => {
    setCards((current) => shuffledFlashcards(current));
    setIndex(0);
    setRevealed(false);
    setKnown(0);
    setFinished(false);
  };

  if (finished) return <section className="flashcard-training flashcard-result"><span className="eyebrow">Karteikarten abgeschlossen</span><h2>{known} von {cards.length} gewusst</h2><p>Deine Selbsteinschätzung wurde in der Lernstatistik gespeichert. „Noch üben“ setzt die betreffende Karte auf 0 % zurück.</p><button className="primary-button" onClick={restart}>Neu starten und mischen</button></section>;

  return <section className="flashcard-training"><div className="flashcard-training-head"><span>Karte {index + 1} von {cards.length}</span><small>Notfallsanitäter-Staatsexamen · Thüringen</small></div><div className={`exam-flashcard ${revealed ? "revealed" : ""}`}><small>{revealed ? "Musterantwort aus dem Skript" : "Mündliche Prüfungsaufgabe"}</small><h2>{revealed ? card.answer : card.question}</h2>{!revealed && <p>Formuliere deine Antwort zunächst vollständig, bevor du die Musterantwort aufdeckst.</p>}</div>{!revealed ? <button className="primary-button reveal-card" onClick={() => setRevealed(true)}>Musterantwort aufdecken</button> : <div className="flashcard-assessment"><button className="known" onClick={() => assess(true)}>✓ Gewusst</button><button className="practice" onClick={() => assess(false)}>↺ Noch üben</button></div>}</section>;
}

type TrueFalseQuestion = { id: string; statement: string; correct: boolean; source: string; difficulty: 1 | 2 | 3 };

const apoplexTrueFalseQuestions: TrueFalseQuestion[] = [
  { id: "apoplex-tf-01", statement: "Das Nervensystem wird in ein zentrales und ein peripheres Nervensystem unterteilt.", correct: true, source: "Unterteilung in Zentral (Gehirn und Rückenmark) und Peripheres Nervensystem (Hirnnerven und Spinalnerven).", difficulty: 1 },
  { id: "apoplex-tf-02", statement: "Zum peripheren Nervensystem gehören 12 Hirnnerven und 31 Spinalnerven.", correct: true, source: "12 Hirnnerven und 31 Spinalnerven.", difficulty: 1 },
  { id: "apoplex-tf-03", statement: "Das Kleinhirn ist laut Skript für die Gleichgewichtskontrolle und die Abstimmung von Bewegungsabläufen zuständig.", correct: true, source: "Aufgabe Gleichgewichtskontrolle / Abstimmung von Bewegungsabläufen.", difficulty: 1 },
  { id: "apoplex-tf-04", statement: "Das Gehirn hat einen niedrigen Energie- und Sauerstoffbedarf.", correct: false, source: "Das Gehirn hat einen hohen Energie- und Sauerstoffbedarf.", difficulty: 1 },
  { id: "apoplex-tf-05", statement: "Ein ischämischer Schlaganfall entsteht im Skript meist durch Thrombus oder Embolus mit Gefäßverschluss.", correct: true, source: "Meist Thrombus / Embolus → Gefäßverschluss → verminderte Perfusion → Infarktgebiet.", difficulty: 1 },
  { id: "apoplex-tf-06", statement: "Beim hämorrhagischen Schlaganfall kann ein Hirndruckanstieg zur Einklemmungsgefahr führen.", correct: true, source: "Blutung verdrängt Hirngewebe, Hirndruckanstieg → Einklemmungsgefahr.", difficulty: 1 },
  { id: "apoplex-tf-07", statement: "Eine TIA ist laut Skript kein Notfall, wenn sich die Symptome komplett zurückbilden.", correct: false, source: "Symptome bilden sich komplett zurück, meist innerhalb Minuten – aber Notfall! → Stroke Unit notwendig.", difficulty: 2 },
  { id: "apoplex-tf-08", statement: "Eine Bewusstseinsstörung ist beim Schlaganfall ausgeschlossen.", correct: false, source: "Bewusstseinsstörung möglich.", difficulty: 2 },
  { id: "apoplex-tf-09", statement: "Mindestens ein positiver BEFAST-Befund stützt die Arbeitsdiagnose.", correct: true, source: "BEFAST mind. 1 positiv.", difficulty: 2 },
  { id: "apoplex-tf-10", statement: "Ein Zugang soll laut Skript mindestens Größe 18 G haben.", correct: true, source: "Zugang mind. Größe 18 G.", difficulty: 2 },
  { id: "apoplex-tf-11", statement: "Hypoglykämie gehört zu den genannten Differenzialdiagnosen.", correct: true, source: "Differenzialdiagnosen: Hypoglykämie.", difficulty: 2 },
  { id: "apoplex-tf-12", statement: "Das Skript nennt eine Lagerung mit 30 Grad Oberkörperhochlagerung.", correct: true, source: "Lagerung 30 Grad OKH.", difficulty: 2 },
  { id: "apoplex-tf-13", statement: "Kalziumeinstrom verursacht laut Skript das Hirnödem, während Natrium-Wassereinstrom freie Sauerstoffradikale bildet.", correct: false, source: "Kalziumeinstrom → freie Sauerstoffradikale → Zellschädigung; Natrium-Wassereinstrom → Hirnödem.", difficulty: 3 },
  { id: "apoplex-tf-14", statement: "Bei einer SAB liegt die Blutung laut Skript zwischen Pia Mater und Arachnoidea.", correct: true, source: "SAB zwischen Pia Mater und Arachnoidea.", difficulty: 3 },
  { id: "apoplex-tf-15", statement: "Die A. cerebri posterior versorgt die Innenseite des Gehirns, die A. cerebri anterior den Hinterhauptlappen.", correct: false, source: "A. cerebri posterior: Hinterhauptlappen. A. cerebri anterior: Innenseite des Gehirns.", difficulty: 3 },
  { id: "apoplex-tf-16", statement: "Der Circulus arteriosus cerebri verbindet die Arterien zu einem geschlossenen Arterienkreis.", correct: true, source: "Diese Arterien sind untereinander verbunden und bilden den geschlossenen Arterienkreis namens Circulus arteriosus cerebri (Willisii).", difficulty: 3 },
  { id: "apoplex-tf-17", statement: "Der venöse Abfluss führt von der V. jugularis interna in die obere Hohlvene.", correct: true, source: "Innere Drosselvene (V. jugularis interna) → obere Hohlvene.", difficulty: 3 },
  { id: "apoplex-tf-18", statement: "Das Skript nennt eine Blutdrucksenkung um 15 % erst bei Werten über 220 beziehungsweise über 120.", correct: true, source: "Blutdrucksenkung nach VFA-Schlaganfall (15 % bei > 220 / > 120).", difficulty: 3 },
];

function shuffledQuestions(previous: TrueFalseQuestion[] = []) {
  const next = ([1, 2, 3] as const).flatMap((difficulty) => {
    const tier = apoplexTrueFalseQuestions.filter((question) => question.difficulty === difficulty);
    for (let index = tier.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [tier[index], tier[swapIndex]] = [tier[swapIndex], tier[index]];
    }
    return tier;
  });
  if (previous.length === next.length && previous.every((question, index) => question.id === next[index].id)) next.push(next.shift()!);
  return next;
}

function TrueFalseQuiz({ onProgressChange, standalone = false }: { onProgressChange: (progress: QuestionProgress) => void; standalone?: boolean }) {
  const [questions, setQuestions] = useState<TrueFalseQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [finished, setFinished] = useState(false);

  const start = () => {
    setQuestions((current) => shuffledQuestions(current));
    setQuestionIndex(0);
    setSelected(null);
    setCorrectAnswers(0);
    setFinished(false);
  };

  const answer = (value: boolean) => {
    if (selected !== null) return;
    const question = questions[questionIndex];
    const isCorrect = value === question.correct;
    setSelected(value);
    if (isCorrect) setCorrectAnswers((current) => current + 1);
    onProgressChange(recordQuestionAnswer(question.id, isCorrect));
  };

  const next = () => {
    if (questionIndex === questions.length - 1) setFinished(true);
    else {
      setQuestionIndex((current) => current + 1);
      setSelected(null);
    }
  };

  if (!questions.length) return <div className={`ai-question-panel quiz-launch ${standalone ? "standalone" : ""}`}><div><span className="eyebrow">{standalone ? "MC-Training" : "Nach dem Lesen"}</span><h2>Richtig/Falsch-Fragen aus dem Skript</h2><p>Alle Aussagen werden ausschließlich aus deinem hinterlegten Schlaganfall-Material erstellt. Die Reihenfolge wird bei jedem Neustart neu gemischt.</p></div><button className="primary-button" onClick={start}>{standalone ? "Training starten" : "KI-Fragen erstellen"}</button></div>;

  if (finished) return <section className={`chapter-quiz quiz-result ${standalone ? "standalone" : ""}`}><span className="eyebrow">Training abgeschlossen</span><h2>{correctAnswers} von {questions.length} richtig</h2><p>Jede Antwort wurde in deiner Fortschrittsstatistik gespeichert. Falsche Antworten setzen die jeweilige Frage wieder auf 0 %.</p><button className="primary-button" onClick={start}>Neu starten und mischen</button></section>;

  const question = questions[questionIndex];
  const wasCorrect = selected !== null && selected === question.correct;
  const trueClass = selected === null ? "" : question.correct ? "correct" : selected === true ? "wrong" : "";
  const falseClass = selected === null ? "" : !question.correct ? "correct" : selected === false ? "wrong" : "";
  const difficultyLabel = question.difficulty === 1 ? "Grundlage" : question.difficulty === 2 ? "Vertiefung" : "Staatsexamensniveau";
  return <section className={`chapter-quiz ${standalone ? "standalone" : ""}`}><div className="chapter-quiz-head"><div><span className="eyebrow">Richtig oder falsch?</span><small>Frage {questionIndex + 1} von {questions.length} · {difficultyLabel}</small></div><div className="quiz-mini-progress"><span style={{ width: `${((questionIndex + (selected === null ? 0 : 1)) / questions.length) * 100}%` }} /></div></div><h2>{question.statement}</h2><div className="true-false-actions"><button className={trueClass} onClick={() => answer(true)} disabled={selected !== null}>Richtig</button><button className={falseClass} onClick={() => answer(false)} disabled={selected !== null}>Falsch</button></div>{selected !== null && <div className={`quiz-source-answer ${wasCorrect ? "correct" : "wrong"}`}><b>{wasCorrect ? "Richtig beantwortet" : "Falsch beantwortet"}</b><p>{question.source}</p><button onClick={next}>{questionIndex === questions.length - 1 ? "Ergebnis anzeigen" : "Nächste Frage"} →</button></div>}</section>;
}

function QuestionPanel() {
  return <div className="ai-question-panel"><div><span className="eyebrow">Nach dem Lesen</span><h2>Fragen aus diesem Kapitel erstellen</h2><p>Die KI-Funktion wird später ausschließlich den hinterlegten Kapitelinhalt als Grundlage verwenden.</p></div><button className="primary-button" disabled>KI-Fragen erstellen</button></div>;
}

function QuizTraining({ onProgressChange }: { onProgressChange: (progress: QuestionProgress) => void }) {
  return <section className="quiz-page mc-training-page"><div className="section-heading"><div><span className="eyebrow">MC-Training · Schlaganfall</span><h1>Fragen aus deinem Skript</h1><p>Die Fragen aus dem Lesekapitel werden automatisch auch hier bereitgestellt. Antworten aus beiden Bereichen fließen in dieselbe Statistik ein. Der Schwierigkeitsgrad steigt zum Ende hin an.</p></div><div className="source-badge"><b>18</b><span>Fragen</span></div></div><TrueFalseQuiz standalone onProgressChange={onProgressChange} /><div className="mc-training-rule"><span>3×</span><p><b>Dreistufiger Lernstand</b>Richtig beantwortete Fragen steigen auf 33 %, 67 % und 100 %. Eine falsche Antwort setzt nur die betreffende Frage auf 0 % zurück.</p></div></section>;
}

function ProgressView({ progress }: { progress: QuestionProgress }) {
  const summary = summarizeQuestionProgress(progress);
  return <section className="page-section progress-page"><div className="section-heading"><div><span className="eyebrow">Dein Lernstand</span><h1>Jede Frage wird wirklich sicher.</h1><p>Das System bewertet jede Frage einzeln und bleibt für beliebig viele spätere Fragen erweiterbar.</p></div></div><div className="progress-overview"><div className="progress-ring" style={{ "--progress": `${summary.average * 3.6}deg` } as React.CSSProperties}><div><b>{summary.average}%</b><span>Gesamt</span></div></div><div><span className="eyebrow">Fragensicherheit</span><h2>{summary.total ? `${summary.mastered} Fragen sicher beherrscht` : "Noch keine Fragen vorhanden."}</h2><p>Der Gesamtwert wächst automatisch, sobald Fragen aus deinen Materialien angelegt und beantwortet werden.</p><div className="progress-track large"><span style={{ width: `${summary.average}%` }} /></div></div></div><div className="mastery-grid"><article className="wrong"><span>0%</span><h3>Falsch / Neu</h3><b>{summary.wrong}</b><p>Eine falsche Antwort setzt die einzelne Frage immer hierhin zurück.</p></article><article><span>33%</span><h3>1× richtig</h3><b>{Object.values(progress).filter((item) => item.correctCount === 1).length}</b><p>Einmal korrekt beantwortet.</p></article><article><span>67%</span><h3>2× richtig</h3><b>{Object.values(progress).filter((item) => item.correctCount === 2).length}</b><p>Zweimal korrekt beantwortet.</p></article><article className="mastered"><span>100%</span><h3>3× richtig</h3><b>{summary.mastered}</b><p>Dreimal korrekt – die Frage gilt als sicher.</p></article></div><div className="progress-rule"><span>↺</span><div><b>Falsch überschreibt den bisherigen Stand</b><p>Wird eine Frage falsch beantwortet, fällt nur diese Frage unabhängig von ihrem vorherigen Stand sofort auf 0 % zurück.</p></div></div></section>;
}
