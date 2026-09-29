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
  "fysiki-b-gymnasiou": "physics-gymnasiou",
  "math-b-gymnasiou": "mathimatika-b-gymnasiou",
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


// Exact 2026-27 Mathematics B curriculum allowlist, verified against the
// official IEP annual guidance. It includes the six explicitly prescribed
// A-Gymnasium review sections (7.1-7.6), the listed 7.7-7.9 sections, and
// optional sections named in the guidance. All A-Gymnasium sections are
// non-examinable. Book sections absent from this map fail closed.
const MATH_B_2026_2027_URLS = Object.freeze({
  "R7.1": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_1.html"
  ],
  "R7.2": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_2.html"
  ],
  "R7.3": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_3.html"
  ],
  "R7.4": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_4.html"
  ],
  "R7.5": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_5.html"
  ],
  "R7.6": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_6.html"
  ],
  "R7.7": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_7.html"
  ],
  "R7.8": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_8.html"
  ],
  "R7.9": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_9.html"
  ],
  "A1.1": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA1_1.html"
  ],
  "A1.2": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA1_2.html"
  ],
  "A1.4": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA1_4.html"
  ],
  "A2.1": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA2_1.html"
  ],
  "A2.2": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA2_2.html"
  ],
  "A2.3": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA2_3.html"
  ],
  "A3.1": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_1.html"
  ],
  "A3.2": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_2.html"
  ],
  "A3.3": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_3.html"
  ],
  "A3.4": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_4.html"
  ],
  "A3.5": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_5.html"
  ],
  "A4.1": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA4_1.html"
  ],
  "A4.2": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA4_2.html"
  ],
  "A4.5": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA4_5.html"
  ],
  "B1.1": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_1.html"
  ],
  "B1.2": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_2.html"
  ],
  "B1.3": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_3.html"
  ],
  "B1.4": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_4.html"
  ],
  "B2.1": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB2_1.html"
  ],
  "B2.2": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB2_2.html"
  ],
  "B3.1": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_1.html"
  ],
  "B3.2": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_2.html"
  ],
  "B3.3": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_3.html"
  ],
  "B3.5": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_5.html"
  ],
  "B4.2": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_2.html"
  ],
  "B4.3": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_3.html"
  ],
  "B4.4": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_4.html"
  ],
  "B4.6": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_6.html"
  ],
  "A1": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA1_1.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA1_2.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA1_4.html"
  ],
  "A2": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA2_1.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA2_2.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA2_3.html"
  ],
  "A3": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_1.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_2.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_3.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_4.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_5.html"
  ],
  "A4": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA4_1.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA4_2.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA4_5.html"
  ],
  "B1": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_1.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_2.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_3.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_4.html"
  ],
  "B2": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB2_1.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB2_2.html"
  ],
  "B3": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_1.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_2.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_3.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_5.html"
  ],
  "B4": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_2.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_3.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_4.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_6.html"
  ],
  "PA": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA1_1.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA1_2.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA1_4.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA2_1.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA2_2.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA2_3.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_1.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_2.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_3.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_4.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_5.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA4_1.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA4_2.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA4_5.html"
  ],
  "PB": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_1.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_2.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_3.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_4.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB2_1.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB2_2.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_1.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_2.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_3.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_5.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_2.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_3.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_4.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_6.html"
  ]
});

