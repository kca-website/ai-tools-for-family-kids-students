import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { resolveOfficialSchoolbookSource } = require("../api/schoolbook-source.js");

const samples = [
  ["pliroforiki-a-lykeiou","Κεφάλαιο 11 — Εισαγωγή στην HTML","html"],
  ["pliroforiki-b-lykeiou","2.2 Αλγόριθμοι","αλγόριθ"],
  ["pliroforiki-b-lykeiou","3.4 Τεχνητή Νοημοσύνη","τεχνητή νοημοσύνη"]
];

for (const [subject, topic, signal] of samples) {
  const result = await resolveOfficialSchoolbookSource(subject, topic);
  assert.equal(result.ok, true, JSON.stringify({subject,topic,body:result.body}));
  assert.equal(result.body.subject, subject);
  assert.equal(result.body.topic, topic);
  assert.ok(result.body.text.length >= 150, subject + " exact excerpt too short");
  assert.match(result.body.sourceUrl, /^https:\/\/[^/]*ebooks\.edu\.gr\//i);
  assert.ok(result.body.text.toLocaleLowerCase("el").includes(signal), subject + " wrong source excerpt");
}

const missing = await resolveOfficialSchoolbookSource("pliroforiki-b-lykeiou","9.9 Ανύπαρκτη ενότητα");
assert.equal(missing.ok, false);
assert.notEqual(missing.body?.grounded, true);

console.log("Phase 11C GEL Informatics exact-schoolbook grounding passed.");
