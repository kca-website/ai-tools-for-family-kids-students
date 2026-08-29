/* AI Tools 4 Kids — lightweight PWA/mobile layer v1.0.1 */
(function(){
  "use strict";

  let deferredInstallPrompt = null;
  const INSTALL_DISMISS_KEY = "aitools4kids_pwa_install_dismissed_v1";

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
      .pwa-mobile-launcher{display:none;margin:18px 0 2px;padding:16px;border:1px solid #dbeafe;border-radius:16px;background:linear-gradient(135deg,#eff6ff,#f8fafc);}
      .pwa-mobile-launcher__title{margin:0 0 4px;font-size:1.05rem;font-weight:800;color:#1e293b;}
      .pwa-mobile-launcher__sub{margin:0 0 12px;font-size:.86rem;line-height:1.45;color:#64748b;}
      .pwa-mobile-launcher__grid{display:grid;grid-template-columns:1fr;gap:9px;}
      .pwa-mobile-action{width:100%;border:1px solid #dbeafe;background:#fff;color:#1e293b;border-radius:12px;padding:12px 13px;font:inherit;font-weight:750;text-align:left;cursor:pointer;text-decoration:none;box-sizing:border-box;display:flex;align-items:center;gap:10px;}
      .pwa-mobile-action:active{transform:scale(.99);}
      .pwa-mobile-action__icon{font-size:1.2rem;width:26px;text-align:center;}
      .pwa-install-row{display:none;margin-top:11px;padding-top:11px;border-top:1px solid #dbeafe;}
      .pwa-install-btn{width:100%;border:0;border-radius:12px;padding:12px 14px;background:#3B82C4;color:#fff;font:inherit;font-weight:800;cursor:pointer;}
      .pwa-install-note{display:none;margin:9px 0 0;padding:10px 11px;border-radius:10px;background:#fff;color:#475569;font-size:.82rem;line-height:1.45;border:1px solid #dbeafe;}
      .pwa-installed-badge{display:none;margin-top:9px;font-size:.8rem;color:#15803d;font-weight:700;}
      @media (max-width:820px){
        .pwa-mobile-launcher{display:block;}
        .pwa-mobile-launcher__grid{grid-template-columns:1fr;}
      }
      @media (min-width:540px) and (max-width:820px){
        .pwa-mobile-launcher__grid{grid-template-columns:repeat(3,1fr);}
        .pwa-mobile-action{min-height:78px;flex-direction:column;justify-content:center;text-align:center;gap:5px;}
      }
      @media (display-mode:standalone){
        .pwa-install-row{display:none!important;}
        .pwa-installed-badge{display:block;}
      }
    `;
    document.head.appendChild(style);
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
      const aiHelp=hero.querySelector(".hero__ai-help");
      if(aiHelp) aiHelp.insertAdjacentElement("afterend",launcher);
      else hero.appendChild(launcher);
    }

    const en=isEnglish();
    const signature=en ? "en" : "el";
    if(launcher.dataset.signature===signature) return;
    launcher.dataset.signature=signature;

    launcher.innerHTML=en ? `
      <p class="pwa-mobile-launcher__title">What do you want to do now?</p>
      <p class="pwa-mobile-launcher__sub">Three quick ways to start on mobile.</p>
      <div class="pwa-mobile-launcher__grid">
        <button type="button" class="pwa-mobile-action" data-pwa-action="quiz"><span class="pwa-mobile-action__icon">🧭</span><span>Take a quick test</span></button>
        <button type="button" class="pwa-mobile-action" data-pwa-action="tools"><span class="pwa-mobile-action__icon">🧰</span><span>Find a tool</span></button>
        <button type="button" class="pwa-mobile-action" data-pwa-action="help"><span class="pwa-mobile-action__icon">🤖</span><span>Open AI Help</span></button>
      </div>
      <div class="pwa-install-row" id="pwaInstallRow">
        <button type="button" class="pwa-install-btn" id="pwaInstallBtn">📲 Add AI Tools 4 Kids to your phone</button>
        <p class="pwa-install-note" id="pwaInstallNote"></p>
      </div>
      <div class="pwa-installed-badge">✓ Opened as an installed app</div>
    ` : `
      <p class="pwa-mobile-launcher__title">Τι θέλεις να κάνεις τώρα;</p>
      <p class="pwa-mobile-launcher__sub">Τρεις γρήγοροι τρόποι για να ξεκινήσεις από το κινητό.</p>
      <div class="pwa-mobile-launcher__grid">
        <button type="button" class="pwa-mobile-action" data-pwa-action="quiz"><span class="pwa-mobile-action__icon">🧭</span><span>Κάνε ένα γρήγορο τεστ</span></button>
        <button type="button" class="pwa-mobile-action" data-pwa-action="tools"><span class="pwa-mobile-action__icon">🧰</span><span>Βρες εργαλείο</span></button>
        <button type="button" class="pwa-mobile-action" data-pwa-action="help"><span class="pwa-mobile-action__icon">🤖</span><span>Άνοιξε την AI Βοήθεια</span></button>
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

    launcher.querySelector('[data-pwa-action="quiz"]')?.addEventListener("click",()=>{
      const btn=document.getElementById("heroQuizCtaBtn");
      if(btn){ btn.click(); setTimeout(()=>document.getElementById("heroQuizPicker")?.scrollIntoView({behavior:"smooth",block:"center"}),80); }
    });
    launcher.querySelector('[data-pwa-action="tools"]')?.addEventListener("click",()=>{
      document.getElementById("zoneGrid")?.scrollIntoView({behavior:"smooth",block:"start"});
    });
    launcher.querySelector('[data-pwa-action="help"]')?.addEventListener("click",()=>{
      document.querySelector(".hero__ai-help")?.scrollIntoView({behavior:"smooth",block:"center"});
    });
    launcher.querySelector("#pwaInstallBtn")?.addEventListener("click",installApp);
  }

  function wasDismissed(){
    try{return sessionStorage.getItem(INSTALL_DISMISS_KEY)==="1";}catch(_e){return false;}
  }

  function refreshInstallUi(){
    const row=document.getElementById("pwaInstallRow");
    if(!row) return;
    if(isStandalone() || wasDismissed()){
      row.style.display="none";
      return;
    }
    // Android/Chromium: native prompt appears when beforeinstallprompt fires.
    // iOS: show our button and explain Safari's Add to Home Screen flow on tap.
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
        ? (en ? "On iPhone/iPad: open this page in Safari → tap Share → Add to Home Screen." : "Σε iPhone/iPad: άνοιξε τη σελίδα στο Safari → πάτησε Κοινοποίηση → Προσθήκη στην οθόνη Αφετηρίας.")
        : (en ? "Open your browser menu and choose Install app / Add to Home screen, if available." : "Άνοιξε το μενού του browser και επίλεξε Εγκατάσταση εφαρμογής / Προσθήκη στην αρχική οθόνη, αν εμφανίζεται.");
      note.style.display="block";
    }
  }

  function registerServiceWorker(){
    if(!("serviceWorker" in navigator) || !window.isSecureContext) return;
    const register=()=>navigator.serviceWorker.register("/service-worker.js",{scope:"/"}).catch((err)=>{
      console.warn("PWA service worker registration failed",err);
    });
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
    ensureLauncher();
  }

  ensureHeadMetadata();
  injectStyles();
  registerServiceWorker();
  queueMicrotask(refresh);
  document.addEventListener("DOMContentLoaded",refresh);
  document.getElementById("langEl")?.addEventListener("click",()=>setTimeout(refresh,0));
  document.getElementById("langEn")?.addEventListener("click",()=>setTimeout(refresh,0));
})();
