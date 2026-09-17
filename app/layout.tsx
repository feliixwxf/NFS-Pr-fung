import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3001";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title: "NotSan Prüfung – Sicher ins Staatsexamen",
    description: "Interaktive Prüfungsvorbereitung für angehende Notfallsanitäterinnen und Notfallsanitäter.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
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
