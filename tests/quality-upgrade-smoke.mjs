import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const read=(p)=>fs.readFileSync(new URL("../"+p,import.meta.url),"utf8");
const index=read("index.html");
const readme=read("README.md");
const a11y=read("accessibility.html");
const methodology=read("methodology.html");
const app=read("app.js");
const tutor=read("tutor.js");
const pwa=read("pwa.js");
const teacher=read("teacher-assistant.html");
const expansion=read("general-subject-expansion-2026-2027.js");
const tutorApi=read("api/tutor-assistant.js");
const teacherApi=read("api/teacher-assistant.js");

assert.match(index,/παιδιά και μαθητές 4–18/);
assert.doesNotMatch(index,/μαθητές 6–18/);
assert.match(index,/greek-support-data\.js/);
assert.match(readme,/Προσχολική/);
assert.match(readme,/4–18/);
assert.match(a11y,/a11yToolCount/);
assert.match(a11y,/Object\.values\(ACCESSIBILITY_INFO\)/);
assert.match(methodology,/43 canonical εργαλεία/);
assert.doesNotMatch(methodology,/35 εργαλεία/);

assert.match(app,/GREEK_SUPPORT_INFO/);
assert.match(app,/Learning Path Check/);
assert.match(tutor,/AITOOLSKIDS_TUTOR_SUPPORT/);
assert.match(tutor,/getQualityContext/);
assert.match(pwa,/tutor-feedback\.js/);
assert.match(pwa,/tutor-learning-support\.js/);

assert.match(tutorApi,/GROQ_PRODUCTION_MODEL/);
assert.match(teacherApi,/GROQ_PRODUCTION_MODEL/);
assert.match(tutorApi,/allowedProductionModels/);
assert.match(teacherApi,/allowedProductionModels/);

assert.match(expansion,/Αρχαία Ελληνική Γλώσσα και Γραμματεία/);
assert.match(expansion,/Πληροφορική/);
assert.match(expansion,/Φυσική Αγωγή/);
assert.match(expansion,/Πολιτισμός και Δραστηριότητες/);
assert.match(expansion,/Εργαστήρια Δεξιοτήτων/);
assert.match(expansion,/Ζω Καλύτερα – Ευ Ζην/);
assert.match(expansion,/annual-framework-verified/);

assert.match(teacher,/data-task="package"/);
assert.match(teacher,/Πακέτο 1 διδακτικής ώρας/);
assert.match(teacher,/tutorDeepLink/);
assert.match(teacher,/QR για την τάξη/);
assert.match(teacher,/qrcode@1\.5\.4/);
assert.match(teacher,/ΦΕΚ 3567\/Β\/04-08-2021/);

for (const [name,html] of [["teacher-assistant.html",teacher],["index.html",index]]) {
  const re=/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;
  let match, count=0;
  while((match=re.exec(html))){
    if(/type\s*=\s*["'](?:application\/ld\+json|module)["']/i.test(match[1])) continue;
    const code=match[2].trim();
    if(!code)continue;
    count++;
    new vm.Script(code,{filename:name+"#inline-"+count});
  }
}
console.log("quality-upgrade smoke: ok");
