import fs from 'node:fs';
import assert from 'node:assert/strict';

const indexSource=fs.readFileSync('special-education-special-lyceum-data.js','utf8');
const annualSource=fs.readFileSync('teacher-curriculum-special-lyceum-annual-2026-2027.js','utf8');

const indexKeys=[...indexSource.matchAll(/Object\.freeze\(\{key:"([^"]+)"/g)].map(m=>m[1]);
assert.ok(indexKeys.length>=14,'Special Lyceum official guidance index unexpectedly small');
assert.equal(new Set(indexKeys).size,indexKeys.length,'Special Lyceum official guidance index contains duplicate keys');


const timetableMatch=indexSource.match(/officialTimetable:Object\.freeze\(\{([\s\S]*?)\n\s*\}\),\n\s*sourceUrl:/);
assert.ok(timetableMatch,'Official Special Lyceum timetable metadata is missing');
const timetable=timetableMatch[1];
for(const token of ['43941/Δ3/07-04-2026','ΦΕΚ Β΄ 2133/09-04-2026','ΕΡΓΑ46ΝΚΠΔ-ΜΝΡ','effectiveFrom:"2026-2027"']){
  assert.ok(timetable.includes(token),`Official timetable metadata missing: ${token}`);
}
const gradeScope={
  a:['ancient','language-literature','religion','ethics','history','math','english','second-foreign-language','physics','chemistry','biology','physical-education','civics','informatics'],
  b:['ancient','language-literature','math','physics','chemistry','biology','informatics','history','philosophy','religion','ethics','english','second-foreign-language','physical-education','latin'],
  c:['religion','ethics','language-literature','history','math','english','physical-education','ancient','latin','physics','chemistry','biology','informatics','economics']
};
for(const [grade,subjects] of Object.entries(gradeScope)){
  const row=timetable.match(new RegExp(grade+':Object\\.freeze\\(\\[([^\\]]+)\\]\\)'));
  assert.ok(row,`Official timetable grade scope missing: ${grade}`);
  for(const subject of subjects) assert.ok(row[1].includes('\"'+subject+'\"'),`Official timetable ${grade.toUpperCase()} missing ${subject}`);
}

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
for(const required of ['history','language-literature','second-foreign-language']){
  assert.ok(frameworkGuidanceKeys.has(required),`Known framework Special Lyceum mapping missing: ${required}`);
  assert.ok(!exactGuidanceKeys.has(required),`Framework-only Special Lyceum mapping must not be reported as exact: ${required}`);
}

const covered=new Set([...exactGuidanceKeys,...frameworkGuidanceKeys]);
const pending=indexKeys.filter(k=>!covered.has(k));

for(const required of ['economics','ancient','math','religion','civics','philosophy','english','ethics']){
  assert.ok(pending.includes(required),`Published Special Lyceum guidance should remain pending until section/framework mapping is verified: ${required}`);
}

const ethicsIndexBlock=indexSource.match(/Object\.freeze\(\{key:"ethics"[\s\S]*?\}\)/)?.[0]||'';
assert.ok(ethicsIndexBlock,'Special Lyceum Ethics guidance index entry is missing');
assert.match(ethicsIndexBlock,/status:"published-part-1"/,'Special Lyceum Ethics must remain explicitly partial while only the Sep–Nov 2026 first part is published');
assert.ok(pending.includes('ethics'),'Special Lyceum Ethics must remain pending until verified Lyceum E.A.E. topic/framework mapping is available');
assert.ok(!exactGuidanceKeys.has('ethics')&&!frameworkGuidanceKeys.has('ethics'),'Special Lyceum Ethics must not be promoted to exact/framework coverage from Gymnasium or unrelated guidance');

assert.ok(pending.length>0,'Special Lyceum audit unexpectedly reports no mapping backlog');
console.log(JSON.stringify({
  officialGuidanceSubjects:indexKeys.length,
  exactSectionMapped:[...exactGuidanceKeys].sort(),
  frameworkMapped:[...frameworkGuidanceKeys].sort(),
  pendingMapping:pending.sort()
},null,2));
