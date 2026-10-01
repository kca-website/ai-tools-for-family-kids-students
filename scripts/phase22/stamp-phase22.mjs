// One-off normalisation: stamp every claude-ai-review override with phase 22 / manual-official-discovery fields.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const FILE = path.join(ROOT, "gel-schoolbook-manual-overrides-2026-2027.js");
const ov = require(FILE);
const src = fs.readFileSync(FILE, "utf8");
const start = src.indexOf("const entries = ");
const arrStart = src.indexOf("[", start);
const marker = "\n]);\n\nfunction get(";
const arrEnd = src.indexOf(marker) + 2; // include "]"
const head = src.slice(0, arrStart);
const tail = src.slice(arrEnd);
const entries = ov.entries.map((e) => {
  e = e;
  const rehomed = e.subjectId === "ekthesi-b-lykeiou" && e.label === "Οργάνωση παραγράφου και συνοχή κειμένου";
  if (e.reviewedBy !== "claude-ai-review" && !rehomed) return e;
  if (rehomed) e = { ...e, reviewBasis: "Phase 22 re-review: both official Έκφραση-Έκθεση Β΄ pages (παράδειγμα στην παράγραφο, ρόλος αντίθεσης στη συνοχή) verified against the book; the recorded Phase 14 candidate for the second page was dropped when the registry changed.", reviewedBy: "claude-ai-review" };
  const out = {};
  for (const [k, v] of Object.entries(e)) {
    if (k === "work") { out.sourceOrigin = "manual-official-discovery"; out.discoveryPhase = 22; }
    if (k === "granularity") { out[k] = "manual-discovered-page"; continue; }
    if (k === "reviewPhase") { out[k] = 22; continue; }
    out[k] = v;
  }
  if (!("reviewPhase" in out)) out.reviewPhase = 22;
  return out;
});
const body = JSON.stringify(entries, null, 2);
fs.writeFileSync(FILE, head + body + tail);
