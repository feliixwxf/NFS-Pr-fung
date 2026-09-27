import { getSupabaseClient } from "./supabaseClient";
import { QUESTION_PROGRESS_KEY, type QuestionProgress, questionProgressStorageKey, setActiveProgressUser } from "./questionProgress";
import { LEGACY_COMPLETED_TOPICS_KEY, type TopicProgress, completedTopicsFromProgress, readTopicProgress, setActiveTopicUser, topicProgressStorageKey } from "./topicProgress";
import { type MedicationProgress, medicationProgressStorageKey, readMedicationProgress, setActiveMedicationUser } from "./medicationProgress";

const GUEST_IMPORT_OWNER_KEY = "notsan-guest-import-owner-v1";
const questionSaveQueues = new Map<string, Promise<void>>();

function newer<T extends { updatedAt?: string }>(local: T | undefined, remote: T | undefined): T | undefined {
  if (!local) return remote;
  if (!remote) return local;
  return (local.updatedAt || "") >= (remote.updatedAt || "") ? local : remote;
}

export function activateLocalUser(userId: string | null) {
  setActiveProgressUser(userId);
  setActiveTopicUser(userId);
  setActiveMedicationUser(userId);
}

export async function syncLearningProgress(userId: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase ist nicht konfiguriert.");
  // Switch the local storage namespace before any remote work starts. This
  // prevents answers given immediately after login from landing in guest data.
  activateLocalUser(userId);
  const [questionsResult, topicsResult, medicationResult] = await Promise.all([
    client.from("learning_question_progress").select("question_id,correct_count,last_result,updated_at").eq("user_id", userId),
    client.from("learning_topic_progress").select("topic_number,completed,updated_at").eq("user_id", userId),
    client.from("learning_medication_progress").select("case_id,attempts,correct_count,updated_at").eq("user_id", userId),
  ]);
  const fetchError = questionsResult.error || topicsResult.error || medicationResult.error;
  if (fetchError) throw fetchError;

  const guestImportOwner = localStorage.getItem(GUEST_IMPORT_OWNER_KEY);
  const useGuest = !guestImportOwner || guestImportOwner === userId;
  const accountQuestions = JSON.parse(localStorage.getItem(questionProgressStorageKey(userId)) || "{}") as QuestionProgress;
  const guestQuestions = useGuest ? JSON.parse(localStorage.getItem(QUESTION_PROGRESS_KEY) || "{}") as QuestionProgress : {};
  const questionProgress: QuestionProgress = {};
  for (const row of questionsResult.data || []) questionProgress[row.question_id] = { correctCount: row.correct_count, lastResult: row.last_result, updatedAt: row.updated_at };
  for (const source of [accountQuestions, guestQuestions]) for (const [id, record] of Object.entries(source)) {
    const merged = newer(record, questionProgress[id]);
    if (merged) questionProgress[id] = merged;
  }

  const topicProgress: TopicProgress = {};
  for (const row of topicsResult.data || []) topicProgress[row.topic_number] = { completed: row.completed, updatedAt: row.updated_at };
  for (const [id, record] of Object.entries(readTopicProgress(userId))) {
    const merged = newer(record, topicProgress[id]);
    if (merged) topicProgress[id] = merged;
  }
  if (useGuest) {
    const oldTopics = JSON.parse(localStorage.getItem(LEGACY_COMPLETED_TOPICS_KEY) || "[]") as number[];
    for (const number of oldTopics) if (Number.isInteger(number) && number > 0 && !topicProgress[number]) topicProgress[number] = { completed: true, updatedAt: new Date().toISOString() };
  }

  const medicationProgress: MedicationProgress = {};
  for (const row of medicationResult.data || []) medicationProgress[row.case_id] = { attempts: row.attempts, correct: row.correct_count, updatedAt: row.updated_at };
  for (const source of [readMedicationProgress(userId), useGuest ? readMedicationProgress(null) : {}]) for (const [id, record] of Object.entries(source)) {
    const merged = newer(record, medicationProgress[id]);
    if (merged) medicationProgress[id] = merged;
  }

  const [qSave, tSave, mSave] = await Promise.all([
    Object.entries(questionProgress).length ? client.from("learning_question_progress").upsert(Object.entries(questionProgress).map(([question_id, record]) => ({ user_id: userId, question_id, correct_count: record.correctCount, last_result: record.lastResult, updated_at: record.updatedAt })), { onConflict: "user_id,question_id" }) : Promise.resolve({ error: null }),
    Object.entries(topicProgress).length ? client.from("learning_topic_progress").upsert(Object.entries(topicProgress).map(([topic_number, record]) => ({ user_id: userId, topic_number: Number(topic_number), completed: record.completed, updated_at: record.updatedAt })), { onConflict: "user_id,topic_number" }) : Promise.resolve({ error: null }),
    Object.entries(medicationProgress).length ? client.from("learning_medication_progress").upsert(Object.entries(medicationProgress).map(([case_id, record]) => ({ user_id: userId, case_id, attempts: record.attempts, correct_count: record.correct, updated_at: record.updatedAt || new Date().toISOString() })), { onConflict: "user_id,case_id" }) : Promise.resolve({ error: null }),
  ]);
  const saveError = qSave.error || tSave.error || mSave.error;
  if (saveError) throw saveError;
  localStorage.setItem(questionProgressStorageKey(userId), JSON.stringify(questionProgress));
  localStorage.setItem(topicProgressStorageKey(userId), JSON.stringify(topicProgress));
  localStorage.setItem(medicationProgressStorageKey(userId), JSON.stringify(medicationProgress));
  if (useGuest) localStorage.setItem(GUEST_IMPORT_OWNER_KEY, userId);
  activateLocalUser(userId);
  return { questionProgress, completedTopics: completedTopicsFromProgress(topicProgress) };
}

export async function saveQuestionProgress(userId: string, progress: QuestionProgress) {
  const client = getSupabaseClient();
  const rows = Object.entries(progress).map(([question_id, record]) => ({
    user_id: userId,
    question_id,
    correct_count: record.correctCount,
    last_result: record.lastResult,
    updated_at: record.updatedAt,
  }));
  if (!client || !rows.length) return;

  // Always keep an account-scoped copy. A later login can then retry a failed
  // network write instead of silently losing the answer.
  localStorage.setItem(questionProgressStorageKey(userId), JSON.stringify(progress));

  const previous = questionSaveQueues.get(userId) || Promise.resolve();
  const next = previous.catch(() => undefined).then(async () => {
    const { error } = await client.from("learning_question_progress").upsert(rows, { onConflict: "user_id,question_id" });
    if (error) throw error;
  });
  questionSaveQueues.set(userId, next);
  try {
    await next;
  } finally {
    if (questionSaveQueues.get(userId) === next) questionSaveQueues.delete(userId);
  }
}

export async function saveTopicProgress(userId: string, topicNumber: number, completed: boolean, updatedAt: string) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from("learning_topic_progress").upsert({ user_id: userId, topic_number: topicNumber, completed, updated_at: updatedAt });
  if (error) throw error;
}

export async function saveMedicationProgress(userId: string, caseId: string, record: MedicationProgress[string]) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from("learning_medication_progress").upsert({ user_id: userId, case_id: caseId, attempts: record.attempts, correct_count: record.correct, updated_at: record.updatedAt || new Date().toISOString() });
  if (error) throw error;
}
