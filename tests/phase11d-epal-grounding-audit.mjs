import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

// Phase 11D (updated 2026-10-06): ΕΠΑΛ units are grounded only through the dedicated
// EPAL_BOOK_CATALOG (epal-schoolbook-catalog-2026-2027.js). The catalog must match the EPAL
// curriculum shown in AI Study, never borrow ΓΕΛ mappings, and fail closed when a unit has no
// verified official schoolbook section.
const require = createRequire(import.meta.url);
const root = new URL("../", import.meta.url);
const apiSource = fs.readFileSync(new URL("api/schoolbook-source.js", root), "utf8");
const studyContext = fs.readFileSync(new URL("study-context.js", root), "utf8");
const studyHtml = fs.readFileSync(new URL("study.html", root), "utf8");

assert.match(studyContext, /hasCurriculumSelection && \(schoolLevel === "middle" \|\| schoolLevel === "high"\)\) return "official_required"/);

const EPAL = require("../epal-schoolbook-catalog-2026-2027.js");
assert.equal(EPAL.schema, "aitools4kids.epal-schoolbook-catalog/1");
assert.equal(EPAL.schoolYear, "2026-2027");

// EPAL subject ids must never resolve through the ΓΕΛ/Γυμνάσιο BOOKS table.
const booksBlock = apiSource.slice(apiSource.indexOf("const BOOKS = {"), apiSource.indexOf("const ALIASES = {"));
const schoolbookIds = new Set([...booksBlock.matchAll(/^\s{2}"([^"]+)":\s*\{/gm)].map((m) => m[1]));
for (const group of EPAL.groups) for (const id of group.subjectIds) assert.ok(!schoolbookIds.has(id), `${id} must not use a non-EPAL mapping`);
assert.match(apiSource, /schoolType === "epal" \|\| \/\^epal-\[abc\]-\/\.test\(subject\)/, "EPAL requests must be routed to the EPAL catalog first");
assert.match(studyHtml, /&schoolType=epal&grade=/, "AI Study must send schoolType/grade for EPAL source requests");

// Every official book is an ebooks.edu.gr PDF; every unit has a verified heading and a sane range.
for (const [key, book] of Object.entries(EPAL.books)) {
  assert.match(book.viewUrl, /^https:\/\/ebooks\.edu\.gr\/ebooks\/v\/pdf\//, key);
  assert.match(book.downloadUrl, /^https:\/\/ebooks\.edu\.gr\/ebooks\/d\/.*\.pdf$/, key);
}

// Structural validator: AI Study EPAL curriculum ↔ catalog (unmapped / stale / wrong grade,
// sector, specialty / unknown books / duplicates). Must report zero errors.
const run = spawnSync(process.execPath, [new URL("scripts/epal/validate-epal-schoolbook-catalog.mjs", root).pathname, "--json"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
assert.equal(run.status, 0, run.stdout.slice(-2000) + run.stderr);
const report = JSON.parse(run.stdout);
assert.equal(report.summary.errors, 0);
assert.equal(report.summary.grades, 3);
assert.ok(report.summary.sectors >= 9 && report.summary.specialties >= 35, "all EPAL sectors and specialties must be covered");
assert.ok(report.summary.mappedUnits >= 1300, `expected ≥1300 mapped EPAL units, got ${report.summary.mappedUnits}`);

// Endpoint contract (no network needed for these cases).
const handler = require("../api/schoolbook-source.js");
async function call(query) {
  let status = 0, body = null;
  const res = { setHeader() {}, status(c) { status = c; return this; }, json(b) { body = b; return b; } };
  await handler({ method: "GET", headers: {}, query }, res);
  return { status, body };
}
const unmapped = await call({ subject: "epal-a-pe", topic: "Γράψε τον ακριβή τίτλο κεφαλαίου ή ενότητας από το βιβλίο/την εγκύκλιο", schoolType: "epal", grade: "a" });
assert.equal(unmapped.status, 404);
assert.equal(unmapped.body.error, "epal_source_not_mapped");
assert.equal(unmapped.body.grounded, false);

const physics = EPAL.getGroup("epal-a-physics");
const physicsTopic = Object.keys(physics.units)[0];
const mismatch = await call({ subject: "epal-a-physics", topic: physicsTopic, schoolType: "epal", grade: "c" });
assert.equal(mismatch.status, 409, "a wrong grade must not be grounded");
assert.equal(mismatch.body.error, "epal_context_mismatch");

const sectorGroup = EPAL.groups.find((g) => g.grade === "b" && g.sectorIds.length === 1 && Object.keys(g.units).length);
const wrongSector = await call({ subject: sectorGroup.subjectIds[0], topic: Object.keys(sectorGroup.units)[0], schoolType: "epal", grade: "b", sector: "Τομέας που δεν υπάρχει" });
assert.equal(wrongSector.status, 409, "a wrong sector must not be grounded");

const specialtyGroup = EPAL.groups.find((g) => g.grade === "c" && g.specialtyIds.length === 1 && Object.keys(g.units).length);
const wrongSpecialty = await call({ subject: specialtyGroup.subjectIds[0], topic: Object.keys(specialtyGroup.units)[0], schoolType: "epal", grade: "c", specialty: "no-such-specialty" });
assert.equal(wrongSpecialty.status, 409, "a wrong specialty must not be grounded");

// «ΔΙΔΑΚΤΙΚΗ ΕΝΟΤΗΤΑ N» is curriculum numbering: grounded only through the guidance-cited range.
const electrical = EPAL.getGroup("epal-a-electrical-electronics");
assert.equal(electrical.units["ΔΙΔΑΚΤΙΚΗ ΕΝΟΤΗΤΑ 2"][4], "guidance-pages");
assert.equal(electrical.units["ΔΙΔΑΚΤΙΚΗ ΕΝΟΤΗΤΑ 2"][1], 18, "ΔΕ2 = Κεφ. 1 §1.1 (σελ. 5 → PDF 18), not chapter 2");
assert.equal(electrical.unmapped["ΔΙΔΑΚΤΙΚΗ ΕΝΟΤΗΤΑ 1"], "guidance-cites-no-book-section");

// A range cut at maxPdfSpan is not the complete unit: complete audio must refuse it.
const cappedTopic = Object.entries(electrical.units).find(([, u]) => u[6] === 1)?.[0];
assert.ok(cappedTopic, "expected a capped EPAL range");
assert.equal(EPAL.get("epal-a-electrical-electronics", cappedTopic).rangeCapped, true);
const cappedAudio = await call({ subject: "epal-a-electrical-electronics", topic: cappedTopic, schoolType: "epal", grade: "a", purpose: "audio" });
assert.equal(cappedAudio.status, 409);
assert.equal(cappedAudio.body.error, "complete_section_not_mapped");

// Long Β΄ sector subject ids (>120 chars) must still resolve.
const longId = EPAL.groups.flatMap((g) => g.subjectIds).sort((a, b) => b.length - a.length)[0];
assert.ok(longId.length > 120);
assert.ok(EPAL.getGroup(longId));

console.log("PHASE11_EPAL_GROUNDING_AUDIT=" + JSON.stringify({
  subjects: report.summary.subjects,
  units: report.summary.units,
  mappedUnits: report.summary.mappedUnits,
  unmappedUnits: report.summary.unmappedUnits,
  unmappedByReason: report.summary.unmappedByReason,
  books: report.summary.books
}));
