import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const source = require("../api/schoolbook-source.js");
const chemistry = require("../api/epal-chemistry-scope.js");
const catalog = require("../epal-schoolbook-catalog-2026-2027.js");
const mapping = catalog.get(chemistry.SUBJECT, chemistry.TOPIC);

assert.ok(chemistry.selected(mapping, chemistry.SUBJECT, chemistry.TOPIC));
assert.equal(chemistry.selected(mapping, "epal-c-chemistry", chemistry.TOPIC), false);
assert.equal(chemistry.scope("Incomplete fabricated section").ok, false);

for (const purpose of ["", "audio"]) {
  const r = await source.resolveOfficialSchoolbookSource(chemistry.SUBJECT, chemistry.TOPIC, {
    purpose, schoolType: "epal", grade: "b"
  });
  assert.equal(r.status, 200, purpose + ": " + JSON.stringify({ error: r.body?.error, message: r.body?.message }));
  assert.equal(r.body?.grounded, true);
  assert.equal(r.body?.curriculumScopeApplied, true);
  assert.equal(r.body?.mappingStatus, "official-epal-pdf-curriculum-scoped");
  assert.match(r.body?.sourceUrl || "", /^https:\/\/ebooks\.edu\.gr\/ebooks\/v\/pdf\//);
  assert.equal(r.body?.pdfPage, 10, "§1.1 must not omit printed page 9");
  assert.ok(r.body?.curriculumExclusions?.length >= 2);
  const t = r.body?.text || "";
  assert.ok(t.length > 4000, "both complete §1.1–1.2 and selected later subparts must be substantial");
  assert.match(t, /Οργανική χημεία ονομάζεται/);
  assert.match(t, /Ταξινόμηση οργανικών ενώσεων/);
  assert.match(t, /Δηλαδή, προπάνιο/);
  assert.match(t, /2-μεθυλοβουτάνιο/);
  assert.match(t, /2,4-διμεθυλοεξάνιο/);
  assert.match(t, /Ισομέρεια αλυσίδας ονομάζεται/);
  assert.doesNotMatch(t, /Ισομέρεια θέσης ονομάζεται/);
  assert.doesNotMatch(t, /Στερεοϊσομέρεια:/);
  const s13 = t.split("§1.3 · Μόνο ονοματολογία κορεσμένων υδρογονανθράκων")[1]?.split("§1.4 · Μόνο ισομέρεια αλυσίδας")[0];
  assert.ok(s13);
  assert.doesNotMatch(s13, /βουτένιο|αλκοόλη|βουτινικό οξύ/);
  if (purpose === "audio") assert.equal(r.body?.sourceCompleteness?.complete, true);
  console.log(JSON.stringify({ purpose: purpose || "study", chars: t.length, mode: r.body.mappingStatus, passed: true }));
}
