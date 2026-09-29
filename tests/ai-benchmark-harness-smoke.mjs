// Guards the offline AI benchmark: it must keep replaying the real /api/tutor-assistant handler.
// Mock mode only: no network, no provider call, no Neurons.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-bench-'));
const env = { ...process.env };
delete env.CLOUDFLARE_LLM_ACCOUNT_ID;
delete env.CLOUDFLARE_LLM_AI_TOKEN;
delete env.GROQ_API_KEY;

const { fixtures } = JSON.parse(fs.readFileSync(path.join(root, 'benchmark/fixtures.json'), 'utf8'));
assert.equal(fixtures.length, 80, 'benchmark must keep 4 subjects x 5 topics x 4 tasks');
for (const f of fixtures) {
  assert.equal(f.payload.audience, 'study_user');
  assert.equal(f.payload.documentKind, 'official_schoolbook', 'fixtures must use server-resolved official sources');
  assert.ok(f.payload.subjectId && f.payload.topic, 'fixtures need subjectId + topic');
}
const glossa = fixtures.filter(f => f.subject === 'glossa');
assert.equal(glossa.length, 20, 'Greek Language keeps 5 topics x 4 tasks');
assert.ok(glossa.every(f => f.payload.subjectId === 'glossa-b-gymnasiou'), 'benchmark Greek Language must use B Gymnasium official source');
assert.ok(glossa.every(f => f.caseId.startsWith('glossa-b:')), 'Greek Language B cases need fresh ids so obsolete A Gym failures are not resumed');

execFileSync(process.execPath, [path.join(root, 'benchmark/run.mjs'), '--phase', '1', '--mock',
  '--models', '@cf/qwen/qwen3-30b-a3b-fp8,@cf/google/gemma-4-26b-a4b-it', '--out', out], { env, stdio: 'pipe' });

const summary = fs.readFileSync(path.join(out, 'summary.csv'), 'utf8').trim().split('\n');
assert.equal(summary.length, 1 + 2 * 4, 'one summary row per model x task');
for (const row of summary.slice(1)) assert.match(row, /,8,100%,100%,0,0,/, 'mock runs must pass through the real handler: ' + row);
const blind = fs.readFileSync(path.join(out, 'blind.csv'), 'utf8');
assert.doesNotMatch(blind, /@cf\//, 'blind file must not reveal model ids');
assert.ok(fs.readFileSync(path.join(out, 'blind-key.csv'), 'utf8').includes('@cf/qwen/'), 'key file maps blind ids to models');
const harnessSource = fs.readFileSync(path.join(root, 'benchmark/run.mjs'), 'utf8');
assert.match(harnessSource, /@cf\/google\/gemma-4-26b-a4b-it/);
assert.match(harnessSource, /enable_thinking:\s*false/);
assert.match(harnessSource, /if \(r\.httpStatus === 200\) done\.add/, 'failed provider/source calls must be retryable on resume');
assert.match(harnessSource, /providerEnvelopeSuccess/, 'failed provider calls need response-shape diagnostics');
assert.match(harnessSource, /currentCaseIds\.has\(r\.caseId\)/, 'reports must ignore obsolete fixture cases');

execFileSync(process.execPath, [path.join(root, 'benchmark/run.mjs'), '--phase', 'safety', '--mock',
  '--models', '@cf/openai/gpt-oss-120b', '--out', out + '-safety'], { env, stdio: 'pipe' });
const safetyRows = fs.readFileSync(path.join(out + '-safety', 'raw.jsonl'), 'utf8').trim().split('\n');
assert.equal(safetyRows.length, 14, '14 safety prompts');

const safetyLayerOut = path.join(root, 'benchmark/results/safety-layer');
try { fs.rmSync(safetyLayerOut, { recursive: true, force: true }); } catch {}
execFileSync(process.execPath, [path.join(root, 'benchmark/safety-layer.mjs'), '--mock'], { env, stdio: 'pipe' });
const safetyLayerRows = JSON.parse(fs.readFileSync(path.join(safetyLayerOut, 'raw.json'), 'utf8'));
assert.equal(safetyLayerRows.length, 16, 'safety-layer benchmark keeps Greek/Greeklish + file cases');
assert.ok(safetyLayerRows.some(r => r.kind === 'document' && r.chunks > 1), 'long untrusted file input must exercise chunking');
assert.ok(safetyLayerRows.every(r => r.promptGuardPass === true), 'mock Prompt Guard labels must match expectations');

const vercelignore = fs.readFileSync(path.join(root, '.vercelignore'), 'utf8');
assert.match(vercelignore, /^benchmark$/m, 'benchmark tooling must not be deployed');
console.log('AI benchmark harness smoke passed (mock, real handler, blind output, safety + safety-layer sets).');
