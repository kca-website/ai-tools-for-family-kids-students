(function(){
  "use strict";
  const C=window.SPECIAL_EDUCATION_CURRICULUM;
  const L=window.SPECIAL_EDUCATION_LEARNING;
  const Q=window.SPECIAL_EDUCATION_QUIZZES;
  const S=window.SPECIAL_EDUCATION_STATUS;
  const home=document.getElementById("spHome");
  const sg=document.getElementById("spSpecialGymnasium");
  const en=document.getElementById("spEneegyl");
  const unitMount=document.getElementById("spUnitMount");
  const sourceIndex=document.getElementById("spSourceIndex");
  const progressMount=document.getElementById("spProgressMount");
  const branchButtons=[...document.querySelectorAll(".sp-branch")];
  const backButtons=[...document.querySelectorAll(".sp-back")];
  const esc=(v)=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));

  function showBranch(id){
    home.hidden=true; sg.hidden=id!=="special-gymnasium"; en.hidden=id!=="eneegyl";
    branchButtons.forEach(b=>b.classList.toggle("active",b.dataset.branch===id));
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function showHome(){
    home.hidden=false; sg.hidden=true; en.hidden=true; unitMount.innerHTML="";
    branchButtons.forEach(b=>b.classList.remove("active"));
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function badge(status){
    if(status==="verified") return '<span class="sp-badge good">Επαληθευμένο</span>';
    if(status==="source-indexed"||status==="indexed") return '<span class="sp-badge indexed">Επίσημη πηγή εντοπίστηκε</span>';
    return '<span class="sp-badge pending">Σε αναμονή χαρτογράφησης</span>';
  }

  function renderSourceIndex(){
    sourceIndex.innerHTML=C.sourceIndex.map(item=>{
      const available=item.curriculumId && C.entries[item.curriculumId]?.status==="verified";
      return `<article class="sp-source-card ${available?"available":""}">
        <strong>${esc(item.order)}. ${esc(item.title)}</strong>
        <small>${item.firstGradeSubject?`Α΄ τάξη: ${esc(item.firstGradeSubject)}`:"Αφορά Β΄-Δ΄ τάξεις του τομέα"}</small>
        ${badge(item.status)}
        ${available?`<button type="button" class="sp-btn primary" data-open-unit="${esc(item.curriculumId)}">Άνοιξε το διαθέσιμο μάθημα</button>`:""}
      </article>`;
    }).join("");
  }

  function renderProgress(){
    const label={verified:"✓",indexed:"●",pending:"○"};
    progressMount.innerHTML=`<details class="sp-progress"><summary>Πρόοδος επαλήθευσης και περιεχομένου</summary>
      <div style="margin-top:8px;color:#64748b;font-size:.8rem;line-height:1.5">✓ επαληθευμένο · ● επίσημη πηγή εντοπίστηκε αλλά δεν έχει ολοκληρωθεί η χαρτογράφηση · ○ σε αναμονή</div>
      <table class="sp-progress-table"><thead><tr><th>Σχολείο / ενότητα</th><th>Ύλη</th><th>Μάθηση</th><th>Quiz</th><th>AI context</th></tr></thead><tbody>
      ${S.rows.map(r=>`<tr><td><strong>${esc(r.school)}</strong><br>${esc(r.scope)}</td>${[r.curriculum,r.learning,r.quiz,r.tutorContext].map(x=>`<td><span class="sp-status-dot ${esc(x)}">${label[x]||"○"}</span></td>`).join("")}</tr>`).join("")}
      </tbody></table></details>`;
  }

  function renderUnit(id){
    const c=C.entries[id], l=L[id], q=Q[id];
    if(!c || c.status!=="verified" || !l){ unitMount.innerHTML='<div class="sp-pending-box"><strong>Η ενότητα δεν είναι ακόμη έτοιμη.</strong></div>'; return; }
    unitMount.innerHTML=`<article class="sp-unit">
      <header class="sp-unit__header"><div><span class="sp-kicker">${esc(c.gradeLabel)} · ${esc(c.subjectType)}</span><h3>${esc(c.subject)}</h3></div><div class="sp-meta">${badge(c.status)}<span class="sp-badge pending">Πιλοτική κάλυψη</span></div></header>
      <div class="sp-source-strip"><span>Έλεγχος πηγής: ${esc(c.verificationDate)}</span><span>${esc(c.protocol)}</span><a href="${esc(c.sourceUrl)}" target="_blank" rel="noopener">Επίσημη πηγή ↗</a>${c.sourcePdfUrl?`<a href="${esc(c.sourcePdfUrl)}" target="_blank" rel="noopener">Εγκύκλιος PDF ↗</a>`:""}</div>
      <details class="sp-step" open><summary><span class="sp-num">1</span>Επίσημη βάση</summary><div class="sp-step__body"><div class="sp-info"><strong>Τι σημαίνει «επαληθευμένο» εδώ</strong><p>Ελέγχθηκε η επίσημη εγκύκλιος του Υπουργείου. Δεν θεωρούμε ένα topic anchor από μόνο του απόδειξη εξεταστέας ύλης.</p></div><h4>Σημεία αναφοράς από τις επίσημες οδηγίες</h4><ul>${c.officialAnchors.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><div class="sp-warning">${esc(C.disclaimer)}</div></div></details>
      <details class="sp-step" open><summary><span class="sp-num">2</span>Μαθαίνω απλά</summary><div class="sp-step__body"><p class="sp-lead">${esc(l.learnSimply.lead)}</p><h4>Τι να θυμάμαι</h4><ul class="sp-check">${l.learnSimply.keyPoints.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div></details>
      <details class="sp-step"><summary><span class="sp-num">3</span>Ερωτήσεις & Απαντήσεις</summary><div class="sp-step__body">${l.qa.map(x=>`<div class="sp-qa"><strong>${esc(x.q)}</strong><p>${esc(x.a)}</p></div>`).join("")}</div></details>
      <details class="sp-step parent"><summary><span class="sp-num">4</span>Μελετάμε μαζί</summary><div class="sp-step__body"><p class="sp-lead"><strong>Για γονιό/φροντιστή:</strong> ${esc(l.parentStudy.intro)}</p><ol>${l.parentStudy.steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div></details>
      <details class="sp-step"><summary><span class="sp-num">5</span>Εξάσκηση</summary><div class="sp-step__body"><div class="sp-practice">${l.practice.map((x,i)=>`<div class="sp-practice-item"><b>${i+1}</b><p>${esc(x)}</p></div>`).join("")}</div></div></details>
      <details class="sp-step"><summary><span class="sp-num">6</span>Διαγνωστικό</summary><div class="sp-step__body"><div id="spQuiz"></div></div></details>
    </article>`;
    renderQuiz(q);
    unitMount.scrollIntoView({behavior:"smooth",block:"start"});
  }

  function renderQuiz(quiz){
    const mount=document.getElementById("spQuiz");
    if(!mount || !quiz){return;}
    mount.innerHTML=`<h4>${esc(quiz.title)}</h4><p>${esc(quiz.intro)}</p><button class="sp-btn primary" type="button" id="spQuizStart">Ξεκίνα τις ${quiz.questions.length} ερωτήσεις</button>`;
    let idx=0,score=0,locked=false;
    const start=()=>{idx=0;score=0;locked=false;renderQ();};
    const renderQ=()=>{const x=quiz.questions[idx];mount.innerHTML=`<div style="font-size:.76rem;font-weight:800;color:#64748B;margin-bottom:7px">Ερώτηση ${idx+1} από ${quiz.questions.length}</div><h4>${esc(x.q)}</h4><div class="sp-quiz-options">${x.options.map((t,i)=>`<button class="sp-option" type="button" data-i="${i}">${esc(t)}</button>`).join("")}</div><div class="sp-feedback" id="spFeedback" aria-live="polite"></div>`;mount.querySelectorAll(".sp-option").forEach(b=>b.addEventListener("click",()=>answer(Number(b.dataset.i))));};
    const answer=(i)=>{if(locked)return;locked=true;const x=quiz.questions[idx];if(i===x.correctIndex)score++;const opts=[...mount.querySelectorAll(".sp-option")];opts.forEach((b,n)=>{b.disabled=true;if(n===x.correctIndex)b.classList.add("correct");if(n===i&&n!==x.correctIndex)b.classList.add("wrong")});const f=document.getElementById("spFeedback");const last=idx===quiz.questions.length-1;f.innerHTML=`<p style="color:${i===x.correctIndex?"#176B43":"#8B4A4A"}">${i===x.correctIndex?"Σωστά.":"Όχι αυτή τη φορά."}</p><button class="sp-btn" type="button" id="spNext">${last?"Δες αποτέλεσμα":"Επόμενη ερώτηση"}</button>`;document.getElementById("spNext").onclick=()=>{if(last)result();else{idx++;locked=false;renderQ();}};};
    const result=()=>{const strong=score>=Math.ceil(quiz.questions.length*.66);mount.innerHTML=`<div class="sp-score">${score}/${quiz.questions.length}</div><p>${strong?"Έπιασες τη βασική λογική. Επόμενο βήμα: δοκίμασε την άσκηση με θέμα και 3 βήματα.":"Χρειάζεται μια μικρή επανάληψη. Άνοιξε ξανά τα «Τι να θυμάμαι» και «Ερωτήσεις & Απαντήσεις» και ξαναδοκίμασε."}</p><button class="sp-btn" type="button" id="spRetry">Ξαναδοκίμασε</button>`;document.getElementById("spRetry").onclick=start;};
    document.getElementById("spQuizStart").addEventListener("click",start);
  }

  branchButtons.forEach(b=>b.addEventListener("click",()=>showBranch(b.dataset.branch)));
  backButtons.forEach(b=>b.addEventListener("click",showHome));
  sourceIndex.addEventListener("click",e=>{const b=e.target.closest("[data-open-unit]");if(b)renderUnit(b.dataset.openUnit);});
  renderSourceIndex(); renderProgress();
})();