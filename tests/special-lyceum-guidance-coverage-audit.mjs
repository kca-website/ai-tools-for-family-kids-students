import fs from 'node:fs';
import assert from 'node:assert/strict';

const indexSource=fs.readFileSync('special-education-special-lyceum-data.js','utf8');
const annualSource=fs.readFileSync('teacher-curriculum-special-lyceum-annual-2026-2027.js','utf8');

const indexKeys=[...indexSource.matchAll(/Object\.freeze\(\{key:"([^"]+)"/g)].map(m=>m[1]);
assert.ok(indexKeys.length>=14,'Special Lyceum official guidance index unexpectedly small');
assert.equal(new Set(indexKeys).size,indexKeys.length,'Special Lyceum official guidance index contains duplicate keys');

const subjectToGuidance={
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

const entryBlocks=[...annualSource.matchAll(/"([abc])\|([^"]+)":Object\.freeze\(\{([\s\S]*?)\n\s*\}\),?/g)]
  .map(m=>({grade:m[1],subject:m[2],body:m[3]}));

assert.ok(entryBlocks.length>=14,'Special Lyceum annual map unexpectedly lost entries');

const exactGuidanceKeys=new Set();
const frameworkGuidanceKeys=new Set();
for(const entry of entryBlocks){
  const guidanceKey=subjectToGuidance[entry.subject]||entry.subject;
  assert.ok(indexKeys.includes(guidanceKey),`Mapped Special Lyceum subject "${entry.subject}" is missing from the official guidance index`);
  if(/coverageStatus:"exact"/.test(entry.body)){
    exactGuidanceKeys.add(guidanceKey);
  }else if(/coverageStatus:"framework"/.test(entry.body)||/frameworkOnly:true/.test(entry.body)){
    frameworkGuidanceKeys.add(guidanceKey);
  }else{
    throw new Error(`Special Lyceum entry ${entry.grade}|${entry.subject} has neither exact nor framework coverage status`);
  }
}

for(const required of ['biology','informatics','latin']){
  assert.ok(exactGuidanceKeys.has(required),`Known exact Special Lyceum mapping missing: ${required}`);
}
for(const required of ['history','language-literature']){
  assert.ok(frameworkGuidanceKeys.has(required),`Known framework Special Lyceum mapping missing: ${required}`);
  assert.ok(!exactGuidanceKeys.has(required),`Framework-only Special Lyceum mapping must not be reported as exact: ${required}`);
}

const covered=new Set([...exactGuidanceKeys,...frameworkGuidanceKeys]);
const pending=indexKeys.filter(k=>!covered.has(k));

for(const required of ['economics','ancient','math','religion','civics','philosophy','english','second-foreign-language','ethics']){
  assert.ok(pending.includes(required),`Published Special Lyceum guidance should remain pending until section/framework mapping is verified: ${required}`);
}

assert.ok(pending.length>0,'Special Lyceum audit unexpectedly reports no mapping backlog');
console.log(JSON.stringify({
  officialGuidanceSubjects:indexKeys.length,
  exactSectionMapped:[...exactGuidanceKeys].sort(),
  frameworkMapped:[...frameworkGuidanceKeys].sort(),
  pendingMapping:pending.sort()
},null,2));
