import { test as base, expect } from '@playwright/test';

export const IS_PROD = !!process.env.BASE_URL;
const KEY_RE = /(?:^|[\s(>"'])((?:[a-z][a-zA-Z0-9]{1,24})(?:\.[a-zA-Z][a-zA-Z0-9_-]{1,24}){1,3})(?=$|[\s),.:;!?<"'])/g;
const TLD_OR_EXT = new Set(['gr', 'com', 'org', 'net', 'edu', 'gov', 'io', 'ai', 'app', 'me', 'eu', 'html', 'js', 'css', 'json', 'png', 'pdf', 'md', 'txt', 'co', 'uk', 'us', 'tv', 'ly', 'dev', 'xyz', 'sch', 'jsp', 'php', 'xml', 'svg', 'jpg', 'docx', 'mp4', 'ac', 'info', 'fm', 'be', 'to', 'it', 'de', 'fr', 'es', 'ca', 'academy', 'study', 'so', 'in', 'is', 'im', 'ink', 'ws', 'cc', 'gl']);

/** Returns tokens that look like i18n keys ("home.title") or template leaks (undefined, [object Object], {{x}}). */
export function findTranslationLeaks(text) {
  const leaks = new Set();
  for (const m of text.matchAll(KEY_RE)) {
    const tok = m[1]; const parts = tok.split('.');
    if (TLD_OR_EXT.has(parts[parts.length - 1].toLowerCase())) continue;
    if (/^\d/.test(parts[parts.length - 1])) continue;
    if (/^(e\.g|i\.e|vs|etc|st|no|approx|fig|Dr|Mr|Mrs|Ms)$/i.test(parts[0])) continue;
    leaks.add(tok);
  }
  for (const re of [/\bundefined\b/, /\bnull\b/, /\[object Object\]/, /\{\{[^}]*\}\}/, /\bNaN\b/]) { const m = text.match(re); if (m) leaks.add(m[0]); }
  return [...leaks];
}
export const greekRatio = (text) => {
  const g = (text.match(/[Ͱ-Ͽἀ-῿]/g) || []).length;
  const l = (text.match(/[A-Za-z]/g) || []).length;
  return g / Math.max(1, g + l);
};

export const test = base.extend({
  // Collects runtime errors; blocks third-party hosts in local mode (sandbox has no egress) but records them.
  qa: async ({ page, context, baseURL }, use) => {
    const rec = { pageErrors: [], consoleErrors: [], thirdParty: {}, failedInternal: [], requests: [] };
    const host = new URL(baseURL).host;
    if (!IS_PROD) await context.route((u) => new URL(u).host !== host && /^https?:/.test(new URL(u).protocol), (r) => r.abort('blockedbyclient'));
    page.on('pageerror', (e) => rec.pageErrors.push(String(e.message).slice(0, 300)));
    page.on('console', (m) => { if (m.type() === 'error' && !/ERR_BLOCKED_BY_CLIENT|Failed to load resource/.test(m.text())) rec.consoleErrors.push(m.text().slice(0, 300)); });
    page.on('request', (r) => {
      const u = new URL(r.url());
      if (u.host !== host && /^https?:/.test(u.protocol)) rec.thirdParty[u.host] = (rec.thirdParty[u.host] || 0) + 1;
      if (u.pathname.startsWith('/api/')) rec.requests.push({ url: u.pathname, method: r.method(), body: r.postData() });
    });
    page.on('response', (r) => { const u = new URL(r.url()); if (u.host === host && r.status() >= 400 && !u.pathname.startsWith('/api/')) rec.failedInternal.push(`${r.status()} ${u.pathname}`); });
    await use(rec);
  },
  // Mocks the AI endpoints. mode: ok | 429 | 502 | timeout | html. Never contacts a real provider.
  mockAI: async ({ context }, use) => {
    const state = { mode: 'ok', calls: [], text: 'ΜΟΚ: Δοκίμασε πρώτα το 1ο βήμα και πες μου τι βρήκες.', json: null, delay: 0 };
    await context.route('**/api/**', async (route) => {
      const req = route.request(); const u = new URL(req.url());
      let body = null; try { body = req.postDataJSON(); } catch {}
      state.calls.push({ path: u.pathname, method: req.method(), body });
      if (state.delay) await new Promise((r) => setTimeout(r, state.delay));
      if (req.method() === 'GET') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ configured: true, provider: 'cloudflare', model: '@cf/openai/gpt-oss-120b', providers: [{ name: 'cloudflare', model: '@cf/openai/gpt-oss-120b' }, { name: 'groq', model: 'openai/gpt-oss-120b' }] }) });
      if (state.mode === 'timeout') return route.abort('timedout');
      if (state.mode === '429') return route.fulfill({ status: 429, contentType: 'application/json', body: JSON.stringify({ error: 'provider_limit', message: 'Η δωρεάν AI Βοήθεια έφτασε προσωρινά το όριο χρήσης της.', fallback: 'puter' }) });
      if (state.mode === '502') return route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ error: 'provider_error', message: 'Η AI Βοήθεια δεν μπόρεσε να απαντήσει αυτή τη στιγμή.' }) });
      if (state.mode === 'html') return route.fulfill({ status: 200, contentType: 'text/html', body: '<html>gateway error</html>' });
      const text = state.json ? JSON.stringify(state.json) : state.text;
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ text, model: 'mock', provider: 'mock', usage: null, sourceKind: '', sourceUrl: '' }) });
    });
    await use(state);
  },
});
export { expect };

// v10 homepage: school levels are opened from the "who are you" finder (parent → level → tools → CTA).
export async function openZoneFromHome(page, zone) {
  await page.locator('#homeV9Finder [data-finder-role="guardian"]').click();
  await page.locator(`#homeV9Finder [data-finder-zone="${zone}"]`).click();
  const tools = page.locator('#homeV9Finder [data-finder-need="tools"]');
  if (await tools.count()) await tools.click();
  await page.locator('#homeV9FinderCta').click();
}
