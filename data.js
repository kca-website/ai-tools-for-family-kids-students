/**
 * data.js
 * ------------------------------------------------------------
 * Πηγή δεδομένων για το AI Tools for Family, Kids & Students.
 *
 * ΔΟΜΗ (path-first):
 *   ZONES        -> ορισμός των 3 ηλικιακών ζωνών
 *   ROLES        -> ορισμός των 2 "λεωφορείων" (γονιός/εκπαιδευτικός, μαθητής)
 *   TOOLS        -> master λίστα εργαλείων (κοινά στοιχεία: όνομα, link, κατηγορία,
 *                   επίσημο ελάχιστο όριο ηλικίας βάσει Terms of Service)
 *   PATHS        -> για κάθε ζώνη+ρόλο, ποια tools εμφανίζονται + ζώνη-specific
 *                   καθοδήγηση (πώς/γιατί να το χρησιμοποιήσεις σε ΑΥΤΗ τη ζώνη)
 *
 * Το app.js διαβάζει PATHS[zoneId][roleId] για να αποφασίσει τι δείχνει.
 * Κάθε entry μέσα σε ένα path παραπέμπει σε toolId από το TOOLS και προσθέτει
 * ζώνη-specific πεδία (useCase, howTo, caution).
 *
 * ΣΗΜΑΝΤΙΚΟ σχετικά με τα όρια ηλικίας (minAge στο TOOLS):
 *   Τα όρια προέρχονται από τους Όρους Χρήσης (Terms of Service) του κάθε
 *   προμηθευτή, όπως ίσχυαν τον Αύγουστο 2026. Οι προμηθευτές αλλάζουν αυτούς
 *   τους όρους συχνά και χωρίς προειδοποίηση — πριν από κάθε χρήση, ειδικά σε
 *   ζώνη Δημοτικού/Γυμνασίου, έλεγξε την επίσημη σελίδα του προμηθευτή.
 *   Ένα tool εμφανίζεται σε μια ζώνη ΜΟΝΟ αν υπάρχει νόμιμος τρόπος χρήσης
 *   του σε αυτή την ηλικία (π.χ. γονική συγκατάθεση, Family Link,
 *   σχολικός λογαριασμός) — το PATHS entry εξηγεί ΠΟΙΟΣ τρόπος.
 * ------------------------------------------------------------
 */

// ---------- ΖΩΝΕΣ ----------
const ZONES = [
  {
    id: "primary",
    icon: "🧒",
    labelEl: "Δημοτικό",
    labelEn: "Primary",
    ageRangeEl: "6–12 ετών",
    ageRangeEn: "Ages 6–12",
    descriptionEl: "Περιορισμένα εργαλεία, πάντα με επίβλεψη ενήλικα.",
    descriptionEn: "Limited tools, always with adult supervision.",
  },
  {
    id: "middle",
    icon: "🎒",
    labelEl: "Γυμνάσιο",
    labelEn: "Middle School",
    ageRangeEl: "12–15 ετών",
    ageRangeEn: "Ages 12–15",
    descriptionEl: "Περισσότερα εργαλεία, αρχή αυτόνομης χρήσης.",
    descriptionEn: "More tools, the start of independent use.",
  },
  {
    id: "high",
    icon: "🎓",
    labelEl: "Λύκειο",
    labelEn: "High School",
    ageRangeEl: "15–18 ετών",
    ageRangeEn: "Ages 15–18",
    descriptionEl: "Σχεδόν πλήρες φάσμα εργαλείων, έμφαση στη σωστή χρήση.",
    descriptionEn: "Near-full range of tools, emphasis on proper use.",
  },
];

// ---------- ΡΟΛΟΙ ("λεωφορεία") ----------
const ROLES = [
  {
    id: "guardian",
    icon: "👪",
    labelEl: "Γονιός / Εκπαιδευτικός",
    labelEn: "Parent / Educator",
    taglineEl: "Τι να ξέρεις, πώς να εποπτεύσεις",
    taglineEn: "What to know, how to supervise",
  },
  {
    id: "student",
    icon: "🧑‍🎓",
    labelEl: "Μαθητής",
    labelEn: "Student",
    taglineEl: "Πώς να το χρησιμοποιήσεις σωστά",
    taglineEn: "How to use it the right way",
  },
];

