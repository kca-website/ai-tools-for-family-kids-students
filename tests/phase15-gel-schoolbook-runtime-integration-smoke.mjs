import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const endpoint = require("../api/schoolbook-source.js");
const inventory = require("../gel-schoolbook-source-map-2026-2027.js");
const manualOverrides = require("../gel-schoolbook-manual-overrides-2026-2027.js");
const { resolveGelInventoryTopic, selectGelAnchoredSectionText } = endpoint._test;

function normalizeForSmoke(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9α-ω]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

let highHtml = 0;
let mediumHtml = 0;
let exactPdf = 0;
let manualHtml = 0;
let blocked = 0;

for (const subject of Object.values(inventory.all())) {
  for (const topic of subject.topicMappings || []) {
    const resolved = resolveGelInventoryTopic(subject.subjectId, topic.label);
    assert.ok(resolved, subject.subjectId + " / " + topic.label + " must be recognized by the inventory resolver");

    if (topic.status === "exact-html" && topic.confidence === "high") {
      highHtml++;
      assert.equal(resolved.runtimeEligible, true, subject.subjectId + " / " + topic.label);
      assert.equal(resolved.runtimeMode, "exact-html");
    } else if (topic.status === "exact-pdf") {
      exactPdf++;
      assert.equal(resolved.runtimeEligible, true, subject.subjectId + " / " + topic.label);
      assert.equal(resolved.runtimeMode, "exact-pdf");
    } else if (resolved.runtimeMode === "manual-html") {
      manualHtml++;
      assert.equal(resolved.runtimeEligible, true);
      assert.ok(resolved.manualOverride);
      if (topic.status === "exact-html" && topic.confidence === "medium") mediumHtml++;
    } else {
      assert.equal(resolved.runtimeEligible, false, subject.subjectId + " / " + topic.label + " must stay fail-closed");
      if (topic.status === "exact-html" && topic.confidence === "medium") mediumHtml++;
      else blocked++;
    }
  }
}

assert.equal(highHtml, 174);
assert.equal(mediumHtml, 14);
assert.equal(exactPdf, 11);
assert.equal(manualHtml, manualOverrides.count);
assert.equal(manualHtml, 60);

assert.ok(blocked > 390);

// Anchor scoping unit contract: keep nested headings in the current section,
// but stop before the next peer section.
const syntheticHtml = [
  '<a id="s21"></a>',
  '<h2>2.1 ΠΡΩΤΗ ΕΝΟΤΗΤΑ</h2>',
  '<p>' + 'Ακριβές περιεχόμενο ενότητας. '.repeat(40) + '</p>',
  '<a id="s211"></a>',
  '<h3>2.1.1 Υποενότητα</h3>',
  '<p>' + 'Περιεχόμενο υποενότητας. '.repeat(25) + '</p>',
  '<a id="s22"></a>',
  '<h2>2.2 ΔΕΥΤΕΡΗ ΕΝΟΤΗΤΑ</h2>',
  '<p>' + 'Δεν πρέπει να συμπεριληφθεί. '.repeat(30) + '</p>'
].join('');
const syntheticScoped = selectGelAnchoredSectionText(
  syntheticHtml,
  'https://ebooks.edu.gr/ebooks/v/html/example/index.html#s21',
  { heading:'2.1 ΠΡΩΤΗ ΕΝΟΤΗΤΑ', granularity:'section-anchor' }
);
assert.match(syntheticScoped, /2\.1 ΠΡΩΤΗ ΕΝΟΤΗΤΑ/);
assert.match(syntheticScoped, /2\.1\.1 Υποενότητα/);
assert.doesNotMatch(syntheticScoped, /2\.2 ΔΕΥΤΕΡΗ ΕΝΟΤΗΤΑ/);

// Introductory GEL headings can be written as "Ε.2" in the official HTML while
// the verified inventory canonically stores "Ε2". This punctuation difference
// must not make an otherwise exact anchored section fail closed.
const syntheticIntroHtml = [
  '<a id="eis2"></a>',
  '<h2>Ε.2 ΣΥΝΟΛΑ</h2>',
  '<p>' + 'Ακριβές περιεχόμενο για τα σύνολα. '.repeat(45) + '</p>'
].join('');
const syntheticIntroScoped = selectGelAnchoredSectionText(
  syntheticIntroHtml,
  'https://ebooks.edu.gr/ebooks/v/html/example/index.html#eis2',
  { heading:'Ε2 ΣΥΝΟΛΑ', granularity:'section-anchor' }
);
assert.match(syntheticIntroScoped, /Ε\.2 ΣΥΝΟΛΑ/);

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

