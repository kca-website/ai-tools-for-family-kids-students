import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try{
 for(const [device,width,height] of [['desktop',1366,850],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height}});
  let webCalls=0,sourceCalls=0,last=null;
  await page.route('**/api/teacher-assistant',async route=>{
    if(route.request().method()==='GET')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({configured:true,providers:[]})});
    last=route.request().postDataJSON();webCalls++;
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
      text:'## Σχέδιο μαθήματος\nΑπό πραγματικές διαδικτυακές πηγές.',provider:'mock',model:'mock',
      source:{kind:'web_research',annualScopeVerified:false,sources:[{title:'Πανεπιστημιακή πηγή',url:'https://university.example.edu/teaching'}]}})});
  });
  await page.route('**/api/schoolbook-source?**',async route=>{sourceCalls++;await route.fulfill({status:404,contentType:'application/json',body:JSON.stringify({grounded:false,error:'source_not_mapped'})})});
  await page.goto('http://127.0.0.1:4173/teacher-assistant.html',{waitUntil:'domcontentloaded'});
  await page.selectOption('#context','gel');
  await page.selectOption('#grade','b');
  const subject=await page.locator('#subject option').evaluateAll(a=>a.find(x=>x.textContent.includes('Βιολογία'))?.value||'');
  assert.ok(subject);await page.selectOption('#subject',subject);
  await page.locator('#groqBtn').click();
  await page.waitForFunction(()=>document.querySelector('#teacherOnlineFallback')?.hidden===false);
  assert.equal(webCalls,0,device+': no search without approval');
  assert.equal(sourceCalls,1);
  await page.locator('#teacherOnlineDecline').click();
  assert.equal(await page.locator('#teacherOnlineFallback').isHidden(),true);
  assert.equal(webCalls,0);
  await page.locator('#groqBtn').click();
  await page.waitForFunction(()=>document.querySelector('#teacherOnlineFallback')?.hidden===false);
  await page.locator('#teacherOnlineAccept').click();
  await page.waitForFunction(()=>document.querySelector('#status')?.textContent==='Έτοιμο.');
  assert.equal(webCalls,1);
  assert.equal(last.sourceMode,'internet_search');
  assert.equal(last.webConsent,true);
  assert.equal(last.documentText,undefined);
  assert.equal(await page.locator('#teacherWebReferences').isVisible(),true);
  assert.equal(await page.locator('#teacherWebReferences a').count(),1);
  await page.selectOption('#unit','custom');
  await page.locator('#customUnit').fill('Νέα ενότητα για έρευνα');
  await page.locator('#groqBtn').click();
  await page.waitForFunction(()=>document.querySelector('#teacherOnlineFallback')?.hidden===false);
  assert.equal(webCalls,1,'consent must reset after chapter change');
  console.log('PHASE41_TEACHER_WEB_OPTIN_UI_OK',device);
  await page.close();
 }
}finally{await browser.close();}
