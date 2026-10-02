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

  function init(){
    const toggle = document.getElementById("siteMenuToggle");
    const panel = document.getElementById("siteMenuPanel");
    syncAriaLabels();
    new MutationObserver(syncAriaLabels).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    if(!toggle || !panel) return;

    // The panel sits inside the sticky header, so it must fit the visible viewport. 100vh on mobile
    // browsers ignores the address bar and the header is taller than 72px with the search row, which
    // hid the last menu entries; measure the real space instead.
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
