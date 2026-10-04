"use strict";

const entries = Object.freeze([
  {
    subjectId: "ekthesi-a-lykeiou",
    label: "Τρόποι ανάπτυξης παραγράφου",
    sourceTopicId: "ekthesi-a-lykeiou.mapped-topic-9",
    sourceStatus: "needs-manual-review",
    sourceReason: "unnumbered-topic-no-equal-heading",
    sourceOrigin: "manual-official-discovery",
    discoveryPhase: 25,
    work: "8547/2369",
    granularity: "manual-discovered-page",
    reviewBasis: "Official Γλωσσικές Ασκήσεις page Η΄ Παράγραφος explicitly lists the common ways of paragraph development and cross-references A/B/G Lyceum material.",
    reviewedAt: "2026-10-04",
    reviewPhase: 25,
    sources: [
      {
        work: "8547/2369",
        url: "https://ebooks.edu.gr/ebooks/v/html/8547/2750/Glossikes-Askiseis_A-B-G-Lykeiou_html-apli/indexB_06.html",
        heading: "Η' Παράγραφος"
      }
    ]
  },
  {
    subjectId: "oikonomia-g-lykeiou",
    label: "Διεθνές εμπόριο και οικονομικές σχέσεις",
    sourceTopicId: "oikonomia-g-lykeiou.topic-20",
    sourceStatus: "needs-manual-review",
    sourceReason: "unnumbered-topic-no-matching-heading",
    sourceOrigin: "manual-official-discovery",
    discoveryPhase: 25,
    work: "8547/2392",
    granularity: "manual-discovered-page",
    reviewBasis: "Official Αρχές Οικονομικής Θεωρίας, Chapter 11: Διεθνείς οικονομικές σχέσεις - Ευρωπαϊκή Ένωση - Ελληνική οικονομία; the chapter explicitly covers international trade/imports/exports and international economic relations.",
    reviewedAt: "2026-10-04",
    reviewPhase: 25,
    sources: [
      {
        work: "8547/2392",
        url: "https://ebooks.edu.gr/ebooks/v/html/8547/4722/Arches-Oikonomikis-Theorias_G-Lykeiou-SpOikPlir_html-apli/index11.html",
        heading: "ΔΙΕΘΝΕΙΣ ΟΙΚΟΝΟΜΙΚΕΣ ΣΧΕΣΕΙΣ"
      }
    ]
  }
]);

function get(subjectId, label) {
  const s = String(subjectId || "").trim();
  const l = String(label || "").trim();
  return entries.find((entry) => entry.subjectId === s && entry.label === l) || null;
}

module.exports = Object.freeze({
  generatedAt: "2026-10-04",
  schoolYear: "2026-2027",
  count: entries.length,
  entries,
  get
});
