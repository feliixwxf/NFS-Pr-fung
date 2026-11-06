"use client";

import { useEffect, useState } from "react";
import { deleteTextHighlight, readLocalTextHighlights, saveTextHighlight, syncTextHighlights, type TextHighlight } from "./lib/textHighlights";

const HIGHLIGHT_NAME = "notsan-personal-highlights";
const CONTEXT_LENGTH = 90;
const MAX_QUOTE_LENGTH = 1200;

type SelectionCandidate = {
  quote: string;
  prefix: string;
  suffix: string;
  pagePath: string;
  highlightId?: string;
  left: number;
  top: number;
};

type HighlightRegistry = {
  set: (name: string, highlight: unknown) => void;
  delete: (name: string) => void;
};

type HighlightConstructor = new (...ranges: Range[]) => unknown;

function getHighlightApi() {
  if (typeof window === "undefined") return null;
  const css = window.CSS as typeof CSS & { highlights?: HighlightRegistry };
  const HighlightClass = (window as typeof window & { Highlight?: HighlightConstructor }).Highlight;
  return css?.highlights && HighlightClass ? { registry: css.highlights, HighlightClass } : null;
}

function textNodes(root: HTMLElement) {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || !node.nodeValue) return NodeFilter.FILTER_REJECT;
      if (parent.closest("script,style,noscript,.text-highlight-ui,[data-no-text-highlight]")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let current = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }
  return nodes;
}

function commonPrefixLength(left: string, right: string) {
  const length = Math.min(left.length, right.length);
  let index = 0;
  while (index < length && left[index] === right[index]) index += 1;
  return index;
}

function commonSuffixLength(left: string, right: string) {
  const length = Math.min(left.length, right.length);
  let index = 0;
  while (index < length && left[left.length - 1 - index] === right[right.length - 1 - index]) index += 1;
  return index;
}

function rangeForHighlight(root: HTMLElement, highlight: TextHighlight) {
  const nodes = textNodes(root);
  const fullText = nodes.map((node) => node.nodeValue || "").join("");
  let bestIndex = -1;
  let bestScore = -1;
  let from = 0;
  while (from <= fullText.length) {
    const index = fullText.indexOf(highlight.quote, from);
    if (index < 0) break;
    const before = fullText.slice(Math.max(0, index - highlight.prefix.length), index);
    const after = fullText.slice(index + highlight.quote.length, index + highlight.quote.length + highlight.suffix.length);
    const score = commonSuffixLength(before, highlight.prefix) + commonPrefixLength(after, highlight.suffix);
    if (score > bestScore) {
      bestIndex = index;
      bestScore = score;
    }
    from = index + Math.max(1, highlight.quote.length);
  }
  if (bestIndex < 0) return null;

  const startOffset = bestIndex;
  const endOffset = bestIndex + highlight.quote.length;
  let cursor = 0;
  let startNode: Text | null = null;
  let endNode: Text | null = null;
  let startInNode = 0;
  let endInNode = 0;
  for (const node of nodes) {
    const length = node.nodeValue?.length || 0;
    if (!startNode && startOffset >= cursor && startOffset <= cursor + length) {
      startNode = node;
      startInNode = startOffset - cursor;
    }
    if (endOffset >= cursor && endOffset <= cursor + length) {
      endNode = node;
      endInNode = endOffset - cursor;
      break;
    }
    cursor += length;
  }
  if (!startNode || !endNode) return null;
  const range = document.createRange();
  range.setStart(startNode, startInNode);
  range.setEnd(endNode, endInNode);
  return range;
}

