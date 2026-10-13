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

export type FreeTutorKnowledge = FlashcardLike & { topic: string };

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
  cards.map((card) => ({ ...card, topic })),
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
}));

const medicationRuleKnowledge: FreeTutorKnowledge[] = medicationRules.map((rule) => ({
  id: `med-rule-${rule.id}`,
  topic: `Medikamentenrechnen · ${rule.drug}`,
  area: `${rule.group} · ${rule.indication}`,
  question: `Welche Rechenregel gilt für ${rule.drug} bei ${rule.indication}?`,
  answer: `Applikation: ${rule.route}. Regel: ${rule.parameter}.${rule.concentration ? ` Konzentration: ${rule.concentration}.` : ""}${rule.repeat ? ` Wiederholung: ${rule.repeat}.` : ""}${rule.singleMaximum ? ` Einzelhöchstdosis: ${rule.singleMaximum}.` : ""}${rule.cumulativeMaximum ? ` Gesamthöchstdosis: ${rule.cumulativeMaximum}.` : ""}`,
}));

const medicationCaseKnowledge: FreeTutorKnowledge[] = medicationCases.map((item) => ({
  id: `med-case-${item.id}`,
  topic: `Medikamentenrechnen · ${item.title}`,
  area: `${item.group} · ${item.category}`,
  question: `${item.text} ${item.question}`,
  answer: `${item.answers.map((answer) => `${answer.label}: ${String(answer.value).replace(".", ",")} ${answer.unit} (${answer.calculation})`).join("\n")}\nMerke: ${item.hint}`,
}));

freeTutorKnowledge.push(...multipleChoiceKnowledge, ...medicationKnowledge, ...medicationRuleKnowledge, ...medicationCaseKnowledge);

export function convertQuestionsToTutorKnowledge(topic: string, questions: readonly ChoiceLike[]): FreeTutorKnowledge[] {
  return questions.map((question) => ({
    id: `mc-${question.id}`,
    topic,
    area: `Multiple Choice · Schwierigkeit ${question.difficulty}`,
    question: question.prompt,
    answer: `${question.options.filter((option) => option.correct).map((option) => `• ${option.text}`).join("\n")}\n\nBegründung: ${question.source}`,
  }));
}
