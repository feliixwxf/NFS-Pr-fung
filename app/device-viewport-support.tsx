"use client";

import { useEffect } from "react";

const EDITABLE_SELECTOR = "input, textarea, select, [contenteditable='true']";

export default function DeviceViewportSupport() {
  useEffect(() => {
    const root = document.documentElement;
    const viewport = window.visualViewport;

    const updateViewport = () => {
      const height = viewport?.height ?? window.innerHeight;
      const offsetTop = viewport?.offsetTop ?? 0;
      const keyboardInset = Math.max(0, window.innerHeight - height - offsetTop);
      root.style.setProperty("--app-height", `${Math.round(height)}px`);
      root.style.setProperty("--visual-offset-top", `${Math.round(offsetTop)}px`);
      root.style.setProperty("--keyboard-inset", `${Math.round(keyboardInset)}px`);
      root.classList.toggle("keyboard-open", keyboardInset > 120);
      root.classList.toggle("standalone-app", window.matchMedia("(display-mode: standalone)").matches);
    };

    const keepFieldVisible = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || !target.matches(EDITABLE_SELECTOR)) return;
      window.setTimeout(() => target.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" }), 180);
    };

    updateViewport();
    viewport?.addEventListener("resize", updateViewport);
    viewport?.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);
    document.addEventListener("focusin", keepFieldVisible);

    return () => {
      viewport?.removeEventListener("resize", updateViewport);
      viewport?.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
      document.removeEventListener("focusin", keepFieldVisible);
      root.classList.remove("keyboard-open", "standalone-app");
    };
  }, []);

  return null;
}
