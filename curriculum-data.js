/**
 * curriculum-data.js
 * ------------------------------------------------------------
 * Αντιστοίχιση σχολικών μαθημάτων -> κατάλληλα εργαλεία AI, ανά ζώνη ηλικίας.
 * Χρησιμοποιείται ως φίλτρο μέσα στο tab "Εργαλεία".
 *
 * Κάθε toolId εδώ ΠΡΕΠΕΙ να υπάρχει ήδη στο PATHS[zone][*] .tools[]
 * ώστε το φίλτρο να λειτουργεί πάνω σε εργαλεία που όντως εμφανίζονται
 * στη ζώνη. Αν προστεθεί νέο εργαλείο σε PATHS, μπορεί να προστεθεί και εδώ.
 * ------------------------------------------------------------
 */

const SUBJECTS = [
  { id: "language", icon: "📝", labelEl: "Γλώσσα", labelEn: "Language" },
  { id: "math", icon: "🔢", labelEl: "Μαθηματικά", labelEn: "Math" },
  { id: "science", icon: "🔬", labelEl: "Φυσικές Επιστήμες", labelEn: "Science" },
  { id: "history", icon: "🏛️", labelEl: "Ιστορία", labelEn: "History" },
  { id: "foreign-language", icon: "🌍", labelEl: "Ξένη Γλώσσα", labelEn: "Foreign Language" },
];


const LEARNING_NEEDS = [
  { id: "understand", icon: "💡", labelEl: "Να καταλάβω", labelEn: "Understand" },
  { id: "practice", icon: "✍️", labelEl: "Να εξασκηθώ", labelEn: "Practice" },
  { id: "hint", icon: "🧩", labelEl: "Θέλω υπόδειξη", labelEn: "Get a hint" },
  { id: "check", icon: "✅", labelEl: "Να ελέγξω λύση", labelEn: "Check my work" },
  { id: "revise", icon: "🧠", labelEl: "Να κάνω επανάληψη", labelEn: "Revise" },
  { id: "research", icon: "🔎", labelEl: "Να κάνω έρευνα", labelEn: "Research" },
];

const NEED_TOOL_MAP = {
  language: {
    understand: ["reading-coach", "ai-help", "chatgpt", "gemini-education", "gemini", "claude", "notebooklm"],
    practice: ["reading-coach", "quizlet", "ai-help", "chatgpt", "anki", "digital-tutoring"],
    hint: ["ai-help", "chatgpt"],
    check: ["ai-help", "gemini-education", "chatgpt", "grammarly", "notebooklm"],
    revise: ["quizlet", "ai-help", "notebooklm", "gemini-education", "anki", "notion", "digital-tutoring", "chatgpt"],
    research: ["gemini-education", "perplexity", "notebooklm", "chatgpt", "zotero"],
  },
  math: {
    understand: ["ai-help", "chatgpt", "gemini-education", "desmos", "geogebra", "wolfram-alpha"],
    practice: ["ai-help", "symbolab", "photomath", "wolfram-alpha", "desmos", "geogebra", "digital-tutoring"],
    hint: ["ai-help", "chatgpt"],
    check: ["photomath", "symbolab", "wolfram-alpha", "geogebra", "digital-tutoring", "ai-help", "gemini-education"],
    revise: ["ai-help", "gemini-education", "quizlet", "anki", "digital-tutoring", "chatgpt"],
    research: ["gemini-education", "wolfram-alpha", "perplexity"],
  },
  science: {
    understand: ["phet", "ai-help", "chatgpt", "gemini-education", "notebooklm"],
    practice: ["phet", "quizlet", "ai-help", "wolfram-alpha", "digital-tutoring"],
    hint: ["ai-help", "chatgpt"],
    check: ["ai-help", "gemini-education", "phet", "wolfram-alpha", "chatgpt", "notebooklm", "digital-tutoring"],
    revise: ["quizlet", "ai-help", "notebooklm", "phet", "gemini-education", "anki", "digital-tutoring", "chatgpt"],
    research: ["gemini-education", "google-arts-culture", "perplexity", "notebooklm", "google-lens", "scite"],
  },
  history: {
    understand: ["google-arts-culture", "ai-help", "chatgpt", "gemini-education", "notebooklm"],
    practice: ["quizlet", "ai-help", "chatgpt", "anki", "digital-tutoring"],
    hint: ["ai-help", "chatgpt"],
    check: ["ai-help", "gemini-education", "google-arts-culture", "perplexity", "chatgpt", "notebooklm"],
    revise: ["quizlet", "ai-help", "notebooklm", "google-arts-culture", "gemini-education", "anki", "notion", "digital-tutoring", "chatgpt"],
    research: ["perplexity", "notebooklm", "google-arts-culture", "google-lens", "zotero"],
  },
  "foreign-language": {
    understand: ["ai-help", "gemini-education", "chatgpt", "deepl"],
    practice: ["duolingo", "quizlet", "reading-coach", "ai-help", "anki", "deepl"],
    hint: ["ai-help", "chatgpt", "deepl"],
    check: ["ai-help", "gemini-education", "grammarly", "chatgpt", "deepl"],
    revise: ["quizlet", "duolingo", "ai-help", "gemini-education", "anki", "notebooklm", "deepl"],
    research: ["gemini-education", "perplexity", "chatgpt", "deepl"],
  },
};

