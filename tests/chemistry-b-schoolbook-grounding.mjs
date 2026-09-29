import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const handler = require("../api/schoolbook-source.js");
const internals = handler._test;

const lessonCases = new Map([
  ["Γενική Ενότητα 1 · 1.1 — Τι είναι η Χημεία και γιατί τη μελετάμε", ["index1_1.html"]],
  ["Γενική Ενότητα 1 · 1.2 — Καταστάσεις των υλικών", ["index1_2.html"]],
  ["Γενική Ενότητα 1 · 1.3 — Φυσικές ιδιότητες των υλικών", ["index1_3.html"]],
  ["Γενική Ενότητα 2 · 2.1 — Το νερό στη ζωή μας", ["index2_1.html"]],
  ["Γενική Ενότητα 2 · 2.2 — Το νερό ως διαλύτης - Μείγματα", ["index2_2_1.html", "index2_2_2.html"]],
  ["Γενική Ενότητα 2 · 2.3 — Περιεκτικότητα διαλύματος - Εκφράσεις περιεκτικότητας", ["index2_3_1.html", "index2_3_2.html", "index2_3_3.html"]],
  ["Γενική Ενότητα 2 · 2.4 — Ρύπανση του νερού", ["index2_4.html"]],
  ["Γενική Ενότητα 2 · 2.5 — Διαχωρισμός μειγμάτων", ["index2_5.html"]],
  ["Γενική Ενότητα 2 · 2.6 — Διάσπαση του νερού - Χημικές ενώσεις και χημικά στοιχεία", ["index2_6.html", "index2_6_2.html"]],
  ["Γενική Ενότητα 2 · 2.7 — Χημική αντίδραση", ["index2_7.html"]],
  ["Γενική Ενότητα 2 · 2.8 — Άτομα και μόρια", ["index2_8.html"]],
  ["Γενική Ενότητα 2 · 2.9 — Υποατομικά σωματίδια - Ιόντα", ["index2_9.html"]],
  ["Γενική Ενότητα 2 · 2.10 — Σύμβολα χημικών στοιχείων και χημικών ενώσεων", ["index2_10.html"]],
  ["Γενική Ενότητα 2 · 2.11 — Χημική εξίσωση", ["index2_11.html"]],
  ["Γενική Ενότητα 3 · 3.1 — Σύσταση του ατμοσφαιρικού αέρα", ["index3_1.html"]],
  ["Γενική Ενότητα 3 · 3.2 — Οξυγόνο", ["index3_2.html"]],
  ["Γενική Ενότητα 3 · 3.3 — Διοξείδιο του άνθρακα", ["index3_3.html"]],
  ["Γενική Ενότητα 3 · 3.4 — Η ρύπανση του αέρα", ["index3_4.html"]],
  ["Γενική Ενότητα 4 · 4.2 — Ρύπανση του εδάφους", ["index4_2.html"]]
]);

assert.equal(lessonCases.size, 19);
for (const [topic, expectedPaths] of lessonCases) {
  assert.deepEqual(internals.resolveChemistryBCurriculumPaths(topic), expectedPaths, topic);
}

for (const excluded of [
  "Γενική Ενότητα 4 · 4.1 — Το έδαφος και το υπέδαφος",
  "Γενική Ενότητα 2 · 2.12 — Εκτός ύλης"
]) {
  assert.deepEqual(internals.resolveChemistryBCurriculumPaths(excluded), [], `must fail closed: ${excluded}`);
}

const generalWindow = {};
vm.runInNewContext(fs.readFileSync(new URL("../general-education-book-sections-2026-2027.js", import.meta.url), "utf8"), { window: generalWindow });
const sections = generalWindow.AITOOLSKIDS_GENERAL_ED_BOOK_SECTIONS_2026_2027.get("chimeia-b-gymnasiou").sections;
assert.equal(sections.length, 19);
assert.ok(!sections.some(row => row.includes("4.1")));
assert.ok(sections.some(row => row.includes("2.10") && row.includes("χωρίς")));

const officialWindow = {};
vm.runInNewContext(fs.readFileSync(new URL("../official-curriculum-data.js", import.meta.url), "utf8"), { window: officialWindow });
const official = officialWindow.AITOOLSKIDS_OFFICIAL_CURRICULUM.getByQuizId("chimeia-b-gymnasiou");
assert.equal(official.annualInstructionsStatus, "2026-27-verified");
assert.equal(official.coverageStatus, "annual-guidance-detailed-map");
assert.equal(official.officialSectionsEl.length, 19);

const scoped = internals.applyCurriculumTextScope(
  "chimeia-b-gymnasiou",
  "Γενική Ενότητα 2 · 2.10 — Σύμβολα χημικών στοιχείων και χημικών ενώσεων",
  "Επιτρεπτό κείμενο πριν.\nΧημικοί τύποι ιόντων και ιοντικών ενώσεων\nΑυτό πρέπει να αφαιρεθεί."
);
assert.ok(scoped.text.includes("Επιτρεπτό κείμενο"));
assert.ok(!scoped.text.includes("Αυτό πρέπει"));
assert.equal(scoped.exclusions.length, 1);

const response = {
  statusCode: 0, body: null,
  setHeader() {},
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; }
};
await handler({ method: "GET", query: { subject: "chimeia-b-gymnasiou", topic: "Γενική Ενότητα 4 · 4.1 — Εκτός ύλης" } }, response);
assert.equal(response.statusCode, 404);
assert.equal(response.body.error, "section_not_resolved");

console.log("Chemistry B 2026-27 grounding integrity: 19 sections, fail-closed exclusions and 2.10 scope filter OK");
