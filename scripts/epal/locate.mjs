// Locates an EPAL curriculum unit inside the per-page text of an official PDF.
// A location is accepted only when a heading for that unit is found on the start page
// using the SAME normalisation as the runtime extractor (api/official-pdf-text-v2.js),
// so every mapping produced here is re-verified on each live request.
import { normalizePdfText as N } from "./lib.mjs";

const ORDINALS = ["πρωτο", "δευτερο", "τριτο", "τεταρτο", "πεμπτο", "εκτο", "εβδομο", "ογδοο", "ενατο", "δεκατο",
  "ενδεκατο", "δωδεκατο", "δεκατο τριτο", "δεκατο τεταρτο", "δεκατο πεμπτο", "δεκατο εκτο", "δεκατο εβδομο",
  "δεκατο ογδοο", "δεκατο ενατο", "εικοστο"];
const STOP = new Set(["και", "η", "ο", "το", "οι", "τα", "της", "του", "των", "την", "τον", "στη", "στην", "στο", "στον", "στα", "στις", "στους",
  "με", "σε", "για", "απο", "ως", "κατα", "μια", "ενα", "ενασ", "a", "the", "of", "and", "in", "to"]);

export const MAX_SPAN = 40;

const TOP_CHARS = 420;

function full(page) {
  if (page._n === undefined) page._n = N(page.t);
  return page._n;
}

function topText(page) {
  // Drop a leading printed page number so "25 ΚΕΦΑΛΑΙΟ 2ο" still counts as top-of-page.
  // …but keep it when a section number follows ("5 1 Γενικά" is section 5.1, not page 5).
  if (page._top === undefined) page._top = full(page).replace(/^\d{1,3}\s+(?!\d{1,2}\s)/, "").slice(0, TOP_CHARS);
  return page._top;
}

// Letter-spaced headings ("Κ Ε Φ Α Λ Α Ι Ο 5") are joined for marker detection only.
function despace(text) {
  return text.replace(/(?:^|\s)((?:[a-zα-ω] ){3,}[a-zα-ω])(?=\s|$)/g, (m, g) => (m.startsWith(" ") ? " " : "") + g.replace(/ /g, ""));
}

// Chapter markers count only near the top (running header + heading), not in-text references
// such as "Στο Κεφάλαιο 3 είδαμε…".
const MARKER_CHARS = 140;
// Some PDFs mix Latin look-alike letters into Greek words ("eiσαγωγικο"); for marker
// detection only (never for runtime headings) they are read as Greek.
const LOOKALIKE = { a: "α", b: "β", e: "ε", h: "η", i: "ι", k: "κ", m: "μ", n: "ν", o: "ο", p: "ρ", t: "τ", x: "χ", y: "υ", z: "ζ" };
function greekify(text) {
  return text.replace(/[a-z]+/g, (w, at) => {
    const near = text.slice(Math.max(0, at - 1), at) + text.slice(at + w.length, at + w.length + 1);
    return /[α-ω]/.test(near) && w.split("").every((c) => LOOKALIKE[c]) ? w.split("").map((c) => LOOKALIKE[c]).join("") : w;
  });
}

function markerTop(page) {
  if (page._mtop === undefined) page._mtop = greekify(despace(topText(page))).slice(0, MARKER_CHARS);
  return page._mtop;
}

const MARKER_KINDS = {
  chapter: (n) => [
    new RegExp(`(?:^|\\s)κεφαλαιο\\s+${n}(?:ο|ον|ου)?(?=\\s|$)`),
    new RegExp(`(?:^|\\s)κεφ\\s+${n}(?:ο|ον)?(?=\\s|$)(?!\\s\\d)`),
    new RegExp(`(?:^|\\s)${n}(?:ο|ον)\\s+κεφαλαιο(?=\\s|$)`),
    ...(ORDINALS[n - 1] ? [new RegExp(`(?:^|\\s)(?:${ORDINALS[n - 1]}|${ORDINALS[n - 1]}ν)\\s+κεφαλαιο(?=\\s|$)`), new RegExp(`κεφαλαιο\\s+${ORDINALS[n - 1]}(?=\\s|$)`)] : [])
  ],
  unit: (n) => [new RegExp(`(?:^|\\s)(?:διδακτικη\\s+|θεματικη\\s+)?ενοτητα\\s+${n}(?:η)?(?=\\s|$)`)],
  english: (n) => [new RegExp(`(?:^|\\s)(?:unit|module|lesson)\\s+${n}(?=\\s|$)`)],
  theme: (n) => [new RegExp(`(?:^|\\s)(?:θεματικη\\s+ενοτητα|θ\\s*ε)\\s+${n}(?=\\s|$)`)],
  exercise: (n) => [new RegExp(`(?:^|\\s)(?:ασκηση|εργαστηριακη\\s+ασκηση|θεμα)\\s+${n}(?:η|ο)?(?=\\s|$)`)]
};

// Books also number their chapters as "Ενότητα N" or lab "Άσκηση N"; tried after "Κεφάλαιο N".
export const FALLBACK_KINDS = Object.freeze({ chapter: ["unit", "exercise"], unit: ["chapter"] });

// In-text references ("στο Κεφάλαιο 3 είδαμε", "του κεφαλαίου 4") are not chapter openings.
const REFERENCE_BEFORE = /(?:^|\s)(?:στο|στον|στη|στην|του|τησ|της|απο\s+το|απο\s+τη|βλ|βλεπε|σε|με\s+το|προηγουμενο|επομενο|προηγουμενη|επομενη|ιδιο|αυτο|εισαγωγικο)\s*$/;

