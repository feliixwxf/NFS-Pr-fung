import test from "node:test";
import assert from "node:assert/strict";
import { normalizeSearch, topicSearchScore } from "../app/lib/contentSearch.ts";
import { dueQuestionIds, progressMetrics } from "../app/lib/questionProgress.ts";

test("topic aliases ignore case, whitespace, hyphens and umlaut spellings",()=>{
 assert.equal(topicSearchScore("Myokardinfarkt","  HERZINFARKT  "),90);
 assert.equal(topicSearchScore("Apoplex","Schlaganfall"),90);
 assert.equal(topicSearchScore("Lungenembolie","lae"),90);
 assert.equal(topicSearchScore("Akutes Koronarsyndrom","ACS"),90);
 assert.equal(topicSearchScore("Schädelhirntrauma","sht"),90);
 assert.equal(normalizeSearch(" Schädel-Hirn  "),"schadel hirn");
 assert.equal(topicSearchScore("Geburt","Herzinfarkt"),0);
});

test("progress metrics keep old records and only show substantiated hit rates",()=>{
 const old={q1:{correctCount:1 as const,lastResult:"correct" as const,updatedAt:"2026-01-01T00:00:00Z"}};
 assert.deepEqual(progressMetrics(old,["q1","q2"]),{answered:1,available:2,completionPercent:50,repetitionPercent:17,hitRate:null,attempts:0});
 const tracked={q1:{...old.q1,attempts:5,correctAttempts:4}};
 assert.equal(progressMetrics(tracked,["q1"]).hitRate,80);
});

test("due dates include the local day and ignore legacy records without dates",()=>{
 const progress={old:{correctCount:1 as const,lastResult:"correct" as const,updatedAt:"2020-01-01"},due:{correctCount:0 as const,lastResult:"wrong" as const,updatedAt:"2026-09-30",nextDueAt:"2026-09-30T00:00:00.000Z"},later:{correctCount:1 as const,lastResult:"correct" as const,updatedAt:"2026-10-02",nextDueAt:"2026-10-02T00:00:00.000Z"}};
 assert.deepEqual(dueQuestionIds(progress,new Date("2026-09-30T12:00:00")),["due"]);
});
