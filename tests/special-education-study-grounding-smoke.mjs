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
  "teacher-curriculum-special-gym-annual-2026-2027.js", "teacher-curriculum-special-lyceum-annual-2026-2027.js",
  "special-education-special-lyceum-learning-2026-2027.js", "special-education-framework-learning-2026-2027.js",
  "special-education-special-lyceum-data.js",
]) require(`../${file}`);
const entries = window.SPECIAL_EDUCATION_CURRICULUM.entries;
const M = require("../special-education-book-sections-2026-2027.js");
const StudyContext = require("../study-context.js");
const handler = require("../api/schoolbook-source.js");

const G = (g, k) => `teacher-annual-special-gym-${g}-${k}`;
const L = (g, k) => `special-lyceum-${g}-${k}-official-2026-27`;
const expected = {
  a: { [G("a", "math")]: 43, [G("a", "physics")]: 8, [G("a", "biology")]: 14, [G("a", "geography")]: 27, [G("a", "history")]: 24,
    [G("a", "religion-ethics")]: 7, [G("a", "ancient-language")]: 12, [G("a", "ancient-translation")]: 23, [G("a", "language")]: 5, [G("a", "literature")]: 65 },
  b: { [G("b", "math")]: 27, [G("b", "physics")]: 27, [G("b", "chemistry")]: 19, [G("b", "biology")]: 13, [G("b", "geography")]: 46, [G("b", "history")]: 23,
    [G("b", "religion-ethics")]: 7, [G("b", "ancient-language")]: 11, [G("b", "ancient-translation")]: 15, [G("b", "literature")]: 68, [G("b", "social-civic")]: 23 },
  c: { [G("c", "math")]: 31, [G("c", "physics")]: 27, [G("c", "chemistry")]: 34, [G("c", "biology")]: 12, [G("c", "history")]: 37,
    [G("c", "religion-ethics")]: 7, [G("c", "ancient-language")]: 8, [G("c", "ancient-translation")]: 16, [G("c", "language")]: 6, [G("c", "literature")]: 69, [G("c", "social-civic")]: 40 },
  la: { [L("a", "biology")]: 13, [L("a", "informatics")]: 20 },
  lb: { [L("b", "biology")]: 32, [L("b", "informatics")]: 8, [L("b", "latin")]: 15 },
  lc: { [L("c", "biology")]: 16, [L("c", "latin")]: 35 },
};
let total = 0;
for (const [grade, subjects] of Object.entries(expected)) {
  assert.deepEqual(M.subjectsForGrade(grade).map((s) => s.id).sort(), Object.keys(subjects).sort(), `grade ${grade}`);
  for (const [id, count] of Object.entries(subjects)) {
    const labels = M.labels(id);
    assert.equal(labels.length, count, id);
    assert.equal(new Set(labels).size, count, `${id}: unique labels`);
    const anchors = entries[id].officialAnchors;
    for (const label of labels) {
      const unit = M.get(id, label);
      // Every unit belongs to a unit of the official special-education instructions.
      for (const anchor of [].concat(unit.anchor)) assert.ok(anchors.includes(anchor), `${id}: ${anchor}`);
      assert.ok(unit.pages.length >= 1, `${id}: ${label}`);
      for (const page of unit.pages) {
        if (page.pdf) assert.match(page.pdf.viewUrl, /^https:\/\/ebooks\.edu\.gr\/ebooks\/v\/pdf\/8547\/\d+\//);
        else if (page.route) assert.ok(page.route.subject && page.route.topic);
        else assert.match(page.url, /^https:\/\/ebooks\.edu\.gr\/ebooks\/v\/html\/8547\/\d+\/[^/]+\/(?:index|mat)[\w]+\.html?$/);
      }
    }
    total += count;
  }
}
assert.equal(total, 933);
// Units that are not a single official text keep the official order.
for (const id of [G("a", "math"), G("c", "physics"), L("b", "biology")]) {
  const labels = M.labels(id);
  assert.deepEqual(labels, entries[id].officialAnchors.filter((a) => labels.includes(a)), id);
}
// Literature: each text is listed under its official thematic unit.
assert.deepEqual(M.get(G("a", "literature"), "Λαογραφικά · Λαϊκό παραμύθι — «Το πιο γλυκό ψωμί»").anchor, ["Λαογραφικά"]);
// Religion: the verified PDF page range of the thematic unit.
const rel = M.get(G("b", "religion-ethics"), entries[G("b", "religion-ethics")].officialAnchors[0]).pages[0].pdf;
assert.deepEqual([rel.pdfPage, rel.pdfPageEnd], [7, 19]);
assert.match(rel.heading, /^ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ/);

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
assert.match(api, /if \(first\.route\) \{/);
assert.match(api, /return handleTablePdfSource\(res, \{ subject, topic, mapping: \{ \.\.\.first\.pdf, label: specialUnit\.label \}, completeAudio \}\);/);

// AI Study: special zone is selectable in-page, strict official source, special-education adaptations.
assert.equal(StudyContext.resolveSourcePolicy({ schoolLevel: "special", hasCurriculumSelection: true }), "official_required");
const study = fs.readFileSync(new URL("../study.html", import.meta.url), "utf8");
assert.match(study, /<script src="\/special-education-book-sections-2026-2027\.js"><\/script>/);
assert.match(study, /special:\[\['a','Α΄ Ειδικού Γυμνασίου'\].*\['lc','Γ΄ Ειδικού Λυκείου'\]/);
assert.match(study, /if\(z==='special'\)return \(specialSections\(\)\?\.subjectsForGrade/);
assert.match(study, /context:cfg\.system\+specialEducationGuidance\(\)/);
assert.match(study, /if\(interactiveTotal&&specialAdaptations\(\)\)interactiveTotal=3;/);
assert.match(study, /function specialAdaptations\(\)\{return \$\('zone'\)\.value==='special'\|\|/);
assert.doesNotMatch(study, /\$\('standardStudyFields'\)\.classList\.toggle\('hidden',special\)/, "special no longer redirects away");
const summary = fs.readFileSync(new URL("../api/source-summary.js", import.meta.url), "utf8");
assert.match(summary, /const simple = SPECIAL_SECTIONS\.has\(sid\);/);
assert.match(summary, /\.\.\.\(simple \? \{ learner: 'special-education-v3' \} : \{\}\)/);

// UAT fixes: Ε.Α.Ε. lessons use the normal official text, tolerant (still verbatim) evidence matching,
// one retry instead of raw book fragments, and the grounded tutor as the explain fallback.
assert.match(summary, /const completeAudioSource = activity === 'audio' && !simple;/);
assert.match(summary, /function tolerantEvidenceKey\(/);
assert.match(summary, /if \(simple && claims\.length < 3\) \{/);
assert.match(study, /err\.code!=='insufficient_verified_evidence'\)throw err;\s*text=await callStudyServer\(action\);/);
const helen = await call({ subject: G("c", "ancient-translation"), topic: "Ευριπίδη, Ελένη — Πρόλογος 1–191 (αναλυτικά)" });
if (helen.status === 200) assert.doesNotMatch(helen.body.text, /class="tooltip"|title="/, "attribute text must not leak into the official text");

console.log(`Special education study grounding smoke passed: ${total} official Ε.Α.Ε. units (Ειδικό Γυμνάσιο + Ειδικό Λύκειο).`);
