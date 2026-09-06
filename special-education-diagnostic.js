(function(){
  "use strict";

  const ENTRY_ID="specialEducationDiagnosticEntry";
  const MODAL_ID="specialDiagnosticModal";
  const DATA_SRC="/special-education-diagnostic-data.js";
  let dataPromise=null;
  let lastFocus=null;
  const state={schoolId:"",gradeId:"",groupId:"",subjectId:"",quiz:null,index:0,score:0,answered:false};

  function en(){ return document.getElementById("langEn")?.classList.contains("active") || (document.documentElement.lang||"").toLowerCase().startsWith("en"); }
  function t(el,enText){ return en()?enText:el; }
  function esc(v){ return String(v??"").replace(/[&<>\"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }

  function injectStyles(){
    if(document.getElementById("specialDiagnosticStyles")) return;
    const s=document.createElement("style");
    s.id="specialDiagnosticStyles";
    s.textContent=`
      .hero__quiz-picker-btn--special{grid-column:1/-1;border-color:#b7d6cb!important;background:#f3faf7!important;color:#245c4e!important}
      .spdiag-overlay[hidden]{display:none!important}.spdiag-overlay{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:18px;background:rgba(15,23,42,.56)}
      .spdiag{width:min(720px,100%);max-height:min(90vh,850px);overflow:auto;overscroll-behavior:contain;background:#fff;border-radius:18px;box-shadow:0 24px 70px rgba(15,23,42,.25);padding:20px;color:#1e293b}
      .spdiag__head{display:flex;gap:12px;align-items:flex-start;justify-content:space-between}.spdiag__head h2{margin:0;font-size:1.22rem}.spdiag__head p{margin:5px 0 0;color:#64748b;font-size:.84rem;line-height:1.5}
      .spdiag__close{flex:0 0 auto;border:0;background:#f1f5f9;border-radius:9px;width:38px;height:38px;font-size:1.2rem;cursor:pointer}
      .spdiag__step{margin-top:17px}.spdiag__label{display:block;margin-bottom:7px;font-weight:800;font-size:.82rem;color:#334155}
      .spdiag__schools{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.spdiag__school{min-height:48px;padding:9px;border:1px solid #cbd5e1;border-radius:10px;background:#fff;font:inherit;font-weight:750;cursor:pointer}.spdiag__school.is-active{border-color:#2e6f5e;background:#edf7f3;color:#245c4e}
      .spdiag select{width:100%;min-height:44px;padding:8px 11px;border:1px solid #cbd5e1;border-radius:10px;background:#fff;font:inherit;color:#1e293b}
      .spdiag__grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.spdiag__scope{margin:14px 0 0;padding:10px 12px;border-radius:10px;background:#f8fafc;color:#64748b;font-size:.78rem;line-height:1.5}.spdiag__scope a{color:#315f93;font-weight:700}
      .spdiag__start,.spdiag__next{width:100%;min-height:46px;margin-top:14px;border:0;border-radius:11px;background:#2e6f5e;color:#fff;font:inherit;font-weight:800;cursor:pointer}.spdiag__start:disabled{opacity:.45;cursor:not-allowed}
      .spdiag__quiz{margin-top:18px}.spdiag__progress{color:#64748b;font-size:.78rem;font-weight:700}.spdiag__question{margin:8px 0 12px;font-size:1.05rem;line-height:1.45}.spdiag__answers{display:grid;grid-template-columns:1fr 1fr;gap:9px}.spdiag__answer{min-height:52px;padding:10px;border:1px solid #cbd5e1;border-radius:11px;background:#fff;font:inherit;font-weight:700;cursor:pointer}.spdiag__answer.is-correct{border-color:#15803d;background:#f0fdf4}.spdiag__answer.is-wrong{border-color:#b91c1c;background:#fef2f2}.spdiag__answer:disabled{cursor:default;opacity:1}
      .spdiag__result{text-align:center;padding:8px 0}.spdiag__score{font-size:2rem;font-weight:900;color:#245c4e}.spdiag__result h3{margin:5px 0}.spdiag__result p{color:#475569;line-height:1.5}.spdiag__actions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:14px}.spdiag__actions a,.spdiag__actions button{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:8px 12px;border-radius:9px;border:1px solid #cbd5e1;background:#fff;color:#334155;text-decoration:none;font:inherit;font-weight:750;cursor:pointer}.spdiag__actions a:first-child{background:#2e6f5e;color:#fff;border-color:#2e6f5e}
      @media(max-width:620px){.spdiag-overlay{padding:8px;place-items:end center}.spdiag{max-height:92vh;border-radius:16px 16px 8px 8px;padding:16px}.spdiag__schools,.spdiag__grid,.spdiag__answers{grid-template-columns:1fr}.spdiag__school{min-height:44px}.spdiag__actions{display:grid}.spdiag__actions>*{width:100%;box-sizing:border-box}}
    `;
    document.head.appendChild(s);
  }

  function ensureData(){
    if(window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA) return Promise.resolve(window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA);
    if(dataPromise) return dataPromise;
    dataPromise=new Promise((resolve,reject)=>{
      const existing=document.querySelector('script[data-special-diagnostic-data="1"]');
      if(existing){ existing.addEventListener("load",()=>resolve(window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA),{once:true}); existing.addEventListener("error",reject,{once:true}); return; }
      const s=document.createElement("script");s.src=DATA_SRC;s.async=false;s.dataset.specialDiagnosticData="1";
      s.onload=()=>window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA?resolve(window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA):reject(new Error("Special Education diagnostic data missing"));
      s.onerror=()=>reject(new Error("Could not load Special Education diagnostic data"));
      document.head.appendChild(s);
    }).catch((err)=>{dataPromise=null;throw err;});
    return dataPromise;
  }

  function ensureEntry(){
    const grid=document.getElementById("heroQuizPickerGrid");
    if(!grid||document.getElementById(ENTRY_ID)) return;
    const b=document.createElement("button");
    b.type="button";b.id=ENTRY_ID;b.className="hero__quiz-picker-btn hero__quiz-picker-btn--special";b.dataset.specialEducationDiagnosticEntry="1";
    b.innerHTML=`<span aria-hidden="true">🎓</span> ${t("Ειδική Εκπαίδευση","Special Education")}`;
    b.addEventListener("click",openModal);
    grid.appendChild(b);
  }

  function modal(){ return document.getElementById(MODAL_ID); }
  function createModal(){
    if(modal()) return modal();
    injectStyles();
    const wrap=document.createElement("div");wrap.id=MODAL_ID;wrap.className="spdiag-overlay";wrap.hidden=true;
    wrap.innerHTML=`<section class="spdiag" role="dialog" aria-modal="true" aria-labelledby="spdiagTitle">
      <div class="spdiag__head"><div><h2 id="spdiagTitle">${t("Μικρό Διαγνωστικό Ειδικής Εκπαίδευσης","Special Education mini diagnostic")}</h2><p>${t("Σχολείο → τάξη → μάθημα → 3 απλές ερωτήσεις.","School → grade → subject → 3 simple questions.")}</p></div><button type="button" class="spdiag__close" aria-label="${t("Κλείσιμο","Close")}">×</button></div>
      <div id="spdiagSetup">
        <div class="spdiag__step"><span class="spdiag__label">1. ${t("Σχολείο","School")}</span><div class="spdiag__schools" id="spdiagSchools"></div></div>
        <div class="spdiag__grid">
          <label class="spdiag__step"><span class="spdiag__label">2. ${t("Τάξη","Grade")}</span><select id="spdiagGrade" disabled><option>${t("Διάλεξε πρώτα σχολείο","Choose school first")}</option></select></label>
          <label class="spdiag__step" id="spdiagGroupWrap" hidden><span class="spdiag__label" id="spdiagGroupLabel">${t("Τομέας / Ομάδα","Sector / group")}</span><select id="spdiagGroup"></select></label>
        </div>
        <label class="spdiag__step"><span class="spdiag__label">3. ${t("Μάθημα","Subject")}</span><select id="spdiagSubject" disabled><option>${t("Διάλεξε τάξη","Choose grade")}</option></select></label>
        <p class="spdiag__scope" id="spdiagScope"></p>
        <button type="button" class="spdiag__start" id="spdiagStart" disabled>${t("Ξεκίνα το μικρό τεστ","Start mini test")}</button>
      </div>
      <div class="spdiag__quiz" id="spdiagQuiz" hidden></div>
    </section>`;
    document.body.appendChild(wrap);
    wrap.querySelector(".spdiag__close").addEventListener("click",closeModal);
    wrap.addEventListener("click",(e)=>{if(e.target===wrap) closeModal();});
    wrap.querySelector("#spdiagGrade").addEventListener("change",onGrade);
    wrap.querySelector("#spdiagGroup").addEventListener("change",()=>{state.groupId=wrap.querySelector("#spdiagGroup").value;populateSubjects();});
    wrap.querySelector("#spdiagSubject").addEventListener("change",()=>{state.subjectId=wrap.querySelector("#spdiagSubject").value;updateStart();});
    wrap.querySelector("#spdiagStart").addEventListener("click",startQuiz);
    return wrap;
  }

  function resetState(){ Object.assign(state,{schoolId:"",gradeId:"",groupId:"",subjectId:"",quiz:null,index:0,score:0,answered:false}); }
  async function openModal(e){
    lastFocus=e?.currentTarget||document.activeElement;
    const picker=document.getElementById("heroQuizPicker");if(picker) picker.hidden=true;
    const m=createModal();m.hidden=false;document.body.style.overflow="hidden";resetState();renderLoadingSchools();
    try{await ensureData();renderSchools();m.querySelector(".spdiag__close").focus();}
    catch(err){m.querySelector("#spdiagSchools").innerHTML=`<p>${t("Δεν φορτώθηκε το διαγνωστικό. Δοκίμασε ξανά.","Diagnostic could not load. Try again.")}</p>`;console.error(err);}
  }
  function closeModal(){const m=modal();if(!m)return;m.hidden=true;document.body.style.overflow="";lastFocus?.focus?.();}
  function renderLoadingSchools(){const x=modal()?.querySelector("#spdiagSchools");if(x)x.innerHTML=`<span>${t("Φόρτωση…","Loading…")}</span>`;}
  function data(){return window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA;}
  function school(){return data()?.schools?.[state.schoolId];}
  function grade(){return school()?.grades?.[state.gradeId];}

  function renderSchools(){
    const box=modal().querySelector("#spdiagSchools");box.innerHTML="";
    data().schoolOrder.forEach((id)=>{const s=data().schools[id],b=document.createElement("button");b.type="button";b.className="spdiag__school";b.dataset.school=id;b.textContent=s.label;b.addEventListener("click",()=>selectSchool(id));box.appendChild(b);});
    updateScope();
  }
  function selectSchool(id){
    state.schoolId=id;state.gradeId="";state.groupId="";state.subjectId="";
    modal().querySelectorAll(".spdiag__school").forEach((b)=>b.classList.toggle("is-active",b.dataset.school===id));
    const sel=modal().querySelector("#spdiagGrade");sel.disabled=false;sel.innerHTML=`<option value="">${t("Διάλεξε τάξη","Choose grade")}</option>`;
    school().gradeOrder.forEach((gid)=>{const g=school().grades[gid],o=document.createElement("option");o.value=gid;o.textContent=g.label;sel.appendChild(o);});
    hideGroup();resetSubject();updateScope();updateStart();
  }
  function onGrade(){state.gradeId=modal().querySelector("#spdiagGrade").value;state.groupId="";state.subjectId="";populateGroup();populateSubjects();updateScope();}
  function hideGroup(){modal().querySelector("#spdiagGroupWrap").hidden=true;modal().querySelector("#spdiagGroup").innerHTML="";}
  function populateGroup(){
    const g=grade(),wrap=modal().querySelector("#spdiagGroupWrap"),sel=modal().querySelector("#spdiagGroup");
    if(!g?.groups?.length){hideGroup();return;}
    wrap.hidden=false;modal().querySelector("#spdiagGroupLabel").textContent=`${g.groupLabel||t("Τομέας / Ομάδα","Sector / group")}`;
    sel.innerHTML="";g.groups.forEach((r)=>{const o=document.createElement("option");o.value=r.id;o.textContent=r.label;sel.appendChild(o);});
    state.groupId=g.groups[0]?.id||"";sel.value=state.groupId;
  }
  function resetSubject(){const sel=modal().querySelector("#spdiagSubject");sel.disabled=true;sel.innerHTML=`<option>${t("Διάλεξε τάξη","Choose grade")}</option>`;}
  function currentSubjects(){const g=grade();if(!g)return[];const common=[...(g.subjects||[])];const selected=g.groups?.find((x)=>x.id===state.groupId);return common.concat(selected?.subjects||[]);}
  function populateSubjects(){
    const sel=modal().querySelector("#spdiagSubject"),subjects=currentSubjects();sel.innerHTML="";sel.disabled=!subjects.length;
    subjects.forEach((s)=>{const o=document.createElement("option");o.value=s.id;o.textContent=s.label;sel.appendChild(o);});
    state.subjectId=subjects[0]?.id||"";sel.value=state.subjectId;updateStart();updateScope();
  }
  function updateScope(){
    const p=modal()?.querySelector("#spdiagScope");if(!p)return;const src=school()?.sourceUrl;
    p.innerHTML=`${esc(t("Το τεστ είναι σκόπιμα απλοποιημένο: 3 σύντομες ερωτήσεις, 2 επιλογές, χωρίς παγίδες. Είναι βασικός έλεγχος κατανόησης και όχι πλήρης έλεγχος της διδακτέας ή εξεταστέας ύλης 2026-27.","The test is intentionally simplified: 3 short questions, 2 choices, no traps. It is a basic understanding check, not a full check of the 2026-27 taught/examined syllabus."))}${src?` <a href="${esc(src)}" target="_blank" rel="noopener noreferrer">${esc(t("Επίσημη βάση 2026-27 ↗","Official 2026-27 basis ↗"))}</a>`:""}`;
  }
  function updateStart(){modal().querySelector("#spdiagStart").disabled=!(state.schoolId&&state.gradeId&&state.subjectId);}
  function selectedSubject(){return currentSubjects().find((x)=>x.id===state.subjectId)||null;}

  function startQuiz(){
    const subj=selectedSubject();if(!subj)return;state.quiz=data().quizForSubject(subj);state.index=0;state.score=0;state.answered=false;
    modal().querySelector("#spdiagSetup").hidden=true;modal().querySelector("#spdiagQuiz").hidden=false;renderQuestion();
  }
  function renderQuestion(){
    const box=modal().querySelector("#spdiagQuiz"),q=state.quiz.questions[state.index];state.answered=false;
    box.innerHTML=`<div class="spdiag__progress">${esc(t("Ερώτηση","Question"))} ${state.index+1} / ${state.quiz.questions.length} · ${esc(state.quiz.subjectLabel)}</div><h3 class="spdiag__question">${esc(q.text)}</h3><div class="spdiag__answers">${q.options.map((o,i)=>`<button type="button" class="spdiag__answer" data-answer="${i}">${esc(o)}</button>`).join("")}</div><button type="button" class="spdiag__next" hidden>${state.index===state.quiz.questions.length-1?t("Δες αποτέλεσμα","See result"):t("Επόμενη","Next")}</button>`;
    box.querySelectorAll(".spdiag__answer").forEach((b)=>b.addEventListener("click",()=>answer(Number(b.dataset.answer))));
    box.querySelector(".spdiag__next").addEventListener("click",()=>{if(state.index<state.quiz.questions.length-1){state.index++;renderQuestion();}else renderResult();});
  }
  function answer(i){
    if(state.answered)return;state.answered=true;const q=state.quiz.questions[state.index];if(i===q.correctIndex)state.score++;
    modal().querySelectorAll(".spdiag__answer").forEach((b)=>{const n=Number(b.dataset.answer);b.disabled=true;if(n===q.correctIndex)b.classList.add("is-correct");else if(n===i)b.classList.add("is-wrong");});
    modal().querySelector(".spdiag__next").hidden=false;
  }
  function tutorUrl(){
    if(state.schoolId==="special-gymnasium") return `/middle/student/tutor?schoolTrack=special-gymnasium${state.gradeId!=="pre"?`&grade=${encodeURIComponent(state.gradeId)}`:""}`;
    if(state.schoolId==="special-lyceum") return `/high/student/tutor?schoolTrack=special-lyceum${state.gradeId!=="pre"?`&grade=${encodeURIComponent(state.gradeId)}`:""}`;
    return `/high/student/tutor?schoolTrack=eneegyl&grade=${encodeURIComponent(state.gradeId)}`;
  }
  function renderResult(){
    const box=modal().querySelector("#spdiagQuiz"),score=state.score;
    const title=score===3?t("Καλή βάση","Good foundation"):score===2?t("Λίγη εξάσκηση","A little practice"):t("Χρειάζεται βοήθεια στα βασικά","Help with the basics will help");
    const msg=score===3?t("Το βασικό επίπεδο φαίνεται καλό. Μπορείς να συνεχίσεις με το επόμενο θέμα.","The basic level looks good. You can continue with the next topic."):score===2?t("Υπάρχει βάση, αλλά αξίζει λίγη στοχευμένη εξάσκηση.","There is a foundation, but some targeted practice would help."):t("Καλύτερα να δουλευτεί το μάθημα σε μικρά βήματα και με απλά παραδείγματα.","It is better to work through the subject in small steps with simple examples.");
    box.innerHTML=`<div class="spdiag__result"><div class="spdiag__score">${score}/3</div><h3>${esc(title)}</h3><p>${esc(msg)}</p><p class="spdiag__scope">${esc(data().quizPolicy.scopeLabel)}</p><div class="spdiag__actions"><a href="${esc(tutorUrl())}">${esc(t("Ρώτα την AI Βοήθεια","Ask AI Help"))}</a><a href="/special-education.html#spSupportTitle">${esc(t("Εργαλεία υποστήριξης","Support tools"))}</a><button type="button" id="spdiagRetake">${esc(t("Ξανακάνε","Retake"))}</button></div></div>`;
    box.querySelector("#spdiagRetake").addEventListener("click",()=>{modal().querySelector("#spdiagSetup").hidden=false;box.hidden=true;box.innerHTML="";updateStart();});
  }

  document.addEventListener("keydown",(e)=>{if(e.key==="Escape"&&!modal()?.hidden)closeModal();});
  document.addEventListener("click",(e)=>{if(e.target instanceof Element&&e.target.closest("#langEl,#langEn"))setTimeout(()=>{const m=modal();if(m&&!m.hidden)closeModal();ensureEntry();},0);});
  const init=()=>{injectStyles();ensureEntry();setTimeout(ensureEntry,250);};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
  window.addEventListener("load",ensureEntry,{once:true});
  document.getElementById("heroQuizCtaBtn")?.addEventListener("click",()=>setTimeout(ensureEntry,0));

  window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC=Object.freeze({version:1,ensureEntry,open:()=>openModal(null),dataLoaded:()=>!!window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA});
})();