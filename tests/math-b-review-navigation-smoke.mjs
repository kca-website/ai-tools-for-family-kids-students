import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const browser = await chromium.launch({headless:true});
try {
 for(const width of [390,1280]) {
  const page = await browser.newPage({viewport:{width,height:900}});
  await page.goto('http://127.0.0.1:4173/study.html');
  await page.selectOption('#zone','middle');
  await page.selectOption('#grade','b');
  const resolved = await page.evaluate(()=>window.AITOOLSKIDS_CURRICULUM_RESOLVER.getSubject('middle','b','mathimatika-b-gymnasiou'));
  assert.ok(resolved);
  const review=resolved.topics.filter(t=>t.labelEl.includes('μη εξεταστέο'));
  assert.equal(review.length,9);
  assert.ok(review.every(t=>t.sourceUrl.includes('Mathimatika_A-Gymnasiou_html-empl/indexA7_')));
  await page.selectOption('#subject',resolved.id);
  const options=await page.locator('#topicPick option').allTextContents();
  assert.equal(options.filter(t=>t.includes('μη εξεταστέο')).length,9);
  await page.close();
 }
} finally {await browser.close();}
console.log('Math B review navigation: nine non-examinable A-book choices on mobile and desktop');
