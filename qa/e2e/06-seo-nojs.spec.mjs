// SEO / structured data / sitemap consistency / behaviour WITHOUT JavaScript (what crawlers, social scrapers and JS-blocked users receive).
import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from './fixtures.mjs';
import { RESULTS, REPO, PROD, walkHtml, rel } from '../scripts/lib.mjs';

import * as cheerio from 'cheerio';
let rows = null;
// Static analysis of the HTML files exactly as served (no JS executed, no meta-refresh followed).
async function collect() {
  if (rows) return rows;
  rows = [];
  for (const abs of walkHtml()) {
    const p = rel(abs);
    const $ = cheerio.load(fs.readFileSync(abs, 'utf8'));
    const m = (sel, attr = 'content') => $(sel).first().attr(attr) || '';
    const ld = $('script[type="application/ld+json"]').toArray().map((s) => { try { const j = JSON.parse($(s).text()); return { ok: true, type: Array.isArray(j) ? j.map((x) => x['@type']) : j['@graph'] ? j['@graph'].map((x) => x['@type']) : j['@type'] }; } catch (e) { return { ok: false, err: String(e).slice(0, 80) }; } });
    rows.push({
      path: p, lang: $('html').attr('lang') || '', title: $('title').first().text().trim(), description: m('meta[name=description]'), canonical: m('link[rel=canonical]', 'href'),
      robots: m('meta[name=robots]'), ogImage: m('meta[property="og:image"]'), ogTitle: m('meta[property="og:title"]'), twitterCard: m('meta[name="twitter:card"]'),
      viewport: m('meta[name=viewport]'), hreflang: $('link[rel=alternate][hreflang]').toArray().map((l) => `${$(l).attr('hreflang')}=${$(l).attr('href')}`), ld,
      h1: $('h1').length, noscript: $('noscript').length, appleIcon: $('link[rel=apple-touch-icon]').length > 0, metaRefresh: m('meta[http-equiv=refresh]'),
    });
  }
  fs.writeFileSync(path.join(RESULTS, 'seo-static.json'), JSON.stringify(rows, null, 2));
  return rows;
}
const indexable = (r) => !/noindex/i.test(r.robots);
const expectedCanonical = (p) => (p === '/index.html' ? `${PROD}/` : `${PROD}${p}`);

