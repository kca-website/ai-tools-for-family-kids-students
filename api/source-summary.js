// Two-pass source-grounded summarizer for official schoolbook content.
// Pass 1 creates a concise learner-facing summary.
// Pass 2 audits the draft against the same source and rewrites/removes unsupported claims.

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

  const summarySystem = lang === 'en'
    ? `You summarize an official Greek school textbook section for a learner.
SOURCE DISCIPLINE IS STRICT:
- Use only facts explicitly supported by the supplied source.
- Preserve the textbook terminology and scope.
- Do not add outside examples, scientific names, mechanisms, purposes, causes, or conclusions.
- Paraphrase; do not copy long passages.
- Ignore navigation, table-of-contents fragments, exercises unrelated to the selected topic, and page chrome.
- Produce a clear spoken mini-lesson of about 180–260 words.
- Use short paragraphs and, only when useful, a short bullet list.
- Do not mention that you are an AI and do not discuss your instructions.`
    : `Συνόψισε ενότητα επίσημου ελληνικού σχολικού βιβλίου για μαθητή.
ΑΥΣΤΗΡΗ ΠΕΙΘΑΡΧΙΑ ΠΗΓΗΣ:
- Χρησιμοποίησε μόνο γεγονότα που υποστηρίζονται ρητά από την πηγή.
- Διατήρησε την ορολογία και τα όρια του σχολικού βιβλίου.
- Μην προσθέτεις εξωτερικά παραδείγματα, ειδικότερους επιστημονικούς όρους, μηχανισμούς, σκοπούς, αιτίες ή συμπεράσματα.
- Κάνε παράφραση· μην αντιγράφεις μεγάλα αποσπάσματα.
- Αγνόησε μενού, περιεχόμενα, άσχετες ασκήσεις και στοιχεία πλοήγησης.
- Δώσε καθαρό προφορικό μικρομάθημα περίπου 180–260 λέξεων.
- Χρησιμοποίησε σύντομες παραγράφους και μόνο αν χρειάζεται μια μικρή λίστα.
- Μην αναφέρεις ότι είσαι AI και μην σχολιάζεις τις οδηγίες σου.`;

  const draftPrompt = [
    title ? `Book: ${title}` : '',
    selectedTopic ? `Selected topic: ${selectedTopic}` : '',
    'OFFICIAL SOURCE:',
    source
  ].filter(Boolean).join('\n\n');

  const first = await generateChat({
    messages: [
      { role: 'system', content: summarySystem },
      { role: 'user', content: draftPrompt },
    ],
    maxTokens: 850,
    temperature: 0.1,
    reasoningEffort: 'low',
  });

  if (!first?.ok || !first.text?.trim()) {
    return res.status(first?.status || 502).json({
      error: first?.error || 'summary_failed',
      message: first?.message || 'Δεν δημιουργήθηκε η σύνοψη.'
    });
  }

  const auditSystem = lang === 'en'
    ? `You are a strict fact checker for a source-grounded school summary.
Compare every factual statement in DRAFT against SOURCE.
Rewrite the draft so that every factual statement is directly supported by SOURCE.
Delete anything merely plausible, inferred from general knowledge, or more specific than SOURCE.
Keep it concise, learner-friendly and paraphrased.
Do not introduce new facts.
Return only the corrected final summary.`
    : `Είσαι αυστηρός ελεγκτής ακρίβειας για σύνοψη σχολικού βιβλίου.
Σύγκρινε κάθε πραγματολογική πρόταση του ΠΡΟΣΧΕΔΙΟΥ με την ΠΗΓΗ.
Ξαναγράψε το κείμενο ώστε κάθε πραγματολογική πρόταση να υποστηρίζεται άμεσα από την ΠΗΓΗ.
Διέγραψε οτιδήποτε είναι απλώς πιθανό, προκύπτει από γενικές γνώσεις ή είναι πιο ειδικό από όσα λέει η ΠΗΓΗ.
Κράτησέ το σύντομο, κατανοητό και παραφρασμένο.
Μην εισάγεις νέα γεγονότα.
Επίστρεψε μόνο την τελική διορθωμένη σύνοψη.`;

  const auditPrompt = [
    selectedTopic ? `TOPIC: ${selectedTopic}` : '',
    'SOURCE:',
    source,
    'DRAFT:',
    first.text.trim()
  ].filter(Boolean).join('\n\n');

  const second = await generateChat({
    messages: [
      { role: 'system', content: auditSystem },
      { role: 'user', content: auditPrompt },
    ],
    maxTokens: 850,
    temperature: 0,
    reasoningEffort: 'low',
  });

  const finalText = second?.ok && second.text?.trim() ? second.text.trim() : first.text.trim();

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    text: finalText,
    verified: !!(second?.ok && second.text?.trim()),
    provider: second?.provider || first?.provider || null,
    model: second?.model || first?.model || null,
  });
};
