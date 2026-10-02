// Server-side AI provider router for aitools4kids.gr.
// Primary pool: Cloudflare Workers AI. Fallback pools: Groq, then Gemini.
// Simple grounded tasks use cheaper Cloudflare models first; difficult reasoning keeps GPT-OSS 120B first.
// No prompts or responses are logged here.
const DEFAULT_TIMEOUT_MS = 18000;
const CLOUDFLARE_MODELS = new Set([
  '@cf/qwen/qwen3-30b-a3b-fp8',
  '@cf/zai-org/glm-4.7-flash',
  '@cf/openai/gpt-oss-20b',
  '@cf/openai/gpt-oss-120b',
]);
const GROQ_MODELS = new Set(['openai/gpt-oss-120b', 'openai/gpt-oss-20b']);
const GEMINI_MODELS = new Set(['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.5-flash-lite']);
const allowedModels = provider => provider === 'gemini' ? GEMINI_MODELS : (provider === 'cloudflare' ? CLOUDFLARE_MODELS : GROQ_MODELS);
const ROUTING_PROFILES = new Set(['default', 'economy', 'balanced', 'quality']);

function smartRoutingEnabled() {
  return /^(?:1|true|on)$/i.test(String(process.env.SMART_AI_ROUTING_ENABLED || '').trim());
}

const PROFILE_MODELS = Object.freeze({
  economy: {
    cloudflare: [
      '@cf/qwen/qwen3-30b-a3b-fp8',
      '@cf/zai-org/glm-4.7-flash',
      '@cf/openai/gpt-oss-20b',
      '@cf/openai/gpt-oss-120b',
    ],
    groq: ['openai/gpt-oss-20b', 'openai/gpt-oss-120b'],
  },
  balanced: {
    cloudflare: [
      '@cf/zai-org/glm-4.7-flash',
      '@cf/qwen/qwen3-30b-a3b-fp8',
      '@cf/openai/gpt-oss-20b',
      '@cf/openai/gpt-oss-120b',
    ],
    groq: ['openai/gpt-oss-20b', 'openai/gpt-oss-120b'],
  },
  quality: {
    cloudflare: [
      '@cf/openai/gpt-oss-120b',
      '@cf/zai-org/glm-4.7-flash',
      '@cf/openai/gpt-oss-20b',
    ],
    groq: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'],
  },
});

function getAiStatus() {
  const providers = getProviderOrder().map((name) => ({ name, model: modelFor(name) }));
  const routingProfiles = {};
  for (const profile of ['economy', 'balanced', 'quality']) {
    routingProfiles[profile] = {};
    for (const provider of getProviderOrder()) {
      routingProfiles[profile][provider] = modelSequenceFor(provider, profile);
    }
  }
  return {
    configured: providers.length > 0,
    provider: providers[0]?.name || null,
    model: providers[0]?.model || null,
    providers,
    smartRoutingEnabled: smartRoutingEnabled(),
    routingProfiles,
  };
}

function getProviderOrder(providerOrder) {
  const requested = (Array.isArray(providerOrder)
    ? providerOrder
    : String(process.env.AI_PROVIDER_ORDER || 'cloudflare,groq,gemini').split(','))
    .map((value) => String(value))
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const unique = [...new Set(requested.filter((name) => name === 'cloudflare' || name === 'groq' || name === 'gemini'))];
  return unique.filter(isConfigured);
}

function isConfigured(name) {
  if (name === 'cloudflare') {
    return !!(process.env.CLOUDFLARE_LLM_ACCOUNT_ID && process.env.CLOUDFLARE_LLM_AI_TOKEN);
  }
  if (name === 'gemini') return !!process.env.GEMINI_API_KEY;
  if (name === 'groq') return !!process.env.GROQ_API_KEY;
  return false;
}

function modelFor(name) {
  if (name === 'gemini') {
    const configured = String(process.env.GEMINI_PRODUCTION_MODEL || 'gemini-2.5-flash-lite');
    return GEMINI_MODELS.has(configured) ? configured : 'gemini-2.5-flash-lite';
  }
  if (name === 'cloudflare') {
    const configured = String(process.env.CLOUDFLARE_PRODUCTION_MODEL || '@cf/openai/gpt-oss-120b');
    return CLOUDFLARE_MODELS.has(configured) ? configured : '@cf/openai/gpt-oss-120b';
  }
  const configured = String(process.env.GROQ_PRODUCTION_MODEL || 'openai/gpt-oss-120b');
  return GROQ_MODELS.has(configured) ? configured : 'openai/gpt-oss-120b';
}

