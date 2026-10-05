"use strict";

// Phase 25 manual HTML override that remains active.
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
  }
]);

// The HTML manifestation of Αρχές Οικονομικής Θεωρίας stops at chapter 10,
// while the official PDF contains chapter 11. Promote the already manually
// verified learner topic to an exact PDF section at runtime rather than pointing
// to a non-existent index11.html page. This mutates only the in-memory generated
// inventory object; the generated file remains untouched.
try {
  const map = require("./gel-schoolbook-source-map-2026-2027.js");
  const row = map?.get?.("oikonomia-g-lykeiou");
  const topic = row?.topicMappings?.find?.(
    (entry) => entry?.label === "Διεθνές εμπόριο και οικονομικές σχέσεις"
  );
  if (topic) {
    Object.assign(topic, {
      status: "exact-pdf",
      work: "8547/2392",
      url: "https://ebooks.edu.gr/ebooks/v/pdf/8547/2522/22-0299-01_V1_Arches-Oikonomikis-Theorias_G-Lykeiou-Spoudon-Oikonomias-Pliroforikis_Vivlio-Mathiti/#page=187",
      pdfPage: 187,
      pdfPageEnd: 192,
      heading: "2. Διεθνοποίηση της Οικονομίας",
      granularity: "pdf-section",
      matchBasis: "manual-verified-official-pdf-chapter-11",
      labelParaphrase: true,
      confidence: "high"
    });
  }
} catch (_) {}

function get(subjectId, label) {
  const s = String(subjectId || "").trim();
  const l = String(label || "").trim();
  return entries.find((entry) => entry.subjectId === s && entry.label === l) || null;
}

module.exports = Object.freeze({
  generatedAt: "2026-10-05",
  schoolYear: "2026-2027",
  count: entries.length,
  entries,
  get
});
