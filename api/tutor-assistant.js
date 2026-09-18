// Grounded, learning-first GPT-OSS proxy for Parent Helper and High-School AI Help.
// Groq is primary. Together AI is an optional invisible fallback when configured.
module.exports = async function handler(req, res) {
  const groqKey = process.env.GROQ_API_KEY;
  const togetherKey = process.env.TOGETHER_API_KEY;
  const model = 'openai/gpt-oss-120b';

  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ configured: !!groqKey, fallbackConfigured: !!togetherKey, model });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed', message: 'Method not allowed.' });
  }
  if (!groqKey && !togetherKey) {
    return res.status(503).json({ error: 'ai_not_configured', message: 'Η AI Βοήθεια δεν είναι προσωρινά διαθέσιμη.' });
  }

  const { system, prompt, audience } = req.body || {};
  if (!['parent', 'high_student'].includes(audience)) {
    return res.status(403).json({ error: 'audience_not_allowed', message: 'Η λειτουργία είναι διαθέσιμη σε γονείς όλων των βαθμίδων και σε μαθητές Λυκείου.' });
  }
  if (typeof system !== 'string' || typeof prompt !== 'string' || !system.trim() || !prompt.trim()) {
    return res.status(400).json({ error: 'missing_prompt', message: 'Λείπει το εκπαιδευτικό πλαίσιο ή η ερώτηση.' });
  }
  if (system.length > 24000 || prompt.length > 16000) {
    return res.status(413).json({ error: 'prompt_too_large', message: 'Η συνομιλία είναι πολύ μεγάλη. Ξεκίνα νέα συζήτηση.' });
  }

  const fixedGuard = `You are a learning-first tutor for the Greek school context.
- Follow the supplied mapped curriculum context; never invent an official chapter, syllabus item or source.
- Never provide finished homework or an immediately complete solution. Start from the learner's attempt and give one small hint or question at a time.
- Parent mode speaks to the parent. Student mode is allowed only for High School.
- Do not request, repeat or retain personal or sensitive information.
- Do not diagnose, label or officially grade a learner.
- If curriculum evidence is missing or uncertain, say so and recommend checking the school textbook or official source.`;

  const messages = [
    { role: 'system', content: `${fixedGuard}\n\n${system}` },
    { role: 'user', content: prompt },
  ];

  try {
    let result;
    if (groqKey) {
      try {
        result = await callProvider('https://api.groq.com/openai/v1/chat/completions', groqKey, model, messages);
      } catch (err) {
        if (!togetherKey) throw err;
        result = { ok: false, retryable: true, status: err?.name === 'AbortError' ? 504 : 502 };
      }
    }
    if ((!result || !result.ok) && togetherKey && (!result || result.retryable)) {
      result = await callProvider('https://api.together.xyz/v1/chat/completions', togetherKey, model, messages);
    }
    if (!result?.ok) {
      return res.status(result?.status || 502).json({ error: 'provider_error', message: result?.message || 'Η AI Βοήθεια δεν μπόρεσε να απαντήσει.' });
    }

    const text = sanitize(result.text);
    if (!text) return res.status(502).json({ error: 'empty_result', message: 'Δεν επιστράφηκε απάντηση.' });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ text, model, provider: result.provider });
  } catch (err) {
    const timedOut = err?.name === 'AbortError';
    return res.status(timedOut ? 504 : 500).json({
      error: timedOut ? 'timeout' : 'server_error',
      message: timedOut ? 'Η υπηρεσία άργησε να απαντήσει.' : 'Η AI Βοήθεια δεν μπόρεσε να απαντήσει.',
    });
  }
};

async function callProvider(url, apiKey, model, messages) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(url.includes('groq.com')
        ? { model, messages, temperature: 0.1, max_completion_tokens: 700 }
        : { model, messages, temperature: 0.1, max_tokens: 700 }),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    return {
      ok: response.ok,
      status: response.status,
      retryable: response.status === 429 || response.status >= 500,
      message: data?.error?.message,
      text: data?.choices?.[0]?.message?.content || '',
      provider: url.includes('groq.com') ? 'groq' : 'together',
    };
  } finally {
    clearTimeout(timeout);
  }
}

function sanitize(text) {
  return String(text || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
