export type AnatomyChapter = {
  roman: string;
  slug: string;
  title: string;
};

// Die Kapitelbezeichnungen entsprechen der vom Auftraggeber bestätigten
// Hauptgliederung. Detailinhalte werden erst ergänzt, sobald die Quelldatei
// Anatomie_Skriptum.pdf tatsächlich lesbare Daten enthält.
export const anatomyChapters: AnatomyChapter[] = [
  { roman: "I", slug: "einfuehrung", title: "Einführung in die Anatomie" },
  { roman: "II", slug: "zellulaere-anatomie", title: "Zelluläre Anatomie" },
  { roman: "III", slug: "skelettsystem", title: "Skelettsystem" },
  { roman: "IV", slug: "muskel-bewegungssystem", title: "Muskel- und Bewegungssystem" },
  { roman: "V", slug: "nervensystem", title: "Nervensystem" },
  { roman: "VI", slug: "herz-kreislauf-system", title: "Herz-Kreislauf-System" },
  { roman: "VII", slug: "atmungssystem", title: "Atmungssystem" },
  { roman: "VIII", slug: "verdauungssystem", title: "Verdauungssystem" },
  { roman: "IX", slug: "nieren-harnwege", title: "Nieren und ableitende Harnwege" },
  { roman: "X", slug: "geschlechtsorgane", title: "Geschlechtsorgane" },
  { roman: "XI", slug: "endokrines-system", title: "Endokrines System" },
  { roman: "XII", slug: "sinnesorgane", title: "Sinnesorgane" },
  { roman: "XIII", slug: "immunsystem", title: "Immunsystem" },
];
