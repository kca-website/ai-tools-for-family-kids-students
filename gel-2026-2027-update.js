/**
 * gel-2026-2027-update.js
 * ------------------------------------------------------------
 * GEL curriculum refresh for school year 2026-2027.
 * Designed to load AFTER:
 *   - curriculum-2026-2027-expansion.js
 *   - official-curriculum-data.js
 * and BEFORE tutor.js/app.js.
 *
 * What it does:
 * 1) Replaces the temporary 2025-26 high-school Tutor catalog with a
 *    2026-27 catalog grouped by A/B/C Lyceum.
 * 2) Uses exact current-year sections only where they were checked in
 *    enough detail (Chemistry B, Computer Science B).
 * 3) For the rest, exposes safe navigation topics while clearly marking
 *    them as topic anchors, not as exact official section titles.
 * 4) Adds new diagnostics for Chemistry B and Computer Science B.
 * 5) Corrects the existing A Lyceum Informatics diagnostic so it no longer
 *    tests B-Lyceum algorithm material under the A-Lyceum course.
 *
 * Primary official collection used for publication status:
 * https://dide.ira.sch.gr/ekpedevtika-themata/ekp260810/
 * ------------------------------------------------------------
 */
(function () {
  "use strict";

  const SCHOOL_YEAR = "2026-2027";
  const VERIFIED_ON = "2026-08-30";
  const GEL_GUIDANCE = "https://dide.ira.sch.gr/ekpedevtika-themata/ekp260810/";
  const GEL_EXAM_SYLLABUS = "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027";
  const CHEM_B_DETAIL = "https://vaspapachristou.gr/odigies-didaskalias-chimias-b-gel-2026-2027/";
  const CS_B_DETAIL = "https://blogs.sch.gr/darchonti/lykeio/b-lykeioy/";

  const catalog = window.AITOOLSKIDS_TUTOR_CATALOG;
  if (!catalog?.zones?.high) {
    console.warn("[GEL 2026-27] Tutor catalog not found; update skipped.");
    return;
  }

  function topic(subjectId, index, labelEl, labelEn, explainEl, explainEn, optional) {
    return {
      id: `${subjectId}.topic-${index + 1}`,
      labelEl,
      labelEn,
      explainEl: explainEl || `Θέμα πλοήγησης για «${labelEl}». Χρησιμοποίησέ το για καθοδήγηση και έλεγξε πάντα το ακριβές κεφάλαιο στο σχολικό βιβλίο/στις οδηγίες.`,
      explainEn: explainEn || `Navigation topic for “${labelEn}”. Use it for guidance and always check the exact chapter in the textbook/annual instructions.`,
      optional: optional === true,
    };
  }

  function publishedSubject(id, grade, labelEl, labelEn, rows, sourceLabelEl) {
    const topics = rows.map((row, i) => topic(id, i, row[0], row[1], row[2], row[3], row[4]));
    return {
      id,
      grade,
      subjectLabelEl: labelEl,
      subjectLabelEn: labelEn,
      topics,
      curriculum: {
        schoolYear: SCHOOL_YEAR,
        coverageStatus: "annual-guidance-published-topic-anchors",
        coverageLabelEl: "Οδηγίες 2026–27 δημοσιευμένες — θέματα πλοήγησης",
        coverageLabelEn: "2026–27 guidance published — navigation topics",
        officialSectionsEl: [],
        officialSectionsEn: [],
        scopeNoteEl: "Η φετινή οδηγία 2026–27 για το μάθημα έχει δημοσιευτεί. Τα παρακάτω θέματα είναι ασφαλείς άγκυρες πλοήγησης του Tutor και δεν παρουσιάζονται ως αυτούσιοι επίσημοι τίτλοι κεφαλαίων, εκτός αν υπάρχει ειδική επαλήθευση.",
        scopeNoteEn: "The 2026–27 guidance for this subject has been published. The topics below are safe Tutor navigation anchors and are not presented as verbatim official section titles unless separately verified.",
        annualInstructionsStatus: "2026-27-published",
        annualInstructionsUrl: GEL_GUIDANCE,
        catalogUrl: GEL_GUIDANCE,
        examSyllabusUrl: GEL_EXAM_SYLLABUS,
        sourceLabelEl: sourceLabelEl || `Οδηγίες ${labelEl} 2026–27`,
        sourceLabelEn: `${labelEn} teaching guidance 2026–27`,
        verificationDate: VERIFIED_ON,
      },
    };
  }

  function exactSubject(id, grade, labelEl, labelEn, rows, sourceUrl, sourceLabelEl) {
    const topics = rows.map((row, i) => topic(id, i, row[0], row[1], row[2], row[3], row[4]));
    return {
      id,
      grade,
      subjectLabelEl: labelEl,
      subjectLabelEn: labelEn,
      topics,
      curriculum: {
        schoolYear: SCHOOL_YEAR,
        coverageStatus: "annual-instructions-verified",
        coverageLabelEl: "Επαληθευμένη διδακτέα ύλη 2026–27",
        coverageLabelEn: "Verified 2026–27 taught scope",
        officialSectionsEl: topics.map((x) => x.labelEl),
        officialSectionsEn: topics.map((x) => x.labelEn),
        scopeNoteEl: "Οι ενότητες έχουν ελεγχθεί πάνω στις φετινές οδηγίες 2026–27. Οι επιμέρους εξαιρέσεις παραγράφων παραμένουν όπως ορίζονται στην επίσημη οδηγία και δεν πρέπει να αγνοούνται.",
        scopeNoteEn: "These sections were checked against the 2026–27 guidance. Paragraph-level exclusions remain exactly as stated in the official guidance and must not be ignored.",
        annualInstructionsStatus: "2026-27-verified",
        annualInstructionsUrl: GEL_GUIDANCE,
        detailSourceUrl: sourceUrl || GEL_GUIDANCE,
        catalogUrl: GEL_GUIDANCE,
        examSyllabusUrl: GEL_EXAM_SYLLABUS,
        sourceLabelEl,
        sourceLabelEn: `${labelEn} teaching guidance 2026–27`,
        verificationDate: VERIFIED_ON,
      },
    };
  }

  const GENERIC = {
    greek: [
      ["Κατανόηση και ερμηνεία κειμένου", "Text comprehension and interpretation"],
      ["Γλωσσικές επιλογές και οργάνωση λόγου", "Language choices and text organisation"],
      ["Επιχειρηματολογία και παραγωγή λόγου", "Argumentation and writing"],
      ["Λογοτεχνική ανάγνωση και τεκμηριωμένη ερμηνεία", "Literary reading and evidence-based interpretation"],
    ],
    history: [
      ["Χρονολογική και ιστορική τοποθέτηση", "Chronological and historical context"],
      ["Αίτια, γεγονότα και συνέπειες", "Causes, events and consequences"],
      ["Αξιοποίηση ιστορικών πηγών", "Using historical sources"],
      ["Σύνδεση γεγονότων και ιστορική ερμηνεία", "Connecting events and historical interpretation"],
    ],
    ancient: [
      ["Κατανόηση και ερμηνεία αρχαίου κειμένου", "Understanding and interpreting Ancient Greek texts"],
      ["Λεξιλόγιο και μορφολογία", "Vocabulary and morphology"],
      ["Συντακτικό", "Syntax"],
      ["Μετάφραση / απόδοση νοήματος", "Translation / rendering meaning"],
    ],
    latin: [
      ["Κατανόηση και μετάφραση λατινικού κειμένου", "Understanding and translating Latin text"],
      ["Λεξιλόγιο και μορφολογία", "Vocabulary and morphology"],
      ["Συντακτικό", "Syntax"],
      ["Γραμματικά φαινόμενα μέσα στο κείμενο", "Grammar in context"],
    ],
    religion: [
      ["Κατανόηση θεματικών εννοιών", "Understanding thematic concepts"],
      ["Κείμενα, παράδοση και ιστορικό πλαίσιο", "Texts, tradition and historical context"],
      ["Διάλογος, αξίες και σύγχρονα ζητήματα", "Dialogue, values and contemporary issues"],
    ],
    physicsA: [
      ["Φυσικά μεγέθη, μετρήσεις και διανύσματα", "Physical quantities, measurements and vectors"],
      ["Κίνηση και γραφικές παραστάσεις", "Motion and graphs"],
      ["Δυνάμεις και νόμοι κίνησης", "Forces and laws of motion"],
      ["Ενέργεια και έργο", "Energy and work"],
    ],
    physicsB: [
      ["Ηλεκτρικό πεδίο και δυναμικό", "Electric field and potential"],
      ["Ηλεκτρικό ρεύμα και κυκλώματα", "Electric current and circuits"],
      ["Μαγνητισμός και ηλεκτρομαγνητικά φαινόμενα", "Magnetism and electromagnetic phenomena"],
      ["Βασικές εφαρμογές φυσικής", "Core physics applications"],
    ],
    physicsC: [
      ["Ταλαντώσεις και κύματα", "Oscillations and waves"],
      ["Κρούσεις και ορμή", "Collisions and momentum"],
      ["Μηχανική στερεού σώματος", "Rigid-body mechanics"],
      ["Ηλεκτρομαγνητισμός", "Electromagnetism"],
    ],
    chemistryA: [
      ["Δομή ατόμου και περιοδικός πίνακας", "Atomic structure and the periodic table"],
      ["Χημικοί δεσμοί", "Chemical bonding"],
      ["Χημικές αντιδράσεις", "Chemical reactions"],
      ["Οξέα, βάσεις, άλατα και οξείδια", "Acids, bases, salts and oxides"],
      ["Βασικές ποσοτικές έννοιες / εισαγωγή στη στοιχειομετρία", "Basic quantitative concepts / introduction to stoichiometry"],
    ],
    chemistryC: [
      ["Οξειδοαναγωγή", "Redox chemistry"],
      ["Θερμοχημεία", "Thermochemistry"],
      ["Χημική κινητική", "Chemical kinetics"],
      ["Χημική ισορροπία", "Chemical equilibrium"],
      ["Ιοντική ισορροπία", "Ionic equilibrium"],
      ["Οργανική χημεία και συνθετικές πορείες", "Organic chemistry and synthesis routes"],
    ],
    biologyA: [
      ["Οργάνωση ανθρώπινου οργανισμού", "Organisation of the human body"],
      ["Συστήματα οργάνων και λειτουργίες", "Organ systems and functions"],
      ["Ομοιόσταση και υγεία", "Homeostasis and health"],
      ["Βιολογικές έννοιες μέσα από δεδομένα και παραδείγματα", "Biological concepts through data and examples"],
    ],
    biologyB: [
      ["Κύτταρο και κυτταρικές λειτουργίες", "Cells and cellular functions"],
      ["Μεταβολισμός και ενέργεια", "Metabolism and energy"],
      ["Γενετικό υλικό και έκφραση πληροφορίας", "Genetic material and gene expression"],
      ["Κληρονομικότητα και βιολογική ποικιλότητα", "Heredity and biological diversity"],
    ],
    biologyC: [
      ["Γενετικό υλικό και μοριακή βιολογία", "Genetic material and molecular biology"],
      ["Κληρονομικότητα και μεταλλάξεις", "Heredity and mutations"],
      ["Βιοτεχνολογία", "Biotechnology"],
      ["Εφαρμογές βιολογίας και βιοηθικά ζητήματα", "Biology applications and bioethical issues"],
    ],
    algebraA: [
      ["Πραγματικοί αριθμοί και αλγεβρικές παραστάσεις", "Real numbers and algebraic expressions"],
      ["Εξισώσεις και ανισώσεις", "Equations and inequalities"],
      ["Συναρτήσεις και γραφικές παραστάσεις", "Functions and graphs"],
      ["Βασικές αλγεβρικές μέθοδοι", "Core algebraic methods"],
    ],
    algebraB: [
      ["Συστήματα", "Systems of equations"],
      ["Ιδιότητες συναρτήσεων", "Properties of functions"],
      ["Τριγωνομετρία", "Trigonometry"],
      ["Πολυώνυμα και πολυωνυμικές εξισώσεις", "Polynomials and polynomial equations"],
      ["Εκθετική και λογαριθμική συνάρτηση", "Exponential and logarithmic functions"],
    ],
    geometryA: [
      ["Βασικές γεωμετρικές έννοιες και αποδείξεις", "Core geometry concepts and proofs"],
      ["Τρίγωνα και παραλληλία", "Triangles and parallel lines"],
      ["Παραλληλόγραμμα και ιδιότητες", "Parallelograms and properties"],
      ["Κύκλος και βασικές σχέσεις", "Circle and core relations"],
    ],
    geometryB: [
      ["Αναλογίες και ομοιότητα", "Proportions and similarity"],
      ["Μετρικές σχέσεις", "Metric relations"],
      ["Πυθαγόρειο θεώρημα και εφαρμογές", "Pythagorean theorem and applications"],
      ["Εμβαδά και γεωμετρικές εφαρμογές", "Areas and geometry applications"],
    ],
    mathOrientationB: [
      ["Διανύσματα", "Vectors"],
      ["Συντεταγμένες στο επίπεδο", "Coordinates in the plane"],
      ["Ευθεία και αναλυτική γεωμετρία", "Lines and analytic geometry"],
      ["Βασικές εφαρμογές μαθηματικών προσανατολισμού", "Core orientation-math applications"],
    ],
    mathGeneralC: [
      ["Στατιστική περιγραφή δεδομένων", "Descriptive statistics"],
      ["Πιθανότητες και ερμηνεία", "Probability and interpretation"],
      ["Μαθηματικά μοντέλα και δεδομένα", "Mathematical models and data"],
    ],
    mathOrientationC: [
      ["Όρια και συνέχεια", "Limits and continuity"],
      ["Παράγωγος και εφαρμογές", "Derivatives and applications"],
      ["Μελέτη συναρτήσεων", "Function analysis"],
      ["Ολοκληρώματα", "Integrals"],
    ],
    civics: [
      ["Κοινωνία και κοινωνικοί θεσμοί", "Society and social institutions"],
      ["Πολίτης, δημοκρατία και δικαιώματα", "Citizenship, democracy and rights"],
      ["Βασικές οικονομικές έννοιες", "Basic economic concepts"],
      ["Σύγχρονα κοινωνικά ζητήματα", "Contemporary social issues"],
    ],
    philosophy: [
      ["Φιλοσοφικά ερωτήματα και επιχειρήματα", "Philosophical questions and arguments"],
      ["Γνώση και αλήθεια", "Knowledge and truth"],
      ["Ηθική φιλοσοφία", "Ethics"],
      ["Πολιτική και κοινωνική φιλοσοφία", "Political and social philosophy"],
    ],
    economics: [
      ["Βασικές οικονομικές έννοιες", "Basic economic concepts"],
      ["Ζήτηση, προσφορά και αγορά", "Demand, supply and markets"],
      ["Παραγωγή, κόστος και επιχειρήσεις", "Production, cost and firms"],
      ["Μακροοικονομικές έννοιες και εφαρμογές", "Macroeconomic concepts and applications"],
    ],
    csA: [
      ["Ανάπτυξη μικροεφαρμογών", "Developing small applications"],
      ["Υπηρεσίες Διαδικτύου και Web 2.0", "Internet services and Web 2.0"],
      ["HTML και βασική δομή ιστοσελίδας", "HTML and basic web-page structure"],
      ["Εφαρμογές Νέφους και συνεργατικά έγγραφα", "Cloud applications and collaborative documents"],
      ["Κοινωνικά δίκτυα, πνευματικά δικαιώματα και ασφάλεια", "Social networks, copyright and online safety"],
    ],
    csC: [
      ["Ανάλυση προβλήματος", "Problem analysis"],
      ["Αλγόριθμοι και βασικές δομές", "Algorithms and core structures"],
      ["Δομές δεδομένων", "Data structures"],
      ["Προγραμματισμός και έλεγχος λύσης", "Programming and solution verification"],
    ],
  };

  const chemistryBRows = [
    ["4.4 Στοιχειομετρικοί υπολογισμοί (με τις επίσημες εξαιρέσεις)", "4.4 Stoichiometric calculations (with the official exclusions)"],
    ["1.1 Εισαγωγή στην οργανική χημεία", "1.1 Introduction to organic chemistry"],
    ["1.2 Ταξινόμηση οργανικών ενώσεων – ομόλογες σειρές", "1.2 Classification of organic compounds – homologous series"],
    ["1.3 Ονοματολογία άκυκλων οργανικών ενώσεων", "1.3 Nomenclature of acyclic organic compounds"],
    ["1.4 Ισομέρεια", "1.4 Isomerism"],
    ["2.1 Πετρέλαιο – προϊόντα πετρελαίου – βενζίνη – καύση/καύσιμα", "2.1 Petroleum – petroleum products – gasoline – combustion/fuels"],
    ["2.2 Νάφθα – πετροχημικά", "2.2 Naphtha – petrochemicals"],
    ["2.3 Αλκάνια – μεθάνιο, φυσικό αέριο, βιοαέριο (με εξαιρέσεις)", "2.3 Alkanes – methane, natural gas, biogas (with exclusions)"],
    ["2.4 Καυσαέρια – καταλύτες αυτοκινήτων", "2.4 Exhaust gases – catalytic converters"],
    ["2.5 Αλκένια – αιθένιο/αιθυλένιο", "2.5 Alkenes – ethene/ethylene"],
    ["2.6 Αλκίνια – αιθίνιο/ακετυλένιο (με εξαιρέσεις)", "2.6 Alkynes – ethyne/acetylene (with exclusions)"],
    ["2.8 Ατμοσφαιρική ρύπανση – φαινόμενο θερμοκηπίου – τρύπα όζοντος", "2.8 Air pollution – greenhouse effect – ozone hole"],
    ["3.1 Αλκοόλες", "3.1 Alcohols"],
    ["3.2 Κορεσμένες μονοσθενείς αλκοόλες – αιθανόλη (με εξαιρέσεις)", "3.2 Saturated monohydric alcohols – ethanol (with exclusions)"],
    ["4.1 Κορεσμένα μονοκαρβοξυλικά οξέα – αιθανικό οξύ", "4.1 Saturated monocarboxylic acids – ethanoic acid"],
    ["5.2 Λίπη και έλαια (με την επίσημη εξαίρεση)", "5.2 Fats and oils (with the official exclusion)"],
  ];

  const csBRows = [
    ["1.1 Επιστήμη των Υπολογιστών", "1.1 Computer Science"],
    ["2.1 Πρόβλημα", "2.1 Problem"],
    ["2.2 Αλγόριθμοι (με τις επίσημες εξαιρέσεις)", "2.2 Algorithms (with the official exclusions)"],
    ["2.3 Προγραμματισμός (με τις επίσημες εξαιρέσεις)", "2.3 Programming (with the official exclusions)"],
    ["3.1 Λειτουργικά Συστήματα", "3.1 Operating Systems"],
    ["3.2 Πληροφοριακά Συστήματα", "3.2 Information Systems"],
    ["3.3 Δίκτυα", "3.3 Networks"],
    ["3.4 Τεχνητή Νοημοσύνη", "3.4 Artificial Intelligence"],
  ];

  const high2026 = {
    a: [
      publishedSubject("neoelliniki-a-lykeiou", "a", "Νεοελληνική Γλώσσα & Λογοτεχνία, Α' Λυκείου", "Modern Greek Language & Literature, 10th Grade", GENERIC.greek),
      publishedSubject("istoria-a-lykeiou", "a", "Ιστορία, Α' Λυκείου", "History, 10th Grade", GENERIC.history),
      publishedSubject("politiki-paideia-a-lykeiou", "a", "Πολιτική Παιδεία, Α' Λυκείου", "Civic Education, 10th Grade", GENERIC.civics),
      publishedSubject("archaia-a-lykeiou", "a", "Αρχαία Ελληνικά, Α' Λυκείου", "Ancient Greek, 10th Grade", GENERIC.ancient),
      publishedSubject("thriskeftika-a-lykeiou", "a", "Θρησκευτικά, Α' Λυκείου", "Religious Studies, 10th Grade", GENERIC.religion),
      publishedSubject("fysiki-a-lykeiou", "a", "Φυσική, Α' Λυκείου", "Physics, 10th Grade", GENERIC.physicsA),
      publishedSubject("chimeia-a-lykeiou", "a", "Χημεία, Α' Λυκείου", "Chemistry, 10th Grade", GENERIC.chemistryA),
      publishedSubject("biologia-a-lykeiou", "a", "Βιολογία, Α' Λυκείου", "Biology, 10th Grade", GENERIC.biologyA),
      publishedSubject("algebra-a-lykeiou", "a", "Άλγεβρα, Α' Λυκείου", "Algebra, 10th Grade", GENERIC.algebraA),
      publishedSubject("geometria-a-lykeiou", "a", "Γεωμετρία, Α' Λυκείου", "Geometry, 10th Grade", GENERIC.geometryA),
      publishedSubject("pliroforiki-a-lykeiou", "a", "Εφαρμογές Πληροφορικής, Α' Λυκείου", "Computer Applications, 10th Grade", GENERIC.csA),
    ],
    b: [
      publishedSubject("neoelliniki-b-lykeiou", "b", "Νεοελληνική Γλώσσα & Λογοτεχνία, Β' Λυκείου", "Modern Greek Language & Literature, 11th Grade", GENERIC.greek),
      publishedSubject("istoria-b-lykeiou", "b", "Ιστορία, Β' Λυκείου", "History, 11th Grade", GENERIC.history),
      publishedSubject("archaia-b-lykeiou", "b", "Αρχαία Ελληνικά, Β' Λυκείου", "Ancient Greek, 11th Grade", GENERIC.ancient),
      publishedSubject("latinika-b-lykeiou", "b", "Λατινικά, Β' Λυκείου", "Latin, 11th Grade", GENERIC.latin),
      publishedSubject("filosofia-b-lykeiou", "b", "Φιλοσοφία, Β' Λυκείου", "Philosophy, 11th Grade", GENERIC.philosophy),
      publishedSubject("thriskeftika-b-lykeiou", "b", "Θρησκευτικά, Β' Λυκείου", "Religious Studies, 11th Grade", GENERIC.religion),
      publishedSubject("fysiki-b-lykeiou", "b", "Φυσική, Β' Λυκείου", "Physics, 11th Grade", GENERIC.physicsB),
      exactSubject("chimeia-b-lykeiou", "b", "Χημεία, Β' Λυκείου", "Chemistry, 11th Grade", chemistryBRows, CHEM_B_DETAIL, "Οδηγίες Χημείας Β' ΓΕΛ 2026–27"),
      publishedSubject("biologia-b-lykeiou", "b", "Βιολογία, Β' Λυκείου", "Biology, 11th Grade", GENERIC.biologyB),
      publishedSubject("algebra-b-lykeiou", "b", "Άλγεβρα, Β' Λυκείου", "Algebra, 11th Grade", GENERIC.algebraB),
      publishedSubject("geometria-b-lykeiou", "b", "Γεωμετρία, Β' Λυκείου", "Geometry, 11th Grade", GENERIC.geometryB),
      publishedSubject("mathimatika-b-prosanatolismou", "b", "Μαθηματικά Προσανατολισμού, Β' Λυκείου", "Orientation Mathematics, 11th Grade", GENERIC.mathOrientationB),
      exactSubject("pliroforiki-b-lykeiou", "b", "Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ, Β' Λυκείου", "Introduction to Computer Science, 11th Grade", csBRows, CS_B_DETAIL, "Οδηγίες Εισαγωγής στις Αρχές της Επιστήμης των Η/Υ Β' ΓΕΛ 2026–27"),
    ],
    c: [
      publishedSubject("neoelliniki-g-lykeiou", "c", "Νεοελληνική Γλώσσα & Λογοτεχνία, Γ' Λυκείου", "Modern Greek Language & Literature, 12th Grade", GENERIC.greek),
      publishedSubject("istoria-g-lykeiou", "c", "Ιστορία, Γ' Λυκείου", "History, 12th Grade", GENERIC.history),
      publishedSubject("archaia-g-lykeiou", "c", "Αρχαία Ελληνικά Προσανατολισμού, Γ' Λυκείου", "Ancient Greek (Orientation), 12th Grade", GENERIC.ancient),
      publishedSubject("latinika-g-lykeiou", "c", "Λατινικά Προσανατολισμού, Γ' Λυκείου", "Latin (Orientation), 12th Grade", GENERIC.latin),
      publishedSubject("thriskeftika-g-lykeiou", "c", "Θρησκευτικά, Γ' Λυκείου", "Religious Studies, 12th Grade", GENERIC.religion),
      publishedSubject("fysiki-g-lykeiou", "c", "Φυσική Προσανατολισμού, Γ' Λυκείου", "Physics (Orientation), 12th Grade", GENERIC.physicsC),
      publishedSubject("chimeia-g-lykeiou", "c", "Χημεία Προσανατολισμού, Γ' Λυκείου", "Chemistry (Orientation), 12th Grade", GENERIC.chemistryC),
      publishedSubject("biologia-g-lykeiou", "c", "Βιολογία Προσανατολισμού, Γ' Λυκείου", "Biology (Orientation), 12th Grade", GENERIC.biologyC),
      publishedSubject("mathimatika-g-genikis", "c", "Μαθηματικά Γενικής Παιδείας, Γ' Λυκείου", "General Mathematics, 12th Grade", GENERIC.mathGeneralC),
      publishedSubject("mathimatika-g-prosanatolismou", "c", "Μαθηματικά Προσανατολισμού, Γ' Λυκείου", "Orientation Mathematics, 12th Grade", GENERIC.mathOrientationC),
      publishedSubject("oikonomia-g-lykeiou", "c", "Οικονομία Προσανατολισμού, Γ' Λυκείου", "Economics (Orientation), 12th Grade", GENERIC.economics),
      publishedSubject("pliroforiki-g-lykeiou", "c", "Πληροφορική Προσανατολισμού, Γ' Λυκείου", "Computer Science (Orientation), 12th Grade", GENERIC.csC),
    ],
  };

  // Link existing diagnostics to their refreshed catalog subject where the ids differ.
  function attachQuiz(grade, subjectId, quizId) {
    const subject = high2026[grade]?.find((x) => x.id === subjectId);
    if (subject) subject.quizId = quizId;
  }
  attachQuiz("a", "neoelliniki-a-lykeiou", "ekthesi-a-lykeiou");
  attachQuiz("b", "neoelliniki-b-lykeiou", "ekthesi-b-lykeiou");
  attachQuiz("c", "neoelliniki-g-lykeiou", "ekthesi-g-lykeiou");
  attachQuiz("a", "algebra-a-lykeiou", "mathimatika-a-lykeiou");

  // The catalog's high object is frozen, but the arrays were not deep-frozen.
  // Replace their contents in-place so the existing getSubjects/getSubject closures keep working.
  ["a", "b", "c"].forEach((grade) => {
    const target = catalog.zones.high[grade];
    if (Array.isArray(target)) target.splice(0, target.length, ...high2026[grade]);
  });

  function learningPath(labelEl, labelEn, toolId) {
    return [
      {
        titleEl: "Δοκίμασε πρώτα μόνος/η",
        titleEn: "Try it yourself first",
        descriptionEl: `Γράψε τι ήδη γνωρίζεις για «${labelEl}» και προσπάθησε ένα μικρό παράδειγμα χωρίς βοήθεια.`,
        descriptionEn: `Write what you already know about “${labelEn}” and try one small example without help.`,
        toolId: null,
      },
      {
        titleEl: "Ζήτησε μία υπόδειξη",
        titleEn: "Ask for one hint",
        descriptionEl: `Άνοιξε την AI Βοήθεια και ζήτησε μία μόνο υπόδειξη για «${labelEl}». Ζήτησε να σε ρωτήσει πρώτα τι σκέφτεσαι, όχι να δώσει έτοιμη λύση.`,
        descriptionEn: `Open AI Help and ask for a single hint about “${labelEn}”. Ask it to question your thinking first, not provide a finished answer.`,
        toolId: toolId || "ai-help",
      },
      {
        titleEl: "Δείξε ότι το κατάλαβες",
        titleEn: "Prove you understand it",
        descriptionEl: `Εξήγησε το «${labelEl}» με δικά σου λόγια και λύσε/απάντησε ένα νέο παράδειγμα χωρίς να κοιτάξεις την προηγούμενη απάντηση.`,
        descriptionEn: `Explain “${labelEn}” in your own words and solve/answer one new example without looking at the previous answer.`,
        toolId: toolId || "ai-help",
      },
    ];
  }

  function registerQuiz(spec) {
    if (typeof QUIZZES === "undefined" || typeof GAP_TAGS === "undefined" || typeof LEARNING_PATHS === "undefined") return;
    QUIZZES.high ||= {};

    const questions = spec.items.map((item, index) => {
      const gapId = `${spec.id}.${item.slug}`;
      GAP_TAGS[gapId] = {
        id: gapId,
        labelEl: item.labelEl,
        labelEn: item.labelEn,
        explainEl: item.explainEl,
        explainEn: item.explainEn,
        recommendedToolIds: item.tools || ["ai-help", "chatgpt", "perplexity"],
        achievementEl: "Βήμα μπροστά",
        achievementEn: "One Step Forward",
        positiveMessageEl: "Κατανόησες αυτή τη βασική έννοια.",
        positiveMessageEn: "You understood this key concept.",
        skillTagEl: item.labelEl,
        skillTagEn: item.labelEn,
      };
      LEARNING_PATHS[gapId] = learningPath(item.labelEl, item.labelEn, "ai-help");
      return {
        id: `q${index + 1}-${item.slug}`,
        textEl: item.qEl,
        textEn: item.qEn,
        options: [
          { textEl: item.correctEl, textEn: item.correctEn, isCorrect: true },
          { textEl: item.wrong1El, textEn: item.wrong1En, isCorrect: false, gapTag: gapId },
          { textEl: item.wrong2El, textEn: item.wrong2En, isCorrect: false, gapTag: gapId },
        ],
      };
    });

    QUIZZES.high[spec.id] = {
      id: spec.id,
      grades: [spec.grade],
      subjectLabelEl: spec.subjectLabelEl,
      subjectLabelEn: spec.subjectLabelEn,
      titleEl: `Διαγνωστικός Χάρτης — ${spec.shortEl}`,
      titleEn: `Learning Compass — ${spec.shortEn}`,
      introEl: spec.introEl,
      introEn: spec.introEn,
      questions,
    };
  }

  const I = (slug, labelEl, labelEn, explainEl, explainEn, qEl, qEn, correctEl, correctEn, wrong1El, wrong1En, wrong2El, wrong2En, tools) => ({
    slug, labelEl, labelEn, explainEl, explainEn, qEl, qEn,
    correctEl, correctEn, wrong1El, wrong1En, wrong2El, wrong2En, tools,
  });

  // NEW: Chemistry B diagnostic aligned to the actual 2026-27 scope.
  registerQuiz({
    id: "chimeia-b-lykeiou",
    grade: "b",
    subjectLabelEl: "Χημεία, Β' Λυκείου",
    subjectLabelEn: "Chemistry, 11th Grade",
    shortEl: "Χημεία Β' Λυκείου",
    shortEn: "11th Grade Chemistry",
    introEl: "5 σύντομες ερωτήσεις από βασικά σημεία της επίσημης ύλης Χημείας Β΄ ΓΕΛ 2026–27: στοιχειομετρία και οργανική χημεία. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    introEn: "5 short questions on key parts of the official 2026–27 Chemistry scope: stoichiometry and organic chemistry. This is not an exam and does not cover the whole syllabus.",
    items: [
      I(
        "stoichiometry-ratio", "Στοιχειομετρικές αναλογίες", "Stoichiometric ratios",
        "Χρειάζεται να συνδέσει τους συντελεστές μιας ισοσταθμισμένης εξίσωσης με τις αναλογίες mol.",
        "Needs to connect coefficients in a balanced equation with mole ratios.",
        "Στην αντίδραση 2H₂ + O₂ → 2H₂O, αν αντιδράσουν πλήρως 2 mol H₂ με αρκετό O₂, πόσα mol H₂O σχηματίζονται;",
        "In 2H₂ + O₂ → 2H₂O, if 2 mol H₂ react completely with enough O₂, how many mol H₂O form?",
        "2 mol", "2 mol", "1 mol", "1 mol", "4 mol", "4 mol",
        ["ai-help", "chatgpt", "wolfram-alpha"]
      ),
      I(
        "homologous-series", "Ομόλογες σειρές", "Homologous series",
        "Συγχέει την έννοια της ομόλογης σειράς με το ότι όλες οι οργανικές ενώσεις είναι ίδιες.",
        "Confuses a homologous series with the idea that all organic compounds are identical.",
        "Τι χαρακτηρίζει κυρίως μια ομόλογη σειρά οργανικών ενώσεων;",
        "What mainly characterises a homologous series of organic compounds?",
        "Κοινή χαρακτηριστική ομάδα/γενικός τύπος και παρόμοιες χημικές ιδιότητες.",
        "A common functional group/general formula and similar chemical properties.",
        "Ίδιος ακριβώς μοριακός τύπος για όλες τις ενώσεις.",
        "Exactly the same molecular formula for every compound.",
        "Ίδιος αριθμός ατόμων άνθρακα σε όλες τις ενώσεις.",
        "The same number of carbon atoms in every compound."
      ),
      I(
        "nomenclature", "Ονοματολογία άκυκλων οργανικών ενώσεων", "Nomenclature of acyclic organic compounds",
        "Χρειάζεται εξάσκηση στη σύνδεση συντακτικού τύπου και ονομασίας.",
        "Needs practice connecting a structural formula with its name.",
        "Πώς ονομάζεται ο υδρογονάνθρακας CH₃–CH₂–CH₃;",
        "What is the name of CH₃–CH₂–CH₃?",
        "Προπάνιο.", "Propane.", "Προπένιο.", "Propene.", "Αιθάνιο.", "Ethane."
      ),
      I(
        "isomerism", "Συντακτική ισομέρεια", "Structural isomerism",
        "Δεν έχει σταθεροποιήσει ότι ισομερή έχουν ίδιο μοριακό τύπο αλλά διαφορετική συντακτική δομή.",
        "Has not yet consolidated that isomers share a molecular formula but have different structures.",
        "Ποια πρόταση περιγράφει σωστά δύο συντακτικά ισομερή;",
        "Which statement correctly describes two structural isomers?",
        "Έχουν ίδιο μοριακό τύπο αλλά διαφορετικό συντακτικό τύπο.",
        "They have the same molecular formula but different structural formulas.",
        "Έχουν πάντα διαφορετικό αριθμό ατόμων άνθρακα.",
        "They always have different numbers of carbon atoms.",
        "Είναι η ίδια ένωση γραμμένη απλώς με άλλο χρώμα.",
        "They are the same compound written in a different colour."
      ),
      I(
        "combustion", "Καύση υδρογονανθράκων", "Hydrocarbon combustion",
        "Χρειάζεται να διακρίνει την τέλεια από την ατελή καύση και να τη συνδέει με τα προϊόντα της.",
        "Needs to distinguish complete from incomplete combustion and connect it with the products.",
        "Στην τέλεια καύση ενός υδρογονάνθρακα με αρκετό οξυγόνο, ποια είναι τα βασικά προϊόντα;",
        "In complete combustion of a hydrocarbon with enough oxygen, what are the main products?",
        "CO₂ και H₂O.", "CO₂ and H₂O.", "Μόνο H₂.", "Only H₂.", "Μόνο στερεός άνθρακας.", "Only solid carbon."
      ),
    ],
  });

  // NEW: Computer Science B diagnostic aligned to the 2026-27 guidance.
  registerQuiz({
    id: "pliroforiki-b-lykeiou",
    grade: "b",
    subjectLabelEl: "Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ, Β' Λυκείου",
    subjectLabelEn: "Introduction to Computer Science, 11th Grade",
    shortEl: "Πληροφορική Β' Λυκείου",
    shortEn: "11th Grade Computer Science",
    introEl: "5 σύντομες ερωτήσεις από βασικές ενότητες της επίσημης διδακτέας ύλης 2026–27: πρόβλημα/αλγόριθμοι, προγραμματισμός, λειτουργικά συστήματα, δίκτυα και ΤΝ. Δεν είναι διαγώνισμα.",
    introEn: "5 short questions from key parts of the official 2026–27 taught scope: problems/algorithms, programming, operating systems, networks and AI. This is not an exam.",
    items: [
      I(
        "algorithm", "Έννοια αλγορίθμου", "Algorithm concept",
        "Δεν αναγνωρίζει ότι ένας αλγόριθμος πρέπει να έχει σαφή και πεπερασμένα βήματα.",
        "Does not recognise that an algorithm must have clear, finite steps.",
        "Ποια περιγραφή ταιριάζει καλύτερα σε έναν αλγόριθμο;",
        "Which description best fits an algorithm?",
        "Μια σαφής, πεπερασμένη ακολουθία βημάτων για την επίλυση ενός προβλήματος.",
        "A clear, finite sequence of steps for solving a problem.",
        "Μια λίστα οδηγιών που δεν χρειάζεται να τελειώνει ποτέ.",
        "A list of instructions that never needs to end.",
        "Οποιοδήποτε κείμενο χωρίς συγκεκριμένο στόχο.",
        "Any text with no specific goal."
      ),
      I(
        "selection", "Δομή επιλογής", "Selection structure",
        "Συγχέει τη δομή επιλογής με την ακολουθία ή την επανάληψη.",
        "Confuses selection with sequence or iteration.",
        "Αν μια ενέργεια εκτελείται μόνο όταν ισχύει μια συνθήκη, ποια δομή ταιριάζει;",
        "If an action runs only when a condition is true, which structure fits?",
        "Δομή επιλογής (ΑΝ…ΤΟΤΕ).", "Selection (IF…THEN).",
        "Μόνο ακολουθία χωρίς συνθήκη.", "Only a sequence with no condition.",
        "Καμία αλγοριθμική δομή.", "No algorithmic structure."
      ),
      I(
        "operating-system", "Λειτουργικά συστήματα", "Operating systems",
        "Δεν έχει ξεκαθαρίσει τον ρόλο του λειτουργικού συστήματος στη διαχείριση πόρων και προγραμμάτων.",
        "Has not clarified the operating system's role in managing resources and programs.",
        "Ποιος είναι βασικός ρόλος ενός λειτουργικού συστήματος;",
        "What is a core role of an operating system?",
        "Να διαχειρίζεται το υλικό/τους πόρους και την εκτέλεση προγραμμάτων.",
        "To manage hardware/resources and program execution.",
        "Να αντικαθιστά το υλικό του υπολογιστή.",
        "To replace the computer hardware.",
        "Να λειτουργεί μόνο ως εφαρμογή ζωγραφικής.",
        "To work only as a drawing application."
      ),
      I(
        "networks", "Δίκτυα", "Networks",
        "Χρειάζεται να συνδέσει την έννοια του δικτύου με επικοινωνία και κοινή χρήση πόρων.",
        "Needs to connect the idea of a network with communication and resource sharing.",
        "Γιατί συνδέουμε υπολογιστές σε δίκτυο;",
        "Why do we connect computers in a network?",
        "Για επικοινωνία και κοινή χρήση δεδομένων/πόρων.",
        "For communication and sharing data/resources.",
        "Για να μην μπορούν να ανταλλάσσουν καθόλου δεδομένα.",
        "So they cannot exchange any data.",
        "Για να αυξηθεί υποχρεωτικά το μέγεθος της οθόνης.",
        "To necessarily increase the screen size."
      ),
      I(
        "ai", "Τεχνητή Νοημοσύνη", "Artificial Intelligence",
        "Χρειάζεται να κατανοήσει ότι τα συστήματα ΤΝ εκτελούν εργασίες με μοντέλα/δεδομένα αλλά δεν είναι αλάνθαστα.",
        "Needs to understand that AI systems perform tasks using models/data but are not infallible.",
        "Ποια πρόταση για ένα σύστημα ΤΝ είναι πιο σωστή;",
        "Which statement about an AI system is more accurate?",
        "Μπορεί να αναγνωρίζει μοτίβα ή να παράγει προβλέψεις, αλλά τα αποτελέσματα χρειάζονται έλεγχο.",
        "It can recognise patterns or make predictions, but its outputs need checking.",
        "Είναι πάντα σωστό επειδή χρησιμοποιεί υπολογιστή.",
        "It is always correct because it uses a computer.",
        "Δεν χρησιμοποιεί ποτέ δεδομένα ή κανόνες.",
        "It never uses data or rules."
      ),
    ],
  });

  // Remove the four temporary A-Lyceum Informatics gaps created in fa5b925.
  // They belonged to the wrong course framing (algorithm/selection/loop/phishing).
  if (typeof GAP_TAGS !== "undefined" && typeof LEARNING_PATHS !== "undefined") {
    ["algorithm", "selection", "loop", "phishing"].forEach((slug) => {
      const id = `pliroforiki-a-lykeiou.${slug}`;
      delete GAP_TAGS[id];
      delete LEARNING_PATHS[id];
    });
  }

  // CORRECTION: A-Lyceum Informatics is "Applications of Informatics".
  // Replace the temporary B-style algorithm quiz that existed under this id.
  registerQuiz({
    id: "pliroforiki-a-lykeiou",
    grade: "a",
    subjectLabelEl: "Εφαρμογές Πληροφορικής, Α' Λυκείου",
    subjectLabelEn: "Computer Applications, 10th Grade",
    shortEl: "Εφαρμογές Πληροφορικής Α' Λυκείου",
    shortEn: "10th Grade Computer Applications",
    introEl: "4 σύντομες ερωτήσεις σε βασικές δεξιότητες του μαθήματος Εφαρμογές Πληροφορικής. Η φετινή οδηγία 2026–27 έχει δημοσιευτεί· το τεστ λειτουργεί ως διαγνωστικό δεξιοτήτων και όχι ως πλήρης εξέταση ύλης.",
    introEn: "4 short questions on core skills from Computer Applications. The 2026–27 guidance has been published; this is a skills diagnostic, not a full syllabus examination.",
    items: [
      I(
        "html", "HTML και δομή ιστοσελίδας", "HTML and web-page structure",
        "Συγχέει την HTML με γλώσσα προγραμματισμού ή δεν αναγνωρίζει τον ρόλο των tags.",
        "Confuses HTML with a programming language or does not recognise the role of tags.",
        "Ποιος είναι ο βασικός ρόλος της HTML;",
        "What is the main role of HTML?",
        "Να περιγράφει/δομεί το περιεχόμενο μιας ιστοσελίδας με στοιχεία και ετικέτες.",
        "To describe/structure web-page content with elements and tags.",
        "Να αντικαθιστά το λειτουργικό σύστημα.",
        "To replace the operating system.",
        "Να κάνει μόνη της όλες τις αριθμητικές πράξεις ενός προγράμματος.",
        "To perform all arithmetic operations of a program by itself."
      ),
      I(
        "cloud", "Εφαρμογές Νέφους", "Cloud applications",
        "Χρειάζεται να διακρίνει μια υπηρεσία νέφους από μια εφαρμογή που λειτουργεί μόνο τοπικά.",
        "Needs to distinguish a cloud service from an application that works only locally.",
        "Ποιο είναι χαρακτηριστικό μιας εφαρμογής Νέφους;",
        "Which is a characteristic of a cloud application?",
        "Μπορεί να προσφέρει αποθήκευση/υπηρεσίες μέσω Διαδικτύου και πρόσβαση από διαφορετικές συσκευές.",
        "It can provide storage/services over the Internet and access from different devices.",
        "Λειτουργεί υποχρεωτικά χωρίς καμία σύνδεση και μόνο σε έναν υπολογιστή.",
        "It must work with no connection and only on one computer.",
        "Δεν επιτρέπει ποτέ συνεργασία ή κοινή χρήση.",
        "It never allows collaboration or sharing."
      ),
      I(
        "collaboration", "Συνεργατικά έγγραφα", "Collaborative documents",
        "Δεν έχει σταθεροποιήσει τη λογική ταυτόχρονης συνεργασίας και διαχείρισης πρόσβασης.",
        "Has not consolidated simultaneous collaboration and access control.",
        "Σε ένα συνεργατικό έγγραφο, ποια πρακτική είναι σωστή;",
        "In a collaborative document, which practice is appropriate?",
        "Δίνω μόνο τα δικαιώματα που χρειάζεται κάθε συνεργάτης και ελέγχω ποιος έχει πρόσβαση.",
        "Give each collaborator only the permissions they need and review who has access.",
        "Δημοσιεύω πάντα το έγγραφο δημόσια χωρίς έλεγχο.",
        "Always publish the document publicly without checking.",
        "Μοιράζομαι κωδικούς πρόσβασης μέσα στο ίδιο το έγγραφο.",
        "Share passwords inside the document itself."
      ),
      I(
        "online-safety", "Ασφάλεια και υπεύθυνη χρήση στο Διαδίκτυο", "Online safety and responsible use",
        "Χρειάζεται εξάσκηση στην αξιολόγηση συνδέσμων, δικαιωμάτων και προσωπικών δεδομένων.",
        "Needs practice evaluating links, permissions and personal data.",
        "Πριν ανεβάσεις προσωπικό αρχείο σε μια διαδικτυακή υπηρεσία, τι είναι πιο σωστό να ελέγξεις;",
        "Before uploading a personal file to an online service, what should you check?",
        "Ποιος θα έχει πρόσβαση, τι δικαιώματα δίνεις και τι λέει η υπηρεσία για τα δεδομένα.",
        "Who will have access, what permissions you grant and what the service says about data.",
        "Μόνο αν το κουμπί μεταφόρτωσης είναι μεγάλο.",
        "Only whether the upload button is large.",
        "Τίποτα — όλες οι υπηρεσίες χειρίζονται τα δεδομένα με τον ίδιο τρόπο.",
        "Nothing — all services handle data in exactly the same way."
      ),
    ],
  });

  // Remove the obsolete "2025-26 reference" text from the two diagnostics
  // that were added in fa5b925 and now have published 2026-27 guidance.
  if (typeof QUIZZES !== "undefined" && QUIZZES.high) {
    const chemA = QUIZZES.high["chimeia-a-lykeiou"];
    if (chemA) {
      chemA.introEl = "4 σύντομες διαγνωστικές ερωτήσεις σε βασικές έννοιες Χημείας Α΄ Λυκείου. Οι οδηγίες 2026–27 έχουν δημοσιευτεί· το τεστ δεν καλύπτει όλη τη διδακτέα ή εξεταστέα ύλη.";
      chemA.introEn = "4 short diagnostic questions on foundational 10th Grade Chemistry concepts. The 2026–27 guidance has been published; this quiz does not cover the full taught or examinable syllabus.";
    }
    const mathB = QUIZZES.high["mathimatika-b-lykeiou"];
    if (mathB) {
      mathB.introEl = "4 σύντομες μικτές ερωτήσεις Μαθηματικών Β΄ Λυκείου. Οι οδηγίες 2026–27 έχουν δημοσιευτεί, αλλά αυτό το μικτό διαγνωστικό δεν αντιστοιχεί σε έναν μόνο κλάδο/κεφάλαιο και δεν παρουσιάζεται ως πλήρης εξέταση ύλης.";
      mathB.introEn = "4 short mixed 11th Grade Mathematics questions. The 2026–27 guidance has been published, but this mixed diagnostic does not map to one single course strand/chapter and is not presented as a full syllabus exam.";
    }
  }

  // Update broad high-school filters used outside the Tutor.
  if (typeof CURRICULUM !== "undefined" && CURRICULUM.high) {
    CURRICULUM.high.technology = {
      toolIds: ["ai-help", "chatgpt", "wolfram-alpha"],
      noteEl: "Εφαρμογές Πληροφορικής, Εισαγωγή στην Επιστήμη Η/Υ και Πληροφορική Προσανατολισμού, με φετινή βάση 2026–27.",
      noteEn: "Computer Applications, Introduction to Computer Science and orientation Computer Science, based on 2026–27 guidance.",
    };
  }

  window.AITOOLSKIDS_GEL_2026_2027_UPDATE = Object.freeze({
    version: "1.0.0",
    schoolYear: SCHOOL_YEAR,
    verifiedOn: VERIFIED_ON,
    sources: Object.freeze({
      gelGuidance: GEL_GUIDANCE,
      gelExamSyllabus: GEL_EXAM_SYLLABUS,
      chemistryBDetail: CHEM_B_DETAIL,
      computerScienceBDetail: CS_B_DETAIL,
    }),
    subjectCounts: Object.freeze({
      a: high2026.a.length,
      b: high2026.b.length,
      c: high2026.c.length,
      total: high2026.a.length + high2026.b.length + high2026.c.length,
    }),
    diagnosticsAdded: Object.freeze(["chimeia-b-lykeiou", "pliroforiki-b-lykeiou"]),
    diagnosticsCorrected: Object.freeze(["pliroforiki-a-lykeiou"]),
  });

  console.info("[GEL 2026-27] Catalog refreshed", window.AITOOLSKIDS_GEL_2026_2027_UPDATE);
})();
