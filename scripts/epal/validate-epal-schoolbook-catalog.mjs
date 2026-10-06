// Validates EPAL_BOOK_CATALOG (epal-schoolbook-catalog-2026-2027.js) against the EPAL
// curriculum that AI Study shows today (same browser catalog, same selector combinations).
//
// Detects: unmapped subjects / units, units missing from the catalog (stale build), wrong
// grade / sector / specialty, mappings to unknown or non-official books, invalid page ranges,
// duplicate or conflicting mappings, and catalog entries that AI Study no longer shows.
//
// Usage:
//   node scripts/epal/validate-epal-schoolbook-catalog.mjs            # offline, exits 1 on errors
//   node scripts/epal/validate-epal-schoolbook-catalog.mjs --json     # machine-readable report
//   node scripts/epal/validate-epal-schoolbook-catalog.mjs --live=12  # + fetch 12 sampled units
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { ROOT, loadEpalStudentCatalog, enumerateStudyRows, normalizePdfText } from "./lib.mjs";

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const liveArg = args.find((a) => a.startsWith("--live"));
const liveCount = liveArg ? Number(liveArg.split("=")[1] || 9) : 0;

const EPAL = require(path.join(ROOT, "epal-schoolbook-catalog-2026-2027.js"));
const { catalog } = loadEpalStudentCatalog();
const rows = enumerateStudyRows(catalog);

const errors = [];
const warnings = [];
const err = (code, detail) => errors.push({ code, ...detail });
const warn = (code, detail) => warnings.push({ code, ...detail });

const OFFICIAL_PDF = /^https:\/\/ebooks\.edu\.gr\/ebooks\/(?:v\/pdf|d)\//;
const maxSpan = EPAL.maxPdfSpan || 40;

// 1. Catalog-internal integrity -------------------------------------------------------------
const seenIds = new Map();
for (const group of EPAL.groups) {
  const where = { grade: group.grade, subject: group.subjectLabel };
  for (const id of group.subjectIds) {
    if (seenIds.has(id)) err("duplicate-subject-id", { ...where, subjectId: id, other: seenIds.get(id) });
    seenIds.set(id, group.subjectLabel);
    if (!id.startsWith(`epal-${group.grade}-`)) err("wrong-grade", { ...where, subjectId: id });
  }
  for (const [topic, unit] of Object.entries(group.units)) {
    const [bookKey, pdfPage, pdfPageEnd, heading] = unit;
    const book = EPAL.books[bookKey];
    const at = { ...where, topic };
    if (Object.prototype.hasOwnProperty.call(group.unmapped, topic)) err("conflicting-mapping", at);
    if (!book) { err("unknown-book", { ...at, bookKey }); continue; }
    if (!OFFICIAL_PDF.test(book.viewUrl) || !OFFICIAL_PDF.test(book.downloadUrl)) err("non-official-book-url", { ...at, url: book.viewUrl });
    if (!Number.isInteger(pdfPage) || pdfPage < 1 || !Number.isInteger(pdfPageEnd) || pdfPageEnd < pdfPage) err("invalid-page-range", { ...at, pdfPage, pdfPageEnd });
    else if (pdfPageEnd - pdfPage + 1 > maxSpan) err("page-range-too-long", { ...at, pdfPage, pdfPageEnd });
    if (!normalizePdfText(heading)) err("missing-verified-heading", at);
    if (!group.books.includes(bookKey)) err("book-not-linked-to-subject", { ...at, bookKey });
    // Curriculum numbering ("ΔΙΔΑΚΤΙΚΗ ΕΝΟΤΗΤΑ N") is not the book's: only guidance-cited ranges.
    if (/^(?:ΔΙΔΑΚΤΙΚΗ\s+ΕΝΟΤΗΤΑ|Διδακτική\s+ενότητα)\s+\d+\s*$/i.test(topic) && unit[4] !== "guidance-pages") err("curriculum-unit-mapped-by-number", { ...at, method: unit[4] });
    // Another grade's book is allowed only when the official guidance assigns it; list for review.
    if (book.inventoryGrade !== group.grade) warn("book-from-other-grade", { ...at, book: book.title, bookGrade: book.inventoryGrade });
  }
}

