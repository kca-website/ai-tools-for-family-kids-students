module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'groq_not_configured',
      message: 'Groq is not configured on this deployment.'
    });
  }

  try {
    const { system, prompt } = req.body || {};
    if (!system || !prompt) {
      return res.status(400).json({ error: 'Missing prompt.' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt }
        ],
        temperature: 0.35,
        max_completion_tokens: 2200
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const providerMessage = data?.error?.message || 'Groq request failed.';
      return res.status(response.status).json({ error: 'groq_error', message: providerMessage });
    }

    const text = data?.choices?.[0]?.message?.content || '';
    if (!text) return res.status(502).json({ error: 'empty_result', message: 'No result returned.' });

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ text, model: 'openai/gpt-oss-20b' });
  } catch (err) {
    const timeout = err?.name === 'AbortError';
    return res.status(timeout ? 504 : 500).json({
      error: timeout ? 'timeout' : 'server_error',
      message: timeout ? 'The AI service took too long to respond.' : 'Could not generate a result.'
    });
  }
};
