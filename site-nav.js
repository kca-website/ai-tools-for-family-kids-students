/* Header menu for the homepage/app shell (index.html).
 * Presentation only: opens/closes the "Menu" panel and keeps its aria labels
 * in the active language. It does not touch routing, i18n state or app views.
 */
(function(){
  "use strict";

  const ARIA = {
    el: { navLabel: "Κύριο μενού", navAllLabel: "Όλες οι ενότητες" },
    en: { navLabel: "Main menu", navAllLabel: "All sections" }
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

    const setOpen = (open, returnFocus) => {
      toggle.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
      document.body.classList.toggle("site-menu-open", open);
      if(open) panel.querySelector("a[href]")?.focus();
      else if(returnFocus) toggle.focus();
    };

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
