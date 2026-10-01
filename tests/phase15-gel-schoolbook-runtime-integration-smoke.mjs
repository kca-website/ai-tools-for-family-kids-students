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
// Pull labels from the verified inventory itself so the test exercises the exact site label,
// not a separately retyped book heading.
const representativeSubjects = [
  "mathimatika-a-lykeiou",
  "geometria-a-lykeiou",
  "chimeia-a-lykeiou",
  "biologia-b-lykeiou",
  "pliroforiki-g-lykeiou",
  "chimeia-g-lykeiou"
];
const liveCases = representativeSubjects.map((subjectId) => {
  const subject = inventory.get(subjectId);
  const topic = (subject?.topicMappings || []).find((entry) =>
    entry.status === "exact-html" && entry.confidence === "high"
  );
  assert.ok(topic, subjectId + " must expose at least one high-confidence exact-html topic");
  return [subjectId, topic.label];
});

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
let mediumCase = null;
for (const subject of Object.values(inventory.all())) {
  const topic = (subject.topicMappings || []).find((entry) =>
    entry.status === "exact-html" && entry.confidence === "medium"
  );
  if (topic) {
    mediumCase = [subject.subjectId, topic];
    break;
  }
}
assert.ok(mediumCase, "inventory must contain a medium-confidence exact-html case");
const medium = await endpoint.resolveOfficialSchoolbookSource(mediumCase[0], mediumCase[1].label);
assert.equal(medium.ok, false);
assert.equal(medium.status, 404);
assert.equal(medium.body?.error, "section_not_resolved");
assert.equal(medium.body?.reviewStatus, "medium-confidence-not-activated");

// exact-pdf is recognized, linked and still text-fail-closed.
let pdfCase = null;
for (const subject of Object.values(inventory.all())) {
  const topic = (subject.topicMappings || []).find((entry) => entry.status === "exact-pdf");
  if (topic) {
    pdfCase = [subject.subjectId, topic];
    break;
  }
}
assert.ok(pdfCase, "inventory must contain an exact-pdf case");
const pdf = await endpoint.resolveOfficialSchoolbookSource(pdfCase[0], pdfCase[1].label);
assert.equal(pdf.ok, false);
assert.equal(pdf.status, 409);
assert.equal(pdf.body?.error, "official_pdf_text_not_grounded");
assert.match(String(pdf.body?.sourceUrl || ""), /\/ebooks\/v\/pdf\/.+#page=\d+$/);
assert.equal(pdf.body?.pdfPage, pdfCase[1].pdfPage);

// Manual-review rows must never fall through to generic schoolbook text.
let manualCase = null;
for (const subject of Object.values(inventory.all())) {
  const topic = (subject.topicMappings || []).find((entry) => entry.status === "needs-manual-review");
  if (topic) {
    manualCase = [subject.subjectId, topic];
    break;
  }
}
assert.ok(manualCase, "inventory must contain a needs-manual-review case");
const manual = await endpoint.resolveOfficialSchoolbookSource(manualCase[0], manualCase[1].label);
assert.equal(manual.ok, false);
assert.equal(manual.body?.error, "section_not_resolved");

// no-safe-mapping rows must also remain fail-closed.
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
