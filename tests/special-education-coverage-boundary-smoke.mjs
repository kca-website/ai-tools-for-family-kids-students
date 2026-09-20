import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});

try{
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});

  await page.goto(`${BASE}/special-education.html`,{waitUntil:'networkidle'});

  // Special Gymnasium: exact annual mapping and framework mapping must remain distinct.
  await page.locator('[data-branch="special-gymnasium"]').click();
  await page.locator('#spSpecialGymnasium').waitFor({state:'visible'});
  const biology=page.locator('#spSpecialGymProfile [data-sg-subject="biology"]');
  const homeEconomics=page.locator('#spSpecialGymProfile [data-sg-subject="home-economics"]');
  const skillsA=page.locator('#spSpecialGymProfile [data-sg-subject="skills-labs"]');
  assert.match(await biology.innerText(),/Ύλη 2026–27/);
  assert.match(await homeEconomics.innerText(),/Επίσημο πλαίσιο 2026–27/);
  assert.match(await homeEconomics.innerText(),/6 επίσημες επιλογές πλαισίου/);
  assert.match(await skillsA.innerText(),/4 επίσημες επιλογές πλαισίου/);

  for(const grade of ['b','c']){
    await page.locator(`[data-sg-grade="${grade}"]`).click();
    const skills=page.locator('#spSpecialGymProfile [data-sg-subject="skills-labs"]');
    assert.match(await skills.innerText(),/Επίσημο πλαίσιο 2026–27/);
    assert.equal(await page.locator('#spSpecialGymProfile [data-sg-subject="home-economics"]').count(),0);
  }

  // ENEEGYL: every visible structure card must carry an explicit coverage class.
  await page.locator('#spSpecialGymnasium .sp-back').click();
  await page.locator('[data-branch="eneegyl"]').click();
  await page.locator('#spEneegyl').waitFor({state:'visible'});
  for(const grade of ['gym-a','gym-b','gym-c','gym-d','lyc-a','lyc-b','lyc-c','lyc-d']){
    await page.locator(`[data-en-grade="${grade}"]`).click();
    const cards=page.locator('#spEneegylProfile [data-en-structure-subject]');
    const count=await cards.count();
    assert.ok(count>0,`${grade}: no ENEEGYL structure cards`);
    const classes=await cards.evaluateAll(nodes=>nodes.map(n=>n.dataset.coverage||''));
    assert.ok(classes.every(x=>['exact','partial','support','structure'].includes(x)),`${grade}: unclassified coverage card: ${classes.join(',')}`);
    const badges=await cards.locator('.sp-ready-pill').allTextContents();
    assert.equal(badges.length,count,`${grade}: every ENEEGYL structure card needs a coverage/readiness badge`);
  }

  // A Lyceum ENEEGYL: current official course guidance must not collapse into generic structure.
  await page.locator('[data-en-grade="lyc-a"]').click();
  const economyA=page.locator('#spEneegylProfile [data-en-structure-subject="economics"]');
  assert.equal(await economyA.getAttribute('data-coverage'),'exact','A ENEEGYL Principles of Economics has encoded current 2026-27 chapters');
  assert.match(await economyA.innerText(),/Ύλη 2026–27/);
  const drawingA=page.locator('#spEneegylProfile [data-en-structure-subject="architectural-drawing"]');
  assert.equal(await drawingA.getAttribute('data-coverage'),'partial','A ENEEGYL Architectural Drawing is verified as a current course but exact subunits are not encoded');
  assert.match(await drawingA.innerText(),/Μερική χαρτογράφηση/);

  // Special Lyceum: structure and source-index state must not be described as exact section mapping.
  await page.locator('#spEneegyl .sp-back').click();
  await page.locator('[data-branch="special-lyceum"]').click();
  await page.locator('#spSpecialLyceum').waitFor({state:'visible'});
  const sl=await page.locator('#spSpecialLyceumProfile').innerText();
  assert.match(sl,/Επίσημη δομή/);
  assert.match(sl,/section-level/);
  assert.doesNotMatch(sl,/πλήρης.*section-level.*χαρτογράφηση/i);

  assert.deepEqual(errors,[]);
  console.log('Special Education coverage boundary smoke passed: exact/framework/partial/support/structure remain distinct.');
} finally {
  await browser.close();
}
