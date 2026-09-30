// PHASE 4 – privacy claims vs behaviour. Inventories cookies / localStorage / sessionStorage / IndexedDB / Cache Storage / service workers
// before and after using AI Help (mocked), and compares third-party requests with what privacy-policy.html declares.
import fs from 'node:fs';
import path from 'node:path';
import { test, expect, IS_PROD } from './fixtures.mjs';
import { RESULTS, REPO } from '../scripts/lib.mjs';

const snapshot = (page) => page.evaluate(async () => ({
  documentCookie: document.cookie,
  localStorage: Object.fromEntries(Object.entries(localStorage).map(([k, v]) => [k, String(v).slice(0, 80)])),
  sessionStorage: Object.fromEntries(Object.entries(sessionStorage).map(([k, v]) => [k, String(v).slice(0, 80)])),
  indexedDB: (await (indexedDB.databases?.() || Promise.resolve([]))).map((d) => d.name),
  caches: await caches.keys(),
  serviceWorkers: (await navigator.serviceWorker.getRegistrations()).map((r) => r.scope),
}));

const POLICY = fs.readFileSync(path.join(REPO, 'privacy-policy.html'), 'utf8').replace(/<[^>]+>/g, ' ');
// hosts the policy explicitly discloses (text search) – used to flag undisclosed third parties
const DISCLOSED = { 'cdn.jsdelivr.net': /jsDelivr/i, 'fonts.googleapis.com': /Google Fonts|fonts\.googleapis/i, 'fonts.gstatic.com': /Google Fonts|gstatic/i, 'www.google.com': /favicon|Google/i, 'commons.wikimedia.org': /Wikimedia|Wikipedia/i, 'upload.wikimedia.org': /Wikimedia|Wikipedia/i, 'js.puter.com': /Puter/i };

test.describe('storage / cookies inventory', () => {
  test.skip(IS_PROD && false, '');

  test('@smoke "no cookies" claim: no cookies before and after AI Help use', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ serviceWorkers: 'allow' });
    const host = new URL(baseURL).host;
    if (!IS_PROD) await context.route((u) => new URL(u).host !== host && /^https?:/.test(new URL(u).protocol), (r) => r.abort('blockedbyclient'));
    const page = await context.newPage();
    page.on('dialog', (d) => d.dismiss());
    const out = { steps: [] };
    const step = async (name) => { out.steps.push({ name, cookies: await context.cookies(), ...(await snapshot(page)) }); };
    await page.goto('/'); await page.waitForTimeout(1500); await step('home');
    await page.goto('/primary/guardian/tools'); await page.waitForTimeout(800); await step('primary tools');
    if (!IS_PROD) {
      await context.route('**/api/tutor-assistant', (r) => r.request().method() === 'GET' ? r.fulfill({ status: 200, contentType: 'application/json', body: '{"configured":true}' }) : r.fulfill({ status: 200, contentType: 'application/json', body: '{"text":"ΜΟΚ","provider":"mock"}' }));
      await page.goto('/high/student/tutor');
      await page.selectOption('#tutorSchoolType', 'gel'); await page.selectOption('#tutorGrade', 'a'); await page.selectOption('#tutorSubject', 'algebra-a-lykeiou');
      await page.locator('#tutorInput').fill('Δοκιμή'); await page.locator('#tutorSend').click(); await page.waitForTimeout(1000);
      await step('after AI Help message');
    }
    await page.goto('/study.html'); await page.selectOption('#topicPick', { index: 1 }); await page.waitForTimeout(500); await step('study.html topic chosen');
    await page.goto('/primary/guardian/quiz'); await page.locator('.quiz-grade-card', { hasText: "Ε' Δημοτικού" }).click();
    await page.locator('.quiz-subject-card', { hasText: 'Μαθηματικά' }).locator('.quiz-start-btn').first().click();
    for (let i = 0; i < 30; i++) { const o = page.locator('#pathView .quiz-option').first(); if (!(await o.count())) break; await o.click(); const n = page.locator('#pathView button:visible', { hasText: /Επόμενη|Τέλος|Αποτέλεσμα/ }).first(); if (await n.count()) await n.click(); }
    await step('after quiz completed');
    fs.writeFileSync(path.join(RESULTS, 'storage-inventory.json'), JSON.stringify(out, null, 2));
    for (const s of out.steps) {
      expect(s.cookies, `cookies at "${s.name}"`).toEqual([]);
      expect(s.documentCookie, `document.cookie at "${s.name}"`).toBe('');
    }
    await context.close();
  });

  test('local progress keys are the documented set and the policy mentions local quiz progress', async ({ page }) => {
    page.on('dialog', (d) => d.dismiss());
    await page.goto('/primary/guardian/quiz');
    await page.locator('.quiz-grade-card', { hasText: "Ε' Δημοτικού" }).click();
    await page.locator('.quiz-subject-card', { hasText: 'Μαθηματικά' }).locator('.quiz-start-btn').first().click();
    for (let i = 0; i < 30; i++) { const o = page.locator('#pathView .quiz-option').first(); if (!(await o.count())) break; await o.click(); const n = page.locator('#pathView button:visible', { hasText: /Επόμενη|Τέλος|Αποτέλεσμα/ }).first(); if (await n.count()) await n.click(); }
    const snap = await snapshot(page);
    test.info().annotations.push({ type: 'local-keys', description: JSON.stringify({ ls: Object.keys(snap.localStorage), ss: Object.keys(snap.sessionStorage) }) });
    const allowed = new Set(['aitools4kids_progress_v1', 'aitools4kids_lang', 'aitools4kids_last_quiz_id_v1']);
    expect(Object.keys(snap.localStorage).concat(Object.keys(snap.sessionStorage)).filter((k) => !allowed.has(k))).toEqual([]);
    // The policy says only "language or selected zone" are stored – quiz result (quizId + gap tags) is learning-difficulty data.
    expect(/quiz|πρόοδο|αποτέλεσμα/i.test(POLICY.slice(POLICY.indexOf('2. Η βασική πλατφόρμα'), POLICY.indexOf('3. AI λειτουργίες'))), 'policy §2 mentions local quiz progress').toBe(true);
  });

  test('service worker + Cache Storage are used (not declared in the privacy policy) and /api GET responses are cached by the SW', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ serviceWorkers: 'allow' });
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForFunction(() => navigator.serviceWorker.controller || navigator.serviceWorker.ready.then(() => true), null, { timeout: 15000 });
    await page.reload();
    await page.waitForTimeout(1000);
    await page.evaluate(() => fetch('/api/tutor-assistant').then((r) => r.json()));
    await page.waitForTimeout(500);
    const cached = await page.evaluate(async () => { const out = []; for (const k of await caches.keys()) { const c = await caches.open(k); for (const r of await c.keys()) out.push(new URL(r.url).pathname); } return out; });
    fs.writeFileSync(path.join(RESULTS, 'sw-cache-contents.json'), JSON.stringify(cached, null, 2));
    expect(cached.filter((p) => p.startsWith('/api/')), '/api responses must not be cached').toEqual([]);
    await context.close();
  });
});

