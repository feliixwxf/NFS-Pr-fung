"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";

export function ChapterHeading({ number, title, kicker }: { number: string; title: string; kicker: string }) {
  return <header className="chapter-heading"><span>{number}</span><div><small>{kicker}</small><h2>{title}</h2></div></header>;
}

export function ExpandableImage({ src, alt }: { src: string; alt: string }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const closeFullscreen = () => {
    setFullscreen(false);
    setZoomed(false);
  };

  useEffect(() => {
    if (!fullscreen) return;
    const scrollY = window.scrollY;
    const trigger = triggerRef.current;
    const previous = { overflow: document.body.style.overflow, position: document.body.style.position, top: document.body.style.top, width: document.body.style.width };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFullscreen(false);
        setZoomed(false);
      }
      if (event.key === "Tab") {
        const controls = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]),[href],[tabindex]:not([tabindex="-1"])');
        if (!controls?.length) return;
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    window.addEventListener("keydown", closeOnEscape);
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      Object.assign(document.body.style, previous);
      window.scrollTo(0, scrollY);
      trigger?.focus({ preventScroll: true });
    };
  }, [fullscreen]);

  return <>
    <button ref={triggerRef} className="image-open-button" type="button" onClick={() => { setLoadError(false); setFullscreen(true); }} aria-label={`${alt} im Vollbild öffnen`}>
      <img src={src} alt={alt} />
      <span>⤢ Vollbild</span>
    </button>
    {fullscreen && <div ref={dialogRef} className="image-lightbox" role="dialog" aria-modal="true" aria-label={`Vollbild: ${alt}`}>
      <div className="image-lightbox-controls">
        <button className="image-lightbox-zoom" type="button" aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>{zoomed ? "⊟ Ganzes Bild" : "⊞ Originalgröße"}</button>
        <button ref={closeRef} className="image-lightbox-close" type="button" onClick={closeFullscreen}>× Schließen</button>
      </div>
      <div className={`image-lightbox-stage ${zoomed ? "is-zoomed" : ""}`}>
        {loadError ? <div className="image-load-error" role="alert"><b>Die Abbildung konnte nicht geladen werden.</b><button type="button" onClick={() => setLoadError(false)}>Erneut laden</button></div> : <img key={`${src}-${loadError}`} src={src} alt={alt} onError={() => setLoadError(true)} />}
      </div>
    </div>}
  </>;
}

function cleanLearningCaption(caption: string) {
  return caption
    .replace(/\s*[·|]\s*(?:Originalabbildung|Abbildung|Ausschnitt)(?:\s+aus)?\s+Print\s+\d+(?:,\s*Seite\s*\d+)?\s*$/i, "")
    .replace(/\s*[·|]\s*(?:hinterlegtes Anatomieskript|Originalabbildung)\s*$/i, "")
    .replace(/\s+aus\s+Print\s+\d+(?:,\s*Seite\s*\d+)?\s*$/i, "")
    .replace(/\s*[·|]\s*Print\s+\d+(?:,\s*Seite\s*\d+)?\s*$/i, "")
    .trim();
}

export function SourceFigure({ src, alt, caption, wide = false }: { src: string; alt: string; caption: string; wide?: boolean }) {
  const cropClass = src === "/lessons/hypoglykaemie/pankreas-anatomie.png" ? "pankreas-anatomie-crop" : "";
  const isPankreasGefasse = src === "/lessons/hypoglykaemie/pankreas-gefaesse.png";
  const displaySrc = isPankreasGefasse ? "/lessons/hypoglykaemie/pankreas-gefaesse-original.jpg" : src;
  const displayCaption = cleanLearningCaption(caption);
  return <details className={`collapsible-figure ${wide ? "wide" : ""} ${cropClass} ${isPankreasGefasse ? "pankreas-gefaesse-sharp" : ""}`} open>{isPankreasGefasse && <svg className="image-filter-defs" aria-hidden="true" focusable="false"><filter id="pankreas-gefaesse-unsharp"><feGaussianBlur in="SourceGraphic" stdDeviation="1.1" result="softened"/><feComposite in="SourceGraphic" in2="softened" operator="arithmetic" k1="0" k2="1.9" k3="-0.9" k4="0"/></filter></svg>}<summary><span>{displayCaption}</span><small>Abbildung ein-/ausklappen</small></summary><figure className="source-figure"><ExpandableImage src={displaySrc} alt={alt} /><figcaption>{displayCaption}<span>{isPankreasGefasse ? "Nachgeschärft · zum Vergrößern antippen" : "Zum Vergrößern antippen"}</span></figcaption></figure></details>;
}

export function VfaFigure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  const displayCaption = cleanLearningCaption(caption);
  return <details className="collapsible-figure vfa-collapsible" open><summary><span>{displayCaption}</span><small>VFA ein-/ausklappen</small></summary><figure className="vfa-page"><ExpandableImage src={src} alt={alt} /><figcaption>{displayCaption} · antippen für Vollbild</figcaption></figure></details>;
}

