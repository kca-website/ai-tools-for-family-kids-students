import fs from 'node:fs';
import vm from 'node:vm';

const context=vm.createContext({window:{}});
const root=new URL('../',import.meta.url);
for(const file of [
  'special-education-curriculum-data.js',
  'special-education-learning-data.js',
  'special-education-quiz-data.js',
  'special-education-status.js',
  'special-education-special-gymnasium-data.js',
  'special-education-assessment-policy.js'
]){
  vm.runInContext(fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8'),context,{filename:file});
}

const C=context.window.SPECIAL_EDUCATION_CURRICULUM;
const L=context.window.SPECIAL_EDUCATION_LEARNING;
const Q=context.window.SPECIAL_EDUCATION_QUIZZES;
const expected=[
  ['special-gym-b-language-comprehension','B'],
  ['special-gym-b-math-problem-reading','B'],
  ['special-gym-c-language-comprehension','C'],
  ['special-gym-c-math-problem-reading','C']
];

for(const [id,grade] of expected){
  if(C?.entries?.[id]?.grade!==grade) throw new Error(`${id}: wrong or missing grade metadata`);
  if(C.entries[id].coverageStatus!=='support-skill') throw new Error(`${id}: must remain a support-skill, not claimed curriculum scope`);
  if(L?.[id]?.status!=='ready') throw new Error(`${id}: learning support missing`);
  const quiz=Q?.[id];
  if(!quiz||quiz.assessmentProfile!=='special-education-simple-v1') throw new Error(`${id}: simplified assessment profile missing`);
  if(quiz.questions.length!==3) throw new Error(`${id}: expected exactly 3 questions`);
  for(const q of quiz.questions){
    if(q.options.length!==2) throw new Error(`${id}: every question must have exactly 2 choices`);
  }
}
console.log('Special Gymnasium B/C support-skill data smoke passed.');
