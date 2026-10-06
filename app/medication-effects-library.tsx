"use client";

import { useEffect, useState } from "react";

export type MedicationEffect = {
  name: string;
  aliases?: string[];
  group: string;
  effect: string;
  interactions: string;
  contraindications: string;
  precautions?: string;
  monitoring?: string;
  sideEffects: string;
  preparation?: {
    source: string;
    dose: string;
    route: string;
    drugMl?: number;
    diluentMl?: number;
    totalMl?: number;
    kind?: "syringe" | "infusion" | "nebulizer" | "spray" | "capsule";
    concentration?: string;
    note?: string;
    syringeLabel?: string;
  };
};

type MedicationMechanism = "Kreislauf & Rhythmus" | "Gerinnung & Blutung" | "Atemwege & Allergie" | "Analgesie, Sedierung & Antidote" | "Übelkeit & Spasmen" | "Geburtshilfe";
type MedicationSort = "alphabetical" | "mechanism";

const mechanismOrder: MedicationMechanism[] = [
  "Kreislauf & Rhythmus",
  "Gerinnung & Blutung",
  "Atemwege & Allergie",
  "Analgesie, Sedierung & Antidote",
  "Übelkeit & Spasmen",
  "Geburtshilfe",
];

const medicationMechanisms: Record<string, MedicationMechanism> = {
  "Acetylsalicylsäure (Aspirin / ASS)": "Gerinnung & Blutung",
  "Heparin (Heparin-Natrium Braun)": "Gerinnung & Blutung",
  "Tranexamsäure (Cyklokapron)": "Gerinnung & Blutung",
  "Ipratropiumbromid (Atrovent)": "Atemwege & Allergie",
  "Dimetinden (Histakut)": "Atemwege & Allergie",
  "Dimetinden (Fenistil)": "Atemwege & Allergie",
  "Salbutamol (Sultanol)": "Atemwege & Allergie",
  "Prednisolon (Solu-Decortin H)": "Atemwege & Allergie",
  "Furosemid (Lasix)": "Kreislauf & Rhythmus",
  "Urapidil (Ebrantil)": "Kreislauf & Rhythmus",
  "Nifedipin (Adalat)": "Kreislauf & Rhythmus",
  "Amiodaron (Cordarex)": "Kreislauf & Rhythmus",
  "Atropin (Atropinsulfat Inresa)": "Kreislauf & Rhythmus",
  "Epinephrin / Adrenalin (Suprarenin)": "Kreislauf & Rhythmus",
  "Glyceroltrinitrat (Nitrolingual)": "Kreislauf & Rhythmus",
  "Midazolam (Dormicum)": "Analgesie, Sedierung & Antidote",
  "Morphin (Morphin-hameln)": "Analgesie, Sedierung & Antidote",
  "Esketamin (Ketanest S)": "Analgesie, Sedierung & Antidote",
  "Naloxon (Narcanti)": "Analgesie, Sedierung & Antidote",
  "Metamizol (Novalgin)": "Analgesie, Sedierung & Antidote",
  "Dimenhydrinat (Vomex A)": "Übelkeit & Spasmen",
  "Butylscopolamin (Buscopan)": "Übelkeit & Spasmen",
  "Fenoterol (Partusisten)": "Geburtshilfe",
};

const getMechanism = (item: MedicationEffect) => medicationMechanisms[item.name];

