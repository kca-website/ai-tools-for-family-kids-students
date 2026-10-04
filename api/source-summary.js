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
  } catch (_) {
    return false;
  }
}

const { generateChat, getAiStatus } = require('../ai-provider-router');
const { getStudyCache, setStudyCache } = require('../study-runtime-cache');
const { resolveOfficialSchoolbookSource } = require('./schoolbook-source');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed', message: 'Method not allowed.' });
  }
  if (!browserRequestAllowed(req)) {
    return res.status(403).json({ error: 'cross_site_request_blocked', message: 'Cross-site requests are not allowed.' });
  }
  const contentType = String(req.headers?.['content-type'] || req.headers?.['Content-Type'] || '').toLowerCase();
  if (contentType && !contentType.includes('application/json')) {
    return res.status(415).json({ error: 'unsupported_media_type', message: 'Use application/json.' });
  }

  const aiStatus = getAiStatus();
  if (!aiStatus.configured) {
    return res.status(503).json({ error: 'ai_not_configured', message: 'Η AI σύνοψη δεν είναι προσωρινά διαθέσιμη.' });
  }

  const { subjectId = '', topic = '', language = 'el', sourceTitle = '', activity = 'audio' } = req.body || {};
  const sid = String(subjectId || '').trim().slice(0, 120);
  const selectedTopic = String(topic || '').trim().slice(0, 600);
  const lang = language === 'en' ? 'en' : 'el';
  const audioLesson = activity === 'audio';
  const explanation = activity === 'explain';

  if (!sid || !selectedTopic) {
    return res.status(400).json({
      error: 'official_source_identity_required',
      message: 'Λείπει η επαληθεύσιμη ταυτότητα της επίσημης σχολικής πηγής.'
    });
  }

  let officialSource = await getStudyCache({ kind: 'official-schoolbook-source-v1', subjectId: sid, topic: selectedTopic });
  if (!officialSource?.grounded || !officialSource?.text) {
    const resolved = await resolveOfficialSchoolbookSource(sid, selectedTopic);
    if (!resolved?.ok || !resolved?.body?.grounded || !resolved?.body?.text) {
      const status = Number(resolved?.status || 502);
      return res.status(status >= 500 ? 502 : 400).json({
        error: resolved?.body?.error || 'official_source_unavailable',
        message: 'Δεν φορτώθηκε με ασφάλεια η επίσημη ενότητα του σχολικού βιβλίου.'
      });
    }
    officialSource = resolved.body;
    await setStudyCache({ kind: 'official-schoolbook-source-v1', subjectId: sid, topic: selectedTopic }, officialSource, 86400);
  }

  const source = String(officialSource.text || '').trim();
  const title = String(officialSource.bookTitle || sourceTitle || '').trim().slice(0, 300);
  if (source.length < 250) {
    return res.status(400).json({ error: 'source_too_short', message: 'Η επίσημη πηγή δεν έχει αρκετό κείμενο για ασφαλή σύνοψη.' });
  }

  try {
    if (audioLesson) {
      return await wholeChapterAudio({ res, source, title, sid, selectedTopic, lang, aiStatus });
    }
    return await verifiedSinglePass({ res, source, title, sid, selectedTopic, lang, aiStatus, explanation });
  } catch (err) {
    console.error('SOURCE_SUMMARY_ERROR', err?.stack || err);
    return res.status(502).json({
      error: 'summary_failed',
      message: lang === 'en' ? 'Could not create a verified summary.' : 'Δεν δημιουργήθηκε επαληθευμένη σύνοψη.'
    });
  }
};

