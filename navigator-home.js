/* Homepage navigator v8.4.
 * Scope: homepage only.
 * Keeps the core app, routing, language system and school views untouched.
 * Legacy homepage injectors remain available to the rest of the app but are suppressed here.
 */
(function(){
  "use strict";

  const signLanguageConceptCount = Number(window.AITOOLSKIDS_SITE_META?.signLanguageConceptCount) || 167;

  function isHome(){
    return location.pathname === "/" || location.pathname === "";
  }
  if(isHome()) document.documentElement.classList.add("home-v8-active");

  const COPY = {
    el: {
      curriculumCardBadge: "Ύλη 2026–27",
      curriculumCardTitle: "Βρες την ενότητα που διαβάζεις",
      curriculumCardDesc: "Τάξη → μάθημα → πραγματική ενότητα → AI βοήθεια, εξάσκηση και οπτική εξήγηση.",
      aiBadgeNew: "Νέο",
      aiBadgeFree: "Δωρεάν",
      aiTitle: "AI Βοήθεια",
      aiDesc: "AI Βοήθεια: μία ερώτηση ή μικρή υπόδειξη τη φορά, πάνω στη δική σου προσπάθεια.",
      aiTechSummary: "ⓘ Ποιο AI χρησιμοποιείται;",
      aiTechText: "GPT-OSS 120B μέσω Cloudflare Workers AI, με Groq ως εφεδρικό πάροχο. Το Puter είναι προαιρετική εναλλακτική.",
      aiTechLink: "Διαφάνεια AI →",
      aiPrimary: "Γονιός Δημοτικού",
      aiMiddle: "Γονιός Γυμνασίου",
      aiHigh: "Λύκειο",
      aiSpecial: "Ειδικά σχολεία",
      engTitle: "Έννοιες στην Ελληνική Νοηματική",
      engDesc: `${signLanguageConceptCount} σχολικές έννοιες με απλή εξήγηση και επίσημο βίντεο ΕΝΓ`,
      engLink: `Δες τις ${signLanguageConceptCount} έννοιες →`,
      stepsLabel: "Τι χρειάζεσαι τώρα;",
      moreTitle: "Ανακάλυψε περισσότερα",
      charTile: "Μίλα με χαρακτήρα της Ιστορίας",
      charTileDesc: "Διάλογος με πρόσωπα από την ύλη και έλεγχος του τι έμαθες.",
      stepRole: "1 · Ποιος είσαι;",
      stepZone: "2 · Βαθμίδα ή διαδρομή",
      stepNeed: "3 · Τι χρειάζεσαι σήμερα;",
      roles: { guardian: "Γονιός", student: "Μαθητής / Μαθήτρια", teacher: "Εκπαιδευτικός", university: "Φοιτητής / Φοιτήτρια" },
      zones: { preschool: ["Νηπιαγωγείο","4–6"], primary: ["Δημοτικό","6–12"], middle: ["Γυμνάσιο","12–15"], high: ["ΓΕΛ","15–18"], epal: ["ΕΠΑΛ","15–18"], special: ["Ειδική Εκπαίδευση",""] },
      finderNeeds: { study: "Δεν καταλαβαίνω μια ενότητα", practice: "Θέλω εξάσκηση", stuck: "Κόλλησα σε άσκηση", pdf: "Έχω PDF ή σημειώσεις", organize: "Δεν ξέρω από πού να αρχίσω", tools: "Να βρω το κατάλληλο AI" },
      ctaTools: "Δες εργαλεία για", ctaPractice: "Χάρτης Εξάσκησης για", ctaStuck: "AI Βοήθεια για", ctaStudy: "Άνοιξε την AI Μελέτη", ctaPreschool: "Δραστηριότητες Νηπιαγωγείου", ctaSpecial: "Άνοιξε την Ειδική Εκπαίδευση", ctaTeacher: "Άνοιξε τα εργαλεία για εκπαιδευτικούς", mapGel: "ΓΕΛ", mapEpal: "ΕΠΑΛ", ctaSpecialPractice: "Κάνε το μικρό διαγνωστικό", ctaUniversity: "Άνοιξε τη φοιτητική διαδρομή",
      noteTeacher: "Φύλλα εργασίας, αξιολόγηση, σχέδια μαθήματος, δραστηριότητες και βίντεο πάνω στην ύλη 2026–27.",
      noteUniversity: "Πιλοτική διαδρομή για επιλεγμένα πανεπιστημιακά τμήματα, με επίσημες πηγές.",
      teacherWayEyebrow: "Για εκπαιδευτικούς",
      teacherWayTitle: "Υλικό για την τάξη σου, πάνω στην ύλη 2026–27.",
      teacherWayDesc: "Φύλλα εργασίας, αξιολόγηση, σχέδια μαθήματος, βίντεο και δραστηριότητες με QR για την τάξη. Εσύ ελέγχεις και προσαρμόζεις.",
      teacherWayCta: "Άνοιξε τα εργαλεία εκπαιδευτικού\u00a0→",
      notePreschool: "Στο Νηπιαγωγείο ο ενήλικας χειρίζεται το εργαλείο. Θα δεις δραστηριότητες για γονείς και εκπαιδευτικούς.",
      notePrimaryStudent: "Δημοτικό: μαζί με γονέα ή εκπαιδευτικό. Η AI Βοήθεια ανοίγει στη διαδρομή του ενήλικα.",
      noteMiddleStudent: "Γυμνάσιο: μαθητική AI Βοήθεια από 13 ετών. Για μικρότερη ηλικία, μαζί με γονέα. Κάθε εξωτερικό εργαλείο έχει δικό του όριο ηλικίας.",
      noteMiddleStuck: "Η AI Βοήθεια για μαθητές Γυμνασίου ανοίγει από 13 ετών. Διάλεξε πρώτα την ηλικία σου στην επόμενη σελίδα.",
      noteHigh: "Μαθητική διαδρομή Λυκείου. Στο ΕΠΑΛ επιλέγεις τάξη και, όπου χρειάζεται, τομέα ή ειδικότητα.",
      noteSpecial: "Διαδρομή για Ειδικό Γυμνάσιο, Ειδικό Λύκειο και ΕΝ.Ε.Ε.ΓΥ.-Λ.",
      waysTitle: "Γρήγορη πρόσβαση",
      studyGoalsLabel: "Τι θέλεις;",
      studyGoals: [["pdf","📄","PDF / σημειώσεις"],["understand","🧠","Να το καταλάβω"],["revise","🔁","Επανάληψη"],["test","📝","Γράφω τεστ"],["practice","🎯","Εξάσκηση"]],
      teacherTasksLabel: "Φτιάξε:",
      teacherTasks: [["worksheet","📝","Φύλλο εργασίας"],["assessment","✅","Αξιολόγηση"],["lesson","🗂️","Σχέδιο μαθήματος"],["video","🎬","Βίντεο"]],
      aiLinksLabel: "Άνοιξε για:",
      studyBadge: "Δωρεάν",
      studyTitle: "AI Μελέτη",
      studyDesc: "AI Μελέτη: σχολική ενότητα ή δικές σου σημειώσεις/PDF, με εξήγηση, κάρτες, quiz και πλάνο μέσα στο site.",
      studyOfficial: "Βασισμένη στο επίσημο σχολικό βιβλίο · Ύλη 2026–27",
      studyCoverage: "Με σημειώσεις/PDF οι απαντήσεις βασίζονται στο υλικό σου. Η κάλυψη σχολικών βιβλίων είναι επιλεκτική.",
      studyCta: "Φτιάξε το πλάνο μελέτης σου →",
      charCta: "Ξεκίνα μια συζήτηση →",
      chars: [["socrates","Σωκράτης","Αρχαία Αθήνα"],["pericles","Περικλής","Χρυσός αιώνας"],["greek-revolution-1821","Αγωνιστής του 1821","Επανάσταση"]]
    },
    en: {
      curriculumCardBadge: "Curriculum 2026–27",
      curriculumCardTitle: "Find the unit you are studying",
      curriculumCardDesc: "Grade → subject → real curriculum unit → AI help, practice and visual explanation.",
      aiBadgeNew: "New",
      aiBadgeFree: "Free",
      aiTitle: "AI Help",
      aiDesc: "AI Help: one question or small hint at a time, building on your own attempt.",
      aiTechSummary: "ⓘ Which AI is used?",
      aiTechText: "GPT-OSS 120B via Cloudflare Workers AI, with Groq as the fallback provider. Puter is an optional alternative.",
      aiTechLink: "AI transparency →",
      aiPrimary: "Primary parent",
      aiMiddle: "Middle School parent",
      aiHigh: "High School",
      aiSpecial: "Special schools",
      engTitle: "Greek Sign Language concepts",
      engDesc: `${signLanguageConceptCount} school concepts with a simple explanation and official GSL video`,
      engLink: `See the ${signLanguageConceptCount} concepts →`,
      stepsLabel: "What do you need right now?",
      moreTitle: "Discover more",
      charTile: "Talk with a character from history",
      charTileDesc: "A dialogue with people from the curriculum, then a check of what you learned.",
      stepRole: "1 · Who are you?",
      stepZone: "2 · Level or pathway",
      stepNeed: "3 · What do you need today?",
      roles: { guardian: "Parent", student: "Student", teacher: "Educator", university: "University student" },
      zones: { preschool: ["Preschool","4–6"], primary: ["Primary","6–12"], middle: ["Middle School","12–15"], high: ["General Lyceum","15–18"], epal: ["EPAL","15–18"], special: ["Special Education",""] },
      finderNeeds: { study: "I don't understand a unit", practice: "I want to practise", stuck: "I'm stuck on an exercise", pdf: "I have a PDF or notes", organize: "I don't know where to start", tools: "Find the right AI" },
      ctaTools: "See tools for", ctaPractice: "Practice Map for", ctaStuck: "AI Help for", ctaStudy: "Open AI Study", ctaPreschool: "Preschool activities", ctaSpecial: "Open Special Education", ctaTeacher: "Open the educator tools", mapGel: "General Lyceum", mapEpal: "Vocational Lyceum (EPAL)", ctaSpecialPractice: "Take the short check", ctaUniversity: "Open the university pathway",
      noteTeacher: "Worksheets, assessment, lesson plans, activities and videos built on the 2026–27 curriculum.",
      noteUniversity: "Pilot pathway for selected university departments, with official sources.",
      teacherWayEyebrow: "For educators",
      teacherWayTitle: "Material for your class, built on the 2026–27 curriculum.",
      teacherWayDesc: "Worksheets, assessment, lesson plans, videos and QR activities for your class. You review and adapt.",
      teacherWayCta: "Open the educator tools\u00a0→",
      notePreschool: "In preschool the adult operates the tool. You will see activities for parents and educators.",
      notePrimaryStudent: "Primary school: together with a parent or educator. AI Help opens in the adult pathway.",
      noteMiddleStudent: "Middle school: student AI Help from age 13. Younger students use it with a parent. External tools have their own age limits.",
      noteMiddleStuck: "AI Help for middle-school students opens from age 13. Choose your age first on the next page.",
      noteHigh: "For EPAL you will then choose a grade and, where needed, a sector or specialty.",
      noteSpecial: "Pathway for Special Gymnasium, Special Lyceum and EN.E.E.GY.-L.",
      waysTitle: "Quick access",
      studyGoalsLabel: "What do you need?",
      studyGoals: [["pdf","📄","PDF / notes"],["understand","🧠","Understand it"],["revise","🔁","Review"],["test","📝","Test coming up"],["practice","🎯","Practise"]],
      teacherTasksLabel: "Create:",
      teacherTasks: [["worksheet","📝","Worksheet"],["assessment","✅","Assessment"],["lesson","🗂️","Lesson plan"],["video","🎬","Video"]],
      aiLinksLabel: "Open for:",
      studyBadge: "Free",
      studyTitle: "AI Study",
      studyDesc: "AI Study: a school unit or your own notes/PDF, with explanations, cards, quizzes and a study plan here on the site.",
      studyOfficial: "Based on the official school textbook · Curriculum 2026–27",
      studyCoverage: "With notes/PDF, answers are based on your material. Textbook coverage is selective.",
      studyCta: "Build your study plan →",
      charCta: "Start a conversation →",
      chars: [["socrates","Socrates","Ancient Athens"],["pericles","Pericles","Golden Age"],["greek-revolution-1821","Fighter of 1821","Greek Revolution"]]
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

    document.getElementById("homeEngBadge")?.remove();
    let badge = document.getElementById("heroGslBadge");
    if(!badge){
      badge = document.createElement("span");
      badge.id = "heroGslBadge";
      badge.className = "badge badge--accent home-eng-badge";
      const privacy = badges.querySelector(".privacy-badge-details");
      if(privacy) badges.insertBefore(badge, privacy);
      else badges.appendChild(badge);
    }
    badge.classList.add("home-eng-badge");
    badge.textContent = isEnglish() ? "Accessible GSL material" : "Προσβάσιμο υλικό ΕΝΓ";
  }

  function suppressLegacyInjectedBlocks(){
    [
      "pwaMobileLauncher",
      "curriculumMapFeature",
      "signLanguageFeature",
      "specialEducationHomeFeature"
    ].forEach((id) => document.getElementById(id)?.classList.add("home-v8-legacy"));
  }

  function hideLegacyHomeBlocks(){
    document.querySelector("#zoneSelectView .hero__learning-loop")?.classList.add("home-v8-legacy");
    document.querySelector("#zoneSelectView .hero__map-pair")?.classList.add("home-v8-legacy");
    document.querySelector("#zoneSelectView .hero__quiz-cta-wrap")?.classList.add("home-v8-legacy");
    document.querySelector("#zoneSelectView .hero__ai-help")?.classList.add("home-v8-legacy");
    document.getElementById("homeAiLearningModes")?.classList.add("home-v8-legacy");
    document.querySelector("#zoneSelectView > .section-heading")?.classList.add("home-v8-legacy");
    document.querySelector("#zoneSelectView > .section-subheading")?.classList.add("home-v8-legacy");
    suppressLegacyInjectedBlocks();
  }

  const ICON = {
    teacher: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" focusable="false"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M7 20h10M12 16v4M7 9h6M7 12h4"/></svg>',
    map: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"></path><path d="M9 4v14M15 6v14"></path></svg>',
    chat: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 5h16v11H9l-5 4z"></path><path d="M9 10h6"></path></svg>',
    book: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3z"></path><path d="M21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z"></path></svg>',
    shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"></path><path d="M12 8v5M12 16.5v.01"></path></svg>'
  };

  const svg = (d) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
  const HAND_ICON = svg('<path d="M8 13V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6 7-2.5 0-4-1.5-5.5-4l-2-3.5a1.5 1.5 0 0 1 2.5-1.5L8 13"></path>');

  function escapeHtml(value){
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  }

  // ---------- Hero: 3-step finder ----------
  let shortcutSelectionMade = false;
  const shortcutIntent = () => location.hash === "#open-tools" ? "tools" : location.hash === "#open-help" ? "stuck" : "";
  const finderState = { role: "student", zone: "middle", need: "study" };

  // Educators and university students skip the school-level steps: one choice, one destination.
  try {
    const saved=JSON.parse(sessionStorage.getItem("aitools4kidsShortcutSelection") || "null");
    if(saved && ["student","guardian","teacher","university"].includes(saved.role) && ["primary","middle","high","epal","preschool","special"].includes(saved.zone)){
      finderState.role=saved.role; finderState.zone=saved.zone; shortcutSelectionMade=true;
    }
  } catch {}

  const DIRECT_ROLES = { teacher: "/teacher-assistant.html", university: "/higher-education-pilot.html" };

  function finderHref(){
    const { role, zone } = finderState;
    const need = shortcutIntent() || finderState.need;
    if(DIRECT_ROLES[role]) return DIRECT_ROLES[role];
    if(zone === "preschool") return "/preschool";
    if(zone === "special") return "/special-education.html";
    if(need === "organize") return "/organosi-meletis-ai.html";
    if(need === "study" || need === "pdf") return `/study.html?zone=${zone === "epal" ? "high" : zone}${zone === "epal" ? "&schoolType=epal" : ""}${need === "pdf" ? "#studyNotes" : ""}`;
    if(zone === "epal") return `/high/${role === "guardian" ? "guardian" : "student"}/${need === "tools" ? "tools" : "tutor"}?schoolType=epal`;
    if(need === "practice") return `/${zone}/guardian/quiz`;
    if(need === "stuck"){
      if(zone === "primary") return "/primary/guardian/tutor";
      return `/${zone}/${role === "student" ? "student" : "guardian"}/tutor`;
    }
    return `/${zone}/${role === "student" ? "student" : "guardian"}/tools`;
  }

  function finderCta(c){
    const { zone, need } = finderState;
    if(finderState.role === "teacher") return c.ctaTeacher;
    if(finderState.role === "university") return c.ctaUniversity;
    if(zone === "preschool") return c.ctaPreschool;
    if(zone === "special") return need === "practice" ? c.ctaSpecialPractice : c.ctaSpecial;
    if(need === "pdf") return isEnglish() ? "Study your PDF or notes" : "Μελέτησε το PDF ή τις σημειώσεις σου";
    if(need === "organize") return isEnglish() ? "Break it into small steps" : "Σπάσε το διάβασμα σε μικρά βήματα";
    if(need === "study") return c.ctaStudy;
    if(zone === "epal") return isEnglish() ? "Open EPAL subject help" : "Άνοιξε βοήθεια για τα μαθήματα ΕΠΑΛ";
    if(zone === "high" && need === "practice") return `${c.ctaPractice} ${c.mapGel}`;
    const label = c.zones[zone][0];
    const lead = need === "practice" ? c.ctaPractice : need === "stuck" ? c.ctaStuck : c.ctaTools;
    return `${lead} ${label}`;
  }

  function finderNote(c){
    const { role, zone } = finderState;
    if(role === "teacher") return c.noteTeacher;
    if(role === "university") return c.noteUniversity;
    if(zone === "preschool") return c.notePreschool;
    if(zone === "special") return c.noteSpecial;
    if(zone === "primary" && role === "student") return c.notePrimaryStudent;
    if(zone === "middle" && role === "student") return "";
    if(zone === "high" || zone === "epal") return c.noteHigh;
    return "";
  }

  // The Special Education and EPAL practice checks open inline (special-education-diagnostic.js, epal-practice-map.js).
  function practiceTrigger(){
    const { role, zone, need } = finderState;
    if(DIRECT_ROLES[role] || need !== "practice") return "";
    return zone === "special" ? " data-special-education-diagnostic" : zone === "epal" ? " data-epal-practice-map" : "";
  }

  function practiceExtra(c){
    const { role, zone, need } = finderState;
    if(DIRECT_ROLES[role] || need !== "practice" || zone === "preschool" || zone === "special") return "";
    const exact = `<a class="home-v9-finder__extra" href="/study.html?zone=${zone === "epal" ? "high" : zone}&mode=practice${zone === "epal" ? "&schoolType=epal" : ""}">${isEnglish() ? "Know your unit? Practise that unit →" : "Ξέρεις την ενότητα; Κάνε εξάσκηση σε αυτή →"}</a>`;
    const epal = zone === "high" ? `<a class="home-v9-finder__extra" href="/high/student/tutor?schoolType=epal" data-epal-practice-map>${escapeHtml(`${c.ctaPractice} ${c.mapEpal}`)} <span aria-hidden="true">→</span></a>` : "";
    return exact + epal;
  }

  function chip(kind, value, label, pressed, extra){
    return `<button type="button" class="home-v9-chip" data-finder-${kind}="${value}" aria-pressed="${pressed ? "true" : "false"}">${extra || ""}<span>${escapeHtml(label)}</span></button>`;
  }

  function renderFinder(){
    const mount = document.getElementById("homeV9Finder");
    if(!mount) return;
    const c = currentCopy();
    const roles = Object.entries(c.roles).map(([id,label]) => chip("role", id, label, finderState.role === id)).join("");
    // Preschool is adult-led, so it is not offered to the student role.
    const zones = Object.entries(c.zones).filter(([id]) => !(id === "preschool" && finderState.role === "student")).map(([id,[label,age]]) => chip("zone", id, label, finderState.zone === id, `<span class="home-v9-chip__dot home-v9-dot--${id}" aria-hidden="true"></span>`) .replace(`<span>${escapeHtml(label)}</span></button>`, `<span>${escapeHtml(label)}</span>${age ? `<small>${age}</small>` : ""}</button>`)).join("");
    const needs = Object.entries(c.finderNeeds).map(([id,label]) => chip("need", id, label, finderState.need === id)).join("");
    const note = finderNote(c);
    const step = (title, chips) => `<div class="home-v9-finder__step" role="group" aria-label="${escapeHtml(title)}"><span class="home-v9-finder__step-title" aria-hidden="true">${title}</span><div class="home-v9-finder__chips">${chips}</div></div>`;
    const intent = shortcutIntent();
    const schoolSteps = DIRECT_ROLES[finderState.role] ? "" : step(c.stepZone, zones) + (intent ? "" : step(c.stepNeed, needs));
    const title = intent ? (intent === "tools" ? (isEnglish() ? "Find tools for your level" : "Εργαλεία για τη βαθμίδα σου") : (isEnglish() ? "Open AI Help" : "Άνοιξε την AI Βοήθεια")) : c.stepsLabel;
    mount.innerHTML = `
      <h2 class="home-v9-finder__label" id="homeV8FinderTitle" tabindex="-1">${title}</h2>
      ${step(c.stepRole, roles)}
      ${schoolSteps}
      <p class="home-v9-finder__note" aria-live="polite"${note ? "" : " hidden"}>${note ? ICON.shield + `<span>${escapeHtml(note)}</span>` : ""}</p>
      <a class="home-v9-way__action" style="grid-column:1/-1;justify-self:start" id="homeV9FinderCta" href="${finderHref()}"${practiceTrigger()}>${escapeHtml(finderCta(c))} <span aria-hidden="true">→</span></a>
      ${practiceExtra(c)}`;
  }

  function ensureEntryLinks(){
    const intro = document.querySelector(".home-v9-intro");
    const finder = document.getElementById("homeV9Finder");
    if(!intro || !finder) return;
    let entry = document.getElementById("homeIntentLinks");
    if(!entry){ entry=document.createElement("div"); entry.id="homeIntentLinks"; intro.insertBefore(entry,finder); }
    const en=isEnglish();
    document.getElementById("homePracticeEntry")?.remove();
    const quiz=document.getElementById("heroQuizCtaBtn")?.closest(".hero__quiz-cta-wrap");
    if(quiz){
      quiz.classList.remove("home-v8-legacy");
      intro.querySelector(".hero__badges")?.insertAdjacentElement("afterend",quiz);
      const button=quiz.querySelector("#heroQuizCtaBtn");
      button.setAttribute("aria-controls","heroQuizPicker");
      button.setAttribute("aria-expanded",String(!quiz.querySelector("#heroQuizPicker").hidden));
      quiz.querySelector(".hero__quiz-cta-title").textContent=en ? "Take the quick quizzes · 2 minutes" : "Κάνε τα σύντομα κουίζ · 2 λεπτά";
      quiz.querySelector(".hero__quiz-cta-sub").textContent=en ? "Find what needs more practice and which tool can help." : "Δες πού χρειάζεσαι λίγη παραπάνω εξάσκηση και ποιο εργαλείο θα βοηθήσει.";
      if(!button.dataset.quizDisclosureBound){button.dataset.quizDisclosureBound="1";button.addEventListener("click",()=>queueMicrotask(()=>button.setAttribute("aria-expanded",String(!quiz.querySelector("#heroQuizPicker").hidden))));}
    }
    entry.remove();
  }

  // Quick-action chips inside a "three ways" card (same look as the AI Help "Open for" links).
  const wayChips = (items, href) => items.map(([id,icon,label]) => `<a href="${href(id)}"><span aria-hidden="true">${icon}</span> ${escapeHtml(label)}</a>`).join("");

  function helpersMarkup(){
    const c = currentCopy();
    return `
      <div class="home-v8-helpers">
        <h2 class="home-v9-visually-hidden" id="homeV9WaysTitle">${c.waysTitle}</h2>
        <div class="home-v9-ways">
          <section class="home-v8-ai" aria-labelledby="homeV8AiTitle">
            <span class="home-v9-way__icon" aria-hidden="true">${ICON.chat}</span>
            <div class="home-v8-ai__badges">
              <span>${c.aiBadgeFree}</span>
            </div>
            <h3 id="homeV8AiTitle"><a href="/tools/ai-help.html">${c.aiTitle}</a></h3>
            <p class="home-v8-helper-desc">${c.aiDesc}</p>
            <details class="home-v8-ai__tech" id="homeV8AiTechDetails">
              <summary>${c.aiTechSummary}</summary>
              <p>${c.aiTechText} <a href="/ai-transparency.html">${c.aiTechLink}</a></p>
            </details>
            <p class="home-v9-way__links-label">${c.aiLinksLabel}</p>
            <div class="home-v8-helper-links home-v8-ai__links">
              <a href="/primary/guardian/tutor">${c.aiPrimary}</a>
              <a href="/middle/guardian/tutor">${c.aiMiddle}</a>
              <a href="/high/student/tutor">${c.aiHigh}</a>
              <a href="/special-education.html">${c.aiSpecial}</a>
            </div>
            <ol aria-label="${isEnglish() ? "How AI Help works" : "Πώς λειτουργεί η AI Βοήθεια"}" style="display:flex;gap:12px;list-style:none;padding:20px 0 0;margin:auto 0 0;border-top:1px solid #d7e4ee">
              ${(isEnglish() ? [["💬","Show your attempt"],["💡","Get a hint"],["✍️","Try again"]] : [["💬","Δείξε την προσπάθειά σου"],["💡","Πάρε μια υπόδειξη"],["✍️","Δοκίμασε ξανά"]]).map(([icon,label]) => `<li style="flex:1;min-width:0;font-size:13px;line-height:1.5"><span aria-hidden="true" style="display:block;font-size:24px;margin-bottom:8px">${icon}</span>${label}</li>`).join("")}
            </ol>
          </section>

          <section class="home-v9-study-way" id="homeV9Study" aria-labelledby="homeV9StudyTitle">
            <span class="home-v9-way__icon" aria-hidden="true">${ICON.book}</span>
            <div class="home-v8-ai__badges"><span>${c.studyBadge}</span></div>
            <h3 id="homeV9StudyTitle">${c.studyTitle}</h3>
            <p class="home-v8-helper-desc">${c.studyDesc}</p>
            <p class="home-v9-study-way__official"><strong>${c.studyOfficial}</strong><small>${c.studyCoverage}</small></p>
            <p class="home-v9-way__links-label">${c.studyGoalsLabel}</p>
            <div class="home-v8-helper-links">${wayChips(c.studyGoals, (id) => id === "pdf" ? "/study.html#studyNotes" : `/study.html?mode=${id}`)}</div>
            <a class="home-v9-way__action" href="/study.html">${c.studyCta}</a>
          </section>

          <section class="home-v9-teacher-way" id="homeV9Teacher" aria-labelledby="homeV9TeacherTitle">
            <span class="home-v9-way__icon" aria-hidden="true">${ICON.teacher}</span>
            <p class="home-v9-way__eyebrow">${c.teacherWayEyebrow}</p>
            <h3 id="homeV9TeacherTitle">${c.teacherWayTitle}</h3>
            <p class="home-v8-helper-desc">${c.teacherWayDesc}</p>
            <p class="home-v9-way__links-label">${c.teacherTasksLabel}</p>
            <div class="home-v8-helper-links">${wayChips(c.teacherTasks, (id) => `/teacher-assistant.html?task=${id}#builder`)}</div>
            <a class="home-v9-way__action" href="/teacher-assistant.html">${c.teacherWayCta}</a>
          </section>
        </div>
      </div>`;
  }

  function charactersMarkup(){
    const c = currentCopy();
    const characterRoute = "/history-characters.html";
    return `
      <ul class="home-v9-tile__faces" aria-hidden="true">
        ${c.chars.map(([file]) => `<li><img src="/assets/characters/${file}.png" alt="" width="56" height="56" decoding="async"></li>`).join("")}
      </ul>
      <h3 id="homeV9CharactersTitle">${c.charTile}</h3>
      <p>${c.charTileDesc}</p>
      <a class="home-v9-tile__cta" href="${characterRoute}">${c.charCta}</a>`;
  }

  // "Discover more": secondary features grouped as compact tiles (moved, not recreated).
  function ensureMoreSection(characters){
    let more = document.getElementById("homeV9More");
    if(!more){
      more = document.createElement("section");
      more.id = "homeV9More";
      more.className = "home-v9-more";
      more.setAttribute("aria-labelledby", "homeV9MoreTitle");
      more.innerHTML = `<h2 id="homeV9MoreTitle"></h2><div class="home-v9-more__grid"></div>`;
    }
    more.querySelector("#homeV9MoreTitle").textContent = currentCopy().moreTitle;
    const grid = more.querySelector(".home-v9-more__grid");
    characters.classList.add("home-v9-tile");
    const tiles = [characters, document.getElementById("homeV8Eng")].filter(Boolean);
    const current = [...grid.children];
    if(current.length !== tiles.length || current.some((el, i) => el !== tiles[i])) tiles.forEach((el) => grid.appendChild(el));
    return more;
  }

  function ensureSection(id, className, labelledBy, markup){
    let el = document.getElementById(id);
    if(!el){
      el = document.createElement("section");
      el.id = id;
      el.className = className;
      el.setAttribute("aria-labelledby", labelledBy);
    }
    el.innerHTML = markup;
    return el;
  }

  // v9.2: the site search lives in the header as a compact field.
  function placeSearchFirst(){
    const mount = document.getElementById("siteHeaderSearch");
    const search = document.getElementById("homeGlobalSearch");
    if(mount && search && search.parentElement !== mount) mount.appendChild(search);
  }


  // The Greek Curriculum Map stands on its own, as a slim strip under "Three ways to start".
  function curriculumStripMarkup(){
    const c = currentCopy();
    return `
      <span class="home-v9-curriculum-strip__icon" aria-hidden="true">${ICON.map}</span>
      <span class="home-v9-curriculum-strip__copy">
        <span class="home-v9-curriculum-strip__badge">${c.curriculumCardBadge}</span>
        <strong id="homeV9CurriculumTitle">${c.curriculumCardTitle}</strong>
        <small>${c.curriculumCardDesc}</small>
      </span>
      <span class="home-v9-curriculum-strip__cta" aria-hidden="true">→</span>`;
  }

  // Homepage v10: "who are you" finder → three ways to start → curriculum map → discover more.
  // Age zones are reached from the finder, so the zone grid stays only as a hidden, crawlable fallback.
  function ensureMainShell(){
    const hero = document.querySelector("#zoneSelectView .hero");
    if(!hero) return null;

    let shell = document.getElementById("homeV8Shell");
    if(!shell){
      shell = document.createElement("div");
      shell.id = "homeV8Shell";
      shell.className = "home-v8-shell";
      const anchor = document.getElementById("homeV9Top") || hero.querySelector(".hero__badges");
      if(anchor) anchor.insertAdjacentElement("afterend", shell);
      else hero.appendChild(shell);
    }

    let helpers = document.getElementById("homeV8HelpersMount");
    if(!helpers){
      helpers = document.createElement("div");
      helpers.id = "homeV8HelpersMount";
    }
    helpers.innerHTML = helpersMarkup();

    let strip = document.getElementById("homeCurriculumStrip");
    if(!strip){
      strip = document.createElement("a");
      strip.id = "homeCurriculumStrip";
      strip.className = "home-v9-curriculum-strip";
      strip.href = "/xartis-ylis.html";
    }
    strip.innerHTML = curriculumStripMarkup();

    const characters = ensureSection("homeV9Characters", "home-v9-characters", "homeV9CharactersTitle", charactersMarkup());
    const more = ensureMoreSection(characters);
    const order = [helpers, strip, more];
    const current = [...shell.children].filter((el) => order.includes(el));
    if(current.length !== order.length || current.some((el, i) => el !== order[i])){
      order.forEach((el) => shell.appendChild(el));
    }

    // Blocks the v10 homepage no longer shows (each destination is reachable from the finder or the menu).
    ["homeV8Needs", "homeV8FinderTitle", "homeV9ZonesLead"].forEach((id) => {
      const el = document.getElementById(id);
      if(el && el.closest("#homeV8Shell")) el.remove();
    });
    ["zoneGrid", "homeVideoNew", "homeV9Principle"].forEach((id) => document.getElementById(id)?.classList.add("home-v8-legacy"));

    return shell;
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
        <span class="home-v8-eng__icon" aria-hidden="true">${HAND_ICON}</span>
        <div>
          <h2 id="homeV8EngTitle">${c.engTitle}</h2>
          <p>${c.engDesc}</p>
        </div>
      </div>
      <a href="/sign-language.html">${c.engLink}</a>`;

    document.getElementById("homeV8Curriculum")?.remove();
  }

  function isSpaRoute(pathname){
    return /^\/(primary|middle|high)\/(guardian|student)\/(tools|advanced|prompts|quiz|tutor|guide)\/?$/.test(pathname);
  }

  function openSpaRoute(link){
    const url = new URL(link.href, location.origin);
    if(url.origin !== location.origin || !isSpaRoute(url.pathname)) return false;
    history.pushState({}, "", url.pathname + url.search + url.hash);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({top:0, behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
    return true;
  }

  function apply(){
    if(!isHome()) return;
    document.documentElement.classList.add("home-v8-active");
    const styleLink = ensureStyles();
    hideLegacyHomeBlocks();
    ensureAccessibilityBadge();
    renderFinder();
    ensureEntryLinks();
    ensureMainShell();
    ensureEngSection();
    document.getElementById("homeV8FooterExtra")?.remove();
    suppressLegacyInjectedBlocks();
    revealHomepage(styleLink);
  }

  window.AITOOLSKIDS_REFRESH_HOME=apply;

  function applyHashIntent(){
    if(!isHome()) return;
    if(location.hash === "#open-help" || location.hash === "#homeV8AiTitle"){location.replace("/tools/ai-help.html");return;}
    const intent = shortcutIntent();
    if(intent){
      finderState.need = intent;
      renderFinder();
      if(shortcutSelectionMade){
        const link=document.getElementById("homeV9FinderCta");
        if(link && !openSpaRoute(link)) location.assign(link.href);
      } else {
        document.getElementById("homeV8FinderTitle")?.focus({preventScroll:true});
        document.getElementById("homeV9Finder")?.scrollIntoView({block:"start"});
      }
      return;
    }
    if(location.hash !== "#homeV8MapTitle") return;
    if(DIRECT_ROLES[finderState.role]) finderState.role = "guardian";
    if(finderState.zone === "preschool") finderState.zone = "primary";
    finderState.need = "practice";
    renderFinder();
    document.getElementById("homeV9Finder")?.scrollIntoView({block:"start"});
  }

  function init(){
    apply();
    applyHashIntent();
    window.addEventListener("hashchange", applyHashIntent);

    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if(!target) return;

      const finderChip = target.closest("#homeV9Finder [data-finder-role], #homeV9Finder [data-finder-zone], #homeV9Finder [data-finder-need]");
      if(finderChip){
        if(finderChip.dataset.finderRole || finderChip.dataset.finderZone) shortcutSelectionMade = true;
        if(finderChip.dataset.finderRole) finderState.role = finderChip.dataset.finderRole;
        if(finderState.role === "student" && finderState.zone === "preschool") finderState.zone = "primary";
        if(finderChip.dataset.finderZone) finderState.zone = finderChip.dataset.finderZone;
        if(finderChip.dataset.finderNeed) finderState.need = finderChip.dataset.finderNeed;
        if(shortcutSelectionMade){try {sessionStorage.setItem("aitools4kidsShortcutSelection",JSON.stringify({role:finderState.role,zone:finderState.zone}));} catch {}}
        const kind = finderChip.dataset.finderRole ? "role" : finderChip.dataset.finderZone ? "zone" : "need";
        renderFinder();
        document.querySelector(`#homeV9Finder [data-finder-${kind}="${finderState[kind]}"]`)?.focus();
        return;
      }

      const spaLink = target.closest("#homeV8Shell a[href], #homeV9Top a[href]");
      if(spaLink && !spaLink.hasAttribute("data-epal-practice-map") && !event.defaultPrevented && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0 && isHome() && openSpaRoute(spaLink)){
        event.preventDefault();
        return;
      }

      if(target.closest("#langEl,#langEn,#backToZones")){
        setTimeout(() => {
          if(isHome()) apply();
        }, 0);
      }
    });

    window.addEventListener("pageshow", event => {if(event.persisted && isHome()) apply();});

    window.addEventListener("popstate", () => {
      setTimeout(() => {
        if(!isHome()) return;
        const zoneView=document.getElementById("zoneSelectView");
        const pathView=document.getElementById("pathView");
        if(zoneView?.hidden && pathView && !pathView.hidden){
          document.getElementById("backToZones")?.click();
        }
        apply();
      }, 0);
    });

    const shellForSearch = document.getElementById("homeV8Shell");
    if(shellForSearch && "MutationObserver" in window){
      new MutationObserver(placeSearchFirst).observe(shellForSearch, {childList:true});
    }
    placeSearchFirst();

    const grid = document.getElementById("zoneGrid");
    if(grid && "MutationObserver" in window){
      new MutationObserver(suppressLegacyInjectedBlocks).observe(grid, {childList:true});
    }

    [0, 50, 200, 550, 1200].forEach((ms) => setTimeout(() => {
      suppressLegacyInjectedBlocks();
      ensureAccessibilityBadge();
      placeSearchFirst();
    }, ms));
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init, {once:true});
  }else{
    init();
  }
})();

