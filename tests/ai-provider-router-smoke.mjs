import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const router = fs.readFileSync(new URL('../ai-provider-router.js', import.meta.url), 'utf8');
const tutor = fs.readFileSync(new URL('../api/tutor-assistant.js', import.meta.url), 'utf8');
const teacher = fs.readFileSync(new URL('../api/teacher-assistant.js', import.meta.url), 'utf8');
const preschool = fs.readFileSync(new URL('../api/preschool-activity.js', import.meta.url), 'utf8');
const privacy = fs.readFileSync(new URL('../privacy-policy.html', import.meta.url), 'utf8');

assert.match(router, /AI_PROVIDER_ORDER \|\| 'cloudflare,groq'/);
assert.match(router, /api\.cloudflare\.com\/client\/v4\/accounts/);
assert.match(router, /api\.groq\.com\/openai\/v1\/chat\/completions/);
assert.match(router, /rejectIfBusy:\s*true/);
assert.match(router, /status === 429/);
assert.match(router, /CLOUDFLARE_LLM_AI_TOKEN/);
assert.match(router, /CLOUDFLARE_LLM_ACCOUNT_ID/);
assert.match(router, /GROQ_API_KEY/);
assert.doesNotMatch(router, /console\.log\(/);

for (const source of [tutor, teacher, preschool]) {
  assert.match(source, /generateChat/);
  assert.match(source, /getAiStatus/);
  assert.doesNotMatch(source, /fetch\('https:\/\/api\.groq\.com/);
}

assert.match(privacy, /Cloudflare Workers AI/);
assert.match(privacy, /Groq/);
assert.match(privacy, /εφεδρικ/);

// Runtime failover test: a retryable Cloudflare 429 must continue to Groq.
const originalFetch = globalThis.fetch;
const savedEnv = {
  CLOUDFLARE_LLM_ACCOUNT_ID: process.env.CLOUDFLARE_LLM_ACCOUNT_ID,
  CLOUDFLARE_LLM_AI_TOKEN: process.env.CLOUDFLARE_LLM_AI_TOKEN,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
};
process.env.CLOUDFLARE_LLM_ACCOUNT_ID = 'test-account';
process.env.CLOUDFLARE_LLM_AI_TOKEN = 'test-cloudflare-token';
process.env.GROQ_API_KEY = 'test-groq-token';

const calls = [];
globalThis.fetch = async (url) => {
  calls.push(String(url));
  if (String(url).includes('api.cloudflare.com')) {
    return new Response(JSON.stringify({
      success: false,
      errors: [{ message: 'busy' }],
    }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (String(url).includes('api.groq.com')) {
    return new Response(JSON.stringify({
      choices: [{ message: { content: 'OK' } }],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  throw new Error('Unexpected provider URL: ' + url);
};

try {
  delete require.cache[require.resolve('../ai-provider-router.js')];
  const { generateChat } = require('../ai-provider-router.js');
  const result = await generateChat({
    messages: [{ role: 'user', content: 'Health check.' }],
    providerOrder: ['cloudflare', 'groq'],
    maxTokens: 16,
    timeoutMs: 1000,
  });
  assert.equal(result.ok, true);
  assert.equal(result.provider, 'groq');
  assert.equal(result.text, 'OK');
  assert.deepEqual(result.attempts.map(({ provider, status, ok }) => ({ provider, status, ok })), [
    { provider: 'cloudflare', status: 429, ok: false },
    { provider: 'groq', status: 200, ok: true },
  ]);
  assert.equal(calls.length, 2);
} finally {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

console.log('AI provider router smoke passed.');
