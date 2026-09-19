(function(){
  "use strict";

  const MODAL_ID="epalPracticeMapModal";
  const CACHE_KEY="aitools4kids_epal_short_quizzes_v1";
  let lastFocus=null;
  const state={grade:"a",sector:"",specialty:"",subject:"",topic:"",quiz:null,index:0,score:0,answered:false};

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
      .epmap__status{min-height:1.2em;margin:9px 0 0;text-align:center;color:#64748b;font-size:.78rem}.epmap__quiz{margin-top:17px;padding-top:16px;border-top:1px solid #e2e8f0}.epmap__quiz[hidden]{display:none}.epmap__progress{color:#64748b;font-size:.78rem;font-weight:750}.epmap__question{margin:8px 0 13px;font-size:1.08rem;line-height:1.48}.epmap__answers{display:grid;grid-template-columns:1fr 1fr;gap:9px}.epmap__answer{min-height:54px;padding:11px;border:1px solid #cbd5e1;border-radius:11px;background:#fff;color:#1e293b;font:inherit;font-weight:720;text-align:left;cursor:pointer}.epmap__answer.is-correct{border-color:#15803d;background:#f0fdf4}.epmap__answer.is-wrong{border-color:#b91c1c;background:#fef2f2}.epmap__feedback{margin:11px 0 0;padding:10px 12px;border-radius:10px;background:#f8fafc;color:#475569;font-size:.84rem;line-height:1.45}.epmap__next{width:100%;min-height:44px;margin-top:11px;border:0;border-radius:10px;background:#315f93;color:#fff;font:inherit;font-weight:800;cursor:pointer}.epmap__score{font-size:2rem;font-weight:900;color:#245c4e}.epmap__result h3{margin:7px 0}.epmap__tools{margin-top:14px;padding:12px;border:1px solid #bfdbfe;border-radius:11px;background:#f8fbff}.epmap__tools h4{margin:0 0 7px}.epmap__tool{display:block;margin-top:7px;padding:9px 10px;border:1px solid #bfdbfe;border-radius:9px;background:#fff;color:#1d4ed8;text-decoration:none;font-weight:800}.epmap__tool small{display:block;margin-top:3px;color:#64748b;font-weight:500;line-height:1.35}
      .hero__quiz-picker-btn--epal{border-color:#93c5fd!important;background:#eff6ff!important;color:#1e3a8a!important}
      @media(max-width:620px){.epmap-overlay{padding:8px;place-items:end center}.epmap{max-height:94vh;border-radius:16px 16px 8px 8px;padding:16px}.epmap__grid{grid-template-columns:1fr}.epmap__field--wide{grid-column:auto}.epmap__answers{grid-template-columns:1fr}}
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
      <div class="epmap__head"><div><h2 id="epmapTitle">${t("Χάρτης Εξάσκησης ΕΠΑΛ","EPAL Practice Map")}</h2><p>${t("Διάλεξε την πραγματική διαδρομή σου και κάνε εδώ σύντομο τεστ πάνω στην επίσημη ενότητα.","Choose your actual pathway and take a short test here based on the official unit.")}</p></div><button type="button" class="epmap__close" aria-label="${t("Κλείσιμο","Close")}">×</button></div>
      <p class="epmap__notice">${t("Εμφανίζονται μόνο ενότητες που έχουν αντιστοιχιστεί σε επίσημη πηγή 2026–27 ή στην επίσημη ύλη Πανελλαδικών ΕΠΑΛ 2027. Δεν δημιουργούνται τυχαία κεφάλαια.","Only units mapped to an official 2026–27 source or the official 2027 EPAL Panhellenic syllabus are shown. No guessed chapters are created.")}</p>
      <div class="epmap__grid">
        <label class="epmap__field"><span>1. ${t("Τάξη","Year")}</span><select id="epmapGrade"><option value="a">${t("Α΄ ΕΠΑΛ","EPAL Year 1")}</option><option value="b">${t("Β΄ ΕΠΑΛ","EPAL Year 2")}</option><option value="c">${t("Γ΄ ΕΠΑΛ","EPAL Year 3")}</option></select></label>
        <label class="epmap__field" id="epmapTrackWrap" hidden><span id="epmapTrackLabel"></span><select id="epmapTrack"></select></label>
        <label class="epmap__field epmap__field--wide"><span>3. ${t("Μάθημα","Subject")}</span><select id="epmapSubject"></select></label>
        <label class="epmap__field epmap__field--wide"><span>4. ${t("Επίσημη ενότητα","Official unit")}</span><select id="epmapTopic"></select></label>
      </div>
      <p class="epmap__source" id="epmapSource"></p>
      <div class="epmap__actions"><button class="epmap__go" id="epmapGo" type="button" aria-disabled="true">${t("Δημιούργησε σύντομο τεστ","Create short test")}</button><p class="epmap__hint">${t("3 ερωτήσεις · 2 επιλογές. Δημιουργείται μόνο για την επίσημη ενότητα που επέλεξες και αποθηκεύεται σε αυτόν τον browser.","3 questions · 2 choices. It is created only for the official unit you selected and saved in this browser.")}</p></div><p class="epmap__status" id="epmapStatus" aria-live="polite"></p><div class="epmap__quiz" id="epmapQuiz" hidden></div>
    </section>`;
    document.body.appendChild(wrap);
    wrap.querySelector(".epmap__close").addEventListener("click",close);
    wrap.addEventListener("click",e=>{if(e.target===wrap)close();});
    wrap.querySelector("#epmapGrade").addEventListener("change",e=>{state.grade=e.target.value;state.sector="";state.specialty="";state.subject="";state.topic="";render();});
    wrap.querySelector("#epmapTrack").addEventListener("change",e=>{if(state.grade==="b")state.sector=e.target.value;else state.specialty=e.target.value;state.subject="";state.topic="";renderSubjects();});
    wrap.querySelector("#epmapSubject").addEventListener("change",e=>{state.subject=e.target.value;state.topic="";renderTopics();});
    wrap.querySelector("#epmapTopic").addEventListener("change",e=>{state.topic=e.target.value;renderAction();});
    wrap.querySelector("#epmapGo").addEventListener("click",generateQuiz);
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
    resetQuizView();
    if(!topic){go.setAttribute("aria-disabled","true");go.disabled=true;return;}
    go.setAttribute("aria-disabled","false");go.disabled=false;
    go.textContent=getCachedQuiz()?t("Άνοιξε το αποθηκευμένο σύντομο τεστ","Open saved short test"):t("Δημιούργησε σύντομο τεστ","Create short test");
  }

  function selection(){
    const subject=selectedSubject(),topic=verifiedTopics(subject).find(x=>x.id===state.topic)||null;
    return {subject,topic,subjectLabel:subject?.subjectLabelEl||subject?.subjectLabelEn||state.subject,topicLabel:topic?.labelEl||topic?.labelEn||state.topic,sourceUrl:topic?.sourceUrl||subject?.curriculum?.annualInstructionsUrl||subject?.curriculum?.catalogUrl||""};
  }
  function cacheId(){return [state.grade,state.sector,state.specialty,state.subject,state.topic].join("|");}
  function readCache(){try{return JSON.parse(localStorage.getItem(CACHE_KEY)||"{}")||{};}catch(_){return {};}}
  function getCachedQuiz(){return readCache()[cacheId()]||null;}
  function saveCachedQuiz(quiz){try{const cache=readCache();cache[cacheId()]={quiz,createdAt:Date.now()};const rows=Object.entries(cache).sort((a,b)=>(b[1].createdAt||0)-(a[1].createdAt||0)).slice(0,20);localStorage.setItem(CACHE_KEY,JSON.stringify(Object.fromEntries(rows)));}catch(_){} }
  function parseQuiz(raw){
    const clean=String(raw||"").trim().replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/i,"");
    const start=clean.indexOf("{"),end=clean.lastIndexOf("}");if(start<0||end<=start)throw new Error("invalid_json");
    const data=JSON.parse(clean.slice(start,end+1));
    const questions=(Array.isArray(data.questions)?data.questions:[]).map(q=>({q:String(q?.q||q?.question||"").trim().slice(0,600),options:(Array.isArray(q?.options)?q.options:[]).map(x=>String(x||"").trim().slice(0,300)).filter(Boolean).slice(0,2),correct:Number(q?.correct),explanation:String(q?.explanation||"").trim().slice(0,600)})).filter(q=>q.q&&q.options.length===2&&Number.isInteger(q.correct)&&q.correct>=0&&q.correct<2&&q.explanation).slice(0,3);
    if(questions.length!==3)throw new Error("invalid_questions");return questions;
  }
  async function generateQuiz(){
    const go=modal().querySelector("#epmapGo");if(go.disabled)return;
    const cached=getCachedQuiz();if(cached?.quiz){startQuiz(cached.quiz,true);return;}
    const c=selection();if(!c.topic)return;
    go.disabled=true;go.setAttribute("aria-disabled","true");modal().querySelector("#epmapStatus").textContent=t("Δημιουργείται το σύντομο τεστ…","Creating the short test…");
    const path=state.grade==="a"?"Α΄ ΕΠΑΛ":state.grade==="b"?`Β΄ ΕΠΑΛ · ${state.sector}`:`Γ΄ ΕΠΑΛ · ${state.specialty}`;
    const prompt=`Create exactly 3 short multiple-choice practice questions for a Greek EPAL student.\nGrade/path: ${path}\nSubject: ${c.subjectLabel}\nOfficial mapped unit: ${c.topicLabel}\nOfficial source URL: ${c.sourceUrl||"provided by the mapped site catalog"}\n\nRules:\n- Write in ${en()?"English":"Greek"}.\n- Stay strictly within the named subject and official mapped unit. Do not invent syllabus chapters, facts, quotations or statistics.\n- Use exactly 2 plausible options per question, one correct and one misconception-based distractor.\n- Make the questions age-appropriate and useful for understanding, not trick questions.\n- correct is the zero-based index 0 or 1.\n- explanation briefly explains why the answer is correct.\n- Return strict JSON only: {"questions":[{"q":"...","options":["...","..."],"correct":0,"explanation":"..."}]}\n- Return exactly 3 questions.`;
    try{
      const response=await fetch("/api/tutor-assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system:"Create accurate, curriculum-grounded EPAL learning material. Use only the selected mapped official unit and return JSON only.",prompt,audience:"high_student",task:"quiz"})});
      const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.message||"request_failed");
      const quiz=parseQuiz(data.text||"");saveCachedQuiz(quiz);startQuiz(quiz,false);
    }catch(err){modal().querySelector("#epmapStatus").textContent=t("Δεν δημιουργήθηκε έγκυρο τεστ. Δεν έγινε δεύτερη αυτόματη κλήση. Δοκίμασε ξανά αργότερα.","A valid test could not be created. No automatic second request was made. Try again later.");console.error("EPAL short quiz:",err);}
    finally{go.disabled=false;go.setAttribute("aria-disabled","false");go.textContent=getCachedQuiz()?t("Άνοιξε το αποθηκευμένο σύντομο τεστ","Open saved short test"):t("Δημιούργησε σύντομο τεστ","Create short test");}
  }
  function resetQuizView(){state.quiz=null;state.index=0;state.score=0;state.answered=false;const box=modal()?.querySelector("#epmapQuiz");if(box){box.hidden=true;box.innerHTML="";}const status=modal()?.querySelector("#epmapStatus");if(status)status.textContent="";}
  function startQuiz(quiz,cached){state.quiz=quiz;state.index=0;state.score=0;state.answered=false;modal().querySelector("#epmapStatus").textContent=cached?t("Το τεστ φορτώθηκε από αυτόν τον browser, χωρίς νέα χρήση AI.","The test was loaded from this browser with no new AI usage."):t("Το σύντομο τεστ είναι έτοιμο.","The short test is ready.");modal().querySelector("#epmapQuiz").hidden=false;renderQuestion();}
  function renderQuestion(){
    const box=modal().querySelector("#epmapQuiz"),q=state.quiz[state.index];state.answered=false;
    box.innerHTML=`<div class="epmap__progress">${t("Ερώτηση","Question")} ${state.index+1} / 3 · ${esc(selection().subjectLabel)}</div><h3 class="epmap__question">${esc(q.q)}</h3><div class="epmap__answers">${q.options.map((o,i)=>`<button type="button" class="epmap__answer" data-answer="${i}">${esc(o)}</button>`).join("")}</div><div class="epmap__feedback" hidden></div><button type="button" class="epmap__next" hidden>${state.index===2?t("Δες αποτέλεσμα","See result"):t("Επόμενη","Next")}</button>`;
    box.querySelectorAll(".epmap__answer").forEach(b=>b.addEventListener("click",()=>answer(Number(b.dataset.answer))));box.querySelector(".epmap__next").addEventListener("click",()=>{if(state.index<2){state.index++;renderQuestion();}else renderResult();});
  }
  function answer(i){if(state.answered)return;state.answered=true;const q=state.quiz[state.index];if(i===q.correct)state.score++;modal().querySelectorAll(".epmap__answer").forEach(b=>{const n=Number(b.dataset.answer);b.disabled=true;if(n===q.correct)b.classList.add("is-correct");else if(n===i)b.classList.add("is-wrong");});const f=modal().querySelector(".epmap__feedback");f.hidden=false;f.textContent=q.explanation;modal().querySelector(".epmap__next").hidden=false;}
  function subjectToolIds(){
    const c=selection(),hay=`${state.subject} ${c.subjectLabel}`.toLowerCase();
    if(/μαθημ|άλγεβ|γεωμετρ|φυσικ|μηχαν|ηλεκτρ|θερμο|τοπογραφ|math|phys|engineer/.test(hay))return ["geogebra","wolfram-alpha","photomath"];
    if(/προγραμμα|πληροφορ|δίκτυ|υπολογισ|βάσ.*δεδο|program|network|computer|database/.test(hay))return ["replit-ai","github-copilot","quizlet"];
    if(/αγγλικ|γλώσσ|έκθεσ|λογοτεχν|english|language/.test(hay))return ["reading-coach","grammarly","quizlet"];
    if(/σχέδι|γραφ|τέχν|διακόσμ|ένδυ|design|art/.test(hay))return ["canva-magic","autodraw","mindmup"];
    return ["quizlet","notebooklm","mindmup"];
  }
  function renderResult(){
    const box=modal().querySelector("#epmapQuiz"),ids=subjectToolIds().filter(id=>typeof TOOLS!=="undefined"&&TOOLS[id]).slice(0,3);
    const tools=ids.map(id=>{const tool=TOOLS[id],desc=(en()?tool.shortDescEn:tool.shortDescEl)||"";return `<a class="epmap__tool" href="/tools/${esc(id)}.html" target="_blank" rel="noopener noreferrer">${esc(tool.name)}${desc?`<small>${esc(desc)}</small>`:""}</a>`;}).join("");
    box.innerHTML=`<div class="epmap__result"><div class="epmap__score">${state.score}/3</div><h3>${state.score===3?t("Πολύ καλή βάση","Very good foundation"):t("Επόμενο βήμα: λίγη στοχευμένη εξάσκηση","Next step: a little focused practice")}</h3><p>${t("Το αποτέλεσμα αφορά μόνο τη συγκεκριμένη επίσημη ενότητα· δεν είναι βαθμός ούτε πλήρης έλεγχος της ύλης.","The result concerns only this official unit; it is not a grade or a complete syllabus assessment.")}</p>${tools?`<section class="epmap__tools"><h4>${t("🧰 Προτεινόμενα εργαλεία","🧰 Recommended tools")}</h4>${tools}</section>`:""}<button type="button" class="epmap__next" id="epmapRetake">${t("Ξανακάνε το σύντομο τεστ","Retake short test")}</button></div>`;
    box.querySelector("#epmapRetake").addEventListener("click",()=>startQuiz(state.quiz,true));
  }

  function render(){modal().querySelector("#epmapGrade").value=state.grade;renderTrack();renderSubjects();}
  function open(e){
    if(!catalog()){console.error("EPAL student catalog is unavailable");return;}
    lastFocus=e?.currentTarget||document.activeElement;const m=createModal();m.hidden=false;document.body.style.overflow="hidden";
    Object.assign(state,{grade:"a",sector:"",specialty:"",subject:"",topic:"",quiz:null,index:0,score:0,answered:false});render();m.querySelector(".epmap__close").focus();
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
  window.AITOOLSKIDS_EPAL_PRACTICE_MAP=Object.freeze({version:2,questionsPerSession:3,choicesPerQuestion:2,inlineQuiz:true,open:()=>open(null),close});
})();
