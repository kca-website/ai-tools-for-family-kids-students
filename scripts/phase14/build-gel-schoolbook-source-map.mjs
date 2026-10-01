// Phase 14 generator: builds gel-schoolbook-source-map-2026-2027.js
//
//   node scripts/phase14/build-gel-schoolbook-source-map.mjs [--out <file>] [--dump <report.json>]
//
// Inputs : scripts/phase14/gel-registry.mjs               (hand-curated books + official evidence)
//          scripts/phase14/gel-site-topics-snapshot.json  (the 40 Lyceum subjects exposed by the site)
//          ebooks.edu.gr REST catalog + the book pages themselves (fetched live)
// Output : gel-schoolbook-source-map-2026-2027.js         (standalone data file; no runtime changes)
//
// Fail-closed rules:
//   * A topic is "exact-html" only when its section number (or its complete title) is found as a real
//     heading inside the official ebooks.edu.gr HTML book that the registry proved for that subject.
//   * A numbered topic additionally needs a title overlap with the book heading (guards wrong chapters).
//   * Anything else is "needs-manual-review" (candidates are listed but never promoted) or
//     "no-safe-mapping". Nothing is matched by position, similarity ranking alone, or guessing.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import {
  parseOptions, buildBookEntries, splitNumber, stripNote, stripChapterPrefix, normNum,
  titleKey, overlap, sharedWords, officialEbooksUrl
} from "./lib.mjs";
import { SOURCE_DOCS, SUBJECT_REGISTRY } from "./gel-registry.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const args = process.argv.slice(2);
const argVal = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(ROOT, argVal("--out", "gel-schoolbook-source-map-2026-2027.js"));
const DUMP = argVal("--dump", null);
const CACHE = argVal("--cache", null); // optional on-disk response cache (speeds up re-runs; never used for CI)
if (CACHE) fs.mkdirSync(CACHE, { recursive: true });
const cacheFile = (key) => CACHE && path.join(CACHE, createHash("sha1").update(key).digest("hex"));

const UA = "aitools4kids-phase14-audit/1.0 (+https://www.aitools4kids.gr)";
const NUMBER_OVERLAP_MIN = 0.5;   // numbered topic: heading title must share >= 50% of the shorter title's stems
const CANDIDATE_OVERLAP_MIN = 0.75;

// ---------------------------------------------------------------- network helpers
async function get(url, tries = 3) {
  const cf = cacheFile(url);
  if (cf && fs.existsSync(cf)) return JSON.parse(fs.readFileSync(cf, "utf8"));
  const res = await getLive(url, tries);
  if (cf) fs.writeFileSync(cf, JSON.stringify(res));
  return res;
}
async function getLive(url, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      const buf = Buffer.from(await r.arrayBuffer());
      return { status: r.status, text: buf.toString("utf8") };
    } catch (e) { last = e; await new Promise((res) => setTimeout(res, 400 * (i + 1))); }
  }
  throw last;
}

async function catalogFor(grade, onlyStatus1) {
  const q = new URLSearchParams();
  q.append("query_field[]", "course.lom.classification-grade");
  q.append("query_op[]", "equals");
  q.append("query_val[]", grade);
  if (onlyStatus1) {
    q.append("query_field[]", "manifestation.lom.lifecycle-status");
    q.append("query_op[]", "equals");
    q.append("query_val[]", "1");
  }
  q.set("limit", "-1"); q.set("offset", "0"); q.set("expand", "all,metadata"); q.set("filters", "none");
  q.set("selected_columns", "m1.*");
  q.set("selected_elements", "'title','technical-location','relation-hasThumbnail','identifier'");
  q.set("selected_collections", "'course','work','expression','manifestation'");
  const url = "https://ebooks.edu.gr/ebooks/rest/get-items-info-2?" + q.toString();
  const cf = cacheFile(url);
  if (cf && fs.existsSync(cf)) return JSON.parse(fs.readFileSync(cf, "utf8"));
  const r = await fetch(url, { headers: { Accept: "application/json", "User-Agent": UA } });
  if (!r.ok) throw new Error("catalog " + grade + " HTTP " + r.status);
  const json = await r.json();
  if (cf) fs.writeFileSync(cf, JSON.stringify(json));
  return json;
}

