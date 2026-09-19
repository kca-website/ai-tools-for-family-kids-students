import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const context=vm.createContext({window:{}});
for(const file of ['special-education-quiz-data.js','special-education-diagnostic-data.js']){
  vm.runInContext(fs.readFileSync(new URL(file,root),'utf8'),context,{filename:file});
}

const data=context.window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA;
assert.ok(data,'Special Education diagnostic data did not load');
assert.equal(data.version,2);
assert.equal(data.verifiedQuizCount,5,'Only the five explicitly reviewed quizzes should be marked verified');

let subjects=0,ready=0;
for(const schoolId of data.schoolOrder){
  const school=data.schools[schoolId];
  for(const gradeId of school.gradeOrder){
    const grade=school.grades[gradeId];
    for(const subject of grade.subjects||[]){subjects++;if(data.quizForSelection(schoolId,gradeId,'',subject))ready++;}
    for(const group of grade.groups||[])for(const subject of group.subjects||[]){subjects++;if(data.quizForSelection(schoolId,gradeId,group.id,subject))ready++;}
  }
}
assert.ok(subjects>250,'Special Education catalog unexpectedly shrank');
assert.equal(ready,5,'Generic category questions must not be exposed as verified curriculum tests');
assert.equal(data.quizForSelection('special-gymnasium','a','',{id:'math',label:'Μαθηματικά'}),null,'Special Gymnasium must not receive an invented generic quiz');

const source=fs.readFileSync(new URL('special-education-diagnostic-data.js',root),'utf8');
assert.doesNotMatch(source,/function category\(|const Q=|basic-subject-check/,'Generic category quiz generator must not return');
const navigator=fs.readFileSync(new URL('navigator-home.js',root),'utf8');
assert.match(navigator,/data-special-education-diagnostic/,'Homepage Practice Map must open the Special Education diagnostic');
console.log('Special Education verified-quiz boundary smoke passed.');
