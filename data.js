/**
 * data.js
 * ------------------------------------------------------------
 * Πηγή δεδομένων για το AI Tools for Family, Kids & Students.
 *
 * ΔΟΜΗ:
 *   ZONES, ROLES, CATEGORIES, TOOLS, PATHS, PROMPTS
 * ------------------------------------------------------------
 */

// ---------- ΖΩΝΕΣ ----------
const ZONES = [
  {
    id: "primary",
    icon: "🧒",
    labelEl: "Δημοτικό",
    labelEn: "Primary",
    ageRangeEl: "6 έως 12 ετών",
    ageRangeEn: "Ages 6 to 12",
    descriptionEl: "Περιορισμένα εργαλεία, πάντα με επίβλεψη ενήλικα.",
    descriptionEn: "Limited tools, always with adult supervision.",
  },
  {
    id: "middle",
    icon: "🎒",
    labelEl: "Γυμνάσιο",
    labelEn: "Middle School",
    ageRangeEl: "12 έως 15 ετών",
    ageRangeEn: "Ages 12 to 15",
    descriptionEl: "Περισσότερα εργαλεία, αρχή αυτόνομης χρήσης.",
    descriptionEn: "More tools, the start of independent use.",
  },
  {
    id: "high",
    icon: "🎓",
    labelEl: "Λύκειο",
    labelEn: "High School",
    ageRangeEl: "15 έως 18 ετών",
    ageRangeEn: "Ages 15 to 18",
    descriptionEl: "Σχεδόν πλήρες φάσμα εργαλείων, έμφαση στη σωστή χρήση.",
    descriptionEn: "Near full range of tools, emphasis on proper use.",
  },
];

// ---------- ΡΟΛΟΙ ----------
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

// ---------- ΚΑΤΗΓΟΡΙΕΣ ----------
const CATEGORIES = [
  { id: "writing", labelEl: "Γραφή & Κείμενο", labelEn: "Writing & Text" },
  { id: "research", labelEl: "Έρευνα & Μάθηση", labelEn: "Research & Learning" },
  { id: "math", labelEl: "Μαθηματικά & Λογική", labelEn: "Math & Logic" },
  { id: "creative", labelEl: "Δημιουργικότητα (εικόνα/ήχος)", labelEn: "Creative (image/audio)" },
  { id: "coding", labelEl: "Προγραμματισμός", labelEn: "Coding" },
  { id: "organization", labelEl: "Οργάνωση & Παραγωγικότητα", labelEn: "Organization & Productivity" },
  { id: "language", labelEl: "Γλώσσες", labelEn: "Languages" },
  // Νέες κατηγορίες για εξειδικευμένα εργαλεία
  { id: "advanced-math", labelEl: "Προχωρημένα Μαθηματικά", labelEn: "Advanced Math" },
  { id: "academic-research", labelEl: "Ακαδημαϊκή Έρευνα", labelEn: "Academic Research" },
  { id: "writing-tools", labelEl: "Εργαλεία Γραφής", labelEn: "Writing Tools" },
  { id: "coding-tools", labelEl: "Εργαλεία Προγραμματισμού", labelEn: "Coding Tools" },
  { id: "organization-tools", labelEl: "Εργαλεία Οργάνωσης", labelEn: "Organization Tools" },
];

