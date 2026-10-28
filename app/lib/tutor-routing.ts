export type TutorFollowUpKind = "dose" | "contraindication" | "finding" | "differential" | "complication" | "reevaluation" | "transport" | "mechanism" | "definition" | "target";

function normalizeRoutingText(value: string) {
  return value
    .replace(/Ä/g, "Ae").replace(/Ö/g, "Oe").replace(/Ü/g, "Ue")
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .toLocaleLowerCase("de")
    .replace(/[^a-z0-9+./ -]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isTutorSolutionRequest(value: string) {
  const request = normalizeRoutingText(value);
  const wordCount = request.split(" ").filter(Boolean).length;
  return wordCount <= 8
    && /^(?:bitte\s+)?(?:zeig(?:e)?\s+(?:mir\s+)?(?:die\s+)?)?(?:musterl(?:oe|o)sung|aufl(?:oe|o)sung|l(?:oe|o)sung)(?:\s+bitte)?[.!?]*$/.test(request);
}

export function classifyTutorFollowUp(area: string, question: string, target: string, incorrectDose = false): TutorFollowUpKind {
  const scope = normalizeRoutingText(`${area} ${question}`);
  const missing = normalizeRoutingText(target);

  // Der ursprüngliche Fragetyp hat Vorrang. Ein einzelner Begriff in der
  // Musterlösung darf niemals in einen fremden Prüfungsbereich umleiten.
  if (/dosier|dosis|medikament|aufzieh|zubereit|konzentration|applikation|wirkstoffmenge/.test(scope)) return "dose";
  if (/kontra|gegenanzeige|allerg|sicherheitsgrenze/.test(scope)) return "contraindication";
  if (/differenzial|differential|abgrenz|ausschliess/.test(scope)) return "differential";
  if (/symptom|befund|diagnos|erkenn|zeichen|untersuch/.test(scope)) return "finding";
  if (/komplikation|gefahr|verschlechter/.test(scope)) return "complication";
  if (/reevalu|kontroll|monitor|wirkungskontrolle|abbruch|eskal/.test(scope)) return "reevaluation";
  if (/transport|zielklinik|uebergabe|notarzt/.test(scope)) return "transport";
  if (/pathophysi|entsteh|mechanismus|rezeptor|regulation|vasokonstriktion|stoffwechsel/.test(scope)) return "mechanism";
  if (/definition|bedeutet|unterschied|aufbau|anatom|rolle spiel/.test(scope)) return "definition";

  // Nur wenn die Ausgangsfrage keinen Typ vorgibt, darf der tatsächlich
  // fehlende Kernpunkt die Nachfrage präzisieren. Dosierungen bleiben dabei
  // gesperrt, solange die Ausgangsfrage nicht ausdrücklich danach fragt.
  if (/kontra|gegenanzeige|allerg|sicherheitsgrenze/.test(missing)) return "contraindication";
  if (/differenzial|differential|abgrenz|ausschliess/.test(missing)) return "differential";
  if (/symptom|befund|diagnos|erkenn|zeichen/.test(missing)) return "finding";
  if (/komplikation|gefahr|verschlechter/.test(missing)) return "complication";
  if (/reevalu|kontroll|monitor|abbruch|eskal/.test(missing)) return "reevaluation";
  if (/transport|zielklinik|uebergabe|notarzt/.test(missing)) return "transport";
  if (/pathophysi|entsteh|mechanismus|rezeptor/.test(missing)) return "mechanism";
  if (/definition|bedeutet|unterschied|abgrenz/.test(missing)) return "definition";
  if (incorrectDose && /medikament|therapie/.test(scope)) return "dose";
  return "target";
}

export function sameTutorTopic(left: string, right: string) {
  const a = normalizeRoutingText(left);
  const b = normalizeRoutingText(right);
  return Boolean(a && b && (a === b || a.includes(b) || b.includes(a)));
}
