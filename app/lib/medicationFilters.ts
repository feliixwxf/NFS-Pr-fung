export type FilterableMedication<Area extends string> = {
  id: string;
  name: string;
  aliases?: string[];
  group: string;
  effect: string;
  areas: readonly Area[];
};

const medicationCollator = new Intl.Collator("de-DE", { sensitivity: "base" });

export function filterAndSortMedications<Area extends string, Medication extends FilterableMedication<Area>>(
  medications: readonly Medication[],
  search: string,
  area: "all" | Area,
): Medication[] {
  const query = search.trim().toLocaleLowerCase("de-DE");
  return medications
    .filter(item => area === "all" || item.areas.includes(area))
    .filter(item => `${item.name} ${(item.aliases || []).join(" ")} ${item.group} ${item.effect}`.toLocaleLowerCase("de-DE").includes(query))
    .sort((a, b) => medicationCollator.compare(a.name, b.name));
}
