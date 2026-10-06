import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";

// Phase 26: Θρησκευτικά Α΄ ΓΕΛ shows the 21 official units of «Ορθόδοξη πίστη και λατρεία»
// (IEP guidance 106320/Δ2/07-08-2026), each grounded to a verified PDF page range.
const require = createRequire(import.meta.url);
const manifest = JSON.parse(fs.readFileSync(new URL("../scripts/phase26/thriskeftika-a-lykeiou-pdf-sections.json", import.meta.url), "utf8"));
const map = require("../gel-schoolbook-source-map-2026-2027.js");
const availability = require("../secondary-grounding-availability-2026-2027.js");
const endpoint = require("../api/schoolbook-source.js");

assert.equal(manifest.sections.length, 21);
const row = map.get("thriskeftika-a-lykeiou");
assert.equal(row.topicCoverage, "complete");
assert.equal(row.topicMappings.length, 21);
const bookPdf = new URL(row.books[0].pdf.url).pathname.replace(/\/+$/, "");

// AI Study topics are exactly the official units.
const update = fs.readFileSync(new URL("../gel-2026-2027-update.js", import.meta.url), "utf8");
const at = update.indexOf('"id": "thriskeftika-a-lykeiou"');
const block = update.slice(at, update.indexOf("\n    }", at));
const studyTopics = [...block.matchAll(/\[\s*"([^"]+)",\s*"[^"]*"\s*\]/g)].map((m) => m[1]);
assert.deepEqual(studyTopics, manifest.sections.map((s) => s.label));
assert.doesNotMatch(update, /Αναζήτηση νοήματος και θρησκευτική εμπειρία/, "generic non-book labels must be gone");

let previousEnd = 0;
for (const [i, s] of manifest.sections.entries()) {
  const m = row.topicMappings[i];
  assert.equal(m.label, s.label);
  assert.equal(m.status, "exact-pdf");
  assert.equal(m.granularity, "pdf-section");
  assert.equal(new URL(m.url).pathname.replace(/\/+$/, ""), bookPdf, "same official PDF");
  assert.ok(m.pdfPage > previousEnd && m.pdfPageEnd >= m.pdfPage && m.pdfPageEnd - m.pdfPage < 20, `${s.number} range`);
  assert.match(m.heading, new RegExp("^\\d\\.\\d\\. "));
  previousEnd = m.pdfPageEnd;
  assert.ok(availability.has("thriskeftika-a-lykeiou", s.label), `listed as verified: ${s.label}`);
  const resolved = endpoint._test.resolveGelInventoryTopic("thriskeftika-a-lykeiou", s.label);
  assert.equal(resolved.runtimeEligible, true, s.label);
  assert.equal(resolved.runtimeMode, "exact-pdf");
}

console.log(`Phase 26 Θρησκευτικά Α΄ ΓΕΛ: ${manifest.sections.length} official units mapped to verified PDF sections.`);
