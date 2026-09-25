import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL = 'http://127.0.0.1:4173';

async function openPath(page, path) {
  await page.goto(`${LOCAL}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#zoneGrid', { timeout: 30000 });
  await page.evaluate((route) => {
    history.replaceState({}, '', route);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, path);
  await page.waitForSelector('#subjectFilter .subject-chip', { state: 'visible', timeout: 30000 });
}

async function choose(page, subjectLabel, needLabel) {
  const subject = page.locator('#subjectFilter .subject-chip', { hasText: subjectLabel }).first();
  await subject.evaluate((el) => el.click());
  await page.waitForSelector('#needFilter .need-chip', { timeout: 10000 });
  const need = page.locator('#needFilter .need-chip', { hasText: needLabel }).first();
  await need.evaluate((el) => el.click());
  await page.waitForTimeout(250);

  const hrefs = await page.locator('#toolGrid .tool-card__link').evaluateAll((links) =>
    links.map((a) => new URL(a.href).pathname)
  );
  if (!hrefs.length) {
    const diagnostics = await page.evaluate(() => ({
      path: location.pathname,
      subject: document.querySelector('#subjectFilter .subject-chip.active')?.textContent?.trim() || '',
      need: document.querySelector('#needFilter .need-chip.active')?.textContent?.trim() || '',
      intro: document.getElementById('pathIntro')?.textContent?.trim() || '',
      grid: document.getElementById('toolGrid')?.textContent?.trim() || '',
    }));
    throw new Error(`No tool cards after selection: ${JSON.stringify(diagnostics)}`);
  }
  return hrefs;
}

const browser = await chromium.launch({ headless: true });
try {
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await openPath(page, '/primary/student/tools');
    const genericHrefs = await page.locator('#toolGrid .tool-card__link').evaluateAll((links) =>
      links.map((a) => new URL(a.href).pathname)
    );
    assert.equal(genericHrefs.includes('/tools/photomath.html'), false,
      'Primary student generic list must not expose 13+ Photomath');
    const hrefs = await choose(page, 'Μαθηματικά', 'Να ελέγξω λύση');
    assert.deepEqual(hrefs, ['/tools/ai-help.html', '/tools/gemini-education.html'],
      'Primary Math/check should fall back to age-appropriate learning-first tools after 13+ math solvers are filtered out');
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await openPath(page, '/primary/student/tools');
    const hrefs = await choose(page, 'Γλώσσα', 'Να εξασκηθώ');
    assert.deepEqual(hrefs.slice(0, 2), [
      '/tools/reading-coach.html',
      '/tools/ai-help.html',
    ], 'Primary Language/practice should prioritise Reading Coach then guided AI Help');
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await openPath(page, '/middle/student/tools');
    let hrefs = await choose(page, 'Ξένη Γλώσσα', 'Να εξασκηθώ');
    assert.deepEqual(hrefs.slice(0, 3), [
      '/tools/duolingo.html',
      '/tools/reading-coach.html',
      '/tools/ai-help.html',
    ], 'Age 12 Middle School must default to tools valid for a 12-year-old');
    assert.equal(hrefs.includes('/tools/quizlet.html'), false, 'Age 12 must not see 13+ Quizlet');

    const age13 = page.locator('#studentAgeFilter [data-student-age="13"]');
    await age13.evaluate((el) => el.click());
    await page.waitForTimeout(150);
    hrefs = await page.locator('#toolGrid .tool-card__link').evaluateAll((links) =>
      links.map((a) => new URL(a.href).pathname)
    );
    assert.deepEqual(hrefs.slice(0, 5), [
      '/tools/duolingo.html',
      '/tools/reading-coach.html',
      '/tools/ai-help.html',
      '/tools/quizlet.html',
      '/tools/anki.html',
    ], 'Age 13 should unlock 13+ specialised revision tools without changing the subject/need');
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await openPath(page, '/high/student/tools');
    const age15 = page.locator('#studentAgeFilter [data-student-age="15"]');
    assert.equal(await age15.getAttribute('aria-pressed'), 'true', 'High School student path should default to age 15');
    const hrefs = await choose(page, 'Μαθηματικά', 'Να ελέγξω λύση');
    assert.deepEqual(hrefs.slice(0, 5), [
      '/tools/photomath.html',
      '/tools/symbolab.html',
      '/tools/wolfram-alpha.html',
      '/tools/geogebra.html',
      '/tools/digital-tutoring.html',
    ], 'High School Math/check must follow NEED_TOOL_MAP priority');
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await openPath(page, '/high/student/tools');
    const hrefs = await choose(page, 'Ιστορία', 'Να κάνω έρευνα');
    assert.deepEqual(hrefs.slice(0, 5), [
      '/tools/perplexity.html',
      '/tools/notebooklm.html',
      '/tools/google-arts-culture.html',
      '/tools/google-lens.html',
      '/tools/zotero.html',
    ], 'High School History/research must prioritise source-oriented tools');
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await openPath(page, '/primary/student/tools');
    let hrefs = await choose(page, 'Γλώσσα', 'Δυσκολεύομαι στην ανάγνωση / κατανόηση');
    assert.deepEqual(hrefs.slice(0, 3), [
      '/tools/immersive-reader.html',
      '/tools/reading-coach.html',
      '/tools/ai-help.html',
    ], 'Reading-support need should reuse curated support tools without a diagnostic label');

    hrefs = await choose(page, 'Μαθηματικά', 'Χρειάζομαι μικρά βήματα / καθαρή οργάνωση');
    assert.deepEqual(hrefs.slice(0, 2), [
      '/tools/ai-help.html',
      '/tools/immersive-reader.html',
    ], 'Step-by-step need should prioritise guided and low-clutter support');
    await page.close();
  }

  console.log('Learning-need tool priority smoke passed.');
} finally {
  await browser.close();
}
