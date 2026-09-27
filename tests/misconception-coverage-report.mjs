import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const evidenceSrc=fs.readFileSync(new URL("../misconception-evidence-data.js",import.meta.url),"utf8");
const officialSrc=fs.readFileSync(new URL("../official-curriculum-data.js",import.meta.url),"utf8");
const sandbox={window:{}};
vm.runInNewContext(evidenceSrc,sandbox);
const evidence=new Set(Object.keys(sandbox.window.AITOOLSKIDS_MISCONCEPTION_EVIDENCE.data));

const conceptual=new Set([
  "math-e-dimotikou",
  "mathimatika-a-gymnasiou",
  "mathimatika-a-lykeiou",
  "fysiki-a-lykeiou",
  "fysiki-b-lykeiou",
  "biologia-a-gymnasiou",
  "biologia-b-lykeiou",
  "biologia-g-lykeiou"
]);

const rows=new Map();
const re=/"([^"]+)":\s*\{([\s\S]*?)\n\s*\},/g;
let match;
while((match=re.exec(officialSrc))){
  const id=match[1],body=match[2];
  const status=(body.match(/"status":\s*"([^"]+)"/)||[])[1];
  const source=(body.match(/"sourceQuizId":\s*"([^"]+)"/)||[])[1];
  if(!source||!conceptual.has(source))continue;
  if(status!=="exact-section-verified"&&status!=="related-section-verified")continue;
  const row=rows.get(source)||{source,verified:0,evidenced:0};
  row.verified++;
  if(evidence.has(id))row.evidenced++;
  rows.set(source,row);
}
const ordered=[...rows.values()].sort((a,b)=>a.source.localeCompare(b.source));
assert.equal(ordered.length,8,"expected eight conceptual STEM source quizzes");
let totalVerified=0,totalEvidenced=0;
for(const row of ordered){
  row.coverage=Math.round(100*row.evidenced/row.verified);
  totalVerified+=row.verified;
  totalEvidenced+=row.evidenced;
  assert.equal(row.evidenced,row.verified,`${row.source}: conceptual STEM misconception coverage must be 100%`);
  console.log(row);
}
assert.equal(totalVerified,34,"expected 34 verified conceptual STEM gaps");
assert.equal(totalEvidenced,34,"expected all 34 conceptual STEM gaps to be research-backed");
console.log("conceptual STEM misconception coverage: 34/34 (100%)");
