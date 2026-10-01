// Phase 14 audit — Lyceum (ΓΕΛ) official schoolbook-source inventory.
//
//   node tests/phase14-gel-schoolbook-source-audit.mjs            offline structural audit + negative self-tests
//   node tests/phase14-gel-schoolbook-source-audit.mjs --live     also re-fetches every exact page from ebooks.edu.gr
//   node tests/phase14-gel-schoolbook-source-audit.mjs --json     machine-readable summary
//
// What it enforces (fail-closed):
//   1. Every URL is https on the official ebooks.edu.gr host (evidence documents: minedu.gov.gr / iep.edu.gr / et.gr).
//   2. Every subjectId exists on the site (snapshot of the curriculum resolver) and is not already mapped on main.
//   3. No topic is invented: topics are exactly the site's topics, each exactly once, with the site's label.
//   4. Nothing is "exact-*" without a concrete official source: a primary book with evidence (doc + quote),
//      a matching manifestation on ebooks.edu.gr, and for topics a concrete section/page URL + heading.
//   5. exact-html only for HTML books, exact-pdf only for PDF books (no pretending PDF = HTML grounding).
//   6. Prints a summary of exact-html / exact-pdf / needs-manual-review / no-safe-mapping.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const args = new Set(process.argv.slice(2));

const EXACT = new Set(["exact-html", "exact-pdf", "exact-old-ebooks"]);
const STATUSES = new Set(["exact-html", "exact-pdf", "exact-old-ebooks", "needs-manual-review", "no-safe-mapping"]);
const EVIDENCE_HOSTS = [/(^|\.)minedu\.gov\.gr$/i, /(^|\.)iep\.edu\.gr$/i, /(^|\.)et\.gr$/i, /(^|\.)ebooks\.edu\.gr$/i];
// "ebooks-pdf" evidence is the official ebooks PDF itself (cover page), cited via the book's own manifestation.
const SELF_EVIDENCE_DOCS = new Set(["ebooks-pdf"]);

export function isEbooksUrl(u) {
  try {
    const p = new URL(u);
    return p.protocol === "https:" && /(^|\.)ebooks\.edu\.gr$/i.test(p.hostname);
  } catch (_) { return false; }
}
function isEvidenceUrl(u) {
  try {
    const p = new URL(u);
    return p.protocol === "https:" && EVIDENCE_HOSTS.some((re) => re.test(p.hostname));
  } catch (_) { return false; }
}

