(function(){
  "use strict";
  function va(){if(typeof window.va==="function")return window.va;window.va=function(){(window.vaq=window.vaq||[]).push(arguments);};return window.va;}
  function ctx(){const c=window.AITutor?.getQualityContext?.()||{};return{zone:String(c.zone||"").slice(0,20),role:String(c.role||"").slice(0,20),subject:String(c.subject||"").slice(0,80),mode:String(c.mode||"").slice(0,30),provider:String(c.provider||"").slice(0,20)};}
  function track(rating){try{va()("event",{name:"Tutor Reply Feedback",data:Object.assign({rating},ctx())});return true;}catch(_){return false;}}
  function enhance(){
    document.querySelectorAll(".tutor-bubble--assistant:not([data-quality-feedback])").forEach((bubble)=>{
      bubble.dataset.qualityFeedback="1";
      const en=(document.documentElement.lang||"").toLowerCase().startsWith("en");
      const row=document.createElement("div");
      row.className="tutor-quality-feedback";
      row.style.cssText="display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-top:8px;padding-top:7px;border-top:1px solid rgba(148,163,184,.28);font-size:.75rem;";
      row.innerHTML='<span style="color:#64748b;margin-right:2px;">'+(en?"Was this useful?":"Ήταν χρήσιμη;")+'</span><button type="button" data-rate="helpful" aria-label="'+(en?"Helpful":"Χρήσιμη")+'" style="border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:4px 7px;cursor:pointer;">👍</button><button type="button" data-rate="not_helpful" aria-label="'+(en?"Not helpful":"Δεν βοήθησε")+'" style="border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:4px 7px;cursor:pointer;">👎</button><a data-report href="#" style="margin-left:3px;color:#52657a;">'+(en?"Report an error":"Ανάφερε λάθος")+'</a><span data-status style="color:#2e6f5e;"></span>';
      bubble.appendChild(row);
      row.querySelectorAll("[data-rate]").forEach(btn=>btn.addEventListener("click",()=>{
        track(btn.dataset.rate);
        row.querySelectorAll("[data-rate]").forEach(b=>b.disabled=true);
        row.querySelector("[data-status]").textContent=en?" Thanks. No conversation text was sent.":" Ευχαριστούμε. Δεν στάλθηκε κείμενο συνομιλίας.";
      }));
      row.querySelector("[data-report]").addEventListener("click",(e)=>{
        e.preventDefault();
        const params=new URLSearchParams({source:location.href,section:"AI Βοήθεια / Tutor",issue:"Θέλω να αναφέρω λάθος ή προβληματική απάντηση της AI Βοήθειας. Δεν έχει μεταφερθεί αυτόματα το κείμενο της συνομιλίας."});
        window.open("/report-error.html?"+params.toString(),"_blank","noopener,noreferrer");
      });
    });
  }
  document.addEventListener("aitools4kids:tutor-conversation-updated",()=>setTimeout(enhance,0));
  new MutationObserver(enhance).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",enhance,{once:true});else enhance();
})();