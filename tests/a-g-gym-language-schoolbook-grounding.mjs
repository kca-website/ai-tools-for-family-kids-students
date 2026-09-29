import assert from "node:assert/strict";
import fs from "node:fs";

const source = await import("../api/schoolbook-source.js");
const test = source.default?._test || source._test || source.default || {};
const {
  resolveGlossaAQuizUrls,
  resolveGlossaGQuizUrls,
  GLOSSA_A_GYM_DIAGNOSTIC_SOURCES,
  GLOSSA_G_GYM_DIAGNOSTIC_SOURCES
} = test;

assert.equal(typeof resolveGlossaAQuizUrls, "function");
assert.equal(typeof resolveGlossaGQuizUrls, "function");

assert.equal(resolveGlossaAQuizUrls("Μέρη του λόγου").length, 4);
assert.match(resolveGlossaAQuizUrls("Μέρη του λόγου")[0], /Grammatiki-Neas-Ellinikis-Glossas/);
assert.deepEqual(resolveGlossaAQuizUrls("Αντικειμενική πληροφορία vs προσωπικό σχόλιο"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2256/Neoelliniki-Glossa_A-Gymnasiou_html-empl/indexi_3.htm"
]);
assert.deepEqual(resolveGlossaAQuizUrls("Βασικό επιχειρηματολογικό κείμενο"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2256/Neoelliniki-Glossa_A-Gymnasiou_html-empl/indexd_4.htm"
]);
assert.deepEqual(resolveGlossaAQuizUrls("Έγκλιση ρήματος"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2334/Grammatiki-Neas-Ellinikis-Glossas_A-B-G-Gymnasiou_html-apli/index_C_06.html"
]);
assert.deepEqual(resolveGlossaAQuizUrls("Άσχετο θέμα"), []);

assert.deepEqual(resolveGlossaGQuizUrls("Συμφωνία υποκειμένου-ρήματος"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2334/Grammatiki-Neas-Ellinikis-Glossas_A-B-G-Gymnasiou_html-apli/index_D_01.html"
]);
assert.equal(resolveGlossaGQuizUrls("Χρήση κομμάτων").length, 2);
assert.match(resolveGlossaGQuizUrls("Χρήση κομμάτων")[0], /Neoelliniki-Glossa_G-Gymnasiou_html-empl\/indexi_3\.html/);
assert.match(resolveGlossaGQuizUrls("Χρήση κομμάτων")[1], /Grammatiki-Neas-Ellinikis-Glossas/);
assert.deepEqual(resolveGlossaGQuizUrls("Άσχετο θέμα"), []);

assert.ok(Object.keys(GLOSSA_A_GYM_DIAGNOSTIC_SOURCES).length >= 8);
assert.equal(Object.keys(GLOSSA_G_GYM_DIAGNOSTIC_SOURCES).length, 4);

const endpoint = fs.readFileSync(new URL("../api/schoolbook-source.js", import.meta.url), "utf8");
assert.match(endpoint, /"glossa-a-gymnasiou"[\s\S]{0,700}officialSourceRequired:\s*true/);
assert.match(endpoint, /"glossa-gymnasiou"[\s\S]{0,700}officialSourceRequired:\s*true/);
assert.match(endpoint, /2334\/Grammatiki-Neas-Ellinikis-Glossas_A-B-G-Gymnasiou_html-apli/);

const quiz = fs.readFileSync(new URL("../quiz-data.js", import.meta.url), "utf8");
assert.match(quiz, /Αντικειμενική πληροφορία vs προσωπικό σχόλιο/);
assert.match(quiz, /αντικειμενική παρουσίαση μιας πληροφορίας από το προσωπικό σχόλιο/);

const learning = fs.readFileSync(new URL("../learning-paths-data.js", import.meta.url), "utf8");
assert.match(learning, /αντικειμενική και υποκειμενική στάση στην αφήγηση/);

const curriculum = fs.readFileSync(new URL("../official-curriculum-data.js", import.meta.url), "utf8");
assert.match(curriculum, /Σχολική Γραμματική · Κείμενο - Περίοδος - Πρόταση — συμφωνία ρήματος με το υποκείμενο/);
assert.match(curriculum, /shared official grammar allowed/);
assert.match(curriculum, /official-annual-guidance-published/);

console.log("A/G Gym Greek language exact-source grounding checks passed.");
