"use client";

import { useEffect, useState } from "react";
import { anatomyChapters } from "./anatomy-data";

const pathFor = (slug?: string) => slug ? `/anatomie/${slug}` : "/anatomie";
const anatomyScriptUrl = "https://publuu.com/flip-book/1187641/2642157?disablelogs=1&mobilepreview=1";

function SourceLink() {
  return <a className="anatomy-source-link" href={anatomyScriptUrl} target="_blank" rel="noreferrer">
    Original-Skript mit Abbildungen öffnen <span aria-hidden="true">↗</span>
  </a>;
}

export default function AnatomyLibrary() {
  const initialSlug = typeof window === "undefined" ? "" : window.location.pathname.split("/")[2] || "";
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const selected = anatomyChapters.find((chapter) => chapter.slug === selectedSlug);

  useEffect(() => {
    const onPopState = () => setSelectedSlug(window.location.pathname.split("/")[2] || "");
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const openChapter = (slug: string) => {
    window.history.pushState({}, "", pathFor(slug));
    setSelectedSlug(slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openOverview = () => {
    window.history.pushState({}, "", pathFor());
    setSelectedSlug("");
  };

  if (selected) {
    const index = anatomyChapters.indexOf(selected);
    return <section className="anatomy-page anatomy-reader" aria-labelledby="anatomy-title">
      <nav className="anatomy-breadcrumbs" aria-label="Brotkrümelnavigation">
        <button type="button" onClick={openOverview}>Anatomie</button><span aria-hidden="true">›</span><span aria-current="page">{selected.title}</span>
      </nav>
      <header className="anatomy-hero compact">
        <span className="anatomy-roman">{selected.roman}</span>
        <div><span className="eyebrow light">ANATOMIE · KAPITEL {selected.roman}</span><h1 id="anatomy-title">{selected.title}</h1></div>
      </header>
      <aside className="anatomy-source-warning" role="status">
        <span aria-hidden="true">i</span><div><b>Abbildungen im Original-Skript</b><p>Das vollständige Skript einschließlich seiner anatomischen Abbildungen steht im bereitgestellten Online-Flipbook zur Verfügung.</p><SourceLink /></div>
      </aside>
      <nav className="anatomy-chapter-switcher" aria-label="Zwischen Anatomie-Kapiteln wechseln">
        {index > 0 && <button type="button" onClick={() => openChapter(anatomyChapters[index - 1].slug)}><span>← Vorheriges Kapitel</span><b>{anatomyChapters[index - 1].title}</b></button>}
        <button type="button" className="overview" onClick={openOverview}><span>Alle Kapitel</span><b>Zur Übersicht</b></button>
        {index < anatomyChapters.length - 1 && <button type="button" onClick={() => openChapter(anatomyChapters[index + 1].slug)}><span>Nächstes Kapitel →</span><b>{anatomyChapters[index + 1].title}</b></button>}
      </nav>
    </section>;
  }

  return <section className="anatomy-page" aria-labelledby="anatomy-title">
    <header className="anatomy-hero">
      <div><span className="eyebrow light">DIGITALER LERNBEREICH</span><h1 id="anatomy-title">Anatomie</h1><p>Wähle eines der 13 Kapitel des Anatomie-Skriptums.</p></div>
      <div className="anatomy-count" aria-label="13 Kapitel"><b>13</b><span>Kapitel</span></div>
    </header>
    <div className="anatomy-source-warning" role="status"><span aria-hidden="true">i</span><div><b>Original-Skript und Abbildungen</b><p>Ergänzend zur Kapitelübersicht kann das bereitgestellte Anatomie-Skript mit allen enthaltenen Abbildungen direkt geöffnet werden.</p><SourceLink /></div></div>
    <div className="anatomy-grid">
      {anatomyChapters.map((chapter) => <button key={chapter.slug} type="button" onClick={() => openChapter(chapter.slug)}>
        <span className="anatomy-card-number">{chapter.roman}</span><h2>{chapter.title}</h2><span className="anatomy-card-action">Kapitel öffnen <i aria-hidden="true">→</i></span>
      </button>)}
    </div>
  </section>;
}
