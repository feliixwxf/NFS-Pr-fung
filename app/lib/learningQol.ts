export const BOOKMARKS_KEY = "notsan-question-bookmarks-v1";
export const TOPIC_ACTIVITY_KEY = "notsan-topic-activity-v1";

export type TopicActivity = Record<string, { openedAt: string }>;

export function stableQuestionKey(topic: string, questionId: string) {
  return `${topic}::${questionId}`;
}

export function readBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch { return []; }
}

export function writeBookmarks(bookmarks: readonly string[]) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...new Set(bookmarks)]));
}

export function readTopicActivity(): TopicActivity {
  if (typeof window === "undefined") return {};
  try {
    const value = JSON.parse(localStorage.getItem(TOPIC_ACTIVITY_KEY) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}

export function markTopicOpened(topicNumber: number, now = new Date()) {
  const activity = readTopicActivity();
  const next = { ...activity, [topicNumber]: { openedAt: now.toISOString() } };
  localStorage.setItem(TOPIC_ACTIVITY_KEY, JSON.stringify(next));
  return next;
}

export type MixedQuestion<T> = { topic: string; question: T & { id: string } };

/** Round-robin sampling keeps topics balanced and the compound key prevents collisions. */
export function buildBalancedRound<T>(banks: readonly { topic: string; questions: readonly (T & { id: string })[] }[], limit: number, random = Math.random): MixedQuestion<T>[] {
  const queues = banks.map(bank => ({ topic: bank.topic, questions: [...bank.questions].sort(() => random() - .5) })).sort(() => random() - .5);
  const result: MixedQuestion<T>[] = [];
  const seen = new Set<string>();
  while (result.length < limit && queues.some(queue => queue.questions.length)) {
    for (const queue of queues) {
      const question = queue.questions.shift();
      if (!question) continue;
      const key = stableQuestionKey(queue.topic, question.id);
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({ topic: queue.topic, question });
      if (result.length === limit) break;
    }
  }
  return result;
}
