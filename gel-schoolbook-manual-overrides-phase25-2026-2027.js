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

// Chapter 11 is present in the official Economics textbook PDF but is not
// part of the 2026–27 nationwide examinable Economics syllabus. Its aggregate
// learner label has NOT passed current-year curriculum scope verification.
// Do not mutate the generated inventory at module import: a verified book page
// alone does not authorize an out-of-scope topic to become runtime-eligible.
// Phase 21 deliberately keeps both unverified aggregate labels fail-closed.
//
// A future curriculum update can add an explicit, reviewed topic mapping only
// after the annual teaching scope AND exact PDF text boundaries are verified.

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
