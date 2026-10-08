/** Returns a new selection without mutating the answer state already rendered. */
export function toggleMultipleChoiceSelection(selected: readonly number[], index: number): number[] {
  return selected.includes(index)
    ? selected.filter((item) => item !== index)
    : [...selected, index];
}
