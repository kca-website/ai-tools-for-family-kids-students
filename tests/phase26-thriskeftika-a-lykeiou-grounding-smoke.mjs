import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";

// Phase 26: Θρησκευτικά Α΄/Β΄/Γ΄ ΓΕΛ show the official units of their PDF-only books
// (IEP guidance 106320/Δ2/07-08-2026), each grounded to a verified PDF page range.
const require = createRequire(import.meta.url);
const map = require("../gel-schoolbook-source-map-2026-2027.js");
const availability = require("../secondary-grounding-availability-2026-2027.js");
const endpoint = require("../api/schoolbook-source.js");
const update = fs.readFileSync(new URL("../gel-2026-2027-update.js", import.meta.url), "utf8");

const expected = { "thriskeftika-a-lykeiou": 21, "thriskeftika-b-lykeiou": 29, "thriskeftika-g-lykeiou": 12 };
let total = 0;
for (const [subjectId, count] of Object.entries(expected)) {
  const manifest = JSON.parse(fs.readFileSync(new URL(`../scripts/phase26/${subjectId}-pdf-sections.json`, import.meta.url), "utf8"));
  assert.equal(manifest.subjectId, subjectId);
  assert.equal(manifest.sections.length, count, subjectId);
  const row = map.get(subjectId);
  assert.equal(row.topicCoverage, "complete");
  assert.equal(row.topicMappings.length, count);
  const bookPdf = new URL(row.books[0].pdf.url).pathname.replace(/\/+$/, "");

  // AI Study topics are exactly the official units.
  const at = update.indexOf(`"id": "${subjectId}"`);
  const block = update.slice(at, update.indexOf("\n    }", at));
  const studyTopics = [...block.matchAll(/\[\s*"([^"]+)",\s*"[^"]*"\s*\]/g)].map((m) => m[1]);
  assert.deepEqual(studyTopics, manifest.sections.map((s) => s.label), subjectId);

  let previousEnd = 0;
  for (const [i, s] of manifest.sections.entries()) {
    const m = row.topicMappings[i];
    assert.equal(m.label, s.label);
    assert.equal(m.status, "exact-pdf");
    assert.equal(m.granularity, "pdf-section");
    assert.equal(new URL(m.url).pathname.replace(/\/+$/, ""), bookPdf, "same official PDF");
    assert.ok(m.pdfPage > previousEnd && m.pdfPageEnd >= m.pdfPage && m.pdfPageEnd - m.pdfPage < 20, `${subjectId} ${s.number} range`);
    assert.ok(m.heading && m.heading.length > 10);
    previousEnd = m.pdfPageEnd;
    assert.ok(availability.has(subjectId, s.label), `listed as verified: ${s.label}`);
    const resolved = endpoint._test.resolveGelInventoryTopic(subjectId, s.label);
    assert.equal(resolved.runtimeEligible, true, s.label);
    assert.equal(resolved.runtimeMode, "exact-pdf");
  }
  total += count;
}
assert.doesNotMatch(update, /Αναζήτηση νοήματος και θρησκευτική εμπειρία|Θρησκεία και αναζήτηση του ιερού|Πίστη, γνώση και επιστήμη/, "generic non-book labels must be gone");

console.log(`Phase 26 Θρησκευτικά Α΄/Β΄/Γ΄ ΓΕΛ: ${total} official units mapped to verified PDF sections.`);
