module.exports = async function handler(req, res) {
  const groqKey = process.env.GROQ_API_KEY;
  const model = 'openai/gpt-oss-120b';

  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ configured: !!groqKey, model, audience: 'adult_preschool' });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed', message: 'Method not allowed.' });
  }
  if (!groqKey) return res.status(503).json({ error: 'ai_not_configured', message: 'Η δημιουργία δραστηριότητας δεν είναι προσωρινά διαθέσιμη.' });

  const idea = String(req.body?.idea || '').trim();
  const mode = String(req.body?.mode || 'story');
  const age = String(req.body?.age || '5');
  const duration = String(req.body?.duration || '10');
  const place = String(req.body?.place || 'home');
  if (!idea || idea.length > 120) return res.status(400).json({ error: 'invalid_idea', message: 'Γράψε μία σύντομη ιδέα έως 120 χαρακτήρες.' });
  if (!['story','learn','offline'].includes(mode)) return res.status(400).json({ error: 'invalid_mode', message: 'Μη έγκυρος τύπος δραστηριότητας.' });
  if (!['4','5','6'].includes(age)) return res.status(400).json({ error: 'invalid_age', message: 'Διάλεξε ηλικία 4, 5 ή 6 ετών.' });
  if (!['5','10','15'].includes(duration)) return res.status(400).json({ error: 'invalid_duration', message: 'Διάλεξε διάρκεια 5, 10 ή 15 λεπτών.' });
  if (!['home','classroom'].includes(place)) return res.status(400).json({ error: 'invalid_place', message: 'Διάλεξε σπίτι ή τάξη.' });
  if (looksLikePersonalData(idea)) return res.status(400).json({ error: 'personal_data', message: 'Χρησιμοποίησε μόνο ένα γενικό θέμα, χωρίς όνομα, email, τηλέφωνο ή άλλα προσωπικά στοιχεία παιδιού.' });

  const modeRule = mode === 'story'
    ? 'Give extra weight to a tiny imaginative story and conversation.'
    : mode === 'learn'
      ? 'Give extra weight to early-language, counting, shapes, sorting or pattern play. Never test, score or diagnose.'
      : 'Give extra weight to physical, craft, movement and screen-free play using ordinary household materials.';

  const system = `You create preschool activity ideas for ADULTS to do together with children ages 4 to 6.
This is not a child chatbot. Speak to the adult, not directly to the child.
Return ONLY valid JSON with exactly these string keys: story, words, game, make, offline, adultTip.
Rules:
1. Greek language only.
2. Age appropriate, playful, simple, short and concrete.
3. The child should create, move, talk, notice, sort, count or imagine. Do not make screen time the activity.
4. Never ask for or repeat names, school, location, health, disability, photos, voice, contact details or any personal information.
5. Never diagnose, grade, rank, assess development, claim a learning disorder, or make educational placement decisions.
6. No fear, violence, sexual content, unsafe challenges, medicines, fire, sharp tools, small-object hazards, food allergy advice or unsupervised physical risks.
7. Do not describe the output as therapy or professional advice.
8. Adult supervision is assumed. Mention it in adultTip only where useful.
9. Use common, low-risk household materials. If scissors/glue could be involved, explicitly say adult handles or supervises them.
10. Keep each field under 70 Greek words.
11. Adapt difficulty and instructions to the supplied age, available time and setting.
12. Avoid dash punctuation in Greek output. Prefer short sentences and headings.
${modeRule}`;

  const user = `General theme supplied by the adult: ${idea}. Child age: ${age}. Time available: ${duration} minutes. Setting: ${place}.`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization:`Bearer ${groqKey}` },
      body: JSON.stringify({
        model,
        messages:[{role:'system',content:system},{role:'user',content:user}],
        temperature:0.25,
        max_completion_tokens:1400,
        response_format:{type:'json_object'}
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    const raw = await response.json().catch(() => ({}));
    if (!response.ok) return res.status(response.status || 502).json({ error:'provider_error', message:'Η δραστηριότητα δεν μπόρεσε να δημιουργηθεί.' });
    const text = String(raw?.choices?.[0]?.message?.content || '').trim();
    const activity = parseActivity(text);
    if (!activity) return res.status(502).json({ error:'invalid_result', message:'Το AI δεν επέστρεψε σωστή δραστηριότητα. Δοκίμασε ξανά.' });
    res.setHeader('Cache-Control','no-store');
    return res.status(200).json({ activity, model, provider:'groq' });
  } catch (err) {
    return res.status(err?.name === 'AbortError' ? 504 : 500).json({ error:'server_error', message:err?.name === 'AbortError' ? 'Η υπηρεσία άργησε να απαντήσει.' : 'Η δραστηριότητα δεν μπόρεσε να δημιουργηθεί.' });
  }
};

function looksLikePersonalData(s) {
  return /@|https?:\/\/|\b\d{7,}\b|\b(email|τηλέφων|κινητό|διεύθυν|σχολείο μου|ονομάζεται|λέγεται)\b/i.test(s);
}
function parseActivity(text) {
  try {
    const j = JSON.parse(text.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,''));
    const keys=['story','words','game','make','offline','adultTip'];
    if (!keys.every(k => typeof j[k] === 'string' && j[k].trim())) return null;
    return Object.fromEntries(keys.map(k => [k, clean(j[k])]));
  } catch { return null; }
}
function clean(s) {
  return String(s).replace(/<[^>]+>/g,'').replace(/\s{3,}/g,' ').trim().slice(0,1200);
}