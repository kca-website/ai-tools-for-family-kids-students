function browserRequestAllowed(req) {
  const headers = req?.headers || {};
  const fetchSite = String(headers['sec-fetch-site'] || headers['Sec-Fetch-Site'] || '').toLowerCase();
  if (fetchSite === 'cross-site') return false;

  const origin = String(headers.origin || headers.Origin || '').trim();
  if (!origin) return true;

  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' && host !== 'localhost' && host !== '127.0.0.1') return false;
    if (host === 'www.aitools4kids.gr' || host === 'aitools4kids.gr') return true;
    if (host === 'localhost' || host === '127.0.0.1') return true;
    return /^aitools4kids(?:-[a-z0-9-]+)*-kcawebsite\.vercel\.app$/.test(host);
  } catch (_) {
    return false;
  }
}

// Fetch a small, section-scoped excerpt from official Greek schoolbook HTML pages.
// Official-book grounding coverage expands incrementally from verified HTML section patterns.

let GENERAL_ED_BOOK_CATALOG = null;
try {
  GENERAL_ED_BOOK_CATALOG = require("../general-education-book-sections-2026-2027.js");
} catch (_) {
  GENERAL_ED_BOOK_CATALOG = null;
}

let GEL_SCHOOLBOOK_SOURCE_MAP = null;
try {
  GEL_SCHOOLBOOK_SOURCE_MAP = require("../gel-schoolbook-source-map-2026-2027.js");
} catch (_) {
  GEL_SCHOOLBOOK_SOURCE_MAP = null;
}

const PRIMARY_GUIDANCE_2026_2027 =
  "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-protovathmias-gia-to-scholiko-etos-2026-2027/";
const MIDDLE_GUIDANCE_2026_2027 =
  "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/";
const HIGH_GUIDANCE_2026_2027 =
  "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-genikou-lykeiou-gia-to-scholiko-etos-2026-2027/";

function catalogGrade(subject) {
  const id = String(subject || "");
  if (/-a-(?:dimotikou|gymnasiou|lykeiou)$/.test(id)) return "a";
  if (/-b-(?:dimotikou|gymnasiou|lykeiou)$/.test(id)) return "b";
  if (/(?:-c-|-g-)(?:dimotikou|gymnasiou|lykeiou)$/.test(id)) return "c";
  if (/-d-dimotikou$/.test(id)) return "d";
  if (/-e-dimotikou$/.test(id)) return "e";
  if (/-st-dimotikou$/.test(id)) return "st";
  return null;
}

function catalogGuidanceSource(subject, row) {
  if (row?.annualGuidanceUrl) return row.annualGuidanceUrl;
  const id = String(subject || "");
  if (/-dimotikou$/.test(id)) return PRIMARY_GUIDANCE_2026_2027;
  if (/-gymnasiou$/.test(id)) return MIDDLE_GUIDANCE_2026_2027;
  if (/-lykeiou$/.test(id)) return HIGH_GUIDANCE_2026_2027;
  return null;
}

function catalogHtmlSourceAllowed(url) {
  try {
    const parsed = new URL(String(url || ""));
    return parsed.protocol === "https:" &&
      /(^|\.)ebooks\.edu\.gr$/i.test(parsed.hostname) &&
      /\/ebooks\/v\/html\//i.test(parsed.pathname);
  } catch (_) {
    return false;
  }
}

function buildCatalogBook(subject) {
  if (!GENERAL_ED_BOOK_CATALOG?.get) return null;
  const row = GENERAL_ED_BOOK_CATALOG.get(subject);
  if (!row?.sourceUrl || !catalogHtmlSourceAllowed(row.sourceUrl)) return null;
  return {
    title: row.title || subject,
    grade: catalogGrade(subject),
    base: row.sourceUrl,
    sectionSources: row.groundedSections || null,
    mode: "linkedSection",
    officialSourceRequired: true,
    schoolYear: row.schoolYear || GENERAL_ED_BOOK_CATALOG.schoolYear || "2026-2027",
    curriculumSource: catalogGuidanceSource(subject, row),
    mappingStatus: row.mappingStatus || "official-book-catalog-grounded",
    lastVerified: row.lastVerified || "2026-09-30",
    annualScopeVerified: row.annualScopeVerified === true,
    catalogBacked: true
  };
}

function resolveGelInventoryTopic(subject, topic) {
  const row = GEL_SCHOOLBOOK_SOURCE_MAP?.get?.(subject);
  if (!row) return null;

  const rawTopic = String(topic || "").trim();
  const matches = (row.topicMappings || []).filter((entry) =>
    String(entry?.label || "").trim() === rawTopic
  );

  if (matches.length !== 1) {
    return {
      row,
      mapping: null,
      book: null,
      runtimeEligible: false,
      reason: "topic-label-not-exactly-resolved"
    };
  }

  const mapping = matches[0];
  const book = (row.books || []).find((entry) =>
    entry?.role === "primary" && entry?.work === mapping?.work
  ) || null;

  const exactHtmlHigh =
    mapping?.status === "exact-html" &&
    mapping?.confidence === "high" &&
    !!mapping?.url &&
    catalogHtmlSourceAllowed(mapping.url) &&
    !!book?.html?.url &&
    catalogHtmlSourceAllowed(book.html.url);

  return {
    row,
    mapping,
    book,
    runtimeEligible: exactHtmlHigh,
    reason: exactHtmlHigh
      ? ""
      : (mapping?.status === "exact-pdf"
        ? "official-pdf-page-verified-text-parser-not-enabled"
        : (mapping?.status === "exact-html" && mapping?.confidence === "medium"
          ? "medium-confidence-not-activated"
          : (mapping?.reason || mapping?.status || "not-runtime-eligible")))
  };
}

function buildGelInventoryBook(resolution) {
  if (!resolution?.runtimeEligible) return null;
  const { row, mapping, book } = resolution;
  return {
    title: book?.title || row?.labelEl || row?.subjectId || "Επίσημο σχολικό βιβλίο",
    grade: row?.grade || null,
    base: book.html.url,
    mode: "gelInventoryExactHtml",
    officialSourceRequired: true,
    schoolYear: GEL_SCHOOLBOOK_SOURCE_MAP?.schoolYear || "2026-2027",
    curriculumSource: HIGH_GUIDANCE_2026_2027,
    mappingStatus: "official-gel-inventory-exact-html",
    lastVerified: GEL_SCHOOLBOOK_SOURCE_MAP?.generatedAt || "2026-10-01",
    annualScopeVerified: false,
    gelInventoryBacked: true,
    mappingConfidence: mapping.confidence || null,
    labelParaphrase: mapping.labelParaphrase === true,
    verifiedHeading: mapping.heading || null
  };
}


