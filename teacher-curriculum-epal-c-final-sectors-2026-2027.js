(function(){
  "use strict";

  const STRUCTURES_GUIDANCE="https://www.iep.edu.gr/wp-content/uploads/2026/09/162057_1_2026_07_31_%CE%95%CE%9E%CE%95_103669_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%B9%CE%B5%CF%82_%CE%94%CE%9F%CE%9C%CE%99%CE%9A%CE%A9%CE%9D_%CE%95%CE%A1%CE%93%CE%A9%CE%9D_%CE%91_%CE%92_%CE%93_%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%85%CF%82_2026_27_%CE%91%CE%94%CE%91_9%CE%A43%CE%9D46%CE%9D%CE%9A%CE%A0%CE%94_%CE%A871.pdf";
  const MARITIME_TIMETABLE="https://www.iep.edu.gr/wp-content/uploads/2025/01/2018-08-07_3224_t_b_fek_naytiliakon.pdf";
  const EPAL_2026_HUB="https://www.iep.edu.gr/yli-kai-odigies-didaskalias-epa-l-gia-to-scholiko-etos-2026-2027/";
  const PANHELLENIC_2027="https://www.iep.edu.gr/yli-kai-odigies-didaskalias-epa-l-p-epa-l-gia-to-scholiko-etos-2026-2027/";

  const EXTRA=[
    {
      id:"structures-geoinfo",
      sector:"Δομικών Έργων, Δομημένου Περιβάλλοντος και Αρχιτεκτονικού Σχεδιασμού",
      label:"Τεχνικός Δομικών Έργων και Γεωπληροφορικής",
      sourceUrl:STRUCTURES_GUIDANCE,
      sourceBasis:"current-iep-guidance-2026-27",
      subjects:[
        "Αρχιτεκτονικό Σχέδιο",
        "Οικοδομική",
        "Σχέδιο Πολιτικού Μηχανικού και Έργων Υποδομής",
        "Εφαρμογές Γεωπληροφορικής στα Τεχνικά Έργα",
        "Οργάνωση Τεχνικών Έργων",
        "Σχέδιο Δομικών Έργων με χρήση Η/Υ ΙΙ"
      ]
    },
    {
      id:"maritime-master",
      sector:"Ναυτιλιακών Επαγγελμάτων",
      label:"Πλοίαρχος Εμπορικού Ναυτικού",
      sourceUrl:MARITIME_TIMETABLE,
      sourceBasis:"official-timetable-still-applicable;current-specialty-and-panhellenic-2027-verified",
      subjects:[
        "Ναυσιπλοΐα ΙΙ",
        "Ναυτικό Δίκαιο - Διεθνείς Κανονισμοί στη Ναυτιλία - Εφαρμογές",
        "Μεταφορά Φορτίων",
        "Τήρηση Φυλακής Γέφυρας",
        "Ναυτικά Αγγλικά ΙΙ",
        "Ν.Η.Ο. – Επικοινωνίες",
        "Εφαρμογές Δ.Κ.Α.Σ. – ECDIS - ARPA"
      ]
    },
    {
      id:"maritime-engineer",
      sector:"Ναυτιλιακών Επαγγελμάτων",
      label:"Μηχανικός Εμπορικού Ναυτικού",
      sourceUrl:MARITIME_TIMETABLE,
      sourceBasis:"official-timetable-still-applicable;current-specialty-and-panhellenic-2027-verified",
      subjects:[
        "Ναυτικές Μηχανές",
        "Ναυτικό Δίκαιο - Διεθνείς Κανονισμοί στη Ναυτιλία - Εφαρμογές",
        "Βοηθητικές Εγκαταστάσεις Πλοίου",
        "Ηλεκτρικές Εγκαταστάσεις Πλοίου ΙΙ",
        "Ναυτικά Αγγλικά ΙΙ",
        "Μηχανολογικές Κατασκευές Πλοίου - Σχέδιο με Η/Υ",
        "Τήρηση Φυλακής Μηχανοστασίου"
      ]
    }
  ];

  const byId=id=>EXTRA.find(x=>x.id===id);
  const generalC=()=>((window.EPAL_2026_2027_TEACHER_STRUCTURE?.grades?.c)||[]).filter(x=>!x.sectorGateway).map(x=>({...x,topics:[...(x.topics||[])]}));
  const mk=(specialty,label,i)=>({
    id:`c-${specialty.id}-${i+1}`,
    label,
    topics:[],
    sourceUrl:specialty.sourceUrl,
    officialStructure:true,
    sector:specialty.sector,
    specialty:specialty.label,
    verificationBasis:specialty.sourceBasis
  });

  function selector(){return document.getElementById("epalSpecialty");}
  function isEpalC(){return document.getElementById("context")?.value==="epal"&&String(document.getElementById("grade")?.value||"").toLowerCase()==="c";}

  function addExtraOptions(){
    const sel=selector();
    if(!sel||!isEpalC()) return;
    EXTRA.forEach(s=>{
      if(sel.querySelector(`option[value="${s.id}"]`)) return;
      const o=document.createElement("option");
      o.value=s.id;
      o.textContent=`${s.sector} — ${s.label}`;
      sel.appendChild(o);
    });
  }

  function install(){
    if(typeof window.epalSubjects!=="function") return;
    const previousProvider=window.epalSubjects;
    const previousPrompt=(typeof promptText==="function")?promptText:null;
    const previousUnits=(typeof refreshUnits==="function")?refreshUnits:null;
    const previousCurrent=(typeof currentSubjects==="function")?currentSubjects:null;

    const provider=function(gid){
      const id=String(gid||document.getElementById("grade")?.value||"a").toLowerCase();
      if(id!=="c") return previousProvider(id);
      addExtraOptions();
      const extra=byId(selector()?.value);
      if(extra) return [...generalC(),...extra.subjects.map((label,i)=>mk(extra,label,i))];
      return (previousProvider(id)||[]).filter(x=>!x.sectorGateway);
    };

    // Assign both the window property and the actual global binding used by the original page.
    window.epalSubjects=provider;
    try{ epalSubjects=provider; }catch(_){ }

    if(previousCurrent){
      const currentProvider=function(){
        const c=document.getElementById("context")?.value;
        const g=document.getElementById("grade")?.value;
        if(c==="epal") return provider(g);
        return previousCurrent();
      };
      window.currentSubjects=currentProvider;
      try{ currentSubjects=currentProvider; }catch(_){ }
    }

    if(previousPrompt){
      const promptProvider=function(){
        let text=previousPrompt();
        if(!isEpalC()) return text;
        const option=selector()?.selectedOptions?.[0];
        if(!option) return text;
        const raw=option.textContent||"";
        const parts=raw.split(" — ");
        const sector=parts.shift()||"";
        const specialty=parts.join(" — ")||raw;
        text=text.replace(/\nΤομέας ΕΠΑΛ:[^\n]*/g,"").replace(/\nΕιδικότητα ΕΠΑΛ:[^\n]*/g,"");
        return text.replace(/(Τάξη:[^\n]*\n)/,`$1Τομέας ΕΠΑΛ: ${sector}\nΕιδικότητα ΕΠΑΛ: ${specialty}\n`);
      };
      window.promptText=promptProvider;
      try{ promptText=promptProvider; }catch(_){ }
    }

    if(previousUnits){
      const unitsProvider=function(){
        const out=previousUnits();
        if(isEpalC()){
          const sel=selector(),note=document.getElementById("curriculumNote"),custom=document.getElementById("customUnitField");
          if(sel&&note&&custom&&!custom.hidden){
            const raw=sel.selectedOptions?.[0]?.textContent||"";
            note.innerHTML=`<strong>✓ Επαληθευμένη ειδικότητα και μάθημα Γ΄ ΕΠΑΛ.</strong> ${raw}. Για αυτό το μάθημα δεν έχει ακόμη εξαχθεί αναλυτικός κατάλογος κεφαλαίων στο site· γράψε τον ακριβή τίτλο της ενότητας και δεν θα επινοηθεί ύλη.`;
          }
        }
        return out;
      };
      window.refreshUnits=unitsProvider;
      try{ refreshUnits=unitsProvider; }catch(_){ }
    }

    const refresh=()=>setTimeout(()=>{
      if(!isEpalC()) return;
      addExtraOptions();
      if(typeof refreshSubjects==="function") refreshSubjects();
    },0);
    document.getElementById("context")?.addEventListener("change",refresh);
    document.getElementById("grade")?.addEventListener("change",refresh);
    selector()?.addEventListener("change",()=>{ if(typeof refreshSubjects==="function") refreshSubjects(); });

    addExtraOptions();
    if(isEpalC()&&typeof refreshSubjects==="function") refreshSubjects();

    window.AITOOLSKIDS_EPAL_C_FINAL_SECTORS_2026_2027=Object.freeze({
      version:"1.0.0",
      verified:"2026-09-12",
      specialties:Object.freeze(EXTRA.map(x=>Object.freeze({...x,subjects:Object.freeze([...x.subjects])}))),
      sources:Object.freeze({structures:STRUCTURES_GUIDANCE,maritimeTimetable:MARITIME_TIMETABLE,currentEpalHub:EPAL_2026_HUB,panhellenic2027:PANHELLENIC_2027})
    });
  }

  if(typeof document==="undefined") return;
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();
