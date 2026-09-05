import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL = 'http://127.0.0.1:4173/';
const PROD = 'https://www.aitools4kids.gr/';

const contexts = [
  { zoneId: 'primary', roleId: 'guardian' },
  { zoneId: 'primary', roleId: 'student' },
  { zoneId: 'middle', roleId: 'guardian' },
  { zoneId: 'middle', roleId: 'student' },
  { zoneId: 'high', roleId: 'guardian' },
  { zoneId: 'high', roleId: 'student' },
];

function pickStyle(cs) {
  return {
    display: cs.display,
    position: cs.position,
    padding: cs.padding,
    margin: cs.margin,
    gap: cs.gap,
    fontSize: cs.fontSize,
    lineHeight: cs.lineHeight,
    borderRadius: cs.borderRadius,
    minHeight: cs.minHeight,
    maxHeight: cs.maxHeight,
    gridTemplateColumns: cs.gridTemplateColumns,
  };
}

async function prepare(page, baseUrl, viewport, lang = 'el') {
  await page.setViewportSize(viewport);
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => window.AITutor?.render && document.getElementById('tutorMount'), null, { timeout: 30000 });
  await page.waitForTimeout(300);
  await page.evaluate((langValue) => {
    document.documentElement.lang = langValue;
    const el = document.getElementById('langEl');
    const en = document.getElementById('langEn');
    if (el && en) {
      el.classList.toggle('active', langValue === 'el');
      en.classList.toggle('active', langValue === 'en');
    }
  }, lang);
}

async function renderContext(page, context, lang = 'el') {
  await page.evaluate(({ contextValue, langValue }) => {
    history.replaceState({}, '', `/${contextValue.zoneId}/${contextValue.roleId}/tutor`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.AITutor.render({ ...contextValue, lang: langValue });
  }, { contextValue: context, langValue: lang });

  await page.waitForSelector('#tutorMount .tutor-chat', { timeout: 10000 });
  await page.waitForSelector('#tutorMount .tutor-flashcards', { timeout: 10000 });
  await page.waitForSelector('#tutorMount .tutor-study-tools', { timeout: 10000 });
  await page.waitForTimeout(120);
}

async function snapshot(page) {
  return page.evaluate(() => {
    const chat = document.querySelector('#tutorMount .tutor-chat');
    const flash = chat?.querySelector('.tutor-flashcards');
    const study = chat?.querySelector('.tutor-study-tools');
    const composer = chat?.querySelector('.tutor-composer');
    const mobileToggle = document.querySelector('#tutorMount .tutor-mobile-settings-toggle');
    const mobileAction = mobileToggle?.querySelector('.tutor-mobile-settings-action');
    const settings = document.querySelector('#tutorMount .tutor-settings');

    const styleOf = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        display: cs.display,
        position: cs.position,
        padding: cs.padding,
        margin: cs.margin,
        gap: cs.gap,
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        borderRadius: cs.borderRadius,
        minHeight: cs.minHeight,
        maxHeight: cs.maxHeight,
        gridTemplateColumns: cs.gridTemplateColumns,
      };
    };

    const directChildren = chat ? [...chat.children].map((el) => el.className || el.id || el.tagName) : [];
    const indexOf = (el) => el && chat ? [...chat.children].indexOf(el) : -1;

    return {
      directChildren,
      composerIndex: indexOf(composer),
      flashIndex: indexOf(flash),
      studyIndex: indexOf(study),
      flashCount: document.querySelectorAll('#tutorMount .tutor-flashcards').length,
      studyCount: document.querySelectorAll('#tutorMount .tutor-study-tools').length,
      mobileToggle: !!mobileToggle,
      mobileActionText: mobileAction?.textContent?.trim() || '',
      settingsOpen: !!settings?.classList.contains('mobile-settings-open'),
      bodyTutorMobileActive: document.body.classList.contains('tutor-mobile-active'),
      styles: {
        heading: styleOf('#tutorMount .tutor-heading'),
        settings: styleOf('#tutorMount .tutor-settings'),
        chat: styleOf('#tutorMount .tutor-chat'),
        messages: styleOf('#tutorMount .tutor-messages'),
        composerText: styleOf('#tutorMount .tutor-composer textarea'),
        flashcards: styleOf('#tutorMount .tutor-flashcards'),
        studyTools: styleOf('#tutorMount .tutor-study-tools'),
        mobileToggle: styleOf('#tutorMount .tutor-mobile-settings-toggle'),
      },
    };
  });
}

