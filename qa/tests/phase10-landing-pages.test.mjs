// Phase 10: SEO landing pages: static regression tests (no browser needed).
// Browser checks (200, overflow, axe, CLS, deep links) live in qa/e2e/09-phase10-landing.spec.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { REPO, PROD, walkHtml, rel } from '../scripts/lib.mjs';
import { buildAll, buildSitemap } from '../../scripts/phase10/build.mjs';
import { loadData } from '../../scripts/phase10/lib.mjs';

import { LANDING } from '../../scripts/phase10/slugs.mjs';
const read = (p) => fs.readFileSync(path.join(REPO, p), 'utf8');
const load = (slug) => cheerio.load(read(`${slug}.html`));
const words = ($) => $('main').text().replace(/\s+/g, ' ').trim().split(' ').filter((w) => /[\p{L}]/u.test(w));

// Same routing the site really has (vercel.json rewrite + /preschool), no other invented routes.
const ROUTE = /^\/(primary|middle|high)\/(guardian|student)\/(tools|advanced|prompts|quiz|tutor|guide)$/;
function resolves(href) {
  const u = new URL(href, PROD);
  if (u.pathname === '/' || u.pathname === '/preschool' || ROUTE.test(u.pathname)) return true;
  return fs.existsSync(path.join(REPO, u.pathname)) && fs.statSync(path.join(REPO, u.pathname)).isFile();
}

test('generator output matches the committed pages and sitemap (data-driven claims are current)', () => {
  const pages = buildAll();
  assert.deepEqual(pages.map((p) => p.spec.slug).sort(), [...LANDING].sort());
  const stale = pages.filter((p) => read(p.file) !== p.html).map((p) => p.file);
  const { xml, idx } = buildSitemap(LANDING);
  if (read('seo-sitemap.xml') !== xml) stale.push('seo-sitemap.xml');
  if (read('sitemap-index.xml') !== idx) stale.push('sitemap-index.xml');
  assert.deepEqual(stale, [], 'stale files: run `node scripts/phase10/build.mjs`');
});

test('every landing page: lang, exactly one H1, title/description length, no accidental noindex', () => {
  for (const slug of LANDING) {
    const $ = load(slug);
    assert.equal($('html').attr('lang'), 'el', slug);
    assert.equal($('h1').length, 1, `${slug}: H1 count`);
    const title = $('title').text().trim(); const desc = $('meta[name=description]').attr('content') || '';
    assert.ok(title.length >= 30 && title.length <= 75, `${slug}: title ${title.length}`);
    assert.ok(desc.length >= 70 && desc.length <= 175, `${slug}: description ${desc.length}`);
    assert.doesNotMatch($('meta[name=robots]').attr('content') || '', /noindex|nofollow/i, slug);
    assert.ok($('meta[name=viewport]').length, `${slug}: viewport`);
    assert.equal($('main').length, 1, `${slug}: one <main>`);
  }
});

test('titles, descriptions, H1s and canonicals are unique across ALL indexable pages (cannibalization guard)', () => {
  const seen = { title: {}, desc: {}, h1: {} };
  for (const abs of walkHtml()) {
    const p = rel(abs); const $ = cheerio.load(fs.readFileSync(abs, 'utf8'));
    if (/noindex/i.test($('meta[name=robots]').attr('content') || '')) continue;
    for (const [k, v] of [['title', $('title').first().text().trim()], ['desc', $('meta[name=description]').attr('content') || ''], ['h1', $('h1').first().text().trim()]]) {
      if (v) (seen[k][v] ||= []).push(p);
    }
  }
  for (const k of ['title', 'desc']) {
    const dup = Object.entries(seen[k]).filter(([, v]) => v.length > 1).map(([t, v]) => `${t.slice(0, 50)} → ${v.join(', ')}`);
    assert.deepEqual(dup, [], `duplicate ${k}`);
  }
  const dupH1 = Object.entries(seen.h1).filter(([, v]) => v.length > 1 && v.some((p) => LANDING.some((s) => p === `/${s}.html`)));
  assert.deepEqual(dupH1, [], 'landing H1 duplicated somewhere');
});

