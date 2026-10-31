import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../teacher-assistant.html',import.meta.url),'utf8');
assert.match(html,/id="teacherRealSourcePanel"/);
assert.match(html,/id="teacherOwnFile"/);
assert.match(html,/Δεν βρίσκω την ενότητά μου/);
const browser=await chromium.launch({headless:true});
const example='Η διδασκαλία αυτής της ενότητας περιλαμβάνει βασικές έννοιες και επαληθευμένο υλικό με επεξηγήσεις.';
try{
for(const [device,width,height] of [['desktop',1366,860],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height}});
 let sourceCalls=0,aiCalls=0,lastPayload=null;
 await page.route('**/api/schoolbook-source?**',async route=>{
   sourceCalls++;
   await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({grounded:true,text:example.repeat(10),sourceUrl:'https://ebooks.edu.gr/ebooks/v/html/test/chapter.html',bookTitle:'Δοκιμαστικό επίσημο βιβλίο',annualScopeVerified:false})});
 });
 await page.route('**/api/teacher-assistant',async route=>{
   if(route.request().method()==='GET')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({configured:true,providers:[]})});
   aiCalls++;lastPayload=route.request().postDataJSON();
   const source=lastPayload.sourceMode==='official_schoolbook'?{kind:'official_schoolbook',url:'https://ebooks.edu.gr/ebooks/v/html/test/chapter.html'}:{kind:'teacher_upload'};
   await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({text:'## Δοκιμαστικό φύλλο εργασίας\n\n1. Ερώτηση με τεκμηρίωση',provider:'mock',source,model:'test'})});
 });
 await page.goto('http://127.0.0.1:4173/teacher-assistant.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('#unit')?.options?.length>0);
 await page.selectOption('#context','gel');
 await page.selectOption('#grade','b');
 const biology=await page.locator('#subject option').evaluateAll(options=>options.find(x=>/Βιολογία/.test(x.textContent))?.value||'');
 assert.ok(biology,device+': Biology B teacher subject should exist');
 await page.selectOption('#subject',biology);
 assert.equal(await page.locator('#customUnitField').isHidden(),true,device+': mapped subject should show official unit picker');
 assert.ok(await page.locator('#unit option[value="custom"]').count()>0,device+': missing manual option');
 await page.locator('#groqBtn').click();
 await page.waitForFunction(()=>document.querySelector('#status')?.textContent==='Έτοιμο.');
 assert.equal(sourceCalls,1);
 assert.equal(aiCalls,1);
 assert.equal(lastPayload.sourceMode,'official_schoolbook');
 assert.ok(lastPayload.sourceSubjectId&&lastPayload.sourceTopic);
 assert.equal(lastPayload.documentText,undefined,'browser may not claim official extraction');
 await page.locator('#unit').selectOption('custom');
 assert.equal(await page.locator('#customUnitField').isVisible(),true);
 await page.locator('#customUnit').fill('Μία δική μου ενότητα');
 await page.locator('#groqBtn').click();
 await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('Για ενότητα εκτός χάρτη'));
 assert.equal(aiCalls,1,device+': no factual AI before supplying teacher text');
 await page.locator('#teacherOwnText').fill(example);
 await page.locator('#groqBtn').click();
 await page.waitForFunction(()=>document.querySelector('#status')?.textContent==='Έτοιμο.');
 assert.equal(aiCalls,2);
 assert.equal(lastPayload.sourceMode,'teacher_upload');
 assert.match(lastPayload.documentText,/Η διδασκαλία/);
 console.log('PHASE40_TEACHER_REAL_SOURCE_UI_OK',device);
 await page.close();
}
}finally{await browser.close();}