async function wholeChapterAudio({ res, source, title, sid, selectedTopic, lang, aiStatus }) {
  const scopedSource = scopeToSelectedSection(source, selectedTopic);
  const cacheKey = {
    kind: 'verified-whole-chapter-audio',
    promptVersion: 'whole-chapter-audio-v6-global-detailed-coverage',
    subjectId: sid,
    topic: selectedTopic,
    title,
    language: lang,
    source: scopedSource,
    modelRoute: routingSignature(aiStatus),
  };
  const cached = await getStudyCache(cacheKey);
  if (cached?.text) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ...cached, cacheHit: true });
  }

  const segments = splitWholeChapter(scopedSource, 2200, 10);
  const rowsBySegment = [];
  let provider = null;
  let model = null;
  const usage = { promptTokens: 0, completionTokens: 0, totalTokens: 0, cachedTokens: 0 };

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    let generated = null;
    try {
      generated = await generateSegmentClaims({ segment, index: i, count: segments.length, selectedTopic, lang });
    } catch (err) {
      console.warn('SOURCE_SUMMARY_SEGMENT_AI_ERROR', JSON.stringify({ part: i + 1, message: String(err?.message || err).slice(0, 240) }));
    }

    if (generated?.ok) {
      provider = generated.provider || provider;
      model = generated.model || model;
      addUsage(usage, generated.usage);
    }

    let claims = verifiedClaimsFromResponse(generated?.text, segment, 7);
    if (claims.length < 4) {
      const fallback = extractiveFallback(segment, 4);
      for (const row of fallback) {
        if (claims.length >= 4) break;
        if (!claims.some(x => claimsTooSimilar(x.claim, row.claim))) claims.push(row);
      }
    }
    rowsBySegment.push(dedupeClaims(claims));
  }

  const covered = rowsBySegment.filter(rows => rows.length > 0).length;
  if (!segments.length || covered !== segments.length) {
    return res.status(502).json({
      error: 'incomplete_chapter_coverage',
      message: lang === 'en'
        ? 'The complete selected section could not be represented safely.'
        : 'Δεν μπόρεσε να καλυφθεί με ασφάλεια ολόκληρη η επιλεγμένη ενότητα.'
    });
  }

  const claimLimit = Math.min(40, Math.max(12, segments.length * 5));
  const selected = [];
  for (const rows of rowsBySegment) {
    for (const row of rows) {
      if (selected.length >= claimLimit) break;
      if (!selected.some(x => claimsTooSimilar(x.claim, row.claim))) selected.push(row);
    }
    if (selected.length >= claimLimit) break;
  }

  const text = formatAudio(selected.map(x => x.claim), selectedTopic, lang);
  const response = {
    text,
    verified: true,
    wholeChapter: true,
    verification: {
      segments: segments.length,
      segmentsCovered: covered,
      approved: selected.length,
      coverageRatio: 1,
      sourceChars: source.length,
      scopedChars: scopedSource.length,
    },
    provider,
    model,
    usage,
  };
  await setStudyCache(cacheKey, response);
  console.info('AI_METRIC ' + JSON.stringify({
    event: 'ai_request', task: 'whole_chapter_audio', activity: 'audio', status: 200,
    provider: provider || '', model: model || '', segments: segments.length,
    approved: selected.length, sourceChars: source.length, scopedChars: scopedSource.length,
    ...usage,
  }));
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ...response, cacheHit: false });
}

async function generateSegmentClaims({ segment, index, count, selectedTopic, lang }) {
  const system = lang === 'en'
    ? `You are preparing ONE sequential part of a spoken lesson from an official schoolbook. Return ONLY valid JSON: {"claims":[{"claim":"one clear explanatory sentence","evidence":"an exact 4-24 word excerpt copied from PART"}]}. Produce 4-6 claims. Cover the important ideas in this PART, including definitions, processes, relationships, causes/results, formulas, units, explicit conversions and textbook examples when they are present. Explain enough for a student to understand, not just memorize labels. Do not repeat the same idea. Do not use outside knowledge. Evidence must be copied exactly from PART.`
    : `Ετοιμάζεις ΕΝΑ διαδοχικό τμήμα προφορικού μαθήματος από επίσημο σχολικό βιβλίο. Επίστρεψε ΜΟΝΟ έγκυρο JSON: {"claims":[{"claim":"μία καθαρή επεξηγηματική πρόταση","evidence":"ακριβές απόσπασμα 4-24 λέξεων αντιγραμμένο από το ΤΜΗΜΑ"}]}. Δώσε 4-6 claims. Κάλυψε τις σημαντικές ιδέες αυτού του ΤΜΗΜΑΤΟΣ, μαζί με ορισμούς, διαδικασίες, σχέσεις, αιτίες/αποτελέσματα, τύπους, μονάδες, ρητές μετατροπές και παραδείγματα του βιβλίου όταν υπάρχουν. Εξήγησε αρκετά ώστε ο μαθητής να καταλαβαίνει και όχι απλώς να απομνημονεύει ονομασίες. Μην επαναλαμβάνεις την ίδια ιδέα. Μην χρησιμοποιείς εξωτερική γνώση. Το evidence πρέπει να αντιγράφεται ακριβώς από το ΤΜΗΜΑ.`;

  return generateChat({
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: `TOPIC: ${selectedTopic}\nPART ${index + 1} OF ${count}:\n\n${segment}` }
    ],
    maxTokens: 1100,
    temperature: 0,
    reasoningEffort: 'low',
    modelProfile: 'balanced',
  });
}

