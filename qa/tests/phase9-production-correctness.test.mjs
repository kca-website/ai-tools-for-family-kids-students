import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const read = (p) => fs.readFileSync(path.join(repo, p), 'utf8');

test('CFG-01 uses modern routing so redirects and global headers can apply', () => {
  const cfg = JSON.parse(read('vercel.json'));
  assert.equal(cfg.routes, undefined, 'legacy routes must not coexist with redirects/headers');

  assert.ok(Array.isArray(cfg.rewrites));
  assert.ok(cfg.rewrites.some((r) =>
    r.source.includes('(primary|middle|high)') && r.destination === '/'
  ));
  assert.ok(cfg.rewrites.some((r) =>
    r.source === '/preschool' && r.destination === '/preschool.html'
  ));

  const redirect = cfg.redirects?.find((r) => r.source === '/index.html');
  assert.equal(redirect?.destination, '/');
  assert.equal(redirect?.permanent, true);

  const globalHeaders = cfg.headers?.find((r) => r.source === '/(.*)')?.headers || [];
  const headerNames = new Set(globalHeaders.map((h) => h.key.toLowerCase()));
  for (const required of [
    'x-content-type-options',
    'x-frame-options',
    'referrer-policy',
    'permissions-policy',
    'content-security-policy-report-only'
  ]) {
    assert.ok(headerNames.has(required), `missing global security header: ${required}`);
  }

  const robots = cfg.headers?.find((r) => r.source.includes('(primary|middle|high)'));
  assert.ok(robots?.headers?.some((h) => h.key === 'X-Robots-Tag' && h.value === 'noindex, follow'));

  const assets = cfg.headers?.find((r) => r.source === '/assets/(.*)');
  assert.ok(assets?.headers?.some((h) => h.key === 'Cache-Control' && h.value.includes('immutable')));
});


test('homepage boot guard is active before the first visual paint', () => {
  const html = read('index.html');
  const headStart = html.indexOf('<head>');
  const styles = html.indexOf('<link rel="stylesheet" href="/styles.css"');
  const earlyBoot = html.indexOf('document.documentElement.classList.add("navigator-home-booting")');
  const guardCss = html.indexOf('html.navigator-home-booting #zoneSelectView{visibility:hidden!important;}');

  assert.ok(headStart >= 0 && earlyBoot > headStart, 'homepage boot class must be set in the document head');
  assert.ok(styles > earlyBoot, 'boot class must be set before external site styles can paint the legacy homepage');
  assert.ok(guardCss > earlyBoot, 'first-paint guard CSS must exist');
});

test('view switcher uses button-group semantics instead of incomplete ARIA tabs', () => {
  const html = read('index.html');
  const app = read('app.js');
  const pwa = read('pwa.js');

  assert.match(html, /<div class="view-tabs" id="viewTabs" role="group" aria-label="Επιλογές προβολής">/);
  assert.doesNotMatch(html, /id="viewTabs" role="tablist"/);

  const start = app.indexOf('[els.viewTabTools, "tools"]');
  const end = app.indexOf('// ---------- Rendering: Guide', start);
  assert.ok(start >= 0 && end > start, 'view switcher state block not found');
  const block = app.slice(start, end);

  assert.match(block, /aria-pressed/);
  assert.doesNotMatch(block, /setAttribute\("role", "tab"\)/);
  assert.doesNotMatch(block, /setAttribute\("aria-selected"/);
  assert.doesNotMatch(pwa, /getElementById\("viewTabs"\)\?\.removeAttribute\("role"\)/);
});

const require = createRequire(import.meta.url);
const activityPII = require(path.join(repo, 'api/preschool-activity.js'))._phase9Test?.looksLikePersonalData;
const imagePII = require(path.join(repo, 'api/preschool-image.js'))._phase9Test?.looksLikePersonalData;

for (const [name, check] of [['activity', activityPII], ['image', imagePII]]) {
  test(`API-06 ${name} PII filter catches Greek inflections and accentless input`, () => {
    assert.equal(typeof check, 'function');

    const positives = [
      'η διεύθυνση μου είναι εδώ',
      'η διευθυνση μου ειναι εδω',
      'το τηλέφωνό μου είναι 2100000000',
      'το τηλεφωνο μου',
      'το κινητό μου',
      'το κινητου μου',
      'το κινητά μας',
      'ονομάζεται Νίκος',
      'λεγεται Μαρία',
      'email example@test.gr',
      '6971234567'
    ];
    for (const value of positives) {
      assert.equal(check(value), true, `expected PII match for: ${value}`);
    }

    const negatives = [
      'δεινόσαυροι και αριθμοί μέχρι το 5',
      'κινητική δραστηριότητα με μουσική',
      'ο διευθυντής οργανώνει μια γιορτή',
      'ρομπότ που χορεύει'
    ];
    for (const value of negatives) {
      assert.equal(check(value), false, `unexpected PII match for: ${value}`);
    }
  });
}