test.describe('third-party requests vs privacy policy', () => {
  const PAGES = ['/', '/primary/guardian/tools', '/middle/student/tools', '/study.html', '/sign-language.html', '/xartis-ylis.html', '/teacher-assistant.html', '/privacy-policy.html', '/tools/chatgpt.html'];
  test('undisclosed third-party hosts are contacted on page load', async ({ page, qa }) => {
    const perPage = {};
    for (const p of PAGES) {
      const before = { ...qa.thirdParty };
      await page.goto(p); await page.waitForTimeout(900);
      perPage[p] = Object.keys(qa.thirdParty).filter((h) => (qa.thirdParty[h] || 0) > (before[h] || 0));
    }
    fs.writeFileSync(path.join(RESULTS, 'third-party-per-page.json'), JSON.stringify({ perPage, disclosed: Object.fromEntries(Object.entries(DISCLOSED).map(([h, re]) => [h, re.test(POLICY)])) }, null, 2));
    const undisclosed = [...new Set(Object.values(perPage).flat())].filter((h) => !(DISCLOSED[h] && DISCLOSED[h].test(POLICY)));
    expect(undisclosed, 'hosts contacted at load without disclosure').toEqual([]);
  });

  test('Puter and Groq/Cloudflare are never contacted directly from the browser', async ({ page, qa }) => {
    for (const p of PAGES) { await page.goto(p); await page.waitForTimeout(500); }
    const bad = Object.keys(qa.thirdParty).filter((h) => /puter|groq|cloudflare|openai|anthropic/i.test(h));
    expect(bad).toEqual([]);
  });

  test('no API keys / tokens / account ids in any shipped JS/HTML (static scan)', async () => {
    const files = fs.readdirSync(REPO).filter((f) => /\.(js|html|json)$/.test(f) && f !== 'package-lock.json');
    const hits = [];
    const re = [/gsk_[A-Za-z0-9]{20,}/, /sk-[A-Za-z0-9]{20,}/, /AKIA[0-9A-Z]{16}/, /AIza[0-9A-Za-z_-]{30,}/, /Bearer\s+[A-Za-z0-9._-]{25,}/, /CLOUDFLARE_[A-Z_]*TOKEN\s*[:=]\s*["'][^"']{10,}/, /xox[bap]-[A-Za-z0-9-]{10,}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/];
    for (const f of files) { const t = fs.readFileSync(path.join(REPO, f), 'utf8'); for (const r of re) { const m = t.match(r); if (m) hits.push(`${f}: ${m[0].slice(0, 30)}…`); } }
    for (const f of fs.readdirSync(path.join(REPO, 'tools'))) { const t = fs.readFileSync(path.join(REPO, 'tools', f), 'utf8'); for (const r of re) if (r.test(t)) hits.push('tools/' + f); }
    expect(hits).toEqual([]);
    // process.env must only be read in /api and the router (server side), never in files loaded by the browser
    const browserFiles = files.filter((f) => f.endsWith('.js') && f !== 'ai-provider-router.js');
    const leaks = browserFiles.filter((f) => /process\.env\./.test(fs.readFileSync(path.join(REPO, f), 'utf8')));
    expect(leaks).toEqual([]);
  });

  test('ai-provider-router.js is not referenced by any HTML page (server-only file)', async () => {
    const htmls = fs.readdirSync(REPO).filter((f) => f.endsWith('.html'));
    const refs = htmls.filter((f) => /ai-provider-router\.js/.test(fs.readFileSync(path.join(REPO, f), 'utf8')));
    expect(refs).toEqual([]);
  });
});

test.describe('server-side files are not downloadable as static assets (production only)', () => {
  test.skip(!IS_PROD, 'needs the real Vercel deployment');
  for (const p of ['/ai-provider-router.js', '/api/tutor-assistant.js', '/study-runtime-cache.js', '/benchmark/run.mjs', '/.git/config', '/.env', '/package.json', '/vercel.json', '/qa/REPORT.md']) {
    test(`GET ${p} is not served`, async ({ request }) => {
      const r = await request.get(p, { maxRedirects: 0 });
      const body = await r.text();
      test.info().annotations.push({ type: 'status', description: String(r.status()) });
      expect(/process\.env|CLOUDFLARE_|GROQ_API_KEY|\[core\]/.test(body), `${p} leaks source/config`).toBe(false);
    });
  }
});