// 2. AI Study curriculum ↔ catalog -----------------------------------------------------------
const studyKeys = new Set();
const studySubjects = new Set();
for (const r of rows) {
  studySubjects.add(r.subjectId);
  const group = EPAL.getGroup(r.subjectId);
  const where = { grade: r.grade, sector: r.sectorSelection, specialty: r.specialtySelection, subjectId: r.subjectId, subject: r.subjectLabel };
  if (!group) { err("subject-not-in-catalog", where); continue; }
  if (group.grade !== r.grade) err("wrong-grade", where);
  if (r.sectorSelection && group.sectorIds.length && !group.sectorIds.includes(r.sectorSelection)) err("wrong-sector", where);
  if (r.specialtySelection && group.specialtyIds.length && !group.specialtyIds.includes(r.specialtySelection)) err("wrong-specialty", where);
  if (r.sector && !group.sectors.includes(r.sector)) err("wrong-sector", { ...where, catalogSectors: group.sectors });
  if (r.specialty && !group.specialties.includes(r.specialty)) err("wrong-specialty", { ...where, catalogSpecialties: group.specialties });
  for (const t of r.topics) {
    if (t.customTitle) continue;
    studyKeys.add(r.subjectId + "\u0000" + t.label);
    const state = EPAL.status(r.subjectId, t.label);
    if (!state.known) err("unit-not-in-catalog", { ...where, topic: t.label });
  }
}
for (const group of EPAL.groups) {
  for (const id of group.subjectIds) if (!studySubjects.has(id)) err("stale-subject", { subjectId: id, subject: group.subjectLabel });
  for (const topic of [...Object.keys(group.units), ...Object.keys(group.unmapped)]) {
    if (!group.subjectIds.some((id) => studyKeys.has(id + "\u0000" + topic))) {
      // Free-text placeholders are not listed as units.
      if (!/^Γράψε τον ακριβή τίτλο/.test(topic)) err("stale-unit", { grade: group.grade, subject: group.subjectLabel, topic });
    }
  }
}

// 3. Coverage summary --------------------------------------------------------------------------
const unitRows = [];
for (const group of EPAL.groups) {
  for (const topic of Object.keys(group.units)) unitRows.push({ group, topic, mapped: true, reason: "" });
  for (const [topic, reason] of Object.entries(group.unmapped)) unitRows.push({ group, topic, mapped: false, reason });
}
const isUnit = (u) => !/^(?:free-text-input|not-a-unit)/.test(u.reason);
const units = unitRows.filter(isUnit);
const byReason = {};
for (const u of units.filter((x) => !x.mapped)) byReason[u.reason] = (byReason[u.reason] || 0) + 1;
const subjectsWithUnits = EPAL.groups.filter((g) => Object.keys(g.units).length || Object.values(g.unmapped).some((r) => !/^(?:free-text-input|not-a-unit)/.test(r)));
const summary = {
  grades: [...new Set(rows.map((r) => r.grade))].length,
  sectors: catalog.getSectors().length,
  specialties: catalog.getSpecialties().length,
  aiStudySubjectIds: studySubjects.size,
  subjects: EPAL.groups.length,
  subjectsWithOfficialBook: EPAL.groups.filter((g) => g.status === "official-books-linked").length,
  subjectsWithoutEbooksSource: EPAL.groups.filter((g) => g.status !== "official-books-linked").map((g) => `${g.grade}|${g.subjectLabel}`),
  units: units.length,
  mappedUnits: units.filter((u) => u.mapped).length,
  unmappedUnits: units.filter((u) => !u.mapped).length,
  unmappedByReason: byReason,
  freeTextSubjects: unitRows.filter((u) => u.reason === "free-text-input").length,
  scopeOrFragmentRows: unitRows.filter((u) => /^not-a-unit/.test(u.reason)).length,
  books: Object.keys(EPAL.books).length,
  subjectsWithUnits: subjectsWithUnits.length,
  errors: errors.length,
  warnings: warnings.length
};

