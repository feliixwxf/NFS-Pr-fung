import { rechtskundeFlashcards } from "./rechtskunde-data";
import { kommunikationFlashcards } from "./kommunikation-data";
import { organisationFlashcards } from "./organisation-data";
import { qmFlashcards } from "./qm-data";
import { terminologyFlashcards } from "./terminologie-data";
import { diagnostikFlashcards } from "./diagnostik-data";
import { hygieneFlashcards } from "./hygiene-data";
import { hyperventilationFlashcards } from "./hyperventilation-data";
import { geburtFlashcards } from "./geburt-data";
import { abdominaltraumaFlashcards } from "./abdominaltrauma-data";
import { thoraxtraumaFlashcards } from "./thoraxtrauma-data";
import { gallensteinkolikFlashcards } from "./gallensteinkolik-data";
import { wirbelsaeulentraumaFlashcards } from "./wirbelsaeulentrauma-data";
import { extremitaetentraumaFlashcards } from "./extremitaetentrauma-data";
import { eugFlashcards } from "./eug-data";
import { lungenoedemFlashcards } from "./lungenoedem-data";
import { rippenfrakturFlashcards } from "./rippenfraktur-data";
import { verbrennungFlashcards } from "./verbrennung-data";
import { bronchoFlashcards } from "./bronchoobstruktion-data";
import { pneumonieFlashcards } from "./pneumonie-data";
import { unterkuehlungFlashcards } from "./unterkuehlung-data";
import { krampfanfallFlashcards } from "./krampfanfall-data";
import { krampfanfallKindFlashcards } from "./krampfanfall-kind-data";
import { vorhofflimmernFlashcards } from "./vorhofflimmern-data";
import { hypertensiverNotfallFlashcards } from "./hypertensiver-notfall-data";
import { pseudokruppEpiglottitisFlashcards } from "./pseudokrupp-epiglottitis-data";
import { anginaPectorisFlashcards } from "./angina-pectoris-data";
import { myokardinfarktFlashcards } from "./myokardinfarkt-data";
import { venenthromboseFlashcards } from "./venenthrombose-data";
import { pavkFlashcards } from "./pavk-data";
import { opiatintoxikationFlashcards } from "./opiatintoxikation-data";
import { polytraumaFlashcards } from "./polytrauma-data";
import { akutesAbdomenFlashcards } from "./akutes-abdomen-data";
import { pankreatitisFlashcards } from "./pankreatitis-data";
import { ulkusblutungFlashcards } from "./ulkusblutung-data";
import { schussverletzungFlashcards } from "./schussverletzung-data";
import { stichverletzungFlashcards } from "./stichverletzung-data";
import { explosionsverletzungFlashcards } from "./explosionsverletzung-data";
import { amputationsverletzungFlashcards } from "./amputationsverletzung-data";
import { alkoholintoxikationFlashcards } from "./alkoholintoxikation-data";
import { instabileBradykardieFlashcards } from "./instabile-bradykardie-data";
import { herzrhythmusstoerungenFlashcards } from "./herzrhythmusstoerungen-data";
import { herzbeuteltamponadeFlashcards } from "./herzbeuteltamponade-data";
import { elektrounfallFlashcards } from "./elektrounfall-data";
import { beckentraumaFlashcards } from "./beckentrauma-data";
import { barotraumaFlashcards } from "./barotrauma-data";
import { anaphylaxieFlashcards } from "./anaphylaxie-data";
import { schockFlashcards } from "./schock-data";

type FlashcardLike = { id: string; area: string; question: string; answer: string };

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
