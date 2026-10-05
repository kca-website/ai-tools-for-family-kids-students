// External + internal link checker.
// External links are reported for maintenance but do not fail scheduled QA by default,
// because many providers block bots or return route-specific 4xx to automated requests.
// Use --strict-external to make confirmed external failures fail the command.
import fs from 'node:fs';
import path from 'node:path';
import { REPO, RESULTS, PROD, walkHtml, rel, write } from './lib.mjs';

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const BASE = (args.base || process.env.BASE_URL || PROD).replace(/\/$/, '');
const TIMEOUT = Number(args.timeout || 15000);
const RETRIES = Number(args.retries || 2);
const PER_HOST = Number(args['per-host'] || 3);
const STRICT_EXTERNAL = Boolean(args['strict-external']);
const UA = 'Mozilla/5.0 (compatible; aitools4kids-linkcheck/1.1; +https://www.aitools4kids.gr/report-error.html)';

// ---------- extraction ----------
const URL_RE = /https?:\/\/[^\s"'`<>)\\\]}]+/g;
const clean = (u) => u.replace(/[.,;:!?]+$/, '').replace(/&amp;/g, '&');
// API endpoints are operational targets, not user-facing hyperlinks. They are tested by ai-smoke.mjs.
const SKIP_HOST = /^(www\.w3\.org|schema\.org|localhost|127\.0\.0\.1|example\.com|cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com|js\.puter\.com|api\.groq\.com|generativelanguage\.googleapis\.com)$/;
const sources = new Map();
function add(u, file) {
  u = clean(u); let h; try { h = new URL(u).hostname; } catch { return; }
  if (SKIP_HOST.test(h) || /\$\{|{{/.test(u)) return;
  if (!sources.has(u)) sources.set(u, new Set()); sources.get(u).add(file);
}
const dirs = ['tools', 'en'].flatMap((d) => fs.existsSync(path.join(REPO, d)) ? fs.readdirSync(path.join(REPO, d)).map((f) => path.join(REPO, d, f)) : []);
const files = [...fs.readdirSync(REPO).filter((f) => /\.(js|html|webmanifest)$/.test(f)).map((f) => path.join(REPO, f)), ...dirs];
for (const f of files) { const txt = fs.readFileSync(f, 'utf8'); const name = path.relative(REPO, f); for (const m of txt.matchAll(URL_RE)) add(m[0], name); }
function bucket(u, srcs) {
  const s = [...srcs];
  if (s.some((f) => /^sign-language/.test(f)) || /prosvasimo\.iep\.edu\.gr|commons\.wikimedia\.org|upload\.wikimedia\.org/.test(u)) return 'sl';
  if (s.some((f) => /^(data|special-education-support-tools-data|accessibility-data)\.js$|^tools\//.test(f)) && !/(ebooks\.edu\.gr|iep\.edu\.gr|minedu\.gov\.gr)/.test(u)) return 'tools';
  if (/(ebooks\.edu\.gr|iep\.edu\.gr|minedu\.gov\.gr|eur-lex|europa\.eu|law\.uoa\.gr|dide\.|\.sch\.gr|esos\.gr)/.test(u)) return 'official';
  return 'other';
}
let targets = [...sources.entries()].filter(([u]) => new URL(u).hostname !== new URL(BASE).hostname).map(([url, srcs]) => ({ url, bucket: bucket(url, srcs), sources: [...srcs].slice(0, 4) }));
if (args.targets) targets = JSON.parse(fs.readFileSync(args.targets, 'utf8')).map((u) => ({ url: u, bucket: 'other', sources: ['--targets'] }));
if (args.only) targets = targets.filter((t) => t.bucket === args.only);
if (args.limit) targets = targets.slice(0, Number(args.limit));

// ---------- checker ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function once(url, method) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), TIMEOUT);
  try {
    const r = await fetch(url, { method, redirect: 'manual', signal: ctl.signal, headers: { 'User-Agent': UA, Accept: '*/*', ...(method === 'GET' ? { Range: 'bytes=0-2048' } : {}) } });
    let body = '';
    if ([400, 401, 403, 407, 404].includes(r.status)) { try { body = (await r.text()).slice(0, 300); } catch {} } else { try { await r.body?.cancel(); } catch {} }
    return { status: r.status, location: r.headers.get('location') || '', body, contentType: r.headers.get('content-type') || '' };
  } finally { clearTimeout(t); }
}
const EGRESS_RE = /Host not in allowlist|egress|proxy.*(denied|forbidden)/i;
const dnsLike = (e) => /ENOTFOUND|EAI_AGAIN|ECONNREFUSED|CERT|certificate|ERR_TLS/i.test(String(e?.cause?.code || e?.cause?.message || e?.message || ''));
const looksLikeRawAsset = (url) => {
  const u = new URL(url);
  // Commons /wiki/File:*.jpg is an HTML description page, not a raw image.
  if (/commons\.wikimedia\.org$/i.test(u.hostname) && /^\/wiki\/File:/i.test(u.pathname)) return false;
  return /\.(webm|mp4|png|jpe?g|svg|webp|pdf)$/i.test(u.pathname);
};
async function check(url) {
  const chain = []; let cur = url; let last = null;
  for (let hop = 0; hop < 6; hop++) {
    let res = null, err = null;
    for (let attempt = 0; attempt <= RETRIES && !res; attempt++) {
      for (const method of ['HEAD', 'GET']) {
        try { res = await once(cur, method); if (![405, 501, 403, 400].includes(res.status) || method === 'GET') break; } catch (e) { err = e; res = null; }
      }
      if (!res) await sleep(500 * 2 ** attempt);
    }
    if (!res) return { url, ok: false, class: dnsLike(err) ? 'dead-domain' : 'network-error', error: String(err?.cause?.code || err?.name || err).slice(0, 100), chain };
    last = res;
    if (EGRESS_RE.test(res.body || '')) return { url, ok: false, class: 'egress-blocked', status: res.status, error: 'blocked by runner network allow-list – NOT checked', chain };
    if (res.status >= 300 && res.status < 400 && res.location) { const next = new URL(res.location, cur).toString(); chain.push({ status: res.status, to: next }); cur = next; continue; }
    break;
  }
  const s = last.status;
  const EXPECT_CT = { webm: /^video\//, mp4: /^video\//, png: /^image\//, jpg: /^image\//, jpeg: /^image\//, svg: /^image\//, webp: /^image\//, pdf: /pdf/ };
  const ext = (new URL(cur).pathname.split('.').pop() || '').toLowerCase();
  if (s < 300 && looksLikeRawAsset(cur) && EXPECT_CT[ext] && last.contentType && !EXPECT_CT[ext].test(last.contentType)) {
    return { url, ok: false, status: s, class: 'broken', error: `200 but content-type ${last.contentType} (expected ${ext})`, chain: chain.length ? chain : undefined };
  }
  const klass = s < 300 ? (chain.length ? 'redirect' : 'ok') : s === 429 ? 'rate-limited' : s === 403 || s === 401 || s === 999 ? 'blocked-or-auth' : s >= 500 ? 'server-error' : 'broken';
  return { url, ok: s < 400 || [401, 403, 429, 999].includes(s), status: s, class: klass, finalUrl: chain.length ? cur : undefined, chain: chain.length ? chain : undefined, httpToHttps: chain.length === 1 && /^https:/.test(cur) && /^http:/.test(url) };
}

async function runPool(items) {
  const byHost = {}; const out = []; let idx = 0; let cur = 0;
  const worker = async () => {
    while (idx < items.length) {
      const it = items[idx++]; const h = new URL(it.url).hostname;
      while ((byHost[h] || 0) >= PER_HOST) await sleep(100);
      byHost[h] = (byHost[h] || 0) + 1;
      try { out.push({ ...it, ...(await check(it.url)) }); } finally { byHost[h]--; }
      if (++cur % 50 === 0) process.stderr.write(`  ${cur}/${items.length}\n`);
    }
  };
  await Promise.all(Array.from({ length: Number(args.concurrency || 16) }, worker));
  return out;
}

// ---------- internal links (against BASE) ----------
async function internal() {
  const rows = []; const seen = new Set();
  for (const abs of walkHtml()) { const p = rel(abs); if (!seen.has(p)) { seen.add(p); rows.push({ url: BASE + p, source: p }); } }
  for (const f of fs.readdirSync(REPO).filter((f) => /sitemap.*\.xml$/.test(f))) {
    for (const m of fs.readFileSync(path.join(REPO, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
      if (!seen.has(m[1])) { seen.add(m[1]); rows.push({ url: m[1].replace(PROD, BASE), source: f }); }
    }
  }
  rows.push({ url: BASE + '/social-preview-20260926.png', source: 'og:image' }, { url: BASE + '/robots.txt', source: 'robots' }, { url: BASE + '/sitemap-index.xml', source: 'robots' });
  return runPool(rows.map((r) => ({ ...r, bucket: 'internal' })));
}

// ---------- main ----------
const summary = { generatedAt: new Date().toISOString(), base: BASE, strictExternal: STRICT_EXTERNAL, totals: {} };
const probe2 = await once(BASE + '/robots.txt', 'GET').catch(() => null);
const probe = await check('https://www.iep.edu.gr/').catch(() => ({ ok: false, class: 'network-error' }));
const blocked = (r) => !r || EGRESS_RE.test(r.body || '') || r.class === 'egress-blocked' || r.class === 'network-error' || r.class === 'dead-domain';
if (blocked(probe2) && blocked(probe)) {
  console.error(`✖ network unreachable / blocked by allow-list (cannot reach ${BASE} nor an external probe host). Extracted ${targets.length} external URLs but did not check them.`);
  write('links-extracted.json', targets);
  process.exit(args['offline-ok'] ? 0 : 2);
}
const results = await runPool(targets);
const groups = { sl: 'links-sign-language.json', tools: 'links-tools-catalog.json', official: 'links-official-sources.json', other: 'links-other.json' };
for (const [b, f] of Object.entries(groups)) {
  const rows = results.filter((r) => r.bucket === b);
  if (!rows.length && args.only && args.only !== b) continue;
  const count = (c) => rows.filter((r) => r.class === c).length;
  const s = { total: rows.length, ok: count('ok'), redirect: count('redirect'), broken4xx: count('broken'), server5xx: count('server-error'), deadDomain: count('dead-domain'), egressBlocked: count('egress-blocked'), networkError: count('network-error'), blockedOrAuth: count('blocked-or-auth'), rateLimited: count('rate-limited') };
  summary.totals[b] = s;
  write(f, { summary: s, broken: rows.filter((r) => ['broken', 'server-error', 'dead-domain', 'network-error'].includes(r.class)), redirects: rows.filter((r) => r.class === 'redirect').map((r) => ({ url: r.url, finalUrl: r.finalUrl, chain: r.chain, sources: r.sources })), blockedOrAuth: rows.filter((r) => r.class === 'blocked-or-auth').map((r) => r.url), all: rows });
}
if (!args.only && !args.targets) {
  const ir = await internal(); const bad = ir.filter((r) => !r.ok);
  summary.totals.internal = { total: ir.length, broken: bad.length };
  write('links-internal.json', { summary: summary.totals.internal, broken: bad, all: ir });
}
write('links-summary.json', summary);

const externalConfirmed = results.filter((r) => ['broken', 'server-error', 'dead-domain'].includes(r.class)).length;
const externalUncertain = results.filter((r) => ['network-error', 'egress-blocked', 'blocked-or-auth', 'rate-limited'].includes(r.class)).length;
const internalBroken = summary.totals.internal?.broken || 0;
console.log(JSON.stringify(summary.totals, null, 1));
if (externalConfirmed || externalUncertain) {
  console.log(`::warning::External link maintenance: ${externalConfirmed} confirmed-looking failures, ${externalUncertain} unverified/blocked. See qa/results/links-*.json.`);
}
if (internalBroken) console.error(`✖ ${internalBroken} broken internal links`);
else console.log('✔ internal links OK');
if (STRICT_EXTERNAL && externalConfirmed) console.error(`✖ strict external mode: ${externalConfirmed} external failures`);
process.exit(internalBroken || (STRICT_EXTERNAL && externalConfirmed) ? 1 : 0);
