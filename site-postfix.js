/** DOM/data refinements loaded after app.js — v3.1.3. */
(function(){
  "use strict";

  const SPECIALIST_TOOLS = new Set([
    "phet","google-arts-culture","photomath","reading-coach","duolingo",
    "wolfram-alpha","symbolab","desmos","geogebra","quizlet","notebooklm",
    "perplexity","grammarly","canva-magic","github-copilot","replit-ai",
    "mindmup","miro-ai","scite","elicit","scribbr","hemingway","autodraw"
  ]);
  const GENERIC_ASSISTANTS = new Set(["chatgpt","claude","gemini","copilot","gemini-education"]);

  function isEnglish(){
    return !!document.getElementById("langEn")?.classList.contains("active");
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

  function refresh(){
    reorderQuizRecommendations();
    fixFooter();
    ensureQuizDisclaimer();
  }

  // Data is already loaded when this script runs; repeat after app init for safety.
  reorderQuizRecommendations();
  queueMicrotask(refresh);
  document.addEventListener("DOMContentLoaded", refresh);

  const quiz=document.getElementById("quizContent");
  if(quiz){
    new MutationObserver(()=>ensureQuizDisclaimer()).observe(quiz,{childList:true,subtree:true});
  }

  document.getElementById("langEl")?.addEventListener("click",()=>setTimeout(refresh,0));
  document.getElementById("langEn")?.addEventListener("click",()=>setTimeout(refresh,0));
})();
