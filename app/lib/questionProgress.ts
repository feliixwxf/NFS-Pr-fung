export type QuestionLearningRecord = {
  correctCount: 0 | 1 | 2 | 3;
  lastResult: "correct" | "wrong";
  updatedAt: string;
  /** Optional v2 scheduling fields. Old records remain valid without them. */
  nextDueAt?: string;
  intervalLevel?: number;
  lastAdvancedLocalDay?: string;
  attempts?: number;
  correctAttempts?: number;
};

export type QuestionProgress = Record<string, QuestionLearningRecord>;

export const QUESTION_PROGRESS_KEY = "notsan-question-progress-v1";
export const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14, 30] as const;
let activeProgressUserId: string | null = null;

export function setActiveProgressUser(userId: string | null) {
  activeProgressUserId = userId;
}

export function questionProgressStorageKey(userId: string | null = activeProgressUserId) {
  return userId ? `${QUESTION_PROGRESS_KEY}:user:${userId}` : QUESTION_PROGRESS_KEY;
}

export function readQuestionProgress(): QuestionProgress {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(questionProgressStorageKey()) || "{}") as QuestionProgress;
  } catch {
    return {};
  }
}

export function recordQuestionAnswer(questionId: string, isCorrect: boolean): QuestionProgress {
  const progress = readQuestionProgress();
  const previous = progress[questionId]?.correctCount || 0;
  const correctCount = (isCorrect ? Math.min(3, previous + 1) : 0) as 0 | 1 | 2 | 3;
  const now = new Date();
  const localDay = localDateKey(now);
  const priorLevel = progress[questionId]?.intervalLevel ?? -1;
  // A question can only advance once per local calendar day. This prevents
  // rapid retries from inflating its long-term interval.
  const intervalLevel = isCorrect
    ? (progress[questionId]?.lastAdvancedLocalDay === localDay ? priorLevel : Math.min(REVIEW_INTERVAL_DAYS.length - 1, priorLevel + 1))
    : 0;
  const due = new Date(now);
  due.setDate(due.getDate() + (isCorrect ? REVIEW_INTERVAL_DAYS[intervalLevel] : 0));
  due.setHours(0, 0, 0, 0);
  const next = {
    ...progress,
    [questionId]: {
      correctCount,
      lastResult: isCorrect ? "correct" as const : "wrong" as const,
      updatedAt: now.toISOString(),
      nextDueAt: due.toISOString(),
      intervalLevel,
      lastAdvancedLocalDay: isCorrect ? localDay : progress[questionId]?.lastAdvancedLocalDay,
      attempts: (progress[questionId]?.attempts ?? 0) + 1,
      correctAttempts: (progress[questionId]?.correctAttempts ?? 0) + (isCorrect ? 1 : 0),
    },
  };
  localStorage.setItem(questionProgressStorageKey(), JSON.stringify(next));
  return next;
}

export function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function dueQuestionIds(progress: QuestionProgress, now = new Date()) {
  const today = new Date(now);
  today.setHours(23, 59, 59, 999);
  return Object.entries(progress)
    .filter(([, record]) => record.nextDueAt && new Date(record.nextDueAt) <= today)
    .sort((a, b) => (a[1].nextDueAt || "").localeCompare(b[1].nextDueAt || ""))
    .map(([id]) => id);
}

export function progressMetrics(progress: QuestionProgress, availableQuestionIds: readonly string[]) {
  const uniqueIds = [...new Set(availableQuestionIds)];
  const records = uniqueIds.map((id) => progress[id]).filter(Boolean);
  const attempts = records.reduce((sum, record) => sum + (record.attempts ?? 0), 0);
  const correctAttempts = records.reduce((sum, record) => sum + (record.correctAttempts ?? 0), 0);
  return {
    answered: records.length,
    available: uniqueIds.length,
    // Keep the exact value for visualizations and only round while formatting.
    // A record exists only after an answer was actually assessed; wrong answers
    // therefore count as processed as well, while opened/bookmarked/skipped items do not.
    completionPercent: uniqueIds.length ? Math.min(100, Math.max(0, records.length / uniqueIds.length * 100)) : 0,
    repetitionPercent: uniqueIds.length ? Math.round(records.reduce((sum, record) => sum + record.correctCount / 3, 0) / uniqueIds.length * 100) : 0,
    hitRate: attempts >= 5 ? Math.round(correctAttempts / attempts * 100) : null,
    attempts,
  };
}

const progressNumberFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });

/** Formats a percentage on the 0–100 scale for text only; keeps stored and bar values intact. */
export function formatProgressPercent(value: number) {
  const bounded = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
  return `${progressNumberFormat.format(bounded)}\u00a0%`;
}

/** Restores one record after an immediately undone self-assessment. */
export function restoreQuestionAnswer(questionId: string, record?: QuestionLearningRecord): QuestionProgress {
  const progress = readQuestionProgress();
  const next = { ...progress };
  if (record) next[questionId] = record;
  else delete next[questionId];
  localStorage.setItem(questionProgressStorageKey(), JSON.stringify(next));
  return next;
}

export function masteryPercent(record?: QuestionLearningRecord): number {
  return record ? Math.round((record.correctCount / 3) * 100) : 0;
}

export function summarizeQuestionProgress(progress: QuestionProgress) {
  const records = Object.values(progress);
  return {
    total: records.length,
    wrong: records.filter((record) => record.correctCount === 0).length,
    learning: records.filter((record) => record.correctCount === 1 || record.correctCount === 2).length,
    mastered: records.filter((record) => record.correctCount === 3).length,
    average: records.length ? Math.round(records.reduce((sum, record) => sum + masteryPercent(record), 0) / records.length) : 0,
  };
}
