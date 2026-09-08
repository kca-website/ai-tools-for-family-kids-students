import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});

try{
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
    const page=await browser.newPage({viewport});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});

    await page.goto(`${BASE}/classroom.html`,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForSelector('#teacherTools',{state:'visible'});
    assert.equal(await page.locator('#teacherTools .teacher-tool-card').count(),6,'Classroom must expose six teacher jobs');
    assert.equal(await page.locator('#teacherTools a[href^="/teacher-assistant.html?task="]').count(),6,'Every teacher job must expose our assistant as either primary or alternate route');
    assert.ok(await page.locator('#teacherTools a[href*="magicschool.ai/tools/rubric-generator"]').count(),'MagicSchool rubric recommendation missing');
    assert.ok(await page.locator('#teacherTools a[href*="briskteaching.com/give-feedback"]').count(),'Brisk feedback recommendation missing');
    assert.match(await page.locator('#teacherTools').innerText(),/Καρτέλα παρατήρησης/);
    assert.match(await page.locator('#teacherTools').innerText(),/κενό πρότυπο/i);
    assert.match(await page.locator('#teacherTools').innerText(),/μην εισάγεις ονοματεπώνυμα/i);

    await page.click('#langEn');
    await page.waitForFunction(()=>document.documentElement.lang==='en');
    assert.match(await page.locator('#teacherToolsTitle').innerText(),/What do you need to do today/);
    assert.match(await page.locator('#teacherTools').innerText(),/Observation template/);

    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    assert.ok(overflow<=1,`Classroom teacher navigator horizontal overflow: ${overflow}`);
    assert.deepEqual(errors,[],`Classroom browser errors: ${errors.join('\n')}`);
    await page.close();
  }

  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(`${BASE}/teacher-assistant.html?task=rubric`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('.task.active[data-task="rubric"]');
  assert.equal(await page.locator('script[src*="js.puter.com"]').count(),0,'Puter must not load before explicit consent/connect');
  assert.match(await page.locator('#recTitle').innerText(),/MagicSchool Rubric Generator/);
  assert.match(await page.locator('.privacy').innerText(),/Μην γράφεις ονοματεπώνυμα/);
  assert.equal(await page.evaluate(()=>localStorage.length),0,'Teacher assistant must not create localStorage history');
  assert.equal(await page.evaluate(()=>sessionStorage.length),0,'Teacher assistant must not create sessionStorage history');

  await page.click('#generateBtn');
  assert.equal(await page.locator('#disclosure').isVisible(),true,'Disconnected generation must open Puter disclosure instead of silently loading Puter');
  assert.equal(await page.locator('script[src*="js.puter.com"]').count(),0,'Opening disclosure alone must not load Puter');
  await page.click('#cancelConnect');

  await page.click('[data-task="observation"]');
  assert.match(await page.locator('#detailsHint').innerText(),/όχι στοιχεία συγκεκριμένου μαθητή/i);
  assert.match(await page.locator('#recText').innerText(),/κενό πρότυπο παρατήρησης/i);

  await page.click('#langEn');
  await page.waitForFunction(()=>document.documentElement.lang==='en');
  assert.match(await page.locator('h1').innerText(),/AI Teacher Assistant/);
  assert.match(await page.locator('.privacy').innerText(),/Do not enter student names/);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=1,`Teacher assistant mobile horizontal overflow: ${overflow}`);
  assert.deepEqual(errors,[],`Teacher assistant browser errors: ${errors.join('\n')}`);
  await page.close();

  console.log('Classroom teacher-job navigator + stateless AI Teacher Assistant smoke passed.');
}finally{
  await browser.close();
}
