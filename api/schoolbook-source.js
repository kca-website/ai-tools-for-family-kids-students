// Fetch a small, section-scoped excerpt from official Greek schoolbook HTML pages.
// Official-book grounding coverage expands incrementally from verified HTML section patterns.

const BOOKS = {
  "istoria-b-gymnasiou": {
    title: "Μεσαιωνική και Νεότερη Ιστορία Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2198/Istoria_B-Gymnasiou_html-empl/",
    mode: "history"
  },
  "physics-gymnasiou": {
    title: "Φυσική Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2204/Fysiki_B-Gymnasiou_html-empl/",
    mode: "numeric"
  },
  "biologia-b-gymnasiou": {
    title: "Βιολογία Β΄ και Γ΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/",
    mode: "numeric"
  },
  "archaia-glossa-a-gymnasiou": {
    title: "Αρχαία Ελληνική Γλώσσα Α΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2244/Archaia-Elliniki-Glossa_A-Gymnasiou_html-empl/",
    mode: "unit2digit"
  },
  "archaia-glossa-b-gymnasiou": {
    title: "Αρχαία Ελληνική Γλώσσα Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2234/Archaia-Elliniki-Glossa_B-Gymnasiou_html-empl/",
    mode: "unit2digit"
  },
  "archaia-glossa-g-gymnasiou": {
    title: "Αρχαία Ελληνική Γλώσσα Γ΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2238/Archaia-Elliniki-Glossa_G-Gymnasiou_html-empl/",
    mode: "unit2digit"
  },
  "odysseia-a-gymnasiou": {
    title: "Ομηρικά Έπη – Οδύσσεια Α΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2232/Omirika-Epi-Odysseia_A-Gymnasiou_html-empl/",
    mode: "odyssey"
  },
  "iliada-b-gymnasiou": {
    title: "Ομηρικά Έπη – Ιλιάδα Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2296/Omirika-Epi-Iliada_B-Gymnasiou_empl/",
    mode: "iliadSequence"
  },
  "glossa-a-gymnasiou": {
    title: "Νεοελληνική Γλώσσα Α΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2256/Neoelliniki-Glossa_A-Gymnasiou_html-empl/",
    mode: "modernGreekA",
    multi: true
  },
  "glossa-b-gymnasiou": {
    title: "Νεοελληνική Γλώσσα Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2298/Neoelliniki-Glossa_B-Gymnasiou_empl/",
    mode: "modernGreekB",
    multi: true
  },
  "glossa-gymnasiou": {
    title: "Νεοελληνική Γλώσσα Γ΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2216/Neoelliniki-Glossa_G-Gymnasiou_html-empl/",
    mode: "modernGreekG",
    multi: true
  }
};

