/* AI Tools 4 Kids: PWA/mobile layer v1.1.0 */
(function(){
  "use strict";

  let deferredInstallPrompt = null;
  let launchActionHandled = false;
  const DESKTOP_TITLE = "AI Tools for Family, Kids & Students";

  function isEnglish(){
    return !!document.getElementById("langEn")?.classList.contains("active");
  }

  function isStandalone(){
    return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
  }

  function isIos(){
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }

  function isMobileLike(){
    return window.matchMedia?.("(max-width: 820px)")?.matches || /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  }

  function routeContext(){
    const parts=location.pathname.split("/").filter(Boolean);
    return {
      zone:["primary","middle","high"].includes(parts[0]) ? parts[0] : null,
      role:["guardian","student"].includes(parts[1]) ? parts[1] : null,
      view:parts[2] || null
    };
  }

  function ensureHeadMetadata(){
    let manifest=document.querySelector('link[rel="manifest"]');
    if(!manifest){
      manifest=document.createElement("link");
      manifest.rel="manifest";
      manifest.href="/manifest.webmanifest";
      document.head.appendChild(manifest);
    }

    if(!document.querySelector('link[rel="icon"][href="/assets/icons/app-icon.svg"]')){
      const icon=document.createElement("link");
      icon.rel="icon";
      icon.type="image/svg+xml";
      icon.href="/assets/icons/app-icon.svg";
      document.head.appendChild(icon);
    }

    const metas={
      "application-name":"AI Tools 4 Kids",
      "mobile-web-app-capable":"yes",
      "apple-mobile-web-app-capable":"yes",
      "apple-mobile-web-app-status-bar-style":"default",
      "apple-mobile-web-app-title":"AI Tools 4 Kids"
    };
    Object.entries(metas).forEach(([name,content])=>{
      let meta=document.querySelector(`meta[name="${name}"]`);
      if(!meta){
        meta=document.createElement("meta");
        meta.name=name;
        document.head.appendChild(meta);
      }
      meta.content=content;
    });
  }

  function injectStyles(){
    if(document.getElementById("aitools4kidsPwaStyles")) return;
    const style=document.createElement("style");
    style.id="aitools4kidsPwaStyles";
    style.textContent=`
      .pwa-mobile-launcher{display:none;margin:14px 0 6px;padding:14px;border:1px solid #dbeafe;border-radius:16px;background:linear-gradient(135deg,#eff6ff,#f8fafc);}
      .pwa-mobile-launcher__title{margin:0 0 3px;font-size:1rem;font-weight:800;color:#1e293b;}
      .pwa-mobile-launcher__sub{margin:0 0 10px;font-size:.82rem;line-height:1.4;color:#64748b;}
      .pwa-mobile-launcher__grid{display:grid;grid-template-columns:1fr;gap:8px;}
      .pwa-mobile-action{width:100%;border:1px solid #dbeafe;background:#fff;color:#1e293b;border-radius:12px;padding:10px 8px;font:inherit;font-weight:750;cursor:pointer;text-decoration:none;box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:7px;text-align:center;}
      .pwa-mobile-action:active{transform:scale(.99);}
      .pwa-mobile-action__icon{font-size:1.15rem;line-height:1;}
      .pwa-install-row{display:none;margin-top:10px;padding-top:10px;border-top:1px solid #dbeafe;}
      .pwa-install-btn{width:100%;border:0;border-radius:12px;padding:11px 13px;background:#3B82C4;color:#fff;font:inherit;font-weight:800;cursor:pointer;}
      .pwa-install-note{display:none;margin:8px 0 0;padding:9px 10px;border-radius:10px;background:#fff;color:#475569;font-size:.8rem;line-height:1.4;border:1px solid #dbeafe;}
      .pwa-installed-badge{display:none;margin-top:8px;font-size:.78rem;color:#15803d;font-weight:700;text-align:center;}
      .pwa-bottom-nav{display:none;}
      .pwa-more-overlay{display:none;}
      .pwa-role-details summary::-webkit-details-marker{display:none;}

      @media (max-width:820px){
        body.pwa-mobile-ui .site-header__inner{
          display:flex!important;
          flex-direction:row!important;
          align-items:center!important;
          justify-content:space-between!important;
          gap:8px!important;
          padding-top:10px!important;
          padding-bottom:10px!important;
          min-height:0!important;
        }
        body.pwa-mobile-ui .site-title{
          margin:0!important;
          display:flex!important;
          align-items:center!important;
          gap:7px!important;
          flex:1 1 auto!important;
          min-width:0!important;
          font-size:1.05rem!important;
          line-height:1.1!important;
          white-space:nowrap!important;
        }
        body.pwa-mobile-ui .site-title span:last-child{
          overflow:hidden!important;
          text-overflow:ellipsis!important;
          white-space:nowrap!important;
        }
        body.pwa-mobile-ui .lang-toggle{
          flex:0 0 auto!important;
          margin:0!important;
        }
        body.pwa-mobile-ui .lang-toggle button{
          min-width:42px!important;
          padding:8px 9px!important;
        }

        body.pwa-mobile-ui #viewTabs{
          max-width:100%!important;
          overflow-x:auto!important;
          overflow-y:hidden!important;
          flex-wrap:nowrap!important;
          justify-content:flex-start!important;
          gap:8px!important;
          padding:2px 2px 8px!important;
          scrollbar-width:none!important;
          -webkit-overflow-scrolling:touch;
          scroll-snap-type:x proximity;
        }
        body.pwa-mobile-ui #viewTabs::-webkit-scrollbar{display:none;}
        body.pwa-mobile-ui #viewTabs .view-tab{
          flex:0 0 auto!important;
          scroll-snap-align:start;
          white-space:nowrap!important;
        }

        .pwa-mobile-launcher{display:block;}
        .pwa-mobile-launcher__grid{grid-template-columns:repeat(3,minmax(0,1fr));}
        .pwa-mobile-action{min-height:74px;flex-direction:column;gap:5px;font-size:.82rem;line-height:1.18;}

        #roleContextGuide.pwa-role-guide--compact{
          margin:8px 0 12px!important;
          padding:0!important;
          border:1px solid #e2e8f0!important;
          border-radius:12px!important;
          background:#f8fafc!important;
          overflow:hidden!important;
          font-size:.84rem!important;
          line-height:1.42!important;
        }
        #roleContextGuide .pwa-role-details>summary{
          cursor:pointer;
          list-style:none;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          padding:11px 12px;
          font-weight:800;
          color:#334155;
        }
        #roleContextGuide .pwa-role-summary-more{
          flex:0 0 auto;
          color:#28745f;
          font-size:.76rem;
          font-weight:700;
        }
        #roleContextGuide .pwa-role-details[open]>summary{border-bottom:1px solid #e2e8f0;}
        #roleContextGuide .pwa-role-detail-body{padding:11px 12px 12px;color:#475569;}
        #roleContextGuide .pwa-role-detail-body p{margin:0 0 8px;}
        #roleContextGuide .pwa-role-detail-body p:last-child{margin-bottom:0;}

        body.pwa-standalone #zoneSelectView .hero__quiz-cta-wrap,
        body.pwa-standalone #zoneSelectView .hero__ai-help{display:none!important;}
        body.pwa-standalone #viewTabs{display:none!important;}
        body.pwa-has-bottom-nav{padding-bottom:calc(78px + env(safe-area-inset-bottom,0px));}
        body.pwa-standalone.pwa-in-path .pwa-bottom-nav{
          position:fixed;
          z-index:1500;
          left:0;
          right:0;
          bottom:0;
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:2px;
          padding:7px 8px calc(7px + env(safe-area-inset-bottom,0px));
          background:rgba(255,255,255,.97);
          border-top:1px solid #e2e8f0;
          box-shadow:0 -6px 24px rgba(15,23,42,.08);
          backdrop-filter:blur(12px);
        }
        .pwa-bottom-nav__btn{
          border:0;
          background:transparent;
          color:#64748b;
          border-radius:10px;
          min-height:54px;
          padding:5px 3px;
          font:inherit;
          font-size:.72rem;
          font-weight:750;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:2px;
          cursor:pointer;
        }
        .pwa-bottom-nav__btn span:first-child{font-size:1.18rem;line-height:1;}
        .pwa-bottom-nav__btn.is-active{background:#ecfdf5;color:#176b55;}

        .pwa-more-overlay{
          position:fixed;
          z-index:1700;
          inset:0;
          background:rgba(15,23,42,.38);
          align-items:flex-end;
          justify-content:center;
          padding:12px;
        }
        .pwa-more-overlay.is-open{display:flex;}
        .pwa-more-sheet{
          width:min(100%,520px);
          background:#fff;
          border-radius:18px;
          padding:10px 12px calc(12px + env(safe-area-inset-bottom,0px));
          box-shadow:0 20px 60px rgba(15,23,42,.25);
        }
        .pwa-more-sheet__handle{width:44px;height:4px;border-radius:99px;background:#cbd5e1;margin:2px auto 10px;}
        .pwa-more-sheet__title{margin:0 0 9px;font-weight:800;color:#1e293b;font-size:.95rem;}
        .pwa-more-sheet__btn{
          width:100%;
          border:0;
          background:#f8fafc;
          color:#334155;
          border-radius:12px;
          padding:12px;
          margin:5px 0;
          text-align:left;
          font:inherit;
          font-weight:750;
          cursor:pointer;
        }
        .pwa-more-sheet__close{
          width:100%;
          border:0;
          background:transparent;
          color:#64748b;
          padding:10px;
          font:inherit;
          font-weight:700;
          cursor:pointer;
        }
      }

      @media (max-width:350px){
        .pwa-mobile-launcher__grid{grid-template-columns:1fr;}
        .pwa-mobile-action{min-height:0;flex-direction:row;font-size:.86rem;}
      }

      @media (display-mode:standalone){
        .pwa-install-row{display:none!important;}
        .pwa-installed-badge{display:block;}
      }
    `;
    document.head.appendChild(style);
  }

  function applyMobileShell(){
    const mobile=isMobileLike();
    document.body?.classList.toggle("pwa-mobile-ui",mobile);
    document.body?.classList.toggle("pwa-standalone",mobile && isStandalone());
    const title=document.getElementById("siteTitleText");
    if(title) title.textContent=mobile ? "AI Tools 4 Kids" : DESKTOP_TITLE;
  }

  function ensureLauncher(){
    if(!isMobileLike()) return;
    const zoneView=document.getElementById("zoneSelectView");
    const hero=zoneView?.querySelector(".hero");
    if(!hero) return;

    let launcher=document.getElementById("pwaMobileLauncher");
    if(!launcher){
      launcher=document.createElement("section");
      launcher.id="pwaMobileLauncher";
      launcher.className="pwa-mobile-launcher";
    }

    const badges=hero.querySelector(".hero__badges");
    if(badges && launcher.previousElementSibling!==badges){
      badges.insertAdjacentElement("afterend",launcher);
    }else if(!launcher.isConnected){
      hero.prepend(launcher);
    }

    const en=isEnglish();
    const signature=en ? "en" : "el";
    if(launcher.dataset.signature===signature){
      refreshInstallUi();
      return;
    }
    launcher.dataset.signature=signature;

    launcher.innerHTML=en ? `
      <p class="pwa-mobile-launcher__title">What do you want to do now?</p>
      <p class="pwa-mobile-launcher__sub">Choose one quick way to start.</p>
      <div class="pwa-mobile-launcher__grid">
        <button type="button" class="pwa-mobile-action" data-pwa-action="quiz"><span class="pwa-mobile-action__icon">🧭</span><span>Quick test</span></button>
        <button type="button" class="pwa-mobile-action" data-pwa-action="tools"><span class="pwa-mobile-action__icon">🧰</span><span>Find a tool</span></button>
        <button type="button" class="pwa-mobile-action" data-pwa-action="help"><span class="pwa-mobile-action__icon">🤖</span><span>AI Help</span></button>
      </div>
      <div class="pwa-install-row" id="pwaInstallRow">
        <button type="button" class="pwa-install-btn" id="pwaInstallBtn">📲 Add AI Tools 4 Kids to your phone</button>
        <p class="pwa-install-note" id="pwaInstallNote"></p>
      </div>
      <div class="pwa-installed-badge">✓ Opened as an installed app</div>
    ` : `
      <p class="pwa-mobile-launcher__title">Τι θέλεις να κάνεις τώρα;</p>
      <p class="pwa-mobile-launcher__sub">Διάλεξε έναν γρήγορο τρόπο για να ξεκινήσεις.</p>
      <div class="pwa-mobile-launcher__grid">
        <button type="button" class="pwa-mobile-action" data-pwa-action="quiz"><span class="pwa-mobile-action__icon">🧭</span><span>Γρήγορο τεστ</span></button>
        <button type="button" class="pwa-mobile-action" data-pwa-action="tools"><span class="pwa-mobile-action__icon">🧰</span><span>Βρες εργαλείο</span></button>
        <button type="button" class="pwa-mobile-action" data-pwa-action="help"><span class="pwa-mobile-action__icon">🤖</span><span>AI Βοήθεια</span></button>
      </div>
      <div class="pwa-install-row" id="pwaInstallRow">
        <button type="button" class="pwa-install-btn" id="pwaInstallBtn">📲 Βάλε το AI Tools 4 Kids στο κινητό</button>
        <p class="pwa-install-note" id="pwaInstallNote"></p>
      </div>
      <div class="pwa-installed-badge">✓ Άνοιξε ως εγκατεστημένη εφαρμογή</div>
    `;

    bindLauncherActions();
    refreshInstallUi();
  }

  function bindLauncherActions(){
    const launcher=document.getElementById("pwaMobileLauncher");
    if(!launcher) return;
    launcher.querySelector('[data-pwa-action="quiz"]')?.addEventListener("click",()=>openQuickAction("quiz"));
    launcher.querySelector('[data-pwa-action="tools"]')?.addEventListener("click",()=>openQuickAction("tools"));
    launcher.querySelector('[data-pwa-action="help"]')?.addEventListener("click",()=>openQuickAction("help"));
    launcher.querySelector("#pwaInstallBtn")?.addEventListener("click",installApp);
  }

  function openQuickAction(action){
    if(action==="quiz"){
      const btn=document.getElementById("heroQuizCtaBtn");
      if(btn){
        btn.click();
        setTimeout(()=>document.getElementById("heroQuizPicker")?.scrollIntoView({behavior:"smooth",block:"center"}),80);
      }
      return;
    }
    if(action==="tools"){
      document.getElementById("zoneGrid")?.scrollIntoView({behavior:"smooth",block:"start"});
      return;
    }
    if(action==="help"){
      const help=document.querySelector(".hero__ai-help");
      if(help && getComputedStyle(help).display!=="none") help.scrollIntoView({behavior:"smooth",block:"center"});
      else document.getElementById("zoneGrid")?.scrollIntoView({behavior:"smooth",block:"start"});
    }
  }

  function handleLaunchAction(){
    if(launchActionHandled) return;
    const action=new URLSearchParams(location.search).get("action");
    if(!["quiz","tools","help"].includes(action)) return;
    launchActionHandled=true;
    setTimeout(()=>openQuickAction(action),100);
  }

  function ensureCompactRoleGuide(){
    if(!isMobileLike()) return;
    const box=document.getElementById("roleContextGuide");
    if(!box) return;
    const {zone,role}=routeContext();
    if(!zone || !role) return;

    const en=isEnglish();
    const guardian=role==="guardian";
    const primaryStudent=zone==="primary" && !guardian;
    const sig=[en,zone,role].join("|");
    if(box.dataset.pwaSignature===sig && box.querySelector(".pwa-role-details")) return;

    box.dataset.pwaSignature=sig;
    box.classList.add("pwa-role-guide--compact");

    const title=en
      ? (guardian ? "👪 Parent / Educator view" : "🎒 Student view")
      : (guardian ? "👪 Προβολή Γονιού / Εκπαιδευτικού" : "🎒 Προβολή Μαθητή");
    const summary=en ? "What does this mean?" : "Τι σημαίνει αυτό;";
    const mainText=en
      ? (guardian
          ? "These recommendations are for you to use while supporting the learner. Services with higher age limits may appear only as adult-operated options."
          : "Recommendations are filtered for the learner’s age zone. Extra consent, parent use or school-account requirements are shown explicitly.")
      : (guardian
          ? "Οι προτάσεις είναι για να τις χρησιμοποιήσεις εσύ βοηθώντας τον μαθητή. Εργαλεία με μεγαλύτερο ηλικιακό όριο εμφανίζονται μόνο ως επιλογές που χειρίζεται ο ενήλικας."
          : "Οι προτάσεις φιλτράρονται για την ηλικιακή ζώνη του μαθητή. Όπου χρειάζεται γονέας, συναίνεση ή σχολικός λογαριασμός, το γράφουμε καθαρά.");
    const aiText=en
      ? (primaryStudent
          ? "For Primary students, AI Help is used through the Parent Helper with an adult."
          : "AI Help guides with questions and hints instead of giving a ready-made answer.")
      : (primaryStudent
          ? "Στο Δημοτικό η AI Βοήθεια χρησιμοποιείται μέσω του Βοηθού Γονέα, μαζί με ενήλικα."
          : "Η AI Βοήθεια καθοδηγεί με ερωτήσεις και υποδείξεις αντί να δίνει έτοιμη απάντηση.");
    const quick=en
      ? "<strong>Quick guide:</strong> Tools = recommendations · Diagnostic Map = what needs practice · AI Help = guided support."
      : "<strong>Γρήγορα:</strong> Εργαλεία = προτάσεις · Διαγνωστικός = τι θέλει εξάσκηση · AI Βοήθεια = καθοδήγηση.";

    box.innerHTML=`
      <details class="pwa-role-details">
        <summary><span>${title}</span><span class="pwa-role-summary-more">${summary} ▾</span></summary>
        <div class="pwa-role-detail-body">
          <p>${mainText}</p>
          <p>${aiText}</p>
          <p>${quick}</p>
        </div>
      </details>
    `;
  }

  function clickView(view){
    const ids={tools:"viewTabTools",quiz:"viewTabQuiz",tutor:"viewTabTutor",advanced:"viewTabAdvanced",prompts:"viewTabPrompts",guide:"viewTabGuide"};
    const {zone,role}=routeContext();
    if(view==="tutor" && zone==="primary" && role==="student"){
      location.href="/primary/guardian/tutor";
      return;
    }
    const btn=document.getElementById(ids[view]);
    if(btn && !btn.hidden) btn.click();
  }

  function closeMoreSheet(){
    document.getElementById("pwaMoreOverlay")?.classList.remove("is-open");
  }

  function openMoreSheet(){
    document.getElementById("pwaMoreOverlay")?.classList.add("is-open");
  }

  function ensureMoreSheet(){
    if(!isMobileLike() || !isStandalone()) return;
    let overlay=document.getElementById("pwaMoreOverlay");
    if(!overlay){
      overlay=document.createElement("div");
      overlay.id="pwaMoreOverlay";
      overlay.className="pwa-more-overlay";
      document.body.appendChild(overlay);
      overlay.addEventListener("click",(event)=>{ if(event.target===overlay) closeMoreSheet(); });
    }

    const en=isEnglish();
    const sig=en ? "en" : "el";
    if(overlay.dataset.signature===sig) return;
    overlay.dataset.signature=sig;
    overlay.innerHTML=en ? `
      <div class="pwa-more-sheet" role="dialog" aria-modal="true" aria-label="More">
        <div class="pwa-more-sheet__handle"></div>
        <p class="pwa-more-sheet__title">More</p>
        <button type="button" class="pwa-more-sheet__btn" data-pwa-view="advanced">⚙️ Advanced tools</button>
        <button type="button" class="pwa-more-sheet__btn" data-pwa-view="prompts">✍️ Prompt Generator</button>
        <button type="button" class="pwa-more-sheet__btn" data-pwa-view="guide">📘 Guide</button>
        <button type="button" class="pwa-more-sheet__close">Close</button>
      </div>
    ` : `
      <div class="pwa-more-sheet" role="dialog" aria-modal="true" aria-label="Περισσότερα">
        <div class="pwa-more-sheet__handle"></div>
        <p class="pwa-more-sheet__title">Περισσότερα</p>
        <button type="button" class="pwa-more-sheet__btn" data-pwa-view="advanced">⚙️ Προχωρημένα εργαλεία</button>
        <button type="button" class="pwa-more-sheet__btn" data-pwa-view="prompts">✍️ Prompt Generator</button>
        <button type="button" class="pwa-more-sheet__btn" data-pwa-view="guide">📘 Οδηγός</button>
        <button type="button" class="pwa-more-sheet__close">Κλείσιμο</button>
      </div>
    `;

    overlay.querySelectorAll("[data-pwa-view]").forEach((btn)=>{
      btn.addEventListener("click",()=>{
        closeMoreSheet();
        clickView(btn.dataset.pwaView);
      });
    });
    overlay.querySelector(".pwa-more-sheet__close")?.addEventListener("click",closeMoreSheet);
  }

  function ensureBottomNav(){
    const pathView=document.getElementById("pathView");
    const activePath=!!pathView && !pathView.hidden;
    const enabled=isMobileLike() && isStandalone() && activePath;
    document.body?.classList.toggle("pwa-in-path",enabled);
    document.body?.classList.toggle("pwa-has-bottom-nav",enabled);

    let nav=document.getElementById("pwaBottomNav");
    if(!enabled){
      if(nav) nav.hidden=true;
      return;
    }
    if(!nav){
      nav=document.createElement("nav");
      nav.id="pwaBottomNav";
      nav.className="pwa-bottom-nav";
      nav.setAttribute("aria-label","Mobile navigation");
      document.body.appendChild(nav);
    }
    nav.hidden=false;

    const en=isEnglish();
    const {view}=routeContext();
    const moreActive=["advanced","prompts","guide"].includes(view);
    const sig=[en,view].join("|");
    if(nav.dataset.signature===sig) return;
    nav.dataset.signature=sig;

    nav.innerHTML=`
      <button type="button" class="pwa-bottom-nav__btn ${view==="tools"?"is-active":""}" data-pwa-view="tools"><span>🧰</span><span>${en?"Tools":"Εργαλεία"}</span></button>
      <button type="button" class="pwa-bottom-nav__btn ${view==="quiz"?"is-active":""}" data-pwa-view="quiz"><span>🧭</span><span>${en?"Test":"Τεστ"}</span></button>
      <button type="button" class="pwa-bottom-nav__btn ${view==="tutor"?"is-active":""}" data-pwa-view="tutor"><span>🤖</span><span>${en?"AI Help":"AI Βοήθεια"}</span></button>
      <button type="button" class="pwa-bottom-nav__btn ${moreActive?"is-active":""}" data-pwa-more="1"><span>•••</span><span>${en?"More":"Άλλα"}</span></button>
    `;
    nav.querySelectorAll("[data-pwa-view]").forEach((btn)=>{ btn.addEventListener("click",()=>clickView(btn.dataset.pwaView)); });
    nav.querySelector("[data-pwa-more]")?.addEventListener("click",openMoreSheet);
  }

  function refreshInstallUi(){
    const row=document.getElementById("pwaInstallRow");
    if(!row) return;
    if(isStandalone()){
      row.style.display="none";
      return;
    }
    row.style.display=(deferredInstallPrompt || isIos()) ? "block" : "none";
  }

  async function installApp(){
    const note=document.getElementById("pwaInstallNote");
    const en=isEnglish();
    if(deferredInstallPrompt){
      deferredInstallPrompt.prompt();
      const choice=await deferredInstallPrompt.userChoice;
      if(choice?.outcome==="accepted"){
        deferredInstallPrompt=null;
        refreshInstallUi();
      }else if(note){
        note.textContent=en ? "You can install it later from your browser menu." : "Μπορείς να το εγκαταστήσεις αργότερα από το μενού του browser.";
        note.style.display="block";
      }
      return;
    }
    if(note){
      note.textContent=isIos()
        ? (en ? "On iPhone/iPad: Safari → Share → Add to Home Screen." : "Σε iPhone/iPad: Safari → Κοινοποίηση → Προσθήκη στην οθόνη Αφετηρίας.")
        : (en ? "Open your browser menu and choose Install app / Add to Home screen, if available." : "Άνοιξε το μενού του browser και επίλεξε Εγκατάσταση εφαρμογής / Προσθήκη στην αρχική οθόνη, αν εμφανίζεται.");
      note.style.display="block";
    }
  }

  function registerServiceWorker(){
    if(!("serviceWorker" in navigator) || !window.isSecureContext) return;
    const register=()=>navigator.serviceWorker.register("/service-worker.js",{scope:"/"}).catch((err)=>{ console.warn("PWA service worker registration failed",err); });
    if(document.readyState==="complete") register();
    else window.addEventListener("load",register,{once:true});
  }

  window.addEventListener("beforeinstallprompt",(event)=>{
    event.preventDefault();
    deferredInstallPrompt=event;
    refreshInstallUi();
  });
  window.addEventListener("appinstalled",()=>{
    deferredInstallPrompt=null;
    refreshInstallUi();
  });

  function refresh(){
    ensureHeadMetadata();
    injectStyles();
    applyMobileShell();
    ensureLauncher();
    ensureCompactRoleGuide();
    ensureMoreSheet();
    ensureBottomNav();
    handleLaunchAction();
  }

  ensureHeadMetadata();
  injectStyles();
  registerServiceWorker();
  queueMicrotask(refresh);
  document.addEventListener("DOMContentLoaded",refresh);
  window.addEventListener("popstate",()=>setTimeout(refresh,0));
  window.addEventListener("resize",()=>setTimeout(refresh,40));
  document.addEventListener("click",(event)=>{
    const target=event.target instanceof Element ? event.target : null;
    if(!target) return;
    if(target.closest("#roleTabs .role-tab, .zone-card, #backToZones, #viewTabs .view-tab")) setTimeout(refresh,0);
  });
  document.getElementById("langEl")?.addEventListener("click",()=>setTimeout(refresh,0));
  document.getElementById("langEn")?.addEventListener("click",()=>setTimeout(refresh,0));
})();
