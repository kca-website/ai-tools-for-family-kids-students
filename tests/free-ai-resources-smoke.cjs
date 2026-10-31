'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');

const originalFetch = global.fetch;
const originalEnv = { ...process.env };
const restore = () => {
  global.fetch = originalFetch;
  for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
  Object.assign(process.env, originalEnv);
};

function fakeRes() {
  return {
    code: 200, headers: {}, body: null,
    setHeader(k, v) { this.headers[k] = v; return this; },
    status(n) { this.code = n; return this; },
    json(v) { this.body = v; return this; },
    end(v) { this.body = v; return this; },
  };
}

(async () => {
  try {
    const free = require('../teacher-free-web-evidence');
    assert.equal(free._test.buildQuery({ subject: 'Math', chapter: 'bob@example.com' }), '');
    assert.equal(free._test.acceptableUrl('http://example.com/a'), false);
    assert.equal(free._test.acceptableUrl('https://127.0.0.1/private'), false);
    process.env.TAVILY_API_KEY = 'test-tavily';
    process.env.BRAVE_SEARCH_API_KEY = 'test-brave';
    const requests = [];
    global.fetch = async (url, init) => {
      requests.push(String(url));
      if (String(url).includes('api.tavily.com')) return new Response('{}', { status: 429 });
      assert.equal(init.headers['X-Subscription-Token'], 'test-brave');
      return new Response(JSON.stringify({ web: { results: [
        { title: 'University page', url: 'https://example.edu/lesson', description: 'Verified third-party sample, at least thirty-five characters long.' },
        { title: 'Research institute', url: 'https://example.org/research', description: 'Second source excerpt with enough context to be evaluated by the teacher.' },
      ] } }), { status: 200 });
    };
    const evidence = await free.collectFreeTeacherWebEvidence({ subject: 'Φυσική', grade: 'Β Γυμνασίου', chapter: 'Κίνηση' });
    assert.equal(evidence.ok, true);
    assert.equal(evidence.searchProvider, 'brave');
    assert.equal(evidence.sources.length, 2);
    assert.match(evidence.summary, /όχι επίσημο σχολικό βιβλίο/);
    assert.equal(requests.length, 2);

    // The existing teacher web search remains the fallback if both free providers are missing.
    const teacher = fs.readFileSync(require.resolve('../teacher-web-evidence'), 'utf8');
    assert.match(teacher, /collectFreeTeacherWebEvidence/);
    assert.match(teacher, /TEACHER_GEMINI_WEB_FALLBACK_ENABLED/);

    delete process.env.CLOUDFLARE_LLM_ACCOUNT_ID;
    delete process.env.CLOUDFLARE_LLM_AI_TOKEN;
    delete process.env.GROQ_API_KEY;
    delete process.env.GEMINI_API_KEY;
    process.env.MISTRAL_ENABLED = 'true';
    process.env.MISTRAL_API_KEY = 'test-mistral';
    process.env.MISTRAL_ALLOWED_MODELS = 'mistral-small-latest';
    process.env.MISTRAL_MODEL = 'mistral-small-latest';
    process.env.OPENROUTER_ENABLED = 'true';
    process.env.OPENROUTER_API_KEY = 'test-openrouter';
    process.env.OPENROUTER_FREE_MODELS = 'example/demo:free,example/paid';
    process.env.OPENROUTER_MODEL = 'example/demo:free';
    process.env.AI_PROVIDER_ORDER = 'mistral,openrouter,gemini';
    delete require.cache[require.resolve('../ai-provider-router')];
    const router = require('../ai-provider-router');
    assert.deepEqual(router.modelSequenceFor('openrouter', 'default'), ['example/demo:free']);
    const llmCalls = [];
    global.fetch = async (url, init) => {
      llmCalls.push(String(url));
      assert.equal(init.method, 'POST');
      if (String(url).includes('mistral.ai')) return new Response('{}', { status: 429 });
      if (String(url).includes('openrouter.ai')) {
        return new Response(JSON.stringify({
          choices: [{ message: { content: 'OK from approved free model' }, finish_reason: 'stop' }],
          usage: { total_tokens: 12 },
        }), { status: 200 });
      }
      throw new Error('Unexpected vendor ' + url);
    };
    const output = await router.generateChat({ messages: [{ role: 'user', content: 'Synthetic only' }], maxTokens: 50 });
    assert.equal(output.ok, true);
    assert.equal(output.provider, 'openrouter');
    assert.equal(llmCalls.length, 2);
    assert.equal(router.getAiStatus().providers[0].billingClass, 'experimental-free');

    // Paid Gemini can be switched off without changing the other providers.
    process.env.GEMINI_API_KEY = 'test-paid';
    process.env.GEMINI_PAID_FALLBACK_ENABLED = 'false';
    const noPaid = await router.generateChat({
      messages: [{ role: 'user', content: 'Synthetic' }], providerOrder: ['gemini'],
    });
    assert.equal(noPaid.error, 'ai_not_configured');

    // Speech service is strictly opt-in and requires an explicitly verified F0 SKU.
    const speech = require('../api/azure-speech');
    process.env.AZURE_SPEECH_ENABLED = 'true';
    process.env.AZURE_SPEECH_F0_CONFIRMED = 'false';
    process.env.AZURE_SPEECH_KEY = 'test-azure';
    process.env.AZURE_SPEECH_REGION = 'westeurope';
    let res = fakeRes();
    const req = { method: 'POST', headers: { host: 'www.aitools4kids.gr', origin: 'https://www.aitools4kids.gr' },
      body: { language: 'el', text: 'Δοκιμαστικό μάθημα ελληνικής γλώσσας με περισσότερους από τριάντα χαρακτήρες.' } };
    await speech(req, res);
    assert.equal(res.code, 503);
    process.env.AZURE_SPEECH_F0_CONFIRMED = 'true';
    let azureRequest;
    global.fetch = async (url, init) => {
      azureRequest = { url: String(url), init };
      return new Response(Buffer.from('FAKE_MP3'), { status: 200 });
    };
    res = fakeRes();
    await speech(req, res);
    assert.equal(res.code, 200);
    assert.equal(res.headers['Content-Type'], 'audio/mpeg');
    assert.match(azureRequest.url, /westeurope\.tts\.speech\.microsoft\.com/);
    assert.equal(azureRequest.init.headers['Ocp-Apim-Subscription-Key'], 'test-azure');
    assert.match(azureRequest.init.body, /el-GR-AthinaNeural/);
    const hostile = { ...req, headers: { host: 'www.aitools4kids.gr', origin: 'https://malicious.example' } };
    res = fakeRes();
    await speech(hostile, res);
    assert.equal(res.code, 403);

    const study = fs.readFileSync(new URL('../study.html', 'file://' + __filename), 'utf8');
    assert.match(study, /tryAzureSpeech/);
    assert.match(study, /stopAzureAudio/);
    console.log('PASS: free search fallback, optional LLMs, F0 speech, no-paid switch');
  } finally { restore(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
