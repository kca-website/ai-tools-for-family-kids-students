import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import { chromium } from "playwright";

// Special Education quick test: subjects without a fixed test open a book-based test in AI Study.
// Every route must land on the same course and grade, with verified book units to choose from.
const require = createRequire(import.meta.url);
const root = new URL("../", import.meta.url);
const context = vm.createContext({ window: {}, URLSearchParams });
const files = ["quiz-data.js", "special-education-curriculum-data.js", "special-education-learning-data.js", "special-education-quiz-data.js",
  "special-education-status.js", "special-education-special-gymnasium-data.js", "special-education-assessment-policy.js", "special-education-diagnostic-data.js"];
vm.runInContext(files.map((f) => fs.readFileSync(new URL(f, root), "utf8")).join("\n;\n"), context);
const data = context.window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA;
const M = require("../special-education-book-sections-2026-2027.js");

let total = 0, ready = 0, book = 0;
const gelRoutes = new Map();
for (const [schoolId, school] of Object.entries(data.schools)) for (const gradeId of school.gradeOrder) {
  const grade = school.grades[gradeId];
  for (const [groupId, subjects] of [["", grade.subjects || []], ...(grade.groups || []).map((g) => [g.id, g.subjects || []])]) for (const subject of subjects) {
    total++;
    const quiz = data.quizForSelection(schoolId, gradeId, groupId, subject);
    const route = data.bookRouteForSelection(schoolId, gradeId, groupId, subject);
    if (quiz) ready++; else if (route) book++;
    if (!route) continue;
    const where = `${schoolId}|${gradeId}|${groupId}|${subject.id}`;
    assert.match(route.url, /^\/study\.html\?/, where);
    assert.equal(new URLSearchParams(route.url.split("?")[1]).get("adapt"), "special", `${where}: Ε.Α.Ε. adaptations (3 short questions)`);
    if (route.zone === "special") {
      assert.ok(M.subjectsForGrade(route.grade).some((s) => s.id === route.subject), `${where}: ${route.subject} not in AI Study grade ${route.grade}`);
      assert.ok(M.labels(route.subject).length > 0, `${where}: no book units`);
      // Same school family and grade: Ε.Α.Ε. Gymnasium a–c → a–c, Ε.Α.Ε. Lyceum → la–lc, ΕΝ.Ε.Ε.ΓΥ.-Λ. lyc-x → ex.
      const expectedGrade = schoolId.endsWith("gymnasium") ? gradeId : schoolId.endsWith("lyceum") ? "l" + gradeId : "e" + gradeId.slice(-1);
      assert.equal(route.grade, expectedGrade, where);
    } else {
      assert.equal(route.zone, "high", where);
      assert.equal(route.basis, "general-lyceum-book", where);
      assert.ok(schoolId.endsWith("lyceum"), `${where}: ΓΕΛ books only for Ε.Α.Ε. Lyceums`);
      assert.equal(route.grade, gradeId, where);
      gelRoutes.set(route.subject, route);
    }
  }
}
// The generic laboratory slots depend on the specialty and never get a route.
assert.equal(data.bookRouteForSelection("eneegyl", "lyc-b", "health", { id: "special-a" }), null);
// Deaf schools use the same official syllabus as the Ε.Α.Ε. schools.
assert.deepEqual(data.bookRouteForSelection("deaf-lyceum", "b", "", { id: "geometry" }), data.bookRouteForSelection("special-lyceum", "b", "", { id: "geometry" }));
assert.ok(ready + book >= 321, `coverage dropped: ${ready}+${book}/${total}`);

// AI Study keeps the Ε.Α.Ε. 3-question quiz and guidance for a ΓΕΛ unit opened from the quick test.
const study = fs.readFileSync(new URL("study.html", root), "utf8");
assert.match(study, /if\(interactiveTotal&&specialAdaptations\(\)\)interactiveTotal=3;/);
assert.match(study, /function specialEducationGuidance\(\)\{\n    if\(!specialAdaptations\(\)\)return '';/);
// Orientation courses are named as such, so they are not confused with the common course of the same name.
assert.equal(data.schools["special-lyceum"].grades.b.groups.find((g) => g.id === "sciences").subjects.map((s) => s.label).join(" / "), ["Φυσική Προσανατολισμού", "Μαθηματικά Προσανατολισμού"].join(" / "));

// ΓΕΛ routes: AI Study opens the same course with verified units to choose from.
const base = process.env.BASE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const route of gelRoutes.values()) {
    await page.goto(base + route.url, { waitUntil: "load" });
    await page.waitForFunction((id) => document.querySelector("#subject")?.value === id, route.subject, { timeout: 15000 });
    const state = await page.evaluate(() => ({ zone: document.querySelector("#zone").value, grade: document.querySelector("#grade").value,
      goal: document.querySelector('input[name="goal"]:checked')?.value, units: [...document.querySelectorAll("#topicPick option")].filter((o) => o.value).length }));
    assert.deepEqual([state.zone, state.grade, state.goal], ["high", route.grade, "test"], route.url);
    assert.ok(state.units > 0, `${route.url}: no units`);
  }
  // One Ε.Α.Ε. and one ΕΝ.Ε.Ε.ΓΥ.-Λ. route end to end.
  for (const route of [data.bookRouteForSelection("special-gymnasium", "a", "", { id: "literature" }), data.bookRouteForSelection("eneegyl", "lyc-c", "health", { id: "hygiene" })]) {
    await page.goto(base + route.url, { waitUntil: "load" });
    await page.waitForFunction((id) => document.querySelector("#subject")?.value === id, route.subject, { timeout: 15000 });
    assert.ok(await page.locator("#topicPick option").count() > 1, route.url);
  }
  // Picker: ready tests first, then book-based tests (button opens AI Study), then subjects without a test.
  await page.goto(base + "/practice.html", { waitUntil: "load" });
  await page.click("[data-special-education-diagnostic]");
  await page.locator("#spdiagSchools button", { hasText: "Ειδικό Λύκειο" }).click();
  await page.selectOption("#spdiagGrade", "b");
  const groups = await page.$$eval("#spdiagSubject optgroup", (gs) => gs.map((g) => [g.label, [...g.children].map((o) => o.value)]));
  assert.deepEqual(groups.map((g) => g[0]), ["Έτοιμο τεστ", "Τεστ από το σχολικό βιβλίο (AI Μελέτη)", "Χωρίς τεστ ακόμη"]);
  assert.ok(groups[0][1].includes("physics") && groups[1][1].includes("geometry") && groups[2][1].includes("pe"));
  await page.selectOption("#spdiagSubject", "geometry");
  assert.equal(await page.isDisabled("#spdiagStart"), false);
  await Promise.all([page.waitForURL(/\/study\.html\?zone=high&grade=b&subject=geometria-b-lykeiou/), page.click("#spdiagStart")]);
} finally { await browser.close(); }

console.log(`Special Education quick test: ${ready} ready tests + ${book} book-based tests = ${ready + book}/${total} subjects; ${gelRoutes.size} ΓΕΛ routes checked in AI Study.`);
