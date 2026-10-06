// Builds epal-schoolbook-catalog-2026-2027.js — the EPAL (ΕΠΑΛ) AI Study → official
// schoolbook mapping consumed by api/schoolbook-source.js.
//
// Evidence chain for every mapped unit:
//   1. The AI Study EPAL unit (grade / sector / specialty / subject / unit) is read from the
//      same browser catalog that study.html uses (scripts/epal/lib.mjs).
//   2. Candidate books = official ebooks.edu.gr student books that the official inventory
//      assigns to the SAME course in the SAME EPAL grade (ebooks-epal-inventory.json).
//   3. The unit's chapter heading must be found on the start page of the official PDF
//      (scripts/epal/locate.mjs, same normalisation as the runtime extractor).
// Units that cannot satisfy all three are left unmapped and listed in the report.
//
// Usage: EPAL_PDF_CACHE=<dir> node scripts/epal/build-epal-schoolbook-catalog.mjs [--report-only]
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadEpalStudentCatalog, enumerateStudyRows, normalizeTitle, normalizePdfText, isStudentBook } from "./lib.mjs";
import { candidateBooks, guidanceUnitSpec, NO_OFFICIAL_TEXTBOOK } from "./subject-courses.mjs";
import { readPages } from "./extract-pdf-pages.mjs";
import { bookIndex, locate, locateGuidedRange, parseTopicLabel, MAX_SPAN, FALLBACK_KINDS } from "./locate.mjs";

const REPORT_ONLY = process.argv.includes("--report-only");
const inventoryDoc = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/epal/ebooks-epal-inventory.json"), "utf8"));
const inventory = inventoryDoc.books;
const { catalog, guidance } = loadEpalStudentCatalog();
const rows = enumerateStudyRows(catalog);

// Units that are not a selectable section of a book.
function nonUnitReason(label) {
  const s = String(label || "").trim();
  if (/^Επίσημη έκταση/.test(s)) return "official-scope-statement";
  if (/^(?:Κεφάλαια?\s*[–—/-]\s*Ενότητες|Κεφάλαιο\/Ενότητες|Κεφάλαια – Ενότητες|Κεφαλαίου\s+\d+\.?|ΚΕΦΑΛΑΙΟ\s*[–—-]\s*ΕΝΟΤΗΤΑ|Κεφάλαιο\/Ενότητες\/Παράγραφοι)$/i.test(s)) return "table-header-fragment";
  // Sentence fragments split out of the guidance tables (start mid-sentence, lowercase).
  if (/^[a-zα-ωάέήίόύώϊϋΐΰ(),.]/.test(s)) return "guidance-text-fragment";
  // Several chapters in one row ("Κεφάλαια 1-8", "Κεφάλαια 1ο, 2ο 3ο, 4ο: …") are a scope, not one unit.
  if (/^Κεφάλαια\s+\d/.test(s) || /^Μέρος\s+\S+\s+.*Κεφάλαια\s+\d/i.test(s)) return "multi-chapter-scope";
  return "";
}

// The official ΙΕΠ 2026–27 guidance often names the exact book(s): «ΤΙΤΛΟΣ» or "ΒΙΒΛΙΟ: ΤΙΤΛΟΣ".
function scopeBookTitles(subjectLabel) {
  const rec = guidance?.get?.(subjectLabel) || null;
  const text = String(rec?.scope || "");
  return [
    ...[...expandAbbreviations(text).matchAll(/«([^»]{3,120})»/g)].map((m) => m[1]),
    ...[...text.matchAll(/ΒΙΒΛΙΟ\s*\d?\s*:\s*([Α-ΩΆ-Ώ][Α-ΩΆ-Ώ\s\-–]{3,80}?)(?=\s+[Α-ΩΆ-Ώ]΄|\s+(?:ΔΙΔΑΚΤΙΚΗ|Κεφ)|$)/g)].map((m) => m[1])
  ].map((t) => normalizeTitle(t)).filter((t) => t.split(" ").length >= 1 && t.length >= 6);
}

// Student books (any EPAL grade) whose title is named by the course's official guidance.
function scopeNamedBooks(titles) {
  if (!titles.length) return [];
  return inventory.filter((b) => isStudentBook(b) && b.grade !== "gym-c" && titles.some((t) => {
    const w = normalizeTitle(b.work);
    return w === t || (t.startsWith(w + " ") && w.split(" ").length >= 2);
  }));
}

