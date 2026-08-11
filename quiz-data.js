/**
 * quiz-data.js
 * ------------------------------------------------------------
 * Δεδομένα για το "Ο Διαγνωστικός Χάρτης Μάθησης" (Learning Compass).
 *
 * Φιλοσοφία: ΔΕΝ είναι τεστ βαθμολόγησης. Κάθε ερώτηση στοχεύει ΜΙΑ
 * συγκεκριμένη, τεκμηριωμένη παρανόηση (misconception). Κάθε λάθος
 * απάντηση αντιστοιχεί σε ένα gapTag, και κάθε gapTag οδηγεί σε
 * 1-2 συγκεκριμένα εργαλεία από το TOOLS (data.js) κατάλληλα για
 * ΑΥΤΟ το συγκεκριμένο κενό.
 *
 * v1 (MVP): απλό quiz, χωρίς confidence-check tier (έρχεται σε v2).
 *
 * ΔΟΜΗ:
 *   QUIZZES[zoneId][subjectId] = {
 *     titleEl/En, introEl/En,
 *     questions: [
 *       {
 *         id,
 *         textEl/En,
 *         options: [
 *           { textEl/En, isCorrect, gapTag (μόνο αν !isCorrect) }
 *         ]
 *       }
 *     ]
 *   }
 *
 *   GAP_TAGS[tagId] = {
 *     labelEl/En:      σύντομη περιγραφή του κενού για τον γονιό,
 *     explainEl/En:    1-2 προτάσεις τι σημαίνει αυτό στην πράξη,
 *     recommendedToolIds: [toolId, ...]  -> αναφορά σε TOOLS (data.js)
 *   }
 * ------------------------------------------------------------
 */

// ---------- GAP TAGS ----------
const GAP_TAGS = {
  "fractions.whole_number_bias": {
    id: "fractions.whole_number_bias",
    labelEl: "Σύγκριση κλασμάτων",
    labelEn: "Comparing fractions",
    explainEl:
      "Δυσκολεύεται να συγκρίνει κλάσματα όταν ο παρονομαστής είναι μεγαλύτερος αριθμός. Συχνά σκέφτεται τον αριθμητή και τον παρονομαστή σαν δύο ξεχωριστούς ακέραιους αριθμούς, αντί για ένα ενιαίο μέγεθος.",
    explainEn:
      "Struggles to compare fractions when the denominator is a bigger number. Often treats the numerator and denominator as two separate whole numbers instead of one combined quantity.",
    recommendedToolIds: ["khanmigo", "photomath"],
  },
  "fractions.add_across": {
    id: "fractions.add_across",
    labelEl: "Πρόσθεση κλασμάτων",
    labelEn: "Adding fractions",
    explainEl:
      "Προσθέτει ξεχωριστά αριθμητές και παρονομαστές αντί να βρει πρώτα κοινό παρονομαστή. Είναι το πιο συχνό λάθος στην πρόσθεση κλασμάτων σε αυτή την ηλικία.",
    explainEn:
      "Adds numerators and denominators separately instead of finding a common denominator first. This is the most common error in fraction addition at this age.",
    recommendedToolIds: ["khanmigo", "wolfram-alpha"],
  },
  "decimals.longer_is_larger": {
    id: "decimals.longer_is_larger",
    labelEl: "Σύγκριση δεκαδικών",
    labelEn: "Comparing decimals",
    explainEl:
      "Πιστεύει ότι ο δεκαδικός με περισσότερα ψηφία είναι πάντα ο μεγαλύτερος (π.χ. νομίζει ότι το 0,45 είναι μεγαλύτερο από το 0,8). Είναι πολύ κοινή παρανόηση σε αυτή την ηλικία και χρειάζεται συγκεκριμένη εξάσκηση στη θεσιακή αξία.",
    explainEn:
      "Believes a decimal with more digits is always bigger (e.g. thinks 0.45 is greater than 0.8). Very common at this age and needs targeted practice on place value.",
    recommendedToolIds: ["khanmigo", "wolfram-alpha"],
  },
  "division.remainder": {
    id: "division.remainder",
    labelEl: "Διαίρεση με υπόλοιπο",
    labelEn: "Division with remainder",
    explainEl:
      "Δυσκολεύεται στη διαίρεση με διψήφιο διαιρέτη, ειδικά στο να θυμηθεί το υπόλοιπο στο τέλος. Χρειάζεται βήμα-βήμα εξάσκηση στον αλγόριθμο της διαίρεσης.",
    explainEn:
      "Struggles with division by a 2-digit divisor, especially remembering the remainder at the end. Needs step-by-step practice with the division algorithm.",
    recommendedToolIds: ["photomath", "wolfram-alpha"],
  },
  "percent.as_fraction": {
    id: "percent.as_fraction",
    labelEl: "Ποσοστά",
    labelEn: "Percentages",
    explainEl:
      "Δεν έχει ακόμα καταλάβει καλά ότι το ποσοστό σημαίνει «τόσο στα εκατό». Μπερδεύει τη μετατροπή ποσοστού σε κλάσμα.",
    explainEn:
      "Hasn't yet fully grasped that percent means \"out of a hundred.\" Confuses converting a percentage into a fraction.",
    recommendedToolIds: ["khanmigo", "wolfram-alpha"],
  },
  "measurement.area_perimeter_confusion": {
    id: "measurement.area_perimeter_confusion",
    labelEl: "Εμβαδόν και περίμετρος",
    labelEn: "Area and perimeter",
    explainEl:
      "Μπερδεύει τον τύπο του εμβαδού με τον τύπο της περιμέτρου. Χρειάζεται οπτικοποίηση της διαφοράς: η περίμετρος μετράει το «γύρω-γύρω», το εμβαδόν μετράει την επιφάνεια.",
    explainEn:
      "Mixes up the area formula with the perimeter formula. Needs a visual reminder of the difference: perimeter measures the \"way around,\" area measures the surface.",
    recommendedToolIds: ["khanmigo", "photomath"],
  },
};

