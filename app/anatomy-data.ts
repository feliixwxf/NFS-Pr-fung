export type AnatomyChapter = {
  roman: string;
  slug: string;
  title: string;
  firstPdfPage: number;
  lastPdfPage: number;
  summary: string;
  topics: string[];
  relatedTopicNumbers?: number[];
};

// Die Kapitelbezeichnungen entsprechen der vom Auftraggeber bestätigten
// Hauptgliederung. Detailinhalte werden erst ergänzt, sobald die Quelldatei
// Anatomie_Skriptum.pdf tatsächlich lesbare Daten enthält.
export const anatomyChapters: AnatomyChapter[] = [
  { roman: "I", slug: "einfuehrung", title: "Einführung in die Anatomie", firstPdfPage: 5, lastPdfPage: 9, summary: "Orientierung am Körper und Aufbau der vier Grundgewebe als Basis für alle weiteren Organsysteme.", topics: ["Körperachsen und Ebenen", "Organsysteme", "Epithelgewebe", "Binde- und Stützgewebe", "Muskel- und Nervengewebe"] },
  { roman: "II", slug: "zellulaere-anatomie", title: "Zelluläre Anatomie", firstPdfPage: 10, lastPdfPage: 12, summary: "Aufbau und Funktion der Zelle von der Zellmembran bis zu den Organellen und Transportvorgängen.", topics: ["Zellaufbau", "Zellorganellen", "Zellmembran", "Stofftransport", "Zellteilung"] },
  { roman: "III", slug: "skelettsystem", title: "Skelettsystem", firstPdfPage: 13, lastPdfPage: 21, summary: "Das menschliche Skelett mit Schädel, Wirbelsäule, Thorax, Becken und Extremitäten.", topics: ["Schädel", "Wirbelsäule", "Thorax", "Becken", "Obere und untere Extremität"] },
  { roman: "IV", slug: "muskel-bewegungssystem", title: "Muskel- und Bewegungssystem", firstPdfPage: 22, lastPdfPage: 24, summary: "Muskelarten, Skelettmuskulatur und die funktionelle Zusammenarbeit von Muskeln, Sehnen und Gelenken.", topics: ["Muskelgewebe", "Skelettmuskulatur", "Muskelkontraktion", "Bewegungsapparat"] },
  { roman: "V", slug: "nervensystem", title: "Nervensystem", firstPdfPage: 25, lastPdfPage: 34, summary: "Zentrales, peripheres und vegetatives Nervensystem einschließlich Gehirn, Rückenmark und Hirnnerven.", topics: ["ZNS und PNS", "Gehirn", "Rückenmark", "Hirnnerven", "Vegetatives Nervensystem", "Hirngefäße"] },
  { roman: "VI", slug: "herz-kreislauf-system", title: "Herz-Kreislauf-System", firstPdfPage: 35, lastPdfPage: 38, summary: "Herzanatomie, Erregungsleitung, Gefäße und die Kreisläufe des menschlichen Körpers.", topics: ["Herzaufbau", "Herzklappen", "Erregungsleitung", "Körper- und Lungenkreislauf", "Arterien und Venen"], relatedTopicNumbers: [1, 2, 3, 24] },
  { roman: "VII", slug: "atmungssystem", title: "Atmungssystem", firstPdfPage: 39, lastPdfPage: 42, summary: "Atemwege, Lunge, Pleura sowie Mechanik und Regulation der Atmung.", topics: ["Obere Atemwege", "Untere Atemwege", "Lunge und Pleura", "Atemmechanik", "Gasaustausch"], relatedTopicNumbers: [6, 10, 13, 22] },
  { roman: "VIII", slug: "verdauungssystem", title: "Verdauungssystem", firstPdfPage: 43, lastPdfPage: 51, summary: "Der Gastrointestinaltrakt und seine Anhangsorgane von Mundhöhle bis Rektum.", topics: ["Mund und Speiseröhre", "Magen", "Dünn- und Dickdarm", "Leber und Galle", "Pankreas"] },
  { roman: "IX", slug: "nieren-harnwege", title: "Nieren und ableitende Harnwege", firstPdfPage: 52, lastPdfPage: 54, summary: "Niere, Nephron und ableitende Harnwege mit ihrer Bedeutung für Ausscheidung und Homöostase.", topics: ["Nierenaufbau", "Nephron", "Harnbildung", "Harnleiter", "Harnblase und Harnröhre"], relatedTopicNumbers: [40] },
  { roman: "X", slug: "geschlechtsorgane", title: "Geschlechtsorgane", firstPdfPage: 55, lastPdfPage: 60, summary: "Innere und äußere Geschlechtsorgane sowie ihre anatomischen und funktionellen Zusammenhänge.", topics: ["Weibliche Geschlechtsorgane", "Männliche Geschlechtsorgane", "Keimdrüsen", "Zyklus und Fortpflanzung"] },
  { roman: "XI", slug: "endokrines-system", title: "Endokrines System", firstPdfPage: 61, lastPdfPage: 63, summary: "Hormondrüsen, Regelkreise und zentrale Wirkprinzipien des endokrinen Systems.", topics: ["Hypothalamus und Hypophyse", "Schilddrüse", "Nebennieren", "Pankreas", "Hormonelle Regelkreise"] },
  { roman: "XII", slug: "sinnesorgane", title: "Sinnesorgane", firstPdfPage: 64, lastPdfPage: 70, summary: "Aufbau und Funktion der Sinnesorgane für Sehen, Hören, Gleichgewicht, Geruch, Geschmack und Tastsinn.", topics: ["Auge", "Ohr", "Gleichgewicht", "Geruchs- und Geschmackssinn", "Haut"] },
  { roman: "XIII", slug: "immunsystem", title: "Immunsystem", firstPdfPage: 71, lastPdfPage: 74, summary: "Zellen, Organe und Mechanismen der unspezifischen und spezifischen Immunabwehr.", topics: ["Blut und Abwehrzellen", "Lymphatisches System", "Unspezifische Abwehr", "Spezifische Abwehr", "Antikörper"] },
];