async function verifiedSinglePass({ res, source, title, sid, selectedTopic, lang, aiStatus, explanation }) {
  const workingSource = compactSourceForTopic(source, selectedTopic, 8000);
  const cacheKey = {
    kind: 'verified-source-summary',
    promptVersion: 'verified-summary-v6-safe',
    subjectId: sid,
    topic: selectedTopic,
    title,
    language: lang,
    explanation,
    source: workingSource,
    modelRoute: routingSignature(aiStatus),
  };
  const cached = await getStudyCache(cacheKey);
  if (cached?.text) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ...cached, cacheHit: true });
  }

  const system = lang === 'en'
    ? `Create a concise learner-facing ${explanation ? 'explanation' : 'summary'} from an official schoolbook source. Return ONLY JSON: {"claims":[{"claim":"clear sentence","evidence":"exact 4-24 word excerpt from SOURCE"}]}. Give 5-8 claims, use only SOURCE, and copy evidence exactly.`
    : `Φτιάξε ${explanation ? 'απλή επεξήγηση' : 'σύντομη σύνοψη'} για μαθητή από επίσημη σχολική πηγή. Επίστρεψε ΜΟΝΟ JSON: {"claims":[{"claim":"καθαρή πρόταση","evidence":"ακριβές απόσπασμα 4-24 λέξεων από την ΠΗΓΗ"}]}. Δώσε 5-8 claims, χρησιμοποίησε μόνο την ΠΗΓΗ και αντέγραψε το evidence ακριβώς.`;

  const result = await generateChat({
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: `TOPIC: ${selectedTopic}\nSOURCE:\n${workingSource}` }
    ],
    maxTokens: 950,
    temperature: 0,
    reasoningEffort: 'low',
    modelProfile: 'balanced',
  });

  let claims = verifiedClaimsFromResponse(result?.text, workingSource, 10);
  if (claims.length < 3) claims = extractiveFallback(workingSource, 6);
  if (claims.length < 3) {
    return res.status(502).json({ error: 'insufficient_verified_evidence', message: 'Δεν βρέθηκαν αρκετά επαληθεύσιμα σημεία από την επίσημη πηγή.' });
  }

  const label = explanation ? (lang === 'en' ? 'Explanation' : 'Εξήγηση') : (lang === 'en' ? 'Summary' : 'Σύνοψη');
  const text = `${label} – ${selectedTopic}\n\n${paragraphize(claims.map(x => x.claim), 3)}`;
  const response = {
    text,
    verified: true,
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
  return rows.map(row => ({
    claim: clean(row?.claim, 800),
    evidence: clean(row?.evidence, 500),
  })).filter(row =>
    row.claim.length >= 10 &&
    row.evidence.length >= 4 &&
    sourceNorm.includes(normalizeForEvidence(row.evidence))
  );
}

