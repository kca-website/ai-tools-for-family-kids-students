// After topics are added/removed the positional topic ids of the inventory shift; re-point every override's
// sourceTopicId at the inventory topic with the same (subject,label). Fails when a label no longer exists.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const FILE = path.join(ROOT, "gel-schoolbook-manual-overrides-2026-2027.js");
const inv = require(path.join(ROOT, "gel-schoolbook-source-map-2026-2027.js"));
const ov = require(FILE);
let src = fs.readFileSync(FILE, "utf8");
let changed = 0; const orphans = [];
for (const e of ov.entries) {
  const s = inv.get(e.subjectId);
  const t = s && s.topicMappings.filter((x) => x.label === e.label);
  if (!t || t.length !== 1) { orphans.push(e.subjectId + " :: " + e.label); continue; }
  if (t[0].topicId !== e.sourceTopicId) {
    const needle = `"label": ${JSON.stringify(e.label)},\n    "sourceTopicId": ${JSON.stringify(e.sourceTopicId)}`;
    const at = src.indexOf(needle);
    if (at < 0 || src.indexOf(needle, at + 1) >= 0) { orphans.push("cannot patch " + e.subjectId + " :: " + e.label); continue; }
    // make sure the match belongs to this subject
    const subj = src.lastIndexOf('"subjectId"', at);
    if (!src.slice(subj, at).includes(JSON.stringify(e.subjectId))) { orphans.push("subject mismatch " + e.subjectId + " :: " + e.label); continue; }
    src = src.slice(0, at) + `"label": ${JSON.stringify(e.label)},\n    "sourceTopicId": ${JSON.stringify(t[0].topicId)}` + src.slice(at + needle.length);
    changed++;
  }
}
if (orphans.length) { console.error("ORPHANS:\n  " + orphans.join("\n  ")); process.exit(1); }
fs.writeFileSync(FILE, src);
console.log("re-pointed", changed, "overrides");