export function validate(data, snapshot) {
  const errors = [];
  const err = (m) => errors.push(m);
  const snapSubjects = new Map(snapshot.subjects.map((s) => [s.subjectId, s]));
  const already = new Set(data.alreadyMappedOnMain || []);
  const docs = data.docs || {};

  for (const [id, d] of Object.entries(docs)) {
    if (!isEvidenceUrl(d.url)) err(`doc ${id}: url is not an official host: ${d.url}`);
  }

  const expected = snapshot.subjects.map((s) => s.subjectId).filter((id) => !already.has(id));
  const have = Object.keys(data.subjects || {});
  for (const id of have) if (!snapSubjects.has(id)) err(`subjectId does not exist on the site: ${id}`);
  for (const id of have) if (already.has(id)) err(`subjectId already has schoolbookSourceMapping on main (must not be remapped here): ${id}`);
  for (const id of expected) if (!have.includes(id)) err(`missing subject (no mapping and no explicit fail-closed row): ${id}`);

  for (const [id, s] of Object.entries(data.subjects || {})) {
    const where = `subject ${id}`;
    if (s.subjectId !== id) err(`${where}: subjectId field mismatch`);
    const snap = snapSubjects.get(id);
    if (!snap) continue;
    if (!STATUSES.has(s.status)) err(`${where}: invalid status ${s.status}`);

    // ---- books
    const bookByWork = new Map();
    for (const b of s.books || []) {
      bookByWork.set(b.work, b);
      for (const u of [b.officialRootUrl, b.catalogUrl, b.html && b.html.url, b.pdf && b.pdf.url]) {
        if (u && !isEbooksUrl(u)) err(`${where}: book ${b.work} url is not official ebooks.edu.gr: ${u}`);
      }
      if (!STATUSES.has(b.status)) err(`${where}: book ${b.work} invalid status ${b.status}`);
      if (b.status === "exact-html" && !(b.html && /\/ebooks\/v\/html\//.test(b.html.url))) err(`${where}: book ${b.work} claims exact-html without an ebooks HTML manifestation`);
      if (b.status === "exact-pdf" && !(b.pdf && /\/ebooks\/v\/pdf\//.test(b.pdf.url))) err(`${where}: book ${b.work} claims exact-pdf without an ebooks PDF manifestation`);
      if (b.status === "exact-pdf" && b.html) err(`${where}: book ${b.work} is exact-pdf but an HTML edition exists (must be exact-html)`);
      if (EXACT.has(b.status)) {
        const ev = b.evidence || [];
        if (!ev.length) err(`${where}: book ${b.work} is ${b.status} without official evidence`);
        for (const e of ev) {
          if (!e.quote || e.quote.length < 12) err(`${where}: book ${b.work} evidence without a concrete quote`);
          if (!(e.doc in docs) && !SELF_EVIDENCE_DOCS.has(e.doc)) err(`${where}: book ${b.work} evidence cites unknown doc ${e.doc}`);
        }
        if (b.role === "primary" && !ev.some((e) => e.doc !== "ebooks-pdf")) err(`${where}: primary book ${b.work} is proven only by self-evidence (needs an official 2026-27 document)`);
      }
    }

    // ---- subject status must be derivable from primary books
    const primaries = (s.books || []).filter((b) => b.role === "primary");
    if (EXACT.has(s.status)) {
      if (!primaries.length) err(`${where}: ${s.status} without any primary book`);
      for (const b of primaries) if (!EXACT.has(b.status)) err(`${where}: ${s.status} but primary book ${b.work} is ${b.status}`);
      const order = ["exact-html", "exact-pdf", "exact-old-ebooks"];
      const weakest = primaries.map((b) => b.status).sort((a, b) => order.indexOf(b) - order.indexOf(a))[0];
      if (weakest && weakest !== s.status) err(`${where}: subject status ${s.status} != weakest primary book status ${weakest}`);
    } else if (s.status === "no-safe-mapping" || s.status === "needs-manual-review") {
      for (const t of s.topicMappings || []) if (EXACT.has(t.status)) err(`${where}: topic ${t.topicId} is ${t.status} but subject is ${s.status}`);
    }

    // ---- topics: exactly the site's topics
    const siteTopics = new Map(snap.topics.map((t) => [t.id, t]));
    const seen = new Set();
    const counts = { "exact-html": 0, "exact-pdf": 0, "exact-old-ebooks": 0, "needs-manual-review": 0, "no-safe-mapping": 0 };
    for (const t of s.topicMappings || []) {
      const tw = `${where} topic ${t.topicId}`;
      if (!siteTopics.has(t.topicId)) { err(`${tw}: topic does not exist on the site`); continue; }
      if (seen.has(t.topicId)) err(`${tw}: duplicate topic`);
      seen.add(t.topicId);
      if (t.label !== siteTopics.get(t.topicId).label) err(`${tw}: label differs from the site's label`);
      if (!STATUSES.has(t.status)) { err(`${tw}: invalid status ${t.status}`); continue; }
      counts[t.status]++;
      if (EXACT.has(t.status)) {
        const book = bookByWork.get(t.work);
        if (!book) err(`${tw}: exact without a registered source book (work=${t.work})`);
        else {
          if (book.role !== "primary") err(`${tw}: exact mapping points to a non-primary book ${t.work}`);
          if (!EXACT.has(book.status)) err(`${tw}: exact mapping into book ${t.work} which is ${book.status}`);
        }
        if (!t.url || !isEbooksUrl(t.url)) err(`${tw}: exact without an official ebooks.edu.gr URL (${t.url})`);
        if (!t.heading) err(`${tw}: exact without the verified section/page heading`);
        if (!t.matchBasis) err(`${tw}: exact without matchBasis`);
        if (t.status === "exact-html") {
          if (!/\/ebooks\/v\/html\//.test(t.url || "")) err(`${tw}: exact-html URL is not an ebooks HTML page`);
          if (book && book.html && t.url && !t.url.startsWith(book.html.url)) err(`${tw}: exact-html URL is outside the registered HTML book ${t.work}`);
          if (t.range && !isEbooksUrl(t.range.endUrl)) err(`${tw}: range end url is not official`);
        }
        if (t.status === "exact-pdf") {
          if (!/\/ebooks\/v\/pdf\/.+#page=\d+$/.test(t.url || "")) err(`${tw}: exact-pdf needs a concrete #page=N anchor`);
          if (!Number.isInteger(t.pdfPage) || t.pdfPage < 1) err(`${tw}: exact-pdf needs an integer pdfPage`);
          if (book && book.pdf && t.url && !t.url.startsWith(book.pdf.url)) err(`${tw}: exact-pdf URL is outside the registered PDF book ${t.work}`);
        }
      } else {
        if (!t.reason) err(`${tw}: ${t.status} without a reason`);
        for (const c of t.candidates || []) if (!isEbooksUrl(c.url)) err(`${tw}: candidate url is not official: ${c.url}`);
      }
    }
    for (const id2 of siteTopics.keys()) if (!seen.has(id2)) err(`${where}: site topic ${id2} missing from mapping`);

    // ---- summary consistency
    const ts = s.topicSummary || {};
    for (const k of Object.keys(counts)) if ((ts[k] || 0) !== counts[k]) err(`${where}: topicSummary.${k}=${ts[k]} but counted ${counts[k]}`);
    if (ts.total !== (s.topicMappings || []).length) err(`${where}: topicSummary.total mismatch`);
    const exactN = counts["exact-html"] + counts["exact-pdf"] + counts["exact-old-ebooks"];
    const cov = exactN === 0 ? "none" : (exactN === (s.topicMappings || []).length ? "complete" : "partial");
    if (s.topicCoverage !== cov) err(`${where}: topicCoverage=${s.topicCoverage} but computed ${cov}`);
  }
  return errors;
}

export function summarize(data) {
  const subj = { "exact-html": [], "exact-pdf": [], "exact-old-ebooks": [], "needs-manual-review": [], "no-safe-mapping": [] };
  const topics = { total: 0, "exact-html": 0, "exact-pdf": 0, "exact-old-ebooks": 0, "needs-manual-review": 0, "no-safe-mapping": 0 };
  const withExactTopics = [], fullyMapped = [], bookOnly = [];
  for (const s of Object.values(data.subjects)) {
    subj[s.status].push(s.subjectId);
    for (const t of s.topicMappings) { topics.total++; topics[t.status]++; }
    if (s.topicCoverage !== "none") withExactTopics.push(s.subjectId);
    if (s.topicCoverage === "complete") fullyMapped.push(s.subjectId);
    if (EXACT.has(s.status) && s.topicCoverage === "none") bookOnly.push(s.subjectId);
  }
  return { subjects: subj, topics, withExactTopics, fullyMapped, bookOnly };
}

// ------------------------------------------------------------------ negative self-tests
function selfTests(data, snapshot) {
  const clone = () => JSON.parse(JSON.stringify(data));
  const cases = [];
  const firstExactSubject = (d) => Object.values(d.subjects).find((s) => s.status === "exact-html" && s.topicMappings.some((t) => t.status === "exact-html"));
  cases.push(["unknown subjectId is rejected", (d) => { d.subjects["nonexistent-x-lykeiou"] = { ...Object.values(d.subjects)[0], subjectId: "nonexistent-x-lykeiou" }; }, /does not exist on the site/]);
  cases.push(["already-mapped subject is rejected", (d) => { d.subjects["biologia-a-lykeiou"] = { ...Object.values(d.subjects)[0], subjectId: "biologia-a-lykeiou" }; }, /already has schoolbookSourceMapping/]);
  cases.push(["exact book without evidence is rejected", (d) => { firstExactSubject(d).books[0].evidence = []; }, /without official evidence/]);
  cases.push(["exact book with unknown evidence doc is rejected", (d) => { firstExactSubject(d).books[0].evidence = [{ doc: "made-up", quote: "some invented official quote", loc: "x", kind: "text" }]; }, /unknown doc/]);
  cases.push(["non-ebooks URL on an exact topic is rejected", (d) => { const t = firstExactSubject(d).topicMappings.find((x) => x.status === "exact-html"); t.url = "https://example.com/book/index.html"; }, /official ebooks\.edu\.gr URL/]);
  cases.push(["exact topic without a concrete URL is rejected", (d) => { const t = firstExactSubject(d).topicMappings.find((x) => x.status === "exact-html"); delete t.url; }, /official ebooks\.edu\.gr URL/]);
  cases.push(["exact topic without a source book is rejected", (d) => { const t = firstExactSubject(d).topicMappings.find((x) => x.status === "exact-html"); t.work = "8547/0000"; }, /registered source book/]);
  cases.push(["exact-pdf without #page is rejected", (d) => { const s = d.subjects["english-a-lykeiou"]; s.topicMappings[0].url = s.topicMappings[0].url.replace(/#page=\d+$/, ""); }, /#page=N/]);
  cases.push(["PDF-only book claiming exact-html is rejected", (d) => { const s = d.subjects["thriskeftika-a-lykeiou"]; s.status = "exact-html"; s.books[0].status = "exact-html"; }, /exact-html without an ebooks HTML/]);
  cases.push(["invented topic is rejected", (d) => { firstExactSubject(d).topicMappings.push({ topicId: "invented.topic-99", label: "Invented", status: "needs-manual-review", reason: "x" }); }, /does not exist on the site/]);
  cases.push(["exact topic inside a no-safe-mapping subject is rejected", (d) => { const s = d.subjects["english-g-lykeiou"]; s.topicMappings[0] = { ...firstExactSubject(d).topicMappings.find((x) => x.status === "exact-html"), topicId: s.topicMappings[0].topicId, label: s.topicMappings[0].label }; }, /subject is no-safe-mapping/]);
  const failures = [];
  for (const [name, mutate, re] of cases) {
    const d = clone();
    mutate(d);
    const errs = validate(d, snapshot);
    if (!errs.some((e) => re.test(e))) failures.push(`self-test did not fail as expected: ${name}`);
  }
  return { count: cases.length, failures };
}

// ------------------------------------------------------------------ live re-verification
async function liveCheck(data) {
  const { norm, stripTags } = await import(path.join(ROOT, "scripts/phase14/lib.mjs"));
  const jobs = new Map();
  const add = (url, heading, label) => { const page = url.split("#")[0]; if (!jobs.has(page)) jobs.set(page, []); jobs.get(page).push({ heading, label }); };
  const pdfs = new Map();
  for (const s of Object.values(data.subjects)) for (const t of s.topicMappings) {
    if (t.status === "exact-html") { add(t.url, t.heading, t.label); if (t.range) add(t.range.endUrl, t.range.endHeading, t.label + " (range end)"); }
    if (t.status === "exact-pdf") pdfs.set(t.url.split("#")[0], t.label);
  }
  const problems = [];
  const queue = [...jobs.entries()];
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const [page, ts] = queue.shift();
      let r, html;
      try { r = await fetch(page, { headers: { "User-Agent": "aitools4kids-phase14-audit/1.0" } }); html = await r.text(); }
      catch (e) { problems.push(`fetch failed ${page}: ${e.message}`); continue; }
      if (r.status !== 200) { problems.push(`HTTP ${r.status} ${page}`); continue; }
      const text = norm(stripTags(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "")));
      const sel = [...html.matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/gi)].filter((m) => /\bselected\b/i.test(m[1])).map((m) => norm(stripTags(m[2])));
      for (const t of ts) {
        const h = norm(t.heading);
        if (!text.includes(h) && !sel.includes(h)) problems.push(`heading not found on page: "${t.heading}" @ ${page}`);
      }
    }
  }));
  for (const [pdf, label] of pdfs) {
    try {
      const r = await fetch(pdf, { method: "HEAD", headers: { "User-Agent": "aitools4kids-phase14-audit/1.0" } });
      if (r.status !== 200 || !/pdf/i.test(r.headers.get("content-type") || "")) problems.push(`PDF not reachable as application/pdf (${r.status}): ${pdf} [${label}]`);
    } catch (e) { problems.push(`PDF fetch failed ${pdf}: ${e.message}`); }
  }
  return { pages: jobs.size, pdfs: pdfs.size, problems };
}

// ------------------------------------------------------------------ main
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const data = require(path.join(ROOT, "gel-schoolbook-source-map-2026-2027.js"));
  const snapshot = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/phase14/gel-site-topics-snapshot.json"), "utf8"));
  const view = { docs: data.docs, alreadyMappedOnMain: data.alreadyMappedOnMain, subjects: data.all() };
  const errors = validate(view, snapshot);
  const st = summarize(view);
  const self = selfTests(view, snapshot);

  let live = null;
  if (args.has("--live")) live = await liveCheck(view);

  const out = {
    subjectsAudited: Object.keys(view.subjects).length,
    subjectStatus: Object.fromEntries(Object.entries(st.subjects).map(([k, v]) => [k, v.length])),
    topics: st.topics,
    subjectsWithAtLeastOneExactTopic: st.withExactTopics.length,
    subjectsFullyMapped: st.fullyMapped,
    subjectsExactBookButNoExactTopic: st.bookOnly,
    needsManualReviewOrNoSafeMapping: [...st.subjects["needs-manual-review"], ...st.subjects["no-safe-mapping"]],
    negativeSelfTests: { run: self.count, failed: self.failures.length },
    live: live && { pages: live.pages, pdfs: live.pdfs, problems: live.problems.length }
  };
  if (args.has("--json")) console.log(JSON.stringify(out, null, 2));
  else {
    console.log("PHASE14_GEL_SCHOOLBOOK_SOURCE_AUDIT");
    console.log(JSON.stringify(out, null, 2));
    console.log("\nSubjects by status:");
    for (const [k, v] of Object.entries(st.subjects)) if (v.length) console.log(`  ${k.padEnd(20)} ${String(v.length).padStart(2)}  ${v.join(", ")}`);
    console.log("\nTopics: " + Object.entries(st.topics).map(([k, v]) => `${k}=${v}`).join("  "));
  }
  const all = [...errors, ...self.failures, ...(live ? live.problems : [])];
  if (all.length) {
    console.error("\nAUDIT FAILED (" + all.length + "):");
    for (const e of all.slice(0, 60)) console.error("  - " + e);
    process.exit(1);
  }
  console.log("\nAUDIT OK" + (live ? " (live)" : " (offline; run with --live to re-verify pages on ebooks.edu.gr)"));
}
