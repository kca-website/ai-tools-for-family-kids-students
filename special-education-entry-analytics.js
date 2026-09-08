/* Privacy-friendly usage signal for the Special Education homepage entries.
 * Uses the Vercel Web Analytics instance already injected by index.html.
 * No user identifiers or free-text values are collected: only the entry source.
 */
(function(){
  "use strict";
  if(typeof document==="undefined") return;
  if(location.pathname!=="/" && location.pathname!=="") return;

  const EVENT_NAME="Special Education Entry";
  const ALLOWED_SOURCES=new Set(["school_grid","ai_help","diagnostic"]);

  function ensureVercelQueue(){
    if(typeof window.va==="function") return window.va;
    window.va=function(){
      (window.vaq=window.vaq||[]).push(arguments);
    };
    return window.va;
  }

  function track(source){
    if(!ALLOWED_SOURCES.has(source)) return false;
    try{
      ensureVercelQueue()("event",{
        name:EVENT_NAME,
        data:{source}
      });
      return true;
    }catch(_error){
      return false;
    }
  }

  function sourceForTarget(target){
    if(!(target instanceof Element)) return null;
    if(target.closest("#specialSchoolZoneCard")) return "school_grid";
    if(target.closest("#heroHelpSpecialEducation")) return "ai_help";
    if(target.closest("#specialEducationDiagnosticEntry")) return "diagnostic";
    return null;
  }

  document.addEventListener("click",(event)=>{
    const source=sourceForTarget(event.target);
    if(source) track(source);
  },true);

  window.AITOOLSKIDS_SPECIAL_EDUCATION_ENTRY_ANALYTICS=Object.freeze({
    version:2,
    eventName:EVENT_NAME,
    sources:["school_grid","ai_help","diagnostic"],
    track
  });
})();