test('canonical, Open Graph and Twitter metadata are complete and self-consistent', () => {
  for (const slug of LANDING) {
    const $ = load(slug); const url = `${PROD}/${slug}.html`;
    assert.equal($('link[rel=canonical]').attr('href'), url, `${slug}: canonical`);
    assert.equal($('meta[property="og:url"]').attr('content'), url, `${slug}: og:url`);
    for (const p of ['og:title', 'og:description', 'og:image', 'og:type', 'og:site_name']) assert.ok($(`meta[property="${p}"]`).attr('content'), `${slug}: ${p}`);
    for (const n of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) assert.ok($(`meta[name="${n}"]`).attr('content'), `${slug}: ${n}`);
    const img = $('meta[property="og:image"]').attr('content').replace(PROD, '');
    assert.ok(fs.existsSync(path.join(REPO, img)), `${slug}: og:image file`);
  }
});

test('sitemap: every landing page listed once with a valid lastmod; the sitemap index is fresh', () => {
  const xml = read('seo-sitemap.xml');
  const all = ['sitemap.xml', 'seo-sitemap.xml', 'needs-sitemap.xml', 'special-education-sitemap.xml', 'sign-language-sitemap.xml'].flatMap((f) => [...read(f).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  assert.equal(new Set(all).size, all.length, 'duplicate <loc> across sitemaps');
  for (const slug of LANDING) {
    const loc = `${PROD}/${slug}.html`;
    const m = xml.match(new RegExp(`<loc>${loc.replace(/\./g, '\\.')}</loc>\\s*<lastmod>([^<]+)</lastmod>`));
    assert.ok(m, `${slug}: missing from seo-sitemap.xml`);
    assert.match(m[1], /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(new Date(m[1]) <= new Date(), `${slug}: lastmod in the future`);
    assert.ok(fs.existsSync(path.join(REPO, `${slug}.html`)));
    const stamped = read(`${slug}.html`).match(/"dateModified":"([^"]+)"/)[1];
    assert.equal(m[1], stamped, `${slug}: lastmod must equal dateModified`);
  }
  const idx = read('sitemap-index.xml');
  const last = idx.match(/seo-sitemap\.xml<\/loc><lastmod>([^<]+)</)[1];
  assert.ok(last >= LANDING.map((s) => xml.match(new RegExp(`${s}\\.html</loc>\\s*<lastmod>([^<]+)`))[1]).sort().pop(), 'sitemap-index lastmod is behind');
  for (const loc of all.filter((l) => LANDING.some((s) => l.endsWith(`/${s}.html`)))) assert.ok(loc.startsWith(PROD));
});

test('JSON-LD parses; breadcrumbs are ordered; FAQPage exists only with matching visible FAQ', () => {
  for (const slug of LANDING) {
    const $ = load(slug); const url = `${PROD}/${slug}.html`;
    const blocks = $('script[type="application/ld+json"]').toArray().map((s) => JSON.parse($(s).text()));
    assert.ok(blocks.length >= 1, slug);
    const graph = blocks.flatMap((b) => (b['@graph'] ? b['@graph'] : [b]));
    const byType = (t) => graph.filter((g) => g['@type'] === t);
    assert.equal(byType('WebPage').length, 1, `${slug}: WebPage`);
    assert.equal(byType('WebPage')[0].url, url);
    assert.equal(byType('WebPage')[0].isAccessibleForFree, true);
    const bc = byType('BreadcrumbList')[0]; assert.ok(bc, `${slug}: breadcrumb`);
    bc.itemListElement.forEach((it, i) => assert.equal(it.position, i + 1));
    assert.equal(bc.itemListElement.at(-1).item, url);
    assert.equal($('nav.crumb li').length, bc.itemListElement.length, `${slug}: visible breadcrumb = schema breadcrumb`);
    const faq = byType('FAQPage');
    const visible = $('.faq details').toArray().map((d) => $(d).find('summary').text().trim());
    if (faq.length) {
      assert.deepEqual(faq[0].mainEntity.map((q) => q.name), visible, `${slug}: FAQ schema must equal visible FAQ`);
      faq[0].mainEntity.forEach((q) => assert.ok(q.acceptedAnswer.text.length > 40, `${slug}: FAQ answer too thin`));
    } else assert.equal(visible.length, 0, `${slug}: visible FAQ without schema is fine, but keep them in sync`);
  }
});

test('heading hierarchy has no skipped levels', () => {
  for (const slug of LANDING) {
    const $ = load(slug); let prev = 0;
    $('main h1,main h2,main h3,main h4').each((_, el) => {
      const lvl = Number(el.tagName[1]);
      assert.ok(prev === 0 || lvl <= prev + 1, `${slug}: h${prev} → h${lvl}`);
      prev = lvl;
    });
  }
});

test('internal links resolve (files, real routes, in-page anchors) and every page has functional CTAs', () => {
  for (const slug of LANDING) {
    const $ = load(slug); const ids = new Set($('[id]').toArray().map((e) => $(e).attr('id')));
    const bad = [];
    $('a[href]').each((_, a) => {
      const h = $(a).attr('href');
      if (h.startsWith('#')) { if (!ids.has(h.slice(1))) bad.push(h); return; }
      if (/^https?:\/\//.test(h) && !h.startsWith(PROD)) return;
      if (!resolves(h)) bad.push(h);
    });
    assert.deepEqual(bad, [], `${slug}: broken internal links`);
    const fn = $('a[href]').toArray().map((a) => $(a).attr('href')).filter((h) => /^\/(study\.html|xartis-ylis\.html|teacher-assistant\.html|fyllo-axiologisis-ai\.html|(primary|middle|high)\/(guardian|student)\/(quiz|tutor|prompts|tools))/.test(h));
    assert.ok(fn.length >= 3, `${slug}: needs functional CTAs, found ${fn.length}`);
    assert.ok($('.cta .btn').length >= 2, `${slug}: final CTA`);
    assert.ok($('a[href][rel~=noopener]').length >= 0);
  }
});

test('every tool card is a real dataset tool with a real tool page; deep links use only real routes', () => {
  const d = loadData();
  for (const slug of LANDING) {
    const $ = load(slug);
    $('.tool-card h4').each((_, h) => {
      const a = $(h).find('a'); const name = $(h).text().trim();
      const tool = Object.values(d.TOOLS).find((t) => t.name === name);
      assert.ok(tool, `${slug}: unknown tool "${name}"`);
      if (a.length) assert.equal(a.attr('href'), `/tools/${tool.id}.html`);
    });
    $('a[href*="/tutor?"]').each((_, a) => {
      const u = new URL($(a).attr('href'), PROD);
      assert.match(u.pathname, ROUTE);
      const [, zone, role] = u.pathname.match(ROUTE);
      if (zone !== 'high') assert.equal(role, 'guardian', `${slug}: primary/middle student tutor is not available, use the parent role`);
      assert.ok(u.searchParams.get('grade'), `${slug}: deep link needs a grade`);
    });
  }
});

test('content is substantial, natural and not duplicated between pages', () => {
  const shingles = {}; const stats = [];
  for (const slug of LANDING) {
    const $ = load(slug); const w = words($);
    assert.ok(w.length >= 650, `${slug}: only ${w.length} words`);
    const lc = w.map((x) => x.toLowerCase().replace(/[^\p{L}]/gu, '')).filter(Boolean);
    // Generated data listings (e.g. 35 "Τεχνικός …" specialties) are catalog data, not prose: exclude them from the stuffing check.
    const $p = load(slug); $p('.disclosure').remove();
    const prose = words($p).map((x) => x.toLowerCase().replace(/[^\p{L}]/gu, '')).filter(Boolean);
    const freq = {}; prose.filter((x) => x.length > 3).forEach((x) => (freq[x] = (freq[x] || 0) + 1));
    const [top, n] = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
    assert.ok(n / prose.length < 0.035, `${slug}: "${top}" is ${(100 * n / prose.length).toFixed(1)}% of words (keyword stuffing?)`);
    const set = new Set(); for (let i = 0; i + 6 <= lc.length; i++) set.add(lc.slice(i, i + 6).join(' '));
    shingles[slug] = set; stats.push([slug, w.length]);
  }
  const slugs = Object.keys(shingles); let worst = ['', 0];
  for (let i = 0; i < slugs.length; i++) for (let j = i + 1; j < slugs.length; j++) {
    const a = shingles[slugs[i]], b = shingles[slugs[j]]; let inter = 0; for (const s of a) if (b.has(s)) inter++;
    const sim = inter / Math.min(a.size, b.size); if (sim > worst[1]) worst = [`${slugs[i]} ~ ${slugs[j]}`, sim];
  }
  assert.ok(worst[1] < 0.2, `near-duplicate content: ${worst[0]} ${(worst[1] * 100).toFixed(0)}%`);
});

test('the new pages against the existing four SEO pages: distinct titles and no shared H1 phrase', () => {
  const existing = ['ai-ergaleia-gia-mathites', 'ai-gia-dimotiko', 'ai-gia-gymnasio', 'asfales-ai-gia-paidia'];
  for (const e of existing) {
    const t = cheerio.load(read(`${e}.html`))('title').text();
    for (const slug of LANDING) assert.notEqual(load(slug)('title').text(), t);
  }
});

test('discoverability: no orphan pages, hub is linked, homepage is not stuffed with SEO links', () => {
  const inbound = Object.fromEntries(LANDING.map((s) => [s, new Set()]));
  for (const abs of walkHtml()) {
    const p = rel(abs); const $ = cheerio.load(fs.readFileSync(abs, 'utf8'));
    $('a[href]').each((_, a) => {
      const h = ($(a).attr('href') || '').split('#')[0].split('?')[0];
      const s = h.replace(/^\//, '').replace(/\.html$/, '');
      if (inbound[s] && p !== `/${s}.html`) inbound[s].add(p);
    });
  }
  for (const s of LANDING) assert.ok(inbound[s].size >= 2, `${s}: only ${inbound[s].size} inbound link source(s): ${[...inbound[s]]}`);
  const home = cheerio.load(read('index.html'));
  const homeLinks = home('a[href]').toArray().map((a) => home(a).attr('href')).filter((h) => LANDING.some((s) => h.includes(s)) || h === '/ai-ergaleia-gia-mathites.html');
  assert.ok(homeLinks.length <= 1, `homepage must not list SEO pages: ${homeLinks}`);
  assert.equal(homeLinks[0], '/ai-ergaleia-gia-mathites.html');
});

test('claims stay honest: only shipped features are named, limits are stated', () => {
  const t = (s) => load(s)('main').text().replace(/\s+/g, ' ');
  assert.match(t('ai-gia-xenes-glosses'), /καλύπτει σήμερα\s+Αγγλικά/, 'must state foreign-language scope is English');
  assert.match(t('ai-gia-fysiki-chimeia'), /Χημεία Λυκείου[^.]*δεν έχει ακόμη ξεχωριστή διαδρομή/, 'must disclose the Lyceum chemistry gap');
  assert.match(t('ai-gia-epal'), /Ο κεντρικός\s+Χάρτης Ύλης παραμένει για Δημοτικό, Γυμνάσιο και ΓΕΛ/);
  assert.match(t('ai-gia-ekpaideftikous'), /Δεν πρόκειται για νομική συμβουλή/);
  for (const s of LANDING) assert.doesNotMatch(t(s), /Khanmigo|εγγυάται 100%|100% ασφαλές|ΑΕΙ[^.]*πλήρης κάλυψη/i, s);
  assert.match(t('ai-gia-lykeio'), /μερική/);
});
