import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const endpoint = require("../api/schoolbook-source.js");
const catalog = require("../epal-schoolbook-catalog-2026-2027.js");
const verified = require("../epal-economics-verified-chapters-2026-2027.js");

const subject = "epal-a-economics";
const cases = [
  ["Κεφάλαιο. 1: Βασικές Οικονομικές Έννοιες", 12, 23, ["ανάγκες", "αγαθά", "παραγωγή"]],
  ["Κεφάλαιο 4: Η προσφορά αγαθών και υπηρεσιών", 50, 59, ["προσφορά", "νόμος της προσφοράς"]],
  ["Κεφάλαιο 9: Εγχώριο και Εθνικό Προϊόν και Εισόδημα", 102, 117, ["εθνικό", "εγχώριο", "εισόδημα"]],
  ["Κεφάλαιο 10: Πληθωρισμός και Ανεργία", 118, 127, ["πληθωρισμός", "ανεργία"]]
];
assert.equal(Object.keys(verified.chapters).length, 4);
for (const [topic, start, end, required] of cases) {
  const mapping = verified.get(catalog, subject, topic);
  assert.ok(mapping, "unverified mapping: " + topic);
  assert.equal(mapping.pdfPage, start);
  assert.equal(mapping.pdfPageEnd, end);
  assert.equal(mapping.bookKey, "8547-3996");
  for (const purpose of ["", "audio"]) {
    const r = await endpoint.resolveOfficialSchoolbookSource(subject, topic, {
      schoolType: "epal", grade: "a", purpose
    });
    assert.equal(r.status, 200, JSON.stringify({ topic, purpose, status: r.status, error: r.body?.error, message: r.body?.message }));
    assert.equal(r.body?.grounded, true);
    assert.equal(r.body?.mappingStatus, "official-epal-pdf-manual-verified-chapter");
    assert.equal(r.body?.chapterRangeVerified, true);
    assert.equal(r.body?.annualScopeVerified, false, "chapter source proof is not full annual scope");
    assert.equal(r.body?.pdfPage, start);
    assert.equal(r.body?.pdfPageEnd, end);
    assert.ok(r.body?.sourceUrl?.startsWith("https://ebooks.edu.gr/ebooks/v/pdf/8547/3996/"));
    const t = String(r.body?.text || "");
    assert.ok(t.length > 800, topic + " lacks substantive book text");
    const normalize = s => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ς/g, "σ");
    for (const part of required) assert.ok(normalize(t).includes(normalize(part)), topic + " missing " + part);
    if (start === 102) assert.ok(!normalize(t).includes("πληθωρισμοσ και ανεργια"), "Chapter 9 leaked chapter 10");
    if (purpose === "audio") assert.equal(r.body?.sourceCompleteness?.complete, true);
    console.log(JSON.stringify({ topic, purpose: purpose || "study", pages: [start, end], chars: t.length, pass: true }));
  }
}
assert.equal(verified.get(catalog, "epal-b-economics", cases[0][0]), null);
assert.equal(verified.verify(subject, cases[0][0], "Not a verified chapter").ok, false);
