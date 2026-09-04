/**
 * tutor.js
 * ------------------------------------------------------------
 * AI Help integration powered by Puter.js.
 * - No Puter script is loaded until the user explicitly clicks Connect.
 * - Primary-school student role does not expose this view (enforced in app.js).
 * - Parent/guardian role uses Parent Helper mode.
 * - Middle-school student mode asks age: 12 is blocked, 13-14 requires parental consent, 15 is allowed.
 * - High-school student mode is 15+.
 * - Uses existing QUIZZES -> GAP_TAGS -> LEARNING_PATHS as tutoring context.
 * - Optional push-to-talk speech input works through Puter speech-to-text.
 * - Optional spoken replies use the device/browser speech engine when available.
 * ------------------------------------------------------------
 */
(function () {
  "use strict";

  const MODEL_ID = "gpt-5.6-luna";
  const MODEL_PROVIDER = "openai";
  const PUTER_SRC = "https://js.puter.com/v2/";

  const TEXT = {
    el: {
      titleStudent: "AI Βοήθεια",
      titleParent: "Βοηθός Γονέα",
      subtitleStudent: "Δεν λύνει την άσκηση για εσένα. Σε καθοδηγεί με ερωτήσεις και μικρές υποδείξεις μέχρι να καταλάβεις το «γιατί».",
      subtitleParent: "Γράψε πού έχει κολλήσει το παιδί. Ο βοηθός θα σου προτείνει πώς να το καθοδηγήσεις, χωρίς να του δώσεις έτοιμη λύση.",
      signInTitle: "Σύνδεση για την AI Βοήθεια",
      signInIntro: "Ο οδηγός, το διαγνωστικό και οι προτάσεις λειτουργούν χωρίς λογαριασμό. Μόνο η προαιρετική AI Βοήθεια χρησιμοποιεί Puter για πρόσβαση στο μοντέλο AI.",
      connect: "Σύνδεση με Puter",
      switchAccount: "Αλλαγή λογαριασμού",
      notSignedIn: "Δεν έχει γίνει σύνδεση",
      openingPuter: "Ανοίγει το Puter…",
      connected: "Συνδεδεμένος: η AI Βοήθεια είναι έτοιμη",
      readyToConnect: "Έτοιμο για σύνδεση",
      connectHint: "· Πάτησε «Σύνδεση με Puter».",
      usage: "Διαθέσιμη δωρεάν χρήση",
      steps1: "1. Πάτησε «Σύνδεση με Puter».",
      steps2: "2. Στο παράθυρο Puter επίλεξε υπάρχοντα λογαριασμό ή Create Account. Η διαθέσιμη μέθοδος σύνδεσης ορίζεται από το Puter.",
      steps3: "3. Μετά την πρώτη εξουσιοδότηση, στον ίδιο browser η επόμενη χρήση είναι συνήθως πολύ πιο γρήγορη.",
      puterTerms: "Όροι Puter ↗",
      puterPrivacy: "Απόρρητο Puter ↗",
      settings: "Ρύθμιση μαθήματος",
      age: "Ηλικία μαθητή",
      chooseAge: "Διάλεξε ηλικία",
      age12: "12 ετών",
      age13_14: "13–14 ετών",
      age15: "15 ετών",
      consent: "Έχω τη συγκατάθεση γονέα/κηδεμόνα για τη χρήση του Puter από μαθητή 13–14 ετών.",
      grade: "Τάξη",
      subject: "Μάθημα",
      topic: "Θέμα / δυσκολία",
      modeParent: "Λειτουργία: Βοηθός Γονέα",
      modeParentText: "Ο βοηθός μιλά στον γονέα και προτείνει μία ερώτηση ή ένα βήμα κάθε φορά, ώστε το παιδί να σκεφτεί μόνο του.",
      modeStudent: "Λειτουργία: AI Βοήθεια μαθητή",
      modeStudentText: "Η AI Βοήθεια μιλά απευθείας στον μαθητή, μία βασική ερώτηση κάθε φορά, χωρίς να παραδίδει έτοιμη λύση.",
      allowed: "✓ Επιτρέπεται η λειτουργία",
      actionNeeded: "⚠ Χρειάζεται ενέργεια",
      primaryParent: "Στο Δημοτικό η λειτουργία είναι μόνο για γονέα/κηδεμόνα και χρησιμοποιείται με τον δικό του λογαριασμό Puter.",
      parentAllowed: "Ο γονέας/κηδεμόνας χρησιμοποιεί τον δικό του λογαριασμό Puter.",
      selectAgeMsg: "Διάλεξε πρώτα την ηλικία του μαθητή.",
      age12Blocked: "Στα 12 δεν επιτρέπουμε άμεση χρήση του Puter από τον μαθητή. Γύρισε στον ρόλο «Γονιός / Εκπαιδευτικός» για χρήση του Βοηθού Γονέα.",
      consentNeeded: "Για μαθητή 13–14 ετών χρειάζεται γονική συναίνεση πριν ενεργοποιηθεί η AI Βοήθεια.",
      consentOk: "Η γονική συναίνεση δηλώθηκε. Ο μαθητής πρέπει να χρησιμοποιεί δικό του λογαριασμό Puter.",
      age15Allowed: "Η AI Βοήθεια μπορεί να χρησιμοποιηθεί με προσωπικό λογαριασμό Puter.",
      highAllowed: "Μαθητής Λυκείου: η AI Βοήθεια μπορεί να χρησιμοποιηθεί με προσωπικό λογαριασμό Puter.",
      noContent: "Δεν υπάρχει ακόμη περιεχόμενο για αυτή την τάξη",
      generalHelp: "Γενική βοήθεια στο μάθημα",
      contextClass: "Τάξη",
      contextSubject: "Μάθημα",
      contextGoal: "Στόχος",
      contextPath: "Υπάρχον learning path",
      officialBasis: "Επίσημη βάση",
      officialSource: "Επίσημη πηγή",
      officialCatalog: "Κατάλογος σχολικών βιβλίων 2026–27",
      noPath: "Δεν υπάρχει ειδικό learning path.",
      newChat: "Νέα συζήτηση",
      emptyTitle: "Δοκίμασέ το με πραγματική σχολική απορία.",
      emptyStudent: "Γράψε τι δεν καταλαβαίνεις ή πού έχεις κολλήσει. Η AI Βοήθεια θα ξεκινήσει από τη δική σου προσπάθεια.",
      emptyParent: "Περιέγραψε τι δυσκολεύει το παιδί. Ο βοηθός θα σου προτείνει το επόμενο μικρό βήμα.",
      placeholder: "Γράψε την απορία ή την άσκηση εδώ…",
      placeholderConnect: "Συνδέσου πρώτα με Puter για να χρησιμοποιήσεις την AI Βοήθεια…",
      placeholderBlocked: "Η λειτουργία δεν είναι διαθέσιμη με αυτή την ηλικιακή ρύθμιση.",
      sample: "Βάλε παράδειγμα",
      send: "Στείλε",
      micStart: "🎤 Μίλα",
      micStop: "■ Σταμάτα",
      micListening: "Ηχογράφηση",
      micTranscribing: "Μεταγραφή φωνής…",
      micPermission: "Χρειάζεται άδεια μικροφώνου από τον browser.",
      micUnsupported: "Η φωνητική εισαγωγή δεν υποστηρίζεται από αυτόν τον browser.",
      micFailed: "Δεν μπόρεσα να μεταγράψω τη φωνή. Δοκίμασε ξανά ή γράψε την ερώτηση.",
      micEmpty: "Δεν αναγνωρίστηκε ομιλία. Δοκίμασε ξανά λίγο πιο κοντά στο μικρόφωνο.",
      micAutoStop: "Σταμάτησες να μιλάς: γίνεται μεταγραφή…",
      micAutoSend: "Η φωνή μεταγράφηκε: αποστολή…",
      voiceHint: "Γράψε ή πάτα 🎤 Μίλα. Όταν σταματήσεις να μιλάς, η ερώτηση μεταγράφεται και στέλνεται αυτόματα.",
      autoSpeak: "🔊 Να διαβάζει αυτόματα τις απαντήσεις",
      listen: "🔊 Άκουσε",
      stopListening: "■ Διακοπή",
      speechUnsupported: "Η προφορική ανάγνωση δεν υποστηρίζεται από αυτή τη συσκευή.",
      thinking: "Σκέφτεται…",
      you: "Εσύ",
      tutor: "AI Βοήθεια",
      parentHelper: "Βοηθός Γονέα",
      prototypeNote: "Σημαντικό: το AI μπορεί να κάνει λάθος. Για πραγματολογικές πληροφορίες ή σχολική ύλη έλεγξε την απάντηση σε αξιόπιστη πηγή ή στο σχολικό βιβλίο.",
      privacyNote: "Τα μηνύματα της AI Βοήθειας αποστέλλονται στην υπηρεσία Puter και στον πάροχο AI για να παραχθεί απάντηση. Αν χρησιμοποιήσεις το μικρόφωνο, το ηχητικό απόσπασμα αποστέλλεται μέσω Puter για μεταγραφή σε κείμενο. Το aitools4kids.gr δεν αποθηκεύει μηνύματα ή ηχογραφήσεις σε δική του βάση δεδομένων. Μην δίνεις προσωπικά ή ευαίσθητα δεδομένα.",
      authCancelled: "Η σύνδεση ακυρώθηκε",
      authFailed: "Η σύνδεση δεν ολοκληρώθηκε",
      consentFirst: "Πρώτα δήλωσε τη γονική συναίνεση",
      consentFirstHint: "· Τσέκαρε το σχετικό κουτάκι και ξαναπάτησε «Σύνδεση με Puter».",
      blockedAuth: "Η σύνδεση μαθητή δεν επιτρέπεται με αυτή την ηλικία",
      blockedAuthHint: "· Χρησιμοποίησε τον ρόλο γονέα για τον Βοηθό Γονέα.",
      loadFailed: "Δεν φορτώθηκε το Puter.js. Έλεγξε τη σύνδεση στο Internet και δοκίμασε ξανά.",
      callFailed: "Ο βοηθός δεν μπόρεσε να απαντήσει αυτή τη στιγμή. Δοκίμασε ξανά σε λίγο.",
      noResponse: "Δεν πήρα κείμενο απάντησης από το μοντέλο.",
      sampleParentGeneric: "Το παιδί μου έχει κολλήσει σε μια άσκηση. Πώς να το καθοδηγήσω χωρίς να του δώσω τη λύση;",
      sampleStudentGeneric: "Έχω κολλήσει σε μια άσκηση. Βοήθησέ με να τη σκεφτώ χωρίς να μου δώσεις κατευθείαν τη λύση.",
    },
    en: {
      titleStudent: "AI Help",
      titleParent: "Parent Helper",
      subtitleStudent: "It doesn't solve the exercise for you. It guides you with questions and small hints until you understand the why.",
      subtitleParent: "Describe where your child is stuck. The helper suggests how to guide them without handing over the answer.",
      signInTitle: "Sign in for AI Help",
      signInIntro: "The rest of aitools4kids.gr works without an account. Only this optional feature uses Puter to access the AI model.",
      connect: "Sign in with Puter",
      switchAccount: "Switch account",
      notSignedIn: "Not signed in",
      openingPuter: "Opening Puter…",
      connected: "Signed in: AI Help ready",
      readyToConnect: "Ready to sign in",
      connectHint: "· Click “Sign in with Puter”.",
      usage: "Free usage remaining",
      steps1: "1. Click “Sign in with Puter”.",
      steps2: "2. In the Puter window choose an existing account or Create Account. Available sign-in methods are controlled by Puter.",
      steps3: "3. After the first authorization, later use in the same browser is usually much faster.",
      puterTerms: "Puter Terms ↗",
      puterPrivacy: "Puter Privacy ↗",
      settings: "Lesson setup",
      age: "Student age",
      chooseAge: "Choose age",
      age12: "12 years old",
      age13_14: "13–14 years old",
      age15: "15 years old",
      consent: "I have parent/guardian consent for a 13–14-year-old student to use Puter.",
      grade: "Grade",
      subject: "Subject",
      topic: "Topic / difficulty",
      modeParent: "Mode: Parent Helper",
      modeParentText: "The helper talks to the parent and suggests one question or step at a time so the child does the thinking.",
      modeStudent: "Mode: Student AI Help",
      modeStudentText: "AI Help speaks directly to the student, one main question at a time, without handing over a finished solution.",
      allowed: "✓ Feature available",
      actionNeeded: "⚠ Action needed",
      primaryParent: "For Primary School, this feature is only for a parent/guardian using their own Puter account.",
      parentAllowed: "The parent/guardian uses their own Puter account.",
      selectAgeMsg: "Choose the student's age first.",
      age12Blocked: "At age 12 we do not allow direct student use of Puter. Switch to the Parent / Educator role to use Parent Helper.",
      consentNeeded: "A 13–14-year-old student needs parent/guardian consent before AI Help can be enabled.",
      consentOk: "Parent/guardian consent has been declared. The student must use their own Puter account.",
      age15Allowed: "AI Help can be used with a personal Puter account.",
      highAllowed: "High-school student: AI Help can be used with a personal Puter account.",
      noContent: "No content yet for this grade",
      generalHelp: "General help with this subject",
      contextClass: "Grade",
      contextSubject: "Subject",
      contextGoal: "Goal",
      contextPath: "Existing learning path",
      officialBasis: "Official basis",
      officialSource: "Official source",
      officialCatalog: "Official 2026–27 textbook catalog",
      noPath: "No specific learning path is available.",
      newChat: "New chat",
      emptyTitle: "Try it with a real school question.",
      emptyStudent: "Write what you don't understand or where you're stuck. AI Help will start from your own attempt.",
      emptyParent: "Describe what your child is struggling with. The helper will suggest the next small step.",
      placeholder: "Write the question or exercise here…",
      placeholderConnect: "Sign in with Puter first to use AI Help…",
      placeholderBlocked: "This feature is not available with the current age setting.",
      sample: "Insert example",
      send: "Send",
      micStart: "🎤 Speak",
      micStop: "■ Stop",
      micListening: "Recording",
      micTranscribing: "Transcribing voice…",
      micPermission: "Microphone permission is required in your browser.",
      micUnsupported: "Voice input is not supported by this browser.",
      micFailed: "I couldn't transcribe the voice. Try again or type your question.",
      micEmpty: "No speech was recognized. Try again a little closer to the microphone.",
      micAutoStop: "You stopped speaking: transcribing…",
      micAutoSend: "Voice transcribed: sending…",
      voiceHint: "Type or tap 🎤 Speak. When you stop talking, your question is transcribed and sent automatically.",
      autoSpeak: "🔊 Read replies aloud automatically",
      listen: "🔊 Listen",
      stopListening: "■ Stop",
      speechUnsupported: "Spoken playback is not supported by this device.",
      thinking: "Thinking…",
      you: "You",
      tutor: "AI Βοήθεια",
      parentHelper: "Parent Helper",
      prototypeNote: "Important: AI can make mistakes. Check factual information and school content against a reliable source or textbook.",
      privacyNote: "AI Help messages are sent to Puter and the AI provider to generate a response. If you use the microphone, the audio clip is sent through Puter for speech-to-text transcription. aitools4kids.gr does not store messages or recordings in its own database. Do not enter personal or sensitive information.",
      authCancelled: "Sign-in cancelled",
      authFailed: "Sign-in did not complete",
      consentFirst: "Declare parent/guardian consent first",
      consentFirstHint: "· Tick the consent box and click “Sign in with Puter” again.",
      blockedAuth: "Student sign-in is not allowed at this age",
      blockedAuthHint: "· Use the parent role for Parent Helper.",
      loadFailed: "Puter.js could not load. Check your Internet connection and try again.",
      callFailed: "The helper could not answer right now. Please try again in a moment.",
      noResponse: "The model returned no text response.",
      sampleParentGeneric: "My child is stuck on an exercise. How can I guide them without giving away the solution?",
      sampleStudentGeneric: "I'm stuck on an exercise. Help me think it through without giving me the answer straight away.",
    },
  };

  let mount = null;
  let ctx = null;
  let refs = {};
  let conversation = [];
  let busy = false;
  let authReady = false;
  let signedInUser = null;
  let puterLoadPromise = null;
  let renderKey = "";
  let mediaRecorder = null;
  let micStream = null;
  let audioChunks = [];
  let recording = false;
  let transcribing = false;
  let recordingTimer = null;
  let recordingStartedAt = 0;
  let speakingButton = null;
  let currentUtterance = null;
  let speechSession = 0;
  let audioPlayerUnlocked = false;
  let vadAudioContext = null;
  let vadSource = null;
  let vadAnalyser = null;
  let vadData = null;
  let vadTimer = null;
  let speechDetected = false;
  let lastSpeechAt = 0;
  let vadNoiseFloor = 0.008;

  function tr(key) {
    const lang = ctx?.lang === "en" ? "en" : "el";
    return TEXT[lang][key] || TEXT.el[key] || key;
  }

  function langValue(obj, elKey, enKey, fallback = "") {
    if (!obj) return fallback;
    return ctx?.lang === "en" ? (obj[enKey] || obj[elKey] || fallback) : (obj[elKey] || obj[enKey] || fallback);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function unique(arr) {
    return [...new Set(arr)];
  }

  function isParentMode() {
    return ctx?.roleId === "guardian" || ctx?.zoneId === "primary";
  }

  function getCatalogSubject() {
    const catalog = window.AITOOLSKIDS_TUTOR_CATALOG;
    if (!catalog || !refs.subject?.value || !refs.grade?.value) return null;
    return catalog.getSubject?.(ctx.zoneId, refs.grade.value, refs.subject.value) || null;
  }

  function getCurrentQuiz() {
    const subject = getCatalogSubject();
    const quizId = subject?.quizId || subject?.id || refs.subject?.value;
    return (QUIZZES[ctx.zoneId] || {})[quizId] || null;
  }

  function getCurrentSubject() {
    return getCatalogSubject() || getCurrentQuiz();
  }

  function getCurrentGap() {
    const id = refs.topic?.value;
    if (!id) return null;
    return GAP_TAGS[id] || getCatalogSubject()?.topics?.find((topic) => topic.id === id) || null;
  }

  function getOfficialCurriculumEntry() {
    const layer = window.AITOOLSKIDS_OFFICIAL_CURRICULUM;
    const subject = getCatalogSubject();
    if (subject?.curriculum) return subject.curriculum;
    const quiz = getCurrentQuiz();
    if (!layer || !quiz?.id) return null;
    return layer.getByQuizId?.(quiz.id) || layer.byQuiz?.[quiz.id] || null;
  }

  function getOfficialGapAlignment() {
    const layer = window.AITOOLSKIDS_OFFICIAL_CURRICULUM;
    const gap = getCurrentGap();
    const catalogSubject = getCatalogSubject();
    if (catalogSubject && gap?.id) {
      const annuallyVerified = catalogSubject.curriculum?.annualInstructionsStatus === "2026-27-verified";
      return {
        status: annuallyVerified ? "exact-section-verified" : "official-course-topic-anchor",
        statusLabelEl: annuallyVerified
          ? (gap.optional ? "Προαιρετική ενότητα της οδηγίας" : "Ενότητα της επίσημης οδηγίας")
          : "Θέμα πλοήγησης: δεν έχει ακόμη επαληθευτεί ως ύλη 2026–27",
        statusLabelEn: annuallyVerified
          ? (gap.optional ? "Optional topic in the guidance" : "Topic in the official guidance")
          : "Navigation topic, not yet verified as 2026–27 scope",
        sectionEl: annuallyVerified ? gap.labelEl : "",
        sectionEn: annuallyVerified ? gap.labelEn : "",
        topicAnchorEl: gap.labelEl,
        topicAnchorEn: gap.labelEn,
        annualScopeVerified: annuallyVerified,
        sourceUrl: catalogSubject.curriculum?.annualInstructionsUrl || "",
      };
    }
    if (!layer || !gap?.id) return null;
    return layer.getGapAlignment?.(gap.id) || layer.gapAlignment?.[gap.id] || null;
  }

  function officialValue(entry, elKey, enKey, fallback = "") {
    if (!entry) return fallback;
    return ctx?.lang === "en" ? (entry[enKey] || entry[elKey] || fallback) : (entry[elKey] || entry[enKey] || fallback);
  }

  function buildOfficialCurriculumPrompt() {
    const layer = window.AITOOLSKIDS_OFFICIAL_CURRICULUM;
    const entry = getOfficialCurriculumEntry();
    if (!layer || !entry) {
      return `OFFICIAL CURRICULUM STATUS\n- No verified curriculum-layer entry is available for this selection. Do NOT claim Ministry/IEP alignment for this topic.`;
    }
    const gapAlignment = getOfficialGapAlignment();
    const book = entry.officialBook;
    const sections = ctx?.lang === "en"
      ? (entry.officialSectionsEn?.length ? entry.officialSectionsEn : entry.officialSectionsEl || [])
      : (entry.officialSectionsEl || []);
    const lines = [
      `OFFICIAL GREEK CURRICULUM LAYER`,
      `- School year: ${entry.schoolYear || layer.meta?.schoolYear || "2026-2027"}`,
      `- Verification status: ${entry.coverageStatus || "unknown"}`,
      `- Verified on: ${entry.verificationDate || layer.meta?.lastVerified || "unknown"}`,
    ];
    if (book?.titleEl) lines.push(`- Official textbook: ${ctx?.lang === "en" ? (book.titleEn || book.titleEl) : book.titleEl}`);
    if (book?.url) lines.push(`- Official textbook URL: ${book.url}`);
    else if (entry.catalogUrl) lines.push(`- Official textbook catalog: ${entry.catalogUrl}`);
    if (gapAlignment) {
      const status = gapAlignment.status || "unknown";
      lines.push(`- Gap-alignment status: ${status}`);
      if ((status === "exact-section-verified" || status === "related-section-verified") && gapAlignment.sectionEl) {
        lines.push(`- Verified official section related to the selected learning gap: ${gapAlignment.sectionEl}`);
        if (gapAlignment.annualScopeVerified) lines.push(`- This gap mapping is also verified against the recorded 2026-27 annual examinable scope.`);
      } else if (status === "curriculum-mismatch-review-needed") {
        lines.push(`- CURRICULUM MISMATCH WARNING: the current quiz/topic does not match the currently verified official course scope for the declared grade/subject.`);
        lines.push(`- Do NOT claim that this topic belongs to the official curriculum of this grade. Treat help as general educational support only until the quiz is corrected.`);
      } else {
        const anchor = ctx?.lang === "en" ? (gapAlignment.topicAnchorEn || gapAlignment.topicAnchorEl) : (gapAlignment.topicAnchorEl || gapAlignment.topicAnchorEn);
        if (anchor) lines.push(`- Curriculum topic anchor (NOT section-level verified): ${anchor}`);
        lines.push(`- Do not cite this anchor as an official chapter/section or as proof that it is examinable this year.`);
      }
      const gapNote = ctx?.lang === "en" ? (gapAlignment.noteEn || gapAlignment.noteEl) : (gapAlignment.noteEl || gapAlignment.noteEn);
      if (gapNote) lines.push(`- Gap-alignment note: ${gapNote}`);
      if (gapAlignment.sourceUrl) lines.push(`- Gap source: ${gapAlignment.sourceUrl}`);
    }
    if (sections.length) {
      lines.push(`- Verified textbook scope/index:`);
      for (const section of sections.slice(0, 12)) lines.push(`  • ${section}`);
    }
    const scopeNote = officialValue(entry, "scopeNoteEl", "scopeNoteEn");
    if (scopeNote) lines.push(`- Scope note: ${scopeNote}`);
    lines.push(`- Annual ${entry.schoolYear || "2026-2027"} teaching-instructions status: ${entry.annualInstructionsStatus || "unknown"}`);
    if (entry.annualInstructionsUrl) lines.push(`- Official annual-syllabus/instructions source: ${entry.annualInstructionsUrl}`);
    const annualNote = officialValue(entry, "annualInstructionsNoteEl", "annualInstructionsNoteEn");
    if (annualNote) lines.push(`- Annual-instructions note: ${annualNote}`);
    lines.push(``, `SOURCE-DISCIPLINE RULES`,
      `A. Treat "catalog-verified" only as proof that the grade/subject appears in the official 2026-27 textbook package. It is NOT chapter-level or annual-syllabus verification.`,
      `B. Treat "official-book-verified" as verification of the official textbook only. Do not infer that every chapter is taught/examined this year.`,
      `C. Treat "book-index-verified" as verified textbook contents/scope, but still keep annual teaching/exam instructions separate.`,
      `D. When an exact or related gap-to-section mapping is supplied, prefer that section's terminology, sequence and expected level.`,
      `D2. "official-course-topic-anchor" and "catalog-topic-anchor" are navigation aids only. They are NOT official chapter titles and NOT section-level verification.`,
      `D3. "curriculum-mismatch-review-needed" means you MUST NOT claim official grade alignment; answer only as general educational support and, when relevant, say the site's curriculum mapping is under review.`,
      `E. Never say "this is in the 2026-27 taught/examined syllabus" unless annual instructions are explicitly marked verified.`,
      `F. If the learner asks something outside verified scope, you may explain it as general knowledge only if useful, but clearly avoid presenting it as required Greek-school curriculum.`,
      `G. Prefer methods and terminology compatible with the official textbook; do not introduce a more advanced method as if it were the expected classroom method.`,
      `H. If verified source context conflicts with your general memory, follow the verified source context and acknowledge uncertainty rather than silently overriding it.`
    );
    return lines.join("\n");
  }

  function getPathForGap(gapId) {
    return LEARNING_PATHS[gapId] || [];
  }

  function getGapTagsForQuiz(quiz) {
    if (!quiz) return [];
    const tags = [];
    for (const q of quiz.questions || []) {
      for (const option of q.options || []) {
        if (option.gapTag) tags.push(option.gapTag);
      }
    }
    return unique(tags).filter((id) => GAP_TAGS[id]);
  }

  function getSelectedGradeLabel() {
    const opt = refs.grade?.options?.[refs.grade.selectedIndex];
    return opt ? opt.textContent : "";
  }

  function accessState() {
    if (!ctx) return { allowed: false, type: "blocked", message: "" };
    if (ctx.zoneId === "primary" && ctx.roleId === "student") {
      return { allowed: false, type: "blocked", message: tr("age12Blocked") };
    }
    if (isParentMode()) {
      return {
        allowed: true,
        type: "parent",
        message: ctx.zoneId === "primary" ? tr("primaryParent") : tr("parentAllowed"),
      };
    }
    if (ctx.zoneId === "high") {
      return { allowed: true, type: "student", message: tr("highAllowed") };
    }
    const age = refs.age?.value || "";
    if (!age) return { allowed: false, type: "age", message: tr("selectAgeMsg") };
    if (age === "12") return { allowed: false, type: "blocked", message: tr("age12Blocked") };
    if (age === "13-14" && !refs.consent?.checked) {
      return { allowed: false, type: "consent", message: tr("consentNeeded") };
    }
    if (age === "13-14") return { allowed: true, type: "student", message: tr("consentOk") };
    return { allowed: true, type: "student", message: tr("age15Allowed") };
  }

  function formatUser(user) {
    if (!user) return "";
    return user.username || user.email || user.name || user.uuid || "Puter";
  }

  function usagePercent(usage) {
    const info = usage?.allowanceInfo || {};
    const total = Number(info.monthUsageAllowance);
    const remaining = Number(info.remaining);
    if (!Number.isFinite(total) || total <= 0 || !Number.isFinite(remaining)) return null;
    return Math.max(0, Math.min(100, Math.round((remaining / total) * 100)));
  }

  function ensurePuterLoaded() {
    if (window.puter) return Promise.resolve(window.puter);
    if (puterLoadPromise) return puterLoadPromise;
    puterLoadPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${PUTER_SRC}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(window.puter), { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = PUTER_SRC;
      script.async = true;
      script.onload = () => resolve(window.puter);
      script.onerror = () => reject(new Error(tr("loadFailed")));
      document.head.appendChild(script);
    });
    return puterLoadPromise;
  }

  function renderAccessGate() {
    if (!refs.accessGate) return;
    const gate = accessState();
    refs.accessGate.classList.toggle("tutor-access--good", gate.allowed);
    refs.accessGate.innerHTML = `<strong>${escapeHtml(gate.allowed ? tr("allowed") : tr("actionNeeded"))}</strong><br>${escapeHtml(gate.message)}`;
    updateComposerState();
  }

  function renderModeBox() {
    if (!refs.modeBox) return;
    const parent = isParentMode();
    refs.modeBox.innerHTML = parent
      ? `<strong>${escapeHtml(tr("modeParent"))}</strong><span>${escapeHtml(tr("modeParentText"))}</span>`
      : `<strong>${escapeHtml(tr("modeStudent"))}</strong><span>${escapeHtml(tr("modeStudentText"))}</span>`;
  }

  function populateGrades() {
    refs.grade.innerHTML = "";

    // Defensive fallback: the Tutor must never stop initializing just because
    // navigation metadata is missing. Prefer the shared GRADES map; if it is
    // unavailable, infer grade ids from the quizzes themselves.
    const sharedGrades = (typeof GRADES !== "undefined" && GRADES?.[ctx.zoneId]) || [];
    const fallbackLabels = {
      primary: {
        a: ["Α' Δημοτικού", "1st Grade"], b: ["Β' Δημοτικού", "2nd Grade"],
        c: ["Γ' Δημοτικού", "3rd Grade"], d: ["Δ' Δημοτικού", "4th Grade"],
        e: ["Ε' Δημοτικού", "5th Grade"], st: ["ΣΤ' Δημοτικού", "6th Grade"],
      },
      middle: {
        a: ["Α' Γυμνασίου", "7th Grade"], b: ["Β' Γυμνασίου", "8th Grade"],
        c: ["Γ' Γυμνασίου", "9th Grade"],
      },
      high: {
        a: ["Α' Λυκείου", "10th Grade"], b: ["Β' Λυκείου", "11th Grade"],
        c: ["Γ' Λυκείου", "12th Grade"],
      },
    };

    let gradeList = sharedGrades;
    if (!gradeList.length && typeof QUIZZES !== "undefined") {
      const ids = [...new Set(Object.values(QUIZZES[ctx.zoneId] || {}).flatMap((q) => q.grades || []))];
      gradeList = ids.map((id) => {
        const labels = fallbackLabels[ctx.zoneId]?.[id] || [id, id];
        return { id, labelEl: labels[0], labelEn: labels[1] };
      });
    }

    for (const grade of gradeList) {
      const option = document.createElement("option");
      option.value = grade.id;
      option.textContent = langValue(grade, "labelEl", "labelEn", grade.id);
      refs.grade.appendChild(option);
    }
    populateSubjects();
  }

  function populateSubjects() {
    const gradeId = refs.grade.value;
    const quizzes = Object.values(QUIZZES[ctx.zoneId] || {}).filter((q) => (q.grades || []).includes(gradeId));
    const catalogSubjects = window.AITOOLSKIDS_TUTOR_CATALOG?.getSubjects?.(ctx.zoneId, gradeId) || [];
    const represented = new Set(catalogSubjects.map((subject) => subject.quizId || subject.id));
    const subjects = catalogSubjects.concat(quizzes.filter((quiz) => !represented.has(quiz.id)));
    refs.subject.innerHTML = "";
    for (const subject of subjects) {
      const option = document.createElement("option");
      option.value = subject.id;
      option.textContent = langValue(subject, "subjectLabelEl", "subjectLabelEn", subject.id);
      refs.subject.appendChild(option);
    }
    if (!subjects.length) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = tr("noContent");
      refs.subject.appendChild(option);
    }
    populateTopics();
  }

  function populateTopics() {
    const quiz = getCurrentQuiz();
    const catalogTopics = getCatalogSubject()?.topics || [];
    const tags = catalogTopics.length ? catalogTopics.map((topic) => topic.id) : getGapTagsForQuiz(quiz);
    refs.topic.innerHTML = "";
    for (const id of tags) {
      const gap = GAP_TAGS[id] || catalogTopics.find((topic) => topic.id === id);
      const option = document.createElement("option");
      option.value = id;
      option.textContent = langValue(gap, "labelEl", "labelEn", id);
      refs.topic.appendChild(option);
    }
    if (!tags.length) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = tr("generalHelp");
      refs.topic.appendChild(option);
    }
    renderContext();
    resetConversation(false);
  }

  function renderContext() {
    const subject = getCurrentSubject();
    const gap = getCurrentGap();
    const path = gap ? getPathForGap(gap.id) : [];
    const pathSummary = path.length
      ? path.map((step, i) => `${i + 1}. ${escapeHtml(langValue(step, "titleEl", "titleEn", ""))}`).join("<br>")
      : escapeHtml(tr("noPath"));

    const official = getOfficialCurriculumEntry();
    const officialBook = official?.officialBook;
    const officialLabel = official ? officialValue(official, "coverageLabelEl", "coverageLabelEn", official.coverageStatus || "") : "";
    const sourceUrl = officialBook?.url || official?.catalogUrl || "";
    const sourceName = officialBook
      ? (ctx.lang === "en" ? (officialBook.titleEn || officialBook.titleEl) : officialBook.titleEl)
      : officialValue(official, "sourceLabelEl", "sourceLabelEn", tr("officialCatalog"));
    const gapOfficial = getOfficialGapAlignment();
    const gapStatusLabel = gapOfficial ? officialValue(gapOfficial, "statusLabelEl", "statusLabelEn", gapOfficial.status || "") : "";
    const mismatch = gapOfficial?.status === "curriculum-mismatch-review-needed";
    const officialHtml = official ? `<br><br>
      <b>${escapeHtml(tr("officialBasis"))}:</b> ${escapeHtml(officialLabel)}<br>
      ${sourceUrl ? `<a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(sourceName)} ↗</a>` : ""}
      ${gapStatusLabel ? `<br><span${mismatch ? ' style="color:#b45309;font-weight:700"' : ""}>${escapeHtml(gapStatusLabel)}</span>` : ""}` : "";

    refs.contextBox.innerHTML = `
      <b>${escapeHtml(tr("contextClass"))}:</b> ${escapeHtml(getSelectedGradeLabel())}<br>
      <b>${escapeHtml(tr("contextSubject"))}:</b> ${escapeHtml(langValue(subject, "subjectLabelEl", "subjectLabelEn", ":"))}<br>
      <b>${escapeHtml(tr("contextGoal"))}:</b> ${escapeHtml(langValue(gap, "labelEl", "labelEn", tr("generalHelp")))}<br><br>
      <b>${escapeHtml(tr("contextPath"))}:</b><br>${pathSummary}${officialHtml}
    `;
  }

  async function refreshAuthStatus() {
    if (!window.puter) {
      authReady = false;
      signedInUser = null;
      updateAuthUi();
      return;
    }
    try {
      authReady = !!window.puter.auth?.isSignedIn?.();
    } catch (_) {
      authReady = false;
    }
    if (authReady) {
      try { signedInUser = await window.puter.auth.getUser(); } catch (_) { signedInUser = null; }
    } else {
      signedInUser = null;
    }
    updateAuthUi();

    if (authReady) {
      try {
        const usage = await window.puter.auth.getMonthlyUsage();
        const pct = usagePercent(usage);
        if (pct !== null) {
          refs.usageText.textContent = `${pct}%`;
          refs.usageBar.style.width = `${pct}%`;
          refs.usageWrap.hidden = false;
        } else {
          refs.usageWrap.hidden = true;
        }
      } catch (_) {
        refs.usageWrap.hidden = true;
      }
    }
  }

  function updateAuthUi() {
    if (!refs.authDot) return;
    if (!authReady) {
      refs.authDot.classList.remove("tutor-auth-dot--on");
      refs.authStatus.textContent = tr("notSignedIn");
      refs.authUser.textContent = "";
      refs.signIn.hidden = false;
      refs.switchAccount.hidden = true;
      refs.usageWrap.hidden = true;
    } else {
      refs.authDot.classList.add("tutor-auth-dot--on");
      refs.authStatus.textContent = tr("connected");
      refs.authUser.textContent = signedInUser ? `· ${formatUser(signedInUser)}` : "";
      refs.signIn.hidden = true;
      refs.switchAccount.hidden = false;
    }
    updateComposerState();
  }

  function updateComposerState() {
    if (!refs.input || !refs.send) return;
    const allowed = accessState().allowed;
    const canChat = allowed && authReady && !busy;
    refs.input.disabled = !canChat;
    refs.send.disabled = !canChat;
    refs.sample.disabled = !allowed;
    if (!allowed) refs.input.placeholder = tr("placeholderBlocked");
    else if (!authReady) refs.input.placeholder = tr("placeholderConnect");
    else refs.input.placeholder = tr("placeholder");
    setMicUi();
  }

  async function explicitSignIn(requestAuth) {
    const gate = accessState();
    if (!gate.allowed) {
      renderAccessGate();
      refs.authBox.classList.add("tutor-auth-status--attention");
      if (gate.type === "consent") {
        refs.authStatus.textContent = tr("consentFirst");
        refs.authUser.textContent = tr("consentFirstHint");
        refs.consent?.focus();
      } else {
        refs.authStatus.textContent = tr("blockedAuth");
        refs.authUser.textContent = tr("blockedAuthHint");
        refs.age?.focus();
      }
      setTimeout(() => refs.authBox?.classList.remove("tutor-auth-status--attention"), 3500);
      return;
    }

    refs.authBox.classList.remove("tutor-auth-status--attention");
    refs.authStatus.textContent = tr("openingPuter");
    refs.authUser.textContent = "";

    try {
      await ensurePuterLoaded();
      if (!window.puter) throw new Error(tr("loadFailed"));
      if (window.puter.auth?.isSignedIn?.() && !requestAuth) {
        await refreshAuthStatus();
        return;
      }
      await window.puter.auth.signIn(requestAuth ? { request_auth: true } : undefined);
      await refreshAuthStatus();
    } catch (err) {
      const code = err?.error || "";
      const msg = err?.msg || err?.message || String(err);
      refs.authStatus.textContent = code === "auth_window_closed" ? tr("authCancelled") : tr("authFailed");
      refs.authUser.textContent = msg ? `· ${msg}` : "";
      authReady = false;
      updateComposerState();
    }
  }

  function buildSystemPrompt() {
    const subject = getCurrentSubject();
    const gap = getCurrentGap();
    const path = gap ? getPathForGap(gap.id) : [];
    const parentMode = isParentMode();
    const languageName = ctx.lang === "en" ? "English" : "Greek";
    const pathText = path.map((step, i) => {
      const title = langValue(step, "titleEl", "titleEn", "");
      const desc = langValue(step, "descriptionEl", "descriptionEn", "");
      return `Step ${i + 1}: ${title}. ${desc}`;
    }).join("\n");
    const ageText = ctx.zoneId === "high" ? "15-18" : (refs.age?.value || "13+");
    const officialCurriculumText = buildOfficialCurriculumPrompt();

    return `You are the AI Tutor for AI Tools for Kids. Your goal is UNDERSTANDING, not producing finished schoolwork.

CONTEXT
- Grade: ${getSelectedGradeLabel()}
- Subject: ${langValue(subject, "subjectLabelEl", "subjectLabelEn", "general school subject")}
- Focus: ${langValue(gap, "labelEl", "labelEn", "general question")}
- Likely learning difficulty: ${langValue(gap, "explainEl", "explainEn", "no specific difficulty defined")}
${pathText ? `- Existing learning path:\n${pathText}` : ""}
- Mode: ${parentMode ? "PARENT/GUARDIAN" : `STUDENT ${ageText}`}
- Reply primarily in ${languageName}, unless the school subject or the user's question clearly calls for another language.

${officialCurriculumText}

TUTORING RULES
1. Do not immediately give the final answer or a fully solved exercise. Ask for the learner's attempt or thinking first.
2. Ask ONE main question at a time. Keep replies concise and clear.
3. If the attempt is wrong, identify the specific misconception and give a small hint, not the solution.
4. If the learner remains stuck, show an ANALOGOUS example with different numbers/words, then return to the original exercise.
5. Adapt vocabulary, length and difficulty to the selected grade.
6. Once the learner reaches the correct answer, ask them to explain why in their own words, then ask one small transfer/check question.
7. Never pretend certainty. For factual material, state uncertainty when needed and recommend checking a reliable source or textbook.
8. Use the learning path as pedagogical context, but never mention internal ids, gap tags or site implementation details.
9. If the user asks for “just the answer”, briefly explain that the tutor is designed to help them find it, then provide the next useful hint.
10. Do not write an essay or assignment that could be submitted as-is. Help with structure, questions, feedback and improvement of the learner's own work.
11. CONTINUITY: every new user message belongs to the current conversation. Never re-introduce yourself or restart unless the user presses New chat. Interpret short answers using your immediately previous question.
12. FORMATTING: use simple school-friendly text. Avoid LaTeX and code formatting for ordinary school maths. Write e.g. -2/3, -0.67, 3/4.
13. PRIVACY / MINIMIZATION: never ask for or encourage the learner's full name, school/class identifier, home address, phone number, email, passwords, health information or other personal/sensitive details. They are not needed for tutoring. If the user volunteers such information, do not repeat it unnecessarily; briefly say it is not needed and continue with the school question.
14. FORMATIVE-ONLY ASSESSMENT: do not present yourself as an official grader, diagnostician or decision-maker. Do not label the learner as "weak", "gifted", "bad at maths", etc.; do not diagnose a learning difficulty; do not predict future performance or recommend an educational track as a decision. You may give specific formative feedback about the CURRENT attempt or topic (for example, "this topic needs more practice") and explain mistakes.

${parentMode ? `PARENT MODE
- Speak to the parent, not directly to the child.
- Suggest exactly one simple question the parent can ask the child now.
- If useful, explain in 1-2 sentences what misconception may be present.
- Never ask a minor to create an account or use an external AI service.` : `STUDENT MODE
- Speak directly and naturally to the student.
- Start from what they have already tried, not from a lecture.`}

Priority 1: make the learner think. Priority 2: give correct help. Priority 3: reach the solution.`;
  }

  function extractText(resp) {
    if (typeof resp === "string") return resp;
    if (typeof resp?.text === "string") return resp.text;
    const content = resp?.message?.content;
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content.map((x) => typeof x === "string" ? x : (x?.text || "")).join("").trim();
    }
    return "";
  }

  function micSupported() {
    return !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
  }

  function speechSupported() {
    return !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
  }

  function cleanSpeechText(text) {
    return String(text || "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[*_#`>|]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getSpeechLang() {
    return ctx?.lang === "en" ? "en-GB" : "el-GR";
  }

  function isMobileLike() {
    const ua = navigator.userAgent || "";
    return /Android|iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  }

  function makeSilentWavBlob() {
    const sampleRate = 8000;
    const samples = 400; // 50 ms
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);
    writeAscii(view, 0, "RIFF");
    view.setUint32(4, 36 + samples * 2, true);
    writeAscii(view, 8, "WAVE");
    writeAscii(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeAscii(view, 36, "data");
    view.setUint32(40, samples * 2, true);
    return new Blob([buffer], { type: "audio/wav" });
  }

  function primeAudioOutput() {
    // iOS/Safari requires each HTMLAudioElement to be started once from a real user gesture.
    // Prime this same hidden player on mic/send/listen interaction, then reuse it for TTS later.
    const player = refs.audioPlayer;
    if (!player || audioPlayerUnlocked) return;
    try {
      const silentUrl = URL.createObjectURL(makeSilentWavBlob());
      player.src = silentUrl;
      player.volume = 0.001;
      const promise = player.play();
      if (promise?.then) {
        promise.then(() => {
          try { player.pause(); player.currentTime = 0; } catch (_) {}
          player.volume = 1;
          audioPlayerUnlocked = true;
          setTimeout(() => URL.revokeObjectURL(silentUrl), 500);
        }).catch(() => {
          player.volume = 1;
          setTimeout(() => URL.revokeObjectURL(silentUrl), 500);
        });
      } else {
        audioPlayerUnlocked = true;
      }

      // Also unlock Web Audio / SpeechSynthesis paths on browsers that use them.
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctxAudio = new AudioCtx();
        ctxAudio.resume?.().catch(() => {});
        const osc = ctxAudio.createOscillator();
        const gain = ctxAudio.createGain();
        gain.gain.value = 0.00001;
        osc.connect(gain);
        gain.connect(ctxAudio.destination);
        osc.start();
        osc.stop(ctxAudio.currentTime + 0.02);
        setTimeout(() => { try { ctxAudio.close(); } catch (_) {} }, 100);
      }
    } catch (_) {}
  }

  function stopSpeaking() {
    speechSession += 1;
    if (speechSupported()) window.speechSynthesis.cancel();
    currentUtterance = null;
    const player = refs.audioPlayer;
    if (player) {
      try { player.pause(); } catch (_) {}
      try { player.currentTime = 0; } catch (_) {}
    }
    if (speakingButton) {
      speakingButton.textContent = tr("listen");
      speakingButton.setAttribute("aria-pressed", "false");
      speakingButton = null;
    }
  }

  async function speakWithPuter(text, button = null, sessionId = null) {
    const spoken = cleanSpeechText(text).slice(0, 2800);
    if (!spoken) return false;
    try {
      const puterObj = await ensurePuterLoaded();
      const generated = await puterObj.ai.txt2speech(spoken, {
        provider: "openai",
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        response_format: "mp3",
        instructions: ctx?.lang === "en"
          ? "Speak clearly, calmly and naturally for a school-age learner."
          : "Μίλα καθαρά, ήρεμα και φυσικά στα ελληνικά, σαν βοηθός μελέτης για μαθητή.",
      });
      if (sessionId !== null && sessionId !== speechSession) return false;
      const src = generated?.src || generated?.currentSrc || String(generated || "");
      if (!src || !refs.audioPlayer) return false;
      const player = refs.audioPlayer;
      player.src = src;
      player.volume = 1;
      player.onended = () => { if (sessionId === speechSession) stopSpeaking(); };
      player.onerror = () => { if (sessionId === speechSession) stopSpeaking(); };
      await player.play();
      return true;
    } catch (err) {
      console.warn("AI Help: Puter TTS playback failed.", err);
      return false;
    }
  }

  function splitSpeechChunks(text, max = 220) {
    const clean = cleanSpeechText(text);
    if (clean.length <= max) return clean ? [clean] : [];
    const parts = clean.match(/[^.!?;:]+[.!?;:]?|[^.!?;:]+$/g) || [clean];
    const out = [];
    let current = "";
    for (const partRaw of parts) {
      const part = partRaw.trim();
      if (!part) continue;
      if ((current + " " + part).trim().length <= max) current = (current + " " + part).trim();
      else {
        if (current) out.push(current);
        if (part.length <= max) current = part;
        else {
          for (let i = 0; i < part.length; i += max) out.push(part.slice(i, i + max));
          current = "";
        }
      }
    }
    if (current) out.push(current);
    return out;
  }

  async function speakText(text, button = null) {
    if (button && speakingButton === button && (window.speechSynthesis?.speaking || !refs.audioPlayer?.paused)) {
      stopSpeaking();
      return;
    }
    stopSpeaking();
    primeAudioOutput();
    const spoken = cleanSpeechText(text);
    if (!spoken) return;
    const sessionId = speechSession;
    if (button) {
      speakingButton = button;
      button.textContent = tr("stopListening");
      button.setAttribute("aria-pressed", "true");
    }

    // Mobile Safari is the least reliable environment for delayed SpeechSynthesis.
    // On mobile-like devices we use Puter TTS first; desktop keeps the free device voice first.
    if (isMobileLike()) {
      const ok = await speakWithPuter(spoken, button, sessionId);
      if (ok || sessionId !== speechSession) return;
    }

    if (!speechSupported()) {
      const ok = await speakWithPuter(spoken, button, sessionId);
      if (!ok && refs.voiceStatus) refs.voiceStatus.textContent = tr("speechUnsupported");
      if (!ok) stopSpeaking();
      return;
    }

    const chunks = splitSpeechChunks(spoken);
    let index = 0;
    const voices = window.speechSynthesis.getVoices?.() || [];
    const target = getSpeechLang().toLowerCase();
    const voice = voices.find((v) => String(v.lang).toLowerCase() === target)
      || voices.find((v) => String(v.lang).toLowerCase().startsWith(target.slice(0, 2)));

    const speakNext = () => {
      if (sessionId !== speechSession) return;
      if (index >= chunks.length) { stopSpeaking(); return; }
      try { window.speechSynthesis.resume?.(); } catch (_) {}
      const utterance = new SpeechSynthesisUtterance(chunks[index++]);
      currentUtterance = utterance; // keep a strong reference for Safari/iOS
      utterance.lang = getSpeechLang();
      utterance.rate = 0.96;
      utterance.pitch = 1;
      if (voice) utterance.voice = voice;
      let started = false;
      utterance.onstart = () => { started = true; };
      utterance.onend = () => speakNext();
      utterance.onerror = async () => {
        if (sessionId !== speechSession) return;
        window.speechSynthesis.cancel();
        currentUtterance = null;
        const ok = await speakWithPuter(spoken, button, sessionId);
        if (!ok) stopSpeaking();
      };
      window.speechSynthesis.speak(utterance);
      setTimeout(async () => {
        if (!started && sessionId === speechSession && currentUtterance === utterance) {
          window.speechSynthesis.cancel();
          currentUtterance = null;
          const ok = await speakWithPuter(spoken, button, sessionId);
          if (!ok) stopSpeaking();
        }
      }, 1400);
    };
    speakNext();
  }

  async function stopVad() {
    if (vadTimer) clearInterval(vadTimer);
    vadTimer = null;
    try { vadSource?.disconnect(); } catch (_) {}
    try { vadAnalyser?.disconnect(); } catch (_) {}
    vadSource = null;
    vadAnalyser = null;
    vadData = null;
    if (vadAudioContext) {
      try { await vadAudioContext.close(); } catch (_) {}
    }
    vadAudioContext = null;
  }

  function stopRecordingNow() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      try { mediaRecorder.stop(); } catch (_) {}
    }
  }

  async function startVad(stream) {
    await stopVad();
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    try {
      vadAudioContext = new AudioCtx();
      try { await vadAudioContext.resume(); } catch (_) {}
      vadSource = vadAudioContext.createMediaStreamSource(stream);
      vadAnalyser = vadAudioContext.createAnalyser();
      vadAnalyser.fftSize = 1024;
      vadAnalyser.smoothingTimeConstant = 0.45;
      vadData = new Uint8Array(vadAnalyser.fftSize);
      vadSource.connect(vadAnalyser);
      speechDetected = false;
      lastSpeechAt = Date.now();
      vadNoiseFloor = 0.008;

      vadTimer = setInterval(() => {
        if (!recording || !vadAnalyser || !vadData) return;
        vadAnalyser.getByteTimeDomainData(vadData);
        let sum = 0;
        for (let i = 0; i < vadData.length; i++) {
          const sample = (vadData[i] - 128) / 128;
          sum += sample * sample;
        }
        const rms = Math.sqrt(sum / vadData.length);
        const now = Date.now();
        const elapsed = now - recordingStartedAt;

        // Adaptive floor without a calibration pause, so speech can begin immediately after tapping the mic.
        if (!speechDetected || now - lastSpeechAt > 500) {
          const capped = Math.min(rms, 0.03);
          vadNoiseFloor = vadNoiseFloor * 0.95 + capped * 0.05;
        }
        const threshold = Math.max(0.014, vadNoiseFloor * 2.4);
        if (rms > threshold) {
          speechDetected = true;
          lastSpeechAt = now;
        }

        // Once real speech has been heard, ~1.35 s of silence means the turn is finished.
        if (speechDetected && elapsed > 1000 && now - lastSpeechAt >= 1350) {
          if (refs.voiceStatus) refs.voiceStatus.textContent = tr("micAutoStop");
          stopRecordingNow();
        } else if (!speechDetected && elapsed >= 12000) {
          // Avoid leaving the microphone open indefinitely if the user never speaks.
          stopRecordingNow();
        }
      }, 100);
    } catch (err) {
      console.warn("AI Help: automatic end-of-speech detection unavailable; manual stop remains available.", err);
      await stopVad();
    }
  }

  function preferredRecordingMime() {
    if (!window.MediaRecorder?.isTypeSupported) return "";
    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus",
    ];
    return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
  }

  function setMicUi() {
    if (!refs.mic) return;
    refs.mic.hidden = !micSupported();
    refs.mic.classList.toggle("tutor-mic--recording", recording);
    refs.mic.textContent = recording ? tr("micStop") : tr("micStart");
    refs.mic.setAttribute("aria-pressed", recording ? "true" : "false");
    refs.mic.disabled = !recording && (!accessState().allowed || !authReady || busy || transcribing);
  }

  function updateRecordingStatus() {
    if (!recording || !refs.voiceStatus) return;
    const seconds = Math.max(0, Math.floor((Date.now() - recordingStartedAt) / 1000));
    const mm = Math.floor(seconds / 60);
    const ss = String(seconds % 60).padStart(2, "0");
    refs.voiceStatus.textContent = `${tr("micListening")} ${mm}:${ss}`;
  }

  function stopMicTracks() {
    if (micStream) {
      micStream.getTracks().forEach((track) => track.stop());
      micStream = null;
    }
  }

  function cancelRecording() {
    stopVad().catch(() => {});
    if (recordingTimer) clearInterval(recordingTimer);
    recordingTimer = null;
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      try { mediaRecorder.stop(); } catch (_) {}
    }
    recording = false;
    stopMicTracks();
    setMicUi();
  }

  function writeAscii(view, offset, text) {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
  }

  function audioBufferToWavBlob(audioBuffer) {
    const channels = Math.min(2, audioBuffer.numberOfChannels || 1);
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length;
    const bytesPerSample = 2;
    const blockAlign = channels * bytesPerSample;
    const buffer = new ArrayBuffer(44 + length * blockAlign);
    const view = new DataView(buffer);

    writeAscii(view, 0, "RIFF");
    view.setUint32(4, 36 + length * blockAlign, true);
    writeAscii(view, 8, "WAVE");
    writeAscii(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);
    writeAscii(view, 36, "data");
    view.setUint32(40, length * blockAlign, true);

    const channelData = [];
    for (let c = 0; c < channels; c++) channelData.push(audioBuffer.getChannelData(c));
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let c = 0; c < channels; c++) {
        const sample = Math.max(-1, Math.min(1, channelData[c][i] || 0));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }
    return new Blob([buffer], { type: "audio/wav" });
  }

  async function makeTranscriptionFile(blob) {
    // Browser MediaRecorder output varies (webm/opus, mp4, ogg).
    // Puter/OpenAI transcription is more reliable when the payload has a
    // concrete filename/extension; WAV is used when the browser can decode it.
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const context = new AudioCtx();
        try {
          const arrayBuffer = await blob.arrayBuffer();
          const decoded = await context.decodeAudioData(arrayBuffer.slice(0));
          const wav = audioBufferToWavBlob(decoded);
          return new File([wav], "question.wav", { type: "audio/wav" });
        } finally {
          try { await context.close(); } catch (_) {}
        }
      }
    } catch (err) {
      console.warn("AI Help: WAV conversion unavailable, using original recording.", err);
    }

    const type = String(blob.type || "audio/webm").toLowerCase();
    const ext = type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : type.includes("wav") ? "wav" : "webm";
    return new File([blob], `question.${ext}`, { type: blob.type || `audio/${ext}` });
  }

  async function requestTranscript(puterObj, source, model) {
    return puterObj.ai.speech2txt(source, {
      provider: "openai",
      model,
      response_format: "text",
      language: ctx?.lang === "en" ? "en" : "el",
      prompt: ctx?.lang === "en"
        ? "School question. Preserve mathematical symbols and school subject terminology."
        : "Σχολική ερώτηση στα ελληνικά. Διατήρησε σωστά μαθηματικά σύμβολα, αριθμούς και σχολική ορολογία.",
    });
  }

  async function transcribeAudio(blob, autoSend = false) {
    if (!blob?.size) return;
    transcribing = true;
    if (refs.voiceStatus) refs.voiceStatus.textContent = tr("micTranscribing");
    updateComposerState();
    try {
      const puterObj = await ensurePuterLoaded();
      const source = await makeTranscriptionFile(blob);

      let transcript;
      let firstError = null;
      try {
        transcript = await requestTranscript(puterObj, source, "gpt-4o-mini-transcribe");
      } catch (err) {
        firstError = err;
        console.warn("AI Help: gpt-4o-mini-transcribe failed; retrying with whisper-1.", err);
        transcript = await requestTranscript(puterObj, source, "whisper-1");
      }

      const text = typeof transcript === "string" ? transcript.trim() : String(transcript?.text || "").trim();
      if (!text) {
        if (refs.voiceStatus) refs.voiceStatus.textContent = tr("micEmpty");
        return;
      }
      const before = refs.input.value.trim();
      refs.input.value = before ? `${before} ${text}` : text;
      if (firstError) console.info("AI Help: transcription succeeded on fallback model.");
      refreshAuthStatus().catch(() => {});

      if (autoSend) {
        const toSend = refs.input.value.trim();
        refs.input.value = "";
        if (refs.voiceStatus) refs.voiceStatus.textContent = tr("micAutoSend");
        // The voice turn is now fully automatic: speech end -> transcript -> send.
        transcribing = false;
        updateComposerState();
        await sendMessage(toSend);
      } else {
        refs.input.focus();
        if (refs.voiceStatus) refs.voiceStatus.textContent = tr("voiceHint");
      }
    } catch (err) {
      console.error("AI Help: speech transcription failed.", err);
      const raw = String(err?.msg || err?.message || err?.error || err || "");
      const permissionish = /permission|denied|notallowed/i.test(raw);
      if (refs.voiceStatus) {
        refs.voiceStatus.textContent = permissionish ? tr("micPermission") : tr("micFailed");
        refs.voiceStatus.title = raw.slice(0, 500);
      }
    } finally {
      transcribing = false;
      updateComposerState();
    }
  }

  async function toggleRecording() {
    if (recording) {
      // Manual stop is still available, but the transcript is sent automatically.
      stopRecordingNow();
      return;
    }
    if (!micSupported()) {
      if (refs.voiceStatus) refs.voiceStatus.textContent = tr("micUnsupported");
      return;
    }
    if (!accessState().allowed) {
      renderAccessGate();
      return;
    }
    if (!authReady) {
      await explicitSignIn(false);
      if (!authReady) return;
    }
    try {
      micStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      audioChunks = [];
      const mimeType = preferredRecordingMime();
      mediaRecorder = mimeType ? new MediaRecorder(micStream, { mimeType }) : new MediaRecorder(micStream);
      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data?.size) audioChunks.push(event.data);
      });
      mediaRecorder.addEventListener("stop", async () => {
        await stopVad();
        if (recordingTimer) clearInterval(recordingTimer);
        recordingTimer = null;
        recording = false;
        const type = mediaRecorder?.mimeType || mimeType || "audio/webm";
        const blob = new Blob(audioChunks, { type });
        audioChunks = [];
        stopMicTracks();
        setMicUi();
        await transcribeAudio(blob, true);
      }, { once: true });
      mediaRecorder.start(250);
      recording = true;
      recordingStartedAt = Date.now();
      primeAudioOutput();
      startVad(micStream).catch(() => {});
      updateRecordingStatus();
      recordingTimer = setInterval(() => {
        updateRecordingStatus();
        if (Date.now() - recordingStartedAt >= 45000 && mediaRecorder?.state !== "inactive") stopRecordingNow();
      }, 500);
      setMicUi();
    } catch (err) {
      recording = false;
      stopVad().catch(() => {});
      stopMicTracks();
      if (refs.voiceStatus) refs.voiceStatus.textContent = /permission|denied|notallowed/i.test(String(err?.message || err || "")) ? tr("micPermission") : tr("micFailed");
      setMicUi();
    }
  }

  function addBubble(role, text) {
    refs.empty?.remove();
    refs.empty = null;
    const div = document.createElement("div");
    div.className = `tutor-bubble tutor-bubble--${role}`;
    const label = role === "user" ? tr("you") : (isParentMode() ? tr("parentHelper") : tr("tutor"));
    div.innerHTML = `<div class="tutor-bubble__meta">${escapeHtml(label)}</div><div class="tutor-bubble__text">${escapeHtml(text).replaceAll("\n", "<br>")}</div>`;
    if (role === "assistant") {
      const speak = document.createElement("button");
      speak.type = "button";
      speak.className = "tutor-speak-btn";
      speak.textContent = tr("listen");
      speak.setAttribute("aria-pressed", "false");
      speak.addEventListener("click", () => { primeAudioOutput(); speakText(text, speak); });
      div.appendChild(speak);
    }
    refs.messages.appendChild(div);
    refs.messages.scrollTop = refs.messages.scrollHeight;
    return div;
  }

  function setBusy(value) {
    busy = value;
    refs.busy.textContent = value ? tr("thinking") : "";
    updateComposerState();
  }

  function resetConversation(clearMessages = true) {
    stopSpeaking();
    if (recording) cancelRecording();
    else stopVad().catch(() => {});
    conversation = [];
    if (clearMessages && refs.messages) {
      refs.messages.innerHTML = `
        <div class="tutor-empty" id="tutorEmptyState">
          <strong>${escapeHtml(tr("emptyTitle"))}</strong><br>
          ${escapeHtml(isParentMode() ? tr("emptyParent") : tr("emptyStudent"))}
        </div>`;
      refs.empty = document.getElementById("tutorEmptyState");
    }
  }

  async function sendMessage(text) {
    if (!text.trim() || busy) return;
    if (!accessState().allowed) {
      renderAccessGate();
      return;
    }
    if (!authReady) {
      await explicitSignIn(false);
      if (!authReady) return;
    }

    addBubble("user", text.trim());
    conversation.push({ role: "user", content: text.trim() });
    setBusy(true);

    try {
      const transcript = conversation.map((m) =>
        `${m.role === "user" ? "USER/LEARNER" : "AI TUTOR"}: ${String(m.content)}`
      ).join("\n\n");

      const continuationPrompt = `Here is the COMPLETE current conversation. Continue exactly from the last user message.
Do NOT introduce yourself again. Do NOT ask a generic “How can I help?”.
The user's latest short answer refers to the tutor's immediately previous question.

${transcript}

Now reply ONLY as the AI Tutor to the user's final message, following the tutoring rules.`;

      const messages = [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: continuationPrompt },
      ];
      const options = {
        model: MODEL_ID,
        provider: MODEL_PROVIDER,
        max_tokens: 700,
      };

      const puterObj = await ensurePuterLoaded();
      let resp = await puterObj.ai.chat(messages, options);
      let answer = extractText(resp) || tr("noResponse");

      const lostContext = conversation.length >= 2 && /^(hello|hi\b|how can i help|πώς μπορώ να βοηθήσω|γεια[!,. ]*$)/i.test(answer.trim());
      if (lostContext) {
        const retryMessages = [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: `IMPORTANT: the previous attempt lost the conversation context. Do not start a new conversation.\n\n${continuationPrompt}\n\nAnswer specifically to the user's last phrase and connect it to the tutor's previous question.` },
        ];
        resp = await puterObj.ai.chat(retryMessages, options);
        answer = extractText(resp) || answer;
      }

      conversation.push({ role: "assistant", content: answer });
      const answerBubble = addBubble("assistant", answer);
      if (refs.autoSpeak?.checked) {
        const speakButton = answerBubble?.querySelector(".tutor-speak-btn");
        speakText(answer, speakButton || null);
      }
      refreshAuthStatus().catch(() => {});
    } catch (err) {
      const msg = err?.message || String(err);
      addBubble("assistant", `${tr("callFailed")} ${msg ? `(${msg})` : ""}`);
    } finally {
      setBusy(false);
      refs.input.focus();
    }
  }

  function sampleText() {
    const gap = getCurrentGap();
    const label = langValue(gap, "labelEl", "labelEn", "");
    if (ctx.lang === "en") {
      if (isParentMode()) return label ? `My child is struggling with “${label}”. How can I help them understand it without giving away the answer?` : tr("sampleParentGeneric");
      return label ? `I don't understand “${label}” very well. Can you guide me step by step without giving me the answer straight away?` : tr("sampleStudentGeneric");
    }
    if (isParentMode()) return label ? `Το παιδί μου δυσκολεύεται στο θέμα «${label}». Πώς να το βοηθήσω να το καταλάβει χωρίς να του πω την απάντηση;` : tr("sampleParentGeneric");
    return label ? `Δεν καταλαβαίνω καλά το θέμα «${label}». Μπορείς να με βοηθήσεις βήμα-βήμα χωρίς να μου δώσεις κατευθείαν τη λύση;` : tr("sampleStudentGeneric");
  }

  function bindEvents() {
    refs.grade.addEventListener("change", () => { populateSubjects(); renderContext(); resetConversation(); });
    refs.subject.addEventListener("change", () => { populateTopics(); renderContext(); resetConversation(); });
    refs.topic.addEventListener("change", () => { renderContext(); resetConversation(); });
    if (refs.age) {
      refs.age.addEventListener("change", () => {
        refs.consentRow.hidden = refs.age.value !== "13-14";
        if (refs.age.value !== "13-14") refs.consent.checked = false;
        renderAccessGate();
        resetConversation();
      });
    }
    if (refs.consent) {
      refs.consent.addEventListener("change", () => {
        renderAccessGate();
        if (accessState().allowed && !authReady) {
          refs.authStatus.textContent = tr("readyToConnect");
          refs.authUser.textContent = tr("connectHint");
        }
        resetConversation();
      });
    }
    refs.signIn.addEventListener("click", () => explicitSignIn(false));
    refs.switchAccount.addEventListener("click", () => explicitSignIn(true));
    refs.newChat.addEventListener("click", () => resetConversation());
    refs.mic?.addEventListener("click", () => { primeAudioOutput(); toggleRecording(); });
    refs.autoSpeak?.addEventListener("change", () => {
      if (refs.autoSpeak.checked) primeAudioOutput();
      else stopSpeaking();
    });
    refs.sample.addEventListener("click", () => {
      refs.input.value = sampleText();
      refs.input.focus();
    });
    refs.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      primeAudioOutput();
      const text = refs.input.value;
      refs.input.value = "";
      await sendMessage(text);
    });
    refs.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        refs.form.requestSubmit();
      }
    });
  }

  function html() {
    const parentMode = isParentMode();
    const middleStudent = ctx.zoneId === "middle" && ctx.roleId === "student";
    return `
      <section class="tutor-shell" aria-labelledby="tutorHeading">
        <div class="tutor-heading">
          <p class="tutor-heading__eyebrow">AI TOOLS FOR KIDS · BETA</p>
          <h2 id="tutorHeading">${escapeHtml(parentMode ? tr("titleParent") : tr("titleStudent"))}</h2>
          <p>${escapeHtml(parentMode ? tr("subtitleParent") : tr("subtitleStudent"))}</p>
        </div>

        <div class="tutor-auth-card">
          <div class="tutor-auth-card__top">
            <div>
              <strong>${escapeHtml(tr("signInTitle"))}</strong>
              <p>${escapeHtml(tr("signInIntro"))}</p>
            </div>
            <button type="button" class="tutor-btn tutor-btn--secondary" id="tutorSwitchAccount" hidden>${escapeHtml(tr("switchAccount"))}</button>
          </div>
          <div class="tutor-auth-status" id="tutorAuthBox">
            <span class="tutor-auth-dot" id="tutorAuthDot" aria-hidden="true"></span>
            <strong id="tutorAuthStatus">${escapeHtml(tr("notSignedIn"))}</strong>
            <span class="tutor-auth-user" id="tutorAuthUser"></span>
            <button type="button" class="tutor-btn tutor-btn--primary tutor-auth-connect" id="tutorSignIn">${escapeHtml(tr("connect"))}</button>
            <div class="tutor-usage" id="tutorUsageWrap" hidden>
              <div class="tutor-usage__row"><span>${escapeHtml(tr("usage"))}</span><strong id="tutorUsageText">:</strong></div>
              <div class="tutor-usage__bar" aria-hidden="true"><span id="tutorUsageBar"></span></div>
            </div>
          </div>
          <div class="tutor-auth-steps">
            <span>${escapeHtml(tr("steps1"))}</span>
            <span>${escapeHtml(tr("steps2"))}</span>
            <span>${escapeHtml(tr("steps3"))}</span>
          </div>
          <p class="tutor-auth-links"><a href="https://puter.com/terms" target="_blank" rel="noopener">${escapeHtml(tr("puterTerms"))}</a> · <a href="https://puter.com/privacy" target="_blank" rel="noopener">${escapeHtml(tr("puterPrivacy"))}</a></p>
          <div class="tutor-privacy-note">${escapeHtml(tr("privacyNote"))}</div>
        </div>

        <div class="tutor-layout">
          <aside class="tutor-settings">
            <h3>${escapeHtml(tr("settings"))}</h3>
            ${middleStudent ? `
              <label class="tutor-field">
                <span>${escapeHtml(tr("age"))}</span>
                <select id="tutorAge">
                  <option value="">${escapeHtml(tr("chooseAge"))}</option>
                  <option value="12">${escapeHtml(tr("age12"))}</option>
                  <option value="13-14">${escapeHtml(tr("age13_14"))}</option>
                  <option value="15">${escapeHtml(tr("age15"))}</option>
                </select>
              </label>
              <label class="tutor-consent" id="tutorConsentRow" hidden>
                <input type="checkbox" id="tutorConsent">
                <span>${escapeHtml(tr("consent"))}</span>
              </label>` : ""}
            <label class="tutor-field"><span>${escapeHtml(tr("grade"))}</span><select id="tutorGrade"></select></label>
            <label class="tutor-field"><span>${escapeHtml(tr("subject"))}</span><select id="tutorSubject"></select></label>
            <label class="tutor-field"><span>${escapeHtml(tr("topic"))}</span><select id="tutorTopic"></select></label>

            <div class="tutor-mode" id="tutorModeBox"></div>
            <div class="tutor-access" id="tutorAccessGate"></div>
            <div class="tutor-context" id="tutorContextBox"></div>
            <div class="tutor-warning">${escapeHtml(tr("prototypeNote"))}</div>
          </aside>

          <div class="tutor-chat">
            <div class="tutor-chat__header">
              <div>
                <strong>${escapeHtml(parentMode ? tr("titleParent") : tr("titleStudent"))}</strong>
                <span>${escapeHtml(parentMode ? tr("modeParent") : tr("modeStudent"))}</span>
              </div>
              <button type="button" class="tutor-btn tutor-btn--secondary" id="tutorNewChat">${escapeHtml(tr("newChat"))}</button>
            </div>
            <div class="tutor-messages" id="tutorMessages">
              <div class="tutor-empty" id="tutorEmptyState"><strong>${escapeHtml(tr("emptyTitle"))}</strong><br>${escapeHtml(parentMode ? tr("emptyParent") : tr("emptyStudent"))}</div>
            </div>
            <form class="tutor-composer" id="tutorForm">
              <textarea id="tutorInput" rows="4" disabled></textarea>
              <div class="tutor-voice-hint">${escapeHtml(tr("voiceHint"))}</div>
              <div class="tutor-composer__bottom">
                <button type="button" class="tutor-btn tutor-btn--secondary" id="tutorSample">${escapeHtml(tr("sample"))}</button>
                <button type="button" class="tutor-btn tutor-btn--secondary tutor-mic" id="tutorMic" aria-pressed="false">${escapeHtml(tr("micStart"))}</button>
                <span class="tutor-voice-status" id="tutorVoiceStatus" aria-live="polite"></span>
                <span class="tutor-busy" id="tutorBusy" aria-live="polite"></span>
                <button type="submit" class="tutor-btn tutor-btn--primary" id="tutorSend" disabled>${escapeHtml(tr("send"))}</button>
              </div>
              <label class="tutor-auto-speak"><input type="checkbox" id="tutorAutoSpeak"> <span>${escapeHtml(tr("autoSpeak"))}</span></label>
              <audio id="tutorAudioPlayer" preload="none" playsinline hidden></audio>
            </form>
          </div>
        </div>
      </section>`;
  }

  function captureRefs() {
    const byId = (id) => document.getElementById(id);
    refs = {
      signIn: byId("tutorSignIn"),
      switchAccount: byId("tutorSwitchAccount"),
      authBox: byId("tutorAuthBox"),
      authDot: byId("tutorAuthDot"),
      authStatus: byId("tutorAuthStatus"),
      authUser: byId("tutorAuthUser"),
      usageWrap: byId("tutorUsageWrap"),
      usageText: byId("tutorUsageText"),
      usageBar: byId("tutorUsageBar"),
      age: byId("tutorAge"),
      consent: byId("tutorConsent"),
      consentRow: byId("tutorConsentRow"),
      grade: byId("tutorGrade"),
      subject: byId("tutorSubject"),
      topic: byId("tutorTopic"),
      modeBox: byId("tutorModeBox"),
      accessGate: byId("tutorAccessGate"),
      contextBox: byId("tutorContextBox"),
      messages: byId("tutorMessages"),
      empty: byId("tutorEmptyState"),
      form: byId("tutorForm"),
      input: byId("tutorInput"),
      sample: byId("tutorSample"),
      mic: byId("tutorMic"),
      voiceStatus: byId("tutorVoiceStatus"),
      autoSpeak: byId("tutorAutoSpeak"),
      audioPlayer: byId("tutorAudioPlayer"),
      send: byId("tutorSend"),
      busy: byId("tutorBusy"),
      newChat: byId("tutorNewChat"),
    };
  }

  function render(context) {
    mount = document.getElementById("tutorMount");
    if (!mount || !context?.zoneId || !context?.roleId) return;
    const nextCtx = {
      zoneId: context.zoneId,
      roleId: context.roleId,
      lang: context.lang === "en" ? "en" : "el",
    };
    const nextKey = `${nextCtx.zoneId}|${nextCtx.roleId}|${nextCtx.lang}`;
    if (renderKey === nextKey && mount.dataset.ready === "1") {
      updateComposerState();
      return;
    }

    stopSpeaking();
    if (recording || micStream) cancelRecording();
    ctx = nextCtx;
    renderKey = nextKey;
    conversation = [];
    busy = false;
    authReady = false;
    signedInUser = null;
    mount.innerHTML = html();
    mount.dataset.ready = "1";
    captureRefs();
    renderModeBox();
    populateGrades();
    renderAccessGate();
    bindEvents();
    updateAuthUi();
  }

  window.AITutor = { render };
})();
