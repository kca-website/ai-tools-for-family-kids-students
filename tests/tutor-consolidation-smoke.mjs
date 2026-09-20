import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL = 'http://127.0.0.1:4173/';
const PROD = 'https://www.aitools4kids.gr/';
const CHECK_PRODUCTION = process.env.SKIP_PRODUCTION_PARITY !== '1';

const contexts = [
  { zoneId: 'primary', roleId: 'guardian' },
  { zoneId: 'primary', roleId: 'student' },
  { zoneId: 'middle', roleId: 'guardian' },
  { zoneId: 'middle', roleId: 'student' },
  { zoneId: 'high', roleId: 'guardian' },
  { zoneId: 'high', roleId: 'student' },
];

async function prepare(page, baseUrl, viewport, lang = 'el') {
  await page.setViewportSize(viewport);
  if (baseUrl.startsWith(LOCAL)) {
    await page.route('**/_vercel/insights/script.js', (route) => route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: '',
    }));
  }
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
    const tutorView = document.getElementById('tutorView');
    if (tutorView) tutorView.hidden = false;
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.AITutor.render({ ...contextValue, lang: langValue });
  }, { contextValue: context, langValue: lang });

  await page.waitForSelector('#tutorMount .tutor-chat', { state: 'attached', timeout: 10000 });
  await page.waitForSelector('#tutorMount .tutor-flashcards', { state: 'attached', timeout: 10000 });
  await page.waitForSelector('#tutorMount .tutor-study-tools', { state: 'attached', timeout: 10000 });
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
    const subject = document.getElementById('tutorSubject');
    const input = document.getElementById('tutorInput');
    const flashGenerate = document.querySelector('#tutorMount [data-flashcards-generate]');
    const studyQuiz = document.querySelector('#tutorMount [data-study-tool="quiz"]');

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
      subjectValue: subject?.value || '',
      subjectOptions: subject ? [...subject.options].map((o) => ({ value: o.value, text: o.textContent?.trim() || '' })) : [],
      inputDisabled: !!input?.disabled,
      inputPlaceholder: input?.placeholder || '',
      flashGenerateDisabled: !!flashGenerate?.disabled,
      studyQuizDisabled: !!studyQuiz?.disabled,
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
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (/^Failed to load resource:/.test(text)) return;
    errors.push(`console: ${text}`);
  });
  page.on('response', (resp) => {
    try {
      const u = new URL(resp.url());
      const base = new URL(baseUrl);
      if (u.origin === base.origin && resp.status() >= 400 && u.pathname !== '/_vercel/insights/script.js') {
        failedSameOrigin.push(`${resp.status()} ${u.pathname}`);
      }
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

    await page.evaluate((ctx) => window.AITutor.render({ ...ctx, lang: document.documentElement.lang.startsWith('en') ? 'en' : 'el' }), context);
    await page.waitForTimeout(80);
    snap = await snapshot(page);
    assert.equal(snap.flashCount, 1, `${baseUrl} ${context.zoneId}/${context.roleId}: flashcards duplicate after rerender`);
    assert.equal(snap.studyCount, 1, `${baseUrl} ${context.zoneId}/${context.roleId}: study tools duplicate after rerender`);
    results[`${context.zoneId}/${context.roleId}`] = snap;
  }

  return { results, errors, failedSameOrigin };
}

async function mobileInteractionSnapshot(page, baseUrl, lang, interact = true) {
  await prepare(page, baseUrl, { width: 390, height: 844 }, lang);
  await renderContext(page, { zoneId: 'middle', roleId: 'student' }, lang);

  const before = await snapshot(page);
  assert.equal(before.mobileToggle, true, `${baseUrl}: mobile settings toggle missing`);
  assert.equal(before.bodyTutorMobileActive, true, `${baseUrl}: mobile tutor route class missing`);

  if (!before.settingsOpen) {
    await page.click('#tutorMount .tutor-mobile-settings-toggle');
    await page.waitForTimeout(50);
  }
  const opened = await snapshot(page);

  if (!interact) {
    return { before, opened, afterAge: opened, afterManualClose: opened, flashStatus: '', studyStatus: '' };
  }

  const firstSubject = await page.locator('#tutorSubject option').evaluateAll((options) => {
    const option = options.find((item) => item.value);
    return option?.value || '';
  });
  assert.ok(firstSubject, `${baseUrl}: expected at least one real subject option`);
  await page.locator('#tutorSubject').evaluate((select, value) => {
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, firstSubject);
  await page.waitForTimeout(80);
  const afterAge = await snapshot(page);

  // Close through the installed control handler. In headless parity runs the
  // toggle can be visually suppressed by timing/layout while its state handler remains valid.
  if (afterAge.settingsOpen) {
    await page.locator('#tutorMount .tutor-mobile-settings-toggle').evaluate((el) => el.click());
    await page.waitForTimeout(50);
  }
  const afterManualClose = await snapshot(page);

  await page.locator('[data-flashcards-generate]').evaluate((el) => el.click());
  await page.waitForTimeout(80);
  const flashStatus = (await page.textContent('.tutor-flashcards__status'))?.trim() || '';

  await page.locator('[data-study-tool="quiz"]').evaluate((el) => el.click());
  await page.waitForTimeout(80);
  const studyStatus = (await page.textContent('.tutor-study-tools__status'))?.trim() || '';

  return { before, opened, afterAge, afterManualClose, flashStatus, studyStatus };
}

function compareParity(local, prod, label, { ignoreMobileSettingsState = false } = {}) {
  assert.deepEqual(local.directChildren, prod.directChildren, `${label}: direct chat DOM order differs from production`);
  assert.equal(local.composerIndex, prod.composerIndex, `${label}: composer position differs`);
  assert.equal(local.flashIndex, prod.flashIndex, `${label}: flashcards position differs`);
  assert.equal(local.studyIndex, prod.studyIndex, `${label}: study tools position differs`);
  assert.equal(local.mobileToggle, prod.mobileToggle, `${label}: mobile toggle presence differs`);
  if (!ignoreMobileSettingsState) {
    assert.equal(local.mobileActionText, prod.mobileActionText, `${label}: mobile action label differs`);
    assert.equal(local.settingsOpen, prod.settingsOpen, `${label}: mobile settings open/closed state differs`);
  }
  assert.deepEqual(local.styles, prod.styles, `${label}: computed tutor styles differ from production`);
}

const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage();
    const matrix = await runStructuralMatrix(page, LOCAL, viewport, 'el');
    assert.deepEqual([...new Set(matrix.failedSameOrigin)], [], `Local same-origin 4xx/5xx: ${matrix.failedSameOrigin.join(', ')}`);
    assert.deepEqual(matrix.errors, [], `Local browser errors: ${matrix.errors.join('\n')}`);
    await page.close();
  }

  for (const lang of ['el', 'en']) {
    const localPage = await browser.newPage();
    const local = await mobileInteractionSnapshot(localPage, LOCAL, lang, true);

    if (CHECK_PRODUCTION) {
      const prodPage = await browser.newPage();
      const prod = await mobileInteractionSnapshot(prodPage, PROD, lang, false);
      compareParity(local.before, prod.before, `mobile ${lang} initial`, { ignoreMobileSettingsState: true });
      await prodPage.close();
    }
    assert.equal(local.before.subjectValue, '', `mobile ${lang}: subject must start unselected`);
    assert.equal(local.before.settingsOpen, true, `mobile ${lang}: settings must start open until a subject is explicitly selected`);
    assert.equal(local.before.flashGenerateDisabled, true, `mobile ${lang}: flashcards must be disabled before subject selection`);
    assert.equal(local.before.studyQuizDisabled, true, `mobile ${lang}: study tools must be disabled before subject selection`);
    assert.equal(local.opened.settingsOpen, true, `mobile ${lang}: settings should be open while editing`);
    assert.notEqual(local.afterAge.subjectValue, '', `mobile ${lang}: explicit subject selection did not stick`);
    assert.equal(local.afterAge.settingsOpen, true, `mobile ${lang}: settings must remain open until the user closes them`);
    assert.equal(local.afterManualClose.settingsOpen, false, `mobile ${lang}: settings close handler must clear the open state`);

    // With no explicit age selected in this current tutor flow, the canonical
    // access policy blocks generated study tools before authentication is considered.
    const expectedFlash = lang === 'en'
      ? 'Flashcards are not available with the current age setting.'
      : 'Οι flashcards δεν είναι διαθέσιμες με την τωρινή ηλικιακή ρύθμιση.';
    const expectedStudy = lang === 'en'
      ? 'This feature is not available with the current age setting.'
      : 'Η λειτουργία δεν είναι διαθέσιμη με την τωρινή ηλικιακή ρύθμιση.';
    assert.equal(local.flashStatus, expectedFlash, `mobile ${lang}: flashcards age-gate copy changed`);
    assert.equal(local.studyStatus, expectedStudy, `mobile ${lang}: study-tools age-gate copy changed`);

    await localPage.close();
  }


  for (const lang of ['el', 'en']) {
    for (const zoneId of ['primary', 'middle']) {
    const page = await browser.newPage();
    await prepare(page, LOCAL, { width: 390, height: 844 }, lang);
    await renderContext(page, { zoneId, roleId: 'guardian' }, lang);

    const heading = (await page.locator('#tutorMount .tutor-heading').innerText()).replace(/\s+/g, ' ').trim();
    if (lang === 'en') assert.match(heading, /First choose the subject/i, 'Parent Helper English onboarding must explain subject-first flow');
    else assert.match(heading, /Πρώτα επίλεξε μάθημα/i, 'Parent Helper Greek onboarding must explain subject-first flow');

    const initial = await snapshot(page);
    assert.equal(initial.subjectValue, '', `parent ${zoneId} ${lang}: subject must not be silently auto-selected`);
    assert.equal(initial.settingsOpen, true, `parent ${zoneId} ${lang}: lesson settings must stay visible until subject selection`);
    assert.equal(initial.inputDisabled, true, `parent ${zoneId} ${lang}: chat must be disabled before subject selection`);
    assert.equal(initial.flashGenerateDisabled, true, `parent ${zoneId} ${lang}: flashcards must be disabled before subject selection`);
    assert.equal(initial.studyQuizDisabled, true, `parent ${zoneId} ${lang}: study tools must be disabled before subject selection`);
    assert.match(initial.inputPlaceholder, lang === 'en' ? /Choose a subject first/i : /Επίλεξε πρώτα μάθημα/i,
      `parent ${lang}: composer must explain why it is locked`);

    const firstSubject = initial.subjectOptions.find((option) => option.value)?.value || '';
    assert.ok(firstSubject, `parent ${zoneId} ${lang}: no selectable subject was available`);
    await page.selectOption('#tutorSubject', firstSubject);
    await page.waitForTimeout(100);

    const selected = await snapshot(page);
    assert.equal(selected.subjectValue, firstSubject, `parent ${zoneId} ${lang}: selected subject was not retained`);
    assert.equal(selected.inputDisabled, false, `parent ${zoneId} ${lang}: chat must unlock after explicit subject selection`);
    assert.equal(selected.flashGenerateDisabled, false, `parent ${zoneId} ${lang}: flashcards must unlock after explicit subject selection`);
    assert.equal(selected.studyQuizDisabled, false, `parent ${zoneId} ${lang}: study tools must unlock after explicit subject selection`);
    await page.close();
    }
  }

  if (CHECK_PRODUCTION) {
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
  }

  console.log(`Tutor consolidation smoke checks passed${CHECK_PRODUCTION?' with production parity':' (local-only; production parity skipped)'}.`);
} finally {
  await browser.close();
}