async function loadCatalog() {
  const works = new Map(); // "8547/2364" -> {title, forms:[{expr, mh, url, status1, grades:Set}]}
  for (const grade of ["K10", "K11", "K12"]) {
    const [all, active] = await Promise.all([catalogFor(grade, false), catalogFor(grade, true)]);
    const activeUrls = new Set(active.map((x) => x.manifestation_view_url));
    for (const item of all) {
      const m = {};
      for (const kv of item.metadata) m[kv.key] = kv.value;
      const wh = m["work.dc.identifier.uri"];
      if (!wh) continue;
      if (!works.has(wh)) works.set(wh, { title: m["work.dc.title"], forms: new Map() });
      const w = works.get(wh);
      const mh = m["manifestation.dc.identifier.uri"];
      if (!w.forms.has(mh)) {
        w.forms.set(mh, {
          expr: m["expression.dc.title"], mh,
          url: "https://ebooks.edu.gr/ebooks" + item.manifestation_view_url,
          status1: activeUrls.has(item.manifestation_view_url), grades: new Set()
        });
      }
      w.forms.get(mh).grades.add(grade);
    }
  }
  return works;
}

function pickForms(work) {
  const forms = [...work.forms.values()].filter((f) => !/18pt|28pt/.test(f.expr || "") && !/\/retrieve\//.test(f.url));
  const rank = (f) => (f.status1 ? 0 : 1);
  const html = forms.filter((f) => /\/v\/html\//.test(f.url))
    .sort((a, b) => (/εμπλουτισμένη html/.test(b.expr) && !/μη εμπλ/.test(b.expr) ? 1 : 0) - (/εμπλουτισμένη html/.test(a.expr) && !/μη εμπλ/.test(a.expr) ? 1 : 0) || rank(a) - rank(b))[0] || null;
  const pdf = forms.filter((f) => /\/v\/pdf\//.test(f.url) && /pdf για web/.test(f.expr || "")).sort((a, b) => rank(a) - rank(b))[0] || null;
  return { html, pdf };
}

const kindOf = (f) => (/μη εμπλ/.test(f.expr) ? "html-apli" : "html-empl");

// ---------------------------------------------------------------- book pages
async function loadBookPages(htmlUrl) {
  const base = htmlUrl.endsWith("/") ? htmlUrl : htmlUrl + "/";
  const idx = await get(base + "index.html");
  const options = parseOptions(idx.text);
  const files = [...new Set(["index.html", ...options.map((o) => o.value)])];
  const pages = new Map([["index.html", idx.text]]);
  const queue = files.filter((f) => f !== "index.html");
  const failures = [];
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const f = queue.shift();
      try {
        const r = await get(base + f);
        if (r.status === 200) pages.set(f, r.text); else failures.push(f + ":" + r.status);
      } catch (e) { failures.push(f + ":" + e.message); }
    }
  }));
  return { base, options, pages, failures, entries: buildBookEntries(options, pages) };
}

// ---------------------------------------------------------------- topic mapping
function sectionDepthCount(entries, file) {
  const nums = new Set(entries.filter((e) => e.file === file && e.num && /^\d+\.\d+/.test(e.num)).map((e) => e.num));
  return nums.size;
}

// An anchor is only trusted as a per-section anchor when the same page carries >= 2 distinct anchors on
// numbered headings (e.g. pragmat1..pragmat4). A lone "#description"/"#one" is page chrome, not a section.
function trustedAnchor(book, e) {
  if (!e.anchor) return null;
  const anchors = new Set(book.entries.filter((x) => x.file === e.file && x.anchor && x.num).map((x) => x.anchor));
  return anchors.size >= 2 ? e.anchor : null;
}
function urlFor(book, e) {
  const a = trustedAnchor(book, e);
  return book.base + e.file + (a ? "#" + a : "");
}

function describe(book, e, extra = {}) {
  const dedicated = sectionDepthCount(book.entries, e.file) <= 1;
  return {
    work: book.work,
    url: urlFor(book, e),
    heading: ((e.num ? e.num + " " : "") + e.title).trim(),
    granularity: trustedAnchor(book, e) ? "section-anchor" : (dedicated ? "section-page" : "chapter-page"),
    ...extra
  };
}
// candidates are hints for a human reviewer only (never usable as grounding)
const hint = (book, e, score) => ({ work: book.work, url: urlFor(book, e), heading: ((e.num ? e.num + " " : "") + e.title).trim(), ...(score !== undefined ? { score } : {}) });

