/** Canonical public maintenance metadata. Do not use deploy dates as tool-review dates. */
window.AITOOLSKIDS_SITE_META = Object.freeze({
  version: 2,
  toolCatalogAuditDate: "2026-09-28",
  toolCatalogAuditLabelEl: "Τελευταίος πλήρης έλεγχος καταλόγου εργαλείων: 28 Σεπτεμβρίου 2026",
  toolCatalogAuditLabelEn: "Last full tool-catalog review: 28 September 2026",
  signLanguageConceptCount: 167,
  canonicalToolCount: 43,
  publicAgeRange: "4–18"
});


/** Local-only debug snapshot; no analytics or network transmission. */
window.AITOOLSKIDS_INTEGRITY = Object.freeze({
  version: "4.1.0",
  updated: "2026-09-20",
  environmentQuizzes: 4,
  environmentGapTags: 20,
  canonicalSupplementalTools: ["ai-help","phet","google-arts-culture","gemini-education"]
});

/**
 * Keep the complete tool catalogue directly discoverable.
 * The grade/role finder remains the recommended guided route, but visitors
 * must also be able to browse every tool without choosing a school level.
 */
(function restoreFullCatalogueEntryPoints(){
  "use strict";

  function isEnglish(){
    return !!document.getElementById("langEn")?.classList.contains("active") ||
      (document.documentElement.lang || "").toLowerCase().startsWith("en");
  }

  function copy(){
    return isEnglish()
      ? {
          nav: "All tools",
          badge: "Catalogue",
          title: "All AI tools",
          desc: "Browse the complete catalogue with filters, without choosing a grade first."
        }
      : {
          nav: "Όλα τα εργαλεία",
          badge: "Κατάλογος",
          title: "Όλα τα AI εργαλεία",
          desc: "Δες ολόκληρο τον κατάλογο με φίλτρα, χωρίς να επιλέξεις πρώτα βαθμίδα."
        };
  }

  function ensureCatalogueLinks(){
    const c = copy();

    // Desktop / tablet primary navigation.
    const primaryLink = document.querySelector('.site-nav a[href="/tools/"]');
    if(primaryLink){
      primaryLink.textContent = c.nav;
      primaryLink.removeAttribute("data-i18n");
      primaryLink.setAttribute("aria-label", c.nav);
    }

    // Hamburger / mobile menu. The same panel is also available from desktop.
    const menuPanel = document.getElementById("siteMenuPanel");
    const findGroup = menuPanel?.querySelector(".site-menu-panel__group");
    if(findGroup){
      let menuLink = document.getElementById("siteAllToolsLink");
      if(!menuLink){
        menuLink = document.createElement("a");
        menuLink.id = "siteAllToolsLink";
        menuLink.href = "/tools/";
        const title = findGroup.querySelector(".site-menu-panel__title");
        if(title) title.insertAdjacentElement("afterend", menuLink);
        else findGroup.prepend(menuLink);
      }
      menuLink.textContent = c.nav;
      menuLink.setAttribute("aria-label", c.nav);
    }

    // Homepage: a direct, responsive catalogue shortcut above the three quick-access cards.
    if(location.pathname === "/" || location.pathname === ""){
      const helpers = document.querySelector("#homeV8HelpersMount .home-v8-helpers");
      const ways = helpers?.querySelector(".home-v9-ways");
      if(helpers && ways){
        let homeLink = document.getElementById("homeAllToolsLink");
        if(!homeLink){
          homeLink = document.createElement("a");
          homeLink.id = "homeAllToolsLink";
          homeLink.className = "home-v9-curriculum-strip home-all-tools-strip";
          homeLink.href = "/tools/";
          ways.insertAdjacentElement("beforebegin", homeLink);
        }
        homeLink.setAttribute("aria-label", c.title);
        homeLink.innerHTML = `
          <span class="home-v9-curriculum-strip__icon" aria-hidden="true">🧰</span>
          <span class="home-v9-curriculum-strip__copy">
            <span class="home-v9-curriculum-strip__badge">${c.badge}</span>
            <strong>${c.title}</strong>
            <small>${c.desc}</small>
          </span>
          <span class="home-v9-curriculum-strip__cta" aria-hidden="true">→</span>`;
      }
    }
  }

  function start(){
    ensureCatalogueLinks();

    // The homepage helper cards are created dynamically by navigator-home.js.
    // Observe only during initial boot, then stop to avoid a permanent DOM observer.
    if("MutationObserver" in window){
      const observer = new MutationObserver(ensureCatalogueLinks);
      observer.observe(document.documentElement, {childList:true, subtree:true});
      setTimeout(function(){ observer.disconnect(); ensureCatalogueLinks(); }, 5000);
    }

    [50, 250, 800, 1600].forEach(function(ms){
      setTimeout(ensureCatalogueLinks, ms);
    });

    document.addEventListener("click", function(event){
      const target = event.target instanceof Element ? event.target : null;
      if(target?.closest("#langEl,#langEn")) setTimeout(ensureCatalogueLinks, 0);
    });
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, {once:true});
  else start();
})();
