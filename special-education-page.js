(function(){
  "use strict";
  const C=window.SPECIAL_EDUCATION_CURRICULUM;
  const L=window.SPECIAL_EDUCATION_LEARNING;
  const Q=window.SPECIAL_EDUCATION_QUIZZES;
  const S=window.SPECIAL_EDUCATION_STATUS;
  const SG=window.SPECIAL_GYMNASIUM_2026_2027;
  const home=document.getElementById("spHome");
  const sg=document.getElementById("spSpecialGymnasium");
  const en=document.getElementById("spEneegyl");
  const unitMount=document.getElementById("spUnitMount");
  const sgProfile=document.getElementById("spSpecialGymProfile");
  const sgUnitMount=document.getElementById("spSpecialGymUnitMount");
  const sourceIndex=document.getElementById("spSourceIndex");
  const progressMount=document.getElementById("spProgressMount");
  const branchButtons=[...document.querySelectorAll(".sp-branch")];
  const backButtons=[...document.querySelectorAll(".sp-back")];

  function esc(v){
    return String(v??"").replace(/[&<>"']/g,function(ch){
      if(ch==="&") return "&amp;";
      if(ch==="<") return "&lt;";
      if(ch===">") return "&gt;";
      if(ch==='"') return "&quot;";
      return "&#39;";
    });
  }

  function showBranch(id){
    home.hidden=true;
    sg.hidden=id!=="special-gymnasium";
    en.hidden=id!=="eneegyl";
    branchButtons.forEach(b=>b.classList.toggle("active",b.dataset.branch===id));
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function showHome(){
    home.hidden=false;
    sg.hidden=true;
    en.hidden=true;
    unitMount.innerHTML="";
    if(sgUnitMount) sgUnitMount.innerHTML="";
    branchButtons.forEach(b=>b.classList.remove("active"));
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function badge(status){
    if(status==="verified") return '<span class="sp-badge good">Επαληθευμένο</span>';
    if(status==="source-indexed"||status==="indexed") return '<span class="sp-badge indexed">Επίσημη πηγή εντοπίστηκε</span>';
    return '<span class="sp-badge pending">Σε αναμονή χαρτογράφησης</span>';
  }

  function coverageBadge(entry){
    if(entry?.coverageStatus==="partial") return '<span class="sp-badge partial">Επαληθευμένη μερική κάλυψη</span>';
    if(entry?.coverageStatus==="pilot") return '<span class="sp-badge pending">Πιλοτική κάλυψη</span>';
    if(entry?.coverageStatus==="support-skill") return '<span class="sp-badge indexed">Δεξιότητα υποστήριξης · όχι δήλωση ύλης</span>';
    return "";
  }

  function sourceCurriculumIds(item){
    if(Array.isArray(item.curriculumIds)) return item.curriculumIds;
    return item.curriculumId ? [item.curriculumId] : [];
  }

  function renderSourceIndex(){
    sourceIndex.innerHTML=C.sourceIndex.map(item=>{
      const available=sourceCurriculumIds(item)
        .map(id=>C.entries[id])
        .filter(entry=>entry?.status==="verified");
      const actions=available.length
        ? `<div class="sp-source-actions">${available.map(entry=>`<button type="button" class="sp-btn primary" data-open-unit="${esc(entry.id)}"><span>${esc(entry.gradeLabel)}</span><strong>${esc(entry.subject)}</strong></button>`).join("")}</div>`
        : "";
      return `<article class="sp-source-card ${available.length?"available":""}">
        <strong>${esc(item.order)}. ${esc(item.title)}</strong>
        <small>${item.firstGradeSubject?`Α΄ τάξη: ${esc(item.firstGradeSubject)}`:"Αφορά Β΄-Δ΄ τάξεις του τομέα"}</small>
        ${badge(item.status)}
        ${available.length?`<div class="sp-source-ready">${available.length} διαθέσιμη ${available.length===1?"ενότητα":"ενότητες"}</div>`:""}
        ${actions}
      </article>`;
    }).join("");
  }

  function renderSpecialGymProfile(){
    if(!sgProfile || !SG) return;
    const ready=["special-gym-a-language-comprehension","special-gym-a-math-problem-reading"]
      .map(id=>C.entries[id]).filter(Boolean);
    const grades=Object.entries(SG.grades||{}).map(([id,grade],index)=>{
      const rows=(grade.subjects||[]).map(row=>`<li><span>${esc(row.label)}</span><strong>${esc(row.hours)} ${row.hours===1?"ώρα":"ώρες"}</strong></li>`).join("");
      return `<details class="sp-step" ${index===0?"open":""}><summary><span class="sp-num">${index+1}</span>${esc(grade.label)} · ${esc(grade.totalHours)} ώρες/εβδομάδα</summary><div class="sp-step__body"><ul class="sp-check">${rows}</ul></div></details>`;
    }).join("");
    const preliminary=(SG.preliminary?.subjects||[]).map(row=>`<li><span>${esc(row.label)}</span><strong>${esc(row.hours)} ${row.hours===1?"ώρα":"ώρες"}</strong></li>`).join("");
    sgProfile.innerHTML=`
      <div class="sp-source-strip"><span>${esc(SG.timetableReference)}</span><span>Έλεγχος: ${esc(SG.verificationDate)}</span><a href="${esc(SG.timetableSourceUrl)}" target="_blank" rel="noopener">Επίσημο ωρολόγιο PDF ↗</a><a href="${esc(SG.adaptationResources?.hub||"")}" target="_blank" rel="noopener">Υλικό προσαρμογών ΙΕΠ/Prosvasimo ↗</a></div>
      <div class="sp-warning">${esc(SG.scopeNote)}</div>
      <div class="sp-source-actions">${ready.map(entry=>`<button type="button" class="sp-btn primary" data-open-sg-unit="${esc(entry.id)}"><span>${esc(entry.gradeLabel)}</span><strong>${esc(entry.subject)}</strong></button>`).join("")}</div>
      <h3 class="sp-heading">Επίσημο ωρολόγιο ανά τάξη</h3>
      ${grades}
      <details class="sp-step"><summary><span class="sp-num">Π</span>${esc(SG.preliminary?.label||"Προκαταρκτική τάξη")} · ${esc(SG.preliminary?.totalHours||"")} ώρες/εβδομάδα</summary><div class="sp-step__body"><p class="sp-lead">Η Προκαταρκτική εμφανίζεται εδώ για πληρότητα της επίσημης δομής. Δεν προστίθεται αυτή τη στιγμή ως ξεχωριστή μαθητική ηλικιακή ροή στο Puter Tutor.</p><ul class="sp-check">${preliminary}</ul></div></details>
      <div class="sp-info"><strong>AI chat</strong><p>Στο Ειδικό Γυμνάσιο μπορείς να επιλέξεις Α΄, Β΄ ή Γ΄ και όλα τα παραπάνω μαθήματα. Στα μαθήματα χωρίς ξεχωριστά χαρτογραφημένη ενότητα, γράψε το πραγματικό κεφάλαιο, κείμενο ή άσκηση. Το AI έχει οδηγία να μη δημιουργεί μόνο του «επίσημη ύλη».</p></div>`;
  }

  function renderProgress(){
    const label={verified:"✓",indexed:"●",pending:"○"};
    progressMount.innerHTML=`<details class="sp-progress"><summary>Πρόοδος επαλήθευσης και περιεχομένου</summary>
      <div style="margin-top:8px;color:#64748b;font-size:.8rem;line-height:1.5">✓ επαληθευμένο · ● επίσημη πηγή εντοπίστηκε/δομή διαθέσιμη αλλά όχι πλήρης μαθησιακή χαρτογράφηση · ○ σε αναμονή</div>
      <table class="sp-progress-table"><thead><tr><th>Σχολείο / ενότητα</th><th>Ύλη</th><th>Μάθηση</th><th>Quiz</th><th>AI context</th></tr></thead><tbody>
      ${S.rows.map(r=>`<tr><td><strong>${esc(r.school)}</strong><br>${esc(r.scope)}</td>${[r.curriculum,r.learning,r.quiz,r.tutorContext].map(x=>`<td><span class="sp-status-dot ${esc(x)}">${label[x]||"○"}</span></td>`).join("")}</tr>`).join("")}
      </tbody></table></details>`;
  }

  function basisExplanation(c){
    if(c.verificationBasis==="current-exam-syllabus") return "Τα παρακάτω σημεία ελέγχθηκαν στην επίσημη εξεταστέα ύλη 2026-2027. Η μαθησιακή παρουσίαση περιορίζεται σκόπιμα μόνο σε αυτό το επαληθευμένο τμήμα.";
    if(c.verificationBasis==="official-timetable-plus-eae-adaptation") return "Επαληθεύτηκαν το μάθημα στο ωρολόγιο Γυμνασίου Ε.Α.Ε. 2026-2027 και η ύπαρξη επίσημου υποστηρικτικού υλικού προσαρμογών ΙΕΠ/Prosvasimo. Η ενότητα που ακολουθεί είναι δεξιότητα μελέτης, όχι κατάλογος της φετινής διδακτέας ύλης.";
    return "Ελέγχθηκε η επίσημη εγκύκλιος του Υπουργείου. Δεν θεωρούμε ένα topic anchor από μόνο του απόδειξη εξεταστέας ύλης.";
  }

  function renderUnit(id,target=unitMount){
    const c=C.entries[id], l=L[id], q=Q[id];
    if(!target) return;
    if(!c || c.status!=="verified" || !l){
      target.innerHTML='<div class="sp-pending-box"><strong>Η ενότητα δεν είναι ακόμη έτοιμη.</strong></div>';
      return;
    }
    const primarySourceLabel=c.verificationBasis==="current-exam-syllabus" ? "Επίσημη εξεταστέα ύλη ↗" : c.verificationBasis==="official-timetable-plus-eae-adaptation" ? "Επίσημο ωρολόγιο 2026-27 ↗" : "Επίσημη πηγή ↗";
    const instructionLink=c.instructionSourceUrl
      ? `<a href="${esc(c.instructionSourceUrl)}" target="_blank" rel="noopener">Επίσημη σελίδα πλαισίου ↗</a>`
      : "";
    const adaptationLink=c.adaptationSourceUrl
      ? `<a href="${esc(c.adaptationSourceUrl)}" target="_blank" rel="noopener">Υλικό προσαρμογών ΙΕΠ/Prosvasimo ↗</a>`
      : "";
    const verificationNote=c.verificationNote
      ? `<div class="sp-warning">${esc(c.verificationNote)}</div>`
      : `<div class="sp-warning">${esc(C.disclaimer)}</div>`;

    target.innerHTML=`<article class="sp-unit">
      <header class="sp-unit__header"><div><span class="sp-kicker">${esc(c.gradeLabel)} · ${esc(c.subjectType)}</span><h3>${esc(c.subject)}</h3>${c.sector?`<div class="sp-unit-sector">Τομέας: ${esc(c.sector)}</div>`:""}</div><div class="sp-meta">${badge(c.status)}${coverageBadge(c)}</div></header>
      <div class="sp-source-strip"><span>Έλεγχος πηγής: ${esc(c.verificationDate)}</span><span>${esc(c.protocol)}</span><a href="${esc(c.sourceUrl)}" target="_blank" rel="noopener">${primarySourceLabel}</a>${c.sourcePdfUrl?`<a href="${esc(c.sourcePdfUrl)}" target="_blank" rel="noopener">Εγκύκλιος PDF ↗</a>`:""}${instructionLink}${adaptationLink}</div>
      <details class="sp-step" open><summary><span class="sp-num">1</span>Επίσημη βάση</summary><div class="sp-step__body"><div class="sp-info"><strong>Τι σημαίνει «επαληθευμένο» εδώ</strong><p>${esc(basisExplanation(c))}</p></div><h4>Σημεία αναφοράς από την επίσημη πηγή</h4><ul>${c.officialAnchors.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>${verificationNote}</div></details>
      <details class="sp-step" open><summary><span class="sp-num">2</span>Μαθαίνω απλά</summary><div class="sp-step__body"><p class="sp-lead">${esc(l.learnSimply.lead)}</p><h4>Τι να θυμάμαι</h4><ul class="sp-check">${l.learnSimply.keyPoints.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div></details>
      <details class="sp-step"><summary><span class="sp-num">3</span>Ερωτήσεις & Απαντήσεις</summary><div class="sp-step__body">${l.qa.map(x=>`<div class="sp-qa"><strong>${esc(x.q)}</strong><p>${esc(x.a)}</p></div>`).join("")}</div></details>
      <details class="sp-step parent"><summary><span class="sp-num">4</span>Μελετάμε μαζί</summary><div class="sp-step__body"><p class="sp-lead"><strong>Για γονιό/φροντιστή:</strong> ${esc(l.parentStudy.intro)}</p><ol>${l.parentStudy.steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div></details>
      <details class="sp-step"><summary><span class="sp-num">5</span>Εξάσκηση</summary><div class="sp-step__body"><div class="sp-practice">${l.practice.map((x,i)=>`<div class="sp-practice-item"><b>${i+1}</b><p>${esc(x)}</p></div>`).join("")}</div></div></details>
      <details class="sp-step"><summary><span class="sp-num">6</span>Διαγνωστικό</summary><div class="sp-step__body"><div class="spQuiz"></div></div></details>
    </article>`;
    renderQuiz(q,target);
    target.scrollIntoView({behavior:"smooth",block:"start"});
  }

  function renderQuiz(quiz,target){
    const mount=target?.querySelector(".spQuiz");
    if(!mount || !quiz) return;
    mount.innerHTML=`<h4>${esc(quiz.title)}</h4><p>${esc(quiz.intro)}</p><button class="sp-btn primary" type="button" data-sp-quiz-start>Ξεκίνα τις ${quiz.questions.length} ερωτήσεις</button>`;
    let idx=0,score=0,locked=false;
    const start=()=>{idx=0;score=0;locked=false;renderQ();};
    const renderQ=()=>{
      const x=quiz.questions[idx];
      mount.innerHTML=`<div style="font-size:.76rem;font-weight:800;color:#64748B;margin-bottom:7px">Ερώτηση ${idx+1} από ${quiz.questions.length}</div><h4>${esc(x.q)}</h4><div class="sp-quiz-options">${x.options.map((t,i)=>`<button class="sp-option" type="button" data-i="${i}">${esc(t)}</button>`).join("")}</div><div class="sp-feedback" aria-live="polite"></div>`;
      mount.querySelectorAll(".sp-option").forEach(b=>b.addEventListener("click",()=>answer(Number(b.dataset.i))));
    };
    const answer=(i)=>{
      if(locked) return;
      locked=true;
      const x=quiz.questions[idx];
      if(i===x.correctIndex) score++;
      const opts=[...mount.querySelectorAll(".sp-option")];
      opts.forEach((b,n)=>{b.disabled=true;if(n===x.correctIndex)b.classList.add("correct");if(n===i&&n!==x.correctIndex)b.classList.add("wrong")});
      const f=mount.querySelector(".sp-feedback");
      const last=idx===quiz.questions.length-1;
      f.innerHTML=`<p style="color:${i===x.correctIndex?"#176B43":"#8B4A4A"}">${i===x.correctIndex?"Σωστά.":"Όχι αυτή τη φορά."}</p><button class="sp-btn" type="button" data-sp-next>${last?"Δες αποτέλεσμα":"Επόμενη ερώτηση"}</button>`;
      mount.querySelector("[data-sp-next]").onclick=()=>{if(last)result();else{idx++;locked=false;renderQ();}};
    };
    const result=()=>{
      const strong=score>=Math.ceil(quiz.questions.length*.66);
      const message=strong
        ? (quiz.successMessage||"Έπιασες τη βασική λογική. Συνέχισε με την εξάσκηση.")
        : (quiz.retryMessage||"Χρειάζεται μια μικρή επανάληψη. Άνοιξε ξανά τα «Τι να θυμάμαι» και ξαναδοκίμασε.");
      mount.innerHTML=`<div class="sp-score">${score}/${quiz.questions.length}</div><p>${esc(message)}</p><button class="sp-btn" type="button" data-sp-retry>Ξαναδοκίμασε</button>`;
      mount.querySelector("[data-sp-retry]").onclick=start;
    };
    mount.querySelector("[data-sp-quiz-start]").addEventListener("click",start);
  }

  branchButtons.forEach(b=>b.addEventListener("click",()=>showBranch(b.dataset.branch)));
  backButtons.forEach(b=>b.addEventListener("click",showHome));
  sourceIndex.addEventListener("click",e=>{
    const b=e.target.closest("[data-open-unit]");
    if(b) renderUnit(b.dataset.openUnit,unitMount);
  });
  sgProfile?.addEventListener("click",e=>{
    const b=e.target.closest("[data-open-sg-unit]");
    if(b) renderUnit(b.dataset.openSgUnit,sgUnitMount);
  });
  renderSourceIndex();
  renderSpecialGymProfile();
  renderProgress();
})();