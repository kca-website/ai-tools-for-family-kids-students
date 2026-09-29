import assert from "node:assert/strict";
import fs from "node:fs";

const source = await import("../api/schoolbook-source.js");
const test = source.default?._test || source._test || source.default || {};
const {
  resolveHistoryAQuizPaths,
  resolveHistoryGQuizPaths,
  HISTORY_A_GYM_DIAGNOSTIC_PATHS,
  HISTORY_G_GYM_DIAGNOSTIC_PATHS
} = test;

assert.equal(typeof resolveHistoryAQuizPaths, "function");
assert.equal(typeof resolveHistoryGQuizPaths, "function");

assert.deepEqual(resolveHistoryAQuizPaths("Πολιτισμοί Εποχής Χαλκού"), [
  "index_02_02.html","index_02_03.html","index_02_05.html"
]);
assert.deepEqual(resolveHistoryAQuizPaths("Πορεία προς τη δημοκρατία"), ["index_04_05.html"]);
assert.deepEqual(resolveHistoryAQuizPaths("Πελοποννησιακός Πόλεμος"), ["index_06_01.html"]);
assert.deepEqual(resolveHistoryAQuizPaths("Έργο Μεγάλου Αλεξάνδρου"), ["index_07_04.html"]);
assert.deepEqual(resolveHistoryAQuizPaths("Άσχετο θέμα"), []);

assert.deepEqual(resolveHistoryGQuizPaths("Έναρξη της Επανάστασης"), ["index2_8.html"]);
assert.deepEqual(resolveHistoryGQuizPaths("Ενότητα κατά την Επανάσταση"), ["index2_9.html"]);
assert.deepEqual(resolveHistoryGQuizPaths("Ίδρυση Φιλικής Εταιρείας"), ["index2_7.html"]);
assert.deepEqual(resolveHistoryGQuizPaths("Εκπαίδευση επί Τουρκοκρατίας"), ["index2_5.html"]);
assert.deepEqual(resolveHistoryGQuizPaths("Άσχετο θέμα"), []);

assert.equal(Object.keys(HISTORY_A_GYM_DIAGNOSTIC_PATHS).length, 8);
assert.equal(Object.keys(HISTORY_G_GYM_DIAGNOSTIC_PATHS).length, 8);

const endpoint = fs.readFileSync(new URL("../api/schoolbook-source.js", import.meta.url), "utf8");
assert.match(endpoint, /2290\/Istoria_A-Gymnasiou_html-empl/);
assert.match(endpoint, /5204\/Istoria_G-Gymnasiou_html-empl/);
assert.match(endpoint, /"istoria-a-gymnasiou"[\s\S]{0,500}officialSourceRequired:\s*true/);
assert.match(endpoint, /"istoria-g-gymnasiou"[\s\S]{0,500}officialSourceRequired:\s*true/);

const study = fs.readFileSync(new URL("../study.html", import.meta.url), "utf8");
assert.match(study, /'istoria-a-gymnasiou'/);
assert.match(study, /'istoria-g-gymnasiou'/);

const quiz = fs.readFileSync(new URL("../quiz-data.js", import.meta.url), "utf8");
assert.match(quiz, /Ο Αγώνας είχε αρχίσει λίγες μέρες νωρίτερα και η 25η Μαρτίου ορίστηκε εθνική επέτειος το 1838/);
assert.match(quiz, /Νικόλαος Σκουφάς, Αθανάσιος Τσακάλωφ, Εμμανουήλ Ξάνθος και Παναγιώτης Αναγνωστόπουλος/);
assert.match(quiz, /Οι πάροικοι ίδρυαν σχολεία και οι εκπαιδευτικές εστίες πολλαπλασιάζονταν/);

const curriculum = fs.readFileSync(new URL("../official-curriculum-data.js", import.meta.url), "utf8");
assert.match(curriculum, /official-book-diagnostic-topic-grounded/);
assert.match(curriculum, /official-annual-guidance-published/);
assert.match(curriculum, /δεν δηλώνει ακόμη πλήρη καταγραφή κάθε ενότητας της ετήσιας ύλης 2026–27/);

console.log("A/G Gym History exact-topic schoolbook grounding checks passed.");
