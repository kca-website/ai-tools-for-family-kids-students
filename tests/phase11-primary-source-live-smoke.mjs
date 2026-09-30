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
  } finally {
    clearTimeout(timer);
  }
}

const samples = [
  {
    subject: "glossa-a-dimotikou",
    topic: "1η Ενότητα — Πού είναι ο Άρης;",
    grade: "a",
    contains: "άρης"
  },
  {
    subject: "glossa-b-dimotikou",
    topic: "1 — Στο δρόμο για το σχολείο",
    grade: "b",
    contains: "σχολείο"
  },
  {
    subject: "science-st-dimotikou",
    topic: "Ενέργεια",
    grade: "st",
    contains: "ενέργεια"
  }
];

for (const sample of samples) {
  const result = await withTimeout(
    resolveOfficialSchoolbookSource(sample.subject, sample.topic),
    30000,
    sample.subject
  );
  assert.equal(result.ok, true, sample.subject + " must resolve to a grounded official excerpt");
  assert.equal(result.body.subject, sample.subject);
  assert.equal(result.body.grade, sample.grade);
  assert.equal(result.body.topic, sample.topic);
  assert.equal(result.body.section, sample.topic);
  assert.equal(result.body.mappingStatus, "official-book-section-grounded");
  assert.equal(result.body.annualScopeVerified, false);
  assert.ok(result.body.text.length >= 120, sample.subject + " source excerpt is too short");
  assert.match(result.body.sourceUrl, /^https:\/\/[^/]*ebooks\.edu\.gr\//i);
  assert.match(result.body.schoolbookSource, /^https:\/\/[^/]*ebooks\.edu\.gr\//i);
  assert.match(result.body.annualGuidanceSource, /^https:\/\/www\.iep\.edu\.gr\//i);
  assert.ok(
    result.body.text.toLocaleLowerCase("el").includes(sample.contains),
    sample.subject + " returned text does not contain the expected section signal"
  );
}

const unsupported = await withTimeout(
  resolveOfficialSchoolbookSource("glossa-a-dimotikou", "Ανύπαρκτη ενότητα"),
  30000,
  "unsupported Primary section"
);
assert.equal(unsupported.ok, false, "Unknown Primary section must fail closed");
assert.notEqual(unsupported.body?.grounded, true);

console.log("Phase 11A live official-source grounding smoke passed.");
