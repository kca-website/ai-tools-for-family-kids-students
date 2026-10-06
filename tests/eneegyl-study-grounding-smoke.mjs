import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";

// ΕΝ.Ε.Ε.ΓΥ.-Λ. in AI Study (Τομέας Διοίκησης και Οικονομίας; Τομέας Υγείας-Πρόνοιας-Ευεξίας Β΄–Δ΄). Every unit is a section or chapter of the
// official book that the 2026–27 ΕΝ.Ε.Ε.ΓΥ.-Λ. circular names for that course, with a verified PDF page range.
const require = createRequire(import.meta.url);
globalThis.window = globalThis;
for (const file of ["special-education-curriculum-data.js", "teacher-curriculum-eneegyl-official-sectors-2026-2027.js", "teacher-curriculum-eneegyl-exact-exam-2026-2027.js"]) require(`../${file}`);
const entries = window.SPECIAL_EDUCATION_CURRICULUM.entries;
const M = require("../special-education-book-sections-2026-2027.js");
const handler = require("../api/schoolbook-source.js");

const P = "eneegyl-official-";
const NUR = "βοηθος-νοσηλευτη-", LAB = "βοηθος-ιατρικων-βιολογικων-εργαστηριων-", BRF = "βοηθος-βρεφονηπιοκομων-";
const ADM = "υπαλληλος-διοικησης-και-οικονομικων-υπηρεσιων-", TOUR = "υπαλληλος-τουριστικων-επιχειρησεων-", COM = "υπαλληλος-εμποριας-και-διαφημισης-", WH = "υπαλληλος-αποθηκης-και-συστηματων-εφοδιασμου-";
const expected = {
  ea: { "a-αρχες-οικονομιας": 19 },
  eb: { "b-αρχες-λογιστικης": 37, "b-εισαγωγη-στο-μαρκετινγκ": 36, "b-θεωρια-τουρισμου-και-εφαρμογες": 23, "b-εισαγωγη-στην-εφοδιαστικη-logistics": 14,
    "b-ανατομια-φυσιολογια-i": 5, "b-υγεια-και-διατροφη": 21, "b-μικροβιολογια-ι": 36, "b-φαρμακευτικη-τεχνολογια-ι": 12, "b-ακτινοτεχνολογια-ι": 21, "b-συγχρονη-αισθητικη-ι": 42,
    "b-εισαγωγη-στη-φυσικοθεραπεια-ι": 48, "b-δημιουργικη-απασχοληση-στην-προσχολικη-ηλικια-i": 21, "b-οδοντοτεχνια-ι": 17, "b-νοσηλευτικη-ι": 21, "b-βασικες-εφαρμογες-κομμωτικης-ι": 13 },
  ec: { "c-στοιχεια-δικαιου-αστικο-εργατικο": 9, "c-χρηματοπιστωτικες-συναλλαγες-λογιστικα-φυλλα-excel": 67, "c-οικονομικα-μαθηματικα-στατιστικη": 32,
    "c-αρχες-οικονομικης-θεωριας": 2, "c-αρχες-οργανωσης-και-διοικησης": 10,
    "c-ανατομια-φυσιολογια-ιι": 19, "c-πρωτες-βοηθειες": 12, "c-μικροβιολογια-ι": 36, "c-υγιεινη": 7, "c-φαρμακευτικη-τεχνολογια-ι": 12, "c-ακτινοτεχνολογια-ι": 21,
    "c-συγχρονη-αισθητικη-ι": 42, "c-εισαγωγη-στη-φυσικοθεραπεια-ι": 48, "c-δημιουργικη-απασχοληση-στην-προσχολικη-ηλικια-i": 21, "c-οδοντοτεχνια-ι": 17,
    "c-διαπροσωπικες-σχεσεις": 46, "c-εργασιακο-περιβαλλον-τομεα": 15, "c-νοσηλευτικη-ι": 21, "c-βασικες-εφαρμογες-κομμωτικης-ι": 13 },
  ed: {
    [`d-${ADM}συγχρονο-περιβαλλον-γραφειου`]: 96, [`d-${ADM}φορολογικη-πρακτικη`]: 34, [`d-${ADM}λογιστικες-εφαρμογες`]: 16, [`d-${ADM}επικοινωνια-και-δημοσιες-σχεσεις`]: 26,
    [`d-${TOUR}οργανωση-και-λειτουργια-τουριστικων-επιχειρησ`]: 20, [`d-${TOUR}οργανωση-και-λειτουργια-ξενοδοχειακων-επιχειρ`]: 43, [`d-${TOUR}γεωγραφια-τουρισμου`]: 54, [`d-${TOUR}εφαρμογες-στον-τουρισμο`]: 11,
    [`d-${COM}συγχρονο-περιβαλλον-γραφειου`]: 96, [`d-${COM}διαφημιση-εισαγωγη-δημιουργια-και-προβολη`]: 9, [`d-${COM}επικοινωνια-και-δημοσιες-σχεσεις`]: 26, [`d-${COM}εφαρμογες-marketing`]: 54, [`d-${COM}λογιστικες-εφαρμογες`]: 16,
    [`d-${WH}οργανωση-και-διαχειριση-αποθηκων`]: 19, [`d-${WH}οργανωση-και-διαχειριση-μεταφορων`]: 10, [`d-${WH}εφαρμογες-εφοδιαστικης`]: 9, [`d-${WH}λογιστικες-εφαρμογες`]: 16,
    [`d-${NUR}νοσηλευτικη-ii`]: 95, [`d-${NUR}χειρουργικη-τεχνικη-χειρουργειου`]: 23, [`d-${NUR}στοιχεια-μαιευτικης-γυναικολογιας`]: 10, [`d-${NUR}στοιχεια-παθολογιας`]: 14,
    [`d-${LAB}μικροβιολογια-ιι`]: 27, [`d-${LAB}αιματολογια`]: 85, [`d-${LAB}κλινικη-βιοχημεια`]: 46, [`d-${LAB}ανοσολογια`]: 23,
    [`d-${BRF}παιδαγωγικο-περιβαλλον-βρεφονηπιακου-σταθμου`]: 32, [`d-${BRF}αγωγη-βρεφους-νηπιου`]: 62, [`d-${BRF}στοιχεια-γενικης-και-εξελικτικης-ψυχολογιας`]: 39,
    [`d-${BRF}δημιουργικη-απασχοληση-στην-προσχολικη-ηλικια-ιι`]: 37, [`d-${BRF}μουσικοκινητικη-αγωγη`]: 8, [`d-${BRF}λογοτεχνια-προσχολικης-ηλικιας`]: 20,
  },
};
let total = 0;
for (const [grade, subjects] of Object.entries(expected)) {
  assert.deepEqual(M.subjectsForGrade(grade).map((s) => s.id).sort(), Object.keys(subjects).map((k) => P + k).sort(), `grade ${grade}`);
  for (const [key, count] of Object.entries(subjects)) {
    const id = P + key;
    assert.ok(entries[id], `${id}: official ΕΝ.Ε.Ε.ΓΥ.-Λ. curriculum entry`);
    const labels = M.labels(id);
    assert.equal(labels.length, count, id);
    assert.equal(new Set(labels).size, count, `${id}: unique labels`);
    const anchors = entries[id].officialAnchors || [];
    for (const label of labels) {
      const unit = M.get(id, label);
      if (anchors.length) assert.ok(anchors.includes(unit.anchor), `${id}: ${unit.anchor}`);
      assert.equal(unit.pages.length, 1, `${id}: ${label}`);
      const pdf = unit.pages[0].pdf;
      assert.match(pdf.viewUrl, /^https:\/\/ebooks\.edu\.gr\/ebooks\/v\/pdf\/8547\/\d+\//);
      assert.match(pdf.downloadUrl, /^https:\/\/ebooks\.edu\.gr\/ebooks\/d\/8547\/\d+\/.+\.pdf$/);
      assert.ok(Number.isInteger(pdf.pdfPage) && pdf.pdfPageEnd >= pdf.pdfPage && pdf.pdfPageEnd - pdf.pdfPage < 40, `${id}: ${label} page range`);
      assert.ok(pdf.heading && pdf.heading.length >= 4, `${id}: ${label} heading`);
    }
    total += count;
  }
}
assert.equal(total, 1912);

// Units follow the circular, not the whole book: excluded sections are not offered.
const econ = M.labels(P + "a-αρχες-οικονομιας");
assert.ok(econ.includes("Κεφ. 1 · 1. Οι ανάγκες") && !econ.some((l) => /^Κεφ\. 1 · 4\./.test(l)), "Αρχές Οικονομίας: ch.1 §4 is not in the circular");
assert.ok(!M.labels(P + "c-οικονομικα-μαθηματικα-στατιστικη").some((l) => /^4\.9 /.test(l)), "Οικονομικά Μαθηματικά §4.9 is excluded");
assert.ok(M.labels(P + "b-εισαγωγη-στο-μαρκετινγκ").includes("11.4 Βασικές λειτουργίες του γραφείου Μάρκετινγκ"));
// Same course in several specialties / grades → same units.
assert.deepEqual(M.labels(`${P}d-${ADM}λογιστικες-εφαρμογες`), M.labels(`${P}d-${WH}λογιστικες-εφαρμογες`));
assert.deepEqual(M.labels(P + "b-μικροβιολογια-ι"), M.labels(P + "c-μικροβιολογια-ι"));
// Δ΄ Υγείας: theory and laboratory parts of one book keep their own numbering (lab chapters restart at 1).
assert.ok(M.labels(`${P}d-${LAB}μικροβιολογια-ιι`).some((l) => l.startsWith("Εργαστηριακό κέντρο · Κεφάλαιο 5")));
// The Πανελλαδικώς εξεταζόμενα Ανατομία-Φυσιολογία ΙΙ and Υγιεινή follow Υ.Α. 90676/Δ3 and are not offered yet.
assert.ok(!M.subjectsForGrade("ed").some((s) => /βοηθος-νοσηλευτη-(ανατομια|υγιεινη)/.test(s.id)));
// A course taught from two books keeps both, limited to the circular's sections (Αισθητική Αγωγή: Θέατρο 1.5, 2.1–2.3).
const creative = M.labels(P + "b-δημιουργικη-απασχοληση-στην-προσχολικη-ηλικια-i").filter((l) => l.startsWith("Αισθητική Αγωγή — Θέατρο"));
assert.deepEqual(creative.map((l) => l.split(" · ")[1].split(" ")[0]), ["1.5", "2.1", "2.2", "2.3"]);

// API: an ΕΝ.Ε.Ε.ΓΥ.-Λ. unit never falls back to an unmapped topic.
const call = async (query) => {
  let status = 0, body = null;
  const res = { setHeader() {}, status(c) { status = c; return res; }, json(b) { body = b; return res; } };
  await handler({ method: "GET", query, headers: {} }, res);
  return { status, body };
};
const unmapped = await call({ subject: P + "a-αρχες-οικονομιας", topic: "Κεφάλαιο 6 — Μορφές οργάνωσης της αγοράς" });
assert.equal(unmapped.status, 404);
assert.equal(unmapped.body.error, "source_not_mapped");

// AI Study: ΕΝ.Ε.Ε.ΓΥ.-Λ. grades inside the Special Education level.
const study = fs.readFileSync(new URL("../study.html", import.meta.url), "utf8");
assert.match(study, /\['ea','Α΄ Λυκείου ΕΝ\.Ε\.Ε\.ΓΥ\.-Λ\.'\].*\['ed','Δ΄ Λυκείου ΕΝ\.Ε\.Ε\.ΓΥ\.-Λ\.'\]\]/);
assert.match(study, /\[0\]==='e'\?'eneegyl':'special-gymnasium'/);
// Chapter-level Ε.Α.Ε. units («Κεφάλαιο N — …») are verified units, not unmapped chapter placeholders.
assert.match(study, /\/\^Κεφάλαιο\\s\+\\d\+\\s\+—\/i\.test\(topic\) && !specialSections\(\)\?\.get\?\.\(subject,topic\)/);

console.log(`ΕΝ.Ε.Ε.ΓΥ.-Λ. study grounding smoke passed: ${total} units (Διοίκησης και Οικονομίας; Υγείας-Πρόνοιας-Ευεξίας Β΄–Δ΄).`);
