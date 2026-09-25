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

  const result = await generateChat({
    messages: [
      { role: 'system', content: 'Return only the exact word OK.' },
      { role: 'user', content: 'Health check.' }
    ],
    maxTokens: 8,
    temperature: 0,
    reasoningEffort: 'low',
    timeoutMs: 12000,
  });

  return res.status(result.ok ? 200 : (result.status || 502)).json({
    ok: !!result.ok,
    provider: result.provider || null,
    model: result.model || null,
    text: result.ok ? String(result.text || '').trim().slice(0, 40) : undefined,
    error: result.ok ? undefined : result.error,
    attempts: result.attempts || [],
    configuredProviders: status.providers,
  });
};