export const medications: MedicationEffect[] = [
  { name: "Acetylsalicylsäure (Aspirin / ASS)", aliases: ["Aspirin", "ASS"], group: "Thrombozytenaggregationshemmer", effect: "Hemmt irreversibel COX-1 und COX-2. Über COX-1 sinkt in den Thrombozyten die Thromboxanbildung und damit die Aggregation; zugleich werden protektive Prostaglandine der Magenschleimhaut vermindert. Über COX-2 werden Entzündung, Schmerz und Fieber beeinflusst.", interactions: "Antikoagulanzien, andere Thrombozytenhemmer und NSAR können Blutungs- beziehungsweise Magen-Darm-Risiken erhöhen.", contraindications: "Asthma oder bekannte ASS-Unverträglichkeit, erhöhte Blutungsneigung sowie aktives Magen- oder Darmulkus.", sideEffects: "Bronchospasmus, Blutungen, Magen-Darm-Beschwerden, Kopfschmerzen und Schwindel.", preparation: { source: "VFA 14 · Anlage B2A", dose: "250 mg", route: "i.v. bei STEMI / neuem LSB", drugMl: 2.5, totalMl: 2.5, concentration: "100 mg/ml", note: "500 mg Trockensubstanz werden zunächst mit 5 ml beiliegendem Lösungsmittel rekonstituiert; 250 mg entsprechen danach 2,5 ml." } },
  { name: "Heparin (Heparin-Natrium Braun)", aliases: ["Heparin-Natrium"], group: "Antikoagulanz", effect: "Verstärkt die Wirkung von Antithrombin III. Dadurch werden vor allem Thrombin (Faktor IIa), Faktor Xa und weitere Gerinnungsfaktoren indirekt gehemmt; die Bildung und Ausbreitung von Fibrinthromben wird gebremst.", interactions: "Andere Antikoagulanzien, Thrombozytenhemmer und NSAR können die Blutungsgefahr erhöhen.", contraindications: "Akute zerebrale Blutung, relevante Blutungsneigung, Heparinallergie, aktive Blutung, aktives Magen- oder Darmulkus sowie eine bestehende oder anamnestisch bekannte heparininduzierte Thrombozytopenie (HIT). Bei HIT darf Heparin nicht erneut gegeben werden.", sideEffects: "Blutungen, besonders an Haut, Schleimhäuten und Wunden; außerdem Thrombozytopenie und Überempfindlichkeitsreaktionen.", preparation: { source: "VFA 14 · Anlage B2A", dose: "100 I.E./kgKG · max. 5.000 I.E.", route: "i.v. bei STEMI / neuem LSB", drugMl: 0.2, diluentMl: 4.8, totalMl: 5, concentration: "1.000 I.E./ml", syringeLabel: "Heparinspritze", note: "0,2 ml Heparin mit 4,8 ml NaCl 0,9 % auf 5 ml aufziehen. Die Patientendosis bleibt gewichtsbezogen." } },
  { name: "Ipratropiumbromid (Atrovent)", aliases: ["Ipratropium", "Atrovent LS"], group: "Parasympatholytikum · Anticholinergikum", effect: "Blockiert muskarinische Rezeptoren (M1–M3) an der Bronchialmuskulatur. Die M3-Blockade löst die vagal vermittelte Bronchokonstriktion, M2 gehört zur muskarinischen Rezeptorfamilie und beeinflusst die cholinerge Rückkopplung.", interactions: "Andere anticholinerge Wirkstoffe können Mundtrockenheit, Tachykardie und Harnverhalt verstärken.", contraindications: "Atrovent LS: Überempfindlichkeit gegen Ipratropium, Atropin, Atropinderivate oder einen sonstigen Bestandteil.", precautions: "Inhalationsnebel nicht in die Augen gelangen lassen, insbesondere bei Engwinkelglaukom. In Schwangerschaft und Stillzeit verlangt die Fachinformation eine ärztliche Nutzen-Risiko-Abwägung; dies ist keine pauschale Gegenanzeige.", sideEffects: "Mundtrockenheit, Husten, Kopfschmerz, Mydriasis, Tachykardie und selten paradoxer Bronchospasmus.", preparation: { source: "VFA 21", dose: "0,5 mg", route: "mit Salbutamol über O₂-Vernebler · 6 l/min", kind: "nebulizer", note: "Zwei Phiolen à 0,25 mg; keine Injektion." } },
  { name: "Dimetinden (Histakut)", aliases: ["Histakut"], group: "H₁-Antihistaminikum", effect: "Blockiert H₁-Rezeptoren und dämpft histaminvermittelte Symptome wie Juckreiz, Urtikaria und Schleimhautschwellung.", interactions: "Alkohol, Opioide, Benzodiazepine und andere Sedativa können die zentrale Dämpfung verstärken.", contraindications: "Altersabhängige Anwendung (insbesondere bei Säuglingen und Kleinkindern je nach Präparat) sowie Überempfindlichkeit gegen Dimetinden; bei Engwinkelglaukom, Harnverhalt und Epilepsie besondere Vorsicht.", sideEffects: "Müdigkeit, Schläfrigkeit, Schwindel, Mundtrockenheit, Magen-Darm-Beschwerden, Sehstörungen und gelegentlich Blutdruckabfall.", preparation: { source: "VFA 25 · Anlage B2A", dose: "0,1 mg/kgKG", route: "i.v. · einmalig · 1 mg/ml", drugMl: 1, totalMl: 1, concentration: "1 mg/ml", syringeLabel: "1 ml = 1 mg", note: "Die Spritze zeigt die Konzentration. Das tatsächliche Volumen beträgt 0,1 ml/kgKG und muss aus dem Patientengewicht berechnet werden." } },
  { name: "Dimetinden (Fenistil)", aliases: ["Fenistil"], group: "H₁-Antihistaminikum", effect: "Blockiert H₁-Rezeptoren und vermindert dadurch histaminvermittelte Beschwerden wie Juckreiz und Schleimhautschwellung.", interactions: "Alkohol, Opioide, Benzodiazepine und andere sedierende oder anticholinerge Wirkstoffe können die Wirkung und Nebenwirkungen verstärken.", contraindications: "Altersabhängige Anwendung (bei Säuglingen und Kleinkindern je nach Darreichungsform) sowie Überempfindlichkeit gegen Dimetinden; die zugelassene VFA-/Fachinformation beachten.", sideEffects: "Müdigkeit, Magen-Darm-Beschwerden, Mundtrockenheit und Sehstörungen.", preparation: { source: "VFA 25 · Anlage B2A", dose: "0,1 mg/kgKG", route: "i.v. · einmalig · 1 mg/ml", drugMl: 1, totalMl: 1, concentration: "1 mg/ml", syringeLabel: "1 ml = 1 mg", note: "Die Spritze zeigt die Konzentration. Das tatsächliche Volumen beträgt 0,1 ml/kgKG und muss aus dem Patientengewicht berechnet werden." } },
  { name: "Dimenhydrinat (Vomex A)", aliases: ["Vomex"], group: "Antiemetikum / H₁-Antihistaminikum", effect: "Dämpft Übelkeit und Erbrechen über H₁-Rezeptorblockade und anticholinerge Effekte im Brechzentrum und Vestibularsystem.", interactions: "Sedativa, Alkohol und Opioide verstärken die ZNS-Dämpfung; anticholinerge Arzneimittel können Nebenwirkungen addieren.", contraindications: "Altersabhängige Anwendung (bei Säuglingen und Kleinkindern je nach Präparat), Überempfindlichkeit gegen Dimenhydrinat, Engwinkelglaukom, Harnverhalt und bestimmte Krampfneigungen berücksichtigen.", sideEffects: "Müdigkeit, Schwindel, Mundtrockenheit, Sehstörungen, Tachykardie und selten paradoxe Unruhe.", preparation: { source: "VFA 18 · Anlage B2A", dose: "62 mg", route: "langsam i.v. über mindestens 2 Minuten", drugMl: 10, totalMl: 10, concentration: "6,2 mg/ml", note: "Unverdünnt aufziehen; kontinuierliches Monitoring und Transport fortführen." } },
  { name: "Midazolam (Dormicum)", aliases: ["Dormicum"], group: "Benzodiazepin", effect: "Verstärkt die GABA-A-vermittelte Hemmung und wirkt anxiolytisch, sedierend, amnestisch, muskelrelaxierend und antikonvulsiv.", interactions: "Opioide, Alkohol und andere Sedativa verstärken Atemdepression, Sedierung und Hypotonie.", contraindications: "Ateminsuffizienz, Schwangerschaft, ungesicherter Atemweg, Schock und bekannte Überempfindlichkeit erfordern besondere Vorsicht.", sideEffects: "Atemdepression, Hypotonie, Sedierung, anterograde Amnesie, Bradykardie, paradoxe Reaktionen und bei älteren Menschen verlängerte Wirkung.", preparation: { source: "VFA 29 · Anlage B2A", dose: "3 mg", route: "erste Gabe langsam i.v. beim Erwachsenen", drugMl: 3, totalMl: 3, concentration: "1 mg/ml", note: "Die VFA unterscheidet i.v., i.n. und i.m. sowie Erst- und Wiederholungsgabe. Diese Ansicht zeigt ausschließlich die erste i.v.-Gabe." } },
  { name: "Tranexamsäure (Cyklokapron)", aliases: ["Cyklokapron"], group: "Antifibrinolytikum", effect: "Hemmt die Aktivierung von Plasminogen zu Plasmin und stabilisiert dadurch bestehende Fibringerinnsel.", interactions: "Andere prothrombotische Wirkstoffe können das Thromboserisiko erhöhen; die Gerinnungssituation muss im Gesamtkontext bewertet werden.", contraindications: "Aktive thromboembolische Erkrankung, schwere Nierenfunktionsstörung und relevante Überempfindlichkeit beachten.", sideEffects: "Übelkeit, Erbrechen, Durchfall, Blutdruckabfall bei zu schneller Gabe, Sehstörungen und selten Krampfanfälle.", preparation: { source: "Trauma L2 · Anlage B2A", dose: "1 g", route: "Kurzinfusion über 10 Minuten", drugMl: 10, diluentMl: 90, totalMl: 100, kind: "infusion", concentration: "10 mg/ml", note: "Die Spritze zeigt die entnommenen 10 ml Wirkstoff. Mit 90 ml NaCl 0,9 % zur 100-ml-Kurzinfusion geben." } },
  { name: "Furosemid (Lasix)", aliases: ["Lasix"], group: "Schleifendiuretikum", effect: "Hemmt den Na⁺-K⁺-2Cl⁻-Cotransporter im aufsteigenden Teil der Henle-Schleife und steigert die Natrium- und Wasserausscheidung.", interactions: "Andere Antihypertensiva oder ototoxische Arzneimittel können Risiken verstärken; NSAR können die Diurese abschwächen.", contraindications: "Anurie, schwere Hypovolämie, ausgeprägte Elektrolytstörungen und unbehandelter Harnabflussstau.", sideEffects: "Hypotonie, Dehydratation, Hypokaliämie, Hyponatriämie, metabolische Alkalose und selten Ototoxizität.", preparation: { source: "VFA 15 · Anlage B2A", dose: "40 mg", route: "langsam i.v. · unverdünnt", drugMl: 4, totalMl: 4, concentration: "10 mg/ml" } },
  { name: "Urapidil (Ebrantil)", aliases: ["Ebrantil"], group: "α₁-Blocker / zentral wirksames Antihypertensivum", effect: "Senkt den peripheren Gefäßwiderstand über α₁-Blockade und vermindert zentral den sympathischen Blutdruckreflex.", interactions: "Andere α-Rezeptorenblocker, Vasodilatatoren und Antihypertensiva können die Blutdrucksenkung verstärken; auch Volumenmangel und Alkohol erhöhen das Hypotonierisiko.", contraindications: "Aortenisthmusstenose, hämodynamisch wirksamer arteriovenöser Shunt und Stillzeit. Ein hämodynamisch nicht wirksamer Dialyse-Shunt ist ausgenommen. Schwangerschaft wird in der neuen Unterrichtsunterlage nicht als Kontraindikation genannt; Präeklampsie und Eklampsie sind besondere Einsatzsituationen.", sideEffects: "Übelkeit, Schwindel, Kopfschmerz, Bradykardie, Druckgefühl in der Brust, Müdigkeit, Schweißausbruch, Ruhelosigkeit, Hautreaktion und selten Priapismus.", preparation: { source: "VFA 16 · Anlage B2A", dose: "10 mg", route: "langsam i.v.; RR-Kontrolle nach 5 Minuten", drugMl: 2, totalMl: 2, concentration: "5 mg/ml", note: "Bei fehlendem Erfolg höchstens zwei weitere Gaben zu je 10 mg; maximal 30 mg insgesamt." } },
  { name: "Nifedipin (Adalat)", aliases: ["Adalat"], group: "Dihydropyridin-Calciumantagonist", effect: "Blockiert L-Typ-Calciumkanäle in der Gefäßmuskulatur und führt vor allem zu arterieller Vasodilatation und Nachlastsenkung.", interactions: "CYP3A4-Hemmer, andere Antihypertensiva und Grapefruitsaft können die Wirkung verändern oder verstärken.", contraindications: "Schwangerschaft, akutes Koronarsyndrom, Hypotonie, kardiogener Schock, höhergradige Aortenklappenstenose und hypertroph-obstruktive Kardiomyopathie.", sideEffects: "Kopfschmerz, Flush, Schwindel, Knöchelödeme, Hypotonie und reflektorische Tachykardie.", preparation: { source: "VFA 17", dose: "10 mg", route: "oral als Zerbeißkapsel", kind: "capsule", note: "Keine Spritzengabe; nur im vorgesehenen Nifedipinpfad anwenden." } },
  { name: "Amiodaron (Cordarex)", aliases: ["Cordarex"], group: "Antiarrhythmikum Klasse III", effect: "Verlängert über Kaliumkanalblockade die Repolarisation und Refraktärzeit; zusätzlich werden Natrium- und Calciumkanäle sowie β-Rezeptoren beeinflusst.", interactions: "QT-verlängernde Arzneimittel, Digoxin, bestimmte Statine und orale Antikoagulanzien können relevante Wechselwirkungen zeigen.", contraindications: "Ausgeprägte Bradykardie oder höhergradiger AV-Block ohne Schrittmacher sowie bekannte Überempfindlichkeit.", sideEffects: "Bradykardie, Hypotonie, QT-Verlängerung, Übelkeit und bei Langzeitgabe Schilddrüsen-, Lungen- oder Lebertoxizität.", preparation: { source: "VFA 20 · Anlage B2A", dose: "300 mg", route: "2 Ampullen unverdünnt aufziehen", drugMl: 6, totalMl: 6, concentration: "50 mg/ml", note: "Eine Ampulle enthält 3 ml mit 150 mg; zwei Ampullen ergeben 6 ml mit 300 mg." } },
  { name: "Fenoterol (Partusisten)", aliases: ["Partusisten"], group: "β₂-Sympathomimetikum / Tokolytikum", effect: "Stimuliert β₂-Rezeptoren der Uterusmuskulatur und vermindert dadurch vorübergehend die Wehentätigkeit.", interactions: "Andere Sympathomimetika können Tachykardie und Hypokaliämie verstärken; Betablocker können die Wirkung abschwächen.", contraindications: "Relevante maternale Tachyarrhythmie, schwere kardiale Erkrankung und Situationen, in denen eine Wehenhemmung nicht vertretbar ist.", sideEffects: "Tachykardie, Palpitationen, Tremor, Unruhe, Hyperglykämie und Hypokaliämie.", preparation: { source: "VFA 43 · Anlage B2A", dose: "25 µg", route: "langsam i.v. über 3 Minuten", drugMl: 1, diluentMl: 9, totalMl: 10, concentration: "2,5 µg/ml", note: "Eine 25-µg-Ampulle mit 9 ml NaCl 0,9 % auf insgesamt 10 ml aufziehen." } },
  { name: "Atropin (Atropinsulfat Inresa)", aliases: ["Atropinsulfat"], group: "Anticholinergikum", effect: "Blockiert muskarinische Acetylcholinrezeptoren und hebt vagale Bremsen am Herzen auf.", interactions: "Andere anticholinerge Wirkstoffe können Mundtrockenheit, Tachykardie und Verwirrtheit verstärken.", contraindications: "Relevante Tachykardie, Engwinkelglaukom und höhergradiger infra-Hisärer AV-Block erfordern besondere Vorsicht.", sideEffects: "Tachykardie, Mundtrockenheit, Mydriasis, Akkommodationsstörung und Harnverhalt.", preparation: { source: "VFA 19 · Anlage B2A", dose: "1 mg initial", route: "i.v. · unverdünnt", drugMl: 2, totalMl: 2, concentration: "0,5 mg/ml", note: "Zwei Ampullen zu je 0,5 mg/1 ml ergeben die Initialdosis. Wirkung nach 2 Minuten prüfen." } },
  { name: "Epinephrin / Adrenalin (Suprarenin)", aliases: ["Suprarenin"], group: "Katecholamin · α/β-Sympathomimetikum", effect: "Als Katecholamin aktiviert Adrenalin α₁-, β₁- und β₂-Rezeptoren: α₁ bewirkt Vasokonstriktion und steigert den Gefäßtonus, β₁ erhöht Herzfrequenz, Kontraktilität und Erregungsleitung, β₂ erweitert die Bronchien und beeinflusst die Gefäßweite der Skelettmuskulatur.", interactions: "Andere Sympathomimetika verstärken die Wirkung; Betablocker können kardiale Effekte verändern.", contraindications: "Bei tachykarden Rhythmusstörungen, schwerer Hypertonie oder Ischämie nur im passenden vitalen VFA-Kontext.", sideEffects: "Tachykardie, Herzrhythmusstörungen, Blutdruckanstieg, Tremor und Unruhe.", preparation: { source: "VFA 25 · Erwachsene", dose: "0,5 mg", route: "i.m. bei Anaphylaxie Stadium II/III", drugMl: 0.5, totalMl: 0.5, concentration: "1 mg/ml", note: "Diese Ansicht zeigt den Erwachsenenpfad der Anaphylaxie. Reanimation, Bradykardie, Inhalation und Kinderanaphylaxie besitzen andere Dosierungen und Zubereitungen." } },
  { name: "Morphin (Morphin-hameln)", aliases: ["Morphin-hameln", "Opioid"], group: "Opioidanalgetikum", effect: "Wirkt überwiegend am μ-Rezeptor analgetisch und sedierend; zusätzlich kann es Atemantrieb und Kreislauf beeinflussen.", interactions: "Alkohol, Benzodiazepine und andere Sedativa verstärken Atemdepression und Bewusstseinsminderung.", contraindications: "Relevante Atemdepression, ungesicherter Atemweg und schwere Hypotonie sprechen gegen eine unkritische Gabe.", sideEffects: "Miosis, Atemdepression, Sedierung, Blutdruckabfall (Hypotonie), Übelkeit, Erbrechen und Juckreiz.", preparation: { source: "VFA 38 · Anlage B2A", dose: "10 mg Ausgangsmenge", route: "i.v. · Patientendosis nach Gewichtstabelle", drugMl: 1, diluentMl: 9, totalMl: 10, concentration: "1 mg/ml", note: "1 ml Morphin mit 9 ml NaCl 0,9 % auf 10 ml aufziehen. Die tatsächlich zu gebende Dosis richtet sich nach B2B." } },
  { name: "Esketamin (Ketanest S)", aliases: ["Ketanest", "Ketanest S"], group: "Dissoziatives Analgetikum", effect: "Antagonisiert NMDA-Rezeptoren und reduziert die Schmerzverarbeitung bei meist erhaltener Spontanatmung.", interactions: "Sympathomimetika und weitere zentral wirksame Substanzen können Blutdruck, Herzfrequenz und Sedierung beeinflussen.", contraindications: "Unkontrollierte Hypertonie, relevante Ischämie oder fehlende Überwachungs- und Atemwegsbereitschaft beachten.", sideEffects: "Blutdruck- und Herzfrequenzanstieg, Übelkeit, Hypersalivation und belastende Aufwachreaktionen.", preparation: { source: "VFA 36 · Anlage B2A", dose: "50 mg Ausgangsmenge", route: "i.v. · Patientendosis gewichtsbezogen", drugMl: 2, diluentMl: 8, totalMl: 10, concentration: "5 mg/ml", note: "2 ml Esketamin mit 8 ml NaCl 0,9 % auf 10 ml aufziehen. Für i.m. oder i.n. gelten andere Zubereitungen." } },
  { name: "Naloxon (Narcanti)", aliases: ["Narcanti"], group: "Opioidantagonist", effect: "Blockiert Opioidrezeptoren kompetitiv – besonders den My-(μ)-Opioidrezeptor, außerdem Kappa-(κ)- und Delta-(δ)-Opioidrezeptoren. Dadurch kann es die opioidbedingte Atem- und Bewusstseinsdepression aufheben.", interactions: "Die Wirkung beruht auf der Konkurrenz mit Opioiden am Rezeptor. Bei Mischintoxikationen hebt Naloxon die Wirkung von Alkohol, Benzodiazepinen oder anderen sedierenden Substanzen nicht auf.", monitoring: "Naloxon kann kürzer wirken als das auslösende Opioid. Nach anfänglicher Besserung sind erneute Atemdepression und fortgesetzte Überwachung einzuplanen.", contraindications: "Überempfindlichkeit gegen Naloxon oder Bestandteile des Präparats. In einer vital bedrohlichen Opioidintoxikation ist die Nutzen-Risiko-Abwägung entscheidend; Opioidabhängigkeit ist wegen eines möglichen Entzugs eine wichtige Vorsichtsmaßnahme.", sideEffects: "Übelkeit, Erbrechen, Schwindel, Kopfschmerz, Tachykardie sowie Blutdruckveränderungen; bei Opioidabhängigkeit abruptes Entzugssyndrom mit Schmerz, Agitation und Schwitzen. Selten sind Rhythmusstörungen, Krampfanfälle oder ein Lungenödem möglich.", preparation: { source: "VFA 40 · Anlage B2A", dose: "0,4 mg", route: "i.v. · vorbereitete Lösung 0,1 mg/ml", drugMl: 1, diluentMl: 3, totalMl: 4, concentration: "0,1 mg/ml", note: "1 ml Naloxon mit 3 ml NaCl 0,9 % auf 4 ml aufziehen. Der intranasale MAD-Weg verwendet eine andere, unverdünnte Zubereitung." } },
  { name: "Metamizol (Novalgin)", group: "Nichtopioidanalgetikum", effect: "Wirkt analgetisch, antipyretisch und spasmolytisch durch zentrale und periphere Mechanismen.", interactions: "Andere blutdrucksenkende oder überempfindlichkeitsauslösende Arzneien können Hypotonie beziehungsweise Reaktionen begünstigen.", contraindications: "Frühere Agranulozytose, Pyrazolon-Überempfindlichkeit und relevante Kreislaufinstabilität beachten.", sideEffects: "Blutdruckabfall (Hypotonie), Überempfindlichkeitsreaktionen, selten Agranulozytose sowie sehr selten akute Nierenschädigung bis zum Nierenversagen oder eine akute interstitielle Nephritis.", preparation: { source: "VFA 39 · Anlage B2A", dose: "1 g", route: "Kurzinfusion über 5 Minuten", drugMl: 2, diluentMl: 98, totalMl: 100, kind: "infusion", concentration: "10 mg/ml", note: "Die Spritze zeigt die entnommenen 2 ml Wirkstoff. Mit 98 ml NaCl 0,9 % zur 100-ml-Kurzinfusion geben." } },
  { name: "Butylscopolamin (Buscopan)", group: "Spasmolytikum", effect: "Entspannt glatte Muskulatur über eine periphere anticholinerge Wirkung.", interactions: "Andere anticholinerge Medikamente können Tachykardie, Harnverhalt und Mundtrockenheit verstärken.", contraindications: "Engwinkelglaukom, Harnverhalt, mechanische Stenosen und relevante Tachyarrhythmien berücksichtigen.", sideEffects: "Mundtrockenheit, Tachykardie, Sehstörungen, Mydriasis (weite Pupillen) und Harnverhalt.", preparation: { source: "VFA 39 · Anlage B2A", dose: "20 mg", route: "langsam i.v.", drugMl: 1, diluentMl: 9, totalMl: 10, concentration: "2 mg/ml", note: "1 ml Butylscopolamin mit 9 ml NaCl 0,9 % auf 10 ml aufziehen." } },
  { name: "Glyceroltrinitrat (Nitrolingual)", aliases: ["Nitro", "Nitrolingual"], group: "Vasodilatator", effect: "Setzt Stickstoffmonoxid frei und erweitert vor allem venöse Gefäße; dadurch sinkt die Vorlast.", interactions: "PDE-5-Hemmer können einen gefährlichen Blutdruckabfall auslösen; andere Vasodilatatoren verstärken ihn.", contraindications: "Hypotonie, Rechtsherzinfarkt, ausgeprägte Aortenstenose und PDE-5-Einnahme ausschließen.", sideEffects: "Kopfschmerzen, Hypotonie, Schwindel, Flush und reflektorische Tachykardie.", preparation: { source: "VFA 13", dose: "0,4 mg · 1 Hub", route: "sublingual; Wirkung und RR nach 5 Minuten prüfen", kind: "spray", note: "Keine Spritze. Nach erneuter Kontraindikationsprüfung höchstens zwei Wiederholungen." } },
  { name: "Salbutamol (Sultanol)", aliases: ["Sultanol"], group: "β₂-Sympathomimetikum", effect: "Als überwiegend selektives β₂-Sympathomimetikum aktiviert Salbutamol β₂-Rezeptoren an der bronchialen glatten Muskulatur. Über Gs-Protein, Adenylatzyklase und steigendes cAMP sinkt der Muskeltonus – die Bronchien erweitern sich und der Atemwegswiderstand nimmt ab.", interactions: "Andere Sympathomimetika können Tachykardie und Tremor verstärken; Diuretika können Hypokaliämie begünstigen.", contraindications: "Die konkrete Gegenanzeigenliste richtet sich nach Präparat, Applikationsweg und gültiger lokaler VFA.", precautions: "Schwangerschaft ist bei inhalativem Salbutamol keine pauschale Gegenanzeige; Embryotox nennt es während der gesamten Schwangerschaft als SABA der ersten Wahl. Hohe Dosen können maternale und fetale Tachykardien verursachen. Kardiale Risiken und die lokale VFA sind gesondert zu prüfen.", sideEffects: "Tremor, Tachykardie, Herzrhythmusstörungen (HRS), Palpitationen, Unruhe und mögliche Hypokaliämie.", preparation: { source: "VFA 21", dose: "3 mg Salbutamolsulfat", route: "mit Ipratropium über O₂-Vernebler · 6 l/min", kind: "nebulizer", note: "Zwei Phiolen à 1,5 mg; keine Injektion. Bei nachlassendem Effekt nennt VFA 21 dieselbe Verneblung erneut." } },
  { name: "Prednisolon (Solu-Decortin H)", aliases: ["Solu-Decortin", "Solu-Decortin H"], group: "Glukokortikoid", effect: "Bindet intrazellulär an den Glukokortikoidrezeptor und verändert die Genexpression. Dadurch werden proinflammatorische Mediatoren, Schleimhautödem und entzündliche Sekretbildung gedämpft; der Wirkungseintritt ist verzögert und ersetzt keine Akutbronchodilatation.", interactions: "Für diese Übersicht sind keine konkreten Wechselwirkungen hinterlegt.", monitoring: "Blutzucker und Infektionszeichen im klinischen Kontext beachten. Der verzögerte Wirkungseintritt ersetzt keine Akutbronchodilatation.", contraindications: "Schwere unbehandelte Infektionen und bekannte Überempfindlichkeit im jeweiligen VFA-Kontext beachten.", sideEffects: "Hyperglykämie, Dyspepsie, Schlaf- oder Stimmungsschwankungen und erhöhte Infektanfälligkeit.", preparation: { source: "VFA 21 · Anlage B2A", dose: "100 mg Prednisolonäquivalent", route: "einmalig i.v. im Bronchoobstruktionspfad", drugMl: 2, totalMl: 2, concentration: "50 mg/ml", note: "250 mg Trockensubstanz mit 5 ml beiliegendem Lösungsmittel rekonstituieren; anschließend 2 ml = 100 mg entnehmen." } },
];