// ---------- MASTER ΛΙΣΤΑ ΕΡΓΑΛΕΙΩΝ ----------
const TOOLS = {
  // ========== ΓΝΩΣΤΑ ΕΡΓΑΛΕΙΑ (υπάρχοντα) ==========
  "chatgpt": {
    id: "chatgpt",
    name: "ChatGPT",
    url: "https://chatgpt.com",
    category: "writing",
    minAge: 13,
    minAgeNote: "13 ετών και άνω, με γονική συγκατάθεση από 13 έως 17.",
    shortDescEl: "Γενικός chatbot AI για γραφή, εξηγήσεις και βοήθεια σε πολλά μαθήματα.",
    shortDescEn: "General purpose AI chatbot for writing, explanations, and help across subjects.",
    isExpert: false,
  },
  "gemini": {
    id: "gemini",
    name: "Google Gemini",
    url: "https://gemini.google.com",
    category: "writing",
    minAge: 13,
    minAgeNote: "13 ετών και άνω. Κάτω των 13 μέσω Family Link.",
    shortDescEl: "Chatbot AI της Google, ενσωματωμένο σε Google Classroom.",
    shortDescEn: "Google's AI chatbot, integrated into Google Classroom.",
    isExpert: false,
  },
  "copilot": {
    id: "copilot",
    name: "Microsoft Copilot",
    url: "https://copilot.microsoft.com",
    category: "writing",
    minAge: 13,
    minAgeNote: "13 ετών και άνω.",
    shortDescEl: "AI βοηθός της Microsoft, ενσωματωμένος σε Office.",
    shortDescEn: "Microsoft's AI assistant, built into Office.",
    isExpert: false,
  },
  "claude": {
    id: "claude",
    name: "Claude",
    url: "https://claude.ai",
    category: "writing",
    minAge: 18,
    minAgeNote: "Μόνο 18 ετών και άνω.",
    shortDescEl: "AI chatbot της Anthropic.",
    shortDescEn: "Anthropic's AI chatbot.",
    isExpert: false,
  },
  "grammarly": {
    id: "grammarly",
    name: "Grammarly",
    url: "https://www.grammarly.com",
    category: "writing",
    minAge: 13,
    minAgeNote: "13 ετών και άνω.",
    shortDescEl: "Εργαλείο διόρθωσης γραμματικής, ορθογραφίας και ύφους.",
    shortDescEn: "Grammar, spelling, and style checking tool.",
    isExpert: false,
  },
  "khanmigo": {
    id: "khanmigo",
    name: "Khanmigo",
    url: "https://www.khanacademy.org/khan-labs",
    category: "research",
    minAge: 5,
    minAgeNote: "Σχεδιασμένο για όλες τις βαθμίδες.",
    shortDescEl: "AI εκπαιδευτικός βοηθός πάνω στο Khan Academy.",
    shortDescEn: "AI tutor built on Khan Academy.",
    isExpert: false,
  },
  "notebooklm": {
    id: "notebooklm",
    name: "NotebookLM",
    url: "https://notebooklm.google.com",
    category: "research",
    minAge: 18,
    minAgeNote: "Απαιτεί λογαριασμό Google 18+ ή σχολικό λογαριασμό.",
    shortDescEl: "Συνοψίζει και οργανώνει σημειώσεις και πηγές.",
    shortDescEn: "Summarizes and organizes notes and sources.",
    isExpert: false,
  },
  "perplexity": {
    id: "perplexity",
    name: "Perplexity",
    url: "https://www.perplexity.ai",
    category: "research",
    minAge: 18,
    minAgeNote: "18 ετών και άνω.",
    shortDescEl: "Μηχανή έρευνας με AI που παραθέτει πηγές.",
    shortDescEn: "AI research engine with cited sources.",
    isExpert: false,
  },
  "wolfram-alpha": {
    id: "wolfram-alpha",
    name: "Wolfram Alpha",
    url: "https://www.wolframalpha.com",
    category: "math",
    minAge: 13,
    minAgeNote: "13 ετών και άνω.",
    shortDescEl: "Υπολογιστική μηχανή γνώσης. Λύνει μαθηματικά βήμα βήμα.",
    shortDescEn: "Computational knowledge engine.",
    isExpert: false,
  },
  "quizlet": {
    id: "quizlet",
    name: "Quizlet",
    url: "https://quizlet.com",
    category: "organization",
    minAge: 13,
    minAgeNote: "13 ετών και άνω.",
    shortDescEl: "Φλασκάρτες και quiz με AI.",
    shortDescEn: "Flashcards and quizzes with AI.",
    isExpert: false,
  },
  "photomath": {
    id: "photomath",
    name: "Photomath",
    url: "https://photomath.com",
    category: "math",
    minAge: 4,
    minAgeNote: "Χωρίς αυστηρό όριο.",
    shortDescEl: "Φωτογραφίζεις άσκηση και βλέπεις λύση βήμα βήμα.",
    shortDescEn: "Point your camera at a math problem and get a step-by-step solution.",
    isExpert: false,
  },
  "canva-magic": {
    id: "canva-magic",
    name: "Canva Magic Studio",
    url: "https://www.canva.com",
    category: "creative",
    minAge: 13,
    minAgeNote: "13 ετών και άνω.",
    shortDescEl: "Εργαλείο σχεδίασης με AI χαρακτηριστικά.",
    shortDescEn: "Design tool with AI features.",
    isExpert: false,
  },
  "github-copilot": {
    id: "github-copilot",
    name: "GitHub Copilot",
    url: "https://github.com/features/copilot",
    category: "coding",
    minAge: 13,
    minAgeNote: "13 ετών και άνω.",
    shortDescEl: "AI βοηθός προγραμματισμού.",
    shortDescEn: "AI coding assistant.",
    isExpert: false,
  },
  "duolingo": {
    id: "duolingo",
    name: "Duolingo",
    url: "https://www.duolingo.com",
    category: "language",
    minAge: 5,
    minAgeNote: "Κάτω των 13 με email γονέα.",
    shortDescEl: "Εκμάθηση γλωσσών με παιχνιδοποιημένα μαθήματα.",
    shortDescEn: "Language learning through gamified lessons.",
    isExpert: false,
  },

  // ========== ΕΞΕΙΔΙΚΕΥΜΕΝΑ ΕΡΓΑΛΕΙΑ (νέα) ==========
  "symbolab": {
    id: "symbolab",
    name: "Symbolab",
    url: "https://www.symbolab.com",
    category: "advanced-math",
    minAge: 13,
    minAgeNote: "13 ετών και άνω.",
    shortDescEl: "Λύνει βήμα-βήμα εξισώσεις, ολοκληρώματα, παράγωγα, πίνακες.",
    shortDescEn: "Step-by-step solver for equations, integrals, derivatives, matrices.",
    isExpert: true,
  },
  "desmos": {
    id: "desmos",
    name: "Desmos",
    url: "https://www.desmos.com",
    category: "advanced-math",
    minAge: 13,
    minAgeNote: "13 ετών και άνω.",
    shortDescEl: "Διαδραστική γραφική απεικόνιση συναρτήσεων και εξισώσεων.",
    shortDescEn: "Interactive graphing calculator for functions and equations.",
    isExpert: true,
  },
  "scite": {
    id: "scite",
    name: "Scite",
    url: "https://scite.ai",
    category: "academic-research",
    minAge: 16,
    minAgeNote: "16 ετών και άνω.",
    shortDescEl: "Δείχνει αν μια επιστημονική αναφορά υποστηρίζει ή αντικρούει μια δήλωση.",
    shortDescEn: "Shows whether a scientific reference supports or contradicts a claim.",
    isExpert: true,
  },
  "elicit": {
    id: "elicit",
    name: "Elicit",
    url: "https://elicit.com",
    category: "academic-research",
    minAge: 16,
    minAgeNote: "16 ετών και άνω.",
    shortDescEl: "Βρίσκει ακαδημαϊκές εργασίες και εξάγει βασικά σημεία.",
    shortDescEn: "Finds academic papers and extracts key points.",
    isExpert: true,
  },
  "hemingway": {
    id: "hemingway",
    name: "Hemingway Editor",
    url: "https://hemingwayapp.com",
    category: "writing-tools",
    minAge: 13,
    minAgeNote: "13 ετών και άνω.",
    shortDescEl: "Διορθώνει βαριά σύνταξη, δείχνει δείκτη αναγνωσιμότητας.",
    shortDescEn: "Corrects heavy syntax, shows readability score.",
    isExpert: true,
  },
  "scribbr": {
    id: "scribbr",
    name: "Scribbr",
    url: "https://www.scribbr.com",
    category: "writing-tools",
    minAge: 13,
    minAgeNote: "13 ετών και άνω.",
    shortDescEl: "Έλεγχος λογοκλοπής και πρόταση βελτίωσης ύφους.",
    shortDescEn: "Plagiarism checker and style improvement suggestions.",
    isExpert: true,
  },
  "replit-ai": {
    id: "replit-ai",
    name: "Replit AI",
    url: "https://replit.com",
    category: "coding-tools",
    minAge: 13,
    minAgeNote: "13 ετών και άνω.",
    shortDescEl: "Επεξεργαστής κώδικα με AI που τρέχει online, χωρίς εγκατάσταση.",
    shortDescEn: "Online code editor with AI, no installation needed.",
    isExpert: true,
  },
  "miro-ai": {
    id: "miro-ai",
    name: "Miro AI",
    url: "https://miro.com",
    category: "organization-tools",
    minAge: 13,
    minAgeNote: "13 ετών και άνω.",
    shortDescEl: "Δημιουργία mind maps, διαγραμμάτων ροής με AI βοήθεια.",
    shortDescEn: "AI-assisted mind maps, flowcharts, and diagrams.",
    isExpert: true,
  },
};