function markerRegexes(kind, n) {
  return (MARKER_KINDS[kind] || MARKER_KINDS.chapter)(n).map((re) => {
    const g = new RegExp(re.source, "g");
    // Same interface as RegExp for .test/.search/.match, skipping reference matches.
    const find = (text) => {
      g.lastIndex = 0;
      let m;
      while ((m = g.exec(text))) {
        if (!REFERENCE_BEFORE.test(text.slice(Math.max(0, m.index - 30), m.index + (m[0].startsWith(" ") ? 1 : 0)))) return m;
        if (g.lastIndex === m.index) g.lastIndex++;
      }
      return null;
    };
    return {
      source: re.source,
      test: (text) => !!find(text),
      search: (text) => { const m = find(text); return m ? m.index : -1; },
      exec: (text) => find(text)
    };
  });
}

function anyMarkerNumbers(text, kind) {
  const out = new Set();
  const re = kind === "english"
    ? /(?:^|\s)(?:unit|module|lesson)\s+(\d{1,2})(?=\s|$)/g
    : (kind === "unit" ? /(?:^|\s)ενοτητα\s+(\d{1,2})(?:η)?(?=\s|$)/g : /(?:^|\s)κεφαλαιο\s+(\d{1,2})(?:ο|ον|ου)?(?=\s|$)/g);
  let m;
  while ((m = re.exec(text))) out.add(Number(m[1]));
  return out;
}

export function bookIndex(pages, kind = "chapter") {
  // Layout-based TOC heuristics only apply to front matter; tables inside chapters look alike.
  const front = Math.max(12, Math.round(pages.length * 0.12));
  const isToc = pages.map((p, i) => {
    const text = full(p);
    if (/(?:^|\s)(?:βιβλιογραφια|αναφορεσ|ευρετηριο|γλωσσαρι|bibliography|references|index)(?:\s|$)/.test(despace(text.replace(/^\d{1,3}\s+/, "")).slice(0, 60))) return true;
    return /(?:^|\s)(?:πινακασ\s+)?περιεχομενα(?!\s+(?:του|τησ)\s+(?:κεφαλαιου|ενοτητασ))(?:\s|$)/.test(text.slice(0, 600)) || /(?:^|\s)contents(?:\s|$)/.test(text.slice(0, 300)) ||
      anyMarkerNumbers(text, kind).size >= 3 ||
      (i < front && ((String(p.t).match(/(?:\.\s?){5,}|…{2,}/g) || []).length >= 3 ||
      // "4.2 Τίτλος ενότητας 37" rows: section number, title, page number.
        (String(p.t).match(/(?:^|\s)\d{1,2}(?:\.\d{1,2})+\.?\s+[^\d]{3,90}?\s\d{1,3}(?=\s|$)/g) || []).length >= 6 ||
      (String(p.t).match(/(?:ΚΕΦΑΛΑΙΟ|Κεφάλαιο)\s+\S+\s*[:.–-]?\s*[^\d]{3,90}?\s\d{1,3}(?=\s|$)/g) || []).length >= 3));
  });
  return { pages, isToc, kind, front };
}

// First page (outside table-of-contents pages) whose top region carries marker n.
function markerPages(index, n) {
  index._mp = index._mp || new Map();
  if (index._mp.has(n)) return index._mp.get(n);
  const res = markerRegexes(index.kind, n);
  const out = [];
  index.pages.forEach((p, i) => {
    if (index.isToc[i]) return;
    const top = markerTop(p);
    if (res.some((re) => re.test(top))) out.push(i);
  });
  index._mp.set(n, out);
  return out;
}

function significantWords(title) {
  return N(title).split(" ").filter((w) => w && w.length > 1 && !STOP.has(w) && !/^\d+$/.test(w));
}

// Longest contiguous run of the title (≥2 words, ≥10 chars) found in text → runtime heading.
function headingIn(text, title) {
  const words = N(title).split(" ").filter(Boolean);
  if (!words.length) return "";
  for (let len = Math.min(words.length, 9); len >= 2; len--) {
    for (let start = 0; start + len <= words.length; start++) {
      const phrase = words.slice(start, start + len).join(" ");
      if (phrase.length < 10) continue;
      if (significantWords(phrase).length < Math.min(2, significantWords(title).length)) continue;
      if ((" " + text + " ").includes(" " + phrase + " ")) return phrase;
    }
  }
  if (words.length === 1 && words[0].length >= 6 && (" " + text + " ").includes(" " + words[0] + " ")) return words[0];
  return "";
}

function rangeEnd(index, startIdx, nextStarts) {
  const next = nextStarts.filter((i) => i > startIdx).sort((a, b) => a - b)[0];
  const last = index.pages.length - 1;
  let end = next !== undefined ? next - 1 : Math.min(last, startIdx + MAX_SPAN - 1);
  return { end, capped: end - startIdx + 1 > MAX_SPAN };
}

// [start, end) page ranges of the parts of a multi-part book (each restarts at "Κεφάλαιο 1").
function partSegments(index) {
  if (index._parts) return index._parts;
  const res = markerRegexes(index.kind, 1);
  const ones = markerPages(index, 1).filter((i) => res.some((re) => re.test(markerTop(index.pages[i]).slice(0, 60))));
  const firsts = ones.filter((i, k) => k === 0 || i - ones[k - 1] > 3);
  index._parts = firsts.map((start, k) => [start, firsts[k + 1] ?? index.pages.length]);
  return index._parts;
}

