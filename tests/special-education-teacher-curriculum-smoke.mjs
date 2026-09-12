import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});

try{
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});

  await page.goto(`${BASE}/teacher-assistant.html`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITOOLSKIDS_TEACHER_CURRICULUM_AUDIT);

  const direct=await page.evaluate(()=>({
    physicsVsPe: window.subjectMatches({subject:'Φυσική'},{id:'pe',label:'Φυσική Αγωγή'}),
    physicsVsPhysics: window.subjectMatches({subject:'Φυσική'},{id:'physics',label:'Φυσική'}),
    economicsVsHome: window.subjectMatches({subject:'Οικονομικά'},{id:'home-economics',label:'Οικιακή Οικονομία'}),
    collisions: window.AITOOLSKIDS_TEACHER_CURRICULUM_AUDIT?.collisions||[]
  }));
  assert.equal(direct.physicsVsPe,false,'Physics must never match Physical Education');
  assert.equal(direct.physicsVsPhysics,true,'Physics must match Physics');
  assert.equal(direct.economicsVsHome,false,'Economics must never match Home Economics');
  assert.deepEqual(direct.collisions,[],'Strict bridge audit reported unknown subject identities');

  await page.selectOption('#context','specialGym');
  await page.selectOption('#grade','a');
  await page.selectOption('#subject','physics');
  const physicsTopics=await page.locator('#unit option').allTextContents();
  assert.ok(physicsTopics.length>0 && !physicsTopics[0].includes('Δεν υπάρχει'), 'Special Gymnasium Physics should expose mapped Physics topics');

  for(const subjectId of ['pe','biology','math','home-economics','history']){
    if(await page.locator(`#subject option[value="${subjectId}"]`).count()===0) continue;
    await page.selectOption('#subject',subjectId);
    const topics=await page.locator('#unit option').allTextContents();
    assert.notDeepEqual(topics,physicsTopics,`${subjectId} incorrectly received the complete Physics topic list`);
  }

  const literatureOption=page.locator('#subject option').filter({hasText:'Νεοελληνική Λογοτεχνία'});
  assert.ok(await literatureOption.count(),'Special Gymnasium A must expose Modern Greek Literature');
  await page.selectOption('#subject',{label:'Νεοελληνική Λογοτεχνία'});
  const literatureTopics=await page.locator('#unit option').allTextContents();
  assert.ok(literatureTopics.length>=13,'Special Gymnasium A Literature should expose the official textbook thematic units');
  assert.ok(literatureTopics.some(x=>x.includes('Ο άνθρωπος και η φύση')),'Literature textbook theme “Ο άνθρωπος και η φύση” missing');
  assert.ok(!literatureTopics.some(x=>x.includes('Δεν υπάρχει χαρτογραφημένη')),'Literature must not fall back to an empty custom-unit selector when official textbook sections exist');

  const literatureBridge=await page.evaluate(()=>Object.values(window.SPECIAL_EDUCATION_CURRICULUM?.entries||{}).find(e=>
    e.schoolType==='special-gymnasium'&&e.grade==='A'&&e.subjectId==='literature'&&e.verificationBasis==='official-digital-textbook'
  ));
  assert.ok(literatureBridge?.referenceSourceUrl?.includes('ebooks.edu.gr'),'Literature bridge must retain its official digital-textbook source');

  const bridgeLeak=await page.evaluate(()=>{
    const entries=Object.values(window.SPECIAL_EDUCATION_CURRICULUM?.entries||{});
    const physics=entries.find(e=>e.schoolType==='special-gymnasium'&&e.grade==='A'&&e.subjectId==='physics'&&e.verificationBasis==='general-gymnasium-2026-27');
    const pe=entries.find(e=>e.schoolType==='special-gymnasium'&&e.grade==='A'&&e.subjectId==='pe'&&e.verificationBasis==='general-gymnasium-2026-27');
    if(!physics||!pe) return false;
    const p=new Set(physics.officialAnchors||[]);
    return (pe.officialAnchors||[]).length>0 && (pe.officialAnchors||[]).every(x=>p.has(x));
  });
  assert.equal(bridgeLeak,false,'Physical Education bridge must not be a copy of Physics');

  assert.deepEqual(errors,[],`Teacher curriculum browser errors: ${errors.join('\n')}`);
  await page.close();
  console.log('Strict special-school teacher curriculum mapping smoke passed.');
}finally{
  await browser.close();
}