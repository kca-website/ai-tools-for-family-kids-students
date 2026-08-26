/**
 * app.js
 * ------------------------------------------------------------
 * Εφαρμογή vanilla JS. Χωρίς build step, χωρίς framework.
 * 
 * Λειτουργίες:
 *   - Επιλογή ζώνης & ρόλου
 *   - Εμφάνιση εργαλείων (βασικά + προχωρημένα)
 *   - Prompt Generator
 *   - Διαγνωστικός Χάρτης (Learning Compass)
 *   - Οδηγός (Guide) με δυνατότητα PDF
 * ------------------------------------------------------------
 */

(function () {
  "use strict";

  // ---------- State ----------
  const state = {
    lang: "el",
    currentZone: null,
    currentRole: "guardian",
    currentView: "tools", // "tools" | "advanced" | "prompts" | "quiz" | "guide"
    currentSubject: null, // subjectId ή null = "Όλα"
    // Quiz sub-state
    quizGradeId: null,
    quizSubjectId: null,
    quizCurrentIndex: 0,
    quizAnswers: [],
    quizFinished: false,
    quizSessionQuestions: [], // Το τυχαίο υποσύνολο ερωτήσεων της τρέχουσας προσπάθειας
    // Parent Quiz sub-state (νέο)
    parentQuizActive: false,
    parentQuizIndex: 0,
    parentQuizAnswers: [],
    parentQuizFinished: false,
    childScorePercent: null,
  };

  // ---------- Στατικά strings ----------
  const STRINGS = {
    el: {
      heroTitle: "Μαθαίνω Έξυπνα με AI",
      heroSubtitle: "Δες σε 2 λεπτά πού χρειάζεται λίγη παραπάνω εξάσκηση ο μαθητής ή ο γονιός και ποιο δωρεάν AI εργαλείο ταιριάζει ακριβώς εκεί. Για γονείς, μαθητές 6 έως 18 αλλά και εκπαιδευτικούς.",
      badgeFree: "Δωρεάν",
      badgeIndependent: "Ανεξάρτητο",
      badgeBilingual: "Δίγλωσσο EL / EN",
      badgeZeroTracking: "Χωρίς Cookies",
      chooseZoneHeading: "Διάλεξε ηλικιακή ζώνη",
      chooseZoneSubheading: "Κάθε ζώνη έχει διαφορετικά κατάλληλα εργαλεία και διαφορετικό βαθμό αυτονομίας.",
      heroQuizCta: "Κάνε το Διαγνωστικό σε 2 λεπτά",
      heroQuizCtaSub: "Οποιαδήποτε στιγμή, χωρίς διάβασμα πριν. Δείχνει τι ξέρεις ήδη, και μπορείς να το ξανακάνεις σε λίγες εβδομάδες για να δεις την πρόοδο.",
      heroQuizPickPrompt: "Για ποια ζώνη;",
      backToZones: "Πίσω σε όλες τις ζώνες",
      footerText: "Ανεξάρτητο έργο. Δεν σχετίζεται με κανέναν οργανισμό ή προμηθευτή AI εργαλείων.",
      emptyState: "Δεν έχουν προστεθεί ακόμα εργαλεία για αυτόν τον συνδυασμό. Έρχονται σύντομα.",
      useCaseLabel: "Για ποια δουλειά",
      howToLabel: "Πώς να το χρησιμοποιήσεις",
      cautionLabel: "Προσοχή",
      visitLink: "Άνοιγμα εργαλείου ↗",
      infoLink: "Περισσότερα ↗",
      viewTabTools: "Εργαλεία",
      viewTabAdvanced: "Προχωρημένα",
      viewTabPrompts: "Prompt Generator",
      viewTabQuiz: "Διαγνωστικός Χάρτης",
      viewTabGuide: "Οδηγός",
      // ---------- "Τι ΔΕΝ είναι" + Last checked (νέο) ----------
      notGuideTitle: "Τι ΔΕΝ είναι αυτός ο οδηγός",
      notGuideItem1: "Δεν αντικαθιστά τον δάσκαλο ή τον γονιό.",
      notGuideItem2: "Δεν είναι τρόπος να αντιγράψεις μια εργασία έτοιμη.",
      footerLastChecked: "Τελευταίος έλεγχος εργαλείων: 24 Αυγούστου 2026",
      footerPrivacyLink: "Πολιτική Απορρήτου",
      toolAgeLabel: "Όροι Χρήσης",
      shareToolBtn: "Μοιράσου",
      shareToolCopied: "Αντιγράφηκε!",
      promptsIntro: "Αυτά τα prompts δεν γράφουν την εργασία για εσένα. Σε ρωτάνε πρώτα τι σκέφτεσαι, και το AI απαντάει πάνω σε αυτό. Γράψε τη δική σου σκέψη μέσα στις αγκύλες πριν το αντιγράψεις.",
      promptsEmptyState: "Δεν έχουν προστεθεί ακόμα prompts για αυτή τη ζώνη. Έρχονται σύντομα.",
      copyPrompt: "Αντιγραφή prompt",
      copiedPrompt: "Αντιγράφηκε",
      tipLabel: "Συμβουλή",
      quizEmptyState: "Δεν υπάρχει ακόμα διαγνωστικό κουίζ για αυτή τη ζώνη. Έρχεται σύντομα.",
      quizPickGrade: "Διάλεξε τάξη",
      quizPickSubject: "Διάλεξε μάθημα",
      quizBackToGrades: "← Άλλη τάξη",
      quizGradeComingSoon: "Έρχεται σύντομα",
      quizGradeEmptyState: "Δεν υπάρχει ακόμα διαγνωστικό κουίζ για αυτή την τάξη. Έρχεται σύντομα.",
      quizStartBtn: "Ξεκίνα το κουίζ",
      quizQuestionOf: "Ερώτηση {current} από {total}",
      quizResultsTitle: "Το αποτέλεσμα του Χάρτη",
      quizAllCorrect: "Απάντησε σωστά σε όλα! Καμία συγκεκριμένη δυσκολία δεν εντοπίστηκε αυτή τη φορά.",
      quizGapsFound: "Εντοπίστηκαν σημεία για εξάσκηση:",
      quizRecommendedTools: "Προτεινόμενα εργαλεία",
      quizRetakeBtn: "Ξανακάνε το κουίζ",
      quizBackToStart: "Πίσω στην αρχή του κουίζ",
      quizDownloadStory: "Για Story",
      // ---------- Learning Paths (νέο) ----------
      pathViewBtn: "Δες το Μονοπάτι Μάθησης →",
      pathModalTitle: "Μονοπάτι Μάθησης",
      pathModalIntro: "3 βήματα. Το πρώτο δεν χρειάζεται καθόλου AI, το τρίτο επιβεβαιώνει ότι το κατάλαβες πραγματικά.",
      pathStepLabel: "Βήμα {step} από 3",
      pathModalClose: "Κλείσιμο",
      pathOpenTool: "Άνοιγμα εργαλείου ↗",
      advancedIntro: "Εργαλεία που δεν είναι διάσημα αλλά λύνουν συγκεκριμένες δύσκολες ανάγκες.",
      pdfDownloading: "Δημιουργία PDF...",
      subjectFilterLabel: "Φίλτρο μαθήματος",
      subjectAll: "Όλα",
      subjectEmptyState: "Δεν υπάρχει ακόμα αντιστοίχιση εργαλείου για αυτό το μάθημα σε αυτή τη ζώνη.",
      // ---------- Parent Quiz (νέο) ----------
      parentQuizCta: "🧑‍🤝‍🧑 Δοκίμασε κι εσύ, γονιέ!",
      parentQuizCtaSub: "Δες αν ξέρεις τόσο καλά όσο νομίζεις τι κάνει το παιδί σου με το AI.",
      parentQuizTitle: "Πόσο καλά ξέρεις τι κάνει το παιδί σου με το AI;",
      parentQuizIntro: "5 σύντομες ερωτήσεις, χωρίς καταγραφή απαντήσεων. Μόνο για εσένα.",
      parentQuizStartBtn: "Ξεκίνα",
      parentQuizResultsTitle: "Η σύγκριση",
      parentQuizChildLabel: "Το παιδί σου",
      parentQuizYouLabel: "Εσύ",
      parentQuizCorrectOf: "{correct} σωστά από {total}",
      parentQuizMsgChildWins: "Το παιδί σου τα πήγε καλύτερα από σένα σε αυτό το κουίζ. Ίσως άξιζε μια δεύτερη κουβέντα μαζί του για το πώς χρησιμοποιεί το AI.",
      parentQuizMsgParentWins: "Τα πήγες καλύτερα από το παιδί σου! Καλή ευκαιρία να του δείξεις τι ξέρεις.",
      parentQuizMsgTie: "Ισοπαλία! Φαίνεται πως το συζητάτε ήδη σωστά στο σπίτι.",
      parentQuizRetake: "Ξανακάνε το κουίζ γονιού",
      parentQuizBack: "Πίσω στο αποτέλεσμα του παιδιού",
      parentQuizShareCta: "Μοιράσου τη σύγκριση με άλλους γονείς",
    },
    en: {
      heroTitle: "Learn Smarter with AI",
      heroSubtitle: "See in 2 minutes where the student or the parent could use a bit more practice, and which free AI tool fits exactly there. For parents, students 6 to 18, and educators.",
      badgeFree: "Free",
      badgeIndependent: "Independent",
      badgeBilingual: "Bilingual EL / EN",
      badgeZeroTracking: "No Cookies",
      chooseZoneHeading: "Choose an age zone",
      chooseZoneSubheading: "Each zone has different suitable tools and a different level of independence.",
      heroQuizCta: "Take the 2-minute Diagnostic",
      heroQuizCtaSub: "Anytime, no studying required. It shows what you already know, and you can retake it in a few weeks to see your progress.",
      heroQuizPickPrompt: "For which zone?",
      backToZones: "Back to all zones",
      footerText: "Independent project. Not affiliated with any organization or AI tool vendor.",
      emptyState: "No tools added yet for this combination. Coming soon.",
      useCaseLabel: "Best for",
      howToLabel: "How to use it",
      cautionLabel: "Caution",
      visitLink: "Open tool ↗",
      infoLink: "Learn more ↗",
      viewTabTools: "Tools",
      viewTabAdvanced: "Advanced",
      viewTabPrompts: "Prompt Generator",
      viewTabQuiz: "Learning Compass",
      viewTabGuide: "Guide",
      promptsIntro: "These prompts don't write the assignment for you. They ask what you're thinking first, and the AI responds to that. Fill in your own thinking inside the brackets before copying.",
      promptsEmptyState: "No prompts added yet for this zone. Coming soon.",
      copyPrompt: "Copy prompt",
      copiedPrompt: "Copied",
      tipLabel: "Tip",
      quizEmptyState: "No diagnostic quiz yet for this zone. Coming soon.",
      quizPickGrade: "Choose a grade",
      quizPickSubject: "Choose a subject",
      quizBackToGrades: "← Change grade",
      quizGradeComingSoon: "Coming soon",
      quizGradeEmptyState: "No diagnostic quiz yet for this grade. Coming soon.",
      quizStartBtn: "Start the quiz",
      quizQuestionOf: "Question {current} of {total}",
      quizResultsTitle: "Your Compass Result",
      quizAllCorrect: "All correct! No specific gap spotted this time.",
      quizGapsFound: "Spots worth some extra practice:",
      quizRecommendedTools: "Recommended tools",
      quizRetakeBtn: "Retake the quiz",
      quizBackToStart: "Back to quiz start",
      quizDownloadStory: "For Story",
      // ---------- Learning Paths (new) ----------
      pathViewBtn: "View the Learning Path →",
      pathModalTitle: "Learning Path",
      pathModalIntro: "3 steps. The first needs no AI at all, the third confirms you actually got it.",
      pathStepLabel: "Step {step} of 3",
      pathModalClose: "Close",
      pathOpenTool: "Open tool ↗",
      // ---------- "What this guide is NOT" + Last checked (new) ----------
      notGuideTitle: "What this guide is NOT",
      notGuideItem1: "It doesn't replace a teacher or a parent.",
      notGuideItem2: "It's not a way to get a finished assignment to copy.",
      footerLastChecked: "Tools last checked: August 24, 2026",
      footerPrivacyLink: "Privacy Policy",
      toolAgeLabel: "Terms of Use",
      shareToolBtn: "Share",
      shareToolCopied: "Copied!",
      advancedIntro: "Tools that aren't famous but solve specific difficult needs.",
      pdfDownloading: "Generating PDF...",
      subjectFilterLabel: "Subject filter",
      subjectAll: "All",
      subjectEmptyState: "No tool mapping yet for this subject in this zone.",
      // ---------- Parent Quiz (new) ----------
      parentQuizCta: "🧑‍🤝‍🧑 Try it yourself, parent!",
      parentQuizCtaSub: "See if you know as well as you think what your child does with AI.",
      parentQuizTitle: "How well do you know what your child does with AI?",
      parentQuizIntro: "5 quick questions. Nothing is recorded. Just for you.",
      parentQuizStartBtn: "Start",
      parentQuizResultsTitle: "The comparison",
      parentQuizChildLabel: "Your child",
      parentQuizYouLabel: "You",
      parentQuizCorrectOf: "{correct} correct out of {total}",
      parentQuizMsgChildWins: "Your child did better than you on this quiz. Might be worth a chat about how they use AI.",
      parentQuizMsgParentWins: "You beat your child on this one! Good chance to show them what you know.",
      parentQuizMsgTie: "It's a tie! Looks like you're already talking about this the right way at home.",
      parentQuizRetake: "Retake the parent quiz",
      parentQuizBack: "Back to your child's result",
      parentQuizShareCta: "Share the comparison with other parents",
    },
  };

  function t(key, vars) {
    let str = STRINGS[state.lang][key] || key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.replace(`{${k}}`, vars[k]);
      });
    }
    return str;
  }

  // ---------- PARENT QUIZ DATA (αυτόνομο, δεν εξαρτάται από quiz-data.js) ----------
  const PARENT_QUIZ = {
    el: {
      questions: [
        {
          id: "pq1",
          text: "Ποια είναι η ελάχιστη ηλικία πρόσβασης στο ChatGPT με προσωπικό λογαριασμό (με γονική συγκατάθεση μέχρι τα 17);",
          options: [
            { text: "13 ετών", correct: true },
            { text: "16 ετών", correct: false },
            { text: "Δεν υπάρχει όριο", correct: false },
          ],
        },
        {
          id: "pq2",
          text: "Ποιο από αυτά τα εργαλεία ΔΕΝ προσφέρει καμία πρόσβαση σε ανηλίκους, ούτε με γονική άδεια;",
          options: [
            { text: "Khanmigo", correct: false },
            { text: "Claude", correct: true },
            { text: "Duolingo", correct: false },
          ],
        },
        {
          id: "pq3",
          text: "Το παιδί σου λύνει μια άσκηση Μαθηματικών με το Photomath. Ποια είναι η σωστή σειρά;",
          options: [
            { text: "Πρώτα προσπαθεί μόνο του, μετά ελέγχει με το εργαλείο", correct: true },
            { text: "Φωτογραφίζει την άσκηση αμέσως για να δει τη λύση", correct: false },
          ],
        },
        {
          id: "pq4",
          text: "Το παιδί σου γράφει σε ένα AI chatbot 'γράψε μου την έκθεσή μου'. Τι θα έπρεπε ιδανικά να γράψει αντί αυτού;",
          options: [
            { text: "Να ζητήσει βοήθεια να οργανώσει τις δικές του ιδέες", correct: true },
            { text: "Τίποτα διαφορετικό, είναι το ίδιο", correct: false },
          ],
        },
        {
          id: "pq5",
          text: "Τι δεδομένα συλλέγει το aitools4kids.gr όταν κάνετε το quiz;",
          options: [
            { text: "Email και όνομα", correct: false },
            { text: "Τίποτα, δεν αποθηκεύει καμία απάντηση", correct: true },
          ],
        },
      ],
    },
    en: {
      questions: [
        {
          id: "pq1",
          text: "What is the minimum age for a personal ChatGPT account (with parental consent up to 17)?",
          options: [
            { text: "13 years old", correct: true },
            { text: "16 years old", correct: false },
            { text: "No age limit", correct: false },
          ],
        },
        {
          id: "pq2",
          text: "Which of these tools offers NO access path for minors, even with parental consent?",
          options: [
            { text: "Khanmigo", correct: false },
            { text: "Claude", correct: true },
            { text: "Duolingo", correct: false },
          ],
        },
        {
          id: "pq3",
          text: "Your child is solving a math exercise with Photomath. What's the right order?",
          options: [
            { text: "Try it themselves first, then check with the tool", correct: true },
            { text: "Photograph the exercise right away to see the solution", correct: false },
          ],
        },
        {
          id: "pq4",
          text: "Your child types 'write my essay for me' into an AI chatbot. What should they ideally write instead?",
          options: [
            { text: "Ask for help organizing their own ideas", correct: true },
            { text: "Nothing different, it's the same thing", correct: false },
          ],
        },
        {
          id: "pq5",
          text: "What data does aitools4kids.gr collect when you take the quiz?",
          options: [
            { text: "Email and name", correct: false },
            { text: "Nothing, no answers are stored", correct: true },
          ],
        },
      ],
    },
  };

  // ---------- DOM refs ----------
  const els = {};

  function cacheDom() {
    els.zoneSelectView = document.getElementById("zoneSelectView");
    els.pathView = document.getElementById("pathView");
    els.zoneGrid = document.getElementById("zoneGrid");
    els.heroQuizCtaBtn = document.getElementById("heroQuizCtaBtn");
    els.heroQuizPicker = document.getElementById("heroQuizPicker");
    els.heroQuizPickerGrid = document.getElementById("heroQuizPickerGrid");
    els.pathZoneHeading = document.getElementById("pathZoneHeading");
    els.roleTabs = document.getElementById("roleTabs");
    els.subjectFilter = document.getElementById("subjectFilter");
    els.pathIntro = document.getElementById("pathIntro");
    els.toolGrid = document.getElementById("toolGrid");
    els.advancedGrid = document.getElementById("advancedGrid");
    els.backToZones = document.getElementById("backToZones");
    els.langElBtn = document.getElementById("langEl");
    els.langEnBtn = document.getElementById("langEn");
    els.viewTabTools = document.getElementById("viewTabTools");
    els.viewTabAdvanced = document.getElementById("viewTabAdvanced");
    els.viewTabPrompts = document.getElementById("viewTabPrompts");
    els.viewTabQuiz = document.getElementById("viewTabQuiz");
    els.viewTabGuide = document.getElementById("viewTabGuide");
    els.toolsView = document.getElementById("toolsView");
    els.advancedView = document.getElementById("advancedView");
    els.promptsView = document.getElementById("promptsView");
    els.promptList = document.getElementById("promptList");
    els.quizView = document.getElementById("quizView");
    els.quizContent = document.getElementById("quizContent");
    els.guideView = document.getElementById("guideView");
    els.guideContent = document.getElementById("guideContent");
    els.pathModalOverlay = document.getElementById("pathModalOverlay");
    els.pathModal = document.getElementById("pathModal");
  }

  // ---------- Rendering: στατικό UI κείμενο ----------
  function renderStaticStrings() {
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      node.textContent = t(key);
    });
    els.langElBtn.classList.toggle("active", state.lang === "el");
    els.langEnBtn.classList.toggle("active", state.lang === "en");
    document.documentElement.lang = state.lang;
  }

  // ---------- Rendering: Ζώνες ----------
  function renderZoneGrid() {
    els.zoneGrid.innerHTML = "";
    ZONES.forEach((zone) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "zone-card";
      card.dataset.zone = zone.id;
      const label = state.lang === "el" ? zone.labelEl : zone.labelEn;
      const age = state.lang === "el" ? zone.ageRangeEl : zone.ageRangeEn;
      const desc = state.lang === "el" ? zone.descriptionEl : zone.descriptionEn;
      card.innerHTML = `
        <span class="zone-card__icon" aria-hidden="true">${zone.icon}</span>
        <p class="zone-card__label">${label}</p>
        <p class="zone-card__age">${age}</p>
        <p class="zone-card__desc">${desc}</p>
      `;
      card.addEventListener("click", () => selectZone(zone.id));
      els.zoneGrid.appendChild(card);
    });
  }

  // ---------- Rendering: Hero quiz picker (viral shortcut στο Learning Compass) ----------
  function renderHeroQuizPicker() {
    if (!els.heroQuizPickerGrid) return;
    els.heroQuizPickerGrid.innerHTML = "";
    ZONES.forEach((zone) => {
      const label = state.lang === "el" ? zone.labelEl : zone.labelEn;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hero__quiz-picker-btn";
      btn.dataset.zone = zone.id;
      btn.innerHTML = `<span aria-hidden="true">${zone.icon}</span> ${label}`;
      btn.addEventListener("click", () => {
        els.heroQuizPicker.hidden = true;
        selectZoneQuiz(zone.id);
      });
      els.heroQuizPickerGrid.appendChild(btn);
    });
  }

  // ---------- Rendering: Role tabs ----------
  function renderRoleTabs() {
    els.roleTabs.innerHTML = "";
    ROLES.forEach((role) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "role-tab" + (state.currentRole === role.id ? " active" : "");
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", state.currentRole === role.id ? "true" : "false");
      const label = state.lang === "el" ? role.labelEl : role.labelEn;
      tab.innerHTML = `<span aria-hidden="true">${role.icon}</span> ${label}`;
      tab.addEventListener("click", () => selectRole(role.id));
      els.roleTabs.appendChild(tab);
    });
  }

  // ---------- Rendering: Subject filter chips ----------
  function renderSubjectFilter() {
    if (!els.subjectFilter) return;
    els.subjectFilter.innerHTML = "";

    const zoneSubjects = (CURRICULUM && CURRICULUM[state.currentZone]) || {};
    const availableSubjects = SUBJECTS.filter((s) => zoneSubjects[s.id]);

    if (!availableSubjects.length) {
      els.subjectFilter.hidden = true;
      return;
    }
    els.subjectFilter.hidden = false;

    const allChip = document.createElement("button");
    allChip.type = "button";
    allChip.className = "subject-chip" + (state.currentSubject === null ? " active" : "");
    allChip.textContent = t("subjectAll");
    allChip.addEventListener("click", () => selectSubject(null));
    els.subjectFilter.appendChild(allChip);

    availableSubjects.forEach((subject) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "subject-chip" + (state.currentSubject === subject.id ? " active" : "");
      const label = state.lang === "el" ? subject.labelEl : subject.labelEn;
      chip.innerHTML = `<span aria-hidden="true">${subject.icon}</span> ${label}`;
      chip.addEventListener("click", () => selectSubject(subject.id));
      els.subjectFilter.appendChild(chip);
    });
  }

  function selectSubject(subjectId) {
    state.currentSubject = subjectId;
    renderSubjectFilter();
    renderPathContent();
  }

  // ---------- Rendering: Path intro + tool grid (βασικά εργαλεία) ----------
  function renderPathContent() {
    const zone = ZONES.find((z) => z.id === state.currentZone);
    const role = ROLES.find((r) => r.id === state.currentRole);
    if (!zone || !role) return;

    const zoneLabel = state.lang === "el" ? zone.labelEl : zone.labelEn;
    const zoneAge = state.lang === "el" ? zone.ageRangeEl : zone.ageRangeEn;
    els.pathZoneHeading.textContent = `${zone.icon} ${zoneLabel} (${zoneAge})`;

    const pathData = (PATHS[state.currentZone] && PATHS[state.currentZone][state.currentRole]) || null;
    if (!pathData) {
      els.pathIntro.textContent = "";
      els.toolGrid.innerHTML = `<div class="empty-state">${t("emptyState")}</div>`;
      return;
    }
    els.pathIntro.textContent = state.lang === "el" ? pathData.introEl : pathData.introEn;

    let toolsToShow = pathData.tools || [];

    if (state.currentSubject) {
      const subjectData =
        CURRICULUM[state.currentZone] && CURRICULUM[state.currentZone][state.currentSubject];
      const allowedToolIds = subjectData ? subjectData.toolIds : [];
      toolsToShow = toolsToShow.filter((entry) => allowedToolIds.includes(entry.toolId));

      if (subjectData && subjectData.noteEl) {
        const note = state.lang === "el" ? subjectData.noteEl : subjectData.noteEn;
        els.pathIntro.textContent = note;
      }

      if (!toolsToShow.length) {
        els.toolGrid.innerHTML = `<div class="empty-state">${t("subjectEmptyState")}</div>`;
        return;
      }
    }

    renderToolGrid(toolsToShow, els.toolGrid);
  }

  // ---------- Rendering: Advanced tools (εξειδικευμένα) ----------
  function renderAdvancedTools() {
    // Μαζεύουμε όλα τα εργαλεία που έχουν isExpert: true
    const expertTools = [];
    Object.keys(TOOLS).forEach((id) => {
      const tool = TOOLS[id];
      if (tool.isExpert) {
        expertTools.push({ toolId: id, tool });
      }
    });

    if (!expertTools.length) {
      els.advancedGrid.innerHTML = `<div class="empty-state">${t("emptyState")}</div>`;
      return;
    }

    // Δημιουργούμε μια λίστα με την ίδια δομή με τα path tools
    const pathTools = expertTools.map(({ toolId, tool }) => ({
      toolId: toolId,
      useCaseEl: tool.shortDescEl || "",
      useCaseEn: tool.shortDescEn || "",
      howToEl: "Δοκίμασέ το για εξειδικευμένες ανάγκες.",
      howToEn: "Try it for specialized needs.",
      cautionEl: "",
      cautionEn: "",
    }));

    renderToolGrid(pathTools, els.advancedGrid);
  }
 // ---------- Generic tool grid renderer ----------
