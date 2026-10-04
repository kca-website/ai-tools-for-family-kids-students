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

const { resolveOfficialSchoolbookSource } = require('./schoolbook-source');
const { createKnowledgeMapLesson, VERSION } = require('../whole-section-audio-knowledge');

module.exports = async function handler(req, res) {
  const previewGet = req.method === 'GET' && process.env.VERCEL_ENV === 'preview';
  if (req.method !== 'POST' && !previewGet) {
    res.setHeader('Allow', process.env.VERCEL_ENV === 'preview' ? 'GET, POST' : 'POST');
    return res.status(405).json({ error:'method_not_allowed' });
  }
  if (!browserRequestAllowed(req)) return res.status(403).json({ error:'cross_site_request_blocked' });
  const input = previewGet ? (req.query || {}) : (req.body || {});
  const { subjectId = '', topic = '', language = 'el' } = input;
  const sid = String(subjectId || '').trim().slice(0,120);
  const selectedTopic = String(topic || '').trim().slice(0,600);
  const lang = language === 'en' ? 'en' : 'el';
  if (!sid || !selectedTopic) return res.status(400).json({ error:'identity_required', message:'subjectId και topic είναι υποχρεωτικά.' });
  try {
    const resolved = await resolveOfficialSchoolbookSource(sid, selectedTopic, { purpose:'audio' });
    if (!resolved?.ok || !resolved?.body?.grounded || !resolved?.body?.text) {
      return res.status(400).json({ error:resolved?.body?.error || 'official_source_unavailable', message:'Δεν βρέθηκε επαληθευμένη επίσημη ενότητα.' });
    }
    const source = String(resolved.body.text || '').trim();
    const result = await createKnowledgeMapLesson({ source, topic:selectedTopic, language:lang });
    res.setHeader('Cache-Control','no-store');
    return res.status(200).json({
      ...result,
      preview:true,
      previewVersion:VERSION,
      sourceTitle:resolved.body.bookTitle || null,
      sourceUrl:resolved.body.sourceUrl || null,
    });
  } catch (error) {
    console.error('AUDIO_KNOWLEDGE_PREVIEW_ERROR', error?.stack || error);
    return res.status(502).json({ error:'preview_failed', message:String(error?.message || error).slice(0,180) });
  }
};
