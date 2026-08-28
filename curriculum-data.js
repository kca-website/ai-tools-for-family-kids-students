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

// ---------- ΜΑΘΗΜΑΤΑ (για τα κουμπιά φίλτρου) ----------
const SUBJECTS = [
  { id: "language", icon: "📝", labelEl: "Γλώσσα", labelEn: "Language" },
  { id: "math", icon: "🔢", labelEl: "Μαθηματικά", labelEn: "Math" },
  { id: "science", icon: "🔬", labelEl: "Φυσικές Επιστήμες", labelEn: "Science" },
  { id: "history", icon: "🏛️", labelEl: "Ιστορία", labelEn: "History" },
  { id: "foreign-language", icon: "🌍", labelEl: "Ξένη Γλώσσα", labelEn: "Foreign Language" },
];

/**
 * ---------- CURRICULUM MAP ----------
 * CURRICULUM[zoneId][subjectId] = { toolIds: [...], noteEl, noteEn }
 * toolIds: ποια εργαλεία (από τα ήδη υπάρχοντα στη ζώνη) ταιριάζουν στο μάθημα.
 */
const CURRICULUM = {
  primary: {
    language: {
      toolIds: ["khanmigo", "autodraw", "chatgpt", "claude", "gemini", "notebooklm"],
      noteEl: "Κατανόηση κειμένου με καθοδηγητικές ερωτήσεις, οπτικοποίηση ιστοριών με ζωγραφική.",
      noteEn: "Reading comprehension through guided questions, visualizing stories through drawing.",
    },
    math: {
      toolIds: ["khanmigo", "photomath", "chatgpt", "claude", "gemini", "wolfram-alpha", "notebooklm"],
      noteEl: "Εξάσκηση με καθοδήγηση και έλεγχος λύσης μετά την προσπάθεια.",
      noteEn: "Guided practice and solution checking after the child's attempt.",
    },
    science: {
      toolIds: ["khanmigo", "chatgpt", "claude", "perplexity", "gemini", "notebooklm"],
      noteEl: "Απλή εξήγηση εννοιών Φυσικών Επιστημών με ερωτήσεις, όχι έτοιμες απαντήσεις.",
      noteEn: "Simple science concept explanations through questions, not ready answers.",
    },
    history: {
      toolIds: ["khanmigo", "chatgpt", "claude", "perplexity", "gemini", "notebooklm"],
      noteEl: "Απλή εξήγηση ιστορικών γεγονότων με καθοδηγητικές ερωτήσεις.",
      noteEn: "Simple explanation of historical events through guided questions.",
    },
    "foreign-language": {
      toolIds: ["duolingo"],
      noteEl: "Πρώτη επαφή με ξένη γλώσσα μέσα από σύντομα, παιχνιδοποιημένα μαθήματα.",
      noteEn: "First exposure to a foreign language through short, gamified lessons.",
    },
  },

  middle: {
    language: {
      toolIds: ["chatgpt"],
      noteEl: "Ανάπτυξη επιχειρημάτων για έκθεση, εξάσκηση στην ελληνική γλώσσα.",
      noteEn: "Developing essay arguments, Greek language practice.",
    },
    math: {
      toolIds: ["wolfram-alpha"],
      noteEl: "Βήμα-βήμα επίλυση και επαλήθευση ασκήσεων Μαθηματικών.",
      noteEn: "Step-by-step solving and verification of math exercises.",
    },
    science: {
      toolIds: ["chatgpt", "wolfram-alpha"],
      noteEl: "Εξήγηση εννοιών Φυσικής/Χημείας και υπολογισμοί.",
      noteEn: "Physics/Chemistry concept explanations and calculations.",
    },
    history: {
      toolIds: ["chatgpt"],
      noteEl: "Οργάνωση σημείων για παρουσίαση, όχι έτοιμο κείμενο.",
      noteEn: "Organizing points for a presentation, not ready-made text.",
    },
    "foreign-language": {
      toolIds: ["gemini", "chatgpt", "erla"],
      noteEl: "Βοήθεια σε ξένη γλώσσα μέσα από σχολικό λογαριασμό, γενικό chatbot AI, ή εξάσκηση ακρόασης/ομιλίας με το Erla.",
      noteEn: "Foreign language help through a school account, a general AI chatbot, or listening/speaking practice with Erla.",
    },
  },

  high: {
    language: {
      toolIds: ["chatgpt"],
      noteEl: "Ανάπτυξη και έλεγχος επιχειρημάτων για έκθεση, προετοιμασία Πανελληνίων.",
      noteEn: "Developing and stress-testing essay arguments, Panhellenic exam prep.",
    },
    math: {
      toolIds: ["wolfram-alpha", "chatgpt"],
      noteEl: "Επαλήθευση σύνθετων προβλημάτων Μαθηματικών Προσανατολισμού.",
      noteEn: "Verification of complex advanced-track math problems.",
    },
    science: {
      toolIds: ["wolfram-alpha", "chatgpt-edu"],
      noteEl: "Υπολογισμοί Φυσικής/Χημείας και υποστήριξη μέσω σχολικού προγράμματος.",
      noteEn: "Physics/Chemistry calculations and support via the school pilot program.",
    },
    history: {
      toolIds: ["chatgpt", "perplexity"],
      noteEl: "Οργάνωση επιχειρημάτων και έλεγχος ιστορικών γεγονότων με πηγές πριν τα εμπιστευτείς.",
      noteEn: "Organizing arguments and checking historical facts against sources before trusting them.",
    },
    "foreign-language": {
      toolIds: ["grammarly"],
      noteEl: "Υποστήριξη στη συγγραφή επιστημονικών/ακαδημαϊκών κειμένων στα αγγλικά.",
      noteEn: "Support for writing scientific/academic texts in English.",
    },
  },
};
