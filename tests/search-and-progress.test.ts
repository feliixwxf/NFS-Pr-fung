import test from "node:test";
import assert from "node:assert/strict";
import { normalizeSearch, topicSearchScore } from "../app/lib/contentSearch.ts";
import { dueQuestionIds, formatProgressPercent, progressMetrics } from "../app/lib/questionProgress.ts";

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

test("processing progress is unique, bounded and formatted in German",()=>{
 const wrong={correctCount:0 as const,lastResult:"wrong" as const,updatedAt:"2026-10-04"};
 const right={correctCount:1 as const,lastResult:"correct" as const,updatedAt:"2026-10-04"};
 assert.equal(progressMetrics({q1:wrong,q2:right,removed:right},["q1","q1","q2",...Array.from({length:806},(_,i)=>`new-${i}`)]).answered,2);
 assert.equal(formatProgressPercent(progressMetrics({q1:wrong,q2:right},["q1","q2",...Array.from({length:806},(_,i)=>`new-${i}`)]).completionPercent),"0,2\u00a0%");
 assert.equal(formatProgressPercent(progressMetrics({},Array.from({length:808},(_,i)=>`q${i}`)).completionPercent),"0\u00a0%");
 assert.equal(formatProgressPercent(progressMetrics({q1:right},["q1",...Array.from({length:807},(_,i)=>`q${i+2}`)]).completionPercent),"0,1\u00a0%");
 assert.equal(formatProgressPercent(progressMetrics(Object.fromEntries(Array.from({length:404},(_,i)=>[`q${i}`,right])),Array.from({length:808},(_,i)=>`q${i}`)).completionPercent),"50\u00a0%");
 assert.equal(formatProgressPercent(progressMetrics(Object.fromEntries(Array.from({length:808},(_,i)=>[`q${i}`,right])),Array.from({length:808},(_,i)=>`q${i}`)).completionPercent),"100\u00a0%");
});

test("due dates include the local day and ignore legacy records without dates",()=>{
 const progress={old:{correctCount:1 as const,lastResult:"correct" as const,updatedAt:"2020-01-01"},due:{correctCount:0 as const,lastResult:"wrong" as const,updatedAt:"2026-09-30",nextDueAt:"2026-09-30T00:00:00.000Z"},later:{correctCount:1 as const,lastResult:"correct" as const,updatedAt:"2026-10-02",nextDueAt:"2026-10-02T00:00:00.000Z"}};
 assert.deepEqual(dueQuestionIds(progress,new Date("2026-09-30T12:00:00")),["due"]);
});


test("progress text uses at most one decimal and a non-breaking space", () => {
 for (const [value, expected] of [
  [0, "0\u00a0%"], [3.36, "3,4\u00a0%"], [3.34, "3,3\u00a0%"],
  [3, "3\u00a0%"], [100, "100\u00a0%"], [0.0336, "0\u00a0%"],
  [NaN, "0\u00a0%"], [Infinity, "0\u00a0%"], [-Infinity, "0\u00a0%"],
 ] as const) {
  assert.equal(formatProgressPercent(value), expected);
 }
});

test("empty question banks and unanswered questions display zero", () => {
 for (const ids of [[], ["q1"]]) {
  const metrics = progressMetrics({}, ids);
  assert.equal(metrics.completionPercent, 0);
  assert.equal(metrics.repetitionPercent, 0);
  assert.equal(formatProgressPercent(metrics.completionPercent), "0\u00a0%");
 }
});

test("formatting does not round the underlying progress or change stored records", () => {
 const progress = { q1: { correctCount: 1 as const, lastResult: "correct" as const, updatedAt: "2026-10-04" } };
 const original = structuredClone(progress);
 const metrics = progressMetrics(progress, ["q1", "q2", "q3"]);
 assert.equal(formatProgressPercent(metrics.completionPercent), "33,3\u00a0%");
 assert.equal(metrics.completionPercent, 1 / 3 * 100);
 assert.deepEqual(progress, original);
});
