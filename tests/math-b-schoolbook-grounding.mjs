import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url);
const handler=require("../api/schoolbook-source.js");
const t=handler._test;
const mathBBase="https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/";
const leafCases=new Map([
  [
    "Επανάληψη από Α΄ Γυμνασίου · 7.1 — Θετικοί και Αρνητικοί Αριθμοί (Ρητοί αριθμοί) - Η ευθεία των ρητών - Τετμημένη σημείου (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_1.html"
  ],
  [
    "Επανάληψη από Α΄ Γυμνασίου · 7.2 — Απόλυτη τιμή ρητού - Αντίθετοι ρητοί - Σύγκριση ρητών (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_2.html"
  ],
  [
    "Επανάληψη από Α΄ Γυμνασίου · 7.3 — Πρόσθεση ρητών αριθμών (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_3.html"
  ],
  [
    "Επανάληψη από Α΄ Γυμνασίου · 7.4 — Αφαίρεση ρητών αριθμών (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_4.html"
  ],
  [
    "Επανάληψη από Α΄ Γυμνασίου · 7.5 — Πολλαπλασιασμός ρητών αριθμών (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_5.html"
  ],
  [
    "Επανάληψη από Α΄ Γυμνασίου · 7.6 — Διαίρεση ρητών αριθμών (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_6.html"
  ],
  [
    "Από Α΄ Γυμνασίου · 7.7 — Δεκαδική μορφή ρητών αριθμών (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_7.html"
  ],
  [
    "Από Α΄ Γυμνασίου · 7.8 — Δυνάμεις ρητών αριθμών με εκθέτη φυσικό (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_8.html"
  ],
  [
    "Από Α΄ Γυμνασίου · 7.9 — Δυνάμεις ρητών αριθμών με εκθέτη ακέραιο (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_9.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 1 · 1.1 — Η έννοια της μεταβλητής - Αλγεβρικές παραστάσεις",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA1_1.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 1 · 1.2 — Εξισώσεις α΄ βαθμού",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA1_2.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 1 · 1.4 — Επίλυση προβλημάτων με τη χρήση εξισώσεων",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA1_4.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 2 · 2.1 — Τετραγωνική ρίζα θετικού αριθμού",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA2_1.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 2 · 2.2 — Άρρητοι αριθμοί - Πραγματικοί αριθμοί",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA2_2.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 2 · 2.3 — Προβλήματα (προαιρετικό)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA2_3.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 3 · 3.1 — Η έννοια της συνάρτησης",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_1.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 3 · 3.2 — Καρτεσιανές συντεταγμένες - Γραφική παράσταση συνάρτησης",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_2.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 3 · 3.3 — Η συνάρτηση y = αx",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_3.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 3 · 3.4 — Η συνάρτηση y = αx + β",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_4.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 3 · 3.5 — Η συνάρτηση y = α/x - Η υπερβολή",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_5.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 4 · 4.1 — Βασικές έννοιες της Στατιστικής: Πληθυσμός - Δείγμα",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA4_1.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 4 · 4.2 — Γραφικές παραστάσεις",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA4_2.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 4 · 4.5 — Μέση τιμή - Διάμεσος",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA4_5.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 1 · 1.1 — Εμβαδόν επίπεδης επιφάνειας",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_1.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 1 · 1.2 — Μονάδες μέτρησης επιφανειών",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_2.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 1 · 1.3 — Εμβαδά επίπεδων σχημάτων",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_3.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 1 · 1.4 — Πυθαγόρειο θεώρημα",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_4.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 2 · 2.1 — Εφαπτομένη οξείας γωνίας",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB2_1.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 2 · 2.2 — Ημίτονο και συνημίτονο οξείας γωνίας",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB2_2.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 3 · 3.1 — Εγγεγραμμένες γωνίες",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_1.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 3 · 3.2 — Κανονικά πολύγωνα",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_2.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 3 · 3.3 — Μήκος κύκλου",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_3.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 3 · 3.5 — Εμβαδόν κυκλικού δίσκου",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_5.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 4 · 4.2 — Στοιχεία και εμβαδόν πρίσματος και κυλίνδρου",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_2.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 4 · 4.3 — Όγκος πρίσματος και κυλίνδρου",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_3.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 4 · 4.4 — Η πυραμίδα και τα στοιχεία της (προαιρετικό)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_4.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 4 · 4.6 — Η σφαίρα και τα στοιχεία της (προαιρετικό)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_6.html"
  ]
]);
assert.equal(leafCases.size,37);
for(const [topic,url] of leafCases) assert.deepEqual(t.resolveMathBCurriculumUrls(topic),[url],topic);
assert.equal(t.resolveMathBCurriculumUrls("Μέρος Α — Άλγεβρα").length,14);
assert.equal(t.resolveMathBCurriculumUrls("Μέρος Β — Γεωμετρία").length,14);
assert.deepEqual(t.resolveMathBCurriculumUrls("Μέρος Α · Κεφάλαιο 1 — Εξισώσεις - Ανισώσεις"),[mathBBase+"indexA1_1.html",mathBBase+"indexA1_2.html",mathBBase+"indexA1_4.html"]);
assert.deepEqual(t.resolveMathBCurriculumUrls("Μέρος Β · Κεφάλαιο 4 — Γεωμετρικά Στερεά - Μέτρηση Στερεών"),[mathBBase+"indexB4_2.html",mathBBase+"indexB4_3.html",mathBBase+"indexB4_4.html",mathBBase+"indexB4_6.html"]);
for(const topic of ["Μέρος Α · Κεφάλαιο 1 · 1.3 — Επίλυση τύπων","Μέρος Α · Κεφάλαιο 1 · 1.5 — Ανισώσεις α΄ βαθμού","Μέρος Α · Κεφάλαιο 4 · 4.3 — Κατανομή συχνοτήτων","Μέρος Β · Κεφάλαιο 2 · 2.3 — Μεταβολές ημιτόνου, συνημιτόνου και εφαπτομένης","Μέρος Β · Κεφάλαιο 3 · 3.4 — Μήκος τόξου","Μέρος Β · Κεφάλαιο 4 · 4.5 — Ο κώνος και τα στοιχεία του"]) assert.deepEqual(t.resolveMathBCurriculumUrls(topic),[],topic);
const gw={}; vm.runInNewContext(fs.readFileSync(new URL("../general-education-book-sections-2026-2027.js",import.meta.url),"utf8"),{window:gw});
const hierarchy=gw.AITOOLSKIDS_GENERAL_ED_BOOK_SECTIONS_2026_2027.get("mathimatika-b-gymnasiou").sections;
assert.equal(hierarchy.length,47); for(const topic of leafCases.keys()) assert.ok(hierarchy.includes(topic),topic);
const ow={}; vm.runInNewContext(fs.readFileSync(new URL("../official-curriculum-data.js",import.meta.url),"utf8"),{window:ow});
const off=ow.AITOOLSKIDS_OFFICIAL_CURRICULUM.getByQuizId("mathimatika-b-gymnasiou");
assert.equal(off.annualInstructionsStatus,"2026-27-verified"); assert.equal(off.coverageStatus,"annual-guidance-detailed-map"); assert.equal(off.officialSectionsEl.length,37); assert.equal(off.mappedTopicsEl.length,37);
const q=fs.readFileSync(new URL("../quiz-data.js",import.meta.url),"utf8"),p=fs.readFileSync(new URL("../learning-paths-data.js",import.meta.url),"utf8");
for(const stale of ["math-b-gym.monomial-like-terms","math-b-gym.identity-square-sum"]){assert.ok(!q.includes(stale));assert.ok(!p.includes(stale));}
for(const fresh of ["math-b-gym.square-root-positive","math-b-gym.proportional-function"]){assert.ok(q.includes(fresh));assert.ok(p.includes(fresh));}
const response={statusCode:0,body:null,setHeader(){},status(code){this.statusCode=code;return this;},json(body){this.body=body;return this;}};
await handler({method:"GET",query:{subject:"mathimatika-b-gymnasiou",topic:"Μέρος Α · Κεφάλαιο 1 · 1.3 — Εκτός ύλης"}},response);
assert.equal(response.statusCode,404);assert.equal(response.body.error,"section_not_resolved");

