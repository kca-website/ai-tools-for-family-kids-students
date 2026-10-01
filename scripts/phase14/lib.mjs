// Shared helpers for the Phase 14 Lyceum schoolbook-source inventory.
// Pure functions only: no network, no file system.

export function decodeEntities(s) {
  return String(s)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

export function stripTags(s) {
  return decodeEntities(String(s).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

// Accent-/case-/punctuation-insensitive form used for strict equality only.
export function norm(s) {
  return String(s || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/ς/g, "σ")
    .replace(/[«»"“”'’‘΄`´·.,:;()\[\]\/\\\-–—_!?…]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const ARTICLES = new Set(["ο", "η", "το", "οι", "τα", "του", "της", "των", "τον", "την", "τους", "τις", "ενα", "μια", "και"].map((w) => norm(w)));
export function titleKey(s) {
  return norm(s).split(" ").filter((w) => w && !ARTICLES.has(w)).join(" ");
}

// Splits a leading section number off a label: "2.1 Foo" -> {num:"2.1", title:"Foo"}.
export function splitNumber(label) {
  const t = String(label || "").trim();
  let m = t.match(/^(\d+(?:\.\d+)+)\s*[.:]?\s*(?:[–-]\s*(\d+(?:\.\d+)+)\s*[.:]?\s*)?(.*)$/);
  if (m) return { num: m[1], numEnd: m[2] || null, title: m[3].trim() };
  m = t.match(/^(Ε\.?\d+)\s+(.*)$/);
  if (m) return { num: m[1].replace(".", ""), numEnd: null, title: m[2].trim() };
  m = t.match(/^(\d+)\s*[.:]?\s+(?=\D)(.*)$/);
  if (m) return { num: m[1], numEnd: null, title: m[2].trim() };
  return { num: null, numEnd: null, title: t };
}

export function stem(w) { return w.length > 5 ? w.slice(0, 5) : w; }
export function wordList(s) {
  return titleKey(s).split(" ").filter((w) => w.length > 2);
}
// Two words match when they share a stem prefix: >= 4 chars and >= 75% of the shorter word
// (tolerates Greek inflection: βάρος/βάρους, έργο/έργου), or are equal.
function wordsMatch(a, b) {
  if (a === b) return true;
  const n = Math.min(a.length, b.length);
  if (n < 4) return false;
  let i = 0;
  while (i < n && a[i] === b[i]) i++;
  return i >= 4 && i >= Math.ceil(n * 0.75);
}
// Overlap coefficient on word stems; used only as a guard next to an equal section number.
export function overlap(a, b) {
  const A = wordList(a), B = wordList(b);
  if (!A.length || !B.length) return 0;
  const small = A.length <= B.length ? A : B, big = A.length <= B.length ? B : A;
  let n = 0;
  for (const w of small) if (big.some((x) => wordsMatch(w, x))) n++;
  return n / small.length;
}
export function sharedWords(a, b) {
  const A = wordList(a), B = wordList(b);
  const small = A.length <= B.length ? A : B, big = A.length <= B.length ? B : A;
  return small.filter((w) => big.some((x) => wordsMatch(w, x))).length;
}
export function wordSet(s) { return new Set(wordList(s).map(stem)); }

export function officialEbooksUrl(u) {
  try {
    const p = new URL(u);
    return p.protocol === "https:" && /(^|\.)ebooks\.edu\.gr$/i.test(p.hostname);
  } catch (_) { return false; }
}

// Extracts numbered headings from one ebook page.
// Works on a linear token stream so it copes with the several layouts used by
// ebooks.edu.gr books ("2.1 Title" in one node, or "1.1.5" and "Title" in two cells).
// Returns [{num, title, anchor|null}].
export function extractInPageHeadings(rawHtml) {
  const html = String(rawHtml).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "");
  const tokens = [];
  const BLOCK = /^\/?(?:p|div|td|th|tr|li|ul|ol|br|h[1-6]|table|tbody|section|article|body|center|blockquote)\b/i;
  let buf = "", anchor = null;
  const flush = () => {
    const t = decodeEntities(buf).replace(/\s+/g, " ").trim();
    if (t) tokens.push({ t, anchor });
    buf = ""; anchor = null;
  };
  const re = /<([^>]*)>|([^<]+)/g;
  let m;
  while ((m = re.exec(html))) {
    if (m[1] !== undefined) {
      if (BLOCK.test(m[1])) flush();
      const a = m[1].match(/\b(?:id|name)="([^"]+)"/i);
      if (a && !anchor) anchor = a[1];
      buf += " ";
    } else buf += m[2];
  }
  flush();
  const out = [];
  const seen = new Set();
  const NUM = "(?:\\d+(?:\\.\\d+)+|Ε\\.?\\d+)";
  const same = new RegExp("^(" + NUM + ")\\.?\\s+(\\S.{2,180})$");
  const alone = new RegExp("^(" + NUM + ")\\.?$");
  for (let i = 0; i < tokens.length; i++) {
    const { t, anchor } = tokens[i];
    let num = null, title = null;
    let mm = t.match(same);
    if (mm) { num = mm[1]; title = mm[2]; }
    else if ((mm = t.match(alone)) && tokens[i + 1] && tokens[i + 1].t.length >= 3 && tokens[i + 1].t.length <= 180 && !alone.test(tokens[i + 1].t)) {
      num = mm[1]; title = tokens[i + 1].t;
    }
    if (!num) continue;
    num = num.replace("Ε.", "Ε");
    const key = num + "|" + title;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ num, title, anchor });
  }
  return out;
}

// ---- option / menu parsing --------------------------------------------------------------
export function parseOptions(html) {
  const out = [];
  for (const m of String(html).matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/gi)) {
    const v = (m[1].match(/\bvalue="([^"]+)"/i) || [])[1];
    if (!v) continue;
    out.push({ value: v, label: stripTags(m[2]) });
  }
  return out;
}

const LATIN_E = /^E(?=\.?\d)/; // Latin E typed instead of Greek Ε in section ids
export function normNum(n) {
  if (!n) return null;
  return String(n).replace(/\.$/, "").replace(LATIN_E, "Ε").replace("Ε.", "Ε");
}

export function stripChapterPrefix(label) {
  return String(label || "").replace(/^\s*(?:ΚΕΦΑΛΑΙΟ|Κεφάλαιο|Κεφ\.?)\s*\d+\s*[:.\-–]?\s*/i, "").trim();
}

// Drops trailing editorial notes such as "(με τις επίσημες εξαιρέσεις)" from a site label.
export function stripNote(label) {
  return String(label || "").replace(/\s*\((?:με|εκτός)[^)]*\)\s*$/i, "").trim();
}

