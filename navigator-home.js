/* Homepage navigator v8.
 * Scope: homepage only.
 * Keeps the core app, routing, language system and school views untouched.
 */
(function(){
  "use strict";

  function isHome(){
    return location.pathname === "/" || location.pathname === "";
  }
  if(!isHome()) return;

  const COPY = {
    el: {
      finderTitle: "Διάλεξε ηλικιακή ζώνη και βρες το κατάλληλο εργαλείο",
      specialTitle: "Ειδικά σχολεία",
      specialAge: "Ειδική Εκπαίδευση",
      specialDesc: "Ειδικό Γυμνάσιο, Ειδικό Λύκειο, ΕΝ.Ε.Ε.ΓΥ.-Λ.",
      mapTitle: "🧭 Χάρτης Εξάσκησης",
      mapLead: "Δες πού χρειάζεσαι λίγη παραπάνω εξάσκηση.",
      mapDesc: "Σύντομο τεστ περίπου 2 λεπτών, χωρίς βαθμό.",
      mapPrimary: "Δημοτικό",
      mapMiddle: "Γυμνάσιο",
      mapHigh: "Λύκειο",
      mapSpecial: "Ειδικά σχολεία",
      aiBadgeNew: "Νέο",
      aiBadgeFree: "Δωρεάν",
      aiTitle: "Η δική μας AI Βοήθεια, φτιαγμένη για τα σχολικά μαθήματα.",
      aiDesc: "Διαφορετική από τα εργαλεία του καταλόγου. Σε καθοδηγεί με ερωτήσεις και μικρές υποδείξεις, αντί να σου δίνει έτοιμη λύση.",
      aiPrimary: "Γονιός Δημοτικού",
      aiMiddle: "Γυμνάσιο 13+",
      aiHigh: "Λύκειο",
      aiSpecial: "Ειδικά σχολεία",
      needsTitle: "Τι άλλο θα ήθελες να κάνεις;",
      needsHint: "PDF · Έρευνα · Flashcards · Παρουσίαση · Ανάγνωση · Δημιουργία",
      needs: [
        ["📄","Να μελετήσω PDF ή σημειώσεις","Εργαλεία και τρόποι χρήσης για μελέτη πάνω στο δικό σου υλικό","/meleti-pdf-me-ai.html"],
        ["🔎","Να κάνω έρευνα με πηγές","Επιλογές για έρευνα, πηγές και έλεγχο πληροφοριών","/erevna-me-piges-ai.html"],
        ["🧠","Να φτιάξω flashcards και επανάληψη","Κάρτες, μικρά τεστ και τρόποι αυτοελέγχου","/flashcards-epanalipsi-ai.html"],
        ["🎨","Να φτιάξω παρουσίαση ή αφίσα","Εργαλεία για οργάνωση, σχεδιασμό και παρουσίαση ιδεών","/parousiasi-afisa-ai.html"],
        ["📚","Να εξασκηθώ στην ανάγνωση ή στα Αγγλικά","Εργαλεία για ανάγνωση, προφορά και γλώσσες","/anagnosi-agglika-ai.html"],
        ["✨","Να δημιουργήσω κάτι με AI","Ιδέες και εργαλεία για δημιουργική χρήση χωρίς έτοιμη εργασία","/dimiourgiko-ai-gia-mathites.html"]
      ],
      engTitle: "Έννοιες στην Ελληνική Νοηματική",
      engDesc: "153 σχολικές έννοιες με απλή εξήγηση και επίσημο βίντεο ΕΝΓ",
      engLink: "Δες τις 153 έννοιες →",
      curriculumPrefix: "Δες και:",
      curriculumLabel: "Ελληνικός Χάρτης Ύλης 2026-27",
      methodology: "Πώς επιλέγουμε & ελέγχουμε τα εργαλεία",
      report: "Βρήκες λάθος ή παλιωμένη πληροφορία; ↗"
    },
    en: {
      finderTitle: "Choose an age group and find the right tool",
      specialTitle: "Special schools",
      specialAge: "Special Education",
      specialDesc: "Special Gymnasium, Special Lyceum, EN.E.E.GY.-L.",
      mapTitle: "🧭 Practice Map",
      mapLead: "See where a little more practice could help.",
      mapDesc: "A short check of about 2 minutes, with no grade.",
      mapPrimary: "Primary",
      mapMiddle: "Middle School",
      mapHigh: "High School",
      mapSpecial: "Special schools",
      aiBadgeNew: "New",
      aiBadgeFree: "Free",
      aiTitle: "Our AI Help, built for school subjects.",
      aiDesc: "Different from the tools in the catalogue. It guides you with questions and small hints instead of giving you a ready-made answer.",
      aiPrimary: "Primary parent",
      aiMiddle: "Middle School 13+",
      aiHigh: "High School",
      aiSpecial: "Special schools",
      needsTitle: "What else would you like to do?",
      needsHint: "PDF · Research · Flashcards · Presentation · Reading · Create",
      needs: [
        ["📄","Study a PDF or notes","Tools and methods for studying your own material","/en/study-pdf-with-ai.html"],
        ["🔎","Research with sources","Options for research, sources and checking information","/en/research-with-sources-ai.html"],
        ["🧠","Make flashcards and revise","Cards, short quizzes and self-checking","/en/flashcards-revision-ai.html"],
        ["🎨","Make a presentation or poster","Tools for organising, designing and presenting ideas","/en/presentation-poster-ai.html"],
        ["📚","Practice reading or English","Tools for reading, pronunciation and languages","/en/reading-english-ai.html"],
        ["✨","Create something with AI","Creative tools and ideas without ready-made schoolwork","/en/creative-ai-for-students.html"]
      ],
      engTitle: "Greek Sign Language concepts",
      engDesc: "153 school concepts with a simple explanation and official GSL video",
      engLink: "See the 153 concepts →",
      curriculumPrefix: "See also:",
      curriculumLabel: "Greek Curriculum Map 2026-27",
      methodology: "How we choose and review tools",
      report: "Found an error or outdated information? ↗"
    }
  };

  function isEnglish(){
    return !!document.getElementById("langEn")?.classList.contains("active") ||
      (document.documentElement.lang || "").toLowerCase().startsWith("en");
  }

  function currentCopy(){
    return isEnglish() ? COPY.en : COPY.el;
  }

  function ensureStyles(){
    let link = document.querySelector('link[data-navigator-home="1"]');
    if(link) return link;
    link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/navigator-home.css";
    link.dataset.navigatorHome = "1";
    document.head.appendChild(link);
    return link;
  }

  function revealHomepage(link){
    let done = false;
    const reveal = () => {
      if(done) return;
      done = true;
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("navigator-home-booting");
        document.documentElement.classList.add("navigator-home-ready");
      });
    };
    if(link?.sheet) reveal();
    else if(link){
      link.addEventListener("load", reveal, {once:true});
      link.addEventListener("error", reveal, {once:true});
      setTimeout(reveal, 700);
    }else reveal();
  }

  function ensureAccessibilityBadge(){
    const badges = document.querySelector("#zoneSelectView .hero__badges");
    if(!badges) return;
    let badge = document.getElementById("homeEngBadge");
    if(!badge){
      badge = document.createElement("span");
      badge.id = "homeEngBadge";
      badge.className = "badge badge--accent home-eng-badge";
      const privacy = badges.querySelector(".privacy-badge-details");
      if(privacy) badges.insertBefore(badge, privacy);
      else badges.appendChild(badge);
    }
    badge.textContent = isEnglish() ? "Accessible GSL material" : "Προσβάσιμο υλικό ΕΝΓ";
  }

  function hideLegacyHomeBlocks(){
    document.querySelector("#zoneSelectView .hero__learning-loop")?.classList.add("home-v8-legacy");
    document.querySelector("#zoneSelectView .hero__quiz-cta-wrap")?.classList.add("home-v8-legacy");
    document.querySelector("#zoneSelectView .hero__ai-help")?.classList.add("home-v8-legacy");
    document.querySelector("#zoneSelectView > .section-heading")?.classList.add("home-v8-legacy");
    document.querySelector("#zoneSelectView > .section-subheading")?.classList.add("home-v8-legacy");
  }

  function convertCoreZoneCardsToLinks(){
    const grid = document.getElementById("zoneGrid");
    if(!grid) return;
    const labels = isEnglish()
      ? {primary:"Primary",middle:"Middle School",high:"High School"}
      : {primary:"Δημοτικό",middle:"Γυμνάσιο",high:"Λύκειο"};
    ["primary","middle","high"].forEach((zone) => {
      const button = grid.querySelector(`button.zone-card[data-zone="${zone}"]`);
      if(!button) return;
      const link = document.createElement("a");
      link.className = button.className;
      link.dataset.zone = zone;
      link.href = `/${zone}/guardian/tools`;
      link.innerHTML = button.innerHTML;
      link.setAttribute("aria-label", labels[zone]);
      button.replaceWith(link);
    });
  }

  function ensureSpecialSchoolCard(){
    const grid = document.getElementById("zoneGrid");
    if(!grid) return null;
    let card = document.getElementById("specialSchoolZoneCard");
    if(!card){
      card = document.createElement("a");
      card.id = "specialSchoolZoneCard";
      card.className = "zone-card navigator-special-school-card";
      card.href = "/special-education.html";
      card.innerHTML = '<span class="zone-card__icon" aria-hidden="true">🏫</span><p class="zone-card__label"></p><p class="zone-card__age"></p><p class="zone-card__desc"></p>';
    }
    if(card.parentElement !== grid) grid.appendChild(card);
    const c = currentCopy();
    card.querySelector(".zone-card__label").textContent = c.specialTitle;
    card.querySelector(".zone-card__age").textContent = c.specialAge;
    card.querySelector(".zone-card__desc").textContent = c.specialDesc;
    card.setAttribute("aria-label", `${c.specialTitle}: ${c.specialAge}`);
    return card;
  }

  function helpersMarkup(){
    const c = currentCopy();
    return `
      <div class="home-v8-helpers">
        <section class="home-v8-map" aria-labelledby="homeV8MapTitle">
          <h3 id="homeV8MapTitle">${c.mapTitle}</h3>
          <p class="home-v8-map__lead">${c.mapLead}</p>
          <p class="home-v8-helper-desc">${c.mapDesc}</p>
          <div class="home-v8-helper-links">
            <a href="/primary/guardian/quiz">${c.mapPrimary}</a>
            <a href="/middle/guardian/quiz">${c.mapMiddle}</a>
            <a href="/high/guardian/quiz">${c.mapHigh}</a>
            <a href="/special-education.html">${c.mapSpecial}</a>
          </div>
        </section>

        <section class="home-v8-ai" aria-labelledby="homeV8AiTitle">
          <div class="home-v8-ai__badges">
            <span>${c.aiBadgeNew}</span>
            <span>${c.aiBadgeFree}</span>
          </div>
          <h3 id="homeV8AiTitle">${c.aiTitle}</h3>
          <p class="home-v8-helper-desc">${c.aiDesc}</p>
          <div class="home-v8-helper-links home-v8-ai__links">
            <a href="/primary/guardian/tutor">${c.aiPrimary}</a>
            <a href="/middle/student/tutor">${c.aiMiddle}</a>
            <a href="/high/student/tutor">${c.aiHigh}</a>
            <a href="/middle/student/tutor">${c.aiSpecial}</a>
          </div>
        </section>
      </div>`;
  }

  function needsMarkup(){
    const c = currentCopy();
    return `
      <button type="button" class="home-v8-needs__toggle" id="homeV8NeedsToggle" aria-expanded="false" aria-controls="homeV8NeedsBody">
        <span class="home-v8-needs__copy">
          <strong>${c.needsTitle}</strong>
          <span>${c.needsHint}</span>
        </span>
        <span class="home-v8-needs__arrow" aria-hidden="true">↓</span>
      </button>
      <div class="home-v8-needs__body" id="homeV8NeedsBody" hidden>
        <div class="home-v8-needs__grid">
          ${c.needs.map(([icon,title,desc,href]) => `
            <a class="home-v8-needs-card" href="${href}">
              <span class="home-v8-needs-card__icon" aria-hidden="true">${icon}</span>
              <span><strong>${title}</strong><small>${desc}</small></span>
            </a>`).join("")}
        </div>
      </div>`;
  }

  function ensureMainShell(){
    const hero = document.querySelector("#zoneSelectView .hero");
    const grid = document.getElementById("zoneGrid");
    if(!hero || !grid) return null;

    let shell = document.getElementById("homeV8Shell");
    if(!shell){
      shell = document.createElement("div");
      shell.id = "homeV8Shell";
      shell.className = "home-v8-shell";
      const badges = hero.querySelector(".hero__badges");
      if(badges) badges.insertAdjacentElement("afterend", shell);
      else hero.appendChild(shell);
    }

    let heading = document.getElementById("homeV8FinderTitle");
    if(!heading){
      heading = document.createElement("h2");
      heading.id = "homeV8FinderTitle";
      heading.className = "home-v8-finder-title";
      shell.appendChild(heading);
    }
    heading.textContent = currentCopy().finderTitle;

    if(grid.parentElement !== shell){
      heading.insertAdjacentElement("afterend", grid);
    }

    let helpers = document.getElementById("homeV8HelpersMount");
    if(!helpers){
      helpers = document.createElement("div");
      helpers.id = "homeV8HelpersMount";
      grid.insertAdjacentElement("afterend", helpers);
    }
    helpers.innerHTML = helpersMarkup();

    let needs = document.getElementById("homeV8Needs");
    if(!needs){
      needs = document.createElement("section");
      needs.id = "homeV8Needs";
      needs.className = "home-v8-needs";
      helpers.insertAdjacentElement("afterend", needs);
    }
    const expanded = needs.querySelector("#homeV8NeedsToggle")?.getAttribute("aria-expanded") === "true";
    needs.innerHTML = needsMarkup();
    setNeedsOpen(needs, expanded);

    return shell;
  }

  function setNeedsOpen(section, open){
    if(!section) return;
    const toggle = section.querySelector("#homeV8NeedsToggle");
    const body = section.querySelector("#homeV8NeedsBody");
    if(!toggle || !body) return;
    section.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    body.hidden = !open;
  }

  function ensureEngSection(){
    const zoneSection = document.getElementById("zoneSelectView");
    if(!zoneSection) return;
    const notGuide = zoneSection.querySelector(".not-guide-box");
    let box = document.getElementById("homeV8Eng");
    if(!box){
      box = document.createElement("section");
      box.id = "homeV8Eng";
      box.className = "home-v8-eng";
      if(notGuide) notGuide.insertAdjacentElement("beforebegin", box);
      else zoneSection.appendChild(box);
    }
    const c = currentCopy();
    box.innerHTML = `
      <div class="home-v8-eng__copy">
        <span class="home-v8-eng__icon" aria-hidden="true">🤟</span>
        <div>
          <h2>${c.engTitle}</h2>
          <p>${c.engDesc}</p>
        </div>
      </div>
      <a href="/sign-language.html">${c.engLink}</a>`;

    let curriculum = document.getElementById("homeV8Curriculum");
    if(!curriculum){
      curriculum = document.createElement("p");
      curriculum.id = "homeV8Curriculum";
      curriculum.className = "home-v8-curriculum";
      if(notGuide) notGuide.insertAdjacentElement("afterend", curriculum);
      else zoneSection.appendChild(curriculum);
    }
    curriculum.innerHTML = `${c.curriculumPrefix} <a href="/xartis-ylis.html">${c.curriculumLabel}</a>`;
  }

  function ensureFooterLinks(){
    const footer = document.querySelector("footer.site-footer");
    if(!footer) return;
    let extra = document.getElementById("homeV8FooterExtra");
    if(!extra){
      extra = document.createElement("p");
      extra.id = "homeV8FooterExtra";
      extra.className = "site-footer__legal home-v8-footer-extra";
      footer.appendChild(extra);
    }
    const c = currentCopy();
    extra.innerHTML = `<a href="/methodology.html">${c.methodology}</a> · <a href="/report-error.html">${c.report}</a>`;
  }

  function apply(){
    const styleLink = ensureStyles();
    hideLegacyHomeBlocks();
    ensureAccessibilityBadge();
    convertCoreZoneCardsToLinks();
    ensureSpecialSchoolCard();
    ensureMainShell();
    ensureEngSection();
    ensureFooterLinks();
    revealHomepage(styleLink);
  }

  function init(){
    apply();

    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if(!target) return;

      const toggle = target.closest("#homeV8NeedsToggle");
      if(toggle){
        const section = document.getElementById("homeV8Needs");
        const open = toggle.getAttribute("aria-expanded") === "true";
        setNeedsOpen(section, !open);
        return;
      }

      if(target.closest("#langEl,#langEn,#backToZones")){
        setTimeout(apply, 0);
      }
    });

    window.addEventListener("popstate", apply);

    const grid = document.getElementById("zoneGrid");
    if(grid && "MutationObserver" in window){
      const observer = new MutationObserver(() => {
        convertCoreZoneCardsToLinks();
        ensureSpecialSchoolCard();
      });
      observer.observe(grid, {childList:true});
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init, {once:true});
  }else{
    init();
  }
})();