function createHighlightId() {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `mark-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function TextHighlighter({ userId, contextKey }: { userId: string | null; contextKey: string }) {
  const [highlights, setHighlights] = useState<TextHighlight[]>(() => readLocalTextHighlights(userId));
  const [candidate, setCandidate] = useState<SelectionCandidate | null>(null);
  const [message, setMessage] = useState("");
  const [, setSyncState] = useState<"local" | "syncing" | "synced" | "error">(userId ? "syncing" : "local");

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setHighlights(readLocalTextHighlights(userId));
      setSyncState(userId ? "syncing" : "local");
    });
    if (!userId) {
      return () => { active = false; };
    }
    void syncTextHighlights(userId)
      .then((items) => {
        if (!active) return;
        setHighlights(items);
        setSyncState("synced");
      })
      .catch(() => {
        if (!active) return;
        setHighlights(readLocalTextHighlights(userId));
        setSyncState("error");
      });
    return () => { active = false; };
  }, [userId]);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".main-content");
    if (!root) return;
    let frame = 0;
    const updateCandidate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
          setCandidate(null);
          return;
        }
        const range = selection.getRangeAt(0);
        const ancestor = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
          ? range.commonAncestorContainer.parentElement
          : range.commonAncestorContainer as Element;
        if (!ancestor || !root.contains(ancestor) || ancestor.closest("button,a,input,textarea,select,option,.topbar,footer,.profile-popover,.text-highlight-ui,[data-no-text-highlight]")) {
          setCandidate(null);
          return;
        }
        const quote = range.toString();
        if (quote.trim().length < 2) {
          setCandidate(null);
          return;
        }
        const before = document.createRange();
        before.selectNodeContents(root);
        try {
          before.setEnd(range.startContainer, range.startOffset);
        } catch {
          setCandidate(null);
          return;
        }
        const nodes = textNodes(root);
        const fullText = nodes.map((node) => node.nodeValue || "").join("");
        const startNodeIndex = range.startContainer.nodeType === Node.TEXT_NODE
          ? nodes.indexOf(range.startContainer as Text)
          : -1;
        const start = startNodeIndex >= 0
          ? nodes.slice(0, startNodeIndex).reduce((length, node) => length + (node.nodeValue?.length || 0), 0) + range.startOffset
          : before.toString().length;
        const rects = range.getClientRects();
        const rect = rects.length ? rects[rects.length - 1] : range.getBoundingClientRect();
        const left = Math.min(window.innerWidth - 84, Math.max(84, rect.left + rect.width / 2));
        const top = Math.max(12, rect.top - 52);
        setCandidate({
          quote,
          prefix: fullText.slice(Math.max(0, start - CONTEXT_LENGTH), start),
          suffix: fullText.slice(start + quote.length, start + quote.length + CONTEXT_LENGTH),
          pagePath: window.location.pathname,
          highlightId: highlights.find((highlight) => highlight.pagePath === window.location.pathname && highlight.quote === quote)?.id,
          left,
          top,
        });
      });
    };
    document.addEventListener("selectionchange", updateCandidate);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("selectionchange", updateCandidate);
    };
  }, [contextKey, highlights]);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".main-content");
    const api = getHighlightApi();
    if (!root || !api) return;
    let frame = 0;
    const paint = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const path = window.location.pathname;
        const ranges = highlights
          .filter((highlight) => highlight.pagePath === path)
          .map((highlight) => rangeForHighlight(root, highlight))
          .filter((range): range is Range => Boolean(range));
        api.registry.delete(HIGHLIGHT_NAME);
        if (ranges.length) api.registry.set(HIGHLIGHT_NAME, new api.HighlightClass(...ranges));
      });
    };
    paint();
    const observer = new MutationObserver(paint);
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      api.registry.delete(HIGHLIGHT_NAME);
    };
  }, [contextKey, highlights]);

  const addHighlight = async () => {
    if (!candidate) return;
    if (candidate.quote.length > MAX_QUOTE_LENGTH) {
      setMessage("Bitte markiere höchstens einen kurzen Absatz.");
      return;
    }
    const duplicate = highlights.some((highlight) => highlight.pagePath === candidate.pagePath
      && highlight.quote === candidate.quote
      && highlight.prefix === candidate.prefix
      && highlight.suffix === candidate.suffix);
    if (duplicate) {
      setMessage("Diese Textstelle ist bereits markiert.");
      setCandidate(null);
      window.getSelection()?.removeAllRanges();
      return;
    }
    const timestamp = new Date().toISOString();
    const highlight: TextHighlight = {
      id: createHighlightId(),
      pagePath: candidate.pagePath,
      quote: candidate.quote,
      prefix: candidate.prefix,
      suffix: candidate.suffix,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    setHighlights((current) => [highlight, ...current]);
    setCandidate(null);
    window.getSelection()?.removeAllRanges();
    setMessage(userId ? "Markierung wird im Lernkonto gespeichert …" : "Markierung ist auf diesem Gerät gespeichert.");
    try {
      const next = await saveTextHighlight(userId, highlight);
      setHighlights(next);
      setSyncState(userId ? "synced" : "local");
      setMessage(userId ? "Markierung im Lernkonto gespeichert." : "Markierung ist auf diesem Gerät gespeichert.");
    } catch {
      setSyncState("error");
      setMessage("Markierung lokal gespeichert. Die Kontosynchronisierung wird später erneut versucht.");
    }
  };

  const removeHighlight = async (highlightId: string) => {
    setHighlights((current) => current.filter((highlight) => highlight.id !== highlightId));
    setCandidate(null);
    window.getSelection()?.removeAllRanges();
    try {
      const next = await deleteTextHighlight(userId, highlightId);
      setHighlights(next);
      setSyncState(userId ? "synced" : "local");
      setMessage("Markierung entfernt.");
    } catch {
      setSyncState("error");
      setMessage("Lokal entfernt. Die Änderung konnte noch nicht mit dem Konto synchronisiert werden.");
    }
  };

  return <>
    <style>{`::highlight(${HIGHLIGHT_NAME}){background:#ffe36d;color:inherit;text-decoration:underline;text-decoration-color:#e3b829;text-decoration-thickness:1px;text-underline-offset:2px}`}</style>
    {candidate && <button
      className={`text-highlight-action text-highlight-ui${candidate.highlightId ? " remove" : ""}`}
      type="button"
      style={{ left: candidate.left, top: candidate.top }}
      onPointerDown={(event) => event.preventDefault()}
      onClick={() => void (candidate.highlightId ? removeHighlight(candidate.highlightId) : addHighlight())}
    ><span aria-hidden="true" /> {candidate.highlightId ? "Markierung entfernen" : "Markieren"}</button>}
    {message && <div className="text-highlight-message text-highlight-ui" role="status"><span>{message}</span><button type="button" onClick={() => setMessage("")} aria-label="Hinweis schließen">×</button></div>}
  </>;
}
