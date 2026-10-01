// Appends reviewed manual overrides to gel-schoolbook-manual-overrides-2026-2027.js.
//
//   node scripts/phase22/add-manual-overrides.mjs decisions.json [--phase 22] [--dry]
//
// decisions.json = [{ subjectId, label, basis, pages: [{ file, heading?, work? }] }]
// For every page the tool fetches the official ebooks.edu.gr page live and requires that the cited heading
// (default: the page's own menu label) is present in the page text. Nothing is written when any check fails.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { norm, stripTags, parseOptions } from "../phase14/lib.mjs";

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const PHASE = Number((args[args.indexOf("--phase") + 1]) || 22);
const DRY = args.includes("--dry");
if (!file) { console.error("usage: add-manual-overrides.mjs decisions.json [--phase N] [--dry]"); process.exit(2); }

const inventory = require(path.join(ROOT, "gel-schoolbook-source-map-2026-2027.js"));
const OV = path.join(ROOT, "gel-schoolbook-manual-overrides-2026-2027.js");
const existing = require(OV);
const decisions = JSON.parse(fs.readFileSync(path.resolve(file), "utf8"));

const pageCache = new Map();
async function page(url) {
  if (!pageCache.has(url)) {
    let r, html = null;
    for (let i = 0; i < 3 && html === null; i++) {
      try { r = await fetch(url, { headers: { "User-Agent": "aitools4kids-phase22-review/1.0" } }); if (r.status === 200) html = await r.text(); else break; } catch (_) {}
    }
    pageCache.set(url, html);
  }
  return pageCache.get(url);
}


const errors = [];
const out = [];
const today = new Date().toISOString().slice(0, 10);
for (const d of decisions) {
  const where = `${d.subjectId} :: ${d.label}`;
  const subject = inventory.get(d.subjectId);
  if (!subject) { errors.push(where + " — unknown subject"); continue; }
  const topics = subject.topicMappings.filter((t) => t.label === d.label);
  if (topics.length !== 1) { errors.push(where + ` — label matches ${topics.length} inventory topics`); continue; }
  const t = topics[0];
  if (t.status === "exact-html" && t.confidence === "high") { errors.push(where + " — already auto-verified"); continue; }
  if (existing.get(d.subjectId, d.label) || out.some((o) => o.subjectId === d.subjectId && o.label === d.label)) { errors.push(where + " — override already exists"); continue; }
  const sources = [];
  for (const p of d.pages) {
    const work = p.work || (d.pages[0] && d.pages[0].work) || null;
    const book = subject.books.find((b) => b.role === "primary" && b.work === (p.work || work));
    if (!book || !book.html) { errors.push(where + ` — no primary HTML book for work ${p.work || work}`); continue; }
    const url = book.html.url + p.file;
    const html = await page(url);
    if (!html) { errors.push(where + " — page not reachable: " + url); continue; }
    const text = norm(stripTags(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "")));
    let heading = p.heading;
    if (!heading) {
      const idx = await page(book.html.url + "index.html");
      const lab = parseOptions(idx || "").filter((o) => o.value === p.file).map((o) => o.label).find((l) => l && text.includes(norm(l)));
      heading = lab;
    }
    if (!heading) { errors.push(where + ` — no heading given/derivable for ${p.file}`); continue; }
    if (!text.includes(norm(heading))) { errors.push(where + ` — heading "${heading}" not found on ${p.file}`); continue; }
    sources.push({ work: book.work, url, heading });
  }
  if (sources.length !== d.pages.length) continue;
  out.push({
    subjectId: d.subjectId,
    label: d.label,
    sourceTopicId: t.topicId,
    sourceStatus: t.status,
    ...(t.reason ? { sourceReason: t.reason } : {}),
    work: sources[0].work,
    granularity: sources.length > 1 ? "manual-multi-page" : "manual-page",
    reviewBasis: d.basis,
    reviewedBy: "claude-ai-review",
    reviewedAt: today,
    reviewPhase: PHASE,
    sources
  });
}

if (errors.length) { console.error("REJECTED (" + errors.length + "):\n  - " + errors.join("\n  - ")); process.exit(1); }
console.log(`verified ${out.length} overrides against live official pages`);
if (DRY) process.exit(0);

let src = fs.readFileSync(OV, "utf8");
const marker = "\n]);\n\nfunction get(";
const i = src.indexOf(marker);
if (i < 0) { console.error("cannot find end of entries array"); process.exit(1); }
const block = out.map((e) => JSON.stringify(e, null, 2).split("\n").map((l) => "  " + l).join("\n")).join(",\n");
src = src.slice(0, i) + ",\n" + block + src.slice(i);
const original = fs.readFileSync(OV, "utf8");
fs.writeFileSync(OV, src);
console.log("appended", out.length, "entries; verifying through the real /api/schoolbook-source resolver ...");

// End-to-end check: the production resolver must ground every new override (it applies its own heading check).
for (const k of Object.keys(require.cache)) if (/schoolbook-source\.js$|manual-overrides/.test(k)) delete require.cache[k];
const endpoint = require(path.join(ROOT, "api/schoolbook-source.js"));
const bad = [];
for (const e of out) {
  const r = await endpoint.resolveOfficialSchoolbookSource(e.subjectId, e.label);
  const chars = String((r.body && r.body.text) || "").length;
  if (!r.ok || chars < 500) bad.push(`${e.subjectId} :: ${e.label} -> ${r.status} ${r.body && r.body.error} chars=${chars}`);
}
if (bad.length) {
  fs.writeFileSync(OV, original);
  console.error("RESOLVER REJECTED (rolled back, nothing written):\n  - " + bad.join("\n  - "));
  process.exit(1);
}
console.log("resolver grounded all", out.length, "new overrides");
