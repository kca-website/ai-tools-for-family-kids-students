// PHASE 2 – per-page crawl on a local server that emulates vercel.json (or BASE_URL for production).
// Records status, console errors/warnings, page errors, failed requests, third-party requests attempted, mixed content, storage usage.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import { startLocalServer, walkHtml, rel, write } from './lib.mjs';

const BASE = process.env.BASE_URL;
const local = BASE ? null : await startLocalServer();
const base = BASE || local.url;
const baseHost = new URL(base).host;
const spaRoutes = ['/', '/primary/guardian/tools', '/primary/guardian/tutor', '/primary/guardian/quiz', '/primary/student/tools', '/middle/student/tools', '/middle/student/tutor', '/middle/guardian/tutor', '/high/student/tutor', '/high/student/tutor?mode=review', '/high/student/quiz', '/high/guardian/guide', '/primary/guardian/tutor?mode=challenge&grade=e&subject=istoria-e-dimotikou', '/preschool', '/does-not-exist', '/primary/nobody/nothing'];
const pages = [...new Set([...walkHtml().map(rel), ...spaRoutes])];
const profiles = [
  { name: 'desktop', viewport: { width: 1280, height: 800 } },
  { name: 'mobile375', viewport: { width: 375, height: 740 }, isMobile: true, hasTouch: true },
];
const browser = await chromium.launch();
const results = [];
for (const prof of profiles) {
  const ctx = await browser.newContext({ viewport: prof.viewport, isMobile: prof.isMobile, hasTouch: prof.hasTouch, serviceWorkers: 'block' });
  await ctx.route((u) => new URL(u).host !== baseHost, (route) => route.abort('blockedbyclient')); // sandbox has no egress; record only
  for (const p of pages) {
    const page = await ctx.newPage();
    const rec = { profile: prof.name, path: p, status: null, console: [], pageErrors: [], failedInternal: [], thirdParty: {}, mixed: [], overflowX: false, title: '', h1: 0 };
    page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) rec.console.push(`${m.type()}: ${m.text().slice(0, 240)}`); });
    page.on('pageerror', (e) => rec.pageErrors.push(String(e.message || e).slice(0, 300)));
    page.on('response', (r) => { const u = new URL(r.url()); if (u.host === baseHost && r.status() >= 400) rec.failedInternal.push(`${r.status()} ${u.pathname}`); });
    page.on('request', (rq) => { const u = new URL(rq.url()); if (u.host !== baseHost && /^https?:/.test(u.protocol)) { rec.thirdParty[u.host] = (rec.thirdParty[u.host] || 0) + 1; if (u.protocol === 'http:') rec.mixed.push(rq.url()); } });
    try {
      const resp = await page.goto(base + p, { waitUntil: 'load', timeout: 30000 });
      rec.status = resp.status();
      await page.waitForTimeout(800);
      rec.title = await page.title();
      rec.h1 = await page.locator('h1').count();
      rec.overflowX = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      rec.canonical = await page.evaluate(() => document.querySelector('link[rel=canonical]')?.href || null);
    } catch (e) { rec.error = String(e.message).slice(0, 200); }
    results.push(rec);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
if (local) local.server.close();
write(BASE ? 'crawl-production.json' : 'crawl-local.json', results);
const bad = results.filter((r) => r.error || r.pageErrors.length || r.console.some((c) => c.startsWith('error') && !/ERR_BLOCKED_BY_CLIENT|Failed to load resource/.test(c)) || r.failedInternal.length || r.overflowX);
console.log('pages x profiles:', results.length, ' with issues:', bad.length);
for (const r of bad) console.log(r.profile, r.path, r.status, JSON.stringify({ err: r.error, pe: r.pageErrors.slice(0, 2), ce: r.console.filter((c) => !/BLOCKED_BY_CLIENT/.test(c)).slice(0, 2), fi: r.failedInternal.slice(0, 3), ox: r.overflowX }));
