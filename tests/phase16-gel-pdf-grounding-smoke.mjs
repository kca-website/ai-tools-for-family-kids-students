import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const endpoint = require("../api/schoolbook-source.js");
const inventory = require("../gel-schoolbook-source-map-2026-2027.js");
const pdfTools = require("../api/official-pdf-text.js");
const englishPdfUnits = require("../gel-english-official-pdf-units-2026-2027.js");

const cases = ["english-a-lykeiou", "english-b-lykeiou"].map((subjectId) => {
  const subject = inventory.get(subjectId);
  const mapping = (subject?.topicMappings || []).find((entry) => entry.status === "exact-pdf");
  assert.ok(mapping, subjectId + " must expose an exact-pdf mapping");
  return [subjectId, mapping];
});

const live = [];
for (const [subjectId, mapping] of cases) {
  const resolved = endpoint._test.resolveGelInventoryTopic(subjectId, mapping.label);
  assert.equal(resolved?.runtimeEligible, true, subjectId + " must be PDF-runtime eligible");
  assert.equal(resolved?.runtimeMode, "exact-pdf");
  assert.equal(endpoint._test.catalogPdfSourceAllowed(mapping.url), true);

  const result = await endpoint.resolveOfficialSchoolbookSource(subjectId, mapping.label);
  live.push({
    subjectId,
    topic: mapping.label,
    ok: result.ok,
    status: result.status,
    pdfPage: result.body?.pdfPage,
    chars: String(result.body?.text || "").length,
    resolvedPdfUrl: result.body?.resolvedPdfUrl || null
  });

  assert.equal(result.ok, true, subjectId + " / " + mapping.label + " => " + JSON.stringify(result.body));
  assert.equal(result.status, 200);
  assert.equal(result.body?.grounded, true);
  // English A/B: the verified multi-page unit manifest has precedence over a PDF-page fallback.
  const manifest = englishPdfUnits.pdfFor(subjectId, mapping.label);
  assert.ok(manifest?.annualScopeVerified, "Annual scope must be verified for this grade");
  assert.equal(result.body?.mappingStatus, "official-pdf-section");
  assert.equal(result.body?.pdfPage, manifest.pdfPage);
  assert.equal(result.body?.pdfPageEnd, manifest.pdfPageEnd);
  assert.ok(result.body.pdfPageEnd > result.body.pdfPage);
  assert.equal(result.body?.verifiedHeading, manifest.heading);
  assert.equal(result.body?.labelParaphrase, false);
  assert.match(String(result.body?.sourceUrl || ""), /^https:\/\/ebooks\.edu\.gr\/ebooks\/v\/pdf\//);
  assert.match(String(result.body?.canonicalSourceUrl || ""), new RegExp("#page=" + manifest.pdfPage + "$"));
  assert.ok(String(result.body?.text || "").length >= pdfTools.MIN_GROUNDED_PAGE_CHARS);

  const extracted = pdfTools.normalizePdfText(result.body?.text || "");
  const heading = pdfTools.normalizePdfText(manifest.heading || "");
  assert.ok(heading && extracted.includes(heading), "verified heading must be present in extracted PDF page text");
}

console.log("PHASE16_GEL_PDF_GROUNDING=" + JSON.stringify({ live }, null, 2));
