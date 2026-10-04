import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const inventory = require("../gel-schoolbook-source-map-2026-2027.js");
const overrides = require("../gel-schoolbook-manual-overrides-2026-2027.js");
const phase25 = require("../gel-schoolbook-manual-overrides-phase25-2026-2027.js");
const endpoint = require("../api/schoolbook-source.js");

const overridden = new Set([...overrides.entries, ...phase25.entries].map((entry) => entry.subjectId + "\n" + entry.label));

let highHtml = 0;
let mediumManual = 0;
let exactPdf = 0;
let reviewedManual = 0;
let remainingCandidateBacked = 0;
let remainingWithoutCandidate = 0;
let noSafe = 0;

const remainingCandidates = [];

for (const subject of Object.values(inventory.all())) {
  for (const topic of subject.topicMappings || []) {
    const key = subject.subjectId + "\n" + topic.label;
    const resolved = endpoint._test.resolveGelInventoryTopic(subject.subjectId, topic.label);

    if (topic.status === "exact-html" && topic.confidence === "high") {
      highHtml++;
      assert.equal(resolved?.runtimeMode, "exact-html");
      continue;
    }
    if (topic.status === "exact-pdf") {
      exactPdf++;
      assert.equal(resolved?.runtimeMode, "exact-pdf");
      continue;
    }
    if (overridden.has(key)) {
      assert.equal(resolved?.runtimeMode, "manual-html");
      if (topic.status === "exact-html" && topic.confidence === "medium") mediumManual++;
      else if (topic.status === "needs-manual-review") reviewedManual++;
      else assert.fail("unexpected overridden source status: " + key + " / " + topic.status);
      continue;
    }

    assert.equal(resolved?.runtimeEligible, false, "unreviewed topic must stay fail-closed: " + key);

    if (topic.status === "needs-manual-review") {
      if (Array.isArray(topic.candidates) && topic.candidates.length) {
        remainingCandidateBacked++;
        remainingCandidates.push({
          subjectId: subject.subjectId,
          label: topic.label,
          reason: topic.reason || null,
          candidates: topic.candidates.length
        });
      } else {
        remainingWithoutCandidate++;
      }
    } else if (topic.status === "no-safe-mapping") {
      noSafe++;
    }
  }
}

assert.equal(highHtml, 223);
assert.equal(mediumManual, 14);
assert.equal(exactPdf, 34);
assert.equal(reviewedManual, 294);
assert.equal(overrides.count, 306);
assert.equal(remainingCandidateBacked, 4);
assert.equal(remainingWithoutCandidate, 62);
assert.equal(noSafe, 5);

const grounded = highHtml + mediumManual + exactPdf + reviewedManual;
const blocked = remainingCandidateBacked + remainingWithoutCandidate + noSafe;
assert.equal(grounded, 565);
assert.equal(blocked, 71);
assert.equal(grounded + blocked, 636);


for (const [subjectId, label] of [
  ["ekthesi-a-lykeiou", "Τρόποι ανάπτυξης παραγράφου"],
  ["oikonomia-g-lykeiou", "Διεθνές εμπόριο και οικονομικές σχέσεις"]
]) {
  const resolved = endpoint._test.resolveGelInventoryTopic(subjectId, label);
  assert.equal(resolved?.runtimeMode, "manual-html", subjectId + " / " + label + " must be grounded by Phase 25");
}

// Guard examples: candidates that are deliberately still ambiguous/insufficient.
for (const [subjectId, label] of [
  ["archaia-b-lykeiou", "Αδίδακτο πεζό κείμενο αττικής διαλέκτου"],
  ["ekthesi-b-lykeiou", "Τεκμηρίωση επιχειρήματος"],
  ["ekthesi-b-lykeiou", "Κειμενικά είδη"],
  ["archaia-g-lykeiou", "Αδίδακτο: συντακτικό"],
  ["english-g-lykeiou", "Αντεστραμμένη σύνταξη"]
]) {
  const resolved = endpoint._test.resolveGelInventoryTopic(subjectId, label);
  assert.equal(resolved?.runtimeEligible, false, subjectId + " / " + label + " must remain blocked");
}

console.log("PHASE18_GEL_GROUNDING_COVERAGE=" + JSON.stringify({
  grounded,
  blocked,
  highHtml,
  mediumManual,
  exactPdf,
  reviewedManual,
  remainingCandidateBacked,
  remainingWithoutCandidate,
  noSafe,
  remainingCandidates
}, null, 2));