const formatMl = (value: number) => String(value).replace(".", ",");

function MedicationDosePreparation({ name, preparation }: { name: string; preparation: NonNullable<MedicationEffect["preparation"]> }) {
  const hasSyringe = preparation.drugMl !== undefined;
  const capacity = !hasSyringe ? 0 : preparation.drugMl! <= 1 ? 1 : preparation.drugMl! <= 2 ? 2 : preparation.drugMl! <= 5 ? 5 : 10;
  const drawnMl = preparation.kind === "infusion" ? preparation.drugMl ?? 0 : preparation.totalMl ?? preparation.drugMl ?? 0;
  const drugWidth = hasSyringe ? Math.min(preparation.drugMl! / capacity * 470, 470) : 0;
  const diluentWidth = hasSyringe && preparation.kind !== "infusion" ? Math.min((preparation.diluentMl ?? 0) / capacity * 470, 470 - drugWidth) : 0;
  const plungerX = 88 + Math.min(drawnMl / Math.max(capacity, 1) * 470, 470);
  const formLabel = preparation.kind === "nebulizer" ? "Vernebler" : preparation.kind === "spray" ? "Dosierspray" : preparation.kind === "capsule" ? "Zerbeißkapsel" : "Dosierung";
  return <details className="medication-dose-prep" aria-label={`${name}: Dosierung und Zubereitung`}>
    <summary className="medication-dose-prep-heading"><div><small>{preparation.source}</small><b>Dosierung &amp; Zubereitung</b></div><span>{preparation.dose}</span><i aria-hidden="true">⌄</i></summary>
    <div className="medication-dose-prep-content">
      {hasSyringe ? <div className="medication-dose-syringe" role="img" aria-label={`${name}: ${preparation.dose}; ${preparation.route}`}>
        <svg viewBox="0 0 650 170" xmlns="http://www.w3.org/2000/svg">
          <path d="M35 76H77V100H35Z" fill="#d8e7e8" stroke="#8ca6a9" strokeWidth="2"/><path d="M31 72V104M78 63V113" stroke="#657b83" strokeWidth="4"/>
          <rect x="88" y="63" width="470" height="50" rx="8" fill="#fbffff" stroke="#9ab2b7" strokeWidth="3"/>
          <rect x="90" y="65" width={Math.max(0, drugWidth - 2)} height="46" rx="4" fill="#3d9d90"/>
          {diluentWidth > 0 && <rect x={88 + drugWidth} y="65" width={Math.max(0, diluentWidth - 2)} height="46" fill="#bbdfe3"/>}
          <path d={`M${plungerX} 61V115M${plungerX} 88H605M605 68V108`} stroke="#214950" strokeWidth="5"/>
          {Array.from({ length: 11 }, (_, index) => <g key={index}><path d={`M${88 + index * 47} 63V${index % 2 ? 73 : 80}`} stroke="#244a54" strokeWidth={index % 2 ? 1.5 : 2}/><text x={88 + index * 47} y="48" textAnchor="middle" fontSize="13" fontWeight="700" fill="#244a54">{formatMl(index * capacity / 10)}</text></g>)}
          <text x={88 + Math.max(drugWidth + diluentWidth, 90) / 2} y="95" textAnchor="middle" fontSize="14" fontWeight="850" fill="#fff">{preparation.syringeLabel ?? `${formatMl(preparation.drugMl!)} ml · ${preparation.dose}`}</text>
          <text x="558" y="146" textAnchor="end" fontSize="14" fontWeight="700" fill="#496a70">{capacity}-ml-Spritze</text>
        </svg>
      </div> : <div className={`medication-dose-form ${preparation.kind ?? "dose"}`}><span aria-hidden="true">{preparation.kind === "nebulizer" ? "◌" : preparation.kind === "spray" ? "⌁" : "●"}</span><div><small>{formLabel}</small><b>{preparation.dose}</b><p>{preparation.route}</p></div></div>}
      <div className="medication-dose-flow"><span><b>{preparation.dose}</b><small>{preparation.concentration ?? name}</small></span>{preparation.kind === "infusion" && preparation.diluentMl ? <><i>＋</i><span><b>{formatMl(preparation.diluentMl)} ml</b><small>NaCl 0,9 %</small></span><i>→</i><span className="target"><b>{formatMl(preparation.totalMl ?? 0)} ml</b><small>Kurzinfusion</small></span></> : <><i>→</i><span className="target"><b>{formLabel}</b><small>{preparation.route}</small></span></>}</div>
      {preparation.note && <p><b>Wichtig:</b> {preparation.note}</p>}
    </div>
  </details>;
}

