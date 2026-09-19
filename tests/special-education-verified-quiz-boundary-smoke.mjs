import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const context=vm.createContext({window:{}});
for(const file of [
  'quiz-data.js',
  'special-education-curriculum-data.js',
  'special-education-learning-data.js',
  'special-education-quiz-data.js',
  'special-education-status.js',
  'special-education-special-gymnasium-data.js',
  'special-education-assessment-policy.js',
  'special-education-diagnostic-data.js'
]){
  vm.runInContext(fs.readFileSync(new URL(file,root),'utf8'),context,{filename:file});
}

const data=context.window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA;
assert.ok(data,'Special Education diagnostic data did not load');
assert.equal(data.version,4);
assert.equal(data.verifiedQuizCount,11,'All eleven explicitly reviewed Special Education quizzes should be marked verified');
assert.equal(data.supportQuizCount,13,'Thirteen bounded Special Lyceum GEL-support quizzes should be declared separately');
assert.equal(data.totalAvailableQuizCount,24,'Total available Special Education short-test count is wrong');

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
assert.equal(ready,24,'Expected eleven reviewed Special Education tests plus thirteen bounded Special Lyceum support tests');
assert.equal(data.quizForSelection('special-gymnasium','a','',{id:'math',label:'Μαθηματικά'})?.id,'special-gym-a-math-problem-reading','Verified Special Gymnasium Maths support quiz must be exposed');
assert.equal(data.quizForSelection('special-lyceum','a','',{id:'new-greek',label:'Νεοελληνική Γλώσσα και Λογοτεχνία'})?.scope,'verified-gel-support-mapping','Special Lyceum must expose the bounded GEL support mapping honestly');

const source=fs.readFileSync(new URL('special-education-diagnostic-data.js',root),'utf8');
assert.doesNotMatch(source,/function category\(|const Q=|basic-subject-check/,'Generic category quiz generator must not return');
const navigator=fs.readFileSync(new URL('navigator-home.js',root),'utf8');
assert.match(navigator,/data-special-education-diagnostic/,'Homepage Practice Map must open the Special Education diagnostic');
console.log('Special Education verified-quiz boundary smoke passed.');
