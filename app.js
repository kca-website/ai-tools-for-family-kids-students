/**
 * app.js
 * ------------------------------------------------------------
 * Εφαρμογή vanilla JS. Χωρίς build step, χωρίς framework.
 * 
 * Λειτουργίες:
 *   - Επιλογή ζώνης & ρόλου
 *   - Εμφάνιση εργαλείων (βασικά + προχωρημένα)
 *   - Prompt Generator
 *   - Χάρτης Εξάσκησης (Practice Map)
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
    currentView: "tools", // "tools" | "advanced" | "prompts" | "quiz" | "tutor" | "guide"
    currentSubject: null, // subjectId ή null = "Όλα"
    currentNeed: null, // μαθησιακή ανάγκη: understand | practice | hint | check | revise | research
    currentStudentAge: null, // ακριβής ηλικία για ζώνες που καλύπτουν διαφορετικά όρια χρήσης εργαλείων
    a11yFilterOnly: false, // true = δείξε μόνο εργαλεία με τεκμηριωμένη προσβασιμότητα
    // Quiz sub-state
    quizGradeId: null,
    quizSubjectId: null,
    quizBrowseTopicsId: null, // subjectId ενός quiz που περιηγείται ο χρήστης ΧΩΡΙΣ να κάνει το τεστ
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
      menuClassroom: "Για την τάξη",
      heroTitle: "Μαθαίνω Έξυπνα με AI",
      heroSubtitle: "Βρες το κατάλληλο AI εργαλείο για αυτό που θέλεις να κάνεις και δες πώς να το χρησιμοποιήσεις σωστά. Για γονείς, παιδιά και μαθητές 4 έως 18 και εκπαιδευτικούς.",
      badgeFree: "Δωρεάν",
      badgeIndependent: "Ανεξάρτητο",
      badgeBilingual: "Δίγλωσσο EL / EN",
      badgeZeroTracking: "Χωρίς Cookies στον οδηγό",
      badgeZeroTrackingExplainer: "Ο οδηγός, τα εργαλεία και ο Χάρτης Εξάσκησης δεν χρησιμοποιούν cookies ούτε απαιτούν λογαριασμό. Η πρόοδος του Χάρτη μπορεί να αποθηκευτεί μόνο τοπικά στη συσκευή σου. Η προαιρετική AI Βοήθεια χρησιμοποιεί GPT-OSS 120B χωρίς λογαριασμό ή, αν το επιλέξεις, Puter.",
      chooseZoneHeading: "Διάλεξε ηλικιακή ζώνη",
      chooseZoneSubheading: "Αν ξέρεις ήδη τη σχολική βαθμίδα, μπες από εδώ. Σε κάθε ζώνη θα βρεις Χάρτη Εξάσκησης, Μονοπάτια Μάθησης, καθοδήγηση και επιλεγμένα εργαλεία.",
      heroFlowLabel: "Η διαδρομή μάθησης",
      heroFlowDifficulty: "Δυσκολία",
      heroFlowSpot: "Εντοπισμός",
      heroFlowPractice: "Εξάσκηση",
      heroFlowGuidance: "Καθοδήγηση",
      heroFlowRetry: "Ξαναδοκιμή",
      heroQuizCta: "Χάρτης Εξάσκησης · ξεκίνα εδώ",
      heroQuizCtaSub: "Λίγες σύντομες ερωτήσεις για να δεις ποια σημεία αξίζει να δουλέψεις περισσότερο και να πας στο επόμενο Μονοπάτι Μάθησης. Χωρίς βαθμό και χωρίς διάγνωση.",
      heroQuizPickPrompt: "Για ποια ζώνη;",
      heroHelpBadge: "Κόλλησα εδώ",
      heroHelpTitle: "Δείξε μου πώς να το μάθω, όχι τη λύση",
      heroHelpSub: "Η AI Βοήθεια ξεκινά από τη δική σου προσπάθεια και σε καθοδηγεί με μία ερώτηση ή μικρή υπόδειξη τη φορά, χωρίς έτοιμη τελική απάντηση.",
      heroHelpNote: "Η βασική πλατφόρμα παραμένει χωρίς λογαριασμό. Η προαιρετική AI Βοήθεια χρησιμοποιεί GPT-OSS 120B χωρίς σύνδεση, με το Puter ως εναλλακτική επιλογή.",
      heroHelpPrimary: "Γονιός Δημοτικού",
      heroHelpMiddle: "Γονιός Γυμνασίου",
      heroHelpHigh: "Μαθητής Λυκείου",
      homeAiModesEyebrow: "AI για πραγματική μάθηση",
      homeAiModesTitle: "Διάλεξε πώς θα σε βοηθήσει το AI να μάθεις",
      homeAiModesIntro: "Το ίδιο AI δεν είναι κατάλληλο για κάθε δυσκολία. Πρώτα βρίσκουμε τι χρειάζεσαι και μετά ποιο εργαλείο ή τρόπος AI βοήθειας ταιριάζει.",
      homeAiRecallTitle: "AI Επανάληψη",
      homeAiRecallText: "Ξαναφέρνει στην κατάλληλη στιγμή όσα σε δυσκόλεψαν και σε ελέγχει με νέα ερώτηση.",
      homeAiCharacterTitle: "Μίλα με έναν χαρακτήρα AI",
      homeAiCharacterText: "Μάθε βιωματικά μέσα από τεκμηριωμένο διάλογο και μετά έλεγξε τι πραγματικά έμαθες.",
      homeAiChallengeTitle: "AI Πρόκληση κατανόησης",
      homeAiChallengeText: "Παίρνεις μικρές υποδείξεις, απαντάς μόνος σου και στο τέλος αποδεικνύεις ότι κατάλαβες.",
      homeAiModesFoot: "Μάθημα → ανάγκη → κατάλληλη AI βοήθεια → προσπάθεια χωρίς AI.",
      backToZones: "Πίσω σε όλες τις ζώνες",
      footerText: "Ανεξάρτητο έργο. Δεν αποτελεί επίσημο προϊόν ή συνεργασία κανενός παρόχου AI. Η προαιρετική AI Βοήθεια χρησιμοποιεί Groq/GPT-OSS 120B ή Puter.",
      homeDwreanThanksTitle: "Ένα ευχαριστώ στο dwrean.net",
      homeDwreanThanksText: "Τα άρθρα του μας πρόσφεραν δωρεάν τεχνογνωσία, ενώ το αφιέρωμά του στο έργο μας ήταν ιδιαίτερα τιμητικό.",
      homeDwreanThanksLink: "Διάβασε το αφιέρωμα ↗",
      emptyState: "Δεν έχουν προστεθεί ακόμα εργαλεία για αυτόν τον συνδυασμό. Έρχονται σύντομα.",
      useCaseLabel: "Για ποια δουλειά",
      howToLabel: "Πώς να το χρησιμοποιήσεις",
      cautionLabel: "Προσοχή",
      visitLink: "Άνοιγμα εργαλείου ↗",
      infoLink: "Περισσότερα ↗",
      detailsLink: "Δες το εργαλείο →",
      viewTabTools: "Εργαλεία",
      viewTabAdvanced: "Προχωρημένα",
      viewTabPrompts: "Prompt Generator",
      viewTabQuiz: "Χάρτης Εξάσκησης",
      viewTabTutor: "AI Βοήθεια",
      viewTabTutorParent: "Βοηθός Γονέα",
      viewTabGuide: "Οδηγός",
      // ---------- "Τι ΔΕΝ είναι" + Last checked (νέο) ----------
      notGuideTitle: "Τι ΔΕΝ είναι αυτός ο οδηγός",
      notGuideItem1: "Δεν αντικαθιστά τον δάσκαλο ή τον γονιό.",
      notGuideItem2: "Δεν είναι τρόπος να αντιγράψεις μια εργασία έτοιμη.",
      footerLastChecked: window.AITOOLSKIDS_SITE_META?.toolCatalogAuditLabelEl || "Τελευταίος πλήρης έλεγχος καταλόγου εργαλείων: 24 Σεπτεμβρίου 2026",
      footerPrivacyLink: "Πολιτική Απορρήτου",
      footerAccessibilityLink: "Προσβασιμότητα εργαλείων",
      toolAgeLabel: "Όροι Χρήσης",
      shareToolBtn: "Μοιράσου",
      shareToolCopied: "Αντιγράφηκε!",
      promptsIntro: "Αυτά τα prompts δεν γράφουν την εργασία για εσένα. Σε ρωτάνε πρώτα τι σκέφτεσαι, και το AI απαντάει πάνω σε αυτό. Γράψε τη δική σου σκέψη μέσα στις αγκύλες πριν το αντιγράψεις.",
      promptsEmptyState: "Δεν έχουν προστεθεί ακόμα prompts για αυτή τη ζώνη. Έρχονται σύντομα.",
      copyPrompt: "Αντιγραφή prompt",
      copiedPrompt: "Αντιγράφηκε",
      tipLabel: "Συμβουλή",
      quizEmptyState: "Δεν υπάρχει ακόμα Χάρτης Εξάσκησης για αυτή τη ζώνη. Έρχεται σύντομα.",
      quizPickGrade: "Διάλεξε τάξη",
      quizPickSubject: "Διάλεξε μάθημα",
      quizBackToGrades: "← Άλλη τάξη",
      quizGradeComingSoon: "Έρχεται σύντομα",
      quizGradeEmptyState: "Δεν υπάρχει ακόμα Χάρτης Εξάσκησης για αυτή την τάξη. Έρχεται σύντομα.",
      quizStartBtn: "Ξεκίνα το κουίζ",
      quizBrowseBtn: "Δες τα θέματα",
      quizBrowseHeading: "Θέματα σε αυτό το μάθημα",
      quizBrowseIntro: "Διάλεξε ένα θέμα για να δεις κατευθείαν το μονοπάτι μάθησης: χωρίς τεστ.",
      quizBrowseBack: "← Άλλο μάθημα",
      quizBrowseTakeTest: "Κάνε αντ' αυτού το τεστ (2 λεπτά)",
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
      pathExtraToolsLabel: "Άλλα εργαλεία που μπορεί να βοηθήσουν σε αυτό:",
      advancedIntro: "Εργαλεία που δεν είναι διάσημα αλλά λύνουν συγκεκριμένες δύσκολες ανάγκες.",
      pdfDownloading: "Δημιουργία PDF...",
      subjectFilterLabel: "Φίλτρο μαθήματος",
      subjectAll: "Όλα",
      studentAgeLabel: "Η ηλικία μου",
      studentAgeNote: "Οι προτάσεις αλλάζουν με βάση τα ηλικιακά όρια των εργαλείων.",
      needFilterLabel: "Τι χρειάζεσαι τώρα;",
      needAll: "Όλες οι ανάγκες",
      needEmptyState: "Δεν βρέθηκε κατάλληλο εργαλείο για αυτόν τον συνδυασμό μαθήματος και ανάγκης.",
      subjectEmptyState: "Δεν υπάρχει ακόμα αντιστοίχιση εργαλείου για αυτό το μάθημα σε αυτή τη ζώνη.",
      a11yFilterLabel: "♿ Προτεραιότητα σε εργαλεία με ισχυρή τεκμηρίωση προσβασιμότητας",
      a11yFilterEmptyState: "Κανένα από τα εργαλεία αυτής της ζώνης δεν έχει επίσημη δήλωση προσβασιμότητας. Δες όλα τα εργαλεία στη σελίδα Προσβασιμότητα.",
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
      menuClassroom: "Classroom",
      heroTitle: "Learn Smarter with AI",
      heroSubtitle: "Find the right AI tool for what you want to do and see how to use it properly. For parents, children and students 4 to 18, and educators.",
      badgeFree: "Free",
      badgeIndependent: "Independent",
      badgeBilingual: "Bilingual EL / EN",
      badgeZeroTracking: "No Cookies in the guide",
      badgeZeroTrackingExplainer: "The guide, tool directory and Practice Map use no cookies and require no account. Practice Map progress may be stored only on your device. Optional AI Help uses GPT-OSS 120B without an account or, if selected, Puter.",
      chooseZoneHeading: "Choose an age zone",
      chooseZoneSubheading: "If you already know the school level, start here. Each zone includes the Practice Map, Learning Paths, guidance and a curated set of tools.",
      heroFlowLabel: "The learning route",
      heroFlowDifficulty: "Difficulty",
      heroFlowSpot: "Spot the gap",
      heroFlowPractice: "Practice",
      heroFlowGuidance: "Guidance",
      heroFlowRetry: "Try again",
      heroQuizCta: "Practice Map · start here",
      heroQuizCtaSub: "A few short questions to spot what is worth practising more and move to the next Learning Path. No grade and no diagnosis.",
      heroQuizPickPrompt: "For which zone?",
      heroHelpBadge: "I’m stuck here",
      heroHelpTitle: "Show me how to learn it, not the answer",
      heroHelpSub: "AI Help starts from your own attempt and guides you with one question or small hint at a time, without handing over a finished answer.",
      heroHelpNote: "The core site remains account-free. Optional AI Help uses GPT-OSS 120B without sign-in, with Puter as an alternative.",
      heroHelpPrimary: "Primary parent",
      heroHelpMiddle: "Middle School parent",
      heroHelpHigh: "High School student",
      homeAiModesEyebrow: "AI for real learning",
      homeAiModesTitle: "Choose how AI should help you learn",
      homeAiModesIntro: "The same AI is not right for every difficulty. First identify what you need, then choose the tool or AI learning mode that fits.",
      homeAiRecallTitle: "AI Review",
      homeAiRecallText: "Brings back what you struggled with at the right time and checks you with a new question.",
      homeAiCharacterTitle: "Talk with an AI character",
      homeAiCharacterText: "Learn through a grounded role-play dialogue, then verify what you actually learned.",
      homeAiChallengeTitle: "AI Understanding Challenge",
      homeAiChallengeText: "Get small hints, answer on your own, and finish by proving that you understood.",
      homeAiModesFoot: "Subject → need → suitable AI help → try again without AI.",
      backToZones: "Back to all zones",
      footerText: "Independent project. It is not an official product or partnership of any AI provider. Optional AI Help uses Groq/GPT-OSS 120B or Puter.",
      homeDwreanThanksTitle: "Thank you, dwrean.net",
      homeDwreanThanksText: "Its articles have shared valuable free know-how with us, and we are grateful for its feature on our project.",
      homeDwreanThanksLink: "Read the feature ↗",
      emptyState: "No tools added yet for this combination. Coming soon.",
      useCaseLabel: "Best for",
      howToLabel: "How to use it",
      cautionLabel: "Caution",
      visitLink: "Open tool ↗",
      infoLink: "Learn more ↗",
      detailsLink: "See the tool →",
      viewTabTools: "Tools",
      viewTabAdvanced: "Advanced",
      viewTabPrompts: "Prompt Generator",
      viewTabQuiz: "Practice Map",
      viewTabTutor: "AI Help",
      viewTabTutorParent: "Parent Helper",
      viewTabGuide: "Guide",
      promptsIntro: "These prompts don't write the assignment for you. They ask what you're thinking first, and the AI responds to that. Fill in your own thinking inside the brackets before copying.",
      promptsEmptyState: "No prompts added yet for this zone. Coming soon.",
      copyPrompt: "Copy prompt",
      copiedPrompt: "Copied",
      tipLabel: "Tip",
      quizEmptyState: "No Practice Map yet for this zone. Coming soon.",
      quizPickGrade: "Choose a grade",
      quizPickSubject: "Choose a subject",
      quizBackToGrades: "← Change grade",
      quizGradeComingSoon: "Coming soon",
      quizGradeEmptyState: "No Practice Map yet for this grade. Coming soon.",
      quizStartBtn: "Start the quiz",
      quizBrowseBtn: "See the topics",
      quizBrowseHeading: "Topics in this subject",
      quizBrowseIntro: "Pick a topic to see the learning path directly: no quiz needed.",
      quizBrowseBack: "← Change subject",
      quizBrowseTakeTest: "Take the quiz instead (2 min)",
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
      pathExtraToolsLabel: "Other tools that might help with this:",
      // ---------- "What this guide is NOT" + Last checked (new) ----------
      notGuideTitle: "What this guide is NOT",
      notGuideItem1: "It doesn't replace a teacher or a parent.",
      notGuideItem2: "It's not a way to get a finished assignment to copy.",
      footerLastChecked: window.AITOOLSKIDS_SITE_META?.toolCatalogAuditLabelEn || "Last full tool-catalog review: 5 September 2026",
      footerPrivacyLink: "Privacy Policy",
      footerAccessibilityLink: "Tool accessibility",
      toolAgeLabel: "Terms of Use",
      shareToolBtn: "Share",
      shareToolCopied: "Copied!",
      advancedIntro: "Tools that aren't famous but solve specific difficult needs.",
      pdfDownloading: "Generating PDF...",
      subjectFilterLabel: "Subject filter",
      subjectAll: "All",
      studentAgeLabel: "My age",
      studentAgeNote: "Recommendations change to respect each tool's age rules.",
      needFilterLabel: "What do you need right now?",
      needAll: "All needs",
      needEmptyState: "No suitable tool was found for this subject and learning need.",
      subjectEmptyState: "No tool mapping yet for this subject in this zone.",
      a11yFilterLabel: "♿ Prioritize tools with strong accessibility evidence",
      a11yFilterEmptyState: "None of the tools in this zone have an official accessibility statement. See all tools on the Accessibility page.",
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
    els.studentAgeFilter = document.getElementById("studentAgeFilter");
    els.subjectFilter = document.getElementById("subjectFilter");
    els.needFilter = document.getElementById("needFilter");
    els.a11yFilterToggle = document.getElementById("a11yFilterToggle");
    els.a11yFilterToggleAdvanced = document.getElementById("a11yFilterToggleAdvanced");
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
    els.viewTabTutor = document.getElementById("viewTabTutor");
    els.viewTabGuide = document.getElementById("viewTabGuide");
    els.toolsView = document.getElementById("toolsView");
    els.advancedView = document.getElementById("advancedView");
    els.promptsView = document.getElementById("promptsView");
    els.promptList = document.getElementById("promptList");
    els.quizView = document.getElementById("quizView");
    els.quizContent = document.getElementById("quizContent");
    els.tutorView = document.getElementById("tutorView");
    els.tutorMount = document.getElementById("tutorMount");
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
      card.addEventListener("click", () => { if (zone.href) { window.location.href = zone.href; return; } selectZone(zone.id); });
      els.zoneGrid.appendChild(card);
    });
  }

  // ---------- Rendering: Hero quiz picker (viral shortcut στο Practice Map) ----------
  function renderHeroQuizPicker() {
    if (!els.heroQuizPickerGrid) return;
    els.heroQuizPickerGrid.innerHTML = "";
    ZONES.filter((zone) => !zone.hideFromQuiz).forEach((zone) => {
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

  const STUDENT_AGE_OPTIONS = {
    middle: [12, 13, 14, 15],
    high: [15, 16, 17, 18],
  };

  function defaultStudentAge(zoneId) {
    const options = STUDENT_AGE_OPTIONS[zoneId];
    if (options && options.length) return options[0];
    return zoneId === "primary" ? 6 : null;
  }

  function renderStudentAgeFilter() {
    if (!els.studentAgeFilter) return;
    const ages = state.currentRole === "student" ? STUDENT_AGE_OPTIONS[state.currentZone] : null;
    if (!ages) {
      els.studentAgeFilter.hidden = true;
      els.studentAgeFilter.innerHTML = "";
      return;
    }
    if (!ages.includes(state.currentStudentAge)) {
      state.currentStudentAge = ages[0];
    }
    els.studentAgeFilter.hidden = false;
    els.studentAgeFilter.innerHTML = `
      <span class="student-age-filter__label">${escapeHtml(t("studentAgeLabel"))}</span>
      <div class="student-age-filter__chips">
        ${ages.map((age) => `
          <button type="button" class="student-age-chip${state.currentStudentAge === age ? " active" : ""}" data-student-age="${age}" aria-pressed="${state.currentStudentAge === age ? "true" : "false"}">${age}</button>
        `).join("")}
      </div>
      <span class="student-age-filter__note">${escapeHtml(t("studentAgeNote"))}</span>
    `;
    els.studentAgeFilter.querySelectorAll("[data-student-age]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.currentStudentAge = Number(btn.dataset.studentAge);
        renderStudentAgeFilter();
        renderPathContent();
        renderAdvancedTools();
      });
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
    state.currentNeed = null;
    renderSubjectFilter();
    renderNeedFilter();
    renderPathContent();
  }

  function renderNeedFilter() {
    if (!els.needFilter) return;
    els.needFilter.innerHTML = "";
    if (!state.currentSubject || typeof LEARNING_NEEDS === "undefined") {
      els.needFilter.hidden = true;
      return;
    }
    els.needFilter.hidden = false;

    const label = document.createElement("span");
    label.className = "need-filter__label";
    label.textContent = t("needFilterLabel");
    els.needFilter.appendChild(label);

    const all = document.createElement("button");
    all.type = "button";
    all.className = "need-chip" + (state.currentNeed === null ? " active" : "");
    all.textContent = t("needAll");
    all.addEventListener("click", () => {
      state.currentNeed = null;
      renderNeedFilter();
      renderPathContent();
    });
    els.needFilter.appendChild(all);

    LEARNING_NEEDS.forEach((need) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "need-chip" + (state.currentNeed === need.id ? " active" : "");
      const labelText = state.lang === "el" ? need.labelEl : need.labelEn;
      chip.innerHTML = `<span aria-hidden="true">${need.icon}</span> ${escapeHtml(labelText)}`;
      chip.addEventListener("click", () => {
        state.currentNeed = need.id;
        renderNeedFilter();
        renderPathContent();
      });
      els.needFilter.appendChild(chip);
    });
  }

  function accessibilityRank(toolId) {
    if (typeof ACCESSIBILITY_INFO === "undefined") return 2;
    const status = ACCESSIBILITY_INFO[toolId]?.status;
    if (status === "good") return 0;
    if (status === "partial") return 1;
    if (status === "none" || !status) return 2;
    if (status === "caution") return 3;
    return 2;
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

    if (state.currentRole === "student") {
      toolsToShow = toolsToShow.filter((entry) => TOOLS[entry.toolId] && isToolAgeAppropriate(TOOLS[entry.toolId]));
    }

    if (state.currentSubject) {
      const subjectData =
        CURRICULUM[state.currentZone] && CURRICULUM[state.currentZone][state.currentSubject];
      let allowedToolIds = subjectData ? subjectData.toolIds.slice() : [];

      if (state.currentNeed && typeof NEED_TOOL_MAP !== "undefined") {
        const needIds = (NEED_TOOL_MAP[state.currentSubject] && NEED_TOOL_MAP[state.currentSubject][state.currentNeed]) || [];
        const subjectIds = new Set(allowedToolIds);
        // NEED_TOOL_MAP is ordered by best fit for the selected need.
        // Intersect in NEED_TOOL_MAP order so the first cards are the most relevant,
        // instead of inheriting the generic subject order.
        allowedToolIds = needIds.filter((id) => subjectIds.has(id));
      }

      const existingById = new Map((pathData.tools || []).map((entry) => [entry.toolId, entry]));
      toolsToShow = allowedToolIds
        .filter((id) => TOOLS[id] && isToolAgeAppropriate(TOOLS[id]))
        .map((id) => existingById.get(id) || {
          toolId: id,
          useCaseEl: TOOLS[id].shortDescEl || "",
          useCaseEn: TOOLS[id].shortDescEn || "",
          howToEl: "Χρησιμοποίησέ το μόνο για τη συγκεκριμένη ανάγκη και έλεγξε την κατανόησή σου χωρίς AI στο τέλος.",
          howToEn: "Use it only for the selected need and verify your understanding without AI at the end.",
          cautionEl: "Μην χρησιμοποιείς την έτοιμη απάντηση ως υποκατάστατο της δικής σου προσπάθειας.",
          cautionEn: "Do not use a ready-made answer as a substitute for your own attempt.",
        });

      if (subjectData && subjectData.noteEl) {
        const note = state.lang === "el" ? subjectData.noteEl : subjectData.noteEn;
        const need = typeof LEARNING_NEEDS !== "undefined" ? LEARNING_NEEDS.find((item) => item.id === state.currentNeed) : null;
        const needLabel = need ? (state.lang === "el" ? need.labelEl : need.labelEn) : "";
        els.pathIntro.textContent = needLabel ? `${note} · ${needLabel}` : note;
      }

      if (!toolsToShow.length) {
        els.toolGrid.innerHTML = `<div class="empty-state">${t(state.currentNeed ? "needEmptyState" : "subjectEmptyState")}</div>`;
        return;
      }
    }

    if (state.a11yFilterOnly) {
      toolsToShow = toolsToShow
        .map((entry, index) => ({ entry, index }))
        .sort((a, b) => accessibilityRank(a.entry.toolId) - accessibilityRank(b.entry.toolId) || a.index - b.index)
        .map(({ entry }) => entry);
    }

    renderToolGrid(toolsToShow, els.toolGrid);
  }

  // ---------- Rendering: Advanced tools (εξειδικευμένα) ----------
  function renderAdvancedTools() {
    if (!els.advancedGrid) return;
    // Μαζεύουμε όλα τα εργαλεία που έχουν isExpert: true
    const expertTools = [];
    Object.keys(TOOLS).forEach((id) => {
      const tool = TOOLS[id];
      if (tool.isExpert && isToolAgeAppropriate(tool)) {
        expertTools.push({ toolId: id, tool });
      }
    });

    if (!expertTools.length) {
      els.advancedGrid.innerHTML = `<div class="empty-state">${t("emptyState")}</div>`;
      return;
    }

    if (state.a11yFilterOnly) {
      expertTools.sort((a, b) => accessibilityRank(a.toolId) - accessibilityRank(b.toolId));
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

    // Εφαρμογή κινητού (όχι web): π.χ. Erla
    let mobileBadge = '';
    if (tool.isMobileApp) {
      mobileBadge = state.lang === "el"
        ? `<span class="tool-card__mobile-badge">📱 Μόνο εφαρμογή κινητού</span>`
        : `<span class="tool-card__mobile-badge">📱 Mobile app only</span>`;
    }

    // Υπό επανεξέταση: π.χ. προγράμματα που άλλαξαν πρόσφατα
    let pendingBadge = '';
    if (tool.pending) {
      pendingBadge = state.lang === "el"
        ? `<span class="tool-card__pending-badge">⏳ Υπό επανεξέταση</span>`
        : `<span class="tool-card__pending-badge">⏳ Under review</span>`;
    }

    // Προσβασιμότητα: μόνο για επιβεβαιωμένα θετικά ή τεκμηριωμένες ανησυχίες
    let accessibilityBadge = '';
    const a11y = typeof ACCESSIBILITY_INFO !== "undefined" ? ACCESSIBILITY_INFO[tool.id] : null;
    if (a11y && a11y.status === "good") {
      accessibilityBadge = state.lang === "el"
        ? `<span class="tool-card__a11y-badge tool-card__a11y-badge--good" title="${escapeAttr(a11y.noteEl)}">✓ Επίσημη δήλωση προσβασιμότητας</span>`
        : `<span class="tool-card__a11y-badge tool-card__a11y-badge--good" title="${escapeAttr(a11y.noteEn)}">✓ Official accessibility statement</span>`;
    } else if (a11y && a11y.status === "partial") {
      accessibilityBadge = state.lang === "el"
        ? `<span class="tool-card__a11y-badge tool-card__a11y-badge--partial" title="${escapeAttr(a11y.noteEl)}">♿ Μερική τεκμηρίωση προσβασιμότητας</span>`
        : `<span class="tool-card__a11y-badge tool-card__a11y-badge--partial" title="${escapeAttr(a11y.noteEn)}">♿ Partial accessibility evidence</span>`;
    } else if (a11y && a11y.status === "caution") {
      accessibilityBadge = state.lang === "el"
        ? `<span class="tool-card__a11y-badge tool-card__a11y-badge--caution" title="${escapeAttr(a11y.noteEl)}">⚠️ Τεκμηριωμένο πρόβλημα προσβασιμότητας</span>`
        : `<span class="tool-card__a11y-badge tool-card__a11y-badge--caution" title="${escapeAttr(a11y.noteEn)}">⚠️ Documented accessibility issue</span>`;
    }

    const greekSupport = (typeof GREEK_SUPPORT_INFO !== "undefined" && GREEK_SUPPORT_INFO[tool.id]) || null;
    let greekSupportBadge = "";
    if (greekSupport) {
      const labelsEl = { yes:"Ελληνικά: Ναι", partial:"Ελληνικά: Μερικά", neutral:"Γλωσσικά ουδέτερο", no:"Ελληνικά: Όχι", unknown:"Ελληνικά: Δεν επιβεβαιώθηκε" };
      const labelsEn = { yes:"Greek: Yes", partial:"Greek: Partial", neutral:"Language-neutral", no:"Greek: No", unknown:"Greek: Not verified" };
      const palette = {
        yes:["#ecfdf3","#176b45","#b7e4c7"],
        partial:["#fff8e1","#7a5b00","#ead58b"],
        neutral:["#eef6ff","#245f8e","#bfd7ee"],
        no:["#f3f4f6","#5f6672","#d7dbe2"],
        unknown:["#f8fafc","#64748b","#d7dce3"]
      };
      const p = palette[greekSupport.status] || palette.unknown;
      const label = state.lang === "el" ? labelsEl[greekSupport.status] : labelsEn[greekSupport.status];
      const note = state.lang === "el" ? greekSupport.noteEl : greekSupport.noteEn;
      greekSupportBadge = `<span class="tool-card__greek-support" title="${escapeAttr(note || label)}" style="display:inline-block;margin:2px 0 8px;padding:4px 8px;border-radius:999px;background:${p[0]};color:${p[1]};border:1px solid ${p[2]};font-size:.73rem;font-weight:700;">🇬🇷 ${escapeHtml(label)}</span>`;
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
      ${accessibilityBadge}
      ${greekSupportBadge}
      ${categoryLabel ? `<span class="tool-card__category">${escapeHtml(categoryLabel)}</span>` : ""}
      ${useCase ? `<p class="tool-card__field-label">${t("useCaseLabel")}</p><p class="tool-card__field-value">${escapeHtml(useCase)}</p>` : ""}
      ${howTo ? `<p class="tool-card__field-label">${t("howToLabel")}</p><p class="tool-card__field-value">${escapeHtml(howTo)}</p>` : ""}
      ${caution ? `<div class="tool-card__caution"><strong>${t("cautionLabel")}:</strong> ${escapeHtml(caution)}</div>` : ""}
      ${typeof tool.minAge === "number" ? `<p class="tool-card__age-note"><strong>${t("toolAgeLabel")}:</strong> ${tool.minAge}+${tool.minAgeNote ? ` · ${escapeHtml(tool.minAgeNote)}` : ""}</p>` : ""}
      ${tool.greekTips && state.lang === "el" ? `<p class="tool-card__greek-tips" style="margin-top: 8px; padding: 8px 10px; background: #F0F7FF; border-radius: 8px; font-size: 0.85rem; color: #334155;">🇬🇷 ${escapeHtml(tool.greekTips)}</p>` : ""}
      <div class="tool-card__actions">
        <a class="tool-card__link" href="${escapeAttr("/tools/" + tool.id + ".html")}" target="_blank" rel="noopener noreferrer">${t("detailsLink")}</a>
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
  function isTutorViewAvailable(zoneId = state.currentZone, roleId = state.currentRole) {
    // Γονείς/κηδεμόνες: όλες οι βαθμίδες. Μαθητές: μόνο Λύκειο.
    return roleId === "guardian" || (roleId === "student" && zoneId === "high");
  }

  function renderTutorView() {
    if (state.currentView !== "tutor" || !els.tutorMount) return;
    if (!isTutorViewAvailable()) return;
    if (window.AITutor && typeof window.AITutor.render === "function") {
      window.AITutor.render({
        zoneId: state.currentZone,
        roleId: state.currentRole,
        lang: state.lang,
      });
    } else {
      els.tutorMount.innerHTML = '<div class="empty-state">Η AI Βοήθεια δεν φορτώθηκε σωστά.</div>';
    }
  }

  function renderViewTabs() {
    const tutorAvailable = isTutorViewAvailable();
    els.viewTabTutor.hidden = !tutorAvailable;
    if (tutorAvailable) {
      els.viewTabTutor.textContent = state.currentRole === "guardian" ? t("viewTabTutorParent") : t("viewTabTutor");
    }

    els.viewTabTools.classList.toggle("active", state.currentView === "tools");
    els.viewTabAdvanced.classList.toggle("active", state.currentView === "advanced");
    els.viewTabPrompts.classList.toggle("active", state.currentView === "prompts");
    els.viewTabQuiz.classList.toggle("active", state.currentView === "quiz");
    els.viewTabTutor.classList.toggle("active", state.currentView === "tutor");
    els.viewTabGuide.classList.toggle("active", state.currentView === "guide");
    els.toolsView.hidden = state.currentView !== "tools";
    els.advancedView.hidden = state.currentView !== "advanced";
    els.promptsView.hidden = state.currentView !== "prompts";
    els.quizView.hidden = state.currentView !== "quiz";
    els.tutorView.hidden = state.currentView !== "tutor";
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

    // Δημιουργούμε ένα προσωρινό container για το PDF (κανονική ροή εγγράφου).
    const container = document.createElement("div");
    container.style.padding = "40px";
    container.style.fontFamily = "system-ui, -apple-system, sans-serif";
    container.style.maxWidth = "800px";
    container.style.margin = "0 auto";
    container.style.backgroundColor = "#FFFFFF";
    container.innerHTML = `
      <style>
        /* Αποτρέπει το σκίσιμο πινάκων/γραμμών ανάμεσα σε δύο σελίδες PDF */
        table { border-collapse: collapse; width: 100%; page-break-inside: auto; }
        tr, td, th { page-break-inside: avoid; }
        thead { display: table-header-group; }
        h1, h2, h3 { page-break-after: avoid; }
      </style>
      <h1 style="font-size:28px; margin-bottom:8px;">${state.lang === 'el' ? GUIDE_DATA.el.title : GUIDE_DATA.en.title}</h1>
      <p style="color:#5A6270; font-size:14px; margin-bottom:24px;">aitools4kids.gr</p>
      ${clone.innerHTML}
      <p style="margin-top:40px; font-size:12px; color:#9AA1B0; border-top:1px solid #E4E6EA; padding-top:16px; text-align:center;">
        Ανεξάρτητο έργο. Δεν σχετίζεται με κανέναν οργανισμό ή προμηθευτή AI εργαλείων.
      </p>
    `;

    document.body.appendChild(container);

    // ΣΗΜΑΝΤΙΚΟ: το κουμπί PDF είναι κάτω στη σελίδα, οπότε ο χρήστης έχει κάνει
    // scroll όταν το πατάει. Το html2canvas τραβάει "screenshot" από το τρέχον
    // σημείο scroll, όχι από την αρχή του container -> κενές σελίδες στην αρχή.
    // Λύση: σκρολάρουμε προγραμματιστικά στην κορυφή ΠΡΙΝ τη λήψη, χωρίς να
    // χρειάζεται ο χρήστης να κάνει κάτι, και επαναφέρουμε το scroll μετά.
    const previousScrollX = window.scrollX;
    const previousScrollY = window.scrollY;
    window.scrollTo(0, 0);

    const restoreScroll = () => window.scrollTo(previousScrollX, previousScrollY);

    const opt = {
      margin:        [0.5, 0.5, 0.5, 0.5],
      filename:      state.lang === 'el' ? 'odigos-ai-2026.pdf' : 'ai-guide-2026.pdf',
      image:         { type: 'jpeg', quality: 0.98 },
      html2canvas:   { scale: 2, useCORS: true, letterRendering: true, scrollX: 0, scrollY: 0 },
      jsPDF:         { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak:     { mode: ['css', 'legacy'], avoid: ['tr', 'table'] }
    };

    // Μικρή καθυστέρηση ώστε ο browser να προλάβει να ζωγραφίσει (repaint) τη
    // σελίδα στη νέα θέση scroll πριν ξεκινήσει το html2canvas.
    setTimeout(() => {
      html2pdf().set(opt).from(container).save().then(() => {
        document.body.removeChild(container);
        restoreScroll();
        if (btn) {
          btn.textContent = "📄 Κατέβασε τον οδηγό σε PDF";
          btn.disabled = false;
        }
      }).catch((err) => {
        console.error(err);
        document.body.removeChild(container);
        restoreScroll();
        if (btn) {
          btn.textContent = "📄 Κατέβασε τον οδηγό σε PDF";
          btn.disabled = false;
        }
        alert("Προέκυψε σφάλμα κατά τη δημιουργία του PDF. Δοκίμασε ξανά.");
      });
    }, 50);
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
        <div class="prompt-card__actions">
          <button type="button" class="prompt-card__copy">${t("copyPrompt")}</button>
          ${isTutorViewAvailable(state.currentZone,state.currentRole)?`<button type="button" class="prompt-card__ai">${state.lang==="el"?"Άνοιξε στην AI Βοήθεια":"Open in AI Help"}</button>`:""}
        </div>
      `;
      const copyBtn = card.querySelector(".prompt-card__copy");
      copyBtn.addEventListener("click", () => copyPromptToClipboard(promptText, copyBtn));
      const aiBtn=card.querySelector(".prompt-card__ai");
      if(aiBtn){
        aiBtn.addEventListener("click",()=>{
          state.currentView="tutor";
          pushRoute();
          renderCurrentRoute();
          setTimeout(()=>{
            const input=document.getElementById("tutorInput");
            if(input){
              input.value=promptText;
              input.dispatchEvent(new Event("input",{bubbles:true}));
              input.focus();
            }
          },80);
        });
      }
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

  // Fisher-Yates shuffle: δεν πειράζει τον αρχικό πίνακα, επιστρέφει νέο.
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
    state.quizBrowseTopicsId = null;
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

  // Μέγιστη ηλικία ανά ζώνη: χρησιμοποιείται σαν ασφαλιστική δικλείδα ώστε
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
    const effectiveAge = Number.isFinite(state.currentStudentAge)
      ? state.currentStudentAge
      : defaultStudentAge(state.currentZone);
    if (effectiveAge === null || effectiveAge === undefined || tool.minAge === undefined) return true;
    return tool.minAge <= effectiveAge;
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
    if (state.quizBrowseTopicsId) {
      const browseQuiz = zoneQuizzes[state.quizBrowseTopicsId];
      if (browseQuiz) {
        renderTopicBrowser(browseQuiz, zoneQuizzes);
        return;
      }
      state.quizBrowseTopicsId = null;
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
    const dueReviews = getDueReviewsForCurrentZone();
    const dueReviewsHtml = dueReviews.length ? `
      <section class="quiz-due-reviews">
        <p class="quiz-due-reviews__title">${state.lang === "el" ? "🧠 Ώρα για επανάληψη" : "🧠 Review due"}</p>
        <p class="quiz-due-reviews__sub">${state.lang === "el" ? "Θέματα που είχες βάλει για επανάληψη και ήρθε η ώρα να τα ξαναδείς." : "Topics you saved for review that are now due."}</p>
        <div class="quiz-due-review-list">
          ${dueReviews.map((item) => `<button type="button" class="quiz-due-review-btn" data-gap-id="${escapeAttr(item.gapId)}">${escapeHtml(item.label || item.gapId)}</button>`).join("")}
        </div>
      </section>
    ` : "";
    els.quizContent.innerHTML = `${dueReviewsHtml}<p class="quiz-pick-heading">${t("quizPickGrade")}</p><div class="quiz-grade-grid">${cards}</div>`;
    els.quizContent.querySelectorAll(".quiz-due-review-btn").forEach((btn) => {
      btn.addEventListener("click", () => openLearningPathModal(btn.dataset.gapId));
    });
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
          <button type="button" class="quiz-browse-btn" data-subject-id="${escapeAttr(sid)}">${t("quizBrowseBtn")}</button>
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
    els.quizContent.querySelectorAll(".quiz-browse-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.quizBrowseTopicsId = btn.dataset.subjectId;
        renderQuizView();
      });
    });
  }

  // Λίστα όλων των θεμάτων (gap tags) ενός μαθήματος, ΧΩΡΙΣ να χρειάζεται να κάνει
  // κανείς το τεστ πρώτα. Κάθε θέμα ανοίγει κατευθείαν το ίδιο Μονοπάτι Μάθησης
  // που θα έβλεπε αν το τεστ εντόπιζε εκεί κενό: καμία νέα βάση περιεχομένου.
  function renderTopicBrowser(quiz, zoneQuizzes) {
    const subjectLabel = state.lang === "el" ? quiz.subjectLabelEl : quiz.subjectLabelEn;
    const tagIds = [];
    (quiz.questions || []).forEach((q) => {
      (q.options || []).forEach((opt) => {
        if (opt.gapTag && !tagIds.includes(opt.gapTag)) tagIds.push(opt.gapTag);
      });
    });
    const topicCards = tagIds.map((tagId) => {
      const gap = (typeof GAP_TAGS !== "undefined" && GAP_TAGS[tagId]) || null;
      if (!gap) return "";
      const label = state.lang === "el" ? gap.labelEl : gap.labelEn;
      const explain = state.lang === "el" ? gap.explainEl : gap.explainEn;
      const hasPath = typeof LEARNING_PATHS !== "undefined" && LEARNING_PATHS[tagId];
      return `
        <button type="button" class="quiz-topic-card" data-gap-id="${escapeAttr(tagId)}" ${hasPath ? "" : "disabled"}>
          <span class="quiz-topic-card__label">${escapeHtml(label)}</span>
          <span class="quiz-topic-card__explain">${escapeHtml(explain)}</span>
        </button>
      `;
    }).join("");

    els.quizContent.innerHTML = `
      <button type="button" class="quiz-grade-back-btn" id="quizBrowseBackBtn">${t("quizBrowseBack")}</button>
      <p class="quiz-pick-heading">${escapeHtml(subjectLabel)} · ${t("quizBrowseHeading")}</p>
      <p class="quiz-browse-intro">${t("quizBrowseIntro")}</p>
      <div class="quiz-topic-grid">${topicCards}</div>
      <button type="button" class="quiz-start-btn" id="quizBrowseTakeTestBtn" style="margin-top:16px;">${t("quizBrowseTakeTest")}</button>
    `;

    const backBtn = document.getElementById("quizBrowseBackBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        state.quizBrowseTopicsId = null;
        renderQuizView();
      });
    }
    const takeTestBtn = document.getElementById("quizBrowseTakeTestBtn");
    if (takeTestBtn) {
      takeTestBtn.addEventListener("click", () => {
        const subjectId = state.quizBrowseTopicsId;
        state.quizBrowseTopicsId = null;
        state.quizSubjectId = subjectId;
        state.quizCurrentIndex = 0;
        state.quizAnswers = [];
        state.quizFinished = false;
        startQuizSession(zoneQuizzes[subjectId]);
        renderQuizView();
      });
    }
    els.quizContent.querySelectorAll(".quiz-topic-card").forEach((btn) => {
      btn.addEventListener("click", () => openLearningPathModal(btn.dataset.gapId));
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
    els.quizContent.setAttribute("aria-live", "polite");
    els.quizContent.setAttribute("role", "group");
    els.quizContent.setAttribute("aria-label", t("quizQuestionOf", { current, total }));
    els.quizContent.innerHTML = `
      <div class="quiz-progress">${t("quizQuestionOf", { current, total })}</div>
      <p class="quiz-question-text" tabindex="-1">${escapeHtml(questionText)}</p>
      <div class="quiz-options">${optionsHtml}</div>
    `;
    // Μεταφέρουμε το focus στη νέα ερώτηση, ώστε χρήστες πληκτρολογίου/screen reader
    // να μην χρειάζεται να κάνουν Tab από την αρχή της σελίδας μετά από κάθε απάντηση.
    const questionHeading = els.quizContent.querySelector(".quiz-question-text");
    if (questionHeading) questionHeading.focus();
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
    saveProgress(state.currentZone, state.quizSubjectId, gapTagIds);
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

        function renderToolBlock(entry) {
          const tool = entry.tool;
          const toolId = entry.toolId;
          const desc = state.lang === "el" ? tool.shortDescEl : tool.shortDescEn;
          return `
            <div class="quiz-tool-block" style="margin-bottom: 12px;">
              <a class="quiz-tool-chip" href="${escapeAttr("/tools/" + toolId + ".html")}" target="_blank" rel="noopener noreferrer">${escapeHtml(tool.name)}</a>
              ${desc ? `<p class="quiz-tool-howto" style="margin: 4px 0 0; font-size: 0.85rem; color: var(--color-text-muted);">${escapeHtml(desc)}</p>` : ""}
            </div>
          `;
        }

        // Χωρίζουμε σε: (α) εργαλεία κατάλληλα για την ίδια τη ζώνη ηλικίας (φαίνονται πάντα),
        // (β) εργαλεία που φαίνονται ΜΟΝΟ επειδή ο ρόλος είναι "guardian" (π.χ. ChatGPT σε ζώνη
        // Δημοτικού). Ο ρόλος είναι αυτο-δηλωμένος και ανεπαλήθευτος: ένα παιδί θα μπορούσε να
        // πατήσει το tab "Γονιός" με ένα κλικ: οπότε τα (β) ΔΕΝ εμφανίζονται αυτόματα μαζί με τα
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
          if (isAdultOnlyHere) adultOnlyTools.push({ tool, toolId });
          else regularTools.push({ tool, toolId });
        });

        const regularToolsHtml = regularTools.map(renderToolBlock).join("");
        const adultSummaryText = state.lang === "el"
          ? `Δες προτάσεις και για εσένα (${adultOnlyTools.length}), όχι για το παιδί`
          : `Show suggestions for you too (${adultOnlyTools.length}), not for the child`;
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

    const quizAiAvailable = isTutorViewAvailable(state.currentZone, state.currentRole);
    const quizGapLabels = gapTagIds.map((tagId) => {
      const gap = (typeof GAP_TAGS !== "undefined" && GAP_TAGS[tagId]) || null;
      return gap ? (state.lang === "el" ? gap.labelEl : gap.labelEn) : "";
    }).filter(Boolean);
    const quizAiPrompt = state.lang === "el"
      ? (quizGapLabels.length
          ? `Στο μικρό τεστ δυσκολεύτηκα στα εξής σημεία: ${quizGapLabels.join(", ")}. Βοήθησέ με να τα καταλάβω χωρίς να μου δώσεις έτοιμη λύση. Κάνε μία ερώτηση ή μικρή υπόδειξη τη φορά και στο τέλος βάλε μου 2 νέες ερωτήσεις για να ελέγξω αν το κατάλαβα.`
          : "Στο μικρό τεστ τα πήγα καλά. Δώσε μου μια λίγο πιο απαιτητική πρόκληση στο ίδιο μάθημα, χωρίς έτοιμη λύση, και έλεγξε στο τέλος αν μπορώ να εξηγήσω τη σκέψη μου.")
      : (quizGapLabels.length
          ? `In the short quiz I struggled with: ${quizGapLabels.join(", ")}. Help me understand these without giving me the ready answer. Ask one question or give one small hint at a time, then finish with 2 new questions to check my understanding.`
          : "I did well on the short quiz. Give me a slightly harder challenge in the same subject without a ready answer, then check whether I can explain my reasoning.");

    const quizAiNextHtml = quizAiAvailable ? `
      <div class="quiz-ai-next" style="margin:20px 0 0;padding:16px;border:1px solid #bfe3d5;border-radius:12px;background:#f3fbf7;">
        <strong style="display:block;margin-bottom:5px;color:#175c4a;">${state.lang === "el" ? "🤖 Επόμενο βήμα: AI Βοήθεια" : "🤖 Next step: AI Help"}</strong>
        <p style="margin:0 0 11px;color:var(--color-text-muted);font-size:.9rem;line-height:1.5;">${state.lang === "el"
          ? (quizGapLabels.length ? "Δούλεψε ακριβώς τα σημεία που εντοπίστηκαν με καθοδήγηση και μετά ξαναδοκίμασε." : "Χρησιμοποίησε την AI Βοήθεια για πιο απαιτητική εξάσκηση στο ίδιο μάθημα.")
          : (quizGapLabels.length ? "Work on exactly the gaps that were spotted with guided help, then try again." : "Use AI Help for a harder challenge in the same subject.")}</p>
        <button type="button" class="quiz-ai-help-btn" style="border:0;border-radius:9px;background:var(--color-accent);color:#fff;padding:10px 14px;font:inherit;font-weight:700;cursor:pointer;">${state.lang === "el" ? "Άνοιξε AI Βοήθεια →" : "Open AI Help →"}</button>
      </div>
    ` : "";

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
      ${quizAiNextHtml}
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

    const quizAiBtn = els.quizContent.querySelector('.quiz-ai-help-btn');
    if (quizAiBtn) {
      quizAiBtn.addEventListener('click', () => {
        const preferredSubject = state.quizSubjectId || state.currentSubject;
        state.currentSubject = preferredSubject || null;
        state.currentView = "tutor";
        pushRoute();
        renderCurrentRoute();
        setTimeout(() => {
          const subject = document.getElementById("tutorSubject");
          if (subject && preferredSubject && [...subject.options].some((o) => o.value === preferredSubject)) {
            subject.value = preferredSubject;
            subject.dispatchEvent(new Event("change", { bubbles: true }));
          }
          const input = document.getElementById("tutorInput");
          if (input) {
            input.value = quizAiPrompt;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.focus();
          }
        }, 80);
      });
    }

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

  // ---------- Learning activities: recall / challenge / character ----------
  const REVIEW_STORAGE_KEY = "aitools4kids_review_queue_v1";
  const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14];

  function getReviewQueue() {
    try {
      const raw = localStorage.getItem(REVIEW_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function saveReviewQueue(items) {
    try {
      localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(items));
    } catch (_) {}
  }

  function scheduleGapReview(gapId, label) {
    const items = getReviewQueue();
    const existing = items.find((item) => item.gapId === gapId && item.zone === state.currentZone);
    const now = Date.now();
    if (existing) {
      existing.label = label;
      existing.subjectId = state.quizSubjectId || existing.subjectId || null;
      existing.stage = 0;
      existing.dueAt = now + REVIEW_INTERVALS_DAYS[0] * 86400000;
      existing.updatedAt = now;
    } else {
      items.push({
        gapId,
        label,
        zone: state.currentZone,
        subjectId: state.quizSubjectId || null,
        stage: 0,
        dueAt: now + REVIEW_INTERVALS_DAYS[0] * 86400000,
        updatedAt: now,
      });
    }
    saveReviewQueue(items);
  }

  function advanceGapReview(gapId) {
    const items = getReviewQueue();
    const item = items.find((entry) => entry.gapId === gapId && entry.zone === state.currentZone);
    if (!item) return;
    const nextStage = Math.min((item.stage || 0) + 1, REVIEW_INTERVALS_DAYS.length - 1);
    item.stage = nextStage;
    item.dueAt = Date.now() + REVIEW_INTERVALS_DAYS[nextStage] * 86400000;
    item.updatedAt = Date.now();
    saveReviewQueue(items);
  }

  function isGapReviewDue(gapId) {
    const item = getReviewQueue().find((entry) => entry.gapId === gapId && entry.zone === state.currentZone);
    return !!(item && item.dueAt <= Date.now());
  }

  function getDueReviewsForCurrentZone() {
    return getReviewQueue().filter((item) => item.zone === state.currentZone && item.dueAt <= Date.now());
  }

  function getLearningActivityPrompt(action, gapId, gap) {
    const label = state.lang === "el" ? gap.labelEl : gap.labelEn;
    const explain = state.lang === "el" ? gap.explainEl : gap.explainEn;
    if (state.lang === "en") {
      if (action === "character") {
        return `Act as a historically plausible character connected with the topic "${label}". Stay within well-established facts, clearly say when something is uncertain, and do not invent quotations. Ask me one question at a time. After 4 exchanges, leave character and ask me to state 2 things I learned and 1 claim I should verify in my school material. Learning difficulty: ${explain}`;
      }
      return `Help me learn "${label}" without giving me the answer. Difficulty: ${explain}. First ask what I already think. Then give one small hint at a time. Finish with 3 new questions of increasing difficulty. Do not reveal the final answer unless I have attempted each one.`;
    }
    if (action === "character") {
      return `Μπες στον ρόλο ενός ιστορικά εύλογου προσώπου που συνδέεται με το θέμα «${label}». Μείνε σε καλά τεκμηριωμένα ιστορικά στοιχεία, δήλωσε καθαρά όταν κάτι είναι αβέβαιο και μην επινοείς αποσπάσματα ή πηγές. Κάνε μου μία ερώτηση κάθε φορά. Μετά από 4 ανταλλαγές βγες από τον ρόλο και ζήτησέ μου να γράψω 2 πράγματα που έμαθα και 1 ισχυρισμό που πρέπει να ελέγξω στο σχολικό υλικό. Δυσκολία που δουλεύω: ${explain}`;
    }
    return `Βοήθησέ με να μάθω το θέμα «${label}» χωρίς να μου δώσεις τη λύση. Η δυσκολία μου είναι: ${explain}. Ρώτησέ με πρώτα τι σκέφτομαι ήδη. Μετά δώσε μία μικρή υπόδειξη κάθε φορά. Στο τέλος κάνε 3 καινούριες ερωτήσεις αυξανόμενης δυσκολίας. Μην αποκαλύψεις τελική απάντηση πριν προσπαθήσω σε καθεμία.`;
  }

  function renderLearningActivities(gapId, gap) {
    const historyLike = /^history\./.test(gapId) || /ιστορ|history|σπάρτ|αθήν|βυζαν/i.test(
      `${gap.labelEl || ""} ${gap.labelEn || ""}`
    );
    const due = isGapReviewDue(gapId);
    const title = state.lang === "el" ? "Πώς να το δουλέψεις" : "How to work on this";
    const sub = state.lang === "el"
      ? "Διάλεξε μαθησιακή παρέμβαση πριν διαλέξεις AI εργαλείο."
      : "Choose a learning intervention before choosing an AI tool.";
    const recallTitle = state.lang === "el" ? "🧠 Θυμήσου το ξανά" : "🧠 Review it again";
    const recallText = state.lang === "el"
      ? (due ? "Ήρθε η ώρα για επανάληψη. Άνοιξε ξανά το θέμα και μετά προγραμμάτισε την επόμενη." : "Βάλε το θέμα σε επανάληψη. Θα εμφανιστεί ξανά στον Χάρτη Εξάσκησης.")
      : (due ? "This review is due. Revisit it, then schedule the next interval." : "Add this topic to review. It will reappear in the Practice Map.");
    const challengeTitle = state.lang === "el" ? "🎯 Πρόκληση κατανόησης" : "🎯 Understanding challenge";
    const challengeText = state.lang === "el"
      ? "Πάρε καθοδήγηση με μικρές υποδείξεις και μετά λύσε 3 νέες ερωτήσεις χωρίς έτοιμη απάντηση."
      : "Get small hints, then answer 3 new questions without a ready-made solution.";
    const characterHtml = historyLike ? `
      <button type="button" class="learning-activity-card" data-learning-action="character" data-gap-id="${escapeAttr(gapId)}">
        <span class="learning-activity-card__title">${state.lang === "el" ? "🎭 Μίλα με έναν χαρακτήρα" : "🎭 Talk with a character"}</span>
        <span class="learning-activity-card__text">${state.lang === "el" ? "Βιωματικός διάλογος με ιστορικό ρόλο και υποχρεωτικό έλεγχο όσων ειπώθηκαν." : "Role-play with a historical character, followed by a required fact check."}</span>
      </button>
    ` : "";
    return `
      <section class="learning-activities" aria-label="${escapeAttr(title)}">
        <div class="learning-activities__head">
          <p class="learning-activities__title">${escapeHtml(title)}</p>
          <p class="learning-activities__sub">${escapeHtml(sub)}</p>
        </div>
        <div class="learning-activities__grid">
          <button type="button" class="learning-activity-card" data-learning-action="recall" data-gap-id="${escapeAttr(gapId)}">
            <span class="learning-activity-card__title">${escapeHtml(recallTitle)}</span>
            <span class="learning-activity-card__text">${escapeHtml(recallText)}</span>
          </button>
          <button type="button" class="learning-activity-card" data-learning-action="challenge" data-gap-id="${escapeAttr(gapId)}">
            <span class="learning-activity-card__title">${escapeHtml(challengeTitle)}</span>
            <span class="learning-activity-card__text">${escapeHtml(challengeText)}</span>
          </button>
          ${characterHtml}
        </div>
        <div class="learning-activity-output" data-learning-output hidden></div>
      </section>
    `;
  }

  function bindLearningActivityActions(gapId, gap, label) {
    const container = els.pathModal.querySelector(".learning-activities");
    if (!container) return;
    const output = container.querySelector("[data-learning-output]");
    container.querySelectorAll("[data-learning-action]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const action = btn.dataset.learningAction;
        if (action === "recall") {
          if (isGapReviewDue(gapId)) {
            advanceGapReview(gapId);
            btn.querySelector(".learning-activity-card__text").textContent = state.lang === "el"
              ? "Έτοιμο. Προγραμματίστηκε η επόμενη επανάληψη."
              : "Done. The next review has been scheduled.";
          } else {
            scheduleGapReview(gapId, label);
            btn.querySelector(".learning-activity-card__text").textContent = state.lang === "el"
              ? "Προστέθηκε. Θα το ξαναδείς όταν έρθει η ώρα της επανάληψης."
              : "Added. You will see it again when the review is due.";
          }
          return;
        }

        const prompt = getLearningActivityPrompt(action, gapId, gap);
        const tutorUrl = `/${state.currentZone}/${state.currentRole}/tutor`;
        output.hidden = false;
        output.innerHTML = `
          <p class="learning-activity-output__label">${action === "character"
            ? (state.lang === "el" ? "Prompt για διάλογο χαρακτήρα" : "Character dialogue prompt")
            : (state.lang === "el" ? "Prompt για καθοδηγούμενη πρόκληση" : "Guided challenge prompt")}</p>
          <textarea class="learning-activity-output__prompt" readonly>${escapeHtml(prompt)}</textarea>
          <div class="learning-activity-output__actions">
            <button type="button" class="learning-activity-copy">${state.lang === "el" ? "Αντιγραφή prompt" : "Copy prompt"}</button>
            <a href="${escapeAttr(tutorUrl)}">${state.lang === "el" ? "Άνοιξε AI Βοήθεια →" : "Open AI Help →"}</a>
          </div>
          <p class="learning-activity-output__note">${state.lang === "el"
            ? "Στόχος: καθοδήγηση, όχι έτοιμη λύση. Στον ιστορικό διάλογο έλεγξε στο τέλος όσα ειπώθηκαν με το σχολικό υλικό."
            : "Goal: guidance, not a ready-made answer. In historical role-play, verify the claims against your school material at the end."}</p>
        `;
        const copyBtn = output.querySelector(".learning-activity-copy");
        if (copyBtn) {
          copyBtn.addEventListener("click", async () => {
            try {
              await navigator.clipboard.writeText(prompt);
              copyBtn.textContent = state.lang === "el" ? "Αντιγράφηκε ✓" : "Copied ✓";
            } catch (_) {
              fallbackCopy(prompt);
              copyBtn.textContent = state.lang === "el" ? "Αντιγράφηκε ✓" : "Copied ✓";
            }
          }, { once: true });
        }
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
    const zoneMax = ZONE_MAX_AGE[state.currentZone];

    // Ίδια λογική με το renderQuizResults: ένα εργαλείο δεν εμφανίζεται καθόλου αν δεν
    // περνάει το isToolAgeAppropriate (π.χ. μαθητής Δημοτικού βλέπει το μονοπάτι). Αν
    // περνάει ΜΟΝΟ επειδή ο ρόλος είναι "guardian" (αυτο-δηλωμένος, ανεπαλήθευτος), το
    // εργαλείο πάει σε κλειστό-από-προεπιλογή <details> στο τέλος, όχι απευθείας στο βήμα.
    function classifyTool(toolId) {
      const tool = toolId ? TOOLS[toolId] : null;
      if (!tool || !isToolAgeAppropriate(tool)) return { tool: null, adultOnly: false };
      const adultOnly =
        state.currentRole === "guardian" &&
        zoneMax !== undefined &&
        tool.minAge !== undefined &&
        tool.minAge > zoneMax;
      return { tool, adultOnly };
    }

    const adultOnlyEntries = [];

    const stepsHtml = steps.map((step, idx) => {
      const stepNum = idx + 1;
      const title = state.lang === "el" ? step.titleEl : step.titleEn;
      const desc = state.lang === "el" ? step.descriptionEl : step.descriptionEn;
      const { tool, adultOnly } = classifyTool(step.toolId);
      let toolLinkHtml = "";
      if (tool && !adultOnly) {
        toolLinkHtml = `<a class="path-step__tool-link" href="${escapeAttr("/tools/" + step.toolId + ".html")}" target="_blank" rel="noopener noreferrer">${escapeHtml(tool.name)} · ${t("detailsLink")}</a>`;
      } else if (tool && adultOnly) {
        adultOnlyEntries.push({ tool, toolId: step.toolId, stepNum });
      }
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

    // Επιπλέον προτεινόμενα εργαλεία: ό,τι υπάρχει στο GAP_TAGS.recommendedToolIds
    // αλλά ΔΕΝ εμφανίζεται ήδη στα βήματα παραπάνω. Προτεραιότητα σε πιο ειδικά/
    // advanced εργαλεία (isExpert ή συγκεκριμένα για το θέμα) πριν τα γενικά chatbots.
    const usedToolIds = new Set(steps.map((s) => s.toolId).filter(Boolean));
    const GENERIC_CHATBOTS = ["chatgpt", "claude", "gemini", "copilot"];
    const extraToolIds = (gap.recommendedToolIds || []).filter((id) => !usedToolIds.has(id) && TOOLS[id]);
    extraToolIds.sort((a, b) => {
      const aGeneric = GENERIC_CHATBOTS.includes(a) ? 1 : 0;
      const bGeneric = GENERIC_CHATBOTS.includes(b) ? 1 : 0;
      if (aGeneric !== bGeneric) return aGeneric - bGeneric;
      const aExpert = TOOLS[a].isExpert ? 0 : 1;
      const bExpert = TOOLS[b].isExpert ? 0 : 1;
      return aExpert - bExpert;
    });

    const regularExtraIds = [];
    extraToolIds.forEach((id) => {
      const { tool, adultOnly } = classifyTool(id);
      if (!tool) return;
      if (adultOnly) adultOnlyEntries.push({ tool, toolId: id, stepNum: null });
      else regularExtraIds.push(id);
    });

    const extraToolsHtml = regularExtraIds.length
      ? `
        <div class="path-extra-tools">
          <p class="path-extra-tools__label">${t("pathExtraToolsLabel")}</p>
          <div class="path-extra-tools__list">
            ${regularExtraIds.map((id) => {
              const t2 = TOOLS[id];
              return `<a class="path-extra-tools__link" href="${escapeAttr("/tools/" + id + ".html")}" target="_blank" rel="noopener noreferrer">${escapeHtml(t2.name)}${t2.isExpert ? " ⭐" : ""}</a>`;
            }).join("")}
          </div>
        </div>
      `
      : "";

    const adultSummaryText = state.lang === "el"
      ? `Δες προτάσεις και για εσένα (${adultOnlyEntries.length}), όχι για το παιδί`
      : `Show suggestions for you too (${adultOnlyEntries.length}), not for the child`;
    const adultToolsHtml = adultOnlyEntries.length
      ? `
        <details class="path-tool-adult-details" style="margin-top: 10px;">
          <summary style="cursor: pointer; font-size: 0.85rem; color: var(--color-accent); font-weight: 600;">${escapeHtml(adultSummaryText)}</summary>
          <div style="margin-top: 10px;">
            ${adultOnlyEntries.map(({ tool, toolId, stepNum }) => `
              <div class="path-extra-tools__item" style="margin-bottom: 6px;">
                ${stepNum ? `<span style="font-size:0.8rem;color:var(--color-text-muted);">${t("pathStepLabel", { step: stepNum })} · </span>` : ""}
                <a class="path-extra-tools__link" href="${escapeAttr("/tools/" + toolId + ".html")}" target="_blank" rel="noopener noreferrer">${escapeHtml(tool.name)}</a>
              </div>
            `).join("")}
          </div>
        </details>
      `
      : "";

    const pathTutorAvailable=isTutorViewAvailable(state.currentZone,state.currentRole);
    const pathPrompt=state.lang==="el"
      ? `Βοήθησέ με να δουλέψω τη δυσκολία «${label}». ${gap.explainEl||""} Μη μου δώσεις έτοιμη λύση. Ρώτησέ με πρώτα τι καταλαβαίνω ήδη, μετά δώσε μία μικρή υπόδειξη τη φορά και στο τέλος βάλε μου 2 νέες ερωτήσεις για να ελέγξω αν το κατάλαβα.`
      : `Help me work on the difficulty “${label}”. ${gap.explainEn||gap.explainEl||""} Do not give me the ready answer. First ask what I already understand, then give one small hint at a time, and finish with 2 new questions to check my understanding.`;
    const pathAiHtml=pathTutorAvailable?`
      <div class="path-ai-next" style="margin:14px 0;padding:13px;border:1px solid #bfe3d5;border-radius:12px;background:#f3fbf7;">
        <strong style="display:block;color:#175c4a;margin-bottom:4px;">${state.lang==="el"?"🤖 Δούλεψέ το με AI Βοήθεια":"🤖 Work on it with AI Help"}</strong>
        <p style="margin:0 0 10px;color:var(--color-text-muted);font-size:.86rem;line-height:1.5;">${state.lang==="el"?"Η AI θα ξεκινήσει από αυτή τη συγκεκριμένη δυσκολία και θα σε καθοδηγήσει χωρίς έτοιμη λύση.":"AI Help will start from this exact difficulty and guide you without a ready-made answer."}</p>
        <button type="button" class="path-ai-help-btn" style="border:0;border-radius:9px;background:var(--color-accent);color:#fff;padding:9px 13px;font:inherit;font-weight:700;cursor:pointer;">${state.lang==="el"?"Άνοιξε στην AI Βοήθεια →":"Open in AI Help →"}</button>
      </div>
    `:"";

    els.pathModal.innerHTML = `
      <button type="button" class="path-modal__close" aria-label="${t("pathModalClose")}">✕</button>
      <p class="path-modal__eyebrow">${t("pathModalTitle")}</p>
      <h3 class="path-modal__title">${escapeHtml(label)}</h3>
      <p class="path-modal__intro">${t("pathModalIntro")}</p>
      <div class="path-steps">${stepsHtml}</div>
      ${pathAiHtml}
      ${renderLearningActivities(gapId, gap)}
      <div class="path-self-check" data-gap-id="${escapeAttr(gapId)}" style="margin:14px 0;padding:13px;border:1px solid #d7e2ec;border-radius:12px;background:#fbfdff;">
        <strong style="display:block;margin-bottom:5px;">${state.lang==="el"?"Έλεγχος στο τέλος της διαδρομής":"End-of-path check"}</strong>
        <p style="margin:0 0 9px;color:var(--color-text-muted);font-size:.84rem;">${state.lang==="el"?"Δεν είναι βαθμός. Δήλωσε πού βρίσκεσαι τώρα για να ξέρεις το επόμενο βήμα.":"This is not a grade. Mark where you are now to choose the next step."}</p>
        <div style="display:flex;gap:7px;flex-wrap:wrap;">
          <button type="button" data-path-score="1" style="border:1px solid #cbd5e1;border-radius:9px;background:#fff;padding:7px 10px;cursor:pointer;">${state.lang==="el"?"1 · Θέλω κι άλλη βοήθεια":"1 · Need more help"}</button>
          <button type="button" data-path-score="2" style="border:1px solid #cbd5e1;border-radius:9px;background:#fff;padding:7px 10px;cursor:pointer;">${state.lang==="el"?"2 · Σχεδόν":"2 · Almost"}</button>
          <button type="button" data-path-score="3" style="border:1px solid #cbd5e1;border-radius:9px;background:#fff;padding:7px 10px;cursor:pointer;">${state.lang==="el"?"3 · Το κατάλαβα":"3 · Got it"}</button>
        </div>
        <span class="path-self-check__status" style="display:block;margin-top:7px;font-size:.8rem;color:#2e6f5e;"></span>
      </div>
      ${extraToolsHtml}
      ${adultToolsHtml}
    `;
    els.pathModal.querySelector(".path-modal__close").addEventListener("click", closeLearningPathModal);
    els.pathModal.querySelectorAll("[data-path-score]").forEach((btn)=>{
      btn.addEventListener("click",()=>{
        const score=Number(btn.dataset.pathScore)||0;
        const status=els.pathModal.querySelector(".path-self-check__status");
        if(status) status.textContent=state.lang==="el"?"Καταγράφηκε ως ανώνυμη ένδειξη προόδου.":"Saved as an anonymous progress signal.";
        els.pathModal.querySelectorAll("[data-path-score]").forEach((b)=>{ b.disabled=true; });
        try{
          if(typeof window.va!=="function") window.va=function(){(window.vaq=window.vaq||[]).push(arguments);};
          window.va("event",{name:"Learning Path Check",data:{score:String(score),zone:String(state.currentZone||""),role:String(state.currentRole||""),gap:String(gapId).slice(0,80)}});
        }catch(_){}
      });
    });
    const pathAiBtn=els.pathModal.querySelector(".path-ai-help-btn");
    if(pathAiBtn){
      pathAiBtn.addEventListener("click",()=>{
        const preferredSubject=state.quizSubjectId||state.currentSubject;
        closeLearningPathModal();
        state.currentSubject=preferredSubject||null;
        state.currentView="tutor";
        pushRoute();
        renderCurrentRoute();
        setTimeout(()=>{
          const subject=document.getElementById("tutorSubject");
          if(subject&&preferredSubject&&[...subject.options].some((o)=>o.value===preferredSubject)){
            subject.value=preferredSubject;
            subject.dispatchEvent(new Event("change",{bubbles:true}));
          }
          const input=document.getElementById("tutorInput");
          if(input){
            input.value=pathPrompt;
            input.dispatchEvent(new Event("input",{bubbles:true}));
            input.focus();
          }
        },80);
      });
    }
    bindLearningActivityActions(gapId, gap, label);
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
    els.quizContent.setAttribute("aria-live", "polite");
    els.quizContent.setAttribute("role", "group");
    els.quizContent.setAttribute("aria-label", t("quizQuestionOf", { current, total }));
    els.quizContent.innerHTML = `
      <p class="quiz-pick-heading">${t('parentQuizTitle')}</p>
      <div class="quiz-progress">${t("quizQuestionOf", { current, total })}</div>
      <p class="quiz-question-text" tabindex="-1">${escapeHtml(question.text)}</p>
      <div class="quiz-options">${optionsHtml}</div>
    `;
    const questionHeading = els.quizContent.querySelector(".quiz-question-text");
    if (questionHeading) questionHeading.focus();
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

  // ---------- Comparison Card (SVG): Γονιός vs Παιδί ----------
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
        <text x="200" y="365" font-size="12" fill="#5A6270" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">${isGreek ? 'Χάρτης Εξάσκησης' : 'Practice Map'}</text>
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
  const VALID_VIEWS = ["tools", "advanced", "prompts", "quiz", "tutor", "guide"];

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
    state.currentStudentAge = state.currentRole === "student" ? defaultStudentAge(zoneId) : null;
    state.currentView = VALID_VIEWS.includes(viewId) ? viewId : "tools";
    if (state.currentView === "tutor" && !isTutorViewAvailable(state.currentZone, state.currentRole)) {
      state.currentView = "tools";
    }
    state.currentSubject = null;
    state.currentNeed = null;
    resetQuizState();
  }

  function applyQuizDeepLink() {
    if (state.currentView !== "quiz") return;
    const params = new URLSearchParams(location.search);
    const gapId = params.get("gap");
    const quizId = params.get("quiz");
    const zoneQuizzes = getZoneQuizzes();
    const quiz = quizId && zoneQuizzes?.[quizId];
    if (quiz) {
      const requestedGrade = params.get("grade");
      state.quizGradeId = (quiz.grades || []).includes(requestedGrade)
        ? requestedGrade
        : ((quiz.grades || [])[0] || null);
      state.quizBrowseTopicsId = quiz.id;
      renderQuizView();
    }
    if (gapId && typeof LEARNING_PATHS !== "undefined" && LEARNING_PATHS[gapId]) {
      openLearningPathModal(gapId);
    }
  }

  // Ζωγραφίζει ό,τι χρειάζεται με βάση το ΤΡΕΧΟΝ state.
  // Δεν αγγίζει το URL: αυτό το κάνει ξεχωριστά το pushRoute().
  function renderCurrentRoute() {
    if (!state.currentZone) {
      els.pathView.hidden = true;
      els.zoneSelectView.hidden = false;
      renderContinueBanner();
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
    renderStudentAgeFilter();
    renderSubjectFilter();
    renderNeedFilter();
    renderPathContent();
    renderAdvancedTools();
    renderViewTabs();
    renderPromptList();
    if (state.currentView === "quiz") renderQuizView();
    if (state.currentView === "tutor") renderTutorView();
    if (state.currentView === "guide") renderGuide();
    updateDocumentTitle();
  }

  function updateDocumentTitle() {
    const base = "aitools4kids.gr";
    if (!state.currentZone) {
      document.title = `${base} — ${t("heroTitle")}`;
    } else {
      const zone = ZONES.find((z) => z.id === state.currentZone);
      const zoneLabel = zone ? (state.lang === "el" ? zone.labelEl : zone.labelEn) : "";
      const viewKey = "viewTab" + state.currentView.charAt(0).toUpperCase() + state.currentView.slice(1);
      document.title = `${zoneLabel} · ${t(viewKey)} · ${base}`;
    }

    const canonicalUrl = "https://www.aitools4kids.gr" + (location.pathname || "/");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", canonicalUrl);
  }

  // ---------- Η διαδρομή μου (τοπική πρόοδος, μόνο σε αυτή τη συσκευή) ----------
  // Αποθηκεύει ΜΟΝΟ το τελευταίο αποτέλεσμα διαγνωστικού (ζώνη, quiz, gap tags).
  // Καμία μεταφορά σε server, κανένα cookie: απλό localStorage, σβήνεται με ένα κλικ.
  const PROGRESS_KEY = "aitools4kids_progress_v1";

  function saveProgress(zoneId, quizId, gapTagIds) {
    if (!zoneId || !quizId) return;
    try {
      localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({ zoneId, quizId, gapTagIds, savedAt: Date.now() })
      );
    } catch (e) {
      // Private browsing ή απενεργοποιημένο localStorage: αγνόησε ήσυχα, δεν είναι κρίσιμο.
    }
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !data.zoneId || !data.quizId || !Array.isArray(data.gapTagIds)) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function clearProgress() {
    try {
      localStorage.removeItem(PROGRESS_KEY);
    } catch (e) {}
    renderContinueBanner();
  }

  function resumeProgress() {
    const progress = loadProgress();
    if (!progress) return;
    const zoneQuizzes = QUIZZES[progress.zoneId] || {};
    const quiz = zoneQuizzes[progress.quizId];
    if (!quiz) return; // το quiz μπορεί να έχει αφαιρεθεί/μετονομαστεί από τότε
    state.currentZone = progress.zoneId;
    state.currentRole = "guardian";
    state.currentStudentAge = null;
    state.currentSubject = null;
    state.currentView = "quiz";
    resetQuizState();
    state.quizGradeId = (quiz.grades && quiz.grades[0]) || null;
    state.quizSubjectId = progress.quizId;
    state.quizFinished = true;
    state.quizAnswers = progress.gapTagIds.map((tag) => ({ gapTag: tag }));
    pushRoute();
    renderCurrentRoute();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Εμφανίζεται μόνο στην αρχική (καμία ζώνη επιλεγμένη). Χτίζεται δυναμικά,
  // δεν χρειάζεται νέο στοιχείο στο index.html.
  function renderContinueBanner() {
    if (!els.zoneSelectView) return;
    const existing = document.getElementById("continueProgressBanner");
    if (existing) existing.remove();

    const progress = loadProgress();
    if (!progress) return;
    const zone = ZONES.find((z) => z.id === progress.zoneId);
    if (!zone) return;
    const zoneQuizzes = QUIZZES[progress.zoneId] || {};
    const quiz = zoneQuizzes[progress.quizId];
    if (!quiz) return;

    const zoneLabel = state.lang === "el" ? zone.labelEl : zone.labelEn;
    const quizLabel = state.lang === "el" ? quiz.subjectLabelEl : quiz.subjectLabelEn;
    const daysAgo = Math.floor((Date.now() - progress.savedAt) / (1000 * 60 * 60 * 24));
    const whenEl = daysAgo <= 0 ? "σήμερα" : daysAgo === 1 ? "χθες" : `πριν ${daysAgo} μέρες`;
    const whenEn = daysAgo <= 0 ? "today" : daysAgo === 1 ? "yesterday" : `${daysAgo} days ago`;
    const titleText = state.lang === "el" ? "Συνέχισε από εκεί που έμεινες" : "Continue where you left off";
    const subText = state.lang === "el"
      ? `${zoneLabel} · ${quizLabel} · αποθηκεύτηκε ${whenEl}, μόνο σε αυτή τη συσκευή`
      : `${zoneLabel} · ${quizLabel} · saved ${whenEn}, on this device only`;
    const continueText = state.lang === "el" ? "Συνέχισε →" : "Continue →";
    const clearText = state.lang === "el" ? "Διαγραφή αποθηκευμένης προόδου" : "Clear saved progress";

    const html = `
      <div id="continueProgressBanner" class="continue-progress-banner">
        <div>
          <p class="continue-progress-banner__title">${escapeHtml(titleText)}</p>
          <p class="continue-progress-banner__sub">${escapeHtml(subText)}</p>
        </div>
        <div class="continue-progress-banner__actions">
          <button type="button" id="continueProgressBtn" class="quiz-start-btn">${escapeHtml(continueText)}</button>
          <button type="button" id="clearProgressBtn" class="continue-progress-banner__clear">${escapeHtml(clearText)}</button>
        </div>
      </div>
    `;
    els.zoneSelectView.insertAdjacentHTML("afterbegin", html);
    const continueBtn = document.getElementById("continueProgressBtn");
    if (continueBtn) continueBtn.addEventListener("click", resumeProgress);
    const clearBtn = document.getElementById("clearProgressBtn");
    if (clearBtn) clearBtn.addEventListener("click", clearProgress);
  }

  // ---------- Navigation ----------
  function selectZone(zoneId) {
    state.currentZone = zoneId;
    state.currentRole = "guardian";
    state.currentStudentAge = null;
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
    state.currentStudentAge = roleId === "student" ? defaultStudentAge(state.currentZone) : null;
    if (state.currentView === "tutor" && !isTutorViewAvailable(state.currentZone, state.currentRole)) {
      state.currentView = "tools";
    }
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
    if (!state.currentZone) renderContinueBanner();
    if (state.currentZone) {
      renderRoleTabs();
      renderSubjectFilter();
      renderNeedFilter();
      renderPathContent();
      renderAdvancedTools();
      renderPromptList();
      if (state.currentView === "quiz") renderQuizView();
      if (state.currentView === "tutor") renderTutorView();
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
    if (els.a11yFilterToggle) {
      els.a11yFilterToggle.addEventListener("change", () => {
        state.a11yFilterOnly = els.a11yFilterToggle.checked;
        if (els.a11yFilterToggleAdvanced) els.a11yFilterToggleAdvanced.checked = state.a11yFilterOnly;
        renderPathContent();
        renderAdvancedTools();
      });
    }
    if (els.a11yFilterToggleAdvanced) {
      els.a11yFilterToggleAdvanced.addEventListener("change", () => {
        state.a11yFilterOnly = els.a11yFilterToggleAdvanced.checked;
        if (els.a11yFilterToggle) els.a11yFilterToggle.checked = state.a11yFilterOnly;
        renderPathContent();
        renderAdvancedTools();
      });
    }
    els.langElBtn.addEventListener("click", () => setLang("el"));
    els.langEnBtn.addEventListener("click", () => setLang("en"));
    els.viewTabTools.addEventListener("click", () => selectView("tools"));
    els.viewTabAdvanced.addEventListener("click", () => selectView("advanced"));
    els.viewTabPrompts.addEventListener("click", () => selectView("prompts"));
    els.viewTabQuiz.addEventListener("click", () => selectView("quiz"));
    els.viewTabTutor.addEventListener("click", () => selectView("tutor"));
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
    applyQuizDeepLink();

    // Back/forward browser buttons.
    window.addEventListener("popstate", () => {
      restoreStateFromPath(location.pathname);
      renderCurrentRoute();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