// 4. Optional full text check against cached official PDFs (EPAL_PDF_CACHE, see
//    extract-pdf-pages.mjs): the same heading / minimum-text rule the runtime applies.
if (args.includes("--text") && process.env.EPAL_PDF_CACHE) {
  const { readPages } = await import("./extract-pdf-pages.mjs");
  let checked = 0;
  for (const group of EPAL.groups) {
    for (const [topic, [bookKey, pdfPage, pdfPageEnd, heading]] of Object.entries(group.units)) {
      const book = EPAL.books[bookKey];
      const doc = book && readPages(book.downloadUrl);
      if (!doc) { warn("pdf-not-cached", { subject: group.subjectLabel, topic }); continue; }
      checked++;
      const first = normalizePdfText(doc.pages[pdfPage - 1]?.t || "");
      if (!first.includes(normalizePdfText(heading))) err("heading-not-on-start-page", { grade: group.grade, subject: group.subjectLabel, topic, pdfPage, heading });
      const text = doc.pages.slice(pdfPage - 1, pdfPageEnd + 1).map((p) => p.t).join("\n\n");
      if (text.length < 250) err("too-little-official-text", { grade: group.grade, subject: group.subjectLabel, topic, chars: text.length });
      if (pdfPageEnd > doc.numPages) err("page-out-of-range", { grade: group.grade, subject: group.subjectLabel, topic, pdfPageEnd, numPages: doc.numPages });
    }
  }
  summary.textChecked = checked;
}

// 5. Optional live check through the real endpoint handler -------------------------------------
const live = [];
if (liveCount > 0) {
  const handler = require(path.join(ROOT, "api/schoolbook-source.js"));
  const mapped = unitRows.filter((u) => u.mapped);
  const pick = [];
  for (const grade of ["a", "b", "c"]) {
    const pool = mapped.filter((u) => u.group.grade === grade);
    for (let k = 0; k < Math.ceil(liveCount / 3) && pool.length; k++) pick.push(pool[Math.floor((k + 0.5) * pool.length / Math.ceil(liveCount / 3))]);
  }
  for (const u of pick.slice(0, liveCount)) {
    let code = 0, body = null;
    const res = { setHeader() {}, status(c) { code = c; return this; }, json(b) { body = b; return b; } };
    await handler({ method: "GET", headers: {}, query: { subject: u.group.subjectIds[0], topic: u.topic, schoolType: "epal", grade: u.group.grade } }, res);
    live.push({ grade: u.group.grade, subject: u.group.subjectLabel, topic: u.topic, status: code, grounded: !!body?.grounded, book: body?.bookTitle, pages: body?.pdfPage + "-" + body?.pdfPageEnd, chars: (body?.text || "").length, error: body?.error || "" });
    if (!body?.grounded) err("live-not-grounded", { grade: u.group.grade, subject: u.group.subjectLabel, topic: u.topic, error: body?.error });
  }
  summary.liveChecked = live.length;
  summary.liveGrounded = live.filter((x) => x.grounded).length;
}

const report = { summary, errors, warnings, live };
if (asJson) console.log(JSON.stringify(report, null, 1));
else {
  console.log("EPAL_SCHOOLBOOK_VALIDATION=" + JSON.stringify(summary));
  for (const e of errors.slice(0, 40)) console.log("ERROR", JSON.stringify(e));
  if (errors.length > 40) console.log(`… ${errors.length - 40} more errors`);
  for (const l of live) console.log("LIVE", JSON.stringify(l));
}
if (process.env.EPAL_VALIDATION_OUT) fs.writeFileSync(process.env.EPAL_VALIDATION_OUT, JSON.stringify(report, null, 1));
process.exit(errors.length ? 1 : 0);
