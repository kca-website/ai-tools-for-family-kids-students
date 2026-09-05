/**
 * september-2026-refresh.js
 * Curriculum + tool audit refresh (2026-09-05)
 * Additive runtime patch: loaded after the existing data/integrity layers and before tutor/app.
 * Intentionally avoids rewriting the large generated data files while traffic is high.
 */
(function () {
  "use strict";

  const TODAY = "2026-09-05";
  const TODAY_EL = "5 Σεπτεμβρίου 2026";
  const TODAY_EN = "5 September 2026";
  const PRIMARY_MINISTRY_URL = "https://www.minedu.gov.gr/protovathmia/dimotiko";

  function unique(arr) { return [...new Set((arr || []).filter(Boolean))]; }
  function getTool(id) { return (typeof TOOLS !== "undefined" && TOOLS[id]) ? TOOLS[id] : null; }
  function patchTool(id, patch) {
    const tool = getTool(id);
    if (!tool) return;
    Object.assign(tool, patch, {
      lastReviewed: TODAY,
      lastReviewedEl: TODAY_EL,
      lastReviewedEn: TODAY_EN,
    });
  }

  // Full tool-review stamp: every listed entry was rechecked on 2026-09-05.
  if (typeof TOOLS !== "undefined") {
    Object.keys(TOOLS).forEach((id) => {
      Object.assign(TOOLS[id], {
        lastReviewed: TODAY,
        lastReviewedEl: TODAY_EL,
        lastReviewedEn: TODAY_EN,
      });
    });
  }

  // Current official access rules / material corrections.
  patchTool("photomath", {
    minAge: 13,
    minAgeNote: "13+. Κάτω των 13 η χρήση απαγορεύεται. Αν ο χρήστης θεωρείται ανήλικος στη χώρα του, απαιτείται άδεια γονέα ή νόμιμου κηδεμόνα.",
    auditSource: "https://photomath.com/terms/",
  });
  patchTool("miro-ai", {
    minAge: 16,
    minAgeNote: "16+. Οι τρέχοντες Όροι Χρήσης της Miro δεν επιτρέπουν χρήση της υπηρεσίας από άτομα κάτω των 16 ετών.",
    auditSource: "https://miro.com/legal/terms-of-service/",
  });
  patchTool("symbolab", {
    minAge: 16,
    minAgeNote: "Στον ΕΟΧ/ΕΕ και στο Ηνωμένο Βασίλειο: 16+. Σε άλλες περιοχές μπορεί να ισχύει 13+ ή διαφορετικό τοπικό όριο. Για την Ελλάδα χρησιμοποιούμε το αυστηρότερο όριο του ΕΟΧ.",
    auditSource: "https://www.symbolab.com/terms-of-use",
  });
  patchTool("scite", {
    minAge: 13,
    minAgeNote: "13+. Η χρήση από άτομα κάτω των 13 ετών απαγορεύεται από τους Όρους Χρήσης του Scite.",
    auditSource: "https://scite.ai/terms",
  });
  patchTool("elicit", {
    minAge: 13,
    minAgeNote: "13+ για άμεση χρήση. Οι Όροι της Elicit θέτουν ελάχιστη ηλικία 13 ετών· για ανηλίκους εξακολουθούν να ισχύουν οι τοπικοί κανόνες και η γονική επίβλεψη όπου απαιτείται.",
    auditSource: "https://elicit.com/operations/terms",
  });
  patchTool("replit-ai", {
    minAge: 13,
    minAgeNote: "13+. Κάτω των 18 απαιτείται άδεια γονέα ή κηδεμόνα σύμφωνα με τους τρέχοντες Όρους της Replit.",
    auditSource: "https://replit.com/terms-of-service",
  });
  patchTool("grammarly", {
    minAge: 16,
    minAgeNote: "Για άμεσο προσωπικό λογαριασμό στην ΕΕ, η Grammarly δηλώνει ότι ο χρήστης πρέπει να είναι αρκετά μεγάλος ώστε να συναινεί μόνος του στην επεξεργασία δεδομένων· δίνει ως παράδειγμα τα 16 έτη στην ΕΕ. Διαχειριζόμενοι λογαριασμοί Grammarly for Education ακολουθούν την πολιτική του οργανισμού/σχολείου.",
    auditSource: "https://www.grammarly.com/terms",
  });
  patchTool("canva-magic", {
    minAge: 15,
    minAgeNote: "Για προσωπική χρήση στην Ελλάδα χρησιμοποιούμε όριο 15+, επειδή οι όροι της Canva παραπέμπουν στο τοπικό όριο ψηφιακής συγκατάθεσης όταν είναι υψηλότερο από 13. Για μικρότερες ηλικίες υπάρχει ξεχωριστή διαδρομή Canva Education με σχολική/εκπαιδευτική επίβλεψη.",
    auditSource: "https://www.canva.com/el_gr/politikes/terms-of-use/",
  });
  patchTool("github-copilot", {
    minAge: 15,
    minAgeNote: "Για την Ελλάδα χρησιμοποιούμε 15+ ως ασφαλές όριο προσωπικού λογαριασμού: οι Όροι του GitHub θέτουν 13+ αλλά ρητά απαιτούν συμμόρφωση με μεγαλύτερο τοπικό όριο όπου ισχύει. Η διαθεσιμότητα/άδεια του Copilot εξαρτάται επιπλέον από το πλάνο και τις ρυθμίσεις του λογαριασμού ή του σχολείου.",
    auditSource: "https://docs.github.com/en/site-policy/github-terms/github-terms-of-service",
  });
  patchTool("quizlet", {
    minAge: 13,
    minAgeNote: "Το Quizlet απευθύνεται κυρίως σε χρήστες άνω των 13, αλλά προσφέρει περιορισμένη εμπειρία για μικρότερους χρήστες με πρόσθετες δικλείδες/γονική επιβεβαίωση όπου απαιτείται. Στην Ελλάδα λαμβάνεται υπόψη και το τοπικό όριο ψηφιακής συγκατάθεσης.",
    auditSource: "https://quizlet.com/tos",
  });
  patchTool("magicschool", {
    minAge: 18,
    minAgeNote: "Ο προσωπικός λογαριασμός εκπαιδευτικού είναι 18+. Οι μαθητές χρησιμοποιούν το MagicStudent μόνο μέσα σε σχολικά/εκπαιδευτικά διαχειριζόμενο και επιβλεπόμενο περιβάλλον, με τις απαιτούμενες εγκρίσεις.",
    auditSource: "https://www.magicschool.ai/privacy-security/student-data-policy",
  });
  patchTool("erla", {
    minAge: 13,
    minAgeNote: "13+ ή το μεγαλύτερο νόμιμο όριο της χώρας. Η Erla είναι εφαρμογή κινητού και οι τρέχοντες Όροι της (17/6/2026) θέτουν ελάχιστη ηλικία 13 ετών.",
    auditSource: "https://erla.app/terms",
  });
  patchTool("elements-of-ai", {
    minAge: 13,
    minAgeNote: "Το δωρεάν μάθημα μπορεί να χρησιμοποιηθεί από 13+ με επαληθεύσιμη γονική/κηδεμονική συναίνεση όταν ο χρήστης είναι κάτω των 18. Για ανεξάρτητη χρήση στην Ελλάδα λαμβάνεται υπόψη και το τοπικό όριο ψηφιακής συγκατάθεσης.",
    auditSource: "https://community.elementsofai.com/terms",
  });
  patchTool("claude-academy", {
    minAge: 15,
    minAgeNote: "Η ηλικία 15+ εδώ είναι παιδαγωγική σύσταση για το εκπαιδευτικό περιεχόμενο της Academy, όχι άδεια χρήσης του Claude.ai. Το Claude.ai παραμένει αυστηρά 18+ σύμφωνα με την Anthropic.",
    auditSource: "https://academy.claude.com/",
  });
  patchTool("chatgpt-edu", {
    minAge: 15,
    minAgeNote: "Στην Ελλάδα πρόκειται για σχολικό πιλοτικό πρόγραμμα σε επιλεγμένα λύκεια (αρχικά Α' και Β' Λυκείου), όχι για δημόσιο προσωπικό λογαριασμό μαθητή. Η πρόσβαση δίνεται μόνο μέσω συμμετέχουσας σχολικής μονάδας και της οργανωμένης υλοποίησης του προγράμματος.",
    pending: false,
    auditSource: "https://edugpt.sch.gr/features.php",
  });
  patchTool("khan-academy-kids", {
    minAge: 2,
    minAgeNote: "Σχεδιασμένο επίσημα για παιδιά 2–8 ετών. Είναι συμπληρωματική εφαρμογή μάθησης, όχι γενικός generative-AI chatbot.",
    auditSource: "https://learn.khanacademy.org/khan-academy-kids/",
  });
  patchTool("desmos", {
    minAgeNote: "Τα εργαλεία Desmos μπορούν να χρησιμοποιούνται και από μαθητές μέσω σχολείου. Για παιδιά κάτω από το ισχύον όριο ψηφιακής συγκατάθεσης, το σχολείο οφείλει να εξασφαλίζει τις κατάλληλες ενημερώσεις και συγκαταθέσεις. Δεν είναι generative-AI tutor.",
    auditSource: "https://www.desmos.com/terms",
  });
  patchTool("geogebra", {
    minAgeNote: "Η GeoGebra προβλέπει χρήση από μαθητές με επίβλεψη γονέα/εκπαιδευτικού όπου χρειάζεται. Δεν είναι generative-AI tutor· είναι δυναμικό μαθηματικό εργαλείο.",
    auditSource: "https://www.geogebra.org/tos",
  });
  patchTool("duolingo", {
    minAgeNote: "Υπάρχει ειδική, περιορισμένη εμπειρία για νεότερους χρήστες και σχολικές ρυθμίσεις απορρήτου. Για ανηλίκους ακολουθούνται τα ηλικιακά/γονικά όρια της χώρας και οι ρυθμίσεις του λογαριασμού.",
    auditSource: "https://www.duolingo.com/",
  });
  patchTool("scribbr", { auditSource: "https://www.scribbr.com/legal/terms-of-use/" });
  patchTool("hemingway", { auditSource: "https://hemingwayapp.com/" });
  patchTool("mindmup", { auditSource: "https://www.mindmup.com/legal/privacy/" });
  patchTool("wolfram-alpha", { auditSource: "https://www.wolfram.com/legal/terms/wolfram/" });

  // Already-corrected entries: preserve safer values and attach current audit source.
  patchTool("chatgpt", { auditSource: "https://help.openai.com/en/articles/20001421-chatgpt-for-teens" });
  patchTool("gemini", { auditSource: "https://support.google.com/gemini/" });
  patchTool("notebooklm", { auditSource: "https://support.google.com/notebooklm/" });
  patchTool("copilot", { auditSource: "https://support.microsoft.com/education" });
  patchTool("claude", { auditSource: "https://www.anthropic.com/legal/consumer-terms" });
  patchTool("perplexity", { auditSource: "https://www.perplexity.ai/hub/legal/terms-of-service" });
  patchTool("phet", { auditSource: "https://phet.colorado.edu/" });
  patchTool("google-arts-culture", { auditSource: "https://artsandculture.google.com/project/learn" });
  patchTool("gemini-education", { auditSource: "https://support.google.com/a/" });
  patchTool("ai-help", { auditSource: "https://www.aitools4kids.gr/" });

  // ---------------------------------------------------------------------------
  // Curriculum-aligned tutor topics. The official 2026-27 Primary guidance is
  // published. These are safe topic anchors, not invented verbatim chapter names.
  // ---------------------------------------------------------------------------
  function topic(subjectId, idx, labelEl, labelEn) {
    return { id: `${subjectId}.topic-${idx + 1}`, labelEl, labelEn, explainEl: labelEl, explainEn: labelEn };
  }
  function makeSubject(zone, grade, id, labelEl, labelEn, labels, sourceLabelEl) {
    const topics = labels.map((x, i) => topic(id, i, x[0], x[1]));
    let quizId = null;
    const zoneQuizzes = (typeof QUIZZES !== "undefined" && QUIZZES[zone]) ? Object.values(QUIZZES[zone]) : [];
    const needle = labelEl.toLowerCase();
    const match = zoneQuizzes.filter((q) => (q.grades || []).includes(grade)).find((q) => {
      const s = `${q.subjectLabelEl || ""} ${q.id || ""}`.toLowerCase();
      if (/νεοελλην|γλώσσα/.test(needle)) return /νεοελλην|γλώσσα/.test(s) && !/αγγλ|ξέν/.test(s);
      if (/μαθημα/.test(needle)) return /μαθημα|math/.test(s);
      if (/ιστορ/.test(needle)) return /ιστορ|history/.test(s);
      if (/φυσικ|μελέτη περιβάλλοντος|επιστήμ/.test(needle)) return /φυσικ|science|περιβάλλον|environment|βιολογ|χημ/.test(s);
      return false;
    });
    if (match) quizId = match.id;
    return {
      id, quizId, grade, subjectLabelEl: labelEl, subjectLabelEn: labelEn, topics,
      curriculum: {
        schoolYear: "2026-2027",
        coverageStatus: "annual-instructions-verified",
        coverageLabelEl: "Επαληθευμένες οδηγίες διδασκαλίας 2026–27",
        coverageLabelEn: "Verified 2026–27 teaching guidance",
        officialSectionsEl: topics.map((x) => x.labelEl),
        officialSectionsEn: topics.map((x) => x.labelEn),
        scopeNoteEl: "Θεματικές άγκυρες για διάλογο και εξάσκηση βάσει της φετινής επίσημης κατεύθυνσης — όχι αυτούσιοι τίτλοι κεφαλαίων ούτε πλήρης εξεταστέα ύλη.",
        scopeNoteEn: "Topic anchors for dialogue and practice based on current official guidance — not verbatim chapter titles or a complete examinable syllabus.",
        annualInstructionsStatus: "2026-27-verified",
        annualInstructionsUrl: PRIMARY_MINISTRY_URL,
        catalogUrl: PRIMARY_MINISTRY_URL,
        sourceLabelEl,
        sourceLabelEn: labelEn,
        verificationDate: TODAY,
      },
    };
  }

  const LANG_PRIMARY = {
    a: [["Κατανόηση μικρού κειμένου και σειρά γεγονότων","Understanding a short text and event order"],["Λεξιλόγιο μέσα από τα συμφραζόμενα","Vocabulary from context"],["Από την πρόταση στο μικρό κείμενο","From sentence to short text"],["Μικρά μηνύματα, περιγραφές και οδηγίες","Short messages, descriptions and instructions"]],
    b: [["Κύρια πληροφορία σε μικρό κείμενο","Main information in a short text"],["Σειρά και σύνδεση προτάσεων","Ordering and connecting sentences"],["Λεξιλόγιο μέσα στο κείμενο","Vocabulary in context"],["Σύντομη αφήγηση ή περιγραφή","Short narrative or description"]],
    c: [["Κύρια ιδέα και βασικές λεπτομέρειες","Main idea and key details"],["Οργάνωση παραγράφου","Paragraph organization"],["Συνδετικές λέξεις και συνοχή","Connectives and cohesion"],["Σκοπός ενός κειμένου","Text purpose"]],
    d: [["Κύρια ιδέα, λεπτομέρειες και τίτλος","Main idea, details and title"],["Συνοχή ανάμεσα στις προτάσεις","Sentence cohesion"],["Σημασία από τα συμφραζόμενα","Meaning from context"],["Περίληψη με δικά μου λόγια","Summarising in my own words"]],
    e: [["Δομή και οργάνωση κειμένου","Text structure and organization"],["Συνοχή και συνεκτικότητα","Cohesion and coherence"],["Σκοπός, αποδέκτης και ύφος","Purpose, audience and register"],["Περίληψη και παράφραση","Summary and paraphrase"],["Ισχυρισμός και τεκμήριο","Claim and evidence"]],
    f: [["Δομή, συνοχή και συνεκτικότητα","Structure, cohesion and coherence"],["Επικοινωνιακός σκοπός και ύφος","Communicative purpose and register"],["Περίληψη και πύκνωση πληροφοριών","Summary and information compression"],["Επιχείρημα, τεκμήριο και αντίλογος","Argument, evidence and counterargument"],["Πολυτροπικά κείμενα: πίνακες και εικόνες","Multimodal texts: tables and images"]],
  };
  const MATH_PRIMARY = {
    a: [["Αριθμοί και σύγκριση ποσοτήτων","Numbers and comparing quantities"],["Πρόσθεση και αφαίρεση σε προβλήματα","Addition and subtraction in problems"],["Μοτίβα και απλή λογική","Patterns and simple reasoning"],["Σχήματα και βασικές μετρήσεις","Shapes and basic measurement"]],
    b: [["Θεσιακή αξία και σύγκριση αριθμών","Place value and number comparison"],["Πρόσθεση και αφαίρεση με στρατηγικές","Addition and subtraction strategies"],["Πρώτες σχέσεις πολλαπλασιασμού και διαίρεσης","Early multiplication and division"],["Μετρήσεις και απλά δεδομένα","Measurement and simple data"]],
    c: [["Πολλαπλασιασμός και διαίρεση","Multiplication and division"],["Κλάσμα ως μέρος του όλου","Fractions as part of a whole"],["Προβλήματα πολλών βημάτων","Multi-step problems"],["Γεωμετρία, μέτρηση και δεδομένα","Geometry, measurement and data"]],
    d: [["Πράξεις και εκτίμηση","Operations and estimation"],["Κλάσματα και δεκαδικοί σε καταστάσεις","Fractions and decimals in context"],["Μοντελοποίηση προβλήματος","Problem modelling"],["Περίμετρος, εμβαδόν και δεδομένα","Perimeter, area and data"]],
    e: [["Κλάσματα και δεκαδικοί","Fractions and decimals"],["Αναλογικές σχέσεις σε προβλήματα","Proportional relationships"],["Μετρήσεις και γεωμετρικός συλλογισμός","Measurement and geometric reasoning"],["Πίνακες, γραφήματα και δεδομένα","Tables, graphs and data"]],
    f: [["Κλάσματα, δεκαδικοί και ποσοστά","Fractions, decimals and percentages"],["Λόγοι, αναλογίες και προβλήματα πολλών βημάτων","Ratios, proportions and multi-step problems"],["Γεωμετρία και μετρήσεις με αιτιολόγηση","Geometry and measurement with reasoning"],["Δεδομένα και πιθανότητες","Data and probability"]],
  };
  const HISTORY_PRIMARY = {
    c: [["Μύθος, ιστορική πληροφορία και πηγή","Myth, historical information and source"],["Χρονολογική σειρά","Chronological order"],["Τι μας δείχνει μια ιστορική πηγή;","What can a historical source show us?"]],
    d: [["Αρχαίος ελληνικός κόσμος και χρόνος","Ancient Greek world and chronology"],["Αιτία και αποτέλεσμα","Cause and effect"],["Σύγκριση δύο ιστορικών πηγών","Comparing two historical sources"]],
    e: [["Βυζαντινή περίοδος: συνέχεια και αλλαγή","Byzantine period: continuity and change"],["Χρονογραμμή και διαδοχή γεγονότων","Timeline and sequence"],["Όρια ενός ιστορικού τεκμηρίου","Limits of historical evidence"]],
    f: [["Νεότερη ελληνική ιστορία: αιτίες και συνέπειες","Modern Greek history: causes and consequences"],["Πολλαπλές οπτικές","Multiple perspectives"],["Τεκμηριωμένο συμπέρασμα από πηγή","Evidence-based conclusion from a source"]],
  };
  const SCIENCE_PRIMARY = {
    a: [["Ζωντανό και μη ζωντανό","Living and non-living"],["Ανάγκες ζωντανών οργανισμών","Needs of living things"],["Παρατήρηση, καιρός και εποχές","Observation, weather and seasons"]],
    b: [["Φυσικό και ανθρωπογενές περιβάλλον","Natural and human-made environment"],["Φυτά, ζώα και τόπος ζωής","Plants, animals and habitats"],["Υπεύθυνη χρήση πόρων","Responsible use of resources"]],
    c: [["Σώμα, τροφή και ενέργεια","Body, food and energy"],["Παρατήρηση και διερεύνηση","Observation and investigation"],["Περιβάλλον και ανθρώπινες επιλογές","Environment and human choices"]],
    d: [["Οικοσύστημα και αλληλεπιδράσεις","Ecosystems and interactions"],["Φυσικοί πόροι","Natural resources"],["Χάρτης, τόπος και φυσικά χαρακτηριστικά","Map, place and natural features"]],
    e: [["Υλικά και ιδιότητες","Materials and properties"],["Ενέργεια, θερμότητα και μεταβολές","Energy, heat and change"],["Ζωντανοί οργανισμοί και συστήματα","Living organisms and systems"],["Πρόβλεψη, παρατήρηση, συμπέρασμα","Prediction, observation, conclusion"]],
    f: [["Δυνάμεις, κίνηση και ενέργεια","Forces, motion and energy"],["Ηλεκτρισμός και ασφάλεια","Electricity and safety"],["Οργανισμοί και οικοσυστήματα","Organisms and ecosystems"],["Διερεύνηση με δεδομένα","Evidence-based investigation"]],
  };

  function olderLanguageRows(zone, grade) {
    const middle = {
      a: [["Κύρια ιδέα και βασικές πληροφορίες","Main idea and key information"],["Συνδετικές λέξεις και συνοχή","Connectives and cohesion"],["Σκοπός, αποδέκτης και ύφος","Purpose, audience and register"],["Λεξιλόγιο μέσα στα συμφραζόμενα","Vocabulary in context"],["Περίληψη χωρίς αντιγραφή","Summary without copying"]],
      b: [["Ισχυρισμός, παράδειγμα και τεκμήριο","Claim, example and evidence"],["Τρόποι ανάπτυξης παραγράφου","Paragraph development"],["Αναφορικές λέξεις και συνοχή","Reference words and cohesion"],["Πύκνωση και παράφραση","Condensing and paraphrasing"],["Προσαρμογή ύφους στον αποδέκτη","Adapting register"]],
      c: [["Θέση, επιχείρημα και τεκμήριο","Position, argument and evidence"],["Αντίλογος και αξιολόγηση επιχειρήματος","Counterargument and argument evaluation"],["Συνοχή και συνεκτικότητα","Cohesion and coherence"],["Περίληψη και ιεράρχηση πληροφοριών","Summary and prioritising information"],["Ρητό και υπονοούμενο νόημα","Explicit and implied meaning"]],
    };
    const high = {
      a: [["Επικοινωνιακή περίσταση και ύφος","Communication context and register"],["Τρόποι ανάπτυξης παραγράφου","Paragraph development"],["Περίληψη και ουσιώδεις πληροφορίες","Summary and essential information"],["Ισχυρισμός και τεκμηρίωση","Claim and evidence"],["Γλωσσικές επιλογές και ύφος","Language choices and register"]],
      b: [["Δομή επιχειρηματολογικού κειμένου","Argumentative text structure"],["Εγκυρότητα επιχειρήματος και τεκμήριο","Argument validity and evidence"],["Δείκτες συνοχής και λογικές σχέσεις","Cohesion markers and logical relations"],["Παράφραση και ενσωμάτωση πηγής","Paraphrasing and source integration"],["Τροπικότητα και στάση συντάκτη","Modality and author stance"]],
      c: [["Περίληψη με ακρίβεια και οικονομία","Accurate concise summary"],["Θέση, επιχείρημα, τεκμήριο και αντίλογος","Position, argument, evidence and counterargument"],["Συνοχή και συνεκτικότητα μη λογοτεχνικού κειμένου","Cohesion and coherence in non-literary text"],["Μετασχηματισμός ύφους","Register transformation"],["Κριτική ανάγνωση πηγής","Critical source reading"]],
    };
    return (zone === "middle" ? middle : high)[grade] || [];
  }

  function buildCatalog() {
    const old = window.AITOOLSKIDS_TUTOR_CATALOG;
    const zones = { primary: {}, middle: {}, high: {} };
    ["a","b","c","d","e","f"].forEach((grade) => {
      const list = [
        makeSubject("primary", grade, `glossa-${grade}-dimotikou`, `Νεοελληνική Γλώσσα, ${grade.toUpperCase()}' Δημοτικού`, `Modern Greek Language, Primary ${grade.toUpperCase()}`, LANG_PRIMARY[grade] || [], "Οδηγίες Νεοελληνικής Γλώσσας Δημοτικού 2026–27"),
        makeSubject("primary", grade, `math-${grade}-dimotikou`, `Μαθηματικά, ${grade.toUpperCase()}' Δημοτικού`, `Mathematics, Primary ${grade.toUpperCase()}`, MATH_PRIMARY[grade] || [], "Οδηγίες Μαθηματικών Δημοτικού 2026–27"),
      ];
      if (SCIENCE_PRIMARY[grade]) list.push(makeSubject("primary", grade, `science-${grade}-dimotikou`, `${["a","b","c","d"].includes(grade) ? "Μελέτη Περιβάλλοντος" : "Φυσικές Επιστήμες"}, ${grade.toUpperCase()}' Δημοτικού`, `Science / Environment Studies, Primary ${grade.toUpperCase()}`, SCIENCE_PRIMARY[grade], "Οδηγίες Φυσικών Επιστημών / Μελέτης Περιβάλλοντος Δημοτικού 2026–27"));
      if (HISTORY_PRIMARY[grade]) list.push(makeSubject("primary", grade, `history-${grade}-dimotikou`, `Ιστορία, ${grade.toUpperCase()}' Δημοτικού`, `History, Primary ${grade.toUpperCase()}`, HISTORY_PRIMARY[grade], "Οδηγίες Ιστορίας Δημοτικού 2026–27"));
      zones.primary[grade] = list;
    });
    ["middle","high"].forEach((zone) => {
      ["a","b","c"].forEach((grade) => {
        const existing = old?.getSubjects?.(zone, grade) || [];
        const lang = makeSubject(zone, grade, `glossa-${grade}-${zone}`, `Νεοελληνική Γλώσσα, ${grade.toUpperCase()}' ${zone === "middle" ? "Γυμνασίου" : "Λυκείου"}`, `Modern Greek Language, ${zone === "middle" ? "Middle" : "High"} ${grade.toUpperCase()}`, olderLanguageRows(zone, grade), `Οδηγίες Νεοελληνικής Γλώσσας ${zone === "middle" ? "Γυμνασίου" : "Λυκείου"}`);
        zones[zone][grade] = [...existing.filter((x) => !/νεοελλην|γλώσσα/.test((x.subjectLabelEl || "").toLowerCase())), lang];
      });
    });
    window.AITOOLSKIDS_TUTOR_CATALOG = Object.freeze({
      meta: Object.freeze(Object.assign({}, old?.meta || {}, { schoolYear: "2026-2027", lastVerified: TODAY, primaryReference: PRIMARY_MINISTRY_URL })),
      zones: Object.freeze(zones),
      getSubjects(zoneId, gradeId) { return zones?.[zoneId]?.[gradeId] || []; },
      getSubject(zoneId, gradeId, subjectId) { return (zones?.[zoneId]?.[gradeId] || []).find((x) => x.id === subjectId || x.quizId === subjectId) || null; },
    });
  }
  buildCatalog();

  // Replace simplistic Middle/High grammar diagnostics with contextual text skills.
  function addGap(id, labelEl, labelEn, explainEl, explainEn) {
    if (typeof GAP_TAGS === "undefined") return;
    GAP_TAGS[id] = Object.assign({}, GAP_TAGS[id] || {}, {
      id, labelEl, labelEn, explainEl, explainEn,
      recommendedToolIds: unique(["ai-help","chatgpt", ...(GAP_TAGS[id]?.recommendedToolIds || [])]),
      achievementEl: "Κριτικός Αναγνώστης", achievementEn: "Critical Reader",
      positiveMessageEl: "Διαβάζεις το κείμενο ως σύνολο, όχι σαν λίστα κανόνων.", positiveMessageEn: "You read the text as a whole, not as a list of rules.",
      skillTagEl: "Νεοελληνική Γλώσσα", skillTagEn: "Modern Greek Language",
    });
    if (typeof LEARNING_PATHS !== "undefined") LEARNING_PATHS[id] = [
      { titleEl:"Διάβασε το κείμενο σαν σύνολο", titleEn:"Read the text as a whole", descriptionEl:`Βρες μόνος/η το σημείο που σχετίζεται με «${labelEl}» και εξήγησε γιατί.`, descriptionEn:`Find the part related to “${labelEn}” and explain why.`, toolId:null },
      { titleEl:"Ζήτησε μία ερώτηση τη φορά", titleEn:"Ask one question at a time", descriptionEl:`Στην AI Βοήθεια πες «βοήθησέ με να καταλάβω το ${labelEl}, χωρίς να μου δώσεις την απάντηση».`, descriptionEn:`Ask AI Help to guide you on “${labelEn}” without giving the answer.`, toolId:"ai-help" },
      { titleEl:"Μετέφερε τη δεξιότητα", titleEn:"Transfer the skill", descriptionEl:`Εφάρμοσε τη δεξιότητα «${labelEl}» σε δεύτερο μικρό κείμενο χωρίς βοήθεια.`, descriptionEn:`Apply “${labelEn}” to a second short text without help.`, toolId:null },
    ];
  }
  [
    ["language.main-idea","Κύρια ιδέα και ουσιώδεις πληροφορίες","Main idea and essential information","Δυσκολεύεται να ξεχωρίσει την κεντρική ιδέα από επιμέρους λεπτομέρεια.","Struggles to distinguish the central idea from a detail."],
    ["language.cohesion","Συνοχή και λογικές σχέσεις","Cohesion and logical relationships","Δυσκολεύεται να καταλάβει πώς οι δείκτες συνδέουν τις ιδέες ενός κειμένου.","Struggles to understand how textual markers link ideas."],
    ["language.purpose-register","Σκοπός, αποδέκτης και ύφος","Purpose, audience and register","Δεν προσαρμόζει εύκολα τις γλωσσικές επιλογές στον σκοπό και τον αποδέκτη.","Struggles to adapt language to purpose and audience."],
    ["language.argument-evidence","Επιχείρημα και τεκμήριο","Argument and evidence","Μπερδεύει έναν ισχυρισμό με το στοιχείο που πραγματικά τον στηρίζει.","Confuses a claim with supporting evidence."],
    ["language.summary-paraphrase","Περίληψη και παράφραση","Summary and paraphrase","Κρατά δευτερεύουσες λεπτομέρειες ή αντιγράφει αντί να πυκνώνει το νόημα.","Keeps minor details or copies instead of condensing meaning."],
    ["language.inference","Ρητό και υπονοούμενο νόημα","Explicit and implied meaning","Δυσκολεύεται να στηρίξει ερμηνεία σε στοιχεία του κειμένου.","Struggles to support an inference with textual evidence."],
    ["primary.language.text-thinking","Κατανόηση κειμένου ως συνόλου","Thinking about a text as a whole","Χρειάζεται εξάσκηση στη σύνδεση πληροφοριών και σκοπού.","Needs practice connecting information and purpose."],
    ["primary.math.problem-reasoning","Μαθηματικός συλλογισμός σε πρόβλημα","Mathematical problem reasoning","Βιάζεται να κάνει πράξη πριν καταλάβει τι ζητά το πρόβλημα.","Rushes into calculation before understanding the problem."],
    ["primary.history.source-sequence","Χρονολογική σκέψη και ιστορική πηγή","Chronology and historical sources","Χρειάζεται να ξεχωρίζει τι στηρίζει μια πηγή και να βάζει γεγονότα σε σειρά.","Needs practice with source evidence and chronology."],
    ["primary.science.predict-explain","Πρόβλεψη, παρατήρηση και εξήγηση","Prediction, observation and explanation","Χρειάζεται να συνδέει πρόβλεψη με παρατήρηση πριν βγάλει συμπέρασμα.","Needs to connect predictions with observations before concluding."],
  ].forEach((x) => addGap(...x));

  function opt(textEl, textEn, isCorrect, gapTag) { const o = { textEl, textEn, isCorrect }; if (!isCorrect) o.gapTag = gapTag; return o; }
  function q(id, textEl, textEn, correct, wrong1, wrong2, gapTag) { return { id, textEl, textEn, options:[opt(correct[0],correct[1],true),opt(wrong1[0],wrong1[1],false,gapTag),opt(wrong2[0],wrong2[1],false,gapTag)] }; }
  function olderLanguageQuestions(zone, grade) {
    const p = `refresh-${zone}-${grade}`;
    const rows = [
      q(`${p}-main`, "Διάβασε: «Το σχολείο άνοιξε τη βιβλιοθήκη και τα διαλείμματα. Μέσα σε έναν μήνα οι δανεισμοί διπλασιάστηκαν». Ποια είναι η βασική πληροφορία;", "Read: ‘The school opened the library during breaks. Within a month, loans doubled.’ What is the key information?", ["Η ευκολότερη πρόσβαση συνδέθηκε με περισσότερους δανεισμούς.","Easier access was linked with more borrowing."], ["Η βιβλιοθήκη έχει πολλά βιβλία.","The library has many books."], ["Όλοι οι μαθητές αγαπούν το διάβασμα.","All students love reading."], "language.main-idea"),
      q(`${p}-cohesion`, "Στο «Η ομάδα δοκίμασε ξανά, επειδή το πρώτο πείραμα απέτυχε», τι σχέση δηλώνει το «επειδή»;", "In ‘The team tried again because the first experiment failed’, what relation does ‘because’ show?", ["Αιτία.","Cause."], ["Χρονική σειρά.","Time sequence."], ["Αντίθεση.","Contrast."], "language.cohesion"),
      q(`${p}-register`, "Θέλεις να ζητήσεις από τον διευθυντή άδεια για σχολική δράση. Ποια διατύπωση ταιριάζει περισσότερο;", "You want to ask the principal for permission for a school activity. Which wording fits best?", ["«Θα θέλαμε να ζητήσουμε την έγκρισή σας για…»","‘We would like to request your approval for…’"], ["«Έλα, κάν’ το, θα είναι τέλειο!»","‘Come on, do it, it’ll be great!’"], ["«Δεν με νοιάζει τι θα πείτε, θα το κάνουμε.»","‘I don’t care what you say, we’ll do it.’"], "language.purpose-register"),
      q(`${p}-evidence`, "Ισχυρισμός: «Η αυλή χρειάζεται περισσότερη σκιά». Ποιο στοιχείο τον στηρίζει καλύτερα;", "Claim: ‘The schoolyard needs more shade.’ Which evidence supports it best?", ["Μετρήσεις δείχνουν ότι το μεγαλύτερο μέρος της αυλής μένει στον ήλιο τις μεσημεριανές ώρες.","Measurements show most of the yard remains in direct sun at midday."], ["Μου αρέσουν τα δέντρα.","I like trees."], ["Η αυλή είναι δίπλα στο σχολείο.","The yard is next to the school."], "language.argument-evidence"),
      q(`${p}-summary`, "Ποια πρόταση είναι καλύτερη περίληψη; «Οι μαθητές φύτεψαν βότανα, κατέγραφαν κάθε εβδομάδα την ανάπτυξή τους και στο τέλος συνέκριναν τα αποτελέσματα». ", "Which is the best summary? ‘Students planted herbs, recorded their growth weekly, and compared the results at the end.’", ["Οι μαθητές παρακολούθησαν συστηματικά την ανάπτυξη φυτών και συνέκριναν τα δεδομένα τους.","Students systematically monitored plant growth and compared their data."], ["Οι μαθητές φύτεψαν βότανα την πρώτη μέρα.","Students planted herbs on the first day."], ["Τα βότανα ήταν πράσινα και υπήρχαν πολλές εβδομάδες.","The herbs were green and there were many weeks."], "language.summary-paraphrase"),
    ];
    if ((zone === "middle" && grade === "c") || zone === "high") rows.push(q(`${p}-inference`, "Σε άρθρο ο συντάκτης γράφει «Η λύση ακούγεται εύκολη· τα στοιχεία όμως επιμένουν να τη διαψεύδουν». Τι συμπεραίνουμε;", "An article says, ‘The solution sounds easy; the evidence, however, keeps contradicting it.’ What can we infer?", ["Ο συντάκτης αμφισβητεί την απλή λύση επειδή δεν στηρίζεται στα δεδομένα.","The author doubts the simple solution because evidence does not support it."], ["Ο συντάκτης θεωρεί ότι δεν χρειάζονται στοιχεία.","The author thinks evidence is unnecessary."], ["Ο συντάκτης συμφωνεί απόλυτα με την εύκολη λύση.","The author fully agrees with the easy solution."], "language.inference"));
    return rows;
  }
  function isGreekLanguageQuiz(item) { const s = `${item?.subjectLabelEl || ""} ${item?.id || ""}`.toLowerCase(); return /νεοελλην|γλώσσα/.test(s) && !/αγγλ|english|ξέν/.test(s); }
  if (typeof QUIZZES !== "undefined") {
    ["middle","high"].forEach((zone) => Object.values(QUIZZES[zone] || {}).forEach((item) => {
      if (!isGreekLanguageQuiz(item)) return;
      const grade = (item.grades || ["a"])[0];
      item.questions = olderLanguageQuestions(zone, grade);
      item.introEl = "5–6 σύντομες ερωτήσεις πάνω σε κείμενο, συνοχή, ύφος και επιχειρηματολογία. Δεν είναι τεστ αποστήθισης γραμματικών όρων.";
      item.introEn = "5–6 short questions on text meaning, cohesion, register and argumentation. This is not a grammar-term memorization test.";
      item.curriculumRefreshDate = TODAY;
    }));
  }

  // Add a reasoning-first item to relevant Primary quiz pools without deleting
  // the existing misconception diagnostics.
  function primaryExtra(item) {
    const s = `${item.subjectLabelEl || ""} ${item.id || ""}`.toLowerCase();
    const grade = (item.grades || ["a"])[0]; const p = `official-2026-primary-${grade}`;
    if (/γλώσσα|νεοελλην/.test(s) && !/αγγλ|english|ξέν/.test(s)) return q(`${p}-language`, "Διάβασε: «Η τάξη μάζεψε χαρτί για ανακύκλωση. Στο τέλος της εβδομάδας γέμισαν τρία μεγάλα κουτιά». Ποιος τίτλος ταιριάζει καλύτερα;", "Read: ‘The class collected paper for recycling. By the end of the week they filled three large boxes.’ Which title fits best?", ["Η ανακύκλωση της τάξης μας","Our class recycling"], ["Τρία άδεια κουτιά","Three empty boxes"], ["Το αγαπημένο μας μάθημα","Our favourite lesson"], "primary.language.text-thinking");
    if (/μαθημα|math/.test(s)) return q(`${p}-math`, "Έχεις 24 μολύβια και θέλεις να τα μοιράσεις ισόποσα σε 6 ομάδες. Πριν κάνεις πράξη, τι πρέπει να βρεις;", "You have 24 pencils to share equally among 6 groups. Before calculating, what must you work out?", ["Πόσα μολύβια θα πάρει κάθε ομάδα.","How many pencils each group gets."], ["Τι χρώμα είναι τα μολύβια.","What colour the pencils are."], ["Πόσα θρανία έχει η τάξη.","How many desks are in the room."], "primary.math.problem-reasoning");
    if (/ιστορ|history/.test(s)) return q(`${p}-history`, "Βλέπεις μια παλιά φωτογραφία μιας πλατείας. Τι μπορείς να πεις με μεγαλύτερη ασφάλεια μόνο από τη φωτογραφία;", "You see an old photograph of a town square. What can you say most safely from the photo alone?", ["Πώς έμοιαζε η πλατεία τη στιγμή που τραβήχτηκε η φωτογραφία.","What the square looked like when the photo was taken."], ["Τι σκεφτόταν κάθε άνθρωπος της πόλης.","What every person in town was thinking."], ["Ότι η πόλη ήταν πάντα ακριβώς ίδια.","That the town had always looked exactly the same."], "primary.history.source-sequence");
    if (/φυσικ|science|περιβάλλον|environment|βιολογ|χημ/.test(s)) return q(`${p}-science`, "Δύο ίδια φυτά έχουν ίδιο χώμα. Το ένα παίρνει νερό, το άλλο όχι. Ποια είναι η πιο σωστή διαδικασία;", "Two identical plants have the same soil. One gets water, the other does not. What is the best approach?", ["Κάνω πρόβλεψη, παρατηρώ για μερικές μέρες και συγκρίνω τι συνέβη.","Make a prediction, observe for several days, and compare what happened."], ["Αποφασίζω το αποτέλεσμα πριν τα παρατηρήσω.","Decide the result before observing them."], ["Αλλάζω κάθε μέρα και το χώμα, το φως και το νερό μαζί.","Change the soil, light and water all at once every day."], "primary.science.predict-explain");
    return null;
  }
  if (typeof QUIZZES !== "undefined" && QUIZZES.primary) Object.values(QUIZZES.primary).forEach((item) => {
    if (!Array.isArray(item.questions)) return;
    const extra = primaryExtra(item);
    if (extra && !item.questions.some((x) => x.id === extra.id)) item.questions.push(extra);
    if (extra) item.curriculumRefreshDate = TODAY;
  });

  // The Primary annual guidance is no longer "not indexed".
  if (window.AITOOLSKIDS_OFFICIAL_CURRICULUM) {
    const old = window.AITOOLSKIDS_OFFICIAL_CURRICULUM;
    const byQuiz = Object.assign({}, old.byQuiz || {});
    Object.keys(byQuiz).forEach((id) => {
      const row = byQuiz[id];
      if (row?.zone === "primary") byQuiz[id] = Object.assign({}, row, { schoolYear:"2026-2027", verificationDate:TODAY, annualInstructionsStatus:"2026-27-verified", ministryUrl:PRIMARY_MINISTRY_URL, annualInstructionsUrl:PRIMARY_MINISTRY_URL });
    });
    const meta = Object.assign({}, old.meta || {}, { lastVerified:TODAY, primaryAnnualGuidanceStatus:"2026-27-verified" });
    const gapAlignment = Object.assign({}, old.gapAlignment || {});
    window.AITOOLSKIDS_OFFICIAL_CURRICULUM = Object.freeze({ meta:Object.freeze(meta), byQuiz:Object.freeze(byQuiz), gapAlignment:Object.freeze(gapAlignment), getByQuizId:(id)=>byQuiz[id]||null, getGapAlignment:(id)=>gapAlignment[id]||null });
  }

  // Freshness UI: runs after app + postfix and follows dynamic re-renders.
  function isEnglish() { return !!document.getElementById("langEn")?.classList.contains("active"); }
  function fixFooterDate() {
    const el = document.querySelector(".site-footer__last-checked"); if (!el) return;
    const desired = isEnglish() ? `Tools last checked: ${TODAY_EN}` : `Τελευταίος έλεγχος εργαλείων: ${TODAY_EL}`;
    if (el.textContent !== desired) el.textContent = desired;
  }
  function markToolCards() {
    if (typeof TOOLS === "undefined") return;
    document.querySelectorAll('a[href^="/tools/"], a[href*="/tools/"]').forEach((link) => {
      const m = (link.getAttribute("href") || "").match(/\/tools\/([^/?#]+?)(?:\.html)?(?:[?#]|$)/); if (!m) return;
      const id = m[1], tool = TOOLS[id]; if (!tool?.lastReviewed) return;
      const card = link.closest("article, .tool-card, .card, li") || link.parentElement; if (!card || card.querySelector(`.tool-review-date[data-tool-review="${id}"]`)) return;
      const p = document.createElement("p"); p.className = "tool-review-date"; p.dataset.toolReview = id; p.style.cssText = "font-size:12px;color:#6b7280;margin:8px 0 0;line-height:1.35";
      p.textContent = isEnglish() ? `Checked: ${TODAY_EN}` : `Ελέγχθηκε: ${TODAY_EL}`; card.appendChild(p);
    });
  }
  function refreshDates() {
    fixFooterDate();
    document.querySelectorAll(".tool-review-date").forEach((p) => { const desired = isEnglish() ? `Checked: ${TODAY_EN}` : `Ελέγχθηκε: ${TODAY_EL}`; if (p.textContent !== desired) p.textContent = desired; });
    markToolCards();
  }
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(refreshDates, 0);
    ["langEl","langEn"].forEach((id) => document.getElementById(id)?.addEventListener("click", () => setTimeout(refreshDates, 0)));
    const targets = [document.getElementById("toolGrid"), document.getElementById("advancedGrid"), document.getElementById("pathView")].filter(Boolean);
    if (targets.length && typeof MutationObserver !== "undefined") {
      const observer = new MutationObserver(() => setTimeout(refreshDates, 0));
      targets.forEach((t) => observer.observe(t, { childList:true, subtree:true }));
    }
  });

  window.AITOOLSKIDS_SEPTEMBER_REFRESH = Object.freeze({ version:"2026.09.05.1", updated:TODAY, primaryAnnualGuidance:"verified", languageQuizRefresh:true, toolAuditStamped:typeof TOOLS !== "undefined" ? Object.keys(TOOLS).length : 0 });
})();
