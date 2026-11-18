import { loadMultipleChoiceSession, saveMultipleChoiceSession } from "./cloudProgress";

export const PERSONAL_FEATURES_CHANGED_EVENT = "notsan-personal-features-changed";

const CLOUD_KEY = "personal-features-v1";
const META_KEY = "notsan-personal-features-meta-v1";
const OWNER_KEY = "notsan-personal-features-owner-v1";
const BOOKMARKS_KEY = "notsan-question-bookmarks-v1";
const TOPIC_ACTIVITY_KEY = "notsan-topic-activity-v1";
const CHAPTER_SECTION_PREFIX = "notsan-chapter-sections-v2:";
const CHAPTER_PROGRESS_PREFIX = "notsan-chapter-progress-v1:";
const WRITTEN_EXAM_PREFIX = "notsan-written-exam-v2:";

type JsonMap = Record<string, unknown>;

type PersonalFeatureSnapshot = {
  version: 1;
  updatedAt: string;
  bookmarks: unknown;
  topicActivity: unknown;
  chapterSections: JsonMap;
  chapterProgress: JsonMap;
  writtenExams: JsonMap;
};

function parseValue(raw: string | null, fallback: unknown) {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as unknown; } catch { return fallback; }
}

function collectPrefix(prefix: string) {
  const values: JsonMap = {};
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith(prefix)) continue;
    values[key.slice(prefix.length)] = parseValue(localStorage.getItem(key), null);
  }
  return values;
}

function collectSnapshot(updatedAt = localStorage.getItem(META_KEY) || ""): PersonalFeatureSnapshot {
  return {
    version: 1,
    updatedAt,
    bookmarks: parseValue(localStorage.getItem(BOOKMARKS_KEY), []),
    topicActivity: parseValue(localStorage.getItem(TOPIC_ACTIVITY_KEY), {}),
    chapterSections: collectPrefix(CHAPTER_SECTION_PREFIX),
    chapterProgress: collectPrefix(CHAPTER_PROGRESS_PREFIX),
    writtenExams: collectPrefix(WRITTEN_EXAM_PREFIX),
  };
}

function validSnapshot(value: unknown): value is PersonalFeatureSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<PersonalFeatureSnapshot>;
  return snapshot.version === 1
    && typeof snapshot.updatedAt === "string"
    && !!snapshot.chapterSections && typeof snapshot.chapterSections === "object"
    && !!snapshot.chapterProgress && typeof snapshot.chapterProgress === "object"
    && !!snapshot.writtenExams && typeof snapshot.writtenExams === "object";
}

function removePrefix(prefix: string) {
  const keys: string[] = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(prefix)) keys.push(key);
  }
  keys.forEach((key) => localStorage.removeItem(key));
}

function writePrefix(prefix: string, values: JsonMap) {
  removePrefix(prefix);
  Object.entries(values).forEach(([suffix, value]) => localStorage.setItem(`${prefix}${suffix}`, JSON.stringify(value)));
}

function applySnapshot(snapshot: PersonalFeatureSnapshot, userId: string) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(snapshot.bookmarks ?? []));
  localStorage.setItem(TOPIC_ACTIVITY_KEY, JSON.stringify(snapshot.topicActivity ?? {}));
  writePrefix(CHAPTER_SECTION_PREFIX, snapshot.chapterSections);
  writePrefix(CHAPTER_PROGRESS_PREFIX, snapshot.chapterProgress);
  writePrefix(WRITTEN_EXAM_PREFIX, snapshot.writtenExams);
  localStorage.setItem(META_KEY, snapshot.updatedAt);
  localStorage.setItem(OWNER_KEY, userId);
}

function hasPersonalData(snapshot: PersonalFeatureSnapshot) {
  return (Array.isArray(snapshot.bookmarks) && snapshot.bookmarks.length > 0)
    || Object.keys(snapshot.topicActivity as JsonMap || {}).length > 0
    || Object.keys(snapshot.chapterSections).length > 0
    || Object.keys(snapshot.chapterProgress).length > 0
    || Object.keys(snapshot.writtenExams).length > 0;
}

export function notifyPersonalFeatureChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PERSONAL_FEATURES_CHANGED_EVENT));
}

export function markPersonalFeaturesDirty(userId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(META_KEY, new Date().toISOString());
  localStorage.setItem(OWNER_KEY, userId);
}

export async function hydratePersonalFeatures(userId: string) {
  const owner = localStorage.getItem(OWNER_KEY);
  const localBelongsToUser = !owner || owner === userId;
  const local = collectSnapshot(localBelongsToUser ? localStorage.getItem(META_KEY) || "" : "");
  const remote = await loadMultipleChoiceSession(userId, CLOUD_KEY);
  const remoteSnapshot = validSnapshot(remote?.payload) ? { ...remote.payload, updatedAt: remote.payload.updatedAt || remote?.updatedAt || "" } : null;

  if (remoteSnapshot && (!localBelongsToUser || !local.updatedAt || remoteSnapshot.updatedAt > local.updatedAt)) {
    applySnapshot(remoteSnapshot, userId);
    return true;
  }

  if (!localBelongsToUser) {
    const empty: PersonalFeatureSnapshot = { version: 1, updatedAt: new Date().toISOString(), bookmarks: [], topicActivity: {}, chapterSections: {}, chapterProgress: {}, writtenExams: {} };
    applySnapshot(empty, userId);
    await saveMultipleChoiceSession(userId, CLOUD_KEY, empty, empty.updatedAt);
    return true;
  }

  if (hasPersonalData(local) || local.updatedAt) {
    const updatedAt = local.updatedAt || new Date().toISOString();
    const migrated = { ...local, updatedAt };
    applySnapshot(migrated, userId);
    await saveMultipleChoiceSession(userId, CLOUD_KEY, migrated, updatedAt);
  } else {
    localStorage.setItem(OWNER_KEY, userId);
  }
  return false;
}

export async function savePersonalFeatures(userId: string) {
  const updatedAt = new Date().toISOString();
  localStorage.setItem(META_KEY, updatedAt);
  localStorage.setItem(OWNER_KEY, userId);
  const snapshot = collectSnapshot(updatedAt);
  await saveMultipleChoiceSession(userId, CLOUD_KEY, snapshot, updatedAt);
}