function mapTopic(topic, books) {
  const label = stripNote(topic.label);
  const sp = splitNumber(label);
  const num = normNum(sp.num);
  const numEnd = normNum(sp.numEnd);
  const title = sp.title;
  const out = { topicId: topic.id, label: topic.label };

  if (!books.length) return { ...out, status: "needs-manual-review", reason: "no-html-book" };

  const pickEntry = (bk, list) => {
    // prefer anchored in-page heading, then a dedicated non-index page, then anything
    const order = (e) => (e.anchor ? 0 : 1) * 2 + (e.src === "menu" ? 1 : 0);
    return [...list].sort((a, b) => order(a) - order(b))[0];
  };

  if (num) {
    const hits = [];
    for (const b of books) {
      const same = b.entries.filter((e) => e.num === num);
      if (!same.length) continue;
      // one candidate per file; keep the best representative
      const byFile = new Map();
      for (const e of same) byFile.set(e.file, [...(byFile.get(e.file) || []), e]);
      for (const list of byFile.values()) {
        const e = pickEntry(b, list);
        const sim = Math.max(...list.map((x) => overlap(title, x.title)));
        const eq = list.some((x) => titleKey(x.title) === titleKey(title));
        hits.push({ b, e, sim, eq, viaMenu: list.some((x) => x.src === "menu") });
      }
    }
    if (!hits.length) return { ...out, status: "no-safe-mapping", reason: "section-number-not-found-in-official-book", number: num };
    // The book front page (index.html) often re-lists the table of contents; ignore it when a real content page exists.
    const contentHits = hits.some((h) => h.e.file !== "index.html") ? hits.filter((h) => h.e.file !== "index.html") : hits;
    let good = contentHits.filter((h) => h.eq || h.sim >= NUMBER_OVERLAP_MIN);
    // If several pages carry the number, the page the book's own menu assigns to that number wins.
    if (good.length > 1 && good.filter((h) => h.viaMenu).length === 1) good = good.filter((h) => h.viaMenu);
    // A complete title equality beats looser overlaps in other books (e.g. same § number in two books).
    if (good.length > 1 && good.filter((h) => h.eq).length === 1) good = good.filter((h) => h.eq);
    if (good.length === 1) {
      const h = good[0];
      let range = null;
      if (numEnd) {
        const endHit = h.b.entries.find((e) => e.num === numEnd);
        if (!endHit) return { ...out, status: "needs-manual-review", reason: "range-end-not-found", number: num, numberEnd: numEnd, candidates: [hint(h.b, h.e, +h.sim.toFixed(2))] };
        range = { endNumber: numEnd, endUrl: urlFor(h.b, endHit), endHeading: endHit.num + " " + endHit.title };
      }
      return {
        ...out, status: "exact-html",
        ...describe(h.b, h.e),
        matchBasis: h.eq ? "number+title-equal" : "number+title-overlap",
        titleOverlap: +Math.max(h.sim, h.eq ? 1 : 0).toFixed(2),
        labelParaphrase: !h.eq,
        confidence: h.eq || sharedWords(title, h.e.title) >= 2 ? "high" : "medium",
        ...(range ? { range } : {})
      };
    }
    if (good.length > 1) return { ...out, status: "needs-manual-review", reason: "ambiguous-section-number", number: num, candidates: good.slice(0, 3).map((h) => hint(h.b, h.e, +h.sim.toFixed(2))) };
    return { ...out, status: "needs-manual-review", reason: "section-number-found-but-title-differs", number: num, candidates: contentHits.slice(0, 3).map((h) => hint(h.b, h.e, +h.sim.toFixed(2))) };
  }

  // unnumbered: only a complete, unique title equality is exact
  const key = titleKey(stripChapterPrefix(title));
  const eqHits = [];
  const near = [];
  for (const b of books) {
    const byFile = new Map();
    for (const e of b.entries) {
      const k = titleKey(stripChapterPrefix(e.title));
      if (!k) continue;
      if (k === key) byFile.set(e.file, [...(byFile.get(e.file) || []), e]);
      else {
        const s = overlap(title, e.title);
        if (s >= CANDIDATE_OVERLAP_MIN) near.push({ b, e, s });
      }
    }
    for (const list of byFile.values()) eqHits.push({ b, e: pickEntry(b, list), viaMenu: list.some((x) => x.src === "menu") });
  }
  // The same section is usually listed on its own page and again on a chapter/contents page.
  // If the book's menu assigns exactly one page to it, that page is the section; otherwise stay ambiguous.
  // The book front page (index.html) re-lists the contents; ignore it when a real content page also matches.
  if (eqHits.some((h) => h.e.file !== "index.html") && eqHits.some((h) => h.e.file === "index.html")) {
    const keep = eqHits.filter((h) => h.e.file !== "index.html");
    eqHits.splice(0, eqHits.length, ...keep);
  }
  const eqNums = new Set(eqHits.map((h) => (h.e.num || "") + "|" + h.b.work));
  if (eqHits.length > 1 && eqNums.size === 1 && eqHits.filter((h) => h.viaMenu).length === 1) eqHits.splice(0, eqHits.length, eqHits.find((h) => h.viaMenu));
  if (eqHits.length === 1) {
    const h = eqHits[0];
    return { ...out, status: "exact-html", ...describe(h.b, h.e), matchBasis: "title-equal", titleOverlap: 1, labelParaphrase: false, confidence: "high" };
  }
  if (eqHits.length > 1) return { ...out, status: "needs-manual-review", reason: "ambiguous-title", candidates: eqHits.slice(0, 3).map((h) => hint(h.b, h.e)) };
  const uniq = [];
  const seen = new Set();
  for (const n of near.sort((a, b) => b.s - a.s)) {
    const k = n.b.work + "|" + n.e.file + "|" + n.e.title;
    if (seen.has(k)) continue; seen.add(k); uniq.push(n);
  }
  return uniq.length
    ? { ...out, status: "needs-manual-review", reason: "unnumbered-topic-no-equal-heading", candidates: uniq.slice(0, 2).map((n) => hint(n.b, n.e, +n.s.toFixed(2))) }
    : { ...out, status: "needs-manual-review", reason: "unnumbered-topic-no-matching-heading" };
}

