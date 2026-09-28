import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const handler = require("../api/schoolbook-source.js");
const internals = handler._test;

const lessonCases = new Map([
  ["Κεφάλαιο 1 · Ι · 1 — Από τη Ρώμη στη Νέα Ρώμη", "index1_1_1.html"],
  ["Κεφάλαιο 1 · ΙΙ · 1 — Ο Ιουστινιανός και το έργο του", "index1_2_1.html"],
  ["Κεφάλαιο 1 · ΙΙ · 2 — Ο Ηράκλειος και η δυναστεία του", "index1_2_2.html"],
  ["Κεφάλαιο 2 · Ι · 1 — Οι Σλάβοι και οι σχέσεις τους με το Βυζάντιο", "index2_1_1.html"],
  ["Κεφάλαιο 2 · Ι · 2 — Οι Βούλγαροι και οι σχέσεις τους με το Βυζάντιο", "index2_1_2.html"],
  ["Κεφάλαιο 2 · ΙΙ · 1 — Η εξάπλωση των Αράβων", "index2_2_1.html"],
  ["Κεφάλαιο 2 · ΙΙ · 2 — Το εμπόριο και ο πολιτισμός του Ισλάμ", "index2_2_2.html"],
  ["Κεφάλαιο 3 · Ι · 1 — Η διαμόρφωση της μεσαιωνικής ελληνικής βυζαντινής αυτοκρατορίας", "index3_1_1.html"],
  ["Κεφάλαιο 3 · Ι · 2 — Η μεταβατική εποχή", "index3_1_2.html"],
  ["Κεφάλαιο 3 · Ι · 3 — Η βασιλεία του Μιχαήλ Γ΄", "index3_1_3.html"],
  ["Κεφάλαιο 3 · Ι · 4 — Η διάδοση του Χριστιανισμού", "index3_1_4.html"],
  ["Κεφάλαιο 3 · Ι · 5 — Η Βυζαντινή Εποποιία", "index3_1_5.html"],
  ["Κεφάλαιο 3 · Ι · 6 — Η ίδρυση του Ρωσικού Κράτους", "index3_1_6.html"],
  ["Κεφάλαιο 3 · Ι · 7 — Σχέσεις Βυζαντίου-Δύσης", "index3_1_7.html"],
  ["Κεφάλαιο 3 · ΙΙ · 1 — Οι εξελίξεις στην οικονομία και την κοινωνία", "index3_2_1.html"],
  ["Κεφάλαιο 3 · ΙΙ · 2 — Η νομοθεσία της Μακεδονικής Δυναστείας", "index3_2_2.html"],
  ["Κεφάλαιο 4 · Ι · 1 — Η κρίση και οι απώλειες της αυτοκρατορίας", "index4_1_1.html"],
  ["Κεφάλαιο 4 · Ι · 2 — Οι Κομνηνοί", "index4_1_2.html"],
  ["Κεφάλαιο 4 · Ι · 3 — Η ενετική οικονομική διείσδυση", "index4_1_3.html"],
  ["Κεφάλαιο 4 · ΙΙ · 1 — Οι σταυροφορίες", "index4_2_1.html"],
  ["Κεφάλαιο 4 · ΙΙ · 2 — Η περίοδος της Λατινοκρατίας", "index4_2_2.html"],
  ["Κεφάλαιο 4 · ΙΙΙ · 1 — Εξάπλωση των Τούρκων", "index4_3_1.html"],
  ["Κεφάλαιο 4 · ΙΙΙ · 2 — Η Άλωση της Πόλης", "index4_3_2.html"],
  ["Κεφάλαιο 5 · 1 — Η καθημερινή ζωή στο Βυζάντιο", "index5_1.html"],
  ["Κεφάλαιο 5 · 4 — Εικαστικές Τέχνες και Μουσική", "index5_4.html"],
  ["Κεφάλαιο 6 · Ι · 2 — Ο Καρλομάγνος και η εποχή του", "index6_1_2.html"],
  ["Κεφάλαιο 6 · Ι · 3 — Η φεουδαρχία στη Δυτική Ευρώπη", "index6_1_3.html"],
  ["Κεφάλαιο 7 · Ι · 1 — Οι ανακαλύψεις", "index7_1_1.html"],
  ["Κεφάλαιο 7 · Ι · 2 — Αναγέννηση και Ανθρωπισμός", "index7_1_2.html"],
  ["Κεφάλαιο 7 · Ι · 3 — Η Θρησκευτική Μεταρρύθμιση", "index7_1_3.html"],
  ["Κεφάλαιο 7 · Ι · 4 — Πολιτικές, οικονομικές και κοινωνικές εξελίξεις", "index7_1_4.html"],
  ["Κεφάλαιο 7 · ΙΙ — Ο Ελληνισμός υπό βενετική και οθωμανική κυριαρχία", "index7_2.html"]
]);

