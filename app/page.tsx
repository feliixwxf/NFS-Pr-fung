"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { QuestionProgress, readQuestionProgress, summarizeQuestionProgress } from "./lib/questionProgress";

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
        {view === "oral" && <OralLibrary selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />}
        {view === "quiz" && <QuizPlaceholder />}
        {view === "progress" && <ProgressView progress={questionProgress} />}
        <footer><span>NotSan Prüfung · Dein Lernbegleiter</span><span>Themenliste nach DRK-Bildungswerk Thüringen · Inhalte folgen aus deinen Materialien.</span></footer>
      </main>
      <nav className="mobile-nav" aria-label="Mobile Navigation">{nav.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => changeView(item.id)}><span>{item.icon}</span>{item.label}</button>)}</nav>
    </div>
  );
}

function Dashboard({ setView, progress }: { setView: (view: View) => void; progress: number }) {
  return <section className="dashboard"><div className="welcome"><div><span className="eyebrow light">Mündliche Abschlussprüfung</span><h1>50 Themen. Eine klare Struktur.</h1><p>Alle vorgegebenen Notfallbilder sind angelegt. Die Fachinhalte ergänzen wir später ausschließlich aus deinen Materialien.</p><div className="hero-actions"><button className="light-button" onClick={() => setView("oral")}>Themen ansehen <span>→</span></button></div></div><div className="hero-stat"><div><b>{progress}%</b><span>Fragensicherheit</span></div></div></div>
    <div className="stats-grid"><article><span className="stat-icon orange">◫</span><div><small>Prüfungsthemen</small><b>50 <em>angelegt</em></b></div></article><article><span className="stat-icon blue">✓</span><div><small>MC-Fragen</small><b>0 <em>Material folgt</em></b></div></article><article><span className="stat-icon green">↗</span><div><small>Fragensicherheit</small><b>{progress}<em>%</em></b></div></article></div>
    <div className="dashboard-grid"><section><div className="block-title"><div><span className="eyebrow">Deine Bereiche</span><h2>Prüfungsvorbereitung</h2></div></div><div className="action-cards"><button onClick={() => setView("oral")}><span className="action-icon">◫</span><div><small>50 Kapitelvorlagen</small><h3>Mündliche Themen</h3><p>Jedes Thema enthält bereits die neun vorgegebenen Prüfungsabschnitte.</p><b>Themen öffnen →</b></div></button><button onClick={() => setView("progress")}><span className="action-icon dark">↗</span><div><small>Dreistufig lernen</small><h3>Fortschritt</h3><p>Dreimal richtig bedeutet sicher. Eine falsche Antwort setzt die Frage zurück.</p><b>System ansehen →</b></div></button></div></section><aside className="daily-card empty-daily"><span className="eyebrow">Quelle</span><div className="daily-number">50</div><span className="topic-area">DRK Thüringen</span><h3>Orientierungsliste</h3><p>Die Themenübersicht dient laut Quelldokument zur Orientierung und erhebt keinen Anspruch auf Vollständigkeit.</p><button className="text-button" onClick={() => setView("oral")}>Alle Themen ansehen <span>→</span></button></aside></div>
  </section>;
}

function OralLibrary({ selectedTopic, setSelectedTopic }: { selectedTopic: number | null; setSelectedTopic: (topic: number | null) => void }) {
  const [search, setSearch] = useState("");
  const filteredGroups = useMemo(() => topicGroups.map((group) => ({
    ...group,
    entries: group.topicNumbers.map((number) => ({ title: topics[number - 1], number })).filter((topic) => topic.title.toLowerCase().includes(search.toLowerCase())),
  })).filter((group) => group.entries.length > 0), [search]);
  const resultCount = filteredGroups.reduce((sum, group) => sum + group.entries.length, 0);
  if (selectedTopic !== null) return <TopicReader topicNumber={selectedTopic} onBack={() => setSelectedTopic(null)} />;

  return <section className="page-section topic-library-page"><div className="section-heading"><div><span className="eyebrow">Mündliche Prüfung · Themenbereich 7</span><h1>Nach Fachbereichen sortiert</h1><p>Herz und Kreislauf zuerst, danach Trauma, geschlechtsspezifische Themen und weitere medizinische Bereiche.</p></div><div className="source-badge"><b>50</b><span>Themen</span></div></div><div className="topic-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Thema suchen …" aria-label="Prüfungsthemen durchsuchen" /><small>{resultCount} Ergebnisse</small></div><div className="grouped-topics">{filteredGroups.map((group) => <section className="topic-group" key={group.name}><div className="topic-group-heading"><span>{group.icon}</span><div><h2>{group.name}</h2><p>{group.entries.length} {group.entries.length === 1 ? "Thema" : "Themen"}</p></div></div><div className="topic-name-grid">{group.entries.map((topic) => <button className={topic.number === 4 ? "topic-ready" : ""} key={topic.number} onClick={() => setSelectedTopic(topic.number - 1)}><span>{String(topic.number).padStart(2, "0")}</span><div><b>{topic.number === 4 ? "Apoplex (Schlaganfall)" : topic.title}</b><small>{topic.number === 4 ? "Lesekapitel verfügbar · VFA 44" : "Kapitelstruktur angelegt · Inhalt folgt"}</small></div><i>→</i></button>)}</div></section>)}</div><p className="orientation-note">Hinweis der Quelle: Die Themenübersicht dient zur Orientierung und erhebt keinen Anspruch auf Vollständigkeit.</p></section>;
}

