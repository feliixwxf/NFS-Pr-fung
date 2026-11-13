"use client";

import { RefObject, useRef, useState } from "react";

type WrittenSearchResult = {
  id: string;
  sectionIndex: number;
  target: HTMLElement;
  section: HTMLDetailsElement;
  sectionNumber: string;
  sectionTitle: string;
  label: string;
  excerpt: string;
};

function normalizeSearch(value: string) {
  return value
    .toLocaleLowerCase("de-DE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/ae/g, "a")
    .replace(/oe/g, "o")
    .replace(/ue/g, "u")
    .replace(/\s+/g, " ")
    .trim();
}

export default function WrittenTermSearch({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WrittenSearchResult[]>([]);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = (value: string) => {
    setQuery(value);
    const needle = normalizeSearch(value);
    if (needle.length < 2 || !rootRef.current) {
      setResults([]);
      return;
    }

    const matches: WrittenSearchResult[] = [];
    const seen = new Set<HTMLElement>();
    rootRef.current.querySelectorAll<HTMLDetailsElement>(":scope > details").forEach((section, sectionIndex) => {
      const sectionNumber = section.querySelector("summary > span")?.textContent?.trim() || String(sectionIndex + 1).padStart(2, "0");
      const sectionTitle = section.querySelector("summary h2")?.textContent?.trim() || "Schriftliches Lernfeld";
      const candidates = section.querySelectorAll<HTMLElement>("h3, h4, p, li, article, aside, tr, dt, dd, td, th, span");

      candidates.forEach((candidate, candidateIndex) => {
        if (!normalizeSearch(candidate.textContent || "").includes(needle)) return;
        const context = candidate.closest<HTMLElement>("article, aside, li, tr") || candidate;
        if (seen.has(context)) return;
        seen.add(context);
        const text = (context.textContent || "").replace(/\s+/g, " ").trim();
        const label = context.querySelector("h3, h4, b, strong")?.textContent?.trim() || candidate.textContent?.trim() || sectionTitle;
        const id = context.id || `written-search-${sectionIndex}-${candidateIndex}`;
        context.id = id;
        matches.push({ id, sectionIndex, target: context, section, sectionNumber, sectionTitle, label, excerpt: text.length > 210 ? `${text.slice(0, 207)}…` : text });
      });
    });
    setResults(matches);
  };

  const jumpToResult = (result: WrittenSearchResult) => {
    const target = result.target.isConnected ? result.target : rootRef.current?.querySelector<HTMLElement>(`#${result.id}`);
    const section = result.section.isConnected ? result.section : rootRef.current?.querySelectorAll<HTMLDetailsElement>(":scope > details")[result.sectionIndex];
    if (!target || !section || !rootRef.current?.contains(target)) return;
    if (section) section.open = true;
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    rootRef.current?.querySelectorAll(".legal-search-hit").forEach((element) => element.classList.remove("legal-search-hit"));
    window.requestAnimationFrame(() => {
      target.classList.add("legal-search-hit");
      target.setAttribute("tabindex", "-1");
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.focus({ preventScroll: true });
      highlightTimer.current = setTimeout(() => {
        target.classList.remove("legal-search-hit");
        target.removeAttribute("tabindex");
      }, 2600);
    });
  };

  return <section className="legal-reader-tools written-term-search" aria-label="Schriftlichen Lernbereich durchsuchen">
    <label className="legal-search-box">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.2 4.2"/></svg>
      <span className="sr-only">Begriff im Lernbereich suchen</span>
      <input type="search" value={query} onChange={(event) => search(event.target.value)} placeholder="Begriff suchen, z. B. Kapnografie" autoComplete="off" />
      {query && <button type="button" aria-label="Suche leeren" onClick={() => search("")}>×</button>}
    </label>
    {query.trim().length >= 2 && <div className="legal-search-results" aria-live="polite">
      <header><b>{results.length} {results.length === 1 ? "Fundstelle" : "Fundstellen"}</b><span>Antippen, um direkt zur Stelle zu springen</span></header>
      {results.length ? <div>{results.map((result) => <button type="button" key={result.id} onClick={() => jumpToResult(result)}><span>{result.sectionNumber}</span><div><small>{result.sectionTitle}</small><b>{result.label}</b><p>{result.excerpt}</p></div><i>→</i></button>)}</div> : <p className="legal-search-empty">Kein Treffer. Prüfe die Schreibweise oder suche nach einem kürzeren Wortstamm.</p>}
    </div>}
  </section>;
}
