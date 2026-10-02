(function () {
  'use strict';
  const guides = new Set(['/meleti-pdf-me-ai.html','/erevna-me-piges-ai.html','/parousiasi-afisa-ai.html','/anagnosi-agglika-ai.html','/dimiourgiko-ai-gia-mathites.html','/flashcards-epanalipsi-ai.html']);
  function safeReturn(value) {
    try {
      const url = new URL(value, location.origin);
      return url.origin === location.origin && ['/study.html','/teacher-assistant.html'].includes(url.pathname) ? url : null;
    } catch (_) { return null; }
  }
  function refreshGuideLinks() {
    const adapter = window.AITOOLSKIDS_LEARNING_ACTIONS;
    if (!adapter) return;
    const context = adapter.context();
    const returnUrl = new URL(location.pathname, location.origin);
    returnUrl.search = context.toString();
    document.querySelectorAll('[data-learning-guide]').forEach(link => {
      const url = new URL(link.getAttribute('href'), location.origin);
      for (const key of ['zone','role','schoolType','grade','sector','specialty','subject','topic','topicText','mode','context','unit','task','lang']) url.searchParams.delete(key);
      for (const [key,value] of context) url.searchParams.set(key,value);
      url.searchParams.set('ctxReturn',returnUrl.pathname + returnUrl.search);
      link.href = url.pathname + url.search;
    });
  }
  function init() {
    refreshGuideLinks();
    document.addEventListener('change', refreshGuideLinks);
    document.addEventListener('input', refreshGuideLinks);
    document.querySelectorAll('[data-learning-guide]').forEach(link => link.addEventListener('click',refreshGuideLinks));
    const params = new URLSearchParams(location.search);
    const back = safeReturn(params.get('ctxReturn'));
    if (!back || !guides.has(location.pathname)) return;
    const english = params.get('lang') === 'en';
    const box = document.createElement('aside'); box.className = 'learning-return';
    const label = document.createElement('p');
    const topic = params.get('topicText') || '';
    label.textContent = (english ? 'Your selected topic: ' : 'Η επιλεγμένη ενότητά σου: ') + (topic || (english ? 'Your current course' : 'Το τρέχον μάθημα'));
    const link = document.createElement('a'); link.href = back.pathname + back.search;
    link.textContent = english ? 'Continue with your selection →' : 'Συνέχισε με τις επιλογές σου →';
    box.append(label,link); document.querySelector('main')?.prepend(box);
    const input = document.getElementById('guidedInput');
    if (input && !input.value && topic) input.value = (english ? 'Topic: ' : 'Ενότητα: ') + topic;
    document.querySelectorAll('a[href]').forEach(anchor => {
      const url = new URL(anchor.getAttribute('href'),location.origin);
      if (url.origin !== location.origin || !guides.has(url.pathname)) return;
      for (const [key,value] of params) if (!url.searchParams.has(key)) url.searchParams.set(key,value);
      anchor.href = url.pathname + url.search;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