const CURRICULUM = {
  primary: {
    language: {toolIds: ["reading-coach", "ai-help", "perplexity", "autodraw", "chatgpt", "claude", "gemini", "notebooklm", "gemini-education"],noteEl: "Κατανόηση κειμένου με καθοδηγητικές ερωτήσεις, οπτικοποίηση ιστοριών με ζωγραφική.",noteEn: "Reading comprehension through guided questions, visualizing stories through drawing."},
    math: {toolIds: ["ai-help", "perplexity", "photomath", "chatgpt", "claude", "gemini", "wolfram-alpha", "notebooklm", "gemini-education"],noteEl: "Εξάσκηση με καθοδήγηση και έλεγχος λύσης μετά την προσπάθεια.",noteEn: "Guided practice and solution checking after the child's attempt."},
    science: {toolIds: ["phet", "ai-help", "chatgpt", "claude", "perplexity", "gemini", "notebooklm", "google-arts-culture", "gemini-education"],noteEl: "Απλή εξήγηση εννοιών Φυσικών Επιστημών με ερωτήσεις, όχι έτοιμες απαντήσεις.",noteEn: "Simple science concept explanations through questions, not ready answers."},
    history: {toolIds: ["google-arts-culture", "ai-help", "chatgpt", "claude", "perplexity", "gemini", "notebooklm", "gemini-education"],noteEl: "Απλή εξήγηση ιστορικών γεγονότων με καθοδηγητικές ερωτήσεις.",noteEn: "Simple explanation of historical events through guided questions."},
    "foreign-language": {toolIds: ["ai-help", "duolingo", "reading-coach", "gemini-education", "deepl"],noteEl: "Πρώτη επαφή με ξένη γλώσσα μέσα από σύντομα, παιχνιδοποιημένα μαθήματα.",noteEn: "First exposure to a foreign language through short, gamified lessons."},
  },
  middle: {
    language: {toolIds: ["ai-help", "gemini-education", "copilot", "chatgpt", "notebooklm", "quizlet", "perplexity", "anki"],noteEl: "Ανάπτυξη επιχειρημάτων για έκθεση και επανάληψη όρων/εννοιών με ενεργητική ανάκληση.",noteEn: "Developing essay arguments and revising terms/concepts through active recall."},
    math: {toolIds: ["ai-help", "wolfram-alpha", "gemini-education", "copilot", "chatgpt", "photomath", "symbolab", "desmos", "geogebra", "quizlet"],noteEl: "Βήμα-βήμα επίλυση και επαλήθευση ασκήσεων Μαθηματικών.",noteEn: "Step-by-step solving and verification of math exercises."},
    science: {toolIds: ["phet", "ai-help", "wolfram-alpha", "gemini-education", "copilot", "chatgpt", "notebooklm", "quizlet", "perplexity", "google-lens"],noteEl: "Εξήγηση εννοιών Φυσικής/Χημείας, υπολογισμοί και επανάληψη ορισμών/εννοιών με flashcards.",noteEn: "Physics/Chemistry explanations, calculations, and revision of definitions/concepts with flashcards."},
    history: {toolIds: ["google-arts-culture", "ai-help", "perplexity", "gemini-education", "copilot", "chatgpt", "notebooklm", "quizlet"],noteEl: "Οργάνωση σημείων για παρουσίαση, έλεγχος γεγονότων με πηγές και επανάληψη ημερομηνιών/όρων με flashcards.",noteEn: "Organizing points for a presentation, checking facts against sources, and revising dates/terms with flashcards."},
    "foreign-language": {toolIds: ["ai-help", "duolingo", "reading-coach", "quizlet", "anki", "gemini", "gemini-education", "copilot", "chatgpt", "deepl", "notebooklm", "perplexity"],noteEl: "Βοήθεια σε ξένη γλώσσα με καθοδηγούμενη εξάσκηση, σύγκριση διατυπώσεων με DeepL και σχολικό/γενικό AI όπου επιτρέπεται.",noteEn: "Foreign-language help through guided practice, comparing phrasings with DeepL, and school/general AI where permitted."},
  },
  high: {
    language: {toolIds: ["ai-help", "gemini-education", "copilot", "chatgpt", "notebooklm", "quizlet", "perplexity", "anki", "notion", "digital-tutoring"],noteEl: "Ανάπτυξη και έλεγχος επιχειρημάτων για έκθεση, μαζί με στοχευμένη επανάληψη για διαγωνίσματα/Πανελλήνιες.",noteEn: "Developing and stress-testing essay arguments, plus targeted revision for tests/Panhellenic exams."},
    math: {toolIds: ["ai-help", "wolfram-alpha", "gemini-education", "copilot", "chatgpt", "photomath", "symbolab", "desmos", "geogebra", "quizlet", "digital-tutoring"],noteEl: "Επαλήθευση σύνθετων προβλημάτων Μαθηματικών Προσανατολισμού.",noteEn: "Verification of complex advanced-track math problems."},
    science: {toolIds: ["phet", "ai-help", "wolfram-alpha", "chatgpt-edu", "gemini-education", "copilot", "chatgpt", "notebooklm", "quizlet", "perplexity", "google-lens", "digital-tutoring"],noteEl: "Υπολογισμοί Φυσικής/Χημείας, σχολική υποστήριξη και ενεργητική επανάληψη βασικών εννοιών/ορισμών.",noteEn: "Physics/Chemistry calculations, school support, and active recall of key concepts/definitions."},
    history: {toolIds: ["google-arts-culture", "ai-help", "perplexity", "gemini-education", "copilot", "chatgpt", "notebooklm", "quizlet", "zotero", "gamma", "notion", "google-lens", "digital-tutoring"],noteEl: "Οργάνωση επιχειρημάτων, έλεγχος ιστορικών γεγονότων με πηγές και επανάληψη ημερομηνιών/εννοιών με ενεργητική ανάκληση.",noteEn: "Organizing arguments, checking historical facts against sources, and actively recalling dates/concepts."},
    "foreign-language": {toolIds: ["ai-help", "duolingo", "reading-coach", "quizlet", "anki", "grammarly", "gemini-education", "copilot", "chatgpt", "deepl", "notebooklm", "perplexity"],noteEl: "Υποστήριξη στη συγγραφή επιστημονικών/ακαδημαϊκών κειμένων στα αγγλικά.",noteEn: "Support for writing scientific/academic texts in English."},
  },
};

// Homepage accessibility copy stays isolated from the core app/quiz logic.
if (typeof document !== "undefined" && !document.querySelector('script[data-home-accessibility="1"]')) {
  const script = document.createElement("script");
  script.src = "/home-accessibility.js";
  script.async = false;
  script.dataset.homeAccessibility = "1";
  document.head.appendChild(script);
}
