import assert from "node:assert/strict";
import fs from "node:fs";

const source = await import("../api/schoolbook-source.js");
const test = source.default?._test || source._test || source.default || {};
const {
  resolveMathAQuizPaths,
  resolveMathGQuizUrls,
  MATH_A_GYM_DIAGNOSTIC_PATHS,
  MATH_G_GYM_DIAGNOSTIC_SOURCES
} = test;

assert.equal(typeof resolveMathAQuizPaths, "function");
assert.equal(typeof resolveMathGQuizUrls, "function");

assert.deepEqual(resolveMathAQuizPaths("Διάταξη ρητών αριθμών"), ["indexA7_2.html"]);
assert.deepEqual(resolveMathAQuizPaths("Απόλυτη τιμή"), ["indexA7_2.html"]);
assert.deepEqual(resolveMathAQuizPaths("ΜΚΔ vs ΕΚΠ"), ["indexA1_5.html"]);
assert.deepEqual(resolveMathAQuizPaths("Εισαγωγή σε αναλογίες"), ["indexA6_2.html"]);
assert.deepEqual(resolveMathAQuizPaths("Άσχετο θέμα"), []);

assert.deepEqual(resolveMathGQuizUrls("Πρόσημο πλην"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/indexA2_1.html"
]);
assert.deepEqual(resolveMathGQuizUrls("Ισότητα ως ισορροπία"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/indexA2_1.html"
]);
assert.deepEqual(resolveMathGQuizUrls("Επιμεριστική με αρνητικό"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/indexA1_4.html"
]);
assert.deepEqual(resolveMathGQuizUrls("Πυθαγόρειο με κάθετη πλευρά"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_4.html"
]);
assert.deepEqual(resolveMathGQuizUrls("Άσχετο θέμα"), []);

assert.equal(Object.keys(MATH_A_GYM_DIAGNOSTIC_PATHS).length, 8);
assert.equal(Object.keys(MATH_G_GYM_DIAGNOSTIC_SOURCES).length, 8);

const endpoint = fs.readFileSync(new URL("../api/schoolbook-source.js", import.meta.url), "utf8");
assert.match(endpoint, /2748\/Mathimatika_A-Gymnasiou_html-empl/);
assert.match(endpoint, /2212\/Mathimatika_G-Gymnasiou_html-empl/);
assert.match(endpoint, /"mathimatika-a-gymnasiou"[\s\S]{0,500}officialSourceRequired:\s*true/);
assert.match(endpoint, /"mathimatika-g-gymnasiou"[\s\S]{0,500}officialSourceRequired:\s*true/);

const study = fs.readFileSync(new URL("../study.html", import.meta.url), "utf8");
assert.match(study, /'mathimatika-a-gymnasiou'/);
assert.match(study, /'mathimatika-g-gymnasiou'/);

const curriculum = fs.readFileSync(new URL("../official-curriculum-data.js", import.meta.url), "utf8");
assert.match(curriculum, /Οι 4 τρέχοντες διαγνωστικοί στόχοι συνδέονται με ακριβείς σελίδες/);
assert.match(curriculum, /Ο διαγνωστικός στόχος Πυθαγορείου είναι έλεγχος προαπαιτούμενης γνώσης από τη Β΄ Γυμνασίου/);
assert.match(curriculum, /official-annual-guidance-published/);

console.log("A/G Gym Math exact-topic schoolbook grounding checks passed.");
