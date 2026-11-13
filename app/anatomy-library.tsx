"use client";
/* PDF page previews use dynamic local URLs and natural dimensions. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { anatomyChapters } from "./anatomy-data";
import { normalizeSearch } from "./lib/contentSearch";

const pathFor = (slug?: string) => slug ? `/anatomie/${slug}` : "/anatomie";
const relatedTopics: Record<number,{title:string;slug:string}> = { 1:{title:"Myokardinfarkt",slug:"myokardinfarkt"},2:{title:"Angina pectoris",slug:"angina-pectoris"},3:{title:"Akutes Koronarsyndrom",slug:"acs"},6:{title:"Pneumonie",slug:"pneumonie"},10:{title:"COPD",slug:"bronchoobstruktion"},13:{title:"Asthma",slug:"bronchoobstruktion"},22:{title:"Kardiales Lungenödem",slug:"lungenoedem"},24:{title:"Vorhofflimmern",slug:"vorhofflimmern"},40:{title:"Nierensteinkolik",slug:"nierensteinkolik"} };

function BoneSummary() {
  return <section className="bone-summary" aria-labelledby="bone-summary-title">
    <header>
      <div><span className="eyebrow">Zusammenfassung · Knochen</span><h2 id="bone-summary-title">Das Wichtigste auf einen Blick</h2></div>
      <p>Das erwachsene Skelett besteht in der Regel aus <strong>206 Knochen</strong>. Die genaue Zählung kann je nach Verwachsungen und Zählweise abweichen.</p>
    </header>

    <div className="bone-summary-grid four">
      <article><span className="bone-summary-number">01</span><h3>Stützen &amp; Formen</h3><p>Knochen geben dem Körper Halt, übertragen Kräfte und bilden Ansatzstellen für Muskeln.</p></article>
      <article><span className="bone-summary-number">02</span><h3>Schützen</h3><p>Schädel, Wirbelsäule, Thorax und Becken schützen empfindliche Organe.</p></article>
      <article><span className="bone-summary-number">03</span><h3>Blut bilden</h3><p>Im roten Knochenmark entstehen Erythrozyten, Leukozyten und Thrombozyten.</p></article>
      <article><span className="bone-summary-number">04</span><h3>Mineralien speichern</h3><p>Knochen dienen besonders als Speicher für Calcium und Phosphat.</p></article>
    </div>

    <div className="bone-summary-split">
      <article className="bone-summary-panel">
        <span className="eyebrow">Bewegungsapparat</span><h3>Passiv und aktiv arbeiten zusammen</h3>
        <dl className="bone-definition-list">
          <div><dt>Passiver Bewegungsapparat</dt><dd>Knochen, Knorpel, Gelenke und Bänder geben Form, führen Bewegungen und nehmen Kräfte auf.</dd></div>
          <div><dt>Aktiver Bewegungsapparat</dt><dd>Die quergestreifte Skelettmuskulatur erzeugt über Sehnen die Bewegung.</dd></div>
        </dl>
      </article>
      <article className="bone-summary-panel">
        <span className="eyebrow">Knochengewebe</span><h3>Geflecht- und Lamellenknochen</h3>
        <dl className="bone-definition-list">
          <div><dt>Geflechtknochen</dt><dd>Schnell gebildetes, noch ungeordnetes Knochengewebe – zum Beispiel bei Entwicklung und früher Frakturheilung.</dd></div>
          <div><dt>Lamellenknochen</dt><dd>Geordnetes, belastbares reifes Knochengewebe; es bildet den Großteil des erwachsenen Skeletts.</dd></div>
        </dl>
      </article>
    </div>

    <article className="bone-summary-panel bone-wide">
      <span className="eyebrow">Knochenformen</span><h3>Form folgt Funktion</h3>
      <div className="bone-shape-grid">
        <div><b>Röhrenknochen</b><span>z. B. Oberarmknochen, Speiche, Elle, Oberschenkelknochen</span></div>
        <div><b>Kurze Knochen</b><span>z. B. Hand- und Fußwurzelknochen</span></div>
        <div><b>Platte Knochen</b><span>z. B. Schulterblatt, Brustbein, Schädelknochen</span></div>
        <div><b>Unregelmäßige Knochen</b><span>z. B. Wirbel</span></div>
        <div><b>Pneumatisierte Knochen</b><span>Lufthaltige Räume, z. B. Stirnbein, Keilbein und Oberkiefer</span></div>
      </div>
    </article>

    <div className="bone-summary-split">
      <article className="bone-summary-panel">
        <span className="eyebrow">Röhrenknochen</span><h3>Abschnitte sicher benennen</h3>
        <ol className="bone-process">
          <li><b>Epiphyse</b><span>Knochenende; gelenknah, überwiegend Spongiosa</span></li>
          <li><b>Metaphyse</b><span>Übergang zwischen Epiphyse und Schaft; beim wachsenden Menschen mit Wachstumsfuge</span></li>
          <li><b>Diaphyse</b><span>Knochenschaft mit kräftiger Kompakta und Markhöhle</span></li>
          <li><b>Apophyse</b><span>Knochenvorsprung als Ansatzstelle für Sehnen und Bänder</span></li>
        </ol>
      </article>
      <article className="bone-summary-panel">
        <span className="eyebrow">Aufbau</span><h3>Von außen nach innen</h3>
        <ol className="bone-process">
          <li><b>Periost</b><span>Schmerzempfindliche Knochenhaut; Gefäße, Nerven und knochenbildende Zellen</span></li>
          <li><b>Kompakta / Kortikalis</b><span>Dichte, feste Außenschicht für Stabilität</span></li>
          <li><b>Spongiosa</b><span>Leichtes Trabekelwerk; entlang der Belastungslinien ausgerichtet</span></li>
          <li><b>Knochenmark</b><span>Rotes Mark bildet Blutzellen; gelbes Mark speichert vor allem Fett</span></li>
        </ol>
      </article>
    </div>

    <article className="bone-summary-panel bone-wide">
      <span className="eyebrow">Gelenke</span><h3>Unechte und echte Gelenke unterscheiden</h3>
      <div className="bone-joint-compare">
        <div><b>Unechtes Gelenk · Synarthrose</b><p>Kein Gelenkspalt; Knochen sind durch Bindegewebe, Knorpel oder Knochen verbunden. Bewegung ist nicht oder nur gering möglich.</p></div>
        <div><b>Echtes Gelenk · Diarthrose</b><p>Mit Gelenkspalt, Knorpelflächen, Gelenkkapsel und Gelenkflüssigkeit; je nach Form unterschiedlich beweglich.</p></div>
        <div><b>Straffes Gelenk · Amphiarthrose</b><p>Ein echtes Gelenk mit sehr geringem Bewegungsausmaß, aber hoher Stabilität.</p></div>
      </div>
    </article>

    <article className="bone-summary-panel bone-wide">
      <span className="eyebrow">Skelett und Wirbelsäule</span><h3>Axial und appendikulär ordnen</h3>
      <div className="bone-skeleton-overview">
        <div><b>Axialskelett</b><p>Schädel, Wirbelsäule und Brustkorb bilden die zentrale Körperachse.</p></div>
        <div><b>Appendikuläres Skelett</b><p>Schulter- und Beckengürtel sowie obere und untere Extremitäten.</p></div>
      </div>
      <div className="spine-strip" aria-label="Abschnitte der Wirbelsäule">
        <span><b>HWS</b><small>7 Wirbel</small></span><span><b>BWS</b><small>12 Wirbel</small></span><span><b>LWS</b><small>5 Wirbel</small></span><span><b>Kreuzbein</b><small>5 verwachsene Wirbel</small></span><span><b>Steißbein</b><small>meist 4 verwachsene Wirbel</small></span>
      </div>
      <p className="bone-memory"><strong>Merke:</strong> Atlas (C1) trägt den Schädel, Axis (C2) besitzt den Zahnfortsatz. Bandscheiben aus Faserring und Gallertkern verteilen Druck und ermöglichen Beweglichkeit.</p>
    </article>
  </section>;
}

export default function AnatomyLibrary() {
  const initialSlug = typeof window === "undefined" ? "" : window.location.pathname.split("/")[2] || "";
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pageButtonRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const selected = anatomyChapters.find((chapter) => chapter.slug === selectedSlug);

  useEffect(() => {
    const onPopState = () => setSelectedSlug(window.location.pathname.split("/")[2] || "");
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (selectedPage === null) return;
    const pageTrigger = pageButtonRefs.current[selectedPage];
    const previousOverflow = document.body.style.overflow;
    const close = () => setSelectedPage(null);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (zoom === 1 && event.key === "ArrowLeft") setSelectedPage((page) => page && page > selected!.firstPdfPage ? page - 1 : page);
      if (zoom === 1 && event.key === "ArrowRight") setSelectedPage((page) => page && page < selected!.lastPdfPage ? page + 1 : page);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      pageTrigger?.focus({ preventScroll: true });
    };
  }, [selectedPage, selected, zoom]);

  const openChapter = (slug: string) => {
    window.history.pushState({}, "", pathFor(slug));
    setSelectedSlug(slug);
    setSelectedPage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openOverview = () => {
    window.history.pushState({}, "", pathFor());
    setSelectedSlug("");
    setSelectedPage(null);
  };

  if (selected) {
    const index = anatomyChapters.indexOf(selected);
    const pages = Array.from({ length: selected.lastPdfPage - selected.firstPdfPage + 1 }, (_, pageIndex) => selected.firstPdfPage + pageIndex);
    return <section className="anatomy-page anatomy-reader" aria-labelledby="anatomy-title">
      <button type="button" className="anatomy-back-button" onClick={openOverview} aria-label="Zurück zur Anatomieübersicht">
        <span aria-hidden="true">←</span>
        <span><small>Zurück</small><b>Anatomieübersicht</b></span>
      </button>
      <nav className="anatomy-breadcrumbs" aria-label="Brotkrümelnavigation">
        <button type="button" onClick={openOverview}>Anatomie</button><span aria-hidden="true">›</span><span aria-current="page">{selected.title}</span>
      </nav>
      <header className="anatomy-hero compact">
        <span className="anatomy-roman">{selected.roman}</span>
        <div><span className="eyebrow light">ANATOMIE · KAPITEL {selected.roman}</span><h1 id="anatomy-title">{selected.title}</h1><p>{selected.summary}</p></div>
      </header>
      <section className="anatomy-chapter-intro"><div><span className="eyebrow">Kapitelüberblick</span><h2>{selected.summary}</h2><p>{pages.length} Lernseiten aus dem bereitgestellten Skript. Tippe eine Seite an, um sie im Vollbild zu lesen.</p></div><ul>{selected.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul></section>
      {selected.slug === "skelettsystem" ? <BoneSummary /> : null}
      {selected.relatedTopicNumbers?.length ? <aside className="anatomy-related"><b>Passende Krankheitsbilder</b><p>{selected.relatedTopicNumbers.map(number => relatedTopics[number] && <a key={number} href={`/muendlich/${relatedTopics[number].slug}`}>{relatedTopics[number].title}</a>)}</p></aside> : null}
      <div className="anatomy-page-stack">
        {pages.map((pdfPage) => <figure key={pdfPage} className="anatomy-script-page">
          <button ref={(node) => { pageButtonRefs.current[pdfPage] = node; }} type="button" onClick={() => setSelectedPage(pdfPage)} aria-label={`Skriptseite ${pdfPage - 1} im Vollbild öffnen`}>
            <img src={`/lessons/anatomie/anatomie-${String(pdfPage).padStart(2, "0")}.jpg`} alt={`${selected.title}, Skriptseite ${pdfPage - 1}`} loading="lazy" />
            <span aria-hidden="true">⤢ Vollbild</span>
          </button>
          <figcaption><b>{selected.title}</b><span>Skriptseite {pdfPage - 1}</span></figcaption>
        </figure>)}
      </div>
      <nav className="anatomy-chapter-switcher" aria-label="Zwischen Anatomie-Kapiteln wechseln">
        {index > 0 && <button type="button" onClick={() => openChapter(anatomyChapters[index - 1].slug)}><span>← Vorheriges Kapitel</span><b>{anatomyChapters[index - 1].title}</b></button>}
        <button type="button" className="overview" onClick={openOverview}><span>Alle Kapitel</span><b>Zur Übersicht</b></button>
        {index < anatomyChapters.length - 1 && <button type="button" onClick={() => openChapter(anatomyChapters[index + 1].slug)}><span>Nächstes Kapitel →</span><b>{anatomyChapters[index + 1].title}</b></button>}
      </nav>
      {selectedPage !== null && <div className="anatomy-lightbox" role="dialog" aria-modal="true" aria-label={`Skriptseite ${selectedPage - 1}`}>
        <div className="anatomy-lightbox-toolbar">
          <button type="button" disabled={selectedPage === selected.firstPdfPage} onClick={() => { setZoom(1); setLoadError(false); setSelectedPage(selectedPage - 1); }} aria-label="Vorherige Seite">←</button>
          <span><b>Seite {selectedPage - selected.firstPdfPage + 1} von {pages.length}</b><small>Skriptseite {selectedPage - 1}</small></span>
          <button type="button" disabled={selectedPage === selected.lastPdfPage} onClick={() => { setZoom(1); setLoadError(false); setSelectedPage(selectedPage + 1); }} aria-label="Nächste Seite">→</button>
          <button type="button" onClick={() => setZoom((value) => Math.max(1, value - .25))} disabled={zoom === 1} aria-label="Verkleinern">−</button>
          <button type="button" onClick={() => setZoom((value) => Math.min(3, value + .25))} disabled={zoom === 3} aria-label="Vergrößern">+</button>
          <button type="button" onClick={() => setZoom(1)}>An Ansicht anpassen</button>
          <button ref={closeButtonRef} className="close" type="button" onClick={() => setSelectedPage(null)} aria-label="Vollbild schließen">×</button>
        </div>
        <div className={`anatomy-lightbox-canvas ${zoom > 1 ? "zoomed" : ""}`}>
          {loadError ? <div className="anatomy-load-error" role="alert"><b>Die Skriptseite konnte nicht geladen werden.</b><button onClick={() => setLoadError(false)}>Erneut laden</button></div> : <img key={selectedPage} src={`/lessons/anatomie/anatomie-${String(selectedPage).padStart(2, "0")}.jpg`} alt={`${selected.title}, Skriptseite ${selectedPage - 1} im Vollbild`} style={{ transform: `scale(${zoom})` }} onError={() => setLoadError(true)} />}
        </div>
      </div>}
    </section>;
  }

  return <section className="anatomy-page" aria-labelledby="anatomy-title">
    <header className="anatomy-hero">
      <div><span className="eyebrow light">DIGITALER LERNBEREICH</span><h1 id="anatomy-title">Anatomie</h1><p>Das vollständige Skript ist in 13 Lernkapitel gegliedert. Texte und Abbildungen lassen sich direkt auf der Seite lesen und vergrößern.</p></div>
      <div className="anatomy-count" aria-label="13 Kapitel"><b>13</b><span>Kapitel</span></div>
    </header>
    <div className="anatomy-source-ready"><span aria-hidden="true">✓</span><div><b>Anatomie-Skript als Lernseiten eingebunden</b><p>Die Suche umfasst geprüfte Kapitel-, Zusammenfassungs- und Schlagwortdaten. Sie ist keine Volltextsuche aller Skriptseiten.</p></div></div>
    <label className="anatomy-search"><span>Kapitel und Schlagwörter suchen</span><input type="search" value={search} onChange={event=>setSearch(event.target.value)} placeholder="z. B. Herzklappen oder Niere" /></label>
    <div className="anatomy-grid">
      {anatomyChapters.filter(chapter=>!normalizeSearch(search)||normalizeSearch(`${chapter.title} ${chapter.summary} ${chapter.topics.join(" ")}`).includes(normalizeSearch(search))).map((chapter) => <button key={chapter.slug} type="button" onClick={() => openChapter(chapter.slug)}>
        <span className="anatomy-card-number">{chapter.roman}</span><h2>{chapter.title}</h2><p>{chapter.summary}</p><small>{chapter.lastPdfPage - chapter.firstPdfPage + 1} Lernseiten</small><span className="anatomy-card-action">Kapitel öffnen <i aria-hidden="true">→</i></span>
      </button>)}
    </div>
    {search && !anatomyChapters.some(chapter=>normalizeSearch(`${chapter.title} ${chapter.summary} ${chapter.topics.join(" ")}`).includes(normalizeSearch(search))) && <div className="library-empty" role="status"><h2>Kein geprüfter Suchtreffer</h2><p>Versuche einen Kapitelbegriff oder setze die Suche zurück.</p><button onClick={()=>setSearch("")}>Suche zurücksetzen</button></div>}
  </section>;
}
