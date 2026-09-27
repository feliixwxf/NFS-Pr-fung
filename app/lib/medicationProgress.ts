export type MedicationLearningRecord = { attempts: number; correct: number; updatedAt?: string };
export type MedicationProgress = Record<string, MedicationLearningRecord>;

export const MEDICATION_PROGRESS_KEY = "notsan-medication-progress-v1";
let activeMedicationUserId: string | null = null;

export function setActiveMedicationUser(userId: string | null) {
  activeMedicationUserId = userId;
}

export function medicationProgressStorageKey(userId: string | null = activeMedicationUserId) {
  return userId ? `${MEDICATION_PROGRESS_KEY}:user:${userId}` : MEDICATION_PROGRESS_KEY;
}

export function readMedicationProgress(userId: string | null = activeMedicationUserId): MedicationProgress {
  if (typeof window === "undefined") return {};
  try {
    const value = JSON.parse(localStorage.getItem(medicationProgressStorageKey(userId)) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value as MedicationProgress : {};
  } catch {
    return {};
  }
}

export function recordMedicationAnswer(caseId: string, isCorrect: boolean): { progress: MedicationProgress; record: MedicationLearningRecord } {
  const progress = readMedicationProgress();
  const previous = progress[caseId];
  const record = {
    attempts: (previous?.attempts || 0) + 1,
    correct: (previous?.correct || 0) + (isCorrect ? 1 : 0),
    updatedAt: new Date().toISOString(),
  };
  const next = { ...progress, [caseId]: record };
  localStorage.setItem(medicationProgressStorageKey(), JSON.stringify(next));
  return { progress: next, record };
}
