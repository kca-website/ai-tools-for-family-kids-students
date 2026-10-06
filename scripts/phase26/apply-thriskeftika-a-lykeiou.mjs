// Phase 26: replaces the 8 generic Θρησκευτικά Α΄ ΓΕΛ topic labels (taken from a regional
// directorate page, not from the book) with the 21 official units of «Ορθόδοξη πίστη και
// λατρεία», each grounded to its verified PDF page range (thriskeftika-a-lykeiou-pdf-sections.json).
// Idempotent: patches only the thriskeftika-a-lykeiou entries of
//   - gel-2026-2027-update.js (AI Study topics),
//   - gel-schoolbook-source-map-2026-2027.js (runtime source map),
//   - scripts/phase14/gel-site-topics-snapshot.json (inventory snapshot).
import fs from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const manifest = JSON.parse(fs.readFileSync(new URL("scripts/phase26/thriskeftika-a-lykeiou-pdf-sections.json", root), "utf8"));
const ID = manifest.subjectId;
const PDF = manifest.book.sourceUrl;

function replaceJsonArray(text, anchorIndex, key, value, indent) {
  // Replaces the JSON array that follows `"key": ` after anchorIndex.
  const keyAt = text.indexOf(`"${key}":`, anchorIndex);
  if (keyAt < 0) throw new Error(`${key} not found`);
  const open = text.indexOf("[", keyAt);
  let depth = 0, i = open;
  for (; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { i++; while (text[i] !== '"') { if (text[i] === "\\") i++; i++; } continue; }
    if (c === "[") depth++;
    else if (c === "]" && --depth === 0) break;
  }
  const body = indent == null ? JSON.stringify(value) : JSON.stringify(value, null, 2).replace(/\n/g, "\n" + " ".repeat(indent));
  return text.slice(0, open) + body + text.slice(i + 1);
}

// 1. AI Study topics.
{
  const file = new URL("gel-2026-2027-update.js", root);
  let text = fs.readFileSync(file, "utf8");
  const at = text.indexOf(`"id": "${ID}"`);
  if (at < 0) throw new Error("subject not found in gel-2026-2027-update.js");
  text = replaceJsonArray(text, at, "topics", manifest.sections.map((s) => [s.label, s.labelEn]), 6);
  const end = text.indexOf("\n    }", at);
  const block = text.slice(at, end)
    .replace(/"status": "[^"]*"/, '"status": "official-book-units"')
    .replace(/"source": "[^"]*"/, `"source": "${manifest.guidanceUrl}"`);
  text = text.slice(0, at) + block + text.slice(end);
  fs.writeFileSync(file, text);
}

// 2. Runtime source map row (exact PDF sections).
{
  const file = new URL("gel-schoolbook-source-map-2026-2027.js", root);
  let text = fs.readFileSync(file, "utf8");
  const at = text.indexOf(`"${ID}": {`);
  if (at < 0) throw new Error("subject not found in source map");
  const mappings = manifest.sections.map((s, i) => ({
    topicId: `${ID}.topic-${i + 1}`,
    label: s.label,
    status: "exact-pdf",
    work: manifest.book.work,
    url: `${PDF}#page=${s.pdfPage}`,
    pdfPage: s.pdfPage,
    pdfPageEnd: s.pdfPageEnd,
    printedPage: s.pdfPage - manifest.book.printedToPdfOffset,
    heading: s.heading,
    granularity: "pdf-section",
    matchBasis: "2026-27-iep-guidance+verified-official-pdf-section-range",
    annualScopeVerified: true,
    curriculumSource: manifest.guidanceUrl
  }));
  text = replaceJsonArray(text, at, "topicMappings", mappings, null);
  const end = text.indexOf('"topicMappings"', at);
  const head = text.slice(at, end)
    .replace(/"topicCoverage": "[^"]*"/, '"topicCoverage": "complete"')
    .replace(/"topicSummary": \{[^}]*\}/, `"topicSummary": {"total":${mappings.length},"exact-html":0,"exact-pdf":${mappings.length},"needs-manual-review":0,"no-safe-mapping":0}`);
  text = text.slice(0, at) + head + text.slice(end);
  fs.writeFileSync(file, text);
  // Keep the file-level topic totals in sync with the rows (counted from the loaded module).
  const require = createRequire(import.meta.url);
  const modulePath = fileURLToPath(file);
  delete require.cache[modulePath];
  const counts = { total: 0, "exact-html": 0, "exact-pdf": 0, "needs-manual-review": 0, "no-safe-mapping": 0 };
  for (const row of Object.values(require(modulePath).all())) {
    for (const m of row.topicMappings || []) { counts.total++; counts[m.status] = (counts[m.status] || 0) + 1; }
  }
  text = text.replace(/("summary": \{[\s\S]*?"topics": \{)[\s\S]*?(\n  \})/, (_, a, b) =>
    a + Object.entries(counts).map(([k, v]) => `\n   "${k}": ${v}`).join(",") + b);
  fs.writeFileSync(file, text);
}

// 3. Inventory snapshot.
{
  const file = new URL("scripts/phase14/gel-site-topics-snapshot.json", root);
  const snap = JSON.parse(fs.readFileSync(file, "utf8"));
  const rows = Array.isArray(snap) ? snap : (snap.subjects || []);
  const row = rows.find((r) => r.subjectId === ID);
  if (!row) throw new Error("subject not found in snapshot");
  row.topics = manifest.sections.map((s, i) => ({ id: `${ID}.topic-${i + 1}`, label: s.label, status: "official-book-unit" }));
  fs.writeFileSync(file, JSON.stringify(snap, null, 2) + "\n");
}

console.log(`Applied ${manifest.sections.length} official units for ${ID}.`);
