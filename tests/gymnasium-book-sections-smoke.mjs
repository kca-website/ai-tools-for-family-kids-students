import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";

// Γυμνάσιο subjects that were hidden for lack of an exact source: every listed topic points to the
// official book page(s) / PDF range that teaches it and is listed as verified for AI Study.
const require = createRequire(import.meta.url);
const G = require("../gymnasium-book-sections-2026-2027.js");
const availability = require("../secondary-grounding-availability-2026-2027.js");
const expansion = fs.readFileSync(new URL("../curriculum-2026-2027-expansion.js", import.meta.url), "utf8");
const api = fs.readFileSync(new URL("../api/schoolbook-source.js", import.meta.url), "utf8");

const htmlExpected = {
  "biologia-a-gymnasiou": 15, "biologia-g-gymnasiou": 12, "fysiki-a-gymnasiou": 8, "geografia-a-gymnasiou": 9,
  "chimeia-g-gymnasiou": 12, "fysiki-g-gymnasiou": 8, "mathimatika-a-gymnasiou": 3, "mathimatika-g-gymnasiou": 7,
  "istoria-a-gymnasiou": 4, "istoria-b-gymnasiou": 4, "istoria-g-gymnasiou": 8, "geografia-b-gymnasiou": 8,
  "logotechnia-a-gymnasiou": 65, "logotechnia-g-gymnasiou": 69,
};
for (const [id, count] of Object.entries(htmlExpected)) {
  const labels = G.labels(id);
  assert.equal(labels.length, count, id);
  for (const label of labels) {
    const urls = G.urlsFor(id, label);
    assert.ok(urls.length >= 1, `${id}: ${label}`);
    for (const u of urls) assert.match(u, /^https:\/\/ebooks\.edu\.gr\/ebooks\/v\/html\/8547\/\d+\/[\w-]+_html-empl\/(?:index|mat)[\w]+\.html$/);
    assert.ok(availability.has(id, label), `verified: ${id} / ${label}`);
  }
}
// Chapter topics cover every subsection page of the chapter.
assert.equal(G.urlsFor("biologia-a-gymnasiou", "Κεφ. 4: Αναπνοή").length, 4);
// No invented sections: topics the book does not teach stay unmapped.
assert.equal(G.urlsFor("fysiki-a-gymnasiou", "Μέτρηση όγκου").length, 0);
assert.equal(G.urlsFor("biologia-a-gymnasiou", "Επιστήμη της Βιολογίας και εισαγωγή στην επιστημονική μέθοδο").length, 0);
assert.equal(G.urlsFor("geografia-b-gymnasiou", "Η Ελλάδα μέσα στην Ευρώπη").length, 0);
// The UI id of Γεωγραφία Β΄ resolves to the same table.
for (const label of G.labels("geografia-b-gymnasiou")) assert.deepEqual(G.urlsFor("geologia-geografia-b-gymnasiou", label), G.urlsFor("geografia-b-gymnasiou", label));

// Λογοτεχνία Α΄/Γ΄: AI Study lists exactly the anthology texts, one official page each, and the
// Language tutor refresh must not swallow them into Νεοελληνική Γλώσσα.
for (const id of ["logotechnia-a-gymnasiou", "logotechnia-g-gymnasiou"]) {
  const at = expansion.indexOf(`id: "${id}"`);
  assert.ok(at > 0, `${id} in catalog`);
  const rows = expansion.slice(expansion.indexOf("rows: [", at), expansion.indexOf("\n        ],", at));
  assert.deepEqual([...rows.matchAll(/\["((?:[^"\\]|\\.)+)", "/g)].map((m) => JSON.parse(`"${m[1]}"`)), G.labels(id));
  for (const label of G.labels(id)) assert.equal(G.urlsFor(id, label).length, 1, `${id}: ${label}`);
  assert.match(api, new RegExp(`"${id}": \\{`));
}
const languageTutor = fs.readFileSync(new URL("../september-2026-language-tutor.js", import.meta.url), "utf8");
assert.match(languageTutor, /if \(\/\^logotechnia-\/\.test\(/);

// Θρησκευτικά Α΄/Γ΄ Γυμνασίου: the 7 thematic units of each official PDF book.
for (const id of ["thriskeftika-a-gymnasiou", "thriskeftika-g-gymnasiou"]) {
  const book = G.pdfSubjects[id];
  assert.equal(book.units.length, 7, id);
  let previousEnd = 0;
  for (const [label, start, end, heading] of book.units) {
    assert.ok(start > previousEnd && end >= start && end - start + 1 <= G.pdfMaxSpan, `${id} ${label}`);
    assert.match(heading, /^ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ /);
    assert.ok(availability.has(id, label), `verified: ${id} / ${label}`);
    previousEnd = end;
  }
  assert.match(book.downloadUrl, /^https:\/\/ebooks\.edu\.gr\/ebooks\/d\/8547\/\d+\/21-02\d\d-01_V\d_Thriskeutika_[AG]-Gymnasiou_Vivlio-Mathiti\.pdf$/);
  // AI Study shows exactly these units.
  const at = expansion.indexOf(`id: "${id}"`);
  const rows = expansion.slice(expansion.indexOf("rows: [", at), expansion.indexOf("\n        ],", at));
  assert.deepEqual([...rows.matchAll(/\["([^"]+)", "[^"]+"\]/g)].map((m) => m[1]), book.units.map((u) => u[0]));
}
assert.doesNotMatch(expansion, /Η Αγία Γραφή: συνάντηση Θεού και ανθρώπου/, "generic labels replaced");

assert.match(api, /const gymnasiumUrls = GYMNASIUM_SECTIONS\.urlsFor\(subject, topic\);/);
assert.match(api, /GYMNASIUM_SECTIONS\.pdfFor\(subject, topic\)/);
assert.match(api, /async function handleTablePdfSource\(/);

console.log("Gymnasium book sections smoke passed: Βιολογία, Φυσική, Χημεία Γ΄, Μαθηματικά Α΄/Γ΄, Ιστορία Α΄–Γ΄, Γεωγραφία Α΄/Β΄, Λογοτεχνία Α΄/Γ΄, Θρησκευτικά Α΄/Γ΄.");
