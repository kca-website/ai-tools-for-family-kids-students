import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { resolveOfficialSchoolbookSource } = require("../api/schoolbook-source.js");

const cases = [
  ["fysiki-agogi-a-gymnasiou","Κεφάλαιο 1 — Η Ιστορία του Αθλητισμού","αθλητισ"],
  ["fysiki-agogi-a-gymnasiou","Κεφάλαιο 2 — Αθλητικές και Κινητικές Δραστηριότητες που διδάσκονται στο μάθημα της Φυσικής Αγωγής","κινητικ"],
  ["fysiki-agogi-b-gymnasiou","Κεφάλαιο 3 — Η Αξία της Διά Βίου Άσκησης","άσκη"],
  ["fysiki-agogi-b-gymnasiou","Κεφάλαιο 4 — Μέθοδοι Βελτίωσης των Φυσικών Ικανοτήτων των Μαθητών","φυσικ"],
  ["fysiki-agogi-c-gymnasiou","Κεφάλαιο 5 — Ειδικά Θέματα","ειδικ"],
  ["fysiki-agogi-c-gymnasiou","Κεφάλαιο 6 — Συμμετοχή των Μαθητών στην Οργάνωση Σχολικών Δραστηριοτήτων","σχολικ"],
  ["technologia-b-gymnasiou","Κεφάλαιο 3 — Οργάνωση των σύγχρονων παραγωγικών μονάδων","παραγωγ"]
];

for (const [subject,topic,signal] of cases) {
  const result = await resolveOfficialSchoolbookSource(subject,topic);
  assert.equal(result.ok,true,JSON.stringify({subject,topic,body:result.body}));
  assert.equal(result.body.subject,subject);
  assert.equal(result.body.topic,topic);
  assert.ok(result.body.text.length >= 150, subject+" / "+topic+" excerpt too short");
  assert.match(result.body.sourceUrl,/^https:\/\/[^/]*ebooks\.edu\.gr\//i);
  assert.ok(result.body.text.toLocaleLowerCase("el").includes(signal),subject+" / "+topic+" wrong excerpt");
}
const missing=await resolveOfficialSchoolbookSource("technologia-b-gymnasiou","Κεφάλαιο 99 — Ανύπαρκτο");
assert.equal(missing.ok,false);
assert.notEqual(missing.body?.grounded,true);
console.log("Phase 11B additional Gymnasium exact-schoolbook grounding passed.");
