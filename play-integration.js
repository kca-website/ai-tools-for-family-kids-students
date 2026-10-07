/* Play & Learn integration bridge.
 * The game is an optional practice layer inside the existing learning flow:
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
      .play-home-route{margin:9px 0 2px;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;color:#63758a;font-size:12px;line-height:1.35}
      .play-home-route__badge{padding:2px 7px;border-radius:999px;background:#f2edff;color:#684bb6;font-size:10px;font-weight:900;letter-spacing:.03em;text-transform:uppercase}
      .play-home-route a,.play-inline-link{display:inline-flex;align-items:center;gap:5px;padding:6px 9px;border-radius:9px;background:#f7f4ff;color:#6548b4!important;text-decoration:none;font-size:12px;font-weight:800;border:1px solid #e4ddfa}
      .play-home-route a:hover,.play-inline-link:hover{background:#f0eaff}
      .play-path-mission{margin:14px 0 4px;padding:15px;border:1px solid #d8d0ff;border-radius:14px;background:linear-gradient(135deg,#faf8ff,#f1f8ff)}
      .play-path-mission__head{display:flex;gap:10px;align-items:flex-start}.play-path-mission__icon{font-size:26px;line-height:1}.play-path-mission__eyebrow{display:block;color:#7253c7;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.04em}.play-path-mission h4{margin:2px 0 4px;font-size:16px;color:#243c55}.play-path-mission p{margin:0;color:#5a7086;font-size:13px;line-height:1.45}.play-path-mission__cta{display:inline-flex;align-items:center;justify-content:center;min-height:40px;margin-top:11px;padding:9px 13px;border-radius:11px;background:#7253c7;color:#fff!important;text-decoration:none;font-weight:800;font-size:13px;box-shadow:0 6px 15px #7253c72b}
      @media(max-width:720px){.play-home-route{justify-content:flex-start;margin-top:12px}.play-home-route__text{flex:1 1 210px}}
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
      link.textContent=en?"🎮 Game practice":"🎮 Παιχνίδι εξάσκησης";
      pathCard.appendChild(link);
      document.getElementById("playHomeRoute")?.remove();
      return;
    }

    if(document.getElementById("playHomeRoute")) return;
    const anchor=document.querySelector(".hero__learning-loop");
    if(!anchor) return;
    const row=document.createElement("div");
    row.id="playHomeRoute";
    row.className="play-home-route";
    row.setAttribute("aria-label",en?"Game practice in AI Routes":"Παιχνίδι εξάσκησης στις AI Διαδρομές");
    row.innerHTML=en?`<span class="play-home-route__badge">Pilot</span><span class="play-home-route__text">AI Routes can now continue with a short game mission.</span><a href="/play/">🎮 Try a mission</a>`:`<span class="play-home-route__badge">Πιλοτικό</span><span class="play-home-route__text">Οι AI Διαδρομές μπορούν τώρα να συνεχιστούν με μια σύντομη αποστολή παιχνιδιού.</span><a href="/play/">🎮 Δοκίμασε μια αποστολή</a>`;
    anchor.insertAdjacentElement("afterend",row);
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
    if(!mission){current?.remove();return}
    const en=english();
    const signature=activeGapId+"|"+(en?"en":"el");
    if(current?.dataset.signature===signature) return;
    current?.remove();
    const card=document.createElement("section");
    card.className="play-path-mission";
    card.dataset.signature=signature;
    card.innerHTML=`<div class="play-path-mission__head"><span class="play-path-mission__icon" aria-hidden="true">🎮</span><div><span class="play-path-mission__eyebrow">${en?"Game practice":"Παιχνίδι εξάσκησης"}</span><h4>${en?mission.titleEn:mission.titleEl}</h4><p>${en?mission.descEn:mission.descEl}</p></div></div><a class="play-path-mission__cta" href="${mission.href}">${en?"Play this mission →":"Παίξε αυτή την αποστολή →"}</a>`;
    const steps=modal.querySelector(".path-steps");
    if(steps) steps.insertAdjacentElement("afterend",card); else modal.appendChild(card);
  }

  function refresh(){homeBridge();pathMission()}
  document.addEventListener("click",captureGap,true);
  document.addEventListener("click",e=>{
    const t=e.target instanceof Element?e.target.closest("#langEl,#langEn"):null;
    if(t) setTimeout(()=>{document.getElementById("playHomeRoute")?.remove();document.querySelectorAll(".play-inline-link").forEach(x=>x.remove());refresh()},60);
  });
  document.addEventListener("aitools4kids:heavy-loaded",()=>setTimeout(refresh,0));

  function start(){
    refresh();
    if("MutationObserver" in window){
      let scheduled=false;
      const obs=new MutationObserver(()=>{
        if(scheduled)return;
        scheduled=true;
        requestAnimationFrame(()=>{scheduled=false;refresh()});
      });
      obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["hidden"]});
      setTimeout(()=>obs.disconnect(),20000);
    }
    [300,900,1800,3500].forEach(ms=>setTimeout(refresh,ms));
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();