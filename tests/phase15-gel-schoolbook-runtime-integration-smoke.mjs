import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const endpoint = require("../api/schoolbook-source.js");
const inventory = require("../gel-schoolbook-source-map-2026-2027.js");
const { resolveGelInventoryTopic } = endpoint._test;

let highHtml = 0;
let mediumHtml = 0;
let exactPdf = 0;
let blocked = 0;

for (const subject of Object.values(inventory.all())) {
  for (const topic of subject.topicMappings || []) {
    const resolved = resolveGelInventoryTopic(subject.subjectId, topic.label);
    assert.ok(resolved, subject.subjectId + " / " + topic.label + " must be recognized by the inventory resolver");

    if (topic.status === "exact-html" && topic.confidence === "high") {
      highHtml++;
      assert.equal(resolved.runtimeEligible, true, subject.subjectId + " / " + topic.label);
    } else {
      assert.equal(resolved.runtimeEligible, false, subject.subjectId + " / " + topic.label + " must stay fail-closed");
      if (topic.status === "exact-html" && topic.confidence === "medium") mediumHtml++;
      else if (topic.status === "exact-pdf") exactPdf++;
      else blocked++;
    }
  }
}

assert.equal(highHtml, 174);
assert.equal(mediumHtml, 14);
assert.equal(exactPdf, 11);
assert.ok(blocked > 400);

// High-confidence HTML representatives across grades and full/partial coverage.
const liveCases = [
  ["mathimatika-a-lykeiou", "2.2 Διάταξη πραγματικών αριθμών"],
  ["geometria-a-lykeiou", "3.2–3.4 Κριτήρια ισότητας τριγώνων"],
  ["chimeia-a-lykeiou", "2.1 Περιοδικός πίνακας"],
  ["biologia-b-lykeiou", "1.2 Κύτταρο: η μονάδα της ζωής"],
  ["pliroforiki-g-lykeiou", "2.1 Ανάλυση προβλήματος"],
  ["chimeia-g-lykeiou", "5.5 Ρυθμιστικά διαλύματα"]
];

const liveResults = [];
for (const [subject, topic] of liveCases) {
  const result = await endpoint.resolveOfficialSchoolbookSource(subject, topic);
  liveResults.push({ subject, topic, ok:result.ok, status:result.status, sourceUrl:result.body?.sourceUrl });
  assert.equal(result.ok, true, subject + " / " + topic + " => " + JSON.stringify(result.body));
  assert.equal(result.body?.grounded, true);
  assert.equal(result.body?.mappingStatus, "official-gel-inventory-exact-html");
  assert.equal(result.body?.mappingConfidence, "high");
  assert.match(String(result.body?.sourceUrl || ""), /^https:\/\/[^/]*ebooks\.edu\.gr\/ebooks\/v\/html\//i);
  assert.ok(String(result.body?.text || "").length >= 500);
}

// Medium-confidence HTML must not be activated automatically.
const medium = await endpoint.resolveOfficialSchoolbookSource(
  "fysiki-a-lykeiou",
  "1.3.6 Ισορροπία σώματος"
);
assert.equal(medium.ok, false);
assert.equal(medium.status, 404);
assert.equal(medium.body?.error, "section_not_resolved");
assert.equal(medium.body?.reviewStatus, "medium-confidence-not-activated");

// exact-pdf is recognized, linked and still text-fail-closed.
const pdf = await endpoint.resolveOfficialSchoolbookSource(
  "english-a-lykeiou",
  "Unit 2: A refugee’s dreamland"
);
assert.equal(pdf.ok, false);
assert.equal(pdf.status, 409);
assert.equal(pdf.body?.error, "official_pdf_text_not_grounded");
assert.match(String(pdf.body?.sourceUrl || ""), /\/ebooks\/v\/pdf\/.+#page=15$/);
assert.equal(pdf.body?.pdfPage, 15);

// Manual-review and no-safe-mapping rows must never fall through to generic schoolbook text.
const manual = await endpoint.resolveOfficialSchoolbookSource(
  "archaia-a-lykeiou",
  "Ξενοφών: Ελληνικά"
);
assert.equal(manual.ok, false);
assert.equal(manual.body?.error, "section_not_resolved");

const noSafeSubject = inventory.get("english-g-lykeiou");
assert.equal(noSafeSubject?.status, "no-safe-mapping");
const noSafeTopic = noSafeSubject?.topicMappings?.[0];
assert.ok(noSafeTopic);
const noSafe = await endpoint.resolveOfficialSchoolbookSource("english-g-lykeiou", noSafeTopic.label);
assert.equal(noSafe.ok, false);
assert.equal(noSafe.body?.error, "section_not_resolved");

console.log("PHASE15_GEL_RUNTIME_INTEGRATION=" + JSON.stringify({
  highHtml,
  mediumHtml,
  exactPdf,
  blocked,
  liveResults,
  pdfFailClosed: pdf.body?.sourceUrl,
  mediumFailClosed: medium.body?.reviewStatus
}, null, 2));
