// Fetch a small, section-scoped excerpt from official Greek schoolbook HTML pages.
// Official-book grounding coverage expands incrementally from verified HTML section patterns.

const BOOKS = {
  "istoria-b-gymnasiou": {
    title: "Μεσαιωνική και Νεότερη Ιστορία Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2198/Istoria_B-Gymnasiou_html-empl/",
    mode: "history",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/"
  },
  "mathimatika-b-gymnasiou": {
    title: "Μαθηματικά Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/",
    mode: "mathB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/"
  },
  "chimeia-b-gymnasiou": {
    title: "Χημεία Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2206/Chimeia_B-Gymnasiou_html-empl/",
    mode: "chemistryB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/"
  },
  "physics-gymnasiou": {
    title: "Φυσική Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2204/Fysiki_B-Gymnasiou_html-empl/",
    mode: "numeric"
  },
  "biologia-a-gymnasiou": {
    title: "Βιολογία Α΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/",
    mode: "biologyA"
  },
  "biologia-b-gymnasiou": {
    title: "Βιολογία Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/",
    mode: "biologyB"
  },
  "biologia-g-gymnasiou": {
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
  "math-b-gymnasiou": "mathimatika-b-gymnasiou",
  "chemistry-b-gymnasiou": "chimeia-b-gymnasiou",
  "fysiki-b-gymnasiou": "physics-gymnasiou",
  "biology-a-gymnasiou": "biologia-a-gymnasiou",
  "biology-b-gymnasiou": "biologia-b-gymnasiou",
  "biology-g-gymnasiou": "biologia-g-gymnasiou"
};

// Exact 2026-27 History B curriculum allowlist, verified against the official
// IEP annual guidance. Parent nodes aggregate only their included descendants;
// pages that exist in the book but are absent from this map fail closed.
const HISTORY_B_2026_2027_PATHS = Object.freeze({
  "1": ["index1_1_1.html", "index1_2_1.html", "index1_2_2.html"],
  "1.1": ["index1_1_1.html"],
  "1.1.1": ["index1_1_1.html"],
  "1.2": ["index1_2_1.html", "index1_2_2.html"],
  "1.2.1": ["index1_2_1.html"],
  "1.2.2": ["index1_2_2.html"],
  "2": ["index2_1_1.html", "index2_1_2.html", "index2_2_1.html", "index2_2_2.html"],
  "2.1": ["index2_1_1.html", "index2_1_2.html"],
  "2.1.1": ["index2_1_1.html"],
  "2.1.2": ["index2_1_2.html"],
  "2.2": ["index2_2_1.html", "index2_2_2.html"],
  "2.2.1": ["index2_2_1.html"],
  "2.2.2": ["index2_2_2.html"],
  "3": ["index3_1_1.html", "index3_1_2.html", "index3_1_3.html", "index3_1_4.html", "index3_1_5.html", "index3_1_6.html", "index3_1_7.html", "index3_2_1.html", "index3_2_2.html"],
  "3.1": ["index3_1_1.html", "index3_1_2.html", "index3_1_3.html", "index3_1_4.html", "index3_1_5.html", "index3_1_6.html", "index3_1_7.html"],
  "3.1.1": ["index3_1_1.html"],
  "3.1.2": ["index3_1_2.html"],
  "3.1.3": ["index3_1_3.html"],
  "3.1.4": ["index3_1_4.html"],
  "3.1.5": ["index3_1_5.html"],
  "3.1.6": ["index3_1_6.html"],
  "3.1.7": ["index3_1_7.html"],
  "3.2": ["index3_2_1.html", "index3_2_2.html"],
  "3.2.1": ["index3_2_1.html"],
  "3.2.2": ["index3_2_2.html"],
  "4": ["index4_1_1.html", "index4_1_2.html", "index4_1_3.html", "index4_2_1.html", "index4_2_2.html", "index4_3_1.html", "index4_3_2.html"],
  "4.1": ["index4_1_1.html", "index4_1_2.html", "index4_1_3.html"],
  "4.1.1": ["index4_1_1.html"],
  "4.1.2": ["index4_1_2.html"],
  "4.1.3": ["index4_1_3.html"],
  "4.2": ["index4_2_1.html", "index4_2_2.html"],
  "4.2.1": ["index4_2_1.html"],
  "4.2.2": ["index4_2_2.html"],
  "4.3": ["index4_3_1.html", "index4_3_2.html"],
  "4.3.1": ["index4_3_1.html"],
  "4.3.2": ["index4_3_2.html"],
  "5": ["index5_1.html", "index5_4.html"],
  "5.1": ["index5_1.html"],
  "5.4": ["index5_4.html"],
  "6": ["index6_1_2.html", "index6_1_3.html"],
  "6.1": ["index6_1_2.html", "index6_1_3.html"],
  "6.1.2": ["index6_1_2.html"],
  "6.1.3": ["index6_1_3.html"],
  "7": ["index7_1_1.html", "index7_1_2.html", "index7_1_3.html", "index7_1_4.html", "index7_2.html"],
  "7.1": ["index7_1_1.html", "index7_1_2.html", "index7_1_3.html", "index7_1_4.html"],
  "7.1.1": ["index7_1_1.html"],
  "7.1.2": ["index7_1_2.html"],
  "7.1.3": ["index7_1_3.html"],
  "7.1.4": ["index7_1_4.html"],
  "7.2": ["index7_2.html"]
});

const MATH_B_2026_2027_PATHS = Object.freeze({
  "A.1.1": ["indexA1_1.html"],
  "A.1.2": ["indexA1_2.html"],
  "A.1.4": ["indexA1_4.html"],
  "A.2.1": ["indexA2_1.html"],
  "A.2.2": ["indexA2_2.html"],
  "A.2.3": ["indexA2_3.html"],
  "A.3.1": ["indexA3_1.html"],
  "A.3.2": ["indexA3_2.html"],
  "A.3.3": ["indexA3_3.html"],
  "A.3.4": ["indexA3_4.html"],
  "A.3.5": ["indexA3_5.html"],
  "A.4.1": ["indexA4_1.html"],
  "A.4.2": ["indexA4_2.html"],
  "A.4.5": ["indexA4_5.html"],
  "B.1.1": ["indexB1_1.html"],
  "B.1.2": ["indexB1_2.html"],
  "B.1.3": ["indexB1_3.html"],
  "B.1.4": ["indexB1_4.html"],
  "B.2.1": ["indexB2_1.html"],
  "B.2.2": ["indexB2_2.html"],
  "B.3.1": ["indexB3_1.html"],
  "B.3.2": ["indexB3_2.html"],
  "B.3.3": ["indexB3_3.html"],
  "B.3.5": ["indexB3_5.html"],
  "B.4.2": ["indexB4_2.html"],
  "B.4.3": ["indexB4_3.html"],
  "B.4.4": ["indexB4_4.html"],
  "B.4.6": ["indexB4_6.html"]
});

const CHEMISTRY_B_2026_2027_PATHS = Object.freeze({
  "1.1": ["index1_1.html"],
  "1.2": ["index1_2.html"],
  "1.3": ["index1_3.html"],
  "2.1": ["index2_1.html"],
  "2.2": ["index2_2_1.html", "index2_2_2.html"],
  "2.3": ["index2_3_1.html", "index2_3_2.html", "index2_3_3.html"],
  "2.4": ["index2_4.html"],
  "2.5": ["index2_5.html"],
  "2.6": ["index2_6.html", "index2_6_2.html"],
  "2.7": ["index2_7.html"],
  "2.8": ["index2_8.html"],
  "2.9": ["index2_9.html"],
  "2.10": ["index2_10.html"],
  "2.11": ["index2_11.html"],
  "3.1": ["index3_1.html"],
  "3.2": ["index3_2.html"],
  "3.3": ["index3_3.html"],
  "3.4": ["index3_4.html"],
  "4.2": ["index4_2.html"]
});

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

  const directUrls = resolveDirectSourceUrls(subject, topic);
  if (book.officialSourceRequired && !directUrls.length) {
    return res.status(404).json({
      grounded: false,
      error: "section_not_resolved",
      bookTitle: book.title,
      schoolYear: book.schoolYear,
      curriculumSource: book.curriculumSource,
      message: "Η επιλογή δεν ανήκει στην επαληθευμένη ύλη 2026–27 ή δεν έχει ακριβή αντιστοίχιση σε επίσημη σελίδα."
    });
  }
  const path = directUrls.length ? "__direct__" : resolveSectionPath(book.mode, topic);
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

    if (directUrls.length) {
      sourceUrls = directUrls;
      const pages = await Promise.all(sourceUrls.map(fetchOfficialHtml));
      if (pages.some((html) => !html)) {
        return res.status(404).json({
          grounded: false,
          error: "official_source_unavailable",
          bookTitle: book.title,
          sourceUrls,
          message: "Μία ή περισσότερες επίσημες σελίδες της ενότητας δεν ήταν διαθέσιμες."
        });
      }
      combinedText = distributeOfficialPages(pages, sourceUrls, 42000);
    } else if (book.multi) {
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
      combinedText = distributeOfficialPages(pages, sourceUrls, 42000);
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

    const useful = book.multi ? combinedText : selectUsefulText(combinedText, topic);
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
      schoolYear: book.schoolYear || null,
      curriculumSource: book.curriculumSource || null,
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

function resolveDirectSourceUrls(subject, topic) {
  const t = normalize(topic);
  const a = "https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/";

  if (subject === "istoria-b-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveHistoryCurriculumPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "mathimatika-b-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveMathBCurriculumPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "chimeia-b-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveChemistryBCurriculumPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "biologia-a-gymnasiou") {
    // Current 2026–27 curriculum topics only. Do not expose the whole book as this year's syllabus.
    if (t.includes("οργανωση της ζωης") && t.includes("χαρακτηριστικ")) {
      return [a + "index1_1.html"];
    }
    if (t.includes("κυτταρο") && t.includes("μοναδα της ζωης")) {
      return [a + "index1_2.html"];
    }
    if (t.includes("οργανωση πολυκυτταρων οργανισμων")) {
      return [a + "index1_3.html"];
    }
    if (t.includes("αλληλεπιδρασεις και προσαρμογες")) {
      return [a + "index1_4.html"];
    }
    if (t.includes("φωτοσυνθεση")) {
      return [a + "index2_1.html"];
    }
    if (t.includes("προσληψη ουσιων και πεψη")) {
      return [a + "index2_2.html", a + "index2_3.html", a + "index2_4.html"];
    }
    if (t.includes("μεταφορα και αποβολη ουσιων")) {
      return [a + "index3_1.html", a + "index3_2.html", a + "index3_3.html", a + "index3_4.html"];
    }
    if (t.includes("αναπνοη στους οργανισμους και στον ανθρωπο")) {
      return [a + "index4_1.html", a + "index4_2.html", a + "index4_3.html", a + "index4_4.html"];
    }
    return [];
  }

  if (subject !== "biologia-b-gymnasiou") return [];
  const bg = "https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/";

  if (t.includes("στηριξη και κινηση σε μονοκυτταρους οργανισμους και φυτα")) {
    return [a + "index5_1.html", a + "index5_2.html"];
  }
  if (t.includes("στηριξη και κινηση σε ζωα") || t.includes("μυοσκελετικο συστημα")) {
    return [a + "index5_3.html", a + "index5_4.html"];
  }
  if (t.includes("αναπαραγωγη σε μονοκυτταρους οργανισμους και φυτα")) {
    return [a + "index6_1.html", a + "index6_2.html"];
  }
  if (t.includes("αναπαραγωγη στα ζωα και στον ανθρωπο")) {
    return [a + "index6_3.html", a + "index6_4.html"];
  }
  if (t.includes("κυτταρο και επιπεδα οργανωσης")) {
    return [a + "index1_2.html", a + "index1_3.html"];
  }
  if (t.includes("ομοιοσταση και ασθενειες")) {
    return [bg + "index4_1.html", bg + "index4_2.html"];
  }
  if (t.includes("αμυντικοι μηχανισμοι του ανθρωπου")) {
    return [bg + "index4_3.html"];
  }
  if (t.includes("τροπος ζωης και ασθενειες")) {
    return [bg + "index4_4.html"];
  }
  return [];
}

function resolveSectionPath(mode, topic) {
  const t = String(topic || "");

  if (mode === "biologyA" || mode === "biologyB") return "";

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
    return resolveHistoryCurriculumPaths(t)[0] || "";
  }

  return "";
}

function resolveHistoryCurriculumPaths(topic) {
  const key = historyTopicKey(topic);
  return key && HISTORY_B_2026_2027_PATHS[key]
    ? [...HISTORY_B_2026_2027_PATHS[key]]
    : [];
}

function historyTopicKey(topic) {
  const value = String(topic || "");
  const chapterMatch = value.match(/Κεφάλαιο\s+(\d+)/i);
  if (!chapterMatch) return "";

  const chapter = chapterMatch[1];
  const beforeTitle = value.slice(chapterMatch.index + chapterMatch[0].length).split(/—/)[0];
  const segments = [...beforeTitle.matchAll(/·\s*([ΙI]{1,3}|\d+)/gi)].map(match => match[1]);
  if (!segments.length) return chapter;

  const romanMap = { "Ι": 1, "ΙΙ": 2, "ΙΙΙ": 3, "I": 1, "II": 2, "III": 3 };
  const first = segments[0].toUpperCase();
  const firstNumber = romanMap[first] || (/^\d+$/.test(first) ? Number(first) : 0);
  if (!firstNumber) return "";
  if (segments.length === 1) return `${chapter}.${firstNumber}`;

  const lesson = Number(segments[1]);
  return Number.isInteger(lesson) && lesson > 0 ? `${chapter}.${firstNumber}.${lesson}` : "";
}

function resolveMathBCurriculumPaths(topic) {
  const key = mathBTopicKey(topic);
  return key && MATH_B_2026_2027_PATHS[key]
    ? [...MATH_B_2026_2027_PATHS[key]]
    : [];
}

function mathBTopicKey(topic) {
  const value = String(topic || "");
  const match = value.match(/Μέρος\s+([ΑAΒB])\s*·\s*(\d+)\.(\d+)/i);
  if (!match) return "";

  const part = /[ΑA]/i.test(match[1]) ? "A" : "B";
  const chapter = Number(match[2]);
  const section = Number(match[3]);
  if (!Number.isInteger(chapter) || chapter < 1 || !Number.isInteger(section) || section < 1) return "";
  return `${part}.${chapter}.${section}`;
}

function resolveChemistryBCurriculumPaths(topic) {
  const key = chemistryBTopicKey(topic);
  return key && CHEMISTRY_B_2026_2027_PATHS[key]
    ? [...CHEMISTRY_B_2026_2027_PATHS[key]]
    : [];
}

function chemistryBTopicKey(topic) {
  const value = String(topic || "");
  const match = value.match(/(?:Γενική\s+Ενότητα\s+\d+\s*·\s*)?(\d+)\.(\d+)/i);
  if (!match) return "";
  const chapter = Number(match[1]);
  const section = Number(match[2]);
  if (!Number.isInteger(chapter) || chapter < 1 || !Number.isInteger(section) || section < 1) return "";
  return `${chapter}.${section}`;
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

function distributeOfficialPages(pages, urls, maxChars) {
  const rows = pages.map((html, i) => ({
    url: urls[i] || "",
    text: html ? htmlToText(html) : ""
  })).filter(row => row.text.length >= 120);
  if (!rows.length) return "";

  const overhead = rows.reduce((n, row) => n + (row.url ? row.url.length + 24 : 0), 0);
  const budget = Math.max(1200, maxChars - overhead);
  const perPage = Math.max(900, Math.floor(budget / rows.length));

  return rows.map(row => {
    const label = row.url ? "[Official page: " + row.url + "]\n" : "";
    const text = row.text;
    if (text.length <= perPage) return label + text;
    const head = Math.floor(perPage * 0.72);
    const tail = perPage - head;
    return label + text.slice(0, head) + "\n[… official page excerpt …]\n" + text.slice(-tail);
  }).join("\n\n").slice(0, maxChars);
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

module.exports._test = Object.freeze({
  historyTopicKey,
  resolveHistoryCurriculumPaths,
  mathBTopicKey,
  resolveMathBCurriculumPaths,
  chemistryBTopicKey,
  resolveChemistryBCurriculumPaths,
  resolveSectionPath,
  HISTORY_B_2026_2027_PATHS,
  MATH_B_2026_2027_PATHS,
  CHEMISTRY_B_2026_2027_PATHS
});
