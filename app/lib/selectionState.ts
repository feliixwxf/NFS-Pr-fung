export function toggleSelectedIndex(selected: readonly number[], index: number): number[] {
  return selected.includes(index)
    ? selected.filter(item => item !== index)
    : [...selected, index];
}