function renderToolGrid(pathTools, targetElement) {
  targetElement.innerHTML = "";
  if (!pathTools.length) {
    targetElement.innerHTML = `<div class="empty-state">${t("emptyState")}</div>`;
    return;
  }

  pathTools.forEach((entry) => {
    const tool = TOOLS[entry.toolId];
    if (!tool) return;

    const category = CATEGORIES.find((c) => c.id === tool.category);
    const categoryLabel = category ? (state.lang === "el" ? category.labelEl : category.labelEn) : "";
    const useCase = state.lang === "el" ? entry.useCaseEl : entry.useCaseEn;
    const howTo = state.lang === "el" ? entry.howToEl : entry.howToEn;
    const caution = state.lang === "el" ? entry.cautionEl : entry.cautionEn;

    // Δημιουργία logo HTML
    // Χρησιμοποιούμε favicon από το domain του εργαλείου (Google favicon service).
    // Αν αποτύχει να φορτώσει, το onerror πέφτει πίσω στο gradient placeholder.
    let logoHtml = '';
    const faviconUrl = getFaviconUrl(tool);
    if (faviconUrl) {
      logoHtml = `<img class="tool-card__logo-img" src="${escapeAttr(faviconUrl)}" alt="${escapeHtml(tool.name)} logo" loading="lazy" onerror="this.onerror=null; this.outerHTML='&lt;div class=&quot;tool-card__logo-placeholder&quot;&gt;&lt;/div&gt;';" />`;
    } else {
      logoHtml = `<div class="tool-card__logo-placeholder"></div>`;
    }

    // Έλεγχος αν είναι ελληνικό εργαλείο
    let greekBadge = '';
    if (tool.isGreek) {
      greekBadge = `<span class="tool-card__greek-badge">🇬🇷 Ελληνικό</span>`;
    }

    // Εφαρμογή κινητού (όχι web) — π.χ. Erla
    let mobileBadge = '';
    if (tool.isMobileApp) {
      mobileBadge = state.lang === "el"
        ? `<span class="tool-card__mobile-badge">📱 Μόνο εφαρμογή κινητού</span>`
        : `<span class="tool-card__mobile-badge">📱 Mobile app only</span>`;
    }

    // Υπό επανεξέταση — π.χ. προγράμματα που άλλαξαν πρόσφατα
    let pendingBadge = '';
    if (tool.pending) {
      pendingBadge = state.lang === "el"
        ? `<span class="tool-card__pending-badge">⏳ Υπό επανεξέταση</span>`
        : `<span class="tool-card__pending-badge">⏳ Under review</span>`;
    }

    const card = document.createElement("article");
    card.className = "tool-card";
    card.innerHTML = `
      <div class="tool-card__header">
        <div class="tool-card__logo" aria-hidden="true">
          ${logoHtml}
        </div>
        <p class="tool-card__name">${escapeHtml(tool.name)} ${greekBadge}${mobileBadge}${pendingBadge}</p>
      </div>
      ${categoryLabel ? `<span class="tool-card__category">${escapeHtml(categoryLabel)}</span>` : ""}
      ${useCase ? `<p class="tool-card__field-label">${t("useCaseLabel")}</p><p class="tool-card__field-value">${escapeHtml(useCase)}</p>` : ""}
      ${howTo ? `<p class="tool-card__field-label">${t("howToLabel")}</p><p class="tool-card__field-value">${escapeHtml(howTo)}</p>` : ""}
      ${caution ? `<div class="tool-card__caution"><strong>${t("cautionLabel")}:</strong> ${escapeHtml(caution)}</div>` : ""}
      ${typeof tool.minAge === "number" ? `<p class="tool-card__age-note"><strong>${t("toolAgeLabel")}:</strong> ${tool.minAge}+${tool.minAgeNote ? ` · ${escapeHtml(tool.minAgeNote)}` : ""}</p>` : ""}
      ${tool.greekTips && state.lang === "el" ? `<p class="tool-card__greek-tips" style="margin-top: 8px; padding: 8px 10px; background: #F0F7FF; border-radius: 8px; font-size: 0.85rem; color: #334155;">🇬🇷 ${escapeHtml(tool.greekTips)}</p>` : ""}
      <div class="tool-card__actions">
        ${tool.url ? `<a class="tool-card__link" href="${escapeAttr(tool.url)}" target="_blank" rel="noopener noreferrer">${t(tool.linkTypeInfo ? "infoLink" : "visitLink")}</a>` : ""}
        <button type="button" class="tool-card__share-btn">🔗 ${t("shareToolBtn")}</button>
      </div>
    `;
    const shareBtn = card.querySelector(".tool-card__share-btn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => shareToolCard(tool, useCase, shareBtn));
    }
    targetElement.appendChild(card);
  });
}

  // ---------- Rendering: View tabs ----------
  function renderViewTabs() {
    els.viewTabTools.classList.toggle("active", state.currentView === "tools");
    els.viewTabAdvanced.classList.toggle("active", state.currentView === "advanced");
    els.viewTabPrompts.classList.toggle("active", state.currentView === "prompts");
    els.viewTabQuiz.classList.toggle("active", state.currentView === "quiz");
    els.viewTabGuide.classList.toggle("active", state.currentView === "guide");
    els.toolsView.hidden = state.currentView !== "tools";
    els.advancedView.hidden = state.currentView !== "advanced";
    els.promptsView.hidden = state.currentView !== "prompts";
    els.quizView.hidden = state.currentView !== "quiz";
    els.guideView.hidden = state.currentView !== "guide";
  }

  // ---------- Rendering: Guide (Οδηγός) ----------
  function renderGuide() {
    const data = state.lang === "el" ? GUIDE_DATA.el : GUIDE_DATA.en;
    if (!data) {
      els.guideContent.innerHTML = `<div class="empty-state">Ο οδηγός δεν είναι ακόμα διαθέσιμος.</div>`;
      return;
    }

    let sectionsHtml = data.sections.map((section) => `
      <h2>${section.title}</h2>
      <div>${section.content}</div>
    `).join("");

    els.guideContent.innerHTML = `
      <h1>${data.title}</h1>
      ${sectionsHtml}
    `;

    // Σύνδεση του κουμπιού PDF (θα υπάρχει μέσα στο περιεχόμενο)
    const pdfBtn = document.getElementById("pdfDownloadBtn");
    if (pdfBtn) {
      pdfBtn.addEventListener("click", downloadGuidePDF);
    }
  }

  // ---------- PDF Download με html2pdf.js (lazy-loaded) ----------
  // Η βιβλιοθήκη (~150KB) φορτώνεται ΜΟΝΟ την πρώτη φορά που ο χρήστης
  // πατήσει το κουμπί PDF, όχι σε κάθε επίσκεψη της σελίδας.
  let html2pdfLoadPromise = null;
  function loadHtml2Pdf() {
    if (window.html2pdf) return Promise.resolve();
    if (html2pdfLoadPromise) return html2pdfLoadPromise;
    html2pdfLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.integrity = "sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==";
      script.crossOrigin = "anonymous";
      script.referrerPolicy = "no-referrer";
      script.onload = () => resolve();
      script.onerror = () => { html2pdfLoadPromise = null; reject(new Error("html2pdf failed to load")); };
      document.head.appendChild(script);
    });
    return html2pdfLoadPromise;
  }

  function downloadGuidePDF() {
    const btn = document.getElementById("pdfDownloadBtn");
    if (btn) {
      btn.textContent = t("pdfDownloading");
      btn.disabled = true;
    }

    loadHtml2Pdf()
      .then(() => runGuidePdfExport(btn))
      .catch((err) => {
        console.error(err);
        if (btn) {
          btn.textContent = "📄 Κατέβασε τον οδηγό σε PDF";
          btn.disabled = false;
        }
        alert(state.lang === "el" ? "Δεν φορτώθηκε το εργαλείο PDF. Δοκίμασε ξανά." : "Could not load the PDF tool. Please try again.");
      });
  }

  function runGuidePdfExport(btn) {

    // Παίρνουμε το περιεχόμενο του οδηγού (μόνο το guide-content)
    const guideElement = document.getElementById("guideContent");
    if (!guideElement) {
      alert("Δεν βρέθηκε το περιεχόμενο του οδηγού.");
      if (btn) { btn.textContent = "📄 Κατέβασε τον οδηγό σε PDF"; btn.disabled = false; }
      return;
    }

    // Αντιγραφή του περιεχομένου για να μην επηρεάσει το DOM
    const clone = guideElement.cloneNode(true);
    // Αφαιρούμε το κουμπί από το κλώνο
    const cloneBtn = clone.querySelector("#pdfDownloadBtn");
    if (cloneBtn) cloneBtn.remove();

    // Δημιουργούμε ένα προσωρινό container για το PDF
    const container = document.createElement("div");
    container.style.padding = "40px";
    container.style.fontFamily = "system-ui, -apple-system, sans-serif";
    container.style.maxWidth = "800px";
    container.style.margin = "0 auto";
    container.style.backgroundColor = "#FFFFFF";
    container.innerHTML = `
      <h1 style="font-size:28px; margin-bottom:8px;">${state.lang === 'el' ? GUIDE_DATA.el.title : GUIDE_DATA.en.title}</h1>
      <p style="color:#5A6270; font-size:14px; margin-bottom:24px;">aitools4kids.gr</p>
      ${clone.innerHTML}
      <p style="margin-top:40px; font-size:12px; color:#9AA1B0; border-top:1px solid #E4E6EA; padding-top:16px; text-align:center;">
        Ανεξάρτητο έργο. Δεν σχετίζεται με κανέναν οργανισμό ή προμηθευτή AI εργαλείων.
      </p>
    `;

    document.body.appendChild(container);

    const opt = {
      margin:        [0.5, 0.5, 0.5, 0.5],
      filename:      state.lang === 'el' ? 'odigos-ai-2026.pdf' : 'ai-guide-2026.pdf',
      image:         { type: 'jpeg', quality: 0.98 },
      html2canvas:   { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:         { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(container).save().then(() => {
      document.body.removeChild(container);
      if (btn) {
        btn.textContent = "📄 Κατέβασε τον οδηγό σε PDF";
        btn.disabled = false;
      }
    }).catch((err) => {
      console.error(err);
      document.body.removeChild(container);
      if (btn) {
        btn.textContent = "📄 Κατέβασε τον οδηγό σε PDF";
        btn.disabled = false;
      }
      alert("Προέκυψε σφάλμα κατά τη δημιουργία του PDF. Δοκίμασε ξανά.");
    });
  }

  // ---------- Rendering: Prompt Generator ----------
  function renderPromptList() {
    const zonePrompts = (typeof PROMPTS !== "undefined" && PROMPTS[state.currentZone]) || [];
    els.promptList.innerHTML = "";
    if (!zonePrompts.length) {
      els.promptList.innerHTML = `<div class="empty-state">${t("promptsEmptyState")}</div>`;
      return;
    }
    zonePrompts.forEach((prompt) => {
      const subject = state.lang === "el" ? prompt.subjectEl : prompt.subjectEn;
      const taskType = state.lang === "el" ? prompt.taskTypeEl : prompt.taskTypeEn;
      const promptText = state.lang === "el" ? prompt.promptTextEl : prompt.promptTextEn;
      const tip = state.lang === "el" ? prompt.tipEl : prompt.tipEn;
      const card = document.createElement("article");
      card.className = "prompt-card";
      card.innerHTML = `
        <div class="prompt-card__header">
          <span class="prompt-card__subject">${escapeHtml(subject)}</span>
          <span class="prompt-card__task-type">${escapeHtml(taskType)}</span>
        </div>
        <p class="prompt-card__text">${escapeHtml(promptText)}</p>
        ${tip ? `<p class="prompt-card__tip"><strong>${t("tipLabel")}:</strong> ${escapeHtml(tip)}</p>` : ""}
        <button type="button" class="prompt-card__copy">${t("copyPrompt")}</button>
      `;
      const copyBtn = card.querySelector(".prompt-card__copy");
      copyBtn.addEventListener("click", () => copyPromptToClipboard(promptText, copyBtn));
      els.promptList.appendChild(card);
    });
  }

  function copyPromptToClipboard(text, buttonEl) {
    const originalLabel = t("copyPrompt");
    const copiedLabel = t("copiedPrompt");
    const markCopied = () => {
      buttonEl.textContent = copiedLabel;
      buttonEl.classList.add("copied");
      setTimeout(() => {
        buttonEl.textContent = originalLabel;
        buttonEl.classList.remove("copied");
      }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(markCopied).catch(() => {
        fallbackCopy(text);
        markCopied();
      });
    } else {
      fallbackCopy(text);
      markCopied();
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand("copy"); } catch (err) {}
    document.body.removeChild(textarea);
  }

  // ---------- Quiz functions ----------

  // Πόσες ερωτήσεις δείχνουμε ανά προσπάθεια, αν η "δεξαμενή" ερωτήσεων του
  // quiz είναι μεγαλύτερη. Αν η δεξαμενή έχει λιγότερες, δείχνουμε όλες.
  const QUIZ_QUESTIONS_PER_ATTEMPT = 6;

  // Fisher-Yates shuffle — δεν πειράζει τον αρχικό πίνακα, επιστρέφει νέο.
  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Διαλέγει τυχαίο υποσύνολο ερωτήσεων από τη δεξαμενή του quiz για τη
  // ΤΡΕΧΟΥΣΑ προσπάθεια. Καλείται τόσο στην εκκίνηση όσο και στο "Ξανακάνε
  // το κουίζ", ώστε κάθε προσπάθεια να δείχνει διαφορετικό, ή έστω
  // διαφορετικά διατεταγμένο, σύνολο ερωτήσεων.
  function startQuizSession(quiz) {
    const pool = (quiz && quiz.questions) || [];
    const shuffled = shuffleArray(pool);
    state.quizSessionQuestions = shuffled.slice(0, Math.min(QUIZ_QUESTIONS_PER_ATTEMPT, shuffled.length));
  }

  // Το intro κειμενο κάθε quiz (π.χ. "4 σύντομες ερωτήσεις...") γράφτηκε όταν
  // κάθε quiz είχε σταθερό αριθμό ερωτήσεων. Τώρα ο αριθμός που πραγματικά
  // φαίνεται είναι δυναμικός (Math.min(QUIZ_QUESTIONS_PER_ATTEMPT, pool.length)),
  // οπότε διορθώνουμε το πρώτο ψηφίο μέσα στο κείμενο ώστε να ταιριάζει πάντα με
  // την πραγματικότητα, χωρίς να χρειάζεται να ξαναγράφουμε το κείμενο σε κάθε quiz.
  function getDynamicIntro(quiz) {
    const rawIntro = state.lang === "el" ? quiz.introEl : quiz.introEn;
    if (!rawIntro) return rawIntro;
    const actualCount = Math.min(QUIZ_QUESTIONS_PER_ATTEMPT, (quiz.questions || []).length);
    return rawIntro.replace(/^\d+(?=\s*(σύντομες|short))/, String(actualCount));
  }

  function resetQuizState() {
    state.quizGradeId = null;
    state.quizSubjectId = null;
    state.quizCurrentIndex = 0;
    state.quizAnswers = [];
    state.quizFinished = false;
    state.quizSessionQuestions = [];
    resetParentQuizState();
  }

  function resetParentQuizState() {
    state.parentQuizActive = false;
    state.parentQuizIndex = 0;
    state.parentQuizAnswers = [];
    state.parentQuizFinished = false;
    state.childScorePercent = null;
  }

  function getZoneQuizzes() {
    return (typeof QUIZZES !== "undefined" && QUIZZES[state.currentZone]) || null;
  }

  function getZoneGrades() {
    return (typeof GRADES !== "undefined" && GRADES[state.currentZone]) || [];
  }

  // Μέγιστη ηλικία ανά ζώνη — χρησιμοποιείται σαν ασφαλιστική δικλείδα ώστε
  // καμία πρόταση εργαλείου σε αποτέλεσμα κουίζ να μην ξεπερνά την ηλικία της ζώνης,
  // ΟΤΑΝ ο τρέχων ρόλος είναι "μαθητής" (το εργαλείο θα το χρησιμοποιήσει το ίδιο το παιδί).
  // Όταν ο ρόλος είναι "guardian" (γονιός/εκπαιδευτικός), το φίλτρο δεν ισχύει: ο ενήλικας
  // είναι αυτός που θα δει/χρησιμοποιήσει το εργαλείο (π.χ. να ρωτήσει το ChatGPT πώς να
  // εξηγήσει μια έννοια στο παιδί του), όχι το παιδί απευθείας, οπότε η ηλικία του παιδιού
  // δεν είναι το σχετικό όριο εδώ.
  const ZONE_MAX_AGE = { primary: 12, middle: 15, high: 18 };

  function isToolAgeAppropriate(tool) {
    if (!tool) return false;
    if (state.currentRole === "guardian") return true;
    const maxAge = ZONE_MAX_AGE[state.currentZone];
    if (maxAge === undefined || tool.minAge === undefined) return true;
    return tool.minAge <= maxAge;
  }

  function renderQuizView() {
    if (state.parentQuizActive) {
      renderParentQuizView();
      return;
    }
    const zoneQuizzes = getZoneQuizzes();
    const subjectIds = zoneQuizzes ? Object.keys(zoneQuizzes) : [];
    if (!subjectIds.length) {
      els.quizContent.innerHTML = `<div class="empty-state">${t("quizEmptyState")}</div>`;
      return;
    }
    if (!state.quizGradeId) {
      renderQuizGradePicker(zoneQuizzes);
      return;
    }
    if (!state.quizSubjectId) {
      const gradeSubjectIds = subjectIds.filter((sid) => (zoneQuizzes[sid].grades || []).includes(state.quizGradeId));
      renderQuizSubjectPicker(zoneQuizzes, gradeSubjectIds);
      return;
    }
    const quiz = zoneQuizzes[state.quizSubjectId];
    if (!quiz) {
      const gradeSubjectIds = subjectIds.filter((sid) => (zoneQuizzes[sid].grades || []).includes(state.quizGradeId));
      renderQuizSubjectPicker(zoneQuizzes, gradeSubjectIds);
      return;
    }
    if (state.quizFinished) {
      renderQuizResults(quiz);
    } else {
      renderQuizQuestion(quiz);
    }
  }

  function renderQuizGradePicker(zoneQuizzes) {
    const grades = getZoneGrades();
    const cards = grades.map((grade) => {
      const label = state.lang === "el" ? grade.labelEl : grade.labelEn;
      const hasContent = Object.values(zoneQuizzes).some((q) => (q.grades || []).includes(grade.id));
      const comingSoonBadge = hasContent ? "" : `<span class="quiz-grade-card__badge">${t("quizGradeComingSoon")}</span>`;
      return `
        <button type="button" class="quiz-grade-card${hasContent ? "" : " quiz-grade-card--soon"}" data-grade-id="${escapeAttr(grade.id)}">
          <span class="quiz-grade-card__label">${escapeHtml(label)}</span>
          ${comingSoonBadge}
        </button>
      `;
    }).join("");
    els.quizContent.innerHTML = `<p class="quiz-pick-heading">${t("quizPickGrade")}</p><div class="quiz-grade-grid">${cards}</div>`;
    els.quizContent.querySelectorAll(".quiz-grade-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.quizGradeId = btn.dataset.gradeId;
        state.quizSubjectId = null;
        renderQuizView();
      });
    });
  }

  function renderQuizSubjectPicker(zoneQuizzes, subjectIds) {
    const backBtnHtml = `<button type="button" class="quiz-grade-back-btn" id="quizBackToGradesBtn">${t("quizBackToGrades")}</button>`;
    if (!subjectIds.length) {
      els.quizContent.innerHTML = `${backBtnHtml}<div class="empty-state">${t("quizGradeEmptyState")}</div>`;
      const backBtn = document.getElementById("quizBackToGradesBtn");
      if (backBtn) {
        backBtn.addEventListener("click", () => {
          state.quizGradeId = null;
          renderQuizView();
        });
      }
      return;
    }
    const cards = subjectIds.map((sid) => {
      const q = zoneQuizzes[sid];
      const subjectLabel = state.lang === "el" ? q.subjectLabelEl : q.subjectLabelEn;
      const title = state.lang === "el" ? q.titleEl : q.titleEn;
      const intro = getDynamicIntro(q);
      return `
        <article class="quiz-subject-card">
          <p class="quiz-subject-card__subject">${escapeHtml(subjectLabel)}</p>
          <p class="quiz-subject-card__title">${escapeHtml(title)}</p>
          <p class="quiz-subject-card__intro">${escapeHtml(intro)}</p>
          <button type="button" class="quiz-start-btn" data-subject-id="${escapeAttr(sid)}">${t("quizStartBtn")}</button>
        </article>
      `;
    }).join("");
    els.quizContent.innerHTML = `${backBtnHtml}<p class="quiz-pick-heading">${t("quizPickSubject")}</p><div class="quiz-subject-grid">${cards}</div>`;
    const backBtn = document.getElementById("quizBackToGradesBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        state.quizGradeId = null;
        renderQuizView();
      });
    }
    els.quizContent.querySelectorAll(".quiz-start-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.quizSubjectId = btn.dataset.subjectId;
        state.quizCurrentIndex = 0;
        state.quizAnswers = [];
        state.quizFinished = false;
        startQuizSession(zoneQuizzes[state.quizSubjectId]);
        renderQuizView();
      });
    });
  }

  function renderQuizQuestion(quiz) {
    const sessionQuestions = state.quizSessionQuestions;
    const question = sessionQuestions[state.quizCurrentIndex];
    const questionText = state.lang === "el" ? question.textEl : question.textEn;
    const total = sessionQuestions.length;
    const current = state.quizCurrentIndex + 1;
    const optionsHtml = question.options.map((opt, idx) => {
      const label = state.lang === "el" ? opt.textEl : opt.textEn;
      return `<button type="button" class="quiz-option" data-option-index="${idx}">${escapeHtml(label)}</button>`;
    }).join("");
    els.quizContent.innerHTML = `
      <div class="quiz-progress">${t("quizQuestionOf", { current, total })}</div>
      <p class="quiz-question-text">${escapeHtml(questionText)}</p>
      <div class="quiz-options">${optionsHtml}</div>
    `;
    els.quizContent.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.optionIndex);
        const chosen = question.options[idx];
        state.quizAnswers.push({
          questionId: question.id,
          gapTag: chosen.isCorrect ? null : chosen.gapTag || null,
        });
        if (state.quizCurrentIndex < sessionQuestions.length - 1) {
          state.quizCurrentIndex += 1;
          renderQuizQuestion(quiz);
        } else {
          state.quizFinished = true;
          renderQuizView();
        }
      });
    });
  }

  function renderQuizResults(quiz) {
    const gapTagIds = [...new Set(state.quizAnswers.map((a) => a.gapTag).filter(Boolean))];
    let gapsHtml = "";
    if (!gapTagIds.length) {
      gapsHtml = `<p class="quiz-all-correct">${t("quizAllCorrect")}</p>`;
    } else {
      const gapCards = gapTagIds.map((tagId) => {
        const gap = (typeof GAP_TAGS !== "undefined" && GAP_TAGS[tagId]) || null;
        if (!gap) return "";
        const label = state.lang === "el" ? gap.labelEl : gap.labelEn;
        const explain = state.lang === "el" ? gap.explainEl : gap.explainEn;
        const zoneMax = ZONE_MAX_AGE[state.currentZone];

        function renderToolBlock(tool) {
          const desc = state.lang === "el" ? tool.shortDescEl : tool.shortDescEn;
          return `
            <div class="quiz-tool-block" style="margin-bottom: 12px;">
              <a class="quiz-tool-chip" href="${escapeAttr(tool.url || "#")}" target="_blank" rel="noopener noreferrer">${escapeHtml(tool.name)}</a>
              ${desc ? `<p class="quiz-tool-howto" style="margin: 4px 0 0; font-size: 0.85rem; color: var(--color-text-muted);">${escapeHtml(desc)}</p>` : ""}
            </div>
          `;
        }

        // Χωρίζουμε σε: (α) εργαλεία κατάλληλα για την ίδια τη ζώνη ηλικίας (φαίνονται πάντα),
        // (β) εργαλεία που φαίνονται ΜΟΝΟ επειδή ο ρόλος είναι "guardian" (π.χ. ChatGPT σε ζώνη
        // Δημοτικού). Ο ρόλος είναι αυτο-δηλωμένος και ανεπαλήθευτος — ένα παιδί θα μπορούσε να
        // πατήσει το tab "Γονιός" με ένα κλικ — οπότε τα (β) ΔΕΝ εμφανίζονται αυτόματα μαζί με τα
        // υπόλοιπα, αλλά μέσα σε ένα κλειστό-από-προεπιλογή <details>, ώστε να χρειάζεται ένα
        // ξεχωριστό, ξεκάθαρα διατυπωμένο κλικ για να φανούν.
        const regularTools = [];
        const adultOnlyTools = [];
        (gap.recommendedToolIds || []).forEach((toolId) => {
          const tool = TOOLS[toolId];
          if (!tool || !isToolAgeAppropriate(tool)) return;
          const isAdultOnlyHere =
            state.currentRole === "guardian" &&
            zoneMax !== undefined &&
            tool.minAge !== undefined &&
            tool.minAge > zoneMax;
          if (isAdultOnlyHere) adultOnlyTools.push(tool);
          else regularTools.push(tool);
        });

        const regularToolsHtml = regularTools.map(renderToolBlock).join("");
        const adultSummaryText = state.lang === "el"
          ? `Δες προτάσεις και για εσένα (${adultOnlyTools.length}) — όχι για το παιδί`
          : `Show suggestions for you too (${adultOnlyTools.length}) — not for the child`;
        const adultToolsHtml = adultOnlyTools.length
          ? `
            <details class="quiz-tool-adult-details" style="margin-top: 10px;">
              <summary style="cursor: pointer; font-size: 0.85rem; color: var(--color-accent); font-weight: 600;">${escapeHtml(adultSummaryText)}</summary>
              <div style="margin-top: 10px;">${adultOnlyTools.map(renderToolBlock).join("")}</div>
            </details>
          `
          : "";
        const toolsHtml = regularToolsHtml + adultToolsHtml;
        const hasPath = typeof LEARNING_PATHS !== "undefined" && LEARNING_PATHS[tagId];
        return `
          <article class="quiz-gap-card">
            <p class="quiz-gap-card__label">${escapeHtml(label)}</p>
            <p class="quiz-gap-card__explain">${escapeHtml(explain)}</p>
            ${toolsHtml ? `<p class="quiz-gap-card__tools-label">${t("quizRecommendedTools")}</p><div class="quiz-tool-chips">${toolsHtml}</div>` : ""}
            ${hasPath ? `<button type="button" class="path-view-btn" data-gap-id="${escapeAttr(tagId)}">${t("pathViewBtn")}</button>` : ""}
          </article>
        `;
      }).join("");
      gapsHtml = `<p class="quiz-gaps-found-label">${t("quizGapsFound")}</p><div class="quiz-gap-grid">${gapCards}</div>`;
    }

    // Υπολογισμός % επιτυχίας παιδιού (για τη σύγκριση με το Parent Quiz)
    const childTotal = state.quizSessionQuestions.length;
    const childCorrect = childTotal - gapTagIds.length >= 0
      ? state.quizAnswers.filter((a) => !a.gapTag).length
      : 0;
    state.childScorePercent = childTotal ? Math.round((childCorrect / childTotal) * 100) : null;

    // Achievement card (SVG)
    const svgCard = renderAchievementCard(gapTagIds);
    const encodedSvg = encodeURIComponent(svgCard);
    const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodedSvg;

    els.quizContent.innerHTML = `
      <h3 class="quiz-results-title">${t("quizResultsTitle")}</h3>
      ${gapsHtml}
      <div class="quiz-achievement-section" style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #E4E6EA;">
        <h4 style="font-size: 1rem; font-weight: 700; margin: 0 0 12px; color: var(--color-text-muted);">
          🏅 ${state.lang === 'el' ? 'Η Κάρτα Σου' : 'Your Card'}
        </h4>
        <div style="max-width: 400px; margin: 0 auto;">
          <img src="${svgDataUrl}" alt="Achievement Card" style="width:100%; height:auto; border-radius:12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" />
          <div style="display:flex; gap:10px; margin-top:14px; flex-wrap:wrap; justify-content:center;">
            <button type="button" class="quiz-download-btn" style="border:none; background:var(--color-accent); color:#FFFFFF; font-size:0.88rem; font-weight:600; padding:10px 18px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px;">
              ⬇️ ${state.lang === 'el' ? 'Κατέβασε την κάρτα' : 'Download card'}
            </button>
            <button type="button" class="quiz-download-story-btn" style="border:1px solid var(--color-accent); background:transparent; color:var(--color-accent); font-size:0.88rem; font-weight:600; padding:10px 18px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px;">
              📱 ${t('quizDownloadStory')}
            </button>
            <button type="button" class="quiz-share-btn" style="border:1px solid var(--color-accent); background:transparent; color:var(--color-accent); font-size:0.88rem; font-weight:600; padding:10px 18px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px;">
              📤 ${state.lang === 'el' ? 'Μοιράσου τη' : 'Share it'}
            </button>
          </div>
        </div>
      </div>
      <div class="parent-quiz-cta" style="margin-top:28px; padding:20px; border-radius:12px; background:linear-gradient(135deg, rgba(59,130,196,0.08), rgba(76,175,125,0.08)); text-align:center;">
        <p style="font-weight:700; margin:0 0 6px;">${t('parentQuizCta')}</p>
        <p style="margin:0 0 14px; color:var(--color-text-muted); font-size:0.92rem;">${t('parentQuizCtaSub')}</p>
        <button type="button" class="parent-quiz-start-btn" style="border:none; background:var(--color-accent); color:#FFFFFF; font-size:0.9rem; font-weight:600; padding:10px 20px; border-radius:6px; cursor:pointer;">
          ${t('parentQuizStartBtn')}
        </button>
      </div>
      <div class="quiz-results-actions" style="margin-top:24px;">
        <button type="button" class="quiz-retake-btn">${t("quizRetakeBtn")}</button>
        <button type="button" class="quiz-back-btn">${t("quizBackToStart")}</button>
      </div>
    `;

    els.quizContent.querySelector('.quiz-download-btn').addEventListener('click', () => {
      downloadCardAsSquarePng(svgCard, 'aitools4kids-karta.png');
    });
    els.quizContent.querySelector('.quiz-download-story-btn').addEventListener('click', () => {
      downloadCardAsStoryPng(svgCard, 'aitools4kids-story.png');
    });
    els.quizContent.querySelector('.quiz-share-btn').addEventListener('click', () => shareCard(svgCard));
    els.quizContent.querySelector('.parent-quiz-start-btn').addEventListener('click', () => {
      state.parentQuizActive = true;
      state.parentQuizIndex = 0;
      state.parentQuizAnswers = [];
      state.parentQuizFinished = false;
      renderQuizView();
    });
    els.quizContent.querySelector('.quiz-retake-btn').addEventListener('click', () => {
      state.quizCurrentIndex = 0;
      state.quizAnswers = [];
      state.quizFinished = false;
      startQuizSession(quiz);
      renderQuizView();
    });
    els.quizContent.querySelector('.quiz-back-btn').addEventListener('click', () => {
      resetQuizState();
      renderQuizView();
    });
    els.quizContent.querySelectorAll('.path-view-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        openLearningPathModal(btn.dataset.gapId);
      });
    });
  }

  // ---------- Learning Paths (Μονοπάτια Μάθησης) ----------
  function openLearningPathModal(gapId) {
    if (typeof LEARNING_PATHS === "undefined") return;
    const steps = LEARNING_PATHS[gapId];
    const gap = (typeof GAP_TAGS !== "undefined" && GAP_TAGS[gapId]) || null;
    if (!steps || !gap) return;

    const label = state.lang === "el" ? gap.labelEl : gap.labelEn;

    const stepsHtml = steps.map((step, idx) => {
      const stepNum = idx + 1;
      const title = state.lang === "el" ? step.titleEl : step.titleEn;
      const desc = state.lang === "el" ? step.descriptionEl : step.descriptionEn;
      const tool = step.toolId ? TOOLS[step.toolId] : null;
      const toolLinkHtml = tool && tool.url
        ? `<a class="path-step__tool-link" href="${escapeAttr(tool.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(tool.name)} · ${t("pathOpenTool")}</a>`
        : "";
      return `
        <div class="path-step">
          <div class="path-step__number">${stepNum}</div>
          <div class="path-step__body">
            <p class="path-step__label">${t("pathStepLabel", { step: stepNum })}</p>
            <p class="path-step__title">${escapeHtml(title)}</p>
            <p class="path-step__desc">${escapeHtml(desc)}</p>
            ${toolLinkHtml}
          </div>
        </div>
      `;
    }).join("");

    els.pathModal.innerHTML = `
      <button type="button" class="path-modal__close" aria-label="${t("pathModalClose")}">✕</button>
      <p class="path-modal__eyebrow">${t("pathModalTitle")}</p>
      <h3 class="path-modal__title">${escapeHtml(label)}</h3>
      <p class="path-modal__intro">${t("pathModalIntro")}</p>
      <div class="path-steps">${stepsHtml}</div>
    `;
    els.pathModal.querySelector(".path-modal__close").addEventListener("click", closeLearningPathModal);
    els.pathModalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLearningPathModal() {
    els.pathModalOverlay.hidden = true;
    els.pathModal.innerHTML = "";
    document.body.style.overflow = "";
  }

  // ---------- Parent Quiz: rendering ----------
  function renderParentQuizView() {
    if (state.parentQuizFinished) {
      renderParentQuizResults();
      return;
    }
    renderParentQuizQuestion();
  }

  function renderParentQuizQuestion() {
    const data = PARENT_QUIZ[state.lang];
    const question = data.questions[state.parentQuizIndex];
    const total = data.questions.length;
    const current = state.parentQuizIndex + 1;
    const optionsHtml = question.options.map((opt, idx) => {
      return `<button type="button" class="quiz-option" data-option-index="${idx}">${escapeHtml(opt.text)}</button>`;
    }).join("");
    els.quizContent.innerHTML = `
      <p class="quiz-pick-heading">${t('parentQuizTitle')}</p>
      <div class="quiz-progress">${t("quizQuestionOf", { current, total })}</div>
      <p class="quiz-question-text">${escapeHtml(question.text)}</p>
      <div class="quiz-options">${optionsHtml}</div>
    `;
    els.quizContent.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.optionIndex);
        const chosen = question.options[idx];
        state.parentQuizAnswers.push({ questionId: question.id, correct: !!chosen.correct });
        if (state.parentQuizIndex < data.questions.length - 1) {
          state.parentQuizIndex += 1;
          renderParentQuizQuestion();
        } else {
          state.parentQuizFinished = true;
          renderQuizView();
        }
      });
    });
  }

  function renderParentQuizResults() {
    const data = PARENT_QUIZ[state.lang];
    const total = data.questions.length;
    const correct = state.parentQuizAnswers.filter((a) => a.correct).length;
    const parentPercent = Math.round((correct / total) * 100);
    const childPercent = state.childScorePercent;

    let messageKey = "parentQuizMsgTie";
    if (childPercent !== null) {
      if (childPercent > parentPercent) messageKey = "parentQuizMsgChildWins";
      else if (parentPercent > childPercent) messageKey = "parentQuizMsgParentWins";
    }

    const svgCard = renderComparisonCard(childPercent, parentPercent);
    const encodedSvg = encodeURIComponent(svgCard);
    const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodedSvg;

    els.quizContent.innerHTML = `
      <h3 class="quiz-results-title">${t('parentQuizResultsTitle')}</h3>
      <p style="text-align:center; margin:0 0 18px;">${t('parentQuizCorrectOf', { correct, total })}</p>
      <p style="text-align:center; max-width:480px; margin:0 auto 20px; color:var(--color-text-muted);">${t(messageKey)}</p>
      <div style="max-width: 400px; margin: 0 auto;">
        <img src="${svgDataUrl}" alt="Comparison Card" style="width:100%; height:auto; border-radius:12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" />
        <div style="display:flex; gap:10px; margin-top:14px; flex-wrap:wrap; justify-content:center;">
          <button type="button" class="parent-quiz-download-btn" style="border:none; background:var(--color-accent); color:#FFFFFF; font-size:0.88rem; font-weight:600; padding:10px 18px; border-radius:6px; cursor:pointer;">
            ⬇️ ${state.lang === 'el' ? 'Κατέβασε την κάρτα' : 'Download card'}
          </button>
          <button type="button" class="parent-quiz-download-story-btn" style="border:1px solid var(--color-accent); background:transparent; color:var(--color-accent); font-size:0.88rem; font-weight:600; padding:10px 18px; border-radius:6px; cursor:pointer;">
            📱 ${t('quizDownloadStory')}
          </button>
          <button type="button" class="parent-quiz-share-btn" style="border:1px solid var(--color-accent); background:transparent; color:var(--color-accent); font-size:0.88rem; font-weight:600; padding:10px 18px; border-radius:6px; cursor:pointer;">
            📤 ${t('parentQuizShareCta')}
          </button>
        </div>
      </div>
      <div class="quiz-results-actions" style="margin-top:24px;">
        <button type="button" class="parent-quiz-retake-btn">${t('parentQuizRetake')}</button>
        <button type="button" class="parent-quiz-back-btn">${t('parentQuizBack')}</button>
      </div>
    `;

    els.quizContent.querySelector('.parent-quiz-download-btn').addEventListener('click', () => {
      downloadCardAsSquarePng(svgCard, 'aitools4kids-sygrisi.png');
    });
    els.quizContent.querySelector('.parent-quiz-download-story-btn').addEventListener('click', () => {
      downloadCardAsStoryPng(svgCard, 'aitools4kids-sygrisi-story.png');
    });
    els.quizContent.querySelector('.parent-quiz-share-btn').addEventListener('click', () => shareCard(svgCard));
    els.quizContent.querySelector('.parent-quiz-retake-btn').addEventListener('click', () => {
      state.parentQuizIndex = 0;
      state.parentQuizAnswers = [];
      state.parentQuizFinished = false;
      renderQuizView();
    });
    els.quizContent.querySelector('.parent-quiz-back-btn').addEventListener('click', () => {
      resetParentQuizState();
      renderQuizView();
    });
  }

  // ---------- Achievement Card (SVG) ----------
  function renderAchievementCard(gapTagIds) {
    const gaps = gapTagIds.map(id => GAP_TAGS[id]).filter(Boolean);
    const isGreek = state.lang === "el";
    let titles = gaps.map(g => isGreek ? g.achievementEl : g.achievementEn);
    let skillTags = gaps.map(g => isGreek ? g.skillTagEl : g.skillTagEn);
    let positiveMessages = gaps.map(g => isGreek ? g.positiveMessageEl : g.positiveMessageEn);
    let toolNames = [...new Set(gaps.map(g => {
      const toolId = g.recommendedToolIds?.[0];
      return toolId ? TOOLS[toolId]?.name : '';
    }).filter(Boolean))];

    if (!titles.length) {
      titles = isGreek ? ["Ο Ολοκληρωμένος Μαθητής"] : ["The Complete Student"];
      skillTags = isGreek ? ["Όλες οι δεξιότητες σε καλό επίπεδο"] : ["All skills at a good level"];
      positiveMessages = isGreek ? ["Συνέχισε έτσι!"] : ["Keep it up!"];
      toolNames = [];
    }

    // Αν βρέθηκαν πολλά gaps, δείχνουμε μόνο τον 1ο τίτλο + μετρητή, ώστε να μη
    // ξεχειλίζει η κάρτα (τα υπόλοιπα gaps φαίνονται ήδη στις κάρτες από πάνω).
    const extraCount = titles.length - 1;
    let titleText = titles[0];
    if (extraCount > 0) {
      titleText += isGreek ? ` +${extraCount} ακόμα` : ` +${extraCount} more`;
    }
    if (titleText.length > 34) titleText = titleText.slice(0, 31) + '...';
    const titleFontSize = titleText.length > 28 ? 14 : titleText.length > 20 ? 17 : 22;

    let skillText = skillTags.slice(0, 2).join(' + ');
    if (skillText.length > 46) skillText = skillText.slice(0, 43) + '...';

    const messageText = positiveMessages[0] || (isGreek ? 'Συνέχισε έτσι!' : 'Keep it up!');
    let toolText = toolNames.length
      ? (isGreek ? '💡 Εξασκήσου με: ' : '💡 Practice with: ') + toolNames.join(', ')
      : (isGreek ? '💡 Συνέχισε την εξάσκηση!' : '💡 Keep practicing!');
    if (toolText.length > 52) toolText = toolText.slice(0, 49) + '...';
    const emoji = gaps.length ? '🌟' : '🏆';
    const accentColor = gaps.length ? '#4CAF7D' : '#3B82C4';

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
        <rect width="400" height="500" rx="24" fill="#F8F9FA" stroke="#E4E6EA" stroke-width="2"/>
        <rect width="400" height="6" rx="3" fill="${accentColor}"/>
        <text x="200" y="70" font-size="48" text-anchor="middle">${emoji}</text>
        <text x="200" y="120" font-size="${titleFontSize}" font-weight="700" fill="#1F2430" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">${escapeHtml(titleText)}</text>
        <text x="200" y="160" font-size="14" fill="#5A6270" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">${escapeHtml(messageText)}</text>
        <line x1="60" y1="185" x2="340" y2="185" stroke="#E4E6EA" stroke-width="1"/>
        <text x="200" y="220" font-size="13" font-weight="600" fill="${accentColor}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">${isGreek ? '🔥 Δύναμη: ' : '🔥 Strength: '}${escapeHtml(skillText)}</text>
        <text x="200" y="260" font-size="13" fill="#5A6270" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">${escapeHtml(toolText)}</text>
        <line x1="60" y1="310" x2="340" y2="310" stroke="#E4E6EA" stroke-width="1"/>
        <text x="200" y="345" font-size="12" fill="#9AA1B0" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">aitools4kids.gr  🤖</text>
      </svg>
    `;
  }

  // ---------- Comparison Card (SVG) — Γονιός vs Παιδί ----------
  function renderComparisonCard(childPercent, parentPercent) {
    const isGreek = state.lang === "el";
    const childLabel = t('parentQuizChildLabel');
    const parentLabel = t('parentQuizYouLabel');
    const childVal = childPercent === null ? 0 : childPercent;
    const parentVal = parentPercent === null ? 0 : parentPercent;
    const barMaxWidth = 260;
    const childBarWidth = Math.max(4, Math.round((childVal / 100) * barMaxWidth));
    const parentBarWidth = Math.max(4, Math.round((parentVal / 100) * barMaxWidth));
    const winnerColor = childVal >= parentVal ? '#4CAF7D' : '#3B82C4';

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
        <rect width="400" height="500" rx="24" fill="#F8F9FA" stroke="#E4E6EA" stroke-width="2"/>
        <rect width="400" height="6" rx="3" fill="${winnerColor}"/>
        <text x="200" y="70" font-size="42" text-anchor="middle">🧑‍🤝‍🧑</text>
        <text x="200" y="118" font-size="20" font-weight="700" fill="#1F2430" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">${isGreek ? 'Γονιός εναντίον Παιδιού' : 'Parent vs Child'}</text>
        <line x1="60" y1="150" x2="340" y2="150" stroke="#E4E6EA" stroke-width="1"/>

        <text x="70" y="195" font-size="14" font-weight="600" fill="#1F2430" font-family="system-ui, -apple-system, sans-serif">${escapeHtml(childLabel)}</text>
        <rect x="70" y="205" width="${barMaxWidth}" height="22" rx="11" fill="#E4E6EA"/>
        <rect x="70" y="205" width="${childBarWidth}" height="22" rx="11" fill="#4CAF7D"/>
        <text x="340" y="221" font-size="14" font-weight="700" fill="#4CAF7D" text-anchor="end" font-family="system-ui, -apple-system, sans-serif">${childVal}%</text>

        <text x="70" y="265" font-size="14" font-weight="600" fill="#1F2430" font-family="system-ui, -apple-system, sans-serif">${escapeHtml(parentLabel)}</text>
        <rect x="70" y="275" width="${barMaxWidth}" height="22" rx="11" fill="#E4E6EA"/>
        <rect x="70" y="275" width="${parentBarWidth}" height="22" rx="11" fill="#3B82C4"/>
        <text x="340" y="291" font-size="14" font-weight="700" fill="#3B82C4" text-anchor="end" font-family="system-ui, -apple-system, sans-serif">${parentVal}%</text>

        <line x1="60" y1="330" x2="340" y2="330" stroke="#E4E6EA" stroke-width="1"/>
        <text x="200" y="365" font-size="12" fill="#5A6270" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">${isGreek ? 'Learning Compass' : 'Learning Compass'}</text>
        <text x="200" y="345" font-size="12" fill="#9AA1B0" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">aitools4kids.gr  🤖</text>
      </svg>
    `;
  }

  // ---------- PNG export (κάρτα + comparison), 2 μεγέθη: post / story ----------
  function svgToPngDataUrl(svgMarkup, targetWidth, targetHeight, drawFn) {
    return new Promise((resolve, reject) => {
      const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        drawFn(ctx, img, targetWidth, targetHeight);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = (err) => { URL.revokeObjectURL(url); reject(err); };
      img.src = url;
    });
  }

  function downloadDataUrl(dataUrl, filename) {
    // Blob + object URL είναι πιο αξιόπιστο από raw data: URL στο iOS Safari,
    // όπου το attribute "download" σε data: URLs συχνά αγνοείται.
    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      })
      .catch(() => {
        // Fallback: απευθείας data URL αν κάτι πάει στραβά με το blob conversion.
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }

  function generateSquareCardDataUrl(svgMarkup) {
    return svgToPngDataUrl(svgMarkup, 1080, 1080, (ctx, img, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#3B82C4');
      grad.addColorStop(1, '#4CAF7D');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      const cardW = 800, cardH = 1000;
      ctx.drawImage(img, (w - cardW) / 2, (h - cardH) / 2, cardW, cardH);
    });
  }

  function downloadCardAsSquarePng(svgMarkup, filename) {
    generateSquareCardDataUrl(svgMarkup)
      .then((dataUrl) => downloadDataUrl(dataUrl, filename || 'aitools4kids-karta.png'))
      .catch(() => alert(state.lang === 'el' ? 'Κάτι πήγε στραβά. Δοκίμασε ξανά.' : 'Something went wrong. Try again.'));
  }

  function downloadCardAsStoryPng(svgMarkup, filename) {
    svgToPngDataUrl(svgMarkup, 1080, 1920, (ctx, img, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#3B82C4');
      grad.addColorStop(1, '#4CAF7D');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      const cardW = 880, cardH = 1100;
      ctx.drawImage(img, (w - cardW) / 2, (h - cardH) / 2, cardW, cardH);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 34px system-ui, -apple-system, sans-serif';
      ctx.fillText(state.lang === 'el' ? 'Δοκίμασε το κι εσύ 👇' : 'Try it yourself 👇', w / 2, h - 140);
      ctx.font = '400 28px system-ui, -apple-system, sans-serif';
      ctx.fillText('aitools4kids.gr', w / 2, h - 90);
    }).then((dataUrl) => downloadDataUrl(dataUrl, filename || 'aitools4kids-story.png'))
      .catch(() => alert(state.lang === 'el' ? 'Κάτι πήγε στραβά. Δοκίμασε ξανά.' : 'Something went wrong. Try again.'));
  }

  function downloadSVG(svgData, filename) {
    const blob = new Blob([decodeURIComponent(svgData)], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function shareCard(svgMarkup) {
    // Προσπάθησε πρώτα να μοιράσεις την ίδια την εικόνα (Web Share API Level 2).
    // Υποστηρίζεται στα περισσότερα σύγχρονα mobile browsers, iOS και Android.
    if (svgMarkup && navigator.canShare) {
      generateSquareCardDataUrl(svgMarkup)
        .then((dataUrl) => fetch(dataUrl))
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'aitools4kids-karta.png', { type: 'image/png' });
          const shareData = {
            files: [file],
            title: state.lang === 'el' ? 'Η κάρτα επίτευγμά μου' : 'My achievement card',
            text: state.lang === 'el'
              ? 'Ανακάλυψα τις δυνάμεις μου με το aitools4kids! 👉 https://www.aitools4kids.gr'
              : 'I discovered my strengths with aitools4kids! 👉 https://www.aitools4kids.gr',
          };
          if (navigator.canShare(shareData)) {
            return navigator.share(shareData);
          }
          throw new Error('files not shareable');
        })
        .catch(() => shareLinkOnly());
      return;
    }
    shareLinkOnly();
  }

  function shareLinkOnly() {
    if (navigator.share) {
      navigator.share({
        title: state.lang === 'el' ? 'Η κάρτα επίτευγμά μου' : 'My achievement card',
        text: state.lang === 'el' ? 'Ανακάλυψα τις δυνάμεις μου με το aitools4kids!' : 'I discovered my strengths with aitools4kids!',
        url: 'https://www.aitools4kids.gr'
      }).catch(() => fallbackShare());
    } else {
      fallbackShare();
    }
  }

  function fallbackShare() {
    navigator.clipboard.writeText('https://www.aitools4kids.gr')
      .then(() => alert('📋 Αντιγράφηκε το link! Μοιράσου το με τους φίλους σου.'))
      .catch(() => prompt('Αντέγραψε αυτό το link:', 'https://www.aitools4kids.gr'));
  }

  function shareToolCard(tool, useCase, buttonEl) {
    const siteUrl = "https://www.aitools4kids.gr";
    const text = state.lang === "el"
      ? `${tool.name}${useCase ? `: ${useCase}` : ""}\n${tool.url || ""}\nΒρέθηκε στο ${siteUrl}`
      : `${tool.name}${useCase ? `: ${useCase}` : ""}\n${tool.url || ""}\nFound via ${siteUrl}`;
    const shareData = {
      title: tool.name,
      text,
      url: siteUrl,
    };
    const markShared = () => {
      if (!buttonEl) return;
      const original = buttonEl.textContent;
      buttonEl.textContent = "✅ " + t("shareToolCopied");
      setTimeout(() => { buttonEl.textContent = original; }, 1800);
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => copyToolShareText(text, markShared));
    } else {
      copyToolShareText(text, markShared);
    }
  }

  function copyToolShareText(text, onDone) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onDone).catch(() => {
        prompt(state.lang === "el" ? "Αντέγραψε αυτό το κείμενο:" : "Copy this text:", text);
        onDone();
      });
    } else {
      prompt(state.lang === "el" ? "Αντέγραψε αυτό το κείμενο:" : "Copy this text:", text);
      onDone();
    }
  }

  // ---------- Helpers ----------
  function getFaviconUrl(tool) {
    // Αν υπάρχει χειροκίνητα ορισμένο logo, αυτό έχει προτεραιότητα.
    if (tool.logo) return tool.logo;
    if (!tool.url) return null;
    try {
      const domain = new URL(tool.url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (err) {
      return null;
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
  }

  // ---------- Routing (deep links: /{zone}/{role}/{view}) ----------
  const VALID_VIEWS = ["tools", "advanced", "prompts", "quiz", "guide"];

  function routePath(zoneId, roleId, viewId) {
    return `/${zoneId}/${roleId}/${viewId}`;
  }

  function pushRoute() {
    if (!state.currentZone) return;
    const path = routePath(state.currentZone, state.currentRole, state.currentView);
    if (location.pathname === path) return; // avoid duplicate history entries
    history.pushState(
      { zone: state.currentZone, role: state.currentRole, view: state.currentView },
      "",
      path
    );
  }

  // Διαβάζει το URL και ενημερώνει το state, ΧΩΡΙΣ να ξαναγράψει το URL
  // (χρησιμοποιείται στο αρχικό load και στο popstate/back-button).
  function restoreStateFromPath(pathname) {
    const parts = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
    const [zoneId, roleId, viewId] = parts;
    const zoneOk = ZONES.some((z) => z.id === zoneId);
    if (!zoneOk) {
      state.currentZone = null;
      return;
    }
    state.currentZone = zoneId;
    state.currentRole = ROLES.some((r) => r.id === roleId) ? roleId : "guardian";
    state.currentView = VALID_VIEWS.includes(viewId) ? viewId : "tools";
    state.currentSubject = null;
    resetQuizState();
  }

  // Ζωγραφίζει ό,τι χρειάζεται με βάση το ΤΡΕΧΟΝ state.
  // Δεν αγγίζει το URL — αυτό το κάνει ξεχωριστά το pushRoute().
  function renderCurrentRoute() {
    if (!state.currentZone) {
      els.pathView.hidden = true;
      els.zoneSelectView.hidden = false;
      updateDocumentTitle();
      return;
    }
    els.zoneSelectView.hidden = true;
    els.pathView.hidden = false;

    const zone = ZONES.find((z) => z.id === state.currentZone);
    if (zone) {
      const zoneLabel = state.lang === "el" ? zone.labelEl : zone.labelEn;
      const zoneAge = state.lang === "el" ? zone.ageRangeEl : zone.ageRangeEn;
      els.pathZoneHeading.textContent = `${zone.icon} ${zoneLabel} (${zoneAge})`;
    }

    renderRoleTabs();
    renderSubjectFilter();
    renderPathContent();
    renderAdvancedTools();
    renderViewTabs();
    renderPromptList();
    if (state.currentView === "quiz") renderQuizView();
    if (state.currentView === "guide") renderGuide();
    updateDocumentTitle();
  }

  function updateDocumentTitle() {
    const base = "AI Tools for Family, Kids & Students";
    if (!state.currentZone) {
      document.title = `${t("heroTitle")} · ${base}`;
      return;
    }
    const zone = ZONES.find((z) => z.id === state.currentZone);
    const zoneLabel = zone ? (state.lang === "el" ? zone.labelEl : zone.labelEn) : "";
    const viewKey = "viewTab" + state.currentView.charAt(0).toUpperCase() + state.currentView.slice(1);
    document.title = `${zoneLabel} · ${t(viewKey)} · ${base}`;
  }

  // ---------- Navigation ----------
  function selectZone(zoneId) {
    state.currentZone = zoneId;
    state.currentRole = "guardian";
    state.currentSubject = null;
    state.currentView = "tools";
    resetQuizState();
    pushRoute();
    renderCurrentRoute();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectZoneQuiz(zoneId) {
    state.currentZone = zoneId;
    state.currentRole = "guardian";
    state.currentSubject = null;
    state.currentView = "quiz";
    resetQuizState();
    pushRoute();
    renderCurrentRoute();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectRole(roleId) {
    state.currentRole = roleId;
    pushRoute();
    renderCurrentRoute();
  }

  function selectView(viewId) {
    if (!VALID_VIEWS.includes(viewId)) return;
    state.currentView = viewId;
    pushRoute();
    renderCurrentRoute();
  }

  function showZoneSelectView() {
    state.currentZone = null;
    if (location.pathname !== "/") {
      history.pushState({}, "", "/");
    }
    renderCurrentRoute();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setLang(lang) {
    if (lang !== "el" && lang !== "en") return;
    state.lang = lang;
    renderStaticStrings();
    renderZoneGrid();
    renderHeroQuizPicker();
    if (state.currentZone) {
      renderRoleTabs();
      renderSubjectFilter();
      renderPathContent();
      renderAdvancedTools();
      renderPromptList();
      if (state.currentView === "quiz") renderQuizView();
      if (state.currentView === "guide") renderGuide();
    }
    updateDocumentTitle();
  }

  // ---------- Init ----------
  function init() {
    cacheDom();
    renderStaticStrings();
    renderZoneGrid();

    renderHeroQuizPicker();
    if (els.heroQuizCtaBtn) {
      els.heroQuizCtaBtn.addEventListener("click", () => {
        els.heroQuizPicker.hidden = !els.heroQuizPicker.hidden;
      });
    }

    els.backToZones.addEventListener("click", showZoneSelectView);
    els.langElBtn.addEventListener("click", () => setLang("el"));
    els.langEnBtn.addEventListener("click", () => setLang("en"));
    els.viewTabTools.addEventListener("click", () => selectView("tools"));
    els.viewTabAdvanced.addEventListener("click", () => selectView("advanced"));
    els.viewTabPrompts.addEventListener("click", () => selectView("prompts"));
    els.viewTabQuiz.addEventListener("click", () => selectView("quiz"));
    els.viewTabGuide.addEventListener("click", () => selectView("guide"));

    els.pathModalOverlay.addEventListener("click", (e) => {
      if (e.target === els.pathModalOverlay) closeLearningPathModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !els.pathModalOverlay.hidden) closeLearningPathModal();
    });

    // Deep link: URL όπως /primary/guardian/quiz φορτώνει κατευθείαν εκεί.
    restoreStateFromPath(location.pathname);
    renderCurrentRoute();

    // Back/forward browser buttons.
    window.addEventListener("popstate", () => {
      restoreStateFromPath(location.pathname);
      renderCurrentRoute();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
