import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const endpoint = require("../api/schoolbook-source.js");
const catalog = require("../epal-schoolbook-catalog-2026-2027.js");
const subject = "epal-a-civics";
const topic = "Κεφάλαιο 1 — Η κοινωνία, η πολιτεία και η οικονομία · §1.1 · §1.5 (1.5.1, 1.5.2)";
const mapping = catalog.get(subject, topic);

assert.equal(mapping?.bookKey, "8547-2596");
assert.equal(mapping?.grade, "a");

for (const purpose of ["", "audio"]) {
  const reply = await endpoint.resolveOfficialSchoolbookSource(subject, topic, { schoolType: "epal", grade: "a", purpose });
  assert.equal(reply.status, 200, JSON.stringify({ purpose, error: reply.body?.error }));
  assert.equal(reply.body?.grounded, true);
  assert.equal(reply.body?.mappingStatus, "official-epal-pdf-disjoint-sections");
  assert.equal(reply.body?.curriculumScopeApplied, true);
  assert.deepEqual(reply.body?.pdfPageRanges, [{ start: 11, end: 12 }, { start: 19, end: 20 }]);
  assert.deepEqual(reply.body?.curriculumExclusions, ["§1.2", "§1.3", "§1.4"]);
  assert.match(String(reply.body?.sourceUrl || ""), /^https:\/\/ebooks\.edu\.gr\/ebooks\/v\/pdf\//);
  const text = String(reply.body?.text || "");
  assert.match(text, /1\.1\s+Άνθρωπος/i, "the first selected section must be present");
  assert.match(text, /1\.5(?:\.1)?\s+Η οικονομία|1\.5\s+Η οικονομία/i, "the second selected section must be present");
  assert.doesNotMatch(text, /1\.2\s+Η πόλις και ο πολίτης/, "excluded §1.2 leaked into AI Study");
  assert.doesNotMatch(text, /1\.3\s+Η πολιτική τέχνη/, "excluded §1.3 leaked into AI Study");
  assert.doesNotMatch(text, /1\.4\s+Ο πολιτικός/, "excluded §1.4 leaked into AI Study");
  assert.ok(text.length > 2500, "both sections need substantive official text");
  if (purpose === "audio") assert.equal(reply.body?.sourceCompleteness?.complete, true);
  console.log(JSON.stringify({ purpose: purpose || "study", chars: text.length, ranges: reply.body.pdfPageRanges, result: "pass" }));
}
