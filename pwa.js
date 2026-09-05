/* AI Tools 4 Kids: PWA wrapper + lightweight data patches */
(function(){
  "use strict";

  // Data-only audit. No DOM scanning or MutationObserver.
  const audit=document.createElement("script");
  audit.src="/september-2026-tool-audit.js";
  audit.async=false;
  document.head.appendChild(audit);

  // Primary 2026-27 Tutor catalog only. Data-only; no quiz/UI mutations.
  const primaryTutor=document.createElement("script");
  primaryTutor.src="/september-2026-primary-tutor.js";
  primaryTutor.async=false;
  document.head.appendChild(primaryTutor);

  // Primary diagnostic enrichment only. Data-only; no DOM observers.
  const primaryQuiz=document.createElement("script");
  primaryQuiz.src="/september-2026-primary-quiz.js";
  primaryQuiz.async=false;
  document.head.appendChild(primaryQuiz);

  // Middle/High Greek Language diagnostics only. Data-only; no DOM observers.
  const languageDiagnostics=document.createElement("script");
  languageDiagnostics.src="/september-2026-language-diagnostics.js";
  languageDiagnostics.async=false;
  document.head.appendChild(languageDiagnostics);

  // Middle/High Greek Language Tutor topics only. Data-only; no DOM observers.
  const languageTutor=document.createElement("script");
  languageTutor.src="/september-2026-language-tutor.js";
  languageTutor.async=false;
  document.head.appendChild(languageTutor);

  const core=document.createElement("script");
  core.src="/pwa-core.js";
  core.async=false;
  document.head.appendChild(core);

  const report=document.createElement("script");
  report.src="/report-link.js";
  report.async=false;
  document.head.appendChild(report);

  // Authoritative footer date. Older cached app/postfix scripts used to rewrite
  // this value after navigation, so we re-check briefly after load/click events.
  // This is finite and cheap: no MutationObserver, no interval, no infinite loop.
  function enforceAuditDate(){
    const el=document.querySelector(".site-footer__last-checked");
    if(!el) return;
    const en=!!document.getElementById("langEn")?.classList.contains("active");
    const desired=en
      ? "Tools last checked: September 5, 2026"
      : "Τελευταίος έλεγχος εργαλείων: 5 Σεπτεμβρίου 2026";
    if(el.textContent.trim()!==desired) el.textContent=desired;
  }

  function scheduleAuditDateChecks(){
    enforceAuditDate();
    setTimeout(enforceAuditDate,100);
    setTimeout(enforceAuditDate,500);
    setTimeout(enforceAuditDate,1500);
  }

  queueMicrotask(scheduleAuditDateChecks);
  document.addEventListener("DOMContentLoaded",scheduleAuditDateChecks,{once:true});
  window.addEventListener("load",scheduleAuditDateChecks,{once:true});
  window.addEventListener("popstate",scheduleAuditDateChecks);

  document.addEventListener("click",(event)=>{
    const target=event.target instanceof Element ? event.target : null;
    if(!target) return;
    if(target.closest("#langEl, #langEn, #roleTabs .role-tab, .zone-card, #backToZones, #viewTabs .view-tab")){
      scheduleAuditDateChecks();
    }
  });
})();