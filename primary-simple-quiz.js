/* Optional simplified diagnostic mode for A-B Primary.
 * Keeps the normal Learning Compass untouched: this layer opens in a modal,
 * reuses the same quiz questions/gap tags, limits the session to 3 questions
 * and presents only 2 clear choices.
 */
(function(){
  "use strict";

  let selectedGrade="";
  let lastFocus=null;
  const MODAL_ID="primarySimpleQuizModal";
  const STYLE_ID="primarySimpleQuizStyles";
  const EARLY_GRADES=new Set(["a","b"]);

  function isEnglish(){
    return !!document.getElementById("langEn")?.classList.contains("active");
  }
  function text(el,en){ return isEnglish()?en:el; }
  function routeIsPrimary(){
    return location.pathname.split("/").filter(Boolean)[0]==="primary";
  }
  function escapeHtml(value){
    return String(value??"").replace(/[&<>\"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  }

  function injectStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const style=document.createElement("style");
    style.id=STYLE_ID;
    style.textContent=`
      .primary-simple-start{margin-top:8px;width:100%;min-height:42px;border:1px solid #8bc7ae;border-radius:10px;background:#f0fdf7;color:#176b55;font:inherit;font-weight:800;cursor:pointer}
      .primary-simple-start:hover{background:#e6f8ef}
      .primary-simple-start small{display:block;margin-top:2px;font-size:.72rem;font-weight:650;color:#4b7668}
      .psq-overlay[hidden]{display:none!important}.psq-overlay{position:fixed;inset:0;z-index:10020;display:grid;place-items:center;padding:18px;background:rgba(15,23,42,.56)}
      .psq{width:min(650px,100%);max-height:min(90vh,820px);overflow:auto;background:#fff;border-radius:18px;padding:20px;box-shadow:0 24px 70px rgba(15,23,42,.25);color:#1e293b}
      .psq__head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.psq__head h2{margin:0;font-size:1.18rem}.psq__head p{margin:5px 0 0;color:#64748b;font-size:.84rem;line-height:1.5}
      .psq__close{flex:0 0 auto;width:38px;height:38px;border:0;border-radius:9px;background:#f1f5f9;font-size:1.2rem;cursor:pointer}
      .psq__progress{margin:18px 0 5px;color:#64748b;font-size:.8rem;font-weight:750}.psq__question{margin:0 0 14px;font-size:1.08rem;line-height:1.5}
      .psq__answers{display:grid;grid-template-columns:1fr 1fr;gap:10px}.psq__answer{min-height:58px;padding:12px;border:1px solid #cbd5e1;border-radius:12px;background:#fff;color:#1e293b;font:inherit;font-weight:750;cursor:pointer;text-align:left}.psq__answer:hover{border-color:#69a990;background:#f8fffb}
      .psq__answer.is-correct{border-color:#15803d;background:#f0fdf4}.psq__answer.is-wrong{border-color:#b91c1c;background:#fef2f2}.psq__answer:disabled{cursor:default}
      .psq__feedback{margin:12px 0 0;padding:10px 12px;border-radius:10px;background:#f8fafc;color:#475569;font-size:.86rem;line-height:1.5}
      .psq__next{width:100%;min-height:44px;margin-top:12px;border:0;border-radius:10px;background:#2e6f5e;color:#fff;font:inherit;font-weight:800;cursor:pointer}
      .psq__result h3{margin:17px 0 7px}.psq__score{font-size:2rem;font-weight:900;color:#245c4e}.psq__gap{margin:9px 0;padding:11px 12px;border:1px solid #dbeafe;border-radius:10px;background:#f8fbff}.psq__gap strong{display:block;margin-bottom:3px}.psq__gap p{margin:0;color:#475569;font-size:.84rem;line-height:1.5}
      .psq__actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:16px}.psq__actions button{min-height:42px;padding:9px 12px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;color:#334155;font:inherit;font-weight:750;cursor:pointer}.psq__actions .psq__regular{background:#2e6f5e;color:#fff;border-color:#2e6f5e}
      @media(max-width:620px){.psq-overlay{padding:8px;place-items:end center}.psq{max-height:92vh;border-radius:16px 16px 8px 8px;padding:16px}.psq__answers{grid-template-columns:1fr}.psq__answer{min-height:54px}.psq__actions{display:grid}.psq__actions button{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function questionScore(q){
    const options=Array.isArray(q?.options)?q.options:[];
    const hasDiagnosticWrong=options.some((o)=>!o?.isCorrect && o?.gapTag);
    const wording=(isEnglish()?q?.textEn:q?.textEl)||q?.textEl||q?.textEn||"";
    return (hasDiagnosticWrong?0:10000)+wording.length;
  }

  function getSimpleQuestions(quiz){
    return (quiz?.questions||[])
      .filter((q)=>Array.isArray(q?.options) && q.options.some((o)=>o?.isCorrect) && q.options.some((o)=>!o?.isCorrect))
      .map((q,index)=>({q,index,score:questionScore(q)}))
      .sort((a,b)=>a.score-b.score || a.index-b.index)
      .slice(0,3)
      .map((x)=>x.q);
  }

  function getTwoChoices(question,index){
    const options=question.options||[];
    const correct=options.find((o)=>o?.isCorrect);
    const wrongs=options.filter((o)=>!o?.isCorrect);
    wrongs.sort((a,b)=>{
      const ap=a?.gapTag?0:1,bp=b?.gapTag?0:1;
      const at=((isEnglish()?a?.textEn:a?.textEl)||a?.textEl||a?.textEn||"").length;
      const bt=((isEnglish()?b?.textEn:b?.textEl)||b?.textEl||b?.textEn||"").length;
      return ap-bp || at-bt;
    });
    const wrong=wrongs[0];
    if(!correct||!wrong) return [];
    return index%2===0?[correct,wrong]:[wrong,correct];
  }

  function getQuiz(subjectId){
    if(typeof QUIZZES==="undefined") return null;
    return QUIZZES?.primary?.[subjectId]||null;
  }

  function createModal(){
    let overlay=document.getElementById(MODAL_ID);
    if(overlay) return overlay;
    injectStyles();
    overlay=document.createElement("div");
    overlay.id=MODAL_ID;
    overlay.className="psq-overlay";
    overlay.hidden=true;
    overlay.innerHTML=`<section class="psq" role="dialog" aria-modal="true" aria-labelledby="psqTitle"><div class="psq__head"><div><h2 id="psqTitle"></h2><p id="psqSubtitle"></p></div><button type="button" class="psq__close" aria-label="Κλείσιμο">×</button></div><div id="psqBody"></div></section>`;
    document.body.appendChild(overlay);
    overlay.querySelector(".psq__close").addEventListener("click",closeModal);
    overlay.addEventListener("click",(event)=>{ if(event.target===overlay) closeModal(); });
    return overlay;
  }

  let session=null;
  function openSimpleQuiz(subjectId,trigger){
    const quiz=getQuiz(subjectId);
    if(!quiz) return;
    const questions=getSimpleQuestions(quiz);
    if(!questions.length) return;
    lastFocus=trigger||document.activeElement;
    session={subjectId,quiz,questions,index:0,score:0,gaps:[],answered:false};
    const modal=createModal();
    modal.hidden=false;
    document.body.style.overflow="hidden";
    modal.querySelector("#psqTitle").textContent=text("Απλή εκδοχή διαγνωστικού","Simple diagnostic mode");
    modal.querySelector("#psqSubtitle").textContent=text("3 σύντομες ερωτήσεις · 2 επιλογές · μία ιδέα τη φορά","3 short questions · 2 choices · one idea at a time");
    modal.querySelector(".psq__close").setAttribute("aria-label",text("Κλείσιμο","Close"));
    renderQuestion();
    modal.querySelector(".psq__close").focus();
  }

  function closeModal(){
    const modal=document.getElementById(MODAL_ID);
    if(!modal) return;
    modal.hidden=true;
    document.body.style.overflow="";
    session=null;
    lastFocus?.focus?.();
  }

  function optionText(option){ return (isEnglish()?option?.textEn:option?.textEl)||option?.textEl||option?.textEn||""; }
  function questionText(question){ return (isEnglish()?question?.textEn:question?.textEl)||question?.textEl||question?.textEn||""; }

  function renderQuestion(){
    if(!session) return;
    const body=document.getElementById(MODAL_ID)?.querySelector("#psqBody");
    const q=session.questions[session.index];
    const choices=getTwoChoices(q,session.index);
    const current=session.index+1,total=session.questions.length;
    body.innerHTML=`<div class="psq__progress">${text("Ερώτηση","Question")} ${current} ${text("από","of")} ${total}</div><h3 class="psq__question">${escapeHtml(questionText(q))}</h3><div class="psq__answers">${choices.map((o,i)=>`<button type="button" class="psq__answer" data-choice="${i}">${escapeHtml(optionText(o))}</button>`).join("")}</div><div class="psq__feedback" hidden></div><button type="button" class="psq__next" hidden>${current===total?text("Δες αποτέλεσμα","See result"):text("Επόμενη ερώτηση","Next question")}</button>`;
    body.querySelectorAll(".psq__answer").forEach((button)=>button.addEventListener("click",()=>answerQuestion(button,choices[Number(button.dataset.choice)],q)));
    body.querySelector(".psq__next").addEventListener("click",()=>{
      if(session.index<session.questions.length-1){session.index+=1;session.answered=false;renderQuestion();}
      else renderResult();
    });
  }

  function answerQuestion(button,choice,question){
    if(!session||session.answered) return;
    session.answered=true;
    const body=button.closest("#psqBody");
    const buttons=[...body.querySelectorAll(".psq__answer")];
    buttons.forEach((b)=>b.disabled=true);
    if(choice?.isCorrect){session.score+=1;button.classList.add("is-correct");}
    else{
      button.classList.add("is-wrong");
      if(choice?.gapTag) session.gaps.push(choice.gapTag);
      buttons.forEach((b)=>{
        const idx=Number(b.dataset.choice);
        const choices=getTwoChoices(question,session.index);
        if(choices[idx]?.isCorrect) b.classList.add("is-correct");
      });
    }
    const feedback=body.querySelector(".psq__feedback");
    feedback.hidden=false;
    feedback.textContent=choice?.isCorrect
      ? text("Σωστά. Προχώρα στην επόμενη μικρή ερώτηση.","Correct. Move on to the next short question.")
      : text("Δεν πειράζει. Σημειώνουμε μόνο το σημείο που θέλει λίγη εξάσκηση.","That's okay. We only note the point that could use a little practice.");
    body.querySelector(".psq__next").hidden=false;
  }

  function renderResult(){
    if(!session) return;
    const body=document.getElementById(MODAL_ID)?.querySelector("#psqBody");
    const uniqueGaps=[...new Set(session.gaps.filter(Boolean))];
    const gapHtml=uniqueGaps.map((id)=>{
      const gap=typeof GAP_TAGS!=="undefined"?GAP_TAGS[id]:null;
      if(!gap) return "";
      const label=(isEnglish()?gap.labelEn:gap.labelEl)||gap.labelEl||id;
      const explain=(isEnglish()?gap.explainEn:gap.explainEl)||gap.explainEl||"";
      return `<div class="psq__gap"><strong>${escapeHtml(label)}</strong><p>${escapeHtml(explain)}</p></div>`;
    }).join("");
    const allGood=!uniqueGaps.length && session.score===session.questions.length;
    body.innerHTML=`<div class="psq__result"><div class="psq__score">${session.score}/${session.questions.length}</div><h3>${allGood?text("Δεν φάνηκε συγκεκριμένο σημείο δυσκολίας","No specific difficulty showed up"):text("Σημεία για λίγη εξάσκηση","A few points to practise")}</h3><p>${allGood?text("Αυτό είναι ένα πολύ μικρό check, όχι βαθμός και όχι διάγνωση.","This is a very small check, not a grade and not a diagnosis."):text("Το αποτέλεσμα δείχνει μόνο πού αξίζει να γίνει λίγη ακόμη εξάσκηση. Δεν είναι βαθμός ούτε διάγνωση.","The result only shows where a little more practice may help. It is not a grade or diagnosis.")}</p>${gapHtml}<div class="psq__actions"><button type="button" class="psq__regular">${text("Κάνε το κανονικό τεστ","Take the regular test")}</button><button type="button" class="psq__again">${text("Ξανά την απλή εκδοχή","Retake simple mode")}</button><button type="button" class="psq__done">${text("Κλείσιμο","Close")}</button></div></div>`;
    body.querySelector(".psq__done").addEventListener("click",closeModal);
    body.querySelector(".psq__again").addEventListener("click",()=>openSimpleQuiz(session.subjectId,lastFocus));
    body.querySelector(".psq__regular").addEventListener("click",()=>{
      const subjectId=session.subjectId;
      closeModal();
      document.querySelector(`.quiz-start-btn[data-subject-id="${CSS.escape(subjectId)}"]`)?.click();
    });
  }

  function enhanceSubjectPicker(){
    if(!routeIsPrimary()||!EARLY_GRADES.has(selectedGrade)) return;
    const root=document.getElementById("quizContent");
    if(!root) return;
    root.querySelectorAll(".quiz-start-btn[data-subject-id]").forEach((start)=>{
      const subjectId=start.dataset.subjectId;
      if(start.parentElement?.querySelector(`.primary-simple-start[data-subject-id="${CSS.escape(subjectId)}"]`)) return;
      const quiz=getQuiz(subjectId);
      if(!quiz||(quiz.grades||[]).indexOf(selectedGrade)<0||getSimpleQuestions(quiz).length<1) return;
      const button=document.createElement("button");
      button.type="button";
      button.className="primary-simple-start";
      button.dataset.subjectId=subjectId;
      button.innerHTML=`${text("Απλή εκδοχή","Simple mode")}<small>${text("3 ερωτήσεις · 2 επιλογές","3 questions · 2 choices")}</small>`;
      button.addEventListener("click",()=>openSimpleQuiz(subjectId,button));
      start.insertAdjacentElement("afterend",button);
    });
  }

  function scheduleEnhance(){ setTimeout(enhanceSubjectPicker,0); }

  function ensureHomepageSpecialEducationLink(){
    const actions=document.querySelector(".hero__ai-help-actions");
    if(!actions) return;
    let link=document.getElementById("heroHelpSpecialEducation");
    if(!link){
      link=document.createElement("a");
      link.id="heroHelpSpecialEducation";
      link.href="/special-education.html";
      actions.appendChild(link);
    }
    link.innerHTML=`<span aria-hidden="true">🏫</span><span>${text("Ειδική Εκπαίδευση","Special Education")}</span>`;
    link.setAttribute("aria-label",text("Ειδική Εκπαίδευση: επιλογή σχολείου και AI Βοήθειας","Special Education: choose school type and AI Help"));
  }

  function normalizeSpecialEducationEntries(){
    ensureHomepageSpecialEducationLink();
    const homeTitle=document.querySelector("#specialEducationHomeFeature .se-home-title");
    if(homeTitle) homeTitle.textContent=homeTitle.textContent.replace(/^\s*🎓\s*/,"🏫 ");
    ["heroHelpSpecialEducation","specialEducationDiagnosticEntry"].forEach((id)=>{
      const icon=document.getElementById(id)?.querySelector("span[aria-hidden='true']");
      if(icon) icon.textContent="🏫";
    });
  }

  document.addEventListener("click",(event)=>{
    const target=event.target instanceof Element?event.target:null;
    const grade=target?.closest?.(".quiz-grade-card[data-grade-id]");
    if(grade){selectedGrade=grade.dataset.gradeId||"";scheduleEnhance();return;}
    if(target?.closest?.("#quizBackToGradesBtn")){selectedGrade="";return;}
    if(target?.closest?.("#langEl,#langEn")){scheduleEnhance();setTimeout(normalizeSpecialEducationEntries,0);}
    if(target?.closest?.("#heroQuizCtaBtn")) setTimeout(normalizeSpecialEducationEntries,0);
    if(target?.closest?.("#viewTabQuiz,.quiz-grade-back-btn,.quiz-back-btn")) scheduleEnhance();
  },true);
  window.addEventListener("popstate",()=>{selectedGrade="";scheduleEnhance();});
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>{scheduleEnhance();normalizeSpecialEducationEntries();},{once:true});
  else{scheduleEnhance();normalizeSpecialEducationEntries();}
  window.addEventListener("load",()=>setTimeout(normalizeSpecialEducationEntries,0),{once:true});

  window.AITOOLSKIDS_PRIMARY_SIMPLE_QUIZ=Object.freeze({version:3,grades:["a","b"],questionsPerSession:3,choicesPerQuestion:2});
})();