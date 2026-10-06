import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";

// Ειδικό Γυμνάσιο in AI Study: every unit shown is a unit of the official 2026–27 special-education
// instructions, resolved to the general schoolbook page(s) that teach it, and answered fail-closed.
const require = createRequire(import.meta.url);
globalThis.window = globalThis;
for (const file of [
  "special-education-curriculum-data.js", "special-education-learning-data.js", "special-education-quiz-data.js",
  "special-education-status.js", "special-education-sector-economy-data.js", "special-education-special-gymnasium-data.js",
  "teacher-curriculum-special-gym-annual-2026-2027.js",
]) require(`../${file}`);
const entries = window.SPECIAL_EDUCATION_CURRICULUM.entries;
const M = require("../special-education-book-sections-2026-2027.js");
const StudyContext = require("../study-context.js");
const handler = require("../api/schoolbook-source.js");

const expected = {
  a: { math: 43, physics: 8, biology: 14, geography: 27, history: 24 },
  b: { math: 27, physics: 27, chemistry: 19, biology: 13, geography: 46, history: 23 },
  c: { math: 31, physics: 27, chemistry: 34, biology: 12, history: 37 },
};
let total = 0;
for (const [grade, subjects] of Object.entries(expected)) {
  assert.deepEqual(M.subjectsForGrade(grade).map((s) => s.id.split("-").pop()), Object.keys(subjects), `grade ${grade}`);
  for (const [key, count] of Object.entries(subjects)) {
    const id = `teacher-annual-special-gym-${grade}-${key}`;
    const labels = M.labels(id);
    assert.equal(labels.length, count, id);
    const anchors = entries[id].officialAnchors;
    // Only units of the official instructions, in their official order.
    assert.deepEqual(labels, anchors.filter((a) => labels.includes(a)), `${id}: official units in order`);
    for (const label of labels) {
      const unit = M.get(id, label);
      assert.ok(unit.pages.length >= 1, `${id}: ${label}`);
      for (const page of unit.pages) assert.match(page.url, /^https:\/\/ebooks\.edu\.gr\/ebooks\/v\/html\/8547\/\d+\/[\w-]+_html-empl\/(?:index|mat)[\w]+\.html$/);
    }
    total += count;
  }
}
assert.equal(total, 412);

// Units the book does not contain are not invented.
assert.equal(M.get("teacher-annual-special-gym-a-physics", "4. Μέτρηση όγκου"), null);
assert.equal(M.get("teacher-annual-special-gym-a-physics", "8. Το Ηλεκτρικό βραχυκύκλωμα – Κίνδυνοι και Ασφάλεια").pages[0].url.endsWith("/index10.html"), true);
assert.equal(M.get("teacher-annual-special-gym-a-history", "Συνοπτικά — Κεφ. Η΄ 1-3. Ελληνιστικά βασίλεια, ελληνικός κόσμος και ρωμαϊκή ισχύς").pages.map((p) => p.url.split("/").pop()).join(), "index_09_01.html,index_09_02.html,index_09_03.html");

// Chapter pages (Φυσική Γ΄, Χημεία Γ΄) are cut to the selected subsection; missing headings fail closed.
const coulomb = M.get("teacher-annual-special-gym-c-physics", "1.5 Νόμος του Κουλόμπ").pages[0];
assert.ok(coulomb.start && coulomb.end);
const html = '<nav>menu</nav><div id="eclass_ebook_body"><span style="font-size:20px">1.4</span> A <span style="font-size:20px">1.5</span> Κουλόμπ\n<span   style="font-size:20px">1.6</span> C</div>';
const scoped = M.scopePageHtml(html, coulomb);
assert.match(scoped, /Κουλόμπ/);
assert.doesNotMatch(scoped, / A | C|menu/);
assert.equal(M.scopePageHtml(html.replace(">1.5<", ">1.9<"), coulomb), "");
assert.doesNotMatch(M.scopePageHtml(html, { url: "x" }), /menu/);

// API: special units are answered only from their mapped pages; anything else fails closed.
const call = async (query) => {
  let status = 0, body = null;
  const res = { setHeader() {}, status(c) { status = c; return res; }, json(b) { body = b; return res; } };
  await handler({ method: "GET", query, headers: {} }, res);
  return { status, body };
};
const unmapped = await call({ subject: "teacher-annual-special-gym-a-physics", topic: "4. Μέτρηση όγκου" });
assert.equal(unmapped.status, 404);
assert.equal(unmapped.body.error, "source_not_mapped");
const api = fs.readFileSync(new URL("../api/schoolbook-source.js", import.meta.url), "utf8");
assert.match(api, /let directUrls = specialUnit \? specialUnit\.pages\.map/);
assert.match(api, /SPECIAL_SECTIONS\.scopePageHtml\(html, specialUnit\.pages\[i\]\)/);

// AI Study: special zone is selectable in-page, strict official source, special-education adaptations.
assert.equal(StudyContext.resolveSourcePolicy({ schoolLevel: "special", hasCurriculumSelection: true }), "official_required");
const study = fs.readFileSync(new URL("../study.html", import.meta.url), "utf8");
assert.match(study, /<script src="\/special-education-book-sections-2026-2027\.js"><\/script>/);
assert.match(study, /special:\[\['a','Α΄ Ειδικού Γυμνασίου'\]/);
assert.match(study, /if\(z==='special'\)return \(specialSections\(\)\?\.subjectsForGrade/);
assert.match(study, /context:cfg\.system\+specialEducationGuidance\(\)/);
assert.match(study, /if\(interactiveTotal&&\$\('zone'\)\.value==='special'\)interactiveTotal=3;/);
assert.doesNotMatch(study, /\$\('standardStudyFields'\)\.classList\.toggle\('hidden',special\)/, "special no longer redirects away");
const summary = fs.readFileSync(new URL("../api/source-summary.js", import.meta.url), "utf8");
assert.match(summary, /const simple = SPECIAL_SECTIONS\.has\(sid\);/);
assert.match(summary, /\.\.\.\(simple \? \{ learner: 'special-education-v1' \} : \{\}\)/);

console.log(`Special education study grounding smoke passed: ${total} official Ε.Α.Ε. units across 16 Ειδικό Γυμνάσιο subjects.`);