// ---------- PATHS ----------
// (Οι υπάρχουσες διαδρομές παραμένουν ίδιες)
// Προσθέτουμε μια νέα διαδρομή για τα εξειδικευμένα εργαλεία
// Αλλά θα εμφανίζονται μέσω του tab "Προχωρημένα" που φιλτράρει isExpert: true
// Οπότε δεν χρειάζεται να αλλάξουμε τα PATHS.

// ---------- PROMPTS ----------
// (Παραμένουν ίδια με πριν)
const PROMPTS = {
  primary: [
    {
      id: "primary-reading-summary",
      subjectEl: "Γλώσσα, Ανάγνωση",
      subjectEn: "Language, Reading",
      taskTypeEl: "Κατανόηση κειμένου",
      taskTypeEn: "Reading comprehension",
      promptTextEl:
        "Διάβασα αυτό το κείμενο και νομίζω ότι μιλάει για [γράψε με δικά σου λόγια τι κατάλαβες, έστω και λίγες προτάσεις]. Ρώτησέ με μία ερώτηση για να δεις αν το κατάλαβα σωστά. Μην μου πεις εσύ την περίληψη.",
      promptTextEn:
        "I read this text and I think it's about [write in your own words what you understood, even a couple of sentences]. Ask me one question to check if I understood it correctly. Don't tell me the summary yourself.",
      tipEl: "Γράψε πρώτα ό,τι θυμάσαι, χωρίς να ξαναδιαβάσεις. Μετά ρώτα.",
      tipEn: "Write down what you remember first, without rereading. Then ask.",
    },
    {
      id: "primary-math-check",
      subjectEl: "Μαθηματικά",
      subjectEn: "Math",
      taskTypeEl: "Έλεγχος άσκησης",
      taskTypeEn: "Checking an exercise",
      promptTextEl:
        "Έλυσα αυτή την άσκηση και βρήκα ότι [γράψε τη λύση σου]. Πες μου μόνο αν είναι σωστό ή λάθος. Αν είναι λάθος, μη μου δώσεις τη σωστή λύση, ρώτησέ με πού νομίζεις ότι έκανα λάθος.",
      promptTextEn:
        "I solved this exercise and got [write your solution]. Just tell me if it's right or wrong. If it's wrong, don't give me the correct solution, ask me where I think I made the mistake.",
      tipEl: "Λύσε πρώτα μόνος σου με το χέρι, μετά έλεγξε.",
      tipEn: "Solve it yourself by hand first, then check.",
    },
  ],
  middle: [
    {
      id: "middle-essay-structure",
      subjectEl: "Νεοελληνική Γλώσσα",
      subjectEn: "Modern Greek Language",
      taskTypeEl: "Έκθεση",
      taskTypeEn: "Essay",
      promptTextEl:
        "Γράφω έκθεση με θέμα [γράψε το θέμα σου]. Η δική μου θέση είναι ότι [γράψε με λίγα λόγια τι πιστεύεις εσύ πάνω στο θέμα]. Κάνε μου 3 ερωτήσεις που θα με βοηθήσουν να αναπτύξω αυτή τη θέση με δικά μου επιχειρήματα. Μη γράψεις εσύ την έκθεση ή παραγράφους έτοιμες προς χρήση.",
      promptTextEn:
        "I'm writing an essay on [write your topic]. My own position is that [write in a few words what you think about it]. Ask me 3 questions that will help me develop this position with my own arguments. Don't write the essay yourself or ready to use paragraphs.",
      tipEl: "Ξεκίνα πάντα από τη δική σου θέση, ακόμα κι αν δεν είσαι σίγουρος.",
      tipEn: "Always start from your own position, even if you're not sure.",
    },
    {
      id: "middle-history-presentation",
      subjectEl: "Ιστορία",
      subjectEn: "History",
      taskTypeEl: "Παρουσίαση",
      taskTypeEn: "Presentation",
      promptTextEl:
        "Κάνω παρουσίαση για [γράψε το θέμα]. Έχω ήδη σκεφτεί αυτά τα σημεία: [γράψε 2 με 3 πράγματα που ήδη ξέρεις ή θυμάσαι]. Ρώτησέ με τι άλλο νομίζω ότι χρειάζεται η παρουσίαση, χωρίς να μου δώσεις εσύ τα υπόλοιπα σημεία.",
      promptTextEn:
        "I'm making a presentation about [write the topic]. I've already thought of these points: [write 2 to 3 things you already know or remember]. Ask me what else I think the presentation needs, without giving me the remaining points yourself.",
      tipEl: "Φτιάξε πρώτα τη δική σου λίστα σημείων, όσο μικρή κι αν είναι.",
      tipEn: "Make your own list of points first, however small.",
    },
    {
      id: "middle-science-explain",
      subjectEl: "Φυσική, Χημεία",
      subjectEn: "Physics, Chemistry",
      taskTypeEl: "Κατανόηση έννοιας",
      taskTypeEn: "Understanding a concept",
      promptTextEl:
        "Δεν καταλαβαίνω καλά την έννοια [γράψε την έννοια, π.χ. πυκνότητα, ταχύτητα]. Νομίζω ότι σημαίνει [γράψε τη δική σου εξήγηση, έστω κι αν δεν είσαι σίγουρος]. Πες μου τι απ' αυτά είναι σωστό και τι όχι, και εξήγησέ μου με ένα παράδειγμα από την καθημερινή ζωή.",
      promptTextEn:
        "I don't fully understand the concept of [write the concept, e.g. density, speed]. I think it means [write your own explanation, even if you're not sure]. Tell me what's right and what's not, and explain it with an everyday example.",
      tipEl: "Δοκίμασε πρώτα να το εξηγήσεις με δικά σου λόγια, ακόμα κι αν κάνεις λάθος.",
      tipEn: "Try to explain it in your own words first, even if you get it wrong.",
    },
  ],
  high: [
    {
      id: "high-essay-argument",
      subjectEl: "Νεοελληνική Γλώσσα, Έκθεση",
      subjectEn: "Modern Greek Language, Essay",
      taskTypeEl: "Ανάπτυξη επιχειρήματος",
      taskTypeEn: "Developing an argument",
      promptTextEl:
        "Γράφω έκθεση με θέμα [γράψε το θέμα]. Το επιχείρημά μου είναι [γράψε το επιχείρημά σου με 2 με 3 προτάσεις]. Βρες αδυναμίες ή κενά στη σκέψη μου και κάνε μου ερωτήσεις που θα με βάλουν να το σκεφτώ καλύτερα. Μη γράψεις εσύ βελτιωμένη εκδοχή του επιχειρήματος.",
      promptTextEn:
        "I'm writing an essay on [write the topic]. My argument is [write your argument in 2 to 3 sentences]. Find weaknesses or gaps in my reasoning and ask me questions that will make me think it through better. Don't write an improved version of the argument yourself.",
      tipEl: "Όσο πιο ατελές είναι το πρώτο σου επιχείρημα, τόσο πιο χρήσιμη γίνεται η συζήτηση.",
      tipEn: "The more imperfect your first argument is, the more useful the discussion becomes.",
    },
    {
      id: "high-math-proof",
      subjectEl: "Μαθηματικά",
      subjectEn: "Math",
      taskTypeEl: "Μαθηματική απόδειξη",
      taskTypeEn: "Mathematical proof",
      promptTextEl:
        "Προσπαθώ να αποδείξω ότι [γράψε τι θέλεις να αποδείξεις]. Μέχρι τώρα έχω σκεφτεί αυτά τα βήματα: [γράψε ό,τι έχεις μέχρι στιγμής, ακόμα κι αν είναι ημιτελές]. Πες μου αν το βήμα που κόλλησα είναι σωστή κατεύθυνση, χωρίς να μου δώσεις το επόμενο βήμα της απόδειξης.",
      promptTextEn:
        "I'm trying to prove that [write what you want to prove]. So far I've thought of these steps: [write what you have so far, even if incomplete]. Tell me if the step where I'm stuck is the right direction, without giving me the next step of the proof.",
      tipEl: "Γράψε ακριβώς πού κόλλησες, όχι μόνο το τελικό αποτέλεσμα που θέλεις.",
      tipEn: "Write exactly where you got stuck, not just the final result you want.",
    },
    {
      id: "high-research-topic",
      subjectEl: "Ερευνητική Εργασία",
      subjectEn: "Research Project",
      taskTypeEl: "Διαμόρφωση ερευνητικού ερωτήματος",
      taskTypeEn: "Forming a research question",
      promptTextEl:
        "Θέλω να κάνω ερευνητική εργασία πάνω σε [γράψε το γενικό θέμα]. Το ερώτημα που με ενδιαφέρει είναι [γράψε το δικό σου ερώτημα, όσο ασαφές κι αν είναι ακόμα]. Βοήθησέ με να το κάνω πιο συγκεκριμένο με ερωτήσεις, χωρίς να μου προτείνεις εσύ το τελικό ερευνητικό ερώτημα.",
      promptTextEn:
        "I want to do a research project on [write the general topic]. The question I'm interested in is [write your own question, however unclear it still is]. Help me make it more specific through questions, without suggesting the final research question yourself.",
      tipEl: "Ένα ασαφές ερώτημα δικό σου είναι καλύτερη αφετηρία από ένα έτοιμο ερώτημα του AI.",
      tipEn: "A vague question of your own is a better starting point than a ready made question from AI.",
    },
  ],
};