function orderedCeiling(index, n, cache) {
  const starts = cache.starts || (cache.starts = allChapterStarts(index));
  if (starts.length < 2) return Infinity;
  const higher = starts.filter((x) => x.n > n).map((x) => x.idx);
  return higher.length ? Math.min(...higher) : Infinity;
}

// True when "Κεφάλαιο 1" opens a page again after the last chained chapter start.
function numberingRestarts(index, cache) {
  if (cache.restarts !== undefined) return cache.restarts;
  const starts = cache.starts || (cache.starts = allChapterStarts(index));
  const last = starts.length ? starts[starts.length - 1].idx : -1;
  const res = markerRegexes(index.kind, 1);
  cache.restarts = starts.length >= 2 && markerPages(index, 1).some((i) => i > last && res.some((re) => re.test(markerTop(index.pages[i]).slice(0, 60))));
  return cache.restarts;
}

// Page index after which chapter n may start: the first-found start of the nearest lower chapter.
function orderedFloor(index, n, cache) {
  const starts = cache.starts || (cache.starts = allChapterStarts(index));
  // A single marker is not an ordering: only chains of ≥2 chapters bound the search.
  if (starts.length < 2) return -1;
  let floor = -1;
  for (const x of starts) if (x.n < n) floor = Math.max(floor, x.idx);
  return floor;
}

// Ordered chapter starts: the longest chain increasing in both chapter number and page, built
// from every page carrying a chapter marker (stray markers such as a lone early "Κεφάλαιο 1" in a
// book that starts at chapter 7 are left out).
export function allChapterStarts(index, maxN = 40) {
  const cands = [];
  for (let n = 1; n <= maxN; n++) for (const idx of markerPages(index, n)) cands.push({ n, idx });
  cands.sort((a, b) => a.idx - b.idx || a.n - b.n);
  const best = cands.map(() => 1), prevOf = cands.map(() => -1);
  for (let i = 0; i < cands.length; i++) {
    for (let j = 0; j < i; j++) {
      if (cands[j].n < cands[i].n && cands[j].idx < cands[i].idx && best[j] + 1 > best[i]) { best[i] = best[j] + 1; prevOf[i] = j; }
    }
  }
  let end = -1;
  for (let i = 0; i < cands.length; i++) if (end < 0 || best[i] > best[end] || (best[i] === best[end] && cands[i].idx < cands[end].idx)) end = i;
  const chain = [];
  for (let i = end; i >= 0; i = prevOf[i]) chain.unshift(cands[i]);
  // For each chapter keep its first page within the chain's ordering window.
  return chain.map((x, k) => {
    const lo = k > 0 ? chain[k - 1].idx : -1;
    const first = markerPages(index, x.n).find((i) => i > lo && i <= x.idx);
    return { n: x.n, idx: first ?? x.idx };
  });
}

/**
 * parsed: { kind, number, title, section, sections }
 * returns { ok, pdfPage, pdfPageEnd, heading, method, confidence, capped } or { ok:false, reason }
 */
