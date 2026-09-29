// Claim-verified source-grounded summarizer for official schoolbook content.
// Pass 1 proposes concise paraphrased claims and an exact evidence excerpt for each.
// Backend checks that every evidence excerpt really exists in the official source.
// Pass 2 audits each claim against the source + evidence.
// Only approved claims are rendered to the learner.

const { generateChat, getAiStatus } = require('../ai-provider-router');
const { getStudyCache, setStudyCache } = require('../study-runtime-cache');
const { resolveOfficialSchoolbookSource } = require('./schoolbook-source');

module.exports = async function handler(req, res) {
  const aiStatus = getAiStatus();

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed', message: 'Method not allowed.' });
  }
  if (!aiStatus.configured) {
    return res.status(503).json({ error: 'ai_not_configured', message: 'Η AI σύνοψη δεν είναι προσωρινά διαθέσιμη.' });
  }

  const { subjectId = '', topic = '', language = 'el', sourceTitle = '' } = req.body || {};
  const sid = String(subjectId || '').trim().slice(0, 120);
  const selectedTopic = String(topic || '').trim().slice(0, 600);
  const lang = language === 'en' ? 'en' : 'el';

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
  if (source.length < 300) {
    return res.status(400).json({ error: 'source_too_short', message: 'Η επίσημη πηγή δεν έχει αρκετό κείμενο για ασφαλή σύνοψη.' });
  }

  const workingSource = compactSourceForTopic(source, selectedTopic, 6500);
  const cacheParts = {
    kind: 'verified-source-summary',
    promptVersion: 'verified-summary-v2',
    subjectId: sid,
    topic: selectedTopic,
    title,
    language: lang,
    modelRoute: routingSignature(aiStatus),
    source: workingSource,
  };
  const cached = await getStudyCache(cacheParts);
  if (cached?.text) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ...cached, cacheHit: true });
  }
  const startedAt = Date.now();

  const claimSystem = lang === 'en'
    ? `Create a concise learner-facing summary from an official Greek schoolbook source.
Return ONLY valid JSON in this form:
{"claims":[{"claim":"One clear paraphrased factual sentence.","evidence":"An exact 4–24 word excerpt copied verbatim from SOURCE that directly supports the claim."}]}

STRICT RULES:
- Produce 5–8 claims in a logical learning order.
- Each claim must be directly entailed by its evidence and by SOURCE.
- Evidence must be copied EXACTLY from SOURCE, not paraphrased. Prefer a short 3–18 word excerpt so exact matching is reliable.
- Preserve textbook terminology and scope.
- Do not define, enrich, infer, generalize, explain mechanisms, add examples, or name things more specifically than SOURCE.
- Ignore navigation, contents, unrelated exercises, image captions unrelated to the selected topic, and page chrome.
- Claims must be concise enough to be read aloud naturally.
- No markdown, no commentary outside JSON.`
    : `Φτιάξε σύντομη σύνοψη για μαθητή από επίσημη σχολική πηγή.
Επίστρεψε ΜΟΝΟ έγκυρο JSON με αυτή τη μορφή:
{"claims":[{"claim":"Μία καθαρή παραφρασμένη πραγματολογική πρόταση.","evidence":"Ακριβές απόσπασμα 4–24 λέξεων αντιγραμμένο αυτούσιο από την ΠΗΓΗ που στηρίζει άμεσα την πρόταση."}]}

ΑΥΣΤΗΡΟΙ ΚΑΝΟΝΕΣ:
- Δώσε 5–8 προτάσεις σε λογική σειρά μάθησης.
- Κάθε claim πρέπει να προκύπτει άμεσα από το evidence και την ΠΗΓΗ.
- Το evidence πρέπει να είναι ΑΚΡΙΒΩΣ αυτούσιο από την ΠΗΓΗ, όχι παράφραση. Προτίμησε σύντομο απόσπασμα 3–18 λέξεων ώστε να επαληθεύεται αξιόπιστα.
- Διατήρησε την ορολογία και τα όρια του σχολικού βιβλίου.
- Μην ορίζεις, εμπλουτίζεις, συμπεραίνεις, γενικεύεις, εξηγείς μηχανισμούς, προσθέτεις παραδείγματα ή ονομάζεις κάτι πιο συγκεκριμένα από την ΠΗΓΗ.
- Αγνόησε πλοήγηση, περιεχόμενα, άσχετες ασκήσεις και άσχετες λεζάντες εικόνων.
- Οι προτάσεις να είναι σύντομες και φυσικές για προφορική ανάγνωση.
- Χωρίς markdown και χωρίς σχόλια έξω από το JSON.`;

  const first = await generateChat({
    messages: [
      { role: 'system', content: claimSystem },
      {
        role: 'user',
        content: [
          title ? `BOOK: ${title}` : '',
          selectedTopic ? `SELECTED TOPIC: ${selectedTopic}` : '',
          'SOURCE:',
          workingSource,
        ].filter(Boolean).join('\n\n')
      }
    ],
    maxTokens: 950,
    temperature: 0,
    reasoningEffort: 'low',
    modelProfile: 'balanced',
  });

  if (!first?.ok || !first.text?.trim()) {
    const limited = first?.status === 429 || first?.error === 'provider_limit';
    return res.status(limited ? 429 : (first?.status || 502)).json({
      error: limited ? 'provider_limit' : (first?.error || 'summary_failed'),
      message: limited
        ? 'Η δωρεάν AI Βοήθεια έφτασε προσωρινά το όριο χρήσης της. Δοκίμασε ξανά σε λίγο.'
        : 'Δεν δημιουργήθηκαν προτάσεις σύνοψης.'
    });
  }

  const proposed = parseJsonObject(first.text);
  const rawClaims = Array.isArray(proposed?.claims) ? proposed.claims.slice(0, 12) : [];
  const sourceNorm = normalizeForEvidence(workingSource);

  const evidenceChecked = rawClaims
    .map((row, index) => ({
      id: index + 1,
      claim: clean(row?.claim, 650),
      evidence: clean(row?.evidence, 500),
    }))
    .filter(row =>
      row.claim.length >= 12 &&
      row.evidence.length >= 4 &&
      sourceNorm.includes(normalizeForEvidence(row.evidence))
    );

  if (evidenceChecked.length < 3) {
    return res.status(502).json({
      error: 'insufficient_verified_evidence',
      message: 'Δεν βρέθηκαν αρκετές προτάσεις με επαληθεύσιμη τεκμηρίωση από την επίσημη πηγή.'
    });
  }

  const auditSystem = lang === 'en'
    ? `Audit candidate schoolbook claims.
Return ONLY valid JSON:
{"results":[{"id":1,"keep":true}]}

For each candidate:
- keep=true ONLY if the CLAIM is directly entailed by SOURCE and its exact EVIDENCE.
- keep=false if the claim adds any descriptor, mechanism, purpose, cause, example, category, scientific name, comparison, or conclusion not stated in SOURCE.
- A claim may paraphrase wording, but it may not increase specificity.
- Do not rewrite claims and do not add facts.
- Evaluate every supplied id.`
    : `Έλεγξε υποψήφιες προτάσεις σύνοψης σχολικού βιβλίου.
Επίστρεψε ΜΟΝΟ έγκυρο JSON:
{"results":[{"id":1,"keep":true}]}

Για κάθε πρόταση:
- keep=true ΜΟΝΟ αν το CLAIM προκύπτει άμεσα από την ΠΗΓΗ και το ακριβές EVIDENCE.
- keep=false αν το claim προσθέτει οποιονδήποτε χαρακτηρισμό, μηχανισμό, σκοπό, αιτία, παράδειγμα, κατηγορία, επιστημονικό όρο, σύγκριση ή συμπέρασμα που δεν δηλώνεται στην ΠΗΓΗ.
- Επιτρέπεται παράφραση, αλλά όχι μεγαλύτερη εξειδίκευση από την ΠΗΓΗ.
- Μην ξαναγράφεις τα claims και μην προσθέτεις γεγονότα.
- Έλεγξε κάθε id που σου δίνεται.`;

  const auditPayload = evidenceChecked.map(row => ({
    id: row.id,
    claim: row.claim,
    evidence: row.evidence,
  }));

  const second = await generateChat({
    messages: [
      { role: 'system', content: auditSystem },
      {
        role: 'user',
        content: [
          selectedTopic ? `TOPIC: ${selectedTopic}` : '',
          'SOURCE:',
          workingSource,
          'CANDIDATES:',
          JSON.stringify(auditPayload),
        ].filter(Boolean).join('\n\n')
      }
    ],
    maxTokens: 450,
    temperature: 0,
    reasoningEffort: 'low',
    modelProfile: 'quality',
  });

  if (!second?.ok || !second.text?.trim()) {
    const limited = second?.status === 429 || second?.error === 'provider_limit';
    return res.status(limited ? 429 : (second?.status || 502)).json({
      error: limited ? 'provider_limit' : (second?.error || 'verification_failed'),
      message: limited
        ? 'Η δωρεάν AI Βοήθεια έφτασε προσωρινά το όριο χρήσης της. Δοκίμασε ξανά σε λίγο.'
        : 'Ο δεύτερος έλεγχος της σύνοψης απέτυχε.'
    });
  }

  const audited = parseJsonObject(second.text);
  const decisions = new Map(
    (Array.isArray(audited?.results) ? audited.results : [])
      .map(row => [Number(row?.id), row?.keep === true])
  );

  const approved = evidenceChecked.filter(row => decisions.get(row.id) === true);

  if (approved.length < 3) {
    return res.status(502).json({
      error: 'insufficient_approved_claims',
      message: 'Ο έλεγχος απέρριψε τις περισσότερες προτάσεις. Δεν εμφανίστηκε μη ασφαλής σύνοψη.'
    });
  }

  const finalText = formatSummary(approved.map(row => row.claim), selectedTopic, lang);

  const responseBody = {
    text: finalText,
    verified: true,
    verification: {
      proposed: rawClaims.length,
      evidenceMatched: evidenceChecked.length,
      approved: approved.length,
    },
    provider: second?.provider || first?.provider || null,
    model: second?.model || first?.model || null,
    usage: {
      promptTokens: Number(first?.usage?.promptTokens || 0) + Number(second?.usage?.promptTokens || 0),
      completionTokens: Number(first?.usage?.completionTokens || 0) + Number(second?.usage?.completionTokens || 0),
      totalTokens: Number(first?.usage?.totalTokens || 0) + Number(second?.usage?.totalTokens || 0),
      cachedTokens: Number(first?.usage?.cachedTokens || 0) + Number(second?.usage?.cachedTokens || 0),
    },
  };
  await setStudyCache(cacheParts, responseBody);
  console.info('AI_METRIC ' + JSON.stringify({
    event: 'ai_request',
    task: 'source_summary',
    activity: 'audio',
    status: 200,
    cacheHit: false,
    provider: responseBody.provider || '',
    model: responseBody.model || '',
    latencyMs: Date.now() - startedAt,
    ...responseBody.usage,
  }));
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ...responseBody, cacheHit: false });
};