// ---------- ΚΑΤΗΓΟΡΙΕΣ ΕΡΓΑΛΕΙΩΝ ----------
const CATEGORIES = [
  { id: "writing", labelEl: "Γραφή & Κείμενο", labelEn: "Writing & Text" },
  { id: "research", labelEl: "Έρευνα & Μάθηση", labelEn: "Research & Learning" },
  { id: "math", labelEl: "Μαθηματικά & Λογική", labelEn: "Math & Logic" },
  { id: "creative", labelEl: "Δημιουργικότητα (εικόνα/ήχος)", labelEn: "Creative (image/audio)" },
  { id: "coding", labelEl: "Προγραμματισμός", labelEn: "Coding" },
  { id: "organization", labelEl: "Οργάνωση & Παραγωγικότητα", labelEn: "Organization & Productivity" },
  { id: "language", labelEl: "Γλώσσες", labelEn: "Languages" },
];

/**
 * ---------- MASTER ΛΙΣΤΑ ΕΡΓΑΛΕΙΩΝ ----------
 * Κοινά, ανεξάρτητα-από-ζώνη στοιχεία.
 * minAge: επίσημο ελάχιστο όριο βάσει Terms of Service (Αύγουστος 2026).
 * minAgeNote: συνοπτική εξήγηση του πλαισίου (π.χ. "με γονική συγκατάθεση").
 */
