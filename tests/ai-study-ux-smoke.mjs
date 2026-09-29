import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const html = fs.readFileSync(new URL("../study.html", import.meta.url), "utf8");

assert.doesNotMatch(html, /officialSourceCache\.set\(key\s*,\s*null\)/);
assert.match(html, /const cached=officialSourceCache\.get\(key\);[\s\S]{0,120}cached\?\.grounded/);
assert.match(html, /body\?\.error==='official_source_unavailable'/);
assert.match(html, /for\(let attempt=0;attempt<2;attempt\+\+\)/);

assert.match(html, /5 ερωτήσεις · μία-μία/);
assert.match(html, /Run a 5-question quick quiz/);
assert.match(html, /interactiveTotal=action==='quiz'\?5:0/);
assert.match(html, /function quizProgressHtml\(\)/);
assert.match(html, /interactiveStep\+\(lang==='en'\?' of ':' από '\)\+interactiveTotal/);
assert.match(html, /Do NOT ask another question/);

assert.match(html, /function studyMarkup\(text\)/);
assert.match(html, /class="quiz-progress"/);
assert.match(html, /\.grid\.study-result-open/);
assert.match(html, /document\.querySelector\('main\.grid'\)\?\.classList\.add\('study-result-open'\)/);

const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).filter(Boolean);
assert.ok(scripts.length >= 1, "expected at least one inline script");
for (const script of scripts) {
  new vm.Script(script);
}

console.log("AI Study source retry, rich rendering and five-question quiz checks passed.");
