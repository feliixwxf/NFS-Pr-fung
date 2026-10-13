import { rechtskundeFlashcards, rechtskundeQuestions } from "./rechtskunde-data";
import { kommunikationFlashcards, kommunikationQuestions } from "./kommunikation-data";
import { organisationFlashcards, organisationQuestions } from "./organisation-data";
import { qmFlashcards, qmQuestions } from "./qm-data";
import { terminologyFlashcards, terminologyQuestions } from "./terminologie-data";
import { diagnostikFlashcards, diagnostikQuestions } from "./diagnostik-data";
import { hygieneFlashcards, hygieneQuestions } from "./hygiene-data";
import { hyperventilationFlashcards, hyperventilationQuestions } from "./hyperventilation-data";
import { geburtFlashcards, geburtQuestions } from "./geburt-data";
import { abdominaltraumaFlashcards, abdominaltraumaQuestions } from "./abdominaltrauma-data";
import { thoraxtraumaFlashcards, thoraxtraumaQuestions } from "./thoraxtrauma-data";
import { gallensteinkolikFlashcards, gallensteinkolikQuestions } from "./gallensteinkolik-data";
import { wirbelsaeulentraumaFlashcards, wirbelsaeulentraumaQuestions } from "./wirbelsaeulentrauma-data";
import { extremitaetentraumaFlashcards, extremitaetentraumaQuestions } from "./extremitaetentrauma-data";
import { eugFlashcards, eugQuestions } from "./eug-data";
import { lungenoedemFlashcards, lungenoedemQuestions } from "./lungenoedem-data";
import { rippenfrakturFlashcards, rippenfrakturQuestions } from "./rippenfraktur-data";
import { verbrennungFlashcards, verbrennungQuestions } from "./verbrennung-data";
import { bronchoFlashcards, bronchoQuestions } from "./bronchoobstruktion-data";
import { pneumonieFlashcards, pneumonieQuestions } from "./pneumonie-data";
import { unterkuehlungFlashcards, unterkuehlungQuestions } from "./unterkuehlung-data";
import { krampfanfallFlashcards, krampfanfallQuestions } from "./krampfanfall-data";
import { krampfanfallKindFlashcards, krampfanfallKindQuestions } from "./krampfanfall-kind-data";
import { vorhofflimmernFlashcards, vorhofflimmernQuestions } from "./vorhofflimmern-data";
import { hypertensiverNotfallFlashcards, hypertensiverNotfallQuestions } from "./hypertensiver-notfall-data";
import { pseudokruppEpiglottitisFlashcards, pseudokruppEpiglottitisQuestions } from "./pseudokrupp-epiglottitis-data";
import { anginaPectorisFlashcards, anginaPectorisQuestions } from "./angina-pectoris-data";
import { myokardinfarktFlashcards, myokardinfarktQuestions } from "./myokardinfarkt-data";
import { venenthromboseFlashcards, venenthromboseQuestions } from "./venenthrombose-data";
import { pavkFlashcards, pavkQuestions } from "./pavk-data";
import { opiatintoxikationFlashcards, opiatintoxikationQuestions } from "./opiatintoxikation-data";
import { polytraumaFlashcards, polytraumaQuestions } from "./polytrauma-data";
import { akutesAbdomenFlashcards, akutesAbdomenQuestions } from "./akutes-abdomen-data";
import { pankreatitisFlashcards, pankreatitisQuestions } from "./pankreatitis-data";
import { ulkusblutungFlashcards, ulkusblutungQuestions } from "./ulkusblutung-data";
import { schussverletzungFlashcards, schussverletzungQuestions } from "./schussverletzung-data";
import { stichverletzungFlashcards, stichverletzungQuestions } from "./stichverletzung-data";
import { explosionsverletzungFlashcards, explosionsverletzungQuestions } from "./explosionsverletzung-data";
import { amputationsverletzungFlashcards, amputationsverletzungQuestions } from "./amputationsverletzung-data";
import { alkoholintoxikationFlashcards, alkoholintoxikationQuestions } from "./alkoholintoxikation-data";
import { instabileBradykardieFlashcards, instabileBradykardieQuestions } from "./instabile-bradykardie-data";
import { herzrhythmusstoerungenFlashcards, herzrhythmusstoerungenQuestions } from "./herzrhythmusstoerungen-data";
import { herzbeuteltamponadeFlashcards, herzbeuteltamponadeQuestions } from "./herzbeuteltamponade-data";
import { elektrounfallFlashcards, elektrounfallQuestions } from "./elektrounfall-data";
import { beckentraumaFlashcards, beckentraumaQuestions } from "./beckentrauma-data";
import { barotraumaFlashcards, barotraumaQuestions } from "./barotrauma-data";
import { anaphylaxieFlashcards, anaphylaxieQuestions } from "./anaphylaxie-data";
import { schockFlashcards, schockQuestions } from "./schock-data";
import { medications } from "./medication-effects-library";
import { medicationCases, medicationRules } from "./lib/medicationData";