const scopeA34=t.resolveMathBCurriculumScope("Μέρος Α · Κεφάλαιο 3 · 3.4 — Η συνάρτηση y = αx + β");
assert.ok(scopeA34.includes("α·x + β·y = γ"));
assert.ok(scopeA34.includes("Σημεία τομής"));
assert.ok(t.resolveMathBCurriculumScope("Μέρος Α · Κεφάλαιο 4 · 4.5 — Μέση τιμή - Διάμεσος").includes("ομαδοποιημένης κατανομής"));
assert.ok(t.resolveMathBCurriculumScope("Μέρος Β · Κεφάλαιο 2 · 2.2 — Ημίτονο και συνημίτονο οξείας γωνίας").includes("παρατήρηση (β)"));
assert.ok(t.resolveMathBCurriculumScope("Μέρος Β · Κεφάλαιο 3 · 3.2 — Κανονικά πολύγωνα").includes("προαιρετική"));
assert.ok(t.resolveMathBCurriculumScope("Από Α΄ Γυμνασίου · 7.8 — Δυνάμεις ρητών αριθμών με εκθέτη φυσικό (μη εξεταστέο)").includes("Δεν αποτελεί εξεταστέα"));

const studyText=fs.readFileSync(new URL("../study.html",import.meta.url),"utf8");
assert.match(studyText,/function requiresOfficialSource\(\)[\s\S]*?mathimatika-b-gymnasiou[\s\S]*?includes\(selectedSubjectId\(\)\)/);
assert.ok(studyText.includes("documentScope:attached?.text?'':(officialSource?.curriculumScope||'')"));
assert.ok(studyText.includes("sourceScope:source?.curriculumScope||''"));

const tutorText=fs.readFileSync(new URL("../api/tutor-assistant.js",import.meta.url),"utf8");
assert.ok(tutorText.includes("OFFICIAL CURRICULUM SCOPE FOR THIS SOURCE (MANDATORY)"));
assert.ok(tutorText.includes("documentScope = ''"));
assert.ok(tutorText.includes("do NOT use it in explanations, examples, questions, flashcards, quizzes, summaries or plans"));

const summaryText=fs.readFileSync(new URL("../api/source-summary.js",import.meta.url),"utf8");
assert.ok(summaryText.includes("AUTHORITATIVE CURRICULUM SCOPE"));
assert.ok(summaryText.includes("sourceScope = ''"));
assert.ok(summaryText.includes("excluded material is physically present in SOURCE"));

console.log("Math B 2026-27 grounding integrity: 37 mapped topics, 47 hierarchy nodes, corrected quiz, fail-closed exclusions OK");
