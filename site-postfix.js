/** DOM-only refinements loaded after app.js — v3.1. */
(function(){
  "use strict";

  function isEnglish(){
    return !!document.getElementById("langEn")?.classList.contains("active");
  }

  function fixFooter(){
    const el=document.querySelector(".site-footer__last-checked");
    if(!el) return;
    el.textContent=isEnglish()
      ? "Tools last checked: 29 August 2026"
      : "Τελευταίος έλεγχος εργαλείων: 29 Αυγούστου 2026";
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
    note.textContent=isEnglish()
      ? "The Diagnostic Map is a practice and self-assessment tool. It is not an official school grade, a diagnosis of a learning difficulty, an assessment of the learner’s ability, or a decision about their educational path."
      : "Ο Διαγνωστικός Χάρτης είναι εργαλείο εξάσκησης και αυτοαξιολόγησης. Δεν αποτελεί σχολική βαθμολόγηση, διάγνωση μαθησιακής δυσκολίας, αξιολόγηση της ικανότητας του μαθητή ή απόφαση για την εκπαιδευτική του πορεία.";
  }

  function refresh(){
    fixFooter();
    ensureQuizDisclaimer();
  }

  queueMicrotask(refresh);

  const quiz=document.getElementById("quizContent");
  if(quiz){
    new MutationObserver(()=>ensureQuizDisclaimer()).observe(quiz,{childList:true,subtree:true});
  }

  document.getElementById("langEl")?.addEventListener("click",()=>setTimeout(refresh,0));
  document.getElementById("langEn")?.addEventListener("click",()=>setTimeout(refresh,0));
})();