function extractiveFallback(segment, maxSentences) {
  const sentences = String(segment || '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!;·])\s+/)
    .map(s => s.trim())
    .filter(s => s.length >= 35 && s.length <= 420)
    .filter(s => !/^https?:\/\//i.test(s));
  if (!sentences.length) return [];

  const wanted = Math.max(1, Math.min(maxSentences || 4, sentences.length));
  const out = [];
  for (let i = 0; i < wanted; i++) {
    const idx = wanted === 1
      ? Math.floor(sentences.length / 2)
      : Math.round(i * (sentences.length - 1) / (wanted - 1));
    const sentence = sentences[Math.min(sentences.length - 1, idx)];
    if (sentence && !out.some(x => claimsTooSimilar(x.claim, sentence))) {
      out.push({ claim: sentence, evidence: sentence.slice(0, 500) });
    }
  }
  return out;
}

function scopeToSelectedSection(source, topic) {
  const full = String(source || '').trim();
  if (!full) return '';

  const codeMatch = String(topic || '').match(/(?:^|[^\d])(\d+\.\d+(?:\.\d+)?)(?:[^\d]|$)/);
  let scoped = full;
  if (codeMatch) {
    const code = codeMatch[1];
    const lines = full.split('\n');
    const headingRe = new RegExp('^\\s*' + escapeRegExp(code) + '(?:\\s|[-–—.:]|$)');
    const start = lines.findIndex(line => headingRe.test(line));
    if (start >= 0) {
      const depth = code.split('.').length;
      let end = lines.length;
      for (let i = start + 1; i < lines.length; i++) {
        const match = lines[i].match(/^\s*(\d+(?:\.\d+)+)(?:\s|[-–—.:]|$)/);
        if (!match || match[1] === code) continue;
        const other = match[1].split('.');
        if (other.length <= depth) {
          end = i;
          break;
        }
      }
      const candidate = lines.slice(start, end).join('\n').trim();
      if (candidate.length >= 500) scoped = candidate;
    }
  }

  const tailMarkers = ['\nΕρωτήσεις', '\nΑΣΚΗΣΕΙΣ', '\nΑσκήσεις', '\nΔραστηριότητες', '\nΠαιχνίδι αυτοαξιολόγησης'];
  const ends = tailMarkers.map(marker => scoped.indexOf(marker)).filter(i => i >= 700);
  if (ends.length) scoped = scoped.slice(0, Math.min(...ends));
  return scoped.trim();
}

function splitWholeChapter(source, targetChars = 2200, maxParts = 10) {
  const full = String(source || '').trim();
  if (!full) return [];

  let desired = Math.ceil(full.length / Math.max(1200, targetChars));
  if (full.length >= 2400) desired = Math.max(2, desired);
  if (full.length >= 4200) desired = Math.max(3, desired);
  desired = Math.max(1, Math.min(maxParts, desired));

  const approx = Math.ceil(full.length / desired);
  const out = [];
  let pos = 0;
  while (pos < full.length && out.length < desired) {
    let end = out.length === desired - 1 ? full.length : Math.min(full.length, pos + approx);
    if (end < full.length) {
      const floor = pos + Math.floor(approx * 0.65);
      const candidates = [
        full.lastIndexOf('\n\n', end),
        full.lastIndexOf('. ', end),
        full.lastIndexOf('; ', end),
        full.lastIndexOf('· ', end),
      ].filter(x => x >= floor);
      if (candidates.length) {
        const best = Math.max(...candidates);
        end = best + (full.slice(best, best + 2) === '. ' ? 1 : 0);
      }
    }
    const part = full.slice(pos, end).trim();
    if (part) out.push(part);
    if (end <= pos) break;
    pos = end;
  }
  if (pos < full.length && out.length) out[out.length - 1] += '\n\n' + full.slice(pos).trim();
  return out.filter(part => part.length >= 120);
}

function dedupeClaims(rows) {
  const out = [];
  for (const row of rows || []) {
    const claim = String(row?.claim || '').trim();
    if (!claim) continue;
    if (out.some(existing => claimsTooSimilar(existing.claim, claim))) continue;
    out.push(row);
  }
  return out;
}

function claimsTooSimilar(a, b) {
  const na = normalizeForEvidence(a);
  const nb = normalizeForEvidence(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  const stop = new Set(['και','των','την','τον','της','του','στο','στη','στην','στον','για','απο','από','ένα','μια','μία','είναι','που','με','σε','τα','το','οι','τις']);
  const words = value => new Set(value.split(/\s+/).map(x => x.replace(/[^\p{L}\p{N}]/gu, '')).filter(x => x.length >= 4 && !stop.has(x)));
  const aa = words(na);
  const bb = words(nb);
  if (!aa.size || !bb.size) return false;
  let overlap = 0;
  for (const word of aa) if (bb.has(word)) overlap += 1;
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
    for (const key of keys) if (norm.includes(key)) score += 1;
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
  const heading = lang === 'en'
    ? `Audio lesson covering the whole selected section – ${topic}`
    : `Ακουστικό μάθημα για όλη την επιλεγμένη ενότητα – ${topic}`;
  return `${heading}\n\n${paragraphize(claims, 2)}`;
}

function paragraphize(claims, perParagraph = 3) {
  const paragraphs = [];
  for (let i = 0; i < claims.length; i += perParagraph) {
    paragraphs.push(claims.slice(i, i + perParagraph).join(' '));
  }
  return paragraphs.join('\n\n');
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function clean(value, max) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function normalizeForEvidence(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/[“”„]/g, '"')
    .replace(/[’‘]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function parseJsonObject(text) {
  const raw = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try { return JSON.parse(raw); } catch (_) {}
  const a = raw.indexOf('{');
  const b = raw.lastIndexOf('}');
  if (a >= 0 && b > a) {
    try { return JSON.parse(raw.slice(a, b + 1)); } catch (_) {}
  }
  return null;
}

function routingSignature(aiStatus) {
  const providers = Array.isArray(aiStatus?.providers) ? aiStatus.providers : [];
  return providers.map(({ name, model }) => `${name}:${model || ''}`).join('|');
}

function normalizeUsage(usage) {
  return {
    promptTokens: Number(usage?.promptTokens || 0),
    completionTokens: Number(usage?.completionTokens || 0),
    totalTokens: Number(usage?.totalTokens || 0),
    cachedTokens: Number(usage?.cachedTokens || 0),
  };
}

function addUsage(target, usage) {
  const u = normalizeUsage(usage);
  target.promptTokens += u.promptTokens;
  target.completionTokens += u.completionTokens;
  target.totalTokens += u.totalTokens;
  target.cachedTokens += u.cachedTokens;
}