export function locate(index, parsed, cache = {}) {
  const starts = cache.starts || (cache.starts = allChapterStarts(index));
  const pages = index.pages;
  const lastIdx = pages.length - 1;

  const finish = (startIdx, endIdx, heading, method, confidence) => {
    let end = Math.max(startIdx, Math.min(endIdx, lastIdx));
    const capped = end - startIdx + 1 > MAX_SPAN;
    if (capped) end = startIdx + MAX_SPAN - 1;
    // Runtime check replica: heading must be included in the normalised start page.
    if (!heading || !full(pages[startIdx]).includes(N(heading))) return { ok: false, reason: "heading-not-on-start-page" };
    return { ok: true, pdfPage: startIdx + 1, pdfPageEnd: end + 1, heading: N(heading), method, confidence, capped };
  };
  const chapterEnd = (startIdx, n) => {
    const nextMarker = starts.filter((x) => x.idx > startIdx && x.n !== n).map((x) => x.idx).sort((a, b) => a - b)[0];
    const nextSection = n ? firstSectionPage(index, n + 1, 1, startIdx + 1) : -1;
    const cands = [nextMarker, nextSection >= 0 ? nextSection : undefined].filter((x) => x !== undefined);
    return cands.length ? Math.min(...cands) - 1 : Math.min(lastIdx, startIdx + MAX_SPAN - 1);
  };

  // A specific numbered section (e.g. "Κεφάλαιο 2.1 — Πρόβλημα", "μόνο §9.3 ...").
  if (parsed.section) {
    const [a, b] = parsed.section;
    const idx = firstSectionPage(index, a, b, 0, parsed.sectionTitle || "");
    if (idx >= 0) {
      const heading = sectionHeading(pages[idx], a, b, parsed.sectionTitle || "");
      let next = firstSectionPage(index, a, b + 1, idx);
      if (next < 0) next = chapterEnd(idx, a) + 1;
      const r = finish(idx, Math.max(idx, (next === idx ? idx : next - (startsWithSection(pages[next], a, b + 1) ? 1 : 0))), heading, "section", "high");
      if (r.ok) return r;
    }
  }

  const floor = parsed.number ? orderedFloor(index, parsed.number, cache) : -1;
  // …and before the first-found start of any higher-numbered chapter.
  const ceiling = parsed.number ? orderedCeiling(index, parsed.number, cache) : Infinity;
  const cands = parsed.number ? markerPages(index, parsed.number).filter((i) => i > floor && i < ceiling) : [];
  const words = significantWords(parsed.title);
  const markerAt = (i) => {
    const top = markerTop(pages[i]);
    const re = markerRegexes(index.kind, parsed.number).find((r) => r.test(top));
    return re ? { top, at: top.search(re), re } : null;
  };
  // Printed marker usable as a runtime heading (letter-spaced markers → literal top text).
  const markerHeading = (i) => {
    const plain = topText(pages[i]);
    const r = markerRegexes(index.kind, parsed.number).find((x) => x.test(plain));
    return r ? r.exec(plain)[0].trim() : plain.slice(0, 48).replace(/\s\S*$/, "");
  };
  const runStart = (i) => { let k = i; while (cands.includes(k - 1) && k - 1 > floor) k--; return k; };

  // A numbered running-header run ("5 Πρόοδοι" on every other page) that starts before any
  // "Κεφάλαιο N" marker wins: such markers can be recap sidebars in later chapters.
  const earlyRun = parsed.number && words.length ? titleRun(index, parsed.title, parsed.number, floor, ceiling) : null;
  if (earlyRun && earlyRun.score >= 20 && earlyRun.count >= 2 && (!cands.length || earlyRun.start < cands[0] - 1)) {
    let start = earlyRun.start;
    if (start > 0 && new RegExp(`(?:^|\\s)${parsed.number} 1(?:\\s)(?!\\d)`).test(topText(pages[start - 1]).slice(0, 80))) start -= 1;
    const r = finish(start, Math.max(earlyRun.end, chapterEnd(start, parsed.number)), start === earlyRun.start ? earlyRun.heading : sectionHeading(pages[start], parsed.number, 1, ""), "title-run", "high");
    if (r.ok) return r;
  }

  if (parsed.number && words.length) {
    // 1. "ΚΕΦΑΛΑΙΟ N" followed by the unit title (contiguous, or ≥75 % of its words).
    for (const idx of cands) {
      const m = markerAt(idx);
      if (!m) continue;
      const near = despace(topText(pages[idx])).slice(Math.max(0, m.at - 80), m.at + 140);
      const nearWords = new Set(near.split(" "));
      const contiguous = headingIn(near, parsed.title);
      const bag = words.filter((w) => nearWords.has(w)).length / words.length;
      // Drop caps / letter spacing ("Τ ΡΙΓΩΝΑ"): compare without spaces.
      const compactHit = N(parsed.title).replace(/ /g, "").length >= 5 && near.replace(/ /g, "").slice(0, 160).includes(N(parsed.title).replace(/ /g, ""));
      if (!contiguous && !compactHit && bag < (words.length <= 2 ? 1 : 0.75)) continue;
      const start = runStart(idx);
      const h = start === idx && contiguous && !compactHit && full(pages[idx]).includes(N(contiguous)) ? contiguous : markerHeading(start);
      return finish(start, chapterEnd(start, parsed.number), h, "marker+title", "high");
    }
  }

  if (parsed.number && cands.length) {
    const idx = cands[0];
    // Numbering restarts in multi-part books ("Μέρος Β΄ … Κεφάλαιο 1"): an untitled
    // "Κεφάλαιο N" is then ambiguous. The ordered chapter chain must also contain N.
    const restarts = numberingRestarts(index, cache);
    const chained = (cache.starts || []).find((x) => x.n === parsed.number);
    const separateRuns = restarts ? 2 : 1;
    if (!words.length) {
      if (restarts && parsed.part) {
        // Multi-part book: use the unit's part (from the preceding «Μέρος …» row) to pick the segment.
        const seg = partSegments(index)[parsed.part - 1];
        const inPart = seg ? markerPages(index, parsed.number).filter((i) => i >= seg[0] && i < seg[1]) : [];
        if (inPart.length) {
          const nextInPart = markerPages(index, parsed.number + 1).filter((i) => i > inPart[0] && i < seg[1])[0];
          const end = nextInPart !== undefined ? nextInPart - 1 : seg[1] - 1;
          return finish(inPart[0], end, markerHeading(inPart[0]), "marker+part", "high");
        }
      }
      if (restarts) return { ok: false, reason: "chapter-number-repeats-in-book" };
      const at = chained ? chained.idx : idx;
      return finish(at, chapterEnd(at, parsed.number), markerHeading(at), "marker", "high");
    }
    const near = full(pages[idx]).slice(0, 1400);
    const hit = words.filter((w) => near.includes(w)).length;
    if (separateRuns === 1 && hit / words.length >= 0.6) return finish(idx, chapterEnd(idx, parsed.number), markerHeading(idx), "marker+partial-title", "medium");
  }

  // 2. Running-header / heading run of the unit title. With a chapter number, the run must
  //    carry numeric evidence (N.1 / "Κεφάλαιο N" on or before its first page).
  if (words.length) {
    const run = titleRun(index, parsed.title, parsed.number, floor, ceiling);
    if (run && (!parsed.number || !cands.length || run.score >= 20)) {
      const end = run.count > 1 && !parsed.number ? run.end : Math.max(run.end, chapterEnd(run.start, parsed.number || 0));
      // The book's TOC may place the chapter opener 1–3 pages before its first running header.
      const viaToc = tocLocate(index, parsed, words, floor, run.start);
      if (viaToc && viaToc.idx < run.start && run.start - viaToc.idx <= 3) {
        const r = finish(viaToc.idx, end, viaToc.heading, "title-run", run.confidence);
        if (r.ok) return r;
      }
      return finish(run.start, end, run.heading, "title-run", run.confidence);
    }
  }

  // 3. Section numbering "N.1 …" opening the chapter (no printed "Κεφάλαιο N" marker).
  if (parsed.number && !cands.length && index.kind === "chapter") {
    const idx = firstSectionPage(index, parsed.number, 1, floor + 1);
    if (idx >= 0) {
      const near = full(pages[idx]).slice(0, 1400);
      const prev = idx > 0 ? full(pages[idx - 1]).slice(0, 400) : "";
      const hit = words.filter((w) => near.includes(w) || prev.includes(w)).length;
      // A text-less chapter title page (image) right before "N.1 …" also marks the opening.
      const imageOpener = idx > 0 && String(pages[idx - 1].t || "").trim().length < 40 &&
        new RegExp(`^(?:\\d{1,3}\\s+)?${parsed.number} 1\\s`).test(full(pages[idx]));
      if (!words.length || hit / words.length >= 0.5 || imageOpener) {
        return finish(idx, chapterEnd(idx, parsed.number), sectionHeading(pages[idx], parsed.number, 1, ""), "section-numbering", words.length ? "medium" : "low");
      }
    }
  }
  // 4. The book's own table of contents: printed page → PDF page (offset from printed page
  //    numbers), then the unit heading must be verified on that page.
  if (words.length || parsed.number) {
    const viaToc = tocLocate(index, parsed, words, floor, ceiling);
    if (viaToc) {
      const end = viaToc.end !== undefined && viaToc.end >= viaToc.idx ? viaToc.end : chapterEnd(viaToc.idx, parsed.number || 0);
      return finish(viaToc.idx, end, viaToc.heading, "toc-page", viaToc.confidence);
    }
  }
  return { ok: false, reason: parsed.number ? "chapter-marker-not-found" : "title-not-found" };
}

