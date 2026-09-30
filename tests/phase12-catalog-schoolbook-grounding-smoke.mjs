import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const catalog = require("../general-education-book-sections-2026-2027.js");
const endpoint = require("../api/schoolbook-source.js");
const { buildCatalogBook, catalogHtmlSourceAllowed } = endpoint._test;

assert.ok(catalog?.ids?.length > 0, "General education catalog must be available in Node.");
assert.equal(catalog.version, "2.10.0");

const eligible = catalog.ids
  .map((id) => ({ id, row: catalog.get(id) }))
  .filter(({ row }) => catalogHtmlSourceAllowed(row?.sourceUrl));

assert.ok(eligible.length >= 10, "Expected a meaningful set of official HTML schoolbooks.");

for (const { id } of eligible) {
  const book = buildCatalogBook(id);
  assert.ok(book, id + " should build a catalog-backed schoolbook mapping");
  assert.equal(book.mode, "linkedSection");
  assert.equal(book.officialSourceRequired, true);
  assert.match(book.base, /^https:\/\/[^/]*ebooks\.edu\.gr\/ebooks\/v\/html\//i);
}

for (const id of ["math-a-dimotikou","math-b-dimotikou","math-c-dimotikou","math-d-dimotikou","math-e-dimotikou"]) {
  const row = catalog.get(id);
  if (!row) continue;
  assert.equal(buildCatalogBook(id), null, id + " legacy identity page must remain fail-closed");
}

const live = await endpoint.resolveOfficialSchoolbookSource("english-a-gymnasiou", "Unit 1 — Welcome");
assert.equal(live.ok, true, JSON.stringify(live.body));
assert.equal(live.body.grounded, true);
assert.equal(live.body.subject, "english-a-gymnasiou");
assert.match(live.body.sourceUrl, /^https:\/\/[^/]*ebooks\.edu\.gr\//i);
assert.ok((live.body.text || "").length >= 150);

const impossible = await endpoint.resolveOfficialSchoolbookSource("english-a-gymnasiou", "Unit 99 — Not a real unit");
assert.equal(impossible.ok, false);
assert.notEqual(impossible.body?.grounded, true);

console.log("PHASE12_CATALOG_GROUNDING=" + JSON.stringify({
  catalogSubjects: catalog.ids.length,
  eligibleHtmlSubjects: eligible.length,
  liveSample: "english-a-gymnasiou / Unit 1 — Welcome"
}, null, 2));
