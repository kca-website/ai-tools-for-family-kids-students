import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const URL='http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});

const tutorApi=readFileSync('api/tutor-assistant.js','utf8');
const teacherApi=readFileSync('api/teacher-assistant.js','utf8');
const teacherSource=readFileSync('teacher-assistant.html','utf8');
const schoolAiSource=readFileSync('school-ai-use.html','utf8');
const licenseSource=readFileSync('LICENSE','utf8');
const aboutSource=readFileSync('about.html','utf8');
assert.match(tutorApi,/provider_limit/,'Tutor API must expose an explicit provider-limit state');
assert.match(teacherApi,/provider_limit/,'Teacher API must expose an explicit provider-limit state');
assert.match(teacherSource,/params\.set\('classroom','1'\)/,'Teacher deep links must enable classroom mode');
assert.match(teacherSource,/φωνητικά δείγματα/,'Teacher privacy details must explicitly cover voice samples');
assert.match(schoolAiSource,/55909\/Δ6\/2026/,'School AI page must cite the 2026 joint ministerial decision');
assert.match(schoolAiSource,/ΦΕΚ Β[΄']?\s*2639\/12\.05\.2026/,'School AI page must identify the Gazette issue');
assert.match(schoolAiSource,/Υ\.ΠΑΙ\.Θ\.Α\.[\s\S]{0,180}DPIA|DPIA[\s\S]{0,180}Υ\.ΠΑΙ\.Θ\.Α\./,'School AI page must attribute the DPIA obligation to the Ministry');
assert.match(licenseSource,/All rights reserved/i,'Repository must have an explicit protective LICENSE');
assert.match(aboutSource,/Cloudflare Workers AI[\s\S]{0,160}Groq/,'About page must describe Cloudflare before Groq');
assert.match(teacherSource,/classActivityLiveAi/,'Classroom QR must expose an explicit live-AI opt-in');

try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));

  await page.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>document.documentElement.classList.contains('navigator-home-ready'),null,{timeout:15000});
  const visibleAiPromo=await page.locator('.hero__ai-help-copy').innerText();
  assert.doesNotMatch(visibleAiPromo,/GPT-OSS|Groq|Cloudflare Workers AI/,'Homepage must keep provider jargon collapsed by default');
  assert.equal(await page.locator('#homeAiTechDetails[open]').count(),0,'Homepage AI technical details must start collapsed');
  await page.locator('#homeAiTechDetails summary').click();
  assert.match(await page.locator('#homeAiTechDetails').innerText(),/GPT-OSS 120B[\s\S]*Cloudflare Workers AI[\s\S]*Groq/,'AI details must reveal the model/provider chain on demand');
  await page.locator('#homeAiTechDetails summary').click();
  await page.locator('.zone-card[data-zone="primary"]').click();
  await page.waitForSelector('#pathView:not([hidden])',{timeout:10000});
  await page.waitForSelector('#greekFilterWrap:not([hidden])',{timeout:10000});
  const before=await page.locator('#toolGrid .tool-card').count();
  assert.ok(before>0,'Primary tools should render before filtering');
  await page.check('#greekFilterToggle');
  await page.waitForTimeout(100);
  const after=await page.locator('#toolGrid .tool-card').count();
  assert.ok(after>0&&after<=before,'Greek filter should keep a non-empty verified subset');
  const greekBadges=await page.locator('#toolGrid .tool-card__greek-support').allTextContents();
  assert.ok(greekBadges.length===after,'Every filtered tool must expose its Greek-support badge');
  assert.ok(greekBadges.every(t=>/Ελληνικά:\s*Ναι/.test(t)),`Greek filter leaked non-verified cards: ${greekBadges.join(' | ')}`);

  await page.goto(URL+'about.html',{waitUntil:'domcontentloaded',timeout:30000});
  const faq=page.locator('details');
  assert.equal(await faq.count(),6,'About/FAQ must keep six compact disclosures');
  assert.equal(await page.locator('details[open]').count(),0,'FAQ disclosures must start collapsed');

  await page.goto(URL+'teacher-assistant.html',{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(await page.locator('#teacherAiProviderDetails[open]').count(),0,'Teacher provider details must start collapsed');
  assert.doesNotMatch(await page.locator('.provider.groq').innerText(),/Cloudflare Workers AI|GPT-OSS 120B|Groq\s*\+/,'Teacher primary generation card must keep provider jargon collapsed');
  assert.equal(await page.locator('#classActivityLiveAi').isChecked(),false,'Classroom QR must default to static/no-live-AI');
  const staticLink=await page.evaluate(()=>tutorDeepLink());
  assert.match(staticLink,/([?&])ai=0(&|$)/,'Default classroom deep link must disable live AI');
  await page.check('#classActivityLiveAi');
  const liveLink=await page.evaluate(()=>tutorDeepLink());
  assert.match(liveLink,/([?&])ai=1(&|$)/,'Teacher opt-in must enable live AI in the classroom deep link');
  const schoolRules=page.locator('.privacy details');
  assert.equal(await schoolRules.count(),1,'Teacher school rules disclosure missing');
  assert.equal(await schoolRules.getAttribute('open'),null,'Teacher school rules must start collapsed');
  assert.match(await page.locator('.privacy').innerText(),/Μην εισάγεις ονοματεπώνυμα/);

  await page.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITutor?.render,{timeout:15000});
  await page.goto(URL+'school-ai-use.html',{waitUntil:'domcontentloaded',timeout:30000});
  assert.match(await page.locator('h1').innerText(),/Χρήση AI στο σχολείο/);
  assert.match(await page.locator('body').innerText(),/55909\/Δ6\/2026/);

  await page.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITutor?.render,{timeout:15000});
  await page.evaluate(()=>{
    history.replaceState({},'','/high/student/tutor?classroom=1&activity=1&ai=0&minutes=15&finalCheck=1');
    window.dispatchEvent(new PopStateEvent('popstate'));
    document.getElementById('tutorView')?.removeAttribute('hidden');
    window.AITutor.render({zoneId:'high',roleId:'student',lang:'el'});
  });
  await page.waitForSelector('#tutorMic',{state:'attached',timeout:10000});
  assert.equal(await page.locator('#tutorForm').isHidden(),true,'Static classroom activity must hide the live AI composer');
  assert.equal(await page.locator('.tutor-auth-card').isHidden(),true,'Static classroom activity must hide provider choices');
  assert.match(await page.locator('.tutor-class-activity--static').innerText(),/χωρίς live AI/i,'Static classroom activity must explain that live AI is off');
  assert.equal(await page.locator('#tutorMic').isHidden(),true,'Classroom tutor must hide microphone input');
  assert.match(await page.locator('.tutor-voice-hint').innerText(),/Λειτουργία τάξης/);
  assert.equal(await page.locator('.tutor-privacy-details[open]').count(),0,'Tutor privacy details must start collapsed');

  assert.deepEqual(errors,[],`Stabilization release browser errors:\n${errors.join('\n')}`);
  console.log('Stabilization release smoke passed.');
}finally{
  await browser.close();
}
