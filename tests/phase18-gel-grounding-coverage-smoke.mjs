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
// 34 phase-14 PDF sections + 1 phase-25 Οικονομία override + 21 phase-26 Θρησκευτικά Α΄ units.
assert.equal(exactPdf, 56);
// The phase-25 Οικονομία topic moved from a reviewed manual override to an exact PDF section.
assert.equal(reviewedManual, 293);
assert.equal(overrides.count, 306);
assert.equal(remainingCandidateBacked, 4);
// Phase 26 replaced 8 generic, sourceless Θρησκευτικά Α΄ labels with 21 grounded book units.
assert.equal(remainingWithoutCandidate, 54);
assert.equal(noSafe, 5);

const grounded = highHtml + mediumManual + exactPdf + reviewedManual;
const blocked = remainingCandidateBacked + remainingWithoutCandidate + noSafe;
assert.equal(grounded, 586);
assert.equal(blocked, 63);
assert.equal(grounded + blocked, 649);


// Phase 25: the paragraph topic is a manual HTML override; the Οικονομία chapter-11 topic was
// promoted to an exact PDF section (the HTML manifestation stops at chapter 10).
for (const [subjectId, label, mode] of [
  ["ekthesi-a-lykeiou", "Τρόποι ανάπτυξης παραγράφου", "manual-html"],
  ["oikonomia-g-lykeiou", "Διεθνές εμπόριο και οικονομικές σχέσεις", "exact-pdf"]
]) {
  const resolved = endpoint._test.resolveGelInventoryTopic(subjectId, label);
  assert.equal(resolved?.runtimeMode, mode, subjectId + " / " + label + " must be grounded by Phase 25");
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