function routingSignature(aiStatus) {
  const providers = Array.isArray(aiStatus?.providers) ? aiStatus.providers : [];
  return providers.map(({ name, model }) => {
    const balanced = aiStatus?.routingProfiles?.balanced?.[name] || [];
    const quality = aiStatus?.routingProfiles?.quality?.[name] || [];
    return name + ':balanced=' + (balanced.length ? balanced.join('>') : String(model || '')) +
      ';quality=' + (quality.length ? quality.join('>') : String(model || ''));
  }).join('|');
}

function compactSourceForTopic(source, topic, maxChars) {
  const full = String(source || '').trim();
  const limit = Math.max(3000, Number(maxChars) || 6500);
  if (full.length <= limit) return full;

  const normTopic = normalizeForEvidence(topic);
  const stop = new Set(['και','των','την','τον','της','του','στο','στη','στην','στον','για','απο','από','with','from','the','and','for','this','that']);
  const keys = [...new Set(normTopic.split(/\s+/).filter(x => x.length >= 4 && !stop.has(x)))].slice(0, 18);
  const chunks = [];
  for (let i = 0; i < full.length; i += 1800) chunks.push({ index: i, text: full.slice(i, i + 2200) });

  const scored = chunks.map(row => {
    const norm = normalizeForEvidence(row.text);
    let score = 0;
    for (const key of keys) if (norm.includes(key)) score += key.length >= 7 ? 3 : 1;
    return { ...row, score };
  }).sort((a, b) => b.score - a.score || a.index - b.index);

  const selected = [];
  let used = 0;
  const pool = scored[0]?.score > 0 ? scored : [chunks[0], chunks[Math.floor(chunks.length / 2)], chunks[chunks.length - 1]].filter(Boolean);
  for (const row of pool) {
    if (selected.some(x => x.index === row.index)) continue;
    const room = limit - used;
    if (room < 500) break;
    const piece = row.text.slice(0, room);
    selected.push({ index: row.index, text: piece });
    used += piece.length;
  }
  return selected.sort((a, b) => a.index - b.index).map(x => x.text).join('\n\n').slice(0, limit);
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
  const raw = String(text || '').trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  try { return JSON.parse(raw); } catch (_) {}
  const a = raw.indexOf('{');
  const b = raw.lastIndexOf('}');
  if (a >= 0 && b > a) {
    try { return JSON.parse(raw.slice(a, b + 1)); } catch (_) {}
  }
  return null;
}

function formatSummary(claims, topic, lang) {
  const safeClaims = claims
    .map(x => String(x || '').trim())
    .filter(Boolean)
    .slice(0, 10);

  const heading = topic
    ? (lang === 'en' ? `Summary – ${topic}` : `Σύνοψη – ${topic}`)
    : (lang === 'en' ? 'Verified summary' : 'Επαληθευμένη σύνοψη');

  // Keep rendering deterministic: approved factual claims only, no third AI rewrite.
  const paragraphs = [];
  for (let i = 0; i < safeClaims.length; i += 3) {
    paragraphs.push(safeClaims.slice(i, i + 3).join(' '));
  }
  return heading + '\n\n' + paragraphs.join('\n\n');
}