// ---------------------------------------------------------------- main
const snapshot = JSON.parse(fs.readFileSync(path.join(HERE, "gel-site-topics-snapshot.json"), "utf8"));
const bySubject = new Map(snapshot.subjects.map((s) => [s.subjectId, s]));

console.error("Loading ebooks.edu.gr catalog …");
const catalog = await loadCatalog();

const bookCache = new Map(); // work -> {meta, pages}
async function resolveBook(work) {
  if (bookCache.has(work)) return bookCache.get(work);
  const w = catalog.get(work);
  if (!w) throw new Error("work not in ebooks catalog: " + work);
  const { html, pdf } = pickForms(w);
  const rec = { work, title: w.title, handleUrl: "https://ebooks.edu.gr/ebooks/handle/" + work, html, pdf, pages: null };
  if (html) {
    console.error("  fetching", work, w.title, html.url);
    const p = await loadBookPages(html.url);
    if (p.failures.length) console.error("   WARN failed pages:", p.failures.join(", "));
    rec.pages = { ...p, work };
  }
  bookCache.set(work, rec);
  return rec;
}

const subjects = {};
const report = {};
for (const [subjectId, reg] of Object.entries(SUBJECT_REGISTRY)) {
  const snap = bySubject.get(subjectId);
  if (!snap) throw new Error("registry subject not on site: " + subjectId);
  const books = [];
  for (const b of reg.books) {
    const rec = await resolveBook(b.work);
    const bookStatus = rec.html ? "exact-html" : (rec.pdf ? "exact-pdf" : "needs-manual-review");
    books.push({
      work: b.work,
      title: rec.title,
      role: b.role,
      status: bookStatus,
      officialRootUrl: rec.html ? rec.html.url : (rec.pdf ? rec.pdf.url : rec.handleUrl),
      catalogUrl: rec.handleUrl,
      html: rec.html ? { kind: kindOf(rec.html), manifestation: rec.html.mh, url: rec.html.url, catalogStatus1: rec.html.status1 } : null,
      pdf: rec.pdf ? { manifestation: rec.pdf.mh, url: rec.pdf.url, catalogStatus1: rec.pdf.status1 } : null,
      evidence: b.evidence,
      ...(b.note ? { note: b.note } : {})
    });
  }

  // subject-level status = weakest PRIMARY book; forced statuses win
  const primaries = books.filter((b) => b.role === "primary");
  const order = ["exact-html", "exact-pdf", "exact-old-ebooks", "needs-manual-review", "no-safe-mapping"];
  let status = reg.forcedStatus || (primaries.length ? primaries.map((b) => b.status).sort((a, b) => order.indexOf(b) - order.indexOf(a))[0] : "no-safe-mapping");

  // topic mapping
  // Only PRIMARY books are mapping targets: supplementary/reference books may be multi-grade and a title
  // coincidence there does not prove the topic is in this subject's 2026-27 scope.
  const mappable = reg.books
    .filter((b) => b.role === "primary")
    .map((b) => bookCache.get(b.work))
    .filter((r) => r && r.pages)
    .map((r) => r.pages);
  const topicMappings = snap.topics.map((t) => {
    if (reg.forcedStatus === "no-safe-mapping") return { topicId: t.id, label: t.label, status: "no-safe-mapping", reason: "no-official-book-or-unit-list-for-this-subject" };
    const anchor = reg.pdfAnchors && reg.pdfAnchors[t.id];
    if (anchor) {
      const pdfBook = books.find((b) => b.role === "primary" && b.pdf);
      return {
        topicId: t.id, label: t.label, status: "exact-pdf",
        work: pdfBook.work, url: pdfBook.pdf.url + "#page=" + anchor.page, pdfPage: anchor.page, printedPage: anchor.printed,
        heading: anchor.heading, granularity: "pdf-page", matchBasis: "unit-heading-on-pdf-page+official-unit-list", labelParaphrase: false
      };
    }
    const m = mapTopic(t, mappable);
    if (m.status === "needs-manual-review" && m.reason === "no-html-book") m.reason = books.some((b) => b.pdf && !b.html) ? "pdf-only-book-no-page-anchor" : "no-html-book";
    return m;
  });

  const counts = { "exact-html": 0, "exact-pdf": 0, "needs-manual-review": 0, "no-safe-mapping": 0 };
  for (const t of topicMappings) counts[t.status] = (counts[t.status] || 0) + 1;

  const exactN = (counts["exact-html"] || 0) + (counts["exact-pdf"] || 0);
  const topicCoverage = exactN === 0 ? "none" : (exactN === topicMappings.length ? "complete" : "partial");

  subjects[subjectId] = {
    subjectId, grade: reg.grade, labelEl: snap.label, status, topicCoverage,
    ...(reg.forcedReason ? { statusReason: reg.forcedReason } : {}),
    books,
    ...(reg.unresolvedReferences ? { unresolvedReferences: reg.unresolvedReferences } : {}),
    topicSummary: { total: topicMappings.length, ...counts },
    topicMappings
  };
  report[subjectId] = { status, counts };
}