const MATH_B_2026_2027_SCOPE = Object.freeze({
  "R7.1": "Επανάληψη από το βιβλίο Α΄ Γυμνασίου (στο πλαίσιο των 8 ωρών για τις §7.1–7.6). Δεν αποτελεί εξεταστέα ύλη στη Β΄ Γυμνασίου.",
  "R7.2": "Επανάληψη από το βιβλίο Α΄ Γυμνασίου (στο πλαίσιο των 8 ωρών για τις §7.1–7.6). Δεν αποτελεί εξεταστέα ύλη στη Β΄ Γυμνασίου.",
  "R7.3": "Επανάληψη από το βιβλίο Α΄ Γυμνασίου (στο πλαίσιο των 8 ωρών για τις §7.1–7.6). Δεν αποτελεί εξεταστέα ύλη στη Β΄ Γυμνασίου.",
  "R7.4": "Επανάληψη από το βιβλίο Α΄ Γυμνασίου (στο πλαίσιο των 8 ωρών για τις §7.1–7.6). Δεν αποτελεί εξεταστέα ύλη στη Β΄ Γυμνασίου.",
  "R7.5": "Επανάληψη από το βιβλίο Α΄ Γυμνασίου (στο πλαίσιο των 8 ωρών για τις §7.1–7.6). Δεν αποτελεί εξεταστέα ύλη στη Β΄ Γυμνασίου.",
  "R7.6": "Επανάληψη από το βιβλίο Α΄ Γυμνασίου (στο πλαίσιο των 8 ωρών για τις §7.1–7.6). Δεν αποτελεί εξεταστέα ύλη στη Β΄ Γυμνασίου.",
  "R7.7": "Διδάσκεται από το βιβλίο Α΄ Γυμνασίου με την τροποποίηση της ετήσιας οδηγίας. Δεν αποτελεί εξεταστέα ύλη στη Β΄ Γυμνασίου.",
  "R7.8": "Διδάσκεται από το βιβλίο Α΄ Γυμνασίου. Δεν αποτελεί εξεταστέα ύλη στη Β΄ Γυμνασίου.",
  "R7.9": "Διδάσκεται από το βιβλίο Α΄ Γυμνασίου. Δεν αποτελεί εξεταστέα ύλη στη Β΄ Γυμνασίου.",
  "A1.1": "Να μη διδαχθεί ο τυπικός ορισμός της «μεταβλητής» στη σελίδα 11. Η έννοια να προσεγγιστεί περιγραφικά, με έμφαση στον ρόλο και τη σημασία της.",
  "A2.3": "Πρόσθετο/προαιρετικό περιεχόμενο. Προτείνεται να διδαχθεί ενιαία με το Μέρος Β΄ §1.4.",
  "A3.2": "Να μη διδαχθούν η εφαρμογή 2 στη σελίδα 62 και ο τύπος της απόστασης δύο σημείων στη σελίδα 63.",
  "A3.4": "Να μη διδαχθούν οι υποπαράγραφοι «Η εξίσωση της μορφής α·x + β·y = γ» και «Σημεία τομής της ευθείας α·x + β·y = γ με τους άξονες».",
  "A4.1": "Οι έννοιες πληθυσμός, μεταβλητή, δείγμα, δειγματοληψία, δημοσκόπηση, μέγεθος δείγματος και αντιπροσωπευτικότητα μπορούν να εξηγηθούν, αλλά δεν αποτελούν εξεταστέα ύλη.",
  "A4.5": "Να μη διδαχθεί η υποπαράγραφος «Μέση τιμή ομαδοποιημένης κατανομής».",
  "B2.2": "Να μη διδαχθεί η παρατήρηση (β) στη σελίδα 143. Μπορούν να επιλεγούν ασκήσεις από την §2.3 και να χρησιμοποιηθεί ο πίνακας τριγωνομετρικών αριθμών, αλλά η §2.3 δεν αποτελεί αυτοτελή επιλεγμένη ενότητα.",
  "B3.2": "Η υποπαράγραφος «Κατασκευή κανονικών πολυγώνων» είναι πρόσθετη/προαιρετική.",
  "B4.4": "Πρόσθετο/προαιρετικό περιεχόμενο. Η γνωριμία με τα στερεά των §4.4 και §4.6 προβλέπεται συνολικά σε μία διδακτική ώρα με κατάλληλο υλικό.",
  "B4.6": "Πρόσθετο/προαιρετικό περιεχόμενο. Η γνωριμία με τα στερεά των §4.4 και §4.6 προβλέπεται συνολικά σε μία διδακτική ώρα με κατάλληλο υλικό.",
  "A1": "Ισχύει η ειδική εξαίρεση της §1.1: να μη διδαχθεί ο τυπικός ορισμός της «μεταβλητής» στη σελίδα 11.",
  "A2": "Η §2.3 είναι πρόσθετη/προαιρετική και προτείνεται να διδαχθεί ενιαία με το Μέρος Β΄ §1.4.",
  "A3": "Στην §3.2 να μη διδαχθούν η εφαρμογή 2 στη σελίδα 62 και ο τύπος απόστασης δύο σημείων στη σελίδα 63. Στην §3.4 να μη διδαχθούν οι υποπαράγραφοι για την εξίσωση α·x + β·y = γ και τα σημεία τομής της με τους άξονες.",
  "A4": "Στην §4.1 οι βασικές έννοιες δειγματοληψίας μπορούν να εξηγηθούν αλλά δεν είναι εξεταστέες. Στην §4.5 να μη διδαχθεί η «Μέση τιμή ομαδοποιημένης κατανομής».",
  "B2": "Στην §2.2 να μη διδαχθεί η παρατήρηση (β) στη σελίδα 143. Επιτρέπεται επιλογή ασκήσεων από την §2.3, αλλά η §2.3 δεν είναι αυτοτελής επιλεγμένη ενότητα.",
  "B3": "Στην §3.2 η «Κατασκευή κανονικών πολυγώνων» είναι πρόσθετη/προαιρετική.",
  "B4": "Οι §4.4 και §4.6 είναι πρόσθετες/προαιρετικές και η γνωριμία με τα δύο στερεά προβλέπεται συνολικά σε μία διδακτική ώρα.",
  "PA": "Γονική επιλογή Άλγεβρας: ισχύουν όλες οι ειδικές εξαιρέσεις/σημειώσεις των §1.1, §2.3, §3.2, §3.4, §4.1 και §4.5. Μη χρησιμοποιείς εξαιρεμένο περιεχόμενο επειδή εμφανίζεται στις επίσημες σελίδες.",
  "PB": "Γονική επιλογή Γεωμετρίας: ισχύουν οι ειδικές σημειώσεις των §2.2, §3.2, §4.4 και §4.6. Μη χρησιμοποιείς εξαιρεμένο περιεχόμενο επειδή εμφανίζεται στις επίσημες σελίδες."
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
    const curriculumScope = resolveCurriculumScope(subject, topic);

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
      curriculumScope,
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
    return resolveMathBCurriculumUrls(topic);
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


function resolveMathBCurriculumUrls(topic) {
  const key = mathBTopicKey(topic);
  return key && MATH_B_2026_2027_URLS[key]
    ? [...MATH_B_2026_2027_URLS[key]]
    : [];
}

function resolveCurriculumScope(subject, topic) {
  if (subject !== "mathimatika-b-gymnasiou") return "";
  return resolveMathBCurriculumScope(topic);
}

function resolveMathBCurriculumScope(topic) {
  const key = mathBTopicKey(topic);
  if (!key || !MATH_B_2026_2027_URLS[key]) return "";
  return MATH_B_2026_2027_SCOPE[key] ||
    "Εντός της επαληθευμένης διδακτέας ύλης 2026–27. Χρησιμοποίησε μόνο την επιλεγμένη επίσημη ενότητα και μην επεκτείνεις το περιεχόμενο πέρα από αυτήν.";
}

function mathBTopicKey(topic) {
  const value = String(topic || "");
  const review = value.match(/(?:Επανάληψη\s+)?από\s+Α[΄']?\s*Γυμνασίου\s*·\s*(7\.[1-9])/i);
  if (review) return `R${review[1]}`;

  const partMatch = value.match(/Μέρος\s+([ΑAΒB])/i);
  if (!partMatch) return "";
  const rawPart = partMatch[1].toUpperCase();
  const part = rawPart === "Α" || rawPart === "A" ? "A" : rawPart === "Β" || rawPart === "B" ? "B" : "";
  if (!part) return "";

  const section = (value.match(/\b\d+\.\d+\b/) || [])[0];
  if (section) return `${part}${section}`;

  const chapter = (value.match(/Κεφάλαιο\s+(\d+)/i) || [])[1];
  if (chapter) return `${part}${chapter}`;

  return `P${part}`;
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
  resolveMathBCurriculumUrls,
  resolveMathBCurriculumScope,
  resolveCurriculumScope,
  resolveSectionPath,
  HISTORY_B_2026_2027_PATHS,
  MATH_B_2026_2027_URLS,
  MATH_B_2026_2027_SCOPE
});
