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
  const sid = String(subjectId || '').trim().slice(0, 120);
  const selectedTopic = String(topic || '').trim().slice(0, 600);
  const lang = language === 'en' ? 'en' : 'el';
  const explanation = activity === 'explain';
  if (!sid || !selectedTopic) return res.status(400).json({ error: 'official_source_identity_required', message: 'Λείπει η επαληθεύσιμη ταυτότητα της επίσημης σχολικής πηγής.' });

  let officialSource = await getStudyCache({ kind: 'official-schoolbook-source-v1', subjectId: sid, topic: selectedTopic });
  if (!officialSource?.grounded || !officialSource?.text) {
    const resolved = await resolveOfficialSchoolbookSource(sid, selectedTopic);
    if (!resolved?.ok || !resolved?.body?.grounded || !resolved?.body?.text) {
      const status = Number(resolved?.status || 502);
      return res.status(status >= 500 ? 502 : 400).json({ error: resolved?.body?.error || 'official_source_unavailable', message: 'Δεν φορτώθηκε με ασφάλεια η επίσημη ενότητα του σχολικού βιβλίου.' });
    }
    officialSource = resolved.body;
    await setStudyCache({ kind: 'official-schoolbook-source-v1', subjectId: sid, topic: selectedTopic }, officialSource, 86400);
  }

  const source = String(officialSource.text || '').trim();
  const title = String(officialSource.bookTitle || sourceTitle || '').trim().slice(0, 300);
  if (source.length < 250) return res.status(400).json({ error: 'source_too_short', message: 'Η επίσημη πηγή δεν έχει αρκετό κείμενο για ασφαλή σύνοψη.' });

  try {
    if (activity === 'audio') return await wholeSectionAudio({ res, source, title, sid, selectedTopic, lang, aiStatus });
    return await verifiedSinglePass({ res, source, title, sid, selectedTopic, lang, aiStatus, explanation });
  } catch (err) {
    console.error('SOURCE_SUMMARY_ERROR', err?.stack || err);
    return res.status(502).json({ error: 'summary_failed', message: lang === 'en' ? 'Could not create a verified summary.' : 'Δεν δημιουργήθηκε επαληθευμένη σύνοψη.' });
  }
};

async function wholeSectionAudio({ res, source, title, sid, selectedTopic, lang, aiStatus }) {
  const scopedSource = scopeToSelectedSection(source, selectedTopic);
  const cacheKey = {
    kind: 'verified-whole-chapter-audio',
    promptVersion: 'whole-section-audio-v8-toc-safe-resilient',
    subjectId: sid, topic: selectedTopic, title, language: lang, source: scopedSource,
    modelRoute: routingSignature(aiStatus),
  };
  const cached = await getStudyCache(cacheKey);
  if (cached?.text) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ...cached, cacheHit: true });
  }

  const segments = splitWholeSection(scopedSource, 2200, 10);
  if (!segments.length) return res.status(502).json({ error: 'empty_section', message: 'Δεν βρέθηκε επαληθεύσιμο κείμενο για την επιλεγμένη ενότητα.' });

  const rowsBySegment = [];
  let provider = null;
  let model = null;
  const usage = { promptTokens: 0, completionTokens: 0, totalTokens: 0, cachedTokens: 0 };

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    let generated = null;
    try { generated = await generateSegmentClaims({ segment, index: i, count: segments.length, selectedTopic, lang }); }
    catch (err) { console.warn('SOURCE_SUMMARY_SEGMENT_AI_ERROR', JSON.stringify({ part: i + 1, message: String(err?.message || err).slice(0, 240) })); }

    if (generated?.ok) {
      provider = generated.provider || provider;
      model = generated.model || model;
      addUsage(usage, generated.usage);
    }

    let claims = verifiedClaimsFromResponse(generated?.text, segment, 7);
    for (const row of extractiveFallback(segment, 4)) {
      if (claims.length >= 4) break;
      if (!claims.some(x => claimsTooSimilar(x.claim, row.claim))) claims.push(row);
    }
    rowsBySegment.push(dedupeClaims(claims));
  }

  const covered = rowsBySegment.filter(rows => rows.length).length;
  if (!covered) return res.status(502).json({ error: 'insufficient_verified_evidence', message: 'Δεν βρέθηκε αρκετό επαληθεύσιμο κείμενο από την επίσημη σχολική πηγή.' });

  const claimLimit = Math.min(40, Math.max(12, segments.length * 5));
  const selected = [];
  for (const rows of rowsBySegment) {
    for (const row of rows) {
      if (selected.length >= claimLimit) break;
      if (!selected.some(x => claimsTooSimilar(x.claim, row.claim))) selected.push(row);
    }
  }
  if (!selected.length) return res.status(502).json({ error: 'insufficient_verified_evidence', message: 'Δεν βρέθηκε αρκετό επαληθεύσιμο κείμενο από την επίσημη σχολική πηγή.' });

  const response = {
    text: formatAudio(selected.map(x => x.claim), selectedTopic, lang),
    verified: true,
    wholeChapter: true,
    verification: {
      segments: segments.length,
      segmentsCovered: covered,
      approved: selected.length,
      coverageRatio: Number((covered / segments.length).toFixed(2)),
      sourceChars: source.length,
      scopedChars: scopedSource.length,
    },
    provider, model, usage,
  };
  await setStudyCache(cacheKey, response);
  console.info('AI_METRIC ' + JSON.stringify({ event: 'ai_request', task: 'whole_chapter_audio', activity: 'audio', status: 200, provider: provider || '', model: model || '', segments: segments.length, segmentsCovered: covered, approved: selected.length, sourceChars: source.length, scopedChars: scopedSource.length, ...usage }));
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ...response, cacheHit: false });
}

