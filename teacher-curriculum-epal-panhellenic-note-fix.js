(function(){
  "use strict";

  function norm(s){return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[΄’'·.,:;()\/\\–—-]/g," ").replace(/\s+/g," ").trim();}
  function mapped(){return window.AITOOLSKIDS_EPAL_PANHELLENIC_2027?.mappedSubjects||[];}
  function isEpalC(){return document.getElementById("context")?.value==="epal"&&String(document.getElementById("grade")?.value||"").toLowerCase()==="c";}

  function apply(){
    if(!isEpalC()) return;
    const label=document.getElementById("subject")?.selectedOptions?.[0]?.textContent||"";
    const row=mapped().find(x=>norm(x.label)===norm(label));
    const note=document.getElementById("curriculumNote");
    if(!row||!note) return;
    note.innerHTML=`<strong>✓ Επίσημη διδακτέα-εξεταστέα ύλη Πανελλαδικών 2027.</strong> Οι ${row.topicCount} επιλογές προέρχονται από το ΦΕΚ Β΄ 4328/14.07.2026 για το σχολικό έτος 2026–27. Η επιλογή δείχνει κεφάλαιο/βασική ενότητα· οι επιμέρους εξαιρέσεις του ΦΕΚ εξακολουθούν να ισχύουν.`;
  }

  function install(){
    const subject=document.getElementById("subject"),unit=document.getElementById("unit"),grade=document.getElementById("grade"),context=document.getElementById("context"),specialty=document.getElementById("epalSpecialty");
    subject?.addEventListener("change",()=>setTimeout(apply,0));
    unit?.addEventListener("change",()=>setTimeout(apply,0));
    grade?.addEventListener("change",()=>setTimeout(apply,0));
    context?.addEventListener("change",()=>setTimeout(apply,0));
    specialty?.addEventListener("change",()=>setTimeout(apply,0));

    const note=document.getElementById("curriculumNote");
    if(note&&typeof MutationObserver!=="undefined"){
      let scheduled=false;
      new MutationObserver(()=>{
        if(scheduled||!isEpalC()) return;
        const label=subject?.selectedOptions?.[0]?.textContent||"";
        if(!mapped().some(x=>norm(x.label)===norm(label))) return;
        if(note.textContent.includes("Πανελλαδικών 2027")) return;
        scheduled=true;
        setTimeout(()=>{scheduled=false;apply();},0);
      }).observe(note,{childList:true,subtree:true,characterData:true});
    }
    setTimeout(apply,0);
  }

  if(typeof document==="undefined") return;
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();
