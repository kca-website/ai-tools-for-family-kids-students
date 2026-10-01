import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const inventory = require("../gel-schoolbook-source-map-2026-2027.js");
const overrides = require("../gel-schoolbook-manual-overrides-2026-2027.js");
const endpoint = require("../api/schoolbook-source.js");

const overridden = new Set(overrides.entries.map((entry) => entry.subjectId + "\n" + entry.label));

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

assert.equal(highHtml, 174);
assert.equal(mediumManual, 14);
assert.equal(exactPdf, 11);
assert.equal(reviewedManual, 152);
assert.equal(overrides.count, 166);
assert.equal(remainingCandidateBacked, 6);
assert.equal(remainingWithoutCandidate, 285);
assert.equal(noSafe, 5);

const grounded = highHtml + mediumManual + exactPdf + reviewedManual;
const blocked = remainingCandidateBacked + remainingWithoutCandidate + noSafe;
assert.equal(grounded, 351);
assert.equal(blocked, 296);
assert.equal(grounded + blocked, 647);

// Guard examples: candidates that are deliberately still ambiguous/insufficient.
for (const [subjectId, label] of [
  ["archaia-b-lykeiou", "Αδίδακτο πεζό κείμενο αττικής διαλέκτου"],
  ["latinika-b-lykeiou", "Κείμενα και λεξιλόγιο των διδακτικών ενοτήτων"],
  ["ekthesi-b-lykeiou", "Ισορροπία δοκιμίου"],
  ["ekthesi-b-lykeiou", "Κειμενικά είδη"],
  ["latinika-g-lykeiou", "Λεξιλόγιο και ετυμολογικές σχέσεις"],
  ["mathimatika-g-prosanatolismou", "Παράγωγος σύνθετης και αντίστροφης συνάρτησης"]
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
