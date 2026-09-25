import fs from 'node:fs';
import assert from 'node:assert/strict';

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

console.log('AI provider router smoke passed.');
