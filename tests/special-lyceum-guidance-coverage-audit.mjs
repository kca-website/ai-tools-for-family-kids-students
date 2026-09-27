import fs from 'node:fs';
import assert from 'node:assert/strict';

const indexSource=fs.readFileSync('special-education-special-lyceum-data.js','utf8');
const annualSource=fs.readFileSync('teacher-curriculum-special-lyceum-annual-2026-2027.js','utf8');

const indexKeys=[...indexSource.matchAll(/Object\.freeze\(\{key:"([^"]+)"/g)].map(m=>m[1]);
assert.ok(indexKeys.length>=14,'Special Lyceum official guidance index unexpectedly small');
assert.equal(new Set(indexKeys).size,indexKeys.length,'Special Lyceum official guidance index contains duplicate keys');

const annualKeys=[...annualSource.matchAll(/"([abc])\|([^"]+)":Object\.freeze\(\{/g)].map(m=>m[2]);
const exactSubjects=new Set(annualKeys);
const exactToGuidance={
  language:'language-literature',
  biology:'biology',
  economics:'economics',
  ancient:'ancient',
  history:'history',
  informatics:'informatics',
  math:'math',
  religion:'religion',
  civics:'civics',
  philosophy:'philosophy',
  english:'english',
  'second-foreign-language':'second-foreign-language',
  latin:'latin',
  ethics:'ethics'
};

for(const subject of exactSubjects){
  const guidanceKey=exactToGuidance[subject]||subject;
  assert.ok(indexKeys.includes(guidanceKey),`Exact Special Lyceum subject "${subject}" is missing from the official guidance index`);
}

const exactGuidanceKeys=new Set([...exactSubjects].map(s=>exactToGuidance[s]||s));
const pending=indexKeys.filter(k=>!exactGuidanceKeys.has(k));

for(const required of ['language-literature','biology','history','informatics','latin']){
  assert.ok(exactGuidanceKeys.has(required),`Known exact Special Lyceum mapping missing: ${required}`);
}

for(const required of ['economics','ancient','math','religion','civics','philosophy','english','second-foreign-language','ethics']){
  assert.ok(indexKeys.includes(required),`Published Special Lyceum guidance missing from index: ${required}`);
}

assert.ok(pending.length>0,'Special Lyceum audit unexpectedly reports no section-level mapping backlog');
console.log(JSON.stringify({
  officialGuidanceSubjects:indexKeys.length,
  exactSectionMapped:[...exactGuidanceKeys].sort(),
  pendingSectionMapping:pending.sort()
},null,2));