// A unit label may name its book explicitly ("Άλγεβρα — …", "Χημεία Α΄ Λυκείου, Κεφάλαιο 4 …").
// The named book is then required; it may come from another EPAL grade's official list when
// the official guidance assigns an earlier-grade book (e.g. Β΄ ΕΠΑΛ Χημεία uses Χημεία Α΄ Λυκείου).
const GRADE_FILE_TAG = { "α": /_A-|_A-B-|_A-B-G-/i, "β": /_B-|_A-B-|_B-G-|_A-B-G-/i, "γ": /_G-|_B-G-|_A-B-G-/i };
const expandAbbreviations = (text) => String(text || "").replace(/(^|[\s«])ΜΕΚ(?=\s|$|»)/g, "$1Μηχανές Εσωτερικής Καύσης");

function hintedBooks(hint, pool) {
  if (!hint) return [];
  hint = expandAbbreviations(hint);
  const words = normalizeTitle(hint).split(" ").filter((w) => w.length > 2 && !["λυκειου", "επαλ", "τομοσ"].includes(w));
  // A trailing volume numeral ("ΜΕΚ Ι", "… ΙΙ") must match the book's numeral.
  const numeral = (normalizeTitle(hint).match(/\s(i{1,3}|ii)$/) || [])[1] || "";
  const gradeMatch = normalizeTitle(hint).match(/(?:^|\s)(α|β|γ)\s+λυκειου/);
  const volume = normalizeTitle(hint).match(/τομοσ\s+(α|β|γ)/);
  return pool.filter((b) => {
    const title = normalizeTitle(b.work).split(" ");
    const stemOk = words.every((w) => title.some((t) => t.slice(0, 5) === w.slice(0, 5)));
    if (!volume && !stemOk) return false;
    if (numeral && title[title.length - 1] !== numeral && !new RegExp(`-${numeral.toUpperCase()}_`, "i").test(b.file)) return false;
    if (gradeMatch && !GRADE_FILE_TAG[gradeMatch[1]].test(b.file)) return false;
    if (gradeMatch && !/Lykeiou/i.test(b.file)) return false;
    if (volume && !new RegExp(`ΤΟΜΟΣ\\s+${volume[1].toUpperCase()}|Tomos-${({ α: "A", β: "B", γ: "G" })[volume[1]]}`, "i").test(b.work + " " + b.file)) return false;
    return true;
  });
}

const indexCache = new Map();
function indexFor(book, kind) {
  const key = book.downloadUrl + "|" + kind;
  if (indexCache.has(key)) return indexCache.get(key);
  const doc = readPages(book.downloadUrl);
  const value = doc ? { idx: bookIndex(doc.pages, kind), numPages: doc.numPages, cache: {} } : null;
  indexCache.set(key, value);
  return value;
}

const bookKey = (b) => b.manifestationId.replace("/", "-");
// Scanned official PDFs without a text layer cannot be grounded (no OCR at runtime).
const textless = (book) => {
  const ix = indexFor(book, "chapter");
  if (!ix) return false;
  const chars = ix.idx.pages.reduce((n, p) => n + String(p.t || "").trim().length, 0);
  return chars / Math.max(1, ix.idx.pages.length) < 40;
};

const usedBooks = new Map();
const topicRecords = [];
const subjectRecords = new Map();
const missingPdf = new Set();

const bySubjectLabel = new Map();
for (const r of rows) {
  const k = r.grade + "|" + r.subjectLabel;
  if (!bySubjectLabel.has(k)) bySubjectLabel.set(k, { grade: r.grade, label: r.subjectLabel, rows: [] });
  bySubjectLabel.get(k).rows.push(r);
}