// All 14 medium-confidence HTML rows remain medium in the generated inventory,
// but Phase 17 manual verification activates them through the separate override layer.
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
const mediumResolved = resolveGelInventoryTopic(mediumCase[0], mediumCase[1].label);
assert.equal(mediumResolved?.runtimeMode, "manual-html");
assert.ok(mediumResolved?.manualOverride);
const medium = await endpoint.resolveOfficialSchoolbookSource(mediumCase[0], mediumCase[1].label);
assert.equal(medium.ok, true, JSON.stringify(medium.body));
assert.equal(medium.body?.mappingStatus, "official-gel-manual-verified-html");
assert.equal(medium.body?.mappingConfidence, "manual-verified");

// exact-pdf mappings are recognized as a separate, verified runtime mode.
// Live PDF text extraction itself is covered by the Phase 16 smoke.
let pdfCase = null;
for (const subject of Object.values(inventory.all())) {
  const topic = (subject.topicMappings || []).find((entry) => entry.status === "exact-pdf");
  if (topic) {
    pdfCase = [subject.subjectId, topic];
    break;
  }
}
assert.ok(pdfCase, "inventory must contain an exact-pdf case");
const pdfResolved = resolveGelInventoryTopic(pdfCase[0], pdfCase[1].label);
assert.equal(pdfResolved?.runtimeEligible, true);
assert.equal(pdfResolved?.runtimeMode, "exact-pdf");
assert.equal(pdfResolved?.mapping?.pdfPage, pdfCase[1].pdfPage);

// Unreviewed manual rows must still fail closed. Reviewed rows are activated only
// when they exist in the explicit Phase 17 override file.
let manualCase = null;
for (const subject of Object.values(inventory.all())) {
  const topic = (subject.topicMappings || []).find((entry) =>
    entry.status === "needs-manual-review" &&
    resolveGelInventoryTopic(subject.subjectId, entry.label)?.runtimeEligible === false
  );
  if (topic) {
    manualCase = [subject.subjectId, topic];
    break;
  }
}
assert.ok(manualCase, "inventory must contain an unreviewed needs-manual-review case");
const manual = await endpoint.resolveOfficialSchoolbookSource(manualCase[0], manualCase[1].label);
assert.equal(manual.ok, false);
assert.equal(manual.body?.error, "section_not_resolved");

const reviewedManual = manualOverrides.entries.find((entry) => entry.sourceStatus === "needs-manual-review");
assert.ok(reviewedManual);
const reviewedResult = await endpoint.resolveOfficialSchoolbookSource(reviewedManual.subjectId, reviewedManual.label);
assert.equal(reviewedResult.ok, true, JSON.stringify(reviewedResult.body));
assert.equal(reviewedResult.body?.mappingStatus, "official-gel-manual-verified-html");

// no-safe-mapping rows must also remain fail-closed.
const noSafeSubject = inventory.get("english-g-lykeiou");
assert.equal(noSafeSubject?.status, "no-safe-mapping");
const noSafeTopic = noSafeSubject?.topicMappings?.[0];
assert.ok(noSafeTopic);
const noSafe = await endpoint.resolveOfficialSchoolbookSource("english-g-lykeiou", noSafeTopic.label);
assert.equal(noSafe.ok, false);
assert.equal(noSafe.body?.error, "section_not_resolved");

// A live section-anchor mapping must return the selected section near the start
// and must not leak the next peer section into the grounding payload.
const anchored = await endpoint.resolveOfficialSchoolbookSource(
  "mathimatika-a-lykeiou",
  "2.2 Διάταξη πραγματικών αριθμών"
);
assert.equal(anchored.ok, true, JSON.stringify(anchored.body));
assert.equal(anchored.body?.mappingConfidence, "high");
assert.match(String(anchored.body?.sourceUrl || ""), /#pragmat2$/);
const anchoredText = String(anchored.body?.text || "");
assert.ok(
  normalizeForSmoke(anchoredText.slice(0, 2500)).includes(normalizeForSmoke("2.2 ΔΙΑΤΑΞΗ ΠΡΑΓΜΑΤΙΚΩΝ ΑΡΙΘΜΩΝ")),
  "verified heading must appear near the beginning of scoped grounding text"
);
assert.ok(
  !normalizeForSmoke(anchoredText).includes(normalizeForSmoke("2.3 ΑΠΟΛΥΤΗ ΤΙΜΗ ΠΡΑΓΜΑΤΙΚΟΥ ΑΡΙΘΜΟΥ")),
  "next peer section must not leak into scoped grounding text"
);

console.log("PHASE15_GEL_RUNTIME_INTEGRATION=" + JSON.stringify({
  highHtml,
  mediumHtml,
  exactPdf,
  manualHtml,
  blocked,
  liveResults,
  pdfRuntimeMode: pdfResolved?.runtimeMode,
  mediumManualVerified: medium.body?.mappingStatus
}, null, 2));
