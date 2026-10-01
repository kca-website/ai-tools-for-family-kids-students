import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const endpoint = require("../api/schoolbook-source.js");

const primaryEnvironmentGrounded = {
  "environment-a-dimotikou": [
    "Βασικές ανάγκες ζωντανών οργανισμών",
    "Κανόνες στο σχολείο και στην ομάδα",
    "Παρατήρηση με τις αισθήσεις"
  ],
  "environment-b-dimotikou": [
    "Τι χρειάζεται ένα φυτό",
    "Ζώα και τόπος ζωής",
    "Υπηρεσίες της κοινότητας"
  ],
  "environment-c-dimotikou": [
    "Συνεργασία και κανόνες",
    "Φυσικά χαρακτηριστικά και ανθρώπινα έργα",
    "Τροφή και ενέργεια",
    "Φροντίδα του περιβάλλοντος",
    "Χάρτης και προσανατολισμός"
  ],
  "environment-d-dimotikou": [
    "Οικοσύστημα",
    "Σχέσεις τροφής στο οικοσύστημα",
    "Φυσικά χαρακτηριστικά του τόπου",
    "Έργα και ανάγκες της κοινότητας"
  ]
};

const primaryEnvironmentFailClosed = {
  "environment-a-dimotikou": ["Ζωντανό ή μη ζωντανό", "Εποχές και καιρός"],
  "environment-b-dimotikou": ["Φυσικό και ανθρωπογενές περιβάλλον", "Απορρίμματα και επαναχρησιμοποίηση"],
  "environment-d-dimotikou": ["Φυσικοί πόροι και υπεύθυνη χρήση"]
};

const physicsGrounded = [
  "Μετρήσεις μήκους και μέση τιμή",
  "Μετρήσεις χρόνου και ακρίβεια",
  "Μετρήσεις μάζας και διαγράμματα",
  "Θερμοκρασία και βαθμονόμηση",
  "Θερμότητα, θερμοκρασία και θερμική ισορροπία",
  "Ηλεκτρικό βραχυκύκλωμα και ασφάλεια",
  "Από τον ηλεκτρισμό στον μαγνητισμό",
  "Από τον μαγνητισμό στον ηλεκτρισμό"
];

const geographyGrounded = [
  "Χάρτες: είδη, υπόμνημα και κλίμακα",
  "Γεωγραφικές συντεταγμένες και προσανατολισμός",
  "Η Γη στο ηλιακό σύστημα",
  "Λιθόσφαιρα: ανάγλυφο και τεκτονικές πλάκες",
  "Υδρόσφαιρα: ωκεανοί, θάλασσες και ποτάμια",
  "Ατμόσφαιρα, καιρός και κλίμα",
  "Βιόσφαιρα και φυσικά οικοσυστήματα",
  "Ανθρωπογενές περιβάλλον: πληθυσμός και οικισμοί",
  "Ήπειροι: συνθετική εργασία (προαιρετική εμβάθυνση)"
];

const results = [];

