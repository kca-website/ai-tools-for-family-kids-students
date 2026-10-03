/* Header menu for the homepage/app shell (index.html).
 * Presentation only: opens/closes the "Menu" panel and keeps its aria labels
 * in the active language. It does not touch routing, i18n state or app views.
 */
(function(){
  "use strict";

  const ARIA = {
    el: { navLabel: "Κύριο μενού", navAllLabel: "Όλες οι ενότητες", footerNavLabel: "Χρήσιμοι σύνδεσμοι" },
    en: { navLabel: "Main menu", navAllLabel: "All sections", footerNavLabel: "Useful links" }
  };

  function lang(){
    return (document.documentElement.lang || "el").toLowerCase().startsWith("en") ? "en" : "el";
  }

  function syncAriaLabels(){
    const copy = ARIA[lang()];
    document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
      const value = copy[node.getAttribute("data-i18n-aria")];
      if(value) node.setAttribute("aria-label", value);
    });
  }

  function ensureAiPathsStyles(){
    if(document.getElementById("homeAiPathsPromoStyles")) return;
    const style=document.createElement("style");
    style.id="homeAiPathsPromoStyles";
    style.textContent=`
      .home-ai-paths-promo{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(230px,.55fr);gap:28px;align-items:center;margin:34px 0 0;padding:28px 30px;border:1px solid #cfe1ea;border-radius:22px;background:linear-gradient(135deg,#f4fbff 0%,#f7f5ff 100%);overflow:hidden;position:relative}
      .home-ai-paths-promo__copy{min-width:0}.home-ai-paths-promo__badges{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:9px}.home-ai-paths-promo__badge{display:inline-flex;align-items:center;padding:4px 9px;border-radius:999px;background:#1d5d8c;color:#fff;font-size:.72rem;font-weight:800}.home-ai-paths-promo__badge--free{background:#e9f7ef;color:#206246}
      .home-ai-paths-promo h2{margin:0 0 8px;font-family:var(--font-heading,system-ui);font-size:clamp(1.45rem,2.4vw,2rem);line-height:1.18;color:#17202b}.home-ai-paths-promo p{max-width:650px;margin:0 0 15px;color:#475569;font-size:.96rem;line-height:1.55}
      .home-ai-paths-promo__examples{display:flex;flex-wrap:wrap;gap:7px;margin:0 0 17px}.home-ai-paths-promo__examples span{padding:7px 10px;border:1px solid #d8e4ec;border-radius:10px;background:#fff;color:#334155;font-size:.78rem;font-weight:650}
      .home-ai-paths-promo__cta{display:inline-flex;align-items:center;gap:8px;min-height:46px;padding:0 17px;border-radius:12px;background:#1d5d8c;color:#fff!important;font-weight:800;text-decoration:none}.home-ai-paths-promo__cta:hover{background:#164a70}.home-ai-paths-promo__cta:focus-visible{outline:3px solid #f59e0b;outline-offset:3px}
      .home-ai-paths-promo__visual{min-height:190px;display:grid;place-items:center;position:relative}.home-ai-paths-promo__orbit{position:absolute;width:170px;height:170px;border:1px dashed #9ebfd2;border-radius:50%;animation:homeAiOrbit 14s linear infinite}.home-ai-paths-promo__orbit:before,.home-ai-paths-promo__orbit:after{content:"";position:absolute;width:10px;height:10px;border-radius:50%;background:#45a778;top:17px;left:31px}.home-ai-paths-promo__orbit:after{background:#7659b7;top:auto;left:auto;right:20px;bottom:30px}
      .home-ai-paths-promo__bot{position:relative;width:108px;height:92px;border-radius:30px;background:linear-gradient(145deg,#2f83bc,#174e78);box-shadow:0 15px 32px rgba(29,93,140,.2);display:grid;place-items:center;animation:homeAiFloat 3s ease-in-out infinite}.home-ai-paths-promo__bot:before{content:"";position:absolute;top:-22px;width:4px;height:25px;border-radius:3px;background:#214e6d}.home-ai-paths-promo__bot:after{content:"";position:absolute;top:-29px;width:11px;height:11px;border-radius:50%;background:#45b27d;box-shadow:0 0 0 6px rgba(69,178,125,.12)}
      .home-ai-paths-promo__face{width:70px;height:43px;border-radius:17px;background:#f7fbff;position:relative}.home-ai-paths-promo__eye{position:absolute;top:13px;width:10px;height:10px;border-radius:50%;background:#173d55;animation:homeAiBlink 4s infinite}.home-ai-paths-promo__eye--l{left:17px}.home-ai-paths-promo__eye--r{right:17px}.home-ai-paths-promo__mouth{position:absolute;left:26px;bottom:7px;width:19px;height:7px;border-bottom:3px solid #2d6b92;border-radius:50%}
      .home-ai-paths-promo__bubble{position:absolute;right:-3px;top:4px;max-width:124px;padding:8px 10px;border:1px solid #dce6ed;border-radius:12px 12px 12px 4px;background:#fff;box-shadow:0 8px 20px rgba(27,57,79,.09);font-size:.7rem;font-weight:750;line-height:1.35;animation:homeAiBob 4s ease-in-out infinite}
      @keyframes homeAiFloat{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-8px) rotate(1deg)}}@keyframes homeAiOrbit{to{transform:rotate(360deg)}}@keyframes homeAiBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes homeAiBlink{0%,46%,52%,100%{transform:scaleY(1)}49%{transform:scaleY(.12)}}
      @media(max-width:760px){.home-ai-paths-promo{grid-template-columns:1fr;padding:22px 20px;gap:14px}.home-ai-paths-promo__visual{min-height:165px;order:-1}.home-ai-paths-promo__examples{display:grid;grid-template-columns:1fr}.home-ai-paths-promo__cta{width:100%;justify-content:center}}
      @media(prefers-reduced-motion:reduce){.home-ai-paths-promo *{animation:none!important;transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function ensureAiPathsPromo(){
    if(location.pathname!=="/" && location.pathname!=="") return;
    const shell=document.getElementById("homeV8Shell");
    const more=document.getElementById("homeV9More");
    if(!shell || !more) return;
    ensureAiPathsStyles();
    let section=document.getElementById("homeAiPathsPromo");
    if(!section){
      section=document.createElement("section");
      section.id="homeAiPathsPromo";
      section.className="home-ai-paths-promo";
      section.setAttribute("aria-labelledby","homeAiPathsPromoTitle");
    }
    const currentLang=lang();
    const en=currentLang==="en";
    if(section.dataset.lang!==currentLang){
      section.dataset.lang=currentLang;
      section.innerHTML=en ? `
        <div class="home-ai-paths-promo__copy">
          <div class="home-ai-paths-promo__badges"><span class="home-ai-paths-promo__badge">New · AI Paths</span><span class="home-ai-paths-promo__badge home-ai-paths-promo__badge--free">Free</span></div>
          <h2 id="homeAiPathsPromoTitle">Can you tell when AI is wrong?</h2>
          <p>Enter realistic situations with AI answers, suspicious messages, viral images and schoolwork. Decide what you would do, then learn how to verify it.</p>
          <div class="home-ai-paths-promo__examples" aria-label="Example situations"><span>“AI sounds completely certain. Do you trust it?”</span><span>“Your account closes in 10 minutes. Click now?”</span></div>
          <a class="home-ai-paths-promo__cta" href="/ai-scenarios.html">Start an AI Path <span aria-hidden="true">→</span></a>
        </div>
        <div class="home-ai-paths-promo__visual" aria-hidden="true"><div class="home-ai-paths-promo__orbit"></div><div class="home-ai-paths-promo__bot"><div class="home-ai-paths-promo__face"><i class="home-ai-paths-promo__eye home-ai-paths-promo__eye--l"></i><i class="home-ai-paths-promo__eye home-ai-paths-promo__eye--r"></i><i class="home-ai-paths-promo__mouth"></i></div></div><div class="home-ai-paths-promo__bubble">Notice → Decide → Verify</div></div>` : `
        <div class="home-ai-paths-promo__copy">
          <div class="home-ai-paths-promo__badges"><span class="home-ai-paths-promo__badge">Νέο · AI Διαδρομές</span><span class="home-ai-paths-promo__badge home-ai-paths-promo__badge--free">Δωρεάν</span></div>
          <h2 id="homeAiPathsPromoTitle">Ξέρεις πότε το AI κάνει λάθος;</h2>
          <p>Μπες σε πραγματικές καταστάσεις με AI απαντήσεις, ύποπτα μηνύματα, viral εικόνες και σχολικές εργασίες. Δες τι θα έκανες και μάθε πώς να το ελέγχεις.</p>
          <div class="home-ai-paths-promo__examples" aria-label="Παραδείγματα καταστάσεων"><span>«Το AI ακούγεται απόλυτα σίγουρο. Το πιστεύεις;»</span><span>«Ο λογαριασμός σου κλείνει σε 10 λεπτά. Πατάς;»</span></div>
          <a class="home-ai-paths-promo__cta" href="/ai-scenarios.html">Ξεκίνα μια AI Διαδρομή <span aria-hidden="true">→</span></a>
        </div>
        <div class="home-ai-paths-promo__visual" aria-hidden="true"><div class="home-ai-paths-promo__orbit"></div><div class="home-ai-paths-promo__bot"><div class="home-ai-paths-promo__face"><i class="home-ai-paths-promo__eye home-ai-paths-promo__eye--l"></i><i class="home-ai-paths-promo__eye home-ai-paths-promo__eye--r"></i><i class="home-ai-paths-promo__mouth"></i></div></div><div class="home-ai-paths-promo__bubble">Παρατήρησε → Αποφάσισε → Επαλήθευσε</div></div>`;
    }
    if(section.parentElement!==shell || section.nextElementSibling!==more) shell.insertBefore(section,more);
  }

  function init(){
    const toggle = document.getElementById("siteMenuToggle");
    const panel = document.getElementById("siteMenuPanel");
    syncAriaLabels();
    ensureAiPathsPromo();
    new MutationObserver(() => { syncAriaLabels(); ensureAiPathsPromo(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    if(location.pathname==="/" || location.pathname===""){
      [0,100,350,900,1800].forEach(ms=>setTimeout(ensureAiPathsPromo,ms));
    }
    if(!toggle || !panel) return;

    const fitPanel = () => {
      if(panel.hidden) return;
      const viewport = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const top = Math.max(0, panel.getBoundingClientRect().top);
      panel.style.maxHeight = `${Math.max(160, Math.floor(viewport - top))}px`;
    };

    const setOpen = (open, returnFocus) => {
      toggle.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
      document.body.classList.toggle("site-menu-open", open);
      if(open){
        fitPanel();
        panel.querySelector("a[href]")?.focus({ preventScroll: true });
      }else{
        panel.style.maxHeight = "";
        if(returnFocus) toggle.focus();
      }
    };

    window.addEventListener("resize", fitPanel);
    window.visualViewport?.addEventListener("resize", fitPanel);
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true", false));
    panel.addEventListener("click", (event) => {
      if(event.target instanceof Element && event.target.closest("a[href]")) setOpen(false, false);
    });
    document.addEventListener("keydown", (event) => {
      if(event.key === "Escape" && !panel.hidden) setOpen(false, true);
    });
    document.addEventListener("click", (event) => {
      if(panel.hidden || !(event.target instanceof Node)) return;
      if(!panel.contains(event.target) && !toggle.contains(event.target)) setOpen(false, false);
    });
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
