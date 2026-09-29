"use client";

import { useEffect, useState } from "react";
import { anatomyChapters } from "./anatomy-data";

const pathFor = (slug?: string) => slug ? `/anatomie/${slug}` : "/anatomie";

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
        <span aria-hidden="true">!</span><div><b>Kapitelinhalt noch nicht verfügbar</b><p>Die Repository-Datei <code>Anatomie_Skriptum.pdf</code> ist leer (0 Byte). Damit keine fachlichen Inhalte erfunden werden, wird dieses Kapitel erst nach Bereitstellung der lesbaren Quelle befüllt.</p></div>
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
    <div className="anatomy-source-warning" role="status"><span aria-hidden="true">!</span><div><b>Quelle derzeit nicht lesbar</b><p>Die im Repository vorhandene Datei <code>Anatomie_Skriptum.pdf</code> hat eine Größe von 0 Byte. Die bestätigte Hauptgliederung ist verfügbar; fachliche Detailinhalte wurden bewusst nicht ergänzt.</p></div></div>
    <div className="anatomy-grid">
      {anatomyChapters.map((chapter) => <button key={chapter.slug} type="button" onClick={() => openChapter(chapter.slug)}>
        <span className="anatomy-card-number">{chapter.roman}</span><h2>{chapter.title}</h2><span className="anatomy-card-action">Kapitel öffnen <i aria-hidden="true">→</i></span>
      </button>)}
    </div>
  </section>;
}