function normalizeProfile(value) {
  const profile = String(value || 'default').trim().toLowerCase();
  return ROUTING_PROFILES.has(profile) ? profile : 'default';
}

function configuredProfileModels(provider, profile) {
  const key = provider === 'cloudflare'
    ? 'CLOUDFLARE_' + profile.toUpperCase() + '_MODELS'
    : (provider === 'gemini' ? 'GEMINI_' : 'GROQ_') + profile.toUpperCase() + '_MODELS';
  const raw = String(process.env[key] || '').trim();
  if (!raw) return [];
  const allowed = allowedModels(provider);
  return [...new Set(raw.split(',').map(x => x.trim()).filter(x => allowed.has(x)))];
}

function modelSequenceFor(provider, profileValue) {
  const profile = normalizeProfile(profileValue);
  if (provider === 'gemini') {
    const configured = configuredProfileModels(provider, profile);
    return [...new Set([...(configured.length ? configured : [modelFor(provider)]), 'gemini-3.1-flash-lite', 'gemini-3.5-flash-lite'])];
  }
  if (profile === 'default' || !smartRoutingEnabled()) return [modelFor(provider)];
  const configured = configuredProfileModels(provider, profile);
  if (configured.length) return configured;
  const defaults = PROFILE_MODELS[profile]?.[provider] || [modelFor(provider)];
  const allowed = allowedModels(provider);
  return [...new Set(defaults.filter(model => allowed.has(model)))];
}

async function generateChat({
  messages,
  maxTokens = 700,
  temperature = 0.1,
  responseFormat,
  reasoningEffort = 'low',
  timeoutMs = DEFAULT_TIMEOUT_MS,
  providerOrder,
  modelProfile = 'default',
  validateText,
} = {}) {
  const order = getProviderOrder(providerOrder);
  const profile = normalizeProfile(modelProfile);
  if (!order.length) {
    return {
      ok: false,
      status: 503,
      error: 'ai_not_configured',
      message: 'No server-side AI provider is configured.',
      retryable: false,
      attempts: [],
    };
  }

  const attempts = [];
  let lastResult = null;

  providerLoop:
  for (const provider of order) {
    const models = modelSequenceFor(provider, profile);
    for (let index = 0; index < models.length; index++) {
      const model = models[index];
      let result;
      try {
        result = provider === 'gemini'
          ? await callGemini({ messages, maxTokens, temperature, responseFormat, timeoutMs, model })
          : provider === 'cloudflare'
          ? await callCloudflare({ messages, maxTokens, temperature, responseFormat, reasoningEffort, timeoutMs, model })
          : await callGroq({ messages, maxTokens, temperature, responseFormat, reasoningEffort, timeoutMs, model });
      } catch (error) {
        const timedOut = error?.name === 'AbortError';
        result = {
          ok: false,
          status: timedOut ? 504 : 502,
          error: timedOut ? 'timeout' : 'provider_error',
          message: timedOut ? 'Provider request timed out.' : 'Provider request failed.',
          retryable: true,
          provider,
          model,
        };
      }

      if (result.ok && typeof validateText === 'function' && !validateText(result.text)) {
        result = { ...result, ok: false, status: 502, error: 'invalid_output', retryable: true };
      }
      attempts.push({
        provider,
        model: result.model || model,
        status: result.status || 0,
        ok: !!result.ok,
        providerCode: result.providerCode ?? null,
        error: result.error || null,
      });

      if (result.ok) return { ...result, attempts, modelProfile: profile };
      console.warn('AI_PROVIDER_ATTEMPT ' + JSON.stringify(attempts[attempts.length - 1]));
      lastResult = result;

      if (index < models.length - 1 && shouldTryNextModel(result, provider)) continue;
      if (shouldTryNextProvider(result)) continue providerLoop;
      break providerLoop;
    }
  }

  return { ...(lastResult || {}), attempts, modelProfile: profile };
}

