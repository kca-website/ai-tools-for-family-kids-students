const { generateChat, getAiStatus } = require('../ai-provider-router');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (process.env.VERCEL_ENV !== 'preview') {
    return res.status(404).json({ error: 'not_found' });
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const status = getAiStatus();
  if (!status.configured) {
    return res.status(503).json({ ok: false, ...status });
  }

  const requestedProvider = String(req.query?.provider || '').trim().toLowerCase();
  const providerOrder = requestedProvider === 'cloudflare' || requestedProvider === 'groq'
    ? [requestedProvider]
    : undefined;
  const structured = String(req.query?.mode || '').trim().toLowerCase() === 'json';

  const result = await generateChat({
    providerOrder,
    messages: structured
      ? [
          { role: 'system', content: 'Return a JSON object matching the schema with status exactly OK.' },
          { role: 'user', content: 'Structured health check.' }
        ]
      : [
          { role: 'system', content: 'Return only the exact word OK.' },
          { role: 'user', content: 'Health check.' }
        ],
    maxTokens: 256,
    temperature: 0,
    reasoningEffort: 'low',
    timeoutMs: 12000,
    responseFormat: structured ? {
      type: 'json_schema',
      json_schema: {
        name: 'health_check',
        strict: true,
        schema: {
          type: 'object',
          properties: { status: { type: 'string', enum: ['OK'] } },
          required: ['status'],
          additionalProperties: false,
        },
      },
    } : undefined,
  });

  return res.status(result.ok ? 200 : (result.status || 502)).json({
    ok: !!result.ok,
    provider: result.provider || null,
    model: result.model || null,
    text: result.ok ? String(result.text || '').trim().slice(0, 40) : undefined,
    error: result.ok ? undefined : result.error,
    attempts: result.attempts || [],
    requestedProvider: requestedProvider || null,
    mode: structured ? 'json' : 'text',
    configuredProviders: status.providers,
  });
};
