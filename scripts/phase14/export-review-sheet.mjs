// Exports the topics that still need a human decision as a CSV review sheet.
//   node scripts/phase14/export-review-sheet.mjs [out.csv]
// Columns: subjectId, topicId, label, status, reason, candidate_heading, candidate_url, score, decision (blank, for the reviewer)
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const data = require("../../gel-schoolbook-source-map-2026-2027.js");
const out = process.argv[2] || "docs/phase14-gel-review-sheet-2026-10-01.csv";
const q = (s) => '"' + String(s ?? "").replace(/"/g, '""') + '"';
const rows = [["subjectId", "topicId", "label", "status", "reason", "candidate_heading", "candidate_url", "score", "decision (approve / reject / other source)"]];
for (const s of Object.values(data.all())) for (const t of s.topicMappings) {
  if (t.status === "exact-html" || t.status === "exact-pdf") continue;
  const c = (t.candidates || [])[0] || {};
  rows.push([s.subjectId, t.topicId, t.label, t.status, t.reason, c.heading, c.url, c.score, ""]);
}
fs.writeFileSync(out, "﻿" + rows.map((r) => r.map(q).join(",")).join("\n") + "\n");
console.log("rows:", rows.length - 1, "->", out);
