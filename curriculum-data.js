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
    understand: ["ai-help", "chatgpt", "gemini-education", "gemini", "claude"],
    practice: ["ai-help", "chatgpt", "quizlet"],
    hint: ["ai-help", "chatgpt"],
    check: ["chatgpt", "grammarly"],
    revise: ["notebooklm", "quizlet", "chatgpt", "gemini-education"],
    research: ["perplexity", "notebooklm", "chatgpt"],
  },
  math: {
    understand: ["ai-help", "chatgpt", "gemini-education", "desmos", "geogebra"],
    practice: ["ai-help", "symbolab", "photomath", "wolfram-alpha"],
    hint: ["ai-help", "chatgpt"],
    check: ["photomath", "symbolab", "wolfram-alpha"],
    revise: ["quizlet", "chatgpt"],
    research: ["wolfram-alpha", "perplexity"],
  },
  science: {
    understand: ["phet", "ai-help", "chatgpt", "gemini-education", "notebooklm"],
    practice: ["phet", "ai-help", "wolfram-alpha"],
    hint: ["ai-help", "chatgpt"],
    check: ["wolfram-alpha", "chatgpt"],
    revise: ["notebooklm", "quizlet", "chatgpt"],
    research: ["perplexity", "notebooklm", "scite"],
  },
  history: {
    understand: ["google-arts-culture", "ai-help", "chatgpt", "gemini-education"],
    practice: ["ai-help", "chatgpt", "quizlet"],
    hint: ["ai-help", "chatgpt"],
    check: ["perplexity", "chatgpt"],
    revise: ["notebooklm", "quizlet", "chatgpt"],
    research: ["perplexity", "notebooklm", "google-arts-culture"],
  },
  "foreign-language": {
    understand: ["ai-help", "gemini-education", "chatgpt"],
    practice: ["duolingo", "reading-coach", "ai-help", "quizlet"],
    hint: ["ai-help", "chatgpt"],
    check: ["grammarly", "chatgpt"],
    revise: ["quizlet", "notebooklm"],
    research: ["perplexity", "chatgpt"],
  },
};

