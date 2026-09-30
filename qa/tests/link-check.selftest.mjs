// Self-test of scripts/link-check.mjs against a local server with known behaviours (no internet needed).
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import os from 'node:os';
import { QA_DIR } from '../scripts/lib.mjs';
const RESULTS = fs.mkdtempSync(path.join(os.tmpdir(), 'qa-linkcheck-'));

test('link checker classifies ok / redirect / 404 / 500 / HEAD-405 fallback / 403 / dead port / allow-list block', async () => {
  const srv = http.createServer((req, res) => {
    const u = req.url;
    if (u === '/robots.txt') { res.end('ok'); return; }
    if (u === '/ok') { res.end('ok'); return; }
    if (u === '/redir') { res.writeHead(301, { Location: '/ok' }); res.end(); return; }
    if (u === '/gone') { res.writeHead(404); res.end('nope'); return; }
    if (u === '/boom') { res.writeHead(500); res.end('x'); return; }
    if (u === '/head405') { if (req.method === 'HEAD') { res.writeHead(405); return res.end(); } res.end('ok'); return; }
    if (u === '/bot403') { res.writeHead(403); res.end('bot wall'); return; }
    if (u === '/allowlist') { res.writeHead(403); res.end('Host not in allowlist: x. Add this host to your network egress'); return; }
    if (u === '/vid.webm') { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end('<html>soft error</html>'); return; }
    if (u === '/good.webm') { res.writeHead(200, { 'Content-Type': 'video/webm' }); res.end('x'); return; }
    if (u === '/slow') { setTimeout(() => res.end('late'), 3000); return; }
    res.writeHead(404); res.end();
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const list = ['/ok', '/redir', '/gone', '/boom', '/head405', '/bot403', '/allowlist', '/slow', '/vid.webm', '/good.webm'].map((p) => base + p).concat(['http://127.0.0.1:1/dead']);
  const f = path.join(RESULTS, 'selftest-targets.json'); fs.writeFileSync(f, JSON.stringify(list));
  // async spawn so the local server keeps serving
  const { spawn } = await import('node:child_process');
  await new Promise((resolve) => { const c = spawn('node', ['scripts/link-check.mjs', `--targets=${f}`, `--base=${base}`, '--timeout=1000', '--retries=0'], { cwd: QA_DIR, env: { ...process.env, QA_RESULTS_DIR: RESULTS } }); c.on('close', resolve); c.stdout.on('data', () => {}); c.stderr.on('data', () => {}); });
  srv.close();
  const out = JSON.parse(fs.readFileSync(path.join(RESULTS, 'links-other.json'), 'utf8'));
  const by = Object.fromEntries(out.all.map((r) => [r.url.replace(base, '') || r.url, r.class]));
  assert.equal(by['/ok'], 'ok'); assert.equal(by['/redir'], 'redirect'); assert.equal(by['/gone'], 'broken'); assert.equal(by['/boom'], 'server-error');
  assert.equal(by['/head405'], 'ok', 'HEAD 405 must fall back to GET'); assert.equal(by['/bot403'], 'blocked-or-auth'); assert.equal(by['/allowlist'], 'egress-blocked');
  assert.equal(by['/vid.webm'], 'broken', 'video URL answering 200 text/html is broken'); assert.equal(by['/good.webm'], 'ok');
  assert.ok(['network-error', 'dead-domain'].includes(by['/slow']), 'timeout is reported: ' + by['/slow']);
  assert.ok(['network-error', 'dead-domain'].includes(by['http://127.0.0.1:1/dead']));
});
