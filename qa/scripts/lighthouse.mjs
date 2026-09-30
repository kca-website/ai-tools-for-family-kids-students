// Lighthouse (mobile + desktop) for the 8 most important pages. Default target = local vercel.json-emulating server.
// LOCAL RUN CAVEATS: no gzip/brotli, no CDN, external fonts/analytics blocked ⇒ Performance is NOT representative of production
// (Accessibility / Best-Practices / SEO are). Run with --base=https://www.aitools4kids.gr where egress is allowed.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse, { desktopConfig } from 'lighthouse';
import { startLocalServer, write, RESULTS } from './lib.mjs';

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const PAGES = [['home', '/'], ['primary-tools', '/primary/guardian/tools'], ['ai-help-high', '/high/student/tutor'], ['ai-study', '/study.html'], ['curriculum-map', '/xartis-ylis.html'], ['sign-language', '/sign-language.html'], ['teacher-assistant', '/teacher-assistant.html'], ['privacy-policy', '/privacy-policy.html']];
const local = args.base ? null : await startLocalServer();
const base = (args.base || local.url).replace(/\/$/, '');
const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] });
const blocked = local ? ['*fonts.googleapis.com*', '*fonts.gstatic.com*', '*cdn.jsdelivr.net*', '*commons.wikimedia.org*', '*upload.wikimedia.org*', '*google.com/s2/*'] : [];
const rows = [];
for (const [name, p] of PAGES) for (const form of ['mobile', 'desktop']) {
  const flags = { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], blockedUrlPatterns: blocked, ...(form === 'mobile' ? { formFactor: 'mobile' } : {}) };
  try {
    const r = await lighthouse(base + p, flags, form === 'desktop' ? desktopConfig : undefined);
    const c = r.lhr.categories; const a = r.lhr.audits;
    const failed = Object.values(a).filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== 'informative' && x.scoreDisplayMode !== 'notApplicable' && x.scoreDisplayMode !== 'manual').map((x) => x.id);
    rows.push({ page: name, url: p, form, performance: Math.round(c.performance.score * 100), accessibility: Math.round(c.accessibility.score * 100), bestPractices: Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100),
      LCP: a['largest-contentful-paint']?.displayValue, CLS: a['cumulative-layout-shift']?.displayValue, TBT: a['total-blocking-time']?.displayValue, transferKB: Math.round((a['total-byte-weight']?.numericValue || 0) / 1024), failedAudits: failed.slice(0, 14) });
    console.log(name.padEnd(18), form.padEnd(8), `P${rows.at(-1).performance} A${rows.at(-1).accessibility} BP${rows.at(-1).bestPractices} SEO${rows.at(-1).seo}  LCP ${rows.at(-1).LCP}  ${rows.at(-1).transferKB} KB`);
  } catch (e) { rows.push({ page: name, form, error: String(e.message).slice(0, 120) }); console.log(name, form, 'ERROR', e.message.slice(0, 100)); }
}
await chrome.kill(); if (local) local.server.close();
write('lighthouse-summary.json', { base, local: !!local, note: local ? 'LOCAL run – performance not representative (no compression/CDN; external hosts blocked)' : 'remote run', rows });
const md = ['| Σελίδα | Συσκευή | Perf | A11y | BP | SEO | LCP | Μεταφορά |', '|---|---|---|---|---|---|---|---|', ...rows.filter((r) => !r.error).map((r) => `| ${r.page} | ${r.form} | ${r.performance} | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${r.LCP} | ${r.transferKB} KB |`)].join('\n');
fs.writeFileSync(path.join(RESULTS, 'lighthouse-summary.md'), md + '\n');
