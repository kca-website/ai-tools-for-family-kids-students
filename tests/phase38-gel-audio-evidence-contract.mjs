import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {createKnowledgeMapLesson, validReview, VERSION}=require('../whole-section-audio-knowledge.js');
const {sourceUnits,sourceSentences}=require('../whole-section-audio.js');
const {verifyAudio}=await import('../scripts/phase27-gel-uat.mjs');
const core=[{id:'k1'},{id:'k2'}];
const good={
  sentences:[{index:0,supported:true,concise:true},{index:1,supported:true,concise:true}],
  coreIdeas:[{id:'k1',covered:true},{id:'k2',covered:true}]
};
assert.equal(validReview(JSON.stringify(good),2,core),true);
assert.equal(validReview(JSON.stringify({...good,coreIdeas:[good.coreIdeas[0],good.coreIdeas[0]]}),2,core),false,'duplicated idea may not substitute for a missing idea');
assert.equal(validReview(JSON.stringify({...good,sentences:[good.sentences[0],good.sentences[0]]}),2,core),false,'duplicated sentence review');
assert.equal(validReview(JSON.stringify({...good,sentences:[{...good.sentences[0],index:5},good.sentences[1]]}),2,core),false,'fabricated sentence index');
assert.equal(validReview(JSON.stringify({...good,coreIdeas:[good.coreIdeas[0],{id:'k3',covered:true}]}),2,core),false,'unknown core idea');
assert.equal(validReview(JSON.stringify({...good,coreIdeas:[good.coreIdeas[0],{id:'k2',covered:false}]}),2,core),true,'negative review is valid input and must trigger repair');

// Deterministic mocked provider: test the COMPLETE extraction, selection,
// synthesis, review and evidence metrics without paid API usage.
const source=Array.from({length:150},(_,i)=>'Η έννοια '+(i+1)+' περιλαμβάνει παραδείγματα και σαφή στοιχεία της επίσημης σχολικής πηγής.').join('\n\n');
let calls=0;
async function generate({messages,validateText}){
  calls++;
  const system=messages[0].content;
  const user=JSON.parse(messages[1].content);
  let output;
  if(system.includes('Extract the knowledge a learner must understand')){
    const s=user.sentences[0];
    output={ideas:[{id:'k1',idea:s.text,type:'fact',importance:'core',evidenceIds:[s.id]}]};
  }else if(system.includes('minimum sufficient set of ideas')){
    output={coreIdeaIds:user.ideas.map(x=>x.id)};
  }else if(system.includes('Write a natural, concise spoken school lesson')){
    output={sentences:user.coreIdeas.map(x=>({text:x.idea,ideaIds:[x.id]}))};
  }else if(system.includes('Independently verify a synthesized spoken lesson')){
    output={sentences:user.draft.map((_,i)=>({index:i,supported:true,concise:true})),
      coreIdeas:user.coreIdeas.map(x=>({id:x.id,covered:true}))};
  }else throw Error('Unexpected provider prompt');
  const text=JSON.stringify(output);
  assert.ok(validateText(text),'Generator schema rejected: '+system.slice(0,80));
  return {ok:true,text,provider:'mock',model:'mock',attempts:[],usage:{}};
}
const response=await createKnowledgeMapLesson({source,topic:'Δοκιμαστική ενότητα',generate});
assert.equal(response.verified,true);
assert.equal(response.wholeChapter,true);
assert.equal(response.verification.version,VERSION);
assert.equal(response.verification.coverageBasis,'selected-core-ideas');
assert.equal(response.verification.coreIdeasCovered,response.verification.coreIdeas);
assert.equal(response.verification.sourceUnitsParsed,response.verification.units);
assert.ok(response.verification.unitsWithCoreEvidence>=1);
assert.ok(response.verification.unitsWithCoreEvidence<=response.verification.units);
assert.ok(calls>=4);
assert.equal(verifyAudio(200,response).state,'passed','valid knowledge-map output should not fail the audit');
assert.equal(verifyAudio(200,{...response,verification:{...response.verification,sourceUnitsParsed:0}}).state,'failed');
console.log('PHASE38_GEL_AUDIO_EVIDENCE_INTEGRITY_OK',JSON.stringify({units:response.verification.units,coreIdeas:response.verification.coreIdeas,calls}));