test.describe('static SEO (JS disabled)', () => {
  test.beforeEach(async () => { await collect(); });

  test('@smoke every indexable page has title + meta description + viewport', async () => {
    const bad = rows.filter(indexable).filter((r) => !r.title || !r.description || !r.viewport).map((r) => `${r.path}: title=${!!r.title} desc=${!!r.description} viewport=${!!r.viewport}`);
    expect(bad).toEqual([]);
  });
  test('titles ≤ 75 chars and descriptions 50–200 chars (indexable pages)', async ({}, info) => {
    const long = rows.filter(indexable).filter((r) => r.title.length > 75).map((r) => `${r.path} (${r.title.length})`);
    const desc = rows.filter(indexable).filter((r) => r.description && (r.description.length < 50 || r.description.length > 200)).map((r) => `${r.path} (${r.description.length})`);
    info.annotations.push({ type: 'long-titles', description: long.join(', ').slice(0, 400) });
    info.annotations.push({ type: 'desc-length', description: desc.join(', ').slice(0, 400) });
    expect(long.length + desc.length, 'pages with out-of-range title/description').toBeLessThan(15);
  });
  test('duplicate titles / descriptions among indexable pages', async ({}, info) => {
    const dup = (k) => { const m = {}; rows.filter(indexable).forEach((r) => r[k] && (m[r[k]] ||= []).push(r.path)); return Object.values(m).filter((v) => v.length > 1); };
    info.annotations.push({ type: 'dup-titles', description: JSON.stringify(dup('title')).slice(0, 400) });
    expect(dup('title')).toEqual([]);
  });
  test('canonical present in the STATIC html and points to itself (indexable pages)', async () => {
    const bad = rows.filter(indexable).filter((r) => r.canonical !== expectedCanonical(r.path) && !(r.path === '/preschool.html' && r.canonical === `${PROD}/preschool`)).map((r) => `${r.path} → ${r.canonical || 'MISSING'}`);
    expect(bad).toEqual([]);
  });
  test('sign-language.html has meta description', async () => {
    const r = rows.find((x) => x.path === '/sign-language.html');
    expect(r.description.length).toBeGreaterThan(50);
  });
  test('Open Graph image + Twitter card on every indexable page; image file exists and is ≥1200×630', async ({}, info) => {
    test.fail(true, 'FINDING F-18: many pages (study, en/*, sign-language, guide…) have no og:image/twitter:card');
    const missing = rows.filter(indexable).filter((r) => !r.ogImage || !r.twitterCard).map((r) => r.path);
    info.annotations.push({ type: 'pages-without-og', description: `${missing.length}: ${missing.slice(0, 12).join(', ')}` });
    expect(missing).toEqual([]);
  });
  test('@smoke social preview image exists, is PNG ≥ 1200×630 and < 300 KB', async () => {
    const f = path.join(REPO, 'social-preview-20260926.png');
    const b = fs.readFileSync(f);
    expect(b.slice(1, 4).toString()).toBe('PNG');
    const w = b.readUInt32BE(16), h = b.readUInt32BE(20);
    expect(w).toBeGreaterThanOrEqual(1200); expect(h).toBeGreaterThanOrEqual(630);
    expect(b.length).toBeLessThan(300 * 1024);
    for (const r of rows.filter((x) => x.ogImage)) {
      const local = r.ogImage.replace(PROD, '');
      expect(fs.existsSync(path.join(REPO, local)), `${r.path}: og:image ${r.ogImage} missing in repo`).toBe(true);
    }
  });
  test('JSON-LD blocks parse; home has Organization/WebSite-like markup', async ({}, info) => {
    const broken = rows.flatMap((r) => r.ld.filter((l) => !l.ok).map((l) => `${r.path}: ${l.err}`));
    expect(broken).toEqual([]);
    const home = rows.find((r) => r.path === '/index.html');
    info.annotations.push({ type: 'home-jsonld-types', description: JSON.stringify(home.ld.map((l) => l.type)) });
    expect(home.ld.length).toBeGreaterThan(0);
  });
  test('hreflang EL↔EN alternates on pages that have a translation', async () => {
    test.fail(true, 'FINDING F-15: no <link rel=alternate hreflang> anywhere; EN-only pages under /en/ have no EL twin link');
    const withAlt = rows.filter((r) => r.hreflang.length);
    expect(withAlt.length).toBeGreaterThan(0);
  });
  test('exactly one <h1> per static page', async ({}, info) => {
    const bad = rows.filter((r) => r.h1 !== 1).map((r) => `${r.path}:${r.h1}`);
    info.annotations.push({ type: 'h1-not-1', description: bad.join(', ').slice(0, 500) });
    expect(bad.filter((b) => !/(index|special-education-preview|classroom)\.html/.test(b))).toEqual([]);
  });
  test('apple-touch-icon and PNG manifest icons for iOS/Android install', async () => {
    test.fail(true, 'FINDING F-19: no apple-touch-icon; manifest icons are SVG only');
    const home = rows.find((r) => r.path === '/index.html');
    expect(home.appleIcon).toBe(true);
    const m = JSON.parse(fs.readFileSync(path.join(REPO, 'manifest.webmanifest'), 'utf8'));
    expect(m.icons.some((i) => /png/.test(i.type))).toBe(true);
  });
});

