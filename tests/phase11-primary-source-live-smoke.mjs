import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { resolveOfficialSchoolbookSource } = require("../api/schoolbook-source.js");

async function withTimeout(promise, ms, label) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(label + " timed out after " + ms + "ms")), ms);
      })
    ]);
  } finally { clearTimeout(timer); }
}

const samples = [
  { subject:"glossa-a-dimotikou", topic:"1η Ενότητα — Πού είναι ο Άρης;", grade:"a", signal:"άρης" },
  { subject:"glossa-b-dimotikou", topic:"1 — Στο δρόμο για το σχολείο", grade:"b", signal:"σχολείο" },
  { subject:"glossa-b-dimotikou", topic:"2 — Με το «σεις» και με «σας»", grade:"b", signal:"ευγεν" },
  { subject:"glossa-b-dimotikou", topic:"3 — Στον κόσμο των κόμικς", grade:"b", signal:"κόμικ" },
  { subject:"glossa-d-dimotikou", topic:"1η Ενότητα — Ένα ακόμα σκαλί", grade:"d", signal:"σκαλί" }
];

for (const sample of samples) {
  const result = await withTimeout(resolveOfficialSchoolbookSource(sample.subject, sample.topic), 30000, sample.subject + " / " + sample.topic);
  assert.equal(result.ok, true, JSON.stringify({sample, body:result.body}));
  assert.equal(result.body.subject, sample.subject);
  assert.equal(result.body.grade, sample.grade);
  assert.equal(result.body.topic, sample.topic);
  assert.equal(result.body.section, sample.topic);
  assert.equal(result.body.mappingStatus, "official-book-section-grounded");
  assert.equal(result.body.annualScopeVerified, false);
  assert.ok(result.body.text.length >= 120, sample.subject + " source excerpt is too short");
  assert.match(result.body.sourceUrl, /^https:\/\/[^/]*ebooks\.edu\.gr\//i);
  assert.match(result.body.schoolbookSource, /^https:\/\/[^/]*ebooks\.edu\.gr\//i);
  assert.ok(result.body.text.toLocaleLowerCase("el").includes(sample.signal), sample.subject + " wrong excerpt signal");
}

for (const unsupported of [
  ["glossa-a-dimotikou","2η Ενότητα — Η παρέα"],
  ["glossa-b-dimotikou","24 — Να σου πω τι έμαθα;"],
  ["science-st-dimotikou","Ενέργεια"],
  ["glossa-a-dimotikou","Ανύπαρκτη ενότητα"]
]) {
  const result = await withTimeout(resolveOfficialSchoolbookSource(unsupported[0], unsupported[1]), 30000, unsupported.join(" / "));
  assert.equal(result.ok, false, unsupported.join(" / ") + " must fail closed until an exact source mapping exists");
  assert.notEqual(result.body?.grounded, true);
}

console.log("Phase 11A live explicit-source grounding smoke passed.");
