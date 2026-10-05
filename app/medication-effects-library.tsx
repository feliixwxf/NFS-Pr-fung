"use client";

import { useEffect, useState } from "react";
import { filterAndSortMedications } from "./lib/medicationFilters";

export type MedicationEffect = {
  id: string;
  areas: MedicationAreaId[];
  name: string;
  aliases?: string[];
  group: string;
  effect: string;
  interactions: string;
  contraindications: string;
  precautions?: string;
  monitoring?: string;
  sideEffects: string;
};

export const medicationAreas = [
  { id: "cardiovascular", label: "Herz und Kreislauf" },
  { id: "airways", label: "Bronchien und Atemwege" },
  { id: "pain", label: "Schmerz und Fieber" },
  { id: "sedation", label: "Sedierung und Krampfanfälle" },
  { id: "coagulation", label: "Blutgerinnung" },
  { id: "allergy", label: "Allergie und Anaphylaxie" },
  { id: "gastrointestinal", label: "Übelkeit und Magen-Darm" },
  { id: "antidotes", label: "Intoxikation und Antidote" },
  { id: "obstetrics", label: "Schwangerschaft und Geburt" },
] as const;
export type MedicationAreaId = typeof medicationAreas[number]["id"];

const medicationAreaAssignments: Record<string, MedicationAreaId[]> = {
  ass: ["cardiovascular", "coagulation", "pain"],
  heparin: ["cardiovascular", "coagulation"],
  ipratropium: ["airways"],
  "dimetinden-histakut": ["allergy"],
  "dimetinden-fenistil": ["allergy"],
  dimenhydrinat: ["gastrointestinal"],
  midazolam: ["sedation"],
  tranexamsaeure: ["coagulation"],
  furosemid: ["cardiovascular"],
  urapidil: ["cardiovascular"],
  nifedipin: ["cardiovascular"],
  amiodaron: ["cardiovascular"],
  fenoterol: ["obstetrics"],
  atropin: ["cardiovascular", "antidotes"],
  adrenalin: ["cardiovascular", "airways", "allergy"],
  morphin: ["pain"],
  esketamin: ["pain", "sedation"],
  naloxon: ["antidotes"],
  metamizol: ["pain", "gastrointestinal"],
  butylscopolamin: ["gastrointestinal", "pain"],
  glyceroltrinitrat: ["cardiovascular"],
  salbutamol: ["airways"],
  prednisolon: ["airways", "allergy"],
};

