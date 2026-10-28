import assert from "node:assert/strict";
import test from "node:test";

import { classifyTutorFollowUp, isTutorSolutionRequest, sameTutorTopic } from "../app/lib/tutor-routing.ts";

test("recognizes solution commands without treating ordinary answers as commands", () => {
  for (const command of ["Lösung", "Auflösung", "Musterlösung", "Zeig mir die Lösung", "Lösung bitte"]) {
    assert.equal(isTutorSolutionRequest(command), true, command);
  }
  for (const answer of ["Die Lösung ist Vorhofflimmern", "Dosierung", "Ich löse zuerst das A-Problem"]) {
    assert.equal(isTutorSolutionRequest(answer), false, answer);
  }
});

test("keeps adaptive follow-ups inside the original question type", () => {
  assert.equal(
    classifyTutorFollowUp("Haut", "Welche Rolle spielen Epidermis, Dermis und Subkutis?", "2 mg", true),
    "definition",
    "an anatomy question must never become a dose question",
  );
  assert.equal(
    classifyTutorFollowUp("Pathophysiologie", "Wie entsteht der Spannungspneumothorax?", "Druckanstieg", false),
    "mechanism",
  );
  assert.equal(
    classifyTutorFollowUp("Medikament · Dosierung", "Wie wird Midazolam dosiert?", "2 mg i.v.", false),
    "dose",
  );
  assert.equal(
    classifyTutorFollowUp("Differenzialdiagnosen", "Wovon muss abgegrenzt werden?", "Lungenembolie", false),
    "differential",
  );
});

test("compares topic names consistently", () => {
  assert.equal(sameTutorTopic("Akute Pankreatitis", "Pankreatitis"), true);
  assert.equal(sameTutorTopic("Unterkühlung", "Unterkuehlung"), true);
  assert.equal(sameTutorTopic("Unterkühlung", "Barotrauma"), false);
});
