(function(){
  "use strict";

  function norm(s){return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[΄’'·.,:;()\/\\–—-]/g," ").replace(/\s+/g," ").trim();}
  const schoolType={specialGym:"special-gymnasium",specialLyc:"special-lyceum",eneegyl:"eneegyl"};
  function contextId(){return document.getElementById("context")?.value||"";}
  function selectedLabel(id){const e=document.getElementById(id);return e?.selectedOptions?.[0]?.textContent||"";}
  function entryMatches(e,c,gid,glabel,sid,slabel){
    if(e?.schoolType!==schoolType[c]) return false;
    let gm=false;
    if(typeof window.gradeMatches==="function") gm=window.gradeMatches(e,gid,glabel);
    else gm=norm(e.gradeLabel)===norm(glabel)||norm(e.grade)===norm(String(gid).split("-").pop());
    if(!gm) return false;
    if(typeof window.subjectMatches==="function") return window.subjectMatches(e,{id:sid,label:slabel});
    return norm(e.subject)===norm(slabel)||norm(e.subjectId)===norm(sid);
  }
  function isSupport(e){
    const c=norm(e?.coverageStatus),b=norm(e?.verificationBasis),t=norm(e?.subjectType);
    return /support|reference|equivalent/.test(`${c} ${b} ${t}`)||b.includes("general gym")||b.includes("general lyceum")||b.includes("textbook");
  }
  function isExactAnnual(e){
    const c=norm(e?.coverageStatus),b=norm(e?.verificationBasis);
    return c.includes("official course guidance")||c.includes("exam verified")||c.includes("panhellenic")||b.includes("annual instructions 2026 27")||b.includes("panhellenic");
  }
  function safeUrl(url){return /^https:\/\//i.test(String(url||""))?String(url):"";}
  function apply(){
    const c=contextId();
    if(!schoolType[c]) return;
    const note=document.getElementById("curriculumNote"),unit=document.getElementById("unit");
    if(!note||!unit) return;
    const gid=document.getElementById("grade")?.value||"",glabel=selectedLabel("grade"),sid=document.getElementById("subject")?.value||"",slabel=selectedLabel("subject");
    const entries=Object.values(window.SPECIAL_EDUCATION_CURRICULUM?.entries||{}).filter(e=>entryMatches(e,c,gid,glabel,sid,slabel));
    const exact=entries.find(isExactAnnual);
    const count=[...unit.options].filter(o=>o.value!=="custom").length;
    if(exact){
      const source=safeUrl(exact.sourceUrl);
      const sourceLink=source?` <a href="${source}" target="_blank" rel="noopener">Επίσημη πηγή ↗</a>`:"";
      const scope=norm(exact.coverageStatus).includes("panhellenic")?"επίσημη διδακτέα-εξεταστέα ύλη":"τρέχουσα επίσημη ύλη / οδηγίες διδασκαλίας";
      if(unit.value==="custom"||exact.requiresExactUnit){
        note.innerHTML=`<strong>✓ Επαληθευμένο μάθημα 2026–27.</strong> Το μάθημα προέρχεται από ${scope}. Δεν εμφανίζουμε αυθαίρετα κεφάλαια: γράψε στο πεδίο παραπάνω τον ακριβή τίτλο της ενότητας που διδάσκεις.${sourceLink}`;
      }else{
        note.innerHTML=`<strong>✓ Επαληθευμένη χαρτογράφηση 2026–27${count?` · ${count} επιλογές`:""}.</strong> Οι ενότητες προέρχονται από ${scope} για το συγκεκριμένο μάθημα.${sourceLink}`;
      }
      return;
    }
    if(unit.value==="custom") return;
    const support=c==="specialLyc"||entries.some(isSupport)||((typeof window.selectedSubject==="function")&&window.selectedSubject()?.supportOnly);
    if(!support) return;
    note.innerHTML=`<strong>ℹ Υποστηρικτική χαρτογράφηση${count?` · ${count} επιλογές`:""}.</strong> Οι ενότητες είναι πραγματικές επιλογές από επαληθευμένη σχολική/εκπαιδευτική πηγή, αλλά δεν παρουσιάζονται ως ξεχωριστή επίσημη ετήσια διδακτέα ή εξεταστέα ύλη της συγκεκριμένης δομής Ε.Α.Ε. Ο εκπαιδευτικός επιβεβαιώνει ότι η επιλεγμένη ενότητα αντιστοιχεί σε αυτό που διδάσκει.`;
  }
  function install(){
    ["context","grade","subject","unit","epalSpecialty"].forEach(id=>document.getElementById(id)?.addEventListener("change",()=>setTimeout(apply,0)));
    const note=document.getElementById("curriculumNote");
    if(note&&typeof MutationObserver!=="undefined"){
      let busy=false;
      new MutationObserver(()=>{
        if(busy||!schoolType[contextId()]||note.textContent.includes("Επαληθευμένο μάθημα")||note.textContent.includes("Επαληθευμένη χαρτογράφηση")||note.textContent.includes("Υποστηρικτική χαρτογράφηση")) return;
        busy=true;setTimeout(()=>{busy=false;apply();},0);
      }).observe(note,{childList:true,subtree:true,characterData:true});
    }
    setTimeout(apply,0);
  }
  if(typeof document==="undefined") return;
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();