for (const [key, group] of bySubjectLabel) {
  const { grade, label } = group;
  const cand = candidateBooks(inventory, grade, label);
  const scopeTitles = scopeBookTitles(label);
  {
    const named = scopeNamedBooks(scopeTitles).filter((b) => !cand.books.some((x) => x.downloadUrl === b.downloadUrl));
    const unique = [...new Map(named.map((b) => [b.downloadUrl, b])).values()];
    if (unique.length) { cand.books = [...cand.books, ...unique]; cand.guidanceNamed = unique.map((b) => b.file); }
  }
  const noBook = NO_OFFICIAL_TEXTBOOK[label] || "";
  const subj = {
    grade, label,
    course: cand.course,
    officialCourses: cand.matchedCourses,
    subjectIds: [...new Set(group.rows.map((r) => r.subjectId))].sort(),
    sectors: [...new Set(group.rows.map((r) => r.sector).filter(Boolean))].sort(),
    specialties: [...new Set(group.rows.map((r) => r.specialty).filter(Boolean))].sort(),
    // Selector values under which AI Study shows this subject (general subjects appear under all).
    specialtyIds: [...new Set(group.rows.map((r) => r.specialtyId).filter(Boolean))].sort(),
    sectorIds: [...new Set(group.rows.map((r) => r.sectorSelection).filter(Boolean))].sort(),
    candidateBooks: cand.books.map(bookKey),
    guidanceNamedBooks: cand.guidanceNamed || undefined,
    status: cand.books.length ? "official-books-linked" : (noBook ? "no-official-textbook" : "no-ebooks-source"),
    note: noBook || (cand.books.length ? "" : "Το μάθημα δεν αντιστοιχίζεται σε βιβλίο μαθητή ΕΠΑΛ της ίδιας τάξης στο ebooks.edu.gr.")
  };
  subjectRecords.set(key, subj);

  const topics = new Map();
  for (const r of group.rows) for (const t of r.topics) if (!topics.has(t.label)) topics.set(t.label, t);

  // «Μέρος πρώτο / δεύτερο …» rows give the part of the following chapter rows.
  const PART_WORDS = { "πρώτο": 1, "πρωτο": 1, "α": 1, "1ο": 1, "δεύτερο": 2, "δευτερο": 2, "β": 2, "2ο": 2, "τρίτο": 3, "τριτο": 3, "γ": 3, "3ο": 3 };
  let currentPart = 0;
  let lastNumber = 0;
  let lastBookKey = "";
  for (const [topicLabel, t] of topics) {
    const rec = { grade, subjectLabel: label, topic: topicLabel, subjectIds: subj.subjectIds };
    const partRow = String(topicLabel).match(/^Μέρος\s+([^\s\-–—:,΄']+)/i);
    if (partRow) currentPart = PART_WORDS[partRow[1].toLowerCase()] || currentPart;
    if (t.customTitle) { topicRecords.push({ ...rec, status: "free-text-input" }); continue; }
    const nonUnit = nonUnitReason(topicLabel);
    if (nonUnit) { topicRecords.push({ ...rec, status: "not-a-unit", reason: nonUnit }); continue; }
    if (!cand.books.length) { topicRecords.push({ ...rec, status: "unmapped", reason: subj.status }); continue; }

    const parsedLabel = parseTopicLabel(topicLabel);
    // In the official ordered tables a chapter number that drops back (…16, 1, 2) starts the
    // next part of a multi-part book. Only used when the book itself restarts its numbering.
    if (parsedLabel.number && !parsedLabel.section) {
      if (parsedLabel.number < lastNumber) currentPart = Math.max(currentPart, 1) + 1;
      lastNumber = parsedLabel.number;
    }
    if (partRow) lastNumber = 0;
    const parsed = { ...parsedLabel, part: currentPart || 1 };
    let books = cand.books;
    if (parsed.bookHint) {
      const inGrade = (() => {
        const fromCourse = hintedBooks(parsed.bookHint, cand.books);
        return fromCourse.length ? fromCourse : hintedBooks(parsed.bookHint, inventory.filter((b) => b.grade === grade && isStudentBook(b)));
      })();
      // Another grade's book only when the label names that grade explicitly ("Χημεία Α΄ Λυκείου").
      const namesGrade = /(?:^|\s)(?:Α|Β|Γ)΄\s+Λυκείου/.test(parsed.bookHint);
      const anyGrade = inGrade.length || !namesGrade ? inGrade : hintedBooks(parsed.bookHint, inventory.filter(isStudentBook));
      const unique = [...new Map(anyGrade.map((b) => [b.downloadUrl, b])).values()];
      if (!unique.length) { topicRecords.push({ ...rec, status: "unmapped", reason: "named-book-not-in-official-epal-inventory", parsed }); continue; }
      books = unique;
    }
    // Curriculum units ("ΔΙΔΑΚΤΙΚΗ ΕΝΟΤΗΤΑ N") never map by number to a book chapter: only
    // through the chapter/paragraphs the official guidance cites for that unit.
    if (parsed.kind === "curriculum-unit" && !parsed.title) {
      const spec = guidanceUnitSpec(grade, label, parsed.number);
      const book = spec?.book && books.find((b) => spec.book.test(b.file));
      if (!spec || spec.uncited || !book) {
        topicRecords.push({ ...rec, status: "unmapped", reason: spec?.uncited ? "guidance-cites-no-book-section" : "curriculum-unit-without-guidance-citation", note: spec?.uncited || undefined, parsed });
        continue;
      }
      const ix = indexFor(book, "chapter");
      if (!ix) { missingPdf.add(book.downloadUrl); topicRecords.push({ ...rec, status: "unmapped", reason: "official-pdf-not-loaded", parsed }); continue; }
      const loc = locateGuidedRange(ix.idx, spec);
      if (!loc.ok) { topicRecords.push({ ...rec, status: "unmapped", reason: "heading-not-found-in-official-books", detail: loc.reason, parsed }); continue; }
      usedBooks.set(bookKey(book), book);
      lastBookKey = bookKey(book);
      topicRecords.push({ ...rec, status: "mapped", book: bookKey(book), pdfPage: loc.pdfPage, pdfPageEnd: loc.pdfPageEnd, heading: loc.heading, method: loc.method, confidence: loc.confidence, guidanceCitation: `${spec.citedBook}, ${spec.cite}`, rangeCapped: loc.capped || undefined });
      continue;
    }
    const results = [];
    for (const book of books) {
      for (const kind of [parsed.kind, ...(FALLBACK_KINDS[parsed.kind] || [])]) {
        const ix = indexFor(book, kind);
        if (!ix) { missingPdf.add(book.downloadUrl); break; }
        const loc = locate(ix.idx, { ...parsed, kind }, ix.cache);
        if (loc.ok) {
          // A fallback numbering scheme must be confirmed by the unit title.
          if (kind !== parsed.kind && !["marker+title", "title-run"].includes(loc.method)) continue;
          results.push({ book, loc: { ...loc, numbering: kind } });
          break;
        }
      }
    }
    if (!results.length) {
      const reason = books.every(textless) ? "official-pdf-without-text-layer" : "heading-not-found-in-official-books";
      topicRecords.push({ ...rec, status: "unmapped", reason, parsed });
      continue;
    }
    const titled = (x) => !["marker", "section-numbering"].includes(x.loc.method);
    const score = (x) =>
      (x.loc.confidence === "high" ? 100 : (x.loc.confidence === "medium" ? 50 : 20)) +
      (titled(x) ? 30 : 0) +
      (scopeTitles.includes(normalizeTitle(x.book.work)) ? 20 : 0) +
      (/Vivlio-Mathiti/i.test(x.book.file) ? 5 : 0) +
      (x.loc.method === "marker+title" ? 3 : 0);
    results.sort((a, b) => score(b) - score(a));
    let best = results[0];
    let rivals = results.filter((x) => x !== best && score(x) === score(best));
    if (rivals.length) {
      // Documented tie-breakers between equally good official books, in order:
      const tied = [best, ...rivals];
      const workbook = (b) => /Tetradio|Fakelos-Ylikou|Lyseis/i.test(b.file);
      const pickers = [
        // 1. the main student book over its workbook;
        () => tied.filter((x) => !workbook(x.book)),
        // 2. after the official list restarts its numbering, the n-th book the guidance names;
        () => (parsed.part >= 2 && scopeTitles[parsed.part - 1]
          ? tied.filter((x) => normalizeTitle(x.book.work) === scopeTitles[parsed.part - 1])
          : []),
        // 3. the book of the previous unit of the same course (official lists run book by book).
        () => tied.filter((x) => bookKey(x.book) === lastBookKey)
      ];
      for (const pick of pickers) {
        const chosen = pick();
        if (chosen.length === 1) { best = chosen[0]; rivals = []; break; }
      }
    }
    // No unit title to tell books apart → only safe when a single official book is possible.
    const untitledAmbiguous = !titled(best) && books.length > 1 && !scopeTitles.includes(normalizeTitle(best.book.work));
    if (rivals.length || untitledAmbiguous) {
      topicRecords.push({ ...rec, status: "unmapped", reason: "ambiguous-between-official-books", candidates: results.map((x) => bookKey(x.book)), parsed });
      continue;
    }
    usedBooks.set(bookKey(best.book), best.book);
    lastBookKey = bookKey(best.book);
    topicRecords.push({
      ...rec,
      status: "mapped",
      book: bookKey(best.book),
      pdfPage: best.loc.pdfPage,
      pdfPageEnd: best.loc.pdfPageEnd,
      heading: best.loc.heading,
      method: best.loc.method,
      confidence: best.loc.confidence,
      rangeCapped: best.loc.capped || undefined,
      bookOutsideGrade: best.book.grade !== grade || undefined
    });
  }
}

// Post-pass: a unit ends before the next mapped unit (of any EPAL subject) or chapter start in
// the same book, so a lone chapter-opener page never swallows the following chapter.
{
  const startsByBook = new Map();
  const k = (t) => t.book + "|" + t.grade + "|" + t.subjectLabel;
  for (const t of topicRecords) if (t.status === "mapped" && t.method !== "section") {
    if (!startsByBook.has(k(t))) startsByBook.set(k(t), new Set());
    startsByBook.get(k(t)).add(t.pdfPage);
  }
  const chapterStarts = new Map();
  for (const key of startsByBook.keys()) {
    const book = inventory.find((b) => bookKey(b) === key.split("|")[0]);
    const ix = book && indexFor(book, "chapter");
    chapterStarts.set(key, (ix?.cache?.starts || []).map((x) => ({ n: x.n, page: x.idx + 1 })));
  }
  for (const t of topicRecords) if (t.status === "mapped" && !t.guidanceCitation && startsByBook.has(k(t))) {
    const own = parseTopicLabel(t.topic).number;
    const pagesAfter = [...startsByBook.get(k(t)), ...chapterStarts.get(k(t)).filter((x) => x.n !== own).map((x) => x.page)];
    const next = pagesAfter.filter((p) => p > t.pdfPage).sort((a, b) => a - b)[0];
    // Ending at the next unit/chapter start means the whole unit fits: no longer capped.
    if (next && next - 1 <= t.pdfPageEnd) { t.pdfPageEnd = Math.max(t.pdfPage, next - 1); t.rangeCapped = undefined; }
  }
}

const count = (st) => topicRecords.filter((t) => t.status === st).length;
const summary = {
  grades: new Set(rows.map((r) => r.grade)).size,
  sectors: catalog.getSectors().length,
  specialties: catalog.getSpecialties().length,
  subjectIds: new Set(rows.map((r) => r.subjectId)).size,
  subjectLabels: bySubjectLabel.size,
  topics: topicRecords.length,
  mapped: count("mapped"),
  unmapped: count("unmapped"),
  freeText: count("free-text-input"),
  notAUnit: count("not-a-unit"),
  missingPdf: missingPdf.size,
  books: usedBooks.size
};
console.log("EPAL_SCHOOLBOOK_BUILD=" + JSON.stringify(summary));

const reportPath = path.join(process.env.EPAL_REPORT_DIR || path.join(ROOT, ".cache"), "epal-build-report.json");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify({ summary, subjects: [...subjectRecords.values()], topics: topicRecords, missingPdf: [...missingPdf] }, null, 1));
console.log("report -> " + reportPath);
if (REPORT_ONLY) process.exit(0);

// ---------------------------------------------------------------------------------------------
// Runtime module: epal-schoolbook-catalog-2026-2027.js (consumed by api/schoolbook-source.js)
// ---------------------------------------------------------------------------------------------
const bookOut = {};
for (const [key, b] of usedBooks) {
  bookOut[key] = {
    title: b.work,
    workId: b.workId,
    manifestationId: b.manifestationId,
    viewUrl: b.viewUrl,
    downloadUrl: b.downloadUrl,
    officialCourses: b.courses,
    inventoryGrade: b.grade
  };
}
const groups = [];
for (const subj of subjectRecords.values()) {
  const units = {};
  const unmapped = {};
  for (const t of topicRecords) {
    if (t.grade !== subj.grade || t.subjectLabel !== subj.label) continue;
    // 7th field: 1 when the range was cut at maxPdfSpan (the unit continues past pdfPageEnd).
    if (t.status === "mapped") units[t.topic] = [t.book, t.pdfPage, t.pdfPageEnd, t.heading, t.method, t.confidence, t.rangeCapped ? 1 : 0];
    else unmapped[t.topic] = t.status === "unmapped" ? t.reason : t.status + (t.reason ? ":" + t.reason : "");
  }
  groups.push({
    grade: subj.grade,
    subjectLabel: subj.label,
    course: subj.course,
    officialCourses: subj.officialCourses,
    sectors: subj.sectors,
    specialties: subj.specialties,
    specialtyIds: subj.specialtyIds,
    sectorIds: subj.sectorIds,
    subjectIds: subj.subjectIds,
    // Official books this subject may use: its course books plus any book a unit label or the
    // ΙΕΠ guidance names explicitly (only those actually used by a unit are emitted).
    books: [...new Set([...subj.candidateBooks, ...Object.values(units).map((u) => u[0])])].filter((k) => bookOut[k]),
    status: subj.status,
    note: subj.note || undefined,
    units,
    unmapped
  });
}
const data = {
  schema: "aitools4kids.epal-schoolbook-catalog/1",
  schoolYear: "2026-2027",
  generatedAt: new Date().toISOString().slice(0, 10),
  maxPdfSpan: MAX_SPAN,
  sources: {
    inventory: inventoryDoc.source,
    inventoryFetchedAt: inventoryDoc.fetchedAt,
    guidanceHub: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-epa-l-gia-to-scholiko-etos-2026-2027/"
  },
  summary,
  books: bookOut,
  groups
};
const moduleSource = `// AUTO-GENERATED by scripts/epal/build-epal-schoolbook-catalog.mjs — do not edit by hand.
// EPAL_BOOK_CATALOG: ΕΠΑΛ AI Study unit → official ebooks.edu.gr schoolbook PDF section.
// Every unit maps to a student book that ebooks.edu.gr (ΙΤΥΕ «Διόφαντος») assigns to the same
// course and EPAL grade (or that the ΙΕΠ 2026–27 guidance names), plus a start page whose heading
// was verified with the runtime normaliser. The heading is re-checked on every live request.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AITOOLSKIDS_EPAL_BOOK_CATALOG = api;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";
  const DATA = ${JSON.stringify(data)};
  const clean = (value) => String(value == null ? "" : value).replace(/\\s+/g, " ").trim();
  const bySubjectId = new Map();
  for (const group of DATA.groups) for (const id of group.subjectIds) bySubjectId.set(id, group);

  function isEpalSubjectId(subjectId) {
    return /^epal-[abc]-/.test(clean(subjectId));
  }

  function getGroup(subjectId) {
    return bySubjectId.get(clean(subjectId)) || null;
  }

  // Exact (whitespace-normalised) AI Study unit label → mapping, or null.
  function get(subjectId, topic) {
    const group = getGroup(subjectId);
    if (!group) return null;
    const label = clean(topic);
    const key = Object.prototype.hasOwnProperty.call(group.units, label)
      ? label
      : Object.keys(group.units).find((k) => clean(k) === label);
    if (!key) return null;
    const [bookKey, pdfPage, pdfPageEnd, heading, method, confidence, capped] = group.units[key];
    const book = DATA.books[bookKey];
    if (!book) return null;
    return Object.freeze({
      schoolType: "epal",
      grade: group.grade,
      subjectLabel: group.subjectLabel,
      course: group.course,
      sectors: group.sectors.slice(),
      specialties: group.specialties.slice(),
      specialtyIds: group.specialtyIds.slice(),
      sectorIds: group.sectorIds.slice(),
      topic: key,
      bookKey,
      bookTitle: book.title,
      viewUrl: book.viewUrl,
      downloadUrl: book.downloadUrl,
      pdfPage,
      pdfPageEnd,
      heading,
      method,
      confidence,
      rangeCapped: capped === 1
    });
  }

  // Why a unit is not mapped (for honest error messages and the validator).
  function status(subjectId, topic) {
    const group = getGroup(subjectId);
    if (!group) return { known: false, mapped: false, reason: "subject-not-in-epal-catalog" };
    const label = clean(topic);
    if (get(subjectId, label)) return { known: true, mapped: true, reason: "" };
    const key = Object.keys(group.unmapped).find((k) => clean(k) === label);
    return { known: !!key, mapped: false, reason: key ? group.unmapped[key] : "topic-not-in-epal-catalog", subjectStatus: group.status };
  }

  return Object.freeze({
    schema: DATA.schema,
    schoolYear: DATA.schoolYear,
    generatedAt: DATA.generatedAt,
    maxPdfSpan: DATA.maxPdfSpan,
    sources: DATA.sources,
    summary: DATA.summary,
    books: DATA.books,
    groups: DATA.groups,
    isEpalSubjectId,
    getGroup,
    get,
    status
  });
});
`;
fs.writeFileSync(path.join(ROOT, "epal-schoolbook-catalog-2026-2027.js"), moduleSource);
console.log("module -> epal-schoolbook-catalog-2026-2027.js (" + (moduleSource.length / 1024).toFixed(0) + " KB)");

export { topicRecords, subjectRecords, usedBooks, summary, MAX_SPAN, normalizePdfText };
