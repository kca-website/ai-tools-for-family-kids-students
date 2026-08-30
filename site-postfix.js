/** DOM/data refinements loaded after app.js — v3.1.6. */
(function(){
  "use strict";

  const SPECIALIST_TOOLS = new Set([
    "phet","google-arts-culture","photomath","reading-coach","duolingo",
    "wolfram-alpha","symbolab","desmos","geogebra","quizlet","notebooklm",
    "perplexity","grammarly","canva-magic","github-copilot","replit-ai",
    "mindmup","miro-ai","scite","elicit","scribbr","hemingway","autodraw"
  ]);
  const GENERIC_ASSISTANTS = new Set(["chatgpt","claude","gemini","copilot","gemini-education"]);
  const ZONE_MAX_AGE = { primary: 12, middle: 15, high: 18 };
  const LAST_QUIZ_KEY = "aitools4kids_last_quiz_id_v1";

  function isEnglish(){
    return !!document.getElementById("langEn")?.classList.contains("active");
  }

  function routeContext(){
    const parts=location.pathname.split("/").filter(Boolean);
    const zone=["primary","middle","high"].includes(parts[0]) ? parts[0] : null;
    const role=["guardian","student"].includes(parts[1]) ? parts[1] : null;
    return {zone,role,view:parts[2]||null};
  }

  function recommendationRank(id){
    if(SPECIALIST_TOOLS.has(id)) return 0;
    const tool = typeof TOOLS !== "undefined" ? TOOLS[id] : null;
    if(tool?.isExpert) return 0;
    if(GENERIC_ASSISTANTS.has(id)) return 2;
    return 1;
  }

  function reorderQuizRecommendations(){
    if(typeof GAP_TAGS === "undefined" || !GAP_TAGS) return;

    Object.values(GAP_TAGS).forEach((gap)=>{
      if(!gap) return;
      const current=[...new Set((gap.recommendedToolIds || []).filter(Boolean))];
      const others=current.filter((id)=>id!=="ai-help");

      // Stable priority: subject/specialist tools first, general assistants later.
      others.sort((a,b)=>recommendationRank(a)-recommendationRank(b));

      // In quiz results: specialist/external option first, our guided AI Help second.
      // If no other recommendation exists, AI Help remains the only option.
      gap.recommendedToolIds = others.length
        ? [others[0], "ai-help", ...others.slice(1)]
        : ["ai-help"];
    });
  }

  function fixFooter(){
    const el=document.querySelector(".site-footer__last-checked");
    if(!el) return;
    const desired=isEnglish()
      ? "Tools last checked: 29 August 2026"
      : "Τελευταίος έλεγχος εργαλείων: 29 Αυγούστου 2026";
    if(el.textContent.trim() !== desired) el.textContent=desired;
  }

  function ensureRoleGuidance(){
    const roleTabs=document.getElementById("roleTabs");
    if(!roleTabs) return;
    const {zone,role}=routeContext();

    let box=document.getElementById("roleContextGuide");
    if(!zone || !role){
      if(box) box.hidden=true;
      return;
    }
    if(!box){
      box=document.createElement("div");
      box.id="roleContextGuide";
      box.setAttribute("role","note");
      box.style.cssText="margin:10px 0 16px;padding:12px 14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;color:#334155;font-size:.88rem;line-height:1.5;";
      roleTabs.insertAdjacentElement("afterend",box);
    }
    box.hidden=false;

    const en=isEnglish();
    const guardian=role==="guardian";
    const primaryStudent=zone==="primary" && !guardian;

    const title=en
      ? (guardian ? "👪 You are viewing the Parent / Educator version" : "🎒 You are viewing the Student version")
      : (guardian ? "👪 Βρίσκεσαι στην προβολή Γονιού / Εκπαιδευτικού" : "🎒 Βρίσκεσαι στην προβολή Μαθητή");

    const roleText=en
      ? (guardian
          ? "Recommendations here are for you to use while supporting the learner. Some services with higher age limits may appear only as adult-operated options."
          : "Recommendations here are filtered for the learner’s age zone. If a service needs a parent, school account or extra consent, the site will say so explicitly.")
      : (guardian
          ? "Οι προτάσεις εδώ είναι για να τις χρησιμοποιήσεις εσύ βοηθώντας τον μαθητή. Κάποια εργαλεία με μεγαλύτερο ηλικιακό όριο εμφανίζονται μόνο ως επιλογές που χειρίζεται ο ενήλικας."
          : "Οι προτάσεις εδώ φιλτράρονται για την ηλικιακή ζώνη του μαθητή. Αν ένα εργαλείο χρειάζεται γονέα, σχολικό λογαριασμό ή πρόσθετη συναίνεση, το γράφουμε καθαρά.");

    const helpText=en
      ? (primaryStudent
          ? "AI Help for Primary students is used through the Parent Helper with an adult."
          : "AI Help guides with questions and hints instead of handing over a ready-made answer.")
      : (primaryStudent
          ? "Στο Δημοτικό η AI Βοήθεια χρησιμοποιείται μέσω του Βοηθού Γονέα, μαζί με ενήλικα."
          : "Η AI Βοήθεια καθοδηγεί με ερωτήσεις και υποδείξεις αντί να δίνει έτοιμη απάντηση.");

    const quick=en
      ? "<strong>How to start:</strong> Tools = immediate recommendations · Diagnostic Map = a short check of what needs practice · AI Help = guided help when you get stuck."
      : "<strong>Πώς ξεκινάς:</strong> Εργαλεία = άμεσες προτάσεις · Διαγνωστικός Χάρτης = σύντομος έλεγχος για το τι θέλει εξάσκηση · AI Βοήθεια = καθοδήγηση όταν κολλήσεις.";

    const signature=[en,zone,role].join("|");
    if(box.dataset.signature===signature) return;
    box.dataset.signature=signature;
    box.innerHTML=`<div style="font-weight:700;margin-bottom:4px;">${title}</div><div>${roleText}</div><div style="margin-top:6px;">${helpText}</div><div style="margin-top:8px;color:#475569;">${quick}</div>`;
  }

  function rememberQuizContext(event){
    const target=event.target instanceof Element ? event.target : null;
    if(!target) return;
    const btn=target.closest(".quiz-start-btn[data-subject-id], .quiz-browse-btn[data-subject-id]");
    if(btn?.dataset?.subjectId){
      try{ sessionStorage.setItem(LAST_QUIZ_KEY,btn.dataset.subjectId); }catch(_e){}
    }
  }

  function getLastQuizId(zone){
    try{
      const id=sessionStorage.getItem(LAST_QUIZ_KEY);
      if(id && typeof QUIZZES!=="undefined" && QUIZZES?.[zone]?.[id]) return id;
    }catch(_e){}
    try{
      const raw=localStorage.getItem("aitools4kids_progress_v1");
      const data=raw ? JSON.parse(raw) : null;
      if(data?.zoneId===zone && data?.quizId && QUIZZES?.[zone]?.[data.quizId]) return data.quizId;
    }catch(_e){}
    return null;
  }

  function toolAllowedForContext(tool, zone, role){
    if(!tool || tool.isMobileApp) return false;
    if(role==="guardian") return true;
    const max=ZONE_MAX_AGE[zone];
    if(typeof tool.minAge==="number" && typeof max==="number" && tool.minAge>max) return false;
    return true;
  }

  function pickEnrichmentTool(zone, role, quizId){
    if(typeof QUIZZES==="undefined" || typeof GAP_TAGS==="undefined" || typeof TOOLS==="undefined") return null;
    const quiz=QUIZZES?.[zone]?.[quizId];
    if(!quiz) return null;

    const scores=new Map();
    (quiz.questions||[]).forEach((q)=>{
      (q.options||[]).forEach((opt)=>{
        if(!opt.gapTag) return;
        const gap=GAP_TAGS[opt.gapTag];
        (gap?.recommendedToolIds||[]).forEach((id,idx)=>{
          if(id==="ai-help") return;
          const tool=TOOLS[id];
          if(!toolAllowedForContext(tool,zone,role)) return;
          const existing=scores.get(id) || {id,tool,count:0,bestIndex:999};
          existing.count += 1;
          existing.bestIndex = Math.min(existing.bestIndex,idx);
          scores.set(id,existing);
        });
      });
    });

    const list=[...scores.values()];
    list.sort((a,b)=>{
      const schoolPenaltyA=a.tool?.schoolOnly ? 1 : 0;
      const schoolPenaltyB=b.tool?.schoolOnly ? 1 : 0;
      return recommendationRank(a.id)-recommendationRank(b.id)
        || schoolPenaltyA-schoolPenaltyB
        || b.count-a.count
        || a.bestIndex-b.bestIndex;
    });
    return list[0] || null;
  }

  function shortText(text,max=170){
    const clean=(text||"").trim();
    if(clean.length<=max) return clean;
    return clean.slice(0,max-1).trimEnd()+"…";
  }

  function ensurePerfectScoreEnrichment(){
    const root=document.getElementById("quizContent");
    if(!root) return;
    const perfect=root.querySelector(".quiz-all-correct");
    if(!perfect){
      root.querySelector(".quiz-perfect-enrichment")?.remove();
      return;
    }

    const {zone,role}=routeContext();
    if(!zone || !role) return;
    const quizId=getLastQuizId(zone);
    const quiz=quizId && typeof QUIZZES!=="undefined" ? QUIZZES?.[zone]?.[quizId] : null;
    const specialist=quizId ? pickEnrichmentTool(zone,role,quizId) : null;
    const en=isEnglish();
    const subject=quiz ? (en ? quiz.subjectLabelEn : quiz.subjectLabelEl) : "";
    const aiLabel=en
      ? (zone==="primary" && role==="student" ? "Parent Helper — with an adult" : (role==="guardian" ? "Parent Helper" : "AI Help"))
      : (zone==="primary" && role==="student" ? "Βοηθός Γονέα — μαζί με γονέα" : (role==="guardian" ? "Βοηθός Γονέα" : "AI Βοήθεια"));
    const aiHref=zone==="primary" && role==="student"
      ? "/primary/guardian/tutor"
      : `/${zone}/${role}/tutor`;

    let panel=root.querySelector(".quiz-perfect-enrichment");
    if(!panel){
      panel=document.createElement("section");
      panel.className="quiz-perfect-enrichment";
      panel.style.cssText="margin:16px 0 24px;padding:16px;border:1px solid #bbf7d0;border-radius:12px;background:#f0fdf4;color:#334155;";
      perfect.insertAdjacentElement("afterend",panel);
    }

    const signature=[en,zone,role,quizId||"",specialist?.id||""].join("|");
    if(panel.dataset.signature===signature) return;
    panel.dataset.signature=signature;

    const title=en
      ? "🎯 Excellent — now go one step further"
      : "🎯 Μπράβο — τώρα πήγαινε ένα βήμα παραπέρα";
    const intro=en
      ? `No practice gap was detected in this attempt${subject ? ` for ${subject}` : ""}. Instead of stopping here, use the result for enrichment and a harder challenge.`
      : `Δεν εντοπίστηκε κενό σε αυτή την προσπάθεια${subject ? ` στο ${subject}` : ""}. Αντί να σταματήσεις εδώ, χρησιμοποίησε το αποτέλεσμα για εμπλουτισμό και μια πιο δύσκολη πρόκληση.`;

    const specialistHtml=specialist
      ? `
        <div style="padding:12px;border-radius:10px;background:#fff;border:1px solid #dcfce7;">
          <div style="font-weight:700;margin-bottom:4px;">1. ${en ? "Explore further with" : "Εμβάθυνε με"} ${specialist.tool.name}</div>
          <div style="font-size:.86rem;color:#475569;margin-bottom:8px;">${shortText(en ? specialist.tool.shortDescEn : specialist.tool.shortDescEl)}</div>
          <a href="/tools/${specialist.id}.html" target="_blank" rel="noopener noreferrer" style="font-weight:700;color:var(--color-accent);">${en ? "See the tool →" : "Δες το εργαλείο →"}</a>
        </div>`
      : "";

    const aiNumber=specialist ? "2." : "1.";
    const challenge=en
      ? "Try this prompt: “Give me one harder challenge on the same topic. Ask me one question at a time and do not give me the solution immediately.”"
      : "Δοκίμασε αυτό: «Δώσε μου μία πιο δύσκολη πρόκληση στο ίδιο θέμα. Κάνε μου μία ερώτηση τη φορά και μη μου δώσεις αμέσως τη λύση.»";

    panel.innerHTML=`
      <div style="font-weight:800;font-size:1rem;margin-bottom:5px;">${title}</div>
      <div style="font-size:.9rem;line-height:1.5;margin-bottom:12px;">${intro}</div>
      <div style="display:grid;gap:10px;">
        ${specialistHtml}
        <div style="padding:12px;border-radius:10px;background:#fff;border:1px solid #dcfce7;">
          <div style="font-weight:700;margin-bottom:4px;">${aiNumber} ${en ? "Ask for a harder challenge in" : "Ζήτησε πιο δύσκολη πρόκληση από"} ${aiLabel}</div>
          <div style="font-size:.86rem;color:#475569;margin-bottom:8px;">${challenge}</div>
          <a href="${aiHref}" style="font-weight:700;color:var(--color-accent);">${en ? `Open ${aiLabel} →` : `Άνοιξε ${aiLabel} →`}</a>
        </div>
      </div>
      <div style="margin-top:10px;font-size:.82rem;color:#64748b;">${en ? "You can also retake the Diagnostic Map later; questions are shuffled between attempts." : "Μπορείς επίσης να ξανακάνεις τον Διαγνωστικό αργότερα· οι ερωτήσεις ανακατεύονται μεταξύ προσπαθειών."}</div>
    `;
  }

  function ensureQuizDisclaimer(){
    const root=document.getElementById("quizContent");
    if(!root) return;
    const title=root.querySelector(".quiz-results-title");
    if(!title) return;

    let note=root.querySelector(".quiz-formative-disclaimer");
    if(!note){
      note=document.createElement("div");
      note.className="quiz-formative-disclaimer";
      note.setAttribute("role","note");
      note.style.cssText="max-width:720px;margin:10px auto 20px;padding:12px 14px;border:1px solid #dbeafe;border-radius:10px;background:#eff6ff;color:#334155;font-size:.86rem;line-height:1.5;text-align:left;";
      title.insertAdjacentElement("afterend",note);
    }

    const desired=isEnglish()
      ? "The Diagnostic Map is a practice and self-assessment tool. It is not an official school grade, a diagnosis of a learning difficulty, an assessment of the learner’s ability, or a decision about their educational path."
      : "Ο Διαγνωστικός Χάρτης είναι εργαλείο εξάσκησης και αυτοαξιολόγησης. Δεν αποτελεί σχολική βαθμολόγηση, διάγνωση μαθησιακής δυσκολίας, αξιολόγηση της ικανότητας του μαθητή ή απόφαση για την εκπαιδευτική του πορεία.";

    // Do not rewrite identical text: that would retrigger the observer forever.
    if(note.textContent !== desired) note.textContent=desired;
  }

  function ensureSignLanguageEntry(){
    const host=document.getElementById("zoneSelectView");
    const hero=host?.querySelector(".hero");
    if(!host || !hero) return;

    let panel=document.getElementById("signLanguageFeature");
    if(!panel){
      panel=document.createElement("section");
      panel.id="signLanguageFeature";
      panel.setAttribute("aria-label","Greek Sign Language learning concepts");
      panel.style.cssText="margin:0 0 30px;padding:18px 20px;border:1px solid #bfdbfe;border-radius:16px;background:linear-gradient(135deg,#eff6ff,#f0fdf4);display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;box-shadow:0 1px 2px rgba(15,23,42,.03);";
      hero.insertAdjacentElement("afterend",panel);
    }

    const en=isEnglish();
    const signature=String(en);
    if(panel.dataset.signature===signature) return;
    panel.dataset.signature=signature;

    const badge=en ? "New · Accessibility" : "Νέο · Προσβασιμότητα";
    const title=en ? "🤟 Concepts in Greek Sign Language" : "🤟 Έννοιες στην Ελληνική Νοηματική";
    const text=en
      ? "153 selected school concepts — not a complete GSL dictionary — with simple explanations, scientific visuals, and direct official videos from IEP."
      : "153 επιλεγμένες σχολικές έννοιες — όχι πλήρες λεξικό ΕΝΓ — με απλή εξήγηση, επιστημονική εικόνα και απευθείας επίσημο βίντεο από το ΙΕΠ.";
    const cta=en ? "Explore the 153 concepts →" : "Δες τις 153 έννοιες →";

    panel.innerHTML=`
      <div style="min-width:min(100%,520px);flex:1;">
        <div style="display:inline-block;margin-bottom:7px;padding:4px 9px;border-radius:999px;background:#dbeafe;color:#1e40af;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.03em;">${badge}</div>
        <div style="font-family:var(--font-heading);font-weight:800;font-size:1.08rem;color:#1f2937;margin-bottom:5px;">${title}</div>
        <div style="font-size:.9rem;line-height:1.5;color:#475569;max-width:720px;">${text}</div>
      </div>
      <a href="/sign-language.html" style="display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:10px 15px;border-radius:10px;background:#2e6ba3;color:#fff;text-decoration:none;font-weight:800;white-space:nowrap;">${cta}</a>
    `;
  }

  function loadPwaLayer(){
    if(document.querySelector('script[data-aitools4kids-pwa="1"]')) return;
    const script=document.createElement("script");
    script.src="/pwa.js";
    script.async=false;
    script.dataset.aitools4kidsPwa="1";
    document.head.appendChild(script);
  }

  function refresh(){
    reorderQuizRecommendations();
    fixFooter();
    ensureRoleGuidance();
    ensureQuizDisclaimer();
    ensurePerfectScoreEnrichment();
    ensureSignLanguageEntry();
  }

  // Data is already loaded when this script runs; repeat after app init for safety.
  reorderQuizRecommendations();
  loadPwaLayer();
  queueMicrotask(refresh);
  document.addEventListener("DOMContentLoaded", refresh);
  window.addEventListener("popstate",()=>setTimeout(refresh,0));

  const quiz=document.getElementById("quizContent");
  if(quiz){
    quiz.addEventListener("click",rememberQuizContext,true);
    new MutationObserver(()=>{
      ensureQuizDisclaimer();
      ensurePerfectScoreEnrichment();
    }).observe(quiz,{childList:true,subtree:true});
  }

  const roleTabs=document.getElementById("roleTabs");
  if(roleTabs){
    new MutationObserver(()=>ensureRoleGuidance()).observe(roleTabs,{childList:true});
  }

  document.addEventListener("click",(event)=>{
    const target=event.target instanceof Element ? event.target : null;
    if(!target) return;
    if(target.closest("#roleTabs .role-tab, .zone-card, #backToZones")){
      setTimeout(refresh,0);
    }
  });

  document.getElementById("langEl")?.addEventListener("click",()=>setTimeout(refresh,0));
  document.getElementById("langEn")?.addEventListener("click",()=>setTimeout(refresh,0));
})();
