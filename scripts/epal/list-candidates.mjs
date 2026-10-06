// Lists the official EPAL PDFs the catalog build needs (stdout) and subjects without candidates (stderr).
import fs from "node:fs";
import { ROOT, loadEpalStudentCatalog, enumerateStudyRows } from "./lib.mjs";
import { candidateBooks } from "./subject-courses.mjs";
const inv = JSON.parse(fs.readFileSync(ROOT + "/scripts/epal/ebooks-epal-inventory.json", "utf8")).books;
const { catalog } = loadEpalStudentCatalog();
const rows = enumerateStudyRows(catalog);
const files = new Map(); let none = [];
const seen = new Set();
for (const r of rows) { const k = r.grade + "|" + r.subjectLabel; if (seen.has(k)) continue; seen.add(k);
  const c = candidateBooks(inv, r.grade, r.subjectLabel); if (!c.books.length) none.push(k);
  for (const b of c.books) files.set(b.downloadUrl, b.file); }
console.error("subjects", seen.size, "no candidates", none.length, "unique pdfs", files.size);
console.error(none.join("\n"));
console.log([...files.keys()].join("\n"));