type FlashcardLike = { id: string; area: string; question: string; answer: string };
type ChoiceLike = { id: string; prompt: string; options: Array<{ text: string; correct?: boolean }>; source: string; difficulty: number };

export type TutorQuestionImage = { src: string; alt: string; caption: string };
export type FreeTutorKnowledge = FlashcardLike & { topic: string; href?: string; image?: TutorQuestionImage };

const writtenRoutes: Record<string, string> = {
  "Rechtskunde": "/schriftlich/rechtskunde",
  "Kommunikation": "/schriftlich/kommunikation",
  "Organisation und Einsatztaktik": "/schriftlich/organisation",
  "Qualitätsmanagement": "/schriftlich/qualitaetsmanagement",
  "Terminologie": "/schriftlich/terminologie",
  "Medizinische Diagnostik": "/schriftlich/diagnostik",
  "Hygiene und Infektionsschutz": "/schriftlich/hygiene",
};

const oralRoutes: Record<string, string> = {
  "Hyperventilation": "hyperventilation", "Geburt": "geburt", "Abdominaltrauma": "abdominaltrauma", "Thoraxtrauma": "thoraxtrauma",
  "Gallensteinkolik": "gallensteinkolik", "Wirbelsäulentrauma": "wirbelsaeulentrauma", "Extremitätentrauma": "extremitaetentrauma",
  "Extrauteringravidität": "eug", "Lungenödem": "lungenoedem", "Rippenfraktur": "rippenfraktur", "Verbrennung": "verbrennung",
  "Asthma und COPD": "asthma", "Pneumonie": "pneumonie", "Unterkühlung": "unterkuehlung", "Krampfanfall Erwachsener": "krampfanfall",
  "Krampfanfall Kind": "krampfanfall-kind", "Vorhofflimmern": "vorhofflimmern", "Hypertensiver Notfall": "thema-14",
  "Pseudokrupp und Epiglottitis": "pseudokrupp-epiglottitis", "Angina pectoris": "angina-pectoris", "Myokardinfarkt": "myokardinfarkt",
  "Venenthrombose": "venenthrombose", "pAVK": "pavk", "Opiatintoxikation": "opiatintoxikation", "Polytrauma": "polytrauma",
  "Akutes Abdomen": "akutes-abdomen", "Akute Pankreatitis": "akute-pankreatitis", "Ulkusblutung": "ulkusblutung",
  "Schussverletzung": "schussverletzung", "Stichverletzung": "stichverletzung", "Explosionsverletzung": "explosionsverletzung",
  "Amputationsverletzung": "amputationsverletzung", "Alkoholintoxikation": "alkoholintoxikation", "Instabile Bradykardie": "instabile-bradykardie",
  "Herzrhythmusstörungen": "herzrhythmusstoerungen", "Herzbeuteltamponade": "herzbeuteltamponade", "Elektrounfall": "elektrounfall",
  "Beckentrauma": "beckentrauma", "Barotrauma": "barotrauma", "Anaphylaxie": "anaphylaxie", "Schock": "schock",
};

function learningRoute(topic: string) {
  if (writtenRoutes[topic]) return writtenRoutes[topic];
  if (topic.startsWith("Medikament ·")) return "/medikamentenwirkung";
  if (topic.startsWith("Medikamentenrechnen ·")) return "/medikamentenrechnen";
  return oralRoutes[topic] ? `/muendlich/${oralRoutes[topic]}` : undefined;
}