// ---------- QUIZZES ----------
const QUIZZES = {
  primary: {
    "math-e-dimotikou": {
      id: "math-e-dimotikou",
      subjectLabelEl: "Μαθηματικά, Ε' Δημοτικού",
      subjectLabelEn: "Math, 5th Grade",
      titleEl: "Ο Διαγνωστικός Χάρτης Μάθησης",
      titleEn: "The Learning Compass",
      introEl:
        "6 σύντομες ερωτήσεις. Δεν είναι διαγώνισμα, δεν έχει βαθμό. Στο τέλος θα δούμε ακριβώς πού χρειάζεται λίγη παραπάνω εξάσκηση, και ποιο εργαλείο ταιριάζει σε αυτό το σημείο.",
      introEn:
        "6 short questions. It's not a test, there's no grade. At the end we'll see exactly where a bit more practice would help, and which tool fits that specific spot.",
      questions: [
        {
          id: "q1-fractions-compare",
          textEl: "Ποιο κλάσμα είναι μεγαλύτερο;",
          textEn: "Which fraction is bigger?",
          options: [
            { textEl: "1/4", textEn: "1/4", isCorrect: true },
            { textEl: "1/8", textEn: "1/8", isCorrect: false, gapTag: "fractions.whole_number_bias" },
            { textEl: "Είναι ίσα", textEn: "They're equal", isCorrect: false, gapTag: "fractions.whole_number_bias" },
          ],
        },
        {
          id: "q2-fractions-add",
          textEl: "Πόσο κάνει 1/3 + 1/4;",
          textEn: "What is 1/3 + 1/4?",
          options: [
            { textEl: "7/12", textEn: "7/12", isCorrect: true },
            { textEl: "2/7", textEn: "2/7", isCorrect: false, gapTag: "fractions.add_across" },
            { textEl: "2/12", textEn: "2/12", isCorrect: false, gapTag: "fractions.add_across" },
          ],
        },
        {
          id: "q3-decimals-compare",
          textEl: "Ποιος αριθμός είναι μεγαλύτερος;",
          textEn: "Which number is bigger?",
          options: [
            { textEl: "0,8", textEn: "0.8", isCorrect: true },
            { textEl: "0,45", textEn: "0.45", isCorrect: false, gapTag: "decimals.longer_is_larger" },
            { textEl: "Είναι ίσοι", textEn: "They're equal", isCorrect: false, gapTag: "decimals.longer_is_larger" },
          ],
        },
        {
          id: "q4-division-remainder",
          textEl: "Ένας αριθμός διαιρούμενος με το 9 δίνει πηλίκο 5 και υπόλοιπο 6. Ποιος είναι ο αριθμός;",
          textEn: "A number divided by 9 gives quotient 5 and remainder 6. What is the number?",
          options: [
            { textEl: "51", textEn: "51", isCorrect: true },
            { textEl: "45", textEn: "45", isCorrect: false, gapTag: "division.remainder" },
            { textEl: "56", textEn: "56", isCorrect: false, gapTag: "division.remainder" },
          ],
        },
        {
          id: "q5-percent-fraction",
          textEl: "Πώς γράφεται το 24% ως κλάσμα;",
          textEn: "How do you write 24% as a fraction?",
          options: [
            { textEl: "24/100", textEn: "24/100", isCorrect: true },
            { textEl: "1/24", textEn: "1/24", isCorrect: false, gapTag: "percent.as_fraction" },
            { textEl: "24/10", textEn: "24/10", isCorrect: false, gapTag: "percent.as_fraction" },
          ],
        },
        {
          id: "q6-area-perimeter",
          textEl: "Ένα ορθογώνιο έχει πλευρές 4 εκ. και 6 εκ. Ποιο είναι το εμβαδόν του;",
          textEn: "A rectangle has sides 4 cm and 6 cm. What is its area?",
          options: [
            { textEl: "24 τετρ. εκ.", textEn: "24 sq. cm", isCorrect: true },
            { textEl: "20 εκ.", textEn: "20 cm", isCorrect: false, gapTag: "measurement.area_perimeter_confusion" },
            { textEl: "10 τετρ. εκ.", textEn: "10 sq. cm", isCorrect: false, gapTag: "measurement.area_perimeter_confusion" },
          ],
        },
      ],
    },
  },
};
