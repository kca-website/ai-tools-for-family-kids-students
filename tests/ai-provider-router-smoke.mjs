import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const router = fs.readFileSync(new URL('../ai-provider-router.js', import.meta.url), 'utf8');
const tutor = fs.readFileSync(new URL('../api/tutor-assistant.js', import.meta.url), 'utf8');
const teacher = fs.readFileSync(new URL('../api/teacher-assistant.js', import.meta.url), 'utf8');
const preschool = fs.readFileSync(new URL('../api/preschool-activity.js', import.meta.url), 'utf8');
const privacy = fs.readFileSync(new URL('../privacy-policy.html', import.meta.url), 'utf8');

assert.match(router, /AI_PROVIDER_ORDER \|\| 'cloudflare,groq,gemini'/);
assert.match(router, /api\.cloudflare\.com\/client\/v4\/accounts/);
assert.match(router, /api\.groq\.com\/openai\/v1\/chat\/completions/);
assert.match(router, /rejectIfBusy:\s*true/);
assert.match(router, /status === 429/);
assert.match(router, /CLOUDFLARE_LLM_AI_TOKEN/);
assert.match(router, /CLOUDFLARE_LLM_ACCOUNT_ID/);
assert.match(router, /GROQ_API_KEY/);
assert.match(router, /@cf\/qwen\/qwen3-30b-a3b-fp8/);
assert.match(router, /@cf\/zai-org\/glm-4\.7-flash/);
assert.match(router, /economy/);
assert.match(router, /balanced/);
assert.match(router, /quality/);
assert.match(router, /providerCode/);
assert.match(router, /SMART_AI_ROUTING_ENABLED/);
assert.match(router, /enable_thinking:\s*false/);
assert.match(router, /extractUsage/);
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
  SMART_AI_ROUTING_ENABLED: process.env.SMART_AI_ROUTING_ENABLED,
};
process.env.CLOUDFLARE_LLM_ACCOUNT_ID = 'test-account';
process.env.CLOUDFLARE_LLM_AI_TOKEN = 'test-cloudflare-token';
process.env.GROQ_API_KEY = 'test-groq-token';
process.env.SMART_AI_ROUTING_ENABLED = '1';

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
}

