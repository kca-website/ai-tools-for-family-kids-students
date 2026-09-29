import assert from "node:assert/strict";
import fs from "node:fs";

const source = await import("../api/schoolbook-source.js");
const test = source.default?._test || source._test || source.default || {};
const {
  resolvePhysicsGQuizUrls,
  physicsGAnnualTopicKey,
  scopePhysicsGAnnualTopic,
  PHYSICS_G_GYM_ANNUAL_TOPIC_SOURCES,
  resolveChemistryGQuizUrls,
  resolveBiologyGQuizUrls,
  PHYSICS_G_GYM_DIAGNOSTIC_SOURCES,
  CHEMISTRY_G_GYM_DIAGNOSTIC_SOURCES,
  BIOLOGY_G_GYM_DIAGNOSTIC_SOURCES
} = test;

assert.equal(typeof resolvePhysicsGQuizUrls, "function");
assert.equal(typeof resolveChemistryGQuizUrls, "function");
assert.equal(typeof resolveBiologyGQuizUrls, "function");

assert.deepEqual(resolvePhysicsGQuizUrls("Νόμος του Ωμ"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index2.html"
]);
assert.deepEqual(resolvePhysicsGQuizUrls("Γ΄ · Κεφάλαιο 2 — Ηλεκτρικό ρεύμα / Νόμος του Ωμ"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index2.html"
]);
assert.deepEqual(resolvePhysicsGQuizUrls("Τύπος ταχύτητας"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2204/Fysiki_B-Gymnasiou_html-empl/index2_2.html"
]);
assert.deepEqual(resolvePhysicsGQuizUrls("Μετατροπή ενέργειας"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index3.html"
]);

const physicsAnnualTopics = [
  ["Ηλεκτρική δύναμη, φορτίο και ηλεκτρικό πεδίο", "electric-force-field", ["index1.html"]],
  ["Ηλεκτρικό ρεύμα και κυκλώματα", "current-circuits", ["index2.html"]],
  ["Αντίσταση, νόμος του Ohm και συνδεσμολογία", "ohm-connections", ["index2.html"]],
  ["Αποτελέσματα, ενέργεια και ισχύς ηλεκτρικού ρεύματος", "effects-energy-power", ["index3.html"]],
  ["Ταλαντώσεις και εκκρεμές", "oscillations", ["index4.html"]],
  ["Μηχανικά κύματα και ήχος", "waves-sound", ["index5.html"]],
  ["Φως, διάδοση και ανάκλαση", "light-reflection", ["index6.html", "index7.html"]],
  ["Διάθλαση, ανάλυση φωτός και χρώμα", "refraction-colour", ["index8.html"]]
];
for (const [label, key, endings] of physicsAnnualTopics) {
  assert.equal(physicsGAnnualTopicKey(label), key);
  const urls = resolvePhysicsGQuizUrls(label);
  assert.equal(urls.length, endings.length);
  endings.forEach((ending, i) => assert.ok(urls[i].endsWith(ending), label + " source " + ending));
}
assert.equal(Object.keys(PHYSICS_G_GYM_ANNUAL_TOPIC_SOURCES).length, 16);

const scopedElectricField = scopePhysicsGAnnualTopic(
  "ΚΕΦΑΛΑΙΟ 1 ΗΛΕΚΤΡΙΚΗ ΔΥΝΑΜΗ ΚΑΙ ΦΟΡΤΙΟ\n1.1 Γνωριμία\n1.6 Το ηλεκτρικό πεδίο\nΗλεκτρική δύναμη και πεδίο\nΠεριγραφή του ηλεκτρικού πεδίου\nΔυναμικές γραμμές",
  "electric-force-field"
);
assert.match(scopedElectricField.text, /Ηλεκτρική δύναμη και πεδίο/);
assert.doesNotMatch(scopedElectricField.text, /Δυναμικές γραμμές/);

