"use client";

import { useEffect, useRef, useState } from "react";
import { anatomyChapters } from "./anatomy-data";

const pathFor = (slug?: string) => slug ? `/anatomie/${slug}` : "/anatomie";

export default function AnatomyLibrary() {
  const initialSlug = typeof window === "undefined" ? "" : window.location.pathname.split("/")[2] || "";
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [loadError, setLoadError] = useState(false);
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
      pageButtonRefs.current[selectedPage]?.focus({ preventScroll: true });
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
      <section className="anatomy-chapter-intro"><div><span className="eyebrow">Kapitelüberblick</span><h2>{pages.length} Lernseiten direkt eingebettet</h2><p>Alle Texte, Beschriftungen und Abbildungen stammen aus dem bereitgestellten Anatomie-Skriptum. Tippe eine Seite an, um sie scharf im Vollbild zu lesen.</p></div><ul>{selected.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul></section>
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
    <div className="anatomy-source-ready"><span aria-hidden="true">✓</span><div><b>Anatomie-Skript vollständig eingebunden</b><p>70 fachliche Lernseiten mit den originalen Abbildungen und Beschriftungen stehen direkt in den Kapiteln zur Verfügung.</p></div></div>
    <div className="anatomy-grid">
      {anatomyChapters.map((chapter) => <button key={chapter.slug} type="button" onClick={() => openChapter(chapter.slug)}>
        <span className="anatomy-card-number">{chapter.roman}</span><h2>{chapter.title}</h2><p>{chapter.summary}</p><small>{chapter.lastPdfPage - chapter.firstPdfPage + 1} Lernseiten</small><span className="anatomy-card-action">Kapitel öffnen <i aria-hidden="true">→</i></span>
      </button>)}
    </div>
  </section>;
}