// Economy profile starts with Qwen and falls through to GLM on model capacity.
calls.length = 0;
let cloudflareAttempt = 0;
globalThis.fetch = async (url, init = {}) => {
  calls.push(String(url));
  if (String(url).includes('api.cloudflare.com')) {
    cloudflareAttempt++;
    const body = JSON.parse(String(init.body || '{}'));
    if (cloudflareAttempt === 1) {
      assert.doesNotMatch(String(url), /gpt-oss-120b/);
      assert.match(String(url), /qwen3-30b-a3b-fp8/);
      assert.equal(Object.prototype.hasOwnProperty.call(body, 'reasoning_effort'), false);
      return new Response(JSON.stringify({
        success: false,
        errors: [{ code: 3040, message: 'Capacity temporarily exceeded' }],
      }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }
    assert.match(String(url), /glm-4\.7-flash/);
    return new Response(JSON.stringify({ success: true, result: { response: 'GLM OK' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  throw new Error('Unexpected provider URL: ' + url);
};

try {
  delete require.cache[require.resolve('../ai-provider-router.js')];
  const { generateChat, modelSequenceFor } = require('../ai-provider-router.js');
  assert.equal(modelSequenceFor('cloudflare', 'economy')[0], '@cf/qwen/qwen3-30b-a3b-fp8');
  assert.equal(modelSequenceFor('cloudflare', 'balanced')[0], '@cf/zai-org/glm-4.7-flash');
  assert.equal(modelSequenceFor('cloudflare', 'quality')[0], '@cf/openai/gpt-oss-120b');
  const result = await generateChat({
    messages: [{ role: 'user', content: 'Economy check.' }],
    providerOrder: ['cloudflare', 'groq'],
    modelProfile: 'economy',
    maxTokens: 16,
    timeoutMs: 1000,
  });
  assert.equal(result.ok, true);
  assert.equal(result.provider, 'cloudflare');
  assert.equal(result.model, '@cf/zai-org/glm-4.7-flash');
  assert.equal(result.text, 'GLM OK');
  assert.deepEqual(result.attempts.map(x => [x.provider, x.model, x.status]), [
    ['cloudflare', '@cf/qwen/qwen3-30b-a3b-fp8', 429],
    ['cloudflare', '@cf/zai-org/glm-4.7-flash', 200],
  ]);
} finally {
  globalThis.fetch = originalFetch;
}

// Cloudflare daily free-allocation exhaustion must skip the remaining Cloudflare models and go to Groq.
calls.length = 0;
globalThis.fetch = async (url) => {
  calls.push(String(url));
  if (String(url).includes('api.cloudflare.com')) {
    return new Response(JSON.stringify({
      success: false,
      errors: [{ code: 3036, message: 'Daily free allocation exhausted' }],
    }), { status: 429, headers: { 'Content-Type': 'application/json' } });
  }
  if (String(url).includes('api.groq.com')) {
    return new Response(JSON.stringify({
      choices: [{ message: { content: 'Groq economy OK' } }],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  throw new Error('Unexpected provider URL: ' + url);
};

try {
  delete require.cache[require.resolve('../ai-provider-router.js')];
  const { generateChat } = require('../ai-provider-router.js');
  const result = await generateChat({
    messages: [{ role: 'user', content: 'Daily quota check.' }],
    providerOrder: ['cloudflare', 'groq'],
    modelProfile: 'economy',
    maxTokens: 16,
    timeoutMs: 1000,
  });
  assert.equal(result.ok, true);
  assert.equal(result.provider, 'groq');
  assert.equal(result.model, 'openai/gpt-oss-20b');
  assert.equal(calls.filter(url => url.includes('api.cloudflare.com')).length, 1);
  assert.equal(calls.filter(url => url.includes('api.groq.com')).length, 1);
} finally {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

assert.match(tutor, /chooseRoutingProfile/);
assert.match(tutor, /modelProfile:\s*routingProfile/);
assert.match(tutor, /\['quiz', 'truefalse'\][\s\S]{0,80}return 'quality'/);
assert.match(tutor, /\['flashcards', 'plan'\][\s\S]{0,80}return 'economy'/);
assert.match(tutor, /\['explain', 'weakspots'\]/);


const study = fs.readFileSync(new URL('../study.html', import.meta.url), 'utf8');
const { runInNewContext } = await import('node:vm');
const markupSource = study.slice(study.indexOf('  function inlineStudyMarkup('), study.indexOf('  function quizProgressHtml('));
const render = runInNewContext(markupSource + '; studyMarkup', {
  esc: value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
});
const table = render('| A | B |\n| --- | --- |\n| <script> | **safe** |');
assert.match(table, /<table>/);
assert.match(table, /<th>A<\/th>/);
assert.match(table, /&lt;script&gt;/);
assert.doesNotMatch(table, /<script>/);
assert.match(table, /<strong>safe<\/strong>/);

// Truncated outputs must fail over automatically and never escape as successful text.
process.env.CLOUDFLARE_LLM_ACCOUNT_ID = 'test-account';
process.env.CLOUDFLARE_LLM_AI_TOKEN = 'test-token';
process.env.GROQ_API_KEY = 'test-token';
process.env.SMART_AI_ROUTING_ENABLED = '0';
try {
  const { generateChat } = require('../ai-provider-router.js');
  for (const nativeResult of [
    { response: 'cut off (', finish_reason: 'length' },
    { response: 'cut off (', usage: { completion_tokens: 16 } },
  ]) {
    globalThis.fetch = async url => new Response(JSON.stringify(
      String(url).includes('api.cloudflare.com')
        ? { success: true, result: nativeResult }
        : { choices: [{ message: { content: 'Complete answer.' }, finish_reason: 'stop' }] }
    ), { status: 200 });
    const result = await generateChat({ messages: [{ role: 'user', content: 'Explain.' }], providerOrder: ['cloudflare', 'groq'], maxTokens: 16 });
    assert.equal(result.ok, true);
    assert.equal(result.provider, 'groq');
    assert.equal(result.text, 'Complete answer.');
    assert.equal(result.attempts[0].error, 'incomplete_response');
  }
  globalThis.fetch = async () => new Response(JSON.stringify({
    choices: [{ message: { content: 'cut off (' }, finish_reason: 'length' }],
  }), { status: 200 });
  const result = await generateChat({ messages: [{ role: 'user', content: 'Explain.' }], providerOrder: ['groq'], maxTokens: 16 });
  assert.equal(result.ok, false);
  assert.equal(result.text, '');
} finally {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

console.log('AI provider router smoke passed.');
