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
    const hrefs = await choose(page, 'Μαθηματικά', 'Να ελέγξω λύση');
    assert.deepEqual(hrefs, ['/tools/photomath.html'],
      'Primary Math/check should keep only the age-appropriate top-fit tool');
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await openPath(page, '/high/student/tools');
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

  console.log('Learning-need tool priority smoke passed.');
} finally {
  await browser.close();
}
