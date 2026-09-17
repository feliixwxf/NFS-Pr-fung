export type QuestionLearningRecord = {
  correctCount: 0 | 1 | 2 | 3;
  lastResult: "correct" | "wrong";
  updatedAt: string;
};

export type QuestionProgress = Record<string, QuestionLearningRecord>;

export const QUESTION_PROGRESS_KEY = "notsan-question-progress-v1";

export function readQuestionProgress(): QuestionProgress {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(QUESTION_PROGRESS_KEY) || "{}") as QuestionProgress;
  } catch {
    return {};
  }
}

export function recordQuestionAnswer(questionId: string, isCorrect: boolean): QuestionProgress {
  const progress = readQuestionProgress();
  const previous = progress[questionId]?.correctCount || 0;
  const correctCount = (isCorrect ? Math.min(3, previous + 1) : 0) as 0 | 1 | 2 | 3;
  const next = {
    ...progress,
    [questionId]: {
      correctCount,
      lastResult: isCorrect ? "correct" as const : "wrong" as const,
      updatedAt: new Date().toISOString(),
    },
  };
  localStorage.setItem(QUESTION_PROGRESS_KEY, JSON.stringify(next));
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
