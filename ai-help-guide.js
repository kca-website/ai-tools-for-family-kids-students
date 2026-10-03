(function(){
  "use strict";
  let role="student";
  try {const saved=JSON.parse(sessionStorage.getItem("aitools4kidsShortcutSelection")||"null");if(saved?.role==="guardian")role="guardian";}catch{}
  function apply(){
    const lang=document.documentElement.lang==="en"?"en":"el";
    document.querySelectorAll("[data-el][data-en]").forEach(el=>{el.textContent=el.dataset[lang];});
    document.querySelectorAll("[data-language]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.language===lang)));
    document.querySelectorAll("[data-help-zone]").forEach(link=>{const zone=link.dataset.helpZone;link.href=`/${zone==="epal"?"high":zone}/${zone==="primary"?"guardian":role}/tutor${zone==="epal"?"?schoolType=epal":""}`;});
    document.querySelector(`input[name="helpRole"][value="${role}"]`).checked=true;
  }
  document.querySelectorAll("[data-language]").forEach(button=>button.addEventListener("click",()=>{document.documentElement.lang=button.dataset.language;apply();}));
  document.querySelectorAll('[name="helpRole"]').forEach(input=>input.addEventListener("change",()=>{role=input.value;apply();}));
  document.querySelectorAll("[data-help-zone]").forEach(link=>link.addEventListener("click",()=>{try{sessionStorage.setItem("aitools4kidsShortcutSelection",JSON.stringify({role,zone:link.dataset.helpZone}));}catch{}}));
  apply();
})();
