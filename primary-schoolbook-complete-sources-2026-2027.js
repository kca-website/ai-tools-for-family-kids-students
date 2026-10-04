"use strict";

// Complete, manually verified official-page bundles for Primary School topics.
// A topic is activated here only when every page needed to cover the selected
// learner-facing unit can be identified inside the same official ebooks.edu.gr
// book manifestation.

const MATH_A_BASE = "https://ebooks.edu.gr/ebooks/v/html/8547/2156/Mathimatika_A-Dimotikou_html-empl/";
const MATH_B_BASE = "https://ebooks.edu.gr/ebooks/v/html/8547/2164/Mathimatika_B-Dimotikou_html-empl/";

function urls(base, prefix, numbers) {
  return numbers.map((number) => `${base}index${prefix}_${number}.html`);
}

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

const entries = Object.freeze([
  {
    subjectId: "math-a-dimotikou",
    label: "1η Ενότητα — Οι αριθμοί μέχρι το 5 - Χώρος και σχήματα",
    urls: urls(MATH_A_BASE, "A1", range(1, 8)),
    reviewBasis: "Official book unit 1 contents and chapter pages 1-8",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-a-dimotikou",
    label: "2η Ενότητα — Πρόσθεση και ανάλυση αριθμών μέχρι το 5",
    urls: urls(MATH_A_BASE, "A2", range(9, 16)),
    reviewBasis: "Official book unit 2 contents and chapter pages 9-16",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-a-dimotikou",
    label: "3η Ενότητα — Οι αριθμοί μέχρι το 20 - Αθροίσματα μέχρι το 10 - Νομίσματα",
    urls: urls(MATH_A_BASE, "A3", range(17, 23)),
    reviewBasis: "Official book unit 3 contents and chapter pages 17-23",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-a-dimotikou",
    label: "4η Ενότητα — Αφαίρεση - Χάραξη γραμμών - Μοτίβα",
    urls: urls(MATH_A_BASE, "A4", range(25, 32)),
    reviewBasis: "Official book unit 4 contents and chapter pages 25-32",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-a-dimotikou",
    label: "5η Ενότητα — Οι αριθμοί μέχρι το 50, Μονάδες και δεκάδες - Τετραγωνισμένο χαρτί",
    urls: urls(MATH_A_BASE, "B5", range(33, 38)),
    reviewBasis: "Official book unit 5 contents and chapter pages 33-38",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-a-dimotikou",
    label: "6η Ενότητα — Μονάδες και δεκάδες - Γεωμετρικά σχήματα - Χρόνος",
    urls: urls(MATH_A_BASE, "B6", range(39, 43)),
    reviewBasis: "Official book unit 6 contents and chapter pages 39-43",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-a-dimotikou",
    label: "7η Ενότητα — Χαράξεις, Παζλ - Πρόσθεση και αφαίρεση - Η υπέρβαση της δεκάδας",
    urls: urls(MATH_A_BASE, "B7", range(45, 51)),
    reviewBasis: "Official book unit 7 contents and chapter pages 45-51",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-a-dimotikou",
    label: "8η Ενότητα — Οι αριθμοί μέχρι το 70 - Πολλαπλασιασμός - Συμμετρία",
    urls: urls(MATH_A_BASE, "B8", range(52, 57)),
    reviewBasis: "Official book unit 8 contents and chapter pages 52-57",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-a-dimotikou",
    label: "9η Ενότητα — Οι αριθμοί μέχρι το 100 - Πράξεις - Βάρος - Γεωμετρικά σχήματα",
    urls: urls(MATH_A_BASE, "B9", range(58, 63)),
    reviewBasis: "Official book unit 9 contents and chapter pages 58-63",
    reviewedAt: "2026-10-04"
  },

  // Mathematics B Primary. Official contents define the nine unit chapter spans.
  {
    subjectId: "math-b-dimotikou",
    label: "1η Ενότητα — Κεφάλαια 1-8",
    urls: urls(MATH_B_BASE, "A1", range(1, 8)),
    reviewBasis: "Official book unit 1 contents: chapters 1-8",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-b-dimotikou",
    label: "2η Ενότητα — Κεφάλαια 9-15",
    urls: urls(MATH_B_BASE, "A2", range(9, 15)),
    reviewBasis: "Official book unit 2 contents: chapters 9-15",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-b-dimotikou",
    label: "3η Ενότητα — Κεφάλαια 16-23",
    urls: urls(MATH_B_BASE, "A3", range(16, 23)),
    reviewBasis: "Official book unit 3 contents: chapters 16-23",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-b-dimotikou",
    label: "4η Ενότητα — Κεφάλαια 24-28",
    urls: urls(MATH_B_BASE, "A4", range(24, 28)),
    reviewBasis: "Official book unit 4 contents: chapters 24-28",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-b-dimotikou",
    label: "5η Ενότητα — Κεφάλαια 29-33",
    urls: urls(MATH_B_BASE, "B5", range(29, 33)),
    reviewBasis: "Official book unit 5 contents: chapters 29-33",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-b-dimotikou",
    label: "6η Ενότητα — Κεφάλαια 34-40",
    urls: urls(MATH_B_BASE, "B6", range(34, 40)),
    reviewBasis: "Official book unit 6 contents: chapters 34-40",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-b-dimotikou",
    label: "7η Ενότητα — Κεφάλαια 41-44",
    urls: urls(MATH_B_BASE, "B7", range(41, 44)),
    reviewBasis: "Official detailed contents: unit 7 chapters 41-44",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-b-dimotikou",
    label: "8η Ενότητα — Κεφάλαια 45-50",
    urls: urls(MATH_B_BASE, "B8", range(45, 50)),
    reviewBasis: "Official detailed contents: unit 8 chapters 45-50",
    reviewedAt: "2026-10-04"
  },
  {
    subjectId: "math-b-dimotikou",
    label: "9η Ενότητα — Κεφάλαια 51-54",
    urls: urls(MATH_B_BASE, "B9", range(51, 54)),
    reviewBasis: "Official book unit 9 contents: chapters 51-54",
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
