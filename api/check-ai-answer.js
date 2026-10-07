const { generateChat, getAiStatus } = require('../ai-provider-router');
const { checkAnswer, MAX_ANSWER_CHARS, MAX_SOURCE_CHARS } = require('../ai-answer-check');

function browserRequestAllowed(req) {
  if (String(req.headers?.['sec-fetch-site'] || '').toLowerCase() === 'cross-site') return false;
  const origin = req.headers?.origin;
  if (!origin) return true;
  try {
    const url = new URL(origin), host = url.hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1') return ['http:', 'https:'].includes(url.protocol);
    return url.protocol === 'https:' && (['www.aitools4kids.gr', 'aitools4kids.gr'].includes(host) || /^aitools4kids(?:-[a-z0-9-]+)*-kcawebsite\.vercel\.app$/.test(host));
  } catch { return false; }
}
function createHandler(dependencies = {}) {
  const generate = dependencies.generate || generateChat;
  const status = dependencies.status || getAiStatus;
  const resolve = dependencies.resolve || ((...args) => require('./schoolbook-source').resolveOfficialSchoolbookSource(...args));
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'method_not_allowed' }); }
    if (!browserRequestAllowed(req)) return res.status(403).json({ error: 'cross_site_request_blocked' });
    if (!String(req.headers?.['content-type'] || '').toLowerCase().includes('application/json')) return res.status(415).json({ error: 'unsupported_media_type' });
    const body = req.body || {}, language = body.language === 'en' ? 'en' : 'el';
    const message = (el, en) => language === 'en' ? en : el;
    if (typeof body.answer !== 'string' || body.answer.trim().length < 20) return res.status(400).json({ error: 'answer_required', message: message('Επικόλλησε μια απάντηση με τουλάχιστον 20 χαρακτήρες.', 'Paste an answer with at least 20 characters.') });
    if (body.answer.length > MAX_ANSWER_CHARS) return res.status(413).json({ error: 'answer_too_large', message: message('Ο έλεγχος δέχεται έως 6.000 χαρακτήρες. Επίλεξε ένα μικρότερο απόσπασμα.', 'The check accepts up to 6,000 characters. Select a shorter passage.') });
    if (typeof body.subjectId !== 'string' || !body.subjectId.trim() || body.subjectId.length > 200 || typeof body.topic !== 'string' || !body.topic.trim() || body.topic.length > 600) return res.status(400).json({ error: 'official_source_identity_required', message: message('Διάλεξε μάθημα και σχολική ενότητα.', 'Choose a subject and textbook unit.') });
    if (!status().configured) return res.status(503).json({ error: 'ai_not_configured', message: message('Ο έλεγχος AI δεν είναι προσωρινά διαθέσιμος.', 'AI checking is temporarily unavailable.') });
    try {
      const ctx = body.studyContext || {};
      const epal = ctx.schoolType === 'epal' || /^epal-[abc]-/.test(body.subjectId);
      const options = epal ? { schoolType: 'epal', grade: String(ctx.grade || '').slice(0, 4), sector: String(ctx.sector || '').slice(0, 160), specialty: String(ctx.specialty || '').slice(0, 160) } : {};
      // Never accept client-supplied documentText, evidence, URLs or source policy.
      const resolved = await resolve(body.subjectId.trim(), body.topic.trim(), options);
      const official = resolved?.body;
      if (!resolved?.ok || official?.grounded !== true || typeof official.text !== 'string' || official.text.trim().length < 100) return res.status(422).json({ error: 'official_source_required', message: message('Δεν είναι διαθέσιμη επαληθευμένη επίσημη πηγή για αυτή την ενότητα. Διάλεξε άλλη ενότητα· δεν έγινε έλεγχος.', 'A verified official source is not available for this unit. Choose another unit; no check was performed.') });
      const source = official.text.trim();
      if (source.length > MAX_SOURCE_CHARS) return res.status(422).json({ error: 'source_too_large', message: message('Η ενότητα είναι πολύ μεγάλη για ασφαλή έλεγχο. Διάλεξε μικρότερη ενότητα.', 'This unit is too long to check safely. Choose a smaller unit.') });
      const claims = await checkAnswer({ answer: body.answer.trim(), source, topic: body.topic.trim(), language, generate });
      return res.status(200).json({
        claims, scope: 'selected_claims_in_official_section',
        source: { title: String(official.bookTitle || 'Σχολικό βιβλίο').slice(0, 300), topic: body.topic.trim(), url: String(official.canonicalSourceUrl || official.sourceUrl || '').slice(0, 1200) },
        notice: message('Ελέγχθηκαν έως 12 βασικοί ισχυρισμοί με το διαθέσιμο επίσημο κείμενο της επιλεγμένης ενότητας. Η εξαγωγή μπορεί να μην περιλαμβάνει όλη την ενότητα, εικόνες ή διαγράμματα. Η απουσία τεκμηρίωσης δεν σημαίνει ότι ένας ισχυρισμός είναι λάθος. Ο έλεγχος χρησιμοποιεί AI και χρειάζεται δική σου κρίση.', 'Up to 12 key claims were checked against the available official text of the selected section. Extraction may omit parts of the section, images or diagrams. Missing evidence does not mean a claim is false. This check uses AI and needs your judgement.')
      });
    } catch {
      // Never log the external answer, textbook text or provider error payload.
      return res.status(503).json({ error: 'answer_check_unavailable', message: message('Δεν ολοκληρώθηκε αξιόπιστα ο έλεγχος. Δεν εμφανίζεται συμπέρασμα· δοκίμασε ξανά σε λίγο.', 'The check could not be completed reliably. No conclusion is shown; try again shortly.') });
    }
  };
}
module.exports = createHandler();
module.exports.createHandler = createHandler;
module.exports.config = { maxDuration: 180 };
