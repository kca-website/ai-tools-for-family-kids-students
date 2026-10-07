/* Play & Learn integration bridge.
 * Keeps the game subordinate to the existing learning flow:
 * Practice Map -> AI/Learning Path -> game mission -> back to learning.
 */
(function(){
  "use strict";

  if(location.pathname.startsWith("/play")) return;

  const MISSIONS={
    "decimals.longer_is_larger":{
      titleEl:"Πύλη των Δεκαδικών",
      titleEn:"Decimal Gate",
      descEl:"Εξάσκησε τη σύγκριση δεκαδικών μέσα στο Math City και γύρνα μετά στη Διαδρομή σου.",
      descEn:"Practise decimal comparison inside Math City, then return to your learning path.",
      href:"/play/?mission=decimals.longer_is_larger&return=path"
    }
  };
  let activeGapId="";

  function english(){
    return document.getElementById("langEn")?.classList.contains("active") || document.documentElement.lang==="en";
  }

  function ensureStyle(){
    if(document.getElementById("playIntegrationStyle")) return;
    const style=document.createElement("style");
    style.id="playIntegrationStyle";
    style.textContent=`
      .play-route-bridge{margin:18px 0 6px;padding:15px 17px;border:1px solid #d8d0ff;border-radius:18px;background:linear-gradient(135deg,#faf8ff,#eef8ff);display:flex;align-items:center;justify-content:space-between;gap:18px;box-shadow:0 8px 22px #4452a00d}
      .play-route-bridge__copy{min-width:0}.play-route-bridge__eyebrow{display:block;margin-bottom:3px;color:#7153b6;font-size:12px;font-weight:900;letter-spacing:.04em;text-transform:uppercase}.play-route-bridge strong{display:block;color:#253b55;font-size:17px}.play-route-bridge p{margin:4px 0 0;color:#5a7086;font-size:13px;line-height:1.45}.play-route-bridge__actions{display:flex;gap:8px;flex-wrap:wrap;flex:0 0 auto}.play-route-bridge__actions a,.play-path-mission__cta{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:9px 13px;border-radius:11px;text-decoration:none;font-weight:800;font-size:13px}.play-route-bridge__primary,.play-path-mission__cta{background:#7253c7;color:#fff!important;box-shadow:0 6px 15px #7253c72b}.play-route-bridge__secondary{background:#fff;color:#42627d!important;border:1px solid #dce7f0}
      .play-path-mission{margin:14px 0 4px;padding:15px;border:1px solid #d8d0ff;border-radius:14px;background:linear-gradient(135deg,#faf8ff,#f1f8ff)}.play-path-mission__head{display:flex;gap:10px;align-items:flex-start}.play-path-mission__icon{font-size:26px;line-height:1}.play-path-mission__eyebrow{display:block;color:#7253c7;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.04em}.play-path-mission h4{margin:2px 0 4px;font-size:16px;color:#243c55}.play-path-mission p{margin:0;color:#5a7086;font-size:13px;line-height:1.45}.play-path-mission__cta{margin-top:11px}
      .play-inline-link{display:inline-flex!important;align-items:center;gap:5px;margin-top:10px;padding:8px 11px;border-radius:10px;background:#f2edff;color:#6548b4!important;text-decoration:none;font-size:13px;font-weight:800}
      @media(max-width:720px){.play-route-bridge{align-items:flex-start;flex-direction:column}.play-route-bridge__actions{width:100%}.play-route-bridge__actions a{flex:1 1 150px}}
    `;
    document.head.appendChild(style);
  }

  function homeBridge(){
    if(location.pathname!=="/" && location.pathname!=="") return;
    ensureStyle();
    const en=english();
    const headings=[...document.querySelectorAll("h2,h3,strong")];
    const pathHeading=headings.find(el=>/AI\s*Διαδρομές|Μονοπάτι\s*Μάθησης|AI\s*Routes|Learning\s*Path/i.test((el.textContent||"").trim()));
    const pathCard=pathHeading?.closest(".home-v8-learning-card,.home-v9-tile,.home-ai-mode-card,article,section");
    if(pathCard && !pathCard.querySelector(".play-inline-link") && pathCard.querySelector("a,button")){
      const link=document.createElement("a");
      link.className="play-inline-link";
      link.href="/play/";
      link.textContent=en?"🎮 Try a game mission":"🎮 Παίξε μια αποστολή";
      pathCard.appendChild(link);
      pathCard.dataset.playIntegrated="1";
      document.getElementById("playRouteBridge")?.remove();
      return;
    }
    if(document.getElementById("playRouteBridge")) return;
    const anchor=document.querySelector(".hero__learning-loop") || document.getElementById("homeV9Finder") || document.querySelector(".home-v9-intro");
    if(!anchor) return;
    const bridge=document.createElement("aside");
    bridge.id="playRouteBridge";
    bridge.className="play-route-bridge";
    bridge.setAttribute("aria-label",en?"Learning path and game missions":"AI Διαδρομές και αποστολές παιχνιδιού");
    bridge.innerHTML=en?`
      <div class="play-route-bridge__copy"><span class="play-route-bridge__eyebrow">Practice → AI Route → Game mission</span><strong>Your learning route can continue as a game.</strong><p>Find what needs practice, follow the suggested route and reinforce it with a short Play & Learn mission.</p></div>
      <div class="play-route-bridge__actions"><a class="play-route-bridge__secondary" href="/practice.html">Find what to practise</a><a class="play-route-bridge__primary" href="/play/">🎮 Try Play & Learn</a></div>`:`
      <div class="play-route-bridge__copy"><span class="play-route-bridge__eyebrow">Χάρτης → AI Διαδρομή → Παιχνίδι</span><strong>Η διαδρομή μάθησης μπορεί να συνεχιστεί σαν παιχνίδι.</strong><p>Βρες τι θέλει εξάσκηση, ακολούθησε την AI Διαδρομή και δούλεψέ το με μια σύντομη αποστολή στο Παίξε & Μάθε.</p></div>
      <div class="play-route-bridge__actions"><a class="play-route-bridge__secondary" href="/practice.html">Βρες τι χρειάζεται εξάσκηση</a><a class="play-route-bridge__primary" href="/play/">🎮 Δοκίμασε το Παίξε & Μάθε</a></div>`;
    anchor.insertAdjacentElement("afterend",bridge);
  }

  function captureGap(event){
    const target=event.target instanceof Element?event.target:null;
    const btn=target?.closest(".path-view-btn[data-gap-id]");
    if(btn?.dataset.gapId) activeGapId=btn.dataset.gapId;
  }

  function pathMission(){
    const modal=document.getElementById("pathModal");
    const overlay=document.getElementById("pathModalOverlay");
    if(!modal || !overlay || overlay.hidden) return;
    ensureStyle();
    const current=modal.querySelector(".play-path-mission");
    const mission=MISSIONS[activeGapId];
    if(!mission){ current?.remove(); return; }
    const en=english();
    const signature=activeGapId+"|"+(en?"en":"el");
    if(current?.dataset.signature===signature) return;
    current?.remove();
    const card=document.createElement("section");
    card.className="play-path-mission";
    card.dataset.gapId=activeGapId;
    card.dataset.signature=signature;
    card.innerHTML=`
      <div class="play-path-mission__head"><span class="play-path-mission__icon" aria-hidden="true">🎮</span><div><span class="play-path-mission__eyebrow">${en?"Game practice":"Παιχνίδι εξάσκησης"}</span><h4>${en?mission.titleEn:mission.titleEl}</h4><p>${en?mission.descEn:mission.descEl}</p></div></div>
      <a class="play-path-mission__cta" href="${mission.href}">${en?"Play this mission →":"Παίξε αυτή την αποστολή →"}</a>`;
    const steps=modal.querySelector(".path-steps");
    if(steps) steps.insertAdjacentElement("afterend",card); else modal.appendChild(card);
  }

  function refresh(){ homeBridge(); pathMission(); }

  document.addEventListener("click",captureGap,true);
  document.addEventListener("click",e=>{
    const t=e.target instanceof Element?e.target.closest("#langEl,#langEn"):null;
    if(t) setTimeout(()=>{document.getElementById("playRouteBridge")?.remove();document.querySelectorAll(".play-inline-link").forEach(x=>x.remove());refresh();},60);
  });
  document.addEventListener("aitools4kids:heavy-loaded",()=>setTimeout(refresh,0));

  function start(){
    refresh();
    if("MutationObserver" in window){
      let scheduled=false;
      const obs=new MutationObserver(()=>{
        if(scheduled) return;
        scheduled=true;
        requestAnimationFrame(()=>{scheduled=false;refresh();});
      });
      obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["hidden"]});
      setTimeout(()=>obs.disconnect(),20000);
    }
    [300,900,1800,3500].forEach(ms=>setTimeout(refresh,ms));
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();