const medicationRecords: Omit<MedicationEffect, "areas">[] = [
  { id: "ass", name: "Acetylsalicylsäure (ASS)", group: "Thrombozytenaggregationshemmer", effect: "Hemmt irreversibel COX-1 und COX-2. Über COX-1 sinkt in den Thrombozyten die Thromboxanbildung und damit die Aggregation; zugleich werden protektive Prostaglandine der Magenschleimhaut vermindert. Über COX-2 werden Entzündung, Schmerz und Fieber beeinflusst.", interactions: "Antikoagulanzien, andere Thrombozytenhemmer und NSAR können Blutungs- beziehungsweise Magen-Darm-Risiken erhöhen.", contraindications: "Asthma oder bekannte ASS-Unverträglichkeit, erhöhte Blutungsneigung sowie aktives Magen- oder Darmulkus.", sideEffects: "Bronchospasmus, Blutungen, Magen-Darm-Beschwerden, Kopfschmerzen und Schwindel." },
  { id: "heparin", name: "Heparin", group: "Antikoagulanz", effect: "Verstärkt die Wirkung von Antithrombin III. Dadurch werden vor allem Thrombin (Faktor IIa), Faktor Xa und weitere Gerinnungsfaktoren indirekt gehemmt; die Bildung und Ausbreitung von Fibrinthromben wird gebremst.", interactions: "Andere Antikoagulanzien, Thrombozytenhemmer und NSAR können die Blutungsgefahr erhöhen.", contraindications: "Akute zerebrale Blutung, relevante Blutungsneigung, Heparinallergie, aktive Blutung, aktives Magen- oder Darmulkus sowie eine bestehende oder anamnestisch bekannte heparininduzierte Thrombozytopenie (HIT). Bei HIT darf Heparin nicht erneut gegeben werden.", sideEffects: "Blutungen, besonders an Haut, Schleimhäuten und Wunden; außerdem Thrombozytopenie und Überempfindlichkeitsreaktionen." },
  { id: "ipratropium", name: "Atrovent (Ipratropium)", group: "Parasympatholytikum · Anticholinergikum", effect: "Blockiert muskarinische Rezeptoren (M1–M3) an der Bronchialmuskulatur. Die M3-Blockade löst die vagal vermittelte Bronchokonstriktion, M2 gehört zur muskarinischen Rezeptorfamilie und beeinflusst die cholinerge Rückkopplung.", interactions: "Andere anticholinerge Wirkstoffe können Mundtrockenheit, Tachykardie und Harnverhalt verstärken.", contraindications: "Atrovent LS: Überempfindlichkeit gegen Ipratropium, Atropin, Atropinderivate oder einen sonstigen Bestandteil.", precautions: "Inhalationsnebel nicht in die Augen gelangen lassen, insbesondere bei Engwinkelglaukom. In Schwangerschaft und Stillzeit verlangt die Fachinformation eine ärztliche Nutzen-Risiko-Abwägung; dies ist keine pauschale Gegenanzeige.", sideEffects: "Mundtrockenheit, Husten, Kopfschmerz, Mydriasis, Tachykardie und selten paradoxer Bronchospasmus." },
  { id: "dimetinden-histakut", name: "Histakut (Dimetinden)", group: "H₁-Antihistaminikum", effect: "Blockiert H₁-Rezeptoren und dämpft histaminvermittelte Symptome wie Juckreiz, Urtikaria und Schleimhautschwellung.", interactions: "Alkohol, Opioide, Benzodiazepine und andere Sedativa können die zentrale Dämpfung verstärken.", contraindications: "Altersabhängige Anwendung (insbesondere bei Säuglingen und Kleinkindern je nach Präparat) sowie Überempfindlichkeit gegen Dimetinden; bei Engwinkelglaukom, Harnverhalt und Epilepsie besondere Vorsicht.", sideEffects: "Müdigkeit, Schläfrigkeit, Schwindel, Mundtrockenheit, Magen-Darm-Beschwerden, Sehstörungen und gelegentlich Blutdruckabfall." },
  { id: "dimetinden-fenistil", name: "Fenistil (Dimetinden)", group: "H₁-Antihistaminikum", effect: "Blockiert H₁-Rezeptoren und vermindert dadurch histaminvermittelte Beschwerden wie Juckreiz und Schleimhautschwellung.", interactions: "Alkohol, Opioide, Benzodiazepine und andere sedierende oder anticholinerge Wirkstoffe können die Wirkung und Nebenwirkungen verstärken.", contraindications: "Altersabhängige Anwendung (bei Säuglingen und Kleinkindern je nach Darreichungsform) sowie Überempfindlichkeit gegen Dimetinden; die zugelassene VFA-/Fachinformation beachten.", sideEffects: "Müdigkeit, Magen-Darm-Beschwerden, Mundtrockenheit und Sehstörungen." },
  { id: "dimenhydrinat", name: "Vomex (Dimenhydrinat)", group: "Antiemetikum / H₁-Antihistaminikum", effect: "Dämpft Übelkeit und Erbrechen über H₁-Rezeptorblockade und anticholinerge Effekte im Brechzentrum und Vestibularsystem.", interactions: "Sedativa, Alkohol und Opioide verstärken die ZNS-Dämpfung; anticholinerge Arzneimittel können Nebenwirkungen addieren.", contraindications: "Altersabhängige Anwendung (bei Säuglingen und Kleinkindern je nach Präparat), Überempfindlichkeit gegen Dimenhydrinat, Engwinkelglaukom, Harnverhalt und bestimmte Krampfneigungen berücksichtigen.", sideEffects: "Müdigkeit, Schwindel, Mundtrockenheit, Sehstörungen, Tachykardie und selten paradoxe Unruhe." },
  { id: "midazolam", name: "Midazolam", aliases: ["Dormicum"], group: "Benzodiazepin", effect: "Verstärkt die GABA-A-vermittelte Hemmung und wirkt anxiolytisch, sedierend, amnestisch, muskelrelaxierend und antikonvulsiv.", interactions: "Opioide, Alkohol und andere Sedativa verstärken Atemdepression, Sedierung und Hypotonie.", contraindications: "Ateminsuffizienz, Schwangerschaft, ungesicherter Atemweg, Schock und bekannte Überempfindlichkeit erfordern besondere Vorsicht.", sideEffects: "Atemdepression, Hypotonie, Sedierung, anterograde Amnesie, Bradykardie, paradoxe Reaktionen und bei älteren Menschen verlängerte Wirkung." },
  { id: "tranexamsaeure", name: "Tranexamsäure", group: "Antifibrinolytikum", effect: "Hemmt die Aktivierung von Plasminogen zu Plasmin und stabilisiert dadurch bestehende Fibringerinnsel.", interactions: "Andere prothrombotische Wirkstoffe können das Thromboserisiko erhöhen; die Gerinnungssituation muss im Gesamtkontext bewertet werden.", contraindications: "Aktive thromboembolische Erkrankung, schwere Nierenfunktionsstörung und relevante Überempfindlichkeit beachten.", sideEffects: "Übelkeit, Erbrechen, Durchfall, Blutdruckabfall bei zu schneller Gabe, Sehstörungen und selten Krampfanfälle." },
  { id: "furosemid", name: "Furosemid", group: "Schleifendiuretikum", effect: "Hemmt den Na⁺-K⁺-2Cl⁻-Cotransporter im aufsteigenden Teil der Henle-Schleife und steigert die Natrium- und Wasserausscheidung.", interactions: "Andere Antihypertensiva oder ototoxische Arzneimittel können Risiken verstärken; NSAR können die Diurese abschwächen.", contraindications: "Anurie, schwere Hypovolämie, ausgeprägte Elektrolytstörungen und unbehandelter Harnabflussstau.", sideEffects: "Hypotonie, Dehydratation, Hypokaliämie, Hyponatriämie, metabolische Alkalose und selten Ototoxizität." },
  { id: "urapidil", name: "Urapidil", group: "α₁-Blocker / zentral wirksames Antihypertensivum", effect: "Senkt den peripheren Gefäßwiderstand über α₁-Blockade und vermindert zentral den sympathischen Blutdruckreflex.", interactions: "Andere α-Rezeptorenblocker, Vasodilatatoren und Antihypertensiva können die Blutdrucksenkung verstärken; auch Volumenmangel und Alkohol erhöhen das Hypotonierisiko.", contraindications: "Aortenisthmusstenose, hämodynamisch wirksamer arteriovenöser Shunt und Stillzeit. Ein hämodynamisch nicht wirksamer Dialyse-Shunt ist ausgenommen. Schwangerschaft wird in der neuen Unterrichtsunterlage nicht als Kontraindikation genannt; Präeklampsie und Eklampsie sind besondere Einsatzsituationen.", sideEffects: "Übelkeit, Schwindel, Kopfschmerz, Bradykardie, Druckgefühl in der Brust, Müdigkeit, Schweißausbruch, Ruhelosigkeit, Hautreaktion und selten Priapismus." },
  { id: "nifedipin", name: "Nifedipin", group: "Dihydropyridin-Calciumantagonist", effect: "Blockiert L-Typ-Calciumkanäle in der Gefäßmuskulatur und führt vor allem zu arterieller Vasodilatation und Nachlastsenkung.", interactions: "CYP3A4-Hemmer, andere Antihypertensiva und Grapefruitsaft können die Wirkung verändern oder verstärken.", contraindications: "Schwangerschaft, akutes Koronarsyndrom, Hypotonie, kardiogener Schock, höhergradige Aortenklappenstenose und hypertroph-obstruktive Kardiomyopathie.", sideEffects: "Kopfschmerz, Flush, Schwindel, Knöchelödeme, Hypotonie und reflektorische Tachykardie." },
  { id: "amiodaron", name: "Amiodaron", group: "Antiarrhythmikum Klasse III", effect: "Verlängert über Kaliumkanalblockade die Repolarisation und Refraktärzeit; zusätzlich werden Natrium- und Calciumkanäle sowie β-Rezeptoren beeinflusst.", interactions: "QT-verlängernde Arzneimittel, Digoxin, bestimmte Statine und orale Antikoagulanzien können relevante Wechselwirkungen zeigen.", contraindications: "Ausgeprägte Bradykardie oder höhergradiger AV-Block ohne Schrittmacher sowie bekannte Überempfindlichkeit.", sideEffects: "Bradykardie, Hypotonie, QT-Verlängerung, Übelkeit und bei Langzeitgabe Schilddrüsen-, Lungen- oder Lebertoxizität." },
  { id: "fenoterol", name: "Partusisten (Fenoterol)", group: "β₂-Sympathomimetikum / Tokolytikum", effect: "Stimuliert β₂-Rezeptoren der Uterusmuskulatur und vermindert dadurch vorübergehend die Wehentätigkeit.", interactions: "Andere Sympathomimetika können Tachykardie und Hypokaliämie verstärken; Betablocker können die Wirkung abschwächen.", contraindications: "Relevante maternale Tachyarrhythmie, schwere kardiale Erkrankung und Situationen, in denen eine Wehenhemmung nicht vertretbar ist.", sideEffects: "Tachykardie, Palpitationen, Tremor, Unruhe, Hyperglykämie und Hypokaliämie." },
  { id: "atropin", name: "Atropin", group: "Anticholinergikum", effect: "Blockiert muskarinische Acetylcholinrezeptoren und hebt vagale Bremsen am Herzen auf.", interactions: "Andere anticholinerge Wirkstoffe können Mundtrockenheit, Tachykardie und Verwirrtheit verstärken.", contraindications: "Relevante Tachykardie, Engwinkelglaukom und höhergradiger infra-Hisärer AV-Block erfordern besondere Vorsicht.", sideEffects: "Tachykardie, Mundtrockenheit, Mydriasis, Akkommodationsstörung und Harnverhalt." },
  { id: "adrenalin", name: "Epinephrin / Adrenalin", group: "Katecholamin · α/β-Sympathomimetikum", effect: "Als Katecholamin aktiviert Adrenalin α₁-, β₁- und β₂-Rezeptoren: α₁ bewirkt Vasokonstriktion und steigert den Gefäßtonus, β₁ erhöht Herzfrequenz, Kontraktilität und Erregungsleitung, β₂ erweitert die Bronchien und beeinflusst die Gefäßweite der Skelettmuskulatur.", interactions: "Andere Sympathomimetika verstärken die Wirkung; Betablocker können kardiale Effekte verändern.", contraindications: "Bei tachykarden Rhythmusstörungen, schwerer Hypertonie oder Ischämie nur im passenden vitalen VFA-Kontext.", sideEffects: "Tachykardie, Herzrhythmusstörungen, Blutdruckanstieg, Tremor und Unruhe." },
  { id: "morphin", name: "Morphin", group: "Opioidanalgetikum", effect: "Wirkt überwiegend am μ-Rezeptor analgetisch und sedierend; zusätzlich kann es Atemantrieb und Kreislauf beeinflussen.", interactions: "Alkohol, Benzodiazepine und andere Sedativa verstärken Atemdepression und Bewusstseinsminderung.", contraindications: "Relevante Atemdepression, ungesicherter Atemweg und schwere Hypotonie sprechen gegen eine unkritische Gabe.", sideEffects: "Atemdepression, Sedierung, Hypotonie, Übelkeit, Erbrechen und Juckreiz." },
  { id: "esketamin", name: "Esketamin", aliases: ["Ketanest", "Ketanest S"], group: "Dissoziatives Analgetikum", effect: "Antagonisiert NMDA-Rezeptoren und reduziert die Schmerzverarbeitung bei meist erhaltener Spontanatmung.", interactions: "Sympathomimetika und weitere zentral wirksame Substanzen können Blutdruck, Herzfrequenz und Sedierung beeinflussen.", contraindications: "Unkontrollierte Hypertonie, relevante Ischämie oder fehlende Überwachungs- und Atemwegsbereitschaft beachten.", sideEffects: "Blutdruck- und Herzfrequenzanstieg, Übelkeit, Hypersalivation und belastende Aufwachreaktionen." },
  { id: "naloxon", name: "Naloxon", group: "Opioidantagonist", effect: "Verdrängt Opioide kompetitiv von μ-Rezeptoren und kann die opioidbedingte Atemdepression aufheben.", interactions: "Für diese Übersicht sind keine konkreten Wechselwirkungen hinterlegt.", monitoring: "Naloxon kann kürzer wirken als das auslösende Opioid. Nach anfänglicher Besserung sind erneute Atemdepression und fortgesetzte Überwachung einzuplanen.", contraindications: "Keine absolute Kontraindikation im vitalen Notfall; Entzug, Schmerz und Agitation nach Aufhebung einplanen.", sideEffects: "Akutes Entzugssyndrom, Schmerzen, Agitation, Übelkeit, Erbrechen und Blutdruckanstieg." },
  { id: "metamizol", name: "Metamizol (Novalgin)", group: "Nichtopioidanalgetikum", effect: "Wirkt analgetisch, antipyretisch und spasmolytisch durch zentrale und periphere Mechanismen.", interactions: "Andere blutdrucksenkende oder überempfindlichkeitsauslösende Arzneien können Hypotonie beziehungsweise Reaktionen begünstigen.", contraindications: "Frühere Agranulozytose, Pyrazolon-Überempfindlichkeit und relevante Kreislaufinstabilität beachten.", sideEffects: "Hypotonie, Überempfindlichkeitsreaktionen und selten Agranulozytose." },
  { id: "butylscopolamin", name: "Butylscopolamin (Buscopan)", group: "Spasmolytikum", effect: "Entspannt glatte Muskulatur über eine periphere anticholinerge Wirkung.", interactions: "Andere anticholinerge Medikamente können Tachykardie, Harnverhalt und Mundtrockenheit verstärken.", contraindications: "Engwinkelglaukom, Harnverhalt, mechanische Stenosen und relevante Tachyarrhythmien berücksichtigen.", sideEffects: "Mundtrockenheit, Tachykardie, Sehstörungen und Harnverhalt." },
  { id: "glyceroltrinitrat", name: "Glyceroltrinitrat (Nitro)", group: "Vasodilatator", effect: "Setzt Stickstoffmonoxid frei und erweitert vor allem venöse Gefäße; dadurch sinkt die Vorlast.", interactions: "PDE-5-Hemmer können einen gefährlichen Blutdruckabfall auslösen; andere Vasodilatatoren verstärken ihn.", contraindications: "Hypotonie, Rechtsherzinfarkt, ausgeprägte Aortenstenose und PDE-5-Einnahme ausschließen.", sideEffects: "Kopfschmerzen, Hypotonie, Schwindel, Flush und reflektorische Tachykardie." },
  { id: "salbutamol", name: "Salbutamol", group: "β₂-Sympathomimetikum", effect: "Als überwiegend selektives β₂-Sympathomimetikum aktiviert Salbutamol β₂-Rezeptoren an der bronchialen glatten Muskulatur. Über Gs-Protein, Adenylatzyklase und steigendes cAMP sinkt der Muskeltonus – die Bronchien erweitern sich und der Atemwegswiderstand nimmt ab.", interactions: "Andere Sympathomimetika können Tachykardie und Tremor verstärken; Diuretika können Hypokaliämie begünstigen.", contraindications: "Die konkrete Gegenanzeigenliste richtet sich nach Präparat, Applikationsweg und gültiger lokaler VFA.", precautions: "Schwangerschaft ist bei inhalativem Salbutamol keine pauschale Gegenanzeige; Embryotox nennt es während der gesamten Schwangerschaft als SABA der ersten Wahl. Hohe Dosen können maternale und fetale Tachykardien verursachen. Kardiale Risiken und die lokale VFA sind gesondert zu prüfen.", sideEffects: "Tremor, Tachykardie, Herzrhythmusstörungen (HRS), Palpitationen, Unruhe und mögliche Hypokaliämie." },
  { id: "prednisolon", name: "Prednisolon", group: "Glukokortikoid", effect: "Bindet intrazellulär an den Glukokortikoidrezeptor und verändert die Genexpression. Dadurch werden proinflammatorische Mediatoren, Schleimhautödem und entzündliche Sekretbildung gedämpft; der Wirkungseintritt ist verzögert und ersetzt keine Akutbronchodilatation.", interactions: "Für diese Übersicht sind keine konkreten Wechselwirkungen hinterlegt.", monitoring: "Blutzucker und Infektionszeichen im klinischen Kontext beachten. Der verzögerte Wirkungseintritt ersetzt keine Akutbronchodilatation.", contraindications: "Schwere unbehandelte Infektionen und bekannte Überempfindlichkeit im jeweiligen VFA-Kontext beachten.", sideEffects: "Hyperglykämie, Dyspepsie, Schlaf- oder Stimmungsschwankungen und erhöhte Infektanfälligkeit." },
];

