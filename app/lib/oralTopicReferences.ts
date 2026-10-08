/**
 * Source-backed reference labels for the oral topic overview.
 *
 * Keep this list explicit: a generic VFA fallback previously assigned the same
 * unrelated references to every topic that was missing from a conditional.
 */
export const oralTopicReferenceLabels: Record<number, string> = {
  1: "VFA 12 · 13 · 14",
  2: "VFA 12 · 13 · 14",
  3: "VFA 12 · 13 · 14",
  4: "VFA 44",
  5: "VFA L2 · 35 · 36 · 38 · B2A",
  6: "VFA 21 · 06 · B2A",
  7: "Gefäßanatomie · Virchow-Trias",
  8: "VFA L5 · 01 · B2A",
  9: "Obere GI-Blutung · TXA-Prüfungsgrenze",
  10: "VFA 21 · 06 · B2A",
  11: "Atemregulation · Säure-Basen-Haushalt",
  12: "VFA 41 · 42 · 43 · ERC 49",
  13: "VFA 21 · 06 · B2A",
  14: "VFA 16 · 17 · B2A",
  15: "VFA 39 · B2A · Metamizol/Butylscopolamin",
  16: "VFA 35 · 36 · 38 · B2A/B2B",
  17: "VFA 19 · B2A",
  18: "VFA 07 · 35 · 36 · 38",
  19: "VFA L2 · 35 · 36 · 38 · B2A",
  20: "VFA L2 · 31 · 35/36/38 · B2A/B2B",
  21: "VFA L2 · 32 · 35/36/38 · B2A/B2B",
  22: "VFA 06 · 15 · B2A",
  23: "VFA 35 · 36 · 38 · B2A/B2B",
  24: "VFA 20 · B2A",
  25: "VFA 29 · B2A",
  26: "VFA L2 · 07 · 35/36/38 · B2A/B2B",
  27: "VFA 27 · 28 · Medikamentenkarte",
  28: "VFA 19 · 20 · 34 · 35/36/38",
  29: "VFA 25 · 26 · B2A · B3B",
  30: "VFA 30 · B2A",
  31: "VFA L2 · 07 · 32 · 35/36/38",
  32: "VFA L2 · 07 · 35/36/38 · TXA",
  33: "VFA L2 · Schockformen · Neurogen · TXA",
  34: "VFA 07 · 35 · 36 · 38",
  35: "VFA L2 · 07",
  36: "VFA 34 · Infusionsrechner",
  37: "VFA 04 · Atemwegsmanagement",
  38: "VFA 40 · B2A · Naloxon",
  39: "VFA 18 · 39",
  40: "VFA 18 · 39",
  41: "Akute Extremitätenischämie · Analgesie nach Indikation",
  42: "VFA L5 · 01",
  43: "VFA 18 · 35/36/38 · indikationsabhängig",
  44: "VFA L2 · 07 · 34 · 35/36/38",
  45: "VFA 39 · B2A · Metamizol/Butylscopolamin",
  46: "VFA 19 · 20 · EKG-Systematik",
  47: "ERC 2025 · Hypothermie",
  48: "Obstruktiver Schock · POCUS · Trauma",
  49: "VFA 24 · B2A",
};

export function oralTopicReferenceLabel(topicNumber: number): string {
  return oralTopicReferenceLabels[topicNumber] ?? "Fachgrundlagen werden geprüft";
}