async function generateSegmentClaims({ segment, index, count, selectedTopic, lang }) {
  const system = lang === 'en'
    ? `Prepare ONE sequential part of a spoken lesson from an official schoolbook. Return ONLY JSON: {"claims":[{"claim":"clear explanatory sentence","evidence":"exact 4-24 word excerpt copied from PART"}]}. Produce 4-6 claims. Cover the important ideas, definitions, processes, relationships, causes/results, formulas, units, conversions and textbook examples when present. Ignore tables of contents, navigation, page chrome, indexes and unrelated review material. Use no outside knowledge and do not repeat ideas.`
    : `Ετοίμασε ΕΝΑ διαδοχικό τμήμα προφορικού μαθήματος από επίσημο σχολικό βιβλίο. Επίστρεψε ΜΟΝΟ JSON: {"claims":[{"claim":"καθαρή επεξηγηματική πρόταση","evidence":"ακριβές απόσπασμα 4-24 λέξεων αντιγραμμένο από το ΤΜΗΜΑ"}]}. Δώσε 4-6 claims. Κάλυψε τις σημαντικές ιδέες, ορισμούς, διαδικασίες, σχέσεις, αιτίες/αποτελέσματα, τύπους, μονάδες, μετατροπές και παραδείγματα του βιβλίου όταν υπάρχουν. Αγνόησε περιεχόμενα, πλοήγηση, στοιχεία σελίδας, ευρετήρια και άσχετο υλικό επανάληψης. Μην χρησιμοποιείς εξωτερική γνώση και μην επαναλαμβάνεις ιδέες.`;
  return generateChat({
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: `TOPIC: ${selectedTopic}\nPART ${index + 1} OF ${count}:\n\n${segment}` }
    ],
    maxTokens: 1100, temperature: 0, reasoningEffort: 'low', modelProfile: 'balanced',
  });
}