const scopedOhm = scopePhysicsGAnnualTopic(
  "2.3 Ηλεκτρικά δίπολα\nΑντίσταση του διπόλου\nΝόμος του Ωμ\nισχύει ο νόμος του Ωμ για κάθε ηλεκτρικό δίπολο;\nΝόμος του Ωμ και μικρόκοσμος\n2.4 Παράγοντες από τους οποίους εξαρτάται η αντίσταση\n2.5 Εφαρμογές αρχών διατήρησης στη μελέτη απλών\nΣύνδεση αντιστατών\nΠαράλληλη σύνδεση αντιστατών\nΕρωτήσεις\nεκτός",
  "ohm-connections"
);
assert.match(scopedOhm.text, /Νόμος του Ωμ/);
assert.match(scopedOhm.text, /Παράλληλη σύνδεση αντιστατών/);
assert.doesNotMatch(scopedOhm.text, /Νόμος του Ωμ και μικρόκοσμος/);
assert.doesNotMatch(scopedOhm.text, /2\.4 Παράγοντες/);
assert.deepEqual(resolvePhysicsGQuizUrls("Άσχετο θέμα"), []);

assert.deepEqual(resolveChemistryGQuizUrls("Στοιχείο vs Ένωση"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2206/Chimeia_B-Gymnasiou_html-empl/index2_6.html"
]);
assert.deepEqual(resolveChemistryGQuizUrls("Μείγμα vs Ένωση"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2206/Chimeia_B-Gymnasiou_html-empl/index2_6_2.html"
]);
assert.deepEqual(resolveChemistryGQuizUrls("Δομή του ατόμου"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2206/Chimeia_B-Gymnasiou_html-empl/index2_9.html"
]);
assert.deepEqual(resolveChemistryGQuizUrls("Β΄ · 2.9 — Υποατομικά σωματίδια / δομή ατόμου (προαπαιτούμενο)"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2206/Chimeia_B-Gymnasiou_html-empl/index2_9.html"
]);
assert.deepEqual(resolveChemistryGQuizUrls("Άσχετο θέμα"), []);

assert.deepEqual(resolveBiologyGQuizUrls("Θέση του DNA"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/index5_1.html"
]);
assert.deepEqual(resolveBiologyGQuizUrls("Κληρονομικότητα από τους γονείς"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/index5_5.html"
]);
assert.deepEqual(resolveBiologyGQuizUrls("Έννοια βιοποικιλότητας"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/index7_1.html"
]);
assert.deepEqual(resolveBiologyGQuizUrls("Αιτία εξαφάνισης είδους"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/index7_1.html"
]);
assert.deepEqual(resolveBiologyGQuizUrls("Σκοπός αναπαραγωγής"), [
  "https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/index6_1.html"
]);
assert.deepEqual(resolveBiologyGQuizUrls("Άσχετο θέμα"), []);

assert.equal(Object.keys(PHYSICS_G_GYM_DIAGNOSTIC_SOURCES).length, 9);
assert.equal(Object.keys(CHEMISTRY_G_GYM_DIAGNOSTIC_SOURCES).length, 9);
assert.equal(Object.keys(BIOLOGY_G_GYM_DIAGNOSTIC_SOURCES).length, 10);

const endpoint = fs.readFileSync(new URL("../api/schoolbook-source.js", import.meta.url), "utf8");
for (const subject of ["fysiki-g-gymnasiou", "chimeia-g-gymnasiou", "biologia-g-gymnasiou"]) {
  const marker = `"${subject}": {`;
  const at = endpoint.indexOf(marker);
  assert.ok(at >= 0, `missing BOOKS entry for ${subject}`);
  assert.match(endpoint.slice(at, at + 900), /officialSourceRequired:\s*true/);
}
assert.match(endpoint, /selectionPolicy: "exact-current-diagnostic-prerequisites"/);

const curriculum = fs.readFileSync(new URL("../official-curriculum-data.js", import.meta.url), "utf8");
assert.match(curriculum, /"fysiki-g-gymnasiou"[\s\S]{0,900}"coverageStatus": "annual-guidance-detailed-map"/);
assert.match(curriculum, /"fysiki-g-gymnasiou"[\s\S]{0,4500}"mappedTopicsEl"[\s\S]{0,1800}"Διάθλαση, ανάλυση φωτός και χρώμα"/);
assert.match(curriculum, /Τύπος ταχύτητας[\s\S]{0,1800}προαπαιτούμενη γνώση/);
assert.match(curriculum, /Χημεία Γ΄ 2026–27[\s\S]{0,1600}προαπαιτούμενες έννοιες της Β΄/);
assert.match(curriculum, /"biologia-g-gym\.biodiversity-definition"[\s\S]{0,900}"status":"related-section-verified"/);
assert.match(curriculum, /"biologia-g-gym\.reproduction-purpose"[\s\S]{0,1000}"annualScopeVerified":false/);

console.log("G Gym science exact-topic/prerequisite schoolbook grounding checks passed.");