const CURRICULUM = {
  primary: {
    language: {toolIds: ["reading-coach", "ai-help", "perplexity", "autodraw", "chatgpt", "claude", "gemini", "notebooklm", "gemini-education"],noteEl: "Κατανόηση κειμένου με καθοδηγητικές ερωτήσεις, οπτικοποίηση ιστοριών με ζωγραφική.",noteEn: "Reading comprehension through guided questions, visualizing stories through drawing."},
    math: {toolIds: ["ai-help", "perplexity", "photomath", "chatgpt", "claude", "gemini", "wolfram-alpha", "notebooklm", "gemini-education"],noteEl: "Εξάσκηση με καθοδήγηση και έλεγχος λύσης μετά την προσπάθεια.",noteEn: "Guided practice and solution checking after the child's attempt."},
    science: {toolIds: ["phet", "ai-help", "chatgpt", "claude", "perplexity", "gemini", "notebooklm", "google-arts-culture", "gemini-education"],noteEl: "Απλή εξήγηση εννοιών Φυσικών Επιστημών με ερωτήσεις, όχι έτοιμες απαντήσεις.",noteEn: "Simple science concept explanations through questions, not ready answers."},
    history: {toolIds: ["google-arts-culture", "ai-help", "chatgpt", "claude", "perplexity", "gemini", "notebooklm", "gemini-education"],noteEl: "Απλή εξήγηση ιστορικών γεγονότων με καθοδηγητικές ερωτήσεις.",noteEn: "Simple explanation of historical events through guided questions."},
    "foreign-language": {toolIds: ["ai-help", "duolingo", "gemini-education", "deepl"],noteEl: "Πρώτη επαφή με ξένη γλώσσα μέσα από σύντομα, παιχνιδοποιημένα μαθήματα.",noteEn: "First exposure to a foreign language through short, gamified lessons."},
  },
  middle: {
    language: {toolIds: ["ai-help", "gemini-education", "copilot", "chatgpt", "notebooklm", "quizlet", "perplexity", "anki"],noteEl: "Ανάπτυξη επιχειρημάτων για έκθεση, εξάσκηση στην ελληνική γλώσσα.",noteEn: "Developing essay arguments, Greek language practice."},
    math: {toolIds: ["ai-help", "wolfram-alpha", "gemini-education", "copilot", "chatgpt", "photomath", "symbolab", "desmos", "geogebra", "quizlet"],noteEl: "Βήμα-βήμα επίλυση και επαλήθευση ασκήσεων Μαθηματικών.",noteEn: "Step-by-step solving and verification of math exercises."},
    science: {toolIds: ["phet", "ai-help", "wolfram-alpha", "gemini-education", "copilot", "chatgpt", "notebooklm", "quizlet", "perplexity", "google-lens"],noteEl: "Εξήγηση εννοιών Φυσικής/Χημείας και υπολογισμοί.",noteEn: "Physics/Chemistry concept explanations and calculations."},
    history: {toolIds: ["google-arts-culture", "ai-help", "perplexity", "gemini-education", "copilot", "chatgpt", "notebooklm", "quizlet"],noteEl: "Οργάνωση σημείων για παρουσίαση, και έλεγχος γεγονότων με πηγές πριν τα εμπιστευτείς.",noteEn: "Organizing points for a presentation, and checking facts against sources before trusting them."},
    "foreign-language": {toolIds: ["ai-help", "gemini", "gemini-education", "copilot", "chatgpt", "deepl"],noteEl: "Βοήθεια σε ξένη γλώσσα μέσα από σχολικό λογαριασμό, γενικό chatbot AI, ή εξάσκηση ακρόασης/ομιλίας με το Erla.",noteEn: "Foreign language help through a school account, a general AI chatbot, or listening/speaking practice with Erla."},
  },
  high: {
    language: {toolIds: ["ai-help", "gemini-education", "copilot", "chatgpt", "notebooklm", "quizlet", "perplexity", "anki", "notion", "digital-tutoring"],noteEl: "Ανάπτυξη και έλεγχος επιχειρημάτων για έκθεση, προετοιμασία Πανελληνίων.",noteEn: "Developing and stress-testing essay arguments, Panhellenic exam prep."},
    math: {toolIds: ["ai-help", "wolfram-alpha", "gemini-education", "copilot", "chatgpt", "photomath", "symbolab", "desmos", "geogebra", "quizlet", "digital-tutoring"],noteEl: "Επαλήθευση σύνθετων προβλημάτων Μαθηματικών Προσανατολισμού.",noteEn: "Verification of complex advanced-track math problems."},
    science: {toolIds: ["phet", "ai-help", "wolfram-alpha", "chatgpt-edu", "gemini-education", "copilot", "chatgpt", "notebooklm", "quizlet", "perplexity", "google-lens", "digital-tutoring"],noteEl: "Υπολογισμοί Φυσικής/Χημείας και υποστήριξη μέσω σχολικού προγράμματος.",noteEn: "Physics/Chemistry calculations and support via the school pilot program."},
    history: {toolIds: ["google-arts-culture", "ai-help", "perplexity", "gemini-education", "copilot", "chatgpt", "notebooklm", "quizlet", "zotero", "gamma", "notion", "google-lens", "digital-tutoring"],noteEl: "Οργάνωση επιχειρημάτων και έλεγχος ιστορικών γεγονότων με πηγές πριν τα εμπιστευτείς.",noteEn: "Organizing arguments and checking historical facts against sources before trusting them."},
    "foreign-language": {toolIds: ["ai-help", "grammarly", "gemini-education", "copilot", "chatgpt", "deepl"],noteEl: "Υποστήριξη στη συγγραφή επιστημονικών/ακαδημαϊκών κειμένων στα αγγλικά.",noteEn: "Support for writing scientific/academic texts in English."},
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
