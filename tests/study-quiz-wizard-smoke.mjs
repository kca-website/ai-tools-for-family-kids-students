import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require=createRequire(import.meta.url);
const {hasInternalReasoningLeak}=require('../ai-output-safety.js');
const api=fs.readFileSync('api/tutor-assistant.js','utf8');
const study=fs.readFileSync('study.html','utf8');
const wizard=fs.readFileSync('study-quiz.html','utf8');

assert.equal(hasInternalReasoningLeak('analysis:We need to give a hint. assistant final: hint'),true);
assert.equal(hasInternalReasoningLeak('<think>Reasoning</think>Final answer'),true);
assert.equal(hasInternalReasoningLeak('<|im_start|>assistant<|channel|>analysis'),true);
assert.equal(hasInternalReasoningLeak('Μικρή βοήθεια: σκέψου την τέχνη και τη γραφή.'),false);
assert.match(study,/async function openStudyQuizWizard\(\)/);
assert.match(study,/if\(action==='quiz'\)\{await openStudyQuizWizard\(\);return\}/);
assert.match(api,/hasInternalReasoningLeak\(cached\.text\)/);
assert.match(api,/activity === 'quiz_wizard'/);
assert.match(api,/sourceText: modelDocumentText/);

new vm.Script(api,{filename:'api/tutor-assistant.js'});
for(const match of study.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){
  if(match[1].trim())new vm.Script(match[1],{filename:'study.html inline script'});
}
const inline=[...wizard.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
assert.equal(inline.length,1);
const js=inline[0][1];
new vm.Script(js,{filename:'study-quiz.html inline script'});

const start=api.indexOf('function validStructuredResult(');
const end=api.indexOf('\n\nfunction normalizeGroundingText(',start);
assert.ok(start>0&&end>start,'Quiz result validation must be present');
const validStructured=new Function('parseJsonObject','hasInternalReasoningLeak',
  api.slice(start,end)+'\nreturn validStructuredResult;')(JSON.parse,hasInternalReasoningLeak);
const quote='Η μινωική τέχνη επηρέασε τη μυκηναϊκή τέχνη';
const source='Η πηγή λέει: '+quote+'.';
const questions=Array.from({length:5},(_,i)=>({
  question:'Ποια επίδραση παρουσιάζεται στην ενότητα; '+(i+1),
  hint:'Σκέψου τις ανταλλαγές μεταξύ πολιτισμών',
  answer:'Η τέχνη αποτέλεσε πεδίο επιρροής',
  explanation:'Η ενότητα συνδέει την τέχνη των δύο πολιτισμών',
  evidence:quote
}));
const sample=JSON.stringify({questions});
assert.equal(validStructured({activity:'quiz_wizard',task:'quiz',text:sample,quizCount:5,sourceText:source}),true);
assert.equal(validStructured({activity:'quiz_wizard',task:'quiz',text:sample,quizCount:3,sourceText:source}),false);
assert.equal(validStructured({activity:'quiz_wizard',task:'quiz',text:sample,quizCount:5,sourceText:'Άσχετη πηγή'}),false);
assert.equal(validStructured({activity:'quiz_wizard',task:'quiz',text:'analysis: hidden\n'+sample,quizCount:5,sourceText:source}),false);

function mockNode(){
  return {
    hidden:false,disabled:false,value:'',textContent:'',children:[],events:{},className:'',
    addEventListener(type,fn){this.events[type]=fn},
    appendChild(node){this.children.push(node);return node},
    replaceChildren(...children){this.children=[...children]},
    scrollIntoView(){},focus(){},
    click(){this.events.click?.()},
    setAttribute(){},
  };
}
const ids=['title','subtitle','backLink','quickTitleSmall','loadingText','retry','answerLabel','prev','hintBtn','hintTitle','resultsHeading','editQuiz','printQuiz','finishLink','privacy','answer','context','source','loading','error','errorText','questionView','resultsView','counter','questionText','stateLabel','track','hintText','hint','next','resultsIntro','summary','reviews'];
const elements=Object.fromEntries(ids.map(id=>[id,mockNode()]));
const store=new Map([['aitools4kids-study-quiz-handoff-v1',JSON.stringify({
  lang:'el',quizCount:5,grade:'Α΄ Γυμνασίου',subject:'Αρχαία Ιστορία',
  subjectId:'istoria-a-gymnasiou',topic:'Μινωικός πολιτισμός',
  studyContext:{zoneId:'middle',sourcePolicy:'official_required'},
  documentKind:'official_schoolbook',documentText:source
})]]);
let requested=0;
const document={
  title:'',documentElement:{lang:''},
  getElementById(id){assert.ok(elements[id],'Missing mock node '+id);return elements[id]},
  createElement(){return mockNode()},createTextNode(text){const n=mockNode();n.textContent=text;return n}
};
const sandbox={
  document,window:{print(){}},sessionStorage:{
    getItem(k){return store.get(k)||null},
    removeItem(k){store.delete(k)}
  },URL,AbortController,setTimeout,clearTimeout,console,
  fetch:async(_url,options)=>{
    requested++;
    const payload=JSON.parse(options.body);
    assert.equal(payload.activity,'quiz_wizard');
    assert.equal(payload.quizCount,5);
    return {ok:true,json:async()=>({text:sample,sourceKind:'official_schoolbook',sourceUrl:'https://ebooks.edu.gr'})};
  },
};
vm.runInNewContext(js,sandbox,{filename:'study-quiz.html'});
await new Promise(resolve=>setTimeout(resolve,10));
assert.equal(requested,1);
assert.equal(store.size,0,'Handoff should be removed immediately');
assert.equal(elements.questionView.hidden,false);
assert.match(elements.counter.textContent,/1 από 5/);
elements.answer.value='Δεν θυμάμαι';
elements.next.click();
assert.match(elements.counter.textContent,/1 από 5/,'Unsure must not advance automatically');
assert.equal(elements.hint.hidden,false,'Unsure should reveal hint');
elements.next.click();
assert.match(elements.counter.textContent,/2 από 5/);
elements.prev.click();
assert.match(elements.counter.textContent,/1 από 5/);
assert.equal(elements.hint.hidden,false,'Returning should preserve hint state');
elements.answer.value='Η απάντησή μου';
elements.next.click();
for(let i=1;i<5;i++)elements.next.click();
assert.equal(elements.resultsView.hidden,false,'End of quiz should show review');
assert.match(elements.summary.children[0].textContent,/1\/5/);
assert.equal(elements.reviews.children.length,5);
console.log('Study quick quiz: safety, structure, source quotes, wizard navigation and review OK');
