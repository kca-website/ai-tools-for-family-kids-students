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
const { getStudyCache, setStudyCache } = require('../study-runtime-cache');
const { resolveOfficialSchoolbookSource } = require('./schoolbook-source');
const SPECIAL_SECTIONS = require('../special-education-book-sections-2026-2027.js');
const { VERSION: COMPLETE_SOURCE_VERSION } = require('../schoolbook-section');
const { createKnowledgeMapLesson, VERSION: AUDIO_VERSION } = require('../whole-section-audio-knowledge');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed', message: 'Method not allowed.' });
  }
  if (!browserRequestAllowed(req)) return res.status(403).json({ error: 'cross_site_request_blocked', message: 'Cross-site requests are not allowed.' });
  const contentType = String(req.headers?.['content-type'] || req.headers?.['Content-Type'] || '').toLowerCase();
  if (contentType && !contentType.includes('application/json')) return res.status(415).json({ error: 'unsupported_media_type', message: 'Use application/json.' });

  const aiStatus = getAiStatus();
  if (!aiStatus.configured) return res.status(503).json({ error: 'ai_not_configured', message: 'Η AI σύνοψη δεν είναι προσωρινά διαθέσιμη.' });

  const { subjectId = '', topic = '', language = 'el', sourceTitle = '', activity = 'audio' } = req.body || {};
  const sid = String(subjectId || '').trim().slice(0, 200);
  const selectedTopic = String(topic || '').trim().slice(0, 600);
  const lang = language === 'en' ? 'en' : 'el';
  const explanation = activity === 'explain';
  if (!sid || !selectedTopic) return res.status(400).json({ error: 'official_source_identity_required', message: 'Λείπει η επαληθεύσιμη ταυτότητα της επίσημης σχολικής πηγής.' });

  const sourceKey = { kind: activity === 'audio' ? 'official-complete-audio-source-v5' : 'official-schoolbook-source-v1', subjectId: sid, topic: selectedTopic };
  try {
    let officialSource = await getStudyCache(sourceKey);
    const needsStrictAudioRefresh = activity === 'audio' && officialSource?.sourceCompleteness?.parserVersion !== COMPLETE_SOURCE_VERSION && officialSource?.audioGroundedFallback !== true;
    if (!officialSource?.grounded || !officialSource?.text || needsStrictAudioRefresh) {
      let resolved = await resolveOfficialSchoolbookSource(sid, selectedTopic, { purpose: activity === 'audio' ? 'audio' : '' });

      // Some older/primary-school mappings are safely grounded in the exact official
      // ebooks.edu.gr selection but do not yet support the stricter whole-section parser.
      // In that case the normal resolver is still an official-source-only fallback and
      // is preferable to showing a false failure after the UI has already loaded the source.
      if (activity === 'audio' && (!resolved?.ok || !resolved?.body?.grounded || !resolved?.body?.text)) {
        const normalResolved = await resolveOfficialSchoolbookSource(sid, selectedTopic, { purpose: '' });
        if (normalResolved?.ok && normalResolved?.body?.grounded && normalResolved?.body?.text) {
          resolved = {
            ...normalResolved,
            body: { ...normalResolved.body, audioGroundedFallback: true }
          };
        }
      }

      if (!resolved?.ok || !resolved?.body?.grounded || !resolved?.body?.text) {
        const status = Number(resolved?.status || 502);
        return res.status(status >= 500 ? 502 : 400).json({ error: resolved?.body?.error || 'official_source_unavailable', message: 'Δεν φορτώθηκε με ασφάλεια η επίσημη ενότητα του σχολικού βιβλίου.' });
      }
      officialSource = resolved.body;
      await setStudyCache(sourceKey, officialSource, 86400);
    }

    const source = String(officialSource.text || '').trim();
    const title = String(officialSource.bookTitle || sourceTitle || '').trim().slice(0, 300);
    if (source.length < 250) return res.status(400).json({ error: 'source_too_short', message: 'Η επίσημη πηγή δεν έχει αρκετό κείμενο για ασφαλή σύνοψη.' });

    // Ειδική Αγωγή (Ε.Α.Ε.): short, plain-language verified lesson instead of the whole-section narration.
    const simple = SPECIAL_SECTIONS.has(sid);
    if (activity === 'audio' && !simple) return await wholeSectionAudio({ res, source, title, sid, selectedTopic, lang, aiStatus });
    return await verifiedSinglePass({ res, source, title, sid, selectedTopic, lang, aiStatus, explanation, audio: activity === 'audio', simple });
  } catch (err) {
    console.error('SOURCE_SUMMARY_ERROR', err?.stack || err);
    if (String(err?.message) === 'verified_audio_summary_unavailable') return res.status(503).json({error:'verified_audio_summary_unavailable',message:lang === 'en' ? 'Could not verify a concise lesson. Please try again shortly.' : 'Δεν ολοκληρώθηκε ο έλεγχος της σύντομης αφήγησης. Δοκίμασε ξανά σε λίγο.'});
    return res.status(502).json({ error: 'summary_failed', message: lang === 'en' ? 'Could not create a verified summary.' : 'Δεν δημιουργήθηκε επαληθευμένη σύνοψη.' });
  }
};