const datasets: Array<[string, readonly FlashcardLike[]]> = [
  ["Rechtskunde", rechtskundeFlashcards],
  ["Kommunikation", kommunikationFlashcards],
  ["Organisation und Einsatztaktik", organisationFlashcards],
  ["Qualitätsmanagement", qmFlashcards],
  ["Terminologie", terminologyFlashcards],
  ["Medizinische Diagnostik", diagnostikFlashcards],
  ["Hygiene und Infektionsschutz", hygieneFlashcards],
  ["Hyperventilation", hyperventilationFlashcards],
  ["Geburt", geburtFlashcards],
  ["Abdominaltrauma", abdominaltraumaFlashcards],
  ["Thoraxtrauma", thoraxtraumaFlashcards],
  ["Gallensteinkolik", gallensteinkolikFlashcards],
  ["Wirbelsäulentrauma", wirbelsaeulentraumaFlashcards],
  ["Extremitätentrauma", extremitaetentraumaFlashcards],
  ["Extrauteringravidität", eugFlashcards],
  ["Lungenödem", lungenoedemFlashcards],
  ["Rippenfraktur", rippenfrakturFlashcards],
  ["Verbrennung", verbrennungFlashcards],
  ["Asthma und COPD", bronchoFlashcards],
  ["Pneumonie", pneumonieFlashcards],
  ["Unterkühlung", unterkuehlungFlashcards],
  ["Krampfanfall Erwachsener", krampfanfallFlashcards],
  ["Krampfanfall Kind", krampfanfallKindFlashcards],
  ["Vorhofflimmern", vorhofflimmernFlashcards],
  ["Hypertensiver Notfall", hypertensiverNotfallFlashcards],
  ["Pseudokrupp und Epiglottitis", pseudokruppEpiglottitisFlashcards],
  ["Angina pectoris", anginaPectorisFlashcards],
  ["Myokardinfarkt", myokardinfarktFlashcards],
  ["Venenthrombose", venenthromboseFlashcards],
  ["pAVK", pavkFlashcards],
  ["Opiatintoxikation", opiatintoxikationFlashcards],
  ["Polytrauma", polytraumaFlashcards],
  ["Akutes Abdomen", akutesAbdomenFlashcards],
  ["Akute Pankreatitis", pankreatitisFlashcards],
  ["Ulkusblutung", ulkusblutungFlashcards],
  ["Schussverletzung", schussverletzungFlashcards],
  ["Stichverletzung", stichverletzungFlashcards],
  ["Explosionsverletzung", explosionsverletzungFlashcards],
  ["Amputationsverletzung", amputationsverletzungFlashcards],
  ["Alkoholintoxikation", alkoholintoxikationFlashcards],
  ["Instabile Bradykardie", instabileBradykardieFlashcards],
  ["Herzrhythmusstörungen", herzrhythmusstoerungenFlashcards],
  ["Herzbeuteltamponade", herzbeuteltamponadeFlashcards],
  ["Elektrounfall", elektrounfallFlashcards],
  ["Beckentrauma", beckentraumaFlashcards],
  ["Barotrauma", barotraumaFlashcards],
  ["Anaphylaxie", anaphylaxieFlashcards],
  ["Schock", schockFlashcards],
];

export const freeTutorKnowledge: FreeTutorKnowledge[] = datasets.flatMap(([topic, cards]) =>
  cards.map((card) => ({ ...card, topic, href: learningRoute(topic) })),
);

const questionDatasets: Array<[string, readonly ChoiceLike[]]> = [
  ["Rechtskunde", rechtskundeQuestions], ["Kommunikation", kommunikationQuestions], ["Organisation und Einsatztaktik", organisationQuestions],
  ["Qualitätsmanagement", qmQuestions], ["Terminologie", terminologyQuestions], ["Medizinische Diagnostik", diagnostikQuestions], ["Hygiene und Infektionsschutz", hygieneQuestions],
  ["Hyperventilation", hyperventilationQuestions], ["Geburt", geburtQuestions], ["Abdominaltrauma", abdominaltraumaQuestions], ["Thoraxtrauma", thoraxtraumaQuestions],
  ["Gallensteinkolik", gallensteinkolikQuestions], ["Wirbelsäulentrauma", wirbelsaeulentraumaQuestions], ["Extremitätentrauma", extremitaetentraumaQuestions],
  ["Extrauteringravidität", eugQuestions], ["Lungenödem", lungenoedemQuestions], ["Rippenfraktur", rippenfrakturQuestions], ["Verbrennung", verbrennungQuestions],
  ["Asthma und COPD", bronchoQuestions], ["Pneumonie", pneumonieQuestions], ["Unterkühlung", unterkuehlungQuestions], ["Krampfanfall Erwachsener", krampfanfallQuestions],
  ["Krampfanfall Kind", krampfanfallKindQuestions], ["Vorhofflimmern", vorhofflimmernQuestions], ["Hypertensiver Notfall", hypertensiverNotfallQuestions],
  ["Pseudokrupp und Epiglottitis", pseudokruppEpiglottitisQuestions], ["Angina pectoris", anginaPectorisQuestions], ["Myokardinfarkt", myokardinfarktQuestions],
  ["Venenthrombose", venenthromboseQuestions], ["pAVK", pavkQuestions], ["Opiatintoxikation", opiatintoxikationQuestions], ["Polytrauma", polytraumaQuestions],
  ["Akutes Abdomen", akutesAbdomenQuestions], ["Akute Pankreatitis", pankreatitisQuestions], ["Ulkusblutung", ulkusblutungQuestions],
  ["Schussverletzung", schussverletzungQuestions], ["Stichverletzung", stichverletzungQuestions], ["Explosionsverletzung", explosionsverletzungQuestions],
  ["Amputationsverletzung", amputationsverletzungQuestions], ["Alkoholintoxikation", alkoholintoxikationQuestions], ["Instabile Bradykardie", instabileBradykardieQuestions],
  ["Herzrhythmusstörungen", herzrhythmusstoerungenQuestions], ["Herzbeuteltamponade", herzbeuteltamponadeQuestions], ["Elektrounfall", elektrounfallQuestions],
  ["Beckentrauma", beckentraumaQuestions], ["Barotrauma", barotraumaQuestions], ["Anaphylaxie", anaphylaxieQuestions], ["Schock", schockQuestions],
];