for (const [subject, topics] of Object.entries(primaryEnvironmentGrounded)) {
  for (const topic of topics) {
    const live = await endpoint.resolveOfficialSchoolbookSource(subject, topic);
    results.push({ subject, topic, ok:live.ok, sourceUrl:live.body?.sourceUrl, pages:live.body?.sourceUrls?.length || 0 });
    assert.equal(live.ok, true, subject + " / " + topic + " => " + JSON.stringify(live.body));
    assert.equal(live.body?.grounded, true);
    assert.match(String(live.body?.sourceUrl || ""), /^https:\/\/[^/]*ebooks\.edu\.gr\/ebooks\/v\/html\//i);
    assert.ok(String(live.body?.text || "").length >= 250);
  }
}

for (const [subject, topics] of Object.entries(primaryEnvironmentFailClosed)) {
  for (const topic of topics) {
    const fail = await endpoint.resolveOfficialSchoolbookSource(subject, topic);
    assert.equal(fail.ok, false, subject + " / " + topic + " must remain fail-closed until an exact official book passage is verified.");
    assert.notEqual(fail.body?.grounded, true);
  }
}


for (const topic of physicsGrounded) {
  const live = await endpoint.resolveOfficialSchoolbookSource("fysiki-a-gymnasiou", topic);
  results.push({ subject:"fysiki-a-gymnasiou", topic, ok:live.ok, sourceUrl:live.body?.sourceUrl });
  assert.equal(live.ok, true, topic + " => " + JSON.stringify(live.body));
  assert.equal(live.body?.grounded, true);
  assert.match(String(live.body?.sourceUrl || ""), /^https:\/\/[^/]*ebooks\.edu\.gr\/ebooks\/v\/html\//i);
  assert.ok(String(live.body?.text || "").length >= 500);
}

for (const topic of ["Μέτρηση όγκου", "Μέτρηση πυκνότητας"]) {
  const fail = await endpoint.resolveOfficialSchoolbookSource("fysiki-a-gymnasiou", topic);
  assert.equal(fail.ok, false, topic + " must remain fail-closed because its 2026-27 source is the laboratory guide, not this HTML textbook.");
  assert.notEqual(fail.body?.grounded, true);
}

for (const topic of geographyGrounded) {
  const live = await endpoint.resolveOfficialSchoolbookSource("geografia-a-gymnasiou", topic);
  results.push({ subject:"geografia-a-gymnasiou", topic, ok:live.ok, sourceUrl:live.body?.sourceUrl, pages:live.body?.sourceUrls?.length || 0 });
  assert.equal(live.ok, true, topic + " => " + JSON.stringify(live.body));
  assert.equal(live.body?.grounded, true);
  assert.match(String(live.body?.sourceUrl || ""), /^https:\/\/[^/]*ebooks\.edu\.gr\/ebooks\/v\/html\//i);
  assert.ok(String(live.body?.text || "").length >= 500);
}

const informatics = {
  "pliroforiki-a-gymnasiou": [
    "Διαδίκτυο, Ιστορία του Διαδικτύου, Υπηρεσίες Διαδικτύου",
    "Βασικές Έννοιες Πληροφορικής",
    "Το Υλικό του Υπολογιστή",
    "Επεξεργασία Κειμένου – Μορφοποίηση Γραμματοσειράς και Παραγράφου"
  ],
  "pliroforiki-b-gymnasiou": [
    "Ψηφιακός Κόσμος",
    "Το Εσωτερικό του Υπολογιστή",
    "Δίκτυα Υπολογιστών",
    "Χρήση συναρτήσεων στο λογισμικό Υπολογιστικά Φύλλα",
    "Παρουσιάσεις – Διαχείριση Διαφανειών, Εναλλαγή Διαφανειών, Κινήσεις"
  ],
  "pliroforiki-c-gymnasiou": [
    "Πρόβλημα – Αλγόριθμος",
    "Αριθμητικές Πράξεις, Εντολές Εξόδου",
    "Εντολές Εξόδου, Μεταβλητές",
    "Σχεδιασμός γεωμετρικών σχημάτων – Επανάληψη – Διαδικασίες",
    "Επιλέγοντας"
  ]
};

for (const [subject, topics] of Object.entries(informatics)) {
  for (const topic of topics) {
    const live = await endpoint.resolveOfficialSchoolbookSource(subject, topic);
    results.push({ subject, topic, ok:live.ok, sourceUrl:live.body?.sourceUrl });
    assert.equal(live.ok, true, subject + " / " + topic + " => " + JSON.stringify(live.body));
    assert.equal(live.body?.grounded, true);
    assert.ok(String(live.body?.text || "").length >= 400);
  }
}

const informaticsSafetyFail = await endpoint.resolveOfficialSchoolbookSource(
  "pliroforiki-a-gymnasiou",
  "Κίνδυνοι στο Διαδίκτυο – Κανόνες Συμπεριφοράς"
);
assert.equal(informaticsSafetyFail.ok, false, "A Gymnasium internet-safety anchor must stay fail-closed until an exact official book page is verified.");
assert.notEqual(informaticsSafetyFail.body?.grounded, true);

const technologyTopics = [
  "Τεχνολογικό περιβάλλον και τεχνολογικοί άξονες",
  "Επιλογή και μελέτη τεχνολογικού αντικειμένου",
  "Ατομική εργασία: σχεδιασμός και κατασκευή",
  "Τεχνικό σχέδιο, υλικά και εργαλεία",
  "Παρουσίαση και αξιολόγηση της κατασκευής"
];

for (const topic of technologyTopics) {
  const live = await endpoint.resolveOfficialSchoolbookSource("technologia-a-gymnasiou", topic);
  results.push({ subject:"technologia-a-gymnasiou", topic, ok:live.ok, sourceUrl:live.body?.sourceUrl, pages:live.body?.sourceUrls?.length || 0 });
  assert.equal(live.ok, true, topic + " => " + JSON.stringify(live.body));
  assert.equal(live.body?.grounded, true);
  assert.ok(String(live.body?.text || "").length >= 400);
}

const impossible = await endpoint.resolveOfficialSchoolbookSource("geografia-a-gymnasiou", "Ανύπαρκτη ενότητα");
assert.equal(impossible.ok, false);
assert.notEqual(impossible.body?.grounded, true);

console.log("PHASE14_PRIMARY_MIDDLE_GROUNDING=" + JSON.stringify({
  exactGrounded: results,
  deliberateFailClosed: [
    "fysiki-a-gymnasiou / Μέτρηση όγκου",
    "fysiki-a-gymnasiou / Μέτρηση πυκνότητας",
    "pliroforiki-a-gymnasiou / Κίνδυνοι στο Διαδίκτυο – Κανόνες Συμπεριφοράς",
    "environment-a-dimotikou / Ζωντανό ή μη ζωντανό",
    "environment-a-dimotikou / Εποχές και καιρός",
    "environment-b-dimotikou / Φυσικό και ανθρωπογενές περιβάλλον",
    "environment-b-dimotikou / Απορρίμματα και επαναχρησιμοποίηση",
    "environment-d-dimotikou / Φυσικοί πόροι και υπεύθυνη χρήση"
  ]
}, null, 2));