// PDF range cited by the official guidance: the cited heading must be on the first page.
export function locateGuidedRange(index, spec) {
  const [s, e] = spec.pdf || [];
  if (!Number.isInteger(s) || !Number.isInteger(e) || s < 1 || e < s || e > index.pages.length) return { ok: false, reason: "guidance-pages-out-of-range" };
  const heading = N(spec.heading);
  if (!heading || !full(index.pages[s - 1]).includes(heading)) return { ok: false, reason: "guidance-heading-not-on-start-page" };
  const end = Math.min(e, s + MAX_SPAN - 1);
  return { ok: true, pdfPage: s, pdfPageEnd: end, heading, method: "guidance-pages", confidence: "high", capped: end < e };
}

// Printed page number → PDF page index offset (mode over pages that start/end with a number).
function printedOffset(index) {
  if (index._offset !== undefined) return index._offset;
  const votes = new Map();
  index.pages.forEach((p, i) => {
    const t = full(p);
    // Printed page numbers sit at the start/end of the text or right after a running header.
    const nums = new Set();
    const m = t.match(/^(\d{1,3})\s/) || t.match(/\s(\d{1,3})$/);
    if (m) nums.add(Number(m[1]));
    for (const w of t.split(" ").slice(0, 6)) if (/^\d{1,3}$/.test(w)) nums.add(Number(w));
    for (const n of nums) {
      const off = i + 1 - n;
      if (off < -5 || off > 40) continue;
      votes.set(off, (votes.get(off) || 0) + 1);
    }
  });
  let best = null;
  for (const [off, n] of votes) if (!best || n > best[1]) best = [off, n];
  index._offset = best && best[1] >= Math.max(5, index.pages.length * 0.15) ? best[0] : null;
  return index._offset;
}

