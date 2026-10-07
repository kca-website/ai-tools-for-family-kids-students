(() => {
  'use strict';
  const root = document.getElementById('answerCheck');
  if (!root) return;
  const $ = id => document.getElementById(id);
  let controller = null, revision = 0, lastResult = null;
  const language = () => document.documentElement.lang === 'en' ? 'en' : 'el';
  const tr = (el, en) => language() === 'en' ? en : el;
  function selection() {
    // Calling context() publishes the current form choices, including edits not yet blurred.
    window.AITOOLSKIDS_LEARNING_ACTIONS?.context();
    return window.AITOOLSKIDS_STUDY_CONTEXT?.readPersisted() || {};
  }
  function signature(ctx) { return JSON.stringify([ctx.subject, ctx.topic, ctx.grade, ctx.schoolType, ctx.sector, ctx.specialty, ctx.lang]); }
  function node(tag, text, className) {
    const el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (className) el.className = className;
    return el;
  }
  function safeSourceUrl(value) {
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; }
    catch { return ''; }
  }
  function render(result) {
    const box = $('answerCheckResults');
    box.replaceChildren();
    const labels = {
      supported: tr('✓ Υποστηρίζεται από την ενότητα', '✓ Supported by the section'),
      contradicted: tr('✕ Αντιφάσκει με το βιβλίο — πιθανή ανακρίβεια', '✕ Contradicts the textbook — possible inaccuracy'),
      not_supported: tr('⚠ Δεν τεκμηριώνεται στο διαθέσιμο κείμενο της ενότητας', '⚠ Not established in the available section text'),
      uncertain: tr('Δεν επιβεβαιώθηκε η κατάταξη', 'Classification not confirmed')
    };
    box.append(node('h3', tr('Έλεγχος ισχυρισμών', 'Claim check')));
    box.append(node('p', result.notice, 'answer-check__notice'));
    const source = node('p');
    source.append(node('strong', tr('Πηγή: ', 'Source: ')), document.createTextNode(result.source.title + ' · ' + result.source.topic));
    const href = safeSourceUrl(result.source.url);
    if (href) {
      const link = node('a', tr('Άνοιξε το επίσημο βιβλίο', 'Open the official textbook'));
      link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer';
      source.append(document.createTextNode(' · '), link);
    }
    box.append(source);
    for (const row of result.claims) {
      const article = node('article', undefined, 'answer-check__claim answer-check__claim--' + (labels[row.status] ? row.status : 'uncertain'));
      article.append(node('h4', labels[row.status] || labels.uncertain), node('p', row.claim, 'answer-check__quote'), node('p', row.explanation));
      if (row.evidence) article.append(node('strong', tr('Τι αναφέρει το βιβλίο:', 'What the textbook says:')), node('blockquote', row.evidence));
      box.append(article);
    }
    box.hidden = false;
  }
  function clearResult() {
    revision++;
    if (controller) controller.abort();
    controller = null; lastResult = null;
    $('answerCheckSubmit').disabled = false;
    $('answerCheckResults').replaceChildren();
    $('answerCheckResults').hidden = true;
    $('answerCheckStatus').textContent = '';
  }
  $('answerCheckText').addEventListener('input', clearResult);
  ['zone', 'grade', 'schoolType', 'epalSector', 'epalSpecialty', 'subject', 'topicPick', 'topicCustom'].forEach(id => {
    $(id)?.addEventListener('change', clearResult);
    if (id === 'topicCustom') $(id)?.addEventListener('input', clearResult);
  });
  $('answerCheckForm').addEventListener('submit', async event => {
    event.preventDefault();
    clearResult();
    const ctx = selection(), answer = $('answerCheckText').value.trim(), stamp = signature(ctx);
    const status = $('answerCheckStatus');
    if (!ctx.subject || !ctx.topic) { status.textContent = tr('Διάλεξε πρώτα μάθημα και σχολική ενότητα επάνω.', 'Choose a subject and textbook unit above first.'); return; }
    if (answer.length < 20 || answer.length > 6000) { status.textContent = tr('Επικόλλησε από 20 έως 6.000 χαρακτήρες.', 'Paste between 20 and 6,000 characters.'); return; }
    const requestRevision = revision;
    controller = new AbortController();
    const requestController = controller;
    const timer = setTimeout(() => requestController.abort(), 150000);
    $('answerCheckSubmit').disabled = true;
    status.textContent = tr('Φορτώνω την επίσημη ενότητα και ελέγχω τους ισχυρισμούς…', 'Loading the official section and checking the claims…');
    try {
      const response = await fetch('/api/check-ai-answer', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: requestController.signal,
        body: JSON.stringify({ subjectId: ctx.subject, topic: ctx.topic, answer, language: language(), studyContext: { schoolType: ctx.schoolType, grade: ctx.grade, sector: ctx.sector, specialty: ctx.specialty } })
      });
      const data = await response.json();
      if (requestRevision !== revision || stamp !== signature(selection())) return;
      if (!response.ok) throw new Error(data.message || tr('Ο έλεγχος δεν ολοκληρώθηκε.', 'The check could not be completed.'));
      if (!Array.isArray(data.claims) || !data.claims.length || !data.source) throw new Error(tr('Δεν επιστράφηκε έγκυρος έλεγχος.', 'A valid check was not returned.'));
      lastResult = data; render(data);
      status.textContent = tr('Ο έλεγχος ολοκληρώθηκε. Δες την τεκμηρίωση για κάθε ισχυρισμό.', 'Check complete. Review the evidence for each claim.');
    } catch (error) {
      if (requestRevision !== revision) return;
      status.textContent = error.name === 'AbortError' ? tr('Ο έλεγχος καθυστέρησε. Δοκίμασε ξανά σε λίγο.', 'The check took too long. Try again shortly.') : error.message;
    } finally {
      clearTimeout(timer);
      if (requestRevision === revision) { controller = null; $('answerCheckSubmit').disabled = false; }
    }
  });
  // A language change also resets Study selections: discard any previous verdict.
  new MutationObserver(() => {
    if (controller || lastResult) clearResult();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
