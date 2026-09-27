import fs from "node:fs";
import vm from "node:vm";

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
for(const row of [...rows.values()].sort((a,b)=>a.source.localeCompare(b.source))){
  row.coverage=Math.round(100*row.evidenced/row.verified);
  console.log(row);
}