function tocLocate(index, parsed, words, floor, ceiling) {
  const offset = printedOffset(index);
  if (offset === null) return null;
  const tocPages = index.pages.map((p, i) => (index.isToc[i] || i < (index.front || 0) ? i : -1)).filter((i) => i >= 0);
  const titleN = words.length ? N(parsed.title) : "";
  const results = new Set();
  const nextOf = new Map();
  for (const i of tocPages) {
    const t = full(index.pages[i]);
    const anchors = [];
    if (titleN && parsed.number) {
      const re = new RegExp(`(?:^|\\s)${parsed.number}\\s+(?=[a-zα-ω])`, "g");
      let m;
      while ((m = re.exec(t))) {
        const entry = t.slice(m.index, m.index + 90);
        const entryWords = new Set(entry.split(" "));
        const bag = words.filter((w) => entryWords.has(w)).length / words.length;
        if (bag >= 0.6) {
          const after = entry.split(" ").findIndex((w, k) => k > 1 && /^\d{1,3}$/.test(w));
          anchors.push(m.index + (after > 0 ? entry.split(" ").slice(0, after).join(" ").length : entry.length));
        }
      }
    }
    if (titleN) {
      const h = headingIn(t, parsed.title);
      if (h && significantWords(h).length >= Math.max(Math.min(2, words.length), Math.ceil(words.length * 0.75))) {
        let at = -1;
        while ((at = t.indexOf(N(h), at + 1)) >= 0) anchors.push(at + N(h).length);
      }
    } else if (parsed.number) {
      const re = new RegExp(`κεφαλαιο\\s+${parsed.number}(?:ο|ον)?\\s`, "g");
      let m;
      while ((m = re.exec(t))) anchors.push(m.index + m[0].length);
    }
    for (const a of anchors) {
      // First standalone page number after the entry (skip "5 1"-style section numbers).
      const tail = t.slice(a, a + 160).split(" ");
      for (let k = 0; k < tail.length; k++) {
        const w = tail[k];
        if (!/^\d{1,3}$/.test(w)) continue;
        // "5 1" (section 5.1) is a section number, not a page number.
        if (/^\d{1,2}$/.test(tail[k + 1] || "") && Number(w) <= 40) { k++; continue; }
        // The next TOC page number after this entry bounds the unit.
        const rest = t.slice(a).split(" ").slice(k + 1, k + 60);
        const next = rest.find((x, j) => /^\d{1,3}$/.test(x) && Number(x) > Number(w) && !/^\d{1,2}$/.test(rest[j + 1] || ""));
        results.add(Number(w));
        if (next) nextOf.set(Number(w), Math.min(nextOf.get(Number(w)) ?? Infinity, Number(next)));
        break;
      }
    }
  }
  // Page of the next chapter's TOC entry ("N+1 Τίτλος … 123"), when the TOC lists it.
  let nextChapterPrinted;
  if (parsed.number) {
    const tocText = tocPages.map((i) => full(index.pages[i])).join(" ");
    const re = new RegExp(`(?:^|\\s)${parsed.number + 1}\\s+[a-zα-ω][^0-9]{2,120}?\\s(\\d{1,3})(?=\\s|$)`);
    const m = tocText.match(re);
    if (m) nextChapterPrinted = Number(m[1]);
  }
  const verified = [];
  for (const printed of results) {
    const nextPrinted = nextChapterPrinted && nextChapterPrinted > printed ? nextChapterPrinted : nextOf.get(printed);
    const endIdx = nextPrinted ? nextPrinted + offset - 2 : undefined;
    for (const idx of [printed + offset - 1, printed + offset]) {
      if (idx <= floor || idx >= ceiling || idx < 0 || idx >= index.pages.length || index.isToc[idx]) continue;
      const head = despace(topText(index.pages[idx]));
      const h = titleN ? headingIn(head.slice(0, 300), parsed.title) : "";
      const compact = titleN && titleN.replace(/ /g, "").length >= 5 && head.replace(/ /g, "").slice(0, 300).includes(titleN.replace(/ /g, ""));
      const section = parsed.number ? new RegExp(`(?:^|\\s)${parsed.number} 1(?:\\s)(?!\\d)`).test(head.slice(0, 300)) : false;
      if (h && significantWords(h).length >= Math.max(Math.min(2, words.length), Math.ceil(words.length * 0.75)) && full(index.pages[idx]).includes(N(h))) { verified.push({ idx, heading: h, confidence: "high", end: endIdx }); break; }
      // Looser check for books whose headings are worded differently from the guidance:
      // ≥60 % of the title words on the top of the TOC-designated page.
      if (titleN && words.length >= 2) {
        const top = head.slice(0, 400);
        const topWords = new Set(top.split(" "));
        const bag = words.filter((w) => topWords.has(w)).length / words.length;
        if (bag >= 0.6) {
          const phrase = headingIn(top, parsed.title) || top.slice(0, 48).replace(/\s\S*$/, "");
          if (phrase && full(index.pages[idx]).includes(N(phrase))) { verified.push({ idx, heading: phrase, confidence: "medium", end: endIdx }); break; }
        }
      }
      if ((compact || section) && parsed.number) {
        const sh = sectionHeading(index.pages[idx], parsed.number, 1, "");
        const heading = sh || topText(index.pages[idx]).slice(0, 48).replace(/\s\S*$/, "");
        if (heading) { verified.push({ idx, heading, confidence: compact ? "high" : "medium", end: endIdx }); break; }
      }
    }
  }
  const unique = [...new Map(verified.map((v) => [v.idx, v])).values()];
  return unique.length === 1 ? unique[0] : null;
}

function startsWithSection(page, a, b) {
  return !!page && new RegExp(`(?:^|\\s)${a} ${b}(?:\\s)(?!\\d)`).test(topText(page).slice(0, 160));
}

// First non-TOC page (from `from`) whose top region opens section a.b (optionally with title).
// The number must sit near the top of the page and be followed by a title word, and not be a
// figure/table/exercise reference.
function firstSectionPage(index, a, b, from = 0, title = "") {
  const re = new RegExp(`(?:^|\\s)${a} ${b}(?:\\s)(?!\\d)`, "g");
  for (let i = from; i < index.pages.length; i++) {
    if (index.isToc[i]) continue;
    const text = topText(index.pages[i]).slice(0, 260);
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text))) {
      const before = text.slice(Math.max(0, m.index - 22), m.index);
      if (/(?:σχημα|σχ|εικονα|εικ|πινακασ|πιν|παραδειγμα|ασκηση|εφαρμογη|σελ|σελιδα|εξισωση|τυποσ|figure|fig|table)\s*$/.test(before)) continue;
      const afterTop = topText(index.pages[i]).slice(m.index + m[0].length, m.index + m[0].length + 160);
      if (!/^\s*[a-zα-ω]{3,}/.test(afterTop)) continue;
      if (title) {
        const h = headingIn(afterTop.slice(0, 120), title);
        const words = significantWords(title);
        const ok = h ? significantWords(h).length >= Math.min(2, words.length) : (words.length === 1 && afterTop.trim().startsWith(words[0]));
        if (!ok) continue;
      }
      return i;
    }
  }
  return -1;
}

