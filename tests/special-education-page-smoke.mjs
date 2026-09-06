import { chromium } from 'playwright';

const base = 'http://127.0.0.1:4173/special-education.html';
const browser = await chromium.launch({ headless: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function check(viewport, label) {
  const page = await browser.newPage({ viewport });
  await page.goto(base, { waitUntil: 'networkidle' });

  assert((await page.title()).includes('Ειδική Εκπαίδευση'), `${label}: wrong page title`);
  await page.locator('[data-branch="eneegyl"]').click();
  await page.locator('#spEneegyl').waitFor({ state: 'visible' });

  assert(await page.locator('.sp-source-card').count() === 9, `${label}: expected 9 EN.E.E.GY.-L. source groups`);
  assert(await page.locator('[data-open-unit]').count() === 5, `${label}: expected 5 available verified learning units`);

  const noOverflowBefore = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
  assert(noOverflowBefore, `${label}: horizontal overflow in sector index`);

  await page.locator('[data-open-unit="eneegyl-b-health-nutrition"]').click();
  await page.locator('#spUnitMount .sp-unit').waitFor({ state: 'visible' });
  assert((await page.locator('#spUnitMount h3').innerText()).includes('Υγεία και Διατροφή'), `${label}: health unit did not open`);
  assert((await page.locator('#spUnitMount').innerText()).includes('Επαληθευμένη μερική κάλυψη'), `${label}: partial coverage label missing`);

  await page.locator('#spUnitMount summary', { hasText: 'Διαγνωστικό' }).click();
  await page.locator('#spQuizStart').click();
  assert(await page.locator('#spQuiz .sp-option').count() === 2, `${label}: diagnostic did not render options`);

  await page.locator('[data-open-unit="eneegyl-b-mechanics-thermo-basics"]').click();
  assert((await page.locator('#spUnitMount h3').innerText()).includes('Θερμοδυναμικής'), `${label}: mechanics unit did not open`);

  await page.locator('[data-open-unit="eneegyl-b-structures-topography-basics"]').click();
  assert((await page.locator('#spUnitMount h3').innerText()).includes('Τοπογραφία'), `${label}: topography unit did not open`);

  await page.locator('[data-open-unit="eneegyl-b-agriculture-plant-basics"]').click();
  assert((await page.locator('#spUnitMount h3').innerText()).includes('Φυτική Παραγωγή'), `${label}: plant production unit did not open`);

  if (viewport.width <= 600) {
    const sourceButtons = await page.locator('.sp-source-actions .sp-btn').evaluateAll((els) => els.map((el) => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, width: r.width };
    }));
    assert(sourceButtons.every(r => r.left >= -1 && r.right <= viewport.width + 1 && r.width > 200), `${label}: source action button escapes mobile viewport`);
  }

  const noOverflowAfter = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
  assert(noOverflowAfter, `${label}: horizontal overflow after opening new units`);
  await page.close();
}

try {
  await check({ width: 1280, height: 900 }, 'desktop');
  await check({ width: 390, height: 844 }, 'mobile');
  console.log('Special Education page smoke passed on desktop and mobile.');
} finally {
  await browser.close();
}
