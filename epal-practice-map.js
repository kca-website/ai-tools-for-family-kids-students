(function(){
  "use strict";

  const MODAL_ID="epalPracticeMapModal";
  let lastFocus=null;
  const state={grade:"a",sector:"",specialty:"",subject:"",topic:""};

  function en(){return document.getElementById("langEn")?.classList.contains("active")||(document.documentElement.lang||"").toLowerCase().startsWith("en");}
  function t(el,enText){return en()?enText:el;}
  function esc(v){return String(v??"").replace(/[&<>\"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
  function catalog(){return window.AITOOLSKIDS_EPAL_STUDENT_CATALOG;}

  function injectStyles(){
    if(document.getElementById("epalPracticeMapStyles"))return;
    const s=document.createElement("style");s.id="epalPracticeMapStyles";
    s.textContent=`
      .epmap-overlay[hidden]{display:none!important}.epmap-overlay{position:fixed;inset:0;z-index:10020;display:grid;place-items:center;padding:18px;background:rgba(15,23,42,.58)}
      .epmap{width:min(760px,100%);max-height:min(92vh,880px);overflow:auto;background:#fff;border-radius:18px;box-shadow:0 24px 70px rgba(15,23,42,.28);padding:20px;color:#1e293b}
      .epmap__head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}.epmap__head h2{margin:0;font-size:1.25rem}.epmap__head p{margin:6px 0 0;color:#64748b;font-size:.84rem;line-height:1.5}.epmap__close{flex:0 0 auto;width:38px;height:38px;border:0;border-radius:9px;background:#f1f5f9;font-size:1.2rem;cursor:pointer}
      .epmap__notice{margin:16px 0 0;padding:11px 13px;border:1px solid #bfdbfe;border-radius:11px;background:#eff6ff;color:#1e40af;font-size:.8rem;line-height:1.5}
      .epmap__grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}.epmap__field{display:block}.epmap__field--wide{grid-column:1/-1}.epmap__field span{display:block;margin-bottom:7px;font-size:.82rem;font-weight:800;color:#334155}.epmap select{width:100%;min-height:46px;padding:8px 11px;border:1px solid #cbd5e1;border-radius:10px;background:#fff;color:#1e293b;font:inherit}
      .epmap__source{margin:14px 0 0;padding:10px 12px;border-radius:10px;background:#f8fafc;color:#64748b;font-size:.78rem;line-height:1.5}.epmap__source a{color:#315f93;font-weight:750}
      .epmap__actions{display:grid;gap:9px;margin-top:14px}.epmap__go{display:flex;align-items:center;justify-content:center;min-height:48px;padding:9px 13px;border:0;border-radius:11px;background:#2e6f5e;color:#fff;text-decoration:none;font:inherit;font-weight:850;text-align:center}.epmap__go[aria-disabled="true"]{pointer-events:none;opacity:.48}.epmap__hint{margin:0;text-align:center;color:#64748b;font-size:.76rem;line-height:1.45}
      .hero__quiz-picker-btn--epal{border-color:#93c5fd!important;background:#eff6ff!important;color:#1e3a8a!important}
      @media(max-width:620px){.epmap-overlay{padding:8px;place-items:end center}.epmap{max-height:94vh;border-radius:16px 16px 8px 8px;padding:16px}.epmap__grid{grid-template-columns:1fr}.epmap__field--wide{grid-column:auto}}
    `;document.head.appendChild(s);
  }

  function modal(){return document.getElementById(MODAL_ID);}
  function option(value,label){return `<option value="${esc(value)}">${esc(label)}</option>`;}
  function selectedSubject(){return currentSubjects().find(x=>x.id===state.subject)||null;}
  function verifiedTopics(subject){return (subject?.topics||[]).filter(x=>x.officialExact!==false&&!x.customTitle);}
  function currentSubjects(){
    if(!catalog())return[];
    return catalog().getSubjects(state.grade,state.grade==="b"?state.sector:"",state.grade==="c"?state.specialty:"")||[];
  }

  function createModal(){
    if(modal())return modal();injectStyles();
    const wrap=document.createElement("div");wrap.id=MODAL_ID;wrap.className="epmap-overlay";wrap.hidden=true;
    wrap.innerHTML=`<section class="epmap" role="dialog" aria-modal="true" aria-labelledby="epmapTitle">
      <div class="epmap__head"><div><h2 id="epmapTitle">${t("Χάρτης Εξάσκησης ΕΠΑΛ","EPAL Practice Map")}</h2><p>${t("Διάλεξε την πραγματική διαδρομή σου και συνέχισε σε quiz πάνω στην επίσημη ενότητα.","Choose your actual pathway and continue to a quiz based on the official unit.")}</p></div><button type="button" class="epmap__close" aria-label="${t("Κλείσιμο","Close")}">×</button></div>
      <p class="epmap__notice">${t("Εμφανίζονται μόνο ενότητες που έχουν αντιστοιχιστεί σε επίσημη πηγή 2026–27 ή στην επίσημη ύλη Πανελλαδικών ΕΠΑΛ 2027. Δεν δημιουργούνται τυχαία κεφάλαια.","Only units mapped to an official 2026–27 source or the official 2027 EPAL Panhellenic syllabus are shown. No guessed chapters are created.")}</p>
      <div class="epmap__grid">
        <label class="epmap__field"><span>1. ${t("Τάξη","Year")}</span><select id="epmapGrade"><option value="a">${t("Α΄ ΕΠΑΛ","EPAL Year 1")}</option><option value="b">${t("Β΄ ΕΠΑΛ","EPAL Year 2")}</option><option value="c">${t("Γ΄ ΕΠΑΛ","EPAL Year 3")}</option></select></label>
        <label class="epmap__field" id="epmapTrackWrap" hidden><span id="epmapTrackLabel"></span><select id="epmapTrack"></select></label>
        <label class="epmap__field epmap__field--wide"><span>3. ${t("Μάθημα","Subject")}</span><select id="epmapSubject"></select></label>
        <label class="epmap__field epmap__field--wide"><span>4. ${t("Επίσημη ενότητα","Official unit")}</span><select id="epmapTopic"></select></label>
      </div>
      <p class="epmap__source" id="epmapSource"></p>
      <div class="epmap__actions"><a class="epmap__go" id="epmapGo" href="#" aria-disabled="true">${t("Συνέχεια στο quiz με AI","Continue to the AI quiz")}</a><p class="epmap__hint">${t("Στην επόμενη οθόνη πάτησε «Φτιάξε quiz εξάσκησης». Το quiz δημιουργείται μόνο για την ενότητα που επέλεξες.","On the next screen choose “Create a practice quiz”. The quiz is generated only for the unit you selected.")}</p></div>
    </section>`;
    document.body.appendChild(wrap);
    wrap.querySelector(".epmap__close").addEventListener("click",close);
    wrap.addEventListener("click",e=>{if(e.target===wrap)close();});
    wrap.querySelector("#epmapGrade").addEventListener("change",e=>{state.grade=e.target.value;state.sector="";state.specialty="";state.subject="";state.topic="";render();});
    wrap.querySelector("#epmapTrack").addEventListener("change",e=>{if(state.grade==="b")state.sector=e.target.value;else state.specialty=e.target.value;state.subject="";state.topic="";renderSubjects();});
    wrap.querySelector("#epmapSubject").addEventListener("change",e=>{state.subject=e.target.value;state.topic="";renderTopics();});
    wrap.querySelector("#epmapTopic").addEventListener("change",e=>{state.topic=e.target.value;renderAction();});
    return wrap;
  }

  function renderTrack(){
    const wrap=modal().querySelector("#epmapTrackWrap"),label=modal().querySelector("#epmapTrackLabel"),sel=modal().querySelector("#epmapTrack");
    if(state.grade==="a"){wrap.hidden=true;sel.innerHTML="";return;}
    wrap.hidden=false;
    const rows=state.grade==="b"?catalog().getSectors():catalog().getSpecialties();
    label.textContent=`2. ${state.grade==="b"?t("Τομέας","Sector"):t("Ειδικότητα","Specialty")}`;
    sel.innerHTML=option("",state.grade==="b"?t("Διάλεξε τομέα","Choose sector"):t("Διάλεξε ειδικότητα","Choose specialty"))+rows.map(x=>option(x.id,x.label)).join("");
    sel.value=state.grade==="b"?state.sector:state.specialty;
  }

  function renderSubjects(){
    const sel=modal().querySelector("#epmapSubject");
    if((state.grade==="b"&&!state.sector)||(state.grade==="c"&&!state.specialty)){
      sel.disabled=true;sel.innerHTML=option("",t("Διάλεξε πρώτα τη διαδρομή σου","Choose your pathway first"));state.subject="";renderTopics();return;
    }
    const rows=currentSubjects().filter(x=>verifiedTopics(x).length);
    sel.disabled=!rows.length;sel.innerHTML=option("",rows.length?t("Διάλεξε μάθημα","Choose subject"):t("Δεν υπάρχει ακόμη χαρτογραφημένη ενότητα","No mapped unit yet"))+rows.map(x=>option(x.id,x.subjectLabelEl||x.subjectLabelEn||x.id)).join("");
    if(!rows.some(x=>x.id===state.subject))state.subject="";sel.value=state.subject;renderTopics();
  }

  function renderTopics(){
    const sel=modal().querySelector("#epmapTopic"),topics=verifiedTopics(selectedSubject());
    sel.disabled=!topics.length;sel.innerHTML=option("",topics.length?t("Διάλεξε επίσημη ενότητα","Choose official unit"):t("Διάλεξε πρώτα μάθημα","Choose a subject first"))+topics.map(x=>option(x.id,x.labelEl||x.labelEn||x.id)).join("");
    if(!topics.some(x=>x.id===state.topic))state.topic="";sel.value=state.topic;renderAction();
  }

  function renderAction(){
    const subject=selectedSubject(),topic=verifiedTopics(subject).find(x=>x.id===state.topic),go=modal().querySelector("#epmapGo"),source=modal().querySelector("#epmapSource");
    const sourceUrl=topic?.sourceUrl||subject?.curriculum?.annualInstructionsUrl||subject?.curriculum?.catalogUrl||"";
    source.innerHTML=topic?`${esc(t("Η επιλογή είναι αντιστοιχισμένη στην επίσημη ύλη.","This selection is mapped to the official syllabus."))}${sourceUrl?` <a href="${esc(sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(t("Επίσημη πηγή ↗","Official source ↗"))}</a>`:""}`:esc(t("Επίλεξε μάθημα και επίσημη ενότητα. Όπου δεν έχει ολοκληρωθεί η χαρτογράφηση, δεν εμφανίζεται έτοιμο τεστ.","Choose a subject and official unit. Where mapping is incomplete, no ready test is shown."));
    if(!topic){go.href="#";go.setAttribute("aria-disabled","true");return;}
    const q=new URLSearchParams({schoolType:"epal",grade:state.grade,subject:state.subject,topic:state.topic,from:"practice-map"});
    if(state.sector)q.set("sector",state.sector);if(state.specialty)q.set("specialty",state.specialty);
    go.href=`/high/student/tutor?${q}`;go.setAttribute("aria-disabled","false");
  }

  function render(){modal().querySelector("#epmapGrade").value=state.grade;renderTrack();renderSubjects();}
  function open(e){
    if(!catalog()){console.error("EPAL student catalog is unavailable");return;}
    lastFocus=e?.currentTarget||document.activeElement;const m=createModal();m.hidden=false;document.body.style.overflow="hidden";
    Object.assign(state,{grade:"a",sector:"",specialty:"",subject:"",topic:""});render();m.querySelector(".epmap__close").focus();
  }
  function close(){const m=modal();if(!m)return;m.hidden=true;document.body.style.overflow="";lastFocus?.focus?.();}
  function ensureLegacyEntry(){
    const grid=document.getElementById("heroQuizPickerGrid");if(!grid||document.getElementById("epalPracticeMapEntry"))return;
    const b=document.createElement("button");b.type="button";b.id="epalPracticeMapEntry";b.className="hero__quiz-picker-btn hero__quiz-picker-btn--epal";b.innerHTML=`<span aria-hidden="true">🛠️</span> ${t("ΕΠΑΛ","EPAL")}`;b.addEventListener("click",open);grid.appendChild(b);
  }

  document.addEventListener("click",e=>{const trigger=e.target instanceof Element?e.target.closest("[data-epal-practice-map]"):null;if(trigger){e.preventDefault();open(e);}});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal()?.hidden)close();});
  const init=()=>{injectStyles();ensureLegacyEntry();setTimeout(ensureLegacyEntry,250);};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
  window.addEventListener("load",ensureLegacyEntry,{once:true});
  window.AITOOLSKIDS_EPAL_PRACTICE_MAP=Object.freeze({version:1,open:()=>open(null),close});
})();