const BOOKS = {
  "fysiki-a-gymnasiou": {
    title: "Η Φυσική με Πειράματα Α΄ Γυμνασίου",
    grade: "a",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2314/Fysiki_A-Gymnasiou_html-empl/",
    mode: "phase14PhysicsA",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: MIDDLE_GUIDANCE_2026_2027,
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-10-01",
    annualScopeVerified: true
  },
  "geografia-a-gymnasiou": {
    title: "Γεωλογία – Γεωγραφία Α΄ Γυμνασίου",
    grade: "a",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2286/Geografia_A-Gymnasiou_html-empl/",
    mode: "phase14GeographyA",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: MIDDLE_GUIDANCE_2026_2027,
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-10-01",
    annualScopeVerified: true
  },
  "environment-a-dimotikou": {
    title: "Μελέτη Περιβάλλοντος Α΄ Δημοτικού",
    grade: "a",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2007/Meleti-Perivallontos_A-Dimotikou_html-apli/",
    mode: "phase14EnvironmentA",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    mappingStatus: "official-book-topic-anchor-grounded",
    lastVerified: "2026-10-01",
    annualScopeVerified: false
  },
  "environment-b-dimotikou": {
    title: "Μελέτη Περιβάλλοντος Β΄ Δημοτικού",
    grade: "b",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2352/Meleti-Perivallontos_B-Dimotikou_html-apli/",
    mode: "phase14EnvironmentB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    mappingStatus: "official-book-topic-anchor-grounded",
    lastVerified: "2026-10-01",
    annualScopeVerified: false
  },
  "environment-c-dimotikou": {
    title: "Μελέτη Περιβάλλοντος Γ΄ Δημοτικού",
    grade: "c",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2260/Meleti-Perivallontos_G-Dimotikou_html-empl/",
    mode: "phase14EnvironmentC",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    mappingStatus: "official-book-topic-anchor-grounded",
    lastVerified: "2026-10-01",
    annualScopeVerified: false
  },
  "environment-d-dimotikou": {
    title: "Μελέτη Περιβάλλοντος Δ΄ Δημοτικού",
    grade: "d",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2280/Meleti-Perivallontos_D-Dimotikou_html-empl/",
    mode: "phase14EnvironmentD",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    mappingStatus: "official-book-topic-anchor-grounded",
    lastVerified: "2026-10-01",
    annualScopeVerified: false
  },
  "pliroforiki-a-gymnasiou": {
    title: "Πληροφορική Α΄, Β΄, Γ΄ Γυμνασίου",
    grade: "a",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2759/Pliroforiki_A-B-G-Gymnasiou_html-empl/",
    mode: "phase14InformaticsA",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: MIDDLE_GUIDANCE_2026_2027,
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-10-01",
    annualScopeVerified: true
  },
  "pliroforiki-b-gymnasiou": {
    title: "Πληροφορική Α΄, Β΄, Γ΄ Γυμνασίου",
    grade: "b",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2759/Pliroforiki_A-B-G-Gymnasiou_html-empl/",
    mode: "phase14InformaticsB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: MIDDLE_GUIDANCE_2026_2027,
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-10-01",
    annualScopeVerified: true
  },
  "pliroforiki-c-gymnasiou": {
    title: "Πληροφορική Α΄, Β΄, Γ΄ Γυμνασίου",
    grade: "c",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2759/Pliroforiki_A-B-G-Gymnasiou_html-empl/",
    mode: "phase14InformaticsC",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: MIDDLE_GUIDANCE_2026_2027,
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-10-01",
    annualScopeVerified: true
  },
  "technologia-a-gymnasiou": {
    title: "Τεχνολογία Α΄ Γυμνασίου",
    grade: "a",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2248/Technologia_A-Gymnasiou_html-empl/",
    mode: "phase14TechnologyA",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: MIDDLE_GUIDANCE_2026_2027,
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-10-01",
    annualScopeVerified: true
  },
  "fysiki-agogi-a-gymnasiou": {
    title: "Φυσική Αγωγή Α΄ Γυμνασίου",
    grade: "a",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2252/Fysiki-Agogi_A-B-GGymnasiou_html-empl/index.html",
    mode: "linkedSection",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-09-30",
    annualScopeVerified: false
  },
  "fysiki-agogi-b-gymnasiou": {
    title: "Φυσική Αγωγή Β΄ Γυμνασίου",
    grade: "b",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2252/Fysiki-Agogi_A-B-GGymnasiou_html-empl/index.html",
    mode: "linkedSection",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-09-30",
    annualScopeVerified: false
  },
  "fysiki-agogi-c-gymnasiou": {
    title: "Φυσική Αγωγή Γ΄ Γυμνασίου",
    grade: "c",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2252/Fysiki-Agogi_A-B-GGymnasiou_html-empl/index.html",
    mode: "linkedSection",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-09-30",
    annualScopeVerified: false
  },
  "technologia-b-gymnasiou": {
    title: "Τεχνολογία Β΄ Γυμνασίου",
    grade: "b",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2194/Technologia_B-Gymnasiou_html-empl/",
    mode: "linkedSection",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-09-30",
    annualScopeVerified: false
  },
  "pliroforiki-a-lykeiou": {
    title: "Εφαρμογές Πληροφορικής Α΄ Λυκείου",
    grade: "a",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2714/Pliroforiki_A-Lykeiou_html-empl/",
    mode: "linkedSection",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-genikou-lykeiou-gia-to-scholiko-etos-2026-2027/",
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-09-30",
    annualScopeVerified: false
  },
  "pliroforiki-b-lykeiou": {
    title: "Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ Β΄ Λυκείου",
    grade: "b",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2716/Pliroforiki_B-Lykeiou_html-empl/",
    mode: "linkedSection",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-genikou-lykeiou-gia-to-scholiko-etos-2026-2027/",
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-09-30",
    annualScopeVerified: false
  },
  "glossa-a-dimotikou": {
    title: "Γλώσσα Α΄ Δημοτικού",
    grade: "a",
    base: "https://www.ebooks.edu.gr/ebooks/v/html/8547/1993/Glossa_A-Dimotikou_html-empl/",
    sectionSources: Object.freeze({
          "1η Ενότητα — Πού είναι ο Άρης?": "https://ebooks.edu.gr/ebooks/v/html/8547/1993/Glossa_A-Dimotikou_html-empl/indexb_00.html",
          "1η Ενότητα — Πού είναι ο Άρης;": "https://ebooks.edu.gr/ebooks/v/html/8547/1993/Glossa_A-Dimotikou_html-empl/indexb_00.html"
    }),
    mode: "linkedSection",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-protovathmias-gia-to-scholiko-etos-2026-2027/",
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-09-30",
    annualScopeVerified: false
  },
  "glossa-b-dimotikou": {
    title: "Γλώσσα Β΄ Δημοτικού",
    grade: "b",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/1995/Glossa_B-Dimotikou_html-empl/",
    sectionSources: Object.freeze({
          "1 — Στο δρόμο για το σχολείο": "https://www.ebooks.edu.gr/ebooks/v/html/8547/1995/Glossa_B-Dimotikou_html-empl/indexb_00.html",
          "2 — Με το «σεις» και με «σας»": "https://lb1.ebooks.edu.gr/ebooks/v/html/8547/1995/Glossa_B-Dimotikou_html-empl/indexc_00.html",
          "3 — Στον κόσμο των κόμικς": "https://www.ebooks.edu.gr/ebooks/v/html/8547/1995/Glossa_B-Dimotikou_html-empl/indexd_00.html"
    }),
    mode: "linkedSection",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-protovathmias-gia-to-scholiko-etos-2026-2027/",
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-09-30",
    annualScopeVerified: false
  },
  "glossa-c-dimotikou": {
    title: "Γλώσσα Γ΄ Δημοτικού",
    grade: "c",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/1997/Glossa_G-Dimotikou_html-empl/",
    mode: "linkedSection",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-protovathmias-gia-to-scholiko-etos-2026-2027/",
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-09-30",
    annualScopeVerified: false
  },
  "glossa-d-dimotikou": {
    title: "Γλώσσα Δ΄ Δημοτικού",
    grade: "d",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2192/Glossa_D-Dimotikou_html-empl/",
    sectionSources: Object.freeze({
          "1η Ενότητα — Ένα ακόμα σκαλί": "https://ebooks.edu.gr/ebooks/v/html/8547/2192/Glossa_D-Dimotikou_html-empl/indexb_00.html"
    }),
    mode: "linkedSection",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-protovathmias-gia-to-scholiko-etos-2026-2027/",
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-09-30",
    annualScopeVerified: false
  },
  "glossa-e-dimotikou": {
    title: "Γλώσσα Ε΄ Δημοτικού",
    grade: "e",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2001/Glossa_E-Dimotikou_html-empl/",
    mode: "linkedSection",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-protovathmias-gia-to-scholiko-etos-2026-2027/",
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-09-30",
    annualScopeVerified: false
  },
  "science-st-dimotikou": {
    title: "Φυσικά ΣΤ΄ Δημοτικού",
    grade: "st",
    base: "https://www.ebooks.edu.gr/ebooks/v/html/8547/2011/Fysika_ST-Dimotikou_html-empl/",
    mode: "linkedSection",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-protovathmias-gia-to-scholiko-etos-2026-2027/",
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-09-30",
    annualScopeVerified: false
  },
  "istoria-d-dimotikou": {
    title: "Ιστορία Δ΄ Δημοτικού",
    grade: "d",
    base: "https://lb1.ebooks.edu.gr/ebooks/v/html/8547/2174/Istoria_D-Dimotikou_html-empl/",
    mode: "linkedSection",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-protovathmias-gia-to-scholiko-etos-2026-2027/",
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-09-30",
    annualScopeVerified: false
  },
  "english-st-dimotikou": {
    title: "Αγγλικά ΣΤ΄ Δημοτικού",
    grade: "st",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2270/Agglika_ST-Dimotikou_html-empl/",
    mode: "linkedSection",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-protovathmias-gia-to-scholiko-etos-2026-2027/",
    mappingStatus: "official-book-section-grounded",
    lastVerified: "2026-09-30",
    annualScopeVerified: false
  },
  "istoria-b-gymnasiou": {
    title: "Μεσαιωνική και Νεότερη Ιστορία Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2198/Istoria_B-Gymnasiou_html-empl/",
    mode: "history",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/"
  },
  "istoria-a-gymnasiou": {
    title: "Αρχαία Ιστορία Α΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2290/Istoria_A-Gymnasiou_html-empl/",
    mode: "historyAQuiz",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",
    selectionPolicy: "exact-current-diagnostic-topics"
  },
  "istoria-g-gymnasiou": {
    title: "Νεότερη και Σύγχρονη Ιστορία Γ΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/",
    mode: "historyGQuiz",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",
    selectionPolicy: "exact-current-diagnostic-topics"
  },
  "istoria-a-lykeiou": {
    title: "Ιστορία του Αρχαίου Κόσμου Α΄ Γενικού Λυκείου",
    base: "https://lb1.ebooks.edu.gr/ebooks/v/html/8547/2696/Istoria_A-Lykeiou_html-empl/",
    mode: "historyALyceum",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027"
  },
  "mathimatika-a-gymnasiou": {
    title: "Μαθηματικά Α΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/",
    mode: "mathAQuiz",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",
    selectionPolicy: "exact-current-diagnostic-topics"
  },
  "mathimatika-b-gymnasiou": {
    title: "Μαθηματικά Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/",
    mode: "mathB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/"
  },
  "mathimatika-g-gymnasiou": {
    title: "Μαθηματικά Γ΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/",
    mode: "mathGQuiz",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",
    selectionPolicy: "exact-current-diagnostic-topics-plus-prerequisite-source"
  },
  "chimeia-b-gymnasiou": {
    title: "Χημεία Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2206/Chimeia_B-Gymnasiou_html-empl/",
    mode: "chemistryB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/"
  },
  "geologia-geografia-b-gymnasiou": {
    title: "Γεωλογία - Γεωγραφία Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2294/Geografia_B-Gymnasiou_html-empl/",
    mode: "geographyB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/"
  },
  "logotechnia-b-gymnasiou": {
    title: "Κείμενα Νεοελληνικής Λογοτεχνίας Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2246/Keimena-Neoellinikis-Logotechnias_B-Gymnasiou_html-empl/",
    mode: "literatureB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",
    selectionPolicy: "teacher-choice-from-official-anthology"
  },
  "physics-gymnasiou": {
    title: "Φυσική Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2204/Fysiki_B-Gymnasiou_html-empl/",
    mode: "physicsB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/"
  },
  "fysiki-g-gymnasiou": {
    title: "Φυσική Γ΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/",
    mode: "physicsGQuiz",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",
    selectionPolicy: "exact-current-diagnostic-topics-plus-prerequisite-source"
  },
  "chimeia-g-gymnasiou": {
    title: "Χημεία Γ΄ Γυμνασίου",
    base: "https://old.ebooks.edu.gr/modules/ebook/show.php/DSGYM-C102/223/",
    mode: "chemistryGQuiz",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",
    selectionPolicy: "exact-current-diagnostic-prerequisites"
  },
  "biologia-a-gymnasiou": {
    title: "Βιολογία Α΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/",
    mode: "biologyA"
  },
  "biologia-b-gymnasiou": {
    title: "Βιολογία Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/",
    mode: "biologyB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/"
  },
  "biologia-g-gymnasiou": {
    title: "Βιολογία Β΄ και Γ΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/",
    mode: "biologyGQuiz",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",
    selectionPolicy: "exact-current-diagnostic-topics-plus-prerequisite-source"
  },
  "archaia-glossa-a-gymnasiou": {
    title: "Αρχαία Ελληνική Γλώσσα Α΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2244/Archaia-Elliniki-Glossa_A-Gymnasiou_html-empl/",
    mode: "unit2digit"
  },
  "archaia-glossa-b-gymnasiou": {
    title: "Αρχαία Ελληνική Γλώσσα Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2234/Archaia-Elliniki-Glossa_B-Gymnasiou_html-empl/",
    mode: "ancientGreekB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/"
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
    mode: "iliadB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/"
  },
  "glossa-a-gymnasiou": {
    title: "Νεοελληνική Γλώσσα Α΄ Γυμνασίου / Γραμματική Α΄-Β΄-Γ΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2256/Neoelliniki-Glossa_A-Gymnasiou_html-empl/",
    mode: "modernGreekAQuiz",
    multi: true,
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",
    selectionPolicy: "exact-current-diagnostic-topics-with-official-grammar-reference"
  },
  "glossa-b-gymnasiou": {
    title: "Νεοελληνική Γλώσσα Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2298/Neoelliniki-Glossa_B-Gymnasiou_empl/",
    mode: "modernGreekBAnnual",
    multi: true,
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",
    selectionPolicy: "target-based-teacher-selection"
  },
  "english-b-gymnasiou": {
    title: "Αγγλικά Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2320/Agglika_B-Gymnasiou-Proch_html-empl/",
    mode: "englishB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",
    selectionPolicy: "beginner-or-advanced-package"
  },
  "thriskeftika-b-gymnasiou": {
    title: "Θρησκευτικά Β΄ Γυμνασίου — Η Εκκλησία: πορεία ζωής μέσα στην ιστορία",
    base: "https://www.ebooks.edu.gr/ebooks/d/8547/5230/21-0202-01_Thriskeutika_B-Gymnasiou_Vivlio-Mathiti.pdf",
    mode: "religionB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.ebooks.edu.gr/ebooks/d/8547/5230/21-0202-01_Thriskeutika_B-Gymnasiou_Vivlio-Mathiti.pdf",
    canonicalSourceUrl: "https://www.ebooks.edu.gr/ebooks/d/8547/5230/21-0202-01_Thriskeutika_B-Gymnasiou_Vivlio-Mathiti.pdf",
    selectionPolicy: "current-official-book-chapters-grounded-in-official-source-material"
  },
  "glossa-gymnasiou": {
    title: "Νεοελληνική Γλώσσα Γ΄ Γυμνασίου / Γραμματική Α΄-Β΄-Γ΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2216/Neoelliniki-Glossa_G-Gymnasiou_html-empl/",
    mode: "modernGreekGQuiz",
    multi: true,
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",
    selectionPolicy: "exact-current-diagnostic-topics-with-official-grammar-reference"
  }
};

const ALIASES = {
  "math-b-gymnasiou": "mathimatika-b-gymnasiou",
  "chemistry-b-gymnasiou": "chimeia-b-gymnasiou",
  "geografia-b-gymnasiou": "geologia-geografia-b-gymnasiou",
  "geology-geography-b-gymnasiou": "geologia-geografia-b-gymnasiou",
  "keimena-logotechnias-b-gymnasiou": "logotechnia-b-gymnasiou",
  "neoelliniki-logotechnia-b-gymnasiou": "logotechnia-b-gymnasiou",
  "fysiki-b-gymnasiou": "physics-gymnasiou",
  "physics-g-gymnasiou": "fysiki-g-gymnasiou",
  "chemistry-g-gymnasiou": "chimeia-g-gymnasiou",
  "biology-a-gymnasiou": "biologia-a-gymnasiou",
  "biology-b-gymnasiou": "biologia-b-gymnasiou",
  "biology-g-gymnasiou": "biologia-g-gymnasiou",
  "english-b-gymnasium": "english-b-gymnasiou",
  "agglika-b-gymnasiou": "english-b-gymnasiou",
  "religion-b-gymnasiou": "thriskeftika-b-gymnasiou",
  "religious-studies-b-gymnasiou": "thriskeftika-b-gymnasiou"
};

const RELIGION_B_OFFICIAL_SOURCE_MATERIAL = Object.freeze({
  1: "https://www.ebooks.edu.gr/ebooks/v/html/8547/2308/Thriskeutika_A-Gymnasiou_html-empl/index1.html",
  2: "https://www.ebooks.edu.gr/ebooks/v/html/8547/2308/Thriskeutika_A-Gymnasiou_html-empl/index1.html",
  3: "https://www.ebooks.edu.gr/ebooks/v/html/8547/2308/Thriskeutika_A-Gymnasiou_html-empl/index1.html",
  4: "https://www.ebooks.edu.gr/ebooks/v/html/8547/2308/Thriskeutika_A-Gymnasiou_html-empl/index1.html",
  5: "https://www.ebooks.edu.gr/ebooks/v/html/8547/2308/Thriskeutika_A-Gymnasiou_html-empl/index1.html",
  6: "https://www.ebooks.edu.gr/ebooks/v/html/8547/2308/Thriskeutika_A-Gymnasiou_html-empl/index2.html",
  7: "https://www.ebooks.edu.gr/ebooks/v/html/8547/2308/Thriskeutika_A-Gymnasiou_html-empl/index2.html",
  8: "https://www.ebooks.edu.gr/ebooks/v/html/8547/2308/Thriskeutika_A-Gymnasiou_html-empl/index4.html",
  9: "https://www.ebooks.edu.gr/ebooks/v/html/8547/2308/Thriskeutika_A-Gymnasiou_html-empl/index4.html",
  10: "https://www.ebooks.edu.gr/ebooks/v/html/8547/2310/Thriskeutika_B-Gymnasiou_html-empl/index1.html",
  11: "https://www.ebooks.edu.gr/ebooks/v/html/8547/2310/Thriskeutika_B-Gymnasiou_html-empl/index1.html",
  12: "https://www.ebooks.edu.gr/ebooks/v/html/8547/2310/Thriskeutika_B-Gymnasiou_html-empl/index1.html",
  13: "https://www.ebooks.edu.gr/ebooks/v/html/8547/2310/Thriskeutika_B-Gymnasiou_html-empl/index1.html",
  14: "https://www.ebooks.edu.gr/ebooks/v/html/8547/2310/Thriskeutika_B-Gymnasiou_html-empl/index6.html",
  15: "https://www.ebooks.edu.gr/ebooks/v/html/8547/2310/Thriskeutika_B-Gymnasiou_html-empl/index6.html",
  16: "https://www.ebooks.edu.gr/ebooks/v/html/8547/2310/Thriskeutika_B-Gymnasiou_html-empl/index6.html"
});

// The current 2020+ B Gymnasium textbook explicitly consolidates material from
// the earlier official A/B Gymnasium folders. These official HTML pages are
// used as machine-readable grounding material, while the current B textbook
// PDF remains the canonical source shown to the learner.
function religionBTopicNumber(topic) {
  const value = String(topic || "").trim();
  const match = value.match(/^(\d{1,2})\s*(?:[—–-]|\.|\))/);
  if (!match) return 0;
  const n = Number(match[1]);
  return Number.isInteger(n) && n >= 1 && n <= 16 ? n : 0;
}

function resolveReligionBSourceUrls(topic) {
  const n = religionBTopicNumber(topic);
  const url = RELIGION_B_OFFICIAL_SOURCE_MATERIAL[n];
  return url ? [url] : [];
}

// Exact 2026-27 History B curriculum allowlist, verified against the official
// IEP annual guidance. Parent nodes aggregate only their included descendants;
// pages that exist in the book but are absent from this map fail closed.
// Exact official textbook pages for the diagnostic topics currently exposed
// by A΄ and G΄ Gymnasium History. The IEP 2026–27 History guidance is published,
// but this map deliberately does NOT claim a complete annual-syllabus allowlist.
const HISTORY_A_GYM_DIAGNOSTIC_PATHS = Object.freeze({
  "πολιτισμοι εποχης χαλκου": ["index_02_02.html", "index_02_03.html", "index_02_05.html"],
  "bronze age civilizations": ["index_02_02.html", "index_02_03.html", "index_02_05.html"],
  "πορεια προς τη δημοκρατια": ["index_04_05.html"],
  "path toward democracy": ["index_04_05.html"],
  "πελοποννησιακος πολεμος": ["index_06_01.html"],
  "peloponnesian war": ["index_06_01.html"],
  "εργο μεγαλου αλεξανδρου": ["index_07_04.html"],
  "alexander the great s legacy": ["index_07_04.html"]
});