async function verifiedSinglePass({ res, source, title, sid, selectedTopic, lang, aiStatus, explanation }) {
  const workingSource = compactSourceForTopic(source, selectedTopic, 8000);
  const cacheKey = {
    kind: 'verified-source-summary', promptVersion: 'verified-summary-v6-safe', subjectId: sid,
    topic: selectedTopic, title, language: lang, explanation, source: workingSource, modelRoute: routingSignature(aiStatus),
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
    messages: [{ role: 'system', content: system }, { role: 'user', content: `TOPIC: ${selectedTopic}\nSOURCE:\n${workingSource}` }],
    maxTokens: 950, temperature: 0, reasoningEffort: 'low', modelProfile: 'balanced',
  });

  let claims = verifiedClaimsFromResponse(result?.text, workingSource, 10);
  if (claims.length < 3) claims = extractiveFallback(workingSource, 6);
  if (claims.length < 3) return res.status(502).json({ error: 'insufficient_verified_evidence', message: 'Δεν βρέθηκαν αρκετά επαληθεύσιμα σημεία από την επίσημη πηγή.' });

  const label = explanation ? (lang === 'en' ? 'Explanation' : 'Εξήγηση') : (lang === 'en' ? 'Summary' : 'Σύνοψη');
  const response = {
    text: `${label} – ${selectedTopic}\n\n${paragraphize(claims.map(x => x.claim), 3)}`,
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

function scopeToSelectedSection(source, topic) {
  const full = String(source || '').trim();
  if (!full) return '';
  const lines = full.split('\n');
  const codeMatch = String(topic || '').match(/(?:^|[^\d])(\d+\.\d+(?:\.\d+)?)(?:[^\d]|$)/);
  let scoped = full;

  if (codeMatch) {
    const code = codeMatch[1];
    const depth = code.split('.').length;
    const headingRe = new RegExp('^\\s*' + escapeRegExp(code) + '(?:\\s|[-–—.:]|$)');
    const starts = [];
    for (let i = 0; i < lines.length; i++) if (headingRe.test(lines[i])) starts.push(i);

    const candidates = starts.map(start => {
      let end = lines.length;
      for (let i = start + 1; i < lines.length; i++) {
        const m = lines[i].match(/^\s*(\d+(?:\.\d+)+)(?:\s|[-–—.:]|$)/);
        if (!m || m[1] === code) continue;
        if (m[1].split('.').length <= depth) { end = i; break; }
      }
      const text = lines.slice(start, end).join('\n').trim();
      const prose = text.split('\n').filter(line => !looksLikeNavigationLine(line)).join(' ').replace(/\s+/g, ' ').trim();
      const navLines = text.split('\n').filter(looksLikeNavigationLine).length;
      const tocPenalty = /(^|\n)\s*(περιεχόμενα|contents)\b/i.test(text) ? 5000 : 0;
      return { text, proseChars: prose.length, score: prose.length - navLines * 80 - tocPenalty };
    }).filter(x => x.text);

    candidates.sort((a, b) => b.score - a.score || b.proseChars - a.proseChars || b.text.length - a.text.length);
    if (candidates[0]?.proseChars >= 220) scoped = candidates[0].text;
  }

  scoped = scoped.split('\n').filter((line, i) => i === 0 || !looksLikeNavigationLine(line) || line.trim().length > 110).join('\n').trim();
  const tailMarkers = ['\nΕρωτήσεις', '\nΑΣΚΗΣΕΙΣ', '\nΑσκήσεις', '\nΔραστηριότητες', '\nΠαιχνίδι αυτοαξιολόγησης'];
  const ends = tailMarkers.map(marker => scoped.indexOf(marker)).filter(i => i >= 500);
  if (ends.length) scoped = scoped.slice(0, Math.min(...ends));
  return scoped.trim();
}

function splitWholeSection(source, targetChars = 2200, maxParts = 10) {
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
      const cuts = [full.lastIndexOf('\n\n', end), full.lastIndexOf('. ', end), full.lastIndexOf('; ', end), full.lastIndexOf('· ', end)].filter(x => x >= floor);
      if (cuts.length) { const best = Math.max(...cuts); end = best + (full.slice(best, best + 2) === '. ' ? 1 : 0); }
    }
    const part = full.slice(pos, end).trim();
    if (part.length >= 80) out.push(part);
    if (end <= pos) break;
    pos = end;
  }
  if (pos < full.length && out.length) out[out.length - 1] += '\n\n' + full.slice(pos).trim();
  return out;
}

function verifiedClaimsFromResponse(text, source, limit) {
  const parsed = parseJsonObject(text);
  const rows = Array.isArray(parsed?.claims) ? parsed.claims.slice(0, limit) : [];
  const sourceNorm = normalizeForEvidence(source);
  return rows.map(row => ({ claim: clean(row?.claim, 800), evidence: clean(row?.evidence, 500) }))
    .filter(row => row.claim.length >= 10 && row.evidence.length >= 4 && sourceNorm.includes(normalizeForEvidence(row.evidence)));
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