const TOOLS = {
  // ---------- ΓΡΑΦΗ & ΚΕΙΜΕΝΟ / ΓΕΝΙΚΟΙ ΒΟΗΘΟΙ ----------
  "chatgpt": {
    id: "chatgpt",
    name: "ChatGPT",
    url: "https://chatgpt.com",
    category: "writing",
    logo: null,
    minAge: 13,
    minAgeNote: "13+, με γονική συγκατάθεση 13–17 (OpenAI Terms of Use).",
    shortDescEl: "Γενικός chatbot AI για γραφή, εξηγήσεις και βοήθεια σε πολλά μαθήματα.",
    shortDescEn: "General-purpose AI chatbot for writing, explanations, and help across subjects.",
  },
  "gemini": {
    id: "gemini",
    name: "Google Gemini",
    url: "https://gemini.google.com",
    category: "writing",
    logo: null,
    minAge: 13,
    minAgeNote:
      "13+ για προσωπικό λογαριασμό. Κάτω των 13, μόνο μέσω Google Family Link (εποπτευόμενος λογαριασμός) ή σχολικού λογαριασμού Google Classroom.",
    shortDescEl: "Chatbot AI της Google, ενσωματωμένο σε Google Classroom για μαθητές μέσω σχολείου.",
    shortDescEn: "Google's AI chatbot, integrated into Google Classroom for school-managed student access.",
  },
  "copilot": {
    id: "copilot",
    name: "Microsoft Copilot",
    url: "https://copilot.microsoft.com",
    category: "writing",
    logo: null,
    minAge: 13,
    minAgeNote: "13+ (μπορεί να είναι υψηλότερο ανά χώρα). Χωρίς πρόσβαση κάτω του ορίου, ακόμη και με γονική άδεια.",
    shortDescEl: "AI βοηθός της Microsoft, ενσωματωμένος σε Word/Excel/PowerPoint και ως ανεξάρτητο chatbot.",
    shortDescEn: "Microsoft's AI assistant, built into Word/Excel/PowerPoint and available as a standalone chatbot.",
  },
  "claude": {
    id: "claude",
    name: "Claude",
    url: "https://claude.ai",
    category: "writing",
    logo: null,
    minAge: 18,
    minAgeNote: "18+ μόνο. Δεν υπάρχει διαδρομή γονικής συγκατάθεσης για κάτω των 18.",
    shortDescEl: "AI chatbot της Anthropic. Δεν προσφέρει πρόσβαση σε ανηλίκους, ούτε με γονική άδεια.",
    shortDescEn: "Anthropic's AI chatbot. Offers no access path for minors, even with parental consent.",
  },
  "grammarly": {
    id: "grammarly",
    name: "Grammarly",
    url: "https://www.grammarly.com",
    category: "writing",
    logo: null,
    minAge: 13,
    minAgeNote: "13+ βάσει Όρων Χρήσης· υπάρχει και εκπαιδευτική έκδοση (Grammarly for Education) για σχολικούς λογαριασμούς.",
    shortDescEl: "Εργαλείο διόρθωσης γραμματικής, ορθογραφίας και ύφους σε αγγλικό κείμενο.",
    shortDescEn: "Grammar, spelling, and style-checking tool for English writing.",
  },

  // ---------- ΕΡΕΥΝΑ & ΜΑΘΗΣΗ ----------
  "khanmigo": {
    id: "khanmigo",
    name: "Khanmigo (Khan Academy)",
    url: "https://www.khanacademy.org/khan-labs",
    category: "research",
    logo: null,
    minAge: 5,
    minAgeNote: "Σχεδιασμένο για K-12. Κάτω των 13, ο λογαριασμός δημιουργείται/διαχειρίζεται από γονέα.",
    shortDescEl: "AI εκπαιδευτικός βοηθός πάνω στο Khan Academy — καθοδηγεί με ερωτήσεις αντί να δίνει έτοιμη απάντηση.",
    shortDescEn: "AI tutor built on Khan Academy — guides with Socratic questions instead of handing over answers.",
  },
  "notebooklm": {
    id: "notebooklm",
    name: "NotebookLM",
    url: "https://notebooklm.google.com",
    category: "research",
    logo: null,
    minAge: 18,
    minAgeNote: "Απαιτεί προσωπικό λογαριασμό Google 18+ ή σχολικό λογαριασμό Google Workspace for Education.",
    shortDescEl: "Εργαλείο της Google που συνοψίζει και οργανώνει σημειώσεις/πηγές που ανεβάζεις εσύ.",
    shortDescEn: "Google's tool that summarizes and organizes notes/sources you upload yourself.",
  },
  "perplexity": {
    id: "perplexity",
    name: "Perplexity",
    url: "https://www.perplexity.ai",
    category: "research",
    logo: null,
    minAge: 18,
    minAgeNote: "18+ βάσει Όρων Χρήσης (κάτω των 18 απαιτείται γονική συγκατάθεση/επίβλεψη κατά περίπτωση χώρας).",
    shortDescEl: "Μηχανή έρευνας με AI που απαντά με βάση πηγές και παραθέτει τις πηγές του.",
    shortDescEn: "AI-powered research/search engine that answers with cited sources.",
  },
  "wolfram-alpha": {
    id: "wolfram-alpha",
    name: "Wolfram Alpha",
    url: "https://www.wolframalpha.com",
    category: "math",
    logo: null,
    minAge: 13,
    minAgeNote: "13+ βάσει Όρων Χρήσης· χωρίς κοινωνικά χαρακτηριστικά ή chat ελεύθερης μορφής.",
    shortDescEl: "Υπολογιστική μηχανή γνώσης — λύνει μαθηματικά, φυσική, χημεία βήμα-βήμα.",
    shortDescEn: "Computational knowledge engine — solves math, physics, and chemistry step by step.",
  },
  "quizlet": {
    id: "quizlet",
    name: "Quizlet",
    url: "https://quizlet.com",
    category: "organization",
    logo: null,
    minAge: 13,
    minAgeNote: "13+ βάσει Όρων Χρήσης· εκπαιδευτικοί μπορούν να δημιουργήσουν λογαριασμούς τάξης για μικρότερους μαθητές.",
    shortDescEl: "Φλασκάρτες και quiz με AI-υποβοηθούμενη δημιουργία για διάβασμα/απομνημόνευση.",
    shortDescEn: "Flashcards and quizzes with AI-assisted creation for studying and memorization.",
  },

  // ---------- ΜΑΘΗΜΑΤΙΚΑ & ΛΟΓΙΚΗ ----------
  "photomath": {
    id: "photomath",
    name: "Photomath",
    url: "https://photomath.com",
    category: "math",
    logo: null,
    minAge: 4,
    minAgeNote: "Χωρίς αυστηρό όριο ηλικίας στους Όρους Χρήσης· δεν έχει chat ελεύθερης μορφής ή κοινωνικά χαρακτηριστικά.",
    shortDescEl: "Φωτογραφίζεις ένα μαθηματικό πρόβλημα και σου δείχνει τη λύση βήμα-βήμα.",
    shortDescEn: "Point your camera at a math problem and get a step-by-step solution.",
  },

  // ---------- ΔΗΜΙΟΥΡΓΙΚΟΤΗΤΑ ----------
  "canva-magic": {
    id: "canva-magic",
    name: "Canva (Magic Studio)",
    url: "https://www.canva.com",
    category: "creative",
    logo: null,
    minAge: 13,
    minAgeNote: "13+ για προσωπικό λογαριασμό· υπάρχει Canva for Education με σχολικούς λογαριασμούς για μικρότερες ηλικίες υπό επίβλεψη εκπαιδευτικού.",
    shortDescEl: "Εργαλείο σχεδίασης με AI χαρακτηριστικά (δημιουργία εικόνων, αφαίρεση φόντου, κείμενο σε σχέδιο).",
    shortDescEn: "Design tool with AI features (image generation, background removal, text-to-design).",
  },

  // ---------- ΠΡΟΓΡΑΜΜΑΤΙΣΜΟΣ ----------
  "github-copilot": {
    id: "github-copilot",
    name: "GitHub Copilot",
    url: "https://github.com/features/copilot",
    category: "coding",
    logo: null,
    minAge: 13,
    minAgeNote: "Απαιτεί λογαριασμό GitHub (13+)· δωρεάν έκδοση για επαληθευμένους μαθητές/φοιτητές μέσω GitHub Education.",
    shortDescEl: "AI βοηθός προγραμματισμού που προτείνει κώδικα μέσα στον επεξεργαστή κώδικα.",
    shortDescEn: "AI coding assistant that suggests code directly inside your code editor.",
  },

  // ---------- ΓΛΩΣΣΕΣ ----------
  "duolingo": {
    id: "duolingo",
    name: "Duolingo",
    url: "https://www.duolingo.com",
    category: "language",
    logo: null,
    minAge: 5,
    minAgeNote:
      "Δεν υπάρχει αυστηρό κατώτατο όριο· κάτω των 13 ο λογαριασμός συνδέεται με email γονέα (περιορισμένα κοινωνικά χαρακτηριστικά). Υπάρχει και ξεχωριστή εφαρμογή Duolingo Kids/ABC για μικρότερες ηλικίες.",
    shortDescEl: "Εκμάθηση γλωσσών με μικρά, παιχνιδοποιημένα μαθήματα. Οι νεότερες εκδόσεις χρησιμοποιούν AI για εξατομίκευση.",
    shortDescEn: "Language learning through short, gamified lessons. Newer features use AI for personalization.",
  },
};