assert.equal(lessonCases.size, 32, "The verified 2026-27 guidance must expose exactly 32 lessons");
for (const [topic, expectedPath] of lessonCases) {
  assert.deepEqual(internals.resolveHistoryCurriculumPaths(topic), [expectedPath], topic);
  assert.equal(internals.resolveSectionPath("history", topic), expectedPath, topic);
}

assert.deepEqual(internals.resolveHistoryCurriculumPaths("Κεφάλαιο 6 · Ι — Η εξέλιξη της μεσαιωνικής Ευρώπης"), [
  "index6_1_2.html",
  "index6_1_3.html"
]);
assert.deepEqual(internals.resolveHistoryCurriculumPaths("Κεφάλαιο 4 · ΙΙΙ — Ανασύσταση του Βυζαντίου"), [
  "index4_3_1.html",
  "index4_3_2.html"
]);

for (const excluded of [
  "Κεφάλαιο 5 · 2 — Βυζαντινή Γραμματεία",
  "Κεφάλαιο 6 · Ι · 1 — Οι συνέπειες της μετανάστευσης των γερμανικών φύλων για την Ευρώπη",
  "Κεφάλαιο 6 · ΙΙ — Η διαμόρφωση της Δυτικής Ευρώπης κατά τα τέλη του Μεσαίωνα",
  "Κεφάλαιο 7 · Ι · 5 — Εξελίξεις στα Γράμματα, τις Επιστήμες και τις Τέχνες"
]) {
  assert.deepEqual(internals.resolveHistoryCurriculumPaths(excluded), [], `must fail closed: ${excluded}`);
}

const generalWindow = {};
vm.runInNewContext(fs.readFileSync(new URL("../general-education-book-sections-2026-2027.js", import.meta.url), "utf8"), { window: generalWindow });
const hierarchy = generalWindow.AITOOLSKIDS_GENERAL_ED_BOOK_SECTIONS_2026_2027.get("istoria-b-gymnasiou").sections;
assert.equal(hierarchy.length, 50, "Hierarchy must contain 7 chapters, included subsection parents and all 32 curriculum lessons (7 · II is both subsection and lesson)");
for (const topic of lessonCases.keys()) assert.ok(hierarchy.includes(topic) || hierarchy.some(row => row.startsWith(topic.split(" — ")[0] + " —")), topic);
assert.ok(!hierarchy.some(row => row.startsWith("Κεφάλαιο 6 · Ι · 1")));
assert.ok(!hierarchy.some(row => row.startsWith("Κεφάλαιο 6 · ΙΙ")));

const officialWindow = {};
vm.runInNewContext(fs.readFileSync(new URL("../official-curriculum-data.js", import.meta.url), "utf8"), { window: officialWindow });
const official = officialWindow.AITOOLSKIDS_OFFICIAL_CURRICULUM.getByQuizId("istoria-b-gymnasiou");
assert.equal(official.annualInstructionsStatus, "2026-27-verified");
assert.equal(official.coverageStatus, "annual-guidance-detailed-map");
assert.equal(official.officialSectionsEl.length, 32);
assert.equal(official.mappedTopicsEl.length, 32);

const response = {
  statusCode: 0,
  body: null,
  setHeader() {},
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; }
};
await handler({ method: "GET", query: { subject: "istoria-b-gymnasiou", topic: "Κεφάλαιο 6 · Ι · 1 — Εκτός ύλης" } }, response);
assert.equal(response.statusCode, 404);
assert.equal(response.body.error, "section_not_resolved");

console.log("History B 2026-27 grounding integrity: 32 lessons, 50 unique hierarchy nodes, fail-closed exclusions OK");
