import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const handler = require("../api/schoolbook-source.js");
const t = handler._test;

// Physics B: exact 2026-27 section allowlist.
const physicsAllowed = [
  "1.3","2.1","2.2","3.1","3.2","3.3","3.4","3.5","3.6","3.7",
  "4.1","4.2","4.3","4.4","4.5",
  "5.1","5.2","5.3","5.4","5.5","5.7","5.8",
  "6.1","6.2","6.3","6.5"
];
assert.equal(physicsAllowed.length, 26);
for (const key of physicsAllowed) {
  assert.equal(t.resolvePhysicsBCurriculumPaths(`${key} — test`).length, 1, key);
}
for (const key of ["1.1","2.3","4.6","5.6","6.4","7.1"]) {
  assert.deepEqual(t.resolvePhysicsBCurriculumPaths(`${key} — excluded`), [], key);
}
// Verified diagnostic anchors shown by AI Study must resolve even when their
// learner-friendly label does not contain the official section number.
const physicsDiagnosticAnchors = new Map([
  ["Πυκνότητα και μάζα", "index1_3.html"],
  ["Μέση ταχύτητα", "index2_2.html"],
  ["Δύναμη και μεταβολή της ταχύτητας", "index3_6.html"],
  ["Πίεση, δύναμη και επιφάνεια", "index4_1.html"],
  ["Density and mass", "index1_3.html"],
  ["Average speed", "index2_2.html"],
  ["Force and change of velocity", "index3_6.html"],
  ["Pressure, force and area", "index4_1.html"]
]);
for (const [label, expected] of physicsDiagnosticAnchors) {
  assert.deepEqual(t.resolvePhysicsBCurriculumPaths(label), [expected], label);
}

// Biology B: exact two-book annual allowlist.
const biologyAllowed = ["5.1","5.2","5.3","5.4","6.1","6.2","6.3","6.4","1.2","4.1","4.2","4.3","4.4"];
assert.equal(biologyAllowed.length, 13);
for (const key of biologyAllowed) {
  assert.equal(t.resolveBiologyBCurriculumUrls(`${key} — test`).length, 1, key);
}
for (const key of ["1.1","2.2","3.1","5.5","7.1"]) {
  assert.deepEqual(t.resolveBiologyBCurriculumUrls(`${key} — excluded`), [], key);
}

// Ancient Greek B: only annual units resolve.
for (const n of [2,3,4,5,6,7,8,9,11,12,13,16]) {
  assert.ok(t.resolveSectionPath("ancientGreekB", `Ενότητα ${n} — test`), n);
}
for (const n of [1,10,14,15,17,18]) {
  assert.equal(t.resolveSectionPath("ancientGreekB", `Ενότητα ${n} — excluded`), "", n);
}

// Unit 8 is cropped to the allowed parallel text + Γ2 syntax only.
const ancientSynthetic = [
  "[Official page: https://x/index08.html]",
  "A. Κείμενο",
  "ΑΠΑΓΟΡΕΥΜΕΝΟ ΚΥΡΙΟ ΚΕΙΜΕΝΟ",
  "Β1. Λεξιλογικός Πίνακας",
  "ΑΠΑΓΟΡΕΥΜΕΝΟ Β1",
  "Γ2. Σύνταξη Το άμεσο και έμμεσο αντικείμενο",
  "ΕΠΙΤΡΕΠΤΟ ΣΥΝΤΑΚΤΙΚΟ",
  "[Official page: https://x/index19a_parall.html]",
  "Ι. Παράλληλα κείμενα",
  "Ενότητα 7",
  "ΑΛΛΟ",
  "Ενότητα 8",
  "ΕΠΙΤΡΕΠΤΟ ΠΑΡΑΛΛΗΛΟ",
  "Ενότητα 9",
  "ΑΠΑΓΟΡΕΥΜΕΝΟ ΜΕΤΑ"
].join("\n");
const ancientScoped = t.applyCurriculumTextScope(
  "archaia-glossa-b-gymnasiou",
  "Ενότητα 8 — Η γένεση της θρησκείας και της δικαιοσύνης",
  ancientSynthetic
);
assert.match(ancientScoped.text, /ΕΠΙΤΡΕΠΤΟ ΣΥΝΤΑΚΤΙΚΟ/);
assert.match(ancientScoped.text, /ΕΠΙΤΡΕΠΤΟ ΠΑΡΑΛΛΗΛΟ/);
assert.doesNotMatch(ancientScoped.text, /ΑΠΑΓΟΡΕΥΜΕΝΟ/);