/**
 * ---------- PATHS ----------
 * PATHS[zoneId][roleId] = {
 *   introEl / introEn: σύντομη εισαγωγή για αυτόν τον συνδυασμό ζώνης+ρόλου,
 *   tools: [
 *     {
 *       toolId: αναφορά σε TOOLS,
 *       useCaseEl/En: για ΤΙ δουλειά είναι κατάλληλο εδώ (το κύριο focus),
 *       howToEl/En: πώς να το χρησιμοποιήσει ο μαθητής / πώς να εποπτεύσει ο γονιός,
 *       cautionEl/En: τυχόν προσοχή (προαιρετικό, ΔΕΝ είναι το κέντρο βάρους),
 *     }
 *   ]
 * }
 */
const PATHS = {
  // ============================================================
  // 🧒 ΔΗΜΟΤΙΚΟ (6–12)
  // Μόνο εργαλεία με νόμιμη διαδρομή πρόσβασης σε αυτή την ηλικία:
  // γονική συγκατάθεση / Family Link / σχολικός λογαριασμός / χωρίς όριο.
  // ============================================================
  primary: {
    guardian: {
      introEl:
        "Σε αυτή την ηλικία, κάθε εργαλείο AI χρειάζεται δικό σου λογαριασμό, δική σου ρύθμιση ή άμεση παρουσία σου. Παρακάτω: ποιο εργαλείο για ποια συγκεκριμένη σχολική δουλειά, και πώς νόμιμα αποκτά πρόσβαση το παιδί.",
      introEn:
        "At this age, every AI tool needs your account, your setup, or your direct presence. Below: which tool fits which specific schoolwork, and how the child legally gets access.",
      tools: [
        {
          toolId: "khanmigo",
          useCaseEl: "Εξάσκηση μαθηματικών και ανάγνωσης με καθοδήγηση, όχι έτοιμες απαντήσεις.",
          useCaseEn: "Guided math and reading practice — not handed-over answers.",
          howToEl: "Δημιούργησε εσύ τον λογαριασμό Khan Academy για το παιδί και σύνδεσέ τον με το σχολικό του πρόγραμμα.",
          howToEn: "Create the Khan Academy account yourself for the child and link it to their school curriculum.",
          cautionEl: "Επί πληρωμή (περίπου 44$/έτος) — υπάρχει δωρεάν εκδοχή του Khan Academy χωρίς AI tutor.",
          cautionEn: "Paid (around $44/year) — a free Khan Academy version without the AI tutor also exists.",
        },
        {
          toolId: "photomath",
          useCaseEl: "Γρήγορος έλεγχος αν μια λύση μαθηματικού προβλήματος είναι σωστή.",
          useCaseEn: "Quick check of whether a math problem's solution is correct.",
          howToEl: "Χρησιμοποίησέ το ως εργαλείο ελέγχου ΜΕΤΑ την προσπάθεια του παιδιού, όχι πριν.",
          howToEn: "Use it as a check AFTER the child's own attempt, not before.",
          cautionEl: "Δεν έχει chat ή κοινωνικά χαρακτηριστικά — ασφαλές από άποψη επικοινωνίας, αλλά εύκολο να γίνει shortcut αντί για μάθηση.",
          cautionEn: "No chat or social features — safe from a communication standpoint, but easy to misuse as a shortcut instead of learning.",
        },
        {
          toolId: "gemini",
          useCaseEl: "Μετατροπή υλικού τάξης σε flashcards ή quiz για επανάληψη.",
          useCaseEn: "Turning classroom material into flashcards or quizzes for review.",
          howToEl: "Πρόσβαση μόνο αν το σχολείο έχει ενεργοποιήσει Gemini στο Google Classroom, ή μέσω δικού σου εποπτευόμενου λογαριασμού Family Link.",
          howToEn: "Access only if the school has enabled Gemini in Google Classroom, or via your own supervised Family Link account.",
          cautionEl: "Χωρίς σχολική ενεργοποίηση ή Family Link, δεν υπάρχει νόμιμη πρόσβαση κάτω των 13.",
          cautionEn: "Without school enablement or Family Link, there is no legal access under 13.",
        },
        {
          toolId: "duolingo",
          useCaseEl: "Πρώτη επαφή με ξένη γλώσσα μέσα από σύντομα, παιχνιδοποιημένα μαθήματα.",
          useCaseEn: "First exposure to a foreign language through short, gamified lessons.",
          howToEl: "Δημιούργησε τον λογαριασμό με το δικό σου email — έτσι ενεργοποιούνται αυτόματα τα παιδικά όρια.",
          howToEn: "Create the account with your own email — this automatically activates child-safe limits.",
          cautionEl: "",
          cautionEn: "",
        },
      ],
    },
    student: {
      introEl:
        "Αυτά τα εργαλεία τα χρησιμοποιείς πάντα με λογαριασμό που έφτιαξε ο γονιός/δάσκαλός σου — όχι μόνος/η σου.",
      introEn:
        "You always use these tools through an account your parent or teacher set up — not on your own.",
      tools: [
        {
          toolId: "khanmigo",
          useCaseEl: "Όταν κολλάς σε μαθηματικά ή ανάγνωση, σε βοηθάει με ερωτήσεις να βρεις μόνος/η σου τη λύση.",
          useCaseEn: "When you're stuck on math or reading, it helps you find the answer yourself through questions.",
          howToEl: "Προσπάθησε πρώτα μόνος/η σου, μετά ρώτα — δεν σου δίνει την απάντηση αμέσως, και αυτό είναι καλό!",
          howToEn: "Try it yourself first, then ask — it won't just give you the answer right away, and that's a good thing!",
          cautionEl: "",
          cautionEn: "",
        },
        {
          toolId: "photomath",
          useCaseEl: "Για να δεις αν η άσκηση που έλυσες είναι σωστή.",
          useCaseEn: "To see if the exercise you solved is correct.",
          howToEl: "Λύσε πρώτα μόνος/η σου με το χέρι, μετά φωτογράφισε για να ελέγξεις.",
          howToEn: "Solve it yourself by hand first, then photograph it to check.",
          cautionEl: "Αν το χρησιμοποιείς πριν προσπαθήσεις, δεν μαθαίνεις — απλά αντιγράφεις τη λύση.",
          cautionEn: "If you use it before trying, you're not learning — just copying the answer.",
        },
        {
          toolId: "duolingo",
          useCaseEl: "Για να μάθεις μια νέα γλώσσα με μικρά, διασκεδαστικά μαθήματα κάθε μέρα.",
          useCaseEn: "To learn a new language through short, fun daily lessons.",
          howToEl: "Κάνε λίγα λεπτά κάθε μέρα αντί για πολλή ώρα σπάνια — έτσι θυμάσαι καλύτερα.",
          howToEn: "Do a few minutes every day instead of a lot rarely — that's how you remember better.",
          cautionEl: "",
          cautionEn: "",
        },
      ],
    },
  },

  // ============================================================
  // 🎒 ΓΥΜΝΑΣΙΟ (12–15)
  // Στα 13, ανοίγει η πλειονότητα των mainstream chatbots (με γονική συγκατάθεση).
  // ============================================================
  middle: {
    guardian: {
      introEl:
        "Στα 13, ανοίγει η πρόσβαση στα περισσότερα mainstream AI chatbots — αλλά σχεδόν όλα απαιτούν τη δική σου συγκατάθεση μέχρι τα 17. Εδώ θα βρεις ποιο εργαλείο ταιριάζει σε ποια σχολική δουλειά, ώστε να καθοδηγήσεις τη χρήση αντί απλώς να την επιτρέψεις ή να την απαγορεύσεις.",
      introEn:
        "At 13, access opens up to most mainstream AI chatbots — but nearly all require your consent until age 17. Here's which tool fits which schoolwork, so you can guide the use rather than just allow or ban it.",
      tools: [
        {
          toolId: "chatgpt",
          useCaseEl: "Εξήγηση δύσκολων εννοιών με διαφορετικούς τρόπους, brainstorming για εργασίες.",
          useCaseEn: "Explaining tough concepts multiple ways, brainstorming for assignments.",
          howToEl: "Δώσε τη γονική συγκατάθεση μέσω των ρυθμίσεων λογαριασμού και ενεργοποίησε τους γονικούς ελέγχους σύνδεσης λογαριασμών (parental controls).",
          howToEn: "Give parental consent through account settings and enable the parent-teen account linking controls.",
          cautionEl: "Μπορεί να δώσει λανθασμένες πληροφορίες με σιγουριά ('χαλλουσινώσεις') — χρειάζεται έλεγχος πηγών σε εργασίες.",
          cautionEn: "Can confidently give wrong information ('hallucinations') — needs source-checking for assignments.",
        },
        {
          toolId: "gemini",
          useCaseEl: "Βοήθεια σε έρευνα μαθήματος με εικόνες και κώδικα, μέσα σε ασφαλές πλαίσιο (φίλτρα περιεχομένου).",
          useCaseEn: "Help with subject research involving images and code, within a safety-filtered environment.",
          howToEl: "Προτίμησε το αν το παιδί έχει ήδη λογαριασμό Google του σχολείου — ενσωματώνεται φυσικά στο Classroom.",
          howToEn: "Prefer this if the child already has a school Google account — it integrates naturally with Classroom.",
          cautionEl: "",
          cautionEn: "",
        },
        {
          toolId: "grammarly",
          useCaseEl: "Έλεγχος γραμματικής/ορθογραφίας σε αγγλικές εργασίες, μάθημα Αγγλικών.",
          useCaseEn: "Grammar/spelling checking for English assignments and English class.",
          howToEl: "Καλή επιλογή για μάθημα ξένης γλώσσας — δείχνει το ΓΙΑΤΙ ενός λάθους, όχι μόνο τη διόρθωση.",
          howToEn: "A good fit for foreign-language class — it explains WHY something is wrong, not just the fix.",
          cautionEl: "",
          cautionEn: "",
        },
        {
          toolId: "quizlet",
          useCaseEl: "Διάβασμα για διαγωνίσματα με φλασκάρτες, ιστορία/γεωγραφία/βιολογία.",
          useCaseEn: "Studying for tests with flashcards — history, geography, biology.",
          howToEl: "Ενθάρρυνε το παιδί να φτιάχνει τις δικές του φλασκάρτες πρώτα, μετά να χρησιμοποιεί τις AI-generated προτάσεις.",
          howToEn: "Encourage the child to make their own flashcards first, then use AI-generated suggestions.",
          cautionEl: "",
          cautionEn: "",
        },
        {
          toolId: "wolfram-alpha",
          useCaseEl: "Επίλυση εξισώσεων και προβλημάτων φυσικής/χημείας βήμα-βήμα.",
          useCaseEn: "Solving equations and physics/chemistry problems step by step.",
          howToEl: "Καλή εναλλακτική στο Photomath για πιο σύνθετα προβλήματα Γυμνασίου.",
          howToEn: "A good alternative to Photomath for more complex middle-school-level problems.",
          cautionEl: "",
          cautionEn: "",
        },
      ],
    },
    student: {
      introEl:
        "Ξεκινάς να χρησιμοποιείς AI πιο μόνος/η σου, αλλά ο γονιός σου πρέπει να δώσει άδεια για τα περισσότερα chatbots. Δες ποιο εργαλείο ταιριάζει σε ποια δουλειά.",
      introEn:
        "You're starting to use AI more on your own, but your parent needs to give permission for most chatbots. See which tool fits which task.",
      tools: [
        {
          toolId: "chatgpt",
          useCaseEl: "Για να σου εξηγήσει κάτι με άλλον τρόπο όταν δεν καταλαβαίνεις τον καθηγητή.",
          useCaseEn: "To explain something a different way when you don't understand your teacher.",
          howToEl: "Ζήτα εξήγηση, όχι έτοιμη απάντηση — γράψε 'εξήγησέ μου γιατί', όχι 'δώσε μου τη λύση'.",
          howToEn: "Ask for an explanation, not a ready answer — write 'explain why', not 'give me the solution'.",
          cautionEl: "Μπορεί να κάνει λάθη χωρίς να το καταλάβεις — έλεγξε πάντα με το βιβλίο σου.",
          cautionEn: "It can make mistakes without you noticing — always double-check with your textbook.",
        },
        {
          toolId: "grammarly",
          useCaseEl: "Για να ελέγξεις τα Αγγλικά σου πριν παραδώσεις μια εργασία.",
          useCaseEn: "To check your English before turning in an assignment.",
          howToEl: "Διάβασε ΓΙΑΤΙ προτείνει κάθε διόρθωση — έτσι μαθαίνεις, δεν διορθώνεις μόνο.",
          howToEn: "Read WHY it suggests each correction — that way you learn, not just correct.",
          cautionEl: "",
          cautionEn: "",
        },
        {
          toolId: "quizlet",
          useCaseEl: "Για να διαβάσεις για διαγώνισμα με φλασκάρτες που φτιάχνεις μόνος/η σου.",
          useCaseEn: "To study for a test with flashcards you make yourself.",
          howToEl: "Φτιάξε πρώτα τις δικές σου κάρτες — το να τις γράφεις σε βοηθάει να θυμάσαι.",
          howToEn: "Make your own cards first — writing them helps you remember.",
          cautionEl: "",
          cautionEn: "",
        },
        {
          toolId: "wolfram-alpha",
          useCaseEl: "Για να ελέγξεις μια άσκηση Άλγεβρας ή Φυσικής βήμα-βήμα.",
          useCaseEn: "To check an Algebra or Physics problem step by step.",
          howToEl: "Προσπάθησε πρώτα μόνος/η σου με το χέρι, μετά έλεγξε.",
          howToEn: "Try it yourself by hand first, then check.",
          cautionEl: "",
          cautionEn: "",
        },
      ],
    },
  },

  // ============================================================
  // 🎓 ΛΥΚΕΙΟ (15–18)
  // Σχεδόν πλήρες φάσμα. Σημείωση: Claude/NotebookLM/Perplexity είναι 18+ —
  // εμφανίζονται εδώ ΜΟΝΟ στο "guardian" path ως ενημέρωση, με ρητή σημείωση ορίου.
  // ============================================================
  high: {
    guardian: {
      introEl:
        "Στο Λύκειο το φάσμα εργαλείων είναι σχεδόν πλήρες, αλλά μερικά σοβαρά εργαλεία (π.χ. Claude, Perplexity, NotebookLM) παραμένουν επίσημα 18+ χωρίς διαδρομή γονικής συγκατάθεσης. Η έμφαση μετατοπίζεται από τον περιορισμό στη σωστή, παραγωγική χρήση — προετοιμασία για πανελλήνιες, έρευνα, εργασίες.",
      introEn:
        "In high school the range of tools is nearly full, but a few serious tools (e.g. Claude, Perplexity, NotebookLM) remain officially 18+ with no parental-consent path. The focus shifts from restriction to proper, productive use — exam prep, research, projects.",
      tools: [
        {
          toolId: "chatgpt",
          useCaseEl: "Οργάνωση διαβάσματος, εξηγήσεις σε πολλά μαθήματα, πρώτο draft εργασιών.",
          useCaseEn: "Study organization, explanations across subjects, first drafts of assignments.",
          howToEl: "Στα 15-17 εξακολουθεί να χρειάζεται η γονική σου συγκατάθεση· στα 18 όχι πια.",
          howToEn: "At 15–17 it still needs your parental consent; at 18 it no longer does.",
          cautionEl: "",
          cautionEn: "",
        },
        {
          toolId: "github-copilot",
          useCaseEl: "Μάθημα Πληροφορικής, προετοιμασία για σπουδές σε προγραμματισμό.",
          useCaseEn: "Computer science class, preparing for programming-related studies.",
          howToEl: "Δωρεάν για επαληθευμένους μαθητές μέσω GitHub Education — άξιζε τον έλεγχο αν το σχολείο συμμετέχει.",
          howToEn: "Free for verified students via GitHub Education — worth checking if the school participates.",
          cautionEl: "",
          cautionEn: "",
        },
        {
          toolId: "claude",
          useCaseEl: "Ενημερωτικά: σοβαρό εργαλείο γραφής/ανάλυσης, αλλά επίσημα 18+ χωρίς εξαίρεση.",
          useCaseEn: "For your information: a serious writing/analysis tool, but officially 18+ with no exception.",
          howToEl: "Δεν υπάρχει νόμιμος τρόπος πρόσβασης πριν τα 18, ούτε με γονική άδεια — μην το ρυθμίσεις για το παιδί σου πριν την ενηλικίωση.",
          howToEn: "There is no legal access path before 18, not even with parental permission — don't set this up for your child before they turn 18.",
          cautionEl: "",
          cautionEn: "",
        },
        {
          toolId: "canva-magic",
          useCaseEl: "Παρουσιάσεις για σχολικές εργασίες/project, σχεδιασμός για μαθητικές δραστηριότητες.",
          useCaseEn: "Presentations for school projects, design for student activities.",
          howToEl: "Canva for Education δίνει δωρεάν πρόσβαση σε πολλά premium χαρακτηριστικά μέσω σχολικού λογαριασμού.",
          howToEn: "Canva for Education gives free access to many premium features via a school account.",
          cautionEl: "",
          cautionEn: "",
        },
      ],
    },
    student: {
      introEl:
        "Έχεις πρόσβαση σχεδόν στο πλήρες φάσμα εργαλείων. Το θέμα δεν είναι αν επιτρέπεται — είναι ποιο εργαλείο ταιριάζει σε ποια δουλειά και πώς να το χρησιμοποιήσεις σωστά, ειδικά τώρα που ετοιμάζεσαι για πανελλήνιες ή για σπουδές.",
      introEn:
        "You have access to nearly the full range of tools. The question isn't whether it's allowed — it's which tool fits which task and how to use it properly, especially now that you're preparing for exams or further studies.",
      tools: [
        {
          toolId: "chatgpt",
          useCaseEl: "Οργάνωση προγράμματος διαβάσματος, εξηγήσεις εννοιών από διαφορετική οπτική γωνία.",
          useCaseEn: "Organizing a study schedule, explaining concepts from a different angle.",
          howToEl: "Χρησιμοποίησέ το για να καταλάβεις, όχι για να αντιγράψεις — στις πανελλήνιες η ικανότητα να λύνεις μόνος/η σου είναι αυτό που μετράει.",
          howToEn: "Use it to understand, not to copy — for exams, your own problem-solving ability is what counts.",
          cautionEl: "",
          cautionEn: "",
        },
        {
          toolId: "wolfram-alpha",
          useCaseEl: "Έλεγχος σύνθετων προβλημάτων Μαθηματικών/Φυσικής Κατεύθυνσης.",
          useCaseEn: "Checking complex Math/Physics track problems.",
          howToEl: "Ιδανικό για επαλήθευση μετά την προσπάθειά σου, πριν το διαγώνισμα.",
          howToEn: "Ideal for verification after your own attempt, before the test.",
          cautionEl: "",
          cautionEn: "",
        },
        {
          toolId: "github-copilot",
          useCaseEl: "Αν κάνεις μάθημα ή project Πληροφορικής/προγραμματισμού.",
          useCaseEn: "If you're taking a Computer Science class or coding project.",
          howToEl: "Δωρεάν έκδοση για μαθητές μέσω GitHub Student — χρησιμοποίησέ το για να μάθεις patterns, όχι μόνο να αντιγράφεις προτάσεις.",
          howToEn: "Free for students via GitHub Student — use it to learn patterns, not just copy suggestions.",
          cautionEl: "",
          cautionEn: "",
        },
        {
          toolId: "canva-magic",
          useCaseEl: "Δημιουργία παρουσίασης για ομαδική εργασία ή portfolio.",
          useCaseEn: "Creating a presentation for group work or a portfolio.",
          howToEl: "Χρησιμοποίησε τον σχολικό σου λογαριασμό (Canva for Education) αν το σχολείο το προσφέρει — δωρεάν premium χαρακτηριστικά.",
          howToEn: "Use your school account (Canva for Education) if the school offers it — free premium features.",
          cautionEl: "",
          cautionEn: "",
        },
      ],
    },
  },
};

// Export για χρήση από το app.js (browser globals — no bundler/module system)
// ZONES, ROLES, CATEGORIES, TOOLS, PATHS είναι διαθέσιμα ως global consts.
