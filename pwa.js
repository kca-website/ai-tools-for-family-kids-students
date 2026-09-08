/* AI Tools 4 Kids: compatibility/runtime loader.
 *
 * The generic site runtime stays small. Special Education datasets are loaded
 * only on the dedicated Special Education page or when the user actually opens
 * a Special Education flow.
 */
(function(){
  "use strict";

  const RUNTIME_SCRIPTS=[
    // Mobile/PWA shell must load first. The homepage should never wait for tutor
    // datasets/extensions before it gets the compact mobile title and quick actions.
    {id:"pwa-core",src:"/pwa-core.js"},
    {id:"navigator-home",src:"/navigator-home.js"},

    // Data-only compatibility patches used by the normal school experience.
    {id:"tool-audit",src:"/september-2026-tool-audit.js"},
    {id:"primary-tutor",src:"/september-2026-primary-tutor.js"},
    {id:"primary-quiz",src:"/september-2026-primary-quiz.js"},
    {id:"primary-simple-quiz",src:"/primary-simple-quiz.js"},
    {id:"language-diagnostics",src:"/september-2026-language-diagnostics.js"},
    {id:"language-tutor",src:"/september-2026-language-tutor.js"},

    // Lightweight homepage integrations. The diagnostic catalog is still fetched
    // only after the user chooses that option; analytics records only entry source.
    {id:"special-education-diagnostic",src:"/special-education-diagnostic.js"},
    {id:"special-education-entry-analytics",src:"/special-education-entry-analytics.js"},

    // Generic tutor tools. Special Education data is deliberately NOT loaded here.
    {id:"tutor-flashcards",src:"/tutor-flashcards.js"},
    {id:"tutor-study-tools",src:"/tutor-study-tools.js"},

    // One transitional render hook owns established tool ordering.
    {id:"tutor-render-host",src:"/tutor-render-host.js"},

    // Mobile Compact remains behaviorally unchanged and subscribes after layout.
    {id:"tutor-mobile-compact",src:"/tutor-mobile-compact.js"},
    {id:"tutor-mobile-label-fix",src:"/tutor-mobile-label-fix.js"},

    // Reporting runtime.
    {id:"report-link",src:"/report-link.js"},
  ];

  function appendScript(id,src,marker="data-aitools4kids-runtime"){
    if(document.querySelector(`script[${marker}="${id}"]`)) return Promise.resolve();
    return new Promise((resolve,reject)=>{
      const script=document.createElement("script");
      script.src=src;
      script.async=false;
      script.setAttribute(marker,id);
      script.onload=()=>resolve();
      script.onerror=()=>reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  function routeParts(){
    return location.pathname.split("/").filter(Boolean);
  }
  function isHomepage(){
    return routeParts().length===0;
  }
  function isPrimaryOrHomepage(){
    const parts=routeParts();
    return parts.length===0 || parts[0]==="primary";
  }

  function loadRuntimeScripts(){
    RUNTIME_SCRIPTS.forEach(({id,src})=>{
      // The optional A-B Primary mode also carries the homepage icon consistency
      // pass, so it is needed on / and /primary only. Never load it on middle/high
      // tutor routes where it has no function and could perturb established timing.
      if(id==="primary-simple-quiz" && !isPrimaryOrHomepage()) return;
      if(id==="navigator-home" && !isHomepage()) return;
      if(id==="special-education-entry-analytics" && !isHomepage()) return;
      if(document.querySelector(`script[data-aitools4kids-runtime="${id}"]`)) return;
      const script=document.createElement("script");
      script.src=src;
      script.async=false;
      script.dataset.aitools4kidsRuntime=id;
      document.head.appendChild(script);
    });
  }

  function restoreStandaloneHomepageCoreEntries(){
    if(!isHomepage() || document.getElementById("pwaHomepageParityStyles")) return;
    const style=document.createElement("style");
    style.id="pwaHomepageParityStyles";
    style.textContent=`
      @media (max-width:820px){
        html body.pwa-standalone #zoneSelectView .hero__quiz-cta-wrap,
        html body.pwa-standalone #zoneSelectView .hero__ai-help{display:block!important;}
      }
    `;
    document.head.appendChild(style);
  }

  // Minimal WCAG 2.2 remediations confirmed by the scoped audit. These rules
  // intentionally override only the selectors that failed contrast checks.
  function ensureWcag22Styles(){
    if(document.getElementById("wcag22RemediationStyles")) return;
    const style=document.createElement("style");
    style.id="wcag22RemediationStyles";
    style.textContent=`
      .site-footer__last-checked{opacity:1!important;}
      .tutor-btn--primary{background:#2E6BA3;}
      .tutor-heading__eyebrow{color:#2E6BA3;}
      .hero__quiz-cta{background:linear-gradient(120deg,#2E6F5E 0%,#2E6BA3 100%);}
    `;
    document.head.appendChild(style);
  }

  function normalizeAuditedSemantics(){
    // The view switcher behaves as a button group, not as a complete ARIA tab
    // widget (no tabpanel/arrow-key model), so remove the misleading tablist role.
    document.getElementById("viewTabs")?.removeAttribute("role");

    // aria-label on a role-less div is not consistently exposed. The links retain
    // their own descriptive names, so removing the unsupported attribute is safer.
    document.querySelector(".hero__ai-help-actions")?.removeAttribute("aria-label");
  }

  let specialTutorUiPromise=null;
  function isTutorPath(){
    const parts=routeParts();
    return ["middle","high"].includes(parts[0]) && ["guardian","student"].includes(parts[1]) && parts[2]==="tutor";
  }
  function loadSpecialTutorUi(){
    if(window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_UI && window.AITOOLSKIDS_SPECIAL_SIMPLE_QUIZ && window.AITOOLSKIDS_SPECIAL_TUTOR_ACTIONS && window.ENEEGYL_2026_2027_STRUCTURE) return Promise.resolve();
    if(specialTutorUiPromise) return specialTutorUiPromise;
    // Tiny structural registries are loaded only on AI Help routes — never on
    // the homepage/tools/quiz. Heavy learning datasets still remain lazy.
    specialTutorUiPromise=appendScript("special-education-status","/special-education-status.js","data-aitools4kids-feature")
      .then(()=>appendScript("eneegyl-structure","/special-education-eneegyl-structure-data.js","data-aitools4kids-feature"))
      .then(()=>appendScript("special-education-tutor-ui","/special-education-tutor-ui.js","data-aitools4kids-feature"))
      .then(()=>appendScript("special-tutor-actions","/special-education-tutor-actions.js","data-aitools4kids-feature"))
      .then(()=>appendScript("special-simple-quiz","/tutor-special-simple-quiz.js","data-aitools4kids-feature"))
      .catch((err)=>{ specialTutorUiPromise=null; console.error("Special Education tutor UI failed to load.",err); });
    return specialTutorUiPromise;
  }

  restoreStandaloneHomepageCoreEntries();
  ensureWcag22Styles();
  loadRuntimeScripts();

  // The small selector integration is loaded only on AI Help routes. Its heavier
  // curriculum/learning datasets are loaded by that integration only after a
  // Special Education school is actually selected.
  if(isTutorPath()) loadSpecialTutorUi();
  window.addEventListener("popstate",()=>{ if(isTutorPath()) loadSpecialTutorUi(); });
  document.addEventListener("aitools4kids:tutor-rendered",()=>{ if(isTutorPath()) loadSpecialTutorUi(); });

  // Keep the trust disclosure completely out of the normal tutor startup chain.
  // It is fetched only when the user actually attempts Puter sign-in. This avoids
  // changing the timing/order of established tutor extensions.
  let aiHelpTrustBoundaryPromise=null;
  function loadAiHelpTrustBoundary(){
    if(window.AITOOLSKIDS_AI_HELP_TRUST_BOUNDARY) return Promise.resolve(window.AITOOLSKIDS_AI_HELP_TRUST_BOUNDARY);
    if(aiHelpTrustBoundaryPromise) return aiHelpTrustBoundaryPromise;
    aiHelpTrustBoundaryPromise=appendScript("ai-help-trust-boundary","/ai-help-trust-boundary.js","data-aitools4kids-feature")
      .then(()=>window.AITOOLSKIDS_AI_HELP_TRUST_BOUNDARY)
      .catch((err)=>{ aiHelpTrustBoundaryPromise=null; console.error("AI Help trust boundary failed to load.",err); throw err; });
    return aiHelpTrustBoundaryPromise;
  }

  document.addEventListener("click",(event)=>{
    const target=event.target instanceof Element ? event.target.closest("#tutorSignIn, #tutorSwitchAccount") : null;
    if(!target || window.AITOOLSKIDS_AI_HELP_TRUST_BOUNDARY) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    loadAiHelpTrustBoundary().then(()=>{
      if(target.isConnected) target.click();
    }).catch(()=>{});
  },true);

  function isEnglish(){
    return !!document.getElementById("langEn")?.classList.contains("active") ||
      (document.documentElement.lang || "").toLowerCase().startsWith("en");
  }

  function refreshHeroMiddleLabel(){
    const label=document.querySelector('[data-i18n="heroHelpMiddle"]');
    if(!label) return;
    const desired=isEnglish()?"Middle School":"Γυμνάσιο";
    if(label.textContent.trim()!==desired) label.textContent=desired;
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

  function initPagePolish(){
    detachLegacyFooterDateGuard();
    refreshAuditDate();
    refreshHeroMiddleLabel();
    normalizeAuditedSemantics();
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",initPagePolish,{once:true});
  }else{
    initPagePolish();
  }
  window.addEventListener("load",()=>{
    refreshAuditDate();
    refreshHeroMiddleLabel();
    normalizeAuditedSemantics();
  },{once:true});

  document.addEventListener("click",(event)=>{
    const target=event.target instanceof Element ? event.target : null;
    if(target?.closest("#langEl, #langEn")) setTimeout(()=>{
      refreshAuditDate();
      refreshHeroMiddleLabel();
      normalizeAuditedSemantics();
    },0);
  });

  window.AITOOLSKIDS_SPECIAL_EDUCATION_LAZY_RUNTIME=Object.freeze({
    version:12,
    loadTutorUi:loadSpecialTutorUi,
    globallyLoadsSpecialData:false,
    diagnosticCatalogLoadsOnDemand:true,
    eneegylEightGradeStructure:true,
    simplifiedSpecialAssessment:true,
    primarySimpleQuiz:true,
    primarySimpleQuizScoped:true,
    specialEducationEntryAnalytics:true,
    specialTutorActionMenu:true,
    aiHelpTrustBoundary:true,
    wcag22Remediation:true,
    navigatorHomepageV1:true
  });
})();