const HISTORY_G_GYM_DIAGNOSTIC_PATHS = Object.freeze({
  "εναρξη της επαναστασης": ["index2_8.html"],
  "start of the revolution": ["index2_8.html"],
  "ενοτητα κατα την επανασταση": ["index2_9.html"],
  "unity during the revolution": ["index2_9.html"],
  "ιδρυση φιλικης εταιρειας": ["index2_7.html"],
  "founding of the filiki etaireia": ["index2_7.html"],
  "εκπαιδευση επι τουρκοκρατιας": ["index2_5.html"],
  "education under ottoman rule": ["index2_5.html"]
});

const MATH_A_GYM_DIAGNOSTIC_PATHS = Object.freeze({
  "διαταξη ρητων αριθμων": ["indexA7_2.html"],
  "ordering rational numbers": ["indexA7_2.html"],
  "απολυτη τιμη": ["indexA7_2.html"],
  "absolute value": ["indexA7_2.html"],
  "μκδ vs εκπ": ["indexA1_5.html"],
  "gcd vs lcm": ["indexA1_5.html"],
  "εισαγωγη σε αναλογιες": ["indexA6_2.html"],
  "introduction to proportions": ["indexA6_2.html"]
});

const MATH_G_GYM_DIAGNOSTIC_SOURCES = Object.freeze({
  "προσημο πλην": ["https://ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/indexA2_1.html"],
  "the minus sign": ["https://ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/indexA2_1.html"],
  "ισοτητα ως ισορροπια": ["https://ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/indexA2_1.html"],
  "equals as balance": ["https://ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/indexA2_1.html"],
  "επιμεριστικη με αρνητικο": ["https://ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/indexA1_4.html"],
  "distributing a negative": ["https://ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/indexA1_4.html"],
  "πυθαγορειο με καθετη πλευρα": ["https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_4.html"],
  "pythagorean theorem finding a leg": ["https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_4.html"]
});

const PHYSICS_G_GYM_DIAGNOSTIC_SOURCES = Object.freeze({
  "νομος του ωμ": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index2.html"],
  "ohm s law": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index2.html"],
  "γ κεφαλαιο 2 ηλεκτρικο ρευμα νομος του ωμ": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index2.html"],
  "τυπος ταχυτητας": ["https://ebooks.edu.gr/ebooks/v/html/8547/2204/Fysiki_B-Gymnasiou_html-empl/index2_2.html"],
  "speed formula": ["https://ebooks.edu.gr/ebooks/v/html/8547/2204/Fysiki_B-Gymnasiou_html-empl/index2_2.html"],
  "β 2 2 η εννοια της ταχυτητας προαπαιτουμενη γνωση": ["https://ebooks.edu.gr/ebooks/v/html/8547/2204/Fysiki_B-Gymnasiou_html-empl/index2_2.html"],
  "μετατροπη ενεργειας": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index3.html"],
  "energy transformation": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index3.html"],
  "γ κεφαλαιο 3 ηλεκτρικη ενεργεια": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index3.html"]
});

const PHYSICS_G_GYM_ANNUAL_TOPIC_SOURCES = Object.freeze({
  "ηλεκτρικη δυναμη φορτιο και ηλεκτρικο πεδιο": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index1.html"],
  "electric force charge and electric field": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index1.html"],
  "ηλεκτρικο ρευμα και κυκλωματα": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index2.html"],
  "electric current and circuits": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index2.html"],
  "αντισταση νομος του ohm και συνδεσμολογια": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index2.html"],
  "resistance ohm s law and circuit connections": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index2.html"],
  "αποτελεσματα ενεργεια και ισχυς ηλεκτρικου ρευματος": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index3.html"],
  "effects energy and power of electric current": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index3.html"],
  "ταλαντωσεις και εκκρεμες": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index4.html"],
  "oscillations and the pendulum": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index4.html"],
  "μηχανικα κυματα και ηχος": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index5.html"],
  "mechanical waves and sound": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index5.html"],
  "φως διαδοση και ανακλαση": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index6.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index7.html"
  ],
  "light propagation and reflection": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index6.html",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index7.html"
  ],
  "διαθλαση αναλυση φωτος και χρωμα": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index8.html"],
  "refraction dispersion and colour": ["https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/index8.html"]
});

const PHYSICS_G_GYM_ANNUAL_TOPIC_KEYS = Object.freeze({
  "ηλεκτρικη δυναμη φορτιο και ηλεκτρικο πεδιο": "electric-force-field",
  "electric force charge and electric field": "electric-force-field",
  "ηλεκτρικο ρευμα και κυκλωματα": "current-circuits",
  "electric current and circuits": "current-circuits",
  "αντισταση νομος του ohm και συνδεσμολογια": "ohm-connections",
  "resistance ohm s law and circuit connections": "ohm-connections",
  "αποτελεσματα ενεργεια και ισχυς ηλεκτρικου ρευματος": "effects-energy-power",
  "effects energy and power of electric current": "effects-energy-power",
  "ταλαντωσεις και εκκρεμες": "oscillations",
  "oscillations and the pendulum": "oscillations",
  "μηχανικα κυματα και ηχος": "waves-sound",
  "mechanical waves and sound": "waves-sound",
  "φως διαδοση και ανακλαση": "light-reflection",
  "light propagation and reflection": "light-reflection",
  "διαθλαση αναλυση φωτος και χρωμα": "refraction-colour",
  "refraction dispersion and colour": "refraction-colour"
});

const CHEMISTRY_G_GYM_DIAGNOSTIC_SOURCES = Object.freeze({
  "στοιχειο vs ενωση": ["https://ebooks.edu.gr/ebooks/v/html/8547/2206/Chimeia_B-Gymnasiou_html-empl/index2_6.html"],
  "element vs compound": ["https://ebooks.edu.gr/ebooks/v/html/8547/2206/Chimeia_B-Gymnasiou_html-empl/index2_6.html"],
  "β 2 6 χημικες ενωσεις και χημικα στοιχεια προαπαιτουμενο": ["https://ebooks.edu.gr/ebooks/v/html/8547/2206/Chimeia_B-Gymnasiou_html-empl/index2_6.html"],
  "μειγμα vs ενωση": ["https://ebooks.edu.gr/ebooks/v/html/8547/2206/Chimeia_B-Gymnasiou_html-empl/index2_6_2.html"],
  "mixture vs compound": ["https://ebooks.edu.gr/ebooks/v/html/8547/2206/Chimeia_B-Gymnasiou_html-empl/index2_6_2.html"],
  "β 2 6 2 μειγματα και χημικες ενωσεις προαπαιτουμενο": ["https://ebooks.edu.gr/ebooks/v/html/8547/2206/Chimeia_B-Gymnasiou_html-empl/index2_6_2.html"],
  "δομη του ατομου": ["https://ebooks.edu.gr/ebooks/v/html/8547/2206/Chimeia_B-Gymnasiou_html-empl/index2_9.html"],
  "structure of the atom": ["https://ebooks.edu.gr/ebooks/v/html/8547/2206/Chimeia_B-Gymnasiou_html-empl/index2_9.html"],
  "β 2 9 υποατομικα σωματιδια δομη ατομου προαπαιτουμενο": ["https://ebooks.edu.gr/ebooks/v/html/8547/2206/Chimeia_B-Gymnasiou_html-empl/index2_9.html"]
});

const BIOLOGY_G_GYM_DIAGNOSTIC_SOURCES = Object.freeze({
  "θεση του dna": ["https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/index5_1.html"],
  "location of dna": ["https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/index5_1.html"],
  "κληρονομικοτητα απο τους γονεις": ["https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/index5_5.html"],
  "inheritance from parents": ["https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/index5_5.html"],
  "εννοια βιοποικιλοτητας": ["https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/index7_1.html"],
  "concept of biodiversity": ["https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/index7_1.html"],
  "αιτια εξαφανισης ειδους": ["https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/index7_1.html"],
  "cause of species extinction": ["https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/index7_1.html"],
  "σκοπος αναπαραγωγης": ["https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/index6_1.html"],
  "purpose of reproduction": ["https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/index6_1.html"]
});

const OFFICIAL_GRAMMAR_BASE =
  "https://ebooks.edu.gr/ebooks/v/html/8547/2334/Grammatiki-Neas-Ellinikis-Glossas_A-B-G-Gymnasiou_html-apli/";

const GLOSSA_A_GYM_DIAGNOSTIC_SOURCES = Object.freeze({
  "μερη του λογου": [
    OFFICIAL_GRAMMAR_BASE + "index_C_02.html",
    OFFICIAL_GRAMMAR_BASE + "index_C_03.html",
    OFFICIAL_GRAMMAR_BASE + "index_C_06.html",
    OFFICIAL_GRAMMAR_BASE + "index_C_07.html"
  ],
  "parts of speech": [
    OFFICIAL_GRAMMAR_BASE + "index_C_02.html",
    OFFICIAL_GRAMMAR_BASE + "index_C_03.html",
    OFFICIAL_GRAMMAR_BASE + "index_C_06.html",
    OFFICIAL_GRAMMAR_BASE + "index_C_07.html"
  ],
  "αντικειμενικη πληροφορια vs προσωπικο σχολιο": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2256/Neoelliniki-Glossa_A-Gymnasiou_html-empl/indexi_3.htm"
  ],
  "objective information vs personal comment": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2256/Neoelliniki-Glossa_A-Gymnasiou_html-empl/indexi_3.htm"
  ],
  "αποψη vs γεγονος": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2256/Neoelliniki-Glossa_A-Gymnasiou_html-empl/indexi_3.htm"
  ],
  "opinion vs fact": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2256/Neoelliniki-Glossa_A-Gymnasiou_html-empl/indexi_3.htm"
  ],
  "βασικο επιχειρηματολογικο κειμενο": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2256/Neoelliniki-Glossa_A-Gymnasiou_html-empl/indexd_4.htm"
  ],
  "basic argumentative writing": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2256/Neoelliniki-Glossa_A-Gymnasiou_html-empl/indexd_4.htm"
  ],
  "εγκλιση ρηματος": [
    OFFICIAL_GRAMMAR_BASE + "index_C_06.html"
  ],
  "verb mood": [
    OFFICIAL_GRAMMAR_BASE + "index_C_06.html"
  ]
});

const GLOSSA_G_GYM_DIAGNOSTIC_SOURCES = Object.freeze({
  "συμφωνια υποκειμενου ρηματος": [
    OFFICIAL_GRAMMAR_BASE + "index_D_01.html"
  ],
  "subject verb agreement": [
    OFFICIAL_GRAMMAR_BASE + "index_D_01.html"
  ],
  "χρηση κομματων": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2216/Neoelliniki-Glossa_G-Gymnasiou_html-empl/indexi_3.html",
    OFFICIAL_GRAMMAR_BASE + "index_B_04.html"
  ],
  "comma usage": [
    "https://ebooks.edu.gr/ebooks/v/html/8547/2216/Neoelliniki-Glossa_G-Gymnasiou_html-empl/indexi_3.html",
    OFFICIAL_GRAMMAR_BASE + "index_B_04.html"
  ]
});

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

const GEOGRAPHY_B_2026_2027_PATHS = Object.freeze({
  "1": ["mat1_1.html"],
  "2": ["mat1_2.html"],
  "3": ["mat1_3.html"],
  "6": ["mat2_6.html"],
  "7": ["mat2_7.html"],
  "8": ["mat2_8.html"],
  "9": ["mat2_9.html"],
  "10": ["mat2_10.html"],
  "11": ["mat2_11.html"],
  "12": ["mat2_12.html"],
  "13": ["mat2_13.html"],
  "14": ["mat2_14.html"],
  "15": ["mat2_15.html"],
  "16": ["mat2_16.html"],
  "17": ["mat2_17.html"],
  "18": ["mat2_18.html"],
  "19": ["mat2_19.html"],
  "20": ["mat2_20.html"],
  "21": ["mat2_21.html"],
  "22": ["mat2_22.html"],
  "23": ["mat2_23.html"],
  "24": ["mat2_24.html"],
  "25": ["mat3_25.html"],
  "26": ["mat3_26.html"],
  "27": ["mat3_27.html"],
  "28": ["mat3_28.html"],
  "29": ["mat3_29.html"],
  "30": ["mat3_30.html"],
  "31": ["mat3_31.html"],
  "32": ["mat3_32.html"],
  "33": ["mat3_33.html"],
  "34": ["mat3_34.html"],
  "35": ["mat3_35.html"],
  "36": ["mat3_36.html"],
  "37": ["mat4_37.html"],
  "38": ["mat4_38.html"],
  "39": ["mat4_39.html"],
  "40": ["mat4_40.html"],
  "41": ["mat4_41.html"],
  "42": ["mat4_42.html"],
  "43": ["mat4_43.html"],
  "44": ["mat4_44.html"],
  "45": ["mat4_45.html"],
  "46": ["mat4_46.html"],
  "47": ["mat4_47.html"],
  "48": ["mat4_48.html"]
});