async function runStructuralMatrix(page, baseUrl, viewport, lang = 'el') {
  const errors = [];
  const failedSameOrigin = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
  page.on('response', (resp) => {
    try {
      const u = new URL(resp.url());
      const base = new URL(baseUrl);
      if (u.origin === base.origin && resp.status() >= 400) failedSameOrigin.push(`${resp.status()} ${u.pathname}`);
    } catch {}
  });

  await prepare(page, baseUrl, viewport, lang);
  const results = {};
  for (const context of contexts) {
    await renderContext(page, context, lang);
    let snap = await snapshot(page);
    assert.equal(snap.flashCount, 1, `${baseUrl} ${context.zoneId}/${context.roleId}: duplicate/missing flashcards`);
    assert.equal(snap.studyCount, 1, `${baseUrl} ${context.zoneId}/${context.roleId}: duplicate/missing study tools`);
    assert.ok(snap.composerIndex >= 0 && snap.flashIndex > snap.composerIndex && snap.studyIndex > snap.flashIndex,
      `${baseUrl} ${context.zoneId}/${context.roleId}: study tool ordering changed`);

    // Re-render the same context: extensions must remain idempotent.
    await page.evaluate((ctx) => window.AITutor.render({ ...ctx, lang: document.documentElement.lang.startsWith('en') ? 'en' : 'el' }), context);
    await page.waitForTimeout(80);
    snap = await snapshot(page);
    assert.equal(snap.flashCount, 1, `${baseUrl} ${context.zoneId}/${context.roleId}: flashcards duplicate after rerender`);
    assert.equal(snap.studyCount, 1, `${baseUrl} ${context.zoneId}/${context.roleId}: study tools duplicate after rerender`);
    results[`${context.zoneId}/${context.roleId}`] = snap;
  }

  return { results, errors, failedSameOrigin };
}

async function mobileInteractionSnapshot(page, baseUrl, lang) {
  await prepare(page, baseUrl, { width: 390, height: 844 }, lang);
  await renderContext(page, { zoneId: 'middle', roleId: 'student' }, lang);

  const before = await snapshot(page);
  assert.equal(before.mobileToggle, true, `${baseUrl}: mobile settings toggle missing`);
  assert.equal(before.bodyTutorMobileActive, true, `${baseUrl}: mobile tutor route class missing`);

  await page.selectOption('#tutorAge', '15');
  await page.waitForTimeout(120);
  const afterAge = await snapshot(page);

  await page.click('[data-flashcards-generate]');
  await page.waitForTimeout(80);
  const flashStatus = (await page.textContent('.tutor-flashcards__status'))?.trim() || '';

  await page.click('[data-study-tool="quiz"]');
  await page.waitForTimeout(80);
  const studyStatus = (await page.textContent('.tutor-study-tools__status'))?.trim() || '';

  return { before, afterAge, flashStatus, studyStatus };
}

function compareParity(local, prod, label) {
  assert.deepEqual(local.directChildren, prod.directChildren, `${label}: direct chat DOM order differs from production`);
  assert.equal(local.composerIndex, prod.composerIndex, `${label}: composer position differs`);
  assert.equal(local.flashIndex, prod.flashIndex, `${label}: flashcards position differs`);
  assert.equal(local.studyIndex, prod.studyIndex, `${label}: study tools position differs`);
  assert.equal(local.mobileToggle, prod.mobileToggle, `${label}: mobile toggle presence differs`);
  assert.equal(local.mobileActionText, prod.mobileActionText, `${label}: mobile action label differs`);
  assert.equal(local.settingsOpen, prod.settingsOpen, `${label}: mobile settings open/closed state differs`);
  assert.deepEqual(local.styles, prod.styles, `${label}: computed tutor styles differ from production`);
}

const browser = await chromium.launch({ headless: true });
try {
  // 1) Broad no-crash/idempotency matrix on local branch, desktop + mobile.
  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage();
    const matrix = await runStructuralMatrix(page, LOCAL, viewport, 'el');
    assert.deepEqual([...new Set(matrix.failedSameOrigin)], [], `Local same-origin 4xx/5xx: ${matrix.failedSameOrigin.join(', ')}`);
    assert.deepEqual(matrix.errors, [], `Local browser errors: ${matrix.errors.join('\n')}`);
    await page.close();
  }

  // 2) Differential parity against current production for the most mobile-sensitive context.
  for (const lang of ['el', 'en']) {
    const prodPage = await browser.newPage();
    const localPage = await browser.newPage();
    const prod = await mobileInteractionSnapshot(prodPage, PROD, lang);
    const local = await mobileInteractionSnapshot(localPage, LOCAL, lang);

    compareParity(local.before, prod.before, `mobile ${lang} initial`);
    compareParity(local.afterAge, prod.afterAge, `mobile ${lang} after age selection`);
    assert.equal(local.flashStatus, prod.flashStatus, `mobile ${lang}: flashcards disconnected-state behavior differs`);
    assert.equal(local.studyStatus, prod.studyStatus, `mobile ${lang}: study-tools disconnected-state behavior differs`);

    await prodPage.close();
    await localPage.close();
  }

  // 3) Desktop differential parity for representative guardian/student contexts.
  for (const context of [
    { zoneId: 'primary', roleId: 'guardian' },
    { zoneId: 'middle', roleId: 'student' },
    { zoneId: 'high', roleId: 'student' },
  ]) {
    const prodPage = await browser.newPage();
    const localPage = await browser.newPage();
    await prepare(prodPage, PROD, { width: 1280, height: 900 }, 'el');
    await prepare(localPage, LOCAL, { width: 1280, height: 900 }, 'el');
    await renderContext(prodPage, context, 'el');
    await renderContext(localPage, context, 'el');
    compareParity(await snapshot(localPage), await snapshot(prodPage), `desktop ${context.zoneId}/${context.roleId}`);
    await prodPage.close();
    await localPage.close();
  }

  console.log('Tutor consolidation smoke/parity checks passed.');
} finally {
  await browser.close();
}