export const medications: MedicationEffect[] = medicationRecords.map(item => {
  const areas = medicationAreaAssignments[item.id];
  if (!areas?.length) throw new Error(`Fehlender Wirkbereich für Medikament ${item.id}`);
  return { ...item, areas };
});
export function filterMedications(search: string, area: "all" | MedicationAreaId) {
  return filterAndSortMedications(medications, search, area);
}

export function MedicationEffectCard({ item, headingLevel = 2, onExpand }: { item: MedicationEffect; headingLevel?: 2 | 3; onExpand?: (item: MedicationEffect) => void }) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  return <article className="medication-effect-card"><header><span className="medication-effect-icon">✦</span><div><small>{item.group}</small><Heading>{item.name}</Heading></div>{onExpand && <button type="button" className="medication-card-expand" onClick={() => onExpand(item)} aria-label={`${item.name} groß anzeigen`}><span aria-hidden="true">⤢</span><b>Großansicht</b></button>}</header><div><b>Wirkung</b><p>{item.effect}</p><b className="medication-side-effect-label">Nebenwirkungen</b><p>{item.sideEffects}</p></div><div><b>Wechselwirkungen</b><p>{item.interactions}</p>{item.monitoring && <><b className="medication-side-effect-label">Besonderheiten / Überwachung</b><p>{item.monitoring}</p></>}</div><aside><b>Kontraindikationen</b><p>{item.contraindications}</p>{item.precautions && <><b>Warnhinweise / Vorsicht</b><p>{item.precautions}</p></>}</aside></article>;
}