test.describe('sitemaps / robots', () => {
  const read = (f) => fs.readFileSync(path.join(REPO, f), 'utf8');
  test('@smoke robots.txt allows crawling and lists sitemap-index; every child sitemap exists', async () => {
    const robots = read('robots.txt');
    expect(robots).toMatch(/Sitemap:\s*https:\/\/www\.aitools4kids\.gr\/sitemap-index\.xml/);
    expect(robots).not.toMatch(/Disallow:\s*\/\s*$/m);
    const idx = read('sitemap-index.xml');
    for (const m of idx.matchAll(/<loc>([^<]+)<\/loc>/g)) expect(fs.existsSync(path.join(REPO, m[1].replace(PROD + '/', ''))), m[1]).toBe(true);
  });
  const sitemapUrls = () => { const urls = []; for (const f of fs.readdirSync(REPO).filter((f) => /sitemap.*\.xml$/.test(f) && f !== 'sitemap-index.xml')) for (const m of read(f).matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push({ url: m[1], file: f }); return urls; };
  test('every sitemap URL exists as a file and is indexable', async () => {
    await collect();
    const problems = [];
    for (const { url } of sitemapUrls()) {
      const p = url.replace(PROD, '') || '/'; const row = rows.find((r) => r.path === (p === '/' ? '/index.html' : p));
      if (!row) problems.push(`${url}: no such file`); else if (!indexable(row)) problems.push(`${url}: noindex page listed in sitemap`);
    }
    expect(problems).toEqual([]);
  });
  test('no URL is listed in more than one sitemap', async () => {
    const seen = {}; const dups = [];
    for (const u of sitemapUrls()) { if (seen[u.url]) dups.push(`${u.url} (${seen[u.url]} + ${u.file})`); seen[u.url] = u.file; }
    expect(dups).toEqual([]);
  });
  test('indexable pages missing from all sitemaps', async ({ browser, baseURL }, info) => {
    await collect();
    const all = fs.readdirSync(REPO).filter((f) => /sitemap.*\.xml$/.test(f)).map(read).join('\n');
    const missing = rows.filter(indexable).filter((r) => r.path !== '/index.html' && !all.includes(`${PROD}${r.path}`)).map((r) => r.path);
    info.annotations.push({ type: 'not-in-sitemap', description: missing.join(', ') });
    expect(missing).toEqual([]);
  });
});

test.describe('no JavaScript', () => {
  const PAGES = ['/', '/primary/guardian/tools', '/study.html', '/xartis-ylis.html', '/sign-language.html', '/teacher-assistant.html', '/guide.html', '/tools/chatgpt.html', '/privacy-policy.html', '/special-education.html'];
  test('@smoke content available without JS (h1 + readable text + noscript hint)', async ({ browser, baseURL }, info) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    const table = [];
    for (const p of PAGES) {
      await page.goto(baseURL + p);
      table.push(await page.evaluate((p) => ({
        path: p, status: 'ok', h1: [...document.querySelectorAll('h1')].filter((e) => e.getBoundingClientRect().height > 0).map((e) => e.textContent.trim().slice(0, 50)), visibleTextLen: document.body.innerText.trim().length,
        links: document.querySelectorAll('a[href]').length, noscript: [...document.querySelectorAll('noscript')].map((n) => n.textContent.trim().slice(0, 80)).filter(Boolean),
        zoneGridChildren: document.getElementById('zoneGrid')?.children.length ?? null, zoneGridVisible: !!document.getElementById('zoneGrid')?.offsetParent,
        headings: [...document.querySelectorAll('h2')].filter((e) => e.getBoundingClientRect().height > 0).map((e) => e.textContent.trim().slice(0, 40)).slice(0, 6),
      }), p));
    }
    fs.writeFileSync(path.join(RESULTS, 'no-js.json'), JSON.stringify(table, null, 2));
    for (const t of table) info.annotations.push({ type: 'nojs', description: `${t.path}: text=${t.visibleTextLen} links=${t.links} h1=${t.h1.length} zoneGrid=${t.zoneGridChildren}` });
    await ctx.close();
    expect(table.every((t) => t.visibleTextLen > 200), 'every page shows some readable text without JS').toBe(true);
  });

  test('home: age-zone picker ("Διάλεξε ηλικιακή ζώνη") has content without JS', async ({ browser, baseURL }) => {
    test.fail(true, 'FINDING F-16: zone cards are JS-rendered; static HTML section is empty → crawlers/JS-off users see no zone links');
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(baseURL + '/');
    const n = await page.evaluate(() => document.getElementById('zoneGrid')?.querySelectorAll('a[href], button').length || 0);
    await ctx.close();
    expect(n).toBeGreaterThanOrEqual(4);
  });

  test('home without JS: internal links a crawler can follow (static <a href>)', async ({ browser, baseURL }, info) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(baseURL + '/');
    const hrefs = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => h.startsWith('/') || h.startsWith('https://www.aitools4kids.gr')))]);
    info.annotations.push({ type: 'static-internal-links', description: String(hrefs.length) });
    await ctx.close();
    expect(hrefs.length).toBeGreaterThan(10);
  });
});
