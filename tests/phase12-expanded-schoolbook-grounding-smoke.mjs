import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { resolveOfficialSchoolbookSource } = require("../api/schoolbook-source.js");

const samples = [
  ["math-a-dimotikou","1η Ενότητα — Οι αριθμοί μέχρι το 5 - Χώρος και σχήματα","προσανατολισ"],
  ["math-b-dimotikou","1η Ενότητα — Κεφάλαια 1-8","σταυροδρόμι"],
  ["math-c-dimotikou","4η Ενότητα — Εισαγωγή στα απλά κλάσματα","κλάσμα"],
  ["math-e-dimotikou","Ενότητα 1 — Μεγάλοι αριθμοί και επίλυση προβλημάτων","αριθμ"],
  ["math-st-dimotikou","Ενότητα 1 — Αριθμοί και Πράξεις","φυσικ"],
  ["science-e-dimotikou","Ενέργεια","ενέργεια"],
  ["glossa-st-dimotikou","Ενότητα 1 — Ταξίδια, τόποι, μεταφορικά μέσα","ταξιδ"],
  ["istoria-e-dimotikou","Α΄ — Οι Έλληνες και οι Ρωμαίοι","ρωμα"],
  ["biologia-a-lykeiou","Κεφάλαιο 1 — Από το κύτταρο στον οργανισμό","κύτταρ"],
  ["english-a-gymnasiou","Unit 1 — Welcome","welcome"],
  ["english-d-dimotikou","Unit 1 — Back to school","school"],
  ["english-e-dimotikou","Unit 1 — Internet friends around Europe","internet"],
  ["istoria-c-dimotikou","Ενότητα 1 — Η δημιουργία του κόσμου","κόσμ"]
];

for (const [subject, topic, signal] of samples) {
  const result = await resolveOfficialSchoolbookSource(subject, topic);
  assert.equal(result.ok, true, JSON.stringify({ subject, topic, status: result.status, body: result.body }));
  assert.equal(result.body.subject, subject);
  assert.equal(result.body.topic, topic);
  assert.equal(result.body.mappingStatus, "official-book-section-grounded");
  assert.equal(result.body.lastVerified, "2026-09-30");
  assert.ok(result.body.text.length >= 500, subject + " / " + topic + " excerpt too short");
  assert.match(result.body.sourceUrl, /^https:\/\/[^/]*ebooks\.edu\.gr\//i);
  assert.ok(result.body.text.toLocaleLowerCase("el").includes(signal), subject + " / " + topic + " wrong excerpt signal");
}

for (const [subject, topic] of [
  ["math-a-dimotikou","99η Ενότητα — Ανύπαρκτη"],
  ["math-st-dimotikou","Ενότητα 99 — Ανύπαρκτη"],
  ["glossa-st-dimotikou","Ενότητα 99 — Ανύπαρκτη"],
  ["biologia-a-lykeiou","Κεφάλαιο 99 — Ανύπαρκτο"]
]) {
  const result = await resolveOfficialSchoolbookSource(subject, topic);
  assert.equal(result.ok, false, subject + " / " + topic + " must fail closed");
  assert.notEqual(result.body?.grounded, true);
}

const stillMissing = await resolveOfficialSchoolbookSource("math-d-dimotikou","Α΄ Περίοδος · Α΄ Ενότητα");
assert.equal(stillMissing.ok, false, "Synthetic Math D grouping must remain fail-closed until exact official section identity is mapped.");

console.log("Phase 12 expanded exact schoolbook grounding passed.");
