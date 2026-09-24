(function(){
  "use strict";

  const ENTRY_ID="specialEducationDiagnosticEntry";
  const MODAL_ID="specialDiagnosticModal";
  const DATA_SOURCES=[
    "/special-education-curriculum-data.js",
    "/special-education-learning-data.js",
    "/special-education-quiz-data.js",
    "/special-education-status.js",
    "/special-education-special-gymnasium-data.js",
    "/special-education-assessment-policy.js",
    "/special-education-diagnostic-data.js"
  ];
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
      .quiz-grade-card.spdiag-entry{border-color:#8fc7b7;background:linear-gradient(145deg,#f0faf6,#eef6ff);grid-column:1/-1;text-align:left}.spdiag-entry__sub{display:block;margin-top:6px;color:#526173;font-size:.78rem;font-weight:650;line-height:1.45}
      .spdiag-overlay[hidden]{display:none!important}.spdiag-overlay{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:18px;background:rgba(15,23,42,.56)}
      .spdiag{width:min(720px,100%);max-height:min(90vh,850px);overflow:auto;overscroll-behavior:contain;background:#fff;border-radius:18px;box-shadow:0 24px 70px rgba(15,23,42,.25);padding:20px;color:#1e293b}
      .spdiag__head{display:flex;gap:12px;align-items:flex-start;justify-content:space-between}.spdiag__head h2{margin:0;font-size:1.22rem}.spdiag__head p{margin:5px 0 0;color:#64748b;font-size:.84rem;line-height:1.5}
      .spdiag__close{flex:0 0 auto;border:0;background:#f1f5f9;border-radius:9px;width:38px;height:38px;font-size:1.2rem;cursor:pointer}
      .spdiag__step{margin-top:17px}.spdiag__label{display:block;margin-bottom:7px;font-weight:800;font-size:.82rem;color:#334155}
      .spdiag__schools{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}.spdiag__school{min-height:48px;padding:9px;border:1px solid #cbd5e1;border-radius:10px;background:#fff;font:inherit;font-weight:750;cursor:pointer}.spdiag__school.is-active{border-color:#2e6f5e;background:#edf7f3;color:#245c4e}
      .spdiag select{width:100%;min-height:44px;padding:8px 11px;border:1px solid #cbd5e1;border-radius:10px;background:#fff;font:inherit;color:#1e293b}
      .spdiag__grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.spdiag__scope{margin:14px 0 0;padding:10px 12px;border-radius:10px;background:#f8fafc;color:#64748b;font-size:.78rem;line-height:1.5}.spdiag__scope a{color:#315f93;font-weight:700}
      .spdiag__start,.spdiag__next{width:100%;min-height:46px;margin-top:14px;border:0;border-radius:11px;background:#2e6f5e;color:#fff;font:inherit;font-weight:800;cursor:pointer}.spdiag__start:disabled{opacity:.45;cursor:not-allowed}
      .spdiag__quiz{margin-top:18px}.spdiag__progress{color:#64748b;font-size:.78rem;font-weight:700}.spdiag__question{margin:8px 0 12px;font-size:1.05rem;line-height:1.45}.spdiag__answers{display:grid;grid-template-columns:1fr 1fr;gap:9px}.spdiag__answer{min-height:52px;padding:10px;border:1px solid #cbd5e1;border-radius:11px;background:#fff;font:inherit;font-weight:700;cursor:pointer}.spdiag__answer.is-correct{border-color:#15803d;background:#f0fdf4}.spdiag__answer.is-wrong{border-color:#b91c1c;background:#fef2f2}.spdiag__answer:disabled{cursor:default;opacity:1}
      .spdiag__result{text-align:center;padding:8px 0}.spdiag__score{font-size:2rem;font-weight:900;color:#245c4e}.spdiag__result h3{margin:5px 0}.spdiag__result p{color:#475569;line-height:1.5}.spdiag__actions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:14px}.spdiag__actions a,.spdiag__actions button{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:8px 12px;border-radius:9px;border:1px solid #cbd5e1;background:#fff;color:#334155;text-decoration:none;font:inherit;font-weight:750;cursor:pointer}.spdiag__actions a:first-child{background:#2e6f5e;color:#fff;border-color:#2e6f5e}
      .spdiag__tools{margin-top:14px;padding:12px;border:1px solid #bfdbfe;border-radius:11px;background:#f8fbff;text-align:left}.spdiag__tools h4{margin:0 0 7px}.spdiag__tool{display:block;margin-top:7px;padding:9px 10px;border:1px solid #bfdbfe;border-radius:9px;background:#fff;color:#1d4ed8;text-decoration:none;font-weight:800}.spdiag__tool small{display:block;margin-top:3px;color:#64748b;font-weight:500;line-height:1.35}
      @media(max-width:620px){.spdiag-overlay{padding:8px;place-items:end center}.spdiag{max-height:92vh;border-radius:16px 16px 8px 8px;padding:16px}.spdiag__schools,.spdiag__grid,.spdiag__answers{grid-template-columns:1fr}.spdiag__school{min-height:44px}.spdiag__actions{display:grid}.spdiag__actions>*{width:100%;box-sizing:border-box}}
    `;
    document.head.appendChild(s);
  }

  function ensureData(){
    if(window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA) return Promise.resolve(window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA);
    if(dataPromise) return dataPromise;
    const load=(src)=>new Promise((resolve,reject)=>{
      const ready=()=>
        (src.includes("curriculum-data")&&!!window.SPECIAL_EDUCATION_CURRICULUM) ||
        (src.includes("learning-data")&&!!window.SPECIAL_EDUCATION_LEARNING) ||
        (src.includes("quiz-data")&&!!window.SPECIAL_EDUCATION_QUIZZES) ||
        (src.includes("special-education-status")&&!!window.SPECIAL_EDUCATION_STATUS) ||
        (src.includes("special-gymnasium-data")&&!!window.SPECIAL_GYMNASIUM_2026_2027) ||
        (src.includes("assessment-policy")&&!!window.SPECIAL_EDUCATION_ASSESSMENT_POLICY) ||
        (src.includes("diagnostic-data")&&!!window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA);
      if(ready()){resolve();return;}
      const existing=document.querySelector(`script[src="${src}"]`);
      if(existing){if(existing.dataset.loaded==="1"){resolve();return;}existing.addEventListener("load",resolve,{once:true});existing.addEventListener("error",reject,{once:true});return;}
      const s=document.createElement("script");s.src=src;s.async=false;s.dataset.specialDiagnosticData="1";
      s.onload=()=>{s.dataset.loaded="1";resolve();};s.onerror=()=>reject(new Error(`Could not load ${src}`));document.head.appendChild(s);
    });
    dataPromise=DATA_SOURCES.reduce((promise,src)=>promise.then(()=>load(src)),Promise.resolve())
      .then(()=>window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA||Promise.reject(new Error("Special Education diagnostic data missing")))
      .catch((err)=>{dataPromise=null;throw err;});
    return dataPromise;
  }

  function ensureEntry(){
    document.getElementById(ENTRY_ID)?.remove();
  }

  function ensureQuizViewEntry(){
    document.querySelectorAll("[data-special-education-diagnostic].spdiag-entry").forEach((el)=>el.remove());
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
    wrap.querySelector("#spdiagSubject").addEventListener("change",()=>{state.subjectId=wrap.querySelector("#spdiagSubject").value;updateStart();updateScope();});
    wrap.querySelector("#spdiagStart").addEventListener("click",startQuiz);
    return wrap;
  }

  function resetState(){ Object.assign(state,{schoolId:"",gradeId:"",groupId:"",subjectId:"",quiz:null,index:0,score:0,answered:false}); }
  async function openModal(e){
    lastFocus=e?.currentTarget||document.activeElement;
    const picker=document.getElementById("heroQuizPicker");if(picker) picker.hidden=true;
    const m=createModal();
    m.hidden=false;document.body.style.overflow="hidden";resetState();
    m.querySelector("#spdiagSetup").hidden=false;
    const quizBox=m.querySelector("#spdiagQuiz");quizBox.hidden=true;quizBox.innerHTML="";
    const gradeSel=m.querySelector("#spdiagGrade");gradeSel.disabled=true;gradeSel.innerHTML=`<option>${t("Διάλεξε πρώτα σχολείο","Choose school first")}</option>`;
    hideGroup();resetSubject();updateStart();renderLoadingSchools();
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
    const first=document.createElement("option");first.value="";first.textContent=t("Διάλεξε μάθημα","Choose subject");sel.appendChild(first);
    subjects.forEach((s)=>{const o=document.createElement("option");o.value=s.id;const quiz=data().quizForSelection(state.schoolId,state.gradeId,state.groupId,s);const support=/support-mapping$/.test(quiz?.scope||"");o.textContent=quiz?(support?`${s.label} · ${t("τεστ υποστήριξης","support test")}`:s.label):`${s.label} · ${t("χωρίς επαληθευμένο τεστ ακόμη","verified test not yet available")}`;o.dataset.quizReady=quiz?"1":"0";o.dataset.quizScope=support?"support":quiz?"verified":"unavailable";sel.appendChild(o);});
    state.subjectId="";sel.value="";updateStart();updateScope();
  }
  function updateScope(){
    const p=modal()?.querySelector("#spdiagScope");if(!p)return;const src=school()?.sourceUrl;
    const ready=selectedQuiz();
    const msg=ready
      ?(ready.scope==="verified-adjacent-grade-support-mapping"
        ?t("Υπάρχει σύντομο τεστ υποστήριξης από το επαληθευμένο τεστ της Γ΄ τάξης για το ομώνυμο μάθημα. Η Δ΄ τάξη δεν έχει δικό της επαληθευμένο τεστ και το περιεχόμενο δεν παρουσιάζεται ως η ύλη της Δ΄ τάξης.","A short support test is available from the verified Grade C test for the same-named subject. Grade D has no test of its own, and this is not presented as the Grade D syllabus.")
        :ready.scope==="verified-general-support-mapping"
        ?t("Υπάρχει σύντομο τεστ υποστήριξης από επαληθευμένο τεστ του ίδιου μαθήματος και της αντίστοιχης τάξης γενικής εκπαίδευσης. Δεν παρουσιάζεται ως πλήρης ή ταυτόσημη ύλη Ειδικής Εκπαίδευσης.","A short support test is available from a verified general-education test for the same subject and corresponding grade. It is not presented as the full or identical Special Education syllabus.")
        :t("Υπάρχει περιορισμένο, επαληθευμένο τεστ 3 ερωτήσεων για τη συγκεκριμένη ενότητα. Δεν αποτελεί πλήρη έλεγχο της ύλης 2026–27.","A limited, verified three-question check is available for this unit. It is not a complete check of the 2026–27 syllabus."))
      :t("Για το επιλεγμένο μάθημα δεν υπάρχει ακόμη επαληθευμένο τεστ. Δεν εμφανίζουμε γενικές ή επινοημένες ερωτήσεις ως σχολική ύλη.","No verified test is available for the selected subject yet. Generic or invented questions are not presented as curriculum content.");
    p.innerHTML=`${esc(msg)}${src?` <a href="${esc(src)}" target="_blank" rel="noopener noreferrer">${esc(t("Επίσημη βάση 2026-27 ↗","Official 2026-27 basis ↗"))}</a>`:""}`;
  }
  function updateStart(){const b=modal().querySelector("#spdiagStart"),quiz=selectedQuiz(),ready=!!quiz;b.disabled=!ready;b.textContent=/support-mapping$/.test(quiz?.scope||"")?t("Ξεκίνα το σύντομο τεστ υποστήριξης","Start short support test"):ready?t("Ξεκίνα το επαληθευμένο τεστ","Start verified test"):t("Δεν υπάρχει ακόμη επαληθευμένο τεστ","Verified test not yet available");}
  function selectedSubject(){return currentSubjects().find((x)=>x.id===state.subjectId)||null;}
  function selectedQuiz(){const subj=selectedSubject();return subj?data()?.quizForSelection?.(state.schoolId,state.gradeId,state.groupId,subj):null;}

  function startQuiz(){
    state.quiz=selectedQuiz();if(!state.quiz)return;state.index=0;state.score=0;state.answered=false;
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
    const params=new URLSearchParams();
    const subject=String(state.subjectId||"");
    if(state.schoolId==="special-gymnasium"||state.schoolId==="deaf-gymnasium"){
      params.set("schoolTrack","special-gymnasium");
      if(state.gradeId!=="pre") params.set("grade",state.gradeId);
      const pilot={
        "a|language":"special-gym-a-language-comprehension",
        "a|math":"special-gym-a-math-problem-reading",
        "b|language":"special-gym-b-language-comprehension",
        "b|math":"special-gym-b-math-problem-reading",
        "c|language":"special-gym-c-language-comprehension",
        "c|math":"special-gym-c-math-problem-reading"
      }[`${state.gradeId}|${subject}`];
      if(subject) params.set("subject",pilot||`special-gym-${state.gradeId}-${subject}`);
      if(state.schoolId==="deaf-gymnasium") params.set("accessibility","deaf-hard-of-hearing");
      return `/middle/student/tutor?${params.toString()}`;
    }
    if(state.schoolId==="special-lyceum"||state.schoolId==="deaf-lyceum"){
      params.set("schoolTrack","special-lyceum");
      if(state.gradeId!=="pre") params.set("grade",state.gradeId);
      if(subject) params.set("subject",`special-lyceum-${state.gradeId}-${subject}`);
      if(state.schoolId==="deaf-lyceum") params.set("accessibility","deaf-hard-of-hearing");
      return `/high/student/tutor?${params.toString()}`;
    }
    params.set("schoolTrack","eneegyl");
    params.set("grade",state.gradeId);
    if(subject) params.set("subject",`eneegyl-${state.gradeId}-${subject}`);
    return `/high/student/tutor?${params.toString()}`;
  }
  function recommendedToolIds(){
    const id=String(state.subjectId||"").toLowerCase();
    if(/language|greek|new-greek|english|liter|reading/.test(id))return ["reading-coach","mindmup","quizlet"];
    if(/math|algebra|geometry|thermo|physics|mechan|electr|topograph/.test(id))return ["geogebra","photomath","quizlet"];
    if(/program|informatic|network|computer|database|web/.test(id))return ["replit-ai","quizlet","mindmup"];
    if(/drawing|graphic|design|art|creative|fashion|interior/.test(id))return ["canva-magic","autodraw","mindmup"];
    return ["quizlet","mindmup","notebooklm"];
  }
  function recommendedToolsHtml(){
    if(typeof TOOLS==="undefined")return "";
    const ids=recommendedToolIds().filter(id=>TOOLS[id]).slice(0,3);
    if(!ids.length)return "";
    return `<section class="spdiag__tools"><h4>${esc(t("🧰 Προτεινόμενα εργαλεία για εξάσκηση","🧰 Recommended practice tools"))}</h4>${ids.map(id=>{const tool=TOOLS[id],desc=(en()?tool.shortDescEn:tool.shortDescEl)||"";return `<a class="spdiag__tool" href="/tools/${esc(id)}.html" target="_blank" rel="noopener noreferrer">${esc(tool.name)}${desc?`<small>${esc(desc)}</small>`:""}</a>`;}).join("")}</section>`;
  }
  function renderResult(){
    const box=modal().querySelector("#spdiagQuiz"),score=state.score;
    const title=score===3?t("Καλή βάση","Good foundation"):score===2?t("Λίγη εξάσκηση","A little practice"):t("Χρειάζεται βοήθεια στα βασικά","Help with the basics will help");
    const msg=score===3?t("Το βασικό επίπεδο φαίνεται καλό. Μπορείς να συνεχίσεις με το επόμενο θέμα.","The basic level looks good. You can continue with the next topic."):score===2?t("Υπάρχει βάση, αλλά αξίζει λίγη στοχευμένη εξάσκηση.","There is a foundation, but some targeted practice would help."):t("Καλύτερα να δουλευτεί το μάθημα σε μικρά βήματα και με απλά παραδείγματα.","It is better to work through the subject in small steps with simple examples.");
    box.innerHTML=`<div class="spdiag__result"><div class="spdiag__score">${score}/3</div><h3>${esc(title)}</h3><p>${esc(msg)}</p><p class="spdiag__scope">${esc(state.quiz.scopeLabel||data().quizPolicy.scopeLabel)}</p>${recommendedToolsHtml()}<div class="spdiag__actions"><a href="${esc(tutorUrl())}">${esc(t("Ρώτα την AI Βοήθεια","Ask AI Help"))}</a><a href="/special-education.html#spSupportTitle">${esc(t("Περισσότερα εργαλεία υποστήριξης","More support tools"))}</a><button type="button" id="spdiagRetake">${esc(t("Ξανακάνε","Retake"))}</button></div></div>`;
    box.querySelector("#spdiagRetake").addEventListener("click",()=>{modal().querySelector("#spdiagSetup").hidden=false;box.hidden=true;box.innerHTML="";updateStart();});
  }

  document.addEventListener("keydown",(e)=>{if(e.key==="Escape"&&!modal()?.hidden)closeModal();});
  document.addEventListener("click",(e)=>{const trigger=e.target instanceof Element?e.target.closest("[data-special-education-diagnostic]"):null;if(trigger){e.preventDefault();openModal(e);}});
  document.addEventListener("click",(e)=>{if(e.target instanceof Element&&e.target.closest("#langEl,#langEn"))setTimeout(()=>{const m=modal();if(m&&!m.hidden)closeModal();ensureEntry();},0);});
  const init=()=>{
    injectStyles();
    ensureEntry();
    ensureQuizViewEntry();
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();

  window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC=Object.freeze({version:5,toolRecommendations:true,ensureEntry,ensureQuizViewEntry,open:()=>openModal(null),dataLoaded:()=>!!window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA});
})();