const ALIASES = {
  "fysiki-b-gymnasiou": "physics-gymnasiou",
  "biologia-g-gymnasiou": "biologia-b-gymnasiou",
  "biology-b-gymnasiou": "biologia-b-gymnasiou",
  "biology-g-gymnasiou": "biologia-b-gymnasiou"
};

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const rawSubject = clean(req.query?.subject, 120);
  const topic = clean(req.query?.topic, 500);
  const subject = ALIASES[rawSubject] || rawSubject;
  const book = BOOKS[subject];

  if (!book || !topic) {
    return res.status(404).json({
      grounded: false,
      error: "source_not_mapped",
      message: "Δεν υπάρχει ακόμη χαρτογραφημένη επίσημη πηγή για αυτή την επιλογή."
    });
  }

  const path = resolveSectionPath(book.mode, topic);
  if (!path) {
    return res.status(404).json({
      grounded: false,
      error: "section_not_resolved",
      bookTitle: book.title,
      message: "Δεν ταυτοποιήθηκε με ασφάλεια συγκεκριμένη σελίδα του σχολικού βιβλίου."
    });
  }

  try {
    let sourceUrls = [];
    let combinedText = "";

    if (book.multi) {
      sourceUrls = await discoverUnitPages(book, path);
      if (!sourceUrls.length) {
        return res.status(404).json({
          grounded: false,
          error: "official_source_unavailable",
          bookTitle: book.title,
          message: "Δεν βρέθηκαν οι επίσημες υποσελίδες της συγκεκριμένης ενότητας."
        });
      }
      const pages = await Promise.all(sourceUrls.slice(0, 12).map(fetchOfficialHtml));
      combinedText = pages.filter(Boolean).map((html, i) => {
        const label = sourceUrls[i] ? "\n\n[Official page: " + sourceUrls[i] + "]\n" : "";
        return label + htmlToText(html);
      }).join("\n\n");
    } else {
      const sourceUrl = new URL(path, book.base).toString();
      sourceUrls = [sourceUrl];
      const html = await fetchOfficialHtml(sourceUrl);
      if (!html) {
        return res.status(404).json({
          grounded: false,
          error: "official_source_unavailable",
          bookTitle: book.title,
          sourceUrl,
          message: "Η συγκεκριμένη σελίδα του επίσημου βιβλίου δεν ήταν διαθέσιμη."
        });
      }
      combinedText = htmlToText(html);
    }

    const useful = selectUsefulText(combinedText, topic);
    const sourceUrl = sourceUrls[0] || book.base;

    if (useful.length < 500) {
      return res.status(404).json({
        grounded: false,
        error: "source_too_short",
        bookTitle: book.title,
        sourceUrl,
        message: "Βρέθηκε η επίσημη πηγή, αλλά δεν εξήχθη αρκετό κείμενο για ασφαλή απάντηση."
      });
    }

    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    return res.status(200).json({
      grounded: true,
      subject,
      topic,
      bookTitle: book.title,
      sourceUrl,
      sourceUrls,
      text: useful.slice(0, 42000)
    });
  } catch (err) {
    return res.status(502).json({
      grounded: false,
      error: "official_source_fetch_failed",
      bookTitle: book.title,
      message: "Δεν ήταν δυνατή η ανάκτηση της επίσημης σχολικής πηγής."
    });
  }
};

function clean(value, max) {
  return String(value || "").trim().slice(0, max);
}

function resolveSectionPath(mode, topic) {
  const t = String(topic || "");

  if (mode === "numeric") {
    let m = t.match(/^\s*(\d+)\.(\d+)\b/);
    if (m) return `index${m[1]}_${m[2]}.html`;

    m = t.match(/Κεφάλαιο\s+(\d+)/i);
    if (m) return `index${m[1]}.html`;
    return "";
  }

  if (mode === "unit2digit") {
    const m = t.match(/Ενότητα\s+(\d+)/i);
    if (!m) return "";
    return `index${String(m[1]).padStart(2, "0")}.html`;
  }

  if (mode === "odyssey") {
    const m = t.match(/^\s*(\d+)(?:η|ή|ὴ)?\s+Ενότητα/i) || t.match(/Ενότητα\s+(\d+)/i);
    if (!m) return "";
    return `index_${String(m[1]).padStart(2, "0")}.html`;
  }

  if (mode === "iliadSequence") {
    const m = t.match(/^\s*(\d+)(?:η|ή|ὴ)?\s+Ενότητα/i);
    if (!m) return "";
    const n = Number(m[1]);
    if (!Number.isInteger(n) || n < 1 || n > 21) return "";
    return `index${String(n + 1).padStart(2, "0")}.html`;
  }

  if (mode === "modernGreekA" || mode === "modernGreekG") {
    const m = t.match(/(\d+)(?:η|ή)?\s+(?:ενότητα|ENOTHTA)/i);
    if (!m) return "";
    const n = Number(m[1]);
    if (!Number.isInteger(n) || n < 1 || n > 10) return "";
    const letter = String.fromCharCode("b".charCodeAt(0) + n - 1);
    return `index${letter}_`;
  }

  if (mode === "modernGreekB") {
    const m = t.match(/(\d+)(?:η|ή)?\s+ενότητα/i);
    if (!m) return "";
    const n = Number(m[1]);
    if (!Number.isInteger(n) || n < 1 || n > 9) return "";
    return `en${n}_`;
  }

  if (mode === "history") {
    const chapter = (t.match(/Κεφάλαιο\s+(\d+)/i) || [])[1];
    if (!chapter) return "";

    const roman = (t.match(/·\s*(Ι{1,3})\s*(?:·|—|$)/i) || [])[1] || "";
    const tail = (t.match(/·\s*(\d+)\s*—/) || [])[1] || "";

    const romanMap = { "Ι": 1, "ΙΙ": 2, "ΙΙΙ": 3 };
    if (roman && tail) return `index${chapter}_${romanMap[roman.toUpperCase()]}_${tail}.html`;
    if (roman) return `index${chapter}_${romanMap[roman.toUpperCase()]}.html`;

    const direct = (t.match(/Κεφάλαιο\s+\d+\s*·\s*(\d+)\s*—/i) || [])[1];
    if (direct) return `index${chapter}_${direct}.html`;

    return `index${chapter}.html`;
  }

  return "";
}

