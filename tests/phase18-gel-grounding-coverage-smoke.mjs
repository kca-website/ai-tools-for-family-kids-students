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
// 34 phase-14 PDF sections + 62 phase-26 Θρησκευτικά units. Chapter 11 of
// Economics has not been approved within the 2026–27 examined curriculum.
assert.equal(exactPdf, 96);
// The Phase 25 paragraph retains its official HTML override; the unverified
// Economics Chapter 11 remains blocked instead of being promoted on import.
assert.equal(reviewedManual, 314);
assert.equal(overrides.count, 327);
assert.equal(remainingCandidateBacked, 3);
// Phase 26 replaced 26 generic, sourceless Θρησκευτικά Α΄/Β΄/Γ΄ labels with 62 grounded book units.
assert.equal(remainingWithoutCandidate, 17);
assert.equal(noSafe, 5);

const grounded = highHtml + mediumManual + exactPdf + reviewedManual;
const blocked = remainingCandidateBacked + remainingWithoutCandidate + noSafe;
assert.equal(grounded, 647);
assert.equal(blocked, 25);
assert.equal(grounded + blocked, 672);


// Phase 25: preserve the verified HTML paragraph override.
const phase25Paragraph = endpoint._test.resolveGelInventoryTopic(
  "ekthesi-a-lykeiou", "Τρόποι ανάπτυξης παραγράφου"
);
assert.equal(phase25Paragraph?.runtimeMode, "manual-html");

// No import-time upgrade: the Chapter 11 topic remains explicitly fail-closed
// even though the original schoolbook PDF contains that chapter.
const excludedEconomics = endpoint._test.resolveGelInventoryTopic(
  "oikonomia-g-lykeiou", "Διεθνές εμπόριο και οικονομικές σχέσεις"
);
assert.equal(excludedEconomics?.mapping?.status, "needs-manual-review");
assert.equal(excludedEconomics?.runtimeMode, null);
assert.equal(excludedEconomics?.runtimeEligible, false);

// Guard examples: candidates that are deliberately still ambiguous/insufficient.
for (const [subjectId, label] of [
  ["archaia-b-lykeiou", "Αδίδακτο πεζό κείμενο αττικής διαλέκτου"],
  ["ekthesi-b-lykeiou", "Τρόποι πειθούς"],
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
