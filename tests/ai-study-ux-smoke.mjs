import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const html = fs.readFileSync(new URL("../study.html", import.meta.url), "utf8");

assert.doesNotMatch(html, /officialSourceCache\.set\(key\s*,\s*null\)/);
assert.match(html, /const cached=officialSourceCache\.get\(key\);[\s\S]{0,120}cached\?\.grounded/);
assert.match(html, /body\?\.error==='official_source_unavailable'/);
assert.match(html, /for\(let attempt=0;attempt<2;attempt\+\+\)/);
assert.match(html, /function activitySourceBudget\(action\)/);
assert.match(html, /AI Study must not offer broad navigation anchors/);
assert.match(html, /const exactRows=rows\.filter/);
assert.match(html, /official-book-section-verified\|exact-section-verified\|related-section-verified/);
assert.match(html, /if\(exactRows\.length\)rows=exactRows/);
assert.match(html, /flashcards:6000/);
assert.match(html, /activityNeedsDistributedSource\('plan'\)/);
assert.match(html, /mode:'organize',activity:'plan'/);
assert.match(html, /mode:cfg\.mode,activity:action/);
assert.match(html, /attached\?\.text\|\|officialSource\?\.text/);
assert.doesNotMatch(html, /:\(officialSource\?\.text\|\|''\)/);
assert.match(html, /thriskeftika-b-gymnasiou/);
assert.match(html, /source\.canonicalSourceUrl\|\|source\.sourceUrl/);
for (const subjectId of [
  'mathimatika-b-gymnasiou',
  'chimeia-b-gymnasiou',
  'geologia-geografia-b-gymnasiou',
  'logotechnia-b-gymnasiou',
  'english-b-gymnasiou'
]) {
  assert.match(html, new RegExp(`requiresOfficialSource\\(\\)[\\s\\S]{0,1200}${subjectId}`));
}

assert.match(html, /5 ερωτήσεις · μία-μία/);
assert.match(html, /Run a 5-question quick quiz/);
assert.match(html, /interactiveTotal=action==='quiz'\?5:0/);
assert.match(html, /function quizProgressHtml\(\)/);
assert.match(html, /interactiveStep\+\(lang==='en'\?' of ':' από '\)\+interactiveTotal/);
assert.match(html, /Do NOT ask another question/);

assert.match(html, /function learnerIsUnsure\(value\)/);
assert.match(html, /'δεν ξερω'/);
assert.match(html, /'idk'/);
assert.match(html, /const unsure=learnerIsUnsure\(answer\)/);
assert.match(html, /interactiveTotal&&!unsure/);
assert.match(html, /ΜΗΝ επαινέσεις την απάντηση/);
assert.match(html, /ξαναρώτησε ΤΗΝ ΙΔΙΑ έννοια/);
assert.match(html, /μην απαιτείς κατά λέξη αναπαραγωγή του σχολικού βιβλίου/);

assert.match(html, /function studyMarkup\(text\)/);
assert.match(html, /flash-card-inner/);
assert.match(html, /classList\.toggle\('is-flipped'\)/);
assert.match(html, /aria-pressed/);
assert.match(html, /sourceExcerpt\(source\?\.text\|\|'',selectedTopic\(\),6000,false\)/);
assert.match(html, /\^insufficient_/);
assert.match(html, /class="quiz-progress"/);
assert.match(html, /\.grid\.study-result-open/);
assert.match(html, /document\.querySelector\('main\.grid'\)\?\.classList\.add\('study-result-open'\)/);

const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).filter(Boolean);
assert.ok(scripts.length >= 1, "expected at least one inline script");
for (const script of scripts) {
  new vm.Script(script);
}

console.log("AI Study source retry, rich rendering and five-question quiz checks passed.");
