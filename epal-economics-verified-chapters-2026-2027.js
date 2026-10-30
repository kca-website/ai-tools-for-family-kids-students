"use strict";
// Evidence-reviewed EPAL A Economics 2026-27 textbook chapter overrides.
// Official book: Αρχές Οικονομίας (Α' ΕΠΑΛ), Diophantos 8547/3996.
// Source PDF: https://ebooks.edu.gr/ebooks/d/8547/3996/24-0001-02-V1_Arches-Oikonomias_A-EPAL-Epilogis_Vivlio-Mathiti.pdf
// Page ranges are PDF pages (1-based), not printed chapter numbers.
// Each retrieval still requires runtime verification of the real PDF heading.
const subjectId = "epal-a-economics";
const baseLabel = "Κεφάλαιο 2: Το Οικονομικό Πρόβλημα";
const chapters = Object.freeze({
  "Κεφάλαιο. 1: Βασικές Οικονομικές Έννοιες": {
    pdfPage: 12, pdfPageEnd: 23, heading: "βασικές οικονομικές έννοιες",
    chapter: 1, expect: ["οι ανάγκες", "αγαθά", "καταμερισμός"]
  },
  "Κεφάλαιο 4: Η προσφορά αγαθών και υπηρεσιών": {
    pdfPage: 50, pdfPageEnd: 59, heading: "η προσφορά αγαθών και υπηρεσιών",
    chapter: 4, expect: ["νόμος της προσφοράς", "καμπύλη προσφοράς"]
  },
  "Κεφάλαιο 9: Εγχώριο και Εθνικό Προϊόν και Εισόδημα": {
    pdfPage: 102, pdfPageEnd: 117, heading: "εγχώριο και εθνικό προϊόν και εισόδημα",
    chapter: 9, expect: ["εγχώριο", "εθνικό", "εισόδημα"]
  },
  "Κεφάλαιο 10: Πληθωρισμός και Ανεργία": {
    pdfPage: 118, pdfPageEnd: 127, heading: "πληθωρισμός και ανεργία",
    chapter: 10, expect: ["πληθωρισμός", "ανεργία"]
  }
});
function normalize(s) {
  return String(s || "").toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/ς/g, "σ")
    .replace(/[^a-z0-9α-ω]+/g, " ").replace(/\s+/g, " ").trim();
}
function get(catalog, subject, topic) {
  const spec = subject === subjectId ? chapters[topic] : null;
  if (!spec) return null;
  const base = catalog?.get?.(subjectId, baseLabel);
  if (!base || base.bookKey !== "8547-3996" || base.grade !== "a" ||
      !String(base.viewUrl).startsWith("https://ebooks.edu.gr/ebooks/v/pdf/8547/3996/")) return null;
  return Object.freeze({
    ...base, topic, pdfPage: spec.pdfPage, pdfPageEnd: spec.pdfPageEnd,
    heading: spec.heading, method: "manual-official-chapter-toc-review",
    confidence: "high", rangeCapped: false
  });
}
function verify(subject, topic, extractedText) {
  const spec = subject === subjectId ? chapters[topic] : null;
  if (!spec) return { ok: true };
  const text = normalize(extractedText);
  if (!spec.expect.every(t => text.includes(normalize(t)))) {
    return { ok: false, error: "epal_economics_chapter_content_not_verified" };
  }
  // Keep chapter 10 out of chapter 9, even if an upstream page-range regresses.
  if (spec.chapter === 9 && text.includes(normalize("πληθωρισμός και ανεργία"))) {
    return { ok: false, error: "epal_economics_chapter_9_overruns_chapter_10" };
  }
  // No automatic scopeVerified claim; book chapter mapping ≠ full IEP annual audit.
  return { ok: true };
}
module.exports = Object.freeze({ subjectId, chapters, get, verify });
