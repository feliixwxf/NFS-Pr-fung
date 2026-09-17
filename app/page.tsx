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

export default function Home() {
  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [view, setView] = useState<View>("start");
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [questionProgress, setQuestionProgress] = useState<QuestionProgress>({});

  useEffect(() => {
    setSignedIn(localStorage.getItem("notsan-access") === "granted");
    setQuestionProgress(readQuestionProgress());
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
        {view === "oral" && <OralLibrary selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} onProgressChange={setQuestionProgress} />}
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
    <div className="stats-grid"><article><span className="stat-icon orange">◫</span><div><small>Prüfungsthemen</small><b>50 <em>angelegt</em></b></div></article><article><span className="stat-icon blue">✓</span><div><small>Skriptfragen</small><b>12 <em>Schlaganfall</em></b></div></article><article><span className="stat-icon green">↗</span><div><small>Fragensicherheit</small><b>{progress}<em>%</em></b></div></article></div>
    <div className="dashboard-grid"><section><div className="block-title"><div><span className="eyebrow">Deine Bereiche</span><h2>Prüfungsvorbereitung</h2></div></div><div className="action-cards"><button onClick={() => setView("oral")}><span className="action-icon">◫</span><div><small>50 Kapitelvorlagen</small><h3>Mündliche Themen</h3><p>Jedes Thema enthält bereits die neun vorgegebenen Prüfungsabschnitte.</p><b>Themen öffnen →</b></div></button><button onClick={() => setView("progress")}><span className="action-icon dark">↗</span><div><small>Dreistufig lernen</small><h3>Fortschritt</h3><p>Dreimal richtig bedeutet sicher. Eine falsche Antwort setzt die Frage zurück.</p><b>System ansehen →</b></div></button></div></section><aside className="daily-card empty-daily"><span className="eyebrow">Quelle</span><div className="daily-number">50</div><span className="topic-area">DRK Thüringen</span><h3>Orientierungsliste</h3><p>Die Themenübersicht dient laut Quelldokument zur Orientierung und erhebt keinen Anspruch auf Vollständigkeit.</p><button className="text-button" onClick={() => setView("oral")}>Alle Themen ansehen <span>→</span></button></aside></div>
  </section>;
}

function OralLibrary({ selectedTopic, setSelectedTopic, onProgressChange }: { selectedTopic: number | null; setSelectedTopic: (topic: number | null) => void; onProgressChange: (progress: QuestionProgress) => void }) {
  const [search, setSearch] = useState("");
  const filteredGroups = useMemo(() => topicGroups.map((group) => ({
    ...group,
    entries: group.topicNumbers.map((number) => ({ title: topics[number - 1], number })).filter((topic) => topic.title.toLowerCase().includes(search.toLowerCase())),
  })).filter((group) => group.entries.length > 0), [search]);
  const resultCount = filteredGroups.reduce((sum, group) => sum + group.entries.length, 0);
  if (selectedTopic !== null) return <TopicReader topicNumber={selectedTopic} onBack={() => setSelectedTopic(null)} onProgressChange={onProgressChange} />;

  return <section className="page-section topic-library-page"><div className="section-heading"><div><span className="eyebrow">Mündliche Prüfung · Themenbereich 7</span><h1>Nach Fachbereichen sortiert</h1><p>Herz und Kreislauf zuerst, danach Trauma, geschlechtsspezifische Themen und weitere medizinische Bereiche.</p></div><div className="source-badge"><b>50</b><span>Themen</span></div></div><div className="topic-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Thema suchen …" aria-label="Prüfungsthemen durchsuchen" /><small>{resultCount} Ergebnisse</small></div><div className="grouped-topics">{filteredGroups.map((group) => <section className="topic-group" key={group.name}><div className="topic-group-heading"><span>{group.icon}</span><div><h2>{group.name}</h2><p>{group.entries.length} {group.entries.length === 1 ? "Thema" : "Themen"}</p></div></div><div className="topic-name-grid">{group.entries.map((topic) => <button className={topic.number === 4 ? "topic-ready" : ""} key={topic.number} onClick={() => setSelectedTopic(topic.number - 1)}><span>{String(topic.number).padStart(2, "0")}</span><div><b>{topic.number === 4 ? "Apoplex (Schlaganfall)" : topic.title}</b><small>{topic.number === 4 ? "Lesekapitel verfügbar · VFA 44" : "Kapitelstruktur angelegt · Inhalt folgt"}</small></div><i>→</i></button>)}</div></section>)}</div><p className="orientation-note">Hinweis der Quelle: Die Themenübersicht dient zur Orientierung und erhebt keinen Anspruch auf Vollständigkeit.</p></section>;
}

function TopicReader({ topicNumber, onBack, onProgressChange }: { topicNumber: number; onBack: () => void; onProgressChange: (progress: QuestionProgress) => void }) {
  const title = topics[topicNumber];
  const [openSections, setOpenSections] = useState<number[]>(chapterSections.map((_, index) => index));
  const toggleSection = (index: number) => setOpenSections((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  const groupName = topicGroups.find((group) => (group.topicNumbers as readonly number[]).includes(topicNumber + 1))?.name;
  const hasContent = topicNumber === 3;
  return <section className="page-section topic-reader"><button className="back-button" onClick={onBack}>← Alle Themen</button><div className={`reader-hero ${hasContent ? "reader-hero-ready" : ""}`}><div><span className="eyebrow light">{groupName} · Thema {String(topicNumber + 1).padStart(2, "0")}</span><h1>{hasContent ? "Apoplex (Schlaganfall)" : title}</h1><p>Zeitfenster laut Themenvorgabe: circa 20 Minuten.</p></div><span className="reader-status">{hasContent ? "Kapitel verfügbar" : "Leere Vorlage"}</span></div>{hasContent ? <ApoplexLesson onProgressChange={onProgressChange} /> : <div className="reader-layout"><div className="reader-sections reading-flow">{chapterSections.map((section, index) => { const isOpen = openSections.includes(index); return <section className={`reader-accordion ${isOpen ? "open" : ""}`} key={section.title}><button className="reader-section-toggle" onClick={() => toggleSection(index)} aria-expanded={isOpen}><div className="reader-section-head"><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{section.title}</h2><p>{section.hint}</p></div></div><i>{isOpen ? "−" : "+"}</i></button>{isOpen && <div className="accordion-content"><div className="material-placeholder"><i>＋</i><span>Noch kein Material hinterlegt</span></div></div>}</section>; })}<section className="vfa-placeholder"><div className="reader-section-head"><span>10</span><div><h2>Verfahrensanweisung Thüringen</h2><p>Passende VFA-Seite am Ende des Kapitels</p></div></div><div className="vfa-drop"><b>VFA 2026/2027</b><span>Die passende Nummer und Seite wird später von dir vorgegeben.</span></div></section><QuestionPanel /></div></div>}</section>;
}

function ChapterHeading({ number, title, kicker }: { number: string; title: string; kicker: string }) {
  return <header className="chapter-heading"><span>{number}</span><div><small>{kicker}</small><h2>{title}</h2></div></header>;
}

function SourceFigure({ src, alt, caption, wide = false }: { src: string; alt: string; caption: string; wide?: boolean }) {
  return <figure className={`source-figure ${wide ? "wide" : ""}`}><img src={src} alt={alt} /><figcaption>{caption}<span>Abbildung aus deiner Vorlage</span></figcaption></figure>;
}

function ApoplexLesson({ onProgressChange }: { onProgressChange: (progress: QuestionProgress) => void }) {
  return <article className="lesson-article">
    <div className="lesson-intro"><p className="lead">Ein Schlaganfall ist ein akut einsetzender neurologischer Ausfall durch eine Minderversorgung von Hirnzellen mit Sauerstoff und Glukose oder durch eine direkte Schädigung des Hirngewebes, zum Beispiel durch eine Blutung.</p><p>Dieses Lesekapitel überträgt den Inhalt deiner bereitgestellten Unterlage in die vorgegebene Prüfungsstruktur. Alle Bereiche sind beim Öffnen vollständig sichtbar.</p></div>

    <section className="lesson-section"><ChapterHeading number="01" kicker="Grundverständnis" title="Definition oder Erklärung" /><div className="lesson-prose"><p>Der Schlaganfall wird in zwei Hauptformen unterschieden:</p><div className="stroke-types"><article><b>80–85 %</b><h3>Ischämischer Schlaganfall</h3><p>Ein Gefäßverschluss führt zur Minderversorgung des betroffenen Hirngewebes. Als Zusammenhänge nennt die Vorlage Atherosklerose, Diabetes mellitus und Embolien.</p></article><article><b>10–15 %</b><h3>Hämorrhagischer Schlaganfall</h3><p>Eine Blutung schädigt oder verdrängt Hirngewebe. Genannt werden Hypertonie, Subarachnoidalblutung, subdurale und epidurale Hämatome sowie spontane Blutungen unter neuen oralen Antikoagulanzien.</p></article></div></div></section>

    <section className="lesson-section"><ChapterHeading number="02" kicker="Anatomie / Physiologie" title="Anatomie und Physiologie" /><div className="lesson-prose script-copy"><p>Unterteilung in Zentral (Gehirn und Rückenmark) und Peripheres Nervensystem (Hirnnerven und Spinalnerven) (12 Hirnnerven und 31 Spinalnerven).</p><p>Unterteilung in somatisches (willkürlich) oder autonomes (unbewusstes Nervensystem).</p><h3>Hirnstamm (wird in 3 Teile untergliedert)</h3><ul className="script-list"><li><b>Verlängertes Mark (Medulla oblongata):</b> Atem-Reflex & Kreislaufzentrum, Willkürmotorik (Weiße Substanz), Übergang zu Rückenmark.</li><li><b>Brücke (Pons):</b> Verbindung zw. Groß & Kleinhirn, hat Hirnnervkerne, Informationsweiterleitung.</li><li><b>Mittelhirn:</b> Steuerung von reflexartigen Bewegungen und steuert Augenmuskeln.</li></ul><h3>Zwischenhirn (Diencephalon)</h3><ul className="script-list"><li><b>Hypothalamus:</b> steuert vegetative und endokrine Vorgänge und Sexualverhalten sowie Hypophyse.</li><li><b>Hypophyse:</b> Hormondrüsen und Funktionssteuerung vieler endokriner Drüsen.</li><li><b>Thalamus:</b> Tor zum Bewusstsein, graue Substanz, Infosammlung – Verschaltung – Verarbeitung.</li></ul><SourceFigure src="/lessons/apoplexie/source-p2-1.png" alt="Kerne des Hypothalamus" caption="Hypothalamus" wide /><h3>Kleinhirn (Cerebellum)</h3><ul className="script-list"><li>Graue Substanz, Aufgabe Gleichgewichtskontrolle / Abstimmung von Bewegungsabläufen.</li><li>Blut-Hirn-Schranke hier niedriger (Alkohol diffundiert durch → daher Koordinationsstörungen).</li></ul><h3>Großhirn (Telencephalon)</h3><ul className="script-list"><li>Ca. 80 % des Gehirns, Mischung aus grauer und weißer Substanz.</li><li>Funktion: Sitz des Bewusstseins / Handeln / Wille / Gedächtnis.</li></ul><SourceFigure src="/lessons/apoplexie/source-p1-1.png" alt="Gehirn mit beschrifteten anatomischen Strukturen" caption="Gehirn" wide /><SourceFigure src="/lessons/apoplexie/source-p2-3.png" alt="Darstellung der Hirnlappen" caption="Hirnlappen" wide /><h3>Hypothalamus</h3><p>Der Hypothalamus liegt direkt unterhalb des Thalamus und bildet den Boden und den unteren Teil der seitlichen Wand des dritten Ventrikels. Seitlich vom Hypothalamus befindet sich die Capsula interna, und nach unten hin verschmilzt er mit dem Tegmentum mesencephali.</p><p>Der Hypothalamus ist ein lebenswichtiger Teil des Diencephalons (Zwischenhirns) und fungiert als oberstes Regulationszentrum für eine Vielzahl vegetativer und endokriner Prozesse im Körper. Zu seinen Aufgaben gehören die Steuerung der Atmung, des Kreislaufs, der Körpertemperatur, des Sexualverhaltens sowie der Flüssigkeits- und Nahrungsaufnahme.</p><h3>Blutversorgung des Gehirns</h3><p>Das Gehirn hat einen hohen Energie- und Sauerstoffbedarf und reagiert äußerst empfindlich auf Unterbrechungen der Blutversorgung. Innerhalb von Sekunden können reversible Funktionsausfälle auftreten, während irreversible Schäden bereits nach wenigen Minuten auftreten können.</p><p>Das Gehirn wird von zwei Hauptarterien pro Gehirnhälfte versorgt:</p><ul className="script-list"><li>Innere Halsschlagader (A. carotis interna)</li><li>Wirbelarterie (A. vertebralis)</li></ul><SourceFigure src="/lessons/apoplexie/source-p2-2.png" alt="Gehirn sagittal mit Arterien" caption="Gehirn, sagittal mit Arterien" wide /><h3>A. cerebri posterior (Hintere Großhirnarterien)</h3><p>Im Bereich des Mittelhirns teilt sich die A. basilaris in zwei große Aa. cerebri posteriores auf. Jede dieser Arterien sendet einen Ast zur A. carotis interna derselben Seite. Die A. cerebri posterior versorgt den Hinterhauptlappen des Gehirns.</p><h3>A. cerebri anterior (Vordere Großhirnarterie)</h3><p>Die A. carotis interna gibt eine kleinere A. cerebri anterior ab. Diese Arterie verzweigt sich in der Tiefe zwischen den beiden Hemisphären. Die A. cerebri anterior versorgt die Innenseite des Gehirns.</p><p>Diese Arterien sind untereinander verbunden und bilden den geschlossenen Arterienkreis namens Circulus arteriosus cerebri (Willisii).</p><SourceFigure src="/lessons/apoplexie/source-p2-5.png" alt="Arteria carotis und ihre Äste" caption="A. carotis und ihre Äste" wide /><h3>Circulus arteriosus cerebri</h3><p>Die anatomischen Bestandteile des Circulus arteriosus cerebri sind wie folgt, wenn man sie von anterior (vorne) nach posterior (hinten) betrachtet:</p><ol className="script-numbered"><li>A. communicans anterior (vordere Kommunikationsarterie) – ein unpaares Gefäß, das die linke und rechte Arteria cerebri anterior miteinander verbindet.</li><li>A. cerebri anterior (vordere Großhirnarterien) – jeweils links und rechts. Diese Arterien versorgen den vorderen Teil des Gehirns.</li><li>A. carotis interna (innere Halsschlagader) – jeweils links und rechts. Diese Arterien sind die Fortsetzung der Arteria carotis externa und versorgen das Gehirn mit Blut.</li><li>A. communicans posterior (hintere Kommunikationsarterie) – jeweils links und rechts. Diese Arterien verbinden die vorderen und hinteren Teile des Circulus arteriosus cerebri.</li><li>A. cerebri posterior (hintere Großhirnarterien) – jeweils links und rechts. Diese Arterien entspringen aus der Arteria basilaris und versorgen den hinteren Teil des Gehirns.</li></ol><p>Der Circulus arteriosus cerebri, auch bekannt als Willis-Kreislauf, ist ein arterieller Gefäßring an der Basis des Gehirns, der dazu dient, die Blutzufuhr zum Gehirn sicherzustellen, insbesondere in Fällen, in denen eine der Hauptarterien blockiert oder eingeschränkt ist.</p><p>Der Circulus arteriosus cerebri bildet einen wichtigen Schutzmechanismus, um das Gehirn vor einer möglichen Unterversorgung mit Blut und Sauerstoff zu bewahren.</p><SourceFigure src="/lessons/apoplexie/source-p3-1.png" alt="Circulus arteriosus cerebri" caption="Circulus arteriosus cerebri" wide /><h3>Venöser Blutabfluss</h3><p>Innerhalb der Dura befinden sich die venösen Blutleiter oder Sinus, die sauerstoffarmes Blut aus dem Gehirn transportieren. Dieses Blut wird über die innere Drosselvene (V. jugularis interna) in die obere Hohlvene geleitet. Die venösen Blutleiter bestehen aus der Dura und ihrem Endothel, haben jedoch keine eigene Muskelschicht.</p><p>Die Hirn- und Rückenmarkshäute, bestehend aus Dura (harte Hirnhaut), Arachnoidea (Spinnwebshaut) und Pia (weiche Hirnhaut), setzen sich nahtlos über das große Hinterhauptloch in die Schädelhöhle fort. Die Dura ist eine robuste, pergamentartige Schicht, die die Innenseite des Schädels ohne Zwischenraum auskleidet. Sie zieht in Form einer tiefen Falte namens Falx cerebri (Hirnsichel) in die Furche zwischen den linken und rechten Großhirnhemisphären hinein.</p><p>Wichtige venöse Blutleiter innerhalb der Dura sind:</p><ul className="script-list"><li>Sinus sagittalis superior (oberer Längsleiter), der sich am Oberrand der Falx cerebri befindet.</li><li>Sinus sagittalis inferior (unterer Längsleiter), der den unteren Abschluss der Falx cerebri bildet.</li><li>Sinus rectus (gerader Blutleiter), der sich entlang der „Firststange“ des Tentorium cerebelli erstreckt.</li><li>Sinus transversi (quere Blutleiter), die am Unterrand des Tentorium cerebelli wie eine Dachrinne liegen.</li><li>Sinus sigmoideus (Sigma-Sinus), ein siphonförmiger Leiter, der das Blut aus den zuvor genannten Blutleitern aufnimmt.</li><li>Sinus cavernosus (höhlenartiger Leiter), der seitlich des Türkensattels (Sella turcica) im Boden des Schädels liegt.</li></ul><SourceFigure src="/lessons/apoplexie/source-p3-2.png" alt="Gehirn sagittal mit Venen" caption="Gehirn, sagittal mit Venen" wide /></div></section>

    <section className="lesson-section"><ChapterHeading number="03" kicker="Pathophysiologie" title="Ursachen, Entstehung und Pathophysiologie" /><div className="lesson-prose script-copy"><h3>Ischämischer Schlaganfall (häufig)</h3><p>Meist Thrombus / Embolus → Gefäßverschluss → verminderte Perfusion → Infarktgebiet.</p><p>Glukosemangel → Funktionsstörung der ATP-abhängigen Ionenpumpe.</p><ul className="script-list"><li>Kalziumeinstrom in Hirnzellen → intrazelluläre Stoffwechselstörung (Bildung von freien Sauerstoffradikalen) → Schädigung der Zellstruktur.</li><li>Natrium-Wassereinstrom in Hirnzellen → Hirnödem.</li></ul><p>Ursache oft: Atherosklerose, Vorhofflimmern, Gefäßstenosen.</p><h3>Hämorrhagischer Schlaganfall</h3><p>Gefäßruptur, z. B. bei Hypertonus, Aneurysma, SHT, Drogenkonsum → Blutung verdrängt Hirngewebe, Hirndruckanstieg → Einklemmungsgefahr → Cushing-Triade beachten.</p><p>ICB: ins Hirngewebe, SAB zwischen Pia Mater und Arachnoidea, subdural → Dura mater und Arachnoidea, epidural zwischen Schädelknochen und Dura mater.</p><aside className="knowledge-note"><b>TIA (transitorische ischämische Attacke)</b><p>Vorübergehende Durchblutungsstörung, Symptome bilden sich komplett zurück, meist innerhalb Minuten – aber Notfall! → Stroke Unit notwendig.</p></aside></div></section>

    <section className="lesson-section red-flag-section"><ChapterHeading number="04" kicker="Welche Symptome stützen Ihre Arbeitsdiagnose?" title="Symptome" /><div className="lesson-prose script-copy"><ul className="symptom-grid"><li>Hemiparese / Hemiplegie (Gesicht, Arm, Bein)</li><li>Fazialisparese (hängender Mundwinkel)</li><li>Sprachstörungen: Aphasie, Sensibilitätsstörungen</li><li>Sehstörungen: Gesichtsfelddefekte, Doppelbilder</li><li>Gangunsicherheit, Schwindel</li><li>Bewusstseinsstörung möglich</li></ul><aside className="red-flags"><span>!</span><div><small>Red Flags aus dem Skript</small><h3>BEFAST mind. 1 positiv</h3><p>TIA: Symptome bilden sich komplett zurück, meist innerhalb Minuten – aber Notfall!</p><b>Hirndruckanstieg → Einklemmungsgefahr → Cushing-Triade beachten.</b></div></aside></div></section>

    <section className="lesson-section"><ChapterHeading number="05" kicker="Welche Gefahren und Komplikationen gibt es bezogen auf das Notfallbild?" title="Komplikationen und Gefahren" /><div className="lesson-prose script-copy"><ul className="script-list"><li>Hirnödem, Hirndrucksteigerung, Hirneinklemmung → Atem- und Kreislaufversagen.</li><li>Aspiration bei Bewusstseinsstörungen.</li><li>Krampfanfälle (v. a. bei Blutung).</li><li>Langfristig: bleibende Lähmungen, Sprachstörungen, vaskuläre Demenz.</li></ul></div></section>

    <section className="lesson-section"><ChapterHeading number="06" kicker="Welche Einsatzmaterialien nehmen Sie mit?" title="Einsatzmaterialien" /><div className="lesson-prose"><div className="material-chips"><span>EKG</span><span>Rucksack</span><span>Sauerstoff / Medumat</span><span>Medikamente</span><span>Absaugung</span><span>BZ</span><span>Zugang mind. Größe 18 G</span></div></div></section>

    <section className="lesson-section"><ChapterHeading number="07" kicker="Welche Erstmaßnahmen treffen Sie?" title="Erstmaßnahmen und Diagnostik" /><div className="lesson-prose"><div className="material-chips"><span>Kritisch / nicht kritisch</span><span>Meist hämodynamisch stabil</span><span>BEFAST</span><span>Lagerung</span><span>SAMPERS</span><span>NEF-Nachforderung</span><span>BZ</span><span>Neurologische Tests durchführen</span></div></div></section>

    <section className="lesson-section"><ChapterHeading number="08" kicker="Differenzialdiagnosen und Entscheidungsfindung" title="Differenzialdiagnosen" /><div className="lesson-prose"><div className="differential-grid"><span>Hypoglykämie</span><span>Epileptischer Anfall / postiktaler Zustand</span><span>Intrakranielle Blutung anderer Ursache, SHT</span><span>Meningitis / Enzephalitis (oft mit Fieber, Kopfschmerz, Meningismus)</span><span>Migräne mit Aura</span><span>Intoxikationen, metabolische Entgleisungen</span></div></div></section>

    <section className="lesson-section"><ChapterHeading number="09" kicker="Weitere Maßnahmen" title="Weitere Maßnahmen" /><div className="lesson-prose script-copy"><ul className="script-list"><li>Blutabnahme, RTH? Blutdrucksenkung nach VFA-Schlaganfall (15 % bei &gt; 220 / &gt; 120), Blutzucker reevaluieren.</li><li>Lagerung 30 Grad OKH, Versorgungszeit &lt; 20 min, Prähospitalzeit &lt; 60 min.</li><li>Monitoring während Fahrt, telefonische Anmeldung.</li></ul></div></section>

    <section className="lesson-section vfa-chapter"><ChapterHeading number="10" kicker="Originalalgorithmus" title="VFA Thüringen 2026/2027" /><div className="lesson-prose"><p>Verfahrensanweisung 44 „Schlaganfall Erwachsene“. Die Abbildung stammt direkt aus der von dir bereitgestellten Thüringer VFA.</p><figure className="vfa-page"><img src="/lessons/apoplexie/vfa-schlaganfall-thueringen-2026-2027.png" alt="Verfahrensanweisung 44 Schlaganfall Erwachsene aus Thüringen 2026/2027" /><figcaption>VFA 44 · Schlaganfall Erwachsene · Version 2026/27</figcaption></figure></div></section>

    <TrueFalseQuiz onProgressChange={onProgressChange} />
    <p className="lesson-source">Lerninhalt: „Apoplexie (Schlaganfall) 2.pdf“ · VFA-Abbildung: Thüringer Verfahrensanweisungen 2026/2027. Die Darstellung dient der Prüfungsvorbereitung und ersetzt keine lokalen Vorgaben oder medizinische Rücksprache.</p>
  </article>;
}

type TrueFalseQuestion = { id: string; statement: string; correct: boolean; source: string };

const apoplexTrueFalseQuestions: TrueFalseQuestion[] = [
  { id: "apoplex-tf-01", statement: "Das Nervensystem wird in ein zentrales und ein peripheres Nervensystem unterteilt.", correct: true, source: "Unterteilung in Zentral (Gehirn und Rückenmark) und Peripheres Nervensystem (Hirnnerven und Spinalnerven)." },
  { id: "apoplex-tf-02", statement: "Zum peripheren Nervensystem gehören 12 Hirnnerven und 31 Spinalnerven.", correct: true, source: "12 Hirnnerven und 31 Spinalnerven." },
  { id: "apoplex-tf-03", statement: "Das Kleinhirn ist laut Skript für die Gleichgewichtskontrolle und die Abstimmung von Bewegungsabläufen zuständig.", correct: true, source: "Aufgabe Gleichgewichtskontrolle / Abstimmung von Bewegungsabläufen." },
  { id: "apoplex-tf-04", statement: "Das Gehirn hat einen niedrigen Energie- und Sauerstoffbedarf.", correct: false, source: "Das Gehirn hat einen hohen Energie- und Sauerstoffbedarf." },
  { id: "apoplex-tf-05", statement: "Ein ischämischer Schlaganfall entsteht im Skript meist durch Thrombus oder Embolus mit Gefäßverschluss.", correct: true, source: "Meist Thrombus / Embolus → Gefäßverschluss → verminderte Perfusion → Infarktgebiet." },
  { id: "apoplex-tf-06", statement: "Beim hämorrhagischen Schlaganfall kann ein Hirndruckanstieg zur Einklemmungsgefahr führen.", correct: true, source: "Blutung verdrängt Hirngewebe, Hirndruckanstieg → Einklemmungsgefahr." },
  { id: "apoplex-tf-07", statement: "Eine TIA ist laut Skript kein Notfall, wenn sich die Symptome komplett zurückbilden.", correct: false, source: "Symptome bilden sich komplett zurück, meist innerhalb Minuten – aber Notfall! → Stroke Unit notwendig." },
  { id: "apoplex-tf-08", statement: "Eine Bewusstseinsstörung ist beim Schlaganfall ausgeschlossen.", correct: false, source: "Bewusstseinsstörung möglich." },
  { id: "apoplex-tf-09", statement: "Mindestens ein positiver BEFAST-Befund stützt die Arbeitsdiagnose.", correct: true, source: "BEFAST mind. 1 positiv." },
  { id: "apoplex-tf-10", statement: "Ein Zugang soll laut Skript mindestens Größe 18 G haben.", correct: true, source: "Zugang mind. Größe 18 G." },
  { id: "apoplex-tf-11", statement: "Hypoglykämie gehört zu den genannten Differenzialdiagnosen.", correct: true, source: "Differenzialdiagnosen: Hypoglykämie." },
  { id: "apoplex-tf-12", statement: "Das Skript nennt eine Lagerung mit 30 Grad Oberkörperhochlagerung.", correct: true, source: "Lagerung 30 Grad OKH." },
];

function shuffledQuestions(previous: TrueFalseQuestion[] = []) {
  const next = [...apoplexTrueFalseQuestions];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
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
  return <section className={`chapter-quiz ${standalone ? "standalone" : ""}`}><div className="chapter-quiz-head"><div><span className="eyebrow">Richtig oder falsch?</span><small>Frage {questionIndex + 1} von {questions.length}</small></div><div className="quiz-mini-progress"><span style={{ width: `${((questionIndex + (selected === null ? 0 : 1)) / questions.length) * 100}%` }} /></div></div><h2>{question.statement}</h2><div className="true-false-actions"><button className={selected === true ? (question.correct ? "correct" : "wrong") : ""} onClick={() => answer(true)} disabled={selected !== null}>Richtig</button><button className={selected === false ? (!question.correct ? "correct" : "wrong") : ""} onClick={() => answer(false)} disabled={selected !== null}>Falsch</button></div>{selected !== null && <div className={`quiz-source-answer ${wasCorrect ? "correct" : "wrong"}`}><b>{wasCorrect ? "Richtig beantwortet" : "Falsch beantwortet"}</b><p>{question.source}</p><button onClick={next}>{questionIndex === questions.length - 1 ? "Ergebnis anzeigen" : "Nächste Frage"} →</button></div>}</section>;
}

function QuestionPanel() {
  return <div className="ai-question-panel"><div><span className="eyebrow">Nach dem Lesen</span><h2>Fragen aus diesem Kapitel erstellen</h2><p>Die KI-Funktion wird später ausschließlich den hinterlegten Kapitelinhalt als Grundlage verwenden.</p></div><button className="primary-button" disabled>KI-Fragen erstellen</button></div>;
}

function QuizTraining({ onProgressChange }: { onProgressChange: (progress: QuestionProgress) => void }) {
  return <section className="quiz-page mc-training-page"><div className="section-heading"><div><span className="eyebrow">MC-Training · Schlaganfall</span><h1>Fragen aus deinem Skript</h1><p>Die Fragen aus dem Lesekapitel werden automatisch auch hier bereitgestellt. Antworten aus beiden Bereichen fließen in dieselbe Statistik ein.</p></div><div className="source-badge"><b>12</b><span>Fragen</span></div></div><TrueFalseQuiz standalone onProgressChange={onProgressChange} /><div className="mc-training-rule"><span>3×</span><p><b>Dreistufiger Lernstand</b>Richtig beantwortete Fragen steigen auf 33 %, 67 % und 100 %. Eine falsche Antwort setzt nur die betreffende Frage auf 0 % zurück.</p></div></section>;
}

function ProgressView({ progress }: { progress: QuestionProgress }) {
  const summary = summarizeQuestionProgress(progress);
  return <section className="page-section progress-page"><div className="section-heading"><div><span className="eyebrow">Dein Lernstand</span><h1>Jede Frage wird wirklich sicher.</h1><p>Das System bewertet jede Frage einzeln und bleibt für beliebig viele spätere Fragen erweiterbar.</p></div></div><div className="progress-overview"><div className="progress-ring" style={{ "--progress": `${summary.average * 3.6}deg` } as React.CSSProperties}><div><b>{summary.average}%</b><span>Gesamt</span></div></div><div><span className="eyebrow">Fragensicherheit</span><h2>{summary.total ? `${summary.mastered} Fragen sicher beherrscht` : "Noch keine Fragen vorhanden."}</h2><p>Der Gesamtwert wächst automatisch, sobald Fragen aus deinen Materialien angelegt und beantwortet werden.</p><div className="progress-track large"><span style={{ width: `${summary.average}%` }} /></div></div></div><div className="mastery-grid"><article className="wrong"><span>0%</span><h3>Falsch / Neu</h3><b>{summary.wrong}</b><p>Eine falsche Antwort setzt die einzelne Frage immer hierhin zurück.</p></article><article><span>33%</span><h3>1× richtig</h3><b>{Object.values(progress).filter((item) => item.correctCount === 1).length}</b><p>Einmal korrekt beantwortet.</p></article><article><span>67%</span><h3>2× richtig</h3><b>{Object.values(progress).filter((item) => item.correctCount === 2).length}</b><p>Zweimal korrekt beantwortet.</p></article><article className="mastered"><span>100%</span><h3>3× richtig</h3><b>{summary.mastered}</b><p>Dreimal korrekt – die Frage gilt als sicher.</p></article></div><div className="progress-rule"><span>↺</span><div><b>Falsch überschreibt den bisherigen Stand</b><p>Wird eine Frage falsch beantwortet, fällt nur diese Frage unabhängig von ihrem vorherigen Stand sofort auf 0 % zurück.</p></div></div></section>;
}
