// Grounded, learning-first GPT-OSS proxy for Parent Helper and High-School AI Help.
// Groq is the only server-side AI provider used by this endpoint.
module.exports = async function handler(req, res) {
  const groqKey = process.env.GROQ_API_KEY;
  const model = 'openai/gpt-oss-120b';

  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ configured: !!groqKey, model, provider: 'groq' });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed', message: 'Method not allowed.' });
  }
  if (!groqKey) {
    return res.status(503).json({ error: 'ai_not_configured', message: 'Η AI Βοήθεια δεν είναι προσωρινά διαθέσιμη.' });
  }

  const { system, prompt, audience, task = 'conversation', mode = 'understand', grade = '', subject = '', topic = '', character = '' } = req.body || {};
  if (!['parent', 'high_student'].includes(audience)) {
    return res.status(403).json({ error: 'audience_not_allowed', message: 'Η λειτουργία είναι διαθέσιμη σε γονείς όλων των βαθμίδων και σε μαθητές Λυκείου.' });
  }
  const allowedModes = new Set(['understand', 'hint', 'challenge', 'review', 'character']);
  if (!allowedModes.has(mode)) {
    return res.status(400).json({ error: 'invalid_mode', message: 'Μη έγκυρη λειτουργία AI Βοήθειας.' });
  }
  if (typeof system !== 'string' || typeof prompt !== 'string' || !system.trim() || !prompt.trim()) {
    return res.status(400).json({ error: 'missing_prompt', message: 'Λείπει το εκπαιδευτικό πλαίσιο ή η ερώτηση.' });
  }
  const taskLimits = {
    conversation: 700,
    flashcards: 1800,
    quiz: 3000,
    slides: 2500,
  };
  if (!Object.prototype.hasOwnProperty.call(taskLimits, task)) {
    return res.status(400).json({ error: 'invalid_task', message: 'Μη έγκυρος τύπος εκπαιδευτικού υλικού.' });
  }
  if (system.length > 24000 || prompt.length > 16000) {
    return res.status(413).json({ error: 'prompt_too_large', message: 'Η συνομιλία είναι πολύ μεγάλη. Ξεκίνα νέα συζήτηση.' });
  }

  const selectedContext = [
    grade ? `Grade: ${grade}` : '',
    subject ? `Subject: ${subject}` : '',
    topic ? `Topic: ${topic}` : '',
  ].filter(Boolean).join(' | ');

  const roleRule = mode === 'character'
    ? `- CHARACTER MODE OVERRIDE: speak as the supplied mapped character/role directly in the dialogue. The parent route means adult supervision only; do NOT switch to parent-coaching language and do NOT say “ask/tell the child”. Character: ${character || 'mapped educational role'}.`
    : (audience === 'parent'
      ? '- Parent mode speaks to the parent and gives one coaching step/question at a time.'
      : '- Student mode speaks directly to the high-school learner.');

  const fixedGuard = `You are a learning-first tutor for the Greek school context.
- The supplied client curriculum context is authoritative for THIS session. Do not substitute a different syllabus from model memory.
- Selected session context: ${selectedContext || 'provided in the system prompt'}.
- Follow the supplied mapped curriculum context; never invent an official chapter, syllabus item or source.
- Stay inside the selected grade + subject + topic unless the user explicitly asks to compare with something else.
- In conversation mode, never provide finished homework or an immediately complete solution. Start from the learner's attempt and give one small hint or question at a time.
- For flashcards, quizzes and presentation scaffolds, create the complete requested structured learning material, but do not turn it into a ready-to-submit school assignment.
${roleRule}
- Do not request, repeat or retain personal or sensitive information.
- Do not diagnose, label or officially grade a learner.
- If curriculum evidence is missing or uncertain, say so and recommend checking the school textbook or official source.`;

  const messages = [
    { role: 'system', content: `${fixedGuard}\n\n${system}` },
    { role: 'user', content: prompt },
  ];

  try {
    const result = await callProvider(
      'https://api.groq.com/openai/v1/chat/completions',
      groqKey,
      model,
      messages,
      taskLimits[task]
    );
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

async function callProvider(url, apiKey, model, messages, maxTokens) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages, temperature: 0.1, max_completion_tokens: maxTokens }),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    return {
      ok: response.ok,
      status: response.status,
      retryable: response.status === 429 || response.status >= 500,
      message: data?.error?.message,
      text: data?.choices?.[0]?.message?.content || '',
      provider: 'groq',
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
