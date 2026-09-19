import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const context=vm.createContext({
  window:{},
  document:{
    readyState:'loading',
    addEventListener(){},
    getElementById(){return null;}
  }
});

for(const file of [
  'teacher-curriculum-epal-2026-2027.js',
  'teacher-curriculum-epal-c-specialties-2026-2027.js',
  'teacher-curriculum-epal-c-final-sectors-2026-2027.js',
  'teacher-curriculum-epal-panhellenic-2027.js',
  'epal-official-guidance-topics-2026-2027.js',
  'epal-student-topics-2026-2027.js',
  'epal-student-tutor-2026-2027.js'
]){
  vm.runInContext(fs.readFileSync(new URL(file,root),'utf8'),context,{filename:file});
}

const layer=context.window.AITOOLSKIDS_EPAL_STUDENT_TOPICS_2026_2027;
assert.ok(layer,'EPAL student topic layer did not load');

const official=layer.resolve('Προγραμματισμός Υπολογιστών',[]);
assert.ok(official.length>=7,'Official 2027 exam topics were not reused');
assert.ok(official.every(x=>x.officialExact===true),'Official topics must be marked exact');
assert.ok(official.every(x=>x.sourceKind==='panhellenic-2027'),'Official exam provenance is missing');

const unresolved=layer.resolve('Μάθημα χωρίς κωδικοποιημένη αναλυτική ύλη',[]);
assert.equal(unresolved.length,1,'Unresolved courses must not receive generated themes');
assert.equal(unresolved[0].customTitle,true,'Unresolved course must request the exact title');
assert.equal(unresolved[0].officialExact,false,'Free-text route must not claim official exactness');
assert.doesNotMatch(unresolved[0].label,/Θεματική υποστήριξης/i);

const source=fs.readFileSync(new URL('epal-student-topics-2026-2027.js',root),'utf8');
assert.doesNotMatch(source,/templates\s*=|supportTopics\s*\(/,'Keyword curriculum generator must not return');

const guidance=layer.resolve('Τοπογραφία',[]);
assert.ok(guidance.some(x=>/Κεφάλαιο 1 - Βασικές έννοιες/.test(x.label)),'Official IEP guidance chapters were not loaded');
assert.ok(guidance.every(x=>x.officialExact&&/iep\.edu\.gr/.test(x.sourceUrl)),'Official guidance provenance is missing');
const wholeBook=layer.resolve('Αρχές Προγραμματισμού Υπολογιστών',[]);
assert.match(wholeBook[0].label,/Όλα τα Κεφάλαια.*εκτός του κεφαλαίου 7/i,'Official whole-book scope/exclusions were not preserved');

const catalog=context.window.AITOOLSKIDS_EPAL_STUDENT_CATALOG;
assert.ok(catalog,'EPAL student catalog did not load');
const all=[...catalog.getSubjects('a')];
for(const sector of catalog.getSectors()) all.push(...catalog.getSubjects('b',sector.id));
for(const specialty of catalog.getSpecialties()) all.push(...catalog.getSubjects('c','',specialty.id));
assert.ok(all.length>250,'Full EPAL student catalog was not traversed');
let mappedSubjects=0;
for(const subject of all){
  if((subject.topics||[]).some(topic=>topic.officialExact)) mappedSubjects++;
  for(const topic of subject.topics||[]){
    assert.doesNotMatch(topic.labelEl,/Θεματική υποστήριξης/i,`${subject.subjectLabelEl} still exposes a generated theme`);
    if(topic.officialExact===false) assert.equal(topic.customTitle,true,`${subject.subjectLabelEl} has an unverified selectable topic`);
  }
}
assert.ok(mappedSubjects>=150,`Expected broad official mapping coverage, got ${mappedSubjects}`);

console.log('EPAL student official-topic boundary smoke passed.');
