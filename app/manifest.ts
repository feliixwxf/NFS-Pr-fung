import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NotSan Prüfung – Sicher ins Staatsexamen",
    short_name: "NotSan Prüfung",
    description: "Interaktive Prüfungsvorbereitung für angehende Notfallsanitäterinnen und Notfallsanitäter.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#f5f3ed",
    theme_color: "#0b2634",
    lang: "de-DE",
    categories: ["education", "medical"],
    shortcuts: [
      { name: "Mündliche Themen", short_name: "Mündlich", url: "/muendlich", icons: [{ src: "/app-icon-192.png", sizes: "192x192", type: "image/png" }] },
      { name: "Schriftliche Themen", short_name: "Schriftlich", url: "/schriftlich", icons: [{ src: "/app-icon-192.png", sizes: "192x192", type: "image/png" }] },
      { name: "Medikamente", short_name: "Medikamente", url: "/medikamentenwirkung", icons: [{ src: "/app-icon-192.png", sizes: "192x192", type: "image/png" }] },
    ],
    icons: [
      { src: "/app-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/app-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/app-icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
