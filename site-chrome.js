/* Shared v9 header and footer for every page except the homepage/app shell.
 * Presentation only. It adds one header and one footer, moves any page
 * controls (language buttons, page links) from the page's old header into
 * the new one without recreating them, so their ids and listeners keep
 * working, and hides only the duplicated brand / "Home" links.
 */
(function(){
  "use strict";
  if(document.getElementById("chromeHeader")) return;

  const COPY = {
    el: {
      skip: "Μετάβαση στο περιεχόμενο", navLabel: "Κύριο μενού", allLabel: "Όλες οι ενότητες", footerLabel: "Χρήσιμοι σύνδεσμοι",
      tools: "Εργαλεία", study: "AI Μελέτη", help: "AI Βοήθεια", menu: "Μενού",
      groupFind: "Βρες το σωστό AI", groupLearn: "Μάθηση", groupMore: "Περισσότερα",
      byLevel: "Ποιος είσαι; Βρες το σωστό AI", whatToDo: "Τι θέλεις να κάνεις με AI;", practice: "Χάρτης Εξάσκησης", curriculum: "Χάρτης Ύλης 2026–27", characters: "Χαρακτήρες Ιστορίας",
      classroom: "Για εκπαιδευτικούς", gsl: "Ελληνική Νοηματική", special: "Ειδική Εκπαίδευση", university: "Φοιτητές ΑΕΙ · Πιλοτικό",
      footerText: "Ανεξάρτητο έργο. Δεν αποτελεί επίσημο προϊόν ή συνεργασία κανενός παρόχου AI. Οι λειτουργίες AI είναι προαιρετικές και τεκμηριώνονται στη Διαφάνεια AI.",
      privacy: "Πολιτική Απορρήτου", accessibility: "Προσβασιμότητα εργαλείων", transparency: "Διαφάνεια AI", school: "Χρήση AI στο σχολείο", guides: "Οδηγοί ανά βαθμίδα και μάθημα", about: "Ποιοι είμαστε / FAQ",
      methodology: "Πώς επιλέγουμε & ελέγχουμε τα εργαλεία", report: "Βρήκες λάθος ή παλιωμένη πληροφορία; ↗",
      thanks: "Ευχαριστίες στο", thanksNote: "για τη δωρεάν τεχνογνωσία και το αφιέρωμα."
    },
    en: {
      skip: "Skip to content", navLabel: "Main menu", allLabel: "All sections", footerLabel: "Useful links",
      tools: "Tools", study: "AI Study", help: "AI Help", menu: "Menu",
      groupFind: "Find the right AI", groupLearn: "Learning", groupMore: "More",
      byLevel: "Who are you? Find the right AI", whatToDo: "What do you want to do with AI?", practice: "Practice Map", curriculum: "Curriculum Map 2026–27", characters: "History characters",
      classroom: "For educators", gsl: "Greek Sign Language", special: "Special Education", university: "University students · Pilot",
      footerText: "Independent project. It is not an official product or partnership of any AI provider. AI features are optional and documented in AI Transparency.",
      privacy: "Privacy Policy", accessibility: "Tool accessibility", transparency: "AI transparency", school: "AI use at school", guides: "Guides by level and subject", about: "About / FAQ",
      methodology: "How we select & verify tools", report: "Report outdated information ↗",
      thanks: "Thanks to", thanksNote: "for the free know-how and the feature."
    }
  };

  function lang(){
    return (document.documentElement.lang || "el").toLowerCase().startsWith("en") ? "en" : "el";
  }

  function ensureFonts(){
    if(document.querySelector('link[href*="family=Commissioner"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Commissioner:wght@400;500;600;700;800&family=Noto+Serif:wght@500;600;700&display=swap";
    document.head.appendChild(link);
  }

  function isHomeLink(a){
    const href = (a.getAttribute("href") || "").trim();
    return href === "/" || href === "/index.html" || href === "./" || href === "index.html";
  }

  // The page's own site header: the first header / .top / .header bar that
  // comes before the page title and links back to the homepage.
  function findOldHeader(){
    const h1 = document.querySelector("h1");
    const candidates = document.querySelectorAll("header, .top, .header");
    for(const el of candidates){
      if(el.id === "chromeHeader" || el.closest("#chromeHeader, #chromeFooter")) continue;
      if(h1 && (el.contains(h1) || !(el.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING))) continue;
      if([...el.querySelectorAll("a[href]")].some(isHomeLink)) return el;
    }
    return null;
  }

  function headerMarkup(){
    return `
      <div class="chrome-header__inner">
        <a class="chrome-brand" href="/"><span class="chrome-brand__mark" aria-hidden="true">ai</span><span>aitools4kids.gr</span></a>
        <nav class="chrome-nav" data-chrome-aria="navLabel">
          <a href="/#homeV8FinderTitle" data-chrome="tools"></a>
          <a href="/study.html" data-chrome="study"></a>
          <a href="/#homeV8AiTitle" data-chrome="help"></a>
        </nav>
        <a class="chrome-teacher-link" href="/teacher-assistant.html" data-chrome="classroom"></a>
        <div class="chrome-actions" id="chromeActions"></div>
        <button type="button" class="chrome-menu-toggle" id="chromeMenuToggle" aria-expanded="false" aria-controls="chromeMenuPanel">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>
          <span data-chrome="menu"></span>
        </button>
      </div>
      <div class="chrome-menu-panel" id="chromeMenuPanel" hidden>
        <nav class="chrome-menu-panel__inner" data-chrome-aria="allLabel">
          <a class="chrome-menu-panel__teacher" href="/teacher-assistant.html"><span aria-hidden="true">🏫</span><span data-chrome="classroom"></span><span aria-hidden="true">→</span></a>
          <div class="chrome-menu-panel__group">
            <p class="chrome-menu-panel__title" data-chrome="groupFind"></p>
            <a href="/#homeV8FinderTitle" data-chrome="byLevel"></a>
            <a href="/ti-thelo-na-kano-me-ai.html" data-chrome="whatToDo"></a>
          </div>
          <div class="chrome-menu-panel__group">
            <p class="chrome-menu-panel__title" data-chrome="groupLearn"></p>
            <a href="/study.html" data-chrome="study"></a>
            <a href="/#homeV8AiTitle" data-chrome="help"></a>
            <a href="/#homeV8MapTitle" data-chrome="practice"></a>
            <a href="/xartis-ylis.html" data-chrome="curriculum"></a>
            <a href="/history-characters.html" data-chrome="characters"></a>
          </div>
          <div class="chrome-menu-panel__group">
            <p class="chrome-menu-panel__title" data-chrome="groupMore"></p>
            <a href="/sign-language.html" data-chrome="gsl"></a>
            <a href="/special-education.html" data-chrome="special"></a>
            <a href="/higher-education-pilot.html" data-chrome="university"></a>
          </div>
        </nav>
      </div>`;
  }

  function footerMarkup(){
    const audit = window.AITOOLSKIDS_SITE_META;
    return `
      <div class="chrome-footer__inner">
        <div class="chrome-footer__about">
          <p class="chrome-footer__brand"><span class="chrome-brand__mark" aria-hidden="true">ai</span>aitools4kids.gr</p>
          <p data-chrome="footerText"></p>
          ${audit ? '<p class="chrome-footer__audit" data-chrome-audit></p>' : ""}
          <p class="chrome-footer__extra"><a href="/methodology.html" data-chrome="methodology"></a> · <a href="/report-error.html" data-chrome="report"></a></p>
        </div>
        <nav class="chrome-footer__links" data-chrome-aria="footerLabel">
          <a href="/privacy-policy.html" data-chrome="privacy"></a>
          <a href="/accessibility.html" data-chrome="accessibility"></a>
          <a href="/ai-transparency.html" data-chrome="transparency"></a>
          <a href="/school-ai-use.html" data-chrome="school"></a>
          <a href="/ai-ergaleia-gia-mathites.html" data-chrome="guides"></a>
          <a href="/about.html" data-chrome="about"></a>
        </nav>
        <div class="chrome-footer__thanks">
          <a class="chrome-footer__logo" href="https://www.dwrean.net/" target="_blank" rel="noopener noreferrer" aria-label="dwrean.net"><img src="/assets/dwrean-logo.jpg" width="150" height="48" alt="dwrean.net" loading="lazy" decoding="async"></a>
          <span data-chrome="thanks"></span>
          <a href="https://www.dwrean.net/2026/09/ai-tools-4-kids-ellinika-dorean-ai-ergaleia.html" target="_blank" rel="noopener noreferrer">dwrean.net ↗</a>
          <small data-chrome="thanksNote"></small>
        </div>
      </div>`;
  }

  function applyCopy(){
    const c = COPY[lang()];
    document.querySelectorAll("[data-chrome]").forEach((node) => {
      const value = c[node.getAttribute("data-chrome")];
      if(value) node.textContent = value;
    });
    document.querySelectorAll("[data-chrome-aria]").forEach((node) => {
      const value = c[node.getAttribute("data-chrome-aria")];
      if(value) node.setAttribute("aria-label", value);
    });
    const skip = document.getElementById("chromeSkip");
    if(skip) skip.textContent = c.skip;
    const audit = document.querySelector("[data-chrome-audit]");
    const meta = window.AITOOLSKIDS_SITE_META;
    if(audit && meta) audit.textContent = lang() === "en" ? meta.toolCatalogAuditLabelEn : meta.toolCatalogAuditLabelEl;
  }

  function syncViewportWidth(){
    const root = document.documentElement.style;
    root.setProperty("--chrome-vw", document.documentElement.clientWidth + "px");
    // Pages that pad or offset <body> would leave a gap above/below the bands.
    const cs = getComputedStyle(document.body);
    root.setProperty("--chrome-top", (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.paddingTop) || 0) + "px");
    root.setProperty("--chrome-bottom", (parseFloat(cs.marginBottom) || 0) + (parseFloat(cs.paddingBottom) || 0) + "px");
  }

  function init(){
    const body = document.body;
    if(!body || document.getElementById("chromeHeader")) return;
    ensureFonts();
    body.classList.add("has-site-chrome");
    // Page hook for page-specific v9 styles, e.g. /study.html -> page-study, /tools/x.html -> page-tools.
    const parts = location.pathname.replace(/\.html$/, "").split("/").filter(Boolean);
    if(parts.length) body.classList.add("page-" + (parts[0] === "tools" ? "tools" : parts.join("-")));
    if(document.querySelector('link[href*="seo-guide.css"]')) body.classList.add("page-guide");

    const header = document.createElement("header");
    header.id = "chromeHeader";
    header.className = "chrome-header";
    header.innerHTML = headerMarkup();

    // Skip link target: the page's <main>, else the first element after the header.
    const main = document.querySelector("main");
    let target = main;
    if(!target){
      target = [...body.children].find((el) => !/^(HEADER|SCRIPT|STYLE|NOSCRIPT|LINK)$/.test(el.tagName) && !el.classList.contains("back")) || null;
    }
    if(target && !target.id) target.id = "chromeMain";
    const skip = document.createElement("a");
    skip.id = "chromeSkip";
    skip.className = "chrome-skip";
    skip.href = "#" + (target ? target.id : "chromeHeader");

    body.insertBefore(header, body.firstChild);
    body.insertBefore(skip, header);

    // Move the page's own controls into the shared header and hide duplicates.
    const actions = document.getElementById("chromeActions");
    const old = findOldHeader();
    if(old){
      old.querySelectorAll("button, select, a[href]").forEach((el) => {
        if(el.tagName === "A" && isHomeLink(el)) return;
        if(el.closest("button, a") && el.closest("button, a") !== el) return;
        actions.appendChild(el);
      });
      old.hidden = true;
      old.classList.add("chrome-replaced");
    }
    const h1 = document.querySelector("h1");
    // "← Home" links before the page title duplicate the new header.
    document.querySelectorAll("a[href]").forEach((el) => {
      if(el.closest("#chromeHeader, #chromeFooter") || !isHomeLink(el)) return;
      if(!el.classList.contains("back") && !/^\s*←/.test(el.textContent || "")) return;
      if(h1 && !(el.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
      el.hidden = true;
      el.classList.add("chrome-replaced");
    });

    const footer = document.createElement("footer");
    footer.id = "chromeFooter";
    footer.className = "chrome-footer";
    footer.innerHTML = footerMarkup();
    body.appendChild(footer);

    applyCopy();
    syncViewportWidth();
    window.addEventListener("resize", syncViewportWidth);
    new MutationObserver(applyCopy).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    const toggle = document.getElementById("chromeMenuToggle");
    const panel = document.getElementById("chromeMenuPanel");
    const setOpen = (open, returnFocus) => {
      toggle.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
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