async function callGemini({ messages, maxTokens, temperature, responseFormat, timeoutMs, model }) {
  const system = messages.filter(message => message.role === 'system').map(message => message.content).join('\n\n');
  const contents = messages.filter(message => message.role !== 'system').map(message => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(message.content || '') }],
  }));
  const generationConfig = {
    temperature,
    maxOutputTokens: maxTokens,
    thinkingConfig: model.startsWith('gemini-3.') ? { thinkingLevel: 'minimal' } : { thinkingBudget: 0 },
  };
  if (responseFormat?.type === 'json_object' || responseFormat?.type === 'json_schema') {
    generationConfig.responseMimeType = 'application/json';
    if (responseFormat.json_schema?.schema) generationConfig.responseJsonSchema = responseFormat.json_schema.schema;
  }
  const body = { contents, generationConfig };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    const candidate = data?.candidates?.[0];
    if (!response.ok) console.warn('GEMINI_ERROR ' + JSON.stringify({status:response.status,code:data?.error?.status || '',message:String(data?.error?.message || '').replaceAll(process.env.GEMINI_API_KEY || '__none__', '[redacted]').slice(0,600)}));
    const text = (candidate?.content?.parts || []).filter(part => !part.thought && typeof part.text === 'string').map(part => part.text).join('');
    const blocked = !!data?.promptFeedback?.blockReason || ['SAFETY', 'RECITATION', 'PROHIBITED_CONTENT'].includes(candidate?.finishReason);
    const complete = candidate?.finishReason !== 'MAX_TOKENS';
    const ok = response.ok && !!text.trim() && !blocked && complete;
    const usage = data?.usageMetadata || {};
    return {
      ok, status: blocked ? 422 : (response.ok && !ok ? 502 : response.status),
      error: response.status === 429 ? 'provider_limit' : (blocked ? 'content_blocked' : (ok ? null : 'provider_error')),
      retryable: !blocked && (response.ok && !ok || isRetryableStatus(response.status) || response.status === 404),
      providerCode: data?.error?.status || null,
      message: data?.error?.message || (blocked ? 'Provider blocked this content.' : (!ok ? 'Provider returned an incomplete completion.' : '')),
      text: ok ? text : '', provider: 'gemini', model,
      usage: {
        promptTokens: usage.promptTokenCount || 0,
        completionTokens: (usage.candidatesTokenCount || 0) + (usage.thoughtsTokenCount || 0),
        totalTokens: usage.totalTokenCount || 0,
        cachedTokens: usage.cachedContentTokenCount || 0,
      },
    };
  } finally { clearTimeout(timeout); }
}

async function callCloudflare({ messages, maxTokens, temperature, responseFormat, reasoningEffort, timeoutMs, model }) {
  const accountId = process.env.CLOUDFLARE_LLM_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_LLM_AI_TOKEN;
  const body = {
    messages,
    temperature,
    max_tokens: maxTokens,
    options: { rejectIfBusy: true },
  };
  if (String(model).includes('/gpt-oss-')) {
    body.reasoning_effort = reasoningEffort || 'low';
  } else if (smartRoutingEnabled() && (
    String(model).includes('/qwen/qwen3-') ||
    String(model).includes('/zai-org/glm-4.7-flash')
  )) {
    body.chat_template_kwargs = { enable_thinking: false };
  }
  if (responseFormat) body.response_format = responseFormat;

  return postCloudflareNative({
    url: 'https://api.cloudflare.com/client/v4/accounts/' + encodeURIComponent(accountId) + '/ai/run/' + model,
    token,
    body,
    provider: 'cloudflare',
    model,
    timeoutMs,
  });
}

async function callGroq({ messages, maxTokens, temperature, responseFormat, reasoningEffort, timeoutMs, model }) {
  const body = {
    model,
    messages,
    temperature,
    max_completion_tokens: maxTokens,
  };
  if (reasoningEffort) {
    body.reasoning_effort = reasoningEffort;
    body.include_reasoning = false;
  }
  if (responseFormat) body.response_format = responseFormat;

  return postOpenAiCompatible({
    url: 'https://api.groq.com/openai/v1/chat/completions',
    token: process.env.GROQ_API_KEY,
    body,
    provider: 'groq',
    model,
    timeoutMs,
  });
}