const multipleChoiceKnowledge: FreeTutorKnowledge[] = questionDatasets.flatMap(([topic, questions]) => questions.map((question) => {
  const correct = question.options.filter((option) => option.correct).map((option) => `• ${option.text}`).join("\n");
  return {
    id: `mc-${question.id}`,
    topic,
    area: `Multiple Choice · Schwierigkeit ${question.difficulty}`,
    question: question.prompt,
    answer: `${correct}\n\nBegründung: ${question.source}`,
    href: learningRoute(topic),
  };
}));

const medicationKnowledge: FreeTutorKnowledge[] = medications.map((item, index) => ({
  id: `med-effect-${index + 1}`,
  topic: `Medikament · ${item.name}`,
  area: item.group,
  question: `Erkläre ${item.name}: Wirkung, Wechselwirkungen, Kontraindikationen, Nebenwirkungen und Zubereitung.`,
  answer: [
    `Wirkung: ${item.effect}`,
    `Wechselwirkungen: ${item.interactions}`,
    `Kontraindikationen: ${item.contraindications}`,
    item.precautions ? `Vorsicht: ${item.precautions}` : "",
    item.monitoring ? `Überwachung: ${item.monitoring}` : "",
    `Nebenwirkungen: ${item.sideEffects}`,
    item.preparation ? `Dosierung und Zubereitung: ${item.preparation.dose}; ${item.preparation.route}. ${item.preparation.concentration ? `Konzentration: ${item.preparation.concentration}.` : ""} ${item.preparation.note || ""}` : "",
  ].filter(Boolean).join("\n"),
  href: "/medikamentenwirkung",
}));

const medicationRuleKnowledge: FreeTutorKnowledge[] = medicationRules.map((rule) => ({
  id: `med-rule-${rule.id}`,
  topic: `Medikamentenrechnen · ${rule.drug}`,
  area: `${rule.group} · ${rule.indication}`,
  question: `Welche Rechenregel gilt für ${rule.drug} bei ${rule.indication}?`,
  answer: `Applikation: ${rule.route}. Regel: ${rule.parameter}.${rule.concentration ? ` Konzentration: ${rule.concentration}.` : ""}${rule.repeat ? ` Wiederholung: ${rule.repeat}.` : ""}${rule.singleMaximum ? ` Einzelhöchstdosis: ${rule.singleMaximum}.` : ""}${rule.cumulativeMaximum ? ` Gesamthöchstdosis: ${rule.cumulativeMaximum}.` : ""}`,
  href: "/medikamentenrechnen",
}));

const medicationCaseKnowledge: FreeTutorKnowledge[] = medicationCases.map((item) => ({
  id: `med-case-${item.id}`,
  topic: `Medikamentenrechnen · ${item.title}`,
  area: `${item.group} · ${item.category}`,
  question: `${item.text} ${item.question}`,
  answer: `${item.answers.map((answer) => `${answer.label}: ${String(answer.value).replace(".", ",")} ${answer.unit} (${answer.calculation})`).join("\n")}\nMerke: ${item.hint}`,
  href: "/medikamentenrechnen",
}));

