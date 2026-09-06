import { chromium } from 'playwright';

const base = 'http://127.0.0.1:4173/special-education.html';
const browser = await chromium.launch({ headless: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function runDiagnostic(page, root, expectedOptions, label) {
  await page.locator(`${root} summary`, { hasText: 'Διαγνωστικό' }).click();
  await page.locator(`${root} [data-sp-quiz-start]`).click();
  assert(await page.locator(`${root} .sp-option`).count() === expectedOptions, `${label}: diagnostic did not render expected options`);
}

async function check(viewport, label) {
  const page = await browser.newPage({ viewport });
  await page.goto(base, { waitUntil: 'networkidle' });

  assert((await page.title()).includes('Ειδική Εκπαίδευση'), `${label}: wrong page title`);

  await page.locator('[data-branch="special-gymnasium"]').click();
  await page.locator('#spSpecialGymnasium').waitFor({ state: 'visible' });
  const sgText=await page.locator('#spSpecialGymnasium').innerText();
  assert(sgText.includes('Επαληθευμένη δομή 2026-2027'), `${label}: Special Gymnasium verified-structure badge missing`);
  assert(sgText.includes('Α΄ Γυμνασίου') && sgText.includes('Β΄ Γυμνασίου') && sgText.includes('Γ΄ Γυμνασίου'), `${label}: Special Gymnasium grade structure missing`);
  assert(sgText.includes('34 ώρες/εβδομάδα'), `${label}: Special Gymnasium timetable total missing`);
  assert(await page.locator('[data-open-sg-unit]').count() === 2, `${label}: expected two detailed Special Gymnasium study routes`);

  await page.locator('[data-open-sg-unit="special-gym-a-language-comprehension"]').click();
  await page.locator('#spSpecialGymUnitMount .sp-unit').waitFor({ state: 'visible' });
  assert((await page.locator('#spSpecialGymUnitMount h3').innerText()).includes('Γλωσσική Διδασκαλία'), `${label}: Special Gymnasium language route did not open`);
  const sgUnitText=await page.locator('#spSpecialGymUnitMount').innerText();
  assert(sgUnitText.includes('όχι δήλωση ύλης') || sgUnitText.includes('όχι δήλωση διδακτέας ύλης'), `${label}: Special Gymnasium source boundary missing`);
  await runDiagnostic(page,'#spSpecialGymUnitMount',3,`${label} Special Gym language`);

  await page.locator('[data-open-sg-unit="special-gym-a-math-problem-reading"]').click();
  assert((await page.locator('#spSpecialGymUnitMount h3').innerText()).includes('Μαθηματικά'), `${label}: Special Gymnasium math route did not open`);
  await runDiagnostic(page,'#spSpecialGymUnitMount',3,`${label} Special Gym math`);

  let noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
  assert(noOverflow, `${label}: horizontal overflow in Special Gymnasium route`);

  await page.locator('#spSpecialGymnasium .sp-back').click();
  await page.locator('#spHome').waitFor({state:'visible'});
  await page.locator('[data-branch="eneegyl"]').click();
  await page.locator('#spEneegyl').waitFor({ state: 'visible' });

  assert(await page.locator('.sp-source-card').count() === 9, `${label}: expected 9 EN.E.E.GY.-L. source groups`);
  assert(await page.locator('[data-open-unit]').count() === 6, `${label}: expected 6 available verified EN.E.E.GY.-L. learning units`);

  const noOverflowBefore = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
  assert(noOverflowBefore, `${label}: horizontal overflow in sector index`);

  await page.locator('[data-open-unit="eneegyl-b-health-nutrition"]').click();
  await page.locator('#spUnitMount .sp-unit').waitFor({ state: 'visible' });
  assert((await page.locator('#spUnitMount h3').innerText()).includes('Υγεία και Διατροφή'), `${label}: health unit did not open`);
  assert((await page.locator('#spUnitMount').innerText()).includes('Επαληθευμένη μερική κάλυψη'), `${label}: partial coverage label missing`);
  await runDiagnostic(page,'#spUnitMount',2,`${label} health`);

  await page.locator('[data-open-unit="eneegyl-b-mechanics-thermo-basics"]').click();
  assert((await page.locator('#spUnitMount h3').innerText()).includes('Θερμοδυναμικής'), `${label}: mechanics unit did not open`);

  await page.locator('[data-open-unit="eneegyl-b-structures-topography-basics"]').click();
  assert((await page.locator('#spUnitMount h3').innerText()).includes('Τοπογραφία'), `${label}: topography unit did not open`);

  await page.locator('[data-open-unit="eneegyl-b-agriculture-plant-basics"]').click();
  assert((await page.locator('#spUnitMount h3').innerText()).includes('Φυτική Παραγωγή'), `${label}: plant production unit did not open`);

  await page.locator('[data-open-unit="eneegyl-b-economy-accounting-basics"]').click();
  assert((await page.locator('#spUnitMount h3').innerText()).includes('Αρχές Λογιστικής'), `${label}: accounting unit did not open`);
  assert((await page.locator('#spUnitMount').innerText()).includes('Ενεργητικό'), `${label}: accounting learning content missing`);
  await runDiagnostic(page,'#spUnitMount',2,`${label} accounting`);

  if (viewport.width <= 600) {
    const sourceButtons = await page.locator('.sp-source-actions .sp-btn').evaluateAll((els) => els.map((el) => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, width: r.width };
    }));
    assert(sourceButtons.every(r => r.left >= -1 && r.right <= viewport.width + 1 && r.width > 200), `${label}: source action button escapes mobile viewport`);
  }

  const noOverflowAfter = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
  assert(noOverflowAfter, `${label}: horizontal overflow after opening verified units`);
  await page.close();
}

try {
  await check({ width: 1280, height: 900 }, 'desktop');
  await check({ width: 390, height: 844 }, 'mobile');
  console.log('Special Education page smoke passed on desktop and mobile.');
} finally {
  await browser.close();
}
