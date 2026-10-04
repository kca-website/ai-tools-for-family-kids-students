function browserRequestAllowed(req) {
  const headers = req?.headers || {};
  const fetchSite = String(headers['sec-fetch-site'] || headers['Sec-Fetch-Site'] || '').toLowerCase();
  if (fetchSite === 'cross-site') return false;
  const origin = String(headers.origin || headers.Origin || '').trim();
  if (!origin) return true;
  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' && host !== 'localhost' && host !== '127.0.0.1') return false;
    if (host === 'www.aitools4kids.gr' || host === 'aitools4kids.gr') return true;
    if (host === 'localhost' || host === '127.0.0.1') return true;
    return /^aitools4kids(?:-[a-z0-9-]+)*-kcawebsite\.vercel\.app$/.test(host);
  } catch (_) { return false; }
}

const { generateChat, getAiStatus } = require('../ai-provider-router');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  if (!browserRequestAllowed(req)) return res.status(403).json({ error: 'cross_site_request_blocked' });
  const aiStatus = getAiStatus();
  if (!aiStatus.configured) return res.status(503).json({ error: 'ai_not_configured', message: 'Ο έλεγχος AI δεν είναι προσωρινά διαθέσιμος.' });

  const { subjectId = '', subject = '', grade = '', topic = '', activity = '', language = 'el', text = '' } = req.body || {};
  const sid = String(subjectId || '').trim().slice(0, 120);
  const answer = String(text || '').trim().slice(0, 12000);
  const lang = language === 'en' ? 'en' : 'el';
  if (!/-dimotikou$/i.test(sid) || !answer || !String(topic || '').trim()) {
    return res.status(400).json({ error: 'invalid_primary_review_request', message: 'Μη έγκυρο αίτημα ελέγχου Δημοτικού.' });
  }

  const system = lang === 'en'
    ? `You are the safety reviewer for an AI Study answer for Greek primary school. The answer is NOT grounded in an exact textbook excerpt. Check it conservatively against stable primary-school knowledge and the supplied grade/subject/topic. Return ONLY JSON: {"approved":true|false,"text":"...","reason":"..."}. If the answer contains a factual mistake, invented detail, dubious date/number/name, content clearly beyond the selected topic, or wording that could misteach a child, set approved=false and rewrite it into a short safe version. Remove uncertain specifics instead of guessing. Preserve valid structured JSON exactly when the activity requires JSON. Never add new facts just to make the answer richer.`
    : `Είσαι ο δεύτερος ελεγκτής ασφάλειας μιας απάντησης AI Μελέτης για μαθητή Δημοτικού. Η απάντηση ΔΕΝ είναι δεμένη με ακριβές απόσπασμα σχολικού βιβλίου. Έλεγξέ την συντηρητικά με βάση σταθερές γνώσεις Δημοτικού και την τάξη/μάθημα/θέμα που δίνονται. Επίστρεψε ΜΟΝΟ JSON: {"approved":true|false,"text":"...","reason":"..."}. Αν υπάρχει πραγματολογικό λάθος, επινοημένη λεπτομέρεια, αμφίβολο όνομα/ημερομηνία/αριθμός, περιεχόμενο έξω από το επιλεγμένο θέμα ή διατύπωση που μπορεί να διδάξει λάθος το παιδί, βάλε approved=false και ξαναγράψε μια σύντομη ασφαλή εκδοχή. Αφαίρεσε αβέβαιες λεπτομέρειες αντί να μαντεύεις. Αν η δραστηριότητα απαιτεί δομημένο JSON, διατήρησε ακριβώς τη σωστή δομή. Μην προσθέτεις νέα γεγονότα μόνο για να γίνει η απάντηση πιο πλούσια.`;

  const user = `Grade: ${String(grade || '').slice(0,80)}\nSubject: ${String(subject || sid).slice(0,180)}\nTopic: ${String(topic || '').slice(0,500)}\nActivity: ${String(activity || '').slice(0,80)}\n\nANSWER TO REVIEW:\n${answer}`;
  try {
    const result = await generateChat({
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      maxTokens: 1400,
      temperature: 0,
      reasoningEffort: 'low',
      modelProfile: 'quality'
    });
    if (!result?.ok || !result?.text) return res.status(502).json({ error: 'review_failed', message: 'Δεν ολοκληρώθηκε ο δεύτερος έλεγχος AI.' });
    const parsed = parseJsonObject(result.text);
    const reviewed = String(parsed?.text || '').trim();
    if (!reviewed) return res.status(502).json({ error: 'invalid_review', message: 'Ο δεύτερος έλεγχος AI δεν επέστρεψε ασφαλές αποτέλεσμα.' });
    return res.status(200).json({
      approved: parsed?.approved !== false,
      text: reviewed,
      reason: String(parsed?.reason || '').slice(0,500),
      provider: result.provider || null,
      model: result.model || null,
      reviewMode: 'primary-ai-second-pass'
    });
  } catch (err) {
    console.error('PRIMARY_AI_REVIEW_ERROR', err?.stack || err);
    return res.status(502).json({ error: 'review_failed', message: 'Δεν ολοκληρώθηκε ο δεύτερος έλεγχος AI.' });
  }
};

function parseJsonObject(text) {
  const raw = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try { return JSON.parse(raw); } catch (_) {}
  const a = raw.indexOf('{'), b = raw.lastIndexOf('}');
  if (a >= 0 && b > a) {
    try { return JSON.parse(raw.slice(a, b + 1)); } catch (_) {}
  }
  return null;
}
