// Runs scripts/ai-smoke.mjs against the real handlers with a mocked provider – proves the smoke script itself works and respects the cap.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { QA_DIR } from '../scripts/lib.mjs';
const RESULTS = fs.mkdtempSync(path.join(os.tmpdir(), 'qa-aismoke-'));
import { startMockApi } from '../scripts/mock-api-server.mjs';

const run = (base, extra = []) => new Promise((resolve) => { const c = spawn('node', ['scripts/ai-smoke.mjs', `--base=${base}`, ...extra], { cwd: QA_DIR, env: { ...process.env, QA_RESULTS_DIR: RESULTS } }); let out = ''; c.stdout.on('data', (d) => (out += d)); c.stderr.on('data', (d) => (out += d)); c.on('close', (code) => resolve({ code, out })); });
test('ai-smoke passes against healthy (mock) backend, uses ≤ 30 requests, 2 provider calls', async () => {
  const api = await startMockApi(); const r = await run(api.url, ['--guardrails', '--ratelimit-probe']); api.close();
  const j = JSON.parse(fs.readFileSync(path.join(RESULTS, 'ai-smoke.json'), 'utf8'));
  assert.equal(r.code, 0, r.out); assert.ok(j.requestsUsed <= 30, 'used ' + j.requestsUsed); assert.ok(api.stats.providerCalls <= 6, 'provider calls ' + api.stats.providerCalls);
  assert.ok(j.warnings.some((w) => /no limiter observed/.test(w)), 'rate-limit probe reports absence of limiter');
});
test('ai-smoke fails (exit 1) when providers are down', async () => {
  const api = await startMockApi({ providerMode: '500' }); const r = await run(api.url); api.close();
  assert.equal(r.code, 1, r.out); assert.match(r.out, /tutor: real answer/);
});
test('ai-smoke exits 2 when the base URL is unreachable', async () => { const r = await run('http://127.0.0.1:1'); assert.equal(r.code, 2, r.out); });