async function postCloudflareNative({ url, token, body, provider, model, timeoutMs }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    const text = extractCloudflareText(data);
    const hasText = text.trim().length > 0;
    const providerOk = response.ok && data?.success !== false;
    const ok = providerOk && hasText;
    const status = response.ok && !ok ? 502 : response.status;
    const providerCode = extractProviderCode(data);
    return {
      ok,
      status,
      error: response.status === 429
        ? 'provider_limit'
        : (!providerOk ? 'provider_error' : (hasText ? null : 'empty_response')),
      retryable: response.ok && !ok ? true : isRetryableStatus(response.status),
      providerCode,
      message: providerMessage(data) || (!hasText && providerOk ? 'Provider returned an empty completion.' : ''),
      text,
      provider,
      model,
      usage: extractUsage(data),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function extractCloudflareText(data) {
  const directCandidates = [
    data?.result?.response,
    data?.response,
    data?.result?.output_text,
    data?.output_text,
    data?.result?.choices?.[0]?.message?.content,
    data?.choices?.[0]?.message?.content,
  ];

  for (const value of directCandidates) {
    if (typeof value === 'string' && value.trim()) return value;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      try { return JSON.stringify(value); } catch {}
    }
  }

  const outputs = Array.isArray(data?.result?.output)
    ? data.result.output
    : (Array.isArray(data?.output) ? data.output : []);
  for (const item of outputs) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      const value = part?.text ?? part?.output_text;
      if (typeof value === 'string' && value.trim()) return value;
    }
  }

  return '';
}

async function postOpenAiCompatible({ url, token, body, provider, model, timeoutMs }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    const text = typeof data?.choices?.[0]?.message?.content === 'string'
      ? data.choices[0].message.content
      : '';
    const hasText = text.trim().length > 0;
    const ok = response.ok && hasText;
    const status = response.ok && !hasText ? 502 : response.status;
    return {
      ok,
      status,
      error: response.status === 429
        ? 'provider_limit'
        : (!response.ok ? 'provider_error' : (hasText ? null : 'empty_response')),
      retryable: !hasText && response.ok ? true : isRetryableStatus(response.status),
      providerCode: data?.error?.code ?? null,
      message: providerMessage(data) || (!hasText && response.ok ? 'Provider returned an empty completion.' : ''),
      text,
      provider,
      model,
      usage: extractUsage(data),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function extractUsage(data) {
  const usage = data?.result?.usage || data?.usage || {};
  const promptTokens = Number(usage.prompt_tokens ?? usage.input_tokens ?? 0) || 0;
  const completionTokens = Number(usage.completion_tokens ?? usage.output_tokens ?? 0) || 0;
  const totalTokens = Number(usage.total_tokens ?? (promptTokens + completionTokens)) || 0;
  const cachedTokens = Number(
    usage.cached_tokens ??
    usage.prompt_tokens_details?.cached_tokens ??
    usage.input_tokens_details?.cached_tokens ??
    0
  ) || 0;
  return { promptTokens, completionTokens, totalTokens, cachedTokens };
}

function extractProviderCode(data) {
  const raw = data?.errors?.[0]?.code ?? data?.error?.code ?? data?.code ?? null;
  if (raw === null || raw === undefined || raw === '') return null;
  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : String(raw);
}

function isModelSpecificCloudflareCode(code) {
  return [3040, 3041, 3042, 5007, 5016, 5018, 5035].includes(Number(code));
}

function shouldTryNextModel(result, provider) {
  const status = Number(result?.status || 0);
  if (provider === 'gemini') return status === 404;
  if (provider === 'cloudflare') {
    if (Number(result?.providerCode) === 3036) return false;
    if (isModelSpecificCloudflareCode(result?.providerCode)) return true;
    return status === 408 || status === 409 || status === 429 || status >= 500;
  }
  return status === 408 || status === 409 || status === 429 || status >= 500;
}

function shouldTryNextProvider(result) {
  if (result?.error === 'content_blocked') return false;
  const status = Number(result?.status || 0);
  if (isModelSpecificCloudflareCode(result?.providerCode)) return true;
  return !!result?.retryable || status === 400 || status === 413 || status === 401 || status === 403 || status === 408 ||
    status === 409 || status === 429 || status >= 500;
}

function isRetryableStatus(status) {
  return status === 401 || status === 403 || status === 408 || status === 409 ||
    status === 429 || status >= 500;
}

function providerMessage(data) {
  return data?.error?.message ||
    data?.errors?.[0]?.message ||
    data?.message ||
    '';
}

module.exports = { generateChat, getAiStatus, modelSequenceFor, smartRoutingEnabled };
