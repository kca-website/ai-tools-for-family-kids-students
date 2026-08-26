/**
 * learning-paths-data.js
 * Μονοπάτια μάθησης (Learning Paths) ανά gap tag.
 * Κάθε gap tag (βλ. GAP_TAGS στο quiz-data.js) αντιστοιχεί σε 3 βήματα:
 *   1) Ατομική προσπάθεια χωρίς εργαλείο (learning-first)
 *   2) Καθοδηγούμενη χρήση ενός προτεινόμενου εργαλείου (ερωτήσεις, όχι έτοιμη λύση)
 *   3) Εμπέδωση / απόδειξη κατανόησης
 * Φιλοσοφία ίδια με το υπόλοιπο project: το AI ρωτάει, δεν λύνει.
 */

const LEARNING_PATHS = {
  "fractions.whole_number_bias": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Σύγκριση κλασμάτων» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται να συγκρίνει κλάσματα όταν ο παρονομαστής είναι μεγαλύτερος αριθμός. Συχνά σκέφτεται τον αριθμητή και τον παρονομαστή σαν δύο ξεχωριστούς ακέραιους αριθμούς, αντί για ένα ενιαίο μέγεθος.",
      "descriptionEn": "Solve 2-3 exercises on \"Comparing fractions\" by hand, writing out every step on paper. The most common trap on this topic: Struggles to compare fractions when the denominator is a bigger number. Often treats the numerator and denominator as two separate whole numbers instead of one combined quantity.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Σύγκριση κλασμάτων”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Comparing fractions'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Σύγκριση κλασμάτων» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Comparing fractions\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],
  "fractions.add_across": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Πρόσθεση κλασμάτων» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Προσθέτει ξεχωριστά αριθμητές και παρονομαστές αντί να βρει πρώτα κοινό παρονομαστή. Είναι το πιο συχνό λάθος στην πρόσθεση κλασμάτων σε αυτή την ηλικία.",
      "descriptionEn": "Solve 2-3 exercises on \"Adding fractions\" by hand, writing out every step on paper. The most common trap on this topic: Adds numerators and denominators separately instead of finding a common denominator first. This is the most common error in fraction addition at this age.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Πρόσθεση κλασμάτων”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Adding fractions'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Πρόσθεση κλασμάτων» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Adding fractions\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],
  "decimals.longer_is_larger": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Σύγκριση δεκαδικών» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Πιστεύει ότι ο δεκαδικός με περισσότερα ψηφία είναι πάντα ο μεγαλύτερος (π.χ. νομίζει ότι το 0,45 είναι μεγαλύτερο από το 0,8). Είναι πολύ κοινή παρανόηση σε αυτή την ηλικία και χρειάζεται συγκεκριμένη εξάσκηση στη θεσιακή αξία.",
      "descriptionEn": "Solve 2-3 exercises on \"Comparing decimals\" by hand, writing out every step on paper. The most common trap on this topic: Believes a decimal with more digits is always bigger (e.g. thinks 0.45 is greater than 0.8). Very common at this age and needs targeted practice on place value.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Σύγκριση δεκαδικών”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Comparing decimals'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Σύγκριση δεκαδικών» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Comparing decimals\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],
  "division.remainder": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Διαίρεση με υπόλοιπο» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται στη διαίρεση με διψήφιο διαιρέτη, ειδικά στο να θυμηθεί το υπόλοιπο στο τέλος. Χρειάζεται βήμα-βήμα εξάσκηση στον αλγόριθμο της διαίρεσης.",
      "descriptionEn": "Solve 2-3 exercises on \"Division with remainder\" by hand, writing out every step on paper. The most common trap on this topic: Struggles with division by a 2-digit divisor, especially remembering the remainder at the end. Needs step-by-step practice with the division algorithm.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Photomath",
      "titleEn": "Ask Photomath",
      "descriptionEl": "Άνοιξε το Photomath και πες: «Δυσκολεύομαι στο “Διαίρεση με υπόλοιπο”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Photomath and say: \"I'm struggling with 'Division with remainder'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "photomath"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Διαίρεση με υπόλοιπο» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Khanmigo.",
      "descriptionEn": "Make up a brand-new exercise on \"Division with remainder\" and solve it without help. If you want, check your solution with Khanmigo.",
      "toolId": "khanmigo"
    }
  ],
  "percent.as_fraction": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Ποσοστά» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν έχει ακόμα καταλάβει καλά ότι το ποσοστό σημαίνει «τόσο στα εκατό». Μπερδεύει τη μετατροπή ποσοστού σε κλάσμα.",
      "descriptionEn": "Solve 2-3 exercises on \"Percentages\" by hand, writing out every step on paper. The most common trap on this topic: Hasn't yet fully grasped that percent means 'out of a hundred.' Confuses converting a percentage into a fraction.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Ποσοστά”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Percentages'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Ποσοστά» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Percentages\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],
  "measurement.area_perimeter_confusion": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Εμβαδόν και περίμετρος» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τον τύπο του εμβαδού με τον τύπο της περιμέτρου. Χρειάζεται οπτικοποίηση της διαφοράς: η περίμετρος μετράει το 'γύρω-γύρω', το εμβαδόν μετράει την επιφάνεια.",
      "descriptionEn": "Solve 2-3 exercises on \"Area and perimeter\" by hand, writing out every step on paper. The most common trap on this topic: Mixes up the area formula with the perimeter formula. Needs a visual reminder of the difference: perimeter measures the 'way around,' area measures the surface.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Εμβαδόν και περίμετρος”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Area and perimeter'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Εμβαδόν και περίμετρος» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Photomath.",
      "descriptionEn": "Make up a brand-new exercise on \"Area and perimeter\" and solve it without help. If you want, check your solution with Photomath.",
      "toolId": "photomath"
    }
  ],
  "history.athens-sparta-confusion": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Αθήνα vs Σπάρτη», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Athens vs Sparta\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Ρώτα το Khanmigo: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Αθήνα vs Σπάρτη”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask Khanmigo: \"What historical sources support or challenge what I remember about 'Athens vs Sparta'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "history.byzantine-confusion": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Βυζαντινή Αυτοκρατορία», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Byzantine Empire\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Ρώτα το Khanmigo: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Βυζαντινή Αυτοκρατορία”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask Khanmigo: \"What historical sources support or challenge what I remember about 'Byzantine Empire'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "grammar.subject-verb-agreement": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Συμφωνία υποκειμένου-ρήματος» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Δυσκολεύεται με τη συμφωνία υποκειμένου και ρήματος, ειδικά σε σύνθετες προτάσεις. Χρειάζεται εξάσκηση στην αναγνώριση του υποκειμένου.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Subject-verb agreement\" and underline the spot where you feel unsure. The common trap here: Struggles with subject-verb agreement, especially in complex sentences. Needs practice in identifying the subject.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Συμφωνία υποκειμένου-ρήματος”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open ChatGPT, show it your sentences, and ask: \"Do I have this wrong on 'Subject-verb agreement'? Explain why, don't just correct them for me.\"",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Συμφωνία υποκειμένου-ρήματος» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Subject-verb agreement\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "grammar.comma-usage": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Χρήση κομμάτων» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Μπερδεύεται με τη χρήση κομμάτων σε απαριθμήσεις, προτάσεις και κλήσεις. Χρειάζεται κανόνες και παραδείγματα.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Comma usage\" and underline the spot where you feel unsure. The common trap here: Confused about comma usage in lists, clauses, and addresses. Needs rules and examples.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Χρήση κομμάτων”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open ChatGPT, show it your sentences, and ask: \"Do I have this wrong on 'Comma usage'? Explain why, don't just correct them for me.\"",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Χρήση κομμάτων» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Comma usage\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "physics.force-motion-confusion": [
    {
      "titleEl": "Σκέψου ένα παράδειγμα",
      "titleEn": "Think of an example",
      "descriptionEl": "Πριν ψάξεις οτιδήποτε, βρες ένα καθημερινό παράδειγμα για «Δύναμη και κίνηση» και προσπάθησε να το εξηγήσεις με δικά σου λόγια. Η πιο συχνή παρανόηση σε αυτό το θέμα: Πιστεύει ότι χρειάζεται συνεχής δύναμη για να διατηρηθεί η κίνηση (Αριστοτελική αντίληψη). Χρειάζεται κατανόηση του 1ου νόμου του Νεύτωνα.",
      "descriptionEn": "Before looking anything up, find an everyday example related to \"Force and motion\" and try to explain it in your own words. Check whether you fall into this trap: Believes continuous force is needed to maintain motion (Aristotelian view). Needs understanding of Newton's 1st law.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και περιέγραψε το παράδειγμά σου. Ζήτησέ του να σε ρωτήσει «γιατί το πιστεύεις αυτό;» πριν σου δώσει την επιστημονική εξήγηση για «Δύναμη και κίνηση».",
      "descriptionEn": "Open Wolfram Alpha and describe your example. Ask it to question your reasoning first (\"why do you think that?\") before it gives you the scientific explanation of \"Force and motion\".",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο, με δικά σου λόγια, γιατί ισχύει το σωστό για «Δύναμη και κίνηση» και όχι αυτό που πίστευες πριν. Αν το εξηγήσεις καθαρά, το έμαθες.",
      "descriptionEn": "Explain to a parent or friend, in your own words, why the correct picture of \"Force and motion\" is true, and not what you believed before. If you can explain it clearly, you've learned it.",
      "toolId": null
    }
  ],
  "history.olympics-location": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Τόπος Αρχαίων Ολυμπιακών», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Ancient Olympics location\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Ρώτα το Khanmigo: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Τόπος Αρχαίων Ολυμπιακών”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask Khanmigo: \"What historical sources support or challenge what I remember about 'Ancient Olympics location'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "history.philosophers-confusion": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Αρχαίοι Φιλόσοφοι», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Ancient philosophers\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Ρώτα το Khanmigo: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Αρχαίοι Φιλόσοφοι”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask Khanmigo: \"What historical sources support or challenge what I remember about 'Ancient philosophers'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "physics.density-mass-confusion": [
    {
      "titleEl": "Σκέψου ένα παράδειγμα",
      "titleEn": "Think of an example",
      "descriptionEl": "Πριν ψάξεις οτιδήποτε, βρες ένα καθημερινό παράδειγμα για «Πυκνότητα vs Μάζα» και προσπάθησε να το εξηγήσεις με δικά σου λόγια. Η πιο συχνή παρανόηση σε αυτό το θέμα: Μπερδεύει τη μάζα με την πυκνότητα. Πιστεύει ότι μεγάλο αντικείμενο = μεγάλη πυκνότητα. Χρειάζεται οπτικά παραδείγματα.",
      "descriptionEn": "Before looking anything up, find an everyday example related to \"Density vs Mass\" and try to explain it in your own words. Check whether you fall into this trap: Confuses mass with density. Believes big object = high density. Needs visual examples.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και περιέγραψε το παράδειγμά σου. Ζήτησέ του να σε ρωτήσει «γιατί το πιστεύεις αυτό;» πριν σου δώσει την επιστημονική εξήγηση για «Πυκνότητα vs Μάζα».",
      "descriptionEn": "Open Wolfram Alpha and describe your example. Ask it to question your reasoning first (\"why do you think that?\") before it gives you the scientific explanation of \"Density vs Mass\".",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο, με δικά σου λόγια, γιατί ισχύει το σωστό για «Πυκνότητα vs Μάζα» και όχι αυτό που πίστευες πριν. Αν το εξηγήσεις καθαρά, το έμαθες.",
      "descriptionEn": "Explain to a parent or friend, in your own words, why the correct picture of \"Density vs Mass\" is true, and not what you believed before. If you can explain it clearly, you've learned it.",
      "toolId": null
    }
  ],
  "spelling.homophones": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Ομόηχες λέξεις» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Γράφει τις λέξεις όπως ακούγονται, χωρίς να λαμβάνει υπόψη τη σημασία ή το μέρος του λόγου. Μπερδεύει ομόηχες λέξεις όπως «λύπη» και «λείπει».",
      "descriptionEn": "Write 3-4 of your own sentences using \"Homophones\" and underline the spot where you feel unsure. The common trap here: Spells words by sound alone, ignoring meaning or part of speech. Confuses homophones like 'λύπη' (sadness) and 'λείπει' (is missing).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Ομόηχες λέξεις”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Khanmigo, show it your sentences, and ask: \"Do I have this wrong on 'Homophones'? Explain why, don't just correct them for me.\"",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Ομόηχες λέξεις» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Homophones\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "spelling.oti-otidipote": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν ««Ό,τι» και «ότι»» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Μπερδεύει το «ό,τι» (=οτιδήποτε) με το «ότι» (σύνδεσμος), επειδή ακούγονται ακριβώς ίδια.",
      "descriptionEn": "Write 3-4 of your own sentences using \"'Ó,ti' vs 'óti'\" and underline the spot where you feel unsure. The common trap here: Confuses 'ó,ti' (=whatever) with 'óti' (the conjunction 'that'), because they sound identical.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “«Ό,τι» και «ότι»”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Khanmigo, show it your sentences, and ask: \"Do I have this wrong on ''Ó,ti' vs 'óti''? Explain why, don't just correct them for me.\"",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για ««Ό,τι» και «ότι»» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"'Ó,ti' vs 'óti'\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "spelling.final-n": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Τελικό -ν» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Παραλείπει το τελικό -ν στο άρθρο «τον/έναν» επειδή στην προφορά συχνά δεν ακούγεται καθαρά.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Final -n rule\" and underline the spot where you feel unsure. The common trap here: Drops the final -n from the article 'ton/énan' because it's often not clearly heard in speech.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Τελικό -ν”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Khanmigo, show it your sentences, and ask: \"Do I have this wrong on 'Final -n rule'? Explain why, don't just correct them for me.\"",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Τελικό -ν» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Final -n rule\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "spelling.verb-ending": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Κατάληξη ρήματος -ει» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Μπερδεύει την κατάληξη -ει του ρήματος στο γ' ενικό πρόσωπο με άλλες καταλήξεις που ακούγονται παρόμοια.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Verb ending -ei\" and underline the spot where you feel unsure. The common trap here: Confuses the -ei verb ending (3rd person singular) with other similarly-sounding endings.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Κατάληξη ρήματος -ει”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Khanmigo, show it your sentences, and ask: \"Do I have this wrong on 'Verb ending -ei'? Explain why, don't just correct them for me.\"",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Κατάληξη ρήματος -ει» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Verb ending -ei\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "spelling.stem-confusion": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Θέμα λέξης» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Γράφει τη λέξη όπως την προφέρει, αγνοώντας τη σωστή γραφή του θέματός της (π.χ. «παιδιά» με «αι» αντί για «ε»).",
      "descriptionEn": "Write 3-4 of your own sentences using \"Word stem spelling\" and underline the spot where you feel unsure. The common trap here: Spells the word phonetically, ignoring the correct spelling of its stem (e.g. 'παιδιά' with 'αι' instead of 'ε').",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Θέμα λέξης”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Khanmigo, show it your sentences, and ask: \"Do I have this wrong on 'Word stem spelling'? Explain why, don't just correct them for me.\"",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Θέμα λέξης» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Word stem spelling\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "science-primary.seasons-distance": [
    {
      "titleEl": "Σκέψου το φαινόμενο",
      "titleEn": "Think about the phenomenon",
      "descriptionEl": "Πριν διαβάσεις κάτι, προσπάθησε να εξηγήσεις με δικά σου λόγια το «Αιτία των εποχών». Μετά δες αν η εξήγησή σου πέφτει σε αυτή την παγίδα: Πιστεύει ότι οι εποχές οφείλονται στην απόσταση της Γης από τον Ήλιο, ενώ στην πραγματικότητα οφείλονται στην κλίση του άξονα της Γης.",
      "descriptionEn": "Before reading anything, try to explain \"Cause of the seasons\" in your own words. Then compare it with the most common misconception on this topic: Believes seasons are caused by Earth's changing distance from the Sun, when they're actually caused by the tilt of Earth's axis.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες του την εξήγησή σου για «Αιτία των εποχών». Ζήτησέ του να σου κάνει ερωτήσεις μέχρι να βρεις μόνος/η πού κάνεις λάθος.",
      "descriptionEn": "Open Khanmigo and tell it your explanation of \"Cause of the seasons\". Ask it to keep asking you questions until you find the mistake yourself.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο το «Αιτία των εποχών» με δικά σου λόγια, χρησιμοποιώντας ένα δικό σου παράδειγμα. Αν καταλαβαίνει από την εξήγησή σου, το έμαθες.",
      "descriptionEn": "Explain \"Cause of the seasons\" to a parent or friend in your own words, using your own example. If they understand it from your explanation, you've learned it.",
      "toolId": null
    }
  ],
  "science-primary.day-night-sun-moves": [
    {
      "titleEl": "Σκέψου το φαινόμενο",
      "titleEn": "Think about the phenomenon",
      "descriptionEl": "Πριν διαβάσεις κάτι, προσπάθησε να εξηγήσεις με δικά σου λόγια το «Αιτία μέρας/νύχτας». Μετά δες αν η εξήγησή σου πέφτει σε αυτή την παγίδα: Πιστεύει ότι η μέρα και η νύχτα γίνονται επειδή ο Ήλιος κινείται γύρω από τη Γη, ενώ στην πραγματικότητα η Γη περιστρέφεται γύρω από τον άξονά της.",
      "descriptionEn": "Before reading anything, try to explain \"Cause of day/night\" in your own words. Then compare it with the most common misconception on this topic: Believes day and night happen because the Sun moves around the Earth, when actually the Earth rotates on its axis.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες του την εξήγησή σου για «Αιτία μέρας/νύχτας». Ζήτησέ του να σου κάνει ερωτήσεις μέχρι να βρεις μόνος/η πού κάνεις λάθος.",
      "descriptionEn": "Open Khanmigo and tell it your explanation of \"Cause of day/night\". Ask it to keep asking you questions until you find the mistake yourself.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο το «Αιτία μέρας/νύχτας» με δικά σου λόγια, χρησιμοποιώντας ένα δικό σου παράδειγμα. Αν καταλαβαίνει από την εξήγησή σου, το έμαθες.",
      "descriptionEn": "Explain \"Cause of day/night\" to a parent or friend in your own words, using your own example. If they understand it from your explanation, you've learned it.",
      "toolId": null
    }
  ],
  "science-primary.matter-disappears": [
    {
      "titleEl": "Σκέψου το φαινόμενο",
      "titleEn": "Think about the phenomenon",
      "descriptionEl": "Πριν διαβάσεις κάτι, προσπάθησε να εξηγήσεις με δικά σου λόγια το «Διατήρηση ύλης». Μετά δες αν η εξήγησή σου πέφτει σε αυτή την παγίδα: Πιστεύει ότι όταν κάτι διαλύεται (π.χ. η ζάχαρη στο νερό), εξαφανίζεται και χάνει τη μάζα του.",
      "descriptionEn": "Before reading anything, try to explain \"Conservation of matter\" in your own words. Then compare it with the most common misconception on this topic: Believes that when something dissolves (e.g. sugar in water), it disappears and loses its mass.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες του την εξήγησή σου για «Διατήρηση ύλης». Ζήτησέ του να σου κάνει ερωτήσεις μέχρι να βρεις μόνος/η πού κάνεις λάθος.",
      "descriptionEn": "Open Khanmigo and tell it your explanation of \"Conservation of matter\". Ask it to keep asking you questions until you find the mistake yourself.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο το «Διατήρηση ύλης» με δικά σου λόγια, χρησιμοποιώντας ένα δικό σου παράδειγμα. Αν καταλαβαίνει από την εξήγησή σου, το έμαθες.",
      "descriptionEn": "Explain \"Conservation of matter\" to a parent or friend in your own words, using your own example. If they understand it from your explanation, you've learned it.",
      "toolId": null
    }
  ],
  "science-primary.heavier-falls-faster": [
    {
      "titleEl": "Σκέψου το φαινόμενο",
      "titleEn": "Think about the phenomenon",
      "descriptionEl": "Πριν διαβάσεις κάτι, προσπάθησε να εξηγήσεις με δικά σου λόγια το «Ελεύθερη πτώση». Μετά δες αν η εξήγησή σου πέφτει σε αυτή την παγίδα: Πιστεύει ότι τα βαρύτερα αντικείμενα πέφτουν πιο γρήγορα από τα ελαφρύτερα, μπερδεύοντας το βάρος με την αντίσταση του αέρα.",
      "descriptionEn": "Before reading anything, try to explain \"Free fall\" in your own words. Then compare it with the most common misconception on this topic: Believes heavier objects fall faster than lighter ones, confusing weight with air resistance.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες του την εξήγησή σου για «Ελεύθερη πτώση». Ζήτησέ του να σου κάνει ερωτήσεις μέχρι να βρεις μόνος/η πού κάνεις λάθος.",
      "descriptionEn": "Open Wolfram Alpha and tell it your explanation of \"Free fall\". Ask it to keep asking you questions until you find the mistake yourself.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο το «Ελεύθερη πτώση» με δικά σου λόγια, χρησιμοποιώντας ένα δικό σου παράδειγμα. Αν καταλαβαίνει από την εξήγησή σου, το έμαθες.",
      "descriptionEn": "Explain \"Free fall\" to a parent or friend in your own words, using your own example. If they understand it from your explanation, you've learned it.",
      "toolId": null
    }
  ],
  "science-primary.moon-own-light": [
    {
      "titleEl": "Σκέψου το φαινόμενο",
      "titleEn": "Think about the phenomenon",
      "descriptionEl": "Πριν διαβάσεις κάτι, προσπάθησε να εξηγήσεις με δικά σου λόγια το «Φως του φεγγαριού». Μετά δες αν η εξήγησή σου πέφτει σε αυτή την παγίδα: Πιστεύει ότι το φεγγάρι φωτίζει με το δικό του φως, ενώ στην πραγματικότητα αντανακλά το φως του Ήλιου.",
      "descriptionEn": "Before reading anything, try to explain \"Moonlight\" in your own words. Then compare it with the most common misconception on this topic: Believes the Moon shines with its own light, when it actually reflects sunlight.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες του την εξήγησή σου για «Φως του φεγγαριού». Ζήτησέ του να σου κάνει ερωτήσεις μέχρι να βρεις μόνος/η πού κάνεις λάθος.",
      "descriptionEn": "Open Khanmigo and tell it your explanation of \"Moonlight\". Ask it to keep asking you questions until you find the mistake yourself.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο το «Φως του φεγγαριού» με δικά σου λόγια, χρησιμοποιώντας ένα δικό σου παράδειγμα. Αν καταλαβαίνει από την εξήγησή σου, το έμαθες.",
      "descriptionEn": "Explain \"Moonlight\" to a parent or friend in your own words, using your own example. If they understand it from your explanation, you've learned it.",
      "toolId": null
    }
  ],
  "efl-primary.third-person-s": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Γ' πρόσωπο Ενεστώτα (-s)» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Παραλείπει το -s στο γ' ενικό πρόσωπο του Ενεστώτα, επειδή στα ελληνικά το πρόσωπο δηλώνεται διαφορετικά.",
      "descriptionEn": "Write 3-4 of your own sentences using \"3rd person -s\" and underline the spot where you feel unsure. The common trap here: Omits the 3rd-person -s in Present Simple, because Greek marks person differently on the verb.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Duolingo",
      "titleEn": "Ask Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Γ' πρόσωπο Ενεστώτα (-s)”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Duolingo, show it your sentences, and ask: \"Do I have this wrong on '3rd person -s'? Explain why, don't just correct them for me.\"",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Γ' πρόσωπο Ενεστώτα (-s)» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"3rd person -s\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "efl-primary.age-construction": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Έκφραση ηλικίας» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Λέει «I have ten years» αντί για «I am ten years old», μεταφέροντας τη δομή της ελληνικής («είμαι δέκα χρονών»).",
      "descriptionEn": "Write 3-4 of your own sentences using \"Age expressions\" and underline the spot where you feel unsure. The common trap here: Says 'I have ten years' instead of 'I am ten years old,' transferring the Greek structure ('είμαι δέκα χρονών').",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Duolingo",
      "titleEn": "Ask Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Έκφραση ηλικίας”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Duolingo, show it your sentences, and ask: \"Do I have this wrong on 'Age expressions'? Explain why, don't just correct them for me.\"",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Έκφραση ηλικίας» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Age expressions\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "efl-primary.definite-article-generic": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Άρθρο σε γενικές έννοιες» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Βάζει «the» μπροστά από γενικά ουσιαστικά στον πληθυντικό (π.χ. «the dogs» αντί για «dogs»), όπως γίνεται στα ελληνικά.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Article with generics\" and underline the spot where you feel unsure. The common trap here: Adds 'the' before generic plural nouns (e.g. 'the dogs' instead of 'dogs'), as is done in Greek.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Duolingo",
      "titleEn": "Ask Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Άρθρο σε γενικές έννοιες”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Duolingo, show it your sentences, and ask: \"Do I have this wrong on 'Article with generics'? Explain why, don't just correct them for me.\"",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Άρθρο σε γενικές έννοιες» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Article with generics\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "efl-primary.phonetic-spelling": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Φωνητική γραφή αγγλικών» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Γράφει τις αγγλικές λέξεις όπως ακούγονται (π.χ. «becos» αντί για «because»), επειδή τα ελληνικά είναι πιο φωνητική γλώσσα.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Phonetic spelling\" and underline the spot where you feel unsure. The common trap here: Spells English words the way they sound (e.g. 'becos' instead of 'because'), because Greek is a more phonetic language.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Duolingo",
      "titleEn": "Ask Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Φωνητική γραφή αγγλικών”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Duolingo, show it your sentences, and ask: \"Do I have this wrong on 'Phonetic spelling'? Explain why, don't just correct them for me.\"",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Φωνητική γραφή αγγλικών» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Phonetic spelling\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "efl-primary.false-friend-sympathetic": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «False friend: sympathetic» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Νομίζει ότι το «sympathetic» σημαίνει «συμπαθητικός» (=likeable), ενώ στα αγγλικά σημαίνει «γεμάτος κατανόηση».",
      "descriptionEn": "Write 3-4 of your own sentences using \"False friend: sympathetic\" and underline the spot where you feel unsure. The common trap here: Thinks 'sympathetic' means 'συμπαθητικός' (likeable), when in English it actually means 'showing compassion/understanding.'",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Duolingo",
      "titleEn": "Ask Duolingo",
      "descriptionEl": "Άνοιξε το Duolingo, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “False friend: sympathetic”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Duolingo, show it your sentences, and ask: \"Do I have this wrong on 'False friend: sympathetic'? Explain why, don't just correct them for me.\"",
      "toolId": "duolingo"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «False friend: sympathetic» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"False friend: sympathetic\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "algebra.minus-sign": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Πρόσημο πλην» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Αντιμετωπίζει το πρόσημο «-» μόνο ως πράξη αφαίρεσης και όχι ως κομμάτι του όρου, με αποτέλεσμα να το «χάνει» όταν λύνει εξισώσεις.",
      "descriptionEn": "Solve 2-3 exercises on \"The minus sign\" by hand, writing out every step on paper. The most common trap on this topic: Treats the '-' sign only as a subtraction operation, not as part of the term, and 'loses' it when solving equations.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Πρόσημο πλην”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'The minus sign'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Πρόσημο πλην» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Wolfram Alpha.",
      "descriptionEn": "Make up a brand-new exercise on \"The minus sign\" and solve it without help. If you want, check your solution with Wolfram Alpha.",
      "toolId": null
    }
  ],
  "algebra.equals-balance": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Ισότητα ως ισορροπία» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Αντιμετωπίζει το «=» σαν «γράψε εδώ την απάντηση» αντί για «οι δύο πλευρές ισορροπούν», με αποτέλεσμα να κάνει πράξεις μόνο στη μία πλευρά.",
      "descriptionEn": "Solve 2-3 exercises on \"Equals as balance\" by hand, writing out every step on paper. The most common trap on this topic: Treats '=' as 'write the answer here' rather than 'both sides balance,' so performs operations on only one side.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Ισότητα ως ισορροπία”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'Equals as balance'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Ισότητα ως ισορροπία» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Wolfram Alpha.",
      "descriptionEn": "Make up a brand-new exercise on \"Equals as balance\" and solve it without help. If you want, check your solution with Wolfram Alpha.",
      "toolId": null
    }
  ],
  "algebra.distribute-negative": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Επιμεριστική με αρνητικό» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Όταν διανέμει ένα αρνητικό πρόσημο σε παρένθεση, το εφαρμόζει μόνο στον πρώτο όρο, όχι σε όλους.",
      "descriptionEn": "Solve 2-3 exercises on \"Distributing a negative\" by hand, writing out every step on paper. The most common trap on this topic: When distributing a negative sign over parentheses, applies it only to the first term, not to all of them.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Επιμεριστική με αρνητικό”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'Distributing a negative'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Επιμεριστική με αρνητικό» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Wolfram Alpha.",
      "descriptionEn": "Make up a brand-new exercise on \"Distributing a negative\" and solve it without help. If you want, check your solution with Wolfram Alpha.",
      "toolId": null
    }
  ],
  "algebra.pythagorean-add": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Πυθαγόρειο με κάθετη πλευρά» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Στο Πυθαγόρειο θεώρημα, προσθέτει πάντα τα τετράγωνα των δύο γνωστών πλευρών, ακόμα κι όταν ζητείται μια κάθετη πλευρά (όχι η υποτείνουσα).",
      "descriptionEn": "Solve 2-3 exercises on \"Pythagorean theorem, finding a leg\" by hand, writing out every step on paper. The most common trap on this topic: In the Pythagorean theorem, always adds the squares of the two known sides, even when solving for a leg (not the hypotenuse).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Πυθαγόρειο με κάθετη πλευρά”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'Pythagorean theorem, finding a leg'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Πυθαγόρειο με κάθετη πλευρά» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με Wolfram Alpha.",
      "descriptionEn": "Make up a brand-new exercise on \"Pythagorean theorem, finding a leg\" and solve it without help. If you want, check your solution with Wolfram Alpha.",
      "toolId": null
    }
  ],
  "history-gym.agia-lavra": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Έναρξη της Επανάστασης», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Start of the Revolution\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Ρώτα το ChatGPT: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Έναρξη της Επανάστασης”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask ChatGPT: \"What historical sources support or challenge what I remember about 'Start of the Revolution'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "history-gym.greeks-united": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Ενότητα κατά την Επανάσταση», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Unity during the Revolution\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Ρώτα το ChatGPT: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Ενότητα κατά την Επανάσταση”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask ChatGPT: \"What historical sources support or challenge what I remember about 'Unity during the Revolution'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "history-gym.filiki-etaireia-leaders": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Ίδρυση Φιλικής Εταιρείας», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Founding of the Filiki Etaireia\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Ρώτα το ChatGPT: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Ίδρυση Φιλικής Εταιρείας”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask ChatGPT: \"What historical sources support or challenge what I remember about 'Founding of the Filiki Etaireia'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "history-gym.kryfo-sxoleio": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Εκπαίδευση επί Τουρκοκρατίας», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Education under Ottoman rule\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Ρώτα το ChatGPT: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Εκπαίδευση επί Τουρκοκρατίας”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask ChatGPT: \"What historical sources support or challenge what I remember about 'Education under Ottoman rule'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": null
    }
  ],
  "efl-gym.present-perfect-past-simple": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Present Perfect vs Past Simple» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Χρησιμοποιεί τον Present Perfect με χρονικούς προσδιορισμούς που δηλώνουν συγκεκριμένο παρελθόν (π.χ. «yesterday»), επειδή ο ελληνικός Παρακείμενος χρησιμοποιείται πιο ελεύθερα.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Present Perfect vs Past Simple\" and underline the spot where you feel unsure. The common trap here: Uses Present Perfect with time markers that indicate a specific past time (e.g. 'yesterday'), because the Greek Παρακείμενος is used more freely.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Gemini",
      "titleEn": "Ask Gemini",
      "descriptionEl": "Άνοιξε το Gemini, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Present Perfect vs Past Simple”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Gemini, show it your sentences, and ask: \"Do I have this wrong on 'Present Perfect vs Past Simple'? Explain why, don't just correct them for me.\"",
      "toolId": "gemini"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Present Perfect vs Past Simple» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Present Perfect vs Past Simple\" on your own, without any tool.",
      "toolId": "chatgpt"
    }
  ],
  "efl-gym.second-conditional-would": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Δεύτερος Υποθετικός» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Βάζει «would» και στις δύο προτάσεις μιας υποθετικής (π.χ. «If I would have money»), πιστεύοντας ότι ο υποθετικός δείκτης χρειάζεται και στις δύο πλευρές.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Second Conditional\" and underline the spot where you feel unsure. The common trap here: Puts 'would' in both clauses of a conditional (e.g. 'If I would have money'), believing the hypothetical marker is needed on both sides.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Gemini",
      "titleEn": "Ask Gemini",
      "descriptionEl": "Άνοιξε το Gemini, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Δεύτερος Υποθετικός”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Gemini, show it your sentences, and ask: \"Do I have this wrong on 'Second Conditional'? Explain why, don't just correct them for me.\"",
      "toolId": "gemini"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Δεύτερος Υποθετικός» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Second Conditional\" on your own, without any tool.",
      "toolId": "chatgpt"
    }
  ],
  "efl-gym.preposition-interference": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Προθέσεις» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Χρησιμοποιεί προθέσεις με άμεση μετάφραση από τα ελληνικά (π.χ. «discuss about» από το «συζητώ για»), αντί για τη σωστή αγγλική δομή.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Prepositions\" and underline the spot where you feel unsure. The common trap here: Uses prepositions transferred directly from Greek (e.g. 'discuss about' from 'συζητώ για'), instead of the correct English structure.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Gemini",
      "titleEn": "Ask Gemini",
      "descriptionEl": "Άνοιξε το Gemini, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Προθέσεις”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Gemini, show it your sentences, and ask: \"Do I have this wrong on 'Prepositions'? Explain why, don't just correct them for me.\"",
      "toolId": "gemini"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Προθέσεις» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Prepositions\" on your own, without any tool.",
      "toolId": "chatgpt"
    }
  ],
  "efl-gym.uncountable-nouns": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Μη μετρήσιμα ουσιαστικά» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Μεταχειρίζεται μη μετρήσιμα ουσιαστικά σαν να είναι μετρήσιμα (π.χ. «informations», «an advice»), επειδή τα αντίστοιχα ελληνικά ουσιαστικά μπαίνουν σε πληθυντικό.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Uncountable nouns\" and underline the spot where you feel unsure. The common trap here: Treats uncountable nouns as countable (e.g. 'informations', 'an advice'), because the corresponding Greek nouns can be pluralized.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Gemini",
      "titleEn": "Ask Gemini",
      "descriptionEl": "Άνοιξε το Gemini, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Μη μετρήσιμα ουσιαστικά”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Gemini, show it your sentences, and ask: \"Do I have this wrong on 'Uncountable nouns'? Explain why, don't just correct them for me.\"",
      "toolId": "gemini"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Μη μετρήσιμα ουσιαστικά» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Uncountable nouns\" on your own, without any tool.",
      "toolId": "chatgpt"
    }
  ],
  "ekthesi.unsupported-argument": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Τεκμηρίωση επιχειρήματος» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Πιστεύει ότι ένα δυνατό επιχείρημα είναι απλώς μια έντονα διατυπωμένη άποψη, χωρίς τεκμηρίωση ή επίκληση στη λογική.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Argument evidence\" and underline the spot where you feel unsure. The common trap here: Believes a strong argument is just a forcefully stated opinion, without evidence or an appeal to reason.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Τεκμηρίωση επιχειρήματος”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open ChatGPT, show it your sentences, and ask: \"Do I have this wrong on 'Argument evidence'? Explain why, don't just correct them for me.\"",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Τεκμηρίωση επιχειρήματος» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Argument evidence\" on your own, without any tool.",
      "toolId": "grammarly"
    }
  ],
  "ekthesi.text-type-ignore": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Κειμενικά είδη» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Γράφει το ίδιο γενικό δοκίμιο ανεξάρτητα από το είδος κειμένου που ζητείται (π.χ. επιστολή, ομιλία, άρθρο), αγνοώντας τον αποδέκτη και τον σκοπό.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Text types\" and underline the spot where you feel unsure. The common trap here: Writes the same generic essay regardless of the requested text type (e.g. letter, speech, article), ignoring the addressee and purpose.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Κειμενικά είδη”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open ChatGPT, show it your sentences, and ask: \"Do I have this wrong on 'Text types'? Explain why, don't just correct them for me.\"",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Κειμενικά είδη» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Text types\" on your own, without any tool.",
      "toolId": "grammarly"
    }
  ],
  "ekthesi.register-confusion": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Επίσημο ύφος» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Χρησιμοποιεί προφορικές/καθημερινές δομές σε επίσημο γραπτό λόγο (π.χ. «το πώς» αντί για «το ότι»), χωρίς να αντιλαμβάνεται τη διαφορά ύφους.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Formal register\" and underline the spot where you feel unsure. The common trap here: Uses colloquial/spoken structures in formal written language, without recognizing the difference in register.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Επίσημο ύφος”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open ChatGPT, show it your sentences, and ask: \"Do I have this wrong on 'Formal register'? Explain why, don't just correct them for me.\"",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Επίσημο ύφος» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Formal register\" on your own, without any tool.",
      "toolId": "grammarly"
    }
  ],
  "ekthesi.intro-conclusion-function": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Δομή κειμένου» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Νομίζει ότι ο πρόλογος πρέπει απλώς να επαναλαμβάνει την εκφώνηση και ότι ο επίλογος μπορεί να εισάγει νέα επιχειρήματα, αγνοώντας τη λειτουργία κάθε μέρους.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Text structure\" and underline the spot where you feel unsure. The common trap here: Thinks the introduction should simply restate the prompt and the conclusion can introduce new arguments, missing the function of each part.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Δομή κειμένου”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open ChatGPT, show it your sentences, and ask: \"Do I have this wrong on 'Text structure'? Explain why, don't just correct them for me.\"",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Δομή κειμένου» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Text structure\" on your own, without any tool.",
      "toolId": "grammarly"
    }
  ],
  "ekthesi.summary-copying": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Περίληψη» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Γράφει περίληψη αντιγράφοντας προτάσεις του κειμένου ή προσθέτοντας προσωπική άποψη, αντί να αναδιατυπώνει αντικειμενικά τις ιδέες του συγγραφέα.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Summarizing\" and underline the spot where you feel unsure. The common trap here: Writes a summary by copying sentences from the text or adding personal opinion, instead of objectively reformulating the author's ideas.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Άνοιξε το ChatGPT, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Περίληψη”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open ChatGPT, show it your sentences, and ask: \"Do I have this wrong on 'Summarizing'? Explain why, don't just correct them for me.\"",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Περίληψη» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Summarizing\" on your own, without any tool.",
      "toolId": "grammarly"
    }
  ],
  "functions.one-formula-only": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Έννοια συνάρτησης» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Πιστεύει ότι μια συνάρτηση πρέπει να δίνεται πάντα από έναν μοναδικό τύπο, απορρίπτοντας συναρτήσεις που ορίζονται με κλάδους ή πίνακες.",
      "descriptionEn": "Solve 2-3 exercises on \"Function concept\" by hand, writing out every step on paper. The most common trap on this topic: Believes a function must always be given by a single formula, rejecting piecewise- or table-defined functions.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Έννοια συνάρτησης”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'Function concept'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Έννοια συνάρτησης» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με ChatGPT.",
      "descriptionEn": "Make up a brand-new exercise on \"Function concept\" and solve it without help. If you want, check your solution with ChatGPT.",
      "toolId": "chatgpt"
    }
  ],
  "functions.quadratic-always-two-roots": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Δευτεροβάθμια εξίσωση» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Πιστεύει ότι κάθε δευτεροβάθμια εξίσωση έχει πάντα δύο πραγματικές λύσεις, αγνοώντας τον ρόλο της διακρίνουσας.",
      "descriptionEn": "Solve 2-3 exercises on \"Quadratic equations\" by hand, writing out every step on paper. The most common trap on this topic: Believes every quadratic equation always has two real solutions, ignoring the role of the discriminant.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Δευτεροβάθμια εξίσωση”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'Quadratic equations'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Δευτεροβάθμια εξίσωση» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με ChatGPT.",
      "descriptionEn": "Make up a brand-new exercise on \"Quadratic equations\" and solve it without help. If you want, check your solution with ChatGPT.",
      "toolId": "chatgpt"
    }
  ],
  "functions.sqrt-drops-absolute-value": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Τετραγωνική ρίζα & απόλυτη τιμή» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Πιστεύει ότι το √(x²) ισούται πάντα με x, αγνοώντας ότι η τετραγωνική ρίζα ενός τετραγώνου δίνει την απόλυτη τιμή.",
      "descriptionEn": "Solve 2-3 exercises on \"Square roots & absolute value\" by hand, writing out every step on paper. The most common trap on this topic: Believes √(x²) always equals x, ignoring that the square root of a square gives the absolute value.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Τετραγωνική ρίζα & απόλυτη τιμή”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'Square roots & absolute value'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Τετραγωνική ρίζα & απόλυτη τιμή» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με ChatGPT.",
      "descriptionEn": "Make up a brand-new exercise on \"Square roots & absolute value\" and solve it without help. If you want, check your solution with ChatGPT.",
      "toolId": "chatgpt"
    }
  ],
  "functions.vertex-value-confusion": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Μέγιστο/ελάχιστο συνάρτησης» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τη μέγιστη/ελάχιστη τιμή μιας συνάρτησης με το σημείο (x) στο οποίο αυτή εμφανίζεται.",
      "descriptionEn": "Solve 2-3 exercises on \"Function max/min\" by hand, writing out every step on paper. The most common trap on this topic: Confuses a function's maximum/minimum value with the x-point where it occurs.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Μέγιστο/ελάχιστο συνάρτησης”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'Function max/min'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Μέγιστο/ελάχιστο συνάρτησης» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με ChatGPT.",
      "descriptionEn": "Make up a brand-new exercise on \"Function max/min\" and solve it without help. If you want, check your solution with ChatGPT.",
      "toolId": "chatgpt"
    }
  ],
  "functions.inequality-no-sign-flip": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Ανισώσεις» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Λύνει μια ανίσωση σαν να ήταν εξίσωση, χωρίς να αντιστρέφει τη φορά της ανισότητας όταν πολλαπλασιάζει/διαιρεί με αρνητικό αριθμό.",
      "descriptionEn": "Solve 2-3 exercises on \"Inequalities\" by hand, writing out every step on paper. The most common trap on this topic: Solves an inequality as if it were an equation, without flipping the inequality sign when multiplying/dividing by a negative number.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και πες: «Δυσκολεύομαι στο “Ανισώσεις”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Wolfram Alpha and say: \"I'm struggling with 'Inequalities'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση για «Ανισώσεις» και λύσε την χωρίς βοήθεια. Αν θες, έλεγξε τη λύση σου με ChatGPT.",
      "descriptionEn": "Make up a brand-new exercise on \"Inequalities\" and solve it without help. If you want, check your solution with ChatGPT.",
      "toolId": "chatgpt"
    }
  ],
  "physics-lyk.motion-implies-force": [
    {
      "titleEl": "Σκέψου ένα παράδειγμα",
      "titleEn": "Think of an example",
      "descriptionEl": "Πριν ψάξεις οτιδήποτε, βρες ένα καθημερινό παράδειγμα για «1ος Νόμος Νεύτωνα» και προσπάθησε να το εξηγήσεις με δικά σου λόγια. Η πιο συχνή παρανόηση σε αυτό το θέμα: Πιστεύει ότι ένα κινούμενο σώμα χρειάζεται πάντα μια δύναμη προς την κατεύθυνση της κίνησής του, αγνοώντας τον 1ο νόμο του Νεύτωνα.",
      "descriptionEn": "Before looking anything up, find an everyday example related to \"Newton's First Law\" and try to explain it in your own words. Check whether you fall into this trap: Believes a moving object always needs a force in its direction of motion, ignoring Newton's 1st law.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και περιέγραψε το παράδειγμά σου. Ζήτησέ του να σε ρωτήσει «γιατί το πιστεύεις αυτό;» πριν σου δώσει την επιστημονική εξήγηση για «1ος Νόμος Νεύτωνα».",
      "descriptionEn": "Open Wolfram Alpha and describe your example. Ask it to question your reasoning first (\"why do you think that?\") before it gives you the scientific explanation of \"Newton's First Law\".",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο, με δικά σου λόγια, γιατί ισχύει το σωστό για «1ος Νόμος Νεύτωνα» και όχι αυτό που πίστευες πριν. Αν το εξηγήσεις καθαρά, το έμαθες.",
      "descriptionEn": "Explain to a parent or friend, in your own words, why the correct picture of \"Newton's First Law\" is true, and not what you believed before. If you can explain it clearly, you've learned it.",
      "toolId": "chatgpt-edu"
    }
  ],
  "physics-lyk.newton-third-law-bigger-force": [
    {
      "titleEl": "Σκέψου ένα παράδειγμα",
      "titleEn": "Think of an example",
      "descriptionEl": "Πριν ψάξεις οτιδήποτε, βρες ένα καθημερινό παράδειγμα για «3ος Νόμος Νεύτωνα» και προσπάθησε να το εξηγήσεις με δικά σου λόγια. Η πιο συχνή παρανόηση σε αυτό το θέμα: Πιστεύει ότι σε μια σύγκρουση το μεγαλύτερο/βαρύτερο σώμα ασκεί μεγαλύτερη δύναμη από το μικρότερο, αγνοώντας τον 3ο νόμο του Νεύτωνα.",
      "descriptionEn": "Before looking anything up, find an everyday example related to \"Newton's Third Law\" and try to explain it in your own words. Check whether you fall into this trap: Believes that in a collision, the bigger/heavier object exerts a greater force than the smaller one, ignoring Newton's 3rd law.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και περιέγραψε το παράδειγμά σου. Ζήτησέ του να σε ρωτήσει «γιατί το πιστεύεις αυτό;» πριν σου δώσει την επιστημονική εξήγηση για «3ος Νόμος Νεύτωνα».",
      "descriptionEn": "Open Wolfram Alpha and describe your example. Ask it to question your reasoning first (\"why do you think that?\") before it gives you the scientific explanation of \"Newton's Third Law\".",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο, με δικά σου λόγια, γιατί ισχύει το σωστό για «3ος Νόμος Νεύτωνα» και όχι αυτό που πίστευες πριν. Αν το εξηγήσεις καθαρά, το έμαθες.",
      "descriptionEn": "Explain to a parent or friend, in your own words, why the correct picture of \"Newton's Third Law\" is true, and not what you believed before. If you can explain it clearly, you've learned it.",
      "toolId": "chatgpt-edu"
    }
  ],
  "physics-lyk.force-energy-same": [
    {
      "titleEl": "Σκέψου ένα παράδειγμα",
      "titleEn": "Think of an example",
      "descriptionEl": "Πριν ψάξεις οτιδήποτε, βρες ένα καθημερινό παράδειγμα για «Δύναμη vs Ενέργεια» και προσπάθησε να το εξηγήσεις με δικά σου λόγια. Η πιο συχνή παρανόηση σε αυτό το θέμα: Μπερδεύει τη δύναμη με την ενέργεια, πιστεύοντας ότι ένα κινούμενο σώμα «έχει δύναμη» που «τελειώνει».",
      "descriptionEn": "Before looking anything up, find an everyday example related to \"Force vs Energy\" and try to explain it in your own words. Check whether you fall into this trap: Confuses force with energy, believing a moving object 'has force' that 'runs out.'",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και περιέγραψε το παράδειγμά σου. Ζήτησέ του να σε ρωτήσει «γιατί το πιστεύεις αυτό;» πριν σου δώσει την επιστημονική εξήγηση για «Δύναμη vs Ενέργεια».",
      "descriptionEn": "Open Wolfram Alpha and describe your example. Ask it to question your reasoning first (\"why do you think that?\") before it gives you the scientific explanation of \"Force vs Energy\".",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο, με δικά σου λόγια, γιατί ισχύει το σωστό για «Δύναμη vs Ενέργεια» και όχι αυτό που πίστευες πριν. Αν το εξηγήσεις καθαρά, το έμαθες.",
      "descriptionEn": "Explain to a parent or friend, in your own words, why the correct picture of \"Force vs Energy\" is true, and not what you believed before. If you can explain it clearly, you've learned it.",
      "toolId": "chatgpt-edu"
    }
  ],
  "physics-lyk.energy-used-up": [
    {
      "titleEl": "Σκέψου ένα παράδειγμα",
      "titleEn": "Think of an example",
      "descriptionEl": "Πριν ψάξεις οτιδήποτε, βρες ένα καθημερινό παράδειγμα για «Διατήρηση ενέργειας» και προσπάθησε να το εξηγήσεις με δικά σου λόγια. Η πιο συχνή παρανόηση σε αυτό το θέμα: Πιστεύει ότι η ενέργεια «χρησιμοποιείται και εξαφανίζεται», αντί να μεταφέρεται σε άλλη μορφή σύμφωνα με την αρχή διατήρησης της ενέργειας.",
      "descriptionEn": "Before looking anything up, find an everyday example related to \"Conservation of energy\" and try to explain it in your own words. Check whether you fall into this trap: Believes energy 'gets used up and disappears,' instead of being transferred to another form per the conservation of energy.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και περιέγραψε το παράδειγμά σου. Ζήτησέ του να σε ρωτήσει «γιατί το πιστεύεις αυτό;» πριν σου δώσει την επιστημονική εξήγηση για «Διατήρηση ενέργειας».",
      "descriptionEn": "Open Wolfram Alpha and describe your example. Ask it to question your reasoning first (\"why do you think that?\") before it gives you the scientific explanation of \"Conservation of energy\".",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο, με δικά σου λόγια, γιατί ισχύει το σωστό για «Διατήρηση ενέργειας» και όχι αυτό που πίστευες πριν. Αν το εξηγήσεις καθαρά, το έμαθες.",
      "descriptionEn": "Explain to a parent or friend, in your own words, why the correct picture of \"Conservation of energy\" is true, and not what you believed before. If you can explain it clearly, you've learned it.",
      "toolId": "chatgpt-edu"
    }
  ],
  "physics-lyk.constant-velocity-needs-force": [
    {
      "titleEl": "Σκέψου ένα παράδειγμα",
      "titleEn": "Think of an example",
      "descriptionEl": "Πριν ψάξεις οτιδήποτε, βρες ένα καθημερινό παράδειγμα για «Συνισταμένη δύναμη» και προσπάθησε να το εξηγήσεις με δικά σου λόγια. Η πιο συχνή παρανόηση σε αυτό το θέμα: Πιστεύει ότι για να κινείται ένα σώμα με σταθερή ταχύτητα χρειάζεται μια συνεχή, μη μηδενική συνισταμένη δύναμη.",
      "descriptionEn": "Before looking anything up, find an everyday example related to \"Net force\" and try to explain it in your own words. Check whether you fall into this trap: Believes a constant net force is needed to keep an object moving at a steady velocity.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Wolfram Alpha",
      "titleEn": "Ask Wolfram Alpha",
      "descriptionEl": "Άνοιξε το Wolfram Alpha και περιέγραψε το παράδειγμά σου. Ζήτησέ του να σε ρωτήσει «γιατί το πιστεύεις αυτό;» πριν σου δώσει την επιστημονική εξήγηση για «Συνισταμένη δύναμη».",
      "descriptionEn": "Open Wolfram Alpha and describe your example. Ask it to question your reasoning first (\"why do you think that?\") before it gives you the scientific explanation of \"Net force\".",
      "toolId": "wolfram-alpha"
    },
    {
      "titleEl": "Εξήγησέ το σε κάποιον",
      "titleEn": "Explain it to someone",
      "descriptionEl": "Εξήγησε σε έναν γονιό ή φίλο, με δικά σου λόγια, γιατί ισχύει το σωστό για «Συνισταμένη δύναμη» και όχι αυτό που πίστευες πριν. Αν το εξηγήσεις καθαρά, το έμαθες.",
      "descriptionEn": "Explain to a parent or friend, in your own words, why the correct picture of \"Net force\" is true, and not what you believed before. If you can explain it clearly, you've learned it.",
      "toolId": "chatgpt-edu"
    }
  ],
  "history-lyk.kryfo-sxoleio-ban": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Εκπαίδευση επί Τουρκοκρατίας», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Education under Ottoman rule\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Ρώτα το ChatGPT: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Εκπαίδευση επί Τουρκοκρατίας”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask ChatGPT: \"What historical sources support or challenge what I remember about 'Education under Ottoman rule'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": "elements-of-ai"
    }
  ],
  "history-lyk.1922-military-defeat-only": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Μικρασιατική Καταστροφή», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"The Asia Minor Catastrophe\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Ρώτα το ChatGPT: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Μικρασιατική Καταστροφή”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask ChatGPT: \"What historical sources support or challenge what I remember about 'The Asia Minor Catastrophe'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": "elements-of-ai"
    }
  ],
  "history-lyk.refugee-spontaneous": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Συνθήκη της Λωζάνης», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Treaty of Lausanne\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Ρώτα το ChatGPT: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Συνθήκη της Λωζάνης”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask ChatGPT: \"What historical sources support or challenge what I remember about 'Treaty of Lausanne'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": "elements-of-ai"
    }
  ],
  "history-lyk.greeks-majority-asia-minor": [
    {
      "titleEl": "Γράψε τι θυμάσαι",
      "titleEn": "Write down what you remember",
      "descriptionEl": "Γράψε σε 2-3 προτάσεις τι θυμάσαι για «Πληθυσμοί Μικράς Ασίας», χωρίς να ψάξεις τίποτα. Μετά συνέχισε στο επόμενο βήμα για να ελέγξεις αν αυτό που θυμάσαι στέκει στις πηγές.",
      "descriptionEn": "Write 2-3 sentences of what you remember about \"Asia Minor populations\", without looking anything up first. Then move to the next step to check whether what you remember holds up against the sources.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το ChatGPT",
      "titleEn": "Ask ChatGPT",
      "descriptionEl": "Ρώτα το ChatGPT: «Ποιες ιστορικές πηγές στηρίζουν ή αναιρούν αυτό που θυμάμαι για “Πληθυσμοί Μικράς Ασίας”;» Ζήτησέ του να σου εξηγήσει, όχι απλώς να σου δώσει την απάντηση.",
      "descriptionEn": "Ask ChatGPT: \"What historical sources support or challenge what I remember about 'Asia Minor populations'?\" Ask it to walk you through the reasoning, not just hand you the answer.",
      "toolId": "chatgpt"
    },
    {
      "titleEl": "Ξαναγράψε τι θυμάσαι",
      "titleEn": "Rewrite what you remember",
      "descriptionEl": "Ξαναγράψε τις 2-3 προτάσεις του πρώτου βήματος, αυτή τη φορά σωστά, και σημείωσε ποια πηγή σε βοήθησε να το διορθώσεις.",
      "descriptionEn": "Rewrite the 2-3 sentences from step one, this time correctly, and note which source helped you fix it.",
      "toolId": "elements-of-ai"
    }
  ],
  "efl-lyk.present-perfect-discourse": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Χρόνοι σε αφήγηση» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Συνεχίζει να χρησιμοποιεί τον Present Perfect για συγκεκριμένες λεπτομέρειες στο παρελθόν, αντί να περνάει στον Past Simple, λόγω επιρροής του ελληνικού Παρακείμενου.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Tenses in narrative\" and underline the spot where you feel unsure. The common trap here: Keeps using Present Perfect for specific past details instead of switching to Past Simple, due to influence from the Greek Παρακείμενος.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Grammarly",
      "titleEn": "Ask Grammarly",
      "descriptionEl": "Άνοιξε το Grammarly, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Χρόνοι σε αφήγηση”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Grammarly, show it your sentences, and ask: \"Do I have this wrong on 'Tenses in narrative'? Explain why, don't just correct them for me.\"",
      "toolId": "grammarly"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Χρόνοι σε αφήγηση» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Tenses in narrative\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "efl-lyk.reported-speech-backshift": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Πλάγιος λόγος» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Δεν εφαρμόζει τη μετατόπιση χρόνου (backshift) στον πλάγιο λόγο, αφήνοντας τα ρήματα στον ίδιο χρόνο με τον ευθύ λόγο.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Reported speech\" and underline the spot where you feel unsure. The common trap here: Doesn't apply tense backshift in reported speech, leaving verbs in the same tense as the direct speech.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Grammarly",
      "titleEn": "Ask Grammarly",
      "descriptionEl": "Άνοιξε το Grammarly, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Πλάγιος λόγος”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Grammarly, show it your sentences, and ask: \"Do I have this wrong on 'Reported speech'? Explain why, don't just correct them for me.\"",
      "toolId": "grammarly"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Πλάγιος λόγος» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Reported speech\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "efl-lyk.false-friends-advanced": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Προχωρημένα False Friends» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Μπερδεύει προχωρημένες αγγλικές λέξεις με τα ελληνικά «ψευδόφιλά» τους (π.χ. «actually» = «τώρα» αντί για «στην πραγματικότητα»).",
      "descriptionEn": "Write 3-4 of your own sentences using \"Advanced false friends\" and underline the spot where you feel unsure. The common trap here: Confuses advanced English words with their Greek 'false friends' (e.g. 'actually' = 'currently' instead of 'in fact').",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Grammarly",
      "titleEn": "Ask Grammarly",
      "descriptionEl": "Άνοιξε το Grammarly, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Προχωρημένα False Friends”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Grammarly, show it your sentences, and ask: \"Do I have this wrong on 'Advanced false friends'? Explain why, don't just correct them for me.\"",
      "toolId": "grammarly"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Προχωρημένα False Friends» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Advanced false friends\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "efl-lyk.since-for-confusion": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Since vs For» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Μπερδεύει το «since» με το «for» σε προτάσεις διάρκειας, επειδή τα ελληνικά δεν κάνουν την ίδια διάκριση.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Since vs For\" and underline the spot where you feel unsure. The common trap here: Confuses 'since' with 'for' in duration sentences, because Greek doesn't make the same distinction.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Grammarly",
      "titleEn": "Ask Grammarly",
      "descriptionEl": "Άνοιξε το Grammarly, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Since vs For”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Grammarly, show it your sentences, and ask: \"Do I have this wrong on 'Since vs For'? Explain why, don't just correct them for me.\"",
      "toolId": "grammarly"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Since vs For» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Since vs For\" on your own, without any tool.",
      "toolId": null
    }
  ],
  "efl-lyk.preposition-collocation": [
    {
      "titleEl": "Γράψε τις δικές σου προτάσεις",
      "titleEn": "Write your own sentences",
      "descriptionEl": "Γράψε 3-4 δικές σου προτάσεις που χρησιμοποιούν «Collocations με προθέσεις» και υπογράμμισε το σημείο όπου νιώθεις αβεβαιότητα. Η συνηθισμένη παγίδα εδώ: Χρησιμοποιεί λάθος προθέσεις σε συνδυασμούς επιθέτου/ρήματος (π.χ. «interested for» αντί για «interested in»), λόγω μετάφρασης από τα ελληνικά.",
      "descriptionEn": "Write 3-4 of your own sentences using \"Preposition collocations\" and underline the spot where you feel unsure. The common trap here: Uses the wrong preposition in adjective/verb collocations (e.g. 'interested for' instead of 'interested in'), due to translation from Greek.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Grammarly",
      "titleEn": "Ask Grammarly",
      "descriptionEl": "Άνοιξε το Grammarly, δείξε του τις προτάσεις σου και ρώτα: «Έχω λάθος στο “Collocations με προθέσεις”; Εξήγησέ μου γιατί, μη μου τις διορθώσεις απλώς.»",
      "descriptionEn": "Open Grammarly, show it your sentences, and ask: \"Do I have this wrong on 'Preposition collocations'? Explain why, don't just correct them for me.\"",
      "toolId": "grammarly"
    },
    {
      "titleEl": "Ξαναγράψε τις προτάσεις σου",
      "titleEn": "Rewrite your sentences",
      "descriptionEl": "Ξαναγράψε τις προτάσεις του πρώτου βήματος σωστές, και φτιάξε μία ακόμα καινούρια πρόταση για «Collocations με προθέσεις» μόνος/η, χωρίς εργαλείο.",
      "descriptionEn": "Rewrite the sentences from step one correctly, then write one brand-new sentence for \"Preposition collocations\" on your own, without any tool.",
      "toolId": null
    }
  ],

  "math-a-gym.rational-number-order": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Διάταξη ρητών αριθμών» με το χέρι, γράφοντάς τους σε αριθμογραμμή. Η πιο συχνή παγίδα σε αυτό το θέμα: Δυσκολεύεται να συγκρίνει αρνητικούς με θετικούς αριθμούς, πιστεύοντας συχνά ότι το -8 είναι μεγαλύτερο από το -3.",
      "descriptionEn": "Solve 2-3 exercises on \"Ordering rational numbers\" by hand, placing them on a number line. The most common trap on this topic: Struggles to compare negative with positive numbers, often believing -8 is bigger than -3.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Διάταξη ρητών αριθμών”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Ordering rational numbers'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση με 4 ρητούς αριθμούς (θετικούς και αρνητικούς) και βάλ' τους σε σωστή σειρά χωρίς βοήθεια.",
      "descriptionEn": "Make up a brand-new exercise with 4 rational numbers (positive and negative) and put them in the correct order without help.",
      "toolId": null
    }
  ],

  "math-a-gym.absolute-value": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Απόλυτη τιμή» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Πιστεύει ότι η απόλυτη τιμή ενός αρνητικού αριθμού παραμένει αρνητική, αντί να καταλαβαίνει ότι είναι η απόστασή του από το μηδέν.",
      "descriptionEn": "Solve 2-3 exercises on \"Absolute value\" by hand, writing out every step. The most common trap on this topic: Believes the absolute value of a negative number stays negative, instead of understanding it's the distance from zero.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Απόλυτη τιμή”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Absolute value'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα άσκηση με απόλυτες τιμές θετικών και αρνητικών αριθμών και λύσε την χωρίς βοήθεια.",
      "descriptionEn": "Make up a brand-new exercise with absolute values of positive and negative numbers and solve it without help.",
      "toolId": null
    }
  ],

  "math-a-gym.gcd-lcm-confusion": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «ΜΚΔ vs ΕΚΠ» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Μπερδεύει τον Μέγιστο Κοινό Διαιρέτη (μικρότερος αριθμός) με το Ελάχιστο Κοινό Πολλαπλάσιο (μεγαλύτερος αριθμός).",
      "descriptionEn": "Solve 2-3 exercises on \"GCD vs LCM\" by hand, writing out every step. The most common trap on this topic: Confuses the Greatest Common Divisor (smaller number) with the Least Common Multiple (bigger number).",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “ΜΚΔ vs ΕΚΠ”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'GCD vs LCM'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η δύο ζευγάρια αριθμών και βρες το ΜΚΔ και το ΕΚΠ του καθενός χωρίς βοήθεια.",
      "descriptionEn": "Make up two pairs of numbers yourself and find the GCD and LCM of each without help.",
      "toolId": null
    }
  ],

  "math-a-gym.proportion-intro": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Εισαγωγή σε αναλογίες» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν καταλαβαίνει ότι σε μια αναλογία δύο κλάσματα είναι ίσα, και προσπαθεί να τη λύσει με τυχαία πράξη αντί για γινόμενο άκρων-μέσων.",
      "descriptionEn": "Solve 2-3 exercises on \"Introduction to proportions\" by hand, writing out every step. The most common trap on this topic: Doesn't understand that in a proportion two fractions are equal, and tries to solve it with a random operation instead of cross-multiplication.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Εισαγωγή σε αναλογίες”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Introduction to proportions'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Δείξε ότι το κατάλαβες",
      "titleEn": "Prove you've got it",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα αναλογία με άγνωστο όρο και λύσε την με γινόμενο άκρων-μέσων, χωρίς βοήθεια.",
      "descriptionEn": "Make up a new proportion with an unknown term and solve it using cross-multiplication, without help.",
      "toolId": null
    }
  ],

  "math-b-gym.monomial-like-terms": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Όμοιοι μονόμιοι όροι» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Προσπαθεί να προσθέσει μονώνυμα με διαφορετικό κύριο μέρος (π.χ. 3x + 2x²) σαν να ήταν όμοιοι όροι.",
      "descriptionEn": "Solve 2-3 exercises on \"Like monomial terms\" by hand, writing out every step. The most common trap on this topic: Tries to add monomials with a different variable part (e.g. 3x + 2x²) as if they were like terms.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Όμοιοι μονόμιοι όροι”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Like monomial terms'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα παράσταση με μονώνυμα, απλοποίησέ την με το χέρι, και μετά έλεγξε τη λύση σου στο Wolfram Alpha.",
      "descriptionEn": "Make up a new expression with monomials, simplify it by hand, then check your solution with Wolfram Alpha.",
      "toolId": "wolfram-alpha"
    }
  ],

  "math-b-gym.identity-square-sum": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Ταυτότητα (α+β)²» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Απλοποιεί λανθασμένα το (α+β)² σε α²+β², ξεχνώντας τον διπλό όρο 2αβ.",
      "descriptionEn": "Solve 2-3 exercises on the \"(a+b)² identity\" by hand, writing out every step. The most common trap on this topic: Incorrectly simplifies (a+b)² to a²+b², forgetting the middle term 2ab.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Ταυτότητα (α+β)²”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with the '(a+b)² identity'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Ανάπτυξε μόνος/η μια νέα παράσταση (α+β)² με το χέρι, και μετά έλεγξε τη λύση σου στο Wolfram Alpha.",
      "descriptionEn": "Expand a new (a+b)² expression by hand yourself, then check your solution with Wolfram Alpha.",
      "toolId": "wolfram-alpha"
    }
  ],

  "math-b-gym.pythagorean-application": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Εφαρμογή Πυθαγορείου θεωρήματος» με το χέρι, σχεδιάζοντας πρώτα το τρίγωνο. Η πιο συχνή παγίδα σε αυτό το θέμα: Δεν ξέρει ποια πλευρά είναι η υποτείνουσα σε ένα ορθογώνιο τρίγωνο, και συχνά προσθέτει τα τετράγωνα λάθος πλευρών.",
      "descriptionEn": "Solve 2-3 exercises on \"Applying the Pythagorean theorem\" by hand, drawing the triangle first. The most common trap on this topic: Doesn't know which side is the hypotenuse in a right triangle, and often adds the squares of the wrong sides.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Εφαρμογή Πυθαγορείου θεωρήματος”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Applying the Pythagorean theorem'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Σχεδίασε μόνος/η ένα νέο ορθογώνιο τρίγωνο με δικά σου μήκη, βρες την τρίτη πλευρά με το χέρι, και έλεγξε τη λύση σου στο Wolfram Alpha.",
      "descriptionEn": "Draw a new right triangle with your own side lengths, find the third side by hand, and check your solution with Wolfram Alpha.",
      "toolId": "wolfram-alpha"
    }
  ],

  "math-b-gym.linear-equation-basic": [
    {
      "titleEl": "Δοκίμασε πρώτα μόνος/η",
      "titleEn": "Try it yourself first",
      "descriptionEl": "Λύσε 2-3 ασκήσεις πάνω σε «Βασική εξίσωση 1ου βαθμού» με το χέρι, γράφοντας κάθε βήμα στο χαρτί σου. Η πιο συχνή παγίδα σε αυτό το θέμα: Όταν λύνει μια απλή εξίσωση, δεν εφαρμόζει την ίδια πράξη και στα δύο μέλη, χαλώντας την ισότητα.",
      "descriptionEn": "Solve 2-3 exercises on \"Basic first-degree equations\" by hand, writing out every step. The most common trap on this topic: When solving a simple equation, doesn't apply the same operation to both sides, breaking the equality.",
      "toolId": null
    },
    {
      "titleEl": "Ρώτα το Khanmigo",
      "titleEn": "Ask Khanmigo",
      "descriptionEl": "Άνοιξε το Khanmigo και πες: «Δυσκολεύομαι στο “Βασική εξίσωση 1ου βαθμού”. Κάνε μου ερωτήσεις για να καταλάβω μόνος/η, μη μου δώσεις έτοιμη λύση.» Λύσε μαζί του 2 νέες ασκήσεις με αυτόν τον τρόπο.",
      "descriptionEn": "Open Khanmigo and say: \"I'm struggling with 'Basic first-degree equations'. Ask me questions so I can figure it out myself, don't just hand me the answer.\" Work through 2 new exercises this way.",
      "toolId": "khanmigo"
    },
    {
      "titleEl": "Έλεγξε με το Wolfram Alpha",
      "titleEn": "Check with Wolfram Alpha",
      "descriptionEl": "Φτιάξε μόνος/η μια νέα εξίσωση 1ου βαθμού, λύσε την με το χέρι, και έλεγξε τη λύση σου στο Wolfram Alpha.",
      "descriptionEn": "Make up a new first-degree equation, solve it by hand, and check your solution with Wolfram Alpha.",
      "toolId": "wolfram-alpha"
    }
  ]
};
