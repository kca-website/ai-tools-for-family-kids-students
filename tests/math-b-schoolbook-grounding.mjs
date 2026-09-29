import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const handler = require("../api/schoolbook-source.js");
const internals = handler._test;

const lessonCases = new Map([
  ["Μέρος Α · 1.1 — Η έννοια της μεταβλητής - Αλγεβρικές παραστάσεις", "indexA1_1.html"],
  ["Μέρος Α · 1.2 — Εξισώσεις α' βαθμού", "indexA1_2.html"],
  ["Μέρος Α · 1.4 — Επίλυση προβλημάτων με τη χρήση εξισώσεων", "indexA1_4.html"],
  ["Μέρος Α · 2.1 — Τετραγωνική ρίζα θετικού αριθμού", "indexA2_1.html"],
  ["Μέρος Α · 2.2 — Άρρητοι αριθμοί - Πραγματικοί αριθμοί", "indexA2_2.html"],
  ["Μέρος Α · 2.3 — Προβλήματα (προαιρετικό)", "indexA2_3.html"],
  ["Μέρος Α · 3.1 — Η έννοια της συνάρτησης", "indexA3_1.html"],
  ["Μέρος Α · 3.2 — Καρτεσιανές συντεταγμένες - Γραφική παράσταση συνάρτησης", "indexA3_2.html"],
  ["Μέρος Α · 3.3 — Η συνάρτηση y = α·x", "indexA3_3.html"],
  ["Μέρος Α · 3.4 — Η συνάρτηση y = α·x + β", "indexA3_4.html"],
  ["Μέρος Α · 3.5 — Η συνάρτηση y = α/x - Η υπερβολή", "indexA3_5.html"],
  ["Μέρος Α · 4.1 — Βασικές έννοιες της Στατιστικής: Πληθυσμός - Δείγμα", "indexA4_1.html"],
  ["Μέρος Α · 4.2 — Γραφικές παραστάσεις", "indexA4_2.html"],
  ["Μέρος Α · 4.5 — Μέση τιμή - Διάμεσος", "indexA4_5.html"],
  ["Μέρος Β · 1.1 — Εμβαδόν επίπεδης επιφάνειας", "indexB1_1.html"],
  ["Μέρος Β · 1.2 — Μονάδες μέτρησης επιφανειών", "indexB1_2.html"],
  ["Μέρος Β · 1.3 — Εμβαδά επίπεδων σχημάτων", "indexB1_3.html"],
  ["Μέρος Β · 1.4 — Πυθαγόρειο θεώρημα", "indexB1_4.html"],
  ["Μέρος Β · 2.1 — Εφαπτομένη οξείας γωνίας", "indexB2_1.html"],
  ["Μέρος Β · 2.2 — Ημίτονο και συνημίτονο οξείας γωνίας", "indexB2_2.html"],
  ["Μέρος Β · 3.1 — Εγγεγραμμένες γωνίες", "indexB3_1.html"],
  ["Μέρος Β · 3.2 — Κανονικά πολύγωνα", "indexB3_2.html"],
  ["Μέρος Β · 3.3 — Μήκος κύκλου", "indexB3_3.html"],
  ["Μέρος Β · 3.5 — Εμβαδόν κυκλικού δίσκου", "indexB3_5.html"],
  ["Μέρος Β · 4.2 — Στοιχεία και εμβαδόν πρίσματος και κυλίνδρου", "indexB4_2.html"],
  ["Μέρος Β · 4.3 — Όγκος πρίσματος και κυλίνδρου", "indexB4_3.html"],
  ["Μέρος Β · 4.4 — Η πυραμίδα και τα στοιχεία της (προαιρετικό)", "indexB4_4.html"],
  ["Μέρος Β · 4.6 — Η σφαίρα και τα στοιχεία της (προαιρετικό)", "indexB4_6.html"]
]);

assert.equal(lessonCases.size, 28);
for (const [topic, expectedPath] of lessonCases) {
  assert.deepEqual(internals.resolveMathBCurriculumPaths(topic), [expectedPath], topic);
  assert.equal(internals.mathBTopicKey(topic), expectedPath.replace(/^index([AB])(\d+)_(\d+)\.html$/, "$1.$2.$3"), topic);
}

for (const excluded of [
  "Μέρος Α · 1.3 — Επίλυση τύπων",
  "Μέρος Α · 1.5 — Ανισώσεις α' βαθμού",
  "Μέρος Α · 4.3 — Κατανομή συχνοτήτων",
  "Μέρος Α · 4.4 — Ομαδοποίηση παρατηρήσεων",
  "Μέρος Β · 2.3 — Μεταβολές ημιτόνου και συνημιτόνου",
  "Μέρος Β · 3.4 — Μήκος τόξου",
  "Μέρος Β · 4.1 — Ευθείες και επίπεδα στον χώρο",
  "Μέρος Β · 4.5 — Κώνος",
  "Μέρος Β · 4.7 — Εμβαδόν και όγκος σφαίρας",
  "Όμοιοι μονόμιοι όροι",
  "Ταυτότητα (α+β)²"
]) {
  assert.deepEqual(internals.resolveMathBCurriculumPaths(excluded), [], `must fail closed: ${excluded}`);
}

const generalWindow = {};
vm.runInNewContext(fs.readFileSync(new URL("../general-education-book-sections-2026-2027.js", import.meta.url), "utf8"), { window: generalWindow });
const sections = generalWindow.AITOOLSKIDS_GENERAL_ED_BOOK_SECTIONS_2026_2027.get("mathimatika-b-gymnasiou").sections;
assert.equal(sections.length, 28);
for (const topic of lessonCases.keys()) assert.ok(sections.includes(topic), topic);
assert.ok(!sections.some(row => row.includes("1.3 — Επίλυση τύπων")));
assert.ok(!sections.some(row => row.includes("3.4 — Μήκος τόξου")));

const officialWindow = {};
vm.runInNewContext(fs.readFileSync(new URL("../official-curriculum-data.js", import.meta.url), "utf8"), { window: officialWindow });
const official = officialWindow.AITOOLSKIDS_OFFICIAL_CURRICULUM.getByQuizId("mathimatika-b-gymnasiou");
assert.equal(official.annualInstructionsStatus, "2026-27-verified");
assert.equal(official.coverageStatus, "annual-guidance-detailed-map");
assert.equal(official.officialSectionsEl.length, 28);
assert.equal(official.mappedTopicsEl.length, 28);

const response = {
  statusCode: 0, body: null,
  setHeader() {},
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; }
};
await handler({ method: "GET", query: { subject: "mathimatika-b-gymnasiou", topic: "Μέρος Α · 1.3 — Εκτός ύλης" } }, response);
assert.equal(response.statusCode, 404);
assert.equal(response.body.error, "section_not_resolved");

console.log("Math B 2026-27 grounding integrity: 28 mapped sections, exclusions fail closed");
