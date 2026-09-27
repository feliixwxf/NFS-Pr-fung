export type TopicLearningRecord = { completed: boolean; updatedAt: string };
export type TopicProgress = Record<string, TopicLearningRecord>;

export const LEGACY_COMPLETED_TOPICS_KEY = "notsan-completed-topics-v1";
const TOPIC_PROGRESS_KEY = "notsan-topic-progress-v2";
let activeTopicUserId: string | null = null;

export function setActiveTopicUser(userId: string | null) {
  activeTopicUserId = userId;
}

export function topicProgressStorageKey(userId: string) {
  return `${TOPIC_PROGRESS_KEY}:user:${userId}`;
}

export function readGuestCompletedTopics(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(LEGACY_COMPLETED_TOPICS_KEY) || "[]");
    return Array.isArray(value) ? value.filter((number): number is number => Number.isInteger(number) && number > 0) : [];
  } catch {
    return [];
  }
}

export function readTopicProgress(userId: string): TopicProgress {
  if (typeof window === "undefined") return {};
  try {
    const value = JSON.parse(localStorage.getItem(topicProgressStorageKey(userId)) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value as TopicProgress : {};
  } catch {
    return {};
  }
}

export function completedTopicsFromProgress(progress: TopicProgress): number[] {
  return Object.entries(progress).filter(([, record]) => record.completed).map(([number]) => Number(number)).filter(Number.isInteger);
}

export function readCompletedTopics(): number[] {
  return activeTopicUserId ? completedTopicsFromProgress(readTopicProgress(activeTopicUserId)) : readGuestCompletedTopics();
}

export function writeTopicCompletion(topicNumber: number, completed: boolean): TopicLearningRecord {
  const record = { completed, updatedAt: new Date().toISOString() };
  if (activeTopicUserId) {
    const progress = readTopicProgress(activeTopicUserId);
    localStorage.setItem(topicProgressStorageKey(activeTopicUserId), JSON.stringify({ ...progress, [topicNumber]: record }));
  } else {
    const current = readGuestCompletedTopics();
    const next = completed ? [...new Set([...current, topicNumber])] : current.filter((number) => number !== topicNumber);
    localStorage.setItem(LEGACY_COMPLETED_TOPICS_KEY, JSON.stringify(next));
  }
  return record;
}
