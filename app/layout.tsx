import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0b2634",
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3001";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title: "NotSan Prüfung – Sicher ins Staatsexamen",
    applicationName: "NotSan Prüfung",
    description: "Interaktive Prüfungsvorbereitung für angehende Notfallsanitäterinnen und Notfallsanitäter.",
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: "NotSan Prüfung",
      statusBarStyle: "black-translucent",
    },
    formatDetection: { telephone: false },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/app-icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/app-icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      shortcut: "/favicon.svg",
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        { url: "/apple-touch-icon-167.png", sizes: "167x167", type: "image/png" },
      ],
    },
    openGraph: {
      title: "NotSan Prüfung",
      description: "Sicher ins Staatsexamen – mündlich, Multiple Choice und mit Lernfortschritt.",
      type: "website",
      locale: "de_DE",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "NotSan Prüfung – Sicher ins Staatsexamen" }],
    },
    twitter: { card: "summary_large_image", title: "NotSan Prüfung", description: "Sicher ins Staatsexamen.", images: [imageUrl] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body>{children}</body></html>;
}
