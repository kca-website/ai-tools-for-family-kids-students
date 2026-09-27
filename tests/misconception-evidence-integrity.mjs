import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const evidenceSrc=fs.readFileSync(new URL("../misconception-evidence-data.js",import.meta.url),"utf8");
const quizSrc=fs.readFileSync(new URL("../quiz-data.js",import.meta.url),"utf8");
const officialSrc=fs.readFileSync(new URL("../official-curriculum-data.js",import.meta.url),"utf8");

const sandbox={window:{}};
vm.runInNewContext(evidenceSrc,sandbox,{filename:"misconception-evidence-data.js"});
const api=sandbox.window.AITOOLSKIDS_MISCONCEPTION_EVIDENCE;
assert.ok(api?.data,"evidence dataset should load");

const ids=Object.keys(api.data);
assert.ok(ids.length>=28,"expected at least 28 research-backed misconception records");

for(const id of ids){
  const item=api.data[id];
  assert.equal(item.id,id,`${id}: id must match key`);
  assert.ok(/^https:\/\//.test(item.url||""),`${id}: stable HTTPS evidence URL required`);
  assert.ok(String(item.sourceTitle||"").trim().length>8,`${id}: sourceTitle required`);
  assert.ok(String(item.populationEl||"").trim().length>5,`${id}: population context required`);
  assert.ok(String(item.supportsEl||"").trim().length>20,`${id}: bounded evidence statement required`);

  assert.ok(quizSrc.includes(`"${id}": {`),`${id}: must exist in GAP_TAGS/quiz data`);
  const start=officialSrc.indexOf(`"${id}": {`);
  assert.ok(start>=0,`${id}: must exist in official curriculum mapping`);
  const block=officialSrc.slice(start,start+1800);
  assert.match(block,/"status":\s*"(exact-section-verified|related-section-verified)"/,`${id}: mapping must be verified at section level`);
  assert.match(block,/"sourceQuizId":\s*"[^"]+"/,`${id}: sourceQuizId required`);
}
console.log(`misconception evidence integrity: ok (${ids.length} records)`);