// Builds heading entries for one book from its parsed menu and fetched pages.
// pages: Map(file -> html). Returns [{file, anchor, num, title, src}].
export function buildBookEntries(options, pages) {
  const entries = [];
  const seen = new Set();
  const add = (e) => {
    const k = [e.file, e.num || "", e.title].join("|");
    if (seen.has(k)) return;
    seen.add(k); entries.push(e);
  };
  const tocFiles = new Set();
  for (const f of new Set(options.map((o) => o.value))) {
    const labels = options.filter((o) => o.value === f).map((o) => o.label);
    if (labels.some((l) => /περιεχ[όο]μενα/i.test(l)) && !labels.some((l) => /κεφ[άα]λαιο/i.test(l))) tocFiles.add(f);
  }
  for (const o of options) {
    if (tocFiles.has(o.value)) continue;
    const bare = stripChapterPrefix(o.label);
    const sp = splitNumber(bare);
    add({ file: o.value, anchor: null, num: normNum(sp.num), title: sp.title || bare, src: "menu", menuLabel: o.label });
  }
  for (const [file, html] of pages) {
    if (tocFiles.has(file)) continue;
    for (const h of extractInPageHeadings(html)) add({ file, anchor: h.anchor, num: normNum(h.num), title: h.title, src: "page" });
  }
  return entries;
}
