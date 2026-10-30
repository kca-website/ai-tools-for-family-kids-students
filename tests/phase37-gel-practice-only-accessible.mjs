import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
const require=createRequire(import.meta.url);
const dispositions=require('../gel-unmapped-dispositions-2026-2027.js');
const practice=require('../gel-practice-only-topics-2026-2027.js');
const overrides=require('../gel-schoolbook-manual-overrides-2026-2027.js');
assert.equal(practice.count,21);
assert.equal(practice.entries.length,dispositions.entries.length);
for(const d of dispositions.entries){
  const p=practice.get(d.subjectId,d.label);
  assert.equal(p?.sourceTopicId,d.sourceTopicId);
  assert.equal(p?.reviewStatus,d.reviewStatus);
  assert.equal(overrides.get(d.subjectId,d.label),null,'not an invented textbook source: '+d.label);
}
const study=readFileSync(new URL('../study.html',import.meta.url),'utf8');
assert.match(study,/id="gelPracticeTopicWrap"/);
assert.match(study,/gelPracticeTopicWrap[\s\S]*?secondaryGroundingNotice/);
assert.match(study,/window\.AITOOLSKIDS_GEL_PRACTICE_ONLY/);
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.goto('http://127.0.0.1:4173/study.html',{waitUntil:'domcontentloaded'});
  await page.selectOption('#zone','high');
  await page.selectOption('#grade','b');
  const ids=await page.locator('#subject option').evaluateAll(nodes=>nodes.map(n=>n.value));
  const target=ids.find(v=>v==='archaia-b-lykeiou'||/archaia.*b.*lykeiou/.test(v));
  assert.ok(target,'Ancient B GEL subject is absent from the catalog: '+ids.join(','));
  await page.selectOption('#subject',target);
  assert.equal(await page.locator('#gelPracticeTopicWrap').isVisible(),true);
  assert.equal(await page.locator('#customTopicFields').isVisible(),false,'unverified free-form input must stay hidden in official GEL mode');
  const label='Αδίδακτο πεζό κείμενο αττικής διαλέκτου';
  await page.selectOption('#gelPracticeTopic',{label});
  assert.equal(await page.locator('#topicPick').inputValue(),'');
  assert.equal(await page.locator('#topicCustom').inputValue(),label);
  const descriptions=await page.locator('#gelPracticeTopicWrap p').textContent();
  assert.match(descriptions,/δεν|Δεν/);
  await page.locator('#notesPaste').fill('Αυτό είναι το πραγματικό κείμενο του μαθητή για την εξάσκηση.');
  await page.locator('#usePastedNotes').click();
  assert.equal(await page.locator('#sourceModeNotice').isVisible(),true,'learner notes are the source');
  await page.selectOption('#grade','a');
  assert.equal(await page.locator('#gelPracticeTopicWrap').isVisible(),false,'no A Ancient broad practice entries remaining');
  console.log('PHASE37_GEL_21_PRACTICE_ONLY_ACCESSIBLE_AND_NOT_GROUNDED_OK');
  await page.close();
}finally{await browser.close();}
