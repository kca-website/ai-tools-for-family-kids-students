// Shared helpers for the EPAL schoolbook catalog build (scripts/epal/*).
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const EPAL_GRADE_CLASSCODES = Object.freeze({ a: "K10.T", b: "K11.T", c: "K12.T" });

// Same normalisation as api/official-pdf-text-v2.js so build-time checks match runtime checks.
export function normalizePdfText(value) {
  return String(value || "").toLowerCase().normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9α-ω]+/gi, " ")
    .replace(/\s+/g, " ").trim();
}

export function normalizeTitle(value) {
  return normalizePdfText(value).replace(/ς/g, "σ").split(" ")
    .map((w) => (w === "ι" || w === "1" ? "i" : (w === "ιι" || w === "2" ? "ii" : w))).join(" ");
}

// Loads the browser EPAL student catalog exactly as study.html does (same script order).
export function loadEpalStudentCatalog() {
  const files = [
    "teacher-curriculum-epal-2026-2027.js",
    "teacher-curriculum-epal-c-specialties-2026-2027.js",
    "teacher-curriculum-epal-c-final-sectors-2026-2027.js",
    "teacher-curriculum-epal-panhellenic-2027.js",
    "epal-official-guidance-topics-2026-2027.js",
    "epal-student-topics-2026-2027.js",
    "epal-student-tutor-2026-2027.js"
  ];
  const noop = () => {};
  const win = {
    console,
    document: { readyState: "complete", addEventListener: noop, querySelector: () => null, querySelectorAll: () => [], getElementById: () => null },
    addEventListener: noop,
    setTimeout: () => 0
  };
  win.window = win;
  const ctx = vm.createContext(win);
  for (const file of files) vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), ctx, { filename: file });
  return { catalog: win.AITOOLSKIDS_EPAL_STUDENT_CATALOG, guidance: win.AITOOLSKIDS_EPAL_OFFICIAL_GUIDANCE_TOPICS_2026_2027 };
}

// Every (grade, sector, specialty, subject) row exactly as the AI Study selectors expose them.
export function enumerateStudyRows(catalog) {
  const rows = [];
  const add = (grade, sector, specialty) => {
    for (const s of catalog.getSubjects(grade, sector, specialty)) {
      rows.push({
        grade, sectorSelection: sector, specialtySelection: specialty,
        subjectId: s.id, subjectLabel: s.subjectLabelEl, specialtyId: specialty || "",
        sector: s.sector || "", specialty: s.specialty || "",
        supportOnly: !!s.supportOnly,
        topics: (s.topics || []).map((t) => ({ id: t.id, label: t.labelEl, customTitle: !!t.customTitle }))
      });
    }
  };
  add("a", "", "");
  add("b", "", "");
  for (const sector of catalog.getSectors()) add("b", sector.id, "");
  add("c", "", "");
  for (const sp of catalog.getSpecialties()) add("c", "", sp.id);
  return rows;
}

// Course label used on ebooks.edu.gr for a site subject label.
export function courseLabelOf(subjectLabel) {
  return String(subjectLabel || "").replace(/^.*? · /, "").replace(/^Ειδικό εργαστηριακό:\s*/, "").trim();
}

export function isStudentBook(row) {
  const f = String(row.file || "");
  return !/Lyseis-Askiseon|Vivlio-Ekpaideutikou|Vivlio-Kathigiti|Odigies|Odigos-Ekpaideutikou/i.test(f) &&
    !/\((?:ΚΑΘΗΓΗΤΗ|ΛΥΣΕΙΣ)/.test(String(row.work || ""));
}
