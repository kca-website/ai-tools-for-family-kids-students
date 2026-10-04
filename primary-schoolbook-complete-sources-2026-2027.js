"use strict";

// Complete, manually verified official-page bundles for Primary School topics.
// A topic is activated here only when every page needed to cover the selected
// learner-facing unit can be identified inside the same official ebooks.edu.gr
// book manifestation.

const MATH_A_BASE = "https://ebooks.edu.gr/ebooks/v/html/8547/2156/Mathimatika_A-Dimotikou_html-empl/";

function urls(prefix, numbers) {
  return numbers.map((number) => `${MATH_A_BASE}index${prefix}_${number}.html`);
}

const entries = Object.freeze([
  {
    subjectId: "math-a-dimotikou",
    label: "1η Ενότητα — Οι αριθμοί μέχρι το 5 - Χώρος και σχήματα",
    urls: urls("A1", [1,2,3,4,5,6,7,8]),
    reviewBasis: "Official book unit 1 contents and chapter pages 1-8",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-a-dimotikou",
    label: "2η Ενότητα — Πρόσθεση και ανάλυση αριθμών μέχρι το 5",
    urls: urls("A2", [9,10,11,12,13,14,15,16]),
    reviewBasis: "Official book unit 2 contents and chapter pages 9-16",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-a-dimotikou",
    label: "3η Ενότητα — Οι αριθμοί μέχρι το 20 - Αθροίσματα μέχρι το 10 - Νομίσματα",
    urls: urls("A3", [17,18,19,20,21,22,23]),
    reviewBasis: "Official book unit 3 contents and chapter pages 17-23",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-a-dimotikou",
    label: "4η Ενότητα — Αφαίρεση - Χάραξη γραμμών - Μοτίβα",
    urls: urls("A4", [25,26,27,28,29,30,31,32]),
    reviewBasis: "Official book unit 4 contents and chapter pages 25-32",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-a-dimotikou",
    label: "5η Ενότητα — Οι αριθμοί μέχρι το 50, Μονάδες και δεκάδες - Τετραγωνισμένο χαρτί",
    urls: urls("B5", [33,34,35,36,37,38]),
    reviewBasis: "Official book unit 5 contents and chapter pages 33-38",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-a-dimotikou",
    label: "6η Ενότητα — Μονάδες και δεκάδες - Γεωμετρικά σχήματα - Χρόνος",
    urls: urls("B6", [39,40,41,42,43]),
    reviewBasis: "Official book unit 6 contents and chapter pages 39-43",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-a-dimotikou",
    label: "7η Ενότητα — Χαράξεις, Παζλ - Πρόσθεση και αφαίρεση - Η υπέρβαση της δεκάδας",
    urls: urls("B7", [45,46,47,48,49,50,51]),
    reviewBasis: "Official book unit 7 contents and chapter pages 45-51",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-a-dimotikou",
    label: "8η Ενότητα — Οι αριθμοί μέχρι το 70 - Πολλαπλασιασμός - Συμμετρία",
    urls: urls("B8", [52,53,54,55,56,57]),
    reviewBasis: "Official book unit 8 contents and chapter pages 52-57",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-a-dimotikou",
    label: "9η Ενότητα — Οι αριθμοί μέχρι το 100 - Πράξεις - Βάρος - Γεωμετρικά σχήματα",
    urls: urls("B9", [58,59,60,61,62,63]),
    reviewBasis: "Official book unit 9 contents and chapter pages 58-63",
    reviewedAt: "2026-10-04"
  }
]);

function get(subjectId, label) {
  const subject = String(subjectId || "").trim();
  const topic = String(label || "").trim();
  return entries.find((entry) => entry.subjectId === subject && entry.label === topic) || null;
}

module.exports = Object.freeze({
  schoolYear: "2026-2027",
  reviewedAt: "2026-10-04",
  entries,
  count: entries.length,
  get
});
