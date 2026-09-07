import { chromium } from 'playwright';

const LOCAL = 'http://127.0.0.1:4173';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  let response = await page.goto(`${LOCAL}/methodology.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  assert(response?.ok(), `methodology.html returned ${response?.status()}`);
  await page.waitForSelector('h1[data-lang="el"]');

  const methodEl = await page.locator('body').innerText();
  assert(methodEl.includes('Τι σημαίνουν τα «Στοιχεία εργαλείου»'), 'Missing Tool Nutrition Labels methodology section');
  assert(methodEl.includes('32 εργαλεία'), 'Missing 32-tool accessibility research scope');
  assert(methodEl.includes('12 τεκμηριωμένα θετικά'), 'Missing positive accessibility count');
  assert(methodEl.includes('11 μερικά/μεικτά'), 'Missing partial accessibility count');
  assert(methodEl.includes('1 τεκμηριωμένη ανησυχία'), 'Missing caution accessibility count');
  assert(methodEl.includes('8 χωρίς εντοπίσιμη πηγή'), 'Missing no-source accessibility count');
  assert(methodEl.includes('δεν εντοπίστηκε τεκμηριωμένη υποστήριξη Ελληνικής Νοηματικής Γλώσσας'), 'Missing careful ENG finding wording');
  assert(methodEl.includes('δεν αποτελεί πλήρη έλεγχο απορρήτου'), 'Missing account-label privacy limitation');
  assert((await page.locator('a[href="/accessibility.html"]').count()) >= 1, 'Methodology does not link to accessibility research');

  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(horizontalOverflow <= 2, `Methodology has mobile horizontal overflow: ${horizontalOverflow}px`);

  await page.click('#en');
  assert((await page.locator('html').getAttribute('lang')) === 'en', 'Methodology language switch did not set html lang=en');
  assert(await page.locator('h1[data-lang="en"]').isVisible(), 'English methodology heading not visible');
  const methodEn = await page.locator('body').innerText();
  assert(methodEn.includes('What the Tool Nutrition Labels mean'), 'English Tool Nutrition Labels methodology missing');
  assert(methodEn.includes('32 tools'), 'English 32-tool research scope missing');
  assert(methodEn.includes('we found no documentation'), 'English ENG limitation wording missing');

  response = await page.goto(`${LOCAL}/accessibility.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  assert(response?.ok(), `accessibility.html returned ${response?.status()}`);
  await page.waitForSelector('#a11yTableBody tr');
  await page.waitForFunction(() => document.querySelectorAll('#a11yTableBody tr').length >= 32, null, { timeout: 30000 });

  const accessibilityText = await page.locator('body').innerText();
  assert(accessibilityText.includes('Κύριο εύρημα: Ελληνική Νοηματική Γλώσσα (ΕΝΓ)'), 'Accessibility page missing ENG finding heading');
  assert(accessibilityText.includes('δεν εντοπίστηκε τεκμηριωμένη υποστήριξη Ελληνικής Νοηματικής Γλώσσας'), 'Accessibility page missing careful ENG finding');
  assert(accessibilityText.includes('απουσία τεκμηρίωσης που εντοπίσαμε'), 'Accessibility page missing evidence limitation');
  assert(!accessibilityText.includes('κανένα εργαλείο δεν υποστηρίζει ΕΝΓ'), 'Accessibility page overclaims absence of ENG support');
  assert((await page.locator('[data-eng-finding="32-tools"]').count()) === 1, 'Missing structured ENG finding marker');
  assert((await page.locator('a[href="/methodology.html"]').count()) >= 1, 'Accessibility page does not link to methodology');

  const rowCount = await page.locator('#a11yTableBody tr').count();
  assert(rowCount === 32, `Expected 32 documented accessibility rows, got ${rowCount}`);

  if (pageErrors.length) {
    throw new Error(`Page errors during methodology/ENG smoke:\n${pageErrors.join('\n')}`);
  }

  console.log('Methodology + ENG finding smoke: PASS');
  console.log(`accessibilityRows=${rowCount}`);
  console.log('mobileOverflow=PASS languageToggle=PASS crossLinks=PASS carefulWording=PASS');
} finally {
  await browser.close();
}
