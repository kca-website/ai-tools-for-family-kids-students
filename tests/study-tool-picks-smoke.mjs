import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";

// AI Study suggests reviewed catalog tools after each result, never below the age a tool's terms allow.
const require = createRequire(import.meta.url);
const P = require("../study-tool-picks.js");
const build = require("../scripts/study-tool-picks/build.cjs");
const catalog = build.loadCatalog();

// The copy in study-tool-picks.js matches the reviewed catalog (run the build script after catalog edits).
assert.equal(fs.readFileSync(new URL("../study-tool-picks.js", import.meta.url), "utf8"), build.render(build.picksData(catalog)), "study-tool-picks.js is out of date: node scripts/study-tool-picks/build.cjs");

// Astra AI and Δασκαλάκος AI are reviewed catalog entries with their terms and the parent-account rule.
for (const id of ["astra-ai", "daskalakos-ai"]) {
  const t = catalog[id];
  assert.ok(t && t.auditSource && t.lastReviewed && t.parentAccountRequired && t.minAgeNote, id);
}

const grades = { primary: ["a", "b", "c", "d", "e", "st"], middle: ["a", "b", "c"], high: ["a", "b", "c"], special: ["a", "b", "c", "la", "lb", "lc", "ea", "eb", "ec", "ed"] };
const subjects = ["mathimatika", "fysiki", "istoria", "glossa", "agglika", "pliroforiki", "eneegyl-official-b-αρχες-λογιστικης", ""];
for (const [zone, gs] of Object.entries(grades)) for (const grade of gs) {
  const age = P.ageFor(zone, grade);
  assert.ok(Number.isInteger(age), `${zone}/${grade}: age`);
  for (const action of [...Object.keys(P.actions), "other"]) for (const subject of subjects) {
    const picks = P.pick({ action, zone, grade, subject });
    assert.ok(picks.length >= 1 && picks.length <= (zone === "special" ? 2 : 3), `${zone}/${grade}/${action}: ${picks.length} picks`);
    assert.equal(new Set(picks.map((p) => p.id)).size, picks.length);
    for (const p of picks) {
      assert.ok((catalog[p.id].minAge || 0) <= age, `${zone}/${grade}/${action}: ${p.id} needs ${catalog[p.id].minAge}+`);
      assert.equal(p.url, catalog[p.id].url);
      // Δασκαλάκος AI only for explanations of students under 13 (not shown everywhere).
      if (p.id === "daskalakos-ai") assert.ok(action === "explain" && age <= 12, `${zone}/${grade}/${action}: Δασκαλάκος`);
    }
  }
}
// Audio: Gemini Notebook (NotebookLM) for 15+, never for younger students.
assert.ok(P.pick({ action: "audio", zone: "high", grade: "a" }).some((p) => p.id === "notebooklm"));
assert.ok(P.pick({ action: "audio", zone: "special", grade: "ed" }).some((p) => p.id === "notebooklm"));
assert.ok(!P.pick({ action: "audio", zone: "middle", grade: "c" }).some((p) => p.id === "notebooklm"));
assert.ok(!P.pick({ action: "explain", zone: "primary", grade: "e" }).some((p) => p.id === "chatgpt"));
// Subject tool and special-education support tool.
assert.ok(P.pick({ action: "explain", zone: "middle", grade: "b", subject: "mathimatika-b-gymnasiou" }).some((p) => p.id === "geogebra"));
assert.ok(P.pick({ action: "quiz", zone: "high", grade: "b", subject: "fysiki-b-lykeiou" }).some((p) => p.id === "phet"));
assert.equal(P.pick({ action: "quiz", zone: "special", grade: "c" })[0].id, "immersive-reader");
assert.ok(P.pick({ action: "explain", zone: "middle", grade: "b", subject: "geografia-b-gymnasiou" }).some((p) => p.id === "google-earth"));
assert.ok(catalog["google-earth"].auditSource && catalog["google-earth"].minAgeNote);

const study = fs.readFileSync(new URL("../study.html", import.meta.url), "utf8");
assert.match(study, /<script src="\/study-tool-picks\.js"><\/script>/);
assert.match(study, /P\.pick\(\{action,zone:\$\('zone'\)\.value,grade:\$\('grade'\)\.value/);
assert.match(study, /data-tool="'\+esc\(x\.id\)/);
const reader = fs.readFileSync(new URL("../pdf-text-reader.js", import.meta.url), "utf8");
assert.match(reader, /a\.alt-ai-card\[data-tool="notebooklm"\]/);
// The audio lesson renders its own result, so it asks study.html for the same age-checked suggestions.
assert.match(reader, /window\.AITOOLSKIDS_RENDER_ALT_AI\?\.\("audio"\)/);
assert.match(study, /window\.AITOOLSKIDS_RENDER_ALT_AI=renderAltAi;/);
const extras = fs.readFileSync(new URL("../study-studio-extras.js", import.meta.url), "utf8");
assert.match(extras, /if\(P&&!P\.allowed\('notebooklm',P\.ageFor\(zone,grade\)\)\)return;/);
console.log("Study tool picks smoke passed: catalog-backed, age-checked suggestions for every grade and action.");