// subjects that already have schoolbookSourceMapping on main are listed for completeness but not remapped
const ALREADY_MAPPED_ON_MAIN = ["biologia-a-lykeiou", "pliroforiki-a-lykeiou", "istoria-a-lykeiou", "pliroforiki-b-lykeiou", "ekthesi-g-lykeiou"];

const summary = { subjects: Object.keys(subjects).length, byStatus: {}, topics: { total: 0, "exact-html": 0, "exact-pdf": 0, "needs-manual-review": 0, "no-safe-mapping": 0 } };
for (const s of Object.values(subjects)) {
  summary.byStatus[s.status] = (summary.byStatus[s.status] || 0) + 1;
  for (const k of Object.keys(summary.topics)) if (k !== "total") summary.topics[k] += s.topicSummary[k] || 0;
  summary.topics.total += s.topicSummary.total;
}

for (const [id, d] of Object.entries(SOURCE_DOCS)) {
  if (!d.url.startsWith("https://")) throw new Error("doc url not https: " + id);
}

const payload = {
  schema: "aitools4kids.gel-schoolbook-source-map/1",
  schoolYear: "2026-2027",
  generatedAt: new Date().toISOString().slice(0, 10),
  scope: "Γενικό Λύκειο — μαθήματα χωρίς schoolbookSourceMapping στο main (a5082ff)",
  statusVocabulary: {
    "exact-html": "Το βιβλίο/η ενότητα ταυτοποιήθηκε από επίσημο έγγραφο 2026-27 και υπάρχει HTML έκδοση στο ebooks.edu.gr· για topics: η επικεφαλίδα βρέθηκε μέσα στην επίσημη σελίδα.",
    "exact-pdf": "Το βιβλίο ταυτοποιήθηκε από επίσημο έγγραφο αλλά υπάρχει μόνο PDF (όχι HTML grounding)· για topics: σελίδα PDF επαληθευμένη με το κείμενο του PDF.",
    "exact-old-ebooks": "Μόνο παλιό endpoint ebooks (δεν χρησιμοποιήθηκε σε αυτή τη φάση).",
    "needs-manual-review": "Το βιβλίο είναι γνωστό αλλά η αντιστοίχιση δεν αποδεικνύεται αυτόματα· ΔΕΝ πρέπει να χρησιμοποιηθεί για grounding μέχρι ανθρώπινο έλεγχο. Τα candidates είναι μόνο υποδείξεις.",
    "no-safe-mapping": "Δεν υπάρχει ασφαλής αντιστοίχιση (δεν υπάρχει επίσημο βιβλίο/ενότητα ή ο αριθμός § δεν υπάρχει στο βιβλίο). Fail-closed."
  },
  alreadyMappedOnMain: ALREADY_MAPPED_ON_MAIN,
  docs: SOURCE_DOCS,
  summary,
  subjects
};

