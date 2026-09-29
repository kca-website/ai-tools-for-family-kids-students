import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const handler = require("../api/schoolbook-source.js");
const internals = handler._test;

const included = [
  1,2,3,
  ...Array.from({length:43}, (_,i) => i+6)
];
assert.equal(included.length, 46);

for (const lesson of included) {
  const unit = lesson <= 5 ? 1 : lesson <= 24 ? 2 : lesson <= 36 ? 3 : 4;
  const topic = `Μάθημα ${lesson} — δοκιμή`;
  assert.deepEqual(internals.resolveGeographyBCurriculumPaths(topic), [`mat${unit}_${lesson}.html`], topic);
}
for (const excluded of ["Μάθημα 4 — εκτός ύλης", "Μάθημα 5 — εκτός ύλης"]) {
  assert.deepEqual(internals.resolveGeographyBCurriculumPaths(excluded), [], `must fail closed: ${excluded}`);
}

const generalWindow = {};
vm.runInNewContext(fs.readFileSync(new URL("../general-education-book-sections-2026-2027.js", import.meta.url), "utf8"), { window: generalWindow });
const sections = generalWindow.AITOOLSKIDS_GENERAL_ED_BOOK_SECTIONS_2026_2027.get("geologia-geografia-b-gymnasiou").sections;
assert.equal(sections.length, 46);
assert.ok(!sections.some(row => row.startsWith("Μάθημα 4 —")));
assert.ok(!sections.some(row => row.startsWith("Μάθημα 5 —")));
assert.ok(sections.some(row => row.startsWith("Μάθημα 13 —") && row.includes("προαιρετικό")));

const officialWindow = {};
vm.runInNewContext(fs.readFileSync(new URL("../official-curriculum-data.js", import.meta.url), "utf8"), { window: officialWindow });
const official = officialWindow.AITOOLSKIDS_OFFICIAL_CURRICULUM.getByQuizId("geologia-geografia-b-gymnasiou");
assert.equal(official.annualInstructionsStatus, "2026-27-verified");
assert.equal(official.coverageStatus, "annual-guidance-detailed-map");
assert.equal(official.officialSectionsEl.length, 46);

const response = {
  statusCode: 0, body: null,
  setHeader() {},
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; }
};
await handler({ method: "GET", query: { subject: "geologia-geografia-b-gymnasiou", topic: "Μάθημα 4 — εκτός ύλης" } }, response);
assert.equal(response.statusCode, 404);
assert.equal(response.body.error, "section_not_resolved");

console.log("Geography B 2026-27 grounding integrity: 46 lessons, 4/5 fail closed, 13 optional");