// Full knowledge-map lesson budget. Past it (or on any failure) the learner gets the fast
// single-pass verified summary of the same official section instead of a hanging request.
const AUDIO_LESSON_BUDGET_MS = 55000;

async function wholeSectionAudio({ res, source, title, sid, selectedTopic, lang, aiStatus }) {
  const cacheKey = { kind: 'verified-whole-chapter-audio', promptVersion: AUDIO_VERSION,
    subjectId: sid, topic: selectedTopic, title, language: lang, source, modelRoute: routingSignature(aiStatus) };
  const cached = await getStudyCache(cacheKey);
  if (cached?.text && cached?.verification?.coverageRatio === 1) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ...cached, cacheHit: true });
  }
  // A recent timeout/failure for this section: go straight to the fast path for a while.
  const slowKey = { kind: 'whole-chapter-audio-slow', promptVersion: AUDIO_VERSION, subjectId: sid, topic: selectedTopic, language: lang };
  if (!(await getStudyCache(slowKey))) {
    const started = Date.now();
    let timer;
    try {
      const response = await Promise.race([
        createKnowledgeMapLesson({ source, topic: selectedTopic, language: lang, deadlineAt: started + AUDIO_LESSON_BUDGET_MS - 8000 }),
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('audio_deadline_exceeded')), AUDIO_LESSON_BUDGET_MS); })
      ]);
      // Retry transient outages next time; do not store degraded narration for a week.
      if (!response.verification.verbatimUnits) await setStudyCache(cacheKey, response);
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ ...response, cacheHit: false });
    } catch (err) {
      console.warn('AUDIO_LESSON_FALLBACK', JSON.stringify({ subjectId: sid, reason: String(err?.message || err), ms: Date.now() - started, sourceChars: source.length }));
      await setStudyCache(slowKey, { at: Date.now(), reason: String(err?.message || err) }, 6 * 3600);
    } finally { clearTimeout(timer); }
  }
  return verifiedSinglePass({ res, source, title, sid, selectedTopic, lang, aiStatus, explanation: false, audio: true });
}

async function verifiedSinglePass({ res, source, title, sid, selectedTopic, lang, aiStatus, explanation, audio = false, simple = false }) {
  const workingSource = compactSourceForTopic(source, selectedTopic, 8000);
  const cacheKey = {
    kind: 'verified-source-summary', promptVersion: 'verified-summary-v6-safe', subjectId: sid,
    topic: selectedTopic, title, language: lang, explanation, audio, source: workingSource, modelRoute: routingSignature(aiStatus),
    // Plain-language Ε.Α.Ε. lessons get their own entries; general-school keys stay unchanged.
    ...(simple ? { learner: 'special-education-v2' } : {}),
  };
  const cached = await getStudyCache(cacheKey);
  if (cached?.text) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ...cached, cacheHit: true });
  }

  const system = lang === 'en'
    ? `Create a concise learner-facing ${explanation ? 'explanation' : 'summary'} from an official schoolbook source. Return ONLY JSON: {"claims":[{"claim":"clear sentence","evidence":"exact 4-24 word excerpt from SOURCE"}]}. Give 5-8 claims, use only SOURCE, and copy evidence exactly.`
    : `Φτιάξε ${explanation ? 'απλή επεξήγηση' : 'σύντομη σύνοψη'} για μαθητή από επίσημη σχολική πηγή. Επίστρεψε ΜΟΝΟ JSON: {"claims":[{"claim":"καθαρή πρόταση","evidence":"ακριβές απόσπασμα 4-24 λέξεων από την ΠΗΓΗ"}]}. Δώσε 5-8 claims, χρησιμοποίησε μόνο την ΠΗΓΗ και αντέγραψε το evidence ακριβώς.`;
  const plainLanguage = !simple ? '' : (lang === 'en'
    ? ' The learner attends a special-education school (Special Gymnasium or Special Lyceum): give 4-6 claims, each ONE short sentence of at most 14 words with one idea, everyday words, no nested clauses; keep official terms but explain them simply.'
    : ' Ο μαθητής φοιτά σε σχολείο Ε.Α.Ε. (Ειδικό Γυμνάσιο ή Ειδικό Λύκειο): δώσε 4-6 claims, το καθένα ΜΙΑ σύντομη πρόταση έως 14 λέξεις με μία ιδέα, απλές καθημερινές λέξεις, χωρίς δευτερεύουσες προτάσεις· κράτα τους επίσημους όρους αλλά εξήγησέ τους απλά.');
  const result = await generateChat({
    messages: [{ role: 'system', content: system + plainLanguage }, { role: 'user', content: `TOPIC: ${selectedTopic}\nSOURCE:\n${workingSource}` }],
    maxTokens: 950, temperature: 0, reasoningEffort: 'low', modelProfile: 'balanced',
  });

  let claims = verifiedClaimsFromResponse(result?.text, workingSource, 10);
  if (claims.length < 3) claims = extractiveFallback(workingSource, 6);
  if (claims.length < 3) return res.status(502).json({ error: 'insufficient_verified_evidence', message: 'Δεν βρέθηκαν αρκετά επαληθεύσιμα σημεία από την επίσημη πηγή.' });

  const label = audio ? (lang === 'en' ? 'Audio lesson' : 'Ακουστικό μάθημα') : explanation ? (lang === 'en' ? 'Explanation' : 'Εξήγηση') : (lang === 'en' ? 'Summary' : 'Σύνοψη');
  const response = {
    text: `${label} – ${selectedTopic}\n\n${paragraphize(claims.map(x => x.claim), 3)}`,
    verified: true,
    mode: audio ? 'verified-summary' : undefined,
    provider: result?.provider || null,
    model: result?.model || null,
    verification: { approved: claims.length },
    usage: normalizeUsage(result?.usage),
  };
  await setStudyCache(cacheKey, response);
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ...response, cacheHit: false });
}

