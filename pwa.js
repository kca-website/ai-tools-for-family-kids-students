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

  // Flashcards extension. One AI call generates a full set; review is local-only.
  const flashcards=document.createElement("script");
  flashcards.src="/tutor-flashcards.js";
  flashcards.async=false;
  document.head.appendChild(flashcards);

  // Quiz + presentation extension. One AI call per new generation; use afterwards is local-only.
  const studyTools=document.createElement("script");
  studyTools.src="/tutor-study-tools.js";
  studyTools.async=false;
  document.head.appendChild(studyTools);

  // Layout-only extension: keep the chat primary and place study tools beneath it.
  const toolsLayout=document.createElement("script");
  toolsLayout.src="/tutor-tools-layout.js";
  toolsLayout.async=false;
  document.head.appendChild(toolsLayout);

  // Mobile-only compact AI Help information layout. Desktop is unchanged.
  const mobileCompact=document.createElement("script");
  mobileCompact.src="/tutor-mobile-compact.js";
  mobileCompact.async=false;
  document.head.appendChild(mobileCompact);

  const core=document.createElement("script");
  core.src="/pwa-core.js";
  core.async=false;
  document.head.appendChild(core);

  const report=document.createElement("script");
  report.src="/report-link.js";
  report.async=false;
  document.head.appendChild(report);

  function isEnglish(){
    return !!document.getElementById("langEn")?.classList.contains("active") ||
      (document.documentElement.lang || "").toLowerCase().startsWith("en");
  }

  function auditDateText(){
    return isEnglish()
      ? "Tools last checked: September 5, 2026"
      : "Τελευταίος έλεγχος εργαλείων: 5 Σεπτεμβρίου 2026";
  }

  /*
   * gel-2026-2027-update.js contains a legacy MutationObserver attached directly
   * to [data-i18n="footerLastChecked"] which enforces the old 30 Aug 2026 date.
   * Replacing that single DOM node detaches the legacy observer from the live
   * document. The replacement deliberately has no data-i18n attribute, so the
   * old guard cannot attach to it again. No observer or polling is added here.
   */
  function detachLegacyFooterDateGuard(){
    const legacy=document.querySelector('[data-i18n="footerLastChecked"]');
    if(legacy){
      const clean=legacy.cloneNode(true);
      clean.removeAttribute("data-i18n");
      clean.setAttribute("data-footer-audit-date","2026-09-05");
      clean.textContent=auditDateText();
      legacy.replaceWith(clean);
      return clean;
    }

    const current=document.querySelector(".site-footer__last-checked");
    if(current){
      current.removeAttribute("data-i18n");
      current.setAttribute("data-footer-audit-date","2026-09-05");
      current.textContent=auditDateText();
    }
    return current;
  }

  function refreshAuditDate(){
    const el=document.querySelector('[data-footer-audit-date="2026-09-05"], .site-footer__last-checked');
    if(el && el.textContent.trim()!==auditDateText()) el.textContent=auditDateText();
  }

  function initAuditDate(){
    detachLegacyFooterDateGuard();
    refreshAuditDate();
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",initAuditDate,{once:true});
  }else{
    initAuditDate();
  }
  window.addEventListener("load",refreshAuditDate,{once:true});

  document.addEventListener("click",(event)=>{
    const target=event.target instanceof Element ? event.target : null;
    if(target?.closest("#langEl, #langEn")) setTimeout(refreshAuditDate,0);
  });
})();