async function fetchOfficialHtml(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "aitools4kids.gr educational source grounding",
      "Accept": "text/html,application/xhtml+xml"
    },
    redirect: "follow"
  });
  return response.ok ? response.text() : "";
}

async function discoverUnitPages(book, prefix) {
  const rootHtml = await fetchOfficialHtml(book.base);
  if (!rootHtml) return [];

  const hrefs = [];
  const re = /href\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(rootHtml))) {
    const href = String(m[1] || "").trim();
    const file = href.split(/[?#]/)[0].split("/").pop() || "";
    if (!file.toLowerCase().startsWith(prefix.toLowerCase())) continue;
    if (!/\.html?$/i.test(file)) continue;
    const absolute = new URL(href, book.base).toString();
    if (!hrefs.includes(absolute)) hrefs.push(absolute);
  }

  // Some book roots expose only a subset of links to crawlers. Probe a bounded
  // sequence using the verified filename scheme and keep only successful pages.
  if (!hrefs.length) {
    const candidates = [];
    for (let i = 0; i <= 10; i++) {
      const ext = book.mode === "modernGreekA" ? ".htm" : ".html";
      candidates.push(new URL(prefix + i + ext, book.base).toString());
    }
    const checked = await Promise.all(candidates.map(async url => {
      try {
        const response = await fetch(url, {
          method: "HEAD",
          headers: { "User-Agent": "aitools4kids.gr educational source grounding" },
          redirect: "follow"
        });
        return response.ok ? url : "";
      } catch (_) { return ""; }
    }));
    checked.filter(Boolean).forEach(url => hrefs.push(url));
  }

  return hrefs.slice(0, 12);
}

function htmlToText(html) {
  return decodeEntities(
    String(html || "")
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
      .replace(/<(br|\/p|\/div|\/li|\/tr|\/h[1-6]|\/section)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function decodeEntities(s) {
  const named = {
    nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
    laquo: "«", raquo: "»", ndash: "–", mdash: "—", middot: "·"
  };
  return String(s || "")
    .replace(/&([a-zA-Z]+);/g, (m, n) => Object.prototype.hasOwnProperty.call(named, n) ? named[n] : m)
    .replace(/&#(\d+);/g, (_, n) => {
      const code = Number(n);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => {
      const code = parseInt(n, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    });
}

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9α-ω]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function selectUsefulText(text, topic) {
  const full = String(text || "").trim();
  if (full.length <= 42000) return full;

  const words = normalize(topic)
    .split(" ")
    .filter(w => w.length >= 4 && !["κεφαλαιο", "ενοτητα", "γυμνασιου"].includes(w))
    .slice(0, 12);

  if (!words.length) return full.slice(0, 42000);

  const norm = normalize(full);
  let best = -1;
  for (const word of words) {
    const i = norm.indexOf(word);
    if (i >= 0 && (best < 0 || i < best)) best = i;
  }

  // Normalized offsets are approximate; keep a broad window around the section body.
  if (best < 0) return full.slice(0, 42000);
  const start = Math.max(0, best - 4000);
  return full.slice(start, start + 42000);
}