export default function MedicationEffectsLibrary() {
  const [search, setSearch] = useState("");
  const [area, setArea] = useState<"all" | MedicationAreaId>("all");
  const [view, setView] = useState<"alphabetical" | "areas">("alphabetical");
  const [expanded, setExpanded] = useState<MedicationEffect | null>(null);
  useEffect(() => {
    if (!expanded) return;
    const scrollY = window.scrollY;
    const previousBody = { overflow: document.body.style.overflow, position: document.body.style.position, top: document.body.style.top, width: document.body.style.width };
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setExpanded(null); };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBody.overflow;
      document.body.style.position = previousBody.position;
      document.body.style.top = previousBody.top;
      document.body.style.width = previousBody.width;
      window.scrollTo({ top: scrollY, left: 0, behavior: "auto" });
    };
  }, [expanded]);
  const filtered = filterMedications(search, area);
  const resetFilters = () => { setSearch(""); setArea("all"); };
  return <section className="page-section medication-effects-page">
    <div className="section-heading"><div><span className="eyebrow">Pharmakologie · Lernübersicht</span><h1>Wirkung der Medikamente</h1><p>Rettungsdienstliche Wirkprofile zum Wiederholen. Dosierungen bleiben an die gültige Thüringer VFA gebunden.</p></div><div className="source-badge"><b>{filtered.length}</b><span>Treffer</span></div></div>
    <div className="medication-library-tools"><label className="medication-search"><span aria-hidden="true">⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Medikament suchen …" aria-label="Medikament suchen" />{search && <button type="button" onClick={() => setSearch("")} aria-label="Suche löschen">×</button>}</label><label className="medication-area-filter"><span>Wirkbereich</span><select value={area} onChange={event => setArea(event.target.value as "all" | MedicationAreaId)}><option value="all">Alle Wirkbereiche</option>{medicationAreas.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><div className="medication-view-switch" role="group" aria-label="Ansicht"><button type="button" className={view === "alphabetical" ? "active" : ""} aria-pressed={view === "alphabetical"} onClick={() => setView("alphabetical")}>Alphabetisch</button><button type="button" className={view === "areas" ? "active" : ""} aria-pressed={view === "areas"} onClick={() => setView("areas")}>Nach Wirkbereich</button></div>{(search || area !== "all") && <button type="button" className="medication-reset" onClick={resetFilters}>Suche und Filter zurücksetzen</button>}</div>
    {view === "alphabetical" ? <div className="medication-effects-grid">{filtered.map(item => <MedicationEffectCard key={item.id} item={item} onExpand={setExpanded} />)}</div> : <div className="medication-area-groups">{medicationAreas.map(group => { const entries = filtered.filter(item => item.areas.includes(group.id)); return entries.length ? <section key={group.id}><h2>{group.label}</h2><div className="medication-effects-grid">{entries.map(item => <MedicationEffectCard key={`${group.id}-${item.id}`} item={item} headingLevel={3} onExpand={setExpanded} />)}</div></section> : null; })}</div>}
    {!filtered.length && <div className="medication-search-empty" role="status"><b>Keine passenden Medikamente gefunden.</b><span>Ändere Suchtext oder Wirkbereich.</span><button type="button" onClick={resetFilters}>Suche und Filter zurücksetzen</button></div>}
    {expanded && <div className="medication-card-modal" role="dialog" aria-modal="true" aria-label={`${expanded.name} Großansicht`}><button type="button" className="medication-card-modal-backdrop" onClick={() => setExpanded(null)} aria-label="Großansicht schließen" /><div className="medication-card-modal-panel"><button type="button" className="medication-card-modal-close" onClick={() => setExpanded(null)} aria-label="Großansicht schließen">×</button><MedicationEffectCard item={expanded} /></div></div>}
  </section>;
}
