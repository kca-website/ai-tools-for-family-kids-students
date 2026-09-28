import assert from "node:assert/strict";

const base = String(process.env.BASE_URL || "https://www.aitools4kids.gr").replace(/\/$/, "");
const subject = "istoria-b-gymnasiou";
const positives = [
  ["Κεφάλαιο 1 · Ι · 1 — Από τη Ρώμη στη Νέα Ρώμη", ["index1_1_1.html"]],
  ["Κεφάλαιο 2 · ΙΙ · 1 — Η εξάπλωση των Αράβων", ["index2_2_1.html"]],
  ["Κεφάλαιο 3 · Ι · 4 — Η διάδοση του Χριστιανισμού στους Μοραβούς και τους Βουλγάρους", ["index3_1_4.html"]],
  ["Κεφάλαιο 4 · ΙΙΙ · 2 — Η Άλωση της Πόλης", ["index4_3_2.html"]],
  ["Κεφάλαιο 5 · 4 — Εικαστικές Τέχνες και Μουσική", ["index5_4.html"]],
  ["Κεφάλαιο 6 · Ι — Η εξέλιξη της μεσαιωνικής Ευρώπης", ["index6_1_2.html", "index6_1_3.html"]],
  ["Κεφάλαιο 6 · Ι · 2 — Ο Καρλομάγνος και η εποχή του", ["index6_1_2.html"]],
  ["Κεφάλαιο 7 · ΙΙ — Ο Ελληνισμός υπό βενετική και οθωμανική κυριαρχία", ["index7_2.html"]]
];

const results = [];
for (const [topic, paths] of positives) {
  const url = `${base}/api/schoolbook-source?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  const body = await response.json();
  assert.equal(response.status, 200, `${topic}: ${JSON.stringify(body)}`);
  assert.equal(body.grounded, true, topic);
  assert.equal(body.schoolYear, "2026-2027", topic);
  assert.ok(body.curriculumSource?.includes("2026-2027"), topic);
  assert.ok(String(body.text || "").length >= 500, topic);
  assert.deepEqual(body.sourceUrls.map(urlValue => new URL(urlValue).pathname.split("/").pop()), paths, topic);
  results.push({ topic, status: response.status, paths });
}

for (const topic of [
  "Κεφάλαιο 6 · Ι · 1 — Οι συνέπειες της μετανάστευσης των γερμανικών φύλων για την Ευρώπη",
  "Κεφάλαιο 6 · ΙΙ — Η διαμόρφωση της Δυτικής Ευρώπης κατά τα τέλη του Μεσαίωνα",
  "Κεφάλαιο 7 · Ι · 5 — Εξελίξεις στα Γράμματα, τις Επιστήμες και τις Τέχνες"
]) {
  const url = `${base}/api/schoolbook-source?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  const body = await response.json();
  assert.equal(response.status, 404, `${topic}: ${JSON.stringify(body)}`);
  assert.equal(body.grounded, false, topic);
  assert.equal(body.error, "section_not_resolved", topic);
  results.push({ topic, status: response.status, error: body.error });
}

console.log(JSON.stringify({ base, results }, null, 2));