const LITERATURE_B_2026_2027_TEXTS = Object.freeze([
  {
    "path": "indexa_1.html",
    "titles": [
      "Πίνοντας ήλιο κορινθιακό"
    ]
  },
  {
    "path": "indexa_2.html",
    "titles": [
      "Ξυπνάμε και η θάλασσα ξυπνά μαζί μας"
    ]
  },
  {
    "path": "indexa_3.html",
    "titles": [
      "Αθήνα"
    ]
  },
  {
    "path": "indexa_4.html",
    "titles": [
      "Η πόλη"
    ]
  },
  {
    "path": "indexa_5.html",
    "titles": [
      "Χαλασμένες γειτονιές"
    ]
  },
  {
    "path": "indexa_6.html",
    "titles": [
      "Ένα παλιό μήνυμα για το σύγχρονο κόσμο"
    ]
  },
  {
    "path": "indexb_1.html",
    "titles": [
      "Ο Τάκη-Πλούμας"
    ]
  },
  {
    "path": "indexb_2.html",
    "titles": [
      "Η Άννα του Κλήδονα"
    ]
  },
  {
    "path": "indexb_3.html",
    "titles": [
      "Να 'σαι καλά, δάσκαλε!"
    ]
  },
  {
    "path": "indexb_4.html",
    "titles": [
      "Ο Καραγκιόζης. Ένα ελληνικό θέατρο σκιών"
    ]
  },
  {
    "path": "indexc_1.html",
    "titles": [
      "Η μάνα"
    ]
  },
  {
    "path": "indexc_2.html",
    "titles": [
      "Από το ημερολόγιο της Άννας Φρανκ"
    ]
  },
  {
    "path": "indexc_3.html",
    "titles": [
      "Οι Κυριακές στη θάλασσα"
    ]
  },
  {
    "path": "indexc_4.html",
    "titles": [
      "Νανούρισμα στο γιο μου"
    ]
  },
  {
    "path": "indexd_1.html",
    "titles": [
      "Στην εκκλησία"
    ]
  },
  {
    "path": "indexd_2.html",
    "titles": [
      "Τ' άσπρο ξωκλήσι"
    ]
  },
  {
    "path": "indexd_3.html",
    "titles": [
      "Κάποια Χριστούγεννα"
    ]
  },
  {
    "path": "indexd_4.html",
    "titles": [
      "Η ιστορία του δαχτυλιδιού"
    ]
  },
  {
    "path": "indexe_1.html",
    "titles": [
      "Ο Διγενής"
    ]
  },
  {
    "path": "indexe_2.html",
    "titles": [
      "Του Βασίλη"
    ]
  },
  {
    "path": "indexe_3.html",
    "titles": [
      "Εις Σάμον"
    ]
  },
  {
    "path": "indexe_4.html",
    "titles": [
      "Η καταστροφή των Ψαρών"
    ]
  },
  {
    "path": "indexe_5.html",
    "titles": [
      "Ερημωμένα χωριά"
    ]
  },
  {
    "path": "indexe_6.html",
    "titles": [
      "Από δόξα και θάνατο"
    ]
  },
  {
    "path": "indexe_7.html",
    "titles": [
      "Έξι χιλιάδες νέοι"
    ]
  },
  {
    "path": "indexe_8.html",
    "titles": [
      "Το συρματόπλεγμα του αίσχους"
    ]
  },
  {
    "path": "indexf_1.html",
    "titles": [
      "Όταν πρωτοκατέβηκα στη Σμύρνη"
    ]
  },
  {
    "path": "indexf_2.html",
    "titles": [
      "Πάσχα τ' Απρίλη"
    ]
  },
  {
    "path": "indexf_3.html",
    "titles": [
      "Χρονικό"
    ]
  },
  {
    "path": "indexf_4.html",
    "titles": [
      "Ένας αριθμός"
    ]
  },
  {
    "path": "indexg_1.html",
    "titles": [
      "Βγαίνοντας από το σχολειό"
    ]
  },
  {
    "path": "indexg_2.html",
    "titles": [
      "Μια Κυριακή στην Κνωσό"
    ]
  },
  {
    "path": "indexg_3.html",
    "titles": [
      "Η εξοχική Λευκάδα"
    ]
  },
  {
    "path": "indexg_4.html",
    "titles": [
      "Τόκιο"
    ]
  },
  {
    "path": "indexh_1.html",
    "titles": [
      "Θέλω να πα στην ξενιτιά",
      "Θέλω να πας στην ξενιτιά",
      "Ξενιτεμένο μου πουλί"
    ]
  },
  {
    "path": "indexh_2.html",
    "titles": [
      "Ο Κάσπαρ Χάουζερ στην έρημη χώρα"
    ]
  },
  {
    "path": "indexh_3.html",
    "titles": [
      "Η επιστροφή του Αντρέα"
    ]
  },
  {
    "path": "indexh_4.html",
    "titles": [
      "Για τον όρο «μετανάστες»"
    ]
  },
  {
    "path": "indexh_5.html",
    "titles": [
      "Γλυκό του κουταλιού"
    ]
  },
  {
    "path": "indexh_6.html",
    "titles": [
      "Δύο γράμματα της Χαράς"
    ]
  },
  {
    "path": "indexh_7.html",
    "titles": [
      "Αναμνήσεις της Κωνσταντίνας από τη Γερμανία"
    ]
  },
  {
    "path": "indexi_1.html",
    "titles": [
      "Καλλιπάτειρα"
    ]
  },
  {
    "path": "indexi_2.html",
    "titles": [
      "Η τρίπλα των ονείρων"
    ]
  },
  {
    "path": "indexi_3.html",
    "titles": [
      "Η τοπική ομάδα"
    ]
  },
  {
    "path": "indexi_4.html",
    "titles": [
      "Η εσχάτη των ποινών"
    ]
  },
  {
    "path": "indexj_1.html",
    "titles": [
      "Τα πουλιά δέλεαρ του Θεού"
    ]
  },
  {
    "path": "indexj_2.html",
    "titles": [
      "Γιατί;"
    ]
  },
  {
    "path": "indexj_3.html",
    "titles": [
      "Η κυρία Νίτσα"
    ]
  },
  {
    "path": "indexj_4.html",
    "titles": [
      "Και πάλι στο σχολείο..."
    ]
  },
  {
    "path": "indexj_5.html",
    "titles": [
      "Ο μικρός πρίγκιπας και η αλεπού"
    ]
  },
  {
    "path": "indexj_6.html",
    "titles": [
      "Μαλαισιακά τραγούδια"
    ]
  },
  {
    "path": "indexk_1.html",
    "titles": [
      "Θερμοπύλες"
    ]
  },
  {
    "path": "indexk_2.html",
    "titles": [
      "Όμως ο μπαμπάς δεν ερχόταν"
    ]
  },
  {
    "path": "indexk_3.html",
    "titles": [
      "Για ένα παιδί που κοιμάται"
    ]
  },
  {
    "path": "indexk_4.html",
    "titles": [
      "Το τραγούδι του Γιανγκ"
    ]
  },
  {
    "path": "indexl_1.html",
    "titles": [
      "Τι έπαιξα στο Λαύριο"
    ]
  },
  {
    "path": "indexl_2.html",
    "titles": [
      "Στην εποχή του τσιμέντου και της πολυκατοικίας"
    ]
  },
  {
    "path": "indexl_3.html",
    "titles": [
      "Γραφείον ευρέσεως εργασίας"
    ]
  },
  {
    "path": "indexl_4.html",
    "titles": [
      "Με το λεωφορείο"
    ]
  },
  {
    "path": "indexl_5.html",
    "titles": [
      "Ιστορία του λαβύρινθου"
    ]
  },
  {
    "path": "indexl_6.html",
    "titles": [
      "Τα λουλούδια της Χιροσίμα"
    ]
  },
  {
    "path": "indexl_7.html",
    "titles": [
      "Όταν πεθαίνει ένα παιδί"
    ]
  },
  {
    "path": "indexl_8.html",
    "titles": [
      "Στα καμένα"
    ]
  },
  {
    "path": "indexm_1.html",
    "titles": [
      "Οι γάτες των φορτηγών"
    ]
  },
  {
    "path": "indexm_2.html",
    "titles": [
      "Ο λύκος"
    ]
  },
  {
    "path": "indexm_3.html",
    "titles": [
      "Άνθρωποι και δελφίνια"
    ]
  },
  {
    "path": "indexm_4.html",
    "titles": [
      "Ο μεταξοσκώληκας"
    ]
  },
  {
    "path": "indexm_5.html",
    "titles": [
      "Ο σκαντζόχερος"
    ]
  }
]);

const PHYSICS_B_2026_2027_PATHS = Object.freeze({
  "1.3": ["index1_3.html"],
  "2.1": ["index2_1.html"],
  "2.2": ["index2_2.html"],
  "3.1": ["index3_1.html"],
  "3.2": ["index3_2.html"],
  "3.3": ["index3_3.html"],
  "3.4": ["index3_4.html"],
  "3.5": ["index3_5.html"],
  "3.6": ["index3_6.html"],
  "3.7": ["index3_7.html"],
  "4.1": ["index4_1.html"],
  "4.2": ["index4_2.html"],
  "4.3": ["index4_3.html"],
  "4.4": ["index4_4.html"],
  "4.5": ["index4_5.html"],
  "5.1": ["index5_1.html"],
  "5.2": ["index5_2.html"],
  "5.3": ["index5_3.html"],
  "5.4": ["index5_4.html"],
  "5.5": ["index5_5.html"],
  "5.7": ["index5_7.html"],
  "5.8": ["index5_8.html"],
  "6.1": ["index6_1.html"],
  "6.2": ["index6_2.html"],
  "6.3": ["index6_3.html"],
  "6.5": ["index6_5.html"]
});

const BIOLOGY_B_2026_2027_SOURCES = Object.freeze({
  "5.1": ["https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/index5_1.html"],
  "5.2": ["https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/index5_2.html"],
  "5.3": ["https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/index5_3.html"],
  "5.4": ["https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/index5_4.html"],
  "6.1": ["https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/index6_1.html"],
  "6.2": ["https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/index6_2.html"],
  "6.3": ["https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/index6_3.html"],
  "6.4": ["https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/index6_4.html"],
  "1.2": ["https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/index1_2.html"],
  "4.1": ["https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/index4_1.html"],
  "4.2": ["https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/index4_2.html"],
  "4.3": ["https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/index4_3.html"],
  "4.4": ["https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/index4_4.html"]
});

const ANCIENT_GREEK_B_2026_2027_UNITS = Object.freeze(
  new Set([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 16])
);

const ILIAD_B_2026_2027_PATHS = Object.freeze({
  "intro": ["index01.html"],
  "a1-53": ["index02.html"],
  "a54-306": ["index03.html"],
  "a307-431a": ["index04.html"],
  "a431b-612": ["index05.html"],
  "bg121-244": ["index05.html", "index06.html"],
  "dez369-529": ["index07.html", "index08.html", "index09.html", "index10.html"],
  "hthi225-431": ["index11.html", "index12.html"],
  "klmnxo": ["index13.html", "index14.html"],
  "p1-100-684-867": ["index15.html", "index16.html"]
});

const ENGLISH_B_BEGINNER_URL =
  "https://old.ebooks.edu.gr/modules/ebook/show.php/DSGYM-B114/318/2134,7741/";
const ENGLISH_B_ADVANCED_URL =
  "https://ebooks.edu.gr/ebooks/v/html/8547/2320/Agglika_B-Gymnasiou-Proch_html-empl/";

