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
      finderTitle: "Διάλεξε βαθμίδα ή διαδρομή",
      specialTitle: "Ειδικά σχολεία",
      specialAge: "Ειδική Εκπαίδευση",
      specialDesc: "Ειδικό Γυμνάσιο, Ειδικό Λύκειο, ΕΝ.Ε.Ε.ΓΥ.-Λ.",
      higherEdBadge: "Νέο · Δοκιμαστικό",
      higherEdTitle: "Φοιτητές ΑΕΙ",
      higherEdDesc: "Πιλοτική κάλυψη επιλεγμένων πανεπιστημιακών τμημάτων με επίσημες πηγές και επαληθευμένα μαθήματα/θεματικές όπου είναι διαθέσιμα.",
      higherEdAction: "Δοκίμασε τη φοιτητική διαδρομή →",
      curriculumCardBadge: "Ύλη 2026–27",
      curriculumCardTitle: "Ελληνικός Χάρτης Ύλης",
      curriculumCardDesc: "Τάξη → μάθημα → πραγματική ενότητα → AI βοήθεια, εξάσκηση και οπτική εξήγηση.",
      studyCardBadge: "Νέο · Δωρεάν",
      studyCardTitle: "AI Μελέτη",
      studyCardDesc: "Ύλη ή δικές σου σημειώσεις → εξήγηση, κάρτες, quiz, προφορική/γραπτή πρόβα, εντοπισμός κενών και πλάνο.",
      mapTitle: "Χάρτης Εξάσκησης",
      mapLead: "Δες πού χρειάζεσαι λίγη παραπάνω εξάσκηση.",
      mapDesc: "Σύντομο τεστ περίπου 2 λεπτών, χωρίς βαθμό.",
      mapPrimary: "Δημοτικό",
      mapMiddle: "Γυμνάσιο",
      mapGel: "ΓΕΛ",
      mapEpal: "ΕΠΑΛ",
      mapSpecial: "Ειδικά σχολεία",
      aiBadgeNew: "Νέο",
      aiBadgeFree: "Δωρεάν",
      aiTitle: "Η δική μας AI Βοήθεια, φτιαγμένη για τα σχολικά μαθήματα.",
      aiDesc: "Διαφορετική από τα εργαλεία του καταλόγου. Σε καθοδηγεί με ερωτήσεις και μικρές υποδείξεις, αντί να σου δίνει έτοιμη λύση.",
      aiTechSummary: "ⓘ Ποιο AI χρησιμοποιείται;",
      aiTechText: "GPT-OSS 120B μέσω Cloudflare Workers AI, με Groq ως εφεδρικό πάροχο. Το Puter είναι προαιρετική εναλλακτική.",
      aiTechLink: "Διαφάνεια AI →",
      aiPrimary: "Γονιός Δημοτικού",
      aiMiddle: "Γυμνάσιο 13+",
      aiHigh: "Λύκειο",
      aiSpecial: "Ειδικά σχολεία",
      needsTitle: "Τι θέλεις να κάνεις με AI;",
      needsHint: "PDF · Έρευνα · Flashcards · Παρουσίαση · Ανάγνωση · Δημιουργία · Οργάνωση · Επανάληψη",
      needsTasksTitle: "Εργασίες & μελέτη",
      needsLearningTitle: "AI για πραγματική μάθηση",
      needsLearningIntro: "Διάλεξε τρόπο βοήθειας ανάλογα με αυτό που πραγματικά χρειάζεσαι.",
      needs: [
        ["📄","Να μελετήσω PDF ή σημειώσεις","Εργαλεία και τρόποι χρήσης για μελέτη πάνω στο δικό σου υλικό","/meleti-pdf-me-ai.html"],
        ["🔎","Να κάνω έρευνα με πηγές","Επιλογές για έρευνα, πηγές και έλεγχο πληροφοριών","/erevna-me-piges-ai.html"],
        ["🧠","Να φτιάξω flashcards και επανάληψη","Κάρτες, μικρά τεστ και τρόποι αυτοελέγχου","/flashcards-epanalipsi-ai.html"],
        ["🎨","Να φτιάξω παρουσίαση ή αφίσα","Εργαλεία για οργάνωση, σχεδιασμό και παρουσίαση ιδεών","/parousiasi-afisa-ai.html"],
        ["📚","Να εξασκηθώ στην ανάγνωση ή στα Αγγλικά","Εργαλεία για ανάγνωση, προφορά και γλώσσες","/anagnosi-agglika-ai.html"],
        ["✨","Να δημιουργήσω κάτι με AI","Ιδέες και εργαλεία για δημιουργική χρήση χωρίς έτοιμη εργασία","/dimiourgiko-ai-gia-mathites.html"],
        ["🧩","Να σπάσω το διάβασμα σε βήματα","Μετέτρεψε μια μεγάλη εργασία ή μπερδεμένες σημειώσεις σε μικρά επόμενα βήματα","/organosi-meletis-ai.html"]
      ],
      learningModes: [
        ["🧠","AI Επανάληψη","Ξαναφέρνει όσα σε δυσκόλεψαν και σε ελέγχει με νέα ερώτηση.","/high/student/tutor?mode=review"],
        ["🎭","Μίλα με έναν χαρακτήρα AI","Βιωματική, τεκμηριωμένη συζήτηση και μετά έλεγχος του τι έμαθες.","/primary/guardian/tutor?mode=character&grade=e&subject=istoria-e-dimotikou&topicText=%CE%92%CF%85%CE%B6%CE%B1%CE%BD%CF%84%CE%B9%CE%BD%CE%AE%20%CF%80%CE%B5%CF%81%CE%AF%CE%BF%CE%B4%CE%BF%CF%82%3A%20%CF%83%CF%85%CE%BD%CE%AD%CF%87%CE%B5%CE%B9%CE%B1%20%CE%BA%CE%B1%CE%B9%20%CE%B1%CE%BB%CE%BB%CE%B1%CE%B3%CE%AE"],
        ["🎯","AI Πρόκληση κατανόησης","Μικρές υποδείξεις, δική σου απάντηση και τελικός έλεγχος κατανόησης.","/high/student/tutor?mode=challenge"]
      ],
      engTitle: "Έννοιες στην Ελληνική Νοηματική",
      engDesc: `${signLanguageConceptCount} σχολικές έννοιες με απλή εξήγηση και επίσημο βίντεο ΕΝΓ`,
      engLink: `Δες τις ${signLanguageConceptCount} έννοιες →`,
      curriculumPrefix: "Δες και:",
      curriculumLabel: "Ελληνικός Χάρτης Ύλης 2026-27",
      methodology: "Πώς επιλέγουμε & ελέγχουμε τα εργαλεία",
      report: "Βρήκες λάθος ή παλιωμένη πληροφορία; ↗",
      zonesLead: "Σε κάθε βαθμίδα: εργαλεία με όριο ηλικίας, Χάρτης Εξάσκησης, μονοπάτια μάθησης και οδηγός χρήσης.",
      otherRoutes: "Άλλες διαδρομές",
      stepsLabel: "Ξεκίνα σε 3 βήματα",
      stepRole: "1 · Ποιος είσαι;",
      stepZone: "2 · Βαθμίδα ή διαδρομή",
      stepNeed: "3 · Τι χρειάζεσαι σήμερα;",
      roles: { guardian: "Γονιός", student: "Μαθητής / Μαθήτρια", teacher: "Εκπαιδευτικός" },
      zones: { preschool: ["Νηπιαγωγείο","4–6"], primary: ["Δημοτικό","6–12"], middle: ["Γυμνάσιο","12–15"], high: ["Λύκειο","15–18"], special: ["Ειδική Εκπαίδευση",""] },
      finderNeeds: { tools: "Να βρω το κατάλληλο AI", practice: "Εξάσκηση σε μάθημα", stuck: "Κόλλησα σε άσκηση", study: "Μελέτη πάνω στην ύλη" },
      ctaTools: "Δες εργαλεία για", ctaPractice: "Χάρτης Εξάσκησης για", ctaStuck: "AI Βοήθεια για", ctaStudy: "Άνοιξε την AI Μελέτη", ctaPreschool: "Δραστηριότητες Νηπιαγωγείου", ctaSpecial: "Άνοιξε την Ειδική Εκπαίδευση",
      notePreschool: "Στο Νηπιαγωγείο ο ενήλικας χειρίζεται το εργαλείο. Θα δεις δραστηριότητες για γονείς και εκπαιδευτικούς.",
      notePrimaryStudent: "Στο Δημοτικό τα εργαλεία χρησιμοποιούνται μαζί με ενήλικα. Θα δεις και οδηγίες για τον γονιό.",
      noteMiddleStudent: "Πολλά εργαλεία ζητούν 13+ ή 15+. Κάθε κάρτα δείχνει το όριο ηλικίας.",
      noteMiddleStuck: "Η AI Βοήθεια για μαθητές Γυμνασίου ανοίγει από 13 ετών. Διάλεξε πρώτα την ηλικία σου στην επόμενη σελίδα.",
      noteHigh: "Για ΕΠΑΛ θα διαλέξεις στη συνέχεια τάξη και, όπου χρειάζεται, τομέα ή ειδικότητα.",
      noteSpecial: "Διαδρομή για Ειδικό Γυμνάσιο, Ειδικό Λύκειο και ΕΝ.Ε.Ε.ΓΥ.-Λ.",
      principleLabel: "Η διαδρομή μάθησης",
      principleQuote: "«Δείξε μου πώς να το μάθω, όχι τη λύση.»",
      principleSteps: [["Δυσκολία","«Δεν το καταλαβαίνω»"],["Εντοπισμός","Χάρτης Εξάσκησης"],["Εξάσκηση","σωστό εργαλείο"],["Καθοδήγηση","μία υπόδειξη τη φορά"],["Ξαναδοκιμή","χωρίς AI"]],
      waysTitle: "Τρεις τρόποι να ξεκινήσεις",
      waysLead: "Διάλεξε έναν. Όλοι λειτουργούν χωρίς λογαριασμό.",
      mapCta: "Διάλεξε βαθμίδα:",
      curriculumAction: "Άνοιξε τον Χάρτη Ύλης →",
      aiLinksLabel: "Άνοιξε για:",
      studyBadge: "Νέο · Δωρεάν",
      studyTitle: "AI Μελέτη",
      studyDesc: "Πες τι διαβάζεις και πόσο χρόνο έχεις. Πάρε mini πλάνο με κατανόηση, ανάκληση, εξάσκηση και τελικό έλεγχο χωρίς AI.",
      studyOfficial: "Βασισμένη στο επίσημο σχολικό βιβλίο · Ύλη 2026–27",
      studyCoverage: "Διαθέσιμο σε επιλεγμένα μαθήματα · η κάλυψη μεγαλώνει",
      studyGoals: ["Να το καταλάβω","Επανάληψη","Γράφω τεστ","Εξάσκηση"],
      studySteps: [["Ύλη ή σημειώσεις","Ενότητα του επίσημου βιβλίου ή δικό σου PDF"],["Κατανόηση","Απλή εξήγηση, που μπορείς και να ακούσεις"],["Εξάσκηση","Κάρτες ενεργής ανάκλησης"],["Έλεγχος","Τελική ερώτηση χωρίς AI"]],
      studyCta: "Φτιάξε το πλάνο μελέτης σου →",
      charBadge: "Βιωματική μάθηση",
      charTitle: "Μίλα με έναν χαρακτήρα της Ιστορίας",
      charDesc: "Τεκμηριωμένος διάλογος με πρόσωπα από την ύλη και μετά έλεγχος του τι πραγματικά έμαθες.",
      charCta: "Ξεκίνα μια συζήτηση →",
      chatLabel: "Έτσι απαντά η AI Βοήθεια",
      chatQ: "Δεν καταλαβαίνω πώς λύνεται η 3x + 5 = 20.",
      chatA: "Πάμε μαζί. Τι θα κάνεις πρώτα για να μείνει μόνο το 3x στη μία πλευρά;",
      chars: [["socrates","Σωκράτης","Αρχαία Αθήνα"],["pericles","Περικλής","Χρυσός αιώνας"],["greek-revolution-1821","Αγωνιστής του 1821","Επανάσταση"]]
    },
    en: {
      finderTitle: "Choose a school level or pathway",
      specialTitle: "Special schools",
      specialAge: "Special Education",
      specialDesc: "Special Gymnasium, Special Lyceum, EN.E.E.GY.-L.",
      higherEdBadge: "New · Experimental",
      higherEdTitle: "University students",
      higherEdDesc: "5 pilot departments: AUEB Informatics, NKUA Psychology, UNIWA Informatics & Computer Engineering, HMU Electrical & Computer Engineering, and Biology at the University of Patras.",
      higherEdAction: "Try the university pilot →",
      curriculumCardBadge: "Curriculum 2026–27",
      curriculumCardTitle: "Greek Curriculum Map",
      curriculumCardDesc: "Grade → subject → real curriculum unit → AI help, practice and visual explanation.",
      studyCardBadge: "New · Free",
      studyCardTitle: "AI Study",
      studyCardDesc: "Curriculum or your own notes → explanation, recall cards, quizzes, oral/written practice, gap finding and a study plan.",
      mapTitle: "Practice Map",
      mapLead: "See where a little more practice could help.",
      mapDesc: "A short check of about 2 minutes, with no grade.",
      mapPrimary: "Primary",
      mapMiddle: "Middle School",
      mapGel: "General Lyceum (GEL)",
      mapEpal: "Vocational Lyceum (EPAL)",
      mapSpecial: "Special schools",
      aiBadgeNew: "New",
      aiBadgeFree: "Free",
      aiTitle: "Our AI Help, built for school subjects.",
      aiDesc: "Different from the tools in the catalogue. It guides you with questions and small hints instead of giving you a ready-made answer.",
      aiTechSummary: "ⓘ Which AI is used?",
      aiTechText: "GPT-OSS 120B via Cloudflare Workers AI, with Groq as the fallback provider. Puter is an optional alternative.",
      aiTechLink: "AI transparency →",
      aiPrimary: "Primary parent",
      aiMiddle: "Middle School 13+",
      aiHigh: "High School",
      aiSpecial: "Special schools",
      needsTitle: "What do you want to do with AI?",
      needsHint: "PDF · Research · Flashcards · Presentation · Reading · Create · Organise · Review",
      needsTasksTitle: "Tasks & study",
      needsLearningTitle: "AI for real learning",
      needsLearningIntro: "Choose the kind of help that matches what you actually need.",
      needs: [
        ["📄","Study a PDF or notes","Tools and methods for studying your own material","/en/study-pdf-with-ai.html"],
        ["🔎","Research with sources","Options for research, sources and checking information","/en/research-with-sources-ai.html"],
        ["🧠","Make flashcards and revise","Cards, short quizzes and self-checking","/en/flashcards-revision-ai.html"],
        ["🎨","Make a presentation or poster","Tools for organising, designing and presenting ideas","/en/presentation-poster-ai.html"],
        ["📚","Practice reading or English","Tools for reading, pronunciation and languages","/en/reading-english-ai.html"],
        ["✨","Create something with AI","Creative tools and ideas without ready-made schoolwork","/en/creative-ai-for-students.html"],
        ["🧩","Break study into steps","Turn a large task or messy notes into small next steps","/en/study-steps-ai.html"]
      ],
      learningModes: [
        ["🧠","AI Review","Bring back difficult points and check them with a new question.","/high/student/tutor?mode=review"],
        ["🎭","Talk with an AI character","Learn through a grounded role-based dialogue, then check what you understood.","/primary/guardian/tutor?mode=character&grade=e&subject=istoria-e-dimotikou&topicText=%CE%92%CF%85%CE%B6%CE%B1%CE%BD%CF%84%CE%B9%CE%BD%CE%AE%20%CF%80%CE%B5%CF%81%CE%AF%CE%BF%CE%B4%CE%BF%CF%82%3A%20%CF%83%CF%85%CE%BD%CE%AD%CF%87%CE%B5%CE%B9%CE%B1%20%CE%BA%CE%B1%CE%B9%20%CE%B1%CE%BB%CE%BB%CE%B1%CE%B3%CE%AE"],
        ["🎯","AI Understanding Challenge","Get small hints, answer yourself, then prove you understood.","/high/student/tutor?mode=challenge"]
      ],
      engTitle: "Greek Sign Language concepts",
      engDesc: `${signLanguageConceptCount} school concepts with a simple explanation and official GSL video`,
      engLink: `See the ${signLanguageConceptCount} concepts →`,
      curriculumPrefix: "See also:",
      curriculumLabel: "Greek Curriculum Map 2026-27",
      methodology: "How we choose and review tools",
      report: "Found an error or outdated information? ↗",
      zonesLead: "In every level: age-checked tools, Practice Map, learning paths and a usage guide.",
      otherRoutes: "Other pathways",
      stepsLabel: "Start in 3 steps",
      stepRole: "1 · Who are you?",
      stepZone: "2 · Level or pathway",
      stepNeed: "3 · What do you need today?",
      roles: { guardian: "Parent", student: "Student", teacher: "Educator" },
      zones: { preschool: ["Preschool","4–6"], primary: ["Primary","6–12"], middle: ["Middle School","12–15"], high: ["High School","15–18"], special: ["Special Education",""] },
      finderNeeds: { tools: "Find the right AI", practice: "Practise a subject", stuck: "I'm stuck on an exercise", study: "Study the curriculum" },
      ctaTools: "See tools for", ctaPractice: "Practice Map for", ctaStuck: "AI Help for", ctaStudy: "Open AI Study", ctaPreschool: "Preschool activities", ctaSpecial: "Open Special Education",
      notePreschool: "In preschool the adult operates the tool. You will see activities for parents and educators.",
      notePrimaryStudent: "In primary school, tools are used together with an adult. You will also see guidance for parents.",
      noteMiddleStudent: "Many tools require 13+ or 15+. Every card shows the age limit.",
      noteMiddleStuck: "AI Help for middle-school students opens from age 13. Choose your age first on the next page.",
      noteHigh: "For EPAL you will then choose a grade and, where needed, a sector or specialty.",
      noteSpecial: "Pathway for Special Gymnasium, Special Lyceum and EN.E.E.GY.-L.",
      principleLabel: "The learning path",
      principleQuote: "“Show me how to learn it, not the answer.”",
      principleSteps: [["Difficulty","“I don't get it”"],["Spot it","Practice Map"],["Practise","the right tool"],["Guidance","one hint at a time"],["Try again","without AI"]],
      waysTitle: "Three ways to start",
      waysLead: "Pick one. None of them needs an account.",
      mapCta: "Choose a level:",
      curriculumAction: "Open the Curriculum Map →",
      aiLinksLabel: "Open for:",
      studyBadge: "New · Free",
      studyTitle: "AI Study",
      studyDesc: "Tell it what you're studying and how much time you have. Get a mini plan with understanding, recall, practice and a final check without AI.",
      studyOfficial: "Based on the official school textbook · Curriculum 2026–27",
      studyCoverage: "Available for selected subjects · coverage is growing",
      studyGoals: ["Understand it","Revise","Test coming up","Practise"],
      studySteps: [["Curriculum or notes","A unit of the official book or your own PDF"],["Understand","A simple explanation you can also listen to"],["Practise","Active-recall cards"],["Check","A final question without AI"]],
      studyCta: "Build your study plan →",
      charBadge: "Experiential learning",
      charTitle: "Talk with a character from history",
      charDesc: "A grounded dialogue with people from the curriculum, then a check of what you actually learned.",
      charCta: "Start a conversation →",
      chatLabel: "How AI Help answers",
      chatQ: "I don't understand how to solve 3x + 5 = 20.",
      chatA: "Let's do it together. What will you do first so that only 3x stays on one side?",
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

  function ensureHigherEducationPilot(){
    const grid = document.getElementById("zoneGrid");
    if(!grid) return null;
    let card = document.getElementById("homeHigherEducationPilot");
    if(!card){
      card = document.createElement("a");
      card.id = "homeHigherEducationPilot";
      card.className = "zone-card home-v8-higher-ed-card";
      card.href = "/higher-education-pilot.html";
      card.innerHTML = '<span class="zone-card__icon" aria-hidden="true">🎓</span><p class="zone-card__label"></p><p class="zone-card__age"></p><p class="zone-card__desc"></p>';
    }
    if(card.parentElement !== grid) grid.appendChild(card);
    const c = currentCopy();
    card.querySelector(".zone-card__label").textContent = c.higherEdTitle;
    card.querySelector(".zone-card__age").textContent = c.higherEdBadge;
    card.querySelector(".zone-card__desc").textContent = c.higherEdDesc;
    card.setAttribute("aria-label", `${c.higherEdTitle}: ${c.higherEdBadge}`);
    return card;
  }

  const ICON = {
    check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>',
    compass: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"></circle><path d="M15.5 8.5l-2 5-5 2 2-5z"></path></svg>',
    map: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"></path><path d="M9 4v14M15 6v14"></path></svg>',
    chat: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 5h16v11H9l-5 4z"></path><path d="M9 10h6"></path></svg>',
    book: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3z"></path><path d="M21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z"></path></svg>',
    shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"></path><path d="M12 8v5M12 16.5v.01"></path></svg>'
  };

  const svg = (d) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
  const NEED_ICONS = [
    svg('<path d="M7 3h7l5 5v13H7z"></path><path d="M14 3v5h5"></path>'),
    svg('<circle cx="11" cy="11" r="6.5"></circle><path d="M16 16l4.5 4.5"></path>'),
    svg('<rect x="3" y="7" width="13" height="13" rx="2"></rect><path d="M8 4h11a2 2 0 0 1 2 2v11"></path>'),
    svg('<rect x="3" y="4" width="18" height="12" rx="1.5"></rect><path d="M12 16v4M8 20h8"></path>'),
    svg('<path d="M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3z"></path><path d="M21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z"></path>'),
    svg('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"></path>'),
    svg('<path d="M4 19h5v-5h5V9h6"></path>')
  ];
  const LEARNING_ICONS = [
    svg('<path d="M4 11a8 8 0 0 1 14-5l2 2M20 13a8 8 0 0 1-14 5l-2-2"></path><path d="M20 4v4h-4M4 20v-4h4"></path>'),
    svg('<circle cx="12" cy="8" r="4"></circle><path d="M5 21c1-4 4-6 7-6s6 2 7 6"></path>'),
    svg('<circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="12" r="1"></circle>')
  ];
  const HAND_ICON = svg('<path d="M8 13V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6 7-2.5 0-4-1.5-5.5-4l-2-3.5a1.5 1.5 0 0 1 2.5-1.5L8 13"></path>');

  function escapeHtml(value){
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  }

  // The Curriculum Map and AI Study now live in "Three ways to start" and in their
  // own band; the old zone-grid copies are removed so each destination appears once.
  function removeLegacyGridCards(){
    document.getElementById("zoneGrid")?.querySelectorAll("#homeCurriculumMapCard.zone-card, #homeStudyZoneCard").forEach((el) => el.remove());
  }

  function ensureOtherRoutesLabel(){
    const grid = document.getElementById("zoneGrid");
    const special = document.getElementById("specialSchoolZoneCard");
    if(!grid || !special || special.parentElement !== grid) return;
    let label = document.getElementById("homeV9OtherRoutes");
    if(!label){
      label = document.createElement("h3");
      label.id = "homeV9OtherRoutes";
      label.className = "home-v9-other-routes";
    }
    label.textContent = currentCopy().otherRoutes;
    if(special.previousElementSibling !== label) grid.insertBefore(label, special);
  }

  // ---------- Hero: 3-step finder ----------
  const finderState = { role: "student", zone: "middle", need: "tools" };

  function finderHref(){
    const { role, zone, need } = finderState;
    if(zone === "preschool") return "/preschool";
    if(zone === "special") return "/special-education.html";
    if(need === "study") return "/study.html";
    if(need === "practice") return `/${zone}/guardian/quiz`;
    if(need === "stuck"){
      if(zone === "primary") return "/primary/guardian/tutor";
      return `/${zone}/${role === "student" ? "student" : "guardian"}/tutor`;
    }
    return `/${zone}/${role === "student" ? "student" : "guardian"}/tools`;
  }

  function finderCta(c){
    const { zone, need } = finderState;
    if(zone === "preschool") return c.ctaPreschool;
    if(zone === "special") return c.ctaSpecial;
    if(need === "study") return c.ctaStudy;
    const label = c.zones[zone][0];
    const lead = need === "practice" ? c.ctaPractice : need === "stuck" ? c.ctaStuck : c.ctaTools;
    return `${lead} ${label}`;
  }

  function finderNote(c){
    const { role, zone } = finderState;
    if(zone === "preschool") return c.notePreschool;
    if(zone === "special") return c.noteSpecial;
    if(zone === "primary" && role === "student") return c.notePrimaryStudent;
    if(zone === "middle" && role === "student") return finderState.need === "stuck" ? c.noteMiddleStuck : c.noteMiddleStudent;
    if(zone === "high") return c.noteHigh;
    return "";
  }

  function chip(kind, value, label, pressed, extra){
    return `<button type="button" class="home-v9-chip" data-finder-${kind}="${value}" aria-pressed="${pressed ? "true" : "false"}">${extra || ""}<span>${escapeHtml(label)}</span></button>`;
  }

  function renderFinder(){
    const mount = document.getElementById("homeV9Finder");
    if(!mount) return;
    const c = currentCopy();
    const roles = Object.entries(c.roles).map(([id,label]) => chip("role", id, label, finderState.role === id)).join("");
    const zones = Object.entries(c.zones).map(([id,[label,age]]) => chip("zone", id, label, finderState.zone === id, `<span class="home-v9-chip__dot home-v9-dot--${id}" aria-hidden="true"></span>`) .replace(`<span>${escapeHtml(label)}</span></button>`, `<span>${escapeHtml(label)}</span>${age ? `<small>${age}</small>` : ""}</button>`)).join("");
    const needs = Object.entries(c.finderNeeds).map(([id,label]) => chip("need", id, label, finderState.need === id)).join("");
    const note = finderNote(c);
    mount.innerHTML = `
      <p class="home-v9-finder__label">${c.stepsLabel}</p>
      <div class="home-v9-finder__step" role="group" aria-label="${escapeHtml(c.stepRole)}"><span class="home-v9-finder__step-title" aria-hidden="true">${c.stepRole}</span><div class="home-v9-finder__chips">${roles}</div></div>
      <div class="home-v9-finder__step" role="group" aria-label="${escapeHtml(c.stepZone)}"><span class="home-v9-finder__step-title" aria-hidden="true">${c.stepZone}</span><div class="home-v9-finder__chips">${zones}</div></div>
      <div class="home-v9-finder__step" role="group" aria-label="${escapeHtml(c.stepNeed)}"><span class="home-v9-finder__step-title" aria-hidden="true">${c.stepNeed}</span><div class="home-v9-finder__chips">${needs}</div></div>
      <p class="home-v9-finder__note" aria-live="polite"${note ? "" : " hidden"}>${note ? ICON.shield + `<span>${escapeHtml(note)}</span>` : ""}</p>
      <a class="home-v9-finder__cta" id="homeV9FinderCta" href="${finderHref()}">${escapeHtml(finderCta(c))} <span aria-hidden="true">→</span></a>`;
  }

  function renderPrinciple(){
    const mount = document.getElementById("homeV9Principle");
    if(!mount) return;
    const c = currentCopy();
    mount.innerHTML = `
      <div class="home-v9-principle__card">
        <p class="home-v9-principle__label">${c.principleLabel}</p>
        <p class="home-v9-principle__quote">${c.principleQuote}</p>
        <ol class="home-v9-principle__steps">
          ${c.principleSteps.map(([title,sub],i) => `<li${i === 2 ? ' class="is-current"' : ""}><span class="home-v9-principle__num" aria-hidden="true">${i + 1}</span><span class="home-v9-principle__title">${title}</span><span class="home-v9-principle__sub">${sub}</span></li>`).join("")}
        </ol>
      </div>
      <div class="home-v9-principle__chat">
        <p class="home-v9-principle__chat-label">${c.chatLabel}</p>
        <p class="home-v9-principle__bubble home-v9-principle__bubble--me">${c.chatQ}</p>
        <p class="home-v9-principle__bubble home-v9-principle__bubble--ai">${c.chatA}</p>
      </div>`;
  }

  function helpersMarkup(){
    const c = currentCopy();
    return `
      <div class="home-v8-helpers">
        <div class="home-v9-section-head">
          <h2 id="homeV9WaysTitle">${c.waysTitle}</h2>
          <p>${c.waysLead}</p>
        </div>
        <div class="home-v9-ways">
          <section class="home-v8-map" aria-labelledby="homeV8MapTitle">
            <span class="home-v9-way__icon" aria-hidden="true">${ICON.compass}</span>
            <p class="home-v9-way__eyebrow">${c.mapDesc}</p>
            <h3 id="homeV8MapTitle">${c.mapTitle}</h3>
            <p class="home-v8-map__lead">${c.mapLead}</p>
            <p class="home-v9-way__links-label">${c.mapCta}</p>
            <div class="home-v8-helper-links">
              <a href="/primary/guardian/quiz">${c.mapPrimary}</a>
              <a href="/middle/guardian/quiz">${c.mapMiddle}</a>
              <a href="/high/guardian/quiz">${c.mapGel}</a>
              <a href="#" data-epal-practice-map>${c.mapEpal}</a>
              <a href="#" data-special-education-diagnostic>${c.mapSpecial}</a>
            </div>
          </section>

          <section class="home-v9-curriculum" aria-labelledby="homeV9CurriculumTitle">
            <span class="home-v9-way__icon" aria-hidden="true">${ICON.map}</span>
            <p class="home-v9-way__eyebrow">${c.curriculumCardBadge}</p>
            <h3 id="homeV9CurriculumTitle">${c.curriculumCardTitle}</h3>
            <p class="home-v8-helper-desc">${c.curriculumCardDesc}</p>
            <a class="home-v9-way__action" id="homeCurriculumMapCard" href="/xartis-ylis.html">${c.curriculumAction}</a>
          </section>

          <section class="home-v8-ai" aria-labelledby="homeV8AiTitle">
            <span class="home-v9-way__icon" aria-hidden="true">${ICON.chat}</span>
            <div class="home-v8-ai__badges">
              <span>${c.aiBadgeNew}</span>
              <span>${c.aiBadgeFree}</span>
            </div>
            <h3 id="homeV8AiTitle">${c.aiTitle}</h3>
            <p class="home-v8-helper-desc">${c.aiDesc}</p>
            <details class="home-v8-ai__tech" id="homeV8AiTechDetails">
              <summary title="GPT-OSS 120B · Cloudflare Workers AI → Groq · Puter optional">${c.aiTechSummary}</summary>
              <p>${c.aiTechText} <a href="/ai-transparency.html">${c.aiTechLink}</a></p>
            </details>
            <p class="home-v9-way__links-label">${c.aiLinksLabel}</p>
            <div class="home-v8-helper-links home-v8-ai__links">
              <a href="/primary/guardian/tutor">${c.aiPrimary}</a>
              <a href="/middle/student/tutor">${c.aiMiddle}</a>
              <a href="/high/student/tutor">${c.aiHigh}</a>
              <a href="/middle/student/tutor">${c.aiSpecial}</a>
            </div>
          </section>
        </div>
      </div>`;
  }

  function studyMarkup(){
    const c = currentCopy();
    return `
      <div class="home-v9-study__copy">
        <p class="home-v9-badge">${c.studyBadge}</p>
        <h2 id="homeV9StudyTitle">${c.studyTitle}</h2>
        <div class="home-v9-study__official">
          <span class="home-v9-study__official-icon" aria-hidden="true">${ICON.book}</span>
          <span><strong>${c.studyOfficial}</strong><small>${c.studyCoverage}</small></span>
        </div>
        <p class="home-v9-study__desc">${c.studyDesc}</p>
        <ul class="home-v9-study__goals">${c.studyGoals.map((g) => `<li>${g}</li>`).join("")}</ul>
        <a class="home-v9-study__cta" href="/study.html">${c.studyCta}</a>
      </div>
      <ol class="home-v9-study__steps">
        ${c.studySteps.map(([t,sub],i) => `<li${i === 1 ? ' class="is-current"' : ""}><span class="home-v9-study__num" aria-hidden="true">${i + 1}</span><span><strong>${t}</strong><small>${sub}</small></span></li>`).join("")}
      </ol>`;
  }

  function charactersMarkup(){
    const c = currentCopy();
    const characterRoute = c.learningModes[1][3];
    return `
      <div class="home-v9-characters__copy">
        <p class="home-v9-badge">${c.charBadge}</p>
        <h2 id="homeV9CharactersTitle">${c.charTitle}</h2>
        <p>${c.charDesc}</p>
        <a class="home-v9-characters__cta" href="${characterRoute}">${c.charCta}</a>
      </div>
      <ul class="home-v9-characters__list">
        ${c.chars.map(([file,name,period]) => `<li><img src="/assets/characters/${file}.png" alt="" width="132" height="132" decoding="async"><strong>${name}</strong><small>${period}</small></li>`).join("")}
      </ul>`;
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
          ${c.needs.map(([,title,desc,href],i) => `
            <a class="home-v8-needs-card" href="${href}">
              <span class="home-v8-needs-card__icon" aria-hidden="true">${NEED_ICONS[i] || ""}</span>
              <span><strong>${title}</strong><small>${desc}</small></span>
            </a>`).join("")}
        </div>
        <div class="home-v8-learning-grid">
          ${c.learningModes.map(([,title,desc,href],i) => `
            <a class="home-v8-learning-card" href="${href}">
              <span class="home-v8-learning-card__icon" aria-hidden="true">${LEARNING_ICONS[i] || ""}</span>
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

    const study = ensureSection("homeV9Study", "home-v9-study", "homeV9StudyTitle", studyMarkup());

    let heading = document.getElementById("homeV8FinderTitle");
    if(!heading){
      heading = document.createElement("h2");
      heading.id = "homeV8FinderTitle";
      heading.className = "home-v8-finder-title";
    }
    heading.textContent = currentCopy().finderTitle;

    let lead = document.getElementById("homeV9ZonesLead");
    if(!lead){
      lead = document.createElement("p");
      lead.id = "homeV9ZonesLead";
      lead.className = "home-v9-zones-lead";
    }
    lead.textContent = currentCopy().zonesLead;

    document.getElementById("homeV8EducatorHint")?.remove();

    let needs = document.getElementById("homeV8Needs");
    if(!needs){
      needs = document.createElement("section");
      needs.id = "homeV8Needs";
      needs.className = "home-v8-needs";
    }
    // v9: the task routes are the main "what do you want to do" entry point, so they start open.
    const previousToggle = needs.querySelector("#homeV8NeedsToggle");
    // Starts collapsed on every screen: the visitor decides whether to open it.
    const expanded = previousToggle ? previousToggle.getAttribute("aria-expanded") === "true" : false;
    needs.innerHTML = needsMarkup();
    setNeedsOpen(needs, expanded);

    const characters = ensureSection("homeV9Characters", "home-v9-characters", "homeV9CharactersTitle", charactersMarkup());

    const order = [helpers, study, heading, lead, grid, needs, characters];
    const current = [...shell.children].filter((el) => order.includes(el));
    if(current.length !== order.length || current.some((el, i) => el !== order[i])){
      order.forEach((el) => shell.appendChild(el));
    }

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
        <span class="home-v8-eng__icon" aria-hidden="true">${HAND_ICON}</span>
        <div>
          <h2>${c.engTitle}</h2>
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
    renderPrinciple();
    ensureSpecialSchoolCard();
    ensureMainShell();
    ensureHigherEducationPilot();
    removeLegacyGridCards();
    ensureOtherRoutesLabel();
    ensureEngSection();
    document.getElementById("homeV8FooterExtra")?.remove();
    suppressLegacyInjectedBlocks();
    revealHomepage(styleLink);
  }

  function init(){
    apply();

    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if(!target) return;

      const finderChip = target.closest("#homeV9Finder [data-finder-role], #homeV9Finder [data-finder-zone], #homeV9Finder [data-finder-need]");
      if(finderChip){
        if(finderChip.dataset.finderRole) finderState.role = finderChip.dataset.finderRole;
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

      const toggle = target.closest("#homeV8NeedsToggle");
      if(toggle){
        const section = document.getElementById("homeV8Needs");
        const open = toggle.getAttribute("aria-expanded") === "true";
        setNeedsOpen(section, !open);
        return;
      }

      if(target.closest("#langEl,#langEn,#backToZones")){
        setTimeout(() => {
          if(isHome()) apply();
        }, 0);
      }
    });

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
      const observer = new MutationObserver(() => {
        ensureSpecialSchoolCard();
        ensureHigherEducationPilot();
        removeLegacyGridCards();
        ensureOtherRoutesLabel();
        suppressLegacyInjectedBlocks();
      });
      observer.observe(grid, {childList:true});
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
