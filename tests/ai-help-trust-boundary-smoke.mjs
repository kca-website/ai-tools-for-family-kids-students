import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL = 'http://127.0.0.1:4173/';

async function setTutorAge(page, value) {
  await page.evaluate((nextValue) => {
    const age = document.getElementById('tutorAge');
    if (!age) throw new Error('Missing #tutorAge');
    age.value = nextValue;
    age.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function setTutorConsent(page, checked) {
  await page.evaluate((nextChecked) => {
    const consent = document.getElementById('tutorConsent');
    if (!consent) throw new Error('Missing #tutorConsent');
    consent.checked = nextChecked;
    consent.dispatchEvent(new Event('change', { bubbles: true }));
  }, checked);
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));

  await page.route('**/_vercel/insights/script.js', (route) => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: '',
  }));

  await page.goto(LOCAL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => window.AITOOLSKIDS_SPECIAL_EDUCATION_LAZY_RUNTIME?.aiHelpTrustBoundary === true, null, { timeout: 10000 });

  // Homepage keeps the school-zone mental model; age gating happens inside AI Help.
  await page.waitForFunction(() => document.querySelector('[data-i18n="heroHelpMiddle"]')?.textContent?.trim() === 'Γυμνάσιο');
  assert.equal((await page.textContent('[data-i18n="heroHelpMiddle"]'))?.trim(), 'Γυμνάσιο');

  // The disclosure script is not part of normal page/tutor startup.
  assert.equal(await page.locator('script[src="/ai-help-trust-boundary.js"]').count(), 0, 'Trust disclosure should be lazy before sign-in');

  // Render middle-school student AI Help and choose an allowed age.
  await page.waitForFunction(() => window.AITutor?.render && document.getElementById('tutorMount'), null, { timeout: 30000 });
  await page.evaluate(() => {
    history.replaceState({}, '', '/middle/student/tutor');
    const tutorView = document.getElementById('tutorView');
    if (tutorView) tutorView.hidden = false;
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.AITutor.render({ zoneId: 'middle', roleId: 'student', lang: 'el' });
  });
  await page.waitForSelector('#tutorAge');
  // Mobile Compact keeps settings collapsed; change the underlying control directly
  // so this test verifies trust behavior without depending on mobile layout state.
  await setTutorAge(page, '15');

  // First sign-in click lazy-loads the disclosure, which must appear before Puter.
  await page.click('#tutorSignIn');
  await page.waitForFunction(() => window.AITOOLSKIDS_AI_HELP_TRUST_BOUNDARY?.disclosureBeforePuter === true, null, { timeout: 10000 });
  await page.waitForSelector('#aiHelpTrustBoundary:not([hidden])');
  assert.equal(await page.locator('script[src="https://js.puter.com/v2/"]').count(), 0, 'Puter loaded before disclosure acceptance');
  const disclosureText = await page.textContent('#aiHelpTrustBoundary');
  assert.match(disclosureText || '', /Πριν ανοίξει το Puter/);
  assert.match(disclosureText || '', /δεν αποθηκεύει μηνύματα ή ηχογραφήσεις/);

  // Cancel keeps Puter unloaded.
  await page.click('[data-ai-help-boundary-cancel]');
  assert.equal(await page.locator('#aiHelpTrustBoundary:not([hidden])').count(), 0);
  assert.equal(await page.locator('script[src="https://js.puter.com/v2/"]').count(), 0, 'Puter loaded after disclosure cancel');

  // Ages 13–14 get the extra transparency note after the existing consent gate.
  await setTutorAge(page, '13-14');
  await setTutorConsent(page, true);
  await page.click('#tutorSignIn');
  await page.waitForSelector('#aiHelpTrustBoundary:not([hidden])');
  const minorNote = await page.textContent('.ai-help-boundary__minor');
  assert.match(minorNote || '', /δεν αποτελεί τεχνική επαλήθευση ταυτότητας ή ηλικίας/);
  await page.click('[data-ai-help-boundary-cancel]');

  // Language switching keeps the neutral school-zone label without loading disclosure code.
  await page.goto(LOCAL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => window.AITOOLSKIDS_SPECIAL_EDUCATION_LAZY_RUNTIME?.aiHelpTrustBoundary === true, null, { timeout: 10000 });
  await page.click('#langEn');
  await page.waitForFunction(() => document.querySelector('[data-i18n="heroHelpMiddle"]')?.textContent?.trim() === 'Middle School');
  assert.equal((await page.textContent('[data-i18n="heroHelpMiddle"]'))?.trim(), 'Middle School');
  assert.equal(await page.locator('script[src="/ai-help-trust-boundary.js"]').count(), 0, 'Language switch should not load disclosure code');

  assert.deepEqual(errors, [], errors.join('\n'));
  console.log('AI Help trust-boundary smoke checks passed.');
} finally {
  await browser.close();
}