const ENGLISH_B_UNITS = Object.freeze({
  beginner: Object.freeze({
    1: "I'm only human",
    2: "Making a difference",
    3: "Technology in our lives",
    4: "Communication",
    5: "Change and Experience",
    6: "What a waste!",
    7: "Magnetism and the world we live",
    8: "Getting around",
    9: "Keeping up appearances",
    10: "A Material World"
  }),
  advanced: Object.freeze({
    1: "Unity in Diversity",
    2: "Echoes of the Past",
    3: "Time Out",
    4: "Let's Change Our Schools",
    5: "The Arts!",
    6: "Healthy Living",
    7: "Embracing Our World",
    8: "Welcome to the World"
  })
});

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  if (!browserRequestAllowed(req)) {
    return res.status(403).json({ error: "cross_site_request_blocked", message: "Cross-site requests are not allowed." });
  }

  const rawSubject = clean(req.query?.subject, 120);
  const topic = clean(req.query?.topic, 500);
  const subject = ALIASES[rawSubject] || rawSubject;
  const gelInventory = topic ? resolveGelInventoryTopic(subject, topic) : null;

  if (gelInventory && !gelInventory.runtimeEligible) {
    const mapping = gelInventory.mapping;
    const fallbackTitle =
      gelInventory.book?.title ||
      (gelInventory.row?.books || []).find((entry) => entry?.role === "primary")?.title ||
      gelInventory.row?.labelEl ||
      subject;

    if (mapping?.status === "exact-pdf") {
      return res.status(409).json({
        grounded: false,
        error: "official_pdf_text_not_grounded",
        bookTitle: fallbackTitle,
        schoolYear: GEL_SCHOOLBOOK_SOURCE_MAP?.schoolYear || "2026-2027",
        mappingStatus: "official-gel-inventory-exact-pdf",
        sourceUrl: mapping.url || null,
        pdfPage: mapping.pdfPage || null,
        verifiedHeading: mapping.heading || null,
        message: "Η επίσημη σελίδα PDF έχει επαληθευτεί, αλλά δεν υπάρχει ακόμη server-side εξαγωγή του κειμένου της συγκεκριμένης σελίδας. Δεν θα χρησιμοποιηθεί γενική γνώση ως υποκατάστατο."
      });
    }

    return res.status(404).json({
      grounded: false,
      error: "section_not_resolved",
      bookTitle: fallbackTitle,
      schoolYear: GEL_SCHOOLBOOK_SOURCE_MAP?.schoolYear || "2026-2027",
      reviewStatus: gelInventory.reason,
      inventoryStatus: mapping?.status || gelInventory.row?.status || null,
      message: "Η επιλογή δεν έχει ακόμη ακριβή, ενεργοποιημένη αντιστοίχιση σε επίσημο κείμενο σχολικού βιβλίου."
    });
  }

  const book =
    BOOKS[subject] ||
    buildCatalogBook(subject) ||
    buildGelInventoryBook(gelInventory);

  if (!book || !topic) {
    return res.status(404).json({
      grounded: false,
      error: "source_not_mapped",
      message: "Δεν υπάρχει ακόμη χαρτογραφημένη επίσημη πηγή για αυτή την επιλογή."
    });
  }

  let directUrls = resolveDirectSourceUrls(subject, topic);
  if (!directUrls.length && gelInventory?.runtimeEligible) {
    directUrls = [gelInventory.mapping.url];
  }
  if (!directUrls.length && book.mode === "linkedSection") {
    directUrls = await resolveLinkedSectionUrls(book, topic);
  }
  const path = directUrls.length ? "__direct__" : resolveSectionPath(book.mode, topic);
  if (book.officialSourceRequired && !directUrls.length && !path) {
    return res.status(404).json({
      grounded: false,
      error: "section_not_resolved",
      bookTitle: book.title,
      schoolYear: book.schoolYear,
      curriculumSource: book.curriculumSource,
      message: "Η επιλογή δεν ανήκει στην επαληθευμένη ύλη 2026–27 ή δεν έχει ακριβή αντιστοίχιση σε επίσημη σελίδα."
    });
  }
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
      const gelAnchorScoped =
        gelInventory?.runtimeEligible &&
        gelInventory.mapping?.granularity === "section-anchor";

      if (gelAnchorScoped) {
        const scopedPages = pages.map((html, i) =>
          selectGelAnchoredSectionText(html, sourceUrls[i], gelInventory.mapping)
        );
        if (scopedPages.some((text) => text.length < 500)) {
          return res.status(404).json({
            grounded: false,
            error: "verified_anchor_text_not_resolved",
            bookTitle: book.title,
            sourceUrls,
            verifiedHeading: gelInventory.mapping?.heading || null,
            message: "Η επαληθευμένη υποενότητα βρέθηκε, αλλά δεν απομονώθηκε αρκετό ακριβές κείμενο για ασφαλές grounding."
          });
        }
        combinedText = scopedPages.map((text, i) => {
          const label = sourceUrls[i] ? "[Official section: " + sourceUrls[i] + "]\n" : "";
          return label + text;
        }).join("\n\n");
      } else {
        const needsFullDirectText =
          subject === "english-b-gymnasiou" ||
          (subject === "archaia-glossa-b-gymnasiou" && unitNumber(topic) === 8) ||
          (subject === "fysiki-g-gymnasiou" && !!physicsGAnnualTopicKey(topic));
        combinedText = needsFullDirectText
          ? pages.map((html, i) => {
              const label = sourceUrls[i] ? "[Official page: " + sourceUrls[i] + "]\n" : "";
              return label + htmlToText(html);
            }).join("\n\n")
          : distributeOfficialPages(pages, sourceUrls, 42000);
      }
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

    const scoped = applyCurriculumTextScope(subject, topic, combinedText);
    const useful = subject === "english-b-gymnasiou"
      ? selectEnglishBUnitText(scoped.text, topic)
      : (book.multi ? scoped.text : selectUsefulText(scoped.text, topic));
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
      grade: book.grade || null,
      topic,
      section: topic,
      bookTitle: book.title,
      schoolYear: book.schoolYear || null,
      schoolbookSource: book.base || null,
      annualGuidanceSource: book.curriculumSource || null,
      curriculumSource: book.curriculumSource || null,
      mappingStatus: book.mappingStatus || "schoolbook-source-mapped",
      lastVerified: book.lastVerified || null,
      annualScopeVerified: book.annualScopeVerified === true,
      curriculumExclusions: scoped.exclusions,
      curriculumScopeApplied: scoped.exclusions.length > 0,
      sourceUrl,
      sourceUrls,
      canonicalSourceUrl: book.canonicalSourceUrl || null,
      mappingConfidence: book.mappingConfidence || null,
      labelParaphrase: book.labelParaphrase === true,
      verifiedHeading: book.verifiedHeading || null,
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

  if (subject === "environment-a-dimotikou") {
    const base = BOOKS[subject].base;
    const exact = new Map([
      [normalize("Βασικές ανάγκες ζωντανών οργανισμών"), ["index7_2.html"]],
      [normalize("Κανόνες στο σχολείο και στην ομάδα"), ["index1_1.html"]],
      [normalize("Παρατήρηση με τις αισθήσεις"), ["index4_2.html"]]
    ]);
    const paths = exact.get(t) || [];
    return paths.map(path => new URL(path, base).toString());
  }

  if (subject === "environment-b-dimotikou") {
    const base = BOOKS[subject].base;
    const exact = new Map([
      [normalize("Τι χρειάζεται ένα φυτό"), ["index_7.html"]],
      [normalize("Ζώα και τόπος ζωής"), ["index_6.html"]],
      [normalize("Υπηρεσίες της κοινότητας"), ["index_2.html"]]
    ]);
    const paths = exact.get(t) || [];
    return paths.map(path => new URL(path, base).toString());
  }

  if (subject === "environment-c-dimotikou") {
    const base = BOOKS[subject].base;
    const exact = new Map([
      [normalize("Συνεργασία και κανόνες"), ["index1_1.html", "index1_2.html"]],
      [normalize("Φυσικά χαρακτηριστικά και ανθρώπινα έργα"), ["index2_3.html"]],
      [normalize("Τροφή και ενέργεια"), ["index5_1.html", "index5_2.html"]],
      [normalize("Φροντίδα του περιβάλλοντος"), ["index2_4.html"]],
      [normalize("Χάρτης και προσανατολισμός"), ["index2_5.html"]]
    ]);
    const paths = exact.get(t) || [];
    return paths.map(path => new URL(path, base).toString());
  }

  if (subject === "environment-d-dimotikou") {
    const base = BOOKS[subject].base;
    const exact = new Map([
      [normalize("Οικοσύστημα"), ["index3_1.html", "index3_2.html"]],
      [normalize("Σχέσεις τροφής στο οικοσύστημα"), ["index3_2.html"]],
      [normalize("Φυσικά χαρακτηριστικά του τόπου"), ["index1_5.html"]],
      [normalize("Έργα και ανάγκες της κοινότητας"), ["index1_8.html", "index1_9.html"]]
    ]);
    const paths = exact.get(t) || [];
    return paths.map(path => new URL(path, base).toString());
  }

  if (subject === "pliroforiki-a-gymnasiou") {
    const base = BOOKS[subject].base;
    const exact = new Map([
      [normalize("Διαδίκτυο, Ιστορία του Διαδικτύου, Υπηρεσίες Διαδικτύου"), ["indexA_4_1.html"]],
      [normalize("Βασικές Έννοιες Πληροφορικής"), ["indexA_1_1.html"]],
      [normalize("Το Υλικό του Υπολογιστή"), ["indexA_1_2.html"]],
      [normalize("Επεξεργασία Κειμένου – Μορφοποίηση Γραμματοσειράς και Παραγράφου"), ["indexA_3_2.html"]]
    ]);
    const paths = exact.get(t) || [];
    return paths.map(path => new URL(path, base).toString());
  }

  if (subject === "pliroforiki-b-gymnasiou") {
    const base = BOOKS[subject].base;
    const exact = new Map([
      [normalize("Ψηφιακός Κόσμος"), ["indexB_1_1.html"]],
      [normalize("Το Εσωτερικό του Υπολογιστή"), ["indexB_1_2.html"]],
      [normalize("Δίκτυα Υπολογιστών"), ["indexB_1_4.html"]],
      [normalize("Χρήση συναρτήσεων στο λογισμικό Υπολογιστικά Φύλλα"), ["indexB_3_8.html"]],
      [normalize("Παρουσιάσεις – Διαχείριση Διαφανειών, Εναλλαγή Διαφανειών, Κινήσεις"), ["indexB_3_9.html"]]
    ]);
    const paths = exact.get(t) || [];
    return paths.map(path => new URL(path, base).toString());
  }

  if (subject === "pliroforiki-c-gymnasiou") {
    const base = BOOKS[subject].base;
    const exact = new Map([
      [normalize("Πρόβλημα – Αλγόριθμος"), ["indexG_1_1.html"]],
      [normalize("Αριθμητικές Πράξεις, Εντολές Εξόδου"), ["indexG_1_2.html"]],
      [normalize("Εντολές Εξόδου, Μεταβλητές"), ["indexG_1_2.html"]],
      [normalize("Σχεδιασμός γεωμετρικών σχημάτων – Επανάληψη – Διαδικασίες"), ["indexG_1_2.html"]],
      [normalize("Επιλέγοντας"), ["indexG_1_2.html"]]
    ]);
    const paths = exact.get(t) || [];
    return paths.map(path => new URL(path, base).toString());
  }

  if (subject === "technologia-a-gymnasiou") {
    const base = BOOKS[subject].base;
    const exact = new Map([
      [normalize("Τεχνολογικό περιβάλλον και τεχνολογικοί άξονες"), ["index1.html", "index3.html"]],
      [normalize("Επιλογή και μελέτη τεχνολογικού αντικειμένου"), ["index3.html"]],
      [normalize("Ατομική εργασία: σχεδιασμός και κατασκευή"), ["index2.html", "index4.html"]],
      [normalize("Τεχνικό σχέδιο, υλικά και εργαλεία"), ["index4.html", "index7.html"]],
      [normalize("Παρουσίαση και αξιολόγηση της κατασκευής"), ["index5.html", "index6.html"]]
    ]);
    const paths = exact.get(t) || [];
    return paths.map(path => new URL(path, base).toString());
  }

  if (subject === "fysiki-a-gymnasiou") {
    const base = BOOKS[subject].base;
    const exact = new Map([
      [normalize("Μετρήσεις μήκους και μέση τιμή"), "index1.html"],
      [normalize("Μετρήσεις χρόνου και ακρίβεια"), "index2.html"],
      [normalize("Μετρήσεις μάζας και διαγράμματα"), "index3.html"],
      [normalize("Θερμοκρασία και βαθμονόμηση"), "index4.html"],
      [normalize("Θερμότητα, θερμοκρασία και θερμική ισορροπία"), "index5.html"],
      [normalize("Ηλεκτρικό βραχυκύκλωμα και ασφάλεια"), "index10.html"],
      [normalize("Από τον ηλεκτρισμό στον μαγνητισμό"), "index11.html"],
      [normalize("Από τον μαγνητισμό στον ηλεκτρισμό"), "index12.html"]
    ]);
    const path = exact.get(t);
    return path ? [new URL(path, base).toString()] : [];
  }

  if (subject === "geografia-a-gymnasiou") {
    const base = BOOKS[subject].base;
    const exact = new Map([
      [normalize("Χάρτες: είδη, υπόμνημα και κλίμακα"), ["matA1_3.html", "matA1_4.html", "matA1_5.html"]],
      [normalize("Γεωγραφικές συντεταγμένες και προσανατολισμός"), ["matA1_1.html", "matA1_2.html", "matA1_3.html"]],
      [normalize("Η Γη στο ηλιακό σύστημα"), ["matB1_1.html"]],
      [normalize("Λιθόσφαιρα: ανάγλυφο και τεκτονικές πλάκες"), ["matB4_2.html", "matB4_3.html", "matB4_4.html"]],
      [normalize("Υδρόσφαιρα: ωκεανοί, θάλασσες και ποτάμια"), ["matB3_1.html", "matB3_2.html", "matB3_4.html"]],
      [normalize("Ατμόσφαιρα, καιρός και κλίμα"), ["matB2_1.html", "matB2_2.html"]],
      [normalize("Βιόσφαιρα και φυσικά οικοσυστήματα"), ["matB5_1.html"]],
      [normalize("Ανθρωπογενές περιβάλλον: πληθυσμός και οικισμοί"), ["matC1_1.html", "matC1_2.html", "matC1_4.html", "matC1_5.html"]],
      [normalize("Ήπειροι: συνθετική εργασία (προαιρετική εμβάθυνση)"), [
        "matD1_0.html", "matD2_0.html", "matD3_0.html", "matD4_0.html",
        "matD5_0.html", "matD6_0.html", "matD7_0.html"
      ]]
    ]);
    const paths = exact.get(t) || [];
    return paths.map(path => new URL(path, base).toString());
  }

  if (subject === "istoria-st-dimotikou") {
    const base = "https://ebooks.edu.gr/ebooks/v/html/8547/2188/Istoria_ST-Dimotikou_html-empl/";
    const units = [
      ["Ενότητα Α — Οι εξελίξεις στην Ευρώπη κατά τους Νεότερους Χρόνους (μέσα 15ου αιώνα - αρχές 19ου αιώνα)", 1, 3],
      ["Ενότητα Β — Οι Έλληνες κάτω από την οθωμανική και τη λατινική κυριαρχία (1453-1821)", 2, 10],
      ["Ενότητα Γ — Η Μεγάλη Επανάσταση (1821-1830)", 3, 18],
      ["Ενότητα Δ — Η Ελλάδα στον 19ο αιώνα", 4, 6],
      ["Ενότητα Ε — Η Ελλάδα στον 20ό αιώνα", 5, 12]
    ];
    const exact = units.find(([label]) => normalize(label) === t);
    if (!exact) return [];
    const [, unitNumber, chapterCount] = exact;
    return Array.from({ length: chapterCount }, (_, i) =>
      new URL(`index${unitNumber}_${i + 1}.html`, base).toString()
    );
  }

  if (subject === "istoria-b-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveHistoryCurriculumPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "istoria-a-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveHistoryAQuizPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "istoria-g-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveHistoryGQuizPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "istoria-a-lykeiou") {
    const base = BOOKS[subject].base;
    // Exact source for the currently mapped "Περικλής και αθηναϊκή δημοκρατία"
    // topic. Do not expose the rest of the book as if it were the selected unit.
    if (t.includes("περικλ") && t.includes("αθηνα") && t.includes("δημοκρατ")) {
      return [new URL("indexII2_3.html", base).toString()];
    }
    return [];
  }

  if (subject === "mathimatika-a-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveMathAQuizPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "mathimatika-b-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveMathBCurriculumPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "mathimatika-g-gymnasiou") {
    return resolveMathGQuizUrls(topic);
  }

  if (subject === "glossa-a-gymnasiou") {
    return resolveGlossaAQuizUrls(topic);
  }

  if (subject === "glossa-gymnasiou") {
    const diagnostic = resolveGlossaGQuizUrls(topic);
    if (diagnostic.length) return diagnostic;
    const unitMatch = String(topic || "").match(/^\s*(\d+)(?:η|ή)?\s+Ενότητα(?=\s|$|[·—–:.,;\-])/i);
    const unit = unitMatch ? Number(unitMatch[1]) : 0;
    if (!Number.isInteger(unit) || unit < 1 || unit > 8) return [];
    const letter = String.fromCharCode("b".charCodeAt(0) + unit - 1);
    return [new URL(`index${letter}_0.html`, BOOKS[subject].base).toString()];
  }

  if (subject === "chimeia-b-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveChemistryBCurriculumPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "geologia-geografia-b-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveGeographyBCurriculumPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "logotechnia-b-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveLiteratureBCurriculumPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "physics-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolvePhysicsBCurriculumPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "fysiki-g-gymnasiou") {
    const chapterMatch = String(topic || "").match(/^\s*Κεφάλαιο\s+(\d+)\b/i);
    const chapter = chapterMatch ? Number(chapterMatch[1]) : 0;
    if (Number.isInteger(chapter) && chapter >= 1 && chapter <= 11) {
      return [new URL(`index${chapter}.html`, BOOKS[subject].base).toString()];
    }
    return resolvePhysicsGQuizUrls(topic);
  }

  if (subject === "chimeia-g-gymnasiou") {
    const chapterMatch = String(topic || "").match(/^\s*(\d+)(?:η|ή)?\s+Ενότητα\s*·\s*Κεφάλαιο\s+(\d+)\b/i);
    const unit = chapterMatch ? Number(chapterMatch[1]) : 0;
    const chapter = chapterMatch ? Number(chapterMatch[2]) : 0;
    const maxChapter = unit === 1 ? 5 : (unit === 2 ? 6 : (unit === 3 ? 4 : 0));
    if (maxChapter && Number.isInteger(chapter) && chapter >= 1 && chapter <= maxChapter) {
      return [new URL(`index${unit}_${chapter}.html`, BOOKS[subject].base).toString()];
    }
    return resolveChemistryGQuizUrls(topic);
  }

  if (subject === "biologia-g-gymnasiou") return resolveBiologyGQuizUrls(topic);

  if (subject === "biologia-b-gymnasiou") {
    return resolveBiologyBCurriculumUrls(topic);
  }

  if (subject === "archaia-glossa-b-gymnasiou" && unitNumber(topic) === 8) {
    const base = BOOKS[subject].base;
    return [
      new URL("index08.html", base).toString(),
      new URL("index19a_parall.html", base).toString()
    ];
  }

  if (subject === "iliada-b-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveIliadBCurriculumPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "english-b-gymnasiou") {
    return resolveEnglishBCurriculumUrls(topic);
  }

  if (subject === "thriskeftika-b-gymnasiou") {
    return resolveReligionBSourceUrls(topic);
  }

  if (subject === "english-g-gymnasiou") {
    const base = "https://ebooks.edu.gr/ebooks/v/html/8547/2324/Agglika_G-Gymnasiou_html-empl/";
    const unitMatch = String(topic || "").match(/^\s*Unit\s+(\d+)\b/i);
    const unit = unitMatch ? Number(unitMatch[1]) : 0;
    if (!Number.isInteger(unit) || unit < 1 || unit > 10) return [];
    return [1, 2, 3].map(lesson =>
      new URL(`index${unit}_${lesson}.html`, base).toString()
    );
  }

  if (subject === "biologia-a-lykeiou") {
    const base = "https://ebooks.edu.gr/ebooks/v/html/8547/2666/Biologia_A-Lykeiou_html-empl/";
    const chapterMatch = String(topic || "").match(/^\s*Κεφάλαιο\s+(\d+)\b/i);
    const chapter = chapterMatch ? Number(chapterMatch[1]) : 0;
    if (!Number.isInteger(chapter) || chapter < 1 || chapter > 12) return [];
    return [new URL(`index${chapter}.html`, base).toString()];
  }

  if (subject === "ekthesi-g-lykeiou") {
    const base = "https://ebooks.edu.gr/ebooks/v/html/8547/2678/Ekfrasi-Ekthesi_G-Lykeiou_html-empl/";
    const chapterMatch = String(topic || "").match(/^\s*Κεφάλαιο\s+(\d+)\b/i);
    const chapter = chapterMatch ? Number(chapterMatch[1]) : 0;
    const paths = { 1: "indexa_01.html", 2: "indexc_00.html", 3: "indexf_00.html" };
    if (paths[chapter]) return [new URL(paths[chapter], base).toString()];
    return [];
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

  return [];
}

