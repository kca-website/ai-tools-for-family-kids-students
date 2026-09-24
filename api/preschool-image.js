module.exports = async function handler(req, res) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_AI_TOKEN;
  const model = '@cf/black-forest-labs/flux-1-schnell';

  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    return res.status(200).json({ configured: !!(accountId && token), model });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed', message: 'Method not allowed.' });
  }

  if (!accountId || !token) {
    return res.status(503).json({ error: 'not_configured', message: 'Η δημιουργία εικόνας δεν είναι προσωρινά διαθέσιμη.' });
  }

  const idea = String(req.body?.idea || '').trim();
  const age = String(req.body?.age || '5');
  const mode = String(req.body?.mode || 'story');

  if (!idea || idea.length > 100) {
    return res.status(400).json({ error: 'invalid_idea', message: 'Χρησιμοποίησε ένα σύντομο γενικό θέμα έως 100 χαρακτήρες.' });
  }
  if (!['4', '5', '6'].includes(age)) {
    return res.status(400).json({ error: 'invalid_age', message: 'Μη έγκυρη ηλικία.' });
  }
  if (!['story', 'learn', 'offline'].includes(mode)) {
    return res.status(400).json({ error: 'invalid_mode', message: 'Μη έγκυρος τύπος δραστηριότητας.' });
  }
  if (looksLikePersonalData(idea)) {
    return res.status(400).json({ error: 'personal_data', message: 'Χρησιμοποίησε μόνο γενικό θέμα, χωρίς προσωπικά στοιχεία παιδιού.' });
  }

  const cleanIdea = idea.replace(/[<>\\{}\[\]]/g, ' ').replace(/\s+/g, ' ').slice(0, 100);
  const modeHint = mode === 'story'
    ? 'storybook scene'
    : mode === 'learn'
      ? 'playful early learning scene with simple shapes and objects'
      : 'screen-free play and craft inspired scene';

  const prompt = [
    'A charming preschool picture-book illustration for an adult-led activity.',
    `Theme: ${cleanIdea}.`,
    `Age: ${age}. Style: ${modeHint}.`,
    'Friendly non-human characters or objects only. No real people, no children, no faces resembling real people.',
    'Pastel colors, simple rounded shapes, warm light, clean composition, one clear focal subject.',
    'Safe and calm for ages 4 to 6. No violence, fear, weapons, medicine, fire, sharp tools or dangerous situations.',
    'No letters, no words, no logos, no watermark, no UI, no photorealism.',
    'Square educational illustration, polished children\'s book style.'
  ].join(' ');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${model}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          steps: 4,
          seed: Math.floor(Math.random() * 2147483646) + 1
        }),
        signal: controller.signal
      }
    );
    clearTimeout(timeout);

    const body = await response.json().catch(() => ({}));
    if (!response.ok || body?.success === false) {
      return res.status(response.status || 502).json({
        error: 'provider_error',
        message: 'Η εικόνα δεν μπόρεσε να δημιουργηθεί αυτή τη στιγμή.'
      });
    }

    const image = body?.result?.image || body?.image;
    if (!image || typeof image !== 'string') {
      return res.status(502).json({ error: 'invalid_image', message: 'Η υπηρεσία δεν επέστρεψε έγκυρη εικόνα.' });
    }

    return res.status(200).json({
      dataURI: `data:image/jpeg;base64,${image}`,
      model
    });
  } catch (err) {
    return res.status(err?.name === 'AbortError' ? 504 : 500).json({
      error: 'server_error',
      message: err?.name === 'AbortError'
        ? 'Η δημιουργία εικόνας άργησε να απαντήσει. Δοκίμασε ξανά.'
        : 'Η εικόνα δεν μπόρεσε να δημιουργηθεί.'
    });
  }
};

function looksLikePersonalData(s) {
  return /@|https?:\/\/|\b\d{7,}\b|\b(email|τηλέφων|κινητό|διεύθυν|σχολείο μου|ονομάζεται|λέγεται)\b/i.test(s);
}