function TopicReader({ topicNumber, onBack }: { topicNumber: number; onBack: () => void }) {
  const title = topics[topicNumber];
  const [openSections, setOpenSections] = useState<number[]>(chapterSections.map((_, index) => index));
  const toggleSection = (index: number) => setOpenSections((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  const groupName = topicGroups.find((group) => (group.topicNumbers as readonly number[]).includes(topicNumber + 1))?.name;
  const hasContent = topicNumber === 3;
  return <section className="page-section topic-reader"><button className="back-button" onClick={onBack}>← Alle Themen</button><div className={`reader-hero ${hasContent ? "reader-hero-ready" : ""}`}><div><span className="eyebrow light">{groupName} · Thema {String(topicNumber + 1).padStart(2, "0")}</span><h1>{hasContent ? "Apoplex (Schlaganfall)" : title}</h1><p>Zeitfenster laut Themenvorgabe: circa 20 Minuten.</p></div><span className="reader-status">{hasContent ? "Kapitel verfügbar" : "Leere Vorlage"}</span></div>{hasContent ? <ApoplexLesson /> : <div className="reader-layout"><div className="reader-sections reading-flow">{chapterSections.map((section, index) => { const isOpen = openSections.includes(index); return <section className={`reader-accordion ${isOpen ? "open" : ""}`} key={section.title}><button className="reader-section-toggle" onClick={() => toggleSection(index)} aria-expanded={isOpen}><div className="reader-section-head"><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{section.title}</h2><p>{section.hint}</p></div></div><i>{isOpen ? "−" : "+"}</i></button>{isOpen && <div className="accordion-content"><div className="material-placeholder"><i>＋</i><span>Noch kein Material hinterlegt</span></div></div>}</section>; })}<section className="vfa-placeholder"><div className="reader-section-head"><span>10</span><div><h2>Verfahrensanweisung Thüringen</h2><p>Passende VFA-Seite am Ende des Kapitels</p></div></div><div className="vfa-drop"><b>VFA 2026/2027</b><span>Die passende Nummer und Seite wird später von dir vorgegeben.</span></div></section><QuestionPanel /></div></div>}</section>;
}

function ChapterHeading({ number, title, kicker }: { number: string; title: string; kicker: string }) {
  return <header className="chapter-heading"><span>{number}</span><div><small>{kicker}</small><h2>{title}</h2></div></header>;
}

function SourceFigure({ src, alt, caption, wide = false }: { src: string; alt: string; caption: string; wide?: boolean }) {
  return <figure className={`source-figure ${wide ? "wide" : ""}`}><img src={src} alt={alt} /><figcaption>{caption}<span>Abbildung aus deiner Vorlage</span></figcaption></figure>;
}

function ApoplexLesson() {
  return <article className="lesson-article">
    <div className="lesson-intro"><p className="lead">Ein Schlaganfall ist ein akut einsetzender neurologischer Ausfall durch eine Minderversorgung von Hirnzellen mit Sauerstoff und Glukose oder durch eine direkte Schädigung des Hirngewebes, zum Beispiel durch eine Blutung.</p><p>Dieses Lesekapitel überträgt den Inhalt deiner bereitgestellten Unterlage in die vorgegebene Prüfungsstruktur. Alle Bereiche sind beim Öffnen vollständig sichtbar.</p></div>

    <section className="lesson-section"><ChapterHeading number="01" kicker="Grundverständnis" title="Definition oder Erklärung" /><div className="lesson-prose"><p>Der Schlaganfall wird in zwei Hauptformen unterschieden:</p><div className="stroke-types"><article><b>80–85 %</b><h3>Ischämischer Schlaganfall</h3><p>Ein Gefäßverschluss führt zur Minderversorgung des betroffenen Hirngewebes. Als Zusammenhänge nennt die Vorlage Atherosklerose, Diabetes mellitus und Embolien.</p></article><article><b>10–15 %</b><h3>Hämorrhagischer Schlaganfall</h3><p>Eine Blutung schädigt oder verdrängt Hirngewebe. Genannt werden Hypertonie, Subarachnoidalblutung, subdurale und epidurale Hämatome sowie spontane Blutungen unter neuen oralen Antikoagulanzien.</p></article></div></div></section>

    <section className="lesson-section"><ChapterHeading number="02" kicker="Vom Aufbau zur Funktion" title="Anatomie und Physiologie" /><div className="lesson-prose"><p>Das Nervensystem gliedert sich in das zentrale Nervensystem mit Gehirn und Rückenmark sowie das periphere Nervensystem mit Hirn- und Spinalnerven. Die Vorlage unterscheidet außerdem das willkürliche somatische vom unbewusst arbeitenden vegetativen Nervensystem.</p><SourceFigure src="/lessons/apoplexie/source-p1-1.png" alt="Sagittaler Schnitt durch das Gehirn mit beschrifteten Hirnabschnitten" caption="Orientierung im zentralen Nervensystem und in den Hirnabschnitten" wide /><div className="reading-columns"><div><h3>Hirnstamm</h3><p>Medulla oblongata, Pons und Mittelhirn übernehmen unter anderem Aufgaben der Atem- und Kreislaufregulation, der Reflexbewegungen sowie der Verbindung und Informationsübertragung zwischen Groß- und Kleinhirn.</p></div><div><h3>Zwischenhirn</h3><p>Hypothalamus und Hypophyse stehen in engem Zusammenhang mit vegetativer, hormoneller und sexueller Regulation. Der Thalamus wird in der Vorlage als „Tor zum Bewusstsein“ beschrieben.</p></div><div><h3>Kleinhirn</h3><p>Das Kleinhirn ist an Gleichgewicht und Bewegungskoordination beteiligt. Die Unterlage stellt außerdem den Zusammenhang zwischen Alkoholdiffusion und Koordinationsstörungen her.</p></div><div><h3>Großhirn</h3><p>Das Großhirn macht etwa 80 % des Gehirns aus. Es wird mit Bewusstsein, Handlungen, Willen und Gedächtnis in Verbindung gebracht.</p></div></div><SourceFigure src="/lessons/apoplexie/source-p2-3.png" alt="Grafische Darstellung der Hirnlappen und ihrer Funktionen" caption="Hirnlappen und funktionelle Zuordnung" wide /><p>Das Gehirn besitzt einen hohen Energie- und Sauerstoffbedarf. Bereits nach Sekunden können reversible Ausfälle auftreten, nach Minuten drohen irreversible Schäden. Die arterielle Versorgung erfolgt über die Arteria carotis interna und die Arteria vertebralis. Vorderer und hinterer Kreislauf sind über den Circulus arteriosus cerebri verbunden.</p><div className="figure-grid"><SourceFigure src="/lessons/apoplexie/source-p2-5.png" alt="Darstellung der Arteria carotis und ihrer Äste" caption="Arteria carotis und ihre Äste" /><SourceFigure src="/lessons/apoplexie/source-p3-1.png" alt="Darstellung des Circulus arteriosus cerebri" caption="Circulus arteriosus cerebri" /></div><SourceFigure src="/lessons/apoplexie/source-p3-2.png" alt="Venöser Abfluss des Gehirns im Sagittalschnitt" caption="Venöser Abfluss des Gehirns" wide /></div></section>

    <section className="lesson-section"><ChapterHeading number="03" kicker="Entstehungswege" title="Ursachen, Entstehung und Pathophysiologie" /><div className="lesson-prose"><div className="pathway"><span>Ischämisch</span><p><b>Thrombus oder Embolus</b> → Gefäßverschluss → Minderdurchblutung → Infarkt. Der Glukosemangel führt zu einer Störung der ATP-abhängigen Pumpen. Kalziumeinstrom und freie Sauerstoffradikale schädigen Zellen; Natrium- und Wassereinstrom fördern ein Ödem. Als Ursachen nennt die Vorlage Atherosklerose, Vorhofflimmern und Stenosen.</p></div><div className="pathway bleeding"><span>Hämorrhagisch</span><p><b>Gefäßruptur</b>, beispielsweise durch Hypertonie, Aneurysma, Schädel-Hirn-Trauma oder Medikamente. Das Blut verdrängt Gewebe, der Hirndruck steigt und es droht eine Einklemmung. Die Vorlage weist dabei auf die Cushing-Trias hin.</p></div><aside className="knowledge-note"><b>TIA – trotzdem ein Notfall</b><p>Bei der transitorisch ischämischen Attacke bilden sich die Symptome vollständig zurück, meist innerhalb von Minuten. Laut Vorlage ist dennoch eine Versorgung auf einer Stroke Unit erforderlich.</p></aside></div></section>

    <section className="lesson-section red-flag-section"><ChapterHeading number="04" kicker="Arbeitsdiagnose stützen" title="Symptome" /><div className="lesson-prose"><ul className="symptom-grid"><li>Hemiparese oder Hemiplegie von Gesicht, Arm oder Bein</li><li>Fazialisparese beziehungsweise hängender Mundwinkel</li><li>Aphasie oder Sensibilitätsstörung</li><li>Gesichtsfeldausfälle oder Doppelbilder</li><li>Gangunsicherheit oder Schwindel</li><li>Mögliche Bewusstseinsstörung</li></ul><aside className="red-flags"><span>!</span><div><small>Red Flags</small><h3>Zeitkritisch handeln</h3><p>Neu aufgetretenes fokal-neurologisches Defizit, Bewusstseinsstörung, Krampfanfall oder Hinweise auf steigenden Hirndruck und Einklemmung. Auch vollständig rückläufige Beschwerden werden in der Vorlage als Notfall eingeordnet.</p><b>BEFAST: Bereits ein positiver Punkt begründet einen hohen Schlaganfallverdacht.</b></div></aside></div></section>

    <section className="lesson-section"><ChapterHeading number="05" kicker="Risiken erkennen" title="Komplikationen und Gefahren" /><div className="lesson-prose"><ul className="editorial-list"><li><b>Hirnödem und Hirndruckanstieg</b><span>Gefahr einer Einklemmung mit Atem- und Kreislaufversagen.</span></li><li><b>Aspiration</b><span>Insbesondere bei beeinträchtigtem Bewusstsein.</span></li><li><b>Krampfanfälle</b><span>Laut Vorlage besonders im Zusammenhang mit Blutungen.</span></li><li><b>Langzeitfolgen</b><span>Lähmungen, Sprachstörungen und vaskuläre Demenz.</span></li></ul></div></section>

    <section className="lesson-section"><ChapterHeading number="06" kicker="Vor dem Weg zum Patienten" title="Einsatzmaterialien" /><div className="lesson-prose"><div className="material-chips"><span>EKG</span><span>Notfallrucksack</span><span>Sauerstoff / Medumat</span><span>Medikamente</span><span>Absaugung</span><span>Blutzuckermessgerät</span><span>i.v.-Zugang, mindestens 18 G</span></div></div></section>

    <section className="lesson-section"><ChapterHeading number="07" kicker="Strukturiertes Vorgehen" title="Erstmaßnahmen und Diagnostik" /><div className="lesson-prose"><ol className="timeline"><li><span>1</span><div><b>Kritisch oder nicht kritisch?</b><p>Die Vorlage beschreibt Betroffene meist als hämodynamisch stabil; die Situation wird dennoch strukturiert eingeschätzt.</p></div></li><li><span>2</span><div><b>BEFAST durchführen</b><p>Neurologische Auffälligkeiten systematisch erfassen.</p></div></li><li><span>3</span><div><b>Anamnese und Diagnostik</b><p>SAMPLER(S), Blutzucker und weitere neurologische Tests durchführen.</p></div></li><li><span>4</span><div><b>Unterstützung und Lagerung</b><p>Situationsgerechte Lagerung und bei Bedarf Notarzt nachfordern.</p></div></li></ol></div></section>

    <section className="lesson-section"><ChapterHeading number="08" kicker="Alternativen prüfen" title="Differenzialdiagnosen und Entscheidungsfindung" /><div className="lesson-prose"><div className="differential-grid"><span>Hypoglykämie</span><span>Epileptischer Anfall / postiktaler Zustand</span><span>Intrakranielle Blutung anderer Ursache</span><span>Schädel-Hirn-Trauma</span><span>Meningitis / Enzephalitis</span><span>Migräne mit Aura</span><span>Intoxikation</span><span>Metabolische Entgleisung</span></div></div></section>

    <section className="lesson-section"><ChapterHeading number="09" kicker="Versorgung fortführen" title="Weitere Maßnahmen" /><div className="lesson-prose"><ul className="editorial-list"><li><b>Vorbereitung</b><span>Blutentnahme, erneute Blutzuckerkontrolle und vollständiges Monitoring.</span></li><li><b>Lagerung</b><span>30° Oberkörperhochlagerung.</span></li><li><b>Zeitziele</b><span>Patientenversorgungszeit unter 20 Minuten, Prähospitalzeit unter 60 Minuten.</span></li><li><b>Transport</b><span>Fortlaufende Überwachung und telefonische Voranmeldung.</span></li><li><b>Blutdruck</b><span>Die Vorlage verweist für die Blutdrucksenkung auf die VFA Schlaganfall.</span></li></ul></div></section>

    <section className="lesson-section vfa-chapter"><ChapterHeading number="10" kicker="Originalalgorithmus" title="VFA Thüringen 2026/2027" /><div className="lesson-prose"><p>Verfahrensanweisung 44 „Schlaganfall Erwachsene“. Die Abbildung stammt direkt aus der von dir bereitgestellten Thüringer VFA.</p><figure className="vfa-page"><img src="/lessons/apoplexie/vfa-schlaganfall-thueringen-2026-2027.png" alt="Verfahrensanweisung 44 Schlaganfall Erwachsene aus Thüringen 2026/2027" /><figcaption>VFA 44 · Schlaganfall Erwachsene · Version 2026/27</figcaption></figure></div></section>

    <QuestionPanel />
    <p className="lesson-source">Lerninhalt: „Apoplexie (Schlaganfall) 2.pdf“ · VFA-Abbildung: Thüringer Verfahrensanweisungen 2026/2027. Die Darstellung dient der Prüfungsvorbereitung und ersetzt keine lokalen Vorgaben oder medizinische Rücksprache.</p>
  </article>;
}

function QuestionPanel() {
  return <div className="ai-question-panel"><div><span className="eyebrow">Nach dem Lesen</span><h2>Fragen aus diesem Kapitel erstellen</h2><p>Die KI-Funktion wird später ausschließlich den hinterlegten Kapitelinhalt als Grundlage verwenden.</p></div><button className="primary-button" disabled>KI-Fragen erstellen</button></div>;
}

function QuizPlaceholder() {
  return <section className="quiz-page placeholder-page"><div className="empty-state-card"><span className="empty-icon">✓</span><span className="eyebrow">MC-Training</span><h1>Noch keine Fragen hinterlegt.</h1><p>Fragen werden erst aus deinen später bereitgestellten Fachmaterialien erstellt.</p><div className="source-note"><span>3×</span><p><b>Fortschrittslogik ist vorbereitet</b>Richtig beantwortete Fragen steigen über 33 % und 67 % auf 100 %. Eine falsche Antwort setzt die Frage auf 0 % zurück.</p></div><button className="primary-button" disabled>Training noch nicht verfügbar</button></div></section>;
}

function ProgressView({ progress }: { progress: QuestionProgress }) {
  const summary = summarizeQuestionProgress(progress);
  return <section className="page-section progress-page"><div className="section-heading"><div><span className="eyebrow">Dein Lernstand</span><h1>Jede Frage wird wirklich sicher.</h1><p>Das System bewertet jede Frage einzeln und bleibt für beliebig viele spätere Fragen erweiterbar.</p></div></div><div className="progress-overview"><div className="progress-ring" style={{ "--progress": `${summary.average * 3.6}deg` } as React.CSSProperties}><div><b>{summary.average}%</b><span>Gesamt</span></div></div><div><span className="eyebrow">Fragensicherheit</span><h2>{summary.total ? `${summary.mastered} Fragen sicher beherrscht` : "Noch keine Fragen vorhanden."}</h2><p>Der Gesamtwert wächst automatisch, sobald Fragen aus deinen Materialien angelegt und beantwortet werden.</p><div className="progress-track large"><span style={{ width: `${summary.average}%` }} /></div></div></div><div className="mastery-grid"><article className="wrong"><span>0%</span><h3>Falsch / Neu</h3><b>{summary.wrong}</b><p>Eine falsche Antwort setzt die einzelne Frage immer hierhin zurück.</p></article><article><span>33%</span><h3>1× richtig</h3><b>{Object.values(progress).filter((item) => item.correctCount === 1).length}</b><p>Einmal korrekt beantwortet.</p></article><article><span>67%</span><h3>2× richtig</h3><b>{Object.values(progress).filter((item) => item.correctCount === 2).length}</b><p>Zweimal korrekt beantwortet.</p></article><article className="mastered"><span>100%</span><h3>3× richtig</h3><b>{summary.mastered}</b><p>Dreimal korrekt – die Frage gilt als sicher.</p></article></div><div className="progress-rule"><span>↺</span><div><b>Falsch überschreibt den bisherigen Stand</b><p>Wird eine Frage falsch beantwortet, fällt nur diese Frage unabhängig von ihrem vorherigen Stand sofort auf 0 % zurück.</p></div></div></section>;
}
