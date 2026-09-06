(function(){
  "use strict";

  const C=window.SPECIAL_EDUCATION_CURRICULUM;
  const L=window.SPECIAL_EDUCATION_LEARNING;
  const Q=window.SPECIAL_EDUCATION_QUIZZES;
  const SG=window.SPECIAL_GYMNASIUM_2026_2027;
  const SL=window.SPECIAL_LYCEUM_2026_2027;

  const home=document.getElementById("spHome");
  const sg=document.getElementById("spSpecialGymnasium");
  const sl=document.getElementById("spSpecialLyceum");
  const en=document.getElementById("spEneegyl");
  const sgProfile=document.getElementById("spSpecialGymProfile");
  const slProfile=document.getElementById("spSpecialLyceumProfile");
  const enProfile=document.getElementById("spEneegylProfile");
  const sgUnitMount=document.getElementById("spSpecialGymUnitMount");
  const unitMount=document.getElementById("spUnitMount");
  const branchButtons=[...document.querySelectorAll(".sp-branch")];
  const backButtons=[...document.querySelectorAll(".sp-back")];

  let selectedSpecialGymGrade="a";
  let selectedSpecialLyceumGrade="a";
  let selectedEneegylGrade=null;

  const SG_DETAILED={
    "a|language":"special-gym-a-language-comprehension",
    "a|math":"special-gym-a-math-problem-reading"
  };

  function esc(v){
    return String(v??"").replace(/[&<>"']/g,(ch)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  }

  function gradeKey(value){ return String(value||"").trim().toLowerCase(); }
  function gradeLabelFromEntry(entry){ return entry?.gradeLabel||`${String(entry?.grade||"").toUpperCase()}΄ τάξη`; }

  function aiHref(schoolType,gradeId,subjectId="",role="student"){
    const zone=schoolType==="special-gymnasium"?"middle":"high";
    const params=new URLSearchParams({schoolTrack:schoolType});
    if(gradeId) params.set("grade",gradeId);
    if(subjectId) params.set("subject",subjectId);
    return `/${zone}/${role}/tutor?${params.toString()}`;
  }

  function subjectActions({schoolType,gradeId,subjectId,learningId=null,sourceUrl="",target="sg"}){
    const hasLearning=!!(learningId&&C?.entries?.[learningId]?.status==="verified"&&L?.[learningId]?.status==="ready");
    const hasQuiz=!!(hasLearning&&Q?.[learningId]?.questions?.length);
    const studyAttr=target==="sg"?"data-open-sg-unit":"data-open-unit";
    return `<div class="sp-card-actions">
      <a class="sp-action sp-action--ai" href="${esc(aiHref(schoolType,gradeId,subjectId,"student"))}">🤖 AI Βοήθεια</a>
      <a class="sp-action" href="${esc(aiHref(schoolType,gradeId,subjectId,"guardian"))}">👪 Βοηθός γονέα</a>
      ${hasLearning?`<button class="sp-action" type="button" ${studyAttr}="${esc(learningId)}" data-focus="learn">📘 Μελέτη</button>`:""}
      ${hasQuiz?`<button class="sp-action" type="button" ${studyAttr}="${esc(learningId)}" data-focus="quiz">🧭 Μικρό τεστ</button>`:""}
      ${sourceUrl?`<a class="sp-source-link" href="${esc(sourceUrl)}" target="_blank" rel="noopener">Επίσημη πηγή ↗</a>`:""}
    </div>`;
  }

  function showBranch(id){
    home.hidden=true;
    sg.hidden=id!=="special-gymnasium";
    sl.hidden=id!=="special-lyceum";
    en.hidden=id!=="eneegyl";
    branchButtons.forEach((b)=>b.classList.toggle("active",b.dataset.branch===id));
    if(id==="special-gymnasium") renderSpecialGymProfile();
    if(id==="special-lyceum") renderSpecialLyceumProfile();
    if(id==="eneegyl") renderEneegylProfile();
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function showHome(){
    home.hidden=false; sg.hidden=true; sl.hidden=true; en.hidden=true;
    if(sgUnitMount) sgUnitMount.innerHTML="";
    if(unitMount) unitMount.innerHTML="";
    branchButtons.forEach((b)=>b.classList.remove("active"));
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function gradeTabs(grades,active,attr){
    return `<div class="sp-grade-tabs" role="tablist" aria-label="Επιλογή τάξης">${grades.map((g)=>`<button type="button" class="sp-grade-tab ${g.id===active?"active":""}" ${attr}="${esc(g.id)}">${esc(g.label)}</button>`).join("")}</div>`;
  }

  function renderSpecialGymProfile(){
    if(!sgProfile||!SG?.grades) return;
    const grades=Object.entries(SG.grades).map(([id,g])=>({id,label:g.label}));
    if(!SG.grades[selectedSpecialGymGrade]) selectedSpecialGymGrade=grades[0]?.id||"a";
    const grade=SG.grades[selectedSpecialGymGrade];

    const cards=(grade?.subjects||[]).map((row)=>{
      const detailedId=SG_DETAILED[`${selectedSpecialGymGrade}|${row.id}`]||null;
      const subjectId=detailedId||`special-gym-${selectedSpecialGymGrade}-${row.id}`;
      const hasLearning=!!(detailedId&&L?.[detailedId]?.status==="ready");
      const helper=hasLearning
        ? "Έχει έτοιμη βήμα-βήμα μελέτη και μικρό τεστ."
        : "Άνοιξε την AI Βοήθεια και γράψε το συγκεκριμένο κεφάλαιο, κείμενο ή άσκηση.";
      return `<article class="sp-subject-card">
        <div class="sp-subject-card__head"><div><span class="sp-subject-grade">${esc(grade.label)}</span><h3>${esc(row.label)}</h3></div>${hasLearning?'<span class="sp-ready-pill">Μελέτη + τεστ</span>':""}</div>
        <p>${esc(helper)}</p>
        ${subjectActions({schoolType:"special-gymnasium",gradeId:selectedSpecialGymGrade,subjectId,learningId:detailedId,sourceUrl:SG.timetableSourceUrl,target:"sg"})}
      </article>`;
    }).join("");

    sgProfile.innerHTML=`
      <div class="sp-choice-block"><h3>2. Διάλεξε τάξη</h3>${gradeTabs(grades,selectedSpecialGymGrade,"data-sg-grade")}</div>
      <div class="sp-choice-block"><h3>3. Διάλεξε μάθημα</h3><div class="sp-subject-grid">${cards}</div></div>`;
  }

  function renderSpecialLyceumProfile(){
    if(!slProfile||!SL?.grades) return;
    const grades=Object.entries(SL.grades).map(([id,g])=>({id,label:g.labelEl||id.toUpperCase()}));
    if(!SL.grades[selectedSpecialLyceumGrade]) selectedSpecialLyceumGrade=grades[0]?.id||"a";
    const grade=SL.grades[selectedSpecialLyceumGrade];
    slProfile.innerHTML=`
      <div class="sp-choice-block"><h3>2. Διάλεξε τάξη</h3>${gradeTabs(grades,selectedSpecialLyceumGrade,"data-sl-grade")}</div>
      <article class="sp-subject-card sp-subject-card--gateway">
        <div class="sp-subject-card__head"><div><span class="sp-subject-grade">${esc(grade?.labelEl||"")}</span><h3>Διάλεξε μάθημα μέσα στην AI Βοήθεια</h3></div></div>
        <p>Η ίδια AI Βοήθεια έχει πλέον ένα ενιαίο πεδίο «Σχολείο». Θα ανοίξει στο Ειδικό Λύκειο και στην τάξη που επέλεξες και από εκεί διαλέγεις μάθημα.</p>
        <div class="sp-card-actions">
          <a class="sp-action sp-action--ai" href="${esc(aiHref("special-lyceum",selectedSpecialLyceumGrade,"","student"))}">🤖 AI Βοήθεια μαθητή</a>
          <a class="sp-action" href="${esc(aiHref("special-lyceum",selectedSpecialLyceumGrade,"","guardian"))}">👪 Βοηθός γονέα</a>
          <a class="sp-source-link" href="${esc(SL.sourceUrl)}" target="_blank" rel="noopener">Επίσημη πηγή ↗</a>
        </div>
      </article>
      <p class="sp-small-note">Δεν εμφανίζουμε εδώ αυθαίρετη «ειδική ύλη». Όπου δεν έχει χαρτογραφηθεί ξεχωριστά η φετινή ύλη Ε.Α.Ε., το AI δουλεύει πάνω στο πραγματικό κεφάλαιο ή την άσκηση που του δίνεις.</p>`;
  }

  function eneegylEntries(){
    return Object.values(C?.entries||{}).filter((entry)=>entry?.schoolType==="eneegyl"&&entry.status==="verified"&&L?.[entry.id]?.status==="ready");
  }

  function renderEneegylProfile(){
    if(!enProfile) return;
    const entries=eneegylEntries();
    const order={A:1,B:2,C:3,D:4};
    const gradeMap=new Map();
    entries.forEach((entry)=>{
      const id=gradeKey(entry.grade);
      if(!gradeMap.has(id)) gradeMap.set(id,{id,label:gradeLabelFromEntry(entry),order:order[String(entry.grade||"").toUpperCase()]||99});
    });
    const grades=[...gradeMap.values()].sort((a,b)=>a.order-b.order);
    if(!selectedEneegylGrade||!gradeMap.has(selectedEneegylGrade)) selectedEneegylGrade=grades[0]?.id||null;
    const current=entries.filter((entry)=>gradeKey(entry.grade)===selectedEneegylGrade);

    const cards=current.map((entry)=>{
      const hasQuiz=Q?.[entry.id]?.questions?.length;
      return `<article class="sp-subject-card">
        <div class="sp-subject-card__head"><div><span class="sp-subject-grade">${esc(entry.sector||gradeLabelFromEntry(entry))}</span><h3>${esc(entry.subject)}</h3></div><span class="sp-ready-pill">Έτοιμη διαδρομή</span></div>
        <p>${hasQuiz?"Έτοιμη απλή παρουσίαση, εξάσκηση και μικρό διαγνωστικό.":"Έτοιμη απλή παρουσίαση και εξάσκηση."}</p>
        ${subjectActions({schoolType:"eneegyl",gradeId:selectedEneegylGrade,subjectId:entry.id,learningId:entry.id,sourceUrl:entry.sourceUrl,target:"en"})}
      </article>`;
    }).join("");

    enProfile.innerHTML=`
      <div class="sp-choice-block"><h3>2. Διάλεξε τάξη</h3>${gradeTabs(grades,selectedEneegylGrade,"data-en-grade")}</div>
      <div class="sp-choice-block"><h3>3. Διάλεξε μάθημα</h3><div class="sp-subject-grid">${cards||'<div class="sp-empty">Δεν υπάρχει ακόμη έτοιμη μαθησιακή διαδρομή για αυτή την τάξη.</div>'}</div></div>`;
  }

  function unitAiActions(c){
    const gradeId=gradeKey(c.grade);
    return `<div class="sp-unit-actions">
      <a class="sp-action sp-action--ai" href="${esc(aiHref(c.schoolType,gradeId,c.id,"student"))}">🤖 Συνέχισε με AI Βοήθεια</a>
      <a class="sp-action" href="${esc(aiHref(c.schoolType,gradeId,c.id,"guardian"))}">👪 Μελέτη με γονέα</a>
    </div>`;
  }

  function sourceDetails(c){
    const links=[];
    if(c.sourceUrl) links.push(`<a href="${esc(c.sourceUrl)}" target="_blank" rel="noopener">Επίσημη πηγή ↗</a>`);
    if(c.adaptationSourceUrl) links.push(`<a href="${esc(c.adaptationSourceUrl)}" target="_blank" rel="noopener">Υλικό ΙΕΠ/Prosvasimo ↗</a>`);
    if(c.instructionSourceUrl&&c.instructionSourceUrl!==c.sourceUrl) links.push(`<a href="${esc(c.instructionSourceUrl)}" target="_blank" rel="noopener">Οδηγίες διδασκαλίας ↗</a>`);
    return `<details class="sp-source-mini"><summary>Πηγή & ενημέρωση</summary><div><span>Σχολικό έτος 2026-2027${c.verificationDate?` · έλεγχος ${esc(c.verificationDate)}`:""}</span>${links.join("")}</div></details>`;
  }

  function renderUnit(id,target,focus="learn"){
    const c=C?.entries?.[id],l=L?.[id],q=Q?.[id];
    if(!target) return;
    if(!c||c.status!=="verified"||!l||l.status!=="ready"){
      target.innerHTML='<div class="sp-empty"><strong>Η μαθησιακή διαδρομή δεν είναι ακόμη έτοιμη.</strong></div>';
      return;
    }

    target.innerHTML=`<article class="sp-unit">
      <header class="sp-unit__header"><div><span class="sp-kicker">${esc(gradeLabelFromEntry(c))}${c.sector?` · ${esc(c.sector)}`:""}</span><h3>${esc(c.subject)}</h3></div></header>
      ${unitAiActions(c)}
      <details class="sp-step" data-section="learn" open><summary><span class="sp-num">1</span>Μαθαίνω απλά</summary><div class="sp-step__body"><p class="sp-lead">${esc(l.learnSimply.lead)}</p><h4>Τι να θυμάμαι</h4><ul class="sp-check">${l.learnSimply.keyPoints.map((x)=>`<li>${esc(x)}</li>`).join("")}</ul></div></details>
      <details class="sp-step"><summary><span class="sp-num">2</span>Ερωτήσεις & Απαντήσεις</summary><div class="sp-step__body">${l.qa.map((x)=>`<div class="sp-qa"><strong>${esc(x.q)}</strong><p>${esc(x.a)}</p></div>`).join("")}</div></details>
      <details class="sp-step parent"><summary><span class="sp-num">3</span>Μελετάμε μαζί</summary><div class="sp-step__body"><p class="sp-lead"><strong>Για γονιό/φροντιστή:</strong> ${esc(l.parentStudy.intro)}</p><ol>${l.parentStudy.steps.map((x)=>`<li>${esc(x)}</li>`).join("")}</ol></div></details>
      <details class="sp-step"><summary><span class="sp-num">4</span>Εξάσκηση</summary><div class="sp-step__body"><div class="sp-practice">${l.practice.map((x,i)=>`<div class="sp-practice-item"><b>${i+1}</b><p>${esc(x)}</p></div>`).join("")}</div></div></details>
      ${q?'<details class="sp-step" data-section="quiz"><summary><span class="sp-num">5</span>Μικρό τεστ</summary><div class="sp-step__body"><div class="spQuiz"></div></div></details>':""}
      ${sourceDetails(c)}
    </article>`;

    renderQuiz(q,target);
    if(focus==="quiz"){
      const quizDetails=target.querySelector('[data-section="quiz"]');
      if(quizDetails) quizDetails.open=true;
    }
    target.scrollIntoView({behavior:"smooth",block:"start"});
  }

  function renderQuiz(quiz,target){
    const mount=target?.querySelector(".spQuiz");
    if(!mount||!quiz) return;
    mount.innerHTML=`<h4>${esc(quiz.title)}</h4><p>${esc(quiz.intro)}</p><button class="sp-action sp-action--ai" type="button" data-sp-quiz-start>Ξεκίνα τις ${quiz.questions.length} ερωτήσεις</button>`;
    let idx=0,score=0,locked=false;
    const start=()=>{idx=0;score=0;locked=false;renderQ();};
    const renderQ=()=>{
      const x=quiz.questions[idx];
      mount.innerHTML=`<div class="sp-quiz-progress">Ερώτηση ${idx+1} από ${quiz.questions.length}</div><h4>${esc(x.q)}</h4><div class="sp-quiz-options">${x.options.map((t,i)=>`<button class="sp-option" type="button" data-i="${i}">${esc(t)}</button>`).join("")}</div><div class="sp-feedback" aria-live="polite"></div>`;
      mount.querySelectorAll(".sp-option").forEach((b)=>b.addEventListener("click",()=>answer(Number(b.dataset.i))));
    };
    const answer=(i)=>{
      if(locked) return; locked=true;
      const x=quiz.questions[idx]; if(i===x.correctIndex) score++;
      const opts=[...mount.querySelectorAll(".sp-option")];
      opts.forEach((b,n)=>{b.disabled=true;if(n===x.correctIndex)b.classList.add("correct");if(n===i&&n!==x.correctIndex)b.classList.add("wrong");});
      const last=idx===quiz.questions.length-1;
      const f=mount.querySelector(".sp-feedback");
      f.innerHTML=`<p>${i===x.correctIndex?"Σωστά.":"Όχι αυτή τη φορά."}</p><button class="sp-action" type="button" data-sp-next>${last?"Δες αποτέλεσμα":"Επόμενη ερώτηση"}</button>`;
      mount.querySelector("[data-sp-next]").onclick=()=>{if(last) result();else{idx++;locked=false;renderQ();}};
    };
    const result=()=>{
      const strong=score>=Math.ceil(quiz.questions.length*.66);
      const message=strong?(quiz.successMessage||"Έπιασες τη βασική λογική."):(quiz.retryMessage||"Κάνε μια μικρή επανάληψη και ξαναδοκίμασε.");
      mount.innerHTML=`<div class="sp-score">${score}/${quiz.questions.length}</div><p>${esc(message)}</p><button class="sp-action" type="button" data-sp-retry>Ξαναδοκίμασε</button>`;
      mount.querySelector("[data-sp-retry]").onclick=start;
    };
    mount.querySelector("[data-sp-quiz-start]")?.addEventListener("click",start);
  }

  branchButtons.forEach((b)=>b.addEventListener("click",()=>showBranch(b.dataset.branch)));
  backButtons.forEach((b)=>b.addEventListener("click",showHome));

  sgProfile?.addEventListener("click",(e)=>{
    const grade=e.target.closest("[data-sg-grade]");
    if(grade){ selectedSpecialGymGrade=grade.dataset.sgGrade; renderSpecialGymProfile(); return; }
    const unit=e.target.closest("[data-open-sg-unit]");
    if(unit) renderUnit(unit.dataset.openSgUnit,sgUnitMount,unit.dataset.focus||"learn");
  });

  slProfile?.addEventListener("click",(e)=>{
    const grade=e.target.closest("[data-sl-grade]");
    if(grade){ selectedSpecialLyceumGrade=grade.dataset.slGrade; renderSpecialLyceumProfile(); }
  });

  enProfile?.addEventListener("click",(e)=>{
    const grade=e.target.closest("[data-en-grade]");
    if(grade){ selectedEneegylGrade=grade.dataset.enGrade; renderEneegylProfile(); return; }
    const unit=e.target.closest("[data-open-unit]");
    if(unit) renderUnit(unit.dataset.openUnit,unitMount,unit.dataset.focus||"learn");
  });

  renderSpecialGymProfile();
  renderSpecialLyceumProfile();
  renderEneegylProfile();
})();