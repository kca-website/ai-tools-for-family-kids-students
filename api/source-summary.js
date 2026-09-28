// Claim-verified source-grounded summarizer for official schoolbook content.
// Pass 1 proposes concise paraphrased claims and an exact evidence excerpt for each.
// Backend checks that every evidence excerpt really exists in the official source.
// Pass 2 audits each claim against the source + evidence.
// Only approved claims are rendered to the learner.

const { generateChat, getAiStatus } = require('../ai-provider-router');

module.exports = async function handler(req, res) {
  const aiStatus = getAiStatus();

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed', message: 'Method not allowed.' });
  }
  if (!aiStatus.configured) {
    return res.status(503).json({ error: 'ai_not_configured', message: 'Η AI σύνοψη δεν είναι προσωρινά διαθέσιμη.' });
  }

  const { sourceText = '', topic = '', language = 'el', sourceTitle = '' } = req.body || {};
  const source = String(sourceText || '').trim();
  const selectedTopic = String(topic || '').trim().slice(0, 600);
  const title = String(sourceTitle || '').trim().slice(0, 300);
  const lang = language === 'en' ? 'en' : 'el';

  if (source.length < 300) {
    return res.status(400).json({ error: 'source_too_short', message: 'Η επίσημη πηγή δεν έχει αρκετό κείμενο για ασφαλή σύνοψη.' });
  }
  if (source.length > 50000) {
    return res.status(413).json({ error: 'source_too_large', message: 'Η πηγή είναι πολύ μεγάλη για ασφαλή σύνοψη.' });
  }

  const claimSystem = lang === 'en'
    ? `Create a concise learner-facing summary from an official Greek schoolbook source.
Return ONLY valid JSON in this form:
{"claims":[{"claim":"One clear paraphrased factual sentence.","evidence":"An exact 4–24 word excerpt copied verbatim from SOURCE that directly supports the claim."}]}

STRICT RULES:
- Produce 6–10 claims in a logical learning order.
- Each claim must be directly entailed by its evidence and by SOURCE.
- Evidence must be copied EXACTLY from SOURCE, not paraphrased.
- Preserve textbook terminology and scope.
- Do not define, enrich, infer, generalize, explain mechanisms, add examples, or name things more specifically than SOURCE.
- Ignore navigation, contents, unrelated exercises, image captions unrelated to the selected topic, and page chrome.
- Claims must be concise enough to be read aloud naturally.
- No markdown, no commentary outside JSON.`
    : `Φτιάξε σύντομη σύνοψη για μαθητή από επίσημη σχολική πηγή.
Επίστρεψε ΜΟΝΟ έγκυρο JSON με αυτή τη μορφή:
{"claims":[{"claim":"Μία καθαρή παραφρασμένη πραγματολογική πρόταση.","evidence":"Ακριβές απόσπασμα 4–24 λέξεων αντιγραμμένο αυτούσιο από την ΠΗΓΗ που στηρίζει άμεσα την πρόταση."}]}

ΑΥΣΤΗΡΟΙ ΚΑΝΟΝΕΣ:
- Δώσε 6–10 προτάσεις σε λογική σειρά μάθησης.
- Κάθε claim πρέπει να προκύπτει άμεσα από το evidence και την ΠΗΓΗ.
- Το evidence πρέπει να είναι ΑΚΡΙΒΩΣ αυτούσιο από την ΠΗΓΗ, όχι παράφραση.
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
          source,
        ].filter(Boolean).join('\n\n')
      }
    ],
    maxTokens: 1400,
    temperature: 0,
    reasoningEffort: 'low',
  });

  if (!first?.ok || !first.text?.trim()) {
    return res.status(first?.status || 502).json({
      error: first?.error || 'summary_failed',
      message: first?.message || 'Δεν δημιουργήθηκαν προτάσεις σύνοψης.'
    });
  }

  const proposed = parseJsonObject(first.text);
  const rawClaims = Array.isArray(proposed?.claims) ? proposed.claims.slice(0, 12) : [];
  const sourceNorm = normalizeForEvidence(source);

  const evidenceChecked = rawClaims
    .map((row, index) => ({
      id: index + 1,
      claim: clean(row?.claim, 650),
      evidence: clean(row?.evidence, 500),
    }))
    .filter(row =>
      row.claim.length >= 12 &&
      row.evidence.length >= 8 &&
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
          source,
          'CANDIDATES:',
          JSON.stringify(auditPayload),
        ].filter(Boolean).join('\n\n')
      }
    ],
    maxTokens: 900,
    temperature: 0,
    reasoningEffort: 'low',
  });

  if (!second?.ok || !second.text?.trim()) {
    return res.status(second?.status || 502).json({
      error: second?.error || 'verification_failed',
      message: second?.message || 'Ο δεύτερος έλεγχος της σύνοψης απέτυχε.'
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

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    text: finalText,
    verified: true,
    verification: {
      proposed: rawClaims.length,
      evidenceMatched: evidenceChecked.length,
      approved: approved.length,
    },
    provider: second?.provider || first?.provider || null,
    model: second?.model || first?.model || null,
  });
};

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
