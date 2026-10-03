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
      curriculumCardBadge: "Ελληνικός Χάρτης Ύλης · 2026–27",
      curriculumCardTitle: "Βρες την ενότητα που διαβάζεις",
      curriculumCardDesc: "Τάξη → μάθημα → πραγματική ενότητα του σχολικού βιβλίου → εξήγηση, εξάσκηση και AI βοήθεια.",
      aiBadgeNew: "Νέο",
      aiBadgeFree: "Δωρεάν",
      aiName: "AI Βοήθεια",
      aiTitle: "Κόλλησες; Πάρε μία υπόδειξη τη φορά.",
      aiDesc: "Ξεκινά από τη δική σου προσπάθεια και σε καθοδηγεί με ερωτήσεις και μικρές υποδείξεις, χωρίς έτοιμη τελική λύση.",
      aiTechSummary: "ⓘ Ποιο AI χρησιμοποιείται;",
      aiTechText: "GPT-OSS 120B μέσω Cloudflare Workers AI, με Groq ως εφεδρικό πάροχο. Το Puter είναι προαιρετική εναλλακτική.",
      aiTechLink: "Διαφάνεια AI →",
      aiPrimary: "Γονιός Δημοτικού",
      aiMiddle: "Γονιός Γυμνασίου",
      aiHigh: "Μαθητής Λυκείου",
      aiSpecial: "Ειδικά σχολεία",
      aiAgeRule: "Δημοτικό: μαζί με γονέα ή εκπαιδευτικό · Γυμνάσιο: μαθητική χρήση από 13 ετών · Λύκειο: αυτόνομη μαθητική χρήση.",
      engTitle: "Έννοιες στην Ελληνική Νοηματική",
      engDesc: `${signLanguageConceptCount} σχολικές έννοιες με απλή εξήγηση και επίσημο βίντεο ΕΝΓ`,
      engLink: `Δες τις ${signLanguageConceptCount} έννοιες →`,
      stepsLabel: "Ξεκίνα από αυτό που χρειάζεσαι. Εμείς διαλέγουμε τη σωστή λειτουργία ή το σωστό AI.",
      moreTitle: "Ειδικές ανάγκες και ειδικές διαδρομές",
      startTile: "Δεν ξέρεις από πού να αρχίσεις;",
      startTileDesc: "Δώσε την εργασία ή τις σημειώσεις σου και πάρε μικρά, διαχειρίσιμα βήματα. Δεν λύνει την άσκηση.",
      startTileCta: "Σπάσε το σε μικρά βήματα →",
      supportTile: "Ειδική εκπαιδευτική υποστήριξη",
      supportTileDesc: "Ειδικό Γυμνάσιο, Ειδικό Λύκειο, ΕΝ.Ε.Ε.ΓΥ.-Λ. και προσαρμογές γλώσσας, βημάτων και ρυθμού. Χωρίς διάγνωση.",
      supportTileCta: "Δες τις διαδρομές →",
      charTile: "Μίλα με χαρακτήρα της Ιστορίας",
      charTileDesc: "Διάλογος με πρόσωπα από την ύλη και έλεγχος του τι έμαθες.",
      stepRole: "1 · Ποιος είσαι;",
      stepZone: "2 · Βαθμίδα ή διαδρομή",
      stepNeed: "3 · Τι χρειάζεσαι τώρα;",
      roles: { guardian: "Γονιός", student: "Μαθητής / Μαθήτρια", teacher: "Εκπαιδευτικός", university: "Φοιτητής / Φοιτήτρια" },
      zones: { preschool: ["Νηπιαγωγείο","4–6 · με ενήλικα"], primary: ["Δημοτικό","6–12 · με ενήλικα"], middle: ["Γυμνάσιο","12–15 · AI Βοήθεια 13+"], high: ["Λύκειο","15–18 · αυτόνομα"], special: ["Ειδική Εκπαίδευση",""] },
      finderNeeds: { stuck: "Κόλλησα / δεν καταλαβαίνω κάτι", practice: "Θέλω εξάσκηση", test: "Διαβάζω για τεστ", pdf: "Έχω PDF ή σημειώσεις", project: "Έχω εργασία ή project", start: "Δεν ξέρω από πού να αρχίσω", tools: "Ποιο AI εργαλείο να χρησιμοποιήσω;" },
      ctaTools: "Δες εργαλεία για", ctaPractice: "Δες πού χρειάζεται εξάσκηση ·", ctaStuck: "Πάρε καθοδήγηση με την AI Βοήθεια ·", ctaTest: "Προετοιμάσου για το τεστ με την AI Μελέτη", ctaPdf: "Μελέτησε τις σημειώσεις σου εδώ", ctaProject: "Διάλεξε εργαλείο για την εργασία σου", ctaStart: "Σπάσε το σε μικρά βήματα", ctaPreschool: "Δραστηριότητες Νηπιαγωγείου", ctaSpecial: "Άνοιξε την Ειδική Εκπαίδευση", ctaTeacher: "Άνοιξε τα εργαλεία για εκπαιδευτικούς", mapGel: "ΓΕΛ", mapEpal: "ΕΠΑΛ", ctaSpecialPractice: "Κάνε το μικρό διαγνωστικό", ctaUniversity: "Άνοιξε τη φοιτητική διαδρομή",
      noteTeacher: "Φύλλα εργασίας, αξιολόγηση, σχέδια μαθήματος, δραστηριότητες και βίντεο πάνω στην ύλη 2026–27.",
      noteUniversity: "Πιλοτική διαδρομή για επιλεγμένα πανεπιστημιακά τμήματα, με επίσημες πηγές.",
      teacherWayEyebrow: "Για εκπαιδευτικούς",
      teacherWayTitle: "Υλικό για την τάξη σου, πάνω στην ύλη 2026–27.",
      teacherWayDesc: "Φύλλα εργασίας, αξιολόγηση, πλήρες 45λεπτο, εκπαιδευτικό βίντεο με αφήγηση και δραστηριότητα με QR για τους μαθητές. Εσύ ελέγχεις και προσαρμόζεις.",
      teacherWayCta: "Άνοιξε τα εργαλεία εκπαιδευτικού\u00a0→",
      notePreschool: "Στο Νηπιαγωγείο ο ενήλικας χειρίζεται το εργαλείο. Θα δεις δραστηριότητες για γονείς και εκπαιδευτικούς.",
      notePrimaryStudent: "Στο Δημοτικό τα εργαλεία χρησιμοποιούνται μαζί με ενήλικα. Θα δεις και οδηγίες για τον γονιό.",
      noteMiddleStudent: "Πολλά εργαλεία ζητούν 13+ ή 15+. Κάθε κάρτα δείχνει το όριο ηλικίας.",
      noteMiddleStuck: "Η AI Βοήθεια για μαθητές Γυμνασίου ανοίγει από 13 ετών. Διάλεξε πρώτα την ηλικία σου στην επόμενη σελίδα.",
      noteHigh: "Για ΕΠΑΛ θα διαλέξεις στη συνέχεια τάξη και, όπου χρειάζεται, τομέα ή ειδικότητα.",
      noteSpecial: "Διαδρομή για Ειδικό Γυμνάσιο, Ειδικό Λύκειο και ΕΝ.Ε.Ε.ΓΥ.-Λ.",
      notePdf: "Ανέβασε PDF ή φωτογραφία, ή επικόλλησε κείμενο. Εξήγηση, quiz, κάρτες και πλάνο βασίζονται μόνο σε αυτό το υλικό.",
      noteTest: "Επανάληψη, εντοπισμός κενών και γρήγορο quiz πάνω στην ενότητα που διαβάζεις.",
      noteProject: "Παρουσίαση, έρευνα με πηγές, αφίσα ή δημιουργικό project: διάλεξε τη δουλειά και δες ποιο εργαλείο ταιριάζει.",
      noteStart: "Οργανώνει τη μελέτη σε μικρά βήματα και προτεραιότητες. Δεν λύνει την εργασία.",
      waysTitle: "Γρήγορη πρόσβαση",
      studyGoalsLabel: "Τι θέλεις;",
      studyGoals: [["understand","🧠","Να το καταλάβω"],["revise","🔁","Επανάληψη"],["test","📝","Γράφω τεστ"],["practice","🎯","Εξάσκηση"]],
      teacherTasksLabel: "Φτιάξε:",
      teacherTasks: [["worksheet","📝","Φύλλο εργασίας"],["assessment","✅","Αξιολόγηση"],["lesson","🗂️","Σχέδιο μαθήματος"],["video","🎬","Βίντεο"]],
      aiLinksLabel: "Άνοιξε για:",
      studyBadge: "Νέο · Δωρεάν",
      studyName: "AI Μελέτη",
      studyTitle: "Μελέτησε μια ενότητα ή τις δικές σου σημειώσεις.",
      studyDesc: "Πες τι διαβάζεις και πόσο χρόνο έχεις. Πάρε εξήγηση, κάρτες, quiz και πλάνο, με τελικό έλεγχο χωρίς AI.",
      studyPdfTitle: "Έχεις PDF ή σημειώσεις;",
      studyPdfText: "Οι απαντήσεις βασίζονται μόνο στο υλικό σου. Αν κάτι λείπει, το λέει.",
      studyPdfCta: "Ανέβασέ τες →",
      studyOfficial: "Βασισμένη στο επίσημο σχολικό βιβλίο · Ύλη 2026–27",
      studyCoverage: "Διαθέσιμο σε επιλεγμένα μαθήματα · η κάλυψη μεγαλώνει",
      studyCta: "Φτιάξε το πλάνο μελέτης σου →",
      charCta: "Ξεκίνα μια συζήτηση →",
      chars: [["socrates","Σωκράτης","Αρχαία Αθήνα"],["pericles","Περικλής","Χρυσός αιώνας"],["greek-revolution-1821","Αγωνιστής του 1821","Επανάσταση"]]
    },
    en: {
      curriculumCardBadge: "Greek Curriculum Map · 2026–27",
      curriculumCardTitle: "Find the unit you are studying",
      curriculumCardDesc: "Grade → subject → real textbook unit → explanation, practice and AI help.",
      aiBadgeNew: "New",
      aiBadgeFree: "Free",
      aiName: "AI Help",
      aiTitle: "Stuck? Get one hint at a time.",
      aiDesc: "It starts from your own attempt and guides you with questions and small hints, without a ready-made final answer.",
      aiTechSummary: "ⓘ Which AI is used?",
      aiTechText: "GPT-OSS 120B via Cloudflare Workers AI, with Groq as the fallback provider. Puter is an optional alternative.",
      aiTechLink: "AI transparency →",
      aiPrimary: "Primary parent",
      aiMiddle: "Middle School parent",
      aiHigh: "High School student",
      aiSpecial: "Special schools",
      aiAgeRule: "Primary: with a parent or educator · Middle School: student use from age 13 · High School: independent student use.",
      engTitle: "Greek Sign Language concepts",
      engDesc: `${signLanguageConceptCount} school concepts with a simple explanation and official GSL video`,
      engLink: `See the ${signLanguageConceptCount} concepts →`,
      stepsLabel: "Start from what you need. We pick the right feature or the right AI.",
      moreTitle: "Special needs and special pathways",
      startTile: "Not sure where to start?",
      startTileDesc: "Give it your assignment or notes and get small, manageable steps. It does not solve the exercise.",
      startTileCta: "Break it into small steps →",
      supportTile: "Special educational support",
      supportTileDesc: "Special Gymnasium, Special Lyceum, EN.E.E.GY.-L. and adapted language, steps and pace. No diagnosis.",
      supportTileCta: "See the pathways →",
      charTile: "Talk with a character from history",
      charTileDesc: "A dialogue with people from the curriculum, then a check of what you learned.",
      stepRole: "1 · Who are you?",
      stepZone: "2 · Level or pathway",
      stepNeed: "3 · What do you need right now?",
      roles: { guardian: "Parent", student: "Student", teacher: "Educator", university: "University student" },
      zones: { preschool: ["Preschool","4–6 · with an adult"], primary: ["Primary","6–12 · with an adult"], middle: ["Middle School","12–15 · AI Help 13+"], high: ["High School","15–18 · independent"], special: ["Special Education",""] },
      finderNeeds: { stuck: "I'm stuck / I don't understand something", practice: "I want to practise", test: "I have a test coming up", pdf: "I have a PDF or notes", project: "I have an assignment or project", start: "I don't know where to start", tools: "Which AI tool should I use?" },
      ctaTools: "See tools for", ctaPractice: "See where practice is needed ·", ctaStuck: "Get guidance with AI Help ·", ctaTest: "Prepare for the test with AI Study", ctaPdf: "Study your notes here", ctaProject: "Pick a tool for your assignment", ctaStart: "Break it into small steps", ctaPreschool: "Preschool activities", ctaSpecial: "Open Special Education", ctaTeacher: "Open the educator tools", mapGel: "General Lyceum", mapEpal: "Vocational Lyceum (EPAL)", ctaSpecialPractice: "Take the short check", ctaUniversity: "Open the university pathway",
      noteTeacher: "Worksheets, assessment, lesson plans, activities and videos built on the 2026–27 curriculum.",
      noteUniversity: "Pilot pathway for selected university departments, with official sources.",
      teacherWayEyebrow: "For educators",
      teacherWayTitle: "Material for your class, built on the 2026–27 curriculum.",
      teacherWayDesc: "Worksheets, assessment, a full 45-minute lesson, narrated educational video and a QR activity for students. You review and adapt.",
      teacherWayCta: "Open the educator tools\u00a0→",
      notePreschool: "In preschool the adult operates the tool. You will see activities for parents and educators.",
      notePrimaryStudent: "In primary school, tools are used together with an adult. You will also see guidance for parents.",
      noteMiddleStudent: "Many tools require 13+ or 15+. Every card shows the age limit.",
      noteMiddleStuck: "AI Help for middle-school students opens from age 13. Choose your age first on the next page.",
      noteHigh: "For EPAL you will then choose a grade and, where needed, a sector or specialty.",
      noteSpecial: "Pathway for Special Gymnasium, Special Lyceum and EN.E.E.GY.-L.",
      notePdf: "Upload a PDF or photo, or paste text. Explanations, quizzes, cards and plans are based only on that material.",
      noteTest: "Review, gap finding and a quick quiz on the unit you are studying.",
      noteProject: "Presentation, research with sources, poster or creative project: choose the job and see which tool fits.",
      noteStart: "It organises your study into small steps and priorities. It does not solve the assignment.",
      waysTitle: "Quick access",
      studyGoalsLabel: "What do you need?",
      studyGoals: [["understand","🧠","Understand it"],["revise","🔁","Review"],["test","📝","Test coming up"],["practice","🎯","Practise"]],
      teacherTasksLabel: "Create:",
      teacherTasks: [["worksheet","📝","Worksheet"],["assessment","✅","Assessment"],["lesson","🗂️","Lesson plan"],["video","🎬","Video"]],
      aiLinksLabel: "Open for:",
      studyBadge: "New · Free",
      studyName: "AI Study",
      studyTitle: "Study a curriculum unit or your own notes.",
      studyDesc: "Tell it what you're studying and how much time you have. Get an explanation, cards, a quiz and a plan, with a final check without AI.",
      studyPdfTitle: "Have a PDF or notes?",
      studyPdfText: "Answers are based only on your material. If something is missing, it says so.",
      studyPdfCta: "Upload them →",
      studyOfficial: "Based on the official school textbook · Curriculum 2026–27",
      studyCoverage: "Available for selected subjects · coverage is growing",
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
  const finderState = { role: "student", zone: "middle", need: "stuck" };

  // Needs that open the same destination whatever the school level (AI Study, task guides).
  const NEED_PAGES = { test: "/study.html?mode=test", pdf: "/study.html?mode=understand#notesFile", project: "/ti-thelo-na-kano-me-ai.html", start: "/organosi-meletis-ai.html" };

  // Educators and university students skip the school-level steps: one choice, one destination.
  const DIRECT_ROLES = { teacher: "/teacher-assistant.html", university: "/higher-education-pilot.html" };

  function finderHref(){
    const { role, zone, need } = finderState;
    if(DIRECT_ROLES[role]) return DIRECT_ROLES[role];
    if(zone === "preschool") return "/preschool";
    if(zone === "special") return "/special-education.html";
    if(NEED_PAGES[need]) return NEED_PAGES[need];
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
    const pageCta = { test: c.ctaTest, pdf: c.ctaPdf, project: c.ctaProject, start: c.ctaStart }[need];
    if(pageCta) return pageCta;
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
    const pageNote = { test: c.noteTest, pdf: c.notePdf, project: c.noteProject, start: c.noteStart }[finderState.need];
    if(pageNote) return pageNote;
    if(zone === "primary" && role === "student") return c.notePrimaryStudent;
    if(zone === "middle" && role === "student") return finderState.need === "stuck" ? c.noteMiddleStuck : c.noteMiddleStudent;
    if(zone === "high") return c.noteHigh;
    return "";
  }

  // The Special Education and EPAL practice checks open inline (special-education-diagnostic.js, epal-practice-map.js).
  function practiceTrigger(){
    const { role, zone, need } = finderState;
    return !DIRECT_ROLES[role] && zone === "special" && need === "practice" ? " data-special-education-diagnostic" : "";
  }

  function practiceExtra(c){
    const { role, zone, need } = finderState;
    if(DIRECT_ROLES[role] || zone !== "high" || need !== "practice") return "";
    return `<a class="home-v9-finder__extra" href="#" data-epal-practice-map>${escapeHtml(`${c.ctaPractice} ${c.mapEpal}`)} <span aria-hidden="true">→</span></a>`;
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
    const schoolSteps = DIRECT_ROLES[finderState.role] ? "" : step(c.stepZone, zones) + step(c.stepNeed, needs);
    mount.innerHTML = `
      <p class="home-v9-finder__label" id="homeV8FinderTitle">${c.stepsLabel}</p>
      ${step(c.stepRole, roles)}
      ${schoolSteps}
      <p class="home-v9-finder__note" aria-live="polite"${note ? "" : " hidden"}>${note ? ICON.shield + `<span>${escapeHtml(note)}</span>` : ""}</p>
      <a class="home-v9-finder__cta" id="homeV9FinderCta" href="${finderHref()}"${practiceTrigger()}>${escapeHtml(finderCta(c))} <span aria-hidden="true">→</span></a>
      ${practiceExtra(c)}`;
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
              <span>${c.aiBadgeNew}</span>
              <span>${c.aiBadgeFree}</span>
            </div>
            <p class="home-v9-way__eyebrow">${c.aiName}</p>
            <h3 id="homeV8AiTitle">${c.aiTitle}</h3>
            <p class="home-v8-helper-desc">${c.aiDesc}</p>
            <details class="home-v8-ai__tech" id="homeV8AiTechDetails">
              <summary title="GPT-OSS 120B · Cloudflare Workers AI → Groq · Puter optional">${c.aiTechSummary}</summary>
              <p>${c.aiTechText} <a href="/ai-transparency.html">${c.aiTechLink}</a></p>
            </details>
            <p class="home-v9-way__links-label">${c.aiLinksLabel}</p>
            <div class="home-v8-helper-links home-v8-ai__links">
              <a href="/primary/guardian/tutor">${c.aiPrimary}</a>
              <a href="/middle/guardian/tutor">${c.aiMiddle}</a>
              <a href="/high/student/tutor">${c.aiHigh}</a>
              <a href="/special-education.html">${c.aiSpecial}</a>
            </div>
            <p class="home-v9-way__rule">${ICON.shield}<span>${c.aiAgeRule}</span></p>
          </section>

          <section class="home-v9-study-way" id="homeV9Study" aria-labelledby="homeV9StudyTitle">
            <span class="home-v9-way__icon" aria-hidden="true">${ICON.book}</span>
            <div class="home-v8-ai__badges"><span>${c.studyBadge}</span></div>
            <p class="home-v9-way__eyebrow">${c.studyName}</p>
            <h3 id="homeV9StudyTitle">${c.studyTitle}</h3>
            <p class="home-v8-helper-desc">${c.studyDesc}</p>
            <a class="home-v9-study-way__pdf" href="/study.html?mode=understand#notesFile"><strong>${c.studyPdfTitle}</strong><span>${c.studyPdfText}</span><em>${c.studyPdfCta}</em></a>
            <p class="home-v9-study-way__official"><strong>${c.studyOfficial}</strong><small>${c.studyCoverage}</small></p>
            <p class="home-v9-way__links-label">${c.studyGoalsLabel}</p>
            <div class="home-v8-helper-links">${wayChips(c.studyGoals, (id) => `/study.html?mode=${id}`)}</div>
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

  function simpleTile(id, title, desc, href, cta){
    return ensureSection(id, "home-v9-tile", `${id}Title`, `
      <h3 id="${id}Title">${escapeHtml(title)}</h3>
      <p>${escapeHtml(desc)}</p>
      <a class="home-v9-tile__cta" href="${href}">${escapeHtml(cta)}</a>`);
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
    const c = currentCopy();
    const start = simpleTile("homeV9Start", c.startTile, c.startTileDesc, "/organosi-meletis-ai.html", c.startTileCta);
    const support = simpleTile("homeV9Support", c.supportTile, c.supportTileDesc, "/special-education.html", c.supportTileCta);
    const tiles = [start, support, document.getElementById("homeV8Eng"), characters].filter(Boolean);
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
    window.scrollTo({top:0, behavior:"smooth"});
    return true;
  }

  function apply(){
    if(!isHome()) return;
    document.documentElement.classList.add("home-v8-active");
    const styleLink = ensureStyles();
    hideLegacyHomeBlocks();
    ensureAccessibilityBadge();
    renderFinder();
    ensureMainShell();
    ensureEngSection();
    document.getElementById("homeV8FooterExtra")?.remove();
    suppressLegacyInjectedBlocks();
    revealHomepage(styleLink);
  }

  window.AITOOLSKIDS_REFRESH_HOME=apply;

  function applyHashIntent(){
    if(!isHome() || location.hash !== "#homeV8MapTitle") return;
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
        if(finderChip.dataset.finderRole) finderState.role = finderChip.dataset.finderRole;
        if(finderState.role === "student" && finderState.zone === "preschool") finderState.zone = "primary";
        if(finderChip.dataset.finderZone) finderState.zone = finderChip.dataset.finderZone;
        if(finderChip.dataset.finderNeed) finderState.need = finderChip.dataset.finderNeed;
        const kind = finderChip.dataset.finderRole ? "role" : finderChip.dataset.finderZone ? "zone" : "need";
        renderFinder();
        document.querySelector(`#homeV9Finder [data-finder-${kind}="${finderState[kind]}"]`)?.focus();
        return;
      }

      const spaLink = target.closest("#homeV8Shell a[href], #homeV9Top a[href]");
      if(spaLink && isHome() && openSpaRoute(spaLink)){
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

