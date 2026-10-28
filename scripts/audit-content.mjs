import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import ts from "typescript";

const projectRoot = process.cwd();
const appRoot = path.join(projectRoot, "app");
const publicRoot = path.join(projectRoot, "public");

const normalize = value => value
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

async function sourceFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(absolute);
    return /\.(?:ts|tsx)$/.test(entry.name) ? [absolute] : [];
  }));
  return nested.flat();
}

const propertyName = property => property.name && ts.isIdentifier(property.name) || property.name && ts.isStringLiteral(property.name)
  ? property.name.text
  : "";

const literalText = node => node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : null;

function objectValues(node) {
  const values = new Map();
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const name = propertyName(property);
    const text = literalText(property.initializer);
    if (text !== null) values.set(name, text);
    if (ts.isNumericLiteral(property.initializer)) values.set(name, Number(property.initializer.text));
  }
  return values;
}

export async function auditContent() {
  const files = await sourceFiles(appRoot);
  const errors = [];
  const warnings = [];
  const assets = new Set();
  let checkedQuestions = 0;
  let checkedPreparations = 0;

  for (const file of files) {
    const relative = path.relative(projectRoot, file);
    const source = await fs.readFile(file, "utf8");
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const ids = new Map();
    const prompts = new Map();

    const staleVfa = source.match(/\bVFA\b.{0,35}\b20(?:1\d|2[0-5])\b/gi) ?? [];
    for (const match of staleVfa) errors.push(`${relative}: möglicherweise veralteter VFA-Stand „${match.replace(/\s+/g, " ")}"`);

    const visit = node => {
      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        if (/^\/lessons\//.test(node.text)) assets.add(node.text.split(/[?#]/)[0]);
      }

      if (ts.isObjectLiteralExpression(node)) {
        const values = objectValues(node);
        const id = values.get("id");
        if (typeof id === "string") {
          const prior = ids.get(id);
          if (prior) errors.push(`${relative}: doppelte statische ID „${id}“`);
          else ids.set(id, node.getStart(ast));
        }

        const promptKind = values.has("question") ? "question" : values.has("prompt") ? "prompt" : "";
        const prompt = values.get(promptKind);
        const answer = values.get("answer");
        if (typeof prompt === "string") {
          checkedQuestions += 1;
          const image = node.properties.find(property => ts.isPropertyAssignment(property) && propertyName(property) === "image");
          const imageKey = image && ts.isPropertyAssignment(image) ? image.initializer.getText(ast) : "";
          // Bildfragen dürfen denselben neutralen Arbeitsauftrag verwenden: Erst
          // der jeweilige Streifen macht die konkrete Aufgabe eindeutig.
          const key = `${promptKind}:${normalize(prompt)}:${normalize(imageKey)}`;
          const prior = prompts.get(key);
          if (prior && prior.answer !== answer) warnings.push(`${relative}: gleiche Frage mit unterschiedlicher Antwort: „${prompt.slice(0, 110)}“`);
          else if (prior) warnings.push(`${relative}: doppelte Frage: „${prompt.slice(0, 110)}“`);
          else prompts.set(key, { answer, prompt });
        }

        const name = values.get("name");
        const drugMl = values.get("drugMl");
        const salineMl = values.get("salineMl");
        const totalMl = values.get("totalMl");
        if (typeof name === "string" && [drugMl, salineMl, totalMl].every(value => typeof value === "number")) {
          checkedPreparations += 1;
          if (Math.abs(Number(drugMl) + Number(salineMl) - Number(totalMl)) > 0.001) {
            errors.push(`${relative}: Volumenwiderspruch bei ${name}: ${drugMl} ml + ${salineMl} ml ≠ ${totalMl} ml`);
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(ast);
  }

  for (const asset of assets) {
    try { await fs.access(path.join(publicRoot, asset)); }
    catch { errors.push(`Fehlendes Lernbild: public${asset}`); }
  }

  return {
    files: files.length,
    assets: assets.size,
    questions: checkedQuestions,
    preparations: checkedPreparations,
    errors: [...new Set(errors)],
    warnings: [...new Set(warnings)],
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const result = await auditContent();
  if (process.argv.includes("--json")) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(`Inhaltsprüfung: ${result.files} Dateien · ${result.questions} statische Fragen · ${result.preparations} Zubereitungen · ${result.assets} Lernbilder`);
    for (const warning of result.warnings) console.warn(`WARNUNG: ${warning}`);
    for (const error of result.errors) console.error(`FEHLER: ${error}`);
    console.log(result.errors.length ? `${result.errors.length} kritische Inhaltsfehler gefunden.` : "Keine kritischen Inhaltsfehler gefunden.");
  }
  if (result.errors.length) process.exitCode = 1;
}