function sectionHeading(page, a, b, title) {
  const text = full(page);
  const m = new RegExp(`(?:^|\\s)(${a} ${b}(?:\\s)(?!\\d)(?:[^\\s]+\\s?){1,5})`).exec(text);
  if (!m) return "";
  return m[1].trim();
}

// Pages whose top region carries the chapter title (heading or running header).
function titleRun(index, title, number, floor = -1, ceiling = Infinity) {
  const words = significantWords(title);
  if (!words.length) return null;
  const tnorm = N(title);
  const hits = [];
  index.pages.forEach((p, i) => {
    if (index.isToc[i] || i <= floor || i >= ceiling) return;
    const head = topText(p).slice(0, 220);
    let h = headingIn(head, title) || (words.length === 1 && tnorm.length >= 5 && (" " + head + " ").includes(" " + tnorm + " ") ? tnorm : "");
    if (!h) return;
    const contiguous = significantWords(h).length / words.length;
    const headWords = new Set(head.split(" "));
    const bag = words.filter((w) => headWords.has(w)).length / words.length;
    const covered = Math.max(contiguous, words.length >= 3 ? bag : 0);
    if (covered < (words.length <= 2 ? 1 : 0.75)) return;
    if (significantWords(h).length < Math.min(2, words.length)) return;
    const before = head.slice(Math.max(0, head.indexOf(N(h)) - 40), Math.max(0, head.indexOf(N(h))));
    const labelled = /(?:\d+\s*(?:η|ο)?|πρωτη|δευτερη|τριτη|τεταρτη|πεμπτη|εκτη|εβδομη|ογδοη|ενατη|δεκατη)\s+(?:ενοτητα|κεφαλαιο)\s*$/.test(before);
    hits.push({ i, h, covered, labelled });
  });
  if (!hits.length) return null;
  const runs = [];
  for (const hit of hits) {
    const cur = runs[runs.length - 1];
    if (cur && hit.i - cur.end <= 4) { cur.end = hit.i; cur.count++; cur.covered = Math.max(cur.covered, hit.covered); }
    else runs.push({ start: hit.i, end: hit.i, count: 1, heading: hit.h, covered: hit.covered, labelled: hit.labelled });
  }
  const evidence = (run) => {
    const page = index.pages[run.start];
    const text = full(page).slice(0, 700);
    let score = Math.min(run.count, 10);
    if (number && (new RegExp(`(?:^|\\s)${number} 1(?:\\s)(?!\\d)`).test(text) || new RegExp(`^(?:\\d{1,3}\\s+)?${number}(?:\\s+${number})*\\s+[a-zα-ω]`).test(full(page)) || markerRegexes(index.kind, number).some((re) => re.test(despace(text))) ||
      new RegExp(`(?:^|\\s)${number}(?:η|ο)?\\s+(?:ενοτητα|κεφαλαιο)(?:\\s|$)`).test(text))) score += 20;
    if (number && run.start > 0 && markerRegexes(index.kind, number).some((re) => re.test(despace(full(index.pages[run.start - 1]).slice(0, 400))))) score += 20;
    return score;
  };
  runs.forEach((r) => { r.score = evidence(r); });
  // With numeric evidence the chapter opens at its first run; otherwise prefer the longest run.
  const evidenced = (r) => (r.score >= 20 ? 1 : 0);
  runs.sort((a, b) => evidenced(b) - evidenced(a) || (evidenced(a) ? a.start - b.start : b.score - a.score || b.count - a.count) || b.covered - a.covered || a.start - b.start);
  const best = runs[0];
  const generic = words.length < 2 || tnorm.length < 12;
  // A single heading page is enough only for a specific (≥3 words, ≥80 % present) title.
  // "4η Ενότητα Ταξίδια": a labelled heading, unique in the book outside the front matter.
  const labelledRuns = runs.filter((r) => r.labelled && r.covered === 1 && r.start >= (index.front || 0));
  if (labelledRuns.length === 1) {
    const r = labelledRuns[0];
    return { ...r, end: Math.max(r.end, r.start), confidence: "high", score: 20 + r.score };
  }
  const strongSingle = best.count === 1 && words.length >= 3 && best.covered >= 0.8 &&
    runs.filter((r) => r.covered >= 0.8).length === 1;
  if (number && best.score < 20 && (generic || (best.count < 3 && !strongSingle))) return null;
  if (!number && ((best.count < 2 && !strongSingle) || (generic && best.count < 3))) return null;
  if (!evidenced(best) && runs[1] && runs[1].score === best.score && runs[1].count === best.count && runs[1].covered === best.covered) return null; // ambiguous
  return { ...best, confidence: best.score >= 20 || strongSingle ? "high" : "medium" };
}

