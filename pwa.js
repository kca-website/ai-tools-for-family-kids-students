/* AI Tools 4 Kids: compatibility/runtime loader.
 *
 * This file still exists during the consolidation sprint because production
 * currently depends on the September data patches and tutor extensions below.
 * Keep the order explicit: some tutor extensions wrap window.AITutor.render.
 * The long-term target is to move these responsibilities into canonical modules
 * and leave pwa.js responsible only for PWA behavior.
 */
(function(){
  "use strict";

  const RUNTIME_SCRIPTS=[
    // Data-only compatibility patches.
    {id:"tool-audit",src:"/september-2026-tool-audit.js"},
    {id:"primary-tutor",src:"/september-2026-primary-tutor.js"},
    {id:"primary-quiz",src:"/september-2026-primary-quiz.js"},
    {id:"language-diagnostics",src:"/september-2026-language-diagnostics.js"},
    {id:"language-tutor",src:"/september-2026-language-tutor.js"},

    // Tutor render extensions. ORDER IS BEHAVIORALLY SIGNIFICANT today:
    // flashcards -> study tools -> layout -> mobile compact -> mobile label.
    {id:"tutor-flashcards",src:"/tutor-flashcards.js"},
    {id:"tutor-study-tools",src:"/tutor-study-tools.js"},
    {id:"tutor-tools-layout",src:"/tutor-tools-layout.js"},
    {id:"tutor-mobile-compact",src:"/tutor-mobile-compact.js"},
    {id:"tutor-mobile-label-fix",src:"/tutor-mobile-label-fix.js"},

    // PWA/report runtime.
    {id:"pwa-core",src:"/pwa-core.js"},
    {id:"report-link",src:"/report-link.js"},
  ];

  function loadRuntimeScripts(){
    RUNTIME_SCRIPTS.forEach(({id,src})=>{
      if(document.querySelector(`script[data-aitools4kids-runtime="${id}"]`)) return;
      const script=document.createElement("script");
      script.src=src;
      script.async=false;
      script.dataset.aitools4kidsRuntime=id;
      document.head.appendChild(script);
    });
  }

  loadRuntimeScripts();

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