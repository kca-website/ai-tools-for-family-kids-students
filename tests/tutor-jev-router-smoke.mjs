import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require=createRequire(import.meta.url);
const handler=require('../api/tutor-assistant.js');

function makeRes(){
  return {
    statusCode:200,
    headers:{},
    body:null,
    setHeader(k,v){this.headers[k]=v;},
    status(code){this.statusCode=code;return this;},
    json(value){this.body=value;return this;},
  };
}

const originalFetch=global.fetch;
const oldGroq=process.env.GROQ_API_KEY;
const oldTypeSafe=process.env.TYPESAFE_API_KEY;

try{
  process.env.GROQ_API_KEY='test-groq';
  process.env.TYPESAFE_API_KEY='test-jev';

  {
    const res=makeRes();
    await handler({method:'GET'},res);
    assert.equal(res.statusCode,200);
    assert.equal(res.body.router,'jev');
  }

  const calls=[];
  global.fetch=async (url,opts)=>{
    calls.push({url:String(url),body:JSON.parse(opts.body)});
    if(String(url).includes('typesafe.ai')){
      return {
        ok:true,
        status:200,
        async json(){
          return {
            model:'jev-1.13.0',
            answers:{
              intent:{type:'choice',choice:'direct_answer_request',confidence:.94,probabilities:{}},
              response_strategy:{type:'choice',choice:'socratic_hint',confidence:.91,probabilities:{}},
              learning_signal:{type:'choice',choice:'procedural_error',confidence:.76,probabilities:{}},
              needs_clarification:{type:'noul',noul:.08},
              asks_for_finished_answer:{type:'noul',noul:.97},
            },
          };
        },
      };
    }
    if(String(url).includes('api.groq.com')){
      const body=JSON.parse(opts.body);
      const system=body.messages?.[0]?.content||'';
      assert.match(system,/selected grade, subject and topic as authoritative/i);
      assert.match(system,/Do not provide the finished homework\/complete worked solution/i);
      assert.match(system,/visible learning signal: procedural_error/i);
      return {
        ok:true,
        status:200,
        async json(){return {choices:[{message:{content:'Πάμε με ένα μικρό βήμα πρώτα.'}}]};},
      };
    }
    throw new Error('unexpected URL '+url);
  };

  {
    const res=makeRes();
    await handler({
      method:'POST',
      body:{
        system:'Mapped curriculum: decimals comparison.',
        prompt:'Λύσε μου κατευθείαν την άσκηση 0,45 ή 0,8.',
        audience:'parent',
        task:'conversation',
        mode:'understand',
        grade:'Ε Δημοτικού',
        subject:'Μαθηματικά',
        topic:'Σύγκριση δεκαδικών',
      },
    },res);
    assert.equal(res.statusCode,200);
    assert.equal(res.body.router.provider,'jev');
    assert.equal(res.body.router.intent,'direct_answer_request');
    assert.equal(res.body.router.strategy,'socratic_hint');
    assert.equal(res.body.router.asksForFinishedAnswer,.97);
    assert.equal(res.body.text,'Πάμε με ένα μικρό βήμα πρώτα.');
  }

  assert.equal(calls.filter(c=>c.url.includes('typesafe.ai')).length,1,'conversation should make one Jev routing call');
  const jevBody=calls.find(c=>c.url.includes('typesafe.ai')).body;
  assert.equal(jevBody.model,'jev-latest');
  assert.equal(jevBody.state.selected_subject,'Μαθηματικά');
  assert.ok(jevBody.questions.intent.criteria.direct_answer_request);
  assert.ok(jevBody.questions.response_strategy.criteria.document_grounded);

  delete process.env.TYPESAFE_API_KEY;
  global.fetch=async (url,opts)=>{
    assert.ok(!String(url).includes('typesafe.ai'),'rules fallback must skip Jev without key');
    const body=JSON.parse(opts.body);
    assert.match(body.messages?.[0]?.content||'',/Router source: rules/);
    assert.match(body.messages?.[0]?.content||'',/document_grounded/);
    return {
      ok:true,
      status:200,
      async json(){return {choices:[{message:{content:'Απαντώ μόνο από το έγγραφο.'}}]};},
    };
  };

  {
    const res=makeRes();
    await handler({
      method:'POST',
      body:{
        system:'Use supplied source.',
        prompt:'Τι λέει το PDF για αυτό;',
        audience:'high_student',
        task:'conversation',
        mode:'understand',
        grade:'Β Λυκείου',
        subject:'Ιστορία',
        topic:'Πηγή',
        documentText:'Το έγγραφο αναφέρει μόνο το γεγονός Α.',
        documentName:'notes.pdf',
      },
    },res);
    assert.equal(res.statusCode,200);
    assert.equal(res.body.router.provider,'rules');
    assert.equal(res.body.router.intent,'document_question');
    assert.equal(res.body.router.strategy,'document_grounded');
  }

  console.log('Tutor Jev routing layer smoke passed.');
}finally{
  global.fetch=originalFetch;
  if(oldGroq===undefined) delete process.env.GROQ_API_KEY; else process.env.GROQ_API_KEY=oldGroq;
  if(oldTypeSafe===undefined) delete process.env.TYPESAFE_API_KEY; else process.env.TYPESAFE_API_KEY=oldTypeSafe;
}