// Physics subsection exclusions are applied before AI Study sees text.
const physicsScoped = t.applyCurriculumTextScope(
  "physics-gymnasiou",
  "2.2 — Η έννοια της ταχύτητας",
  "Επιτρεπτή μέση ταχύτητα\nΔιανυσματική περιγραφή της ταχύτητας\nΑΠΑΓΟΡΕΥΜΕΝΟ"
);
assert.match(physicsScoped.text, /Επιτρεπτή μέση ταχύτητα/);
assert.doesNotMatch(physicsScoped.text, /ΑΠΑΓΟΡΕΥΜΕΝΟ/);

const physicsAliasScoped = t.applyCurriculumTextScope(
  "physics-gymnasiou",
  "Μέση ταχύτητα",
  "Επιτρεπτή μέση ταχύτητα\nΔιανυσματική περιγραφή της ταχύτητας\nΑΠΑΓΟΡΕΥΜΕΝΟ"
);
assert.match(physicsAliasScoped.text, /Επιτρεπτή μέση ταχύτητα/);
assert.doesNotMatch(physicsAliasScoped.text, /ΑΠΑΓΟΡΕΥΜΕΝΟ/);
assert.match(physicsAliasScoped.exclusions.join(" "), /διανυσματική περιγραφή/);

// Modern Greek B: selected official textbook unit, not a fake mandatory annual sequence.
for (let n = 1; n <= 9; n++) {
  assert.ok(t.resolveSectionPath("modernGreekBAnnual", `${n}η ενότητα — test`), n);
}
assert.equal(t.resolveSectionPath("modernGreekBAnnual", "10η ενότητα — excluded"), "");

// Iliad B: annual teaching groups map to exact official pages.
const iliadCases = new Map([
  ["Εισαγωγή — Ιλιάδα", "index01.html"],
  ["Ραψωδία Α — Α 1-53", "index02.html"],
  ["Ραψωδία Α — Α 54-306", "index03.html"],
  ["Ραψωδία Α — Α 307-431α", "index04.html"],
  ["Ραψωδία Α — Α 431β-612", "index05.html"]
]);
for (const [topic, expected] of iliadCases) {
  assert.ok(t.resolveIliadBCurriculumPaths(topic).includes(expected), topic);
}
assert.deepEqual(t.resolveIliadBCurriculumPaths("Ραψωδία Ω — Ω 468-677"), []);

// English B requires package + Unit and supports both official packages.
for (let n = 1; n <= 10; n++) {
  assert.equal(
    t.resolveEnglishBCurriculumUrls(`Αρχάριοι · Unit ${n} — ${t.ENGLISH_B_UNITS.beginner[n]}`).length,
    1
  );
}
for (let n = 1; n <= 8; n++) {
  assert.equal(
    t.resolveEnglishBCurriculumUrls(`Προχωρημένοι · Unit ${n} — ${t.ENGLISH_B_UNITS.advanced[n]}`).length,
    1
  );
}
assert.deepEqual(t.resolveEnglishBCurriculumUrls("Unit 5 — package missing"), []);
assert.deepEqual(t.resolveEnglishBCurriculumUrls("Αρχάριοι · Unit 11 — invalid"), []);

// Cross-layer selector counts.
const bookWindow = {};
vm.runInNewContext(
  fs.readFileSync(new URL("../general-education-book-sections-2026-2027.js", import.meta.url), "utf8"),
  { window: bookWindow }
);
const books = bookWindow.AITOOLSKIDS_GENERAL_ED_BOOK_SECTIONS_2026_2027;
assert.equal(books.get("physics-gymnasiou").sections.length, 26);
assert.equal(books.get("biologia-b-gymnasiou").sections.length, 13);
assert.equal(books.get("glossa-b-gymnasiou").sections.length, 9);
assert.equal(books.get("archaia-glossa-b-gymnasiou").sections.length, 12);
assert.equal(books.get("iliada-b-gymnasiou").sections.length, 10);
assert.equal(books.get("english-b-gymnasiou").sections.length, 18);

console.log("Remaining B Gym source-grounding: exact official book mappings and fail-closed scope passed.");