function resolveSectionPath(mode, topic) {
  const t = String(topic || "");

  if (mode === "biologyA" || mode === "biologyB" || mode === "biologyGQuiz" || mode === "physicsB" || mode === "physicsGQuiz" || mode === "chemistryGQuiz" || mode === "iliadB" || mode === "englishB" || mode === "religionB") return "";

  if (mode === "ancientGreekB") {
    const n = unitNumber(topic);
    if (!ANCIENT_GREEK_B_2026_2027_UNITS.has(n)) return "";
    return `index${String(n).padStart(2, "0")}.html`;
  }

  if (mode === "modernGreekBAnnual") {
    const n = unitNumber(topic);
    if (!Number.isInteger(n) || n < 1 || n > 9) return "";
    return `en${n}_`;
  }

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

function unitNumber(topic) {
  const value = String(topic || "");
  const m = value.match(/(?:Ενότητα|ενότητα|Unit)\s*(\d+)|(\d+)(?:η|ή)?\s+(?:Ενότητα|ενότητα)/i);
  if (!m) return 0;
  const n = Number(m[1] || m[2]);
  return Number.isInteger(n) ? n : 0;
}

function resolveGlossaAQuizUrls(topic) {
  const key = normalize(topic);
  return GLOSSA_A_GYM_DIAGNOSTIC_SOURCES[key] ? [...GLOSSA_A_GYM_DIAGNOSTIC_SOURCES[key]] : [];
}

function resolveGlossaGQuizUrls(topic) {
  const key = normalize(topic);
  return GLOSSA_G_GYM_DIAGNOSTIC_SOURCES[key] ? [...GLOSSA_G_GYM_DIAGNOSTIC_SOURCES[key]] : [];
}

function resolveMathAQuizPaths(topic) {
  const key = normalize(topic);
  return MATH_A_GYM_DIAGNOSTIC_PATHS[key] ? [...MATH_A_GYM_DIAGNOSTIC_PATHS[key]] : [];
}

function resolveMathGQuizUrls(topic) {
  const key = normalize(topic);
  return MATH_G_GYM_DIAGNOSTIC_SOURCES[key] ? [...MATH_G_GYM_DIAGNOSTIC_SOURCES[key]] : [];
}

function physicsGAnnualTopicKey(topic) {
  return PHYSICS_G_GYM_ANNUAL_TOPIC_KEYS[normalize(topic)] || "";
}

function resolvePhysicsGQuizUrls(topic) {
  const key = normalize(topic);
  if (PHYSICS_G_GYM_DIAGNOSTIC_SOURCES[key]) return [...PHYSICS_G_GYM_DIAGNOSTIC_SOURCES[key]];
  return PHYSICS_G_GYM_ANNUAL_TOPIC_SOURCES[key] ? [...PHYSICS_G_GYM_ANNUAL_TOPIC_SOURCES[key]] : [];
}

function resolveChemistryGQuizUrls(topic) {
  const key = normalize(topic);
  return CHEMISTRY_G_GYM_DIAGNOSTIC_SOURCES[key] ? [...CHEMISTRY_G_GYM_DIAGNOSTIC_SOURCES[key]] : [];
}

function resolveBiologyGQuizUrls(topic) {
  const key = normalize(topic);
  return BIOLOGY_G_GYM_DIAGNOSTIC_SOURCES[key] ? [...BIOLOGY_G_GYM_DIAGNOSTIC_SOURCES[key]] : [];
}

function physicsBTopicKey(topic) {
  const value = String(topic || "");
  const match = value.match(/(?:^|[^\d])(\d+)\.(\d+)(?:[^\d]|$)/);
  if (match) return `${Number(match[1])}.${Number(match[2])}`;

  // AI Study also exposes verified diagnostic anchors whose learner-friendly
  // labels do not always contain the official section number.
  const t = normalize(value);
  if ((t.includes("πυκνοτητα") && t.includes("μαζα")) || (t.includes("density") && t.includes("mass"))) return "1.3";
  if ((t.includes("μεση") && t.includes("ταχυτητα")) || (t.includes("average") && t.includes("speed"))) return "2.2";
  if ((t.includes("πιεση") && t.includes("δυναμη") && t.includes("επιφανεια")) || (t.includes("pressure") && t.includes("force") && t.includes("area"))) return "4.1";
  if ((t.includes("δυναμη") && t.includes("μεταβολ") && t.includes("ταχυτητα")) || (t.includes("force") && t.includes("change") && (t.includes("velocity") || t.includes("speed")))) return "3.6";
  return "";
}

function resolvePhysicsBCurriculumPaths(topic) {
  const key = physicsBTopicKey(topic);
  return key && PHYSICS_B_2026_2027_PATHS[key]
    ? [...PHYSICS_B_2026_2027_PATHS[key]]
    : [];
}

function resolveBiologyBCurriculumUrls(topic) {
  const match = String(topic || "").match(/(?:^|[^\d])(\d+)\.(\d+)(?:[^\d]|$)/);
  const key = match ? `${Number(match[1])}.${Number(match[2])}` : "";
  return key && BIOLOGY_B_2026_2027_SOURCES[key]
    ? [...BIOLOGY_B_2026_2027_SOURCES[key]]
    : [];
}

function iliadBTopicKey(topic) {
  const t = normalize(topic);
  if (t.includes("εισαγωγη")) return "intro";
  if (t.includes("α 1 53")) return "a1-53";
  if (t.includes("α 54 306")) return "a54-306";
  if (t.includes("α 307 431")) return "a307-431a";
  if (t.includes("α 431") && t.includes("612") && !t.includes("γ 121")) return "a431b-612";
  if ((t.includes("β") || t.includes("ραψωδιες β")) && t.includes("γ 121") && t.includes("244")) return "bg121-244";
  if (t.includes("δ") && t.includes("ε") && t.includes("ζ") && t.includes("369") && t.includes("529")) return "dez369-529";
  if (t.includes("η") && t.includes("θ") && t.includes("ι") && t.includes("225") && t.includes("431")) return "hthi225-431";
  if (t.includes("κ") && t.includes("λ") && t.includes("μ") && t.includes("ν") && t.includes("ξ") && t.includes("ο")) return "klmnxo";
  if (t.includes("π") && t.includes("1") && t.includes("100") && t.includes("684") && t.includes("867")) return "p1-100-684-867";
  return "";
}

function resolveIliadBCurriculumPaths(topic) {
  const key = iliadBTopicKey(topic);
  return key && ILIAD_B_2026_2027_PATHS[key]
    ? [...ILIAD_B_2026_2027_PATHS[key]]
    : [];
}

function englishBSelection(topic) {
  const value = String(topic || "");
  const t = normalize(value);
  const unitMatch = value.match(/Unit\s*(\d+)/i);
  const n = unitMatch ? Number(unitMatch[1]) : 0;
  const level = (t.includes("αρχαρι") || t.includes("beginner"))
    ? "beginner"
    : ((t.includes("προχωρη") || t.includes("advanced")) ? "advanced" : "");
  if (!level || !Number.isInteger(n) || !ENGLISH_B_UNITS[level]?.[n]) return null;
  return { level, unit: n, title: ENGLISH_B_UNITS[level][n] };
}

function resolveEnglishBCurriculumUrls(topic) {
  const selection = englishBSelection(topic);
  if (!selection) return [];
  return [selection.level === "beginner" ? ENGLISH_B_BEGINNER_URL : ENGLISH_B_ADVANCED_URL];
}

function selectEnglishBUnitText(text, topic) {
  const full = String(text || "").trim();
  const selection = englishBSelection(topic);
  if (!selection) return "";
  const marker = normalize(selection.title);
  const lines = full.split("\n");
  let lineIndex = lines.findIndex(line => normalize(line).includes(marker));
  if (lineIndex < 0) return selectUsefulText(full, selection.title);

  const start = Math.max(0, lineIndex - 8);
  const unitPrefix = /^\s*(?:UNIT\s+)?\d+\b/i;
  let end = lines.length;
  for (let i = lineIndex + 1; i < lines.length; i++) {
    const norm = normalize(lines[i]);
    if (i > lineIndex + 8 && unitPrefix.test(lines[i]) && !norm.includes(marker)) {
      end = i;
      break;
    }
  }
  const chunk = lines.slice(start, end).join("\n").trim();
  return chunk.length >= 500 ? chunk.slice(0, 42000) : selectUsefulText(full, selection.title);
}

function resolveHistoryAQuizPaths(topic) {
  const key = normalize(topic);
  return HISTORY_A_GYM_DIAGNOSTIC_PATHS[key] ? [...HISTORY_A_GYM_DIAGNOSTIC_PATHS[key]] : [];
}

function resolveHistoryGQuizPaths(topic) {
  const key = normalize(topic);
  return HISTORY_G_GYM_DIAGNOSTIC_PATHS[key] ? [...HISTORY_G_GYM_DIAGNOSTIC_PATHS[key]] : [];
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

function resolveGeographyBCurriculumPaths(topic) {
  const key = geographyBTopicKey(topic);
  return key && GEOGRAPHY_B_2026_2027_PATHS[key]
    ? [...GEOGRAPHY_B_2026_2027_PATHS[key]]
    : [];
}

function geographyBTopicKey(topic) {
  const value = String(topic || "");
  const match = value.match(/Μάθημα\s+(\d+)/i);
  if (!match) return "";
  const lesson = Number(match[1]);
  return Number.isInteger(lesson) && lesson > 0 ? String(lesson) : "";
}

function resolveLiteratureBCurriculumPaths(topic) {
  const value = normalize(topic);
  const matches = LITERATURE_B_2026_2027_TEXTS.filter(row =>
    row.titles.some(title => {
      const needle = normalize(title);
      return needle.length >= 6 && value.includes(needle);
    })
  );
  return [...new Set(matches.map(row => row.path))];
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

function topicLabelCandidates(topic) {
  const raw = String(topic || "").trim();
  const variants = [raw];
  const withoutPageSuffix = raw
    .replace(/\s*[\[(]?\s*page\s+\d+(?:\s*[-–]\s*\d+)?\s*[\])]?\s*$/i, "")
    .trim();
  variants.push(withoutPageSuffix);
  const withoutUnit = raw
    .replace(/^\s*(?:\d+\s*(?:η|ή)?\s*(?:ενότητα)?|ενότητα\s*\d+|unit\s*\d+|pre-unit|extra\s+unit)\s*[—–:.-]*\s*/i, "")
    .trim();
  variants.push(withoutUnit);

  const unitPrefixMatch = raw.match(/^\s*((?:\d+\s*(?:η|ή)?\s*ενότητα)|(?:ενότητα\s*\d+))/i);
  if (unitPrefixMatch?.[1]) variants.push(unitPrefixMatch[1]);

  // Same exact numeric unit, regardless of whether the official book writes
  // "1η Ενότητα" or "Ενότητα 1η". This is deterministic normalization,
  // not fuzzy matching: only the explicit unit number is compared.
  const numericUnitMatch =
    raw.match(/ενότητα\s*(\d+)\s*(?:η|ή)?(?=\s|$|[·—–:.,;\-])/i) ||
    raw.match(/^\s*(\d+)\s*(?:η|ή)?\s*ενότητα(?=\s|$|[·—–:.,;\-])/i);
  if (numericUnitMatch?.[1]) variants.push(`ενότητα ${numericUnitMatch[1]}`);

  const periodUnitPrefixMatch = raw.match(/^\s*([Α-ΩA-Z]+[΄'’]?\s*περίοδος\s*[·—–:-]\s*[Α-ΩA-Z]+[΄'’]?\s*ενότητα)/i);
  if (periodUnitPrefixMatch?.[1]) variants.push(periodUnitPrefixMatch[1]);

  const greekLetterUnitPrefix = raw.match(/^\s*(ενότητα\s+[Α-ΩA-Z]+[΄'’]?)/i);
  if (greekLetterUnitPrefix?.[1]) variants.push(greekLetterUnitPrefix[1]);

  const greekLetterPrefix = raw.match(/^\s*([Α-ΩA-Z]+[΄'’]?)\s*[—–:-]/i);
  if (greekLetterPrefix?.[1]) variants.push(greekLetterPrefix[1]);

  const withoutChapterWord = raw
    .replace(/^\s*(?:κεφάλαιο|chapter)\s*/i, "")
    .trim();
  variants.push(withoutChapterWord);

  const withoutChapterNumber = withoutChapterWord
    .replace(/^\s*\d+(?:[.,]\d+)*\s*[—–:.-]*\s*/i, "")
    .trim();
  variants.push(withoutChapterNumber);

  const withoutLeadingNumber = raw
    .replace(/^\s*\d+(?:[.,]\d+)*\s*[—–:.-]*\s*/i, "")
    .trim();
  variants.push(withoutLeadingNumber);

  return [...new Set(variants.map(normalize).filter(Boolean))];
}

function officialLinkAllowed(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && /(^|\.)ebooks\.edu\.gr$/i.test(parsed.hostname);
  } catch (_) {
    return false;
  }
}

function resolveLinkedSectionUrlsFromHtml(book, topic, html) {
  const wanted = new Set(topicLabelCandidates(topic));
  if (!wanted.size || !html || !book?.base) return [];

  const source = String(html);

  // Prefer an exact optgroup when the official navigation represents one
  // curriculum section as a group of chapter/page links. This gives the whole
  // selected section instead of accidentally grounding only its first page.
  const groupMatches = [];
  const groupRe = /<optgroup\b[^>]*label\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/optgroup>/gi;
  let match;
  while ((match = groupRe.exec(source))) {
    const groupLabelCandidates = topicLabelCandidates(decodeEntities(match[1] || ""));
    if (!groupLabelCandidates.some((label) => wanted.has(label))) continue;

    const urls = [];
    const body = String(match[2] || "");
    const groupOptionRe = /<option\b[^>]*value\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/option>/gi;
    let optionMatch;
    while ((optionMatch = groupOptionRe.exec(body))) {
      const href = String(optionMatch[1] || "").trim();
      if (!href || /^javascript:/i.test(href) || href.startsWith("#")) continue;
      let absolute = "";
      try { absolute = new URL(href, book.base).toString(); } catch (_) { continue; }
      if (!officialLinkAllowed(absolute)) continue;
      if (!/\.html?(?:$|[?#])/i.test(absolute)) continue;
      if (!urls.includes(absolute)) urls.push(absolute);
    }
    if (urls.length) groupMatches.push(urls);
  }
  if (groupMatches.length === 1) return groupMatches[0];
  if (groupMatches.length > 1) return [];

  const matches = [];
  const addExact = (href, rawLabel) => {
    href = String(href || "").trim();
    if (!href || /^javascript:/i.test(href) || href.startsWith("#")) return;
    let absolute = "";
    try { absolute = new URL(href, book.base).toString(); } catch (_) { return; }
    if (!officialLinkAllowed(absolute)) return;
    if (!/\.html?(?:$|[?#])/i.test(absolute)) return;
    const labelCandidates = topicLabelCandidates(htmlToText(rawLabel || ""));
    if (!labelCandidates.some((label) => wanted.has(label))) return;
    if (!matches.includes(absolute)) matches.push(absolute);
  };

  const anchorRe = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  while ((match = anchorRe.exec(source))) addExact(match[1], match[2]);

  const optionRe = /<option\b[^>]*value\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/option>/gi;
  while ((match = optionRe.exec(source))) addExact(match[1], match[2]);

  // Exact matching only. Ambiguity fails closed rather than choosing by similarity.
  return matches.length === 1 ? matches : [];
}

function resolveExplicitSectionUrls(book, topic) {
  const sources = book?.sectionSources || {};
  const wanted = new Set(topicLabelCandidates(topic));
  const matches = [];
  for (const [label, url] of Object.entries(sources)) {
    const candidates = topicLabelCandidates(label);
    if (!candidates.some((candidate) => wanted.has(candidate))) continue;
    if (!officialLinkAllowed(url)) continue;
    if (!matches.includes(url)) matches.push(url);
  }
  return matches.length === 1 ? matches : [];
}

async function resolveLinkedSectionUrls(book, topic) {
  const explicit = resolveExplicitSectionUrls(book, topic);
  if (explicit.length) return explicit;
  const rootHtml = await fetchOfficialHtml(book.base);
  return rootHtml ? resolveLinkedSectionUrlsFromHtml(book, topic, rootHtml) : [];
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

function gelSectionNumberInfo(value) {
  const raw = String(value || "").replace(/\s+/g, " ").trim();
  if (!raw || raw.length > 260) return null;
  const match = raw.match(/^((?:\d+(?:\.\d+)+)|(?:Ε\.?\d+))\.?\s+(\S.{1,220})$/i);
  if (!match) return null;
  const num = String(match[1]).toUpperCase().replace(/^Ε\./, "Ε");
  const depth = /^Ε/.test(num) ? 1 : num.split(".").length;
  return { num, depth, title: match[2].trim() };
}

function gelVerifiedHeadingOffsets(rawHtml) {
  // Mirrors the Phase 14 audit's linear-token heading parser, while retaining
  // source offsets so a verified #anchor can be sliced to its own section.
  const html = String(rawHtml || "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (m) => " ".repeat(m.length))
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, (m) => " ".repeat(m.length));
  const tokens = [];
  const BLOCK = /^\/?(?:p|div|td|th|tr|li|ul|ol|br|h[1-6]|table|tbody|section|article|body|center|blockquote)\b/i;
  let buf = "";
  let anchor = null;
  let anchorOffset = -1;
  let textOffset = -1;
  const flush = () => {
    const value = decodeEntities(buf).replace(/\s+/g, " ").trim();
    if (value) tokens.push({ text: value, anchor, offset: anchorOffset >= 0 ? anchorOffset : textOffset });
    buf = "";
    anchor = null;
    anchorOffset = -1;
    textOffset = -1;
  };

  const re = /<([^>]*)>|([^<]+)/g;
  let match;
  while ((match = re.exec(html))) {
    if (match[1] !== undefined) {
      if (BLOCK.test(match[1])) flush();
      const anchorMatch = match[1].match(/\b(?:id|name)\s*=\s*["']([^"']+)["']/i);
      if (anchorMatch && !anchor) {
        anchor = decodeEntities(anchorMatch[1]);
        anchorOffset = match.index;
      }
      buf += " ";
    } else {
      if (textOffset < 0 && String(match[2] || "").trim()) textOffset = match.index;
      buf += match[2];
    }
  }
  flush();

  const out = [];
  for (let i = 0; i < tokens.length; i++) {
    const direct = gelSectionNumberInfo(tokens[i].text);
    if (direct) {
      out.push({ ...direct, anchor: tokens[i].anchor, offset: tokens[i].offset });
      continue;
    }

    const numberOnly = tokens[i].text.match(/^((?:\d+(?:\.\d+)+)|(?:Ε\.?\d+))\.?$/i);
    const next = tokens[i + 1];
    if (!numberOnly || !next || next.text.length < 2 || next.text.length > 220) continue;
    const combined = gelSectionNumberInfo(numberOnly[1] + " " + next.text);
    if (!combined) continue;
    out.push({
      ...combined,
      anchor: tokens[i].anchor || next.anchor,
      offset: tokens[i].offset >= 0 ? tokens[i].offset : next.offset
    });
  }

  return out.filter((entry) => Number.isInteger(entry.offset) && entry.offset >= 0);
}

function selectGelAnchoredSectionText(rawHtml, sourceUrl, mapping) {
  if (!rawHtml || !sourceUrl || !mapping?.heading) return "";
  let fragment = "";
  try { fragment = decodeURIComponent(new URL(sourceUrl).hash.slice(1)); } catch (_) { return ""; }
  if (!fragment || mapping?.granularity !== "section-anchor") return "";

  const headings = gelVerifiedHeadingOffsets(rawHtml);
  const verified = normalize(mapping.heading);
  const index = headings.findIndex((entry) => {
    if (String(entry.anchor || "") !== fragment) return false;
    const candidate = normalize(entry.num + " " + entry.title);
    return candidate === verified ||
      (verified.length >= 8 && (candidate.startsWith(verified) || verified.startsWith(candidate)));
  });
  if (index < 0) return "";

  const current = headings[index];
  let endOffset = String(rawHtml).length;
  for (let i = index + 1; i < headings.length; i++) {
    const next = headings[i];
    if (next.offset <= current.offset) continue;
    if (next.depth <= current.depth) {
      endOffset = next.offset;
      break;
    }
  }

  const scoped = htmlToText(String(rawHtml).slice(current.offset, endOffset)).trim();
  if (!scoped || !normalize(scoped).includes(verified)) return "";
  return scoped;
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

function applyCurriculumTextScope(subject, topic, text) {
  let scoped = String(text || "");
  const exclusions = [];

  if (subject === "mathimatika-b-gymnasiou") {
    const key = mathBTopicKey(topic);

    if (key === "A.3.2") {
      exclusions.push("Δεν διδάσκονται η Εφαρμογή 2 της σελ. 62 και ο τύπος απόστασης δύο σημείων της σελ. 63.");
      scoped = scoped.replace(
        /\n2\s*\nΔίνεται το σημείο Α\(3, 2\)[\s\S]*?(?=\n4\s*\nΈχει διαπιστωθεί)/i,
        "\n"
      );
    }
    if (key === "A.3.4") {
      exclusions.push("Δεν διδάσκονται η εξίσωση αx + βy = γ ούτε τα σημεία τομής της με τους άξονες.");
      scoped = truncateAt(scoped, "Η εξίσωση της μορφής αx + βy = γ");
    }
    if (key === "A.4.1") {
      exclusions.push("Οι έννοιες πληθυσμός, μεταβλητή, δείγμα, δειγματοληψία, δημοσκόπηση, μέγεθος και αντιπροσωπευτικότητα δείγματος εξηγούνται αλλά δεν εξετάζονται.");
    }
    if (key === "A.4.5") {
      exclusions.push("Δεν διδάσκεται η μέση τιμή ομαδοποιημένης κατανομής.");
      scoped = truncateAt(scoped, "Μέση τιμή ομαδοποιημένης κατανομής");
    }
    if (key === "B.2.2") {
      exclusions.push("Δεν διδάσκεται η Παρατήρηση (β) της ενότητας 2.2.");
      scoped = scoped.replace(
        /β\)\s*Αν τώρα διαιρέσουμε το ημω με το συνω[\s\S]*?Άρα:\s*(?:Image\s*)?/i,
        ""
      );
    }
  }

  if (subject === "chimeia-b-gymnasiou") {
    const key = chemistryBTopicKey(topic);
    if (key === "2.10") {
      exclusions.push("Δεν διδάσκεται η παράγραφος «Χημικοί τύποι ιόντων και ιοντικών ενώσεων».");
      scoped = truncateAt(scoped, "Χημικοί τύποι ιόντων και ιοντικών ενώσεων");
    }
  }

  if (subject === "fysiki-g-gymnasiou") {
    const annualKey = physicsGAnnualTopicKey(topic);
    if (annualKey) {
      const annual = scopePhysicsGAnnualTopic(scoped, annualKey);
      scoped = annual.text;
      exclusions.push(...annual.exclusions);
    }
  }

  if (subject === "physics-gymnasiou") {
    const key = physicsBTopicKey(topic);
    const truncations = {
      "2.2": ["Δεν διδάσκεται η διανυσματική περιγραφή της ταχύτητας.", "Διανυσματική περιγραφή της ταχύτητας"],
      "3.3": ["Δεν διδάσκεται η δύναμη σε τραχιά επιφάνεια ούτε η ανάλυση δύναμης.", "Δύναμη που ασκείται σε τραχιά επιφάνεια"],
      "3.5": ["Δεν διδάσκεται η ανάλυση δυνάμεων και ισορροπία ούτε το Παράδειγμα 3.2.", "Ανάλυση δυνάμεων και ισορροπία"],
      "3.7": ["Δεν διδάσκεται το τμήμα «Εφαρμογές».", "Εφαρμογές"],
      "4.3": ["Δεν διδάσκεται ο υπολογισμός της ατμοσφαιρικής πίεσης.", "Πώς υπολογίζουμε την ατμοσφαιρική πίεση"],
      "5.4": ["Δεν διδάσκονται τα τμήματα «Θεμελιώδεις μορφές ενέργειας» και «Μετατροπές ενέργειας».", "Θεμελιώδεις μορφές ενέργειας"],
      "5.8": ["Δεν διδάσκεται το τμήμα «Ισχύς και κίνηση».", "Ισχύς και κίνηση"]
    };
    if (truncations[key]) {
      exclusions.push(truncations[key][0]);
      scoped = truncateAt(scoped, truncations[key][1]);
    }
    if (key === "6.5") {
      exclusions.push("Η θερμική διαστολή/συστολή προσεγγίζεται ποιοτικά· οι μαθηματικές σχέσεις δεν αποτελούν στόχο της ετήσιας οδηγίας.");
    }
  }

  if (subject === "archaia-glossa-b-gymnasiou") {
    const n = unitNumber(topic);
    if (n === 7) exclusions.push("Το βασικό κείμενο της Ενότητας 7 είναι προαιρετικό· αξιοποιούνται μόνο τα μέρη που προβλέπουν οι οδηγίες.");
    if (n === 8) {
      exclusions.push("Το βασικό κείμενο της σελ. 60, το Β1, το Β2 και το Γ1 δεν χρησιμοποιούνται· οι οδηγίες αξιοποιούν το παράλληλο κείμενο της Ενότητας 8 και το Γ2 για άμεσο/έμμεσο αντικείμενο.");
      scoped = scopeAncientGreekBUnit8(scoped);
    }
    if (n === 5) exclusions.push("Δεν διδάσκονται όλα τα υπομέρη της ενότητας· τηρούνται οι ρητές επιλογές/εξαιρέσεις των οδηγιών 2026–27.");
    if ([12,13,16].includes(n)) exclusions.push("Διδάσκονται μόνο τα υπομέρη που ορίζουν οι ετήσιες οδηγίες 2026–27.");
  }

  return { text: scoped.trim(), exclusions };
}

function sliceLinesBetween(text, startMarker, endMarker) {
  const lines = String(text || "").split("\n");
  const startNorm = normalize(startMarker);
  const endNorm = normalize(endMarker);
  let start = startNorm ? lines.findIndex(line => normalize(line).includes(startNorm)) : 0;
  if (start < 0) return "";
  let end = lines.length;
  if (endNorm) {
    for (let i = start + 1; i < lines.length; i++) {
      if (normalize(lines[i]).includes(endNorm)) {
        end = i;
        break;
      }
    }
  }
  return lines.slice(start, end).join("\n").trim();
}

function scopePhysicsGAnnualTopic(text, key) {
  const source = String(text || "");
  const blocks = splitOfficialPageBlocks(source);
  const firstText = blocks[0]?.text || source;
  const keep = [];
  const exclusions = [];
  const add = value => {
    const v = String(value || "").trim();
    if (v) keep.push(v);
  };

  if (key === "electric-force-field") {
    add(truncateAt(firstText, "Περιγραφή του ηλεκτρικού πεδίου"));
    exclusions.push("Στην §1.6 διδάσκεται μόνο η υποενότητα «Ηλεκτρική δύναμη και πεδίο»· δεν χρησιμοποιούνται η περιγραφή/δυναμικές γραμμές, η ηλεκτρική θωράκιση και το ηλεκτρικό πεδίο και ενέργεια.");
  } else if (key === "current-circuits") {
    add(truncateAt(firstText, "2.3 Ηλεκτρικά δίπολα"));
    exclusions.push("Η επιλογή αυτή καλύπτει την εισαγωγή, §2.1 και §2.2 της διδακτέας ύλης.");
  } else if (key === "ohm-connections") {
    const ohm = truncateAt(
      sliceLinesBetween(firstText, "2.3 Ηλεκτρικά δίπολα", "2.4 Παράγοντες από τους οποίους εξαρτάται η αντίσταση"),
      "ισχύει ο νόμος του Ωμ για κάθε ηλεκτρικό δίπολο"
    );
    const connections = sliceLinesBetween(firstText, "2.5 Εφαρμογές αρχών διατήρησης στη μελέτη απλών", "Ερωτήσεις");
    add(ohm);
    add(connections);
    exclusions.push("Από §2.3 κρατούνται η αντίσταση του διπόλου και ο νόμος του Ohm· αφαιρούνται «Νόμος του Ωμ και μικρόκοσμος» και η μικροσκοπική ερμηνεία της αντίστασης. Η §2.4 δεν διδάσκεται.");
    exclusions.push("Από §2.5 χρησιμοποιούνται μόνο η σύνδεση αντιστατών, η σύνδεση δύο αντιστατών σε σειρά και η παράλληλη σύνδεση.");
  } else if (key === "effects-energy-power") {
    const thermal = truncateAt(
      sliceLinesBetween(firstText, "ΚΕΦΑΛΑΙΟ 3 ΗΛΕΚΤΡΙΚΗ ΕΝΕΡΓΕΙΑ", "3.2 Χημικά αποτελέσματα"),
      "Πειραματική μελέτη του φαινομένου Τζάουλ"
    );
    const magnetic = sliceLinesBetween(firstText, "3.3 Μαγνητικά αποτελέσματα του ηλεκτρικού ρεύματος", "3.4 Ηλεκτρική και μηχανική ενέργεια");
    const power = sliceLinesBetween(firstText, "3.6 Ενέργεια και ισχύς του ηλεκτρικού ρεύματος", "Ερωτήσεις");
    add(thermal);
    add(magnetic);
    add(power);
    exclusions.push("Από §3.1 δεν χρησιμοποιούνται η πειραματική μελέτη, ο νόμος του Joule και η ερμηνεία του φαινομένου Joule. Οι §3.2, §3.4 και §3.5 δεν ανήκουν στην επιλεγμένη ετήσια ενότητα.");
  } else if (key === "oscillations") {
    const examples = truncateAt(
      sliceLinesBetween(firstText, "ΚΕΦΑΛΑΙΟ 4 ΤΑΛΑΝΤΩΣΕΙΣ", "4.2 Μεγέθη που χαρακτηρίζουν μια ταλάντωση"),
      "Ποιες είναι οι προϋποθέσεις ώστε ένα σώμα να κάνει ταλάντωση"
    );
    const measures = sliceLinesBetween(firstText, "4.2 Μεγέθη που χαρακτηρίζουν μια ταλάντωση", "Ερωτήσεις");
    add(examples);
    add(measures);
    exclusions.push("Από §4.1 χρησιμοποιούνται μόνο παραδείγματα για το τι είναι ταλάντωση· η §4.2 διδάσκεται.");
  } else if (key === "waves-sound") {
    add(truncateAt(firstText, "Κυματικά φαινόμενα: Ανάκλαση και διάθλαση των μηχανικών κυμάτων"));
    add(sliceLinesBetween(firstText, "5.4 Ήχος", "Ερωτήσεις"));
    exclusions.push("Στην §5.3 χρησιμοποιείται μόνο το πρώτο μέρος έως τη σχέση υ=λf χωρίς απόδειξη· δεν χρησιμοποιούνται οι υποενότητες ανάκλασης/διάθλασης μηχανικών κυμάτων.");
  } else if (key === "light-reflection") {
    const chapter6 = blocks.find(block => /index6\.html/i.test(block.url))?.text || firstText;
    const chapter7 = blocks.find(block => /index7\.html/i.test(block.url))?.text || "";
    add(truncateAt(chapter6, "Αρχή του ελάχιστου χρόνου"));
    const reflection = truncateAt(
      sliceLinesBetween(chapter7, "ΚΕΦΑΛΑΙΟ 7 ΑΝΑΚΛΑΣΗ ΤΟΥ ΦΩΤΟΣ", "7.2 Εικόνες σε καθρέφτες: είδωλα"),
      "Ανάκλαση και αρχή του ελάχιστου χρόνου"
    );
    const images = sliceLinesBetween(chapter7, "7.2 Εικόνες σε καθρέφτες: είδωλα", "Καμπύλοι καθρέφτες");
    add(reflection);
    add(images);
    exclusions.push("Στην §6.2 δεν χρησιμοποιείται η «Αρχή του ελαχίστου χρόνου». Στην §7.1 αφαιρείται το αντίστοιχο ένθετο και από §7.2 δεν χρησιμοποιούνται καμπύλοι/σφαιρικοί καθρέπτες και οπτικό πεδίο.");
  } else if (key === "refraction-colour") {
    const refraction = truncateAt(
      sliceLinesBetween(firstText, "ΚΕΦΑΛΑΙΟ 8 ΔΙΑΘΛΑΣΗ ΤΟΥ ΦΩΤΟΣ", "8.3 Ανάλυση του φωτός"),
      "Διάθλαση και αρχή του ελάχιστου χρόνου"
    );
    const dispersion = sliceLinesBetween(firstText, "Ανάλυση του λευκού φωτός", "Δείκτης διάθλασης και χρώματα του φωτός");
    const colour = sliceLinesBetween(firstText, "8.4 Το χρώμα", "Ερωτήσεις");
    add(refraction);
    add(dispersion);
    add(colour);
    exclusions.push("Από §8.1 αφαιρούνται η αρχή του ελάχιστου χρόνου και ο νόμος της διάθλασης (Snell). Από §8.3 χρησιμοποιείται μόνο η «Ανάλυση του λευκού φωτός». Η §8.4 χρησιμοποιείται.");
  }

  return { text: keep.join("\n\n").trim(), exclusions };
}

function scopeAncientGreekBUnit8(text) {
  const source = String(text || "");
  const blocks = splitOfficialPageBlocks(source);
  const unitPage = blocks.find(block => /index08\.html/i.test(block.url));
  const parallelPage = blocks.find(block => /index19a_parall\.html/i.test(block.url));

  const kept = [];

  if (unitPage) {
    const lines = unitPage.text.split("\n");
    const syntaxStart = lines.findIndex(line => {
      const n = normalize(line);
      return n.includes("γ2 συνταξη") && n.includes("αμεσο") && n.includes("εμμεσο") && n.includes("αντικειμενο");
    });
    if (syntaxStart >= 0) {
      kept.push(
        "[Official page: " + unitPage.url + "]\n" +
        lines.slice(syntaxStart).join("\n").trim()
      );
    }
  }

  if (parallelPage) {
    const lines = parallelPage.text.split("\n");
    const start = lines.findIndex(line => normalize(line) === "ενοτητα 8");
    let end = -1;
    if (start >= 0) {
      for (let i = start + 1; i < lines.length; i++) {
        if (normalize(lines[i]) === "ενοτητα 9") {
          end = i;
          break;
        }
      }
      const body = lines.slice(start, end >= 0 ? end : lines.length).join("\n").trim();
      if (body) {
        kept.push("[Official page: " + parallelPage.url + "]\n" + body);
      }
    }
  }

  // Fail closed: if the exact annual subparts cannot be isolated, expose no text.
  return kept.join("\n\n").trim();
}

function splitOfficialPageBlocks(text) {
  const source = String(text || "");
  const marker = /\[Official page:\s*([^\]]+)\]\n?/g;
  const matches = [...source.matchAll(marker)];
  if (!matches.length) return [];

  return matches.map((m, i) => {
    const start = m.index + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : source.length;
    return { url: String(m[1] || "").trim(), text: source.slice(start, end).trim() };
  });
}

function truncateAt(text, marker) {
  const source = String(text || "");
  const i = normalize(source).indexOf(normalize(marker));
  if (i < 0) return source;

  // Normalized offsets are not exact; locate the literal marker first when possible.
  const literal = source.toLowerCase().indexOf(String(marker).toLowerCase());
  if (literal >= 0) return source.slice(0, literal).trim();

  // Greek accents may differ; use a conservative line scan when literal matching fails.
  const markerNorm = normalize(marker);
  const lines = source.split("\n");
  const kept = [];
  for (const line of lines) {
    if (normalize(line).includes(markerNorm)) break;
    kept.push(line);
  }
  return kept.join("\n").trim();
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

async function resolveOfficialSchoolbookSource(rawSubject, rawTopic) {
  let statusCode = 200;
  let payload = null;
  const headers = {};
  const response = {
    setHeader(name, value) { headers[String(name).toLowerCase()] = value; },
    status(code) { statusCode = Number(code) || 500; return this; },
    json(body) { payload = body; return body; },
  };
  await module.exports({
    method: "GET",
    query: { subject: rawSubject, topic: rawTopic },
  }, response);
  return {
    ok: statusCode >= 200 && statusCode < 300 && payload?.grounded === true,
    status: statusCode,
    body: payload,
    headers,
  };
}

module.exports.resolveOfficialSchoolbookSource = resolveOfficialSchoolbookSource;

module.exports._test = Object.freeze({
  historyTopicKey,
  resolveHistoryCurriculumPaths,
  resolveHistoryAQuizPaths,
  resolveHistoryGQuizPaths,
  resolveMathAQuizPaths,
  resolveMathGQuizUrls,
  resolveGlossaAQuizUrls,
  resolveGlossaGQuizUrls,
  mathBTopicKey,
  resolveMathBCurriculumPaths,
  chemistryBTopicKey,
  resolveChemistryBCurriculumPaths,
  geographyBTopicKey,
  resolveGeographyBCurriculumPaths,
  resolveLiteratureBCurriculumPaths,
  physicsBTopicKey,
  resolvePhysicsBCurriculumPaths,
  resolvePhysicsGQuizUrls,
  physicsGAnnualTopicKey,
  scopePhysicsGAnnualTopic,
  PHYSICS_G_GYM_ANNUAL_TOPIC_SOURCES,
  resolveChemistryGQuizUrls,
  resolveBiologyGQuizUrls,
  resolveBiologyBCurriculumUrls,
  resolveIliadBCurriculumPaths,
  resolveEnglishBCurriculumUrls,
  englishBSelection,
  religionBTopicNumber,
  resolveReligionBSourceUrls,
  unitNumber,
  scopeAncientGreekBUnit8,
  splitOfficialPageBlocks,
  selectEnglishBUnitText,
  resolveSectionPath,
  resolveDirectSourceUrls,
  topicLabelCandidates,
  resolveLinkedSectionUrlsFromHtml,
  resolveExplicitSectionUrls,
  buildCatalogBook,
  catalogHtmlSourceAllowed,
  resolveGelInventoryTopic,
  buildGelInventoryBook,
  gelVerifiedHeadingOffsets,
  selectGelAnchoredSectionText,
  HISTORY_B_2026_2027_PATHS,
  HISTORY_A_GYM_DIAGNOSTIC_PATHS,
  HISTORY_G_GYM_DIAGNOSTIC_PATHS,
  MATH_A_GYM_DIAGNOSTIC_PATHS,
  MATH_G_GYM_DIAGNOSTIC_SOURCES,
  GLOSSA_A_GYM_DIAGNOSTIC_SOURCES,
  GLOSSA_G_GYM_DIAGNOSTIC_SOURCES,
  MATH_B_2026_2027_PATHS,
  CHEMISTRY_B_2026_2027_PATHS,
  GEOGRAPHY_B_2026_2027_PATHS,
  LITERATURE_B_2026_2027_TEXTS,
  PHYSICS_B_2026_2027_PATHS,
  PHYSICS_G_GYM_DIAGNOSTIC_SOURCES,
  CHEMISTRY_G_GYM_DIAGNOSTIC_SOURCES,
  BIOLOGY_G_GYM_DIAGNOSTIC_SOURCES,
  BIOLOGY_B_2026_2027_SOURCES,
  ANCIENT_GREEK_B_2026_2027_UNITS,
  ILIAD_B_2026_2027_PATHS,
  ENGLISH_B_UNITS,
  RELIGION_B_OFFICIAL_SOURCE_MATERIAL,
  applyCurriculumTextScope
});
