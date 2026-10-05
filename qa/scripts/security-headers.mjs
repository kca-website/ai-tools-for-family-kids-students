// LIVE check of security headers, HTTPS/www redirects and CORS of the API.
// Report-only CSP is treated as a warning (staged hardening), not a production outage.
import { write, PROD } from './lib.mjs';
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const BASE = (args.base || process.env.BASE_URL || PROD).replace(/\/$/, '');
const host = new URL(BASE).host; const apex = host.replace(/^www\./, '');
const results = { base: BASE, generatedAt: new Date().toISOString(), pages: {}, redirects: [], cors: [], findings: [], warnings: [] };
const get = async (url, opts = {}) => { try { const r = await fetch(url, { redirect: 'manual', ...opts }); const body = opts.method === 'HEAD' ? '' : (await r.text()).slice(0, 300); return { status: r.status, headers: Object.fromEntries(r.headers.entries()), body }; } catch (e) { return { error: String(e.cause?.code || e.message) }; } };
const blocked = (r) => r.error || /Host not in allowlist/i.test(r.body || '');

const REQUIRED = {
  'strict-transport-security': (v) => /max-age=(\d+)/.test(v) && Number(v.match(/max-age=(\d+)/)[1]) >= 15552000,
  'x-content-type-options': (v) => /nosniff/i.test(v),
  'referrer-policy': (v) => /(no-referrer|strict-origin|same-origin|origin)/i.test(v),
  'permissions-policy': (v) => /(camera|microphone|geolocation)/i.test(v),
  'x-frame-options': (v, h) => /(DENY|SAMEORIGIN)/i.test(v) || /frame-ancestors/i.test(h['content-security-policy'] || ''),
};
for (const p of ['/', '/study.html', '/privacy-policy.html', '/xartis-ylis.html']) {
  const r = await get(BASE + p);
  if (blocked(r)) { console.error(`✖ ${BASE}${p} unreachable/blocked (${r.error || 'allow-list'})`); write('security-headers.json', { ...results, unreachable: true }); process.exit(2); }
  const missing = Object.entries(REQUIRED).filter(([h, ok]) => !r.headers[h] || !ok(r.headers[h], r.headers)).map(([h]) => h);
  const csp = r.headers['content-security-policy'] || '';
  const cspRO = r.headers['content-security-policy-report-only'] || '';
  if (!csp && cspRO) results.warnings.push(`${p}: CSP is report-only (staged, not enforced)`);
  else if (!csp && !cspRO) results.findings.push(`${p}: missing content-security-policy`);
  results.pages[p] = { status: r.status, missing, cspMode: csp ? 'enforced' : cspRO ? 'report-only' : 'missing', present: Object.fromEntries([...Object.keys(REQUIRED), 'content-security-policy', 'content-security-policy-report-only'].map((h) => [h, r.headers[h] || null])), server: r.headers.server, cacheControl: r.headers['cache-control'] };
  for (const h of missing) results.findings.push(`${p}: missing/weak ${h}`);
}

const nf = await get(BASE + '/definitely-not-a-page-' + Date.now());
results.notFoundStatus = nf.status;
if (nf.status !== 404) results.findings.push(`unknown URL returns ${nf.status} (expected 404)`);

async function followsToCanonical(from) {
  let cur = from; const chain = [];
  for (let i = 0; i < 4; i++) {
    const r = await get(cur); const loc = r.headers?.location || '';
    chain.push({ from: cur, status: r.status, location: loc, error: r.error });
    if (r.error) return { ok: false, chain, error: r.error };
    if (!(r.status >= 300 && r.status < 400) || !loc) return { ok: cur.replace(/\/$/, '') === BASE, chain };
    cur = new URL(loc, cur).toString();
    if (cur.replace(/\/$/, '') === BASE) return { ok: true, chain };
  }
  return { ok: false, chain };
}
for (const from of [`http://${host}/`, `http://${apex}/`, `https://${apex}/`]) {
  const rr = await followsToCanonical(from);
  results.redirects.push({ from, ok: rr.ok, chain: rr.chain });
  if (!rr.ok && !rr.error) results.findings.push(`redirect ${from} does not reach ${BASE}`);
}

for (const api of ['/api/tutor-assistant', '/api/teacher-assistant']) {
  const g = await get(BASE + api, { headers: { Origin: 'https://evil.example' } });
  const o = await get(BASE + api, { method: 'OPTIONS', headers: { Origin: 'https://evil.example', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type' } });
  const acao = g.headers?.['access-control-allow-origin'] || null;
  results.cors.push({ api, getStatus: g.status, acao, optionsStatus: o.status, optionsAcao: o.headers?.['access-control-allow-origin'] || null, cacheControl: g.headers?.['cache-control'] });
  if (acao === '*' || o.headers?.['access-control-allow-origin'] === '*') results.findings.push(`${api}: CORS allows any origin (*)`);
}
write('security-headers.json', results);
console.log(JSON.stringify({ findings: results.findings, warnings: results.warnings }, null, 1));
for (const w of results.warnings) console.log(`::warning::${w}`);
process.exit(results.findings.length ? 1 : 0);
