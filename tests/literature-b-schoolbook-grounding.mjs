import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const handler = require("../api/schoolbook-source.js");
const internals = handler._test;

const samples = new Map([
  ["Οδυσσέας Ελύτης — «Πίνοντας ήλιο κορινθιακό»", "indexa_1.html"],
  ["Άννα Φρανκ — «Από το ημερολόγιο της Άννας Φρανκ»", "indexc_2.html"],
  ["Αντουάν ντε Σαιντ-Εξυπερύ — «Ο μικρός πρίγκιπας και η αλεπού»", "indexj_5.html"],
  ["Κ.Π. Καβάφης — «Θερμοπύλες»", "indexk_1.html"],
  ["Δημοτικά τραγούδια της ξενιτιάς — «Ξενιτεμένο μου πουλί»", "indexh_1.html"]
]);

for (const [topic, expectedPath] of samples) {
  assert.deepEqual(internals.resolveLiteratureBCurriculumPaths(topic), [expectedPath], topic);
}

for (const unresolved of [
  "Ο άνθρωπος και η φύση",
  "Ξενιτιά",
  "Ένα κείμενο που δεν υπάρχει στο ανθολόγιο"
]) {
  assert.deepEqual(internals.resolveLiteratureBCurriculumPaths(unresolved), [], `must fail closed: ${unresolved}`);
}

assert.equal(internals.LITERATURE_B_2026_2027_TEXTS.length, 68);
assert.equal(
  internals.LITERATURE_B_2026_2027_TEXTS.reduce((n, row) => n + row.titles.length, 0),
  70
);

const generalWindow = {};
vm.runInNewContext(
  fs.readFileSync(new URL("../general-education-book-sections-2026-2027.js", import.meta.url), "utf8"),
  { window: generalWindow }
);
const sections = generalWindow.AITOOLSKIDS_GENERAL_ED_BOOK_SECTIONS_2026_2027.get("logotechnia-b-gymnasiou").sections;
assert.equal(sections.length, 68);

const officialWindow = {};
vm.runInNewContext(
  fs.readFileSync(new URL("../official-curriculum-data.js", import.meta.url), "utf8"),
  { window: officialWindow }
);
const official = officialWindow.AITOOLSKIDS_OFFICIAL_CURRICULUM.getByQuizId("logotechnia-b-gymnasiou");
assert.equal(official.annualInstructionsStatus, "2026-27-flexible-selection");
assert.equal(official.coverageStatus, "annual-guidance-flexible-selection");
assert.equal(official.officialSectionsEl.length, 68);
assert.ok(official.scopeNoteEl.includes("δεν βαφτίζει τα 68 κείμενα «υποχρεωτική ύλη»"));

const response = {
  statusCode: 0, body: null,
  setHeader() {},
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; }
};
await handler(
  { method: "GET", query: { subject: "logotechnia-b-gymnasiou", topic: "Ο άνθρωπος και η φύση" } },
  response
);
assert.equal(response.statusCode, 404);
assert.equal(response.body.error, "section_not_resolved");

console.log("Literature B 2026-27 grounding integrity: 68 official anthology pages, flexible selection, text-level fail closed");
