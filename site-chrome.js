/* Shared site chrome v11 — one information architecture for every page.
 *
 * - Inner pages: builds the header (brand, task-first primary nav, language
 *   controls, full menu), a context bar (breadcrumbs, page links, related
 *   learning tasks) and the footer. Page controls that lived in the page's old
 *   header (language buttons, page links) are MOVED, never recreated, so their
 *   ids and listeners keep working.
 * - Homepage / app shell (index.html): keeps its own header ids (tests and
 *   app.js depend on them) but fills its primary nav and menu panel from the
 *   same model, and adds breadcrumbs + related tasks on the rewritten app
 *   routes (/primary|middle|high/guardian|student/view).
 *
 * Presentation and navigation only: no routing, data, AI or curriculum logic.
 * Level context is shared through the existing sessionStorage key
 * "aitools4kidsShortcutSelection" (documented in the privacy policy).
 */
(function(){
  "use strict";
  if(window.AITOOLSKIDS_CHROME_V11) return;
  window.AITOOLSKIDS_CHROME_V11 = true;

  const HOME_SHELL = !!document.querySelector("header.site-header #siteMenuPanel");
  if(!HOME_SHELL && document.getElementById("chromeHeader")) return;

  const COPY = {
    el: {
      skip: "Μετάβαση στο περιεχόμενο", navLabel: "Κύριο μενού", allLabel: "Όλες οι ενότητες", footerLabel: "Χρήσιμοι σύνδεσμοι",
      menu: "Μενού", crumbs: "Βρίσκεσαι εδώ", pageLinks: "Σε αυτή τη σελίδα", related: "Ίδιο μάθημα, άλλος τρόπος",
      levelPrefix: "Βαθμίδα:", levelChange: "Αλλαγή βαθμίδας", levelNone: "Όλες οι βαθμίδες",
      footerText: "Ανεξάρτητο έργο. Δεν αποτελεί επίσημο προϊόν ή συνεργασία κανενός παρόχου AI. Οι λειτουργίες AI είναι προαιρετικές και τεκμηριώνονται στη Διαφάνεια AI.",
      privacy: "Πολιτική Απορρήτου", accessibility: "Προσβασιμότητα εργαλείων", transparency: "Διαφάνεια AI", school: "Χρήση AI στο σχολείο", guides: "Οδηγοί ανά βαθμίδα και μάθημα", about: "Ποιοι είμαστε / FAQ",
      privacyHref: "/privacy-policy.html", accessibilityHref: "/accessibility.html", transparencyHref: "/ai-transparency.html", schoolHref: "/school-ai-use.html", guidesHref: "/ai-ergaleia-gia-mathites.html", aboutHref: "/about.html",
      methodology: "Πώς επιλέγουμε & ελέγχουμε τα εργαλεία", report: "Βρήκες λάθος ή παλιωμένη πληροφορία; ↗",
      thanks: "Ευχαριστίες στο", thanksNote: "για τη δωρεάν τεχνογνωσία και το αφιέρωμα."
    },
    en: {
      skip: "Skip to content", navLabel: "Main menu", allLabel: "All sections", footerLabel: "Useful links",
      menu: "Menu", crumbs: "You are here", pageLinks: "On this page", related: "Same lesson, another way",
      levelPrefix: "Level:", levelChange: "Change level", levelNone: "All levels",
      footerText: "Independent project. It is not an official product or partnership of any AI provider. AI features are optional and documented in AI Transparency.",
      privacy: "Privacy Policy", accessibility: "Tool accessibility", transparency: "AI transparency", school: "AI use at school", guides: "Guides by level and subject", about: "About us / FAQ",
      privacyHref: "/en/privacy-policy.html", accessibilityHref: "/en/accessibility.html", transparencyHref: "/en/ai-transparency.html", schoolHref: "/en/school-ai-use.html", guidesHref: "/en/ai-tools-for-students.html", aboutHref: "/en/about.html",
      methodology: "How we select & verify tools", report: "Report outdated information ↗",
      thanks: "Thanks to", thanksNote: "for the free know-how and the feature."
    }
  };

  /* ---------- Information architecture (single source of truth) ---------- */
  const I = (d) => `<svg class="ia-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
  const ICONS = {
    home: I('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
    study: I('<path d="M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3z"/><path d="M21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z"/>'),
    practice: I('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>'),
    help: I('<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>'),
    organize: I('<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4M8 14h3"/>'),
    curriculum: I('<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>'),
    tools: I('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>'),
    teacher: I('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M7 20h10M12 16v4M7 9h6M7 12h4"/>'),
    parents: I('<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.3"/><path d="M2.5 20c.5-3.8 2.7-6 5.5-6s5 2.2 5.5 6M14 20c.3-2.6 1.6-4.3 3-4.3s2.7 1.7 3 4.3"/>'),
    preschool: I('<path d="M4 20V10l8-6 8 6v10"/><path d="M9 20v-5h6v5"/><circle cx="12" cy="10" r="1.3"/>'),
    epal: I('<path d="M14.5 6.5l3 3M4 20l7.5-7.5"/><path d="M13 4l7 7-3 3-7-7z"/>'),
    special: I('<circle cx="12" cy="4.5" r="1.8"/><path d="M12 7v6M8 9.5h8M10 21l2-8 2 8"/>'),
    gsl: I('<path d="M8 13V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6 7-2.5 0-4-1.5-5.5-4l-2-3.5a1.5 1.5 0 0 1 2.5-1.5L8 13"/>'),
    university: I('<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6"/>'),
    characters: I('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.2-7 8-7s7 2.5 8 7"/>'),
    play: I('<rect x="2.5" y="7" width="19" height="11" rx="5"/><path d="M7.5 10.5v4M5.5 12.5h4"/><circle cx="16" cy="11.5" r=".8"/><circle cx="18" cy="13.5" r=".8"/>'),
    aiPaths: I('<path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>'),
    whatToDo: I('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'),
    guides: I('<path d="M5 4h11l3 3v13H5z"/><path d="M9 10h6M9 14h6"/>')
  };

  const ITEMS = {
    home:       { href: "/", el: ["Αρχική"], en: ["Home"] },
    study:      { crumb: { el: "AI Μελέτη", en: "AI Study" }, href: "/study.html", tone: "study",
                  el: ["Μελέτη", "Διαβάζω ένα μάθημα", "AI Μελέτη · εξήγηση, σύνοψη, κάρτες, quiz"],
                  en: ["Study", "Study a lesson", "AI Study · explanation, summary, cards, quiz"] },
    practice:   { crumb: { el: "Χάρτης Εξάσκησης", en: "Practice Map" }, href: "/practice.html", tone: "practice",
                  el: ["Εξάσκηση", "Κάνω εξάσκηση ή τεστ", "Χάρτης Εξάσκησης · βρες τι θέλει δουλειά, χωρίς βαθμό"],
                  en: ["Practice", "Practise or take a quiz", "Practice Map · find what needs work, no grades"] },
    help:       { crumb: { el: "AI Βοήθεια", en: "AI Help" }, href: "/tools/ai-help.html", tone: "help",
                  el: ["Βοήθεια σε άσκηση", "Κόλλησα σε μια άσκηση", "AI Βοήθεια · υποδείξεις βήμα βήμα, όχι έτοιμη λύση"],
                  en: ["Homework help", "I'm stuck on an exercise", "AI Help · step-by-step hints, not answers"] },
    organize:   { crumb: { el: "Οργάνωση μελέτης", en: "Study planning" }, href: "/organosi-meletis-ai.html", tone: "organize",
                  el: ["Οργάνωση", "Οργανώνω το διάβασμά μου", "Μικρά, εφικτά βήματα μελέτης"],
                  en: ["Plan", "Plan my studying", "Small, doable study steps"] },
    curriculum: { crumb: { el: "Χάρτης Ύλης 2026–27", en: "Curriculum Map 2026–27" }, href: "/xartis-ylis.html", tone: "study",
                  el: ["Ύλη 2026–27", "Βρίσκω την ενότητα της ύλης", "Χάρτης Ύλης · τάξη → μάθημα → ενότητα"],
                  en: ["Curriculum 2026–27", "Find my curriculum unit", "Curriculum Map · grade → subject → unit"] },
    tools:      { crumb: { el: "Κατάλογος AI εργαλείων", en: "AI tools catalogue" }, href: "/tools/", tone: "tools",
                  el: ["AI εργαλεία", "Βρίσκω κατάλληλο AI εργαλείο", "Κατάλογος με αναζήτηση ανά ανάγκη"],
                  en: ["AI tools", "Find the right AI tool", "Catalogue you can search by need"] },
    teacher:    { crumb: { el: "Για εκπαιδευτικούς", en: "For educators" }, href: "/teacher-assistant.html", tone: "teacher",
                  el: ["Εκπαιδευτικοί", "Φτιάχνω υλικό για την τάξη", "Φύλλα εργασίας, αξιολόγηση, σχέδια μαθήματος, βίντεο"],
                  en: ["Educators", "Create class material", "Worksheets, assessment, lesson plans, videos"] },
    parents:    { href: "/ai-gia-goneis.html", tone: "neutral", el: ["Γονείς", "Γονείς", "Πώς βοηθάς χωρίς να κάνεις τη δουλειά"], en: ["Parents", "Parents", "How to help without doing the work"] },
    preschool:  { href: "/preschool", tone: "neutral", el: ["Νηπιαγωγείο", "Νηπιαγωγείο · 4–6", "Δραστηριότητες με ενήλικα"], en: ["Preschool", "Preschool · 4–6", "Adult-led activities"] },
    epal:       { href: "/high/student/tutor?schoolType=epal", tone: "neutral", el: ["ΕΠΑΛ", "Μαθητές ΕΠΑΛ", "Τάξη, τομέας, ειδικότητα"], en: ["EPAL", "EPAL students", "Grade, sector, specialty"] },
    special:    { href: "/special-education.html", tone: "neutral", el: ["Ειδική Εκπαίδευση", "Ειδική Εκπαίδευση", "Ειδικό Γυμνάσιο, Ειδικό Λύκειο, ΕΝ.Ε.Ε.ΓΥ.-Λ."], en: ["Special Education", "Special Education", "Special Gymnasium, Special Lyceum, EN.E.E.GY.-L."] },
    gsl:        { href: "/sign-language.html", tone: "neutral", el: ["Ελληνική Νοηματική", "Ελληνική Νοηματική (ΕΝΓ)", "Σχολικές έννοιες με βίντεο ΕΝΓ"], en: ["Greek Sign Language", "Greek Sign Language (GSL)", "School concepts with GSL video"] },
    university: { href: "/higher-education-pilot.html", tone: "neutral", el: ["Φοιτητές", "Φοιτητές ΑΕΙ · Πιλοτικό", "Επιλεγμένα τμήματα, επίσημες πηγές"], en: ["University", "University students · Pilot", "Selected departments, official sources"] },
    characters: { href: "/history-characters.html", tone: "neutral", el: ["Χαρακτήρες Ιστορίας", "Χαρακτήρες Ιστορίας", "Διάλογος με πρόσωπα της ύλης"], en: ["History characters", "History characters", "Talk with people from the curriculum"] },
    play:       { href: "/play/", tone: "neutral", el: ["Παίξε & Μάθε", "Παίξε & Μάθε", "Μικρές αποστολές μάθησης"], en: ["Play & Learn", "Play & Learn", "Short learning missions"] },
    aiPaths:    { href: "/ai-scenarios.html", tone: "neutral", el: ["AI Διαδρομές", "AI Διαδρομές · σωστή χρήση του AI", "Πότε το AI κάνει λάθος;"], en: ["AI Paths", "AI Paths · using AI wisely", "When is AI wrong?"] },
    whatToDo:   { href: "/ti-thelo-na-kano-me-ai.html", tone: "neutral", el: ["Τι θέλω να κάνω με AI", "Τι θέλω να κάνω με AI;", "Εργαλεία ανά σχολική ανάγκη"], en: ["What to do with AI", "What can I do with AI?", "Tools by school need"] },
    guides:     { href: "/ai-ergaleia-gia-mathites.html", hrefEn: "/en/ai-tools-for-students.html", tone: "neutral", el: ["Οδηγοί", "Οδηγοί ανά βαθμίδα & μάθημα", "Δημοτικό, Γυμνάσιο, Λύκειο, μαθήματα"], en: ["Guides", "Guides by level & subject", "Primary, secondary, subjects"] }
  };

  const PRIMARY = ["tools", "study", "practice", "help", "teacher"];
  const GROUPS = [
    { id: "tasks", el: "Τι θέλεις να κάνεις;", en: "What do you want to do?", items: ["tools", "study", "practice", "help", "organize", "curriculum", "teacher"] },
    { id: "who", el: "Διαδρομές για", en: "Pathways for", items: ["parents", "preschool", "epal", "special", "gsl", "university"] },
    { id: "more", el: "Μάθε αλλιώς", en: "Learn another way", items: ["characters", "play", "aiPaths", "whatToDo", "guides"] }
  ];
  const RELATED = ["study", "practice", "help", "organize"];

  const ZONE_LABEL = {
    el: { preschool: "Νηπιαγωγείο", primary: "Δημοτικό", middle: "Γυμνάσιο", high: "ΓΕΛ", epal: "ΕΠΑΛ", special: "Ειδική Εκπαίδευση" },
    en: { preschool: "Preschool", primary: "Primary", middle: "Middle School", high: "General Lyceum", epal: "EPAL", special: "Special Education" }
  };
  const VIEW_LABEL = {
    el: { tools: "Εργαλεία", advanced: "Περισσότερα εργαλεία", prompts: "Έτοιμες ερωτήσεις", quiz: "Χάρτης Εξάσκησης", tutor: "AI Βοήθεια", guide: "Οδηγός" },
    en: { tools: "Tools", advanced: "More tools", prompts: "Ready-made prompts", quiz: "Practice Map", tutor: "AI Help", guide: "Guide" }
  };

  function lang(){
    return (document.documentElement.lang || "el").toLowerCase().startsWith("en") ? "en" : "el";
  }
  function esc(value){
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  }
  function itemText(key, index){
    const item = ITEMS[key];
    const list = item[lang()] || item.el;
    return list[index] || list[0];
  }
  function itemHref(key){
    const item = ITEMS[key];
    return lang() === "en" && item.hrefEn ? item.hrefEn : item.href;
  }

  if(location.pathname.startsWith("/en/")){
    try{ localStorage.setItem("aitools4kids_lang", "en"); }catch(_){}
  }

  /* ---------- Where am I? ---------- */
  const SPA_RE = /^\/(primary|middle|high)\/(guardian|student)\/(tools|advanced|prompts|quiz|tutor|guide)\/?$/;
  function path(){ return (location.pathname || "/").replace(/\/index\.html$/, "/"); }
  function isHomePath(){ return path() === "/"; }
  function spaRoute(){
    const m = path().match(SPA_RE);
    return m ? { zone: m[1], role: m[2], view: m[3] } : null;
  }
  function isGuidePage(){
    const p = path();
    return /^\/ai-(gia|ergaleia|me)-/.test(p) || /^\/en\/(ai-tools-for-students|study-|flashcards|presentation|reading|research|creative|what-do-you-want)/.test(p) ||
      /^\/(anagnosi|asfales|dimiourgiko|erevna|flashcards|fyllo|meleti-pdf|parousiasi)-/.test(p) || !!document.querySelector('link[href*="seo-guide.css"],link[href*="seo-landing.css"]');
  }
  function activeKey(){
    const p = path();
    const spa = spaRoute();
    if(spa){
      if(spa.view === "quiz") return "practice";
      if(spa.view === "tutor") return "help";
      return "tools";
    }
    if(/^\/(study|study-quiz|xartis-ylis|organosi-meletis-ai|history-characters)\.html$/.test(p)) return "study";
    if(p === "/practice.html") return "practice";
    if(p === "/tools/ai-help.html") return "help";
    if(/^\/(teacher-assistant|classroom|ai-gia-ekpaideftikous)\.html$/.test(p)) return "teacher";
    if(/^\/(en\/)?tools\//.test(p) || p === "/ti-thelo-na-kano-me-ai.html" || p === "/en/what-do-you-want-to-do-with-ai.html") return "tools";
    return "";
  }
  function exactKey(){
    const p = path();
    return Object.keys(ITEMS).find((key) => {
      const href = ITEMS[key].href.split("?")[0];
      return key !== "home" && (href === p || href === p.replace(/\.html$/, "") || (ITEMS[key].hrefEn && ITEMS[key].hrefEn === p));
    }) || "";
  }

  /* ---------- Level context shared between learning tasks ---------- */
  const SEL_KEY = "aitools4kidsShortcutSelection";
  const ZONES = ["primary", "middle", "high", "epal", "preschool", "special"];
  function readSelection(){
    try{
      const saved = JSON.parse(sessionStorage.getItem(SEL_KEY) || "null");
      if(saved && ZONES.includes(saved.zone)) return saved;
    }catch(_){}
    return null;
  }
  function writeSelection(zone, role){
    try{
      const saved = readSelection() || {};
      const next = Object.assign({}, saved, { zone, role: role || saved.role || "student" });
      if(!["student", "guardian", "teacher", "university"].includes(next.role)) next.role = "student";
      sessionStorage.setItem(SEL_KEY, JSON.stringify(next));
    }catch(_){}
  }
  function clearSelection(){
    try{
      const saved = readSelection();
      if(saved){ delete saved.zone; sessionStorage.setItem(SEL_KEY, JSON.stringify(Object.assign({}, saved, { zone: "" }))); }
    }catch(_){}
  }
  function urlLevel(){
    const spa = spaRoute();
    const params = new URLSearchParams(location.search);
    const epal = params.get("schoolType") === "epal";
    if(spa) return { zone: spa.zone === "high" && epal ? "epal" : spa.zone, role: spa.role };
    const zoneSelect = document.querySelector("body.page-study #zone");
    const zone = params.get("zone") || (zoneSelect && zoneSelect.value) || "";
    if(["primary", "middle", "high"].includes(zone)){
      const schoolType = document.querySelector("body.page-study #schoolType");
      return { zone: zone === "high" && (epal || (schoolType && schoolType.value === "epal")) ? "epal" : zone, role: "" };
    }
    return null;
  }
  function currentLevel(){
    const fromUrl = urlLevel();
    if(fromUrl){ writeSelection(fromUrl.zone, fromUrl.role); return Object.assign({}, readSelection() || {}, fromUrl, { role: fromUrl.role || (readSelection() || {}).role || "student" }); }
    return readSelection();
  }
  function relatedHref(key, level){
    const z = level && level.zone;
    const r = level && level.role === "guardian" ? "guardian" : "student";
    if(key === "organize") return ITEMS.organize.href;
    if(z === "special") return ITEMS.special.href;
    if(z === "preschool") return ITEMS.preschool.href;
    if(key === "study"){
      if(!z) return ITEMS.study.href;
      return `/study.html?zone=${z === "epal" ? "high" : z}${z === "epal" ? "&schoolType=epal" : ""}`;
    }
    if(key === "practice"){
      if(!z) return ITEMS.practice.href;
      if(z === "epal") return "/study.html?zone=high&mode=practice&schoolType=epal";
      return `/${z}/guardian/quiz`;
    }
    if(key === "help"){
      if(!z) return ITEMS.help.href;
      if(z === "epal") return "/high/student/tutor?schoolType=epal";
      if(z === "primary") return "/primary/guardian/tutor";
      return `/${z}/${r}/tutor`;
    }
    return ITEMS[key].href;
  }

  /* ---------- Markup ---------- */
  function robotMark(){
    return '<span class="chrome-brand__mark" aria-hidden="true"><img src="/assets/icons/app-icon.svg" alt="" width="36" height="36" decoding="async" style="display:block;width:36px;height:36px;border-radius:10px"></span>';
  }

  function primaryLinks(linkClass){
    const active = activeKey();
    return PRIMARY.map((key) => {
      const current = key === active ? ' aria-current="page"' : "";
      return `<a class="${linkClass} ia-primary ia-tone--${ITEMS[key].tone}" href="${esc(itemHref(key))}" data-ia-key="${key}"${current}>${esc(itemText(key, 0))}</a>`;
    }).join("");
  }

  function menuPanelMarkup(){
    const active = activeKey();
    const exact = exactKey();
    const home = `<a class="ia-panel__home" href="/" data-ia-key="home"${isHomePath() ? ' aria-current="page"' : ""}>${ICONS.home}<span>${esc(itemText("home", 0))}</span></a>`;
    const groups = GROUPS.map((group) => `
      <div class="ia-panel__group ia-panel__group--${group.id}" role="group" aria-labelledby="iaGroup-${group.id}">
        <p class="ia-panel__title" id="iaGroup-${group.id}">${esc(group[lang()])}</p>
        <ul class="ia-panel__list">${group.items.map((key) => {
          const isCurrent = key === exact || (group.id === "tasks" && key === active && !exact);
          return `<li><a class="ia-panel__link ia-tone--${ITEMS[key].tone}" href="${esc(itemHref(key))}" data-ia-key="${key}"${isCurrent ? ' aria-current="page"' : ""}>
            <span class="ia-panel__icon">${ICONS[key] || ""}</span>
            <span class="ia-panel__copy"><strong>${esc(itemText(key, 1))}</strong><small>${esc(itemText(key, 2))}</small></span>
          </a></li>`;
        }).join("")}</ul>
      </div>`).join("");
    return home + groups;
  }

  function headerMarkup(){
    return `
      <div class="chrome-header__inner">
        <a class="chrome-brand" href="/">${robotMark()}<span class="chrome-brand__text">aitools4kids.gr</span></a>
        <nav class="chrome-nav" data-chrome-aria="navLabel" data-ia-primary>${primaryLinks("chrome-nav__link")}</nav>
        <div class="chrome-actions" id="chromeActions"></div>
        <button type="button" class="chrome-menu-toggle" id="chromeMenuToggle" aria-expanded="false" aria-controls="chromeMenuPanel">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>
          <span data-chrome="menu"></span>
        </button>
      </div>
      <div class="chrome-menu-panel" id="chromeMenuPanel" hidden>
        <nav class="ia-panel" data-chrome-aria="allLabel" data-ia-panel>${menuPanelMarkup()}</nav>
      </div>`;
  }

  function cleanTitle(text){
    let t = String(text || "").replace(/\s+/g, " ").trim();
    t = t.split(/\s[|—–]\s/)[0].split(/:\s/)[0];
    if(t.length > 56) t = t.slice(0, 54).replace(/\s+\S*$/, "") + "…";
    return t;
  }
  function pageLabel(){
    const h1 = document.querySelector("main h1, h1");
    let text = "";
    if(h1){
      const clone = h1.cloneNode(true);
      clone.querySelectorAll("[lang='en'],.sr-only,.visually-hidden,[aria-hidden='true']").forEach((n) => { if(lang() === "el" && n.getAttribute("lang") === "en") n.remove(); });
      text = clone.textContent;
    }
    return cleanTitle(text || document.title);
  }

  function trail(){
    const p = path();
    const L = lang();
    const home = { label: itemText("home", 0), href: "/" };
    const spa = spaRoute();
    if(spa){
      const epal = new URLSearchParams(location.search).get("schoolType") === "epal";
      const zoneKey = spa.zone === "high" && epal ? "epal" : spa.zone;
      const zoneCrumb = { label: ZONE_LABEL[L][zoneKey], href: `/${spa.zone}/${spa.role}/tools${epal ? "?schoolType=epal" : ""}` };
      if(spa.view === "tools") return [home, { label: `${ZONE_LABEL[L][zoneKey]} · ${VIEW_LABEL[L].tools}` }];
      return [home, zoneCrumb, { label: VIEW_LABEL[L][spa.view] }];
    }
    if(p === "/") return [];
    const exact = exactKey();
    if(exact) return [home, { label: ITEMS[exact].crumb ? ITEMS[exact].crumb[L] : itemText(exact, 1) }];
    if(/^\/(en\/)?tools\/.+/.test(p)) return [home, { label: itemText("tools", 0), href: "/tools/" }, { label: pageLabel() }];
    if(/^\/play\/.+/.test(p)) return [home, { label: itemText("play", 0), href: "/play/" }, { label: pageLabel() }];
    if(/^\/special-education-/.test(p)) return [home, { label: itemText("special", 0), href: ITEMS.special.href }, { label: pageLabel() }];
    if(p === "/study-quiz.html") return [home, { label: itemText("study", 0), href: ITEMS.study.href }, { label: pageLabel() }];
    if(p === "/classroom.html") return [home, { label: itemText("teacher", 0), href: ITEMS.teacher.href }, { label: pageLabel() }];
    if(isGuidePage()) return [home, { label: itemText("guides", 0), href: itemHref("guides") }, { label: pageLabel() }];
    return [home, { label: pageLabel() }];
  }

  function crumbsMarkup(){
    const items = trail();
    if(!items.length) return "";
    return `<nav class="ia-crumbs" aria-label="${esc(COPY[lang()].crumbs)}"><ol>${items.map((item, index) => {
      const last = index === items.length - 1;
      if(last || !item.href) return `<li><span${last ? ' aria-current="page"' : ""}>${esc(item.label)}</span></li>`;
      return `<li><a href="${esc(item.href)}">${index === 0 ? ICONS.home : ""}<span>${esc(item.label)}</span></a></li>`;
    }).join("")}</ol></nav>`;
  }

  function relatedVisible(){
    const spa = spaRoute();
    if(spa) return spa.view === "quiz" || spa.view === "tutor";
    return /^\/(study|practice|organosi-meletis-ai|xartis-ylis)\.html$/.test(path()) || path() === "/tools/ai-help.html";
  }
  function relatedCurrent(){
    const spa = spaRoute();
    if(spa) return spa.view === "quiz" ? "practice" : spa.view === "tutor" ? "help" : "";
    const p = path();
    if(p === "/study.html") return new URLSearchParams(location.search).get("mode") === "practice" ? "practice" : "study";
    if(p === "/practice.html") return "practice";
    if(p === "/tools/ai-help.html") return "help";
    if(p === "/organosi-meletis-ai.html") return "organize";
    return "";
  }
  function relatedMarkup(){
    if(!relatedVisible()) return "";
    const c = COPY[lang()];
    const level = currentLevel();
    const current = relatedCurrent();
    const levelLabel = level && level.zone ? ZONE_LABEL[lang()][level.zone] : "";
    const links = RELATED.map((key) => {
      const isCurrent = key === current;
      return `<li><a class="ia-related__link ia-tone--${ITEMS[key].tone}" href="${esc(relatedHref(key, level))}" data-ia-key="${key}"${isCurrent ? ' aria-current="page"' : ""}>
        <span class="ia-related__icon">${ICONS[key]}</span><span class="ia-related__copy"><strong>${esc(itemText(key, 0))}</strong><small>${esc(itemText(key, 2))}</small></span></a></li>`;
    }).join("");
    const level_ = levelLabel
      ? `<p class="ia-related__level"><span>${esc(c.levelPrefix)} <strong>${esc(levelLabel)}</strong></span> <button type="button" class="ia-related__change" data-ia-clear-level>${esc(c.levelChange)}</button></p>`
      : "";
    return `<section class="ia-related" aria-labelledby="iaRelatedTitle">
      <div class="ia-related__head"><h2 class="ia-related__title" id="iaRelatedTitle">${esc(c.related)}</h2>${level_}</div>
      <ul class="ia-related__list">${links}</ul>
    </section>`;
  }

  function contextInner(pageLinks){
    const c = COPY[lang()];
    const links = pageLinks ? `<div class="ia-pagelinks" role="group" aria-label="${esc(c.pageLinks)}"></div>` : "";
    return `<div class="ia-context__inner"><div class="ia-context__row">${crumbsMarkup()}${links}</div>${relatedMarkup()}</div>`;
  }

  /* ---------- Rendering / refresh ---------- */
  let movedLinks = [];

  function renderContext(bar){
    if(!bar) return;
    const keep = movedLinks;
    keep.forEach((node) => node.remove());
    bar.innerHTML = contextInner(keep.length > 0);
    const holder = bar.querySelector(".ia-pagelinks");
    if(holder) keep.forEach((node) => holder.appendChild(node));
    bar.hidden = !bar.querySelector(".ia-crumbs, .ia-related, .ia-pagelinks");
  }

  function refreshNav(){
    document.querySelectorAll("[data-ia-primary]").forEach((nav) => {
      const cls = nav.classList.contains("site-nav") ? "site-nav__link" : "chrome-nav__link";
      nav.innerHTML = primaryLinks(cls);
    });
    document.querySelectorAll("[data-ia-panel]").forEach((nav) => { nav.innerHTML = menuPanelMarkup(); });
  }
  function footerMarkup(){
    const audit = window.AITOOLSKIDS_SITE_META;
    return `
      <div class="chrome-footer__inner">
        <div class="chrome-footer__about">
          <p class="chrome-footer__brand">${robotMark()}aitools4kids.gr<a class="fb-link" href="https://www.facebook.com/profile.php?id=61594298925270" target="_blank" rel="noopener noreferrer" aria-label="Facebook · Aitools4kids" title="Facebook"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg></a></p>
          <p data-chrome="footerText"></p>
          ${audit ? '<p class="chrome-footer__audit" data-chrome-audit></p>' : ""}
          <p class="chrome-footer__extra"><a href="/methodology.html" data-chrome="methodology"></a> · <a href="/report-error.html" data-chrome="report"></a></p>
        </div>
        <nav class="chrome-footer__links" data-chrome-aria="footerLabel">
          <a href="/privacy-policy.html" data-chrome="privacy" data-chrome-href="privacyHref"></a>
          <a href="/accessibility.html" data-chrome="accessibility" data-chrome-href="accessibilityHref"></a>
          <a href="/ai-transparency.html" data-chrome="transparency" data-chrome-href="transparencyHref"></a>
          <a href="/school-ai-use.html" data-chrome="school" data-chrome-href="schoolHref"></a>
          <a href="/ai-ergaleia-gia-mathites.html" data-chrome="guides" data-chrome-href="guidesHref"></a>
          <a href="/about.html" data-chrome="about" data-chrome-href="aboutHref"></a>
        </nav>
        <div class="chrome-footer__thanks">
          <a class="chrome-footer__logo" href="https://www.dwrean.net/" target="_blank" rel="noopener noreferrer" aria-label="dwrean.net"><img src="/assets/dwrean-logo.jpg" width="150" height="48" alt="dwrean.net" loading="lazy" decoding="async"></a>
          <span data-chrome="thanks"></span>
          <a href="https://www.dwrean.net/2026/09/ai-tools-4-kids-ellinika-dorean-ai-ergaleia.html" target="_blank" rel="noopener noreferrer">dwrean.net ↗</a>
          <small data-chrome="thanksNote"></small>
        </div>
      </div>`;
  }

  function enhanceAiPathsPage(){
    if(location.pathname !== "/ai-scenarios.html") return;
    if(!document.getElementById("aiPathsProgressScript")){
      const progressScript=document.createElement("script");
      progressScript.id="aiPathsProgressScript";
      progressScript.src="/ai-scenarios-progress.js";
      progressScript.defer=true;
      document.head.appendChild(progressScript);
    }
    if(!document.getElementById("aiPathsKeepsakeScript")){
      const keepsakeScript=document.createElement("script");
      keepsakeScript.id="aiPathsKeepsakeScript";
      keepsakeScript.src="/ai-scenarios-keepsake.js";
      keepsakeScript.defer=true;
      document.head.appendChild(keepsakeScript);
    }
    const en = lang() === "en";
    const title = en ? "AI Paths — Build better judgement with AI | aitools4kids.gr" : "AI Διαδρομές — Χρησιμοποίησε το AI με κρίση | aitools4kids.gr";
    const description = en ? "Free interactive AI literacy paths for ages 9–18: verify AI answers, protect personal information, spot misleading content and choose the right tool." : "Δωρεάν διαδραστικές AI Διαδρομές για ηλικίες 9–18: έλεγχος απαντήσεων AI, προστασία προσωπικών δεδομένων, παραπλανητικό περιεχόμενο και σωστή επιλογή εργαλείου.";
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if(meta) meta.setAttribute("content", description);
    const elBtn = document.getElementById("elBtn");
    const enBtn = document.getElementById("enBtn");
    if(elBtn){ elBtn.setAttribute("aria-pressed", String(!en)); elBtn.setAttribute("aria-label", en ? "Switch to Greek" : "Ελληνικά"); }
    if(enBtn){ enBtn.setAttribute("aria-pressed", String(en)); enBtn.setAttribute("aria-label", en ? "English" : "Μετάβαση στα Αγγλικά"); }
    const ageGroup = document.querySelector(".age");
    if(ageGroup){
      ageGroup.setAttribute("role", "group");
      ageGroup.setAttribute("aria-label", en ? "Choose age group" : "Διάλεξε ηλικιακή ομάδα");
      ageGroup.querySelectorAll("button[data-age]").forEach((button) => button.setAttribute("aria-pressed", String(button.classList.contains("active"))));
    }
    const lab = document.getElementById("lab");
    if(lab){ lab.setAttribute("role", "region"); lab.setAttribute("aria-label", en ? "Interactive AI path" : "Διαδραστική AI διαδρομή"); }
    if(!document.getElementById("aiPathsA11yStyles")){
      const style = document.createElement("style");
      style.id = "aiPathsA11yStyles";
      style.textContent = '.page-ai-scenarios button:focus-visible,.page-ai-scenarios a:focus-visible{outline:3px solid #f59e0b!important;outline-offset:3px}.page-ai-scenarios .option{min-height:48px}.page-ai-scenarios .age button{min-height:44px}';
      document.head.appendChild(style);
    }
    document.querySelectorAll('a[href="/ai-scenarios.html"]').forEach((link) => link.setAttribute("aria-current", "page"));
  }


  function syncViewportWidth(){
    const root = document.documentElement.style;
    root.setProperty("--chrome-vw", document.documentElement.clientWidth + "px");
    const cs = getComputedStyle(document.body);
    root.setProperty("--chrome-top", (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.paddingTop) || 0) + "px");
    root.setProperty("--chrome-bottom", (parseFloat(cs.marginBottom) || 0) + (parseFloat(cs.paddingBottom) || 0) + "px");
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
    return href === "/" || href === "/index.html" || href === "./" || href === "index.html" || href === "https://www.aitools4kids.gr/";
  }

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

  function applyCopy(){
    const c = COPY[lang()];
    document.querySelectorAll("[data-chrome]").forEach((node) => {
      const value = c[node.getAttribute("data-chrome")];
      if(value) node.textContent = value;
    });
    document.querySelectorAll("[data-chrome-href]").forEach((node) => {
      const value = c[node.getAttribute("data-chrome-href")];
      if(value) node.setAttribute("href", value);
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
    enhanceAiPathsPage();
  }

  function bindLevelControls(getBar){
    document.addEventListener("click", (event) => {
      const button = event.target instanceof Element ? event.target.closest("[data-ia-clear-level]") : null;
      if(!button) return;
      clearSelection();
      const p = path();
      if(spaRoute() || new URLSearchParams(location.search).has("zone")){
        location.href = "/#tasks";
        return;
      }
      renderContext(getBar());
      if(p === "/") return;
      getBar()?.querySelector(".ia-related__title")?.focus?.();
    });
    document.addEventListener("change", (event) => {
      const target = event.target;
      if(target instanceof Element && target.matches("body.page-study #zone, body.page-study #schoolType")) renderContext(getBar());
    });
  }

  function exposeApi(getBar){
    window.AITOOLSKIDS_IA = {
      version: 11,
      items: ITEMS,
      groups: GROUPS,
      primary: PRIMARY,
      icons: ICONS,
      relatedHref,
      readSelection,
      writeSelection,
      refresh(){ refreshNav(); renderContext(getBar()); applyCopy(); }
    };
  }

  /* ---------- Homepage / app shell ---------- */
  function initHomeShell(){
    const nav = document.querySelector("header.site-header .site-nav");
    if(nav){ nav.setAttribute("data-ia-primary", ""); }
    const panelNav = document.querySelector("#siteMenuPanel > nav");
    if(panelNav){ panelNav.setAttribute("data-ia-panel", ""); panelNav.classList.add("ia-panel"); }
    const brand = document.querySelector("header.site-header .site-title");
    if(brand) brand.setAttribute("href", "/");

    const main = document.getElementById("mainContent");
    let bar = document.getElementById("iaContext");
    if(!bar && main){
      bar = document.createElement("div");
      bar.id = "iaContext";
      bar.className = "ia-context ia-context--app";
      bar.hidden = true;
      main.insertBefore(bar, main.firstChild);
    }
    const getBar = () => document.getElementById("iaContext");
    let lastKey = "";
    const refresh = (force) => {
      const key = location.pathname + location.search + "|" + lang();
      if(!force && key === lastKey) return;
      lastKey = key;
      refreshNav();
      // The visible page title of an app route is #pathZoneHeading (an h2); the only
      // h1 lives in the hidden homepage section. Expose the route title as level 1.
      const routeHeading = document.getElementById("pathZoneHeading");
      if(spaRoute()){
        renderContext(getBar());
        if(routeHeading){ routeHeading.setAttribute("role", "heading"); routeHeading.setAttribute("aria-level", "1"); }
      }else{
        if(getBar()){ getBar().innerHTML = ""; getBar().hidden = true; }
        if(routeHeading){ routeHeading.removeAttribute("role"); routeHeading.removeAttribute("aria-level"); }
      }
    };
    refresh(true);
    exposeApi(getBar);
    bindLevelControls(getBar);
    window.addEventListener("popstate", () => setTimeout(() => refresh(false), 0));
    new MutationObserver(() => refresh(true)).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    const title = document.querySelector("head > title");
    if(title) new MutationObserver(() => setTimeout(() => refresh(false), 0)).observe(title, { childList: true, characterData: true, subtree: true });
    const pushState = history.pushState;
    history.pushState = function(){
      const result = pushState.apply(this, arguments);
      setTimeout(() => refresh(false), 0);
      return result;
    };
  }

  /* ---------- Inner pages ---------- */
  function initPage(){
    const body = document.body;
    if(!body || document.getElementById("chromeHeader")) return;
    ensureFonts();
    body.classList.add("has-site-chrome");
    const parts = location.pathname.replace(/\.html$/, "").split("/").filter(Boolean);
    if(parts.length) body.classList.add("page-" + (parts[0] === "tools" ? "tools" : parts.join("-")));
    if(document.querySelector('link[href*="seo-guide.css"]')) body.classList.add("page-guide");

    const header = document.createElement("header");
    header.id = "chromeHeader";
    header.className = "chrome-header";
    header.innerHTML = headerMarkup();

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

    const bar = document.createElement("div");
    bar.id = "chromeContext";
    bar.className = "ia-context";
    header.insertAdjacentElement("afterend", bar);

    const actions = document.getElementById("chromeActions");
    const old = findOldHeader();
    if(old){
      old.querySelectorAll("button, select, a[href]").forEach((el) => {
        if(el.tagName === "A" && isHomeLink(el)) return;
        if(el.closest("button, a") && el.closest("button, a") !== el) return;
        if(el.tagName === "A"){ el.classList.add("ia-pagelink"); movedLinks.push(el); }
        else actions.appendChild(el);
      });
      old.hidden = true;
      old.classList.add("chrome-replaced");
    }
    const h1 = document.querySelector("h1");
    document.querySelectorAll("a[href]").forEach((el) => {
      if(el.closest("#chromeHeader, #chromeFooter, #chromeContext") || !isHomeLink(el)) return;
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

    const getBar = () => document.getElementById("chromeContext");
    renderContext(bar);
    applyCopy();
    syncViewportWidth();
    exposeApi(getBar);
    bindLevelControls(getBar);
    window.addEventListener("resize", syncViewportWidth);
    let lastLang = lang();
    new MutationObserver(() => {
      applyCopy();
      if(lang() !== lastLang){ lastLang = lang(); refreshNav(); renderContext(getBar()); }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    // Pages that build their H1 after load (tools, guides) get the right breadcrumb label.
    [300, 1200].forEach((ms) => setTimeout(() => renderContext(getBar()), ms));

    const toggle = document.getElementById("chromeMenuToggle");
    const panel = document.getElementById("chromeMenuPanel");
    const fitPanel = () => {
      if(panel.hidden) return;
      const viewport = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const top = Math.max(0, panel.getBoundingClientRect().top);
      panel.style.maxHeight = `${Math.max(200, Math.floor(viewport - top))}px`;
    };
    const setOpen = (open, returnFocus) => {
      toggle.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
      body.classList.toggle("chrome-menu-open", open);
      if(open){ fitPanel(); panel.querySelector("a[href]")?.focus({ preventScroll: true }); }
      else{ panel.style.maxHeight = ""; if(returnFocus) toggle.focus(); }
    };
    window.addEventListener("resize", fitPanel);
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

  function init(){
    if(HOME_SHELL) initHomeShell();
    else initPage();
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