const imageKnowledge: FreeTutorKnowledge[] = [
  { id: "image-av-block", topic: "Instabile Bradykardie", area: "EKG-Bildfrage", question: "Ordne die dargestellten AV-Blöcke ein und nenne für Grad I, Grad II Typ Wenckebach/Mobitz und Grad III das entscheidende EKG-Merkmal.", answer: "AV-Block I: Jede P-Welle wird übergeleitet, die PQ-Zeit ist konstant verlängert (> 200 ms).\nAV-Block II Typ Wenckebach: Die PQ-Zeit verlängert sich zunehmend, bis ein QRS-Komplex ausfällt.\nAV-Block II Typ Mobitz: Die PQ-Zeit bleibt konstant, plötzlich fällt ein QRS-Komplex aus.\nAV-Block III: P-Wellen und QRS-Komplexe laufen vollständig unabhängig voneinander; Vorhof und Kammer sind dissoziiert.", href: "/muendlich/instabile-bradykardie", image: { src: "/lessons/instabile-bradykardie/av-block-ekg-uebersicht.png", alt: "EKG-Übersicht der AV-Blöcke", caption: "EKG-Lernvergleich: AV-Blockierungen" } },
  { id: "image-vorhofflimmern", topic: "Vorhofflimmern", area: "EKG-Bildfrage", question: "Welche Rhythmusstörung zeigt der EKG-Streifen und an welchen zwei Leitsymptomen im EKG erkennst du sie?", answer: "Vorhofflimmern. Typisch sind fehlende eindeutig abgrenzbare P-Wellen und absolut unregelmäßige RR-Abstände (absolute Arrhythmie).", href: "/muendlich/vorhofflimmern", image: { src: "/lessons/vorhofflimmern/vorhofflimmern-ekg.jpg", alt: "EKG bei Vorhofflimmern", caption: "EKG-Streifen beurteilen" } },
  { id: "image-erregungsleitung", topic: "Herzrhythmusstörungen", area: "Anatomie-Bildfrage", question: "Beschreibe anhand der Abbildung den physiologischen Weg der Erregungsleitung durch das Herz.", answer: "Sinusknoten → Vorhofmyokard → AV-Knoten mit physiologischer Verzögerung → His-Bündel → rechter und linker Tawara-Schenkel → Purkinje-Fasern → Kammermyokard.", href: "/muendlich/herzrhythmusstoerungen", image: { src: "/lessons/vorhofflimmern/erregungsleitung.png", alt: "Erregungsleitungssystem des Herzens", caption: "Anatomie: kardiales Reizleitungssystem" } },
  { id: "image-gefaesse", topic: "Venenthrombose", area: "Anatomie-Bildfrage", question: "Vergleiche Arterie und Vene anhand der Abbildung: Wandaufbau, Druckverhältnisse und Transportmechanismus.", answer: "Arterien besitzen eine kräftigere Tunica media und transportieren Blut unter höherem Druck vom Herzen weg. Venen haben dünnere Wände, ein größeres Lumen und führen Blut zum Herzen zurück; Venenklappen, Muskelpumpe, Atempumpe und der Sog des Herzens unterstützen den Rückstrom.", href: "/muendlich/venenthrombose", image: { src: "/lessons/venenthrombose/vene-arterie-beschriftet.png", alt: "Beschrifteter Vergleich von Arterie und Vene", caption: "Gefäßanatomie vergleichen" } },
  { id: "image-willis", topic: "Apoplex", area: "Anatomie-Bildfrage", question: "Welche Struktur ist dargestellt und weshalb ist sie für die zerebrale Blutversorgung klinisch bedeutsam?", answer: "Dargestellt ist der Circulus arteriosus cerebri (Willis-Kreis). Er verbindet die vordere und hintere sowie beide seitlichen Hirnkreisläufe und kann bei Gefäßengstellen begrenzt eine kollaterale Blutversorgung ermöglichen.", href: "/muendlich/apoplex", image: { src: "/lessons/apoplexie/willis-kreis-beschriftet.png", alt: "Beschrifteter Circulus arteriosus cerebri", caption: "Hirngefäße: Willis-Kreis" } },
  { id: "image-acs-regionen", topic: "Myokardinfarkt", area: "EKG-Bildfrage", question: "Ordne die EKG-Ableitungsgruppen den betroffenen Herzregionen zu.", answer: "Inferior: II, III, aVF. Lateral: I, aVL, V5–V6. Septal: V1–V2. Anterior: V3–V4. Eine Beurteilung erfolgt immer im klinischen Kontext und anhand benachbarter Ableitungen.", href: "/muendlich/myokardinfarkt", image: { src: "/lessons/acs/acs-ekg-regionen.png", alt: "Zuordnung der EKG-Ableitungen zu Herzregionen", caption: "12-Kanal-EKG: Herzregionen" } },
  { id: "image-heart-anatomy", topic: "Akutes Koronarsyndrom", area: "Anatomie-Bildfrage", question: "Beschreibe anhand der Abbildung den Blutweg durch die vier Herzhöhlen und nenne die jeweils passierten Herzklappen.", answer: "Vena cava → rechter Vorhof → Trikuspidalklappe → rechter Ventrikel → Pulmonalklappe → Lungenarterien → Lunge → Lungenvenen → linker Vorhof → Mitralklappe → linker Ventrikel → Aortenklappe → Aorta. Die Klappen sichern dabei den gerichteten Blutstrom.", href: "/muendlich/acs", image: { src: "/lessons/acs/herz-anatomie.png", alt: "Anatomie des Herzens mit Herzhöhlen und großen Gefäßen", caption: "Blutweg durch das Herz" } },
  { id: "image-coronary", topic: "Myokardinfarkt", area: "Anatomie-Bildfrage", question: "Welche Gefäße versorgen den Herzmuskel und warum kann ein Verschluss schnell lebensbedrohlich werden?", answer: "Die Koronararterien entspringen unmittelbar aus der Aorta. Die linke Koronararterie teilt sich vor allem in RIVA/LAD und RCX; die rechte Koronararterie versorgt unter anderem Anteile der rechten und inferioren Herzwand. Ein akuter Verschluss verursacht Ischämie, elektrische Instabilität, Pumpversagen und bei anhaltender Minderperfusion eine Myokardnekrose.", href: "/muendlich/myokardinfarkt", image: { src: "/lessons/acs/koronargefaesse.png", alt: "Koronargefäße des Herzens", caption: "Koronare Blutversorgung" } },
  { id: "image-airways", topic: "Hyperventilation", area: "Anatomie-Bildfrage", question: "Verfolge den Weg der Atemluft von Mund oder Nase bis zum Ort des Gasaustauschs.", answer: "Nase oder Mund → Pharynx → Larynx → Trachea → Hauptbronchien → kleinere Bronchien → Bronchiolen → Alveolen. Erst an der alveolokapillären Membran findet der eigentliche Gasaustausch von Sauerstoff und Kohlendioxid statt.", href: "/muendlich/hyperventilation", image: { src: "/lessons/hyperventilation/atemwege-lunge.jpg", alt: "Beschriftete Atemwege und Lunge", caption: "Weg der Atemluft" } },
  { id: "image-alveoli", topic: "Lungenödem", area: "Pathophysiologie-Bildfrage", question: "Erkläre an der Abbildung die Funktion von Surfactant und die Folgen eines alveolären Lungenödems.", answer: "Surfactant senkt die Oberflächenspannung und vermindert den Kollaps der Alveolen. Beim alveolären Ödem tritt Flüssigkeit in den Gasaustauschraum: Die Diffusionsstrecke nimmt zu, belüftete Fläche geht verloren, die Compliance sinkt und es entstehen Hypoxämie, Dyspnoe und häufig feinblasige Rasselgeräusche.", href: "/muendlich/lungenoedem", image: { src: "/lessons/lungenoedem/alveolen-surfactant.jpg", alt: "Alveolen mit Surfactant und Kapillaren", caption: "Alveole und Gasaustausch" } },
  { id: "image-pancreas", topic: "Hypoglykämie", area: "Anatomie-Bildfrage", question: "Welche endokrinen Zelltypen des Pankreas sind für die Blutzuckerregulation besonders wichtig?", answer: "Beta-Zellen bilden Insulin und senken den Blutzucker, vor allem durch Glukoseaufnahme und Speicherung. Alpha-Zellen bilden Glukagon und erhöhen den Blutzucker durch Glykogenolyse und Glukoneogenese. Delta-Zellen bilden Somatostatin und modulieren unter anderem die Freisetzung beider Hormone.", href: "/muendlich/hypoglykaemie", image: { src: "/lessons/hypoglykaemie/pankreas-anatomie.png", alt: "Anatomie des Pankreas", caption: "Pankreas: exokriner und endokriner Anteil" } },
  { id: "image-gallways", topic: "Gallensteinkolik", area: "Anatomie-Bildfrage", question: "Beschreibe den Abflussweg der Galle und erkläre, wie ein Stein eine akute Pankreatitis auslösen kann.", answer: "Die Galle fließt aus den Lebergängen über den Ductus hepaticus communis; die Gallenblase ist über den Ductus cysticus angeschlossen. Über den Ductus choledochus gelangt die Galle zur Papilla Vateri ins Duodenum. Verlegt ein Stein den gemeinsamen Mündungsbereich von Gallen- und Pankreasgang, kann Pankreassekret nicht abfließen. Vorzeitig aktivierte Enzyme können dann eine Selbstverdauung des Pankreas auslösen.", href: "/muendlich/gallensteinkolik", image: { src: "/lessons/gallensteinkolik/anatomie-gallenwege.jpg", alt: "Anatomie von Leber, Gallenwegen und Pankreas", caption: "Gallenwege und Pankreasgang" } },
  { id: "image-pelvis", topic: "Beckentrauma", area: "Anatomie-Bildfrage", question: "Welche knöchernen Strukturen bilden den Beckenring und warum können instabile Beckenverletzungen zu einem schweren Schock führen?", answer: "Der Beckenring wird aus Kreuzbein sowie den paarigen Darm-, Sitz- und Schambeinen mit Iliosakralgelenken und Symphyse gebildet. Bei instabiler Fraktur können venöse Plexus, knöcherne Flächen und größere Gefäße stark bluten. Im Becken kann sich unbemerkt ein großes Blutvolumen sammeln; deshalb sind frühe Stabilisierung, Wärmeerhalt und Schockbehandlung entscheidend.", href: "/muendlich/beckentrauma", image: { src: "/lessons/beckentrauma/becken-anterior.png", alt: "Beckenanatomie von vorn", caption: "Knöcherner Beckenring" } },
  { id: "image-brain-lobes", topic: "Krampfanfall", area: "Anatomie-Bildfrage", question: "Ordne den vier Großhirnlappen jeweils eine zentrale Funktion zu und erkläre, warum fokale Anfälle unterschiedliche Symptome verursachen.", answer: "Frontallappen: Motorik, Planung und Verhalten. Parietallappen: Körperwahrnehmung und räumliche Verarbeitung. Temporallappen: Hören und Gedächtnis. Okzipitallappen: Sehen. Bei einem fokalen Anfall bestimmen Ursprungsort und Ausbreitung der überschießenden elektrischen Aktivität, ob zum Beispiel motorische, sensible, visuelle oder psychische Symptome auftreten.", href: "/muendlich/krampfanfall", image: { src: "/lessons/krampfanfall/gehirnlappen.jpg", alt: "Beschriftete Lappen des Großhirns", caption: "Großhirnlappen und Funktionen" } },
  { id: "image-neuron", topic: "Krampfanfall", area: "Physiologie-Bildfrage", question: "Beschreibe den Weg eines elektrischen Signals durch ein Neuron bis zur nächsten Nervenzelle.", answer: "Dendriten nehmen Signale auf, der Zellkörper integriert sie und am Axonhügel entsteht bei überschrittener Schwelle ein Aktionspotenzial. Dieses läuft über das Axon zu den Endknöpfchen. Dort werden Neurotransmitter in den synaptischen Spalt freigesetzt, binden an Rezeptoren der Folgezelle und wirken erregend oder hemmend.", href: "/muendlich/krampfanfall", image: { src: "/lessons/krampfanfall/neuron-axon-synapse.jpg", alt: "Neuron mit Dendriten, Zellkörper, Axon und Synapse", caption: "Reizleitung im Neuron" } },
  { id: "image-skin", topic: "Verbrennung", area: "Anatomie-Bildfrage", question: "Benenne die Hautschichten und leite daraus ab, warum tiefe Verbrennungen trotz schwerer Schädigung weniger schmerzhaft sein können.", answer: "Von außen nach innen: Epidermis, Dermis und Subcutis. In der Dermis liegen zahlreiche sensible Nervenendigungen, Gefäße und Hautanhangsgebilde. Bei tiefen Verbrennungen werden Schmerzrezeptoren und Nervenfasern zerstört; deshalb kann das Zentrum einer schweren Verbrennung weniger schmerzen als der Randbereich. Schmerzarmut ist daher kein Entwarnungszeichen.", href: "/muendlich/verbrennung", image: { src: "/lessons/verbrennung/haut-print14.png", alt: "Querschnitt durch die Haut", caption: "Hautschichten und thermische Schädigung" } },
  { id: "image-nine-rule", topic: "Verbrennung", area: "Diagnostik-Bildfrage", question: "Wozu dient die Neunerregel und welche wichtigen Grenzen musst du bei ihrer Anwendung beachten?", answer: "Die Neunerregel schätzt beim Erwachsenen schnell den prozentualen Anteil der verbrannten Körperoberfläche. Für Kinder sind altersangepasste Schemata wie Lund-Browder geeigneter, weil sich die Körperproportionen unterscheiden. Kleine Areale können näherungsweise mit der Handfläche des Patienten einschließlich Finger als ungefähr 1 % abgeschätzt werden. Oberflächliche reine Rötungen werden nicht wie relevante tiefe Verbrennungsflächen mitgerechnet.", href: "/muendlich/verbrennung", image: { src: "/lessons/verbrennung/neunerregel.png", alt: "Neunerregel zur Abschätzung der verbrannten Körperoberfläche", caption: "Verbrennungsfläche abschätzen" } },
  { id: "image-epiglottitis", topic: "Pseudokrupp und Epiglottitis", area: "Diagnostik-Bildfrage", question: "Welcher typische Röntgenhinweis passt zu einer Epiglottitis und wie grenzt du sie klinisch vom Pseudokrupp ab?", answer: "Bei der Epiglottitis kann seitlich ein verdickter Kehldeckel als Thumb Sign auffallen. Klinisch sprechen hohes Fieber, schwer krankes Kind, Speichelfluss, kloßige Sprache und fehlender bellender Husten dafür. Pseudokrupp zeigt typischerweise bellenden Husten, Heiserkeit und inspiratorischen Stridor; im Röntgen kann sich eine subglottische Verengung als Steeple Sign zeigen. Bei Epiglottitis keine provozierende Racheninspektion.", href: "/muendlich/pseudokrupp-epiglottitis", image: { src: "/lessons/pseudokrupp-epiglottitis/epiglottitis-roentgen.jpg", alt: "Seitliche Röntgenaufnahme bei Epiglottitis", caption: "Epiglottitis: typischer Röntgenhinweis" } },
  { id: "image-vfa-decompression", topic: "Thoraxtrauma", area: "VFA-Bildfrage", question: "Nenne die präklinische Indikation zur Entlastungspunktion, die beiden gebräuchlichen Punktionsorte und die Sicherheitsregel an der Rippe.", answer: "Entscheidend ist der klinische Verdacht auf Spannungspneumothorax, besonders nach Thoraxtrauma mit einseitig abgeschwächtem oder fehlendem Atemgeräusch und hämodynamischer oder respiratorischer Instabilität. Monaldi: 2. Interkostalraum medioklavikular. Bülau: 4.–5. Interkostalraum im Bereich der vorderen bis mittleren Axillarlinie. Punktiert wird unmittelbar über dem Oberrand der unteren Rippe, weil Gefäß-Nerven-Bündel am Unterrand verlaufen. Danach sofort Wirkung und Komplikationen reevaluieren.", href: "/muendlich/thoraxtrauma", image: { src: "/lessons/thoraxtrauma/vfa-entlastungspunktion-07.png", alt: "VFA Entlastungspunktion beim Spannungspneumothorax", caption: "VFA 07: Entlastungspunktion" } },
  { id: "image-vfa-tourniquet", topic: "Amputationsverletzung", area: "VFA-Bildfrage", question: "Wann ist ein Tourniquet indiziert und welche Punkte sind bei der Anlage prüfungsentscheidend?", answer: "Indikation ist eine lebensbedrohliche Extremitätenblutung, die mit einfacheren Maßnahmen nicht rasch kontrolliert werden kann, oder eine Lage, in der direkte Blutstillung nicht sicher möglich ist. Das Tourniquet wird etwa 5–10 cm proximal der Wunde, nicht über einem Gelenk und nicht über dem Fibulaköpfchen angelegt. Es wird bis zum vollständigen Blutungsstopp festgezogen, sichtbar belassen, nicht wieder gelockert und die Anlagezeit wird dokumentiert.", href: "/muendlich/amputationsverletzung", image: { src: "/lessons/amputationsverletzung/vfa-tourniquet-31.png", alt: "VFA Tourniquet-Anlage", caption: "VFA 31: Tourniquet" } },
  { id: "image-vfa-pelvic-binder", topic: "Beckentrauma", area: "VFA-Bildfrage", question: "Bei welcher Befundkonstellation ist die Beckenschlinge angezeigt und wo wird sie anatomisch korrekt positioniert?", answer: "Sie ist bei Verdacht auf instabile Beckenringverletzung mit hämodynamischer Instabilität angezeigt. Die Schlinge liegt auf Höhe der Trochanteren, nicht auf dem Beckenkamm. Nach der Anlage werden Durchblutung, Motorik und Sensibilität kontrolliert; die Schlinge wird präklinisch nicht wieder geöffnet. Eine isolierte Schenkelhalsfraktur allein ist keine Indikation.", href: "/muendlich/beckentrauma", image: { src: "/lessons/polytrauma/vfa-beckenschlinge-32.png", alt: "VFA zur Anlage einer Beckenschlinge", caption: "VFA 32: Beckenschlinge" } },
  { id: "image-vfa-cpap", topic: "Lungenödem", area: "VFA-Bildfrage", question: "Erkläre bei CPAP/ASB die Funktionen von PEEP und ASB sowie zentrale Voraussetzungen für eine sichere Anwendung.", answer: "PEEP hält durch einen positiven Druck am Ende der Exspiration Alveolen offen, verbessert die funktionelle Residualkapazität und kann beim kardialen Lungenödem Vor- und Nachlast senken. ASB unterstützt jeden spontanen Atemzug inspiratorisch und reduziert die Atemarbeit. Voraussetzungen sind ausreichende Spontanatmung, erhaltene Schutzreflexe, Kooperation und ein dicht sitzendes Interface. Fehlende Schutzreflexe, Erbrechen, schwere Bewusstseinsstörung oder fehlende Mitarbeit sprechen gegen die nichtinvasive Anwendung.", href: "/muendlich/lungenoedem", image: { src: "/lessons/lungenoedem/vfa-06-cpap.png", alt: "VFA CPAP und Atemunterstützung", caption: "VFA 06: CPAP/ASB" } },
];

freeTutorKnowledge.push(...multipleChoiceKnowledge, ...medicationKnowledge, ...medicationRuleKnowledge, ...medicationCaseKnowledge, ...imageKnowledge);

export function convertQuestionsToTutorKnowledge(topic: string, questions: readonly ChoiceLike[]): FreeTutorKnowledge[] {
  return questions.map((question) => ({
    id: `mc-${question.id}`,
    topic,
    area: `Multiple Choice · Schwierigkeit ${question.difficulty}`,
    question: question.prompt,
    answer: `${question.options.filter((option) => option.correct).map((option) => `• ${option.text}`).join("\n")}\n\nBegründung: ${question.source}`,
    href: learningRoute(topic),
  }));
}
