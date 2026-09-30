export const TOPIC_ALIASES: Record<string, readonly string[]> = {
  "Myokardinfarkt": ["Herzinfarkt"],
  "Apoplex": ["Schlaganfall", "Apoplexie"],
  "Lungenembolie": ["LAE", "Lungenarterienembolie"],
  "Akutes Koronarsyndrom": ["ACS", "akutes Koronar Syndrom"],
  "Schädelhirntrauma": ["SHT", "Schädel-Hirn-Trauma"],
};

export function normalizeSearch(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .toLocaleLowerCase("de")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
export function topicSearchScore(title: string, query: string) {
  const needle = normalizeSearch(query);
  if (!needle) return 1;
  const normalizedTitle = normalizeSearch(title);
  const aliases = (TOPIC_ALIASES[title] || []).map(normalizeSearch);
  if (normalizedTitle === needle) return 100;
  if (aliases.includes(needle)) return 90;
  if (normalizedTitle.startsWith(needle)) return 70;
  if (aliases.some((alias) => alias.startsWith(needle))) return 60;
  if (normalizedTitle.includes(needle)) return 40;
  if (aliases.some((alias) => alias.includes(needle))) return 30;
  return 0;
}