export function MedicationEffectCard({ item, headingLevel = 2, onExpand }: { item: MedicationEffect; headingLevel?: 2 | 3; onExpand?: (item: MedicationEffect) => void }) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  return <article className="medication-effect-card"><header><span className="medication-effect-icon">✦</span><div><small>{item.group}</small><Heading>{item.name}</Heading></div>{onExpand && <button type="button" className="medication-card-expand" onClick={() => onExpand(item)} aria-label={`${item.name} groß anzeigen`}><span aria-hidden="true">⤢</span><b>Großansicht</b></button>}</header><div><b>Wirkung</b><p>{item.effect}</p><b className="medication-side-effect-label">Nebenwirkungen</b><p>{item.sideEffects}</p></div><div><b>Wechselwirkungen</b><p>{item.interactions}</p>{item.monitoring && <><b className="medication-side-effect-label">Besonderheiten / Überwachung</b><p>{item.monitoring}</p></>}</div><aside><b>Kontraindikationen</b><p>{item.contraindications}</p>{item.precautions && <><b>Warnhinweise / Vorsicht</b><p>{item.precautions}</p></>}</aside>{item.preparation && <MedicationDosePreparation name={item.name} preparation={item.preparation} />}</article>;
}

export default function MedicationEffectsLibrary() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<MedicationSort>("alphabetical");
  const [mechanism, setMechanism] = useState<MedicationMechanism | "all">("all");
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
  const query = search.trim().toLocaleLowerCase("de-DE");
  const filtered = medications
    .filter((item) => mechanism === "all" || getMechanism(item) === mechanism)
    .filter((item) => `${item.name} ${(item.aliases || []).join(" ")} ${item.group} ${getMechanism(item)} ${item.effect}`.toLocaleLowerCase("de-DE").includes(query))
    .sort((a, b) => sort === "alphabetical"
      ? a.name.localeCompare(b.name, "de-DE")
      : mechanismOrder.indexOf(getMechanism(a)) - mechanismOrder.indexOf(getMechanism(b)) || a.name.localeCompare(b.name, "de-DE"));
  const grouped = mechanismOrder.map((group) => ({ group, items: filtered.filter((item) => getMechanism(item) === group) })).filter(({ items }) => items.length);
  return <section className="page-section medication-effects-page">
    <div className="section-heading"><div><span className="eyebrow">Pharmakologie · Lernübersicht</span><h1>Wirkung der Medikamente</h1><p>Rettungsdienstliche Wirkprofile zum Wiederholen. Handelsnamen stehen als Präparatebeispiele in Klammern; Dosierungen bleiben an die gültige Thüringer VFA gebunden.</p></div><div className="source-badge"><b>{filtered.length}</b><span>Treffer</span></div></div>
    <div className="medication-library-controls">
      <label className="medication-search"><span aria-hidden="true">⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Medikament suchen …" aria-label="Medikament suchen" />{search && <button type="button" onClick={() => setSearch("")} aria-label="Suche löschen">×</button>}</label>
      <div className="medication-filter-list">
        <div className="medication-sort-switch" role="group" aria-label="Medikamente sortieren">
          <button type="button" className={sort === "alphabetical" ? "active" : ""} aria-pressed={sort === "alphabetical"} onClick={() => setSort("alphabetical")}><span aria-hidden="true">A–Z</span><b>Alphabetisch</b></button>
          <button type="button" className={sort === "mechanism" ? "active" : ""} aria-pressed={sort === "mechanism"} onClick={() => setSort("mechanism")}><span aria-hidden="true">✦</span><b>Nach Wirkweise</b></button>
        </div>
        <label className="medication-mechanism-filter"><span>Wirkgruppe filtern</span><select value={mechanism} onChange={(event) => setMechanism(event.target.value as MedicationMechanism | "all")}><option value="all">Alle Wirkgruppen</option>{mechanismOrder.map((group) => <option value={group} key={group}>{group}</option>)}</select></label>
        {(mechanism !== "all" || search) && <button className="medication-filter-reset" type="button" onClick={() => { setSearch(""); setMechanism("all"); }}>Filter zurücksetzen</button>}
      </div>
    </div>
    {sort === "alphabetical" ? <div className="medication-effects-grid">{filtered.map((item) => <MedicationEffectCard key={item.name} item={item} onExpand={setExpanded} />)}</div> : <div className="medication-mechanism-groups">{grouped.map(({ group, items }) => <section key={group} className="medication-mechanism-group"><header><div><span>Wirkweise</span><h2>{group}</h2></div><b>{items.length} {items.length === 1 ? "Medikament" : "Medikamente"}</b></header><div className="medication-effects-grid">{items.map((item) => <MedicationEffectCard key={item.name} item={item} onExpand={setExpanded} />)}</div></section>)}</div>}
    {!filtered.length && <div className="medication-search-empty"><b>Kein Medikament gefunden.</b><span>Prüfe die Schreibweise oder suche nach einem Wirkstoff.</span></div>}
    {expanded && <div className="medication-card-modal" role="dialog" aria-modal="true" aria-label={`${expanded.name} Großansicht`}><button type="button" className="medication-card-modal-backdrop" onClick={() => setExpanded(null)} aria-label="Großansicht schließen"/><div className="medication-card-modal-panel"><button type="button" className="medication-card-modal-close" onClick={() => setExpanded(null)} aria-label="Großansicht schließen">×</button><MedicationEffectCard item={expanded} /></div></div>}
  </section>;
}
