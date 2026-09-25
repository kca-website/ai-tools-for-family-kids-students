// Server-side AI provider router for aitools4kids.gr.
// Primary: Cloudflare Workers AI. Fallback: Groq.
// No prompts or responses are logged here.
const DEFAULT_TIMEOUT_MS = 18000;
const CLOUDFLARE_MODELS = new Set(['@cf/openai/gpt-oss-120b', '@cf/openai/gpt-oss-20b']);
const GROQ_MODELS = new Set(['openai/gpt-oss-120b', 'openai/gpt-oss-20b']);

function getAiStatus() {
  const providers = getProviderOrder().map((name) => ({ name, model: modelFor(name) }));
  return {
    configured: providers.length > 0,
    provider: providers[0]?.name || null,
    model: providers[0]?.model || null,
    providers,
  };
}

function getProviderOrder(providerOrder) {
  const requested = (Array.isArray(providerOrder)
    ? providerOrder
    : String(process.env.AI_PROVIDER_ORDER || 'cloudflare,groq').split(','))
    .map((value) => String(value))
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const unique = [...new Set(requested.filter((name) => name === 'cloudflare' || name === 'groq'))];
  return unique.filter(isConfigured);
}

function isConfigured(name) {
  if (name === 'cloudflare') {
    return !!(process.env.CLOUDFLARE_LLM_ACCOUNT_ID && process.env.CLOUDFLARE_LLM_AI_TOKEN);
  }
  if (name === 'groq') return !!process.env.GROQ_API_KEY;
  return false;
}

function modelFor(name) {
  if (name === 'cloudflare') {
    const configured = String(process.env.CLOUDFLARE_PRODUCTION_MODEL || '@cf/openai/gpt-oss-120b');
    return CLOUDFLARE_MODELS.has(configured) ? configured : '@cf/openai/gpt-oss-120b';
  }
  const configured = String(process.env.GROQ_PRODUCTION_MODEL || 'openai/gpt-oss-120b');
  return GROQ_MODELS.has(configured) ? configured : 'openai/gpt-oss-120b';
}

async function generateChat({
  messages,
  maxTokens = 700,
  temperature = 0.1,
  responseFormat,
  reasoningEffort = 'low',
  timeoutMs = DEFAULT_TIMEOUT_MS,
  providerOrder,
} = {}) {
  const order = getProviderOrder(providerOrder);
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

  for (const provider of order) {
    let result;
    try {
      result = provider === 'cloudflare'
        ? await callCloudflare({ messages, maxTokens, temperature, responseFormat, reasoningEffort, timeoutMs })
        : await callGroq({ messages, maxTokens, temperature, responseFormat, reasoningEffort, timeoutMs });
    } catch (error) {
      const timedOut = error?.name === 'AbortError';
      result = {
        ok: false,
        status: timedOut ? 504 : 502,
        error: timedOut ? 'timeout' : 'provider_error',
        message: timedOut ? 'Provider request timed out.' : 'Provider request failed.',
        retryable: true,
        provider,
        model: modelFor(provider),
      };
    }

    attempts.push({
      provider,
      model: result.model || modelFor(provider),
      status: result.status || 0,
      ok: !!result.ok,
    });

    if (result.ok) return { ...result, attempts };
    lastResult = result;
    if (!result.retryable) break;
  }

  return { ...(lastResult || {}), attempts };
}

async function callCloudflare({ messages, maxTokens, temperature, responseFormat, reasoningEffort, timeoutMs }) {
  const accountId = process.env.CLOUDFLARE_LLM_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_LLM_AI_TOKEN;
  const model = modelFor('cloudflare');
  const body = {
    messages,
    temperature,
    max_tokens: maxTokens,
    reasoning_effort: reasoningEffort || 'low',
    options: { rejectIfBusy: true },
  };
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

async function callGroq({ messages, maxTokens, temperature, responseFormat, reasoningEffort, timeoutMs }) {
  const model = modelFor('groq');
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
    const status = providerOk && !hasText ? 502 : response.status;
    return {
      ok,
      status,
      error: response.status === 429
        ? 'provider_limit'
        : (!providerOk ? 'provider_error' : (hasText ? null : 'empty_response')),
      retryable: providerOk && !hasText ? true : isRetryableStatus(response.status),
      message: providerMessage(data) || (!hasText && providerOk ? 'Provider returned an empty completion.' : ''),
      text,
      provider,
      model,
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
    // Workers AI JSON Mode may return the validated payload as an object.
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
      message: providerMessage(data) || (!hasText && response.ok ? 'Provider returned an empty completion.' : ''),
      text,
      provider,
      model,
    };
  } finally {
    clearTimeout(timeout);
  }
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

module.exports = { generateChat, getAiStatus };
