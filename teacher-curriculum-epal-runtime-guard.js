(function(){
  "use strict";
  function install(){
    if(typeof currentSubjects!=="function") return;
    const finalCurrent=currentSubjects;
    const fallbackGeneralC=()=>((window.EPAL_2026_2027_TEACHER_STRUCTURE?.grades?.c)||[])
      .filter(x=>!x.sectorGateway)
      .map(x=>({...x,topics:[...(x.topics||[])]}));
    const guarded=function(){
      const context=document.getElementById("context")?.value;
      const grade=String(document.getElementById("grade")?.value||"").toLowerCase();
      const specialty=document.getElementById("epalSpecialty");
      // On the first switch to Γ΄ ΕΠΑΛ, let the original specialty extension
      // populate its verified options before the final-sector provider appends more.
      if(context==="epal"&&grade==="c"&&specialty&&specialty.options.length===0) return fallbackGeneralC();
      return finalCurrent();
    };
    window.currentSubjects=guarded;
    try{ currentSubjects=guarded; }catch(_){ }
  }
  if(typeof document==="undefined") return;
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();