// Label → { kind, number, title, sections, bookHint }
export function parseTopicLabel(label) {
  let raw = String(label || "").replace(/\s+/g, " ").trim();
  let bookHint = "";
  const prefix = raw.match(/^(Άλγεβρα|Γεωμετρία|Χημεία|Βιολογία|Φυσική|ΜΕΚ\s+Ι+|Τόμος\s+[Α-Ω]΄?)\s+—\s+/);
  if (prefix) { bookHint = prefix[1]; raw = raw.slice(prefix[0].length); }
  const sections = [...raw.matchAll(/§\s*(\d+(?:\.\d+)+)/g)].map((m) => m[1]);
  let m;
  // "Κεφάλαιο 2.1 — Πρόβλημα" → section 2.1
  if ((m = raw.match(/^(?:Κεφάλαιο|ΚΕΦΑΛΑΙΟ|Κεφ\.?)\s*(\d+)\.(\d+)\s*(?:[—:–-]\s*(.*))?$/))) {
    return { kind: "chapter", number: +m[1], title: "", section: [+m[1], +m[2]], sectionTitle: clean(m[3]), sections, bookHint };
  }
  // "Κεφάλαιο 9 — μόνο §9.3 Από τον Web 1.0 στον Web X.0" → section 9.3
  if ((m = raw.match(/^(?:Κεφάλαιο|ΚΕΦΑΛΑΙΟ)\s*(\d+)\s*[—:–-]\s*μόνο\s*§\s*(\d+)\.(\d+)\s*(.*)$/))) {
    return { kind: "chapter", number: +m[1], title: "", section: [+m[2], +m[3]], sectionTitle: clean(m[4]), sections, bookHint };
  }
  if ((m = raw.match(/^Unit\s+(\d+)\s*(?:[—:–-]\s*(.*))?$/i))) return { kind: "english", number: +m[1], title: clean(m[2]), sections, bookHint };
  // Curriculum numbering (not the book's): grounded only through GUIDANCE_UNIT_MAP.
  if ((m = raw.match(/^(?:ΔΙΔΑΚΤΙΚΗ\s+ΕΝΟΤΗΤΑ|Διδακτική\s+ενότητα)\s+(\d+)\s*(?:[—:–-]\s*(.*))?$/i))) return { kind: "curriculum-unit", number: +m[1], title: clean(m[2]), sections, bookHint };
  if ((m = raw.match(/^Θ\.?\s*Ε\.?\s*(\d+)\s*(?:[—:–-]\s*(.*))?$/))) return { kind: "theme", number: +m[1], title: clean(m[2]), sections, bookHint };
  if ((m = raw.match(/^(?:Ενότητα|ενότητα|ΕΝΟΤΗΤΑ)\s+(\d+)(?:η)?\s*(?:[—:–.-]\s*(.*))?$/))) return { kind: "unit", number: +m[1], title: clean(m[2]), sections, bookHint };
  if ((m = raw.match(/^(?:Κεφάλαιο|Κεφαλαίο|ΚΕΦΑΛΑΙΟ|κεφάλαιο|κεφαλαίο|Κεφ)\.?\s*(\d+)(?:ο|ον)?\.?(?!\.\d)\s*(?:\([^)]*\)\s*)?(?:[—:–.-]\s*)?(.*)$/))) {
    return { kind: "chapter", number: +m[1], title: clean(m[2]), sections, bookHint };
  }
  if ((m = raw.match(/^(\d{1,2})\.\s+(.{4,})$/))) return { kind: "chapter", number: +m[1], title: clean(m[2]), sections, bookHint };
  // "Χημεία Α΄ Λυκείου, Κεφάλαιο 4 — Στοιχειομετρία ..." → book hint + chapter
  if ((m = raw.match(/^(.{3,60}?),\s*(?:Κεφάλαιο|ΚΕΦΑΛΑΙΟ)\s*(\d+)\s*(?:[—:–-]\s*(.*))?$/))) return { kind: "chapter", number: +m[2], title: clean(m[3]), sections, bookHint: m[1] };
  // "Γεωργικές Εγκαταστάσεις — Κεφάλαιο 1: ..." → book hint + chapter
  if ((m = raw.match(/^(.{3,60}?)\s+—\s+(?:Κεφάλαιο|ΚΕΦΑΛΑΙΟ)\s*(\d+)\s*(?:[—:–-]\s*(.*))?$/))) return { kind: "chapter", number: +m[2], title: clean(m[3]), sections, bookHint: m[1] };
  return { kind: "chapter", number: 0, title: clean(raw), sections, bookHint };
}

// Guidance instructions written where a title would be ("Διδάσκεται ως έχει…") are not titles.
const INSTRUCTION_START = /^(?:\d+(?:\.\d+)+|\d+\.?\s*[&,]|Διδάσκ|Διδασκ|Προτείν|Πολύ\s|Συνοπτικ|Τα\s+περιεχόμενα|Το\s+περιεχόμενο|Στα\s+πλαίσια|Στο\s+κεφάλαιο|Από\s+(?:το|την|τη|τα)\s|Το\s+κεφάλαιο|Τα\s+κεφάλαια|Να\s|Θα\s|Δίνεται|Παραλείπ|Όλο\s|Ολόκληρο|και\s+Κεφάλαιο|Εκτός|Μόνο)/i;

function clean(value) {
  if (INSTRUCTION_START.test(String(value || "").trim())) return "";
  let s = String(value || "")
    .replace(/\((?:εκτός|εκτος|πλην)[^)]*\)?/gi, " ")
    .replace(/·.*$/, " ")
    .replace(/§.*$/, " ")
    .replace(/(?:^|\s)(?:μόνο|ολόκληρο το κεφάλαιο|Διδάσκ|Διδασκ|Δίνεται|Παραλείπεται|Το κεφάλαιο|Τα κεφάλαια|Να διδαχθ|θα διδαχθ|διδάσκ)[\s\S]*$/i, " ")
    .replace(/^\s*[—:–-]\s*/, "")
    .replace(/\s+/g, " ").trim();
  if (/^(?:\d+(?:\.\d+)*[,\s]*)+$/.test(s)) s = "";
  return s;
}