const banner = `// AUTO-GENERATED by scripts/phase14/build-gel-schoolbook-source-map.mjs — do not edit by hand.
// Phase 14: verified inventory of official ebooks.edu.gr schoolbook sources for Γενικό Λύκειο 2026-27.
// This file is standalone data. It is NOT yet consumed by api/schoolbook-source.js.
// Rules: exact-* only with an official 2026-27 document naming the book + a verified section/page;
// everything else is needs-manual-review / no-safe-mapping (fail-closed).
`;
// Pretty-print the first levels, one compact line per leaf object (keeps the generated file diff-friendly).
function ser(v, depth = 0, pad = "") {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  const isArr = Array.isArray(v);
  const compact = JSON.stringify(v);
  if (depth >= 3 || compact.length < 90) return compact;
  const ip = pad + " ";
  const items = isArr ? v.map((x) => ip + ser(x, depth + 1, ip)) : Object.keys(v).map((k) => ip + JSON.stringify(k) + ": " + ser(v[k], depth + 1, ip));
  return (isArr ? "[" : "{") + "\n" + items.join(",\n") + "\n" + pad + (isArr ? "]" : "}");
}
const js = `${banner}(function(){
  "use strict";
  const data = ${ser(payload)};
  const subjects = data.subjects;
  const api = Object.freeze({
    schema: data.schema,
    schoolYear: data.schoolYear,
    generatedAt: data.generatedAt,
    scope: data.scope,
    statusVocabulary: data.statusVocabulary,
    alreadyMappedOnMain: data.alreadyMappedOnMain,
    docs: data.docs,
    summary: data.summary,
    ids: Object.freeze(Object.keys(subjects)),
    get(subjectId){ return Object.prototype.hasOwnProperty.call(subjects, subjectId) ? subjects[subjectId] : null; },
    all(){ return subjects; }
  });
  if (typeof window !== "undefined") window.AITOOLSKIDS_GEL_SCHOOLBOOK_SOURCE_MAP_2026_2027 = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
`;
fs.writeFileSync(OUT, js);
if (DUMP) fs.writeFileSync(path.resolve(ROOT, DUMP), JSON.stringify(payload, null, 1));
console.error("Wrote", path.relative(ROOT, OUT), (js.length / 1024).toFixed(0) + " KB");
console.error(JSON.stringify(summary, null, 1));
void officialEbooksUrl;