function verifiedClaimsFromResponse(text, source, limit) {
  const parsed = parseJsonObject(text);
  const rows = Array.isArray(parsed?.claims) ? parsed.claims.slice(0, limit) : [];
  const sourceNorm = normalizeForEvidence(source);
  return rows.map(row => ({ claim: clean(row?.claim, 800), evidence: clean(row?.evidence, 500) }))
    .filter(row => row.claim.length >= 10 && row.evidence.length >= 4 && sourceNorm.includes(normalizeForEvidence(row.evidence)) && claimMatchesEvidence(row.claim, row.evidence));
}

function claimMatchesEvidence(claim, evidence) {
  const stop = new Set(['και','των','την','τον','της','του','στο','στη','στην','στον','για','απο','από','ένα','μια','μία','είναι','που','πως','ότι','με','σε','τα','το','οι','τις','the','and','that','with','from','this']);
  const words = value => normalizeForEvidence(value).split(/\s+/)
    .map(word => word.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(word => word.length >= 5 && !stop.has(word));
  const claimWords = words(claim);
  const evidenceWords = words(evidence);
  if (!claimWords.length || !evidenceWords.length) return false;
  return claimWords.some(word => evidenceWords.some(candidate => {
    const stemLength = Math.min(7, Math.max(5, Math.min(word.length, candidate.length) - 2));
    return word.slice(0, stemLength) === candidate.slice(0, stemLength);
  }));
}

function extractiveFallback(segment, maxItems) {
  const raw = String(segment || '').trim();
  if (!raw) return [];
  const wanted = Math.max(1, Math.min(Number(maxItems) || 4, 6));
  const sentences = raw.replace(/\s+/g, ' ').split(/(?<=[.!;·])\s+/).map(s => s.trim())
    .filter(s => s.length >= 24 && s.length <= 520 && !/^https?:\/\//i.test(s) && !looksLikeNavigationLine(s));
  const out = [];
  const take = Math.min(wanted, sentences.length);
  for (let i = 0; i < take; i++) {
    const idx = take === 1 ? Math.floor(sentences.length / 2) : Math.round(i * (sentences.length - 1) / (take - 1));
    const sentence = sentences[idx];
    if (sentence && !out.some(x => claimsTooSimilar(x.claim, sentence))) out.push({ claim: sentence, evidence: sentence.slice(0, 500) });
  }
  if (out.length < wanted) {
    const prose = raw.split('\n').map(x => x.replace(/\s+/g, ' ').trim()).filter(x => x.length >= 15 && !looksLikeNavigationLine(x)).join(' ').trim();
    for (const chunk of verbatimWindows(prose, wanted)) {
      if (out.length >= wanted) break;
      if (!out.some(x => claimsTooSimilar(x.claim, chunk))) out.push({ claim: chunk, evidence: chunk.slice(0, 500) });
    }
  }
  return out;
}

function verbatimWindows(text, count) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const wanted = Math.max(1, Math.min(Number(count) || 1, 6));
  const size = Math.max(18, Math.min(55, Math.ceil(words.length / wanted)));
  const out = [];
  for (let i = 0; i < wanted; i++) {
    const center = wanted === 1 ? Math.floor(words.length / 2) : Math.round(i * (words.length - 1) / (wanted - 1));
    const start = Math.max(0, Math.min(words.length - 1, center - Math.floor(size / 2)));
    const chunk = words.slice(start, Math.min(words.length, start + size)).join(' ').trim();
    if (chunk.length >= 20 && !out.some(x => claimsTooSimilar(x, chunk))) out.push(chunk);
  }
  return out;
}

function looksLikeNavigationLine(value) {
  const line = String(value || '').trim();
  if (!line) return true;
  if (/^(περιεχόμενα|contents|ευρετήριο|index)\b/i.test(line)) return true;
  if (/^(αρχική|επόμενο|προηγούμενο|menu|navigation)\b/i.test(line)) return true;
  if (/^\d+(?:\.\d+){1,3}\s+.{0,90}$/.test(line) && !/[.!;·]$/.test(line)) return true;
  return false;
}

function dedupeClaims(rows) {
  const out = [];
  for (const row of rows || []) {
    if (!row?.claim || out.some(x => claimsTooSimilar(x.claim, row.claim))) continue;
    out.push(row);
  }
  return out;
}

function claimsTooSimilar(a, b) {
  const na = normalizeForEvidence(a), nb = normalizeForEvidence(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  const stop = new Set(['και','των','την','τον','της','του','στο','στη','στην','στον','για','απο','από','ένα','μια','μία','είναι','που','με','σε','τα','το','οι','τις']);
  const words = v => new Set(v.split(/\s+/).map(x => x.replace(/[^\p{L}\p{N}]/gu, '')).filter(x => x.length >= 4 && !stop.has(x)));
  const aa = words(na), bb = words(nb);
  if (!aa.size || !bb.size) return false;
  let overlap = 0;
  for (const w of aa) if (bb.has(w)) overlap++;
  return overlap / Math.min(aa.size, bb.size) >= 0.88;
}

function compactSourceForTopic(source, topic, maxChars) {
  const full = String(source || '').trim();
  const limit = Math.max(3000, Number(maxChars) || 8000);
  if (full.length <= limit) return full;
  const keys = [...new Set(normalizeForEvidence(topic).split(/\s+/).filter(x => x.length >= 4))].slice(0, 12);
  const chunks = [];
  for (let i = 0; i < full.length; i += 1800) chunks.push({ index: i, text: full.slice(i, i + 2200) });
  const scored = chunks.map(row => {
    const norm = normalizeForEvidence(row.text);
    let score = 0;
    for (const key of keys) if (norm.includes(key)) score++;
    return { ...row, score };
  }).sort((a, b) => b.score - a.score || a.index - b.index);
  const selected = [];
  let used = 0;
  for (const row of scored) {
    if (selected.some(x => x.index === row.index)) continue;
    const room = limit - used;
    if (room < 400) break;
    const piece = row.text.slice(0, room);
    selected.push({ index: row.index, text: piece });
    used += piece.length;
  }
  return selected.sort((a, b) => a.index - b.index).map(x => x.text).join('\n\n').slice(0, limit);
}

function formatAudio(claims, topic, lang) {
  const heading = lang === 'en' ? `Audio lesson covering the whole selected section – ${topic}` : `Ακουστικό μάθημα για όλη την επιλεγμένη ενότητα – ${topic}`;
  return `${heading}\n\n${paragraphize(claims, 2)}`;
}
function paragraphize(claims, perParagraph = 3) {
  const out = [];
  for (let i = 0; i < claims.length; i += perParagraph) out.push(claims.slice(i, i + perParagraph).join(' '));
  return out.join('\n\n');
}
function escapeRegExp(value) { return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function clean(value, max) { return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max); }
function normalizeForEvidence(value) {
  return String(value || '').normalize('NFKC').replace(/[“”„]/g, '"').replace(/[’‘]/g, "'").replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();
}
function parseJsonObject(text) {
  const raw = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try { return JSON.parse(raw); } catch (_) {}
  const a = raw.indexOf('{'), b = raw.lastIndexOf('}');
  if (a >= 0 && b > a) { try { return JSON.parse(raw.slice(a, b + 1)); } catch (_) {} }
  return null;
}
function routingSignature(aiStatus) {
  const providers = Array.isArray(aiStatus?.providers) ? aiStatus.providers : [];
  return providers.map(({ name, model }) => `${name}:${model || ''}`).join('|');
}
function normalizeUsage(usage) {
  return { promptTokens: Number(usage?.promptTokens || 0), completionTokens: Number(usage?.completionTokens || 0), totalTokens: Number(usage?.totalTokens || 0), cachedTokens: Number(usage?.cachedTokens || 0) };
}
function addUsage(target, usage) {
  const u = normalizeUsage(usage);
  target.promptTokens += u.promptTokens;
  target.completionTokens += u.completionTokens;
  target.totalTokens += u.totalTokens;
  target.cachedTokens += u.cachedTokens;
}

module.exports.config = { maxDuration: 